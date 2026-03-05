import request from '@Common/api';
class ServiceApi {
    messagePost = (data) => {
        return request('alarmmodel/operate/v1/operate/rightclick', {
            type: 'post',
            showSuccessMessage: false,
            showErrorMessage: false,
            baseUrlType: 'filterUrl',
            data: {
                ...data,
                operateType: 'alarm_sms_notify',
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        });
    };
    /**
     * @description: 获取故障详情
     * @param {*}
     * @return {*}
     */
    getSheetDetail = (sheetNo) => {
        return request(`fault/work/sheet/v1/getSheetDetail`, {
            type: 'get',
            baseUrlType: 'failureSheetUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取故障详情失败',
            data: {
                sheetNo,
            },
        });
    };
    /**
     * @description: 获取故障进度时间轴
     * @param {*}
     * @return {*}
     */
    getFailProgress = (data) => {
        return request(`fault/work/sheet/v1/getFailProgress`, {
            type: 'get',
            baseUrlType: 'failureSheetUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取故障进度失败',
            data,
        });
    };
    getAlarmRecord = (id) => {
        return request('alarm/detail/v1/alarms', {
            type: 'post',
            baseUrlType: 'filter',
            data: id,
            showSuccessMessage: false,
            showErrorMessage: false,
        });
    };
    getUneradMessage = (data) => {
        return request(`v1/groups/unreadMessage`, {
            type: 'post',
            baseUrlType: 'chatUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        });
    };
    /**
     * @description: 获取故障通知列表
     * @param {*}
     * @return {*}
     */
    getNoticeList = (data) => {
        return request(`faultNotice/noticeTable`, {
            type: 'get',
            baseUrlType: 'dispatchDetailsNoticeUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取通知列表失败',
            data,
        });
    };
    /**
     * @description: 获取故障通知详情
     * @param {*}
     * @return {*}
     */
    getNoticeDetail = (data) => {
        return request(`faultNotice/noticeDetail`, {
            type: 'get',
            baseUrlType: 'dispatchDetailsNoticeUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取通知详情失败',
            data,
        });
    };
}
export const Api = new ServiceApi();
