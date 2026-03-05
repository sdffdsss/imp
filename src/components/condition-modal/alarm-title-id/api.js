import request from '@Common/api';

/**
 * @description: 获取告警标题分页数据数据
 * @param {*} data
 * @return {*}
 */
export const getAlarmTitleList = (data) => {
    return new Promise((resolve, reject) => {
        request('paasquery/queryAlarmTitle', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'filter',
            data: {
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};
/**
 * @description: 获取告警标题数据，按照条件ID
 * @param {*} data
 * @return {*}
 */
export const saveAlarmTitleListByTitleIds = (list) => {
    return new Promise((resolve, reject) => {
        request('alarmmodel/field/v1/saveAlarmTitleList', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'filterUrl',
            data: list,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};
/**
 * @description: 获取告警标题数据，按照条件ID
 * @param {*} data
 * @return {*}
 */
export const getAlarmTitleListByTitleIds = (ids) => {
    return new Promise((resolve, reject) => {
        request('alarmmodel/field/v1/getAlarmTitleListByTitleIds', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'filterUrl',
            data: ids,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};
/**
 * @description: 获取机房数据，按照条件ID
 * @param {*} data
 * @return {*}
 */
export const getSiteNoList = (data) => {
    return new Promise((resolve, reject) => {
        request('alarmmodel/field/v1/getSiteNoList', {
            type: 'get',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'filterUrl',
            data: {
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};
/**
 * @description: 获取机房数据，按照条件ID
 * @param {*} data
 * @return {*}
 */
export const getSiteNoListBySiteIds = (ids) => {
    return new Promise((resolve, reject) => {
        request('alarmmodel/field/v1/getSiteNoListBySiteIds', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'filterUrl',
            data: ids,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};
