import React, { useEffect, useState, useRef } from 'react';
import WindowCard from './window-card';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { getView, getRegion, getWay } from './api';
import _isEmpty from 'lodash/isEmpty';

// import { Icon } from 'oss-ui';

import './style.less';
const FaultDispathched = ({ failMapInfo = {} }) => {
    const login = useLoginInfoModel();
    const [windowData, setWindowData] = useState({});
    const [provinceList, setProvinceList] = useState([]);
    // const [gateUrl, setGateUrl] = useState(false);
    const conditionList: any = useRef([
        {
            operator: 'in',
            fieldName: 'send_status',
            value: ['21'],
            not: false,
        },
    ]);
    const gateWayData = async () => {
        if (!useEnvironmentModel.data.environment.gateWayBtn) {
            return;
        }
        const { systemInfo, userInfo } = login;
        const info = (userInfo && JSON.parse(userInfo)) || {};
        const zoneId = systemInfo.currentZone?.zoneId || info?.zones[0]?.zoneId;
        const res = await getWay(zoneId);
        if (res.location) {
            // gateRef.current = res.location;
            // setGateUrl(res.location);
        } else {
            // setGateUrl(false);
        }
    };
    const getViewList = async (userId) => {
        const data = {
            current: 1,
            pageSize: 20,
            showType: 2,
            userId: userId,
            windowType: 1,
            windowName: '待调度勿删',
            needWebSocketUrl: true,
        };
        const res = await getView(data);
        if (res.data) {
            setWindowData(res.data[0]);
        }
    };
    const getRegionData = async (id) => {
        const res = await getRegion(id);
        if (res.data) {
            setProvinceList(res.data.map((item) => item.zoneId));
        }
    };
    useEffect(() => {
        // 集团大区  过滤一级专业
        conditionList.current = [
            {
                operator: 'in',
                fieldName: 'send_status',
                value: ['21'],
                not: false,
            },
            {
                operator: 'in',
                fieldName: 'province_id',
                value: provinceList,
                not: false,
            },
            // {
            //     operator: 'in',
            //     fieldName: 'network_type_top',
            //     value: [0],
            //     not: false,
            // },
            // {
            //     operator: 'in',
            //     fieldName: 'professional_type',
            //     value: [27, 80, 1, 3, 6, 16, 17, 7, 70, 25, 26, 85],
            //     not: false,
            // },
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceList]);
    useEffect(() => {
        const { userId, systemInfo, userInfo } = login;
        const userInfoParse = (userInfo && JSON.parse(userInfo)) || {};
        const userInfos = systemInfo?.currentZone?.zoneId ? systemInfo.currentZone : userInfoParse.zones[0];
        if (userInfos.zoneLevel === '5') {
            getRegionData(userInfos.zoneId);
        } else {
            if (userInfos.zoneLevel === '2' && userInfos.zoneId) {
                //  省市用户  非一级专业
                conditionList.current = [
                    {
                        operator: 'in',
                        fieldName: 'send_status',
                        value: ['21'],
                        not: false,
                    },
                    {
                        operator: 'in',
                        fieldName: 'province_id',
                        value: [userInfos.zoneId],
                        not: false,
                    },
                ];
            }
            if (userInfos.zoneLevel === '3' && userInfos.parentZoneId) {
                conditionList.current = [
                    {
                        operator: 'in',
                        fieldName: 'send_status',
                        value: ['21'],
                        not: false,
                    },
                    {
                        operator: 'in',
                        fieldName: 'province_id',
                        value: [userInfos.parentZoneId],
                        not: false,
                    },
                    {
                        operator: 'in',
                        fieldName: 'region_id',
                        value: [userInfos.zoneId],
                        not: false,
                    },
                ];
            }
        }
        gateWayData();
        getViewList(userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fault-dispathched-page">
            {/* <div className="fault-dispathched-page-title">故障待调度</div> */}
            <div className="fault-dispathched-page-window">
                {!_isEmpty(windowData) && (
                    <WindowCard
                        failMapInfo={failMapInfo}
                        // ref={windowCard}
                        selectedRows={[{ ...windowData }]}
                        i={0}
                        windowType="duty"
                        // gateUrl={gateUrl}
                        // getCallBackData={(e) => {
                        //     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        //     console.log(e);
                        // }}
                        tabItem={1}
                        windowBar={'1'}
                        defaultSecondaryFilter={{
                            logicalAnd: true,
                            conditionList: conditionList.current,
                            not: false,
                        }}
                    />
                )}
            </div>
        </div>
    );
};
export default FaultDispathched;
