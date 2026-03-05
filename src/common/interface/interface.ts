export interface SelectOptionJson {
  [key: string]: any;
  value: string | number;
  label: string | number;
}

export interface CommonGetParams {
  pageSize?: number;
  pageNum?: number;
}

export interface SupplementListParam extends CommonGetParams {
  provinceId: string;
  taskStatus: number; // 任务状态;0表示未开始;1表示进行中;2表示已完成，-1表示全部
  beginTime?: string;
  endTime?: string;
}

export interface SupplementListJson {
  createTime: string;
  creator: string;
  creatorName: string;
  modifier: string;
  modifierName: string;
  modifyTime: string;
  provinceId: number;
  provinceName: string;
  taskId: number;
  taskName: string;
  taskStatus: number;
  taskStatusName: string;
}

export interface AlarmSheetInfoParams extends CommonGetParams {
  eventTimeFlag: number;    //告警过滤方式;0表示按时间段过滤告警发生时间;1表示按时间范围过滤告警发生时间
  timeSlot: 1;    //按时间段过滤选项;1表示近1小时;2表示近2小时;5表示近5小时;12表示近12小时;24表示近1天
  factBeginTime: string;    //按时间段过滤选项;查询条件设定后第一次查询的时间
  beginFrameTime: string;    //按时间范围过滤选项;开始时间
  endFrameTime: string;    //按时间范围过滤选项;结束时间
  provinceId: string;    //选择告警条件;省份
  regionId: string;    //选择告警条件;地市;多个用逗号分隔
  cityId: string;    //选择告警条件;区县;多个用逗号分隔
  professionalType: string;    //选择告警条件;专业;多个用逗号分隔
  objectClass: string;    //选择告警条件;设备类型;多个用逗号分隔
  alarmTitle: string    //选择告警条件;告警标题;多个用逗号分隔
}

export interface AlarmSheetJson {
  fp1: number;
  fp0: number;
  provinceName: string;    //省份名称
  fp3: number;
  sheetType: 1;    //工单类型
  objectClass: string;    //设备类型
  fp2: number;
  sendVersion: string;    //派发版本
  alarmStatus: string;    //告警状态
  professionalTypeName: string;    //专业
  regionName: string;    //地市
  eventTime: string;    //告警发生时间
  neLabel: string; //告警对象名称
  sheetSendStatus: string;    //派单状态
  cityId: string;    //区县
  alarmTitle: string;    //告警标题
  vendorName: string;    //厂家
  failedReason: string;    //派单失败原因
  eqpLabel: string;    //网元名称
  uniqId: string;
}

export interface AlarmSheetInfoItemJson {
  fp0: number;
  fp1: number;
  fp2: number;
  fp3: number;
  sheetType: number;
  sendVersion: string;
}

export interface AlarmSheetParams {
  taskName: string;    //任务名称
  provinceId: string;    //省份id
  provinceName: string;      //省份名称
  cronFlag: number;    //定时执行标志;0表示立即执行;1表示定时执行
  cronTime: string;    //定时执行时间，如果是立即执行，则设置null
  eventTimeFlag: number;    //告警过滤方式;0表示按时间段过滤告警发生时间;1表示按时间范围过滤告警发生时间
  timeSlot: number;    //按时间段过滤选项;1表示近1小时;2表示近2小时;5表示近5小时;12表示近12小时;24表示近1天
  factBeginTime: string;    //按时间段过滤选项;查询条件设定后第一次查询的时间
  beginFrameTime: string;    //按时间范围过滤选项;开始时间
  endFrameTime: string;    //按时间范围过滤选项;结束时间
  provinceIds: string;
  regionIds: string;    //选择告警条件;地市;多个用逗号分隔
  cityIds: string;    //选择告警条件;区县;多个用逗号分隔
  professionalType: string;    //选择告警条件;专业;多个用逗号分隔
  objectClass: string;    //选择告警条件;设备类型;多个用逗号分隔
  alarmTitle: string;    //选择告警条件;告警标题;多个用逗号分隔
  operateUser: string;    //操作人员id
  alarms: AlarmSheetInfoItemJson[];
  taskId?: number;
}

export interface SupplementDetailJson {
  alarmCount: string;
  alarmSheetCount: string;
  cronTime: string;
  failCount: string;
  finishPercent: number;
  successCount: string;
  taskId: number;
  taskName: string;
}

export interface AlarmSheetDetailJson {
  alarmStatus: string;  //清除状态
  sheetNo: string;    //工单号
  professionalTypeName: string;    //专业
  cityName: string;    //区县
  regionName: string;    //地市
  objectClass: string;    //设备类型
  eventTime: string;    //告警发生时间
  forwardTime: string;    //派单时间
  provinceName: string;    //省份名称
  neLabel: string;    //告警对象名称
  sheetSendStatus: string;    //派单状态
  alarmTitle: string;    //告警名称
  sheetTitle: string;    //工单标题
  failedReason: string;  //派单失败原因
  vendorName: string;    //厂家
  eqpLabel: string    //网元名称
}
