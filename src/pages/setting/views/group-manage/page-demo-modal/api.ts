import request from '@Common/api';
// 查询演示模式-左统计图
export const DutyManStatistics = (data) => {
    return request(`group/onDutyManStatistics`, {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 查询演示模式-中统计图
export const GroupAndProfessionalStatistics = (data) => {
    return request(`group/groupAndProfessionalStatistics`, {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 查询演示模式-右统计图
export const GroupUserStatistics = (data) => {
    return request(`group/groupUserStatistics`, {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
