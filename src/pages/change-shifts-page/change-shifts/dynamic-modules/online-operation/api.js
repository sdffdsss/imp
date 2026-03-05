import request from '@Src/common/api';

/**
 * @description: 在线操作-数据获取
 * @param {*}
 * @return {*}
 */
export const getNetWorkSafeEvent = (data) => {
    return new Promise((resolve) => {
        request('shiftingOfDuty/status', {
            type: 'get',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};
