import request from '@Common/api';
// 查询
export const getTemporaryRoute = (data) => {
    return new Promise((resolve) => {
        return request(`faultReportProcess/getFaultReportProcessPage`, {
            type: 'post',
            baseUrlType: 'fault',
            showErrorMessage: false,
            showSuccessMessage: false,
            data,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                resolve(e);
            });
    });
};

// 列设置查询
export const queryColumnConfig = (userId, configType) => {
    return request(`common/queryColumnConfig`, {
        type: 'get',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: {
            userId,
            configType,
        },
    }).then((res) => {
        if (res?.code === '200' && Array.isArray(res?.dataObject)) {
            return res.dataObject;
        }
        return [];
    });
};

/**
 * @description: 获取省份信息
 * @param {*}
 * @return {*}
 */
export const getProvinceList = (data) => {
    return new Promise((resolve) => {
        return request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showErrorMessage: '获取省份数据失败',
            showSuccessMessage: false,
            data,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                resolve(e);
            });
    });
};

// 获取专业列表数据
export const getDictEntry = (dictName, userId) => {
    return Promise.resolve(
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                pageSize: 2500,
                dictName,
                en: false,
                modelId: 2,
                creator: userId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        })
            .then((res) => {
                if (res && res.data && res.data.length) {
                    return res.data;
                }
                return [];
            })
            .catch(() => {
                return [];
            }),
    );
};

export const getSelectAllList = (dictName) => {
    return new Promise((resolve) => {
        return request('faultRecord/getDict', {
            type: 'get',
            baseUrlType: 'dutyManagerUrl',
            showErrorMessage: '获取省份数据失败',
            showSuccessMessage: false,
            data: {
                dictName,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                resolve(e);
            });
    });
};

export const getSelectCardTypeList = (dictName) => {
    return new Promise((resolve) => {
        return request('dict/getDictByFieldNames', {
            type: 'post',
            baseUrlType: 'reinsuranceRecordUrl',
            showErrorMessage: '获取省份数据失败',
            showSuccessMessage: false,
            data: [dictName],
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                resolve(e);
            });
    });
};

export const getFaultReportProcessCount = (data) => {
    return new Promise((resolve) => {
        return request(`faultReportProcess/getFaultReportProcessCount`, {
            type: 'post',
            baseUrlType: 'fault',
            showErrorMessage: false,
            showSuccessMessage: false,
            data,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                resolve(e);
            });
    });
};

/**
 * @description: 待阅-已读
 * @param {*}
 * @return {*}
 */

export const faultReportReadPending = (data) => {
    return request('faultReportProcess/readPending', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 上传附件
 * @param {*}
 * @return {*}
 */

export const updateReportFiles = (data) => {
    return request('faultReportProcess/uploadFile', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data,
    });
};

// 同步集中存档
export const syncCentralizationApi = (params) => {
    return request(`faultReport/syncCentralization`, {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};
