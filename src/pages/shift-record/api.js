import request from '@Common/api';

/**
 * @description: 换班记录查询
 * @param {*}
 * @return {*}
 */
export const queryChangeShiftLog = (data) => {
    return request('schedule/queryChangeShiftLog', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: true,
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data,
    });
};
