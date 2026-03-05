import request from '@Common/api';
// 查询
export const getDutyBusinessFaultManagement = (data) => {
    return request(`shiftofdutyBusinessChangeShifts/getBusinessFailuresList`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
