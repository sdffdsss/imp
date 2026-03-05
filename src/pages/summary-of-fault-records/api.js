import request from '@Common/api';
// 查询
export const getTemporaryRoute = (data) => {
    return request(`faultRecord/pageList`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 新增
export const addTemporaryRoute = (data) => {
    return request(`faultRecord/insert`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 编辑
export const editTemporaryRoute = (data) => {
    return request(`faultRecord/updateWithNull`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 删除
export const deleteTemporaryRoute = (data) => {
    return request(`faultRecord/deleteById?id=${data.id}&operator=${data.operator}`, {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
    });
};
// 导出
export const exportTemporaryRoute = (data) => {
    return request(`faultRecord/exportFaultRecord${data.dataProvince ? `?dataProvince=${data.dataProvince}` : ''}`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data,
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
            userId: userId,
            configType: configType
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
    return request('group/findProvinces', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: '获取省份数据失败',
        showSuccessMessage: false,
        data,
    });
};

//获取专业列表数据
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
    return request('faultRecord/getDict', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: '获取省份数据失败',
        showSuccessMessage: false,
        data: {
            dictName: dictName,
        },
    });
};

export const getDeviceAndfault = (professionalType, faultAttribute, dictName) => {
    return request('faultRecord/getRelationByStep', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: '获取省份数据失败',
        showSuccessMessage: false,
        data: {
            professionalType: professionalType,
            dictName: dictName,
            faultAttribute: faultAttribute,
        },
    });
};

export const getGroupSourceList = (professioalId, operateUser) => {
    return request('group/findGroupByCenter', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: '获取班组来源失败',
        showSuccessMessage: false,
        data: {
            professioalId: professioalId,
            operateUser: operateUser,
        },
    });
};

export const getSelectCardTypeList = (dictName) => {
    return request('dict/getDictByFieldNames', {
        type: 'post',
        baseUrlType: 'reinsuranceRecordUrl',
        showErrorMessage: '获取省份数据失败',
        showSuccessMessage: false,
        data: [dictName],
    });
};

/**
 * @description: 故障记录操作历史查询
 * @param {*}
 * @return {*}
 */
export const faultOperateHistoryList = (data) => {
    return request('faultOperateHistory/pageList', {
        type: 'POST',
        baseUrlType: 'dutyManagerUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
