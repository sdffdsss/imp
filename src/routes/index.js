import { router } from 'oss-web-common';
import DemoRoutes from './demo-routes';

const routes = [
    {
        exact: true,
        path: '/*/*/unicom/talk-view',
        component: 'talk-view-app',
    },
    {
        exact: true,
        path: '/*/*/unicom/chatOpsWeb/talk-view',
        component: 'talk-view',
    },
    {
        exact: true,
        path: '/*/*/unicom/chatOpsWeb/talk-view-list',
        component: 'talk-view-list',
    },
    {
        exact: true,
        path: '/*/*/unicom/chatOps/talk-view',
        component: 'talk-view',
    },
    {
        exact: true,
        path: '/*/*/unicom/chatOps/talk-view/user/:groupId',
        component: 'talk-view-app/user-app',
    },
    {
        exact: true,
        path: '/*/*/unicom/quick-access',
        component: 'quick-access',
        routes: [],
    },
    {
        exact: true,
        path: '/*/*/unicom/test/comp-test',
        component: 'test/comp-test',
        routes: [],
    },
    {
        exact: true,
        path: '/*/*/unicom/test',
        component: 'test/alarm-window-test',
        routes: [],
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-window-demo',
        component: 'test/alarm-window-demo',
        routes: [],
    },
    {
        exact: true,
        path: '/*/*/unicom/table-test',
        component: 'test/alarm-virtual-table',
        routes: [],
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-query-table',
        component: 'search/alarm-query/alarm-query-window',
        routes: [],
    },
    {
        exact: true,
        path: '/*/*/unicom/setting',
        component: 'setting',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-rule-manage/rule-group',
        component: 'alarm-rule-manage/rule-group',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-rule-manage/rule-manage-new/:moduleId',
        component: 'alarm-rule-manage/rule-manage-new',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-rule-manage/rule-manage-new/:moduleId/:mode',
        component: 'alarm-rule-manage/rule-manage-new',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-rule-manage/rule-manage-new/:moduleId/:type/:id',
        component: 'alarm-rule-manage/rule-manage-new/edit',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-rule-manage/rule-manage-new/:moduleId/:type/:id/:ruleGroupId',
        component: 'alarm-rule-manage/rule-manage-new/edit',
    },
    {
        exact: true,
        path: '/*/*/unicom/auto-sheet-rule/:moduleId/:mode',
        component: 'auto-sheet-rule',
    },
    {
        exact: true,
        path: '/*/*/unicom/auto-sheet-rule/:type/:moduleId/:id/:mode',
        component: 'auto-sheet-rule/edit',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/filter/:moduleId/:mode',
        component: 'setting/filter',
        keepAlive: true,
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/filter/:type/:moduleId/:id/:mode',
        component: 'setting/filter/edit',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/filter/:type/:moduleId/:id/:mode/:callback',
        component: 'setting/filter/edit',
    },
    {
        exact: true,
        path: '/*/*/unicom/search',
        component: 'search',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/views/monitor',
        component: 'setting/views/monitor',
    },

    {
        exact: true,
        path: '/*/*/unicom/search/alarm-query',
        component: 'search/alarm-query',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/search/alarm-query',
        component: 'search/alarm-query',
    },
    {
        exact: true,
        path: '/*/*/unicom/search/alarm-report',
        component: 'search/alarm-report',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/volume',
        component: 'setting/volume',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-light-board',
        component: 'alarm-light-board',
    },
    {
        exact: true,
        path: '/*/*/unicom/impNodeMonitorProg',
        component: 'imp-node-monitor-prog',
    },
    {
        exact: true,
        path: '/*/*/unicom/profAlarmMonitorProg',
        component: 'imp-node-monitor-prog',
    },
    {
        exact: true,
        path: '/*/*/unicom/redybMonitorProg',
        component: 'imp-node-monitor-prog',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/experiences',
        component: 'setting/experiences',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/views/col-template',
        component: 'setting/views/col-template',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/views/status-manager',
        component: 'setting/views/status-manager',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/rule-manage',
        component: 'setting/rule-manage',
    },
    // 联通监控视图路由
    {
        path: '/*/*/unicom/setting/core/monitor-view-manage/view/:id/list',
        component: 'setting/views/monitor-view-manage',
    },
    {
        path: '/*/*/unicom/setting/core/group-manage',
        component: 'setting/views/group-manage',
    },
    // 监控班组设置-值班管理
    {
        path: '/*/*/unicom/management-home-page/core/group-manage',
        component: 'setting/views/group-manage',
    },
    // 监控中心设置
    {
        exact: true,
        path: '/*/*/unicom/setting/monitor-setting',
        component: 'setting/views/monitor-setting',
    },
    // 重保记录
    {
        exact: true,
        path: '/*/*/unicom/setting/reinsurance-record',
        component: 'setting/views/reinsurance-record',
    },
    // 重保记录
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/reinsurance-record',
        component: 'setting/views/reinsurance-record',
    },
    // 监控中心设置-值班管理
    {
        exact: true,
        path: '/*/*/unicom/management-home-page/monitor-setting',
        component: 'setting/views/monitor-setting',
    },
    // 移动监控视图路由
    {
        exact: true,
        path: '/*/*/unicom/setting/views/monitor-view-manage',
        component: 'setting/views/monitor-view-manage',
    },
    // 移动改造版本监控视图路由
    {
        exact: true,
        path: '/*/*/unicom/monitor-window-manage',
        component: 'monitor-window-manage',
    },
    {
        exact: true,
        path: '/*/*/unicom/monitor-window-manage/:type/:id',
        component: 'monitor-window-manage/edit',
    },

    {
        exact: true,
        path: '/*/*/unicom/service/service-manage',
        component: 'service/service-manage',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-stats/views/stats-indi-manage',
        component: 'alarm-stats/views/stats-indi-manage',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-stats/views/stats-item-manage',
        component: 'alarm-stats/views/stats-item-manage',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-stats/views/stats-scope-define/:moduleId',
        component: 'setting/filter',
    },
    {
        exact: true,
        path: '/*/*/unicom/model-design/model-define',
        component: 'model-design/model-define',
    },
    {
        exact: true,
        path: '/*/*/unicom/model-design/model-options',
        component: 'model-design/model-options',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/views/share-subscription',
        component: 'setting/views/share-subscription',
    },
    {
        exact: true,
        path: '/*/*/unicom/columns-sort-drag',
        component: 'columns-sort-drag',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-home',
        component: 'alarm-home',
    },
    {
        exact: true,
        path: '/*/*/unicom/preprocessed-query',
        component: 'preprocessed-query',
    },
    {
        exact: true,
        path: '/*/*/unicom/preprocessed-query/historyDetials',
        component: 'preprocessed-query/historyDetials',
    },
    {
        exact: true,
        path: '/*/*/unicom/preProcessing-management',
        component: 'preProcessing-management',
    },
    {
        exact: true,
        path: '/*/*/unicom/custom-window/:develop?',
        component: 'custom-window',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/view/duty-window/view/unicom',
        component: 'alarm-window-unicom/duty-window',
    },
    {
        exact: true,
        path: '/*/*/unicom/duty-window/:develop?',
        component: 'duty-window',
    },
    {
        exact: true,
        path: '/*/*/unicom/duty-window-new',
        component: 'duty-window-new',
    },
    {
        exact: true,
        path: '/*/*/unicom/carding-table/views/group-table/table-manage',
        component: 'carding-table/views/group-table/table-manage',
    },
    {
        exact: true,
        path: '/*/*/unicom/carding-table/views/group-table/table-publish',
        component: 'carding-table/views/group-table/table-publish',
    },
    {
        exact: true,
        path: '/*/*/unicom/carding-table/views/group-table/contribution-statistics',
        component: 'carding-table/views/group-table/info-statistics/contribution-statistics',
    },
    {
        exact: true,
        path: '/*/*/unicom/carding-table/views/group-table/version-statistics',
        component: 'carding-table/views/group-table/info-statistics/version-statistics',
    },
    {
        exact: true,
        path: '/*/*/unicom/carding-table/views/province-table/table-update',
        component: 'carding-table/views/province-table/table-update',
    },
    {
        exact: true,
        path: '/*/*/unicom/carding-table/views/province-table/table-manage',
        component: 'carding-table/views/province-table/table-manage',
    },
    {
        exact: true,
        path: '/*/*/unicom/carding-table/views/province-table/table-review',
        component: 'carding-table/views/province-table/table-review',
    },
    {
        exact: true,
        path: '/*/*/unicom/carding-table/views/province-table/table-submit',
        component: 'carding-table/views/province-table/table-submit',
    },
    {
        exact: true,
        path: '/*/*/unicom/carding-table/views/table-online/:type',
        component: 'carding-table/views/table-online',
    },
    {
        exact: true,
        path: '/*/*/unicom/carding-table/views/file-manage/:type',
        component: 'carding-table/views/file-manage',
    },
    {
        exact: true,
        path: '/*/*/unicom/terminal-demo',
        component: 'terminal-demo',
    },
    {
        exact: true,
        path: '/*/*/unicom/search-tree',
        component: 'search-tree',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-manual-clear',
        component: 'alarm-manual-clear',
    },
    {
        exact: true,
        path: '/*/*/unicom/terminal',
        component: 'terminal',
    },
    {
        exact: true,
        path: '/*/*/unicom/terminal/script-manage',
        component: 'terminal/script-manage',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-log',
        component: 'alarm-log-query',
    },
    {
        exact: true,
        path: '/*/*/unicom/process-monitor',
        component: 'alarm-home-JL/process-monitor',
    },
    {
        exact: true,
        path: '/*/*/unicom/data-integrity-report',
        component: 'alarm-home-JL/data-integrity-report',
    },
    {
        exact: true,
        path: '/*/*/unicom/workflow-monitor',
        component: 'alarm-home-JL/workflow-monitor',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-home-JL-home',
        component: 'alarm-home-JL/alarm-home-JL-home',
    },
    {
        exact: true,
        path: '/*/*/unicom/maintenance',
        component: 'maintenance',
    },
    {
        exact: true,
        path: '/*/*/unicom/maintenance/:type',
        component: 'maintenance',
    },
    {
        exact: true,
        path: '/*/*/unicom/maintenance-quick-query',
        component: 'maintenance-quick-query',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/maintenance-quick-query',
        component: 'maintenance-quick-query',
    },

    {
        exact: true,
        path: '/*/*/unicom/single-monitoring',
        component: 'single-monitoring',
    },
    // 班组管理
    {
        exact: true,
        path: '/*/*/unicom/maintain-team',
        component: 'maintain-team',
    },
    {
        exact: true,
        path: '/*/*/unicom/home/home-work',
        component: 'home-work',
    },
    {
        exact: true,
        path: '/*/*/unicom/duty-management',
        component: 'duty-management',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-page',
        component: 'home-page',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/monitor-manage/:type',
        component: 'home-work/monitor-manage',
    },
    {
        exact: true,
        path: '/*/*/unicom/monitor-date-list-search',
        component: 'monitor-data-list-search',
    },
    {
        exact: true,
        path: '/*/*/unicom/management-home-page/monitor-date-list-search',
        component: 'monitor-data-list-search',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/monitor-date-list-search',
        component: 'monitor-data-list-search',
    },
    // 监控值班表-值班管理
    {
        exact: true,
        path: '/*/*/unicom/management-home-page/monitor-date-list',
        component: 'home-work/monitor-date-list',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/filter-condition-group/:mode',
        component: 'setting/filter-condition-group',
    },

    {
        exact: true,
        path: '/*/*/unicom/home-unicom/failure-sheet',
        component: 'failure-sheet',
    },
    {
        exact: true,
        path: '/*/*/unicom/failure-sheet',
        component: 'failure-sheet',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-subtype-query',
        component: 'alarm-subtype-query',
    },

    {
        exact: true,
        path: '/*/*/unicom/topo-monitor',
        component: 'topo-monitor',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/failure-sheet-long',
        component: 'failure-sheet-long',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/alarm-window-long',
        component: 'alarm-window-long',
    },
    {
        exact: true,
        path: '/*/*/unicom/failure-sheet-long',
        component: 'failure-sheet-long',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-window-long',
        component: 'alarm-window-long',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-report/:id',
        component: 'alarm-report',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-window/duty-window',
        component: 'alarm-window/duty-window',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-window/custom-window',
        component: 'alarm-window/custom-window',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-window/duty-window/open-window',
        component: 'alarm-window/duty-window/open-window',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-interrupt-monitor/:moduleId',
        component: 'alarm-interrupt-monitor',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-interrupt-monitor/:type/:moduleId/:id/:provinceId/:provinceName',
        component: 'alarm-interrupt-monitor/edit',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-interrupt-monitor-add/:type/:moduleId/:id/:provinceId/:provinceName',
        component: 'alarm-interrupt-monitor/edit',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-outbound-mailList',
        component: 'alarm-outbound-mailList',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/alarm-window-unicom/duty-window',
        component: 'alarm-window-unicom/duty-window',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/alarm-window-unicom/custom-window',
        component: 'alarm-window-unicom/custom-window',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-search/alarm-query',
        component: 'alarm-search/alarm-query',
    },
    {
        exact: true,
        path: '/*/*/unicom/topo-ipran',
        component: 'topo-ipran',
    },
    {
        exact: true,
        path: '/*/*/unicom/rule-base',
        component: 'rule-base',
    },
    {
        exact: true,
        path: '/*/*/unicom/rule-base/rule-base-details',
        component: 'rule-base/rule-base-details',
    },
    {
        exact: true,
        path: '/*/*/unicom/notice-manage',
        component: 'notice-manage',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/send-sms',
        component: 'send-sms',
    },
    {
        exact: true,
        path: '/*/*/unicom/gray-manage',
        component: 'gray-manage',
    },
    {
        exact: true,
        path: '/*/*/unicom/topo/topo-cores',
        component: 'topo/topo-cores',
    },
    {
        exact: true,
        path: '/*/*/unicom/change-shifts-page',
        component: 'change-shifts-page',
    },
    // 交接班-值班管理
    {
        exact: true,
        path: '/*/*/unicom/management-home-page/change-shifts-page',
        component: 'change-shifts-page',
    },
    // 排班管理-交接班
    {
        exact: true,
        path: '/*/*/unicom/setting/change-shifts-page',
        component: 'change-shifts-page',
    },
    // 排班管理-交接班
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/change-shifts-page',
        component: 'change-shifts-page',
    },
    {
        exact: true,
        path: '/*/*/unicom/change-shifts-page/abnormal-page',
        component: 'change-shifts-page/abnormal-page',
    },
    {
        exact: true,
        path: '/*/*/unicom/change-shifts-page/change-shifts',
        component: 'change-shifts-page/change-shifts',
    },

    {
        exact: true,
        path: '/*/*/unicom/management-home-page/change-shifts-page/change-shifts',
        component: 'change-shifts-page/change-shifts',
    },
    // 排班管理-交接班
    {
        exact: true,
        path: '/*/*/unicom/setting/change-shifts-page/change-shifts',
        component: 'change-shifts-page/change-shifts',
    },
    // 故障记录操作历史查询-交接班
    {
        exact: true,
        path: '/*/*/unicom/change-shifts-page/fault-operation-history',
        component: 'change-shifts-page/fault-operation-history',
    },
    // 故障记录操作历史查询-交接班
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/change-shifts-page/fault-operation-history',
        component: 'change-shifts-page/fault-operation-history',
    },
    // 交接班-上一班次总结
    {
        exact: true,
        path: '/*/*/unicom/change-shifts-page/previous-duty-summary',
        component: 'change-shifts-page/previous-duty-summary',
    },
    // 交接班-上一班次总结
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/change-shifts-page/previous-duty-summary',
        component: 'change-shifts-page/previous-duty-summary',
    },
    {
        exact: true,
        path: '/*/*/unicom/record-duty',
        component: 'record-duty',
    },
    // 排班管理-值班记录
    {
        exact: true,
        path: '/*/*/unicom/setting/record-duty',
        component: 'record-duty',
    },
    // 排班管理-值班记录
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/record-duty',
        component: 'record-duty',
    },
    // 值班日志详情
    {
        exact: true,
        path: '/*/*/unicom/duty-record-detail',
        component: 'duty-record-detail',
    },
    {
        exact: true,
        path: '/*/*/unicom/management-home-page/record-duty',
        component: 'record-duty',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/simulation-validation-add',
        component: 'setting/simulation-validation',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/simulation-validation-list',
        component: 'setting/simulation-validation/list',
    },
    {
        exact: true,
        path: '/*/*/unicom/setting/simulation-validation-detail/:recordId',
        component: 'setting/simulation-validation/detail',
    },
    // 故障调度工作台
    {
        exact: true,
        path: '/*/*/unicom/home/troubleshooting-workbench',
        component: 'troubleshooting-workbench',
    },
    {
        exact: true,
        path: '/*/*/unicom/topo/topo-access',
        component: 'topo/topo-access',
    },
    {
        exact: true,
        path: '/*/*/unicom/management-home-page',
        component: 'management-home-page',
    },
    {
        exact: true,
        path: '/*/*/unicom/home/fault-details',
        component: 'fault-details',
    },
    {
        exact: true,
        path: '/*/*/unicom/home/fault-scheduling-notification',
        component: 'fault-scheduling-notification',
    },
    {
        exact: true,
        path: '/*/*/unicom/home/fault-scheduling-notification/:type',
        component: 'fault-scheduling-notification/edit',
    },
    {
        exact: true,
        path: '/*/*/unicom/home/spare-parts',
        component: 'spare-parts',
    },
    // 工作台配置中心
    {
        exact: true,
        path: '/*/*/unicom/workbench-manage',
        component: 'workbench-manage',
    },
    // 自定义工作台
    {
        exact: true,
        path: '/*/*/unicom/work-bench',
        component: 'work-bench',
    },
    // IVR外呼规则
    {
        exact: true,
        path: '/*/*/unicom/ivr-rule-record',
        component: 'ivr-rule-record',
    },
    {
        exact: true,
        path: '/*/*/unicom/shift-record',
        component: 'shift-record',
    },
    // 短信发送记录
    {
        exact: true,
        path: '/*/*/unicom/message-record',
        component: 'message-record',
    },
    {
        exact: true,
        path: '/*/*/unicom/chatOpsWeb/dispatch-setting',
        component: 'dispatch-setting',
    },
    {
        exact: true,
        path: '/*/*/unicom/dispatch-setting/dispatch-auto',
        component: 'dispatch-setting/dispatch-auto',
    },
    {
        exact: true,
        path: '/*/*/unicom/dispatch-setting/dispatch-manual',
        component: 'dispatch-setting/dispatch-manual',
    },
    {
        exact: true,
        path: '/*/*/unicom/view/setting-robot',
        component: 'overview',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-supplement',
        component: 'alarm-supplement',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-supplement-add',
        component: 'alarm-supplement/add',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-supplement-add/:taskId',
        component: 'alarm-supplement/add',
    },
    {
        exact: true,
        path: '/*/*/unicom/alarm-supplement-detail/:taskId',
        component: 'alarm-supplement/detail',
    },
    {
        // 骨干网嵌入
        exact: true,
        path: '/*/*/unicom/implant-sys',
        component: 'implant-sys',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom',
        component: 'workbench-manage-new',
    },
    {
        // 值班长视图
        exact: true,
        path: '/*/*/unicom/duty-monitor-view',
        component: 'duty-monitor-view',
    },
    {
        // 值班人员视图
        exact: true,
        path: '/*/*/unicom/monitor-view',
        component: 'work-bench',
    },
    {
        // 全国工作台
        exact: true,
        path: '/*/*/unicom/integrated-monitoring',
        component: 'integrated-monitoring',
    },
    // 故障上报
    {
        exact: true,
        path: '/*/*/unicom/home/troubleshooting-workbench/fault-report',
        component: 'fault-report',
    },
    // 故障上报规则管理
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/troubleshooting-workbench/fault-report/rule-manage',
        component: 'fault-rule-manage',
    },
    // 故障上报规则管理
    {
        exact: true,
        path: '/*/*/unicom/home/troubleshooting-workbench/fault-report/rule-manage',
        component: 'fault-rule-manage',
    },
    // 故障上报用户管理
    {
        exact: true,
        path: '/*/*/unicom/home/troubleshooting-workbench/fault-report/user-manage',
        component: 'fault-user-manage',
    },
    // 故障上报-无线
    {
        exact: true,
        path: '/*/*/unicom/home/troubleshooting-workbench/fault-report-wireless',
        component: 'fault-report',
    },
    // 故障上报详情
    {
        exact: true,
        path: '/*/*/unicom/home/troubleshooting-workbench/fault-report/fault-report-detail',
        component: 'fault-report/fault-report-detail',
    },
    // 故障上报首报
    {
        exact: true,
        path: '/*/*/unicom/home/troubleshooting-workbench/fault-report/fault-report-add',
        component: 'fault-report/fault-report-add',
    },
    // 临时路由调整记录
    {
        exact: true,
        path: '/*/*/unicom/setting/record-temporary-route',
        component: 'setting/record-temporary-route',
    },
    // 临时路由调整记录
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/record-temporary-route',
        component: 'setting/record-temporary-route',
    },

    // 网络隐患记录
    {
        exact: true,
        path: '/*/*/unicom/setting/record-network-hazard',
        component: 'setting/record-network-hazard',
    },
    // 网络隐患记录
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/record-network-hazard',
        component: 'setting/record-network-hazard',
    },
    // 交接班-故障记录操作历史
    {
        exact: true,
        path: '/*/*/unicom/setting/breakdown-record-operate-history',
        component: 'setting/breakdown-record-operate-history',
    },
    // 操作登记
    {
        exact: true,
        path: '/*/*/unicom/setting/operator-logon',
        component: 'setting/operator-logon',
    },
    // 操作登记
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/operator-logon',
        component: 'setting/operator-logon',
    },
    // 个性化功能-告警与优化管理
    {
        exact: true,
        path: '/*/*/unicom/setting/alarm-optimization-management',
        component: 'setting/alarm-optimization-management',
    },
    // 个性化功能-告警与优化管理
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/alarm-optimization-management',
        component: 'setting/alarm-optimization-management',
    },
    // 值班考勤
    {
        exact: true,
        path: '/*/*/unicom/setting/check-duty-attendance',
        component: 'setting/check-duty-attendance',
    },
    // 模块管理-业务故障管理
    {
        exact: true,
        path: '/*/*/unicom/setting/service-fault-management',
        component: 'setting/service-fault-management',
    },
    // 模块管理-业务故障管理
    {
        exact: true,
        path: '/*/*/unicom/setting/service-fault-management',
        component: 'setting/service-fault-management',
    },
    // 模块管理-业务故障管理-业务平台
    {
        exact: true,
        path: '/*/*/unicom/setting/service-fault-management/professional',
        component: 'setting/service-fault-management/professional',
    },
    // 模块管理-业务故障管理-核心网
    {
        exact: true,
        path: '/*/*/unicom/setting/service-fault-management/core-network',
        component: 'setting/service-fault-management/core-network',
    },
    // 模块管理-业务故障管理-ATM
    {
        exact: true,
        path: '/*/*/unicom/setting/service-fault-management/atm',
        component: 'setting/service-fault-management/atm',
    },
    // 模块管理-业务故障管理-大客户平台
    {
        exact: true,
        path: '/*/*/unicom/setting/service-fault-management/big-customer',
        component: 'setting/service-fault-management/big-customer',
    },
    // 模块管理-业务故障管理
    {
        exact: true,
        path: '/*/*/unicom/setting/service-fault-management',
        component: 'setting/service-fault-management',
    },
    // 模块管理-业务故障管理
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/service-fault-management',
        component: 'setting/service-fault-management',
    },
    // 模块管理-业务故障管理-业务平台
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/service-fault-management/professional',
        component: 'setting/service-fault-management/professional',
    },
    // 模块管理-业务故障管理-核心网
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/service-fault-management/core-network',
        component: 'setting/service-fault-management/core-network',
    },
    // 模块管理-业务故障管理-ATM
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/service-fault-management/atm',
        component: 'setting/service-fault-management/atm',
    },
    // 模块管理-业务故障管理-大客户平台
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/service-fault-management/big-customer',
        component: 'setting/service-fault-management/big-customer',
    },
    // 拨测记录
    {
        exact: true,
        path: '/*/*/unicom/call-test-record',
        component: 'call-test-record',
    },
    // 拨测记录
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/call-test-record',
        component: 'call-test-record',
    },
    // 维护作业计划
    {
        exact: true,
        path: '/*/*/unicom/setting/views/maintain-job',
        component: 'setting/views/maintain-job',
    },
    // 维护作业计划
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/setting/views/maintain-job',
        component: 'setting/views/maintain-job',
    },
    // 故障记录汇总
    {
        exact: true,
        path: '/*/*/unicom/summary-of-fault-records',
        component: 'summary-of-fault-records',
    },
    // 故障记录汇总
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/summary-of-fault-records',
        component: 'summary-of-fault-records',
    },
    // 网管操作记录
    {
        exact: true,
        path: '/*/*/unicom/network-operation-record',
        component: 'network-operation-record',
    },
    // 网管操作记录
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/network-operation-record',
        component: 'network-operation-record',
    },
    // 网络 安全事件
    {
        exact: true,
        path: '/*/*/unicom/network-security-events',
        component: 'network-security-events',
    },
    // 网络 安全事件
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/network-security-events',
        component: 'network-security-events',
    },
    // 网络割接管理
    {
        exact: true,
        path: '/*/*/unicom/network-cutover',
        component: 'network-cutover/home',
    },
    // 业务平台专业
    {
        exact: true,
        path: '/*/*/unicom/network-cutover/business',
        component: 'network-cutover/business',
    },
    // ATM专业
    {
        exact: true,
        path: '/*/*/unicom/network-cutover/ATM',
        component: 'network-cutover/atm',
    },
    // 核心网专业
    {
        exact: true,
        path: '/*/*/unicom/network-cutover/core',
        component: 'network-cutover/core',
    },
    // 传输网专业
    {
        exact: true,
        path: '/*/*/unicom/network-cutover/transmission',
        component: 'network-cutover/transmission',
    },
    // 互联网专业
    {
        name: '互联网专业',
        path: '/*/*/unicom/network-cutover/internet',
        component: 'network-cutover/internet',
        // 交接班-网管系统告警监测
    },
    {
        name: '云资源专业',
        path: '/*/*/unicom/network-cutover/cloud',
        component: 'network-cutover/cloud',
    },
    // 网络割接管理
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/network-cutover',
        component: 'network-cutover/home',
    },
    // 业务平台专业
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/network-cutover/business',
        component: 'network-cutover/business',
    },
    // ATM专业
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/network-cutover/ATM',
        component: 'network-cutover/atm',
    },
    // 核心网专业
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/network-cutover/core',
        component: 'network-cutover/core',
    },
    // 传输网专业
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/network-cutover/transmission',
        component: 'network-cutover/transmission',
    },
    // 互联网专业
    {
        name: '互联网专业',
        path: '/*/*/unicom/home-unicom/network-cutover/internet',
        component: 'network-cutover/internet',
        // 交接班-网管系统告警监测
    },
    // 云资源专业
    {
        name: '云资源专业',
        path: '/*/*/unicom/home-unicom/network-cutover/cloud',
        component: 'network-cutover/cloud',
        // 交接班-网管系统告警监测
    },
    {
        exact: true,
        path: '/*/*/unicom/network-management-system-alarm-monitoring',
        component: 'network-management-system-alarm-monitoring',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/network-management-system-alarm-monitoring',
        component: 'network-management-system-alarm-monitoring',
    },
    // 交接班-割接执行记录
    {
        exact: true,
        path: '/*/*/unicom/cutting-execution-record',
        component: 'cutting-execution-record',
    },
    // 交接班-割接执行记录
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/cutting-execution-record',
        component: 'cutting-execution-record',
    },
    // 模块管理-网络故障管理
    {
        exact: true,
        path: '/*/*/unicom/modules-fault-management',
        component: 'modules-fault-management',
    },
    // 模块管理-网络故障管理-核心网
    {
        exact: true,
        path: '/*/*/unicom/modules-fault-management/core-network',
        component: 'modules-fault-management/core-network',
    },
    // 模块管理-网络故障管理-非核心网-atm
    {
        exact: true,
        path: '/*/*/unicom/modules-fault-management/atm',
        component: 'modules-fault-management/not-core-network',
    },
    // 模块管理-网络故障管理-非核心网-互联网专业
    {
        exact: true,
        path: '/*/*/unicom/modules-fault-management/intel',
        component: 'modules-fault-management/not-core-network',
    },
    // 模块管理-网络故障管理-非核心网-大客户平台
    {
        exact: true,
        path: '/*/*/unicom/modules-fault-management/bigCustom',
        component: 'modules-fault-management/not-core-network',
    },
    // 模块管理-网络故障管理-非核心网-云监控专业
    {
        exact: true,
        path: '/*/*/unicom/modules-fault-management/cloud',
        component: 'modules-fault-management/not-core-network',
    },
    // 模块管理-网络故障管理
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/modules-fault-management',
        component: 'modules-fault-management',
    },
    // 模块管理-网络故障管理-核心网
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/modules-fault-management/core-network',
        component: 'modules-fault-management/core-network',
    },
    // 模块管理-网络故障管理-非核心网-atm
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/modules-fault-management/atm',
        component: 'modules-fault-management/not-core-network',
    },
    // 模块管理-网络故障管理-非核心网-互联网专业
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/modules-fault-management/intel',
        component: 'modules-fault-management/not-core-network',
    },
    // 模块管理-网络故障管理-非核心网-大客户平台
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/modules-fault-management/bigCustom',
        component: 'modules-fault-management/not-core-network',
    },
    // 模块管理-网络故障管理-非核心网-云监控专业
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/modules-fault-management/cloud',
        component: 'modules-fault-management/not-core-network',
    },
    // 国际资源监控
    {
        exact: true,
        path: '/*/*/unicom/international-resource-monitor',
        component: 'international-resource-monitor',
    },
    // 统计数据
    {
        exact: true,
        path: '/*/*/unicom/setting/core/statistical-data',
        component: 'statistical-data',
    },
    // 统计数据-详情
    {
        exact: true,
        path: '/*/*/unicom/setting/core/statistical-data/detail',
        component: 'statistical-data/detail',
    },
    {
        exact: true,
        path: '/*/*/unicom/troubleshooting-workbench/gnoc',
        component: 'troubleshooting-workbench/components/header/fault-report-modal',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/large-screen-console',
        component: 'large-screen-console',
    },
    {
        exact: true,
        path: '/*/*/unicom/home-unicom/business-platform-monitor-daily',
        component: 'business-platform-monitor-daily',
    },
    {
        exact: true,
        path: '/*/*/unicom/network-fault-file',
        component: 'network-fault-file',
    },
    // 集中存档统计报表
    {
        exact: true,
        path: '/*/*/unicom/centralized-archive-report',
        component: 'centralized-archive-report',
    },
    {
        exact: true,
        path: '/*/*/unicom/eoms-config',
        component: 'eoms-config',
    },
    // 重大故障自动上报
    {
        exact: true,
        path: '/*/*/unicom/home/troubleshooting-workbench/major-fault-report',
        component: 'major-fault-report',
    },
];
const finalRoutes = routes.concat(process.env.NODE_ENV === 'production' ? [] : DemoRoutes);

export default router.buildRoutes(finalRoutes);
export * from './base';
