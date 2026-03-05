import alarmOptimization from './dynamic-modules/alarm-optimization';
import businessFault from './dynamic-modules/business-fault';
import businessFaultCheck from './dynamic-modules/business-fault-check';
import businessFaultCoorperation from './dynamic-modules/business-fault-coorperation';
import businessPlatformMonitorDaily from './dynamic-modules/business-platform-monitor-daily';
import businessWechatEvent from './dynamic-modules/business-wechat-event';
import cutoverSheet from './dynamic-modules/cutover-sheet';
import dailyDeclare from './dynamic-modules/daily-declare';
import importantFaultSituation from './dynamic-modules/important-fault-situation';
import networkCutoverCheck from './dynamic-modules/network-cutover-check';
import networkCutoverSituation from './dynamic-modules/network-cutover-situation';
import networkFaultCheck from './dynamic-modules/network-fault-check';
import networkSafeEvent from './dynamic-modules/network-safe-event';
import networkFault from './dynamic-modules/network-fault';
import onlineOperation from './dynamic-modules/online-operation';
import other from './dynamic-modules/other';
import prevImportanceInform from './dynamic-modules/prev-importance-inform';
import prevRemainQuestion from './dynamic-modules/prev-remain-question';
import reinsuranceCheck from './dynamic-modules/reinsurance-check';
import reinsuranceDispatch from './dynamic-modules/reinsurance-dispatch';
import reinsuranceExecuteRecords from './dynamic-modules/reinsurance-execute-records';
import reinsuranceSituation from './dynamic-modules/reinsurance-situation';
import remainQuestion from './dynamic-modules/remain-question';
import roomInspection from './dynamic-modules/room-inspection';
import safeEventRecord from './dynamic-modules/safe-event-record';
import wirelessBaseStation from './dynamic-modules/wireless-base-station';
import workRecord from './dynamic-modules/work-record';
import importantInforms from './dynamic-modules/important-informs';

export const dynamicModulesMap = {
    1: networkFault, // 网络故障单
    2: businessFault, // 业务故障单
    3: businessFaultCoorperation, // 协查单
    4: reinsuranceDispatch,
    5: reinsuranceCheck,
    6: reinsuranceExecuteRecords, // 重保执行记录
    7: cutoverSheet,
    8: roomInspection, // 机房巡视表
    9: prevRemainQuestion,
    10: prevImportanceInform,
    11: importantFaultSituation, // 重大故障情况
    12: reinsuranceSituation, // 重保情况
    13: safeEventRecord, // 安全事件记录
    14: networkCutoverSituation, // 网络割接情况
    15: other, // 其他
    16: remainQuestion, // 遗留问题
    17: businessWechatEvent,
    18: networkSafeEvent,
    19: networkFaultCheck, // 网络故障
    20: wirelessBaseStation,
    21: dailyDeclare,
    22: businessFaultCheck, // 业务故障-自查
    23: networkCutoverCheck, // 网络割接(自查)-平台-核心网
    24: alarmOptimization, // 告警与优化
    25: businessPlatformMonitorDaily, // 业务平台监控日报
    26: onlineOperation,
    28: workRecord,
    29: importantInforms,
};

export const pageEntrys = [
    {
        key: 'MaintainJob',
        text: '维护作业计划',
        url: '/setting/views/maintain-job',
    },
    {
        key: 'PreviousDutySummary',
        text: '上班次总结',
        url: '/change-shifts-page/previous-duty-summary',
    },
    {
        key: 'CallTestingRecord',
        text: '拨测记录',
        url: '/call-test-record',
    },
    {
        key: 'NMSAlarmMonitoring',
        text: '网管系统告警监测',
        url: '/network-management-system-alarm-monitoring',
    },
    {
        key: 'CutExecutionRecord',
        text: '割接执行记录',
        url: '/cutting-execution-record',
    },
    {
        key: 'serviceFaultManagement',
        text: '业务故障管理',
        url: '/setting/service-fault-management',
    },
    {
        key: 'modules-fault-management',
        text: '网络故障管理',
        url: '/modules-fault-management',
    },
    {
        key: 'network-cutover',
        text: '网络割接管理',
        url: '/network-cutover',
    },
    {
        key: 'reinsurance-record',
        text: '重保记录（自查）',
        url: '/setting/reinsurance-record',
    },
    {
        key: 'record-temporary-route',
        text: '临时路由调整记录',
        url: '/setting/record-temporary-route',
    },
    {
        key: 'record-network-hazard',
        text: '网络隐患记录',
        url: '/setting/record-network-hazard',
    },
    {
        key: 'network-operation-record',
        text: '网管操作记录',
        url: '/network-operation-record',
    },
    {
        key: 'operator-logon',
        text: '操作/进出登记',
        url: '/setting/operator-logon',
    },
    {
        key: 'network-security-events',
        text: '网络安全事件',
        url: '/network-security-events',
    },
    {
        key: 'alarm-optimization-management',
        text: '告警与优化管理',
        url: '/setting/alarm-optimization-management',
    },
    {
        key: 'home-record-duty',
        text: '值班日志查询',
        url: '/setting/record-duty',
    },
    {
        key: 'business-platform-monitor-daily',
        text: '业务平台监控日报',
        url: '/business-platform-monitor-daily',
    },
];
