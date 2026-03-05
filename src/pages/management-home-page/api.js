import request from '@Common/api';

/**
 * @description: 获取省份列表
 * @param n*o
 * @return n*o
 */

export const findScheduleByUser = (data) => {
    return request('schedule/findScheduleByUser', {
        type: 'POST',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取值班数据失败',
        data,
    });
};

export const getUserInfo = (userId) => {
    return request(`api/users/${userId}/loginTime`, {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
    });
};

export const getUserCount = () => {
    return request(`bss/api/online/users/count`, {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
    });
};

/**
 * @description: 登录人员交接班状态
 * @param {*}
 * @return {*}
 */
export const getShiftingOfDutyStatus = (data) => {
    return request('shiftingOfDuty/status', {
        type: 'get',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 登录人员交接班状态
 * @param {*}
 * @return {*}
 */
export const queryShiftingOfDutyNow = (data) => {
    return request('shiftingOfDuty/queryShiftingOfDutyNow', {
        type: 'GET',
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
