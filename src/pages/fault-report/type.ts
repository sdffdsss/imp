/* eslint-disable @typescript-eslint/naming-convention */
export interface TableListItem {
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    id: number;
    node_id: string;
    number: number;
    title: string;
    user: User;
    labels: Label[];
    state: string;
    locked: boolean;
    assignee?: any;
    assignees: any[];
    milestone?: any;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: any;
    author_association: string;
    body: string;
}

export interface Label {
    id: number;
    node_id: string;
    url: string;
    name: string;
    color: string;
    default: boolean;
    description: string;
}

export interface User {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}

export enum ReportType {
    FIRST_NEWSPAPER = '0', // 首报
    RENEWAL = '1', // 续报
    FINAL_REPORT = '2', // 终报
}

export enum NoticeTemplateType {
    FIRST_NEWSPAPER = 1, // 首报
    RENEWAL = 2, // 续报
    FINAL_REPORT = 3, // 终报
}

export const ReportTypeText = {
    [ReportType.FIRST_NEWSPAPER]: '首报',
    [ReportType.RENEWAL]: '续报',
    [ReportType.FINAL_REPORT]: '终报',
};

export const reportTypeList = [
    {
        label: ReportTypeText[ReportType.FIRST_NEWSPAPER],
        value: ReportType.FIRST_NEWSPAPER,
    },
    {
        label: ReportTypeText[ReportType.RENEWAL],
        value: ReportType.RENEWAL,
    },
    {
        label: ReportTypeText[ReportType.FINAL_REPORT],
        value: ReportType.FINAL_REPORT,
    },
];
export const continueReportTypeList = [
    {
        label: ReportTypeText[ReportType.RENEWAL],
        value: ReportType.RENEWAL,
    },
    {
        label: ReportTypeText[ReportType.FINAL_REPORT],
        value: ReportType.FINAL_REPORT,
    },
];

export type RegionType = {
    regionId: string;
    regionName: string;
};

export enum FAILURE_REPORTING_LEVEL {
    NEWSPAPER_GROUP_HEADQUARTERS = '0', // 报集团总部
    PROVINCIAL_COMPANY = '1', // 报省公司
}

export const FAILURE_REPORTING_LEVEL_TEXT = {
    [FAILURE_REPORTING_LEVEL.NEWSPAPER_GROUP_HEADQUARTERS]: '报集团总部',
    [FAILURE_REPORTING_LEVEL.PROVINCIAL_COMPANY]: '报省公司',
};

export const failureReportingLevelList = [
    {
        label: FAILURE_REPORTING_LEVEL_TEXT[FAILURE_REPORTING_LEVEL.NEWSPAPER_GROUP_HEADQUARTERS],
        value: FAILURE_REPORTING_LEVEL.NEWSPAPER_GROUP_HEADQUARTERS,
    },
    {
        label: FAILURE_REPORTING_LEVEL_TEXT[FAILURE_REPORTING_LEVEL.PROVINCIAL_COMPANY],
        value: FAILURE_REPORTING_LEVEL.PROVINCIAL_COMPANY,
    },
];
export enum FAILURE_REPORTING_USEAGE {
    FAILURE_REPORT = '故障上报',
    TEST_PRACTICE = '测试演练',
}
export const FAILURE_REPORTING_USEAGE_TEXT = {
    [FAILURE_REPORTING_USEAGE.FAILURE_REPORT]: '故障上报',
    [FAILURE_REPORTING_USEAGE.TEST_PRACTICE]: '测试演练',
};

export const failureReportingUsageList = [
    {
        label: FAILURE_REPORTING_USEAGE.FAILURE_REPORT,
        value: FAILURE_REPORTING_USEAGE.FAILURE_REPORT,
    },
    {
        label: FAILURE_REPORTING_USEAGE.TEST_PRACTICE,
        value: FAILURE_REPORTING_USEAGE.TEST_PRACTICE,
    },
];

// 返显数据整合
export type DataType = {
    name: string;
    dataList: {
        span?: number;
        name?: string;
        value?: any;
        children?: any;
        uploudFiles?: {
            originalFileName: string;
            folderName: string;
        }[];
    }[];
};

// 故障通知枚举
export enum FAULT_NOTIFICATION_ENUM {
    IVR = '1', // IVR通知
    SHORT_MESSAGE = '2', // 短信通知
    DINGDING = '3', // 钉钉通知
}

// 故障来源枚举
export enum FAILURE_SOURCE_TYPE {
    MANUAL = 0, // 手动
    AUTO = 1, // 自动
    AUTO_REGION = 3,
}

// 故障来源文字
export const FaultSourceText = {
    [FAILURE_SOURCE_TYPE.MANUAL]: '手工上报',
    [FAILURE_SOURCE_TYPE.AUTO]: '自动识别',
    [FAILURE_SOURCE_TYPE.AUTO_REGION]: '自动识别（区县级）',
};

// 故障上报用途枚举
export enum FAILURE_USEAGE {
    TEST = '测试演练', // 测试
    REPORT = '故障上报', // 上报
}

// 故障上报用途文字
export const FaultUseageText = {
    [FAILURE_USEAGE.TEST]: '测试演练',
    [FAILURE_USEAGE.REPORT]: '故障上报',
};

// 故障上报状态
export enum FAILURE_REPORT_STATUS {
    FIRST_DRAFT = '1', // 首报草稿
    FIRST_REPORT = '2', // 首报上报
    CONTINUE_DRAFT = '3', // 续报草稿
    CONTINUE_REPORT = '4', // 续报上报
    FINAL_DRAFT = '5', // 终报草稿
    FINAL_REPORT = '6', // 终报上报
    FINAL_REPORT_MAJOR = '63', // 终报上报-新流程
}

// 草稿状态集合
export const FAILURE_REPORT_DRAFTS: string[] = [
    FAILURE_REPORT_STATUS.FIRST_DRAFT,
    FAILURE_REPORT_STATUS.CONTINUE_DRAFT,
    FAILURE_REPORT_STATUS.FINAL_DRAFT,
];

// 故障上报状态
export const REPORT_STATUS = {
    SAVE: 1,
    SUBMIT: 2,
    FIRST_WAIT_APPROVE: 21, // 首报申请
    CONTINUE_WAIT_APPROVE: 41, // 续报申请
    FINAL_WAIT_APPROVE: 61, // 终报申请
    FIRST_EDIT: 22, // 首报-修改申请
    FIRST_EDIT_APPROVE: 23, // 专业主管 首报-修改、首报-修改审核
    CONTINUE_EDIT: 42, // 续报-修改申请
    CONTINUE_EDIT_APPROVE: 43, // 专业主管 续报-修改、续报-修改审核
    FINAL_EDIT: 62, // 终报-修改申请
    FINAL_EDIT_APPROVE: 63, // 专业主管 终报-修改、终报-修改审核
};

export interface ReportNoticeDefaultValue {
    notificationTel?: string;
    notificationContent?: string;
    notificationUserInfos?: any[];
    notificationType?: string;
    notificationDetailList?: any[];
    whetherNotifyGNOC?: any;
    disableGNOC?: any;
    notificationContentId?: string;
}

export const noticeTypeOptions = [
    { label: 'IVR', value: FAULT_NOTIFICATION_ENUM.IVR },
    { label: '短信', value: FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE },
    { label: '钉钉群', value: FAULT_NOTIFICATION_ENUM.DINGDING },
];
export const defaultNotificationDetailList = [
    {
        notificationType: FAULT_NOTIFICATION_ENUM.IVR,
        notificationPeriodSwitch: true,
        notificationStartTime: '06:00:00',
        notificationEndTime: '22:00:00',
    },
    {
        notificationType: FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE,
        notificationPeriodSwitch: false,
        notificationStartTime: '06:00:00',
        notificationEndTime: '22:00:00',
    },
    {
        notificationType: FAULT_NOTIFICATION_ENUM.DINGDING,
        notificationPeriodSwitch: false,
        notificationStartTime: '06:00:00',
        notificationEndTime: '22:00:00',
    },
];

// 干线光缆专业
export const MART_CABLE_MAJOR = '8';
// 客服舆情信息专业
export const PUBLIC_OPINION = '16';
// 无线网
export const WIRELESS_NET = '11';

// 故障类别-话务量突变
export const CATEGORY_TRAFFIC = '21';
// 故障类别-客诉
export const CATEGORY_COMPLAINT = '22';
// 故障类别-舆情
export const CATEGORY_PUBLIC = '23';
