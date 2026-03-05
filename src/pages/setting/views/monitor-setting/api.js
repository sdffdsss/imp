import request from '@Src/common/api';

// 获取监控中心列表
export const getMonitorCenter = (data) => {
    return request('v1/monitor-center', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 获取监控中心详情
export const getMonitorCenterDetail = (data, handlers) => {
    return request(`v1/monitor-center/${data.id}`, {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        handlers: {
            params: handlers,
        },
    });
};

// 新增监控中心
export const addMonitorCenter = (data, handlers) => {
    return request('v1/monitor-center', {
        type: 'post',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        handlers: {
            params: handlers,
        },
    });
};

// 编辑监控中心
export const editMonitorCenter = (data, handlers) => {
    return request('v1/monitor-center', {
        type: 'put',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        handlers: {
            params: handlers,
        },
    });
};

// 删除监控中心
export const deleteMonitorCenter = (data, params) => {
    return request(`v1/monitor-center`, {
        type: 'delete',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        handlers: {
            params,
        },
    });
};

// 删除监控中心校验
export const validateMonitorCenter = (data) => {
    return request(`v1/monitor-center/validateForDelete`, {
        type: 'get',
        baseUrlType: 'alarmModelUrl',
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
 * @description: 批量新建班组
 * @param {*}
 * @return {*}
 */
export const batchSaveGroupList = (data) => {
    return request('group/saveGroupBatch', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: true,
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data,
    });
};
