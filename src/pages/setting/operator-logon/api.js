import request from '@Common/api';
// 查询
export const getOperationRegistration = (data) => {
    return request(`operationRegistration`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 新增
export const addOperationRegistration = (data) => {
    return request(`operationRegistration`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 编辑
export const editOperationRegistration = (data) => {
    return request(`operationRegistration`, {
        type: 'patch',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 删除
export const deleteOperationRegistration = (data) => {
    return request(`operationRegistration`, {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 导出
export const exportOperationRegistration = (data) => {
    return request(`operationRegistration/export`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
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
 * @description: 获取操作登记专业属性字典值
 * @param {*}
 * @return {*}
 */
export const getProfessionalTypeList = (data) => {
    return request('group/getProfessionalType', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: '获取操作登记专业数据失败',
        showSuccessMessage: false,
        data,
    });
};
