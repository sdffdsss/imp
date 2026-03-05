import request from '@Common/api';
// 查询
export const getDutyBusinessFaultManagement = (data) => {
    return request(`shiftofdutyBusinessFaultManagement/selectBusinessList`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 查询-业务故障管理平台列表
export const getDutyBusinessFaultManagementPlatform = (data) => {
    return request(`shiftofdutyBusinessFaultManagement/selectBusinessList/platform`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 新增-业务故障管理平台列表
export const addDutyBusinessFaultManagementPlatform = (data) => {
    return request(`shiftofdutyBusinessFaultManagement/add/platform`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 修改-业务故障管理平台列表
export const updateDutyBusinessFaultManagementPlatform = (data) => {
    return request(`shiftofdutyBusinessFaultManagement/update/platform`, {
        type: 'put',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 删除-业务故障管理平台列表
export const deleteDutyBusinessFaultManagementPlatform = (data) => {
    return request(`shiftofdutyBusinessFaultManagement/delete/platform`, {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params: data,
    });
};
// 导出-业务故障管理平台列表
export const exportPlatform = (data) => {
    return request(`shiftofdutyBusinessFaultManagement/export/platform`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data,
    });
};
// 新增
export const addDutyBusinessFaultManagement = (data) => {
    return request(`shiftofdutyBusinessFaultManagement/add`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 编辑
export const editDutyBusinessFaultManagement = (data) => {
    return request(`shiftofdutyBusinessFaultManagement`, {
        type: 'put',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 删除
export const deleteDutyBusinessFaultManagement = (data) => {
    return request(`shiftofdutyBusinessFaultManagement?id=${data.id}`, {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        // data,
    });
};
// 导出
export const exportDutyBusinessFaultManagement = (data) => {
    return request(`shiftofdutyBusinessFaultManagement/exportBusinessPlatform`, {
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

//故障报告文件上传
// 上传文件信息
export const addFaultFileFunc = (data) => {
    return request(`shiftofdutyBusinessFaultManagement/addfaultReport`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

//附件上传
// 上传文件信息
export const addFileFunc = (data) => {
    return request(`shiftofdutyBusinessFaultManagement/addFile`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

//下载文件
export const downLoadFileFunc = (fileId) => {
    return request(`networkFault/downFile?fileId=${fileId}`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
    });
};

// 删除文件信息
export const deleteFileFunc = (fileId) => {
    return request(`shiftofdutyBusinessFaultManagement/delFile?fileId=${fileId}`, {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
    });
};
