import request from '@Common/api';

export const getUserCount = () => {
    return request(`bss/api/online/users/count`, {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
    });
};

export const getFaultByTab = (data) => {
    return request(`fault/work/sheet/v1/getFaultByTab`, {
        type: 'post',
        baseUrlType: 'failureSheetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getTimeOutTab = (data) => {
    return request(`fault/work/sheet/v1/getTimeOutTab`, {
        type: 'post',
        baseUrlType: 'failureSheetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getFaultByPage = (data) => {
    return request(`fault/work/sheet/v1/getFaultByPage`, {
        type: 'post',
        baseUrlType: 'failureSheetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getReportFaultBoard = (data) => {
    return request(`faultReport/getReportFaultBoard`, {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 获取工单状态数据
export const getSheetStatusInfo = (data) => {
    return request('alarmmodel/field/v1/dict/entry', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取字典键值失败',
        data,
    });
};

// 获取当前用户群聊未读消息数
export const unreadMessageo = (data) => {
    return request('v1/groups/unreadMessage', {
        type: 'post',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 获取当前用户群聊所有未读消息数
export const unreadMessageoSum = (data) => {
    return request('v1/groups/unreadMessageTotal', {
        type: 'get',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 获取上报故障数tab列表
export const getReportCountTab = (data) => {
    return request('faultReport/getReportCountTab', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 获取已上报故障省份可选项列表
export const getProvinceDrop = (data) => {
    return request('faultReport/getProvinceDrop', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 确认用户是否有排班
export const judgeOnDuty = (data) => {
    return request('schedule/findFutureScheduleByUser', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
export const findGroupByUser = (data) => {
    return request('schedule/findGroupByUser', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const checkUserNameInCeneterApi = (data) => {
    return request('group/checkUserNameInCeneter', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
