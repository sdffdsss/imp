import request from '@Common/api';
export const getView = (queryParam) => {
    return request('v1/monitor-view', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        data: queryParam,
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
    });
};
export const getAlarmDetail = (selectRowKey) => {
    return request('flow/alarm-detail', {
        type: 'post',
        baseUrlType: 'viewItemUrl',
        data: {
            alarmIdList: [].concat(selectRowKey),
            sessionId: '',
        },
        showSuccessMessage: false,
        showErrorMessage: false,
    });
};
export const alarmDispatch = (data) => {
    return request('alarmmodel/operate/v1/operate/alarm/dispatch', {
        type: 'post',
        baseUrlType: 'filterUrl',
        data: data,
        showSuccessMessage: false,
    });
};
export const alarmRightClick = (data) => {
    return request('alarmmodel/operate/v1/operate/rightclick', {
        type: 'post',
        baseUrlType: 'filterUrl',
        data: data,
        showSuccessMessage: false,
    });
};
