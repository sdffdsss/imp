import React from 'react';
import { Table } from 'oss-ui';

const Index = (props: any) => {
    const { dataSource } = props;

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            render: (text: any, record: any, index: number) => index + 1,
            width: 60,
        },
        {
            title: '专业',
            dataIndex: 'profession',
            key: 'profession',
            align: 'center',
            width: 160,
        },
        {
            title: '联系人',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: 140,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
            width: 180,
        },
        {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center',
        },
    ];

    return <Table columns={columns} dataSource={dataSource} pagination={false} style={{ width: '100%' }} size="middle" />;
};
export default Index;
