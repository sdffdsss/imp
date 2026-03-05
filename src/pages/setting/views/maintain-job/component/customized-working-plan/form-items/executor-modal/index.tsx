import React, { useEffect, useMemo, useRef, useState } from 'react';
import { _ } from 'oss-web-toolkits';
import { Icon, Input, Modal, Space, Table } from 'oss-ui';
import CustomModalFooter from '@Src/components/custom-modal-footer';

import { useRootContext, useTableContext } from '../../context';
import { cellAlignment } from '../../presets';

const ExecutorModalImp = (props) => {
    const { groupUsers } = useRootContext();
    const { onCellValueChange, state: tableState } = useTableContext();

    const isEditingExecutorRowRef = useRef<any>({ executorArray: [] });

    const [modalVisible, setModalVisible] = useState(false);
    const [displayList, setDisplayList] = useState<any[] | null>(null);
    const [showGroupUsers, setShowGroupUsers] = useState<any[]>([]);

    useEffect(() => {
        const ref = isEditingExecutorRowRef;
        return () => {
            ref.current = { executorArray: [] };
        };
    }, []);

    useEffect(() => {
        if (!modalVisible) {
            setShowGroupUsers(groupUsers);
        }
    }, [groupUsers, modalVisible]);

    function handleOk() {
        const nextValue = [...isEditingExecutorRowRef.current.executorArray];

        setDisplayList(nextValue);
        setModalVisible(false);
        onCellValueChange({
            value: nextValue,
            info: props.record?.raw,
            newValueObject: {
                ..._.cloneDeep(props.record?.raw?.current ?? {}),
                showConfig: nextValue.map((d) => _.pick(d, ['mainName', 'mainId', 'mainTel'])),
            },
        });
    }

    function handlePressEnter(event) {
        if (!event.target.value) {
            setShowGroupUsers(groupUsers);
        } else {
            const filteredGroupUsers = groupUsers.filter((item) => {
                return item.mainTel?.includes(event.target.value) || item.mainName?.includes(event.target.value);
            });
            setShowGroupUsers(filteredGroupUsers);
        }
    }

    const dataSource = useMemo(() => {
        if (_.isEmpty(showGroupUsers)) return groupUsers;
        return showGroupUsers;
    }, [groupUsers, showGroupUsers]);

    const list = useMemo(() => {
        let result = [] as any[];
        if (displayList !== null) {
            result = displayList;
        } else {
            const valueObject = _.get(props.record ?? {}, 'raw.current');
            const recordList = _.isArray(valueObject.showConfig) ? valueObject.showConfig : [valueObject.showConfig];
            result = recordList;
        }

        // 非空判断???
        result = result.filter((item) => !_.isEmpty(item));

        if (modalVisible) {
            isEditingExecutorRowRef.current.executorArray = result;
        }

        return result.filter(Boolean);
    }, [props.record, displayList, modalVisible]);

    return (
        <>
            <div
                style={{ width: '100%' }}
                onClick={() => {
                    setModalVisible(true);
                }}
            >
                {_.isEmpty(list) ? (
                    <span>-</span>
                ) : (
                    <Space wrap style={{ width: '100%', ...cellAlignment(props.record?.cellStyle) }} size={5}>
                        {list.map((val: any, index: any) => {
                            // eslint-disable-next-line react/no-array-index-key
                            // return <Tag key={`key_${val.mainName}_${index}`}>{val.mainName}</Tag>;

                            return (
                                <div
                                    className="executors-item"
                                    style={{
                                        color: '#1890ff',
                                        fontSize: '12px',
                                        padding: '0 4px',
                                        lineHeight: '20px',
                                        margin: '0 2px 2px',
                                        backgroundColor: 'rgba(140,185,237,0.15)',
                                    }}
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={`key_${val.mainName}_${val.mainId}_${index}`}
                                >
                                    {val.mainName ?? '-'}
                                </div>
                            );
                        })}
                    </Space>
                )}
            </div>
            {tableState.editable && (
                <Modal
                    visible={modalVisible}
                    title="选择执行人"
                    width={300}
                    bodyStyle={{ height: 380, padding: '5px 10px' }}
                    onCancel={() => {
                        isEditingExecutorRowRef.current = { executorArray: [] };
                        setModalVisible(false);
                        setShowGroupUsers([]);
                    }}
                    destroyOnClose
                    maskClosable={false}
                    footer={
                        <CustomModalFooter
                            onCancel={() => {
                                isEditingExecutorRowRef.current = { executorArray: [] };
                                setModalVisible(false);
                                setShowGroupUsers([]);
                            }}
                            onOk={handleOk}
                        />
                    }
                >
                    <div style={{ border: '1px solid #d9d9d9', padding: '10px', height: '100%' }}>
                        <Input
                            prefix={<Icon type="SearchOutlined" antdIcon />}
                            style={{ width: '100%', marginBottom: '10px' }}
                            placeholder="请输入搜索内容"
                            allowClear
                            onPressEnter={handlePressEnter}
                        />
                        <Table
                            size="small"
                            rowKey="mainId"
                            style={{ padding: '0' }}
                            scroll={{ y: 290 }}
                            dataSource={dataSource}
                            pagination={false}
                            columns={[
                                {
                                    title: '姓名',
                                    dataIndex: 'mainName',
                                },
                                {
                                    title: '电话',
                                    dataIndex: 'mainTel',
                                    ellipsis: true,
                                },
                            ]}
                            rowSelection={{
                                defaultSelectedRowKeys: (isEditingExecutorRowRef.current?.executorArray || []).map((item) => item?.mainId),
                                onChange: (selectedRowKeys, selectedRows) => {
                                    const temp = _.differenceBy(isEditingExecutorRowRef.current.executorArray ?? [], dataSource, 'mainId');
                                    isEditingExecutorRowRef.current.executorArray = [...temp, ...selectedRows];
                                },
                            }}
                        />
                    </div>
                </Modal>
            )}
        </>
    );
};

export const ExecutorModal = (props: any) => {
    const memoRef = useRef({ record: null });
    const latest = useRef({ onChange: props.onChange });
    latest.current = {
        ...latest.current,
        onChange: props.onChange ?? _.noop,
    };

    const memoRecord = useMemo(() => {
        if (!_.isEqual(memoRef.current.record, props.record)) {
            memoRef.current.record = _.cloneDeep(props.record);
        }
        return memoRef.current.record;
    }, [props.record]);

    return useMemo(() => <ExecutorModalImp onChange={(args) => latest.current.onChange(...args)} record={memoRecord} />, [memoRecord]);
};
