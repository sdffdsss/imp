export default {
    baseUrlSqlm: 'default', // sql下沉 base url
    sqlm_execute: 'apply/execute',

    baseUrlRest: 'filter', // rest 接口 base url
    rest_columnInfo: 'sysadminAlarm/column-info', // 查询列信息
    rest_release: 'sysadminAlarm/release', // sessionRelease
    rest_regist: 'sysadminAlarm/regist', // sessionRegister
    rest_count: 'sysadminAlarm/count', // 查询数量
    rest_recordPage: 'sysadminAlarm/record-page', // 查询分页

    iceEndpoint: 'Alarm/Database:default -h 10.10.1.170 -p 4508',

    filter: 'filter', // rest 接口filter base url
    rest_filters: 'sysadminFilter/basic-filters', // 过滤器查询接口
    iceEndpoint_sysadmin: 'SysadminServer:default -h 10.10.1.170 -p 4508',
};
