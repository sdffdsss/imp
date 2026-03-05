import request from '@Common/api';

export const queryEquipment = (data) => {
    return request('faultWorkSheet/queryEquipment', {
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        baseUrlType: 'filter',
        data,
    });
};
export const getRbiEnums = () => {
    return request('/fault/work/sheet/v1/getRbiEnums', {
        type: 'get',
        showSuccessMessage: false,
        showErrorMessage: false,
        baseUrlType: 'failureSheetUrl',
    });
};
