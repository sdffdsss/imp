import request from '@Common/api'
export const getView = (queryParam)=>{
    return request('v1/monitor-view', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        data: queryParam,
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
    })
}