import request from '@Src/common/api';
/**
 * @description: 查询重保调度单
 * @param {*}
 * @return {*}
 */
const getReinsuranceSheet = (data) => {
    return new Promise((reslove) => {
        request('shiftOfDutySheet/queryReinsuranceWorkSheet', {
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

export default {
    getReinsuranceSheet,
};
