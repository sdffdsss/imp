import request from '@Common/api';

export const getSettingData = (appId) => {
    return request(`v1/workStation/getWorkStationTools`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: {
            appId,
        },
    });
};
export const routeDataList = [
    {
        name: '5GC可视化监控',
        image: '5gc.png',
    },
    {
        name: '专线监控',
        image: 'zxjk.png',
    },
    {
        name: '告警查询',
        image: 'alarm-search.png',
    },
    {
        name: '工单查询',
        image: 'fault.png',
    },
    {
        name: '当班监控视图',
        image: 'duty-view.png',
    },
    {
        name: '拓扑监控',
        image: 'topo.png',
    },
    {
        name: '短信/彩信',
        image: 'sms.png',
    },
    {
        name: '自定义视图',
        image: 'zdyst.png',
    },
    {
        name: '超长告警查询',
        image: 'alarm-long.png',
    },
    {
        name: '超长工单查询',
        image: 'fault-long.png',
    },
    {
        name: '运维调度表',
        image: 'yunwei.png',
    },
    {
        name: '值班日志查询',
        image: 'zbjl.png',
    },
    {
        name: '交接班',
        image: 'jjb.png',
    },
    {
        name: '值班班表',
        image: 'zbbbcx.png',
    },
    {
        name: '备品备件',
        image: 'bpbj.png',
    },
    {
        name: '可视化监控',
        image: 'kshjk.png',
    },
    {
        name: '监控中心设置',
        image: 'jkzxsz.png',
    },
    {
        name: '故障上报',
        image: 'fault-report.png',
    },
    {
        name: '国际网络监控',
        image: 'alarm-long.png',
    },
];
