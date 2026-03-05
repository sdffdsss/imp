import request from '@Common/api';
import qs from 'qs';

/**
 * @description: 获取班组列表
 * @param {*}
 * @return {*}
 */
export const getGroupList = (data) => {
    return request('group/findList', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: true,
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data,
    });
};

/**
 * @description: 获取单个班组信息
 * @param {*}
 * @return {*}
 */
export const getGroupInfo = (data) => {
    return request('group/findGroupDetail', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取单个班组信息
 * @param {*}
 * @return {*}
 */
export const deleteGroup = (data, params) => {
    return request('group/deleteGroupOne', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        handlers: {
            params,
        },
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
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取地市信息
 * @param {*}
 * @return {*}
 */
export const getRegionList = (data) => {
    return request('group/findProvinceRegions', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取监控中心列表
 * @param {*}
 * @return {*}
 */
export const getCenterList = (data) => {
    return request('v1/monitor-center/selectData', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取用户列表
 * @param {*}
 * @return {*}
 */
export const getUserList = (data) => {
    return request('group/findUserInfoList', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取所有过滤器
 * @param {*}
 * @return {*}
 */
export const getAllFilter = (queryParam) => {
    return request(
        `alarmmodel/filter/v1/filters?${qs.stringify(queryParam, {
            arrayFormat: 'indices',
            encode: true,
        })}`,
        {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
        },
    );
};

/**
 * @description: 保存新班组信息
 * @param {*}
 * @return {*}
 */
export const saveGroupInfo = (data, params) => {
    return request('group/saveOneGroup', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        handlers: {
            params,
        },
    });
};

/**
 * @description: 检查是否重名
 * @param {*}
 * @return {*}
 */
export const checkGroupName = (data) => {
    return request('group/checkGroupName', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取自定义视图
 * @param {*}
 * @return {*}
 */
export const getCustomMonitorViews = (data) => {
    return request('v1/monitor-view', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: '获取自定义视图失败',
        showSuccessMessage: false,
        data,
    });
};

// 获取班次
export const getRule = (data) => {
    return request('workShiftRule/getRule', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: 'false',
        showSuccessMessage: false,
        data,
    });
};
// 编辑班次
export const updateRule = (data) => {
    return request('workShiftRule/saveRule', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: 'false',
        showSuccessMessage: false,
        data,
    });
};
// 根据专业查询组件模块
export const getGropProfessionalModule = (data) => {
    return request(`group/getProfessionalModule`, {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
