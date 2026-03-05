import request from '@Src/common/api';

/**
 * @description: 业务平台监控日报-数据获取
 * @param {*}
 * @return {*}
 */
export const getBusinessPlatformMonitorDaily = (data) => {
    return new Promise((resolve) => {
        request('/monitoringDailyReport/selectPage', {
            type: 'get',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * @description: 业务平台监控日报-数据新增
 * @param {*}
 * @return {*}
 */
export const saveBusinessPlatformMonitorDaily = (data) => {
    return new Promise((resolve) => {
        request('/monitoringDailyReport/save', {
            baseUrlType: 'dutyManagerUrl',
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * @description: 业务平台监控日报-数据修改
 * @param {*}
 * @return {*}
 */
export const updateBusinessPlatformMonitorDaily = (data) => {
    return new Promise((resolve) => {
        request('/monitoringDailyReport/update', {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};
/**
 * @description: 业务平台监控日报-数据删除
 * @param {*}
 * @return {*}
 */
export const deleteBusinessPlatformMonitorDaily = (params) => {
    return new Promise((resolve) => {
        request('monitoringDailyReport/delete', {
            type: 'delete',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            params,
        }).then((res) => {
            resolve(res);
        });
    });
};
/**
 * @description: 业务平台监控日报-数据导出
 * @param {*}
 * @return {*}
 */
export const exportBusinessPlatformMonitorDaily = (data) => {
    return new Promise((resolve) => {
        request('monitoringDailyReport/export', {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            responseType: 'blob',
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};
