// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { Button, Form } from 'oss-ui';
import { useHistory } from 'react-router-dom';
import { getCallTestRecordTableColumns, getCallTestRecord, setCallTestRecord } from './api';
import PageContainer from '@Components/page-container';
import useLoginInfoModel from '@Src/hox';
import GlobalMessage from '@Src/common/global-message';
import { sendLogFn } from '@Pages/components/auth/utils';

import './index.less';

type DataSourceType = {
    zone_id: number | string;
    zone_name: string;
    [key: string]: any;
};

export default () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
    const [columns, setColumns] = useState<ProColumns<DataSourceType>[]>([]);

    const history = useHistory();

    const changedListRef = useRef([]);
    const actionRef: any = useRef();

    const [editableFormRef] = Form.useForm();

    const { userId } = useLoginInfoModel();
    const { search } = window.location;
    const searchParams = new URLSearchParams(search);
    let isEdit = searchParams.get('edit') === 'false';

    const onValuesChange = useCallback(
        (record: DataSourceType, recordList: DataSourceType[]) => {
            // 数据发生变化时,将变化的数据保存到changedListRef中
            const prevRecord = dataSource.find((item) => item.zone_id === record.zone_id);
            const recordKeys = Object.keys(record);
            if (prevRecord) {
                const changedList = recordKeys.reduce((prev, cur) => {
                    const changedValue = {
                        provinceId: record.zone_id,
                        userId,
                    };
                    if (prevRecord[cur] !== record[cur]) {
                        changedValue['recordDate'] = cur;
                        changedValue['recordContent'] = record[cur];
                        return prev.concat(changedValue);
                    }
                    return prev;
                }, [] as any);

                changedListRef.current = changedListRef.current
                    .filter((item: any) => {
                        const hasRecord = changedList.some((data) => {
                            return data.provinceId === item.provinceId && data.recordDate === item.recordDate;
                        });
                        return !hasRecord;
                    })
                    .concat(changedList);
            }
        },
        [dataSource],
    );
    const watchTabActiveChange = () => {
        GlobalMessage.off('activeChanged', null, null);
        GlobalMessage.on(
            'activeChanged',
            ({ isActive }) => {
                if (isActive) {
                    const { search: newSearch } = window.location;
                    const newSearchParams = new URLSearchParams(newSearch);
                    const newIsEdit = newSearchParams.get('edit') === 'false';
                    if (newIsEdit !== isEdit) {
                        isEdit = newIsEdit;
                    }
                }
            },
            null,
        );
    };

    const getCallTestRecordData = () => {
        return getCallTestRecord().then((res) => {
            if (res && res.data) {
                setDataSource(res.data);
                return res;
            }
        });
    };

    useEffect(() => {
        if (dataSource.length > 0) {
            setEditableRowKeys(dataSource.map((item) => item.zone_id));
        }
    }, [dataSource]);

    const onSave = () => {
        sendLogFn({ authKey: 'workbench-Workbench-CallTestingRecord-Save' });
        setCallTestRecord(changedListRef.current).then((res) => {
            if (res) {
                actionRef?.current?.reload();
            }
        });
    };

    const onBack = () => {
        history.goBack();
    };
    const init = () => {
        const getTemporaryRouteData = async () => {
            const res = await getCallTestRecordTableColumns();
            const firstColumn: ProColumns<DataSourceType>[] = [
                {
                    title: '',
                    valueType: 'text',
                    dataIndex: 'zone_name',
                    width: 90,
                    readonly: true,
                    fixed: 'left',
                    align: 'center',
                },
                {
                    title: '',
                    valueType: 'text',
                    dataIndex: 'zone_id',
                    hideInTable: true,
                },
            ];

            const columnsData = res.data.map((item) => {
                return {
                    title: item.value,
                    dataIndex: item.key,
                    width: 100,
                    fieldProps: {
                        bordered: false,
                        placeholder: '',
                        maxLength: 200,
                        allowClear: false,
                    },
                    align: 'center',
                    valueType: 'text',
                };
            });
            setColumns(firstColumn.concat(columnsData));
        };
        getTemporaryRouteData();
    };

    useEffect(() => {
        watchTabActiveChange();
        init();
    }, []);

    return (
        <PageContainer
            title={<span className="call-test-record-header-title">拨测记录</span>}
            extra={
                <>
                    <Button type="primary" disabled={isEdit} onClick={onSave} style={{ marginLeft: 20 }}>
                        保存
                    </Button>
                    {/* <Button onClick={onBack} style={{ marginLeft: 20 }}>
                        返回
                    </Button> */}
                </>
            }
        >
            {columns.length > 0 && (
                <EditableProTable<DataSourceType>
                    className="call-test-record-table"
                    headerTitle=""
                    columns={columns}
                    rowKey="zone_id"
                    scroll={{
                        x: 960,
                        y: 'calc(100vh - 220px)',
                    }}
                    bordered
                    // options={{
                    //     reload: true,
                    //     density: true,
                    //     setting: true,
                    // }}
                    actionRef={actionRef}
                    // value={dataSource as any}
                    request={getCallTestRecordData}
                    recordCreatorProps={false}
                    editable={
                        isEdit
                            ? false
                            : {
                                  type: 'multiple',
                                  editableKeys,
                                  onValuesChange,
                                  //行数据被修改的时候触发
                                  // onChange: (editableKeys, editableRows) => {
                                  // setEditableRowKeys(editableKeys);
                                  // },
                                  form: editableFormRef,
                              }
                    }
                />
            )}
        </PageContainer>
    );
};
