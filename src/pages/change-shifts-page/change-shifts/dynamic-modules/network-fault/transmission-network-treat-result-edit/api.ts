import request from '@Common/api';

interface BatchGetDictByFieldNameResponse {
    code?: Number;
    message?: string;
}

/**
 * @description: 保存故障记录
 * @param {*}
 * @return {*}
 */
export const UpdateRecord = async (data): Promise<BatchGetDictByFieldNameResponse> => {
    const res: BatchGetDictByFieldNameResponse = await request(`dict/getDictByFieldNames`, {
        type: 'post',
        baseUrlType: 'reinsuranceRecordUrl',
        showSuccessMessage: false,
        data,
    });

    return res;
};
