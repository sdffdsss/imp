import request from '@Common/api';
import HomeWorkBench from '@Src/pages/home-workbench';
import HomePage from '@Src/pages/home-page';
const homeTypeMap = {
    team: HomePage,
    default: HomeWorkBench
};
export const getHomePage = (type) => {
    return type ? (homeTypeMap[type] ? homeTypeMap[type] : homeTypeMap.default) : homeTypeMap.default;
};
export const getUserInfo = (systemInfo, userInfo) => {
    let info = {};
    if (userInfo) {
        info = {
            userId: userInfo.userId,
            zone: userInfo?.zones[0]
        };
    }
    if (systemInfo?.currentZone?.zoneId) {
        info = {
            ...info,
            zone: systemInfo?.currentZone
        };
    }
    return info;
};
export const getDefaultViews = (userId, provineceId) => {
    const requestUrl = provineceId
        ? `v1/monitor-view/getMonitorViewByGroup/${userId}/${provineceId}`
        : `v1/monitor-view/getMonitorViewByGroup/${userId}`;
    return request(requestUrl, {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false
    });
};
export const getDefaultUser = (userId, provineceId) => {
    const requestUrl = `schedule/findGroupByUser`;
    return request(requestUrl, {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: {
            operateUser: userId,
            provineceId
        }
    }).catch(() => {
        return undefined;
    });
};
export const getShiftOfDuty = (userId)=>{
    const requestUrl = `shiftingOfDuty/status`;
    return request(requestUrl, {
        type: 'get',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: {
            userId: userId,
        }
    }).catch(() => {
        return undefined;
    });
}