import React from 'react';
import { Tabs, Progress, Table } from 'oss-ui';
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
const columns = [
    {
        dataIndex: 'sheetNo',
        title: '工单号',
    },
    {
        dataIndex: 'city',
        title: '工单主题',
    },
    {
        dataIndex: 'type',
        title: '专业',
    },
    {
        dataIndex: 'time',
        title: '时间',
    },
];
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
const ViewComponentHome = () => {
    return (
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
                            <Table dataSource={listData} columns={columns} pagination={false} />
                            {/* {listData.map((itemss) => {
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
                            })} */}
                        </div>
                    </div>
                </TabPane>
            ))}
        </Tabs>
    );
};
export default ViewComponentHome;
