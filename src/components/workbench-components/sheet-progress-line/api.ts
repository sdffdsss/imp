import request from '@Common/api';
// 告警采集统计接口
export const getViewData = (data) => {
    return request(`paasquery/queryOmcCollectList`, {
        type: 'get',
        baseUrlType: 'filter',
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
        data: data,
    });
};
export const getViewNewData = (data) => {
    return request(`api/canary/collect`, {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
        data: data,
    });
};
