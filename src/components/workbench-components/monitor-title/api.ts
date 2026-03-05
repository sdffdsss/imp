import request from '@Common/api';

// 视图查询接口
export const getViewData = (data) => {
    return request(`v1/monitor-view/getMonitorViewByGroupId/${data}`, {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
    });
};
// 视图查询接口
export const getView = (data) => {
    return request(`v1/monitor-view/getGroupAndMonitorViewByParams`, {
        type: 'post',
        baseUrlType: 'filterUrl',
        data,
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
        showSuccessMessage: false,
    });
};
