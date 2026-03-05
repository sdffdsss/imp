import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { judgeOnDuty, getSergentUser } from './api';
import useLoginInfoModel from '@Src/hox';
import constants from '@Common/constants';
import './index.less';

const Index = () => {
    const login = useLoginInfoModel();
    const history = useHistory();
    useEffect(() => {
        const { userId, systemInfo, userInfo } = login;
        console.log(userId, '=====id2', login);
        const userInfoParse = (userInfo && JSON.parse(userInfo)) || {};
        const userInfos = systemInfo?.currentZone?.zoneId ? systemInfo.currentZone : userInfoParse.zones[0];
        let param = {
            userId,
            provinceId: userInfos.zoneId,
        };
        Promise.all([judgeOnDuty({ userId: login.userId }), getSergentUser(param)]).then((res) => {
            console.log(res, '===res');
            const [ifDuty, ifSergent] = res;
            if (ifSergent.data) {
                // 是值班长
                if (userInfos.zoneLevel === '5' || userInfos.zoneLevel === '1') {
                    // 集团大区用户  进值班人员工作台
                    history.push({
                        pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/monitor-view`,
                    });
                } else {
                    // 非集团大区用户  进值班长工作台
                    history.push({
                        pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/duty-monitor-view`,
                    });
                }
            } else {
                // 非值班长
                if (ifDuty.rows?.length > 0) {
                    // 在班组 进值班人员工作台
                    history.push({
                        pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/monitor-view`,
                    });
                } else {
                    // 不在班组 进通用工作台
                    history.push({
                        pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/integrated-monitoring`,
                    });
                }
            }
        });
    });
    return <div className="workbench-manage-container"></div>;
};

export default Index;
