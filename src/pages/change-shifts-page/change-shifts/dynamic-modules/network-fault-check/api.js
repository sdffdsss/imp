import request from '@Src/common/api';

/**
 * @description: 网络故障（自查）-核心网数据获取
 * @param {*}
 * @return {*}
 */
export const getNetworkFaultCheckCoreNetWork = (data) => {
    return new Promise((resolve) => {
        return request(`networkFault/findOnDutyFaultCore`, {
            type: 'get',
            baseUrlType: 'dutyManagerUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * @description: 网络故障（自查）-核心网数据编辑
 * @param {*}
 * @return {*}
 */
export const editNetworkFaultCheckCoreNetWork = (data) => {
    return new Promise((resolve) => {
        return request(`networkFault/updateCore`, {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * @description: 网络故障（自查）-核心网数据新增
 * @param {*}
 * @return {*}
 */
export const addNetworkFaultCheckCoreNetWork = (data) => {
    return new Promise((resolve) => {
        return request(`networkFault/addCore`, {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * 网络故障自查 获取非核心网数据
 * @param {*} data
 * @returns
 */
export const getNetworkFaultCheckNotCore = (data) => {
    return new Promise((resolve) => {
        return request(`networkFault/findOnDutyFaultUnite`, {
            type: 'get',
            baseUrlType: 'dutyManagerUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * @description: 网络故障（自查）-非核心网数据编辑
 * @param {*}
 * @return {*}
 */
export const editNetworkFaultCheckNotCore = (data) => {
    return new Promise((resolve) => {
        return request(`networkFault/updateUnite`, {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * @description: 网络故障（自查）-非核心网数据新增
 * @param {*}
 * @return {*}
 */
export const addNetworkFaultCheckNotCore = (data) => {
    return new Promise((resolve) => {
        return request(`networkFault/addUnite`, {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
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

/**
 * 获取枚举值
 * @returns
 */
export const getSelectList = (params) => {
    return request(`networkFault/dict`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: params,
    });
};
