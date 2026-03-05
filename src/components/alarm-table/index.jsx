import React, { useState, useEffect } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Menu, Dropdown, Table } from 'oss-ui';
import request from '@Common/api';
import qs from 'qs';
import './style.less';
const alarmLevel = {
    1: (
        <div
            className="overview-monitor-alarm-table-cell-alarm"
            style={{
                background: 'rgb(230,44,37)',
                color: '#000',
            }}
        >
            一级告警
        </div>
    ),
    2: (
        <div
            className="overview-monitor-alarm-table-cell-alarm"
            style={{
                background: 'rgb(239,157,65)',
                color: '#000',
            }}
        >
            二级告警
        </div>
    ),
    3: (
        <div
            className="overview-monitor-alarm-table-cell-alarm"
            style={{
                background: 'rgb(255,251,95)',
                color: '#000',
            }}
        >
            三级告警
        </div>
    ),
    4: (
        <div
            className="overview-monitor-alarm-table-cell-alarm"
            style={{
                background: 'rgb(71,171,251)',
                color: '#000',
            }}
        >
            四级告警
        </div>
    ),
};
const columns = [
    {
        title: '网管告警级别',
        dataIndex: 'org_severity',
        key: 'org_severity',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
        render: (text, record) => {
            return alarmLevel[record.org_severity];
        },
    },
    {
        title: '地市名称',
        dataIndex: 'region_id',
        key: 'region_id',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
    },
    {
        title: '区县名称',
        dataIndex: 'city_id',
        key: 'city_id',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
    },
    {
        title: '网元名称',
        dataIndex: 'eqp_label',
        key: 'eqp_label',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
    },
    {
        title: '网元类型',
        dataIndex: 'object_class',
        key: 'object_class',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
    },
    {
        title: '告警子类型',
        dataIndex: 'sub_alarm_type',
        key: 'sub_alarm_type',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
    },
    {
        title: '告警标题',
        dataIndex: 'title_text',
        key: 'title_text',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
    },
    {
        title: '告警发生时间',
        dataIndex: 'event_time',
        key: 'event_time',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
    },
    {
        title: '设备厂家',
        dataIndex: 'vendor_id',
        key: 'vendor_id',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
    },
];
const AlarmTable = (props) => {
    let dataSource = [];
    const [alarmData, setAlarmData] = useState([]);
    const [dropDown, setDropDown] = useState(false);
    const [field, setField] = useState({});
    let pagetion = {
        current: 1,
        pageSize: 20,
        total: 0,
    };
    const [loading, setLoading] = useState(false);
    let scrollDiv = null;
    const onScroll = (event) => {
        // const { loading, currentPageSize, currentPage, currentTotal, searchKeyOhters } = this.state;
        const { clientHeight } = event.target;
        const { scrollHeight } = event.target;
        const { scrollTop } = event.target;
        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;
        // console.log(pagetion);
        // console.log(isBottom);
        if (isBottom && !loading && pagetion.pageSize > 19 && !props.isNotScroll) {
            if (pagetion.total <= pagetion.current * 20) {
                return;
            }
            getAlarmDetail(pagetion.current + 1);
            // this.getFilterList({
            //     current: filterTypeValue === 1 ? currentPage.myPage + 1 : currentPage.otherPage + 1,
            //     filterName: filterTypeValue === 1 ? searchKey : searchKeyOhters,
            // });
        }
    };
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scrollDiv = document.querySelector('.overview-monitor-alarm-table div.oss-ui-table-body');
        scrollDiv.addEventListener('scroll', (e) => {
            onScroll(e);
        });
        return () => {
            // cleanup
        };
    }, []);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        dataSource = [];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        pagetion = {
            current: 1,
            pageSize: 20,
            total: 0,
        };
        getAlarmDetail(pagetion.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fieldData?.areaId, props.fieldData?.teamId]);
    const getAlarmDetail = (current) => {
        setLoading(true);
        let params = {
            ...props.fieldData,
            pageSize: pagetion.pageSize,
            pageIndex: current,
            // activeIds: ['11111111', '2222222222'] },
        };
        request(props.url || 'alarm/visual-monitoring/v1/getAlarmDetail', {
            data: params,
            type: props.type || 'get',
            showSuccessMessage: false,
            showErrorMessage: false,
            baseUrlType: props.searchUrl || 'overViewUrl',
        })
            .then((res) => {
                if (props.url ? res?.data : res?.data?.data) {
                    let list = props.url
                        ? res.data
                        : res.data.data.map((item, index) => {
                              let field = {};

                              Object.keys(item).forEach((items) => {
                                  field = {
                                      ...field,
                                      [items]: item[items].value,
                                  };
                                  if (items === 'sub_alarm_type' || items === 'vendor_id' || items === 'object_class') {
                                      field = {
                                          ...field,
                                          [items]: item[items].lable,
                                      };
                                  }
                              });
                              // return {
                              //     fieldList: item.params,
                              //     ...field,
                              // };
                              return { ...field };
                          });
                    pagetion = { current: res.data.pageIndex, total: res.data.total, pageSize: 20 };
                    // // data = alarmData.concat(list);
                    dataSource = dataSource.concat(list);
                    setAlarmData(dataSource);
                    setLoading(false);
                }
            })
            .catch(() => {
                setLoading(false);
            });
    };
    const actionsClick = (type, data) => {
        setDropDown(false);
        props.actionsClick && props.actionsClick(type, [data]);
    };
    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={actionsClick.bind(this, 'dispatch', field)}>
                手工派单
            </Menu.Item>
            <Menu.Item key="2" onClick={actionsClick.bind(this, 'message', field)}>
                短信派发
            </Menu.Item>
        </Menu>
    );
    return (
        <Dropdown overlay={menu} visible={dropDown} trigger={['contextMenu']}>
            <div style={{ height: '100%' }} className="overview-monitor-alarm-table">
                <Table
                    columns={columns}
                    dataSource={alarmData}
                    bordered
                    size={'default'}
                    dateFormatter="string"
                    rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                    scroll={{ y: 554 }}
                    loading={loading}
                    rowKey={(record) => `${record.fp0}_${record.fp1}_${record.fp2}_${record.fp3}`}
                    onRow={(record) => {
                        return {
                            onClick: (event) => {
                                setDropDown(false);
                            }, // 点击行
                            //   onDoubleClick: event => {},
                            onContextMenu: (event) => {
                                setDropDown(true);
                                setField(record);
                                // return (

                                // );
                            },

                            //   onMouseEnter: event => {}, // 鼠标移入行
                            //   onMouseLeave: event => {},
                        };
                    }}
                    onHeaderRow={(columns, index) => {
                        return {
                            onClick: (event) => {
                                setDropDown(false);
                            }, // 点击行
                            //   onDoubleClick: event => {},
                            onContextMenu: (event) => {
                                setDropDown(false);
                                // return (

                                // );
                            },
                        };
                    }}
                    pagination={false}
                />
            </div>
        </Dropdown>
    );
};
export default AlarmTable;
