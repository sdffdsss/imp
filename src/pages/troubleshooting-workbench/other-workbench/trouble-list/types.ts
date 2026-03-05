export interface FaultItem {
    name: string;
    code: string;
    value: number;
}

export interface TableColumnsType {
    noticeRuleName: string;
    areaName: string;
    noticeFailureObject: string;
    noticeTime: string;
    workNum: string;
    noticeId?: string;
}

export interface ReportTableColumnsType {
    areaName: string;
    reportFaultCount: number;
    areaId?: number;
}
export interface FaultDataType {
    timeoutFaultNum: number;
    timeoutFaultList: Array<FaultItem>;
    autoDispatchNum: number;
    autoDispatchList: Array<FaultItem>;
    todoDispatchNum: number;
    todoDispatchList: Array<FaultItem>;
}
export interface FaultReportDataItem {
    areaId: number;
    areaName: string;
    reportFaultCount: number;
}
export interface FaultReportDataType {
    provinceReportDataList: FaultReportDataItem[];
    reportFaultSum: number;
}

export interface FaultDetailListDataType {
    faultTopic: string;
    profession: string;
    faultCategory: string;
    reportNewClass: string;
    reportTime: string;
    id: string;
}
export interface StatisticsType {
    successCount: number;
    failureCount: number;
}
