import request from '@Src/common/api';

/**
 * @description: 无线基站大面积断站-数据获取
 * @param {*}
 * @return {*}
 */
export const getWirelessBaseStation = (data) => {
    return new Promise((resolve) => {
        request('/wireless/select', {
            type: 'get',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * @description: 无线基站大面积断站-数据新增
 * @param {*}
 * @return {*}
 */
export const saveWirelessBaseStation = (data) => {
    return new Promise((resolve) => {
        request('/wireless/save', {
            baseUrlType: 'dutyManagerUrl',
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * @description: 无线基站大面积断站-数据修改
 * @param {*}
 * @return {*}
 */
export const updateWirelessBaseStation = (data) => {
    return new Promise((resolve) => {
        request('/wireless/update', {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};
