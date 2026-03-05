import request from '@Common/api';
import { CardDeleteType } from './types';

export const getSubCount = (data) => {
    return request(`faultReport/getReportFailureClassCount`, {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getCardsList = (data) => {
    return request(`faultReport/getReportDetails`, {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const readCards = (data) => {
    return request(`faultReport/workbenchReportRead`, {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 获取已读未读弹窗信息
export const getViewList = (data) => {
    return request(`faultReport/getReportDetails`, {
        type: 'get',
        baseUrlType: 'fault',
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

// 获取自动通报设置
export const queryReportSetting = (data) => {
    return request('faultReport/queryReportSetting', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 是否当班
export const getShiftingOfDutyStatus = (data) => {
    return request('shiftingOfDuty/status', {
        type: 'get',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const clearInfos = (data) => {
    return request('faultReport/reportRead', {
        type: 'post',
        baseUrlType: 'fault',
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

// 获取已读消息timeLine数据
export const getMessageList = (params) => {
    return request('faultReport/getReportRead', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};

// 删除右侧 card
export const deleteCard = (params: CardDeleteType) => {
    return request('faultReport/deleteReport', {
        type: 'delete',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        errorMessage: '获取故障数据失败',
        params,
    });
};

// [todo]: 直接从`../api`中引用
export { getOnlineProvinceData, getReportCount } from '../api';
