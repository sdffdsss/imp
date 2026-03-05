import request from '@Common/api';

export interface FaultParams {
    faultName?: string;
    level?: number;
    occurTime?: string;
    pageSize?: number;
    current?: number;
}

// 获取专业枚举
export const getEnumApi = (data) => {
    return request('dict/getDictByFieldNames', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getPageList = (data) => {
    return request('fault/centralization/pageList', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const deleteFault = (id) => {
    return request(`fault/centralization/delete/${id}`, {
        type: 'delete',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
    });
};

export const addFault = (data) => {
    return request('fault/centralization/add', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const addNoFault = (data) => {
    return request('fault/centralization/addNoFault', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const updateFault = (data) => {
    return request('fault/centralization/update', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getAllZones = () => {
    return request('api/zones', {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        showErrorMessage: true,
        showSuccessMessage: false,
    });
};

export const getImportTemplate = () => {
    return request(`fault/centralization/downloadImportTemplate`, {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
    });
};

export const importFileApi = (reportProvince, userId, data) => {
    return request(`fault/centralization/import?reportProvince=${reportProvince}&creator=${userId}`, {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const downloadReasonApi = (fileName) => {
    return request(`fault/centralization/downloadErrorExcel?fileName=${fileName}`, {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
    });
};

export const downloadExportFile = (data) => {
    return request(`fault/centralization/downloadExportFile`, {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data,
    });
};

export const getExportProgressApi = (data) => {
    return request('fault/centralization/getProcess', {
        type: 'get',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        showErrorMessage: false,
        data,
    });
};

export const exportApi = (data) => {
    return request('fault/centralization/exportAsync', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        showErrorMessage: false,
        data,
    });
};

export const getRegionListApi = (data) => {
    return request('group/findProvinceRegions', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        showErrorMessage: false,
        data,
    });
};
export const deleteProcessApi = (params) => {
    return request('fault/centralization/deleteProcess', {
        type: 'get',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        showErrorMessage: false,
        params,
    });
};
// 审核并保存
export const approvalAndSaveApi = (data) => {
    return request('fault/centralization/approvalAndSave', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 审核
export const approvalApi = (data) => {
    return request('fault/centralization/approval', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 获取用户专业配置
export const getUserConfigApi = (data) => {
    return request('fault/centralization/getUserConfig', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const approvalBatchApi = (data) => {
    return request('fault/centralization/approvalBatch', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        showErrorMessage: false,
        data,
    });
};
export const archivedStateEnableApi = () => {
    return request('fault/centralization/archivedStateEnable', {
        type: 'get',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        showErrorMessage: false,
    });
};
export const saveAsDraft = (data) => {
    return request('fault/centralization/saveAsDraft', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 获取专业联系人
export const getContactApi = (data) => {
    return request('fault/centralization/getProfessionContact', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 批量删除
export const deleteBatchApi = (data) => {
    return request('fault/centralization/deleteBatch', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getSiteList = (data) => {
    return request('fault/centralization/getSiteList', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 检查接口3.0
export const checkSheetNoApi = (data) => {
    return request('fault/centralization/checkSheetNo', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 获取派单专业和工单来源枚举
export const getSheetEnumApi = (data) => {
    return request('unicom/dict/getDictByFieldNames', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 获取工单列表
export const searchSheetNoApi = (data) => {
    return request('fault/centralization/searchSheetNo', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};