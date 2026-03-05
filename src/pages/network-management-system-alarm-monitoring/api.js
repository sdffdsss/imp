import request from '@Common/api';
// 查询
export const getTemporaryRoute = (data) => {
    return request(`nmsAlarmMonitor`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 保存
export const saveInfoRoute = (data) => {
    return request(`group/saveWorkingPlanRecord`, {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: true,
        showSuccessMessage: true,
        data,
    });
};

// 导出
export const exportTemporaryRoute = (params) => {
    return request(`nmsAlarmMonitor/export`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data: params,
    });
};

// 导出模板
export const exportTemporaryRouteTemplate = (params) => {
    return request(`nmsAlarmMonitor/getTemplate`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data: params,
    });
};

//导入文件

export const exportImportFile = (data) => {
    return request(`nmsAlarmMonitor/import`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: data,
    });
};
