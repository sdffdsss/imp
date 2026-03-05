import request from '@Common/api';
// 查询
export const getAttendanceOnDuty = (data) => {
    return request(`attendanceOnDuty`, {
        type: 'get',
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
/**
 * @description: 获取班组信息
 * @param {*}
 * @return {*}
 */
export const getGroupList = (data) => {
    return request('group/findGroupList', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: '获取班组数据失败',
        showSuccessMessage: false,
        data,
    });
};

/**
 * 值班考勤导出--高勇提供
 * @param
 * @returns
 */
export const exportAttendanceOnDuty = (data) => {
    return request('attendanceOnDuty/export', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: '导出失败',
        showSuccessMessage: false,
        responseType: 'blob',
        data,
    });
};
export const getKpiQueryApi = (params) => {
    return request('attendanceOnDuty/kpiQuery', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};
export const faultReportExportApi = (data) => {
    return request('attendanceOnDuty/faultReportExport', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data,
    });
};
