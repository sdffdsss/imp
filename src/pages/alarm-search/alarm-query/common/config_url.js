export default {
    baseUrlSqlm: 'default', // sql下沉 base url
    sqlm_execute: 'apply/execute',
    baseUrlRest: 'filter', // rest 接口 base url
    rest_columnInfo: 'sysadminAlarm/column-info', // 查询列信息
    rest_release: 'sysadminAlarm/release', // sessionRelease
    rest_regist: 'sysadminAlarm/regist', // sessionRegister
    rest_count: 'sysadminAlarm/count', // 查询数量
    // 查询分页 告警流水窗版本 record-new-page record-new-page
    rest_recordPage: 'sysadminAlarm/record-new-page', // 查询分页
    rest_export: 'sysadminAlarm/export',
    iceEndpoint: 'Alarm/Database:default -h 10.10.1.170 -p 4508',
    filter: 'filter', // rest 接口filter base url
    rest_filters: 'sysadminFilter/basic-filters', // 过滤器查询接口
    iceEndpoint_sysadmin: 'SysadminServer:default -h 10.10.1.170 -p 4508',
    alarm_detail_unicom: 'alarm/detail/v1/alarms',
    db_click_detail: 'sysadminAlarm/record-Specialpage',
    pretreatment_info: 'sysadminAlarm/pretreatment_info',
    sub_alarm_unicom: 'sysadminAlarm/subAlarmPage'
};
