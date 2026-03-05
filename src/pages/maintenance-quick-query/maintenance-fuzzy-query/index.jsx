import React from 'react';
import { Tooltip, Icon, Row, Col, Radio, Form } from 'oss-ui';
import { Button } from 'antd';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import moment from 'moment';
import api from './api';
import { VirtualTable } from 'oss-web-common';
import './style.less';

const noPerosonList = [
    'unusedAcceptId',
    'unusedAcceptNightId',
    'unusedAgentId',
    'unusedCopyId',
    'unusedChildId',
    'unusedDaiweiManId',
    'unusedDaiweiScheId',
    'unusedSmsId',
    'unusedKeyId',
    'unusedAuditId',
];
const fieldNode = (fieldName, fieldTel, fieldKey, fieldNoId) => {
    const name = fieldName.split(',');
    const sName = <span>{name[0]}</span>;
    const tel = (fieldTel && fieldTel.split(',')) || [];
    const sTel = <span>{tel[0]}</span>;
    const noId = fieldNoId ? fieldNoId.split(',') : [];
    const fieldId = fieldKey ? fieldKey.split(',') : [];
    let unFlag = false;
    const tipNameAR = fieldId.map((val, index) => {
        let str = '';
        if (tel[index] === '') {
            str = `${name[index]}`;
        } else {
            str = `${name[index]}[${tel[index]}]`;
        }
        if (index === fieldId.length - 1) {
            str = <span>{str}</span>;
        } else {
            str = <span>{str},</span>;
        }
        if (noId.includes(val)) {
            unFlag = true;
            str = (
                <span style={{ color: '#F50' }}>
                    {str}
                    {/* {index !== fieldId.length - 1 ? ',' : ''} */}
                </span>
            );
        }
        return str;
    });
    return { node: tipNameAR, sName, sTel, unFlag };
};
const intitAllValue = '-1';
class Index extends React.PureComponent {
    formRef = React.createRef();
    actionRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            // 数据库加载基础数据，数据库加载后，不再处理变更
            storeBySQL: {
                provinceList: [],
                regionList: [],
                teamInfo: [],
                teamDimInfo: [],
                professional: [],
                deptList: [],
                userList: [],
            },
            scrollY: window.innerHeight - 300,
            treeList: [],
            editRow: {},
            editRowData: '',
            // 选择下拉状态 //0-无收起，1-折叠状态，2-展开状态
            downState: {
                provinceState: 0,
                regionState: 0,
                professionalState: 0,
                TeamDimState: 0,
            },
            columns: [],
            flagState: false,
        };
    }

    publishColumns = () => {
        // const { storeBySQL } = this.state;

        const columns = [
            {
                title: '地市',
                dataIndex: 'regionName',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '专业',
                dataIndex: 'professionalName',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
                // render: (name, record) => {
                //     if (!name) {
                //         return '-';
                //     }
                //     const proFess = storeBySQL.professional.find((item) => String(item.key) === String(record.professionalType));
                //     if (proFess) {
                //         return proFess.value;
                //     }
                //     return name;
                // }
            },
            {
                title: '班组',
                dataIndex: 'ruleType',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '维护范围',
                dataIndex: 'neLabel',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: 'A角（白班）',
                dataIndex: 'acceptName',
                align: 'center',
                hideInSearch: true,
                render: (text, record) => {
                    let tipName = record.acceptName;
                    let sName = tipName;
                    let sTel = '';
                    let unFlag = false;
                    if (record.acceptName) {
                        const tipField = fieldNode(record.acceptName, record.acceptTel, record.acceptId, record.unusedAcceptId);
                        tipName = tipField.node;
                        sName = tipField.sName;
                        sTel = tipField.sTel;
                        unFlag = tipField.unFlag;
                    }

                    return (
                        <div className="mainper-tab-ellipsis" style={unFlag ? { color: '#f50' } : {}}>
                            <Tooltip title={tipName}>
                                {sName}
                                {sTel ? (
                                    <span>
                                        <br />
                                        {sTel}
                                    </span>
                                ) : null}
                            </Tooltip>
                        </div>
                    );
                },
            },
            {
                title: 'A角（夜班）',
                dataIndex: 'acceptNightName',
                align: 'center',
                hideInSearch: true,
                render: (text, record) => {
                    let tipName = record.acceptNightName;
                    let sName = tipName;
                    let sTel = '';
                    let unFlag = false;
                    if (record.acceptNightName) {
                        const tipField = fieldNode(record.acceptNightName, record.acceptNightTel, record.acceptNightId, record.unusedAcceptNightId);
                        tipName = tipField.node;
                        sName = tipField.sName;
                        sTel = tipField.sTel;
                        unFlag = tipField.unFlag;
                    }

                    return (
                        <div className="mainper-tab-ellipsis" style={unFlag ? { color: '#f50' } : {}}>
                            <Tooltip title={tipName}>
                                {sName}
                                {sTel ? (
                                    <span>
                                        <br />
                                        {sTel}
                                    </span>
                                ) : null}
                            </Tooltip>
                        </div>
                    );
                },
            },
            {
                title: 'B角',
                dataIndex: 'agentName',
                align: 'center',
                hideInSearch: true,
                render: (text, record) => {
                    let tipName = record.agentName;
                    let sName = tipName;
                    let sTel = '';
                    let unFlag = false;
                    if (record.agentName) {
                        const tipField = fieldNode(record.agentName, record.agentTel, record.agentId, record.unusedAgentId);
                        tipName = tipField.node;
                        sName = tipField.sName;
                        sTel = tipField.sTel;
                        unFlag = tipField.unFlag;
                    }

                    return (
                        <div className="mainper-tab-ellipsis" style={unFlag ? { color: '#f50' } : {}}>
                            <Tooltip title={tipName}>
                                {sName}
                                {sTel ? (
                                    <span>
                                        <br />
                                        {sTel}
                                    </span>
                                ) : null}
                            </Tooltip>
                        </div>
                    );
                },
            },
            {
                title: '中心主任',
                dataIndex: 'copyName',
                align: 'center',
                hideInSearch: true,
                render: (text, record) => {
                    let tipName = record.copyName;
                    let sName = tipName;
                    let sTel = '';
                    let unFlag = false;
                    if (record.copyName) {
                        const tipField = fieldNode(record.copyName, record.copyTel, record.copyId, record.unusedCopyId);
                        tipName = tipField.node;
                        sName = tipField.sName;
                        sTel = tipField.sTel;
                        unFlag = tipField.unFlag;
                    }

                    return (
                        <div className="mainper-tab-ellipsis" style={unFlag ? { color: '#f50' } : {}}>
                            <Tooltip title={tipName}>
                                {sName}
                                {sTel ? (
                                    <span>
                                        <br />
                                        {sTel}
                                    </span>
                                ) : null}
                            </Tooltip>
                        </div>
                    );
                },
            },
            {
                title: '主管领导',
                dataIndex: 'childName',
                align: 'center',
                hideInSearch: true,
                render: (text, record) => {
                    let tipName = record.childName;
                    let sName = tipName;
                    let sTel = '';
                    let unFlag = false;
                    if (record.childName) {
                        const tipField = fieldNode(record.childName, record.childTel, record.childId, record.unusedChildId);
                        tipName = tipField.node;
                        sName = tipField.sName;
                        sTel = tipField.sTel;
                        unFlag = tipField.unFlag;
                    }

                    return (
                        <div className="mainper-tab-ellipsis" style={unFlag ? { color: '#f50' } : {}}>
                            <Tooltip title={tipName}>
                                {sName}
                                {sTel ? (
                                    <span>
                                        <br />
                                        {sTel}
                                    </span>
                                ) : null}
                            </Tooltip>
                        </div>
                    );
                },
            },
            {
                title: '代维人员',
                dataIndex: 'daiweiManName',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
                render: (text, record) => {
                    let tipName = record.daiweiManName;
                    let sName = tipName;
                    let sTel = '';
                    let unFlag = false;
                    if (record.daiweiManName) {
                        const tipField = fieldNode(record.daiweiManName, record.daiweiCenterTel, record.daiweiManId, record.unusedDaiweiManId);
                        tipName = tipField.node;
                        sName = tipField.sName;
                        sTel = tipField.sTel;
                        unFlag = tipField.unFlag;
                    }

                    return (
                        <div className="mainper-tab-ellipsis" style={unFlag ? { color: '#f50' } : {}}>
                            <Tooltip title={tipName}>
                                {sName}
                                {sTel ? (
                                    <span>
                                        <br />
                                        {sTel}
                                    </span>
                                ) : null}
                            </Tooltip>
                        </div>
                    );
                },
            },

            {
                title: '代维领导',
                dataIndex: 'smsName',
                align: 'center',
                hideInSearch: true,
                render: (text, record) => {
                    let tipName = record.smsName;
                    let sName = tipName;
                    let sTel = '';
                    let unFlag = false;
                    if (record.smsName) {
                        const tipField = fieldNode(record.smsName, record.smsTel, record.smsId, record.unusedSmsId);
                        tipName = tipField.node;
                        sName = tipField.sName;
                        sTel = tipField.sTel;
                        unFlag = tipField.unFlag;
                    }

                    return (
                        <div className="mainper-tab-ellipsis" style={unFlag ? { color: '#f50' } : {}}>
                            <Tooltip title={tipName}>
                                {sName}
                                {sTel ? (
                                    <span>
                                        <br />
                                        {sTel}
                                    </span>
                                ) : null}
                            </Tooltip>
                        </div>
                    );
                },
            },
            {
                title: '代维调度中心',
                dataIndex: 'daiweiScheName',
                align: 'center',
                hideInSearch: true,
                render: (text, record) => {
                    let tipName = record.daiweiScheName;
                    let sName = tipName;
                    let sTel = '';
                    let unFlag = false;
                    if (record.daiweiScheName) {
                        const tipField = fieldNode(record.daiweiScheName, record.daiweiScheTel, record.daiweiScheId, record.unusedDaiweiScheId);
                        tipName = tipField.node;
                        sName = tipField.sName;
                        sTel = tipField.sTel;
                        unFlag = tipField.unFlag;
                    }

                    return (
                        <div className="mainper-tab-ellipsis" style={unFlag ? { color: '#f50' } : {}}>
                            <Tooltip title={tipName}>
                                {sName}
                                {sTel ? (
                                    <span>
                                        <br />
                                        {sTel}
                                    </span>
                                ) : null}
                            </Tooltip>
                        </div>
                    );
                },
            },
            {
                title: '省分专业牵头人',
                dataIndex: 'keyName',
                align: 'center',
                hideInSearch: true,
                render: (text, record) => {
                    let tipName = record.keyName;
                    let sName = tipName;
                    let sTel = '';
                    let unFlag = false;
                    if (record.keyName) {
                        const tipField = fieldNode(record.keyName, record.keyTel, record.keyId, record.unusedKeyId);
                        tipName = tipField.node;
                        sName = tipField.sName;
                        sTel = tipField.sTel;
                        unFlag = tipField.unFlag;
                    }

                    return (
                        <div className="mainper-tab-ellipsis" style={unFlag ? { color: '#f50' } : {}}>
                            <Tooltip title={tipName}>
                                {sName}
                                {sTel ? (
                                    <span>
                                        <br />
                                        {sTel}
                                    </span>
                                ) : null}
                            </Tooltip>
                        </div>
                    );
                },
            },

            {
                title: '工单审核人',
                dataIndex: 'auditName',
                align: 'center',

                hideInSearch: true,
                render: (text, record) => {
                    let tipName = record.auditName;
                    let sName = tipName;
                    let sTel = '';
                    let unFlag = false;
                    if (record.auditName) {
                        const tipField = fieldNode(record.auditName, record.auditTel, record.auditId, record.unusedAuditId);
                        tipName = tipField.node;
                        sName = tipField.sName;
                        sTel = tipField.sTel;
                        unFlag = tipField.unFlag;
                    }

                    return (
                        <div className="mainper-tab-ellipsis" style={unFlag ? { color: '#f50' } : {}}>
                            <Tooltip title={tipName}>
                                {sName}
                                {sTel ? (
                                    <span>
                                        <br />
                                        {sTel}
                                    </span>
                                ) : null}
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
                render: (text, record) => this.renderCell(record, 'cityDirector'),
            },
            {
                title: '地市-专业支撑',
                dataIndex: 'regionSupport',
                rowIndex: 'regionSupport',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'regionSupport'),
            },
            {
                title: '地市-专业管理',
                dataIndex: 'regionManagement',
                rowIndex: 'regionManagement',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'regionManagement'),
            },
            {
                title: '地市-部门领导',
                dataIndex: 'regionDeptLeader',
                rowIndex: 'regionDeptLeader',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'regionDeptLeader'),
            },
            {
                title: '地市-公司领导',
                dataIndex: 'regionCompLeader',
                rowIndex: 'regionCompLeader',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'regionCompLeader'),
            },
            {
                title: '省分-专业支撑',
                dataIndex: 'provinceSupport',
                rowIndex: 'provinceSupport',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'provinceSupport'),
            },
            {
                title: '省分-专业管理',
                dataIndex: 'provinceManagement',
                rowIndex: 'provinceManagement',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'provinceManagement'),
            },
            {
                title: '省分-部门领导',
                dataIndex: 'provinceDeptLeader',
                rowIndex: 'provinceDeptLeader',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'provinceDeptLeader'),
            },
            {
                title: '省分-公司领导',
                dataIndex: 'provinceCompLeader',
                rowIndex: 'provinceCompLeader',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'provinceCompLeader'),
            },
            {
                title: '监控值班员',
                dataIndex: 'duty',
                rowIndex: 'duty',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'duty'),
            },
            {
                title: '监控值班长',
                dataIndex: 'dutyLeader',
                rowIndex: 'dutyLeader',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'dutyLeader'),
            },
            {
                title: '监控支撑',
                dataIndex: 'dutySupport',
                rowIndex: 'dutySupport',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'dutySupport'),
            },
            {
                title: '监控专业主管',
                dataIndex: 'dutyManagement',
                rowIndex: 'dutyManagement',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => this.renderCell(record, 'dutyManagement'),
            },
        ];
        this.setState({
            columns,
        });
    };
    noTitlChange = (flag) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        //this.props.noTitlChange && this.props.noTitlChange(flag);
        this.setState({
            flagState: flag,
        });
    };
    componentDidMount() {
        this.publishColumns();
        this.intData();
    }

    renderCell = (record, field) => {
        const originName = record[`${field}Name`];
        const originTel = field === 'daiweiMan' ? record.daiweiCenterTel : record[`${field}Tel`];
        let tipName = originName;
        let sName = tipName;
        let sTel = '';
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
        return (
            <div className="mainper-tab-ellipsis">
                <Tooltip title={tipName}>
                    {' '}
                    <span>{sName}</span>
                    <br />
                    <span>{sTel}</span>
                </Tooltip>
            </div>
        );
    };

    reload = () => {
        this.actionRef.current.reloadAndRest();
    };

    async intData() {
        const {
            login: { userId, systemInfo },
        } = this.props;
        const zoneId = systemInfo.currentZone?.zoneId;
        const { storeBySQL } = this.state;
        let provinceId;
        let regionId;
        let professionalType;
        let dimensions;
        storeBySQL.provinceList = await api.getProvinceData(userId, zoneId);
        if (storeBySQL.provinceList.length > 0) {
            provinceId = storeBySQL.provinceList[0].regionId;
            if (systemInfo?.currentZone?.zoneId) {
                provinceId = systemInfo.currentZone.zoneId;
            }
            storeBySQL.regionList = await api.getProvinceRegions(provinceId, userId);
            if (storeBySQL.regionList.length > 0) {
                regionId = intitAllValue;
            }
        }

        storeBySQL.professional = await api.getDictEntry('professional_type', userId);
        if (storeBySQL.professional.length > 0) {
            professionalType = intitAllValue;
            const teamParm = { pageNumNew: 1, pageSizeNew: 9000, provinceId, professionalId: professionalType, operator: userId };
            storeBySQL.teamDimInfo = await api.getTeamDimInfo(teamParm);
            if (storeBySQL.teamDimInfo.length > 0) {
                dimensions = storeBySQL.teamDimInfo[0].dimensions;
            }
        }
        if (systemInfo?.currentZone?.zoneId) {
            provinceId = systemInfo.currentZone.zoneId;
        }
        this.formRef.current.setFieldsValue({
            provinceId: String(provinceId || '0'),
            regionId: String(regionId || '-1'),
            professionalType: String(professionalType || '-1'),
            dimensions: String(dimensions || '按网元'),
            mteamModel: 1,
        });
        this.setState({ storeBySQL });
        this.reload();
    }
    // 专业下拉修改事件
    async changeProfessional(e) {
        const { storeBySQL } = this.state;
        const values = this.formRef.current.getFieldsValue();
        const professionalType = e.target.value;
        const { provinceId } = values;
        let dimensions = '';
        if (storeBySQL.professional.length > 0) {
            const teamParm = { pageNumNew: 1, pageSizeNew: 9000, provinceId, professionalId: professionalType, operator: this.props.login.userId };
            storeBySQL.teamDimInfo = await api.getTeamDimInfo(teamParm);
            if (storeBySQL.teamDimInfo.length > 0) {
                dimensions = storeBySQL.teamDimInfo[0].dimensions;
            }
        }
        this.formRef.current.setFieldsValue({ dimensions });
        this.setState({ storeBySQL });
        this.reload();
    }
    // 省份下拉修改事件
    async changeProvince(e) {
        const provinceId = e.target.value;
        const {
            login: { userId },
        } = this.props;
        const { storeBySQL } = this.state;
        const values = this.formRef.current.getFieldsValue();
        let { regionId } = values;
        let dimensions = '';
        storeBySQL.regionList = await api.getProvinceRegions(provinceId, userId);
        if (storeBySQL.regionList.length > 0) {
            regionId = intitAllValue;
        }
        if (storeBySQL.professional.length > 0) {
            const teamParm = { pageNumNew: 1, pageSizeNew: 9000, provinceId, professionalId: values.professionalType, operator: userId };
            storeBySQL.teamDimInfo = await api.getTeamDimInfo(teamParm);
            if (storeBySQL.teamDimInfo.length > 0) {
                dimensions = storeBySQL.teamDimInfo[0].dimensions;
            }
        }
        this.setState({ storeBySQL });
        this.formRef.current.setFieldsValue({ regionId, dimensions });
        this.reload();
    }

    disabledDate = (current) => {
        return current && (current < moment().subtract(1, 'months').startOf('months') || current > moment().add(1, 'months').endOf('months'));
    };
    loadData = async (params) => {
        const {
            login: { userId },
        } = this.props;
        const values = this.formRef.current.getFieldsValue();
        const { provinceId, regionId, professionalType } = values;
        if (provinceId === undefined || regionId === undefined || professionalType === undefined) return {};
        const { current, pageSize } = params;
        const parm = {
            pageNumNew: current,
            pageSizeNew: pageSize,
            dateTime: moment().format('YYYY-MM-DD'),
            operator: userId,
            ruleType: '全部',
            ...values,
        };
        let noTitle = false;
        const result = await api.getMaintenanceInfo(parm);
        const { rows = [], total } = result;
        rows.forEach((item) => {
            Object.keys(item).forEach((items) => {
                if (noPerosonList.includes(items)) {
                    noTitle = true;
                }
            });
        });
        this.noTitlChange(noTitle);
        this.setState({
            oldRow: {},
            editRowData: '',
        });
        return {
            success: true,
            data: rows,
            total,
        };
    };
    changProvinceDown = (id) => {
        const { downState } = this.state;
        let province = 0;
        if (id === '1') {
            province = 2;
        } else {
            province = 1;
        }
        this.setState({
            downState: {
                ...downState,
                provinceState: province,
            },
        });
    };

    changRegionDown = (id) => {
        const { downState } = this.state;
        let region = 0;
        if (id === '1') {
            region = 2;
        } else {
            region = 1;
        }
        this.setState({
            downState: {
                ...downState,
                regionState: region,
            },
        });
    };

    changProfessionalDown = (id) => {
        const { downState } = this.state;
        let professional = 0;
        if (id === '1') {
            professional = 2;
        } else {
            professional = 1;
        }
        this.setState({
            downState: {
                ...downState,
                professionalState: professional,
            },
        });
    };
    changTeamDimDown = (id) => {
        const { downState } = this.state;
        let TeamDim = 0;
        if (id === '1') {
            TeamDim = 2;
        } else {
            TeamDim = 1;
        }
        this.setState({
            downState: {
                ...downState,
                TeamDimState: TeamDim,
            },
        });
    };
    // 获取字符串长度
    getByteLen = (val) => {
        let len = 0;
        for (let i = 0; i < val.length; i += 1) {
            const a = val.charAt(i);
            if (a.match(/[^\x20-\xff]/gi) != null) {
                len += 1;
            } else {
                len += 0.7;
            }
        }
        return len;
    };

    onChange = (pagination) => {
        this.setState({ pagination });
    };

    render() {
        const { storeBySQL, downState, columns, flagState } = this.state;
        const xWidth = columns.reduce((total, item) => {
            return total + item.width;
        }, 0);
        const { provinceList, regionList, teamDimInfo, professional } = storeBySQL;
        const { systemInfo } = this.props.login;
        const selectWidth = (window.innerWidth * 23) / 24 - 60;
        let downWidthPro = 0;
        let newProvince = [];
        let { provinceState } = downState;
        if (provinceState !== 2) {
            provinceList.forEach((pro) => {
                downWidthPro += pro.regionName.length * 13 + 14;
                if (downWidthPro < selectWidth) {
                    newProvince.push(pro);
                }
            });
            if (newProvince.length === provinceList.length) {
                provinceState = 0;
            } else {
                provinceState = 1;
            }
        } else {
            newProvince = provinceList;
        }

        let newRegion = [];
        let downWidthReg = 0;
        let { regionState } = downState;
        if (regionState !== 2) {
            regionList.forEach((pro) => {
                downWidthReg += pro.regionName.length * 13 + 12;
                if (downWidthReg < selectWidth) {
                    newRegion.push(pro);
                }
            });
            if (newRegion.length === regionList.length) {
                regionState = 0;
            } else {
                regionState = 1;
            }
        } else {
            newRegion = regionList;
        }

        const selectWidthPros = (window.innerWidth * 23) / 24 - 84;
        let newProfessional = [];
        let downWidthPros = 0;
        let { professionalState } = downState;
        if (professionalState !== 2) {
            professional.forEach((pro) => {
                downWidthPros += this.getByteLen(pro.value) * 13 + 15;
                if (downWidthPros < selectWidthPros) {
                    newProfessional.push(pro);
                }
            });
            if (newProfessional.length === professional.length) {
                professionalState = 0;
            } else {
                professionalState = 1;
            }
        } else {
            newProfessional = professional;
        }
        const selectWidthDims = (window.innerWidth * 23) / 24 - 84;
        let newTeamDim = [];
        let downWidthDims = 0;
        let { teamDimState } = downState;
        if (teamDimState !== 2) {
            teamDimInfo.forEach((pro) => {
                downWidthDims += this.getByteLen(pro.dimensions) * 13 + 12;
                if (downWidthDims < selectWidthDims) {
                    newTeamDim.push(pro);
                }
            });
            if (newTeamDim.length === teamDimInfo.length) {
                teamDimState = 0;
            } else {
                teamDimState = 1;
            }
        } else {
            newTeamDim = teamDimInfo;
        }
        const mteamModelSource = [
            {
                title: '值班',
                mteamModel: 1,
            },
            {
                title: '包机',
                mteamModel: 2,
            },
        ];
        return (
            <div className="maintenance-quick-query-page">
                <div className="maintenance-fuzzy-query-mode-select ">
                    <Form name="validate_other" ref={this.formRef}>
                        <Row>
                            <Col span={23}>
                                <Form.Item name="provinceId" label="省份">
                                    <Radio.Group size="small" buttonStyle="solid" style={{ border: '0px' }} onChange={this.changeProvince.bind(this)}>
                                        {provinceList
                                            .filter((item) =>
                                                systemInfo?.currentZone?.zoneId ? systemInfo?.currentZone?.zoneId === item.regionId : true,
                                            )
                                            .map((item) => {
                                                return (
                                                    <Radio.Button
                                                        value={item.regionId}
                                                        type="text"
                                                        bordered={false}
                                                        style={{ width: item.regionName.length * 13 + 14 }}
                                                    >
                                                        {item.regionName}
                                                    </Radio.Button>
                                                );
                                            })}
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={1}>
                                {provinceState === 1 && (
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            this.changProvinceDown('1');
                                        }}
                                    >
                                        <Icon type="DownOutlined" antdIcon />
                                        展开
                                    </Button>
                                )}
                                {provinceState === 2 && (
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            this.changProvinceDown('2');
                                        }}
                                    >
                                        <Icon type="UpOutlined" antdIcon />
                                        收起
                                    </Button>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={23}>
                                <Form.Item name="regionId" label="地市">
                                    <Radio.Group size="small" buttonStyle="solid" onChange={this.reload}>
                                        <Radio.Button value={'-1'}>{'全部'}</Radio.Button>
                                        {newRegion.map((item) => {
                                            return (
                                                <Radio.Button value={item.regionId} style={{ width: item.regionName.length * 13 + 12 }}>
                                                    {item.regionName}
                                                </Radio.Button>
                                            );
                                        })}
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={1}>
                                {regionState === 1 && (
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            this.changRegionDown('1');
                                        }}
                                    >
                                        <Icon type="DownOutlined" antdIcon />
                                        展开
                                    </Button>
                                )}
                                {regionState === 2 && (
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            this.changRegionDown('2');
                                        }}
                                    >
                                        <Icon type="UpOutlined" antdIcon />
                                        收起
                                    </Button>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={23}>
                                <Form.Item name="professionalType" label="专业">
                                    <Radio.Group size="small" buttonStyle="solid">
                                        <Radio.Button value={'-1'} onChange={this.changeProfessional.bind(this)}>
                                            {'全部'}
                                        </Radio.Button>
                                        {newProfessional.map((item) => {
                                            return (
                                                <Radio.Button
                                                    value={item.key}
                                                    onChange={this.changeProfessional.bind(this)}
                                                    style={{ width: this.getByteLen(item.value) * 13 + 12 }}
                                                >
                                                    {item.value}
                                                </Radio.Button>
                                            );
                                        })}
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={1}>
                                {professionalState === 1 && (
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            this.changProfessionalDown('1');
                                        }}
                                    >
                                        <Icon type="DownOutlined" antdIcon />
                                        展开
                                    </Button>
                                )}
                                {professionalState === 2 && (
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            this.changProfessionalDown('2');
                                        }}
                                    >
                                        <Icon type="UpOutlined" antdIcon />
                                        收起
                                    </Button>
                                )}
                            </Col>
                            {/* <Col span={1}>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        onClick={() => {
                                            this.loadData();
                                        }}
                                    >
                                        查询
                                    </Button>
                                </Form.Item>
                            </Col> */}
                        </Row>
                        <Row>
                            <Col span={23}>
                                <Form.Item name="mteamModel" label="班组模式">
                                    <Radio.Group size="small" buttonStyle="solid" onChange={this.reload}>
                                        {mteamModelSource.map((item) => {
                                            return <Radio.Button value={item.mteamModel}>{item.title}</Radio.Button>;
                                        })}
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={23}>
                                <Form.Item name="dimensions" label="班组维度">
                                    <Radio.Group size="small" buttonStyle="solid" onChange={this.reload}>
                                        {newTeamDim.map((item) => {
                                            return (
                                                <Radio.Button value={item.dimensions} style={{ width: item.dimensions.length * 13 + 12 }}>
                                                    {item.dimensions}
                                                </Radio.Button>
                                            );
                                        })}
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={1}>
                                {regionState === 1 && (
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            this.changTeamDimDown('1');
                                        }}
                                    >
                                        <Icon type="DownOutlined" antdIcon />
                                        展开
                                    </Button>
                                )}
                                {regionState === 2 && (
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            this.changTeamDimDown('2');
                                        }}
                                    >
                                        <Icon type="UpOutlined" antdIcon />
                                        收起
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div
                    className={`maintenance-fuzzy-query-mode-wrapper ${'oss-imp-alarm-protable-empty-show'}`}
                    style={{ height: window.innerHeight - 100 - 30 - 28 * 4 }}
                >
                    <VirtualTable
                        rowKey="rosterIntId"
                        global={window}
                        columns={columns}
                        x={xWidth}
                        // scroll={{ x: xWidth, y: scrollY }}
                        request={this.loadData}
                        onReset={false}
                        actionRef={this.actionRef}
                        bordered
                        dateFormatter="string"
                        options={false}
                        onChange={this.onChange}
                        rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                        search={false}
                    />
                </div>
                {flagState && (
                    <div
                        style={{
                            color: '#C7C7C8',
                            margin: '-66px 0 0 28px',
                            lineHeight: '56px',
                            position: 'absolute',
                            bottom: '10px',
                            fontSize: '14px',
                        }}
                    >
                        · 标红的值班人员不存在
                    </div>
                )}
                {/* <div style={{ color: '#C7C7C8', margin: '-66px 0 0 28px', lineHeight: '56px', zIndex: '10', fontSize: '14px', width: '20%' }}>
                    · 标红的值班人员不存在
                </div> */}
            </div>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
