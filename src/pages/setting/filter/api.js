import request from '@Common/api';
import qs from 'qs';

/**
 * @description: 获取过滤器接口
 * @param {*}
 * @return {*}
 */
export const getFilterList = (queryParam) => {
    return request(
        `alarmmodel/filter/v1/filters?${qs.stringify(queryParam, {
            arrayFormat: 'indices',
            encode: true,
        })}`,
        {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
        },
    );
};

/**
 * @description: 启停过滤器
 * @param {*} data
 * @param {*} type
 * @return {*}
 */
export const enableFilter = (type, data, params) => {
    console.log(data);
    return request(`alarmmodel/filter/v1/filter/${type}`, {
        type: 'put',
        baseUrlType: 'filterUrl',
        showErrorMessage: true,
        showSuccessMessage: true,
        defaultSuccessMessage: `${type === 'enable' ? '启用' : '停用'}成功`,
        data: {
            ...data,
            requestInfo: {
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            },
        },
        handlers: {
            params,
        },
    });
};

/**
 * @description: 获取过滤器信息
 * @param {*}
 * @return {*}
 */
export const getFilterInfo = (data) => {
    return request('alarmmodel/filter/v1/filter', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: {
            modelId: 2,
            ...data,
        },
    });
};

/**
 * @description: 获取历史版本
 * @param {*}
 * @return {*}
 */
export const getFilterHistory = (data) => {
    return request('alarmmodel/filter/v1/filter/history', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '读取历史版本失败',
        data: {
            ...data,
            modelId: 2,
        },
    });
};

/**
 * @description: 恢复历史版本
 * @param {*}
 * @return {*}
 */
export const rollbackHistory = (data) => {
    return request('alarmmodel/filter/v1/filter/rollback', {
        type: 'post',
        baseUrlType: 'filterUrl',
        defaultSuccessMessage: '恢复历史版本成功',
        defaultErrorMessage: '恢复历史版本失败',
        data: {
            ...data,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
            modelId: 2,
            requestInfo: {
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            },
        },
    });
};

/**
 * @description: 导出过滤器
 * @param {*}
 * @return {*}
 */
export const exportFilter = (data) => {
    return request('alarmmodel/filter/v1/filter/exports', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        responseType: 'blob',
        data: {
            ...data,
            modelId: 2,
        },
    });
};

/**
 * @description: 删除过滤器
 * @param {*}
 * @return {*}
 */
export const deleteFilter = (msg, data, params) => {
    return request('alarmmodel/filter/v1/filter', {
        type: 'delete',
        baseUrlType: 'filterUrl',
        defaultSuccessMessage: `${msg}删除成功`,
        data: {
            ...data,
            modelId: 2, // 所属模型ID
            requestInfo: {
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            },
        },
        handlers: {
            params,
        },
    });
};

/**
 * @description: 上传告警发声音频
 * @param {*}
 * @return {*}
 */

export const uploadAudio = (data) => {
    return request('filemanage/v1/user/uploads', {
        type: 'post',
        showSuccessMessage: false,
        defaultErrorMessage: '音频上传失败',
        baseUrlType: 'uploadProducitonUrl',
        data,
    }).catch(() => {
        return false;
    });
};

/**
 * @description: 获取假期字典值
 * @param {*}
 * @return {*}
 */
export const getHolidaysEnum = (param) => {
    return request(
        `alarmmodel/filter/v1/filter/dispatch/holidays?${qs.stringify(param, {
            arrayFormat: 'indices',
            encode: true,
        })}`,
        {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
        },
    );
};

/**
 * @description: 保存过滤器
 * @param {*}
 * @return {*}
 */
export const saveFilter = (url, type, data, params) => {
    return request(url, {
        type,
        baseUrlType: 'filterUrl',
        data: {
            ...data,
            requestInfo: {
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            },
        },
        handlers: {
            params,
        },
    });
};

/**
 * @description: 获取类型列表
 * @param {*}
 * @return {*}
 */
export const getTypeData = (data) => {
    return request('/alarmmodel/filter/type/v1/filterTypes', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: {
            modelId: 2,
            ...data,
        },
    });
};

/**
 * @description: 获取省列表
 * @param {*}
 * @return {*}
 */
export const getProvinceData = async (userId, provinceId) => {
    return new Promise((reslove) => {
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: userId,
                provinceId,
            },
        })
            .then((res) => {
                reslove(res);
            })
            .catch(() => {
                return [];
            });
    });
};

/**
 * @description: 获取角色列表
 */
export const getRolesDictionary = () => {
    return request('dict/queryDict', {
        type: 'get',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        defaultErrorMessage: '获取角色列表失败',
        data: {
            dictName: 'team_group_roles',
        },
    });
};

/**
 * @description: 获取短信专业
 */
export const getSmsDictionary = () => {
    return request('alarmmodel/filter/v1/smsMerge/field', {
        type: 'get',
        baseUrlType: 'alarmModelUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取角色列表失败',
        data: {},
    });
};
