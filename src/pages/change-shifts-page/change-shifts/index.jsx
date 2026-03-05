import React, { createRef } from 'react';
import { Button, Modal, Icon, message, Space, Spin, Select } from 'oss-ui';
import { withModel } from 'hox';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';
import { openFrameworkRouteFn } from '@Src/hooks';
import NewAuthButton from '@Pages/components/auth/auth-button';
import constants from '@Src/common/constants';
import './index.less';
import urlSearch from '@Common/utils/urlSearch';
import GlobalMessage from '@Src/common/global-message';
import { logNew } from '@Common/api/service/log';
import TimelineEdit from '@Pages/components/timeline-edit';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import zoneLevel from '@Common/enum/zoneLevel';
import { DndDropdown } from '@Pages/components';
import _isEmpty from 'lodash/isEmpty';
import { sendLogFn } from '@Pages/components/auth/utils';
import EvaluateModal from '../../record-duty/evaluateModal';
import CommonWrapper from './components/common-wrapper';
import ContentTemplate from './components/content-template';
import api from '../api';
import { dynamicModulesMap } from './constants';
import { formatDynamicModules } from './utils';
import ShiftInformationModal from './components/Shift-Information-modal';
import MenuEntry from './menu-entry';
import { ReactComponent as RefreshSvg } from './img/u25.svg';
import GroupUserItem from './components/group-user-item';

class ChangeShifts extends React.PureComponent {
    workRecordsRef = createRef();
    pageContainerRef = createRef();
    importanceInformsRef = createRef();
    wrapperRef = createRef();
    handLeaveOverKeysCache = new Map();
    operIdCache = '';
    isDragging = false;
    scrollAnchorThreshold = [];
    getScrollAnchorThresholdTimer = null;
    clickCurAnchorModuleNaviLock = false;
    modifyDutyInfosTemp = new Map();
    bindActiveChangeEventFlag = false;

    constructor(props) {
        super(props);

        const { type, schedulingObj } = this.initTypeAndSchedulingObj();
        this.state = {
            type, // 类型1-交班，2-接班,3-值班记录查看
            operation: 'readonly', // 操作 readonly-查询，editable-修改
            schedulingObj, // 班组信息 // { isDuty: 1是当班班组，2是接班班组，0是非当班/接班班组 }
            isEvaluateModal: false,
            evaluateModalParams: {},
            evaluateEditable: false, // 未增加权限临时使用字段 true代表值班评价可编辑,false代表不可以  传入EvaluateModal组件
            refreshFlag: false,
            // 班组下模块列表
            allShowModules: [],
            // 班组下动态展示模块列表
            dynamicModules: [],
            // 班组下当前展示模块列表 / 同一模块不同专业为一个
            dynamicModulesMergePro: [],
            visible: false,
            loading: true,
            provinceData: [],
            showMenuEntry: false,
            isExpanded: false,
            curAnchorModuleId: undefined,
            contentTemplateModalVisible: false,
            editingFlag: false,
        };
        this.timer = null;
    }

    componentDidMount() {
        this.pageContainerRef.current.addEventListener('scroll', this.handleScrollEventThrottle);
        this.getDataInfo();
        this.timer = setInterval(() => {
            this.getDataInfo();
        }, 1000 * 60 * 3);
    }
    componentDidUpdate(prevProps, prevStates) {
        const { editingFlag } = this.state;
        if (this.props.refreshFlag !== prevProps.refreshFlag) {
            if (this.props.refreshFlag) {
                // 值班记录旁的刷新按钮更新班组信息
                this.getDataInfo();
            }
        }
        if (prevStates.editingFlag !== editingFlag) {
            if (editingFlag) {
                clearInterval(this.timer);
            } else {
                this.timer = setInterval(() => {
                    this.getDataInfo();
                }, 1000 * 60 * 3);
            }
        }
    }

    componentWillUnmount() {
        this.pageContainerRef.current.removeEventListener('scroll', this.handleScrollEventThrottle);
        GlobalMessage.off('activeChanged', this.tabActiveChangeHandle);
        clearInterval(this.getScrollAnchorThresholdTimer);
        clearInterval(this.timer);
    }

    initTypeAndSchedulingObj = () => {
        const { type: typeProps, schedulingObj: schedulingObjProps } = this.props;

        const { srcString } = useLoginInfoModel.data;
        const urlData = urlSearch(srcString);
        const { typeUrl, dateTime, isDuty, workShiftId, groupId } = urlData;

        this.operIdCache = urlData.operId || '';

        let type;
        let schedulingObj;

        if (typeProps !== undefined) {
            type = typeProps;
            schedulingObj = schedulingObjProps;
        } else if (typeUrl) {
            type = typeUrl;
            schedulingObj = {
                dateTime: dateTime || '',
                isDuty: isDuty || '',
                workShiftId: workShiftId || '',
                groupId: groupId || '',
            };
        }

        return {
            type,
            schedulingObj,
        };
    };

    getSelectedModuleByGroup = (data) => {
        api.getSelectedModuleByGroup(data).then((res) => {
            const dynamicModules = formatDynamicModules(res);
            const dynamicModulesMergePro = res.filter((item) => item.checked);

            this.setState({
                allShowModules: res,
                dynamicModules,
                dynamicModulesMergePro,
                showMenuEntry: true,
            });
            this.startCalcOffset(() => {
                let defaultAnchorModuleId;

                if (dynamicModulesMergePro.some((item) => item.moduleId === this.state.curAnchorModuleId)) {
                    defaultAnchorModuleId = this.state.curAnchorModuleId;
                } else {
                    defaultAnchorModuleId = dynamicModulesMergePro[0]?.moduleId;
                }
                this.handleCurAnchorModule(defaultAnchorModuleId);
            });

            if (!this.bindActiveChangeEventFlag) {
                this.bindActiveChangeEventFlag = true;
                GlobalMessage.on('activeChanged', null, this.tabActiveChangeHandle);
            }
        });
    };

    getDataInfo = async () => {
        const {
            login: { userId },
            isLog,
        } = this.props;
        const { schedulingObj, type } = this.state;
        const { groupId, workShiftId, dateTime } = schedulingObj || {};

        const data = {
            userId,
            groupId,
            workShiftId: isLog ? workShiftId : null,
            dateTime: isLog ? dateTime : null,
            // dutyStatus: type === ShiftChangeTypeEnum.MemberNonSchedule ? ShiftChangeTypeEnum.Takeover : type,
            // takeOrHandGroupId: type === ShiftChangeTypeEnum.MemberNonSchedule ? '' : this.props.schedulingObj?.groupId,
        };
        if (!groupId) {
            const result = await api.queryShiftingOfDutyNow(data);
            this.setState(
                {
                    schedulingObj: {
                        ...result?.resultObj,
                        groupId: result?.resultObj?.groupList[0].groupId,
                    },
                },
                () => {
                    return this.getDataInfo();
                },
            );
        }

        const result = await api.queryShiftingOfDutyNow(data);
        const provinceData = await api.getProvinceData(userId);

        const { resultObj = {} } = result || {};

        this.clickCurAnchorModuleNaviLock = true;
        this.setState(
            {
                schedulingObj: resultObj,
                refreshFlag: true,
                loading: false,
                provinceData,
                type: this.props.type === ShiftChangeTypeEnum.DutyRecords ? ShiftChangeTypeEnum.DutyRecords : String(resultObj.isDuty),
                operation: String(resultObj.isDuty) === ShiftChangeTypeEnum.Handover && resultObj.isDuty === 1 && !isLog ? 'editable' : 'readonly',
            },
            () => {
                this.getSelectedModuleByGroup({ groupId: this.state.schedulingObj?.groupId });
            },
        );
    };

    startCalcOffset = (fn) => {
        setTimeout(() => {
            this.getScrollAnchorThreshold();
            fn?.();
        }, 1000);
    };
    // 定时获取各模块偏移量
    getScrollAnchorThreshold = () => {
        clearInterval(this.getScrollAnchorThresholdTimer);

        this.getAnchorThreshold();

        this.getScrollAnchorThresholdTimer = setInterval(() => {
            this.getAnchorThreshold();
        }, 30 * 1000);
    };

    handleScrollEvent = (event) => {
        const { scrollTop } = event.target;
        // 当前滚动在哪个模块范围内
        const index = this.scrollAnchorThreshold.findIndex((item) => item[1] > scrollTop);

        if (this.clickCurAnchorModuleNaviLock) {
            return;
        }

        this.setState({
            curAnchorModuleId: this.scrollAnchorThreshold[index - 1]?.[0],
        });
    };

    handleScrollEventThrottle = (event) => {
        _.throttle(this.handleScrollEvent, 500)(event);
    };

    tabActiveChangeHandle = ({ isActive }) => {
        if (isActive) {
            this.setState({
                showMenuEntry: true,
            });
            setTimeout(() => {
                this.getAnchorThreshold();

                this.handleCurAnchorModule(this.state.curAnchorModuleId);
            });
        } else {
            this.setState({
                showMenuEntry: false,
            });
        }
    };

    getAnchorThreshold = () => {
        const moduleIds = new Set([]);

        this.scrollAnchorThreshold = Array.from(document.querySelectorAll('.change-shifts-common-wrapper')).reduce((accu, item) => {
            const { moduleid } = item.dataset;

            if (moduleIds.has(moduleid)) {
                return accu;
            }

            return [...accu, [Number(moduleid), item.offsetTop]];
        }, []);
    };

    // 保存当班记录信息
    saveChangeShifts = async (modifyScope) => {
        const { schedulingObj } = this.state;
        const {
            login: { userId },
        } = this.props;
        const { majorFaultSituation, reinsuranceSituation, securityEventRecord, networkCutoverSituation, other, remainingProblems } =
            schedulingObj || {};
        const data = {
            userId,
            dateTime: schedulingObj?.dateTime,
            shiftDutyId: schedulingObj?.workShiftId,
            groupId: schedulingObj?.groupId,
            modifyScope,
            contentId: schedulingObj?.contentId,
            majorFaultSituation,
            reinsuranceSituation,
            securityEventRecord,
            networkCutoverSituation,
            other,
            remainingProblems,
        };
        if (modifyScope === null) {
            Array.from(this.modifyDutyInfosTemp.values()).forEach((item) => {
                const key = Object.keys(item);
                data[key] = item[key];
            });
        } else {
            Object.assign(data, { ...this.modifyDutyInfosTemp.get(modifyScope) });
        }
        // 校验是否可保存值班信息
        const checkResult = await this.saveItemInfoCheck();

        if (!checkResult) {
            return { code: 500 };
        }

        const result = await api.saveDutyMessage(data);

        if (result) {
            if (result.resultCode === '200') {
                if (modifyScope !== null) {
                    message.success('保存成功!');
                }
                this.getDataInfo();
                return { code: 200 };
            }
            if (result.resultCode === '500' && result.resultMsg === '已有人完成交班，不能再更新当班记录') {
                if (modifyScope !== null) {
                    message.warning(result.resultMsg, 4, this.returnChangeShifts);
                    return { code: 500 };
                }
                return { code: 500, message: result.resultMsg };
            }
            if (result.resultCode === '500') {
                this.props.history.push({
                    pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/change-shifts-page/abnormal-page`,
                    state: { type: result.resultCode, message: result.resultMsg },
                });
                return { code: 500 };
            }
        }
    };

    delData = async (contentId, modifyScope) => {
        const {
            login: { userId },
        } = this.props;
        const { schedulingObj } = this.state;
        const data = {
            userId,
            dateTime: schedulingObj?.dateTime, // 本班次对应的开始时间
            shiftDutyId: schedulingObj?.workShiftId, // 班次ID
            contentId,
            modifyScope,
        };
        const result = await api.deleteDutyMessage(data);

        if (result) {
            if (result.resultCode === '200') {
                message.success('删除成功!');
                this.getDataInfo();
            } else if (result.resultCode === '500' && result.resultMsg === '已有人完成交班，不能再更新当班记录') {
                message.warning(result.resultMsg, 4, this.returnChangeShifts);
            } else if (result.resultCode === '500') {
                this.props.history.push({
                    pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/change-shifts-page/abnormal-page`,
                    state: { type: '9', message: result.resultMsg },
                });
            }
        }
    };

    // 返回交接班页面
    returnChangeShifts = () => {
        this.setState(
            {
                operation: 'readonly',
            },
            this.getDataInfo,
        );
    };

    // 交班信息提交
    saveHand = async () => {
        // 打开连续交接班弹窗
        this.setState({
            visible: true,
        });
    };

    // 新增工作记录
    addNewWorkRecordOrInform = (type) => {
        this[type === 'inform' ? 'importanceInformsRef' : 'workRecordsRef'].current.addNew();
    };

    // 刷新工作记录
    refreshNewWorkRecordOrInform = (type) => {
        const isEditing = this[type === 'inform' ? 'importanceInformsRef' : 'workRecordsRef'].current.judgeIsEditing();

        if (isEditing) {
            Modal.confirm({
                title: '提示',
                content: '页面存在未保存的数据，刷新后会丢失，是否继续刷新？',
                okText: '确认',
                cancelText: '取消',
                okType: 'danger',
                onOk: () => {
                    this[type === 'inform' ? 'importanceInformsRef' : 'workRecordsRef'].current.clearEmptyData();
                    this.setState(
                        {
                            loading: true,
                        },
                        this.getDataInfo,
                    );
                },
            });
        } else {
            this.setState(
                {
                    loading: true,
                },
                this.getDataInfo,
            );
        }
    };

    // #region 顶部按钮点击事件

    judgeMenuPermission = (operName) => {
        const {
            parsedUserInfo: { operations },
        } = useLoginInfoModel.data;

        return operations.some((item) => item.operName === operName);
    };

    onCallTestRecordClick = () => {
        const { operation } = this.state;
        sendLogFn({ authKey: 'workbench-Workbench-CallTestingRecord-Button' });
        console.log('维护作业计划search', { edit: operation === 'editable' });

        openFrameworkRouteFn({
            history: this.props.history,
            url: `/call-test-record`,
            search: { edit: operation === 'editable' },
        });
    };

    onLastWorkSummaryClick = () => {
        const { schedulingObj, operation } = this.state;
        const { dateTime, groupId, workShiftId } = schedulingObj || {};

        openFrameworkRouteFn({
            history: this.props.history,
            url: `/change-shifts-page/previous-duty-summary`,
            search: { groupId, dateTime, workShiftId, edit: operation === 'editable' },
        });
    };

    onNMSAlarmMonitoringClick = () => {
        sendLogFn({ authKey: 'workbench-Workbench-NMS-AlarmMonitoring-Button' });

        const { schedulingObj, operation } = this.state;
        const provinceId = schedulingObj?.provinceId;

        const dateTime = moment(schedulingObj?.dateTime).format('YYYY-MM-DD 00:00:00');
        const groupId = schedulingObj?.groupId;

        openFrameworkRouteFn({
            history: this.props.history,
            url: `/network-management-system-alarm-monitoring`,
            search: { provinceId, groupId, dateTime, edit: operation === 'editable' },
        });
    };
    onModulesFaultManagementClick = () => {
        const { schedulingObj, operation } = this.state;
        const { dateTime, groupId, workShiftId, professionalTypes } = schedulingObj || {};
        const ifIntel = professionalTypes.length === 1 && Number(professionalTypes[0]) === 9999;
        sendLogFn({ authKey: 'home-modules-fault-management' });
        openFrameworkRouteFn({
            history: this.props.history,
            url: `/modules-fault-management${ifIntel ? '/intel' : ''}`,
            search: { groupId, dateTime, workShiftId, edit: operation === 'editable' },
        });
    };
    onNetworkCutoverClick = () => {
        const { schedulingObj, operation } = this.state;
        const { dateTime, groupId, workShiftId, professionalTypes } = schedulingObj || {};
        const ifIntel = professionalTypes.length === 1 && Number(professionalTypes[0]) === 9999;
        sendLogFn({ authKey: 'home-network-cutover' });
        openFrameworkRouteFn({
            history: this.props.history,
            url: `/network-cutover${ifIntel ? '/internet' : ''}`,
            search: { groupId, dateTime, workShiftId, edit: operation === 'editable' },
        });
    };

    onCutExecutionRecordClick = () => {
        const { schedulingObj, operation } = this.state;

        const provinceId = schedulingObj?.provinceId;

        openFrameworkRouteFn({
            history: this.props.history,
            url: `/cutting-execution-record`,
            search: { provinceId, edit: operation === 'editable' },
        });
    };

    onMaintainJobClick = () => {
        sendLogFn({ authKey: 'workbench-Workbench-MaintenanceOperationPlan-Button' });
        const { operation, schedulingObj, type } = this.state;

        const groupId = schedulingObj?.groupId || '';
        const provinceId = schedulingObj?.provinceId || '';
        const workingPlanId = schedulingObj?.workingPlanId || '';
        const workShiftId = schedulingObj?.workShiftId || '';
        const dateTime = schedulingObj?.dateTime || '';
        const edit = operation === 'editable';

        // let dateTime = '';
        // if (type === ShiftChangeTypeEnum.DutyRecords) {
        //     dateTime = schedulingObj?.dateTime;
        // }
        console.log('维护作业计划search', { groupId, edit, provinceId, workingPlanId, dateTime, workShiftId });
        openFrameworkRouteFn({
            history: this.props.history,
            url: `/setting/views/maintain-job`,
            search: { groupId, edit, provinceId, workingPlanId, dateTime, workShiftId },
        });
    };
    // #endregion

    // #region 交接班
    handover = async () => {
        sendLogFn({ authKey: 'changeShiftsSetting:Shiftchange' });

        Modal.confirm({
            title: '提示',
            content: '是否确认交班？',
            okText: '确认',
            cancelText: '取消',
            okType: 'danger',
            onOk: async () => {
                logNew('交接班', this.operIdCache || '300047');

                const {
                    login: { userId },
                } = this.props;
                const { schedulingObj, type } = this.state;
                const { groupId, nextWorkShiftId, lastDateTime, lastWorkShiftId, workShiftId, takeOrHandDateTime } = schedulingObj || {};
                const data = {
                    userId,
                    dateTime: takeOrHandDateTime,
                    groupId,
                    workShiftId,
                    nextWorkShiftId,
                    lastDateTime,
                    lastWorkShiftId,
                };

                // if (type === ShiftChangeTypeEnum.NeedClockOff) {
                //     this.punchCard('hand');

                //     return;
                // }

                const result = await api.checkHandSubmit(data);

                if (result) {
                    const { resultCode, resultMsg } = result;

                    switch (resultCode) {
                        case '200':
                            this.setVisible(true);
                            break;
                        case ShiftChangeTypeEnum.NeedClockOff:
                            this.punchCard('hand');
                            break;
                        case '201':
                        case '400':
                        case '401':
                            this.takeOrHandPrompt(resultCode, resultMsg, () => {
                                this.setVisible(true);
                            });
                            break;
                        default:
                            message.warning(resultMsg);
                            break;
                    }
                }
            },
        });
    };

    // 点击接班
    takeover = async () => {
        sendLogFn({ authKey: 'changeShiftsSetting:Shiftchange' });

        const {
            login: { userId },
        } = this.props;
        const { type, schedulingObj } = this.state;
        const { groupId, nextWorkShiftId, lastDateTime, lastWorkShiftId, takeOrHandWorkShiftId, takeOrHandDateTime } = schedulingObj || {};

        const data = {
            userId,
            dateTime: takeOrHandDateTime,
            groupId,
            workShiftId: takeOrHandWorkShiftId,
            nextWorkShiftId,
            lastDateTime,
            lastWorkShiftId,
        };

        const self = this;
        function errorHandle(result, cb) {
            if (result) {
                const { resultCode, resultMsg } = result;
                switch (resultCode) {
                    case '200':
                        cb();
                        break;
                    case ShiftChangeTypeEnum.NeedClockOn:
                        self.punchCard('take');
                        break;
                    case '201':
                    case '400':
                    case '401':
                        self.takeOrHandPrompt(resultCode, resultMsg, self.saveTake);
                        break;
                    default:
                        message.warning(resultMsg);
                        break;
                }
            }
        }

        if (schedulingObj?.isDuty === 0) {
            const result = await api.checkTakeSubmit(data);

            errorHandle(result, () => {
                Modal.confirm({
                    title: '提示',
                    content: '是否确认在未提前排班的情况下直接接班？',
                    okText: '确认',
                    cancelText: '取消',
                    okType: 'danger',
                    onOk: async () => {
                        const results = await api.checkTakeSubmit(data);
                        errorHandle(results, this.saveTake);
                    },
                });
            });

            return;
        }
        Modal.confirm({
            title: '提示',
            content: '是否确认接班？',
            okText: '确认',
            cancelText: '取消',
            okType: 'danger',
            onOk: async () => {
                logNew('交接班', this.operIdCache || '300047');

                // if (type === ShiftChangeTypeEnum.NeedClockOn) {
                //     this.punchCard('take');
                // } else {
                const result = await api.checkTakeSubmit(data);
                errorHandle(result, this.saveTake);
                // }
            },
        });
    };

    takeOrHandPrompt = (code, messgae, successCb) => {
        Modal.confirm({
            title: '提示',
            content: messgae,
            okButtonProps: code === '201' ? { prefixCls: 'oss-ui-btn' } : { prefixCls: 'oss-ui-btn', style: { display: 'none' } },
            okText: '确认',
            cancelText: '取消',
            okType: 'danger',
            onOk: () => {
                if (code === '201') {
                    successCb();
                }
            },
            onCancel: () => {
                if (code === '401' || code === '400') {
                    this.props.reload?.();
                }
            },
        });
    };

    // 接班信息提交
    saveTake = async () => {
        const {
            login: { userId },
        } = this.props;
        const { schedulingObj } = this.state;
        const { groupId, nextWorkShiftId, lastDateTime, lastWorkShiftId, takeOrHandWorkShiftId, takeOrHandDateTime } = schedulingObj || {};
        const data = {
            userId,
            dateTime: takeOrHandDateTime,
            groupId,
            workShiftId: takeOrHandWorkShiftId,
            nextWorkShiftId,
            lastDateTime,
            lastWorkShiftId,
        };
        const result = await api.shiftingOfDutyTakeOver(data);
        if (result && result.resultCode === '200') {
            this.props.history.push({ pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/change-shifts-page/abnormal-page`, state: { type: '7' } });
        } else {
            message.warning(result.resultMsg);
        }
    };

    // 交接班打卡
    punchCard = (type) => {
        const {
            login: { userId },
        } = this.props;
        const { schedulingObj } = this.state;
        const { groupId, workShiftId, takeOrHandWorkShiftId, takeOrHandDateTime } = schedulingObj || {};

        api.handOrTakePunchCard({
            groupId,
            workShiftId: type === 'hand' ? workShiftId : takeOrHandWorkShiftId,
            dutyDate: takeOrHandDateTime,
            userId,
            punchCardType: type,
        }).then((result) => {
            if (result && result.resultCode === '200') {
                this.props.history.push({
                    pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/change-shifts-page/abnormal-page`,
                    state: { type: type === 'hand' ? '6' : '7' },
                });
            }
        });
    };
    // #endregion 交接班

    recordDutyEvaluate = () => {
        const { userInfo } = useLoginInfoModel.data;
        const { operationsButton = [] } = JSON.parse(userInfo);

        const evaluateKey = 'recordDutySetting:evaluate';
        const hasAuth = !_isEmpty(operationsButton) && operationsButton.find((item) => item.key === evaluateKey);
        let edit = false;
        const { groupId, workShiftId, dateTime, isLeader } = this.state.schedulingObj || {};
        sendLogFn({ authKey: evaluateKey });
        if (hasAuth || isLeader) {
            // 有按钮权限或者是班组组长，值班评价允许编辑
            edit = true;
        }
        this.setState({
            isEvaluateModal: true,
            evaluateModalParams: {
                groupId,
                workShiftId,
                workDate: dateTime,
            },
            evaluateEditable: edit, // 未增加权限临时使用字段 true代表值班评价可编辑,false代表不可以  传入EvaluateModal组件
        });
    };

    cancelEvaluate = () => {
        this.setState({
            isEvaluateModal: false,
        });
    };

    /**
     * 检查按钮是否显示
     * 必须是集团用户，当班人员，并且专业是professionalType
     * @returns
     */
    checkButtonDisabled = (judgeProfessionalTypes) => {
        const {
            login: { userInfo },
        } = this.props;

        const { schedulingObj } = this.state;

        const info = userInfo && JSON.parse(userInfo);

        if (
            info?.zones[0]?.zoneLevel === zoneLevel.company &&
            judgeProfessionalTypes.some((item) => schedulingObj?.professionalTypes?.includes(item))
        ) {
            return true;
        }
        return false;
    };

    handleDynamicSortSave = (data) => {
        this.setState({
            dynamicModules: formatDynamicModules(data),
            dynamicModulesMergePro: data.filter((item) => item.checked),
        });

        this.startCalcOffset();
    };

    saveItemInfoCb = (modifyScope, fieldName, value) => {
        this.modifyDutyInfosTemp.set(modifyScope, { [fieldName]: value });

        this.saveChangeShifts(modifyScope);
    };

    allRemainSwitchClick = async (bool) => {
        const { schedulingObj } = this.state;
        const {
            login: { userId },
        } = this.props;
        const { majorFaultSituation, reinsuranceSituation, securityEventRecord, networkCutoverSituation, other, remainingProblems } =
            schedulingObj || {};

        this.modifyDutyInfosTemp.set('record', { dutyRecords: schedulingObj?.dutyRecords.map((item) => ({ ...item, remainFlag: Number(bool) })) });

        const data = {
            userId,
            dateTime: schedulingObj?.dateTime,
            shiftDutyId: schedulingObj?.workShiftId,
            groupId: schedulingObj?.groupId,
            modifyScope: 'record',
            contentId: schedulingObj?.contentId,
            majorFaultSituation,
            reinsuranceSituation,
            securityEventRecord,
            networkCutoverSituation,
            other,
            remainingProblems,
        };

        Object.assign(data, { ...this.modifyDutyInfosTemp.get('record') });

        // 校验是否可保存值班信息
        const checkResult = await this.saveItemInfoCheck();

        if (!checkResult) {
            return;
        }

        const result = await api.saveDutyMessage(data);

        if (result) {
            if (result.resultCode === '200') {
                message.success(`工作记录${bool ? '一键' : '取消'}遗留操作成功`);

                this.getDataInfo();
            } else if (result.resultCode === '500' && result.resultMsg === '已有人完成交班，不能再更新当班记录') {
                message.warning(result.resultMsg, 4, this.returnChangeShifts);
            } else if (result.resultCode === '500') {
                this.props.history.push({
                    pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/change-shifts-page/abnormal-page`,
                    state: { type: result.resultCode, message: result.resultMsg },
                });
            }
        }
    };

    onSelectedKeysChange = (moduleId, currentProfessional, selectedKeys) => {
        let key;

        this.handLeaveOverKeysCache.forEach((value, itemKey) => {
            if (itemKey.moduleId === moduleId && String(itemKey.professional) === String(currentProfessional?.value)) {
                key = itemKey;
            }
        });

        this.handLeaveOverKeysCache.set(key ?? { moduleId, professional: String(currentProfessional?.value) }, selectedKeys);
    };

    sheetStay = async () => {
        const {
            login: { userName, userId },
        } = this.props;
        const { schedulingObj } = this.state;

        const leaveContentsMap = new Map();

        this.handLeaveOverKeysCache.forEach((value, keyObj) => {
            const { moduleId } = keyObj;

            const oldValue = leaveContentsMap.get(moduleId);
            const uValue = _.uniq([...(oldValue || []), ...value]);
            leaveContentsMap.set(moduleId, oldValue ? uValue : value);
        });

        const allList = await this.requestNetworkFault();
        let allList1 = { data: [] };
        if (schedulingObj?.provinceId !== '0') {
            allList1 = await this.requestNetworkFault(1);
        }
        const leaveData = allList.data.filter((item) => item.isRemain === 1).map((item) => item.summaryId);
        const leaveData1 = allList1.data.filter((item) => item.isRemain === 1).map((item) => item.summaryId);
        const leaveContents = [];

        leaveContentsMap.forEach((value, key) => {
            if (key === 1) {
                leaveContents.push({ [key]: [...leaveData, ...leaveData1] });
            } else {
                leaveContents.push({ [key]: value });
            }
        });

        const sheetParam = {
            userId,
            creatorUser: userName,
            groupId: schedulingObj?.groupId, // 组ID
            workShiftId: schedulingObj?.workShiftId,
            dateTime: schedulingObj?.dateTime, // 本班次对应的开始时间
            dutyBeginTime: schedulingObj.workBeginTime,
            dutyEndTime: schedulingObj.workEndTime,
            leaveType: '1', // 网络故障工单遗留
            leaveContents,
        };

        return api.sheetStay(sheetParam);
    };
    requestNetworkFault = async (showJT) => {
        const {
            login: { userId },
        } = this.props;
        const { schedulingObj } = this.state;
        const { groupId, workShiftId, dateTime, provinceId, professionalTypes } = schedulingObj || {};
        if (!professionalTypes) {
            return {};
        }
        const data = {
            userId,
            teamId: groupId,
            groupId,
            areaId: provinceId,
            provinceId,
            pageSize: 10000,
            pageNum: 1,
            workShiftId,
            dateTime,
            specialty: professionalTypes,
            specialtys: professionalTypes,
            showJT,
        };

        const result = await api.getTaskDetail(data);
        result.data = (result.data || []).map((e) => {
            return { ...e, key: e.summaryId };
        });

        return result;
    };
    setVisible = (visible) => {
        this.setState({
            visible,
        });
    };

    onGroupChange = (groupId) => {
        const { schedulingObj } = this.state;
        const newSchedulingObj = schedulingObj?.groupList?.find((item) => String(item.groupId) === String(groupId));

        this.setState(
            {
                refreshFlag: false,
                loading: true,
                // eslint-disable-next-line
                schedulingObj: newSchedulingObj,
            },
            this.getDataInfo,
        );
    };

    saveItemInfoCheck = async () => {
        const { schedulingObj } = this.state;
        const {
            login: { userId },
        } = this.props;

        const data = {
            userId,
            dateTime: schedulingObj?.dateTime,
            shiftDutyId: schedulingObj?.workShiftId,
            groupId: schedulingObj?.groupId,
        };

        // 校验是否可保存值班信息
        const checkResult = await api.checkSaveDutyMessage(data);

        if (!(checkResult?.resultCode === '200')) {
            this.setState({
                refreshFlag: false,
            });
            message.warning(checkResult?.resultMsg, 4, this.returnChangeShifts);
            return false;
        }

        return true;
    };

    handleCurAnchorModule = (moduleId) => {
        const clickItem = this.scrollAnchorThreshold.find((item) => item[0] === moduleId);

        if (clickItem) {
            this.pageContainerRef.current?.scrollTo(0, clickItem[1]);
        }

        this.setState({
            curAnchorModuleId: moduleId,
        });

        this.clickCurAnchorModuleNaviLock = true;
        setTimeout(() => {
            this.clickCurAnchorModuleNaviLock = false;
        }, 400);
    };

    onUpload = async (file) => {
        const { schedulingObj } = this.state;
        const {
            login: { userId },
        } = this.props;

        const formData = new FormData();
        formData.append('files', file);
        formData.append('userId', userId);
        formData.append('workShiftId', schedulingObj?.workShiftId);
        formData.append('dateTime ', schedulingObj?.dateTime);

        const res = await api.uploudFile(formData);

        if (res.resultCode === '200') {
            message.success('上传附件成功');
            const lastIndex = res.resultObj.filePath.lastIndexOf('/');
            return {
                url: res.resultObj.filePath.substring(0, lastIndex),
                fileName: res.resultObj.fileName,
                operationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            };
        }

        message.error('上传失败');

        return Promise.reject(new Error('上传失败'));
    };

    onDeleteFile = async (data) => {
        const filePath = `${data.url}/${data.fileName}`;

        const res = await api.deleteFile({ filePath });

        if (res.resultCode === '200') {
            return undefined;
        }
        message.warning('删除附件失败！');

        return Promise.reject(new Error('删除失败'));
    };

    onDownload = async (data) => {
        const filePath = `${data.url}/${data.fileName}`;

        const res = await api.downloadFile({ filePath });

        const blob = new Blob([res]);
        // 兼容不同浏览器的URL对象
        const url = window.URL || window.webkitURL || window.moxURL;
        // 创建下载链接
        const downloadHref = url.createObjectURL(blob);
        // 创建a标签并为其添加属性
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadHref;
        downloadLink.download = data.fileName;
        // 触发点击事件执行下载
        downloadLink.click();

        return undefined;
    };

    handleExpandedChange = () => {
        this.setState((prev) => ({ isExpanded: !prev.isExpanded }));
    };

    exportDutyContentInfo = async (type) => {
        // 1表示重要通知，2表示工作记录
        const typeMap = {
            1: '重要通知',
            2: '工作记录',
        };

        const { schedulingObj } = this.state;
        const params = {
            groupId: schedulingObj.groupId,
            workShiftId: schedulingObj.workShiftId,
            dateTime: schedulingObj.dateTime,
            contentType: type,
        };

        const res = await api.exportDutyRecord(params);
        const blob = new Blob([res]);
        // 兼容不同浏览器的URL对象
        const url = window.URL || window.webkitURL || window.moxURL;
        // 创建下载链接
        const downloadHref = url.createObjectURL(blob);
        // 创建a标签并为其添加属性
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadHref;
        downloadLink.download = `${typeMap[type]}导出${moment().format('YYYYMMDDHHmmss')}.xlsx`;
        // 触发点击事件执行下载
        downloadLink.click();
    };
    onTimelineEdit = (stateType) => {
        if (stateType === 'focus') {
            this.setState({ editingFlag: true });
        }
        if (stateType === 'blur') {
            this.setState({ editingFlag: false });
        }
    };
    oneKeySave = async () => {
        const resultList = [];

        // 需要取出Map所有值;
        this.wrapperRef.current.push(this.workRecordsRef.current);
        this.wrapperRef.current.push(this.importanceInformsRef.current);
        this.wrapperRef.current.forEach((item) => {
            if (item?.upDateMap) {
                const { modifyScope, fieldName, value } = item?.upDateMap();
                this.modifyDutyInfosTemp.set(modifyScope, { [fieldName]: value });
            }
            if (item?.wrapperSave) {
                item?.wrapperSave().then((res) => {
                    resultList.push(res);
                });
            }
        });
        const res = await this.saveChangeShifts(null);
        const result = [...resultList, res].find((el) => {
            return el.code !== 200;
        });
        if (result && result.message) {
            message.error(result.message);
        } else {
            message.success('保存成功');
        }
    };
    onRefreshClick = () => {
        this.getDataInfo();
    };

    checkHandSubmit = async () => {
        const {
            login: { userId },
        } = this.props;
        const { schedulingObj } = this.state;
        const { groupId, nextWorkShiftId, lastDateTime, lastWorkShiftId, workShiftId, takeOrHandDateTime } = schedulingObj || {};
        const data = {
            userId,
            dateTime: takeOrHandDateTime,
            groupId,
            workShiftId,
            nextWorkShiftId,
            lastDateTime,
            lastWorkShiftId,
        };

        const result = await api.checkHandSubmit(data);

        if (result) {
            const { resultCode, resultMsg } = result;

            switch (resultCode) {
                case '200':
                    return true;
                case '400':
                    message.warning(resultMsg);
                    this.props.reload?.();
                    return false;
                default:
                    message.warning(resultMsg);
                    return false;
            }
        }
        return false;
    };

    render() {
        const {
            operation,
            type,
            schedulingObj,
            allShowModules,
            dynamicModules,
            refreshFlag,
            visible,
            loading,
            provinceData,
            dynamicModulesMergePro,
            showMenuEntry,
            isExpanded,
            curAnchorModuleId,
            contentTemplateModalVisible,
        } = this.state;
        this.wrapperRef.current = [];
        const { login, history, handleSwitchUser } = this.props;
        const { systemInfo } = login;

        const showHandoverButton = ['1', '1001'].includes(type);
        const showTakeoverButton = ['2', '1002'].includes(type);
        return (
            <div className="change-shifts-container duty-record-background">
                {showMenuEntry && (
                    <MenuEntry
                        dynamicModulesMergePro={dynamicModulesMergePro}
                        onClickModule={this.handleCurAnchorModule}
                        initPosition={{ right: '16px', top: '8px' }}
                        schedulingObj={schedulingObj}
                        history={history}
                        operation={operation}
                        checkButtonDisabledFn={this.checkButtonDisabled}
                        curAnchorModuleId={curAnchorModuleId}
                        isExpanded={isExpanded}
                        handleExpandedChange={this.handleExpandedChange}
                    />
                )}
                <div className="change-shifts-header">
                    <span>值班记录</span>
                    <Icon
                        antdIcon
                        type="SyncOutlined"
                        onClick={() => this.getDataInfo()}
                        style={{ color: 'rgb(206, 204, 204)', cursor: 'pointer', marginLeft: 10 }}
                    />
                </div>
                <Spin spinning={loading}>
                    <div ref={this.pageContainerRef} className="change-shifts-scroll-container">
                        {visible && (
                            <ShiftInformationModal
                                visible={visible}
                                setVisible={this.setVisible}
                                defaultData={{
                                    ...schedulingObj,
                                    ...login,
                                }}
                                handleSwitchUser={handleSwitchUser}
                                sheetStay={this.sheetStay} // 遗留工单统一调用接口
                                checkHandSubmit={this.checkHandSubmit}
                            />
                        )}
                        <CommonWrapper
                            moduleId={27}
                            title="基本信息"
                            titleSuffix={
                                // schedulingObj?.professionalTypes?.length > 0 && (
                                //     <DndDropdown
                                //         fixedTop={2}
                                //         fixedBottom={2}
                                //         data={allShowModules}
                                //         placement="bottomLeft"
                                //         onSave={this.handleDynamicSortSave}
                                //         onVisibleChange={(open) => {
                                //             if (open) {
                                //                 sendLogFn({ authKey: 'workbench-Workbench-Shift-Module-Manage' });
                                //             }
                                //         }}
                                //         triggerEl={
                                //             <Button
                                //                 icon={<Icon antdIcon type="SettingOutlined" />}
                                //                 style={{ color: 'rgb(201, 208, 219)', marginLeft: '5px' }}
                                //                 type="text"
                                //                 disabled={schedulingObj?.isDuty === 0}
                                //             />
                                //         }
                                //     />
                                // )
                                null
                            }
                        >
                            <div className="base-info-content-container">
                                <div className="left">
                                    <div className="show-item">
                                        <div className="show-item-label">班组：</div>
                                        <div className="show-item-content">
                                            <Select
                                                disabled={type === ShiftChangeTypeEnum.DutyRecords}
                                                size="small"
                                                value={schedulingObj?.groupId ? String(schedulingObj?.groupId) : '无班次'}
                                                style={{ width: '100%' }}
                                                options={schedulingObj?.groupList?.map((item) => {
                                                    return {
                                                        label: item.groupName,
                                                        value: String(item.groupId),
                                                    };
                                                })}
                                                showSearch
                                                optionFilterProp="label"
                                                onChange={this.onGroupChange}
                                                getPopupContainer={(el) => el.parentNode}
                                            />
                                        </div>
                                    </div>
                                    <div className="show-item">
                                        <div className="show-item-label">时间：</div>
                                        <div className="show-item-content">
                                            {schedulingObj?.workBeginTime || ''}-{schedulingObj?.workEndTime || ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="center">
                                    <div className="show-item">
                                        <div className="show-item-label">本班次：</div>
                                        <div className="show-item-content">
                                            {(schedulingObj?.workShiftUsersName || []).map((item, index) => {
                                                const itemInfo = {
                                                    userId: schedulingObj?.workShiftUsersId?.[index],
                                                    userName: item,
                                                };
                                                return (
                                                    <GroupUserItem
                                                        data={itemInfo}
                                                        style={{
                                                            color: 'rgb(62, 174, 255)',
                                                            backgroundColor: 'rgb(236, 244, 252)',
                                                        }}
                                                        refreshFlag={this.props.refreshFlag}
                                                        key={itemInfo.userId}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="show-item">
                                        <div className="show-item-label">下班次：</div>
                                        <div className="show-item-content">
                                            {(schedulingObj?.nextWorkShiftUsersName || []).map((item, index) => {
                                                const itemInfo = {
                                                    userId: schedulingObj?.nextWorkShiftUsersId?.[index],
                                                    userName: item,
                                                };
                                                return (
                                                    <GroupUserItem
                                                        data={itemInfo}
                                                        style={{
                                                            color: 'rgb(232, 91, 29)',
                                                            backgroundColor: 'rgb(252, 242, 236)',
                                                        }}
                                                        refreshFlag={this.props.refreshFlag}
                                                        key={itemInfo.userId}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="right">
                                    {/* 9996 这个枚举值是业务平台专业   85 这个枚举值是传输网专业 */}
                                    {this.judgeMenuPermission('拨测记录') && this.checkButtonDisabled([85, 9996]) && (
                                        <Button type="primary" onClick={this.onCallTestRecordClick}>
                                            拨测记录
                                        </Button>
                                    )}
                                    {/* 3 这个枚举值是传输网专业 */}
                                    {this.judgeMenuPermission('割接执行记录') && this.checkButtonDisabled([3]) && (
                                        <NewAuthButton
                                            type="primary"
                                            onClick={this.onCutExecutionRecordClick}
                                            authKey="workbench-Workbench-Shift-CutExecutionRecord"
                                            ignoreAuth
                                        >
                                            割接执行记录
                                        </NewAuthButton>
                                    )}
                                    {/* 1 这个枚举值是核心网专业 */}
                                    {this.judgeMenuPermission('网管系统告警监测') && this.checkButtonDisabled([1]) && (
                                        <Button type="primary" onClick={this.onNMSAlarmMonitoringClick}>
                                            网管系统告警监测
                                        </Button>
                                    )}
                                    {/* 9999 这个枚举值是互联网专业 */}
                                    {this.judgeMenuPermission('网络故障管理') && this.checkButtonDisabled([9999]) && (
                                        <Button type="primary" onClick={this.onModulesFaultManagementClick}>
                                            网络故障管理
                                        </Button>
                                    )}
                                    {/* 9999 这个枚举值是互联网专业 */}
                                    {this.judgeMenuPermission('网络割接管理') && this.checkButtonDisabled([9999]) && (
                                        <Button type="primary" onClick={this.onNetworkCutoverClick}>
                                            网络割接管理
                                        </Button>
                                    )}
                                    {this.judgeMenuPermission('上班次总结') && schedulingObj?.groupId && (
                                        <NewAuthButton
                                            type="primary"
                                            ignoreAuth
                                            authKey="workbench-Workbench-components-Handover-Job-Summary-Button"
                                            onClick={this.onLastWorkSummaryClick}
                                        >
                                            上班次总结
                                        </NewAuthButton>
                                    )}
                                    {this.judgeMenuPermission('维护作业计划') && schedulingObj?.groupId && (
                                        <Button type="primary" onClick={this.onMaintainJobClick}>
                                            维护作业计划
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CommonWrapper>

                        {Object.values(dynamicModules).map((item, index) => {
                            const Component = dynamicModulesMap[item.moduleId];

                            return (
                                <Component
                                    key={item.uniqueId}
                                    {...item}
                                    ref={(el) => {
                                        this.wrapperRef.current[index] = el;
                                    }}
                                    pageType={type}
                                    provinceData={provinceData}
                                    pattern={operation}
                                    schedulingObj={schedulingObj || {}}
                                    refreshFlag={refreshFlag}
                                    history={history}
                                    loginInfo={login}
                                    onSelectedKeysChange={(keys) => this.onSelectedKeysChange(item.moduleId, item.currentProfessional, keys)}
                                    saveItemInfoCb={this.saveItemInfoCb}
                                    saveItemInfoCheck={this.saveItemInfoCheck}
                                    refreshDutyInfo={this.getDataInfo}
                                    delRecordOrInformData={this.delData}
                                    allRemainSwitchClick={this.allRemainSwitchClick}
                                />
                            );
                        })}
                        <div style={{ height: 75 }} />
                        <div className={systemInfo.theme === 'light' ? 'operation-continer' : 'operation-continer-drakblue'}>
                            {/* 当班状态才会显示。当班但是切换到非当班班组时是禁用状态 */}
                            {schedulingObj?.groupName === '集团-总值班' && operation !== 'readonly' ? (
                                <Button type="primary" onClick={() => this.oneKeySave()} style={{ fontSize: '14px', lineHeight: '18px' }}>
                                    一键保存
                                </Button>
                            ) : null}

                            {showHandoverButton && !this.props.isLog && (
                                <Button
                                    disabled={schedulingObj?.isDuty === 0}
                                    type="primary"
                                    style={{ fontSize: '14px', lineHeight: '18px' }}
                                    onClick={() => {
                                        this.handover();
                                    }}
                                >
                                    交班
                                </Button>
                            )}
                            {/* 显示逻辑: 待接班状态 此时如果班组不是待接班的班组则按钮禁用 */}
                            {showTakeoverButton && !this.props.isLog && (
                                <Button
                                    style={{ fontSize: '14px', lineHeight: '18px' }}
                                    disabled={!schedulingObj?.groupId || schedulingObj?.isDuty === 0}
                                    type="primary"
                                    onClick={this.takeover}
                                >
                                    接班
                                </Button>
                            )}
                            {/* 显示逻辑: 在班组中但是不在排班成员中 */}
                            {type === ShiftChangeTypeEnum.MemberNonSchedule && !this.props.isLog && (
                                <NewAuthButton
                                    style={{ fontSize: '14px', lineHeight: '18px' }}
                                    type="primary"
                                    disabled={!schedulingObj?.groupId}
                                    onClick={this.takeover}
                                    authKey="changeShiftsSetting:takeover"
                                    unauthorizedDisplayMode="disabled"
                                >
                                    我要接班
                                </NewAuthButton>
                            )}
                            {(type === ShiftChangeTypeEnum.DutyRecords || this.props.isLog) && (
                                <Space>
                                    <Button
                                        style={{ fontSize: '14px', lineHeight: '18px' }}
                                        type="primary"
                                        onClick={() => {
                                            this.recordDutyEvaluate();
                                        }}
                                    >
                                        值班评价
                                    </Button>
                                </Space>
                            )}
                        </div>
                        {this.state.isEvaluateModal && (
                            <EvaluateModal
                                userId={this.props.login.userId}
                                sourceTableParams={this.state.evaluateModalParams}
                                isEvaluateModalOpen={this.state.isEvaluateModal}
                                handleCancel={this.cancelEvaluate}
                                editable={this.state.evaluateEditable}
                            />
                        )}
                        <Modal
                            title="工作记录模板管理"
                            visible={contentTemplateModalVisible}
                            onCancel={() => this.setState({ contentTemplateModalVisible: false })}
                            footer={null}
                            width={832}
                            destroyOnClose
                        >
                            <ContentTemplate onClose={() => this.setState({ contentTemplateModalVisible: false })} groupId={schedulingObj?.groupId} />
                        </Modal>
                    </div>
                </Spin>
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(ChangeShifts);
