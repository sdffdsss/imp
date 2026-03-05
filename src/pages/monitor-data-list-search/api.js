import request from '@Common/api';

/**
 * @description: 获取监控中心列表
 * @param {*}
 * @return {*}
 */
export const getCenterList = (data) => {
    return request('v1/monitor-center/selectData', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const updateWorkingScheduleBatch = (params) => {
    return new Promise((reslove) => {
        request('schedule/updateWorkingScheduleBatch', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            showErrorMessage: false,
            data: params,
        })
            .then((res) => {
                reslove(res);
            })
            .catch(() => {
                reslove(null);
            });
    });
};

// 编辑班次
export const updateRule = (data) => {
    return request('workShiftRule/saveRule', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: 'false',
        showSuccessMessage: false,
        data,
    });
};

// 自动排班
export const autoSchedule = (data) => {
    return request('schedule/updateWorkingScheduleAuto', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: 'false',
        showSuccessMessage: false,
        data,
    });
};
