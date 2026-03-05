import request from '@Src/common/api';

/**
 * @description: 查询重保执行记录
 * @param {*}
 * @return {*}
 */
const getExecuteSheet = (data) => {
    return new Promise((reslove) => {
        request('reinsuranceExecutionRecord/queryReinsuranceExecutionRecords', {
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

/**
 * @description: 保存重保执行记录通过id
 * @param {*}
 * @return {*}
 */
const faultExecuteSave = (url, data) => {
    return new Promise((reslove) => {
        request(url, {
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

/**
 * @description: 删除重保执行记录通过id
 * @param {*}
 * @return {*}
 */
const faultExecuteDelete = (data) => {
    return new Promise((reslove) => {
        request('reinsuranceExecutionRecord/deleteReinsuranceExecutionRecord', {
            type: 'GET',
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
    getExecuteSheet,
    faultExecuteSave,
    faultExecuteDelete,
};
