import request from '@Common/api';

/**
 * @description: 获取省份列表
 * @param n*o
 * @return n*o
 */

export const getProvinces = (data) => {
    return request('group/findProvinces', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取省份数据失败',
        data,
    });
};

/**
 * @description: 获取经验库列表
 * @param data
 * @return
 */
export const getAlarmAdvice = (data) => {
    return request('v1/alarmAdvice', {
        type: 'get',
        baseUrlType: 'experienceUrl',
        data,
    });
};

/**
 * @description: 删除经验库
 * @param id
 * @return
 */
export const deleteAlarmAdvice = (id, params) => {
    return request(`v1/alarmAdvice/${id}`, {
        type: 'delete',
        baseUrlType: 'experienceUrl',
        showSuccessMessage: false,
        defaultSuccessMessage: '删除成功',
        defaultErrorMessage: '删除失败',
        handlers: {
            params,
        },
    });
};

/**
 * @description: 下载模版文件
 * @param n*o
 * @return n*o
 */
export const downloadAlarmAdvice = () => {
    return request('v1/alarmAdvice/exportTemplate', {
        type: 'get',
        baseUrlType: 'experienceUrl',
        showSuccessMessage: false,
        defaultSuccessMessage: '导出成功',
        defaultErrorMessage: '导出失败',
    });
};

/**
 * @description: 导入文件
 * @param n*o
 * @return n*o
 */
export const importAlarmAdvice = (data) => {
    return request('v1/alarmAdvice/import', {
        type: 'post',
        baseUrlType: 'experienceUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '导入失败',
        data,
    });
};

/**
 * @description: 导出
 * @param n*o
 * @return n*o
 */
export const exportAlarmAdvice = (data) => {
    return request('v1/alarmAdvice/export', {
        type: 'get',
        baseUrlType: 'experienceUrl',
        showSuccessMessage: false,
        defaultSuccessMessage: '导出成功',
        defaultErrorMessage: '导出失败',
        data,
    });
};

/**
 * @description: 添加告警经验
 * @param n*o
 * @return n*o
 */
export const addNewAlarmAdvice = (data, params) => {
    return request('v1/alarmAdvice', {
        type: 'post',
        baseUrlType: 'experienceUrl',
        showSuccessMessage: false,
        defaultSuccessMessage: '添加成功',
        defaultErrorMessage: '添加失败',
        data,
        handlers: {
            params,
        },
    });
};

/**
 * @description: 编辑告警经验
 * @param n*o
 * @return n*o
 */
export const editNewAlarmAdvice = (id, data, params) => {
    return request(`v1/alarmAdvice/${id}`, {
        type: 'patch',
        baseUrlType: 'experienceUrl',
        showSuccessMessage: false,
        defaultSuccessMessage: '编辑成功',
        defaultErrorMessage: '编辑失败',
        data,
        handlers: {
            params,
        },
    });
};
