import request from '@Common/api';

/**
 * @description: 获取监控视图模版
 * @param {*}
 * @return {*}
 */
export const getMonitorView = (data) => {
    return request(`v1/monitor-views/new/${data}`, {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: true,
    });
};

/**
 * @description: 获取默认监控视图
 * @param {*}
 * @return {*}
 */

export const getDefaultViews = (userId, provineceId) => {
    const requestUrl = provineceId
        ? `v1/monitor-view/getMonitorViewByGroup/${userId}/${provineceId}`
        : `v1/monitor-view/getMonitorViewByGroup/${userId}`;
    return request(requestUrl, {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: true,
    });
};
