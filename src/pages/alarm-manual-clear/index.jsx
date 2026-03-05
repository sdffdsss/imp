import React from 'react';
import PageContainer from '@Components/page-container';
// import request from '@Common/api';
import { Card, Icon, Table, Space, Button } from 'oss-ui';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            alreadyColumns: [
                {
                    title: '审批请求ID',
                    width: 100,
                    align: 'center',
                    dataIndex: 'id',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '清除申请人',
                    width: 100,
                    align: 'center',
                    dataIndex: 'user',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '申请时间',
                    width: 180,
                    align: 'center',
                    dataIndex: 'date',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '申请原因描述',
                    width: 100,
                    align: 'center',
                    dataIndex: 'reason',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '证据文件',
                    width: 100,
                    align: 'center',
                    dataIndex: 'file',
                    ellipsis: {
                        showTitle: true
                    },
                    render: (text, record) => (
                        <Space>
                            <Button type="link">查看</Button>
                            <Button type="link">下载</Button>
                        </Space>
                    )
                },
                {
                    title: '告警标题',
                    width: 120,
                    align: 'center',
                    dataIndex: 'orgTitle',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '告警标准名',
                    width: 100,
                    align: 'center',
                    dataIndex: 'orgName',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '网管告警ID',
                    width: 100,
                    align: 'center',
                    dataIndex: 'orgId',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '告警发生时间',
                    width: 180,
                    align: 'center',
                    dataIndex: 'orgDate',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '厂家',
                    width: 100,
                    align: 'center',
                    dataIndex: 'vendor',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '网元类型',
                    width: 100,
                    align: 'center',
                    dataIndex: 'neType',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '网元名称',
                    width: 180,
                    align: 'center',
                    dataIndex: 'neTypeName',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '操作',
                    width: 120,
                    align: 'center',
                    dataIndex: 'actions',
                    fixed: 'right',
                    render: (text, record) => (
                        <Space>
                            <Icon antdIcon type="CloseCircleOutlined" />
                            <Icon antdIcon type="CheckCircleOutlined" />
                        </Space>
                    )
                }
            ],
            noReadyColumns: [
                {
                    title: '审批请求ID',
                    width: 100,
                    align: 'center',
                    dataIndex: 'id',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '清除申请人',
                    width: 100,
                    align: 'center',
                    dataIndex: 'user',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '申请时间',
                    width: 180,
                    align: 'center',
                    dataIndex: 'date',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '申请原因描述',
                    width: 100,
                    align: 'center',
                    dataIndex: 'reason',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '证据文件',
                    width: 100,
                    align: 'center',
                    dataIndex: 'file',
                    ellipsis: {
                        showTitle: true
                    },
                    render: (text, record) => (
                        <Space>
                            <Button type="link">查看</Button>
                            <Button type="link">下载</Button>
                        </Space>
                    )
                },
                {
                    title: '审批结果',
                    width: 100,
                    align: 'center',
                    dataIndex: 'aduit',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '审批人',
                    width: 100,
                    align: 'center',
                    dataIndex: 'aduitUser',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '审批时间',
                    width: 180,
                    align: 'center',
                    dataIndex: 'aduitDate',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '告警标题',
                    width: 120,
                    align: 'center',
                    dataIndex: 'orgTitle',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '告警标准名',
                    width: 100,
                    align: 'center',
                    dataIndex: 'orgName',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '网管告警ID',
                    width: 100,
                    align: 'center',
                    dataIndex: 'orgId',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '告警发生时间',
                    width: 180,
                    align: 'center',
                    dataIndex: 'orgDate',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '厂家',
                    width: 100,
                    align: 'center',
                    dataIndex: 'vendor',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '网元类型',
                    width: 100,
                    align: 'center',
                    dataIndex: 'neType',
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: '网元名称',
                    width: 180,
                    align: 'center',
                    dataIndex: 'neTypeName',
                    ellipsis: {
                        showTitle: true
                    }
                }
            ],
            alreadyDataSource: [],
            noReadyDataSource: []
        };
    }

    componentDidMount() {
        this.loadData();
    }

    mockData = () => {
        const dataSource = [];
        for (let i = 0; i < 20; i++) {
            dataSource.push({
                id: i + 1,
                user: '我是谁',
                date: '2020-08-01 11:11:11',
                reason: '测试未通过',
                orgTitle: '基站退服告警',
                orgName: '基站退服',
                orgId: '网管告警ID',
                orgDate: '2020-10-21 14:00:22',
                vendor: '华为',
                neType: 'GNODEB',
                neTypeName: 'XX街道XX楼基站1号',
                aduit: 1,
                aduitUser: '刘张玉',
                aduitDate: '2020-10-22 14:00:22'
            });
        }

        return dataSource;
    };
    loadData = () => {
        const dataSource = this.mockData();
        this.setState({
            alreadyDataSource: dataSource,
            noReadyDataSource: dataSource
        });
    };

    render() {
        const { alreadyColumns, alreadyDataSource, noReadyColumns, noReadyDataSource } = this.state;
        const xWidth = alreadyColumns.reduce((total, item) => {
            return total + item.width;
        }, 0);
        return (
            <PageContainer showHeader={false}>
                <Card title="待审批清除请求告警">
                    <Table
                        columns={alreadyColumns}
                        dataSource={alreadyDataSource}
                        bordered
                        size="small"
                        scroll={{ x: xWidth, y: window.innerHeight / 2 - 201 }}
                        rowSelection={{}}
                        rowKey="id"
                    />
                </Card>
                <Card title="待审批清除请求告警" style={{ marginTop: '10px' }}>
                    <Table
                        columns={noReadyColumns}
                        dataSource={noReadyDataSource}
                        bordered
                        size="small"
                        scroll={{ x: xWidth, y: window.innerHeight / 2 - 201 }}
                        rowKey="id"
                    />
                </Card>
            </PageContainer>
        );
    }
}
