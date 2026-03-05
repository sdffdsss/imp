import request from '@Src/common/api';

/**
 * @description: 查询重保(自查)
 * @param {*}
 * @return {*}
 */
const getReinsuranceCheckSheet = (data) => {
    return new Promise((reslove) => {
        request('reinsuranceRecord/queryReinsuranceRecords', {
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
 * @description: 批量获取字典
 * @param {*}
 * @return {*}
 */
const batchGetDictByFieldName = async (data) => {
    const res = await request(`dict/getDictByFieldNames`, {
        type: 'post',
        baseUrlType: 'reinsuranceRecordUrl',
        showSuccessMessage: false,
        data,
    });

    return res;
};

/**
 * @description: 查看重保（自查）
 * @param {*}
 * @return {*}
 */
const queryReinsuranceRecordDetail = async (data) => {
    const res = await request(`reinsuranceRecord/queryReinsuranceRecordDetail`, {
        type: 'get',
        baseUrlType: 'reinsuranceRecordUrl',
        showSuccessMessage: false,
        data,
    });

    return res;
};

export default {
    getReinsuranceCheckSheet,
    batchGetDictByFieldName,
    queryReinsuranceRecordDetail,
};
