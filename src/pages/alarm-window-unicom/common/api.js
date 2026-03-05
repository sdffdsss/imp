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

// 视图查询接口
export const getViewData = (data) => {
    return request(`v1/monitor-view/getMonitorViewByGroupId/${data}`, {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
    });
};

/**
 * 客户端根据gateway返回的流水服务地址连接对应大区的流水服务
 * @param {*} zoneId 这里传的归属省份
 * @returns
 */
export const getWay = (zoneId) => {
    return request(`gateway/service`, {
        type: 'get',
        baseUrlType: 'gatewayUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: {
            serviceName: 'cloud.view.server-imc',
            identifier: zoneId,
        },
    });
};
