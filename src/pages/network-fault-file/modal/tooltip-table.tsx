import React from 'react';
import { Table } from 'oss-ui';

const ReviewTable = (props: any) => {
    const { dataSource } = props;

    const columns = [
        {
            title: '通知人',
            dataIndex: 'notifier',
            key: 'notifier',
            width: 100,
            align: 'center',
        },
        {
            title: '联系方式',
            dataIndex: 'contactInfo',
            key: 'contactInfo',
            width: 80,
            align: 'center',
        },
        {
            title: '通知结果',
            dataIndex: 'noticeResult',
            key: 'noticeResult',
            width: 80,
            align: 'center',
        },
        {
            title: '失败原因',
            dataIndex: 'failReason',
            key: 'failReason',
            width: 230,
            align: 'center',
        },
    ];

    return <Table columns={columns} dataSource={dataSource} pagination={false} style={{ width: '100%' }} size="small" />;
};
export default ReviewTable;
