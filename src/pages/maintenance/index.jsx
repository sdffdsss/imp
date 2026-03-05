import React from 'react';
import { withModel } from 'hox';
import moment from 'moment';
import request from '@Src/common/api';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { Tooltip, Icon, Space, Select, Button, Modal, Form, Tabs, Table, message, Input } from 'oss-ui';
import PageContainer from '@Components/page-container';
import AuthButton from '@Src/components/auth-button';
import { createFileFlow } from '@Common/utils/download';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { VirtualTable } from 'oss-web-common';
import { _ } from 'oss-web-toolkits';
import usePageInfo from './hox';
import { ReactComponent as svg1 } from './icon/edit.svg';
import CompModal from './modal';
import AsyncExportModal from './async-export-modal';
import Header from './header';
import './style.less';
import EditMode from './maintenance-edit';
import api from './api';
import { groupApi } from '../../common/api/service/groupApi';
import dayjs from 'dayjs';

// 更新数据模型
const updateRowMode = {
    acceptId: '',
    acceptName: '',
    acceptDeptId: '',
    acceptDeptName: '',
    acceptTel: '',
    acceptNightId: '',
    acceptNightName: '',
    acceptNightDeptId: '',
    acceptNightDeptName: '',
    acceptNightTel: '',
    agentId: '',
    agentName: '',
    agentDeptId: '',
    agentDeptName: '',
    agentTel: '',
    copyId: '',
    copyName: '',
    copyDeptId: '',
    copyDeptName: '',
    copyTel: '',
    smsId: '',
    smsName: '',
    smsDeptId: '',
    smsDeptName: '',
    smsTel: '',
    childId: '',
    childName: '',
    childDeptId: '',
    childDeptName: '',
    childTel: '',
    auditId: '',
    auditName: '',
    auditDeptId: '',
    auditDeptName: '',
    auditTel: '',
    daiweiManId: '',
    daiweiManName: '',
    daiweiCenterId: '',
    daiweiCenterName: '',
    daiweiCenterTel: '',
    daiweiScheId: '',
    daiweiScheName: '',
    daiweiScheDepartmentId: '',
    daiweiScheDepartment: '',
    daiweiScheTel: '',
    keyId: '',
    keyName: '',
    keyDepartmentId: '',
    keyDepartment: '',
    keyTel: '',
    uniqueRdn: '',
};

class Index extends React.PureComponent {
    asyncExportTimer = null;
    fileSrc = '';
    constructor(props) {
        super(props);
        this.state = {
            scrollY: window.innerHeight - 300,
            // 数据库加载基础数据，数据库加载后，不再处理变更
            storeBySQL: {
                provinceList: [],
                regionList: [],
                teamInfo: [],
                professional: [],
                deptList: [],
                userList: [],
            },
            dataSource: [],
            resetFlag: false,
            total: 0,
            zoneId: '',
            editVisible: false,
            editRow: {},
            editRowData: '',
            cellData: {
                title: '',
                dataIndex: '',
            },
            oldCellData: {
                title: '',
                dataIndex: '',
            },
            oldRow: {},
            flag: '1',
            curSelParmExport: {},
            tipVisible: false,
            mteamInfo: {},
            openTip: true,
            userVisible: false,
            userInfo: [],
            deptorman: 1,
            activeKey: undefined,
            deptUsers: [],
            pageNum: 1,
            userNum: 0,
            userLoading: false,
            configState: {},
            exportModalVisible: false,
            asyncExportFormInitData: {},
            asyncExportList: [],
            exportBtnLoading: false,
            otherEnum: [],
        };
        this.formRef = React.createRef();
        this.actionRef = React.createRef();
        this.type = props.match?.params?.type || '1';
        this.tbody = undefined;
        this.deptId = undefined;
        this.hasSpecialAuth = this.props?.location?.state?.hasSpecialAuth;
    }
    componentDidMount() {
        this.intData();
    }

    get columns() {
        const { provinceList, regionList, professional, teamInfo } = this.state.storeBySQL;
        const teamInfos = this.props?.location?.state?.mteamInfo || {};
        const hasSpecialAuth = this.props?.location?.state?.hasSpecialAuth;
        const { professionalName } = teamInfos;
        console.log(teamInfos, '==info');
        return [
            {
                title: '归属省份',
                dataIndex: 'provinceId',
                filters: true,
                onFilter: true,
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: this.type === '1' || this.type === '2' || this.type === '3',
                renderFormItem: () => {
                    return (
                        // eslint-disable-next-line react/jsx-no-bind
                        <Select onChange={this.changeProvince.bind(this)}>
                            {provinceList.map((item) => {
                                return (
                                    <Select.Option value={item.regionId} key={item.regionId} label={item.regionName}>
                                        {item.regionName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '归属地市',
                dataIndex: 'regionId',
                rowIndex: 'regionName',
                align: 'center',
                filters: true,
                onFilter: true,
                ellipsis: true,
                width: 70,
                hideInTable: this.type === '3',
                hideInSearch: this.type === '3',
                render: (_, record) => {
                    return record.regionName;
                },
                renderFormItem: () => {
                    const newArr = [
                        {
                            regionId: '-1',
                            regionName: '全部',
                        },
                    ];
                    regionList.forEach((item) => {
                        newArr.push(item);
                    });
                    return (
                        <Select>
                            {newArr.map((item) => {
                                return (
                                    <Select.Option value={item.regionId} key={item.regionId} label={item.regionName}>
                                        {item.regionName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '班组',
                dataIndex: 'ruleType',
                rowIndex: 'ruleType',
                // initialValue: teamName,
                filters: true,
                onFilter: true,
                ellipsis: true,
                align: 'center',
                width: 70,
                hideInSearch: true,
                hideInTable: this.type === '3',
            },
            {
                title: '归属专业',
                dataIndex: 'professionalType',
                // initialValue: professionalName,
                filters: true,
                onFilter: true,
                ellipsis: true,
                width: 30,
                hideInTable: true,
                colSize: 1,
                hideInSearch: this.type === '1' || this.type === '2' || this.type === '3',
                // valueEnum: professionalEnum,
                renderFormItem: () => {
                    return (
                        // eslint-disable-next-line react/jsx-no-bind
                        <Select onChange={this.changeProfessional.bind(this)}>
                            {professional.map((item) => {
                                return (
                                    <Select.Option value={item.key} key={item.key} label={item.value}>
                                        {item.value}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '班组',
                dataIndex: 'ruleType',
                // initialValue: teamName,
                filters: true,
                onFilter: true,
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: this.type === '1' || this.type === '2' || this.type === '3',
                // valueEnum: teamEnum,
                renderFormItem: () => {
                    const newArr = [
                        {
                            id: '0',
                            name: '全部',
                        },
                    ];
                    teamInfo.forEach((item) => {
                        newArr.push(item);
                    });
                    return (
                        <Select>
                            {newArr.map((item) => {
                                return (
                                    <Select.Option value={item.name} key={item.id} label={item.name}>
                                        {item.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '日期',
                dataIndex: 'dateTime',
                valueType: 'date',
                ellipsis: true,
                width: 30,
                initialValue: moment(),
                hideInTable: true,
                hideInSearch: this.type === '3' || this.type === '2',
            },
            {
                title: '班组人员',
                dataIndex: 'findStr',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                // initialValue: moment(),
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: () => {
                    return <Input placeholder="请输入姓名或手机号" />;
                },
            },
            {
                title: '业务系统',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按业务系统',
            },
            {
                title: '划小',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按划小',
            },
            {
                title: '区县',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按区县',
            },
            {
                title: '告警标题',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按告警标题',
            },
            {
                title: '告警类别',
                dataIndex: 'neLabel1',
                valueType: 'select',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按告警类别',
                renderFormItem: () => {
                    const newArr = ['设备告警', '性能告警', '巡检告警', 'AI能耗告警'];
                    return (
                        <Select mode="multiple" placeholder="全部" maxTagCount={1} allowClear>
                            {newArr.map((item) => {
                                return (
                                    <Select.Option value={item} key={item} label={item}>
                                        {item}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '对端省',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按对端省',
            },
            {
                title: '局站名称',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按局站',
            },
            {
                title: '影响专业',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按影响专业',
                renderFormItem: () => {
                    return (
                        <Select mode="multiple" placeholder="全部" maxTagCount={1} allowClear>
                            {this.state.otherEnum.map((item) => {
                                return (
                                    <Select.Option value={item} key={item} label={item}>
                                        {item}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '地市名称',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按本端和对端地市',
            },
            {
                title: '省份名称',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按本端和对端省',
            },
            {
                title: '网格名称',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: !(teamInfos.dimensions === '按本端和对端网格' || teamInfos.dimensions === '按网格'),
            },
            {
                title: '机房名称',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按机房',
            },
            {
                title: '网元名称',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按网元',
            },
            {
                title: '网元组名称',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按网元组',
            },
            {
                title: '网络层次',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 30,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按网络层次',
                renderFormItem: () => {
                    return (
                        <Select mode="multiple" placeholder="全部" maxTagCount={1} allowClear>
                            {this.state.otherEnum.map((item) => {
                                return (
                                    <Select.Option value={item} key={item} label={item}>
                                        {item}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '设备类型',
                dataIndex: 'neLabel1',
                valueType: 'text',
                ellipsis: true,
                width: 70,
                hideInTable: true,
                hideInSearch: teamInfos.dimensions !== '按设备类型',
                renderFormItem: () => {
                    return (
                        <Select mode="multiple" placeholder="全部" maxTagCount={1} allowClear>
                            {this.state.otherEnum.map((item) => {
                                return (
                                    <Select.Option value={item} key={item} label={item}>
                                        {item}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '维护范围',
                dataIndex: 'neLabel',
                rowIndex: 'neLabel',
                align: 'center',
                ellipsis: true,
                width: 100,
                hideInSearch: true,
                hideInTable: this.type === '3',
                render: (_, record) => {
                    return record.neLabel;
                },
            },
            {
                title: '专业',
                width: 60,
                align: 'center',
                dataIndex: 'professionalName',
                hideInSearch: true,
                hideInTable: this.type !== '3',
            },
            {
                title: 'A角（白班）',
                dataIndex: 'acceptName',
                rowIndex: 'accept',
                align: 'center',
                width: 80,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'accept', 'A角（白班）'),
            },
            {
                title: 'A角（夜班）',
                dataIndex: 'acceptNightName',
                rowIndex: 'acceptNight',
                align: 'center',
                width: 80,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'acceptNight', 'A角（夜班）'),
            },
            {
                title: 'B角',
                dataIndex: 'agentName',
                rowIndex: 'agent',
                align: 'center',
                width: 80,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'agent', 'B角'),
            },

            {
                title: '中心主任',
                dataIndex: 'copyName',
                rowIndex: 'copy',
                align: 'center',
                width: 70,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'copy', '中心主任'),
            },
            {
                title: '主管领导',
                dataIndex: 'childName',
                rowIndex: 'child',
                align: 'center',
                width: 70,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'child', '主管领导'),
            },
            {
                title: '代维人员',
                dataIndex: 'daiweiManName',
                rowIndex: 'daiweiMan',
                align: 'center',
                width: 70,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'daiweiMan', '代维人员'),
            },
            {
                title: '代维调度中心',
                dataIndex: 'daiweiScheName',
                rowIndex: 'daiweiSche',
                align: 'center',
                width: 90,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'daiweiSche', '代维调度中心'),
            },
            {
                title: '代维领导',
                dataIndex: 'smsName',
                rowIndex: 'sms',
                align: 'center',
                width: 70,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'sms', '代维领导'),
            },

            {
                title: '省分专业牵头人',
                dataIndex: 'keyName',
                rowIndex: 'key',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'key', '省份专业牵头人'),
            },
            {
                title: '工单审核人',
                dataIndex: 'auditName',
                rowIndex: 'audit',
                align: 'center',
                width: 70,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'audit', '工单审核人'),
            },

            {
                title: '机房',
                dataIndex: 'machineRoom',
                rowIndex: 'machineRoom',
                align: 'center',
                width: 70,
                hideInSearch: true,
                hideInTable: this.type === '3',
                render: (text, record) => {
                    return (
                        <div className="mainper-tab-ellipsis">
                            <Tooltip title={record.machineRoom}>
                                <span>{record.machineRoom}</span>
                                <br />
                            </Tooltip>
                        </div>
                    );
                },
            },

            {
                title: '区县',
                dataIndex: 'cityName',
                rowIndex: 'cityName',
                align: 'center',
                width: 70,
                hideInSearch: true,
                hideInTable: this.type === '3',
                render: (text, record) => {
                    return (
                        <div className="mainper-tab-ellipsis">
                            <Tooltip title={record.cityName}>
                                <span>{record.cityName}</span>
                                <br />
                            </Tooltip>
                        </div>
                    );
                },
            },

            {
                title: '所属传输系统',
                dataIndex: 'transSystem',
                rowIndex: 'transSystem',
                align: 'center',
                width: 90,
                hideInSearch: true,
                hideInTable: professionalName !== '传输网' || this.type === '3',
                render: (text, record) => {
                    return (
                        <div className="mainper-tab-ellipsis">
                            <Tooltip title={record.transSystem}>
                                <span>{record.transSystem}</span>
                                <br />
                            </Tooltip>
                        </div>
                    );
                },
            },

            {
                title: '网络类型',
                dataIndex: 'networkType',
                rowIndex: 'networkType',
                align: 'center',
                width: 70,
                hideInSearch: true,
                hideInTable: !(professionalName === '传输网' || professionalName === '无线网') || this.type === '3',
                render: (text, record) => {
                    return (
                        <div className="mainper-tab-ellipsis">
                            <Tooltip title={record.networkType}>
                                <span>{record.networkType}</span>
                                <br />
                            </Tooltip>
                        </div>
                    );
                },
            },
            {
                title: '区县主管',
                dataIndex: 'cityDirector',
                rowIndex: 'cityDirector',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'cityDirector', '区县主管'),
            },
            {
                title: '地市-专业支撑',
                dataIndex: 'regionSupport',
                rowIndex: 'regionSupport',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'regionSupport', '地市-专业支撑'),
            },
            {
                title: '地市-专业管理',
                dataIndex: 'regionManagement',
                rowIndex: 'regionManagement',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'regionManagement', '地市-专业管理'),
            },
            {
                title: '地市-部门领导',
                dataIndex: 'regionDeptLeader',
                rowIndex: 'regionDeptLeader',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'regionDeptLeader', '地市-部门领导'),
            },
            {
                title: '地市-公司领导',
                dataIndex: 'regionCompLeader',
                rowIndex: 'regionCompLeader',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'regionCompLeader', '地市-公司领导'),
            },
            {
                title: '省分-专业支撑',
                dataIndex: 'provinceSupport',
                rowIndex: 'provinceSupport',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'provinceSupport', '省分-专业支撑'),
            },
            {
                title: '省分-专业管理',
                dataIndex: 'provinceManagement',
                rowIndex: 'provinceManagement',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'provinceManagement', '省分-专业管理'),
            },
            {
                title: '省分-部门领导',
                dataIndex: 'provinceDeptLeader',
                rowIndex: 'provinceDeptLeader',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'provinceDeptLeader', '省分-部门领导'),
            },
            {
                title: '省分-公司领导',
                dataIndex: 'provinceCompLeader',
                rowIndex: 'provinceCompLeader',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'provinceCompLeader', '省分-公司领导'),
            },
            {
                title: '监控值班员',
                dataIndex: 'duty',
                rowIndex: 'duty',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'duty', '监控值班员'),
            },
            {
                title: '监控值班长',
                dataIndex: 'dutyLeader',
                rowIndex: 'dutyLeader',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'dutyLeader', '监控值班长'),
            },
            {
                title: '监控支撑',
                dataIndex: 'dutySupport',
                rowIndex: 'dutySupport',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'dutySupport', '监控支撑'),
            },
            {
                title: '监控专业主管',
                dataIndex: 'dutyManagement',
                rowIndex: 'dutyManagement',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'dutyManagement', '监控专业主管'),
            },
            {
                title: '集团领导',
                dataIndex: 'groupLeader',
                rowIndex: 'groupLeader',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'groupLeader', '监控专业主管'),
            },

            {
                title: '操作',
                dataIndex: 'actions',
                hideInSearch: true,
                align: 'center',
                width: 80,
                fixed: 'right',
                render: (text, row) => {
                    const { editRowData, mteamInfo } = this.state;
                    const { login } = this.props;
                    const userInfo = JSON.parse(login.userInfo);
                    const isShow = userInfo?.zones[0]?.zoneId === login?.systemInfo?.currentZone?.zoneId;
                    const cantEdit =
                        userInfo?.zones[0]?.zoneId === '0' && (this.defineSelecValue()?.parentId === 0 || this.defineSelecValue()?.name === '全部');
                    // 同步指集团的不能编辑
                    const isSynBloc = userInfo?.zones[0]?.zoneLevel === '1' && mteamInfo?.isSynBloc === '1' && row.provinceId !== 0;
                    if ((!isShow && userInfo?.zones[0]?.zoneId === '0') || cantEdit || isSynBloc) {
                        if (!hasSpecialAuth) {
                            return;
                        }
                    }
                    if (moment().isBefore(row.dateTime, 'day') || moment().isSame(row.dateTime, 'day')) {
                        if (row.uniqueRdn === editRowData) {
                            return (
                                <Space>
                                    <AuthButton
                                        key={2}
                                        onClick={this.saveData.bind(this, row)}
                                        authKey="maintenanceConf:edit"
                                        hasSpecialAuth={hasSpecialAuth}
                                        type="text"
                                        style={{ padding: 0 }}
                                    >
                                        <Icon key="2" antdIcon type="iconbaocun" />
                                    </AuthButton>
                                    <Tooltip title="重置">
                                        <Icon key="3" antdIcon type="SyncOutlined" onClick={this.resetData.bind(this, row)} />
                                    </Tooltip>
                                </Space>
                            );
                        }
                        return (
                            <Space>
                                <Tooltip title="编辑">
                                    <AuthButton
                                        addLog
                                        key={1}
                                        onClick={this.allowDataEdit.bind(this, row)}
                                        authKey="maintenanceConf:edit"
                                        hasSpecialAuth={hasSpecialAuth}
                                        type="text"
                                        style={{ padding: 0 }}
                                    >
                                        <Icon key="1" antdIcon type="EditOutlined" />
                                    </AuthButton>
                                </Tooltip>
                            </Space>
                        );
                    }
                    return null;
                },
            },
        ];
    }

    // eslint-disable-next-line class-methods-use-this
    get userColumns() {
        return [
            {
                title: '中文名',
                dataIndex: 'userName',
                key: 'userName',
            },
            {
                title: '账号',
                dataIndex: 'userId',
                key: 'userId',
            },
            {
                title: '移动电话',
                dataIndex: 'mobilePhone',
                key: 'mobilePhone',
            },
        ];
    }

    renderCell = (record, field, title) => {
        const { editRowData } = this.state;
        const itemKey = record.uniqueRdn.replaceAll(':', '-'); // cell唯一标识
        let originName;
        let originTel;
        if (field === 'daiweiMan') {
            originName = record[`${field}Deptorman`] === 0 ? record.daiweiCenterName : record[`${field}Name`];
            originTel = record.daiweiCenterTel;
        } else if (field === 'daiweiSche') {
            originName = record[`${field}Deptorman`] === 0 ? record.daiweiScheDepartment : record[`${field}Name`];
            originTel = record.daiweiScheTel;
        } else if (field === 'key') {
            originName = record[`${field}Deptorman`] === 0 ? record.keyDepartment : record[`${field}Name`];
            originTel = record.keyTel;
        } else {
            originName = record[`${field}Deptorman`] === 0 ? record[`${field}DeptName`] : record[`${field}Name`];
            originTel = record[`${field}Tel`];
        }
        // const originName = record[`${field}Deptorman`] === 0 ? record[`${field}DeptName`] : record[`${field}Name`];
        // const originTel = field === 'daiweiMan' ? record.daiweiCenterTel : record[`${field}Tel`];
        const id = record[`${field}Id`];
        let tipName = record[`${field}Name`];
        let sName = originName;
        let sTel = '-';
        if (originName && originTel) {
            const name = originName.split(',');
            const tel = originTel.split(',');
            const tipNameAR = name.map((val, index) => {
                if (tel[index] === '') {
                    return `${name[index]}`;
                }
                if (index === 0) {
                    sName = name[index];
                    sTel = tel[index];
                }
                return `${name[index]}[${tel[index] || '无'}]`;
            });
            tipName = tipNameAR.join(',');
        }
        // dom加载后上色
        setTimeout(() => {
            const ele = document.querySelector(`.${field}-${itemKey}`);
            if (ele && ele.parentElement) {
                if (record[`${field}ContainUser`] === 1) {
                    ele.parentElement.style.backgroundColor = '#EDF9D9';
                } else {
                    ele.parentElement.style.backgroundColor = '#fff';
                }
            }
        }, 1);

        if (record.uniqueRdn === editRowData) {
            const temporaryCellData = {
                title,
                dataIndex: `${field}Name`,
                row: record,
            };
            const oldValue = {
                title,
                dataIndex: `${field}Name`,
                row: { ...record },
            };
            return (
                <div className={`mainper-tab-ellipsis ${field}-${itemKey}`}>
                    <Tooltip title={tipName}>
                        <a onClick={this.showEditModel.bind(this, temporaryCellData, id, oldValue)}>
                            {' '}
                            <span>{sName}</span>
                            <br />
                            <span>{sTel}</span>
                        </a>
                    </Tooltip>
                </div>
            );
        }
        return (
            <div className={`mainper-tab-ellipsis ${field}-${itemKey}`}>
                <Tooltip title={tipName}>
                    {' '}
                    <span onClick={this.openUserInfoModal.bind(this, record, field)}>{sName}</span>
                    <br />
                    <span>{sTel}</span>
                </Tooltip>
            </div>
        );
    };

    openUserInfoModal = async (record, field) => {
        const deptorman = record[`${field}Deptorman`];
        let deptUsers = [];
        let userNum = 0;
        const userInfo = deptorman
            ? await groupApi.getUserRoleDetail({
                  userIds: record[`${field}Id`],
                  userNames: record[`${field}Name`],
                  telephones: record[field === 'daiweiMan' ? 'daiweiCenterTel' : `${field}Tel`],
              })
            : await groupApi.getDeptRoleDetail(record[`${field}Id`]);
        if (!deptorman && userInfo.length) {
            this.deptId = userInfo[0].deptId;
            const result = await groupApi.getUsersByDept({ pageNum: 1, pageSize: 5, deptId: this.deptId });
            const { rows, total } = result;
            deptUsers = rows;
            userNum = total;
        }
        if (this.type === '3') {
            sendLogFn({ authKey: 'maintenance:view' });
        } else {
            sendLogFn({ authKey: 'maintainTeam:scheduleView' });
        }

        this.setState(
            {
                userNum,
                userInfo,
                deptorman,
                deptUsers,
                pageNum: 1,
                userVisible: true,
                activeKey: userInfo.length && userInfo[0][deptorman ? 'userId' : 'deptId']?.toString(),
            },
            () => {
                if (!deptorman && userInfo.length) {
                    setTimeout(() => {
                        this.addScrollEvent();
                    }, 0);
                }
            },
        );
    };

    addScrollEvent = () => {
        this.tbody = document.querySelector('.maintenance-userinfo-modal .oss-ui-tabs-tabpane-active .oss-ui-table-body');
        if (!this.tbody) return;
        this.tbody.scrollTop = 0;
        this.tbody.addEventListener('scroll', this.onTableScroll);
    };

    onTableScroll = async () => {
        try {
            this.setState({ userLoading: true });
            let { userNum, pageNum, deptUsers } = this.state;
            pageNum += 1;
            const { scrollHeight, clientHeight, scrollTop } = this.tbody;
            if (scrollHeight === clientHeight + scrollTop) {
                const result = await groupApi.getUsersByDept({ pageNum, pageSize: 5, deptId: this.deptId });
                const { rows, total } = result;
                deptUsers = deptUsers.concat(rows);
                userNum = total;
                this.setState({ deptUsers, pageNum, userNum });
                if (deptUsers.length === userNum) {
                    this.tbody.removeEventListener('scroll', this.onTableScroll);
                }
            }
        } finally {
            this.setState({ userLoading: false });
        }
    };

    reload = () => {
        this.actionRef.current.reload();
    };

    disabledDate = (current) => {
        return current && (current < moment().subtract(1, 'months').startOf('months') || current > moment().add(1, 'months').endOf('months'));
    };

    loadData = async (params) => {
        const {
            login: { userId },
        } = this.props;
        const { resetFlag, dataSource, mteamInfo } = this.state;
        this.setState({ resetFlag: false });
        if (resetFlag && dataSource.length) {
            return {
                success: true,
                data: dataSource,
                total: this.state.total,
            };
        }
        const values = this.formRef.current.getFieldsValue();
        const { provinceId, regionId, professionalType, dateTime } = values;
        if (
            (!provinceId && _.isEqual(provinceId, 0)) ||
            (!regionId && _.isEqual(regionId, 0)) ||
            (!professionalType && _.isEqual(professionalType, 0))
        )
            return null;
        const { current, pageSize } = params;
        if (this.type !== '2' && this.type !== '3' && !dateTime) {
            message.warn('请选择日期');
            return {
                success: true,
                data: dataSource,
                total: this.state.total,
            };
        }
        const parm =
            // eslint-disable-next-line no-nested-ternary
            this.type === '2'
                ? {
                      pageNumNew: current,
                      pageSizeNew: pageSize,
                      ...values,
                      operator: userId,
                      professionalType: mteamInfo.professionalId?.toString(),
                      provinceId: mteamInfo.provinceId?.toString(),
                      ruleType: mteamInfo.mteamName,
                      regionId: regionId || mteamInfo.regionId,
                      mteamModel: 2,
                  }
                : this.type === '3'
                ? {
                      pageNumNew: current,
                      pageSizeNew: pageSize,
                      provinceId: mteamInfo.provinceId?.toString(),
                      operator: userId,
                  }
                : {
                      pageNumNew: current,
                      pageSizeNew: pageSize,
                      ...values,
                      dateTime: dateTime.format('YYYY-MM-DD'),
                      operator: userId,
                      professionalType: mteamInfo.professionalId?.toString(),
                      provinceId: mteamInfo.provinceId?.toString(),
                      ruleType: mteamInfo.mteamName,
                      regionId: regionId || mteamInfo.regionId,
                      mteamModel: 1,
                  };
        if (parm.neLabel1?.length) {
            parm.neLabel = parm.neLabel1.toString();
            parm.neLabel1 = undefined;
        } else {
            parm.neLabel = '全部';
        }
        parm.findStr = params.findStr || '';
        let result = {};
        if (this.type !== '3') {
            result = await api.getMaintenanceInfo(parm);
        } else {
            result = await api.getMaintenanceSenderInfo(parm);
        }
        const { total, rows } = result;
        api.queryUnusedUserInfo({
            // provinceId: '-662225376',
            // regionId: '-1',
            // ruleType: '性能巡检',
            // professionalType: 1,
            // operator: '10093',
            provinceId: mteamInfo.provinceId,
            regionId: mteamInfo.regionId,
            ruleType: mteamInfo.mteamName,
            professionalType: mteamInfo.professionalId,
            operator: userId,
        }).then((res) => {
            if (res && Array.isArray(res) && res.length > 0) {
                this.setState({
                    tipVisible: true,
                });
            } else {
                this.setState({
                    tipVisible: false,
                });
            }
        });
        this.setState({ zoneId: provinceId, oldRow: {}, editRowData: '', total, dataSource: rows });
        return {
            success: true,
            total,
            data: rows,
        };
    };
    // 保存后更改维护班表编辑行数据
    upDateEdit = (row, params) => {
        const parm = { ...updateRowMode, ...row };
        if (this.type === '3') {
            delete parm.dateTime;
        }
        if (this.type === '3') {
            return api.updateMaintenanceSenderInfo([parm], params).then(async (res) => {
                if (res) {
                    const { provinceId } = this.formRef?.current?.getFieldsValue();
                    const deptUserInfo = await api.getDeptUserInfo({ provinceId });
                    const treeList = deptUserInfo.tree;
                    this.setState({ treeList }, () => {
                        this.actionRef.current.reload();
                    });
                    if (row.logContext) {
                        sendLogFn({ authKey: 'maintenance:save', logContext: row.logContext });
                    }
                } else {
                    this.actionRef.current.reload();
                }
            });
        }
        api.updateMaintenanceInfo([parm], params).then(async (res) => {
            if (res.code === 200 || res.code === 201) {
                const { provinceId } = this.formRef?.current?.getFieldsValue();
                const deptUserInfo = await api.getDeptUserInfo({ provinceId });
                const treeList = deptUserInfo.tree;
                this.setState({ treeList }, () => {
                    this.actionRef.current.reload();
                });

                let logStr = row.logContext;
                if (logStr && this.type === '1') {
                    logStr = `班组名称：${row?.ruleType || ''}\n日期：${dayjs(new Date()).format('YYYY-MM-DD')}\n省份名称：${
                        row?.provinceName || ''
                    }\n地市名称：${row?.regionName || ''}\n维护范围：${row?.neLabel || ''}\n${logStr}`;
                }
                if (logStr && this.type === '2') {
                    logStr = `班组名称：${row?.ruleType || ''}\n省份名称：${row?.provinceName || ''}\n地市名称：${row?.regionName || ''}\n维护范围：${
                        row?.neLabel || ''
                    }\n${logStr}`;
                }
                if (logStr) {
                    sendLogFn({ authKey: 'maintainTeam:save', logContext: logStr });
                }
                message.success('更新维护值班表数据成功');
            } else {
                message.error(res.message || '更新维护值班表数据失败！');
                this.actionRef.current.reload();
            }
        });
    };
    onSearchCollapse = (collapsed) => {
        this.setState({
            scrollY: collapsed ? window.innerHeight - 290 : window.innerHeight - 345,
        });
    };

    // 打开修改页面
    showEditModel = (value, ids, oldValue) => {
        // const { mteamInfo } = this.state;
        // if (!mteamInfo.distributionModel) return message.warn('请补充班组派单模式，并按派单模式重新排班');
        let checkTree = [];
        if (ids) {
            checkTree = ids.split(',').map((item) => {
                return item;
            });
        }
        this.setState({
            editVisible: true,
            cellData: value,
            oldCellData: oldValue,
            checkTree,
        });
    };

    // 允许当前行修改
    allowDataEdit = (row) => {
        this.setState({
            oldRow: { ...row },
        });
        const { editRowData } = this.state;
        if (editRowData.length === 0) {
            this.setState({
                editRowData: row.uniqueRdn,
            });
        } else {
            message.warning('只能修改一条数据!');
        }
        if (this.type === '3') {
            sendLogFn({ authKey: 'maintenance:edit' });
        } else {
            sendLogFn({ authKey: 'maintenanceConf:edit' });
        }
    };

    // 保存此条数据
    saveData = (row, params) => {
        const arr = [
            'acceptName',
            'acceptNightName',
            'agentName',
            'copyName',
            'smsName',
            'childName',
            'auditName',
            'daiweiManName',
            'daiweiScheName',
            'keyName',
        ];
        arr.map((item) => {
            return delete row[`${item}edit`];
        });
        this.upDateEdit(row, params);
        this.setState({
            oldRow: {},
            editRowData: '',
        });
    };

    // 重置此条数据
    resetData = (row) => {
        const { dataSource, oldRow } = this.state;
        const resetData = dataSource.map((item) => {
            if (item.uniqueRdn === row.uniqueRdn) {
                return oldRow;
            }
            return item;
        });
        this.setState(
            {
                dataSource: resetData,
                oldRow: {},
                editRowData: '',
                resetFlag: true,
            },
            () => {
                this.actionRef.current.reload();
            },
        );
        if (this.type === '3') {
            sendLogFn({ authKey: 'maintenance:reset' });
        } else {
            sendLogFn({ authKey: 'maintainTeam:reset' });
        }
    };

    // 树图确定返回时间赋值
    editChange = (operation, idArray, cellData, numbers, isDept, editedPhoneNumber, logContext) => {
        if (operation) {
            const ids = [];
            const names = [];
            const deptNames = [];
            const deptIds = [];
            const tels = [];
            let deptOrMan = -1;
            const str = { user: false, dept: false };
            if (idArray) {
                console.log(idArray);
                idArray.forEach((item) => {
                    if (item) {
                        if (item.subjoin2 === 'person') {
                            const user = item.otherInfo;
                            ids.push(user.userId);
                            names.push(item.subjoin4);
                            deptNames.push(user.deptName);
                            deptIds.push(user.deptId);
                            tels.push(user.mobilephone);
                            deptOrMan = 1;
                            str.user = true;
                        }
                        if (item.subjoin2 === 'dept' || !item.otherInfo) {
                            let dept = item.otherInfo;
                            if (!dept) {
                                dept = {
                                    deptId: item.key.replace(/D/, ''),
                                    deptName: item.title,
                                    parentDeptName: '中国联通',
                                };
                            }
                            ids.push(dept.deptId);
                            names.push(dept.parentDeptName ? `${dept.provinceName}@${dept.parentDeptName}@${dept.deptName}` : dept.deptName);
                            // deptNames.push(dept.parentDeptName ? `${dept.parentDeptName}-${dept.deptName}` : dept.deptName);
                            // deptNames.push(dept.parentDeptName ? `${dept.parentDeptName}-${dept.deptName}` : dept.deptName);
                            deptNames.push(dept.deptName);
                            deptIds.push(dept.deptId);
                            tels.push('');
                            deptOrMan = 0;
                            str.dept = true;
                        }
                    }
                });
            }
            if (str.dept && str.user) {
                return message.warning('不能同时选择人员和部门');
            }
            const editRow = cellData.row;
            const field = cellData.dataIndex.split('Name')[0];
            switch (cellData.dataIndex) {
                case 'acceptName':
                    editRow.acceptId = ids.join(',');
                    editRow.acceptName = names.join(',');
                    editRow.acceptDeptName = deptNames.join(',');
                    editRow.acceptDeptId = deptIds.join(',');
                    editRow.acceptTel = isDept ? numbers[`${cellData.dataIndex}Tel`] : tels.join(',');
                    editRow.acceptDeptorman = deptOrMan;
                    editRow[`${cellData.dataIndex}edit`] = editedPhoneNumber;
                    break;
                case 'acceptNightName':
                    editRow.acceptNightId = ids.join(',');
                    editRow.acceptNightName = names.join(',');
                    editRow.acceptNightDeptName = deptNames.join(',');
                    editRow.acceptNightDeptId = deptIds.join(',');
                    editRow.acceptNightTel = isDept ? numbers[`${cellData.dataIndex}Tel`] : tels.join(',');
                    editRow.acceptNightDeptorman = deptOrMan;
                    editRow[[`${cellData.dataIndex}edit`]] = editedPhoneNumber;
                    break;
                case 'agentName':
                    editRow.agentId = ids.join(',');
                    editRow.agentName = names.join(',');
                    editRow.agentDeptName = deptNames.join(',');
                    editRow.agentDeptId = deptIds.join(',');
                    editRow.agentTel = isDept ? numbers[`${cellData.dataIndex}Tel`] : tels.join(',');
                    editRow.agentDeptorman = deptOrMan;
                    editRow[`${cellData.dataIndex}edit`] = editedPhoneNumber;
                    break;
                case 'copyName':
                    editRow.copyId = ids.join(',');
                    editRow.copyName = names.join(',');
                    editRow.copyDeptName = deptNames.join(',');
                    editRow.copyDeptId = deptIds.join(',');
                    editRow.copyTel = isDept ? numbers[`${cellData.dataIndex}Tel`] : tels.join(',');
                    editRow.copyDeptorman = deptOrMan;
                    editRow[`${cellData.dataIndex}edit`] = editedPhoneNumber;
                    break;
                case 'smsName':
                    editRow.smsId = ids.join(',');
                    editRow.smsName = names.join(',');
                    editRow.smsDeptName = deptNames.join(',');
                    editRow.smsDeptId = deptIds.join(',');
                    editRow.smsTel = isDept ? numbers[`${cellData.dataIndex}Tel`] : tels.join(',');
                    editRow.smsDeptOrMan = deptOrMan;
                    editRow[`${cellData.dataIndex}edit`] = editedPhoneNumber;
                    break;
                case 'childName':
                    editRow.childId = ids.join(',');
                    editRow.childName = names.join(',');
                    editRow.childDeptName = deptNames.join(',');
                    editRow.childDeptId = deptIds.join(',');
                    editRow.childTel = isDept ? numbers[`${cellData.dataIndex}Tel`] : tels.join(',');
                    editRow.childDeptorman = deptOrMan;
                    editRow[`${cellData.dataIndex}edit`] = editedPhoneNumber;
                    break;
                case 'auditName':
                    editRow.auditId = ids.join(',');
                    editRow.auditName = names.join(',');
                    editRow.auditDeptName = deptNames.join(',');
                    editRow.auditDeptId = deptIds.join(',');
                    editRow.auditTel = isDept ? numbers[`${cellData.dataIndex}Tel`] : tels.join(',');
                    editRow.auditDeptorman = deptOrMan;
                    editRow[`${cellData.dataIndex}edit`] = editedPhoneNumber;
                    break;
                case 'daiweiManName':
                    editRow.daiweiManId = ids.join(',');
                    editRow.daiweiManName = names.join(',');
                    editRow.daiweiCenterName = deptNames.join(',');
                    editRow.daiweiCenterId = deptIds.join(',');
                    editRow.daiweiCenterTel = isDept ? numbers[`${cellData.dataIndex}Tel`] : tels.join(',');
                    editRow.daiweiManDeptorman = deptOrMan;
                    editRow[`${cellData.dataIndex}edit`] = editedPhoneNumber;
                    break;
                case 'daiweiScheName':
                    editRow.daiweiScheId = ids.join(',');
                    editRow.daiweiScheName = names.join(',');
                    editRow.daiweiScheDepartment = deptNames.join(',');
                    editRow.daiweiScheDepartmentId = deptIds.join(',');
                    editRow.daiweiScheTel = isDept ? numbers[`${cellData.dataIndex}Tel`] : tels.join(',');
                    editRow.daiweiScheDeptorman = deptOrMan;
                    editRow[`${cellData.dataIndex}edit`] = editedPhoneNumber;
                    break;
                case 'keyName':
                    editRow.keyId = ids.join(',');
                    editRow.keyName = names.join(',');
                    editRow.keyDepartment = deptNames.join(',');
                    editRow.keyDepartmentId = deptIds.join(',');
                    editRow.keyTel = isDept ? numbers[`${cellData.dataIndex}Tel`] : tels.join(',');
                    editRow.keyDeptorman = deptOrMan;
                    editRow[`${cellData.dataIndex}edit`] = editedPhoneNumber;
                    break;
                default:
                    editRow[`${field}Id`] = ids.join(',');
                    editRow[`${field}Name`] = names.join(',');
                    editRow[`${field}DeptName`] = deptNames.join(',');
                    editRow[`${field}DeptId`] = deptIds.join(',');
                    editRow[`${field}Tel`] = isDept ? numbers[`${cellData.dataIndex}Tel`] : tels.join(',');
                    editRow[[`${field}Deptorman`]] = deptOrMan;
                    editRow[`${cellData.dataIndex}edit`] = editedPhoneNumber;
                    break;
            }
            if (logContext && editRow.logContext) {
                editRow.logContext += `${logContext}\n`;
            } else {
                editRow.logContext = `${logContext}\n`;
            }
            this.setState({
                editVisible: false,
                editRow: {},
                cellData: {
                    title: '',
                    dataIndex: '',
                    row: {},
                },
                oldCellData: {
                    title: '',
                    dataIndex: '',
                    row: {},
                },
            });
        } else {
            this.setState({
                editVisible: false,
            });
        }
    };

    import = (info) => {
        if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    getCurrentColumns = () => {
        const headerElement = document.querySelectorAll('.oss-ui-table-thead>tr>th');
        const newArr = [];
        headerElement.forEach((item) => {
            if (item.innerText && item.innerText !== '操作' && item.innerText !== '') {
                if (this.columns.filter((e) => e.dataIndex !== 'neLabel1').find((itm) => itm.title === item.innerText)?.rowIndex) {
                    newArr.push(this.columns.filter((e) => e.dataIndex !== 'neLabel1').find((itm) => itm.title === item.innerText)?.rowIndex);
                }
            }
        });
        return newArr;
    };

    /**
     * @description: 打开弹窗
     * @param {标记} flag  1: 新建 2:编辑 3: 上传  4: 查看脚本详情 5:批量修改 7：批量排班
     * @return {*}
     */
    showModal = (flag) => {
        const { provinceList, regionList, teamInfo, professional } = this.state.storeBySQL;
        const newRegionList = JSON.parse(JSON.stringify(regionList));
        const newTeamInfo = JSON.parse(JSON.stringify(teamInfo));

        newRegionList.push({
            regionId: '-1',
            regionName: '全部',
        });
        newTeamInfo.push({
            id: '0',
            name: '全部',
        });
        const values = this.formRef.current.getFieldsValue();
        const { mteamInfo } = this.state;
        const { professionalType, ruleType, provinceId, regionId, dateTime } = values;
        const province = provinceList.find((a) => a.regionId === provinceId);
        const region = newRegionList.find((a) => a.regionId === regionId);
        const professional1 = professional.find((a) => a.key === professionalType);
        const team = newTeamInfo.find((a) => a.name === ruleType);
        // const needMode = [3, 5, 7].includes(flag);
        // if (needMode && !mteamInfo.distributionModel) return message.warn('请补充班组派单模式，并按派单模式重新排班');
        const thisData = {
            curSelParmExport: {
                province,
                region,
                professional: professional1,
                team,
                dateTime,
                operator: this.props.login.userName,
                columnList: this.getCurrentColumns(),
            },
            mteamInfo: {
                ...mteamInfo,
                regionId,
                regionName: region?.regionName,
                dateTime,
            },
            flag,
            modalVisible: true,
        };
        this.setState(thisData);
        if (this.type === '3' && flag === 'upload') {
            sendLogFn({ authKey: 'maintenance:upload' });
        } else if (this.type === '3' && flag === 'export') {
            sendLogFn({ authKey: 'maintenance:export' });
        } else if (flag === 3) {
            sendLogFn({ authKey: 'maintenanceConf:import' });
        } else if (flag === 5) {
            sendLogFn({ authKey: 'maintenanceConf:batchEdit' });
        } else if (flag === 6) {
            sendLogFn({ authKey: 'maintainTeam:notExist' });
        } else if (flag === 7) {
            sendLogFn({ authKey: 'maintenanceConf:batchPush' });
        }
    };

    // 判断下拉框内容
    defineSelecValue = () => {
        const { teamInfo } = this.state.storeBySQL;
        const newTeamInfo = JSON.parse(JSON.stringify(teamInfo));
        const values = this.formRef?.current?.getFieldsValue();
        const { ruleType } = values;
        newTeamInfo.push({
            id: '0',
            name: '全部',
        });
        return newTeamInfo.find((a) => a.name === ruleType);
    };

    onUploadResult = (val) => {
        if (val === 'success') {
            this.reload();
            this.setState({
                modalVisible: false,
            });
        }
    };

    onLoadResult = (val) => {
        this.setState({
            curSelParmExport: {
                result: val,
            },
            flag: 4,
            modalVisible: true,
        });
    };

    /**
     * @description: 关闭弹窗
     * @param {*}
     * @return {*}
     */
    closeModal = (isCancel) => {
        const { flag } = this.state;
        if (flag === 5 && isCancel) {
            sendLogFn({ authKey: 'maintenanceConf:batchEditCancel' });
        } else if (flag === 7 && isCancel) {
            sendLogFn({ authKey: 'maintenanceConf:batchPushCancel' });
        }
        this.setState({
            modalVisible: false,
        });
    };

    refreshTable = () => {
        this.reload();
    };
    // 导出
    handleDownloadClick = () => {
        api.downLoad(window);
        // message.success('导出');
    };

    handleOptionRender = (dom, tipVisible) => {
        const { mteamInfo, openTip } = this.state;
        const { regionList } = this.state.storeBySQL;
        const { login } = this.props;
        const userInfo = JSON.parse(login.userInfo);
        const hasSpecialAuth = this.props?.location?.state?.hasSpecialAuth;
        const newArr = [
            {
                regionId: '-1',
                regionName: '全部',
            },
        ];
        regionList.forEach((item) => {
            newArr.push(item);
        });
        const btnStyle = {
            background: '#FFE3E3',
            borderRadius: '2px',
            border: 'none',
            lineHeight: '16px',
            fontSize: '16px',
            marginLeft: '0',
            marginRight: '0',
        };
        const btnDisabled = userInfo?.zones[0]?.zoneLevel === '1' && mteamInfo?.isSynBloc === '1' && mteamInfo?.provinceId !== 0;
        console.log(hasSpecialAuth, '==auth', this.type);
        // 默认接单人
        if (this.type === '3') {
            return [
                <div className="sender-content">
                    <AuthButton
                        authKey="maintenanceConf:import"
                        key={2}
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={this.showModal.bind(this, 'upload')}
                        disabled={btnDisabled}
                        hasSpecialAuth={hasSpecialAuth}
                    >
                        <Icon antdIcon type="UploadOutlined" />
                        默认接单人上传
                    </AuthButton>
                    <AuthButton
                        addLog={true}
                        authKey="maintenanceConf:export"
                        key={3}
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={this.showModal.bind(this, 'export')}
                    >
                        <Icon antdIcon type="DownloadOutlined" />
                        默认接单人导出
                    </AuthButton>
                </div>,
            ];
        }
        if (this.type === '2') {
            return [
                // <div className='left-container'>
                //     <span className='title'>归属地市：</span>
                //     <Radio.Group size="small" style={{ border: '0px' }} onChange={(e)=>{
                //         const name = newArr.filter((item) => item.regionId === e.target.value)[0]?.regionName;
                //         mteamInfo.regionId = e.target.value
                //         mteamInfo.regionName = name
                //         this.setState({
                //             mteamInfo
                //         },()=>{
                //             this.refreshTable()
                //         })
                //     }} buttonStyle="solid" value={mteamInfo.regionId}>
                //         {newArr
                //             .map((item) => {
                //                 return (
                //                     <Radio.Button
                //                         value={item.regionId}
                //                         type="checked"
                //                         bordered={false}
                //                         style={{ width: item.regionName.length * 13 + 14, textAlign: 'center' }}
                //                     >
                //                         {item.regionName}
                //                     </Radio.Button>
                //                 );
                //             })}
                //     </Radio.Group>
                // </div>,
                // <div style={{width:'350px'}} />,
                <div className="right-content baoji">
                    <span
                        style={{
                            position: 'absolute',
                            left: '-40px',
                            cursor: 'pointer',
                        }}
                        onClick={this.showModal.bind(this, 6)}
                    >
                        {tipVisible ? (
                            <Tooltip placement="leftBottom" defaultVisible title="此处为不存在的排班人员/部门列表，请重新为其排班">
                                <Button style={btnStyle} disabled={!tipVisible}>
                                    <Icon component={svg1} />
                                </Button>
                            </Tooltip>
                        ) : (
                            <Button style={btnStyle} disabled={!tipVisible}>
                                <Icon component={svg1} />
                            </Button>
                        )}
                    </span>
                    {dom.slice(1, 2)}
                    <AuthButton
                        authKey="maintenanceConf:batchEdit"
                        key={5}
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={this.showModal.bind(this, 5)}
                        disabled={!hasSpecialAuth}
                        hasSpecialAuth={hasSpecialAuth}
                    >
                        <Icon antdIcon />
                        批量修改
                    </AuthButton>
                    <AuthButton
                        addLog={true}
                        authKey="maintenanceConf:import"
                        key={2}
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={this.showModal.bind(this, 3)}
                        // disabled={!hasSpecialAuth}
                        hasSpecialAuth={hasSpecialAuth}
                    >
                        <Icon antdIcon type="UploadOutlined" />
                        值班表上传
                    </AuthButton>
                    <AuthButton
                        addLog={true}
                        authKey="maintenanceConf:export"
                        key={3}
                        onClick={() => {
                            sendLogFn({ authKey: 'maintenanceConf:export' });
                            this.onAsyncExportOpen('baoJi');
                            this.setState({ exportModalVisible: true });
                            // this.showModal(2);
                        }}
                        hasSpecialAuth={hasSpecialAuth}
                    >
                        <Icon antdIcon type="DownloadOutlined" />
                        值班表导出
                    </AuthButton>
                    <div
                        style={{
                            width: '50px',
                        }}
                    />
                </div>,
            ];
        }
        return [
            <div className="right-content baoji">
                <span
                    style={{
                        position: 'absolute',
                        left: '-40px',
                        cursor: 'pointer',
                    }}
                    onClick={this.showModal.bind(this, 6)}
                >
                    {tipVisible ? (
                        <Tooltip
                            placement="leftBottom"
                            defaultVisible
                            visible={openTip}
                            onVisibleChange={(e) => {
                                this.setState({
                                    openTip: e,
                                });
                            }}
                            getPopupContainer={(trigger) => trigger}
                            title={
                                <>
                                    <div>此处为不存在的排班人员/部门列表，请重新为其排班</div>
                                    <Icon
                                        antdIcon
                                        type="CloseOutlined"
                                        trigger="hover"
                                        style={{ position: 'absolute', top: '0', right: '10px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.setState({
                                                openTip: false,
                                            });
                                        }}
                                    />
                                </>
                            }
                        >
                            <Button style={btnStyle} disabled={!tipVisible}>
                                <Icon component={svg1} />
                            </Button>
                        </Tooltip>
                    ) : (
                        <Button style={btnStyle} disabled={!tipVisible}>
                            <Icon component={svg1} />
                        </Button>
                    )}
                </span>
                {dom.slice(1, 2)}
                <AuthButton
                    addLog={true}
                    authKey="maintenanceConf:batchPush"
                    key={7}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={this.showModal.bind(this, 7)}
                    // disabled={!hasSpecialAuth}
                    hasSpecialAuth={hasSpecialAuth}
                >
                    <Icon antdIcon />
                    批量排班
                </AuthButton>
                <AuthButton
                    addLog={true}
                    authKey="maintenanceConf:batchEdit"
                    key={5}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={this.showModal.bind(this, 5)}
                    disabled={!hasSpecialAuth}
                    hasSpecialAuth={hasSpecialAuth}
                >
                    <Icon antdIcon />
                    批量修改
                </AuthButton>
                <AuthButton
                    addLog={true}
                    authKey="maintenanceConf:import"
                    key={2}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={this.showModal.bind(this, 3)}
                    // disabled={!hasSpecialAuth}
                    hasSpecialAuth={hasSpecialAuth}
                >
                    <Icon antdIcon type="UploadOutlined" />
                    值班表上传
                </AuthButton>
                <AuthButton
                    addLog={true}
                    authKey="maintenanceConf:export"
                    key={3}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => {
                        sendLogFn({ authKey: 'maintenanceConf:export' });
                        this.onAsyncExportOpen('duty');
                        this.setState({ exportModalVisible: true });
                        // this.showModal(2);
                    }}
                    hasSpecialAuth={hasSpecialAuth}
                >
                    <Icon antdIcon type="DownloadOutlined" />
                    值班表导出
                </AuthButton>
            </div>,
        ];
    };

    renderTabBar = (props) => {
        const { panes } = props;
        const { activeKey } = this.state;
        return (
            <div>
                {panes.map((item, index) => (
                    <Button
                        key={item.key}
                        style={index !== panes.length - 1 ? { borderRight: 'none' } : undefined}
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={this.onTabChange.bind(this, item.key)}
                        type={activeKey === item.key ? 'primary' : 'default'}
                    >
                        {item.props.tab}
                    </Button>
                ))}
            </div>
        );
    };

    onTabChange = async (key) => {
        const { activeKey, deptorman } = this.state;
        if (activeKey !== key) {
            if (this.tbody) {
                this.tbody.removeEventListener('scroll', this.onTableScroll);
            }
            const state = { activeKey: key };
            if (!deptorman) {
                this.deptId = key;
                const result = await groupApi.getUsersByDept({ pageNum: 1, pageSize: 5, deptId: this.deptId });
                const { rows, total } = result;
                state.deptUsers = rows;
                state.userNum = total;
                state.pageNum = 1;
            }
            this.setState(state, () => {
                if (deptorman) return;
                setTimeout(() => {
                    this.addScrollEvent();
                }, 100);
            });
        }
    };
    // 专业下拉修改事件
    async changeProfessional(id) {
        const { storeBySQL } = this.state;
        const {
            login: { userId },
        } = this.props;
        const professionalType = id;
        const values = this.formRef.current.getFieldsValue();
        let { ruleType } = values;
        if (storeBySQL.professional.length > 0) {
            const teamParm = {
                pageNumNew: 1,
                pageSizeNew: 9000,
                provinceId: values.provinceId,
                professionalId: professionalType,
                userId,
            };
            ruleType = '';
            storeBySQL.teamInfo = await api.getTeamInfo(teamParm);
            if (storeBySQL.teamInfo.length > 0) {
                ruleType = storeBySQL.teamInfo[0].name;
                console.log(ruleType);
            }
        }
        // 通信云专业地市选择省本部
        if (id === '70') {
            const { regionList } = storeBySQL;
            const newId = regionList.filter((item) => item.regionName === '省本部')[0]?.regionId;
            this.formRef.current.setFieldsValue({ regionId: newId || '-1' });
        }
        this.setState({ storeBySQL: { ...storeBySQL } }, () => {
            this.formRef.current.setFieldsValue({ professionalType, ruleType: '全部' });
        });
        // this.setState({ storeBySQL });
    }
    // 省份下拉修改事件
    async changeProvince(id) {
        const {
            login: { userId },
        } = this.props;
        const { storeBySQL } = this.state;
        const provinceId = id;
        let regionId = '';
        let ruleType = '';
        storeBySQL.regionList = await api.getProvinceRegions(provinceId, userId, 1);
        const values = this.formRef.current.getFieldsValue();
        if (storeBySQL.regionList.length > 0) {
            regionId = storeBySQL.regionList[0].regionId;
        }
        if (storeBySQL.professional.length > 0) {
            const teamParm = {
                pageNumNew: 1,
                pageSizeNew: 9000,
                provinceId,
                professionalId: values.professionalType,
                userId,
            };
            storeBySQL.teamInfo = await api.getTeamInfo(teamParm);
            if (storeBySQL.teamInfo.length > 0) {
                ruleType = storeBySQL.teamInfo[0].name;
                console.log(ruleType);
            }
        }
        this.setState({ storeBySQL: { ...storeBySQL } }, () => {
            this.formRef.current.setFieldsValue({ regionId, ruleType: '全部', provinceId });
        });
        // const deptUserInfo = await api.getDeptUserInfo({ provinceId });
        // storeBySQL.deptList = deptUserInfo.dept;
        // storeBySQL.userList = deptUserInfo.deptUser;
        // const treeList = deptUserInfo.tree;
        this.setState({ storeBySQL });
    }

    async intData() {
        const {
            login: { userId, systemInfo },
        } = this.props;
        const mteamInfo = this.props?.location?.state?.mteamInfo || {};
        if (mteamInfo.dimensions !== '按网元') {
            this.setState({
                configState: {
                    machineRoom: { show: false },
                    networkType: { show: false },
                    cityName: { show: false },
                    transSystem: { show: false },
                },
            });
        }
        const otherCondition = [
            {
                id: 95,
                text: '按网络层次',
            },
            {
                id: 9,
                text: '按设备类型',
            },
            {
                id: 23,
                text: '按影响专业',
            },
        ];
        const res = await request('common/getDictToPaasByTypes', {
            type: 'post',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                types: otherCondition.map((e) => e.id), // 95 网络层次  9 设备类型  23 专业
            },
        });
        const res2 = await api.professionalAndObjectTypesApi({ query: 'professional', types: null });
        const curOtherCon = otherCondition.find((e) => e.text === mteamInfo.dimensions);
        if (curOtherCon) {
            if (curOtherCon.id === 23) {
                this.setState({
                    otherEnum: _.uniq(res2.data.map((e) => e.professionalName) || []),
                });
            } else {
                this.setState({
                    otherEnum: _.uniq(res.dataObject[curOtherCon.id].map((e) => e.dName) || []),
                });
            }
        }
        const { storeBySQL } = this.state;
        let provinceId;
        let regionId;
        let professionalType;
        let ruleType;
        storeBySQL.provinceList = await api.getProvinceData(userId);
        if (systemInfo?.currentZone?.zoneId) {
            storeBySQL.provinceList = storeBySQL.provinceList.filter((item) => item.regionId === systemInfo.currentZone.zoneId);
        }
        if (storeBySQL.provinceList.length > 0) {
            provinceId = storeBySQL.provinceList[0].regionId;
            const infos = this.props?.location?.state?.mteamInfo;
            if (infos?.provinceId) {
                provinceId = infos.provinceId;
            }
            regionId = undefined;
            storeBySQL.regionList = await api.getProvinceRegions(provinceId, userId, 1);
            if (storeBySQL.regionList.length > 0) {
                regionId = storeBySQL.regionList[0].regionId;
                console.log(regionId);
            }
        }
        storeBySQL.professional = await api.getDictEntry('professional_type', userId);
        if (storeBySQL.professional.length > 0) {
            professionalType = storeBySQL.professional[0].key;
            if (systemInfo?.currentZone?.zoneId) {
                provinceId = systemInfo.currentZone.zoneId;
            }
            console.log(professionalType);
            const teamParm = {
                pageNumNew: 1,
                pageSizeNew: 9000,
                provinceId: mteamInfo.provinceId,
                professionalId: mteamInfo.professionalId,
                userId,
            };
            storeBySQL.teamInfo = await api.getTeamInfo(teamParm);
            if (storeBySQL.teamInfo.length > 0) {
                ruleType = storeBySQL.teamInfo[0].name;
                console.log(ruleType);
            }
        }
        if (systemInfo?.currentZone?.zoneId) {
            provinceId = systemInfo.currentZone.zoneId;
        }
        this.setState({ storeBySQL: { ...storeBySQL } }, () => {
            this.formRef.current.setFieldsValue({
                provinceId: mteamInfo.provinceId,
                ruleType: mteamInfo.mteamName,
                regionId: '-1',
                professionalType: mteamInfo.professionalId,
            });
        });
        // const deptUserInfo = await api.getDeptUserInfo({ provinceId });
        // storeBySQL.deptList = deptUserInfo.dept;
        // storeBySQL.userList = deptUserInfo.deptUser;
        // const treeList = deptUserInfo.tree;
        this.setState({ zoneId: provinceId, storeBySQL, mteamInfo: { ...mteamInfo, regionId: '-1', regionName: '全部' } }, () => {
            this.reload();
        });
    }

    onExport = async (formValue) => {
        const columnList = this.getCurrentColumns();
        const { login } = this.props;
        const { provinceName, regionName, professionalName, mteamName, dateTime, exportType } = formValue;
        message.success('操作成功');
        this.setState({ exportBtnLoading: true });
        if (exportType === 'duty') {
            const params = {
                provinceName,
                regionName,
                professionalName,
                ruleType: mteamName,
                startTime: dateTime[0].format('YYYY-MM-DD'),
                endTime: dateTime[1].format('YYYY-MM-DD'),
                columnList: _.uniq(columnList),
                operator: login.userId,
            };

            const result = await api.exportAlarmresourceByEomsApi(params);

            if (+result.code === 200) {
                this.asyncExportTimer = setInterval(() => {
                    this.getExportProcess();
                }, 2000);
            } else {
                message.error(result.message);
                this.setState({ exportBtnLoading: false });
            }
        }
        if (exportType === 'baoJi') {
            const params = {
                provinceName,
                regionName,
                professionalName,
                ruleType: mteamName,
                columnList: _.uniq(columnList),
                operator: login.userId,
            };
            const result = await api.exportAlarmresourceByEomsbjApi(params);
            if (+result.code === 200) {
                this.asyncExportTimer = setInterval(() => {
                    this.getExportProcess();
                }, 2000);
            } else {
                message.error(result.message);
                this.setState({ exportBtnLoading: false });
            }
        }
    };
    getExportProcess = async () => {
        const { login } = this.props;
        const params = { operator: login.userId };
        const result = await api.exportProcessApi(params);
        if (result && result.message !== '此用户无运维调度班表导出进度信息') {
            const { total, exportTimeStr, exportType = 'excel', progressShow: progress, fileSrc, status } = result;
            const defaultStatus = {
                str: '',
                status: '',
            };
            if (+status === 200 && +progress === 100) {
                defaultStatus.str = '导出完成';
                defaultStatus.status = 'success';
            }
            if (+status === 200 && +progress !== 100) {
                defaultStatus.str = '正在导出';
                defaultStatus.status = 'active';
            }
            if (+status !== 200) {
                defaultStatus.str = '导出失败';
                defaultStatus.status = 'exception';
            }

            const list = {
                exportFormat: exportType,
                exportTime: exportTimeStr,
                exportTotal: total,
                exportState: defaultStatus.str,
                exportSchedule: { status: defaultStatus.status, percent: +progress },
            };
            this.setState({
                asyncExportList: [list],
                exportBtnLoading: false,
            });
            if (+progress < 100 && !this.asyncExportTimer && +progress >= 0) {
                this.asyncExportTimer = setInterval(() => {
                    this.getExportProcess();
                }, 2000);
            }
            if (+progress === 100 || +status !== 200) {
                this.fileSrc = fileSrc;
                clearInterval(this.asyncExportTimer);
                this.asyncExportTimer = null;
            }
        }
    };

    /**
     *
     * @param {*} exportType duty :值班模式 baoJi: 包机模式
     */
    onAsyncExportOpen = (exportType) => {
        const {
            mteamInfo,
            storeBySQL: { regionList },
        } = this.state;
        const { provinceName, professionalName, mteamName } = mteamInfo;
        const formValue = this.formRef.current.getFieldsValue();
        const { regionName } = regionList.find((item) => item.regionId === formValue.regionId) || {};
        const asyncExportFormInitData = {
            provinceName,
            regionName: formValue.regionId === '-1' ? '全部' : regionName,
            professionalName,
            mteamName,
            dateTime: [formValue.dateTime, formValue.dateTime],
            exportType,
        };
        this.getExportProcess();
        this.setState({
            asyncExportFormInitData,
            exportModalVisible: true,
        });
    };
    onClose = () => {
        this.setState({ exportModalVisible: false });
        clearInterval(this.asyncExportTimer);
        this.asyncExportTimer = null;
    };
    onDownLoad = () => {
        const url = `${useEnvironmentModel.data.environment.groupUrl.direct}${this.fileSrc}`;
        const str = this.fileSrc.replace('/cloud-view-maintainteam/export/', '');
        createFileFlow(str, url);
    };

    render() {
        const {
            scrollY,
            editVisible,
            editRow,
            zoneId,
            cellData,
            checkTree,
            modalVisible,
            flag,
            curSelParmExport,
            tipVisible,
            mteamInfo,
            userVisible,
            deptorman,
            userInfo,
            activeKey,
            deptUsers,
            userLoading,
            exportModalVisible,
            asyncExportFormInitData,
            asyncExportList,
            exportType,
            exportBtnLoading,
            oldCellData,
        } = this.state;
        const { userList, regionList } = this.state.storeBySQL;
        const xWidth = this.columns.reduce((total, item) => {
            return total + item.width;
        }, 0);

        return (
            <>
                <PageContainer showHeader={false}>
                    <div
                        className="oss-imp-alarm-protable-search maintenance-mode-wrapper"
                        style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Header {...this.props} />
                        <VirtualTable
                            style={{ flex: 1 }}
                            columnsState={{
                                value: this.state.configState,
                                onChange: (value) => {
                                    this.setState({ configState: value });
                                },
                            }}
                            rowKey="uniqueRdn"
                            global={window}
                            columns={this.columns}
                            x={1000}
                            scroll={{ x: xWidth, y: scrollY }}
                            request={this.loadData}
                            actionRef={this.actionRef}
                            formRef={this.formRef}
                            bordered
                            dateFormatter="string"
                            className="maintenance-mode-wrapper-table"
                            options={
                                this.type === '2' || this.type === '1'
                                    ? {
                                          density: false,
                                          reload: false,
                                      }
                                    : false
                            }
                            rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                            search={{
                                defaultCollapsed: false,
                                onCollapse: this.onSearchCollapse,
                                // eslint-disable-next-line no-nested-ternary
                                // span: this.type === '3' ? 24 : this.type === '2' ? 9 : 8,
                                span: 4,
                                // span: { xs: 24, sm: 6, md: 6, lg: 6, xl: 4, xxl: 6 },
                                optionRender: (searchConfig, formProps, dom) => {
                                    return this.handleOptionRender(dom, tipVisible);
                                },
                            }}
                            manualRequest
                        />
                    </div>
                </PageContainer>
                <EditMode
                    editRow={editRow}
                    visible={editVisible}
                    zoneId={zoneId || mteamInfo.provinceId}
                    distributionModel={mteamInfo.distributionModel}
                    cellData={cellData}
                    oldCellData={oldCellData}
                    onChange={this.editChange}
                    checkTree={checkTree}
                    userList={userList}
                />
                <AsyncExportModal
                    visible={exportModalVisible}
                    asyncExportFormInitData={asyncExportFormInitData}
                    onClose={() => this.onClose()}
                    onExport={(formValue) => this.onExport(formValue)}
                    exportList={asyncExportList}
                    onDownLoad={() => this.onDownLoad()}
                    exportType={exportType}
                    exportBtnLoading={exportBtnLoading}
                />
                <CompModal
                    visible={modalVisible}
                    closeModal={this.closeModal}
                    onLoadResult={this.onLoadResult}
                    onUploadResult={this.onUploadResult}
                    flag={flag}
                    curSelParmExport={curSelParmExport}
                    refreshTable={this.refreshTable}
                    mteamInfo={mteamInfo}
                    mteamModel={this.type}
                    regionList={regionList}
                    hasSpecialAuth={this.hasSpecialAuth}
                />
                <Modal
                    width="80vw"
                    footer={null}
                    title="部门/人员信息"
                    visible={userVisible}
                    className="maintenance-userinfo-modal"
                    onCancel={() => this.setState({ userVisible: false })}
                >
                    {deptorman ? (
                        <Tabs type="card" activeKey={activeKey} renderTabBar={this.renderTabBar}>
                            {userInfo.map((item) => (
                                <Tabs.TabPane key={item.userId} tab={item.userName}>
                                    <Form labelCol={{ span: 4 }}>
                                        <Form.Item label="中文名">{item.userName}</Form.Item>
                                        <Form.Item label="账号">{item.loginId}</Form.Item>
                                        <Form.Item label="所属区域">{item.zoneName}</Form.Item>
                                        <Form.Item label="邮箱">{item.userEmail}</Form.Item>
                                        <Form.Item label="所属部门">{item.deptName}</Form.Item>
                                        <Form.Item label="移动电话">{item.userMobile}</Form.Item>
                                        <Form.Item label="办公电话">{item.userPhone}</Form.Item>
                                        <Form.Item label="大区部门">{item.dqDeptName}</Form.Item>
                                    </Form>
                                </Tabs.TabPane>
                            ))}
                        </Tabs>
                    ) : (
                        <Tabs type="card" activeKey={activeKey} renderTabBar={this.renderTabBar}>
                            {userInfo.map((item) => (
                                <Tabs.TabPane key={item.deptId} tab={item.deptName}>
                                    <Form labelCol={{ span: 4 }}>
                                        <Form.Item label="部门名称">{item.deptName}</Form.Item>
                                        <Form.Item label="所属上级部门">{item.parentDeptName}</Form.Item>
                                        <Form.Item label="所属区域">{item.zoneName}</Form.Item>
                                        <Form.Item label="包含人员" />
                                        <Table
                                            pagination={false}
                                            scroll={{ y: 220 }}
                                            loading={userLoading}
                                            dataSource={deptUsers}
                                            columns={this.userColumns}
                                            style={{ width: '83%', margin: '0 auto' }}
                                        />
                                    </Form>
                                </Tabs.TabPane>
                            ))}
                        </Tabs>
                    )}
                </Modal>
            </>
        );
    }
}
export default withModel([useLoginInfoModel, usePageInfo], (shareInfo) => ({
    login: shareInfo[0],
    pageInfo: shareInfo[1],
}))(Index);
