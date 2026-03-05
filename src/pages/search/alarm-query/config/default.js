import constants from '@Common/services/constants';

export default {
    // 告警查询sql文件名
    // 客户端存在 oss-imp-alarm\public\report\sqlConfig 下的
    // alarmQuery.xml和alarmQuery_mysql.xml 两个文件
    mapperId: constants.dbType === 'mysql' ? 'alarmQuery_mysql' : 'alarmQuery',
    // 是否从sql 下沉查询所有列 id name 的映射集合
    fieldIdNamesFromSql: true,

    columnWith: 280,
    rootClassName: 'alarm_search_table_2020',
    alarmRemarkLength: 450,

    // 不需要查询表单提交的字段
    dontSendFieldName: [],
    // 不需作为查询参数的字段
    dontSearchFieldName: ['is_undistributed_send_status', 'filter_type'],
    // 内容过长需要省略的字段名
    ellipsisFieldName: ['title_text'],
    //
    useAlarmWindow: true,
    // ohaf_platform_release\plugin\zhjk\common\component\comp_alarmwindow\comp_alarmwindow.js
    // defaultFields 如下配置 默认查询字段，
    // 和告警模板 放在一起变成 告警查询注册接口的字段 fieldIds
    defautFields: [
        'fp0',
        'fp1',
        'fp2',
        'fp3',
        'c_fp0',
        'c_fp1',
        'c_fp2',
        'c_fp3',
        'ack_flag',
        'int_id',
        'eqp_int_id',
        'object_class',
        'eqp_object_class',
        'vendor_id',
        'active_status',
        'org_severity',
        'event_time',
        // 'alarm_duration',
        'time_stamp',
        'professional_type',
        'title_text',
        'network_type_top',
        'ne_label',
    ],
    crruentColumns: [
        'fp0',
        'fp1',
        'fp2',
        'fp3',
        'c_fp0',
        'c_fp1',
        'c_fp2',
        'c_fp3',
        'ack_flag',
        'int_id',
        'eqp_int_id',
        'object_class',
        'eqp_object_class',
        'vendor_id',
        'active_status',
        'org_severity',
        'event_time',
        // 'alarm_duration',
        'time_stamp',
        'professional_type',
        'title_text',
        'network_type_top',
        'ne_label',
    ],
};
