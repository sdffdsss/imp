import React, { FC, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Tooltip, Button, Popconfirm, Space, Icon, Pagination, ProTable } from 'oss-ui';
import { TablePaginationConfig } from 'oss-ui/lib/table';
import { _ } from 'oss-web-toolkits';
import { usePersistFn, useUnmount } from 'ahooks';
import { produce } from 'immer';
import { customAlphabet } from 'nanoid';
import { useColumnsState } from '@Src/hooks';
import CommonWrapper from '@Pages/change-shifts-page/change-shifts/components/common-wrapper';
import EditableCell from './components/editable-cell';
import ColumnSetting from './components/column-setting';
import { IProps, RowAction, IAddNewAction, IEditAction } from './types';
import { defaultRefreshDataService, defaultColumns } from './default';
import { ResizeableTitle } from '../drag-table-header';
import SaveIcon from './img/sc1_u1173.png';
import { ReactComponent as RefreshSvg } from './img/u25.svg';
import { MARK_NEW_EMPTY_ROW_DATA, TEMP_FIELD_SUFFIX, actionMap, INDEX_COLUMN_DATAINDEX } from './constants';
import './index.less';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 15);

const Index: FC<IProps<any>> = forwardRef((props, ref) => {
    const {
        refreshDataService = defaultRefreshDataService,
        defaultPageSize = 5,
        columns: propsColumns = defaultColumns,
        rowActions = [],
        pattern = 'readonly',
        paginationPosition = ['topRight'],
        title,
        leftToolBarRender,
        toolBarRender,
        showNewEmptyRow = false,
        rowKey,
        autoRefreshSetting = {
            enable: false,
        },
        startRefreshData = true,
        dataSourceTransform = (data) => data,
        needIndexColumn = false,
        showRefreshButton = true,
        moduleId,
        onForceSelectRow,
        tableColumnSettingConfigType,
        actionWitdth = 100,
        titleSuffix,
        forceHideActionColumn,
        ...restTableProps
    } = props;
    const { value: columnsState, onChange: setColumnsState } = useColumnsState({ configType: tableColumnSettingConfigType });
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const paginationRef = useRef<TablePaginationConfig>({
        current: 1,
        pageSize: defaultPageSize,
        total: 0,
        position: paginationPosition,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20, 50, 100],
        showTotal: (total) => `共${total}条`,
    });
    const autoRefreshTimerRef = useRef<NodeJS.Timer>();
    const tableUidRef = useRef<string>(nanoid());

    const defaultColumnsMapRef = useRef<any>({});
    if (_.isEmpty(defaultColumnsMapRef.current) && !_.isEmpty(columnsState)) {
        defaultColumnsMapRef.current[tableUidRef.current] = _.cloneDeep(columnsState);
    }
    const isReadonlyPattern = pattern === 'readonly';
    const finalShowNewEmptyRow = !isReadonlyPattern && showNewEmptyRow;

    const isEditingEmptyRow = usePersistFn((record) => {
        return record.hasOwnProperty(MARK_NEW_EMPTY_ROW_DATA);
    });

    const isEditing = usePersistFn((record) => {
        return isEditingEmptyRow(record) || (editingKey && record[rowKey as string] === editingKey);
    });

    const getData = usePersistFn(() => {
        setLoading(true);

        const curPageSize = finalShowNewEmptyRow ? (paginationRef.current.pageSize || 5) - 1 : paginationRef.current.pageSize;
        refreshDataService({
            current: paginationRef.current.current,
            pageSize: curPageSize,
        }).then((res) => {
            if (res) {
                const { pagination = { total: 0 }, data } = res;

                if (Array.isArray(data)) {
                    const dataAfterTransform = data.map((item) => dataSourceTransform(item));
                    paginationRef.current.total = pagination.total;

                    if (finalShowNewEmptyRow) {
                        // @ts-ignore
                        const emptyRowPlaceholderData = propsColumns.reduce((accu, item) => {
                            return {
                                ...accu,
                                // @ts-ignore
                                [item.dataIndex]: '',
                                [MARK_NEW_EMPTY_ROW_DATA]: '',
                            };
                        }, {});

                        const totalPageNum = Math.ceil(paginationRef.current.total! / curPageSize!);

                        paginationRef.current.total! += totalPageNum;
                        paginationRef.current.showTotal = (total) => `共${total - totalPageNum}条`;

                        setDataSource([...dataAfterTransform, emptyRowPlaceholderData]);
                    } else {
                        paginationRef.current.showTotal = (total) => `共${total}条`;
                        setDataSource(dataAfterTransform);
                    }
                }
            }
            setLoading(false);
        });
    });

    function stopTimer() {
        if (autoRefreshTimerRef.current) {
            clearInterval(autoRefreshTimerRef.current);
        }
    }

    const initTimer = usePersistFn(() => {
        const { enable, interval } = autoRefreshSetting;
        if (enable) {
            stopTimer();
            autoRefreshTimerRef.current = setInterval(() => {
                getData();
            }, interval);
        }
    });

    function refreshDataAndInitTimer() {
        getData();
        initTimer();
    }

    const onActionClick = usePersistFn(async (record, action, e) => {
        e?.preventDefault();
        e?.stopPropagation();

        const { type: actionType, actionProps } = action;

        switch (actionType) {
            case 'edit':
                stopTimer();
                form.resetFields();
                form.setFieldsValue(record);
                if (actionProps.editMode === 'inline') {
                    setEditingKey(record[rowKey as string]);
                } else {
                    await actionProps.handleCustomEdit(record);
                    getData();
                }

                break;
            case 'delete':
                await actionProps.handleDelete(record);

                paginationRef.current.current = 1;
                getData();
                // 刷新
                break;
            case 'view':
                actionProps.handleView(record);
                break;
            default:
                break;
        }
    });

    const onEditSave = usePersistFn(async (record) => {
        const isEditingEmptyRowFlag = isEditingEmptyRow(record);
        try {
            const row = await form.getFieldsValue();

            const editData = _.pickBy(row, (value, key) => {
                const isTempField = _.endsWith(key, TEMP_FIELD_SUFFIX);

                return isEditingEmptyRowFlag ? isTempField : !isTempField;
            });

            if (isEditingEmptyRowFlag) {
                const nonSuffixData = Object.fromEntries(
                    Object.entries(editData).map(([key, value]) => {
                        return [key.replace(TEMP_FIELD_SUFFIX, ''), value];
                    }),
                );

                // @ts-ignore
                const addActionProps = rowActions.find((item) => item.type === RowAction.add)?.actionProps;
                await (addActionProps as IAddNewAction['actionProps'])?.handleAdd?.(nonSuffixData);

                paginationRef.current.current = 1;

                form.setFieldsValue(
                    Object.keys(record).reduce((accu, key) => {
                        return {
                            ...accu,
                            [`${key}${TEMP_FIELD_SUFFIX}`]: undefined,
                        };
                    }, {}),
                );
            } else {
                // @ts-ignore
                const editActionProps = rowActions.find((item) => item.type === RowAction.edit)?.actionProps;
                await (editActionProps as IEditAction['actionProps'])?.handleEditConfirm?.(Object.assign(record, editData));
            }

            refreshDataAndInitTimer();
            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    });

    useEffect(() => {
        function renderActionColumn() {
            if (rowActions.length === 0) {
                return [];
            }

            const viewActionItem = rowActions.find((item) => item.type === RowAction.view);

            function nonOnlyViewActionRender(record) {
                const isEditingStatus = isEditing(record);
                if (isEditingStatus) {
                    return (
                        <Tooltip title="保存">
                            <Button style={{ padding: 0 }} type="text" onClick={() => onEditSave(record)}>
                                <img src={SaveIcon} style={{ width: 14, height: 14 }} alt="" />
                            </Button>
                        </Tooltip>
                    );
                }
                return (
                    <Space>
                        {rowActions
                            // @ts-ignore
                            .filter((item) => item.type !== RowAction.add)
                            .map((item) => {
                                const itemInfo = actionMap[item.type];

                                if (item.type === 'delete') {
                                    return (
                                        <Popconfirm key={item.type} title="确认删除吗？" onConfirm={(e) => onActionClick(record, item, e)}>
                                            <Tooltip title={itemInfo.label} key={item.type}>
                                                <Button type="text" style={{ padding: 0 }}>
                                                    <Icon type={itemInfo.icon} antdIcon />
                                                </Button>
                                            </Tooltip>
                                        </Popconfirm>
                                    );
                                }

                                return (
                                    <Tooltip title={itemInfo.label} key={item.type}>
                                        <Button type="text" style={{ padding: 0 }} onClick={(e) => onActionClick(record, item, e)}>
                                            <Icon type={itemInfo.icon} antdIcon />
                                        </Button>
                                    </Tooltip>
                                );
                            })}
                    </Space>
                );
            }

            if (viewActionItem) {
                return {
                    dataIndex: 'action',
                    key: 'action',
                    title: '操作',
                    width: actionWitdth,
                    align: 'center',
                    render(text, record) {
                        if (isReadonlyPattern) {
                            const itemInfo = actionMap[RowAction.view];

                            return (
                                <Tooltip title={itemInfo.label}>
                                    <Button type="text" style={{ padding: 0 }} onClick={(e) => onActionClick(record, viewActionItem, e)}>
                                        <Icon type={itemInfo.icon} antdIcon />
                                    </Button>
                                </Tooltip>
                            );
                        }

                        return nonOnlyViewActionRender(record);
                    },
                };
            }

            if (isReadonlyPattern) {
                return [];
            }

            return {
                dataIndex: 'action',
                key: 'action',
                title: '操作',
                width: actionWitdth,
                align: 'center',
                fixed: 'right',
                render(text, record) {
                    return nonOnlyViewActionRender(record);
                },
            };
        }

        const tempColumns = propsColumns.map((col) => {
            if (!col.inlineEditProps?.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record) => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                    disabled: isReadonlyPattern,
                    inlineEditProps: col.inlineEditProps,
                    tableCompFunc: {
                        onForceSelectRow,
                    },
                }),
            };
        });

        const addActionColumns = tempColumns.concat(renderActionColumn());

        const indexColumn = {
            dataIndex: INDEX_COLUMN_DATAINDEX,
            title: '序号',
            align: 'center',
            width: 60,
            render(text, record, index) {
                return (Number(paginationRef.current.current || 1) - 1) * Number(paginationRef.current.pageSize || 0) + index + 1;
            },
        };
        const temp = needIndexColumn ? [indexColumn, ...addActionColumns] : addActionColumns;

        const temp1 = Object.entries(columnsState).filter((item) => temp.some((itemIn) => itemIn.dataIndex === item[0]));
        const showGroup = temp1.filter(([, value]) => !!value.show);
        const fixedRightGroup = showGroup.filter(([, value]) => value.fixed === 'right');

        const temp2 = temp.map((item, index) => {
            return {
                ...item,
                onHeaderCell: (column) => {
                    const curState = columnsState[column.dataIndex];
                    let isLastColumn = false;

                    if (!!curState?.show) {
                        if (curState?.fixed === 'right') {
                            isLastColumn = _.max(fixedRightGroup.map((itemIn) => itemIn[1].order)) === curState?.order;
                        } else if (fixedRightGroup.length === 0) {
                            isLastColumn = _.max(showGroup.map((itemIn) => itemIn[1].order)) === curState?.order;
                        }
                    }

                    return {
                        width: column.width,
                        onResize: (e, { size }) => {
                            const nextColumns = produce(columns, (draft) => {
                                // eslint-disable-next-line no-param-reassign
                                draft[index].width = size.width;
                            });
                            setColumns(nextColumns);
                        },
                        isLastColumn,
                    };
                },
            };
        });

        setColumns(temp2);
    }, [rowActions, propsColumns, needIndexColumn, onForceSelectRow, columnsState, editingKey]);

    useEffect(() => {
        if (startRefreshData) {
            refreshDataAndInitTimer();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pattern, showNewEmptyRow, startRefreshData]);

    useEffect(() => {
        if (pattern === 'readonly') {
            setEditingKey('');
        }
    }, [pattern]);

    useUnmount(() => {
        stopTimer();
    });

    const getEditingData = () => {
        const editingData = {};
        const tempData = {};
        const reg = new RegExp('TEMP');
        const value = form.getFieldsValue();

        Object.entries(value).forEach(([key, val]) => {
            if (!reg.test(key) && editingKey) {
                editingData[key] = val;
            } else {
                tempData[key.replace('_TEMP', '')] = val;
            }
        });

        return { editingKey, editingData, tempData };
    };

    useImperativeHandle(ref, () => {
        return {
            refreshData: refreshDataAndInitTimer,
            resetPaginationAndRefresh: () => {
                paginationRef.current.current = 1;
                refreshDataAndInitTimer();
            },
            editingData: getEditingData,
            refreshAll: () => {
                form.resetFields();
                refreshDataAndInitTimer();
                setEditingKey('');
            },
        };
    });

    function onPaginationChange(page, pageSize) {
        paginationRef.current.current = page;
        paginationRef.current.pageSize = pageSize;

        getData();
    }

    function handleColumnSettingChange(value) {
        setColumnsState(_.cloneDeep(value[tableUidRef.current]));
    }

    function calcTableScrollX() {
        return columns.reduce((accu, item) => {
            const isShow = columnsState[item.dataIndex]?.show;
            return accu + (isShow ? item.width : 0);
        }, 0);
    }

    if (tableColumnSettingConfigType && _.isEmpty(columnsState)) {
        return null;
    }

    return (
        <CommonWrapper
            moduleId={moduleId}
            title={title}
            titleSuffix={titleSuffix}
            extra={
                <Space>
                    {leftToolBarRender}
                    <Pagination {...paginationRef.current} onChange={onPaginationChange} />
                    {toolBarRender}
                    {showRefreshButton && (
                        <Button
                            className="refresh-text"
                            onClick={() => {
                                paginationRef.current.current = 1;
                                getData();
                            }}
                        >
                            <span className="refresh-icon">
                                <RefreshSvg />
                            </span>
                            刷新
                        </Button>
                    )}
                    {!!tableColumnSettingConfigType && (
                        <ColumnSetting
                            defaultColumnsMap={defaultColumnsMapRef.current}
                            allColumnsData={[
                                {
                                    id: tableUidRef.current,
                                    title,
                                    columns,
                                    columnState: columnsState,
                                },
                            ]}
                            onChange={handleColumnSettingChange}
                        >
                            <Button>
                                <Icon antdIcon type="SettingOutlined" />
                                列设置
                            </Button>
                        </ColumnSetting>
                    )}
                </Space>
            }
        >
            <Form form={form} component={false}>
                <ProTable
                    components={{
                        header: {
                            cell: ResizeableTitle,
                        },
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    columnsState={{
                        value:
                            forceHideActionColumn && columnsState.action
                                ? {
                                      ...columnsState,
                                      action: {
                                          ...columnsState.action,
                                          show: false,
                                      },
                                  }
                                : columnsState,
                    }}
                    search={false}
                    options={false}
                    scroll={{ x: calcTableScrollX() }}
                    loading={moduleId === 1 ? false : loading} // 网络故障工单取消loading
                    size="middle"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    rowKey={rowKey}
                    tableAlertRender={false}
                    {...restTableProps}
                />
            </Form>
        </CommonWrapper>
    );
});

export default Index;

export * from './types';
