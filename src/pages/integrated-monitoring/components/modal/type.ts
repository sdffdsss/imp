// Todo: 南方 北方 大区 集团
export interface Data {
    [areaProvince: string]: Province[];
}
// Todo: 省份列表
interface Province {
    provinceId: number;
    provinceName: string;
    centerNum: number;
    monitorCenterList: MonitorCenterList[];
}
// Todo: 省份下的监控中心列表
interface MonitorCenterList {
    monitorCenterId: number;
    monitorCenterName: string;
    monitorCenterPersonnelNum: string;
    monitorGroupList: MonitorGroupList[];
    dispatchGroupList: DispatchGroupList[];
}
// Todo：监控班组列表
interface MonitorGroupList {
    monitorGroupId: string;
    monitorGroupName: string;
    monitorGroupPersonnelNum: string;
    monitorGroupType: string;
}
// Todo: 调度班组列表
interface DispatchGroupList {
    monitorGroupId: string;
    monitorGroupName: string;
    monitorGroupPersonnelNum: string;
    monitorGroupType: string;
}
