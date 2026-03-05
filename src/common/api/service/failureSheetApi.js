import request from '@Src/common/api';

const baseUrlType = 'failureSheetUrl';

class FailureSheetApi {
    /**
     * 获取交接班视图列表
     * @param {Object} data
     * @param {Object} data.viewPageArgs
     * @param {string} data.viewPageArgs.province_id
     * @param {string} data.viewPageArgs.region_id
     * @param {string} data.viewPageArgs.sheet_status
     * @param {string} data.viewPageArgs.professional_type
     * @param {string} data.viewPageArgs.key_word
     * @param {string} data.viewPageArgs.forward_start_time
     * @param {string} data.viewPageArgs.forward_end_time
     * @param {string} data.viewPageArgs.pageIndex
     * @param {string} data.viewPageArgs.pageSize
     * @param {string} data.viewPageArgs.user_id
     * @param {string} data.viewPageArgs.sheet_time_out
     * @param {string} data.viewItemId
     * @param {string} data.viewPageId
     * @returns
     */
    async getFailureSheetList(data) {
        const result = await request('work/sheet/v1/getViewItemData', {
            data,
            baseUrlType,
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '工单信息失败'
        });
        return result?.data;
    }
}

export const failureSheetApi = new FailureSheetApi();
