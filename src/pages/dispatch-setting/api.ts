import request from '@Common/api';

export const getProvinceApi = (userId) => {
    const params = {
        modelId: 2,
        dictName: 'province_id',
        value: '',
        current: 1,
        pageSize: 50,
        creator: userId,
        hasAdditionZone: false,
        clientRequestInfo: JSON.stringify({
            clientRequestId: 'nomean',
            clientToken: localStorage.getItem('access_token'),
        }),
    };
    return request('alarmmodel/field/v1/dict/entry', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};
export const professionalTypeApi = (userId) => {
    const params = {
        modelId: 2,
        dictName: 'professional_type',
        value: '',
        current: 1,
        pageSize: 2500,
        creator: userId,
        clientRequestInfo: JSON.stringify({
            clientRequestId: 'nomean',
            clientToken: localStorage.getItem('access_token'),
        }),
    };
    return request('alarmmodel/field/v1/dict/entry', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};
export const networkTypeTopApi = (userId) => {
    const params = {
        modelId: 2,
        dictName: 'network_type_top',
        value: '',
        current: 1,
        pageSize: 2500,
        creator: userId,
        clientRequestInfo: JSON.stringify({
            clientRequestId: 'nomean',
            clientToken: localStorage.getItem('access_token'),
        }),
    };
    return request('alarmmodel/field/v1/dict/entry', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};
export const getregionApi = (provinceId, userId) => {
    const params = {
        parentRegionId: provinceId,
        creator: userId,
    };
    return request('group/findProvinceRegions', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        data: params,
    });
};
export const getRequsetApi = (params) => {
    return request('alarmmodel/dispatchConfig/v1/getDispatchManualConfig', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};
export const addDispatchManualConfigApi = (params) => {
    return request('alarmmodel/dispatchConfig/v1/addDispatchManualConfig', {
        type: 'post',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};
export const getDispatchAutoPublishApi = (params) => {
    return request('alarmmodel/dispatchConfig/v1/getDispatchAutoPublishConfig', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};
export const editDispatchManualConfigApi = (params) => {
    return request('alarmmodel/dispatchConfig/v1/editDispatchManualConfig', {
        type: 'post',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};

export const deleteDispatchManualConfigApi = (params) => {
    return request(`alarmmodel/dispatchConfig/v1/deleteDispatchManualConfig`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: true,
        defaultSuccessMessage: '删除成功',
        data: params,
    });
};

export const addDispatchAutoConfigApi = (params) => {
    return request(`alarmmodel/dispatchConfig/v1/addDispatchAutoConfig`, {
        type: 'post',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};
export const getDispatchAutoConfigApi = (configType) => {
    return request(`alarmmodel/dispatchConfig/v1/getDispatchAutoConfig`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: { configType },
    });
};

export const saveDispatchAutoConfigApi = (params) => {
    return request(`alarmmodel/dispatchConfig/v1/addOrUpdateDispatchAutoConfig`, {
        type: 'post',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};

export const publishDispatchAutoConfigApi = (params) => {
    return request(`alarmmodel/dispatchConfig/v1/publishDispatchAutoConfig`, {
        type: 'post',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};
export const recoverDispatchAutoPublishConfigApi = (params) => {
    return request(`alarmmodel/dispatchConfig/v1/recoverDispatchAutoPublishConfig`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};
export const publishDispatchManualConfigApi = (configType) => {
    return request(`alarmmodel/dispatchConfig/v1/publishDispatchManualConfig`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: { configType },
    });
};
export const getParentNodeAPi = () => {
    return request(`alarmmodel/dispatchConfig/v1/getAutoDispatchConfigParentTreeNode`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: {},
    });
};
export const getChildrenNodeAPi = (params) => {
    return request(`alarmmodel/dispatchConfig/v1/getAutoDispatchConfigTreeNode`, {
        type: 'post',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};
export const getRuleDetailAPi = (params) => {
    return request(`alarmmodel/dispatchConfig/v1/getDispatchAutoPublishConfigDetail`, {
        type: 'post',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: params,
    });
};
export const deleteRuleAPi = (params) => {
    return request(`alarmmodel/dispatchConfig/v1/deleteDispatchAutoPublishConfigDetail`, {
        type: 'post',
        baseUrlType: 'filterUrl',
        showSuccessMessage: true,
        defaultSuccessMessage: '删除成功',
        data: params,
    });
};
export const deleteRuleHistoryAPi = (params) => {
    return request(`alarmmodel/dispatchConfig/v1/deleteDispatchAutoPublishConfig`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: true,
        defaultSuccessMessage: '删除成功',
        data: params,
    });
};
/**
 * @description: 获取过滤器信息
 * @param {*}
 * @return {*}
 */
export const getFilterInfo = (data) => {
    return request('alarmmodel/filter/v1/filter', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: {
            modelId: 2,
            ...data,
        },
    });
};
/**
 * @description: 保存过滤器
 * @param {*}
 * @return {*}
 */
export const saveFilter = (url, type, data, params) => {
    return request(url, {
        type,
        baseUrlType: 'filterUrl',
        data: {
            ...data,
            requestInfo: {
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            },
        },
        handlers: {
            params,
        },
    });
};
/**
 * @description: 获取省列表
 * @param {*}
 * @return {*}
 */
export const getProvinceData = async (userId, provinceId) => {
    return new Promise((reslove) => {
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: userId,
                provinceId,
            },
        })
            .then((res) => {
                reslove(res);
            })
            .catch(() => {
                return [];
            });
    });
};
export const modalTableApi = async (params) => {
    return new Promise((reslove) => {
        request('alarmmodel/dispatchConfig/v1/getDispatchManualUrl', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取列表数据失败',
            data: params,
        })
            .then((res) => {
                reslove(res);
            })
            .catch(() => {
                return [];
            });
    });
};
