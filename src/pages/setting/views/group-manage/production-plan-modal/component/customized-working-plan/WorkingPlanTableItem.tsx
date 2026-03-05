import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSize } from 'ahooks';
import { VirtualTable, Typography, Space, Tag, Select } from 'oss-ui';
import cx from 'classnames';

import { _ } from 'oss-web-toolkits';
import {
    isValueEqual,
    ValueShowType,
    cellAlignment,
    ProjectTableColumnsSettings,
    defaultValue as PresetDefaultValue,
    calculateColWidth,
    cellTextStyle,
} from './presets';

const StateSymbol = Symbol('state');

const formatColumns = (columns: any, actions: { onCellSelectChange: any }) => {
    return columns.map((col: any) => {
        const newCol = {
            ...col,
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
            onCell: (record: any, ...args: any[]) => {
                const result = col.onCell?.(record, ...args) ?? {};
                return {
                    ...result,
                    rowSpan: _.get(record, `cellProps.${col.dataIndex}.rowSpan`) ?? 1,
                    className: cx('table-cell-wrap', result.className),
                };
            },
        };

        if (!newCol.render) {
            Object.assign(newCol, {
                render: (valueObject: any) => {
                    if (isValueEqual(valueObject.showType, ValueShowType.RawValue) || isValueEqual(valueObject.showType, ValueShowType.CurrentTime)) {
                        return (
                            <div style={{ width: '100%', height: '100%', display: 'flex', ...cellAlignment(valueObject.cellStyle ?? {}) }}>
                                <div
                                    className="table-cell-wrap"
                                    style={{ wordBreak: 'break-all', ...cellTextStyle(valueObject.cellStyle ?? {}) }}
                                    //  eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{ __html: valueObject.value }}
                                />
                            </div>
                        );
                    }

                    if (isValueEqual(valueObject.showType, ValueShowType.Tags)) {
                        const list = _.isArray(valueObject.showConfig) ? valueObject.showConfig : [valueObject.showConfig];
                        return (
                            <Space style={{ width: '100%' }} wrap>
                                {list.filter(Boolean).map((val: any, index: any) => {
                                    // eslint-disable-next-line react/no-array-index-key
                                    return <Tag key={`key_${val.mainName}_${index}`}>{val.mainName}</Tag>;
                                })}
                            </Space>
                        );
                    }

                    if (isValueEqual(valueObject.showType, ValueShowType.Select)) {
                        const select = _.get(valueObject, 'showConfig.0') ?? {};

                        const defaultValue = select.result;
                        const options = select.value.map((value) => ({ value, label: value }));

                        return (
                            <Select
                                //
                                bordered={false}
                                defaultValue={defaultValue}
                                options={options}
                                style={{ width: '100%' }}
                                onChange={(value) => {
                                    if (_.isFunction(actions.onCellSelectChange)) {
                                        actions.onCellSelectChange(value, valueObject.raw);
                                    }
                                }}
                            />
                        );
                    }

                    if (isValueEqual(valueObject.showType, ValueShowType.ALlWorkShiftUsers)) {
                        const list = _.isArray(valueObject.showConfig) ? valueObject.showConfig : [valueObject.showConfig];
                        return (
                            <Space style={{ width: '100%' }} wrap>
                                {list.filter(Boolean).map((val: any, index: any) => {
                                    // eslint-disable-next-line react/no-array-index-key
                                    return <Tag key={`key_${val.mainName}_${index}`}>{val.mainName}</Tag>;
                                })}
                            </Space>
                        );
                    }

                    return <span>未知类型</span>;
                },
            });
        }

        return newCol;
    });
};

const applyDataSourceRowSpan = (
    dataSource: Array<any>,
    rowSpanSettings: Array<{
        dataIndex: any; // 列字段
        value?: any; // 单元格值
        rowKeys?: any[]; // 合并包含的行key
        rowSpan: number; // 合并行数
        [key: string]: any;
    }>,
) => {
    if (_.isEmpty(dataSource) || _.isEmpty(rowSpanSettings)) return dataSource;

    const processedData = [] as any;

    const applyRowSpan = (row: any, rowSpanSetting: any) => {
        const item = row;
        const setting = rowSpanSetting;

        let enableRowSpan = 'rowKeys' in setting ? (setting.rowKeys ?? []).includes(item.key) : true;

        if ('value' in setting) {
            const rowValue = item[setting.dataIndex];
            const rowValueStringify = JSON.stringify({ value: rowValue });
            const isEqualValue = rowValueStringify === setting.value || rowValue === setting.value;
            enableRowSpan = enableRowSpan && isEqualValue;
        }
        if (enableRowSpan) {
            item.cellProps[setting.dataIndex] = {
                ...item.cellProps[setting.dataIndex],
                rowSpan: setting[StateSymbol].count % setting.rowSpan === 0 ? setting.rowSpan : 0,
            };
            setting[StateSymbol].count++;
        }
    };

    type TColSetting = (typeof rowSpanSettings)[0] & { [key: symbol]: any };
    rowSpanSettings.forEach((colSetting) => {
        const col: TColSetting = colSetting;
        col[StateSymbol] = col[StateSymbol] || (col[StateSymbol] = { count: 0 });

        if (!_.isEmpty(col.rowKeys) && col.rowSpan !== col.rowKeys!.length) {
            col.rowSpan = col.rowKeys!.length ?? col.rowSpan;
        }

        (_.isEmpty(processedData) ? dataSource : processedData).forEach((item: any) => {
            let row = item;
            if (!row.cellProps) {
                row = { ...row };
                row.cellProps = {};
                processedData.push({ ...row });
            }

            if (!row.cellProps[col.dataIndex]) {
                row.cellProps[col.dataIndex] = {};
            }

            applyRowSpan(row, col);
        });
    });

    return processedData;
};

const buildDataSourceWithRowSpan = (dataSource: any, columns: any) => {
    if (_.isEmpty(dataSource) || _.isEmpty(columns)) return dataSource;

    const rowSpanSettings = [] as any;

    let runtimeDataSource = null as any;
    columns.forEach((col: any) => {
        const temp = [] as any;
        // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-unused-vars
        const calculateRowSpan = (dataSource: any, parentGroup: any = null) => {
            const group = _.groupBy(dataSource, col.dataIndex);
            Object.entries(group).forEach(([groupName, groupList]) => {
                const current = { value: groupName, dataIndex: col.dataIndex, rowSpan: groupList.length };
                rowSpanSettings.push({
                    value: JSON.stringify({ value: groupName }),
                    dataIndex: col.dataIndex,
                    rowSpan: groupList.length,
                    rowKeys: groupList.map((d: any) => d.key),
                });
                temp.push({ dataSource: groupList, group: current });
            });
        };

        if (runtimeDataSource) {
            runtimeDataSource.forEach((item: any) => {
                calculateRowSpan(item.dataSource, item.group);
            });
        } else {
            calculateRowSpan(dataSource);
        }

        runtimeDataSource = temp;
    });
    return applyDataSourceRowSpan(dataSource, rowSpanSettings);
};

const buildTableDataSourceWithProject = (project: any) => {
    const { titles: rawColumns, datas: rawDataSource } = project;

    const columns = [] as any[];
    const dataSource = [] as any[];

    rawColumns
        .sort((a, b) => a.titleIndex - b.titleIndex)
        .forEach((rawCol: any) => {
            const column: any = {
                dataIndex: `${rawCol.titleId}`,
                key: rawCol.titleId,
                title: rawCol.titleName,
                rawCol,
            };

            // 支持服务端配置列宽度
            if ('width' in rawCol) {
                Object.assign(column, { width: rawCol.width });
            }

            // 特殊处理[班次]列宽度
            if (rawCol.titleName === '班次') {
                Object.assign(column, { width: column.width ?? 80 });
            }

            // 特殊处理[时间点、时间、统计时间]列宽度
            if (['时间点', '时间', '统计时间'].some((v) => v === rawCol.titleName)) {
                Object.assign(column, { width: column.width ?? 130 });
            }

            columns.push(column);
        });

    const columnsSetting = {} as any;

    rawDataSource.forEach((rawRow: any) => {
        const row = rawRow.reduce((result: any, item: any) => {
            const dataIndex = item.titleId;

            Object.assign(result, {
                [`${dataIndex}`]: {
                    value: item.value,
                    showType: item.showType,
                    showConfig: item.showConfig,
                    cellStyle: {
                        horizonAlign: item.hAlign,
                        verticalAlign: item.vAlign,
                    },
                    raw: {
                        current: item,
                        row: rawRow,
                        project,
                    },
                },
            });

            let colSetting = columnsSetting[`col-${dataIndex}`] as any;
            if (_.isEmpty(colSetting)) {
                // eslint-disable-next-line no-multi-assign
                colSetting = columnsSetting[`col-${dataIndex}`] = { rowSpan: 0 };
            }

            // eslint-disable-next-line no-param-reassign
            result.cellProps = {
                ...(result.cellProps ?? {}),
                [`${dataIndex}`]: {
                    get rowSpan() {
                        return item.valueType === 1 ? colSetting.rowSpan : 0;
                    },
                },
            };

            if (item.valueType === 1) {
                // eslint-disable-next-line no-multi-assign
                colSetting = columnsSetting[`col-${dataIndex}`] = { rowSpan: 1 };
            } else {
                colSetting.rowSpan += 1;
            }

            return result;
        }, {} as any);

        row.rawRow = rawRow;

        row['key'] = rawRow[0].rowId;
        dataSource.push(row);
    });

    return {
        columns,
        dataSource,
        project,
    };
};

const WorkingPlanTableItem = (props: any & { onCellSelectChange?: any }) => {
    const rootRef = useRef(null);
    const size = useSize(rootRef);

    const [tableRootRef, setTableRootRef] = useState<any>(null);

    const latest = useRef({
        onCellSelectChange: props.onCellSelectChange,
    });
    latest.current = {
        ...latest.current,
        onCellSelectChange: props.onCellSelectChange,
    };

    const projectId = _.get(props, 'project.projectId');
    const presetsColumns: any = useMemo(() => {
        return ProjectTableColumnsSettings.find((d) => isValueEqual(d.projectId, projectId)) ?? PresetDefaultValue.EMPTY_OBJECT;
    }, [projectId]);

    const columns = useMemo(() => {
        const result = formatColumns(props.columns, {
            get onCellSelectChange() {
                return latest.current.onCellSelectChange;
            },
        });

        if (_.isArray(result) && !_.isNil(size.width)) {
            result.forEach((col, colIndex) => {
                const presetCol = presetsColumns.columns[colIndex] ?? null;
                if (!('width' in col.rawCol) && !_.isNil(presetCol)) {
                    Object.assign(col, { width: calculateColWidth(presetCol, col, size.width!) });
                }
            });
        }

        return result;
    }, [props.columns, presetsColumns, size.width]);

    useEffect(() => {
        if (_.isNil(tableRootRef) || _.isEmpty(props.dataSource)) {
            return;
        }

        const tbody = tableRootRef!.querySelector('tbody') as HTMLElement;
        if (tbody) {
            tbody.querySelectorAll('tr.oss-ui-table-row').forEach((el: any) => {
                if (el) {
                    // eslint-disable-next-line no-param-reassign
                    el.style.height = `70px`;
                }
            });
        }
    }, [tableRootRef, props.dataSource]);

    return (
        <div className="customized-working-plan-item">
            <div data-width-watcher="true" ref={rootRef} style={{ width: '100%', height: 0.1 }} />
            {!_.isNil(size.width) && (
                <>
                    <div className="customized-working-plan-title">
                        <Typography.Title level={5} style={{ textAlign: 'center' }}>
                            {props.title}
                        </Typography.Title>
                    </div>
                    <div className="customized-working-plan-table" ref={(ref) => setTableRootRef(ref)}>
                        <VirtualTable
                            // @ts-ignore
                            rowKey="key"
                            size="small"
                            global={window}
                            columns={columns}
                            dataSource={props.dataSource}
                            search={false}
                            onReset={false}
                            bordered
                            options={false}
                            tableAlertRender={false}
                            pagination={false}
                            renderEmpty={<div>没有满足条件的数据</div>}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export {
    //
    WorkingPlanTableItem,
    formatColumns,
    buildDataSourceWithRowSpan,
    applyDataSourceRowSpan,
    buildTableDataSourceWithProject,
};
