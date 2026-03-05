import request from '@Common/api';

const BASE_URL = 'dutyManagerUrl';
/**
 * @description: 网络安全事件删除接口
 * @param {*}  id
 * @return {*}
 */
const deleteRecord = (data) => {
    return request('/shiftofdutyNetworkSecurityEvents', {
        type: 'DELETE',
        baseUrlType: BASE_URL,
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 网络安全事件新增接口
 * @param {*}
 * @return {*}
 */
const addRecord = (data) => {
    return request('/shiftofdutyNetworkSecurityEvents', {
        type: 'POST',
        baseUrlType: BASE_URL,
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 网络安全事件编辑接口
 * @param {*}  id
 * @return {*}
 */
const editRecord = (data) => {
    return request('/shiftofdutyNetworkSecurityEvents', {
        type: 'PATCH',
        baseUrlType: BASE_URL,
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 网络安全事件列表查询接口
 * @param {*}  id
 * @return {*}
 */
const list = (data) => {
    return request('/shiftofdutyNetworkSecurityEvents', {
        type: 'GET',
        baseUrlType: BASE_URL,
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 网络安全事件:记录导出接口
 * @param {*}  id
 * @return {*}
 */
const exportRecord = (data) => {
    return request('/shiftofdutyNetworkSecurityEvents/export', {
        type: 'POST',
        baseUrlType: BASE_URL,
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
        responseType: 'blob',
    });
};

/**
 * @description: 网络安全事件:单条记录详情查询接口
 * @param {*}  id
 * @return {*}
 */
const detail = (data) => {
    return request(`/shiftofdutyNetworkSecurityEvents/{${data}}`, {
        type: 'POST',
        baseUrlType: BASE_URL,
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 网络安全事件：专业字典查询接口
 * @param {*}  id
 * @return {*}
 */
const professionalDic = (data) => {
    return request('/group/getProfessionalType', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

export default {
    deleteRecord,
    addRecord,
    editRecord,
    list,
    detail,
    professionalDic,
    exportRecord,
};
