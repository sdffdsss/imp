import request from '@Src/common/api';

// 获取工作记录模板
export const getGroupWorkRecorderTemplateApi = (data) => {
    return request('shiftingOfDuty/getGroupWorkRecorderTemplate', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
// 设置默认工作记录模板
export const setDefaultWorkRecorderTemplateApi = (data) => {
    return request('shiftingOfDuty/setDefaultWorkRecorderTemplate', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
// 删除工作记录模板
export const deleteGroupWorkRecorderTemplateApi = (data) => {
    return request('shiftingOfDuty/deleteGroupWorkRecorderTemplate', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
// 保存工作记录模板
export const saveGroupWorkRecorderTemplateApi = (data) => {
    return request('shiftingOfDuty/saveGroupWorkRecorderTemplate', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
