//双击告警正文显示字段配置
export var alarmTextShow = [
// { label: '告警标题', fieldName: 'title_text' },
// { label: '告警标准名', fieldName: 'standard_alarm_name' },
// { label: '设备类型', fieldName: 'eqp_object_class_text' },
// { label: '设备名称', fieldName: 'eqp_label' },
// { label: '告警正文', fieldName: 'alarm_text' },
{
  label: '告警标题',
  fieldName: 'title_text',
  boxStyle: {
    width: '990px'
  },
  valueStyle: {
    height: '40px',
    padding: '13px 16px'
  }
}, {
  label: '对象类型',
  fieldName: 'object_class',
  boxStyle: {
    width: '478px',
    marginRight: '27px'
  },
  valueStyle: {
    height: '40px',
    padding: '13px 16px'
  }
}, {
  label: 'FP0',
  fieldName: 'fp0',
  boxStyle: {
    width: '484px'
  },
  valueStyle: {
    height: '40px',
    padding: '13px 16px'
  }
}, {
  label: '原始报文',
  fieldName: 'alarm_text',
  boxStyle: {
    width: '990px'
  },
  valueStyle: {
    height: '288px',
    padding: '7px 18px',
    overflowY: 'auto'
  }
}];

//双击告警正文显示字段配置
export var alarmTextShowPlatForm = [
// { label: '告警标题', fieldName: 'title_text' },
// { label: '告警标准名', fieldName: 'standard_alarm_name' },
// { label: '设备类型', fieldName: 'eqp_object_class_text' },
// { label: '设备名称', fieldName: 'eqp_label' },
// { label: '告警正文', fieldName: 'alarm_text' },
{
  label: '告警标题',
  fieldName: 'title_text',
  boxStyle: {
    width: '990px'
  },
  valueStyle: {
    height: '40px',
    padding: '13px 16px'
  }
}, {
  label: '告警级别',
  fieldName: 'vendor_severity',
  boxStyle: {
    width: '478px',
    marginRight: '27px'
  },
  valueStyle: {
    height: '40px',
    padding: '13px 16px'
  }
}, {
  label: 'FP0',
  fieldName: 'fp0',
  boxStyle: {
    width: '484px'
  },
  valueStyle: {
    height: '40px',
    padding: '13px 16px'
  }
}, {
  label: '首次发生时间',
  fieldName: 'event_time',
  boxStyle: {
    width: '478px',
    marginRight: '27px'
  },
  valueStyle: {
    height: '40px',
    padding: '13px 16px'
  }
}, {
  label: '业务系统',
  fieldName: 'alarm_source',
  boxStyle: {
    width: '484px'
  },
  valueStyle: {
    height: '40px',
    padding: '13px 16px'
  }
}, {
  label: '告警内容',
  fieldName: 'locate_info',
  boxStyle: {
    width: '990px'
  },
  valueStyle: {
    height: '100px',
    padding: '13px 16px',
    overflowY: 'auto'
  }
}, {
  label: '原始报文',
  fieldName: 'alarm_text',
  boxStyle: {
    width: '990px'
  },
  valueStyle: {
    height: '288px',
    padding: '7px 18px',
    overflowY: 'auto'
  }
}];

//双击预处理显示字段配置
export var alarmReadyTextShow = [{
  label: '预处理状态',
  fieldName: 'preprocess_flag',
  boxStyle: {
    width: '478px',
    marginRight: '34px'
  },
  valueStyle: {
    height: '40px',
    padding: '13px 16px'
  }
}, {
  label: '根因域',
  fieldName: 'province_process_flag',
  boxStyle: {
    width: '478px'
  },
  valueStyle: {
    height: '40px',
    padding: '13px 16px'
  }
}, {
  label: '根因类型',
  fieldName: 'preprocess_manner',
  boxStyle: {
    width: '478px',
    marginRight: '34px'
  },
  valueStyle: {
    height: '40px',
    padding: '13px 16px'
  }
}, {
  label: '根因位置',
  fieldName: 'corr_str',
  boxStyle: {
    width: '478px'
  },
  valueStyle: {
    height: '40px',
    padding: '7px 16px'
  }
}, {
  label: '预处理过程',
  fieldName: 'alarm_content',
  boxStyle: {
    width: '991px'
  },
  valueStyle: {
    minHeight: '97px',
    padding: '13px 16px'
  }
}, {
  label: '预处理结果',
  fieldName: 'preprocess_result',
  boxStyle: {
    width: '991px'
  },
  valueStyle: {
    minHeight: '79px',
    padding: '7px 16px'
  }
}];

//右键操作显示告警字段模板1
export var rightClickShow1 = [{
  label: '网元名称',
  fieldName: 'eqp_label'
}, {
  label: '告警对象名称',
  fieldName: 'ne_label'
}, {
  label: '告警标题',
  fieldName: 'title_text'
}];

//右键操作显示告警字段模板2
export var rightClickShow2 = [{
  label: '网元名称',
  fieldName: 'eqp_label'
}, {
  label: '告警对象名称',
  fieldName: 'ne_label'
}, {
  label: '告警标题',
  fieldName: 'title_text'
}, {
  label: '告警发生时间',
  fieldName: 'event_time'
}];

//右键操作显示告警字段模板3
export var rightClickShow3 = [{
  label: '网元名称',
  fieldName: 'eqp_label'
}, {
  label: '告警标题',
  fieldName: 'title_text'
}, {
  label: '派单状态',
  fieldName: 'send_status'
}, {
  label: '设备类型',
  fieldName: 'eqp_object_class'
}, {
  label: '告警发生时间',
  fieldName: 'event_time'
}];

//右键操作显示表格字段模板4
export var rightClickShow4 = [{
  label: '外呼规则',
  fieldName: 'sendRule_format'
}, {
  label: '外呼状态',
  fieldName: 'IvrStatus_format'
}, {
  label: '短信接收人',
  fieldName: 'smsSendPhone_format'
}, {
  label: '第一呼叫人',
  fieldName: 'firstCalMan_format'
}, {
  label: '短信内容',
  fieldName: 'smsContent_format'
}, {
  label: '语音内容',
  fieldName: 'callContenta_format'
}];

//右键调用视图服务参数配置
export var rightClickViewPageArgs = [{
  label: 'fp0',
  fieldName: 'fp0'
}, {
  label: 'fp1',
  fieldName: 'fp1'
}, {
  label: 'fp2',
  fieldName: 'fp2'
}, {
  label: 'fp3',
  fieldName: 'fp3'
}];

// 双击频次告警字段配置
export var doubleClickAlarmCount = [{
  label: '序号',
  fieldName: 'index_format'
}, {
  label: '告警发生时间',
  fieldName: 'eventTime_format'
}, {
  label: '告警对象管理状态',
  fieldName: 'neAdminStatus_format'
}, {
  label: '告警频次',
  fieldName: 'alarmActCount_format'
}];

//短信模板字段配置
export var smsTemplateShow = [{
  label: '网元名称',
  fieldName: 'eqp_label'
}, {
  label: '告警标题',
  fieldName: 'title_text'
}, {
  label: '告警发生时间',
  fieldName: 'event_time'
}];

//手工呼叫模板字段配置
export var ivrTemplateShow = [{
  label: '城市名称',
  fieldName: 'city_name'
}, {
  label: '机房名称',
  fieldName: 'special_field22'
}, {
  label: '网元名称',
  fieldName: 'eqp_label'
}, {
  label: '告警标题',
  fieldName: 'title_text'
}, {
  label: '告警发生时间',
  fieldName: 'event_time'
}];

//资源详情
export var devInfoViewPageArgs = [{
  label: 'object_class',
  fieldName: 'object_class'
}, {
  label: 'int_id',
  fieldName: 'int_id'
}];

//机房详情
export var mrViewPageArgs = [{
  label: 'object_class',
  fieldName: 'eqp_object_class'
}, {
  label: 'int_id',
  fieldName: 'eqp_int_id'
}];
//机房详情-联通版
export var mrViewPageArgsUnicom = [{
  label: 'object_class',
  fieldName: 'object_class'
}, {
  label: 'int_id',
  fieldName: 'site_no'
}];
//工程预约信息查询
export var arproViewPageArgs = [{
  label: 'fp0',
  fieldName: 'fp0'
}];

//影响用户/影响小区信息查询
export var effectedViewPageArgs = [{
  label: 'object_class',
  fieldName: 'object_class'
}, {
  label: 'int_id',
  fieldName: 'eqp_int_id'
}];
export var effectedViewPageArgs2 = [{
  label: 'object_class',
  fieldName: 'object_class'
}, {
  label: 'int_id',
  fieldName: 'int_id'
}];