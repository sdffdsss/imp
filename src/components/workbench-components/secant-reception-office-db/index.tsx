import React from 'react';
import { Progress, List, Divider } from 'oss-ui';

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
    return (
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
            <Divider style={{ height: 'auto' }} type="vertical" />
            <div className="view-component-home-page-tabs-list">
                <List
                    dataSource={dataSourceList}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<div style={{ width: 12, height: 12, backgroundColor: 'rgb(68,136,235)', borderRadius: '50%' }} />}
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
    );
};
export default ViewComponentHome;
