import React, { useState, useEffect } from 'react';
import { VirtualTable } from 'oss-web-common';
import './index.less';

const FaultList = (props) => {
    const { title, dataSource } = props;
    const [activeTab, setActiveTab] = useState('线路故障');
    const [tabIndex, setTabIndex] = useState(1);

    const alarmLevel = {
        一级告警: (
            <div
                className="overview-monitor-alarm-table-cell-alarm"
                style={{
                    background: 'rgb(251, 107, 107)',
                    color: '#fff',
                }}
            >
                一级告警
            </div>
        ),
        二级告警: (
            <div
                className="overview-monitor-alarm-table-cell-alarm"
                style={{
                    background: 'rgb(239,157,65)',
                    color: '#fff',
                }}
            >
                二级告警
            </div>
        ),
        三级告警: (
            <div
                className="overview-monitor-alarm-table-cell-alarm"
                style={{
                    background: 'rgb(255,251,95)',
                    color: '#fff',
                }}
            >
                三级告警
            </div>
        ),
        四级告警: (
            <div
                className="overview-monitor-alarm-table-cell-alarm"
                style={{
                    background: 'rgb(71,171,251)',
                    color: '#fff',
                }}
            >
                四级告警
            </div>
        ),
    };

    const columns =
        title === '重大故障列表'
            ? [
                  {
                      title: '故障等级预警',
                      dataIndex: 'alarmLevel',
                      key: 'alarmLevel',
                      hideInSearch: true,
                      //   ellipsis: true,
                      width: 55,
                      align: 'center',
                      render: (text, record) => {
                          return (
                              <div
                                  style={{
                                      color: '#fff',
                                      display: 'flex',
                                      justifyContent: 'center',
                                  }}
                              >
                                  <div className="fault-list-table-cell-alarm">{record.faultLevel}</div>
                              </div>
                          );
                      },
                  },
                  {
                      title: '省份',
                      dataIndex: 'provinceName',
                      key: 'provinceName',
                      hideInSearch: true,
                      width: 40,
                      render: (text) => {
                          return (
                              <div title={text} className="table-ellipsis">
                                  {text}
                              </div>
                          );
                      },
                  },
                  {
                      title: '地市',
                      dataIndex: 'regionName',
                      key: 'regionName',
                      hideInSearch: true,
                      width: 40,
                      render: (text) => {
                          return (
                              <div title={text} className="table-ellipsis">
                                  {text}
                              </div>
                          );
                      },
                  },
                  {
                      title: '故障标题',
                      dataIndex: 'title',
                      key: 'title',
                      hideInSearch: true,
                      width: 200,
                      render: (text) => {
                          return (
                              <div title={text} className="table-ellipsis">
                                  {text}
                              </div>
                          );
                      },
                  },
                  {
                      title: '工单编号',
                      dataIndex: 'sheetNo',
                      key: 'sheetNo',
                      hideInSearch: true,
                      width: 150,
                      render: (text) => {
                          return (
                              <div title={text} className="table-ellipsis">
                                  {text}
                              </div>
                          );
                      },
                  },
                  {
                      title: '工单状态',
                      dataIndex: 'sheetStatus',
                      key: 'sheetStatus',
                      hideInSearch: true,
                      width: 60,
                      render: (text) => {
                          return (
                              <div title={text} className="table-ellipsis">
                                  {text}
                              </div>
                          );
                      },
                  },
              ]
            : [
                  {
                      title: '省份',
                      dataIndex: 'provinceName',
                      key: 'provinceName',
                      hideInSearch: true,
                      ellipsis: true,
                      width: 80,
                  },
                  {
                      title: '网络告警级别',
                      dataIndex: 'alarmLevel',
                      key: 'alarmLevel',
                      hideInSearch: true,
                      width: 120,
                      align: 'center',
                      render: (text) => {
                          return alarmLevel[text];
                      },
                  },
                  {
                      title: '告警标题',
                      dataIndex: 'title',
                      key: 'title',
                      hideInSearch: true,
                      width: 220,
                      render: (text) => {
                          return (
                              <div title={text} className="table-ellipsis">
                                  {text}
                              </div>
                          );
                      },
                  },
                  {
                      title: '网元名称',
                      dataIndex: 'eqpObjectClass',
                      key: 'eqpObjectClass',
                      hideInSearch: true,
                      width: 180,
                      render: (text) => {
                          return (
                              <div title={text} className="table-ellipsis">
                                  {text}
                              </div>
                          );
                      },
                  },
                  {
                      title: '告警发生时间',
                      dataIndex: 'eventTime',
                      key: 'eventTime',
                      hideInSearch: true,
                      width: 200,
                      render: (text) => {
                          return (
                              <div title={text} className="table-ellipsis">
                                  {text}
                              </div>
                          );
                      },
                  },
              ];

    const tabEnum = [
        {
            title: '线路故障',
            count: 0,
            type: 1,
        },
        {
            title: '机房动力故障',
            count: 0,
            type: 2,
        },
        {
            title: '基站退服故障',
            count: 0,
            type: 3,
        },
        {
            title: '传输设备故障',
            count: 0,
            type: 4,
        },
    ];
    useEffect(() => {
        if (activeTab && title === '重大故障列表') {
            const selTab: any = tabEnum.find((e) => e.title === activeTab);
            setTabIndex(selTab.type);
            props.changeTabData(selTab.type);
        }
    }, [activeTab]);

    const renderTab = () => {
        return (
            <div className="fault-list-page-tab">
                {tabEnum.map((item, i) => {
                    const { title } = item;
                    const isActive = title === activeTab ? true : false;
                    return (
                        <div className="fault-list-page-tab-item" key={i} onClick={() => setActiveTab(title)}>
                            <div className="fault-list-page-tab-item-title" style={isActive ? { color: 'rgba(0, 0, 0, 0.85)' } : undefined}>
                                {title}
                            </div>
                            <div className="fault-list-page-tab-item-count">{dataSource[i]?.data?.length || 0}</div>
                            <div className="fault-list-page-tab-item-tag" style={!isActive ? { display: 'none' } : undefined}></div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="fault-list-page">
            <div className="duty-view-title">{title}</div>
            {title === '重大故障列表' ? renderTab() : null}
            <VirtualTable
                columns={columns}
                global={window}
                bordered
                dataSource={title === '重大故障列表' ? dataSource[tabIndex - 1]?.data || [] : dataSource}
                size={'default'}
                search={false}
                options={false}
                dateFormatter="string"
                rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                scroll={{ y: 554, x: 1500 }}
                pagination={false}
            />
        </div>
    );
};

export default FaultList;
