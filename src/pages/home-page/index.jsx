import React, { useEffect, useState } from 'react';
import MyCenter from './my-center';
import MyWindow from './my-window';
import GroupStatus from './group-status';
import Notice from './notice';
import WindowView from './window-view';
import { PageContainer } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { getDefaultViews, getCenterList, findGroupByUser } from './api';
import './index.less';

const Index = () => {
    const userInfo = useLoginInfoModel();
    const [groupData, handleGroupData] = useState({});
    const [centerData, handleCenterData] = useState([]);
    const [currentGroup, handleCurrentGroup] = useState([]);
    const [startTime, setStarTime] = useState(null);
    const { systemInfo, userId } = userInfo;
    const zoneId = systemInfo.currentZone?.zoneId;
    useEffect(() => {
        let info = {};
        if (userInfo.userInfo) {
            info = JSON.parse(userInfo.userInfo);
        }
        const zones = info.zones[0];
        getCenterList({
            provinceId: zones?.zoneLevel === '3' ? zones?.parentZoneId : zones?.zoneId,
            userId,
        }).then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
                handleCenterData(res.data);
            }
        });
        findGroupByUser({
            provinceId: zones?.zoneLevel === '3' ? zones?.parentZoneId : zones?.zoneId,
            operateUser: userId,
        }).then((res) => {
            if (res && res.rows && Array.isArray(res.rows)) {
                handleCurrentGroup(res.rows);
                setStarTime(res.rows[0]?.scheduleBeginTime);
                getDefaultViews(res.rows[0]?.groupId).then((re) => {
                    handleGroupData(re);
                });
            }
        });
    }, []);
    return (
        <PageContainer showHeader={false} className="home-page-container">
            <div className="head-model">
                <MyCenter
                    userInfo={userInfo}
                    groupData={groupData}
                    centerData={centerData}
                    theme={systemInfo?.theme}
                    currentGroup={currentGroup}
                    startTime={startTime}
                />
                <MyWindow theme={systemInfo?.theme} />
            </div>

            <div className="notice-container ">
                <div className="notice-container-left oss-imp-alart-common-bg">
                    <GroupStatus userInfo={userInfo} groupData={groupData} theme={systemInfo?.theme} />
                </div>
                <div className="notice-container-right oss-imp-alart-common-bg">
                    <Notice theme={systemInfo?.theme} />
                </div>
            </div>
            <WindowView userInfo={userInfo} groupData={groupData} theme={systemInfo?.theme} currentGroup={currentGroup} />
        </PageContainer>
    );
};

export default Index;
