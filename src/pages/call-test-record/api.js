import request from '@Common/api';
// 获取拨测列头
export const getCallTestRecordTableColumns = (data) => {
    return request(`shiftofdutyDialRecord/header`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 获取拨测列表
export const getCallTestRecord = (data) => {
    return request(`shiftofdutyDialRecord`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 编辑拨测数据
export const setCallTestRecord = (data) => {
    return request(`shiftofdutyDialRecord`, {
        type: 'patch',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
