export type SubscribeBusinessType =
  | 'AlarmStatisticsFlow'
  | 'AlarmFilteringFlow'
  | 'AlarmTopologyFlow';

export type WinType = 'active' | 'confirm' | 'clear';

export interface WinInfo {
  type: WinType;
  capacity: number;
}

/**
 * 初始化 Processor 参数
 */
export class InitProcessorParameter {
  alarmWindow: any;
  subscribeBusiness: SubscribeBusinessType;
}

/****
 * 创建会话
 ****/
export class CreateSessionRequest {
  /** 订阅的业务
   * 告警统计流水 AlarmStatisticsFlow
   * 告警过滤流水 AlarmFilteringFlow
   * 告警拓扑流水 AlarmTopologyFlow
   */
  subscribeBusiness: SubscribeBusinessType;
  // 订阅信息集JSON（基于不同的订阅业务另行约定）
  subscribeInfoJSON: {
    //客户端描述
    clientDesc: {
      ip: string; //客户端站点IP
      filterId: number[];
    };
    clientTimeOutSeconds: number;
    alarmFieldNameList: string[];
    //客户端Token信息
    clientToken: string;
    dataPermissionList: any;
    batchSize: number;
    //客户端用户名称
    userName: string;
    clientRegisterTime: string | Date;
    winList: any[];
  };
}

/****
 * 创建会话结果
 ****/
export class CreateSessionResponse {
  //客户端用户名称
  clientUserName: string;
  //会话ID
  sessionId: string;
  //处理描述描述
  dealDesc: string;
}

/****
 * 关闭会话结果
 ****/
export class CloseSessionRequest {
  //会话ID
  sessionId: string | null;
  //处理描述
  closeDesc: string;
}
/****
 * 关闭会话结果
 ****/
export class CloseSessionResponse {
  //会话ID
  clientSessionId: string | null;
  //客户端在线时长
  clientOnlineTimeSecond: number;
  //处理描述
  dealDesc: string;
}

/****
 * 通用接口模型,返回数据模型
 ****/
export class ResponseJSONMessage {
  //客户端会话ID
  clientSessionId: string;
  //客户端请求时间 ，毫秒值
  clientRequestTimeMS: number;
  //请求方法名称
  requestMethodName: string;
  //返回数据JSON格式
  responseDataJSON: string;
  //服务端处理耗时(毫秒)
  serverDealTimeMS: number;
}

/**
 * 服务的基本信息
 */
export class ViewServiceInfo {
  /**
   * 服务名称
   */
  serviceName: string;
  /**
   * 服务地址信息
   */
  serviceAddress: string;
}
