import request from '@Common/api';
// 获取故障看板数据
export const getFaultSchedulingKanban = (data: any) => {
    return request('dx/faultSchedulingKanban', {
        type: 'post',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 获取上报故障数列表
export const getProvinceFaultReport = (data: any) => {
    return request('faultReport/getProvinceFaultReport', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 获取对应省市上报故障数详情
export const getReportFaultCard = (data: any) => {
    return request('faultReport/getReportFaultCard', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const getNoticeRecord = (data: any) => {
    return request('faultScheduling/queryNoticeRecord', {
        type: 'post',
        baseUrlType: 'noticeUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data,
    });
};
