import React from 'react';
import { Button, Space, Divider, PageHeader, Menu, Layout } from 'oss-ui';
import constants from '@Src/common/constants';

const { Header } = Layout;
const { Item: MenuItem, SubMenu } = Menu;
class Test extends React.PureComponent {
    productionMenus = [
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home-unicom`,
            label: '监控工作台',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/management-home-page`,
            label: '值班管理',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench`,
            label: '调度工作台',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/major-fault-report`,
            label: '重大故障自动上报',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report/rule-manage`,
            label: '故障上报规则管理',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/monitor-dispatch-manage`,
            label: '监控调度管理',
            children: [
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/monitor-center-manage`,
                    label: '监控中心管理',
                    children: [
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/record-temporary-route`,
                            label: '临时路由调整记录',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/reinsurance-record`,
                            label: '重保记录(自查)',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/summary-of-fault-records`,
                            label: '故障记录汇总',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/record-network-hazard`,
                            label: '网络隐患记录',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/network-operation-record`,
                            label: '网管操作记录',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/check-duty-attendance`,
                            label: '值班考勤',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/operator-logon`,
                            label: '操作登记',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/alarm-optimization-management`,
                            label: '告警与优化管理',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/network-cutover`,
                            label: '网络割接管理',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/network-security-events`,
                            label: '网络安全事件',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/service-fault-management`,
                            label: '业务故障管理',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/modules-fault-management`,
                            label: '网络故障管理',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/monitor-setting`,
                            label: '监控中心设置',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/core/group-manage`,
                            label: '值班班组设置',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/management-home-page/change-shifts-page`,
                            label: '交接班',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/record-duty`,
                            label: '值班日志查询',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/monitor-date-list-search`,
                            label: '值班班表',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/core/statistical-data`,
                            label: '统计数据',
                        },
                    ],
                },
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/monitor-view-manage`,
                    label: '监控视图管理',
                    children: [
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/core/monitor-view-manage/view/1/list`,
                            label: '监控视图设置',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/1/list`,
                            label: '过滤器设置',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/views/col-template`,
                            label: '列模板设置',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/views/status-manager`,
                            label: '状态标识设置',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/experiences`,
                            label: '经验库管理',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-interrupt-monitor/999`,
                            label: '告警中断监测',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter-condition-group/1`,
                            label: '网元组管理',
                        },
                    ],
                },
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/maintain-team`,
                    label: '运维调度班组',
                },
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/auto-sheet-rule/10/list`,
                    label: '自动派单规则',
                },
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarmRule`,
                    label: '告警规则管理',
                    children: [
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/fault-scheduling-notification`,
                            label: '故障调度通知',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-supplement`,
                            label: '告警补派管理',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/63/list`,
                            label: '告警追单规则',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/auto-sheet-rule/604/list`,
                            label: '高铁派单规则',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/rule-base`,
                            label: '规则库',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/security/usergroup-manager/usergroup-list`,
                            label: '用户组管理',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/ivr`,
                            label: 'IVR外呼规则',
                            children: [
                                {
                                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/14/list`,
                                    label: 'IVR规则',
                                },
                                {
                                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/ivr-rule-record`,
                                    label: '外呼记录',
                                },
                            ],
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/sms`,
                            label: '短信前转规则',
                            children: [
                                {
                                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/4/list`,
                                    label: '短信规则',
                                },
                                {
                                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/message-record`,
                                    label: '短信记录',
                                },
                            ],
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/8/list`,
                            label: '告警发生规则',
                        },
                    ],
                },
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/auto-sheet-rule/10/list`,
                    label: '告警自核查',
                    children: [
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-report/1?reportid=unicom_resource_rate_check`,
                            label: '资源覆盖率核查',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-report/2?reportid=unicom_fault_sheet_check`,
                            label: '故障派单核查',
                        },
                    ],
                },
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/notice-manage`,
                    label: '公告管理',
                    children: [
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/notice-manage`,
                            label: '公告设置',
                        },
                    ],
                },
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/network-operation-analysis`,
                    label: '网络运营分析',
                    children: [
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/network-fault-file`,
                            label: '网络故障集中存档',
                        },
                        {
                            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/centralized-archive-report`,
                            label: '集中存档统计报表',
                        },
                    ],
                },
            ],
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting`,
            label: '系统管理',
            children: [
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/gray-manage`,
                    label: '灰度路由配置',
                },
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/eoms-config`,
                    label: '派单配置',
                },
            ],
        },
    ];
    demoMenus = [
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/template-demo`,
            label: '业务代码模板',
            children: [
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/modal-demo`,
                    label: '弹窗模板',
                },
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/protable-page-demo`,
                    label: '列表页模板',
                },
            ],
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/test-component-fault-details-timeline`,
            label: '调度详情时间线demo',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/select-configurable`,
            label: '可配置下拉',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/map-path`,
            label: '百度path地图',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/view-page-home`,
            label: '中台组件demo',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/change-shifts-demo`,
            label: '交接班相关组件demo',
            children: [
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/change-shifts-edit-table-demo`,
                    label: '交接班可编辑表格',
                },
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/continuity-shift-modal-demo`,
                    label: '连续性交接班弹窗',
                },
            ],
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/decoration-demo`,
            label: '装饰组件demo',
            children: [
                {
                    key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/title-prefix`,
                    label: '标题前缀修饰',
                },
            ],
        },
    ];
    workbenchMenus = [
        {
            label: '工作台入口',
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home-unicom`,
        },
        {
            label: '通用工作台',
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/integrated-monitoring`,
        },
        {
            label: '值班长工作台',
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/duty-monitor-view`,
        },
        {
            label: '值班人工作台',
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/monitor-view`,
        },
    ];
    changeShiftsMenus = [
        {
            label: '值班记录',
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/change-shifts-page`,
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/record-duty`,
            label: '值班日志查询',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/monitor-date-list-search`,
            label: '值班班表',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/core/group-manage`,
            label: '值班班组设置',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/duty-record-detail`,
            label: '值班日志详情',
        },
    ];
    alarmMenus = [
        {
            label: '自定义视图',
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home-unicom/alarm-window-unicom/custom-window`,
        },
        {
            label: '当班监控视图',
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home-unicom/alarm-window-unicom/duty-window`,
        },
        {
            key: `//znjk/${constants.CUR_ENVIRONMENT}/unicom/home-unicom/search/alarm-query`,
            label: '告警查询',
        },
        {
            key: `//znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-search/alarm-query`,
            label: '告警查询',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home-unicom/failure-sheet-long`,
            label: '超长工单查询',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home-unicom/alarm-window-long`,
            label: '超长告警查询',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/topo-monitor`,
            label: '拓扑监控',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home-unicom/failure-sheet`,
            label: '工单查询',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report`,
            label: '故障上报管理列表',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-subtype-query`,
            label: '告警子类型页面配置',
        },
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/international-resource-monitor`,
            label: '国际网络监控',
        },
    ];
    chatOpsMenus = [
        {
            label: '在线群聊app',
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/chatOps/talk-view`,
        },
        {
            label: '在线群聊',
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/talk-view`,
        },
    ];
    otherMenus = [
        {
            label: '短信视图',
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home-unicom/send-sms`,
        },
        {
            label: '报表',
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-report/1`,
        },
        {
            label: '当班窗口-联通新版',
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home-unicom/view/duty-window/view/unicom`,
        },
    ];

    largeScreenMenu = [
        {
            key: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home-unicom/large-screen-console`,
            label: '大屏控制台',
        },
    ];
    onMenuClick = ({ key }) => {
        this.props.history.push(key);
    };
    renderMenuChildren = (menus) => {
        return menus.map((item) => {
            if (Array.isArray(item.children)) {
                return (
                    <SubMenu key={item.key} title={item.label}>
                        {this.renderMenuChildren(item.children)}
                    </SubMenu>
                );
            }
            return <MenuItem key={item.key}>{item.label}</MenuItem>;
        });
    };

    render() {
        return (
            <>
                <Layout>
                    <Header className="header" style={{ padding: 0, backgroundColor: '#fff' }}>
                        <div
                            className="logo"
                            style={{
                                float: 'left',
                                width: '160px',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                paddingLeft: '20px',
                                background: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            生产环境菜单
                        </div>
                        <Menu mode="horizontal" onClick={this.onMenuClick}>
                            {this.renderMenuChildren(this.productionMenus)}
                        </Menu>
                    </Header>
                    <Header className="header" style={{ padding: 0, backgroundColor: '#fff' }}>
                        <div
                            className="logo"
                            style={{
                                float: 'left',
                                width: '160px',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                paddingLeft: '20px',
                                background: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            工作台
                        </div>
                        <Menu mode="horizontal" onClick={this.onMenuClick}>
                            {this.renderMenuChildren(this.workbenchMenus)}
                        </Menu>
                    </Header>
                    <Header className="header" style={{ padding: 0, backgroundColor: '#fff' }}>
                        <div
                            className="logo"
                            style={{
                                float: 'left',
                                width: '160px',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                paddingLeft: '20px',
                                background: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            大屏
                        </div>
                        <Menu mode="horizontal" onClick={this.onMenuClick}>
                            {this.renderMenuChildren(this.largeScreenMenu)}
                        </Menu>
                    </Header>
                    <Header className="header" style={{ padding: 0, backgroundColor: '#fff' }}>
                        <div
                            className="logo"
                            style={{
                                float: 'left',
                                width: '160px',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                paddingLeft: '20px',
                                background: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            值班管理
                        </div>
                        <Menu mode="horizontal" onClick={this.onMenuClick}>
                            {this.renderMenuChildren(this.changeShiftsMenus)}
                        </Menu>
                    </Header>
                    <Header className="header" style={{ padding: 0, backgroundColor: '#fff' }}>
                        <div
                            className="logo"
                            style={{
                                float: 'left',
                                width: '160px',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                paddingLeft: '20px',
                                background: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            告警监控
                        </div>
                        <Menu mode="horizontal" onClick={this.onMenuClick}>
                            {this.renderMenuChildren(this.alarmMenus)}
                        </Menu>
                    </Header>
                    <Header className="header" style={{ padding: 0, backgroundColor: '#fff' }}>
                        <div
                            className="logo"
                            style={{
                                float: 'left',
                                width: '160px',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                paddingLeft: '20px',
                                background: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            组件demo
                        </div>
                        <Menu mode="horizontal" onClick={this.onMenuClick}>
                            {this.renderMenuChildren(this.demoMenus)}
                        </Menu>
                    </Header>
                    <Header className="header" style={{ padding: 0, backgroundColor: '#fff' }}>
                        <div
                            className="logo"
                            style={{
                                float: 'left',
                                width: '160px',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                paddingLeft: '20px',
                                background: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            ChatOps
                        </div>
                        <Menu mode="horizontal" onClick={this.onMenuClick}>
                            {this.renderMenuChildren(this.chatOpsMenus)}
                        </Menu>
                    </Header>
                    <Header className="header" style={{ padding: 0, backgroundColor: '#fff' }}>
                        <div
                            className="logo"
                            style={{
                                float: 'left',
                                width: '160px',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                paddingLeft: '20px',
                                background: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            其他
                        </div>
                        <Menu mode="horizontal" onClick={this.onMenuClick}>
                            {this.renderMenuChildren(this.otherMenus)}
                        </Menu>
                    </Header>
                </Layout>
            </>
        );
    }
}

export default Test;
