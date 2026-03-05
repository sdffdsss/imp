import request from '@Common/api';
// 查询
export const getAlarmOptimizationManagement = (data) => {
    return request(`shiftofdutyAlarmOptimization/changeShift`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 新增
export const addAlarmOptimizationManagement = (data) => {
    return request(`shiftofdutyAlarmOptimization`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 编辑
export const editAlarmOptimizationManagement = (data) => {
    return request(`shiftofdutyAlarmOptimization`, {
        type: 'patch',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 删除
export const deleteAlarmOptimizationManagement = (data) => {
    return request(`shiftofdutyAlarmOptimization`, {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 导出
export const exportAlarmOptimizationManagement = (data) => {
    return request(`shiftofdutyAlarmOptimization/export`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data,
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
/**
 * @description: 获取监控班组专业属性字典值
 * @param {*}
 * @return {*}
 */
export const getProfessionalTypeList = (data) => {
    return request('group/getProfessionalType', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: '获取监控班组专业数据失败',
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 下载模版文件
 * @param
 * @return
 */
export const downloadAlarmOptimization = () => {
    return request('shiftofdutyAlarmOptimization/downloadTemplate', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        defaultSuccessMessage: '导出成功',
        defaultErrorMessage: '导出失败',
        responseType: 'blob',
    });
};

/**
 * @description: 导入文件
 * @param
 * @return
 */
export const importAlarmAdvice = (data) => {
    return request('shiftofdutyAlarmOptimization/import', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '导入失败',
        data,
    });
};
/**
 * @description: 上传附件文件
 * @param
 * @return
 */
export const uploadAlarmOptimization = (data) => {
    return request('shiftofdutyAlarmOptimization/uploadFile', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '导入失败',
        data,
    });
};
