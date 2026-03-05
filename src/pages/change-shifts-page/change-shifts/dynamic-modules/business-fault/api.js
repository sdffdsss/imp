import request from '@Common/api';

// 查询
export const getDutyBusinessFaultManagement = (data) => {
    return request(`shiftOfDutyBusinessFaultSheet/queryBusinessFaultSheet`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 保存
export const updateFaultSheet = (data) => {
    return request(`shiftOfDutyBusinessFaultSheet/updateBusinessFaultSheet`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
