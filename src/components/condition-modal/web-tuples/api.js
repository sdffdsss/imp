import request from '@Common/api';

/**
 * @description: 获取应用
 * @param {*} data
 * @return {*}
 */
export const getGroupDictDataByType = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/getGroupDictDataByType', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '查询数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                ...data
            }
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
 * @description: 服务端用来定位错误用的sessionId 不具有业务意义
 * @param {*} str
 * @return {*}
 */
export const getRequestSessionId = (str = '') => {
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
                ...data
            }
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};
