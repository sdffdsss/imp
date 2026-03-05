import React, { useEffect, useState } from 'react';
import { Divider, Badge, Select } from 'oss-ui';
import FaultDispathched from './fault-dispatched';
import { getDefaultViews, getColumns } from './api';
import _isEmpty from 'lodash/isEmpty';
import useLoginInfoModel from '@Src/hox';
import CuoWu from '@Src/pages/change-shifts-page/change-shifts/img/cuowu.png';
import PoressChart from './poress-chart';

const ViewComponentHome = () => {
    const [viewData, setViewData] = useState<any[]>([]);
    const [viewValue, setViewValue] = useState<any>(null);
    const login = useLoginInfoModel();
    const [alarmData, setAlarmData] = useState<any>([]);

    const getDutyView = async () => {
        const { systemInfo, userId, userInfo } = login;
        const userInfos = (userInfo && JSON.parse(userInfo)) || {};
        const zoneId = systemInfo.currentZone?.zoneId
            ? systemInfo.currentZone?.zoneId
            : userInfos?.zones[0]?.zoneLevel === '3'
            ? userInfos?.zones[0]?.parentZoneId
            : userInfos?.zones[0]?.zoneId;
        const resColumn = await getColumns({
            current: 1,
            pageSize: 20,
            showType: 1,
            userId,
            templateName: '监控待办【勿删】',
        });
        const res = await getDefaultViews(userId, zoneId);

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
    const radioChange = (value) => {
        setViewValue(value);
    };
    return (
        <div className="view-component-home-page-tabs">
            <div className="view-component-home-page-tabs-alarm">
                <div style={{ display: 'flex', marginBottom: 10 }}>
                    <span style={{ fontSize: 14 }}>选择视图</span>
                    <Select
                        value={viewValue}
                        style={{ marginLeft: 5, flex: 1 }}
                        options={viewData.map((item) => {
                            return { value: item.windowId, label: item.windowName };
                        })}
                        onChange={radioChange}
                    />
                    {/* <Radio.Group value={viewValue} style={{ marginBottom: 16 }}>
                        {viewData.map((item, index) => (
                            <Radio.Button key={item.windowId} value={item.windowId}>
                                视图{index + 1}
                            </Radio.Button>
                        ))}
                    </Radio.Group> */}
                </div>
                <div className="view-component-home-page-alarm-window">
                    <PoressChart id={'alarmContent'} sumCount={alarmData.secondaryFilter} alarmData={alarmData} />
                    {/* <div style={{ fontSize: 16, color: '#8E9297', height: 16 }}>总告警量</div>
                    <div style={{ fontSize: 32, fontWeight: 500, color: '#333', height: 45 }}>{alarmData.secondaryFilter}</div> */}
                </div>
                {/* <Progress
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
                /> */}
                <div className="view-component-home-page-tabs-alarm-field">
                    <div className="view-component-home-page-tabs-progress-field ">
                        <div className="view-component-home-page-tabs-progress-field-text alarm-view">
                            <div className="alrm-window-field">
                                <Badge color=" #FF6868" text="一级告警" />{' '}
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 500 }}>{alarmData.orgSeverity1 || 0}</div>
                        </div>
                        <div className="view-component-home-page-tabs-progress-field-text alarm-view">
                            <div className="alrm-window-field">
                                <Badge color="#FFA044" text="二级告警" />
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 500 }}>{alarmData.orgSeverity2 || 0}</div>
                        </div>
                    </div>
                    <div className="view-component-home-page-tabs-progress-field">
                        <div className="view-component-home-page-tabs-progress-field-text alarm-view">
                            <div className="alrm-window-field">
                                <Badge color="#3377FF" text="三级告警" />
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 500 }}>{alarmData.orgSeverity3 || 0}</div>
                        </div>
                        <div className="view-component-home-page-tabs-progress-field-text alarm-view">
                            <div className="alrm-window-field">
                                <Badge color="#87EA85" text="四级告警" />
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 500 }}>{alarmData.orgSeverity4 || 0}</div>
                        </div>
                    </div>
                </div>
            </div>
            <Divider style={{ height: 'auto' }} dashed type="vertical" />
            <div className="view-component-home-page-tabs-list">
                {!_isEmpty(viewData) ? (
                    <FaultDispathched
                        viewData={viewValue && viewData.filter((item) => item.windowId === viewValue)}
                        onResultChange={onResultChange}
                    />
                ) : (
                    <div className="change-shifts-page-continer">
                        <div style={{ height: '60%', marginTop: '-4vh' }}>
                            <img src={CuoWu} alt="" className="change-shifts-page-img" style={{ height: '90%' }} />
                        </div>
                        <div>
                            <span className="change-shifts-page-word">该用户不在监控班组内</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ViewComponentHome;
