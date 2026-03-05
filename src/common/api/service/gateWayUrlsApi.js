import request from '@Src/common/api';

/**
 * 客户端根据gateway返回的流水服务地址连接对应大区的流水服务
 * @returns
 */
const getGateWaysUrl = (windowInfos) => {
    const serviceName = 'cloud.view.server-imc';
    return request(`gateway/windowLocations`, {
        type: 'post',
        baseUrlType: 'gatewayUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: { serviceName, windowInfos },
    });
};

/**
 * 根据告警范围获取对应地址gateWay
 */
const gateWaysUrl = async (windowInfos, gateWayFlag) => {
    if (!gateWayFlag) {
        return;
    }

    let params = windowInfos.map((item) => {
        const { windowId, viewScopeId } = item;
        let windowInfo = { windowId, zoneScopeId: viewScopeId };
        item = windowInfo;
        return item;
    });

    const res = await getGateWaysUrl(params);

    const { data, code } = res;
    if (code === 0 && data?.length > 0 && windowInfos?.length > 0) {
        windowInfos.map((window) => {
            const { windowId } = window;
            const temp = data?.filter((item) => {
                return item.windowId === windowId;
            });
            window['gateUrl'] = temp[0]?.['location'];
            return window;
        });
    }
    return windowInfos;
};

export { gateWaysUrl, getGateWaysUrl };
