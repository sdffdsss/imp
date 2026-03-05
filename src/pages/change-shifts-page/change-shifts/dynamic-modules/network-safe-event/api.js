import request from '@Src/common/api';

/**
 * @description: 网络安全事件-数据获取
 * @param {pageSize: 20,pluggingTimeStart: 2023-04-14%2014%3A44%3A46,pluggingTimeEnd: 2023-06-14%2014%3A44%3A46,provinceId: 0,pageNum: 1}
 * @return {*}
 */
export const getNetWorkSafeEvent = (data) => {
    return new Promise((resolve) => {
        return request('shiftofdutyNetworkSecurityEvents/changeShift', {
            type: 'GET',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * @description: 网络安全事件新增接口
 * @param {*}
 * @return {*}
 */
export const addNetWorkSafeEvent = (data) => {
    return new Promise((resolve) => {
        return request('/shiftofdutyNetworkSecurityEvents', {
            type: 'POST',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * @description: 网络安全事件编辑接口
 * @param {*}  id
 * @return {*}
 */
export const editNetWorkSafeEvent = (data) => {
    return new Promise((resolve) => {
        return request('/shiftofdutyNetworkSecurityEvents', {
            type: 'PATCH',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * @description: 网络安全事件：专业字典查询接口
 * @param {*}  id
 * @return {*}
 */
export const professionalDic = (data) => {
    return request('/group/getProfessionalType', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
