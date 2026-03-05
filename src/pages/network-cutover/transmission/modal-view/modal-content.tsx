import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef } from 'react';
import { Modal, message, Tooltip, Button, Icon, Form, Input, DatePicker, Select, Row, Col, ProTable } from 'oss-ui';
import type { IModalContentProps } from './types';
import useLoginInfoModel from '@Src/hox';
import ViewEdit from './view-edit';
import { selectAlarmView, deleteAlarmView } from '../../api';

import './index.less';

export default forwardRef((props: IModalContentProps, ref) => {
    const [visible, setVisible] = useState(false);
    const [editType, setEditType] = useState('new');
    const [initialValues, setInitialValues] = useState(null);
    const paginationRef = useRef({ current: 1, pageSize: 10 });
    const tableRef = useRef();

    const getList = async (params) => {
        const allParams = {
            ...params,
        };
        const res = await selectAlarmView({ ...allParams });
        if (res.code === 200) {
            return {
                data: res.data || [],
                success: true,
                total: res.total,
            };
        }
        return {
            data: [],
            success: false,
            total: 0,
        };
    };
    const editClick = (row) => {
        setEditType('edit');
        setInitialValues(row);
        setVisible(true);
    };
    const deleteClick = (row) => {
        Modal.confirm({
            title: '提示',
            content: '是否确认删除?',
            onOk: async () => {
                try {
                    const res = await deleteAlarmView({ id: row?.id });
                    if (res.code === 200) {
                        message.success('删除成功');
                        tableRef.current?.reload();
                    } else {
                        message.error('删除失败');
                    }
                } catch {
                    message.error('接口错误');
                }
            },
            onCancel() {},
        });
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <Button
                    type="primary"
                    onClick={() => {
                        setInitialValues(null);

                        setEditType('new');
                        setVisible(true);
                    }}
                >
                    新增视图
                </Button>
            </div>
            <ProTable
                // style={{ padding: '0' }}
                size="small"
                request={getList}
                pagination={{
                    defaultPageSize: 10,
                }}
                bordered
                actionRef={tableRef}
                className="view-manage-prtable"
                toolBarRender={undefined}
                options={false}
                search={false}
                columns={[
                    {
                        dataIndex: 'viewName',
                        title: '视图名称',
                        align: 'center',
                        hideInSearch: true,
                        width: 400,
                        ellipsis: true,
                    },
                    {
                        dataIndex: 'creator',
                        title: '创建人',
                        align: 'center',
                        hideInSearch: true,
                    },
                    {
                        dataIndex: 'createTime',
                        title: '创建时间',
                        align: 'center',
                        hideInSearch: true,
                    },
                    {
                        dataIndex: 'name3',
                        title: '操作',
                        align: 'center',
                        hideInSearch: true,
                        render(_, row) {
                            return (
                                <>
                                    <Tooltip title="编辑" key="edit">
                                        <Button type="text" onClick={() => editClick(row)} disabled={row.isDefault === 1}>
                                            <Icon antdIcon type="EditOutlined" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="删除" key="delete">
                                        <Button type="text" onClick={() => deleteClick(row)} disabled={row.isDefault === 1}>
                                            <Icon antdIcon type="DeleteOutlined" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="查看" key="show">
                                        <Button
                                            type="text"
                                            onClick={() => {
                                                setEditType('view');
                                                setInitialValues(row);
                                                setVisible(true);
                                            }}
                                        >
                                            <Icon antdIcon type="SearchOutlined" />
                                        </Button>
                                    </Tooltip>
                                </>
                            );
                        },
                    },
                ]}
            />
            <ViewEdit
                visible={visible}
                mode={editType}
                onCancel={() => setVisible(false)}
                width={1000}
                bodyStyle={{ padding: '16px 16px 0' }}
                title={editType === 'new' ? '新增视图' : '编辑视图'}
                contentProps={{ initialValues }}
                destroyOnClose
                okButtonProps={{ style: { display: editType === 'view' ? 'none' : 'block' } }}
                cancelText={editType === 'view' ? '关闭' : '取消'}
                onOk={(e, res) => {
                    console.log('res :>> ', res);
                    if (res.code === 200) {
                        setVisible(false);
                        tableRef.current?.reload();
                    }
                }}
            />
        </>
    );
});
