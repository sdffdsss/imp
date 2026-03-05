import { Button, Modal, ProTable, Space } from 'oss-ui';
import React from 'react';
import './index.less';
import { getGroupList } from '../../api';
type Props = {
    visible: boolean;
    okCallBack?: () => {};
};

export default function ChoseModal(props: Props) {
    const { visible, okCallBack } = props;
    const handleOk = () => {
        okCallBack && okCallBack();
    };
    const columns: any = [
        {
            title: '班组名称',
            dataIndex: 'groupTypeName',
            fixed: 'left',
            name: 'groupTypeName',
            key: 'groupTypeName',
        },
        {
            title: '归属省份',
            dataIndex: 'groupTypeName',
            fixed: 'left',
        },
        {
            title: '归属监控中心',
            dataIndex: 'groupTypeName',
            fixed: 'left',
        },
        {
            title: '创建人',
            dataIndex: 'groupTypeName',
            fixed: 'left',
        },
        {
            title: '创建时间',
            dataIndex: 'groupTypeName',
            fixed: 'left',
        },
        // {
        //     title: '操作',
        //     width: 80,
        //     key: 'option',
        //     valueType: 'option',
        //     fixed: 'right',
        //     render: () => [<a key="link">链路</a>],
        // },
    ];

    const GetGroupList = async (params) => {
        const res = await getGroupList(params);

        return {
            // pageSize: res.pageSize,
            // current: res.current,
            data: res.rows,
            total: res.total,
        };
    };
    return (
        <Modal
            width={1000}
            visible={visible}
            title={<span className="chose-modal">选择班组</span>}
            footer={
                <div>
                    <Button onClick={handleOk}>确认</Button>
                </div>
            }
        >
            <ProTable
                columns={columns}
                tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
                    return (
                        <Space size={24}>
                            <span>
                                已选 {selectedRowKeys.length} 项
                                <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                                    取消选择
                                </a>
                            </span>
                            {/* <span>{`容器数量: ${selectedRows.reduce(
                                (pre, item) => pre + item.containers,
                                0,
                            )} 个`}</span>
                            <span>{`调用量: ${selectedRows.reduce(
                                (pre, item) => pre + item.callNumber,
                                0,
                            )} 次`}</span> */}
                        </Space>
                    );
                }}
                tableAlertOptionRender={() => {
                    return (
                        <Space size={16}>
                            <a>批量删除</a>
                            <a>导出数据</a>
                        </Space>
                    );
                }}
                // dataSource={tableListDataSource}
                scroll={{ x: 1300 }}
                options={false}
                rowKey="key"
                headerTitle="批量操作"
                toolBarRender={() => [<Button key="show">查看日志</Button>]}
                request={async (params) => {
                    return await GetGroupList(params);
                }}
            />
        </Modal>
    );
}
