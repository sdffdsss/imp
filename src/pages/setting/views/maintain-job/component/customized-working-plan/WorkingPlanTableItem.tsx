import React, { useEffect, useMemo, useRef } from 'react';
import { Typography, VirtualTable, Button, message } from 'oss-ui';
import cx from 'classnames';
import { useSize } from 'ahooks';
import { _ } from 'oss-web-toolkits';
import moment from 'moment';

import { TableProvider, useRootContext } from './context';
import { tableComponents } from './tableComponents';
import {
    isValueEqual,
    cellAlignment,
    editableColumnsMapping,
    ProjectTableColumnsSettings,
    defaultValue as PresetDefaultValue,
    calculateColWidth,
} from './presets';
import { saveCustomWorkingPlanRecordApi } from './api';

// eslint-disable-next-line
const formatColumns = (columns: any, actions = {}) => {
    return columns.map((col: any) => {
        const newCol = {
            ...col,
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
            onCell: (record: any, ...args: any[]) => {
                const { internalRecord, ...result } = col.onCell?.(record, ...args) ?? {};

                return {
                    ...result,
                    rowSpan: _.get(record, `cellProps.${col.dataIndex}.rowSpan`) ?? 1,
                    className: cx('table-cell-wrap', result.className),
                    internalRecord: {
                        ...(internalRecord ?? {}),
                        record,
                        col,
                        current: record[col.dataIndex],
                    },
                };
            },
        };

        if (!newCol.render) {
            Object.assign(newCol, {
                render: (valueObject: any) => {
                    return (
                        <div style={{ width: '100%', height: '100%', display: 'flex', ...cellAlignment(valueObject.cellStyle ?? {}) }}>
                            <div
                                className="table-cell-wrap"
                                style={{ wordBreak: 'break-all' }}
                                //  eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{ __html: valueObject.value || '-' }}
                            />
                        </div>
                    );
                },
            });
        }

        return newCol;
    });
};

const buildTableDataSourceWithProject = (project: any) => {
    const { titles: rawColumns, datas: rawDataSource, projectId } = project;

    const editableColumns = editableColumnsMapping[`${project.projectId}`] ?? [];

    const columns = [] as any[];
    const dataSource = [] as any[];

    // 实时数据字段
    let realTimeField = null as any;

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
                realTimeField = column;
            }

            // 特殊处理[时间点、时间、统计时间]列宽度
            if (['时间点', '时间', '统计时间'].some((v) => v === rawCol.titleName)) {
                Object.assign(column, { width: column.width ?? 150 });
            }

            const editableCol = editableColumns.find((d: any) => isValueEqual(d.dataIndex, rawCol.titleId));
            if (editableCol) {
                Object.assign(column, {
                    onCell: () => {
                        return {
                            editable: true,
                            internalRecord: {
                                project,
                                cellComponentType: editableCol.cellComponentType,
                            },
                        };
                    },
                });
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

        if (realTimeField && isValueEqual(projectId, '1')) {
            const realtimeRowItem = row[realTimeField.dataIndex];
            if (realtimeRowItem && realtimeRowItem.value === '实时') {
                row['4'].value = [''].includes(row['4'].value) || _.isNil(row['4'].value) ? moment().format('HH:mm').toString() : row['4'].value;
            }
            // console.log('log------------------', row);
        }

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
    const { groupInfo } = useRootContext();
    const latest = useRef({
        onCellSelectChange: props.onCellSelectChange,
    });
    latest.current = {
        ...latest.current,
        onCellSelectChange: props.onCellSelectChange,
    };

    const projectsRef = useRef<any>(null);

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

    const onCellValueChange = (cell) => {
        if (!projectsRef.current) {
            projectsRef.current = _.cloneDeep(props.project);
        }

        const { newValueObject } = cell;
        const hit = projectsRef.current.datas.find((row) =>
            row.some((d) => isValueEqual(d.rowId, newValueObject.rowId) && isValueEqual(d.titleId, newValueObject.titleId)),
        );

        if (hit) {
            hit.forEach((d) => {
                if (isValueEqual(d.rowId, newValueObject.rowId) && isValueEqual(d.titleId, newValueObject.titleId)) {
                    Object.assign(d, newValueObject);
                }
            });
        }

        const { projects } = props;
        const currentProject = projectsRef.current;

        const projectIndex = props.projects.findIndex((p: any) => p.projectId === currentProject.projectId);
        if (projectIndex > -1) {
            projects[projectIndex] = projectsRef.current;
        }
    };

    const onSave = () => {
        const { projects } = props;
        const currentProject = projectsRef.current;

        // const projectIndex = props.projects.findIndex((p: any) => p.projectId === currentProject.projectId);
        // if (projectIndex > -1) {
        //     projects[projectIndex] = projectsRef.current;
        // }

        // console.log('log--------------------', projects);

        saveCustomWorkingPlanRecordApi({
            projects: projects.filter((p: any) => p.projectId === currentProject.projectId),
            ..._.pick(groupInfo, ['provinceId', 'groupId', 'workShiftId', 'workingPlanId', 'dateTime']),
        }).then((saveInfo) => {
            if (saveInfo.status === 'success') {
                message.success('保存成功');
            }
        });
    };

    const tableRootRef = useRef<any>(null);

    useEffect(() => {
        if (_.isNil(tableRootRef.current) || _.isEmpty(props.dataSource) || props.editable) {
            return;
        }

        const tbody = tableRootRef.current!.querySelector('tbody') as HTMLElement;
        if (tbody) {
            tbody.querySelectorAll('tr.oss-ui-table-row').forEach((el: any) => {
                if (el) {
                    // eslint-disable-next-line no-param-reassign
                    el.style.height = `70px`;
                }
            });
        }
    }, [props.dataSource, props.editable]);

    return (
        <div className="customized-working-plan-item">
            <div data-width-watcher="true" ref={rootRef} style={{ width: '100%', height: 0.1 }} />
            <div className="customized-working-plan-title">
                <Typography.Title level={5} style={{ textAlign: 'center' }}>
                    {props.title}
                </Typography.Title>
            </div>
            <div className="customized-working-plan-table" ref={tableRootRef}>
                <TableProvider onCellValueChange={onCellValueChange} editable={props.editable}>
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
                        rowClassName={() => 'editable-row'}
                        components={tableComponents}
                    />
                </TableProvider>
                {props.editable && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, marginRight: 10 }}>
                        <Button type="primary" disabled={!props.editable} onClick={onSave}>
                            保存
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export {
    //
    WorkingPlanTableItem,
    formatColumns,
    buildTableDataSourceWithProject,
};
