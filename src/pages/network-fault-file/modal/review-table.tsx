import React from 'react';
import { Table, Tooltip } from 'oss-ui';
import TooltipTable from './tooltip-table';

const ReviewTable = (props: any) => {
    const { dataSource } = props;

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text: any, record: any, index: number) => index + 1,
            width: 60,
        },
        {
            title: '审核时间',
            dataIndex: 'auditTime',
            key: 'auditTime',
            width: 180,
        },
        {
            title: '审核人',
            dataIndex: 'reviewer',
            key: 'reviewer',
            width: 120,
        },
        {
            title: '审核结果',
            dataIndex: 'reviewResult',
            key: 'reviewResult',
            width: 100,
        },
        {
            title: '反馈建议',
            dataIndex: 'suggestions',
            key: 'suggestions',
            width: 80,
            render: (text: any) => {
                return (
                    <div className="table-8line" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '驳回通知状态',
            dataIndex: 'rejectStatus',
            key: 'rejectStatus',
            width: 100,
            render: (text: any, record: any) => {
                return (
                    <Tooltip
                        className="table-tooltipStatus"
                        color="#fff"
                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                        title={() => {
                            return (
                                <div className="table-tooltipText">
                                    <TooltipTable dataSource={record.rejectDetail || []} />
                                </div>
                            );
                        }}
                    >
                        {text}
                    </Tooltip>
                );
            },
        },
        {
            title: '驳回通知内容',
            dataIndex: 'rejectContent',
            key: 'rejectContent',
            render: (text: any) => {
                return (
                    <div className="table-8line" title={text}>
                        {text}
                    </div>
                );
            },
        },
    ];

    return <Table columns={columns} dataSource={dataSource} pagination={false} style={{ width: '100%' }} size="middle" />;
};
export default ReviewTable;
