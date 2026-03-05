import request from '@Common/api';

// 确认用户是否在值班班组
export const judgeOnDuty = (data) => {
    return request('group/findGruopUserList', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
// 是否是值班长
export const getSergentUser = (data) => {
    return request('v1/monitor-center/validateShiftForeman', {
        type: 'get',
        baseUrlType: 'indexUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
