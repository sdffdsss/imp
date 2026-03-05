import request from '@Common/api';

/**
 * @description: 获取全部班组
 * @param {*}
 * @return {*}
 */
export const getGroupList = (data) => {
    return request('group/findGroupList', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: true,
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data,
    });
};

/**
 * @description: 获取指定班组关联的班次
 * @param {*}
 * @return {*}
 */
export const getRuleByDate = (data) => {
    return request('workShiftRule/getRuleByDate', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: true,
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data,
    });
};

/**
 * @description: 获取指定班组关联的班次
 * @param {*}
 * @return {*}
 */
export const findUserByRule = (data) => {
    return request('schedule/findUserByRule', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: true,
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data,
    });
};

/**
 * @description: 获取指定班组关联的班次
 * @param {*}
 * @return {*}
 */
export const changeShift = (data) => {
    return request('schedule/changeShift', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: true,
        showSuccessMessage: false,
        defaultErrorMessage: '换班失败',
        data,
    });
};
