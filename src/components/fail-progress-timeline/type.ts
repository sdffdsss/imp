export interface NoticeListItemType {
  noticeType?: string, //通知类型
  noticeTypeDesc?: string, //通知类型描述
  noticeTime?: string;  //通知时间
  noticeId?: string; // 通知Id
  msgId?: string; // 消息id
  noticeRole?: string; //通知角色
}

export type User = {
  key: number,
  noticeRole: string;
  noticeUser: string;
}

export interface DataSource {
    operater?: string; // 处理人
    operateDetail: string; //处理详情
    woId?: string;
    processId?: string;
    operateTime?: string; // 处理时间
    activityName?: string; // 环节名称
    operateType?: string; // 处理步骤
    files?: any[];
    processNode?: string;
    noticeList?: NoticeListItemType[];
    circleType?: boolean; // 是否显示结束圆圈
}

export type NoticeDetailType = User[];

export type TimeLineItemProps = {
  dataSource: DataSource;
  onNoticeChange?: (item: NoticeListItemType) => void;
  noticeDetail?: NoticeDetailType;
  index?: number;
};