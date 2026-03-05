import request from '@Common/api';

/**
 * @description: 获取班组列表
 * @param {*}
 * @return {*}
 */
export const getGroupListApi = (data) => {
    return request('group/findGroupList', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: true,
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data,
    });
};

/**
 * @description: 获取省份信息
 * @param {*}
 * @return {*}
 */
export const getProvinceList = (data) => {
    return request('group/findProvinces', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取监控中心列表
 * @param {*}
 * @return {*}
 */
export const getCenterListApi = (data) => {
    return request('v1/monitor-center/selectData', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取统计数据列表接口
 * @param {*}
 * @return {*}
 */
export const getShiftOfDutyStatisticsData = (data) => {
    return request('shiftOfDutyStatistics/queryShiftOfDutyStatistics', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取统计数据详情数据接口
 * @param {*}
 * @return {*}
 */
export const getShiftOfDutyStatisticsDetailData = (data) => {
    return request('shiftOfDutyStatistics/selectStatisticsDetails', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 导出统计数据详情数据接口
 * @param {*}
 * @return {*}
 */
export const exportShiftOfDutyStatisticsDetailData = (data) => {
    return request('shiftOfDutyStatistics/exportStatisticsDetails', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data,
    });
};
/**
 * @description: 统计值班人员值班情况
 * @param {*}
 * @return {*}
 */
export const selectDutyUserSumApi = (data) => {
    return request('shiftOfDutyStatistics/selectDutyUserSum', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
/**
 * @description: 统计值班人员值班情况导出
 * @param {*}
 * @return {*}
 */
export const exportDutyUserSumApi = (data) => {
    return request('shiftOfDutyStatistics/exportDutyUserSum', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data,
    });
};
/**
 * @description: 统计网络故障工单趋势图数据
 * @param {*}
 * @return {*}
 */
export const selectNetworkFaultTrendApi = (data) => {
    return request('shiftOfDutyStatistics/selectNetworkFaultTrend', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
