import request from '@Common/api';

/**
 * @description: 登录人员交接班状态
 * @param {*}
 * @return {*}
 */
export const getShiftingOfDutyStatus = (data) => {
    return request('shiftingOfDuty/status', {
        type: 'get',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 查询当前页面的详情
 * @param {*}
 * @return {*}
 */
export const queryShiftingOfDutyNow = (data) => {
    return request('shiftingOfDuty/queryShiftingOfDutyNow', {
        type: 'get',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 交班校验
 * @param {*}
 * @return {*}
 */
export const checkHandSubmit = (data) => {
    return request('shiftingOfDuty/checkHandSubmit', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 交班操作
 * @param {*}
 * @return {*}
 */
export const shiftingOfDutyHandOver = (data) => {
    return request('shiftingOfDuty/handOver', {
        type: 'PUT',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 接班校验
 * @param {*}
 * @return {*}
 */
export const checkTakeSubmit = (data) => {
    return request('shiftingOfDuty/checkTakeSubmit', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 接班操作
 * @param {*}
 * @return {*}
 */
export const shiftingOfDutyTakeOver = (data) => {
    return request('shiftingOfDuty/takeOver', {
        type: 'PUT',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 保存值班信息 保存后调用
 * @param {*}
 * @return {*}
 */
export const saveDutyMessage = (data) => {
    return request('shiftingOfDuty/saveDutyMessage', {
        type: 'PUT',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 删除值班记录
 * @param {*}
 * @return {*}
 */
export const deleteDutyMessage = (data) => {
    return request('shiftingOfDuty/deleteDutyMessage', {
        type: 'PUT',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description:演示展示数据
 * @param {*}
 * @return {*}
 */
export const getScheduleUserInfoStatic = (data) => {
    return request('schedule/getScheduleUserInfoStatic', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description:演示展示数据
 * @param {*}
 * @return {*}
 */
export const getDutyContentStatic = (data) => {
    return request('schedule/getDutyContentStatic', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
