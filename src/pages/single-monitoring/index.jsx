import React, { Fragment } from 'react';
import { Tooltip, Icon, Space, ProTable, Button } from 'oss-ui';
import { getList } from './api';
import DetailsMode from './single-monitoring-details';
import ThresholdMode from './single-monitoring-threshold';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.actionRef = React.createRef();
        this.state = {
            publishColumns: [
                {
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center',
                    width: 80,
                    render: (text, record, index) => index + 1
                },
                {
                    title: '告警指纹fp0',
                    dataIndex: 'fp0',
                    align: 'center',
                    width: 120
                },
                {
                    title: '厂家',
                    dataIndex: 'vendorName',
                    align: 'center',
                    width: 120
                },
                {
                    title: '地市',
                    dataIndex: 'regionName',
                    align: 'center',
                    width: 120
                },
                {
                    title: '设备类型',
                    dataIndex: 'eqpObjecClass',
                    align: 'center',
                    width: 120
                },
                {
                    title: '网元名称',
                    dataIndex: 'neLabel',
                    align: 'center',
                    width: 120
                },
                {
                    title: '告警标题',
                    dataIndex: 'alarmTitleText',
                    align: 'center',
                    width: 120
                },
                {
                    title: '网管告警ID',
                    dataIndex: 'standardAlarmId',
                    align: 'center',
                    width: 120
                },
                {
                    title: '告警发生时间',
                    dataIndex: 'eventTime',
                    align: 'center',
                    width: 120
                },
                {
                    title: '告警清除时间',
                    dataIndex: 'cancelTime',
                    align: 'center',
                    width: 120
                },
                {
                    title: '失败类型',
                    dataIndex: 'dataFailTypeName',
                    align: 'center',
                    width: 120
                },
                {
                    title: '告警详情查看',
                    dataIndex: 'actions',
                    hideInSearch: true,
                    align: 'center',
                    width: 60,
                    render: (text, row) => (
                        <Space>
                            <Tooltip title="告警详情查看">
                                <Icon type="SearchOutlined" antdIcon onClick={this.showDetailsModel.bind(this, row)} />
                            </Tooltip>
                        </Space>
                    )
                }
            ],
            dataSource: [],
            loading: false,
            scrollY: window.innerHeight - 300,
            pagination: {
                current: 1,
                pageSize: 20,
                total: 20,
                showQuickJumper: true,
                showSizeChanger: true
            },
            detailsVisible: false,
            detailsRow: {},
            alarmValue: {},
            thresholdVisible: false,
            thresholdRow: {}
        };
    }

    componentDidMount() {
        // this.loadData();
        setInterval(() => {
            this.refresh();
        }, 600000);
    }

    loadData = () => {
        // let { searchRef, pagination } = this.state;
        // let query = searchRef && searchRef.current && searchRef.current.getFieldsValue();
        // if (query) {
        //     Object.keys(query).forEach((key) => {
        //         if (query[key] && Array.isArray(query[key])) {
        //             query[key] = query[key].join(',');
        //         }
        //     });
        // }
        // request('standard/viewList',{
        //     type: 'get',
        //     baseUrlType: 'cardingUrl',
        //     showSuccessMessage: false,
        //     defaultErrorMessage: '获取数据失败',
        //     data: {
        //         current: pagination.current,
        //         pageSize: pagination.pageSize,
        //         ...query,
        //     },
        // }).then((res) => {
        //     this.setState({
        //         dataSource: res.data,
        //         loading: false,
        //     });
        // });
        this.setState({
            dataSource: [
                {
                    fp0: 1
                }
            ]
        });
    };

    showDetailsModel = (value) => {
        this.setState({
            detailsVisible: true,
            detailsRow: value,
            alarmValue: value.alarmTitleText
        });
    };

    detailsChange = () => {
        this.setState({
            detailsVisible: false,
            detailsRow: {}
        });
    };

    showThresholdModal = (value) => {
        this.setState({
            thresholdVisible: true,
            thresholdRow: value
        });
    };

    thresholdChange = () => {
        this.setState({
            thresholdVisible: false,
            thresholdRow: {}
        });
    };
    refresh = () => {
        this.actionRef.current.reload();
    };
    render() {
        const { publishColumns, loading, scrollY, detailsRow, detailsVisible, thresholdVisible, thresholdRow, alarmValue } = this.state;

        return (
            <Fragment>
                <div className="oss-imp-alart-common-bg oss-project-table-search" style={{ marginTop: 10 }}>
                    <Button style={{ margin: '10px 10px 10px 20px' }} onClick={this.showThresholdModal}>
                        监控阀值设置
                    </Button>
                </div>
                <div style={{ marginTop: 20 }}>
                    <ProTable
                        columns={publishColumns}
                        rowKey="rosterIntId"
                        toolBarRender={() => []}
                        scroll={{ y: scrollY }}
                        onChange={this.onPageChange}
                        loading={loading}
                        search={false}
                        bordered
                        dateFormatter="string"
                        headerTitle="派单异常列表（刷新频率：10分钟）"
                        request={getList}
                        actionRef={this.actionRef}
                    />
                </div>
                <DetailsMode editRow={detailsRow} visible={detailsVisible} onChange={this.detailsChange} data={alarmValue}></DetailsMode>
                <ThresholdMode editRow={thresholdRow} visible={thresholdVisible} onChange={this.thresholdChange}></ThresholdMode>
            </Fragment>
        );
    }
}
