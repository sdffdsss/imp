import request from '@Common/api';

export const getFaultByTab = (data) => {
    return request(`fault/work/sheet/v1/getSheetFaultByTab`, {
        type: 'get',
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

// 获取工单状态数据
export const getSheetStatusInfo = (data) => {
    return request('fault/work/sheet/v1/getSheetStatus', {
        type: 'get',
        baseUrlType: 'failureSheetUrl',
        showSuccessMessage: false,
        defaultErrorMessage: 'false',
        data,
    });
};
// 超时故障统计
export const timeOutTab = (data) => {
    return request('fault/work/sheet/v1/getTimeOutTab', {
        type: 'post',
        baseUrlType: 'failureSheetUrl',
        showSuccessMessage: false,
        defaultErrorMessage: 'false',
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

// 获取当前用户群聊所有未读消息数
export const faultPersonCount = (data) => {
    return request('faultScheduling/faultPersonCount', {
        type: 'get',
        baseUrlType: 'noticeUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
