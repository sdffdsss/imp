import request from '@Common/api';

export const getTeamGroups = (data) => {
    return request('alarm/mteam/v1/groups', {
        data,
        type: 'get',
        showSuccessMessage: false,
        showErrorMessage: false,
        baseUrlType: 'overViewUrl',
    });
};
export const getVisualMonitoringData = (data) => {
    return request('alarm/visual-monitoring/v1/getVisualMonitoringData', {
        data,
        type: 'get',
        showSuccessMessage: false,
        showErrorMessage: false,
        baseUrlType: 'overViewUrl',
    });
};

/**
 * @description: 查询资源统计数据
 * @param {*}
 * @return {*}
 */
export const findGroupByUser = (data) => {
    return request('schedule/findGroupByUser', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
