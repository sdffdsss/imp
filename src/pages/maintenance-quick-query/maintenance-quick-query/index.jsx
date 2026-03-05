import React, { Fragment } from 'react';
import { Tooltip, Icon, Form, Row, Col, Input, Radio, message } from 'oss-ui';
import { Button } from 'antd';
import PageContainer from '@Components/page-container';
import { VirtualTable } from 'oss-web-common';
import './style.less';
import api from './api';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';

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
const { Search } = Input;
// 当前查询使用参数
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
            str = <span style={{ color: '#F50' }}>{str}</span>;
        }
        return str;
    });
    return { node: tipNameAR, sName, sTel, unFlag };
};
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            flagState: false,
            publishColumns: [
                {
                    title: '地市',
                    dataIndex: 'regionName',
                    align: 'center',
                    ellipsis: true,
                    hideInSearch: true,
                },
                {
                    title: '专业',
                    dataIndex: 'txt',
                    align: 'center',
                    ellipsis: true,
                    hideInSearch: true,
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
                                    ) : (
                                        <span />
                                    )}
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
                            const tipField = fieldNode(
                                record.acceptNightName,
                                record.acceptNightTel,
                                record.acceptNightId,
                                record.unusedAcceptNightId,
                            );
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
                                    ) : (
                                        <span />
                                    )}
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
                                    ) : (
                                        <span />
                                    )}
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
                                    ) : (
                                        <span />
                                    )}
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
                                    ) : (
                                        <span />
                                    )}
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
                                    ) : (
                                        <span />
                                    )}
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
                                    ) : (
                                        <span />
                                    )}
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
                                    ) : (
                                        <span />
                                    )}
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
                                    ) : (
                                        <span />
                                    )}
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
                                    ) : (
                                        <span />
                                    )}
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
            ],
            dataSource: [],
            loading: false,
            searchRef: {},
            scrollY: window.innerHeight - 300,
            selectVal: '',
            professionalList: [],
            professionalType: '8',
            pagination: {
                current: 1,
                pageSize: 20,
                total: 0,
                showSizeChanger: true,
            },
            radioState: '0', // 标签状态，0-关闭，1开启
            professionalState: 0, // 选择下拉状态 //0-无收起，1-折叠状态，2-展开状态
            mteamModel: 1,
        };
    }
    componentDidMount() {
        this.intData();
        // this.selectMaintenanceTeamInfo();
    }
    noTitlChange = (flag) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        // this.props.noTitlChange && this.props.noTitlChange(flag);
        this.setState({
            flagState: flag,
        });
    };
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
    async intData() {
        const {
            login: { userId },
        } = this.props;
        const professionalList = await api.getDictEntry('professional_type', userId);
        this.setState({
            professionalList,
        });
    }
    async loadData() {
        const {
            login: { userId, systemInfo },
        } = this.props;
        const provinceId = systemInfo?.currentZone?.zoneId;
        const { pagination, selectVal, professionalType, mteamModel } = this.state;
        const parm = {
            pageNumNew: pagination.current,
            pageSizeNew: pagination.pageSize,
            selectVal,
            professionalType,
            creator: userId,
            mteamModel,
            provinceId,
        };
        this.setState({
            loading: true,
        });
        const result = await api.getQuickQueryMaintenanceInfo(parm);

        let noTitle = false;
        if (result.code === 200) {
            const dataSource = result.rows;
            const paginationNew = {
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: result.total,
                showQuickJumper: true,
                showSizeChanger: true,
            };
            dataSource.forEach((item) => {
                Object.keys(item).forEach((items) => {
                    if (noPerosonList.includes(items)) {
                        noTitle = true;
                    }
                });
            });
            this.setState({
                dataSource,
                pagination: paginationNew,
                loading: false,
                oldRow: {},
                editRowData: '',
            });
        } else {
            this.setState({
                dataSource: [],
                loading: false,
                oldRow: {},
                editRowData: '',
            });
        }
        this.noTitlChange(noTitle);
    }
    onSearchCollapse = (collapsed) => {
        this.setState({
            scrollY: collapsed ? window.innerHeight - 290 : window.innerHeight - 345,
        });
    };
    // 查询事件
    searchData = (value) => {
        if (value) {
            this.loadData();
        } else {
            message.warn('请输入关键字后进行查询！');
            this.setState({
                pagination: {
                    current: 1,
                    pageSize: 20,
                    total: 0,
                },
                dataSource: [],
            });
        }
    };

    onPageChange = (pagination) => {
        this.setState({ pagination }, () => {
            this.loadData();
        });
    };

    onProfessionalChange = (e) => {
        this.setState({
            professionalType: e.target.value,
        });
    };

    clickUnfoldRadio = (val) => {
        this.setState({
            radioState: val,
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

    onChange = (e) => {
        this.setState({
            selectVal: e.target.value,
            // dataSource: [],
            // pagination: {
            //     current: 1,
            //     pageSize: 20,
            //     total: 0,
            // },
        });
    };

    changProfessionalDown = (id) => {
        let professional = 0;
        if (id === '1') {
            professional = 2;
        } else {
            professional = 1;
        }
        this.setState({
            professionalState: professional,
        });
    };

    onMteamModel = (e) => {
        this.setState({
            mteamModel: e.target.value,
        });
    };

    render() {
        const { publishColumns, dataSource, loading, pagination, searchRef, professionalList, flagState, professionalState } = this.state;
        const xWidth = publishColumns.reduce((total, item) => {
            return total + item.width;
        }, 0);

        const selectWidthPros = (window.innerWidth / 24) * 14 - 30;
        let newProfessional = [];
        let downWidthPros = 0;
        let newProfessionalState = professionalState;
        if (newProfessionalState !== 2) {
            professionalList.forEach((pro) => {
                downWidthPros += this.getByteLen(pro.value) * 13 + 20;
                if (downWidthPros < selectWidthPros) {
                    newProfessional.push(pro);
                }
            });
            if (newProfessional.length === professionalList.length) {
                newProfessionalState = 0;
            } else {
                newProfessionalState = 1;
            }
        } else {
            newProfessional = professionalList;
        }

        return (
            <Fragment>
                <div className="oss-imp-alart-common-bg maintenance-quick-query-mode-select ">
                    <Form ref={this.formRef} name="select-form" initialValues={{ professionalName: '8' }}>
                        <Row>
                            <Col span={3}>
                                <Form.Item>
                                    <Form.Item name="mteamModel" noStyle>
                                        <Radio.Group
                                            name="mteamModel"
                                            defaultValue={1}
                                            onChange={(e) => {
                                                this.onMteamModel(e);
                                            }}
                                        >
                                            <Radio value={1}>值班</Radio>
                                            <Radio value={2}>包机</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item>
                                    <Form.Item name="keyword" noStyle>
                                        <Search
                                            placeholder="请输入关键字"
                                            onSearch={this.searchData}
                                            onPressEnter={this.searchData}
                                            onChange={this.onChange}
                                            enterButton
                                        />
                                    </Form.Item>
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item name="professionalName" label="搜索专业">
                                    <Radio.Group size="small" buttonStyle="solid">
                                        {newProfessional.map((item) => {
                                            return (
                                                <Radio.Button
                                                    value={item.key}
                                                    onChange={this.onProfessionalChange}
                                                    style={{ width: this.getByteLen(item.value) * 13 + 14 }}
                                                >
                                                    {item.value}
                                                </Radio.Button>
                                            );
                                        })}
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={1} style={{ paddingTop: '4px' }}>
                                {newProfessionalState === 1 && (
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
                                {newProfessionalState === 2 && (
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
                        </Row>
                    </Form>
                </div>
                <PageContainer showHeader={false}>
                    <div
                        className={`oss-imp-alarm-protable-search maintenance-quick-query-mode-wrapper ${
                            !loading && 'oss-imp-alarm-protable-empty-show'
                        }`}
                        style={{ height: window.innerHeight - 100 - 50 - 50 }}
                    >
                        <VirtualTable
                            rowKey="rosterIntId"
                            global={window}
                            columns={publishColumns}
                            dataSource={dataSource}
                            x={xWidth}
                            // scroll={{ x: xWidth, y: scrollY }}
                            search={false}
                            onChange={this.onPageChange}
                            onSubmit={this.search}
                            pagination={pagination}
                            formRef={searchRef}
                            loading={loading}
                            options={{ reload: false, setting: false, fullScreen: false, density: false }}
                            toolBarRender={() => [flagState && <div style={{ color: '#C7C7C8', fontSize: '13px' }}>· 标红的值班人员不存在</div>]}
                            bordered
                            dateFormatter="string"
                            rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                            form={{
                                align: 'right',
                                labelCol: { span: 6 },
                            }}
                        />
                    </div>
                </PageContainer>
            </Fragment>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
