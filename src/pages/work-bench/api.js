import request from '@Common/api';

export const insertWorkStationConfiguration = (data) => {
    return request('v1/workStation/insertWorkStationConfiguration', {
        type: 'post',
        baseUrlType: 'indexUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const updateWorkStationConfiguration = (data) => {
    return request('v1/workStation/updateWorkStationConfiguration', {
        type: 'post',
        baseUrlType: 'indexUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getWorkStationConfiguration = (data) => {
    return request('v1/workStation/getWorkStationConfiguration', {
        type: 'get',
        baseUrlType: 'indexUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 确认用户是否在值班班组
export const judgeOnDuty = (data) => {
    return request('schedule/findFutureScheduleByUser', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
// 是否是值班长
export const getSergentUser = (data) => {
    return request('v1/monitor-center/validateShiftForeman', {
        type: 'get',
        baseUrlType: 'indexUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
