/* eslint-disable no-const-assign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-empty */
/* eslint-disable no-restricted-syntax */
import React, { PureComponent } from 'react';
import { Button, Form, Input, Row, Space, Checkbox, Col, message, Card, Modal, Icon, Steps, Layout, Select, Popconfirm } from 'oss-ui';
import PageContainer from '@Src/components/page-container';
import request from '@Src/common/api';
import { _ } from 'oss-web-toolkits';
import constants from '@Common/constants';
import { moduleIdEditContentMap, moduleIdFormatMap, showPrivateFields, defaultFilterConditionList } from './util';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { filterTypeOptions } from '@Src/pages/auto-sheet-rule/enum';
import './index.less';
import { FILTER_EMUN } from '../index';
import { getCommonMsgWithSelectFilter } from '../utils';
import TableTransfer from './transfer-table';
import produce from 'immer';
import {
    maintainTeamColumns,
    maintainTeamColumnsRight,
    getProfessionalEnum2Maintenance,
    getProvinceEnum2Maintenance,
    getMaintainTeamList,
    saveFilterMteam,
    getFilterMteamList,
} from './transfer-table/teamMode';
import formatReg from '@Common/formatReg';
import ConditionEdit from '@Components/condition-edit';
import SingleContent from './single-content';
import shareActions from '@Src/share/actions';
import Field from '@ant-design/pro-field';
import usePageInfo from '../hox';
import SelectCondition from '../list/comp-select-condition';
import { getProvinceData } from './api';
import moment from 'moment';
import AuthButton from '@Src/components/auth-button';

const { Step } = Steps;
// 数据库加载基础数据，数据库加载后，不再处理变更
const storeBySQL = {
    provinceList: [],
    professional: [],
    teamInfo: [],
    teamInfo2: [],
};
// 当前查询使用参数
const curSelParm = {
    professionalType: '',
    provinceId: '',
    teamIdsBySql: [],
    filterId: '',
    selectedOptionsRows: [],
};

const { Header, Footer, Content } = Layout;
const authKeys = { new: 'sheetRuleManage:add', edit: 'sheetRuleManage:edit', copy: 'sheetRuleManage:copy' };
// const authKeysCrh = { new: 'crhSheetRuleManage:add', edit: 'crhSheetRuleManage:edit', copy: 'crhSheetRuleManage:copy' };
// const authKeysSuper = { new: 'superviseSheetRuleManage:add', edit: 'superviseSheetRuleManage:edit', copy: 'superviseSheetRuleManage:copy' };
class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.isCheck = props.match.params.isCheck;
        this.moduleId = props.match.params.moduleId;
        this.msg = getCommonMsgWithSelectFilter(this.moduleId);
        this.openSourcePage = props.match.params.openSourcePage;

        this.state = {
            visible: false,
            conditionVisible: false,
            filterInfo: {
                filterName: '',
                filterDesc: '',
                enable: FILTER_EMUN.ENABLE.FALSE,
                isPrivate: FILTER_EMUN.ISPRIVATE.FALSE,
                creator: props.login.userId,
                filterExpr: { filterConditionList: [], logicalType: null },
                modelId: 2,
                moduleId: Number(props.match.params.moduleId),
            },
            // 当前是否新建条件
            isCreateCondition: false,
            // 当前编辑的条件信息
            editingConditionInfo: null,
            // 当前选中的条件
            selectedKey: '',
            modelType: this.props.match.params.type,
            showCreator: props.login.userName,
            stepsValue: 0,
            pagination: {
                current: 0,
                pageSize: 1000,
                total: 0,
                showSizeChanger: false,
                showQuickJumper: false,
            },
            selectOptionsList: [],
            tableLoading: false,
            filterInfoFormCache: {},
            actionInfoFormCache: {},
            singleContentdata: [],
            pronince: {
                professionalType: '',
                provinceId: '',
            },
            teamDataRow: [],
            provinceList: [],
            teamModelState: false, //选择维护班组-模式
            filterIdState: true, //设置派单动作 true-派单，false-不派单
            filterTypeFlag: false,
            currentModuleId: props.match.params.moduleId,
            leftSelRows: [],
            rightSelRows: [],
        };
    }

    /** *
     * 规则动作ref
     */
    actionFormRef = React.createRef();
    actionSingleContentRef = React.createRef();
    /**
     * 过滤器及规则公共页面ref，主要用于名称及描述的校验
     */
    filterFormRef = React.createRef();
    conditionEditRef = React.createRef();
    tempSmsFiled = [];

    componentDidMount() {
        const { login } = this.props;
        storeBySQL.provinceList = [];
        storeBySQL.professional = [];
        storeBySQL.teamInfo = [];
        storeBySQL.teamInfo2 = [];
        // curSelParm.professionalType = '';
        // curSelParm.provinceId = '';
        curSelParm.teamIdsBySql = [];
        curSelParm.filterId = '';
        curSelParm.selectedOptionsRows = [];
        this.getProvinceList();
        const { modelType } = this.state;
        if (modelType !== 'new') {
            curSelParm.professionalType = '';
            curSelParm.provinceId = '';
            const isSimulation = this.props?.match?.params?.isSimulation;
            console.log(this.props.match.params.moduleId);
            request(`${isSimulation ? 'alarmmodel/filter/v1/getLatestFilterDetailByParams' : 'alarmmodel/filter/v1/filter'}`, {
                type: `${isSimulation ? 'post' : 'get'}`,
                baseUrlType: 'filterUrl',
                showSuccessMessage: false,
                data: {
                    moduleId: this.props.match.params.moduleId,
                    modelId: 2,
                    filterId: this.props.match.params.id,
                    date: isSimulation ? this.props.match.params.date : undefined,
                },
            }).then((res) => {
                if (res && res.data) {
                    let filterInfo = res.data;
                    if (modelType === 'copy') {
                        // debugger;
                        filterInfo = { ...res.data, filterName: `${res.data.filterName}-copy` };
                    }
                    //规则库数据展示处理
                    if (this.props.location?.state?.type === 'ruleBase') {
                        let filterConditionList = this.handleFilterInfo(filterInfo.filterExpr.filterConditionList);
                        filterInfo = {
                            ...res.data,
                            filterExpr: {
                                logicalType: res.data.filterExpr.logicalType,
                                filterConditionList,
                            },
                            filterName: this.props.location.state.row?.filterName + moment().format('YYYYMMDDHHmmss'),
                            filterProvince: this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo),
                            creator: this.props.login.userName,
                        };
                    }
                    console.log(filterInfo);
                    this.setState({
                        singleContentdata: res.data.worksheetConditionVoList || [],
                        filterInfo,
                        // filterProperties:filterInfo
                        pronince: {
                            provinceId:
                                filterInfo.filterProvince?.toString() ||
                                this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo),
                            professionalType: filterInfo.filterProfessional?.split(',')[0],
                        },
                        currentModuleId: String(filterInfo.moduleId),
                        filterIdState: filterInfo.filterProperties.find((item) => item.key === 'filterIdType')?.value === '1' ? false : true,
                    });

                    // 修改or 复制表单赋值-名称及描述

                    this.filterFormRef?.current?.setFieldsValue({
                        filterName: `${filterInfo.filterName}`,
                        filterDesc: `${filterInfo.filterDesc ? filterInfo.filterDesc : ''}`,
                        filterProvince:
                            filterInfo.filterProvince?.toString() || this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo),
                        filterProfessional: filterInfo.filterProfessional?.split(','),
                        moduleId: `${filterInfo.moduleId}`,
                    });
                    curSelParm.filterId = filterInfo.filterId;
                    this.getFilterMteamList(filterInfo.filterId);
                    this.queryAllDataList(
                        filterInfo.filterProvince?.toString() || this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo),
                    );
                }
            });
        } else {
            this.queryAllDataList(this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo));
            this.filterFormRef?.current?.setFieldsValue({
                filterProvince: this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo),
            });
            this.selMaintainTeamInfo();
        }
    }

    handleFilterInfo = (value) => {
        const { login } = this.props;
        const newValue = _.cloneDeep(value);
        const { provinceList } = this.state;
        let userProvince = this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo);
        if (userProvince === '0') {
            newValue.forEach((item) => {
                const list = item.conditionExpr?.conditionItemList;
                if (list.find((itm) => itm.fieldName === 'network_type_top')) {
                    list.find((itm) => itm.fieldName === 'network_type_top').valueList = [{ key: '0', value: '总部' }];
                }
            });
        } else {
            newValue.forEach((item) => {
                const list = item.conditionExpr?.conditionItemList;
                if (list.find((itm) => itm.fieldName === 'network_type_top')) {
                    list.find((itm) => itm.fieldName === 'network_type_top').valueList = [{ key: '1', value: '省内' }];
                }
                if (list.find((itm) => itm.fieldName === 'province_id')) {
                    list.find((itm) => itm.fieldName === 'province_id').valueList = [
                        { key: provinceList[0].regionId, value: provinceList[0].regionName },
                    ];
                }
            });
        }

        return newValue;
    };

    getProvinceList = async () => {
        const {
            login: { userId, systemInfo },
        } = this.props;
        let zoneId = systemInfo.currentZone?.zoneId;
        if (zoneId === '0') {
            zoneId = undefined;
        }

        const provinceList = await getProvinceData(userId, zoneId);
        this.setState({
            provinceList,
        });
    };

    handleSave = async (params) => {
        // const aaaa = this.actionSingleContentRef.current.getSingleContentLists();
        // 过滤器名称及描述校验
        const self = this;
        const { selectOptionsList, filterIdState, teamModelState, currentModuleId: moduleId } = this.state;
        // 修改or 复制表单赋值-名称及描述
        if (!selectOptionsList.length) {
            message.error('请选择维护班组');
            return;
        }

        // if (teamModelState) {
        //     return message.warn('仅支持选择一种班组模式');
        // }
        this.filterFormRef.current.validateFields(['filterName', 'filterDesc', 'moduleId']).then((values) => {
            let { filterInfo } = self.state;
            let { modelType } = self.state;
            let url = 'alarmmodel/filter/v1/filter';
            let method = 'post';
            const { userId } = self.props.login;
            // 过滤器名称及描述赋值
            filterInfo.filterName = values.filterName;
            filterInfo.filterDesc = values.filterDesc;
            filterInfo.filterType = values.moduleId;
            if (
                filterInfo.filterExpr &&
                _.isArray(filterInfo.filterExpr.filterConditionList) &&
                filterInfo.filterExpr.filterConditionList.length === 0
            ) {
                message.error(`请编辑${self.msg}条件`);
                return;
            }
            if (this.props.location?.state?.type === 'ruleBase') {
                modelType = 'new';
                filterInfo.creator = userId;
            }
            if (modelType === 'new') {
                method = 'post';
                url = 'alarmmodel/filter/v1/filter';
            }
            if (modelType === 'copy') {
                method = 'post';
                url = 'alarmmodel/filter/v1/filter/copy';
                filterInfo.creator = userId;
                // 复制时不传modifier、filterId
                filterInfo = _.omit(filterInfo, ['filterId', 'modifier']);
            }
            if (modelType === 'edit') {
                method = 'put';
                url = 'alarmmodel/filter/v1/filter';
                filterInfo.modifier = userId;
                // 修改时不传creator
                filterInfo = _.omit(filterInfo, ['creator']);
            }
            const saveProxy = (info, isSecond, methods) => {
                const singleContentLists = this.actionSingleContentRef.current.getSingleContentLists();
                // 设置派单动作可以派单
                if (filterIdState) {
                    if (!_.isEmpty(singleContentLists)) {
                        let valueFlag = false;
                        for (let i = 0; i < singleContentLists.length; i++) {
                            if (
                                !singleContentLists[i].fieldName ||
                                !singleContentLists[i].fieldLenth ||
                                !singleContentLists[i].fieldType ||
                                !singleContentLists[i].mapClass
                            ) {
                                valueFlag = true;
                                break;
                            }
                            if (singleContentLists[i].fieldLenth > 200000) {
                                valueFlag = 'length';
                                break;
                            }
                            if (singleContentLists[i].mapData.length > singleContentLists[i].fieldLenth) {
                                valueFlag = 'mapData';
                                break;
                            }
                        }
                        if (valueFlag === true) {
                            message.error('派单内容输入项不能为空');
                            return;
                        }
                        if (valueFlag === 'length') {
                            message.error('字段长度不能超过200000');
                            return;
                        }
                        if (valueFlag === 'mapData') {
                            message.error('数据内容超过字段长度限定长度');
                            return;
                        }
                    } else {
                        message.error('派单内容校验不通过/派单内容不能为空');
                        return;
                    }
                }
                const types = {
                    ruleSwitch: 2,
                    ruleType: null,
                };
                if (info.ruleSwitch) {
                    types.ruleSwitch = 1;
                }
                if (info.ruleType) {
                    types.ruleType = info.ruleType;
                }
                const otherParams = this.filterFormRef.current.getFieldsValue();
                const filterParam = {
                    ...info,
                    ...types,
                    filterProfessional: otherParams.filterProfessional?.toString(),
                    filterProvince: otherParams.filterProvince,
                    worksheetConditionVoList: filterIdState
                        ? singleContentLists.map((item) => {
                              return {
                                  ...item,
                                  filterName: values.filterName,
                                  filterId: info.filterId,
                              };
                          })
                        : [],
                    ruleId: modelType === 'new' && this.props?.location?.state?.type === 'ruleBase' ? this.props.location?.state?.row?.ruleId : '',
                    moduleId: +filterInfo.filterType,
                    // filterDispatchProfession: info.filterProperties.find((el) => el.key === 'dispatchProfession').value,
                };

                const newParams = _.omit(filterParam, ['filterType']);
                console.log('这里是提交的数据', newParams);

                if (filterInfo.filterProfessional === 'all') {
                    delete filterInfo.filterProfessional;
                }
                this.setState({
                    okButtonLoading: true,
                });
                request(url, {
                    type: methods ? methods : method,
                    baseUrlType: 'singleContentUrl',
                    showSuccessMessage: false,
                    handlers: {
                        params,
                    },
                    data: {
                        alarmModelFilter: newParams,
                        requestInfo: {
                            clientRequestId: 'nomean',
                            clientToken: localStorage.getItem('access_token'),
                        },
                    },
                })
                    .then((res) => {
                        this.setState({
                            okButtonLoading: false,
                        });

                        if (res.code === 500 && res.message === '复制失败') {
                            message.error('该规则名称已存在，请修改后提交！');
                            return;
                        }
                        message.success('保存成功');
                        // 新增修改过程不调用过滤器接口，改为服务端统一保存
                        // if ((modelType === 'new' || modelType === 'edit') && !isSecond) {
                        //     const { filterProperties } = info;

                        //     const target = filterProperties.find((item) => item.key === 'synchroFilter');
                        //     const synchroFilterValue = this.state.filterInfo?.filterProperties?.find((item) => item.key === 'synchroFilter');
                        //     if (target && target.value && synchroFilterValue?.value !== 'true') {
                        //         info.moduleId = 1;
                        //         info.enable = 1;
                        //         info.filterName = `【派单】${info.filterName}`;
                        //         info.filterDesc = '';
                        //         info.creator = userId;
                        //         info.filterProperties = [
                        //             {
                        //                 key: 'synchro_filter',
                        //                 value: '1',
                        //                 valueDesc: '是否规则自动生成',
                        //             },
                        //             {
                        //                 key: 'max_delay_time_seconds',
                        //                 value: 1,
                        //                 valueDesc: '是否启用',
                        //             },
                        //             {
                        //                 key: 'unit',
                        //                 value: '0',
                        //                 valueDesc: '时延单位 0: 秒  1:分',
                        //             },
                        //         ];
                        //         saveProxy(info, true, 'post');
                        //     }
                        //     // saveSingleContent(res.data);
                        // }

                        if (self.moduleId === 201) {
                            self.props.onSave && self.props.onSave({ ...info, filterId: res.data });
                            return;
                        }
                        storeBySQL.teamInfo = [];
                        this.setState = {
                            selectOptionsList: [],
                        };
                        if (self.props.match.params.callback === 'close-tab') {
                            const { actions, messageTypes } = shareActions;
                            actions &&
                                actions.postMessage &&
                                actions.postMessage(messageTypes.closeTabs, {
                                    entry: `/alarm/setting/filter/${modelType}/${self.props.match.params.moduleId}/${self.props.match.params.id}/list/close-tab`,
                                });
                        } else {
                            if (this.props?.location?.state?.type === 'ruleBase') {
                                this.props?.history.push({ pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/rule-base` });
                            } else {
                                self.props.history.push({
                                    pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/auto-sheet-rule/${self.props.match.params.moduleId}/${self.props.match.params.mode}`,
                                    state: {
                                        reload: true,
                                    },
                                });
                            }
                        }
                        curSelParm.filterId = modelType === 'new' ? res.data : filterInfo.filterId;
                        self.saveFilterMteam(modelType === 'new' ? res.data : modelType === 'copy' ? res.data : filterInfo.filterId);
                        if (self.props.match.params.moduleId === '10') {
                            // moduleId是10的时候保留在当前页面,为了不影响其他的，所以单独加判断，不直接改refresh
                            self.props.pageInfo.setLoadType(modelType === 'new' ? 'refresh' : 'reload');
                            return;
                        }
                        self.props.pageInfo.setLoadType('refresh');
                    })
                    .catch(() => {
                        typeof self?.setState === 'function' &&
                            self?.setState({
                                okButtonLoading: false,
                            });
                    });
            };
            const actionValidAndSave = () => {
                if (self.actionFormRef.current) {
                    self.actionFormRef.current
                        .validateFields()
                        .then((values) => {
                            let action = values;
                            const formatUtil = moduleIdFormatMap[self.props.match.params.moduleId];
                            if (formatUtil) {
                                action = formatUtil(values, moduleId);
                            }
                            filterInfo.filterProperties = action;
                            saveProxy({ ...filterInfo, ruleType: values.ruleType, ruleSwitch: values.ruleSwitch });
                        })
                        .catch(() => {
                            message.error('表单验证失败，请检查整个派单流程');
                        });
                } else {
                    saveProxy(filterInfo);
                }
            };

            if (modelType === 'copy' && (moduleId === '2' || moduleId === '3')) {
                Modal.confirm({
                    title: '',
                    icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                    content: moduleId === '2' ? '复制将新增一条告警级别重定义规则，是否确认复制?' : '复制将新增一条告警类别重定义规则，是否确认复制?',
                    okText: '确认',
                    okButtonProps: { prefixCls: 'oss-ui-btn' },
                    cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                    okType: 'danger',
                    cancelText: '取消',
                    prefixCls: 'oss-ui-modal',
                    onOk: () => {
                        actionValidAndSave();
                    },
                    onCancel() {},
                });
            } else {
                actionValidAndSave();
            }
        });
    };

    handleCancel = () => {
        if (this.props?.location?.state?.type === 'ruleBase') {
            this.props?.history.push({ pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/rule-base` });
        } else {
            storeBySQL.teamInfo = [];
            this.setState = {
                selectOptionsList: [],
            };
            if (this.props.match.params.moduleId === 201) {
                this.props.onCancel();
                return;
            }
            this.props.pageInfo.setLoadType('keepAlive');
            this.props.history.push(
                `/znjk/${constants.CUR_ENVIRONMENT}/unicom/auto-sheet-rule/${this.props.match.params.moduleId}/${this.props.match.params.mode}`,
            );
        }
    };

    onStartUse = (e) => {
        this.setState({
            filterInfo: {
                ...this.state.filterInfo,
                enable: e.target.checked === true ? FILTER_EMUN.ENABLE.TRUE : FILTER_EMUN.ENABLE.FALSE,
            },
        });
    };

    onPrivateChange = (e) => {
        this.setState({
            filterInfo: {
                ...this.state.filterInfo,
                isPrivate: e.target.checked === true ? FILTER_EMUN.ISPRIVATE.TRUE : FILTER_EMUN.ISPRIVATE.FALSE,
            },
        });
    };

    onChangeTreeData = (newTreeData, newLogicalType) => {
        const { filterInfo } = this.state;
        this.setState({
            filterInfo: {
                ...filterInfo,
                filterExpr: { filterConditionList: newTreeData, logicalType: newLogicalType },
            },
        });
    };
    selMaintainTeamInfo = async () => {
        const {
            login: { userId, systemInfo },
        } = this.props;
        const { login } = this.props;
        // let { isCreateCondition } = this.state;

        // const { pagination } = this.state;
        storeBySQL.provinceList = await getProvinceEnum2Maintenance(userId);

        if (storeBySQL.provinceList.length > 0) {
            curSelParm.provinceId = storeBySQL.provinceList[0].id;
        }
        storeBySQL.professional = await getProfessionalEnum2Maintenance(userId);
        if (storeBySQL.professional.length > 0) {
            curSelParm.professionalType = storeBySQL.professional[0].id;
        }
        if (systemInfo?.currentZone?.zoneId) {
            curSelParm.provinceId = parseInt(systemInfo.currentZone.zoneId, 10);
        } else if (this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo)) {
            storeBySQL.provinceList = storeBySQL.provinceList.filter(
                (item) => parseInt(item.id, 10) === parseInt(this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo), 10),
            );

            curSelParm.provinceId = parseInt(this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo), 10);
        } else {
            curSelParm.provinceId = parseInt(this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo), 10);
        }
        this.queryDataList(curSelParm.provinceId, curSelParm.professionalType, '1');
    };

    queryAllDataList = async (provinceId) => {
        const {
            login: { userId },
        } = this.props;
        const { pagination } = this.state;
        const parm2 = { ...pagination, provinceId };
        //规则库查询处理
        if (this.props.match.params?.pageType === 'ruleBase') {
            const result2 = await getMaintainTeamList(parm2, '0');
            storeBySQL.teamInfo2 = result2.data ? result2.data : [];
        } else {
            const result2 = await getMaintainTeamList(parm2, userId);
            storeBySQL.teamInfo2 = result2.data ? result2.data : [];
        }
    };

    queryDataList = async (provinceId, professionalId, mteamModel) => {
        const {
            login: { userId },
        } = this.props;
        const { pagination } = this.state;
        if (professionalId === '') {
            return;
        }
        this.setState({ tableLoading: true });
        const parm = { ...pagination, provinceId, professionalId, mteamModel };
        let result = [];
        if (this.props.match.params?.pageType === 'ruleBase') {
            result = await getMaintainTeamList(parm, '0');
        } else {
            result = await getMaintainTeamList(parm, userId);
        }
        storeBySQL.teamInfo = result.data ? result.data : [];
        if (result.data && Array.isArray(result.data)) {
            result.data.map((item) => {
                if (!storeBySQL.teamInfo2.find((itm) => itm.mteamId === item.mteamId)) {
                    storeBySQL.teamInfo2.push(item);
                }
            });
        }

        if (result.messFlag && result.message) {
            message.error(result.message);
        }
        const paginationNew = { ...pagination, total: result.total };
        this.setState({
            pagination: paginationNew,
            tableLoading: false,
            pronince: {
                provinceId,
                professionalType: professionalId,
            },
        });
    };
    getFilterMteamList = async (filterId) => {
        const { login } = this.props;
        const selectOptionsList = [];
        // 当非新增页面进入，要查询规则id和班组id关系
        const teamResult = await getFilterMteamList(filterId);
        storeBySQL.provinceList = await getProvinceEnum2Maintenance(login.userId);
        storeBySQL.professional = await getProfessionalEnum2Maintenance(login.userId);
        const newProvinceList = [];
        const newList = _.sortBy(teamResult.mteams, (item) => item.orderNum);
        if (newList) {
            for (const item of newList) {
                if (curSelParm.selectedOptionsRows.find((a) => a.mteamId === item.mteamId)) {
                } else {
                    curSelParm.selectedOptionsRows.push({ ...item, neId: item.mteamId, key: item.mteamId });
                }
                if (storeBySQL.provinceList.find((a) => a.id === item.provinceId)) {
                } else {
                    newProvinceList.push({ id: item.provinceId, txt: item.provinceName });
                }
                if (storeBySQL.professional.find((a) => a.id === item.professionalId)) {
                } else {
                    storeBySQL.professional.push({ id: item.professionalId, txt: item.professionalName });
                }
                if (curSelParm.teamIdsBySql.find((a) => a.id === item.mteamId)) {
                } else {
                    curSelParm.teamIdsBySql.push({ id: item.mteamId });
                    if (this.props?.location?.state?.type === 'ruleBase') {
                    } else {
                        selectOptionsList.push(item.mteamId);
                    }
                }
            }

            this.setState({ teamDataRow: _.sortBy(teamResult.mteams, (item) => item.orderNum) });
        }

        const values = this.filterFormRef?.current?.getFieldsValue();

        if (values && values.filterProvince) {
            curSelParm.provinceId = Number(values.filterProvince);
        }
        if (values && values.filterProfessional && values.filterProfessional[0]) {
            curSelParm.professionalType = Number(values.filterProfessional[0]);
        } else if (storeBySQL.professional.length > 0) {
            curSelParm.professionalType = storeBySQL.professional[0].id;
        }

        // this.queryDataList(curSelParm.provinceId, curSelParm.professionalType);
        const {
            login: { userId },
        } = this.props;
        const { pagination } = this.state;
        // this.setState({ tableLoading: true });
        const parm = { ...pagination, provinceId: curSelParm.provinceId, professionalId: curSelParm.professionalType };
        let result = [];
        if (this.props.match.params?.pageType === 'ruleBase') {
            result = await getMaintainTeamList(parm, '0');
        } else {
            if (this.openSourcePage === 'fault-scheduling-notification') {
                parm.checkDataPower = 0;
            }
            result = await getMaintainTeamList(parm, userId);
        }
        if (result.messFlag && result.message) {
            message.error(result.message);
        }
        storeBySQL.teamInfo = result.data ? result.data : [];
        const paginationNew = { ...pagination, total: result.total };
        this.setState({ pagination: paginationNew, tableLoading: false, selectOptionsList });
    };
    saveFilterMteam = async (filterId) => {
        const { modelType } = this.state;
        // 非新增的时候先删除，在创建
        if (modelType !== 'new') {
            const delParm = { filterId };
            await saveFilterMteam(delParm);
        }
        const { selectOptionsList } = this.state;
        curSelParm.teamIdsBySql = selectOptionsList.map((item) => ({
            id: item,
        }));
        const addParm = { filterId, mteams: curSelParm.teamIdsBySql };
        saveFilterMteam(addParm);
    };
    onPageChange = async (page, pageSize) => {
        const {
            login: { userId },
        } = this.props;
        const { pagination } = this.state;
        const paginationNew = { ...pagination, current: page, pageSize };
        const parm = { current: page, pageSize, ...curSelParm };
        const result = await getMaintainTeamList(parm, userId);
        if (result.messFlag && result.message) {
            message.error(result.message);
        }
        storeBySQL.teamInfo = result.data;
        paginationNew.total = result.total;
        this.setState({ pagination: paginationNew, tableLoading: false });
    };

    onTableTransferChange = (selectRowKeys, selectRows, type) => {
        const { selectOptionsList } = this.state;
        const handleKeyList = produce(selectOptionsList, (draft) => {
            selectRows.forEach((item) => {
                if (draft.includes(item.neId) && type !== 'drag') {
                    _.pull(draft, item.neId);
                } else {
                    draft.push(item.neId);
                }
            });
        });
        console.log(handleKeyList);
        const handleRowList = produce(curSelParm.selectedOptionsRows, (draft) => {
            selectRows.forEach((item) => {
                if (_.find(draft, { neId: item.neId }) && type !== 'drag') {
                    _.pull(draft, _.find(draft, { neId: item.neId }));
                } else {
                    draft.push(item);
                }
            });
        });
        this.setState({ selectOptionsList: handleKeyList });
        curSelParm.selectedOptionsRows = handleRowList;
        // setSelectOptionsList(handleKeyList);
        // setSelectedOptionsRows(handleRowList);
    };

    dragChange = (data) => {
        if (data.length) {
            this.setState({
                selectOptionsList: data.map((item) => item.neId),
            });
        }
    };

    backClick = (value) => {
        const { filterInfoFormCache } = this.state;
        if (value === 1) {
            this.setState({ stepsValue: 0 });
        }
        if (value === 2) {
            const self = this;
            this.actionFormRef.current.validateFields().then((values) => {
                self.setState({ actionInfoFormCache: values });
                if (filterInfoFormCache && !_.isEmpty(filterInfoFormCache)) {
                    self.filterFormRef?.current.setFieldsValue({ ...filterInfoFormCache });
                }
                self.setState({ stepsValue: 1 });
            });
        }
        if (value === 3) {
            const self = this;
            this.filterFormRef.current.validateFields().then((values) => {
                self.setState({ filterInfoFormCache: values });
                self.setState({ stepsValue: 2 });
            });
        }
    };

    nextClick = (value) => {
        const { selectOptionsList, teamModelState } = this.state;
        // 修改or 复制表单赋值-名称及描述
        if (value === 1) {
            if (!selectOptionsList.length) {
                return message.warn('请选择维护班组');
            }
            // if (teamModelState) {
            //     return message.warn('仅支持选择一种班组模式');
            // }
            this.setState({ stepsValue: 2 });
            this.getFilterInfos();
        }
        if (value === 0) {
            const self = this;
            this.filterFormRef.current.validateFields().then((values) => {
                self.setState({ filterInfoFormCache: values });
                const { filterInfo } = self.state;
                if (
                    filterInfo.filterExpr &&
                    _.isArray(filterInfo.filterExpr.filterConditionList) &&
                    filterInfo.filterExpr.filterConditionList.length === 0
                ) {
                    message.error(`请编辑${self.msg}条件`);
                    return;
                }

                // if(modelType === 'new'){
                //默认类型传1-值班
                this.queryDataList(Number(values.filterProvince), Number(values.filterProfessional[0]), '1');
                // }

                self.setState({ stepsValue: 1 });
            });
        }
        if (value === 2) {
            this.setState({ stepsValue: 3 });
        }
    };
    get newModuleId() {
        return this.getModuleId();
    }
    getFilterInfos = () => {
        const { filterInfo, modelType } = this.state;
        // const teamIds = []; // 去掉重复添加的班组id
        const conditionList = [];
        if (modelType !== 'new') {
            // teamIds = selectOptionsList.filter((val) => {
            //     return curSelParm.teamIdsBySql.every((n) => n.mteamId !== val);
            // });
            for (const condit of filterInfo.filterExpr.filterConditionList) {
                if (condit.conditionId) {
                    conditionList.push({ ...condit });
                }
            }
            // conditionList = filterInfo.filterExpr.filterConditionList;
        }
        // const promiseList = [];

        // curSelParm.selectedOptionsRows.forEach((item) => {
        //     // 非新增状态下，班组重复不在添加
        //     if (!teamIds.includes(item.mteamId) && modelType !== 'new') {
        //         return;
        //     }
        //     promiseList.push(
        //         getFilterInfo({
        //             modelId: modeTeamlId,
        //             moduleId: moduleTeamId,
        //             filterId: item.relatedRuleId
        //         })
        //     );
        // });
        // Promise.all(promiseList).then((res) => {
        //     console.log(123);
        //     res.forEach((item, index) => {
        //         const { mteamName } = curSelParm.selectedOptionsRows[index];
        //         item?.filterExpr.filterConditionList.forEach((condit) => {
        //             const con = _.omit(condit, ['conditionId']);
        //             conditionList.push({ ...con, conditionLabel: `${mteamName}-${condit.conditionLabel}` });
        //         });
        //     });
        //     this.setState({
        //         filterInfo: {
        //             ...filterInfo,
        //             filterExpr: { filterConditionList: conditionList, logicalType: conditionList.length > 1 ? 'or' : null }
        //         }
        //     });
        // });
    };

    stepsChange = (value) => {
        this.setState({
            stepsValue: value,
        });
    };

    getInitialProvince = (province, userInfo) => {
        const info = userInfo && JSON.parse(userInfo);
        let initialProvince = info.zones[0]?.zoneId;
        if (province) {
            return (initialProvince = province);
        }
        if (info.zones[0]?.zoneLevel === '3') {
            initialProvince = info.zones[0]?.parentZoneId;
        }
        return initialProvince;
    };
    getAuthKey = (modelType) => {
        // const {
        //     match: {
        //         params: { moduleId },
        //     },
        // } = this.props;
        // switch (moduleId) {
        //     case '604':
        //         return authKeysCrh[modelType];
        //     case '605':
        //         return authKeysSuper[modelType];
        //     default:
        //     }
        return authKeys[modelType];
    };
    renderOkButton = () => {
        const { filterInfo, okButtonLoading, modelType, filterIdState } = this.state;
        const { enable } = filterInfo;

        const authKey = this.getAuthKey(modelType);

        return (
            <AuthButton
                addLog={true}
                authKey={authKey}
                loading={okButtonLoading}
                type="primary"
                onClick={(params) => {
                    const singleContentLists = this.actionSingleContentRef.current.getSingleContentLists();
                    // 主送人校验
                    const fieldCnNameAgentMan = singleContentLists.find((el) => el.fieldName === 'agentManId');
                    // 抄送人校验
                    const fieldCnNameCopyMan = singleContentLists.find((el) => el.fieldName === 'copyManId');
                    // 短信发送人校验
                    const fieldCnNameSmsToUserMan = singleContentLists.find((el) => el.fieldName === 'smsToUserId');
                    let valueFlag = false;
                    //设置派单动作可以派单
                    if (filterIdState) {
                        if (!_.isEmpty(singleContentLists)) {
                            for (let i = 0; i < singleContentLists.length; i++) {
                                if (!singleContentLists[i].mapData) {
                                    valueFlag = true;
                                    break;
                                }
                                if (fieldCnNameAgentMan.mapData === '|') {
                                    valueFlag = true;
                                    break;
                                }
                                if (fieldCnNameCopyMan?.mapData === '|') {
                                    valueFlag = true;
                                    break;
                                }
                                if (fieldCnNameSmsToUserMan?.mapData === '|') {
                                    valueFlag = true;
                                    break;
                                }
                            }
                        } else {
                            message.error('派单内容校验不通过/派单内容不能为空');
                            return;
                        }
                    }

                    if (enable === 1) {
                        Modal.confirm({
                            title: '提示',
                            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                            content: '该派单规则为启用状态，是否确认保存？',
                            okText: '确认',
                            okButtonProps: { prefixCls: 'oss-ui-btn' },
                            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                            okType: 'danger',
                            cancelText: '取消',
                            prefixCls: 'oss-ui-modal',
                            onOk: () => {
                                if (valueFlag) {
                                    Modal.confirm({
                                        title: '提示',
                                        icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                                        content: '设置的派单内容中，数据内容存在空值，是否确定保存？',
                                        okText: '确认',
                                        okButtonProps: { prefixCls: 'oss-ui-btn' },
                                        cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                                        okType: 'danger',
                                        cancelText: '取消',
                                        prefixCls: 'oss-ui-modal',
                                        onOk: () => {
                                            this.handleSave(params);
                                        },
                                        onCancel() {},
                                    });
                                } else {
                                    this.handleSave(params);
                                }
                            },
                            onCancel() {},
                        });
                    } else {
                        console.log(valueFlag);
                        if (valueFlag) {
                            Modal.confirm({
                                title: '提示',
                                icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                                content: '设置的派单内容中，数据内容存在空值，是否确定保存？',
                                okText: '确认',
                                okButtonProps: { prefixCls: 'oss-ui-btn' },
                                cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                                okType: 'danger',
                                cancelText: '取消',
                                prefixCls: 'oss-ui-modal',
                                onOk: () => {
                                    this.handleSave(params);
                                },
                                onCancel() {},
                            });
                        } else {
                            this.handleSave(params);
                        }
                    }
                }}
            >
                保存
            </AuthButton>
        );
    };
    mteamModelStateChange = (teamModelState) => {
        this.setState({
            teamModelState,
        });
    };
    filterIdStateChange = (filterIdState, filterTypeFlag) => {
        this.setState({
            filterIdState,
            filterTypeFlag,
        });
    };

    getModuleId = () => {
        const { moduleId } = this.props.match.params;
        const id = this.state.currentModuleId;
        // const moduleIdEnum = [10, 604, 605];
        // const moduleIdEnum = [];
        const moduleIdObj = filterTypeOptions.find((item) => {
            return +item.value === +moduleId;
        });
        if (moduleIdObj) {
            return id ?? moduleId;
        }

        // if (moduleIdEnum.includes(+moduleId)) {
        //     return id ?? moduleId;
        // }
        return moduleId;
    };

    onLeftSelRowsChange = (leftSelRows) => {
        this.setState({
            leftSelRows,
        });
    };
    onRightSelRowsChange = (rightSelRows) => {
        this.setState({
            rightSelRows,
        });
    };

    render() {
        const {
            filterInfo,
            modelType,
            stepsValue,
            actionInfoFormCache,
            selectOptionsList,
            pagination,
            tableLoading,
            singleContentdata,
            pronince,
            teamDataRow,
            provinceList,
            teamModelState,
            filterIdState,
            filterTypeFlag,
            currentModuleId,
            leftSelRows,
            rightSelRows,
        } = this.state;
        const { match, login } = this.props;
        // const { moduleId } = match.params;
        const moduleId = this.getModuleId();
        const TypeContent = moduleIdEditContentMap[moduleId];

        // const treeHeight = !hasActionIds.includes(match.params.moduleId) ? `${window.innerHeight - 490}px` : `${window.innerHeight - 425}px`;
        const treeHeight = `${window.innerHeight - 325}px`;

        const title = { new: '新建', edit: '编辑', copy: '拷贝' };

        const layout = {
            labelCol: {
                span: 6,
            },
        };

        const mode = this.isCheck ? 'read' : 'edit';

        // 需要置顶的条件项
        const topFieldNames = 'org_type,network_type_top,province_id,professional_type,alarm_title';
        const theme = this.props.login.systemInfo?.theme;
        return (
            <PageContainer
                gridContentStyle={{ height: `calc(100% - 51px)` }}
                title={
                    <div className="volume-title" style={{ display: this.isCheck ? 'none' : '' }}>
                        <span className="volume-form-box" />
                        <span>{title[`${modelType}`]}</span>
                    </div>
                }
            >
                <Layout style={{ height: '100%' }}>
                    <Header style={{ height: 'auto', backgroundColor: 'transparent' }}>
                        <Steps current={stepsValue} onChange={this.stepsChange}>
                            <Step title="设置派单条件" disabled={modelType === 'new' ? !this.isCheck : false} />
                            <Step title="选择维护班组" disabled={modelType === 'new' ? !this.isCheck : false} />
                            <Step title="设置派单动作" disabled={modelType === 'new' ? !this.isCheck : false} />
                            {/* 先并入605，后续<是否派单>值会影响时再修改 */}
                            {filterIdState && <Step title="设置派单内容" disabled={modelType === 'new' ? !this.isCheck : false} />}
                        </Steps>
                    </Header>
                    <Content style={{ height: '100%', overflow: 'auto', background: theme === 'light' ? 'white' : '' }}>
                        <Card
                            className="auto-sheet-card"
                            bodyStyle={{ height: '100%' }}
                            style={{ height: '100%', display: stepsValue === 1 ? 'block' : 'none', borderBottom: 'none' }}
                        >
                            <TableTransfer
                                leftColumns={maintainTeamColumns}
                                rightColumns={maintainTeamColumnsRight}
                                dataSource={storeBySQL.teamInfo}
                                onTransChange={this.onTableTransferChange}
                                mteamModelStateChange={this.mteamModelStateChange}
                                dragChange={this.dragChange}
                                targetKeys={selectOptionsList}
                                totalDataRow={teamDataRow}
                                totalDataSource={curSelParm.selectedOptionsRows}
                                provincesDic={storeBySQL.provinceList}
                                firstprofessionsDataDic={storeBySQL.professional}
                                queryDataList={this.queryDataList}
                                tablePagination={pagination}
                                onPageChange={this.onPageChange}
                                tableLoading={tableLoading}
                                curSelParm={curSelParm}
                                pronince={pronince}
                                titles={
                                    ['待选班组列表', '已选班组列表']
                                    // teamModelState
                                    //     ? [
                                    //           '待选班组列表',
                                    //           <span>
                                    //               <span style={{ color: 'red' }}>仅支持选择一种班组模式</span> <span>已选班组列表</span>
                                    //           </span>,
                                    //       ]
                                    //     : ['待选班组列表', '已选班组列表']
                                }
                                listStyle={{
                                    width: '350px',
                                }}
                                disabled={this.isCheck}
                                leftSelRows={leftSelRows}
                                rightSelRows={rightSelRows}
                                onLeftSelRowsChange={this.onLeftSelRowsChange}
                                onRightSelRowsChange={this.onRightSelRowsChange}
                            />
                        </Card>
                        <Card
                            className="auto-sheet-condition-card"
                            bodyStyle={{ height: '100%' }}
                            style={{ height: '100%', display: stepsValue === 0 ? 'block' : 'none', borderBottom: 'none' }}
                        >
                            <Form {...layout} ref={this.filterFormRef} style={{ height: '100%' }}>
                                <Row className="auto-sheet-condition-row">
                                    <Col span={2} />
                                    <Col span={8} style={{ paddingTop: '5%' }}>
                                        <Form.Item
                                            label={moduleId === '1' ? '过滤器名称' : '规则名称'}
                                            name="filterName"
                                            rules={[
                                                { required: true, message: '不可为空' },
                                                { pattern: formatReg.noEmpety, message: '不可为空格' },
                                                { pattern: formatReg.noSpecialSymbol, message: '规则名称不可存在特殊符号' },
                                                {
                                                    max: 64,
                                                    type: 'string',
                                                    // message: '总长度不能超过64位（1汉字=2位）',
                                                    message: '总长度不能超过64位',
                                                },
                                            ]}
                                        >
                                            <Field
                                                mode={mode}
                                                renderFormItem={() => {
                                                    return <Input allowClear />;
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item label="创建人">
                                            <Field
                                                mode={mode}
                                                render={() => {
                                                    return modelType === 'new' ? this.props.login.userName : filterInfo.creator;
                                                }}
                                                renderFormItem={() => {
                                                    return (
                                                        <Input
                                                            disabled
                                                            value={modelType === 'new' ? this.props.login.userName : filterInfo.creator}
                                                        />
                                                    );
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="规则类型"
                                            name="moduleId"
                                            rules={[{ required: true, message: '不可为空' }]}
                                            initialValue={this.state.currentModuleId}
                                        >
                                            <Field
                                                mode={this.isCheck ? 'read' : 'edit'}
                                                render={() => {
                                                    const moduleName = filterTypeOptions.find((item) => +item.value === filterInfo.moduleId)?.label;
                                                    return moduleName || '-';
                                                }}
                                                renderFormItem={() => {
                                                    return (
                                                        <Select
                                                            options={filterTypeOptions}
                                                            value={this.state.currentModuleId}
                                                            onChange={(value) => {
                                                                let newSingleData = JSON.parse(JSON.stringify(singleContentdata));

                                                                if (+value === 605) {
                                                                    this.tempSmsFiled = singleContentdata;
                                                                    newSingleData = singleContentdata.filter((item) => {
                                                                        return item.fieldName !== 'smsToUserId';
                                                                    });
                                                                }
                                                                if (+value !== 605 && this.tempSmsFiled.length > newSingleData.length) {
                                                                    newSingleData = this.tempSmsFiled;
                                                                }

                                                                this.setState({ currentModuleId: value, singleContentdata: newSingleData });
                                                                this.conditionEditRef.current?.clearTreeData();
                                                                this.filterFormRef.current?.setFieldsValue({ moduleId: value });
                                                            }}
                                                        />
                                                    );
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item label={'归属省份'} name="filterProvince" rules={[{ required: true, message: '不可为空' }]}>
                                            <Field
                                                mode={this.isCheck ? 'read' : 'edit'}
                                                render={() => {
                                                    return filterInfo.filterProvinceLabel || '-';
                                                }}
                                                renderFormItem={() => {
                                                    return (
                                                        <Select disabled={this.props.location.state?.type === 'ruleBase' ? true : false}>
                                                            {this.props.location.state?.type === 'ruleBase'
                                                                ? provinceList.map((item) => {
                                                                      return (
                                                                          <Select.Option
                                                                              value={item.regionId}
                                                                              key={item.regionId}
                                                                              label={item.regionName}
                                                                          >
                                                                              {item.regionName}
                                                                          </Select.Option>
                                                                      );
                                                                  })
                                                                : provinceList
                                                                      .filter(
                                                                          (items) =>
                                                                              items.regionId ===
                                                                              this.getInitialProvince(
                                                                                  login.systemInfo?.currentZone?.zoneId,
                                                                                  login.userInfo,
                                                                              ),
                                                                      )
                                                                      .map((item) => {
                                                                          return (
                                                                              <Select.Option
                                                                                  value={item.regionId}
                                                                                  key={item.regionId}
                                                                                  label={item.regionName}
                                                                              >
                                                                                  {item.regionName}
                                                                              </Select.Option>
                                                                          );
                                                                      })}
                                                        </Select>
                                                    );
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item label={'归属专业'} name="filterProfessional" rules={[{ required: true, message: '不可为空' }]}>
                                            <Field
                                                mode={this.isCheck ? 'read' : 'edit'}
                                                render={() => {
                                                    return filterInfo.filterProfessionalLabel || '-';
                                                }}
                                                renderFormItem={(item, { fieldProps }) => {
                                                    return (
                                                        <SelectCondition
                                                            {...fieldProps}
                                                            form={this.filterFormRef?.current}
                                                            mode="multiple"
                                                            title={'归属专业'}
                                                            id="key"
                                                            label="value"
                                                            dictName={'professional_type'}
                                                            searchName={'filterProfessional'}
                                                        />
                                                    );
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="描述"
                                            name="filterDesc"
                                            rules={[
                                                { pattern: formatReg.noEmpety, message: '不可为空格' },
                                                {
                                                    max: 200,
                                                    type: 'string',
                                                    message: '总长度不能超过200位（1汉字=2位）',
                                                },
                                            ]}
                                        >
                                            <Field
                                                mode={mode}
                                                renderFormItem={() => {
                                                    return <Input.TextArea autoSize={{ minRows: 6, maxRows: 10 }} allowClear />;
                                                }}
                                            />
                                        </Form.Item>
                                        <Row>
                                            <Col span={6} />
                                            <Col span={18}>
                                                <Field
                                                    mode={mode}
                                                    render={() => {
                                                        return Number(filterInfo.enable) === FILTER_EMUN.ENABLE.TRUE ? '启用' : '未启用';
                                                    }}
                                                    renderFormItem={() => {
                                                        return (
                                                            <Checkbox
                                                                checked={Number(filterInfo.enable) === FILTER_EMUN.ENABLE.TRUE}
                                                                onChange={this.onStartUse}
                                                            >
                                                                是否启用
                                                            </Checkbox>
                                                        );
                                                    }}
                                                />

                                                {showPrivateFields.includes(match.params.moduleId) && (
                                                    <>
                                                        {mode === 'read' ? '，' : null}
                                                        <Field
                                                            mode={mode}
                                                            render={() => {
                                                                return filterInfo.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE ? '私有' : '非私有';
                                                            }}
                                                            renderFormItem={() => {
                                                                return (
                                                                    <Checkbox
                                                                        disabled={this.isCheck}
                                                                        checked={filterInfo.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE}
                                                                        onChange={this.onPrivateChange}
                                                                    >
                                                                        是否私有
                                                                    </Checkbox>
                                                                );
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={2} />
                                    <Col span={12} style={{ height: '100%', paddingTop: '2%' }}>
                                        <Form.Item className="condition-form-item" style={{ marginBottom: 0 }} labelCol={{ span: 3 }}>
                                            <ConditionEdit
                                                moduleId={+currentModuleId}
                                                treeHeight={treeHeight}
                                                treeData={filterInfo.filterExpr.filterConditionList}
                                                FILTER_EMUN={FILTER_EMUN}
                                                onChange={this.onChangeTreeData}
                                                disabled={this.isCheck}
                                                defaultFilterConditionList={defaultFilterConditionList(
                                                    login,
                                                    provinceList ? provinceList[0]?.regionName : '',
                                                    +currentModuleId,
                                                )}
                                                ref={this.conditionEditRef}
                                                topFieldNames={topFieldNames}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                        <Card
                            bordered={false}
                            bodyStyle={{ height: '100%' }}
                            style={{ display: stepsValue === 2 ? 'block' : 'none', borderBottom: 'none' }}
                        >
                            <TypeContent
                                login={this.props.login}
                                initialValues={filterInfo}
                                ref={this.actionFormRef}
                                filterIdStateChange={this.filterIdStateChange}
                                actionInfoFormCache={actionInfoFormCache}
                                modelType={modelType}
                                moduleId={this.newModuleId}
                                disabled={this.isCheck}
                                provinceId={this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo)}
                                getDispatchSpecialized={(specialized) => {
                                    this.actionSingleContentRef.current.getThreeSpecialized(specialized);
                                }}
                            />
                        </Card>
                        <Card
                            bodyStyle={{ height: '100%' }}
                            style={{ height: '100%', display: stepsValue === 3 ? 'block' : 'none', borderBottom: 'none' }}
                        >
                            <SingleContent
                                disabled={this.isCheck}
                                ref={this.actionSingleContentRef}
                                modelType={filterTypeFlag ? 'new' : modelType}
                                moduleId={+this.newModuleId}
                                filterTypeFlag={filterTypeFlag}
                                singleContentdata={singleContentdata}
                                dispatchSpecialized={this.state.dispatchSpecialized}
                            />
                        </Card>
                    </Content>
                    <Footer style={{ backgroundColor: 'transparent', textAlign: 'center', display: this.isCheck ? 'none' : '' }}>
                        <Space>
                            {stepsValue !== 0 && (
                                <Button type="primary" onClick={this.backClick.bind(this, stepsValue)}>
                                    上一步
                                </Button>
                            )}
                            {(stepsValue === 0 || stepsValue === 1 || (stepsValue === 2 && filterIdState)) && (
                                <Button type="primary" onClick={this.nextClick.bind(this, stepsValue)}>
                                    下一步
                                </Button>
                            )}
                            {(stepsValue === 3 || (stepsValue === 2 && !filterIdState)) && this.renderOkButton()}
                            <Button onClick={this.handleCancel}>取消</Button>
                            {/* <Button
                                onClick={() => {
                                    console.log(singleContentdata);
                                }}
                            >
                                测试按钮
                            </Button> */}
                        </Space>
                    </Footer>
                </Layout>
            </PageContainer>
        );
    }
}

export default withModel([useLoginInfoModel, usePageInfo], (shareInfo) => ({
    login: shareInfo[0],
    pageInfo: shareInfo[1],
}))(Index);
