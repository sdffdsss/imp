import request from '@Common/api';

const getRequestSessionId = (str = '') => {
    return new Date().getTime().toString() + str;
};

/**
 * @description: 获取专业组下专业列表数据
 * @param {*} data
 * @return {*}
 */
export const getGroupsData = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/searchGroups', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('searchGroups'),
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
 * @description: 获取网元组先的网元字段
 * @param {*}
 * @return {*}
 */
export const searchSpecificNeIds = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/searchSpecificNeIds', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('searchSpecificNeIds'),
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
 * @description: 查询专业组表头字段
 * @param {*} data
 * @return {*}
 */
export const searchGroupFields = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/getNetWorkGroupField', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('getNetWorkGroupField'),
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
