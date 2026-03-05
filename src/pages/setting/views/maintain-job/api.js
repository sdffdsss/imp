import request from '@Common/api';
// 查询
export const getTemporaryRoute = (data) => {
    return request(`group/findWorkingPlanRecord`, {
        type: 'post',
        baseUrlType: 'groupUrl',
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
    return request(`group/exportWorkingPlanRecord`, {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data: params,
    });
};

// 按班组和班次查询当天排班信息
export const findScheduleByWorkShiftId = (data) => {
    return request(`schedule/findScheduleByWorkShiftId`, {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 维护作业计划中上传附件
export const uploudWorkingPlanFile = (data) => {
    return request(`group/uploudWorkingPlanFile`, {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 维护作业计划中下载附件
export const dowloadWorkingPlanFile = (data) => {
    return request(`group/dowloadWorkingPlanFile`, {
        type: 'get',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        responseType: 'blob',
    });
};

// 维护作业计划中删除附件
export const deleteWorkingPlanFile = (params) => {
    return request(`group/deleteWorkingPlanFile`, {
        type: 'DELETE',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};
