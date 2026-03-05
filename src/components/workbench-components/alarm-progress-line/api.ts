import request from '@Common/api';
// import qs from 'qs';
// 所有群聊/已读群聊/未读群聊统计接口
// export const getViewData = (data) => {
//     return request(`alarmmodel/filter/v1/filters?${qs.stringify(data)}`, {
//         type: 'get',
//         baseUrlType: 'filterUrl',
//         // 是否需要显示失败消息提醒
//         showErrorMessage: true,
//     });
// };

export const getViewData = (data) => {
    return request(`monitor/getMontiorList`, {
        type: 'post',
        baseUrlType: 'monitor',
        // 是否需要显示失败消息提醒
        showSuccessMessage: false,
        showErrorMessage: true,
        data,
    });
};
export const getViewNewData = (data) => {
    return request(`api/canary/collect`, {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
        data,
    });
};
