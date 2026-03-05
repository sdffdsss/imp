import request from '@Common/api';
export const getDefaultViews = (userId, provineceId) => {
    const requestUrl = provineceId
        ? `v1/monitor-view/getMonitorViewByGroup/${userId}/${provineceId}`
        : `v1/monitor-view/getMonitorViewByGroup/${userId}`;
    return request(requestUrl, {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: true,
    });
};
export const getColumns = (data)=>{
    return request('v1/template/alarm-column',{
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: true,
        data:data
    })
}
