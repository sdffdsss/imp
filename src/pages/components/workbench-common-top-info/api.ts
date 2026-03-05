import request from '@Common/api';

export const findGroupByUser = (data) => {
    return request('schedule/findGroupByUser', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 确认用户是否在值班班组
export const judgeOnDuty = (data) => {
    return request('group/findGruopUserList', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

export const getUserInfo = (userId: string) => {
    return request(`api/users/${userId}/deptAndTitle`, {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
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

export const updateWorkStationConfiguration = (data) => {
    return request('v1/workStation/updateWorkStationConfiguration', {
        type: 'post',
        baseUrlType: 'indexUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getSettingData = (appId, userId) => {
    return request('v1/workStation/getWorkStationTools', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: {
            appId,
            userId,
        },
    });
};

// 保存工具列表
export const saveSettingData = (data) => {
    return request('v1/workStation/updateWorkStationTools', {
        type: 'post',
        baseUrlType: 'filterUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const queryShiftingOfDutyNow = (data) => {
    return request('shiftingOfDuty/queryShiftingOfDutyNow', {
        type: 'GET',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

export const getShiftingOfDutyStatus = (data) => {
    return request('shiftingOfDuty/status', {
        type: 'get',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const getWorkShiftRuleByGroupId = (data) => {
    return request('shiftingOfDuty/getWorkShiftRuleByGroupId', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const findGroupsByUser = (data) => {
    return new Promise((resolve) => {
        request('group/findGroupsByUser', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};
