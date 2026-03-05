//双击告警正文显示字段配置
export const alarmTextShow = [
    // { label: '告警标题', fieldName: 'title_text' },
    // { label: '告警标准名', fieldName: 'standard_alarm_name' },
    // { label: '设备类型', fieldName: 'eqp_object_class_text' },
    // { label: '设备名称', fieldName: 'eqp_label' },
    // { label: '告警正文', fieldName: 'alarm_text' },
    { label: '告警标题', fieldName: 'title_text', span: 4 },
    { label: '对象类型', fieldName: 'object_class', span: 2 },
    { label: 'FP0', fieldName: 'fp0', span: 2 },
    { label: '原始报文', fieldName: 'alarm_text', span: 4 },
];

//双击预处理显示字段配置
export const alarmReadyTextShow = [
    { label: '预处理状态', fieldName: 'preprocess_flag', span: 4 },
    { label: '根因域', fieldName: 'province_process_flag', span: 4 },
    { label: '根因类型', fieldName: 'preprocess_manner', span: 4 },
    { label: '根因位置', fieldName: 'corr_str', span: 4 },
    { label: '预处理过程', fieldName: 'alarm_content', span: 4 },
    { label: '预处理结果', fieldName: 'preprocess_result', span: 4 },
];

//右键操作显示告警字段模板1
export const rightClickShow1 = [
    { label: '网元名称', fieldName: 'eqp_label' },
    { label: '告警对象名称', fieldName: 'ne_label' },
    { label: '告警标题', fieldName: 'title_text' },
];

//右键操作显示告警字段模板2
export const rightClickShow2 = [
    { label: '网元名称', fieldName: 'eqp_label' },
    { label: '告警对象名称', fieldName: 'ne_label' },
    { label: '告警标题', fieldName: 'title_text' },
    { label: '告警发生时间', fieldName: 'event_time' },
];

//右键操作显示告警字段模板3
export const rightClickShow3 = [
    { label: '网元名称', fieldName: 'eqp_label' },
    { label: '告警标题', fieldName: 'title_text' },
    { label: '派单状态', fieldName: 'send_status' },
    { label: '设备类型', fieldName: 'eqp_object_class' },
    { label: '告警发生时间', fieldName: 'event_time' },
];

//右键操作显示表格字段模板4
export const rightClickShow4 = [
    { label: '外呼规则', fieldName: 'sendRule_format' },
    { label: '外呼状态', fieldName: 'IvrStatus_format' },
    { label: '短信接收人', fieldName: 'smsSendPhone_format' },
    { label: '第一呼叫人', fieldName: 'firstCalMan_format' },
    { label: '短信内容', fieldName: 'smsContent_format' },
    { label: '语音内容', fieldName: 'callContenta_format' },
];

//右键调用视图服务参数配置
export const rightClickViewPageArgs = [
    { label: 'fp0', fieldName: 'fp0' },
    { label: 'fp1', fieldName: 'fp1' },
    { label: 'fp2', fieldName: 'fp2' },
    { label: 'fp3', fieldName: 'fp3' },
];

// 双击频次告警字段配置
export const doubleClickAlarmCount = [
    { label: '序号', fieldName: 'index_format' },
    { label: '告警发生时间', fieldName: 'eventTime_format' },
    { label: '告警对象管理状态', fieldName: 'neAdminStatus_format' },
    { label: '告警频次', fieldName: 'alarmActCount_format' },
];

//短信模板字段配置
export const smsTemplateShow = [
    { label: '网元名称', fieldName: 'eqp_label' },
    { label: '告警标题', fieldName: 'title_text' },
    { label: '告警发生时间', fieldName: 'event_time' },
];

//手工呼叫模板字段配置
export const ivrTemplateShow = [
    { label: '城市名称', fieldName: 'city_name' },
    { label: '机房名称', fieldName: 'special_field22' },
    { label: '网元名称', fieldName: 'eqp_label' },
    { label: '告警标题', fieldName: 'title_text' },
    { label: '告警发生时间', fieldName: 'event_time' },
];

//资源详情
export const devInfoViewPageArgs = [
    { label: 'object_class', fieldName: 'object_class' },
    { label: 'int_id', fieldName: 'int_id' },
];

//机房详情
export const mrViewPageArgs = [
    { label: 'object_class', fieldName: 'eqp_object_class' },
    { label: 'int_id', fieldName: 'eqp_int_id' },
];
//机房详情-联通版
export const mrViewPageArgsUnicom = [
    { label: 'object_class', fieldName: 'object_class' },
    { label: 'int_id', fieldName: 'site_no' },
];
//工程预约信息查询
export const arproViewPageArgs = [{ label: 'fp0', fieldName: 'fp0' }];

//影响用户/影响小区信息查询
export const effectedViewPageArgs = [
    { label: 'object_class', fieldName: 'object_class' },
    { label: 'int_id', fieldName: 'eqp_int_id' },
];

export const effectedViewPageArgs2 = [
    { label: 'object_class', fieldName: 'object_class' },
    { label: 'int_id', fieldName: 'int_id' },
];
