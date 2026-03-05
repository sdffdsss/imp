import request from '@Common/api';
export const getView = (queryParam) => {
    return request('v1/monitor-view', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        data: queryParam,
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
    });
};
export const getRegion = (parentZoneId) => {
    return request('bss/api/zones', {
        type: 'get',
        baseUrlType: 'userMangeUrl',
        data: {
            parentZoneId,
        },
        // 是否需要显示成功消息提醒
        showSuccessMessage: false,
        // 成功提醒内容
        defaultSuccessMessage: '保存成功',
        // 是否需要显示失败消息提醒
        showErrorMessage: false,
    });
};

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

/**
 * 客户端根据gateway返回的流水服务地址连接对应大区的流水服务
 * @returns
 */
export const getGateWaysUrl = (params) => {
    const serviceName = 'cloud.view.server-imc';
    let windowInfos = params.map((item) => {
        const { windowId, viewScopeId } = item;
        let windowInfo = { windowId, zoneScopeId: viewScopeId };
        item = windowInfo;
        return item;
    });
    return request(`gateway/windowLocations`, {
        type: 'post',
        baseUrlType: 'gatewayUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: { serviceName, windowInfos },
    });
};
