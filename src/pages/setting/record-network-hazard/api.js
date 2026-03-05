import request from '@Common/api';
// 查询
export const getNetworkHazardRecord = (data) => {
    return request(`networkHazardRecord/queryRecordByPage`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 新增
export const addNetworkHazardRecord = (data) => {
    return request(`networkHazardRecord/addHazardRecord`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 编辑
export const editNetworkHazardRecord = (data) => {
    return request(`networkHazardRecord/updateHazardRecordById`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 删除
export const deleteNetworkHazardRecord = (data) => {
    return request(`networkHazardRecord/deleteHazardRecordById`, {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params: data,
    });
};

/**
 * @description: 获取省份信息
 * @param {*}
 * @return {*}
 */
export const getProvinceList = (data) => {
    return request('group/findProvinces', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: '获取省份数据失败',
        showSuccessMessage: false,
        data,
    });
};

// 导出
export const networkHazardRecord = (data) => {
    return request(`networkHazardRecord/export`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        params: data,
    });
};

export const getProfessional = (data) => {
    return request('networkHazardRecord/getProfessionalType', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: '获取专业数据失败',
        showSuccessMessage: false,
        data,
    });
};

export const getVendorApi = (data) => {
    return request('networkHazardRecord/getVendor', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: '获取厂家数据失败',
        showSuccessMessage: false,
    });
};
