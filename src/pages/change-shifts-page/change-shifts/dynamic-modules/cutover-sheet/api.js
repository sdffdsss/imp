import request from '@Src/common/api';

/**
 * @description: 查询割接工单
 * @param {*}
 * @return {*}
 */
const getCutSheet = (data) => {
    return new Promise((reslove) => {
        request('shiftOfDutySheet/queryCuttingWorkSheet', {
            type: 'POST',
            baseUrlType: 'reinsuranceRecordUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};

const saveCutSheet = (data) => {
    return new Promise((reslove) => {
        request('shiftOfDutySheet/updateCuttingWorkSheet', {
            type: 'POST',
            baseUrlType: 'reinsuranceRecordUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};

const getTransmissionDetailUrlApi = (data) => {
    return request('shiftOfDutySheet/queryCuttingWorkSheetDetail', {
        type: 'get',
        baseUrlType: 'reinsuranceRecordUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

const getCutInfoPlanApi = (data) => {
    return request('shiftOfDutySheet/queryCutOverPlanUrl', {
        type: 'get',
        baseUrlType: 'reinsuranceRecordUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

export default {
    getCutSheet,
    saveCutSheet,
    getTransmissionDetailUrlApi,
    getCutInfoPlanApi,
};
