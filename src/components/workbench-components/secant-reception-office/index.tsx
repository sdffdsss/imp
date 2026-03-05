import React from 'react';
import { Progress, List, Divider } from 'oss-ui';

const dataSourceList = [
    {
        key: '1',
        title: '河南HSTP到东信北邮新建的IP短信网管对接数据',
        type: 1,
        start: '2022-02-12 15:00:00',
        end: '2022-02-12 20:00:00',
    },
    {
        key: '2',
        title: '河南HSTP到东信北邮新建的IP短信网管对接数据',
        type: 1,
        start: '2022-02-12 15:00:00',
        end: '2022-02-12 20:00:00',
    },
    {
        key: '3',
        title: '河南HSTP到东信北邮新建的IP短信网管对接数据',
        type: 0,
        start: '2022-02-12 15:00:00',
        end: '2022-02-12 20:00:00',
    },
    {
        key: '4',
        title: '河南HSTP到东信北邮新建的IP短信网管对接数据',
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
                        <div>执行中</div>
                        <div>2</div>
                    </div>
                    <div className="view-component-home-page-tabs-progress-field-text">
                        <div>未执行</div>
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
                                        <span className={'tabs-list-field-qf'} style={{ color: 'rgb(98,156,236)', background: 'rgb(240,245,255)' }}>
                                            执行中
                                        </span>
                                        &nbsp;
                                        <span style={{ color: 'rgb(98,156,236)' }}>1天3小时1分</span>
                                        &nbsp;
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
