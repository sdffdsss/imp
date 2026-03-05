import request from '@Common/api';

// 查询
export const getDutyBusinessFaultManagement = (data) => {
    return request(`shiftofdutyBusinessChangeShifts/getBusinessFailuresList/platform`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
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

/**
 * 上传文件信息
 * @param {*} data
 * @returns
 */
export const addFaultFileFunc = (data) => {
    return request(`shiftofdutyBusinessFaultManagement/addfaultReport`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * 上传文件信息
 * @param {*} data
 * @returns
 */
export const addFileFunc = (data) => {
    return request(`shiftofdutyBusinessFaultManagement/addFile`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * 下载文件
 * @returns
 */
export const downLoadFileFunc = (fileId) => {
    return request(`networkFault/downFile?fileId=${fileId}`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
    });
};

/**
 * 删除文件信息
 * @param {*} fileId
 * @returns
 */
export const deleteFileFunc = (fileId) => {
    return request(`shiftofdutyBusinessFaultManagement/delFile?fileId=${fileId}`, {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
    });
};
