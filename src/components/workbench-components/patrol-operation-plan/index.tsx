import React from 'react';
import { Table, Switch, Tag } from 'oss-ui';

const dataSource = [
    {
        key: '1',
        test1: '1830-220425-无限网监控班组',
        test2: 0,
        test3: 1,
        test4: 0,
    },
    {
        key: '2',
        test1: '1830-220425-无限网监控班组',
        test2: 1,
        test3: 0,
        test4: 1,
    },
    {
        key: '3',
        test1: '1830-220425-无限网监控班组',
        test2: 1,
        test3: 0,
        test4: 1,
    },
];

const ViewComponentHome = () => {
    const getColumnsData = () => {
        return [
            {
                title: '作业计划',
                dataIndex: 'test1',
            },
            {
                title: '是否完成巡检任务',
                dataIndex: 'test2',
                render: (text) => {
                    return <Switch size="small" checked={text} />;
                },
            },
            {
                title: '系统是否正常',
                dataIndex: 'test3',
                render: (text) => {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ textAlign: 'center', paddingBottom: 2 }}>
                                <Switch size="small" checked={text} />
                            </div>
                            {!text ? <Tag color="#f50">问题上报</Tag> : ''}
                        </div>
                    );
                },
            },
            {
                title: '是否故障新增',
                dataIndex: 'test4',
                render: (text) => {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ textAlign: 'center', paddingBottom: 2 }}>
                                <Switch size="small" checked={text} />
                            </div>

                            {text ? <Tag color="#f50">故障记录表</Tag> : ''}
                        </div>
                    );
                },
            },
        ];
    };

    return <Table size="small" columns={getColumnsData()} pagination={false} dataSource={dataSource} />;
};
export default ViewComponentHome;
