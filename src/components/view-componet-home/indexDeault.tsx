import React, { useEffect, useState } from 'react';
import { Card, Tabs, Col, Row, Button, Progress, List, Radio, Table, Switch, Tag } from 'oss-ui';
import './style.less';
import FaultDispathched from './fault-dispatched';
import { getDefaultViews, getColumns } from './api';
import useLoginInfoModel from '@Src/hox';
const { TabPane } = Tabs;
const complaintData = [
    {
        key: '1',
        label: '移网投诉',
    },
    {
        key: '2',
        label: '物联网投诉',
    },
    {
        key: '3',
        label: '集客投诉',
    },
    {
        key: '4',
        label: '宽带投诉',
    },
];
interface listDataType {
    key: string;
    sheetNo?: string;
    city?: string;
    type?: string;
    time?: string;
}
const listData: listDataType[] = [
    {
        key: 'sheetNo',
        sheetNo: 'JS网调【2022】投诉工单 0426-55128',
        city: '南京市：NJ_PK_HW',
        type: '无线',
        time: '2022-05-05 00:00:00',
    },
    {
        key: 'city',
        sheetNo: 'JS网调【2022】投诉工单 0426-55128',
        city: '南京市：NJ_PK_HW',
        type: '无线',
        time: '2022-05-05 00:00:00',
    },
    {
        key: 'type',
        sheetNo: 'JS网调【2022】投诉工单 0426-55128',
        city: '南京市：NJ_PK_HW',
        type: '无线',
        time: '2022-05-05 00:00:00',
    },
    {
        key: 'time',
        sheetNo: 'JS网调【2022】投诉工单 0426-55128',
        city: '南京市：NJ_PK_HW',
        type: '无线',
        time: '2022-05-05 00:00:00',
    },
];
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
const dataSourceList = [
    {
        key: '1',
        title: '关于长沙市友谊至圭塘局间一干96芯光缆割接报告',
        type: 1,
        start: '2022-02-12 15:00:00',
        end: '2022-02-12 20:00:00',
    },
    {
        key: '2',
        title: '关于长沙市友谊至圭塘局间一干96芯光缆割接报告',
        type: 1,
        start: '2022-02-12 15:00:00',
        end: '2022-02-12 20:00:00',
    },
    {
        key: '3',
        title: '关于长沙市友谊至圭塘局间一干96芯光缆割接报告',
        type: 0,
        start: '2022-02-12 15:00:00',
        end: '2022-02-12 20:00:00',
    },
    {
        key: '4',
        title: '关于长沙市友谊至圭塘局间一干96芯光缆割接报告',
        type: 1,
        start: '2022-02-12 15:00:00',
        end: '2022-02-12 20:00:00',
    },
];
const ViewComponentHome = () => {
    const [viewData, setViewData] = useState<any[]>([]);
    const [viewValue, setViewValue] = useState(null);
    const login = useLoginInfoModel();
    const [alarmData, setAlarmData] = useState<any>({});
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
    const getDutyView = async () => {
        const { systemInfo, userId, userInfo } = login;
        const userInfos = (userInfo && JSON.parse(userInfo)) || {};
        const zoneId = systemInfo.currentZone?.zoneId || userInfos?.zones[0]?.zoneId;
        const resColumn = await getColumns({
            current: 1,
            pageSize: 20,
            showType: 1,
            userId,
            templateName: '监控待办【勿删】',
        });
        console.log(resColumn);
        const res = await getDefaultViews(userId, zoneId);

        console.log(res);
        if (res.data) {
            setViewValue(res.data[0]?.windowId);
            setViewData(
                res.data.map((item) => {
                    return {
                        ...item,
                        colDispTemplet: resColumn?.data[0]?.templateId || res.colDispTemplet,
                    };
                })
            );
        }
    };
    useEffect(() => {
        getDutyView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onResultChange = (data) => {
        setAlarmData(data);
    };
    const radioChange = (e) => {
        setViewValue(e.target.value);
    };
    return (
        <div className="view-component-home-page">
            <Row gutter={[8, 8]}>
                <Col span={16}>
                    <Card title="投诉待办任务" extra={<Button type="link">More</Button>} bordered={false}>
                        <Tabs>
                            {complaintData.map((item) => (
                                <TabPane key={item.key} tab={item.label}>
                                    <div className="view-component-home-page-tabs">
                                        <div className="view-component-home-page-tabs-progress">
                                            <Progress
                                                type="circle"
                                                percent={75}
                                                strokeWidth={10}
                                                format={() => {
                                                    return (
                                                        <div className="view-component-home-page-tabs-progress-content">
                                                            <div style={{ fontSize: 12, color: 'rgba(144,152,174)' }}>所有投诉</div>
                                                            <div style={{ fontSize: 30 }}>{12}</div>
                                                        </div>
                                                    );
                                                }}
                                            />
                                            <div className="view-component-home-page-tabs-progress-field">
                                                <div className="view-component-home-page-tabs-progress-field-text">
                                                    <div>待接单</div>
                                                    <div>8</div>
                                                </div>
                                                <div className="view-component-home-page-tabs-progress-field-text">
                                                    <div>处理中</div>
                                                    <div>4</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="view-component-home-page-tabs-list">
                                            {listData.map((itemss) => {
                                                return (
                                                    <List
                                                        key={itemss.key}
                                                        grid={{ gutter: 16, column: 4 }}
                                                        dataSource={listData}
                                                        renderItem={(items) => (
                                                            <List.Item>
                                                                <div>{items[items.key]}</div>
                                                            </List.Item>
                                                        )}
                                                        // itemLayout={'vertical'}
                                                        split={true}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </TabPane>
                            ))}
                        </Tabs>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="巡检作业计划" extra={<Button type="link">More</Button>} bordered={false}>
                        <Table size="small" columns={getColumnsData()} pagination={false} dataSource={dataSource} />
                    </Card>
                </Col>
                <Col span={16}>
                    <Card title="监控待办" extra={<Button type="link">More</Button>} bordered={false}>
                        <div className="view-component-home-page-tabs">
                            <div className="view-component-home-page-tabs-progress" style={{ width: 200 }}>
                                <div style={{ textAlign: 'right' }}>
                                    <Radio.Group value={viewValue} onChange={radioChange} style={{ marginBottom: 16 }}>
                                        {viewData.map((item, index) => (
                                            <Radio.Button key={item.windowId} value={item.windowId}>
                                                视图{index + 1}
                                            </Radio.Button>
                                        ))}
                                    </Radio.Group>
                                </div>
                                <Progress
                                    type="circle"
                                    percent={75}
                                    strokeWidth={10}
                                    format={() => {
                                        return (
                                            <div className="view-component-home-page-tabs-progress-content">
                                                <div style={{ fontSize: 12, color: 'rgba(144,152,174)' }}>总告警量</div>
                                                <div style={{ fontSize: 30 }}>{alarmData.secondaryFilter}</div>
                                            </div>
                                        );
                                    }}
                                />
                                <div className="view-component-home-page-tabs-progress-field ">
                                    <div className="view-component-home-page-tabs-progress-field-text alarm-view">
                                        <div>一级告警</div>&nbsp;<div>{alarmData.orgSeverity1 || 0}</div>
                                    </div>
                                    <div className="view-component-home-page-tabs-progress-field-text alarm-view">
                                        <div>二级告警</div>&nbsp;<div>{alarmData.orgSeverity2 || 0}</div>
                                    </div>
                                </div>
                                <div className="view-component-home-page-tabs-progress-field alarm-view">
                                    <div className="view-component-home-page-tabs-progress-field-text alarm-view">
                                        <div>三级告警</div>&nbsp;<div>{alarmData.orgSeverity3 || 0}</div>
                                    </div>
                                    <div className="view-component-home-page-tabs-progress-field-text alarm-view">
                                        <div>四级告警</div>&nbsp;<div>{alarmData.orgSeverity4 || 0}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="view-component-home-page-tabs-list">
                                <FaultDispathched
                                    viewData={viewValue && viewData.filter((item) => item.windowId === viewValue)}
                                    onResultChange={onResultChange}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={16}>
                    <Card title="割接任务待办" extra={<Button type="link">More</Button>} bordered={false}>
                        <div className="view-component-home-page-tabs">
                            <div className="view-component-home-page-tabs-progress">
                                <Progress
                                    type="circle"
                                    percent={75}
                                    strokeWidth={10}
                                    format={() => {
                                        return (
                                            <div className="view-component-home-page-tabs-progress-content">
                                                <div style={{ fontSize: 12, color: 'rgba(144,152,174)' }}>所有待办</div>
                                                <div style={{ fontSize: 30 }}>{30}</div>
                                            </div>
                                        );
                                    }}
                                />
                                <div className="view-component-home-page-tabs-progress-field">
                                    <div className="view-component-home-page-tabs-progress-field-text">
                                        <div>已签发</div>
                                        <div>2</div>
                                    </div>
                                    <div className="view-component-home-page-tabs-progress-field-text">
                                        <div>未签发</div>
                                        <div>28</div>
                                    </div>
                                </div>
                            </div>
                            <div className="view-component-home-page-tabs-list">
                                <List
                                    dataSource={dataSourceList}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    <div style={{ width: 12, height: 12, backgroundColor: 'rgb(68,136,235)', borderRadius: '50%' }} />
                                                }
                                                title={<span>{item.title}</span>}
                                                description={
                                                    <div>
                                                        <span className={'tabs-list-field-qf'}>未签发</span>
                                                        &nbsp;&nbsp;&nbsp;
                                                        <span>{item.start}</span>&nbsp;
                                                        <span>{item.end}</span>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                    // itemLayout={'vertical'}
                                    split={true}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
export default ViewComponentHome;
