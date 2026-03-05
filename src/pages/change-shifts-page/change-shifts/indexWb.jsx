import React, { createRef } from 'react';
import { Button, Icon, message, Space, Select, Modal } from 'oss-ui';
import { withModel } from 'hox';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useLoginInfoModel from '@Src/hox';
import { _ } from 'oss-web-toolkits';
import { useHistory } from 'react-router-dom';
import { openFrameworkRouteFn } from '@Src/hooks';
import { logNew } from '@Common/api/service/log';
import TimelineEdit from '@Pages/components/timeline-edit';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import zoneLevel from '@Common/enum/zoneLevel';
import { DndDropdown } from '@Pages/components';
import GlobalMessage from '@Src/common/global-message';
import moment from 'moment';
import _isEmpty from 'lodash/isEmpty';
import { sendLogFn } from '@Pages/components/auth/utils';
import NewAuthButton from '@Pages/components/auth/auth-button';
import constants from '@Src/common/constants';
import EvaluateModal from '../../record-duty/evaluateModal';
import DoChange from './do-change';
import api from '../api';
import CommonWrapper from './components/common-wrapper';
import { dynamicModulesMap } from './constants';
import { formatDynamicModules } from './utils';
import MenuEntry from './menu-entry';
import { ReactComponent as RefreshSvg } from './img/u25.svg';
import GroupUserItem from './components/group-user-item';
import ContentTemplate from './components/content-template';
import './index.less';

class ChangeShifts extends React.PureComponent {
    pageContainerRef = createRef();
    workRecordsRef = createRef();
    importanceInformsRef = createRef();
    handLeaveOverKeysCache = new Map();
    baseInfoRef = createRef();
    wrapperRef = createRef();
    scrollAnchorThreshold = [];
    getScrollAnchorThresholdTimer = null;
    clickCurAnchorModuleNaviLock = false;
    modifyDutyInfosTemp = new Map();
    bindActiveChangeEventFlag = false;
    autoUpdateFlag = false;

    constructor(props) {
        super(props);
        this.state = {
            type: props.personnelState, // 类型1-交班，2-接班,3-值班记录查看
            operation: props.personnelState === ShiftChangeTypeEnum.Handover ? 'editable' : 'readonly', // 操作 readonly-查询，editable-修改
            schedulingObj: {}, // 服务端所需班组状态。 { isDuty: 1是当班班组，2是接班班组，0是非当班接班班组}
            // schedulingObj: props.statusInfo.schedulingObj, // 服务端所需班组状态。 { isDuty: 1是当班班组，2是接班班组，0是非当班接班班组}
            operId: props.operId,
            // professionalTypes: [], // 班组专业--是个数组（保存的时候是多选）
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
            provinceData: [],
            showMenuEntry: false,
            pageActive: true,
            isExpanded: false,
            contentTemplateModalVisible: false,
            editingFlag: false,
        };
        // this.currentModuleTop = 0;
        this.timer = null;
    }

    componentDidMount() {
        this.pageContainerRef.current.addEventListener('scroll', this.handleScrollEventThrottle);
        // document.querySelector(`#imp-unicom-content-root`).addEventListener('scroll', this.handleScrollEventThrottle);

        this.bindActiveChangeEvent();

        // GlobalMessage.on('activeChanged', this.tabActiveChangeHandle);
        this.getDataInfo();
        this.timer = setInterval(() => {
            this.getDataInfo('auto');
        }, 1000 * 60 * 3);
        // }, 1000 * 20);
    }
    // componentDidUpdate(prevProps) {
    //     if (this.props.statusInfo.personnelState !== prevProps.statusInfo.personnelState) {
    //         const { personnelState, schedulingObj } = this.props.statusInfo;

    //         // eslint-disable-next-line react/no-did-update-set-state
    //         this.setState({
    //             refreshFlag: false,
    //         });
    //         this.state.schedulingObj = schedulingObj;
    //         this.state.type = personnelState;
    //         this.getDataInfo();
    //     }
    //     // this.recordWbRef.current.style.height = `${this.baseInfoRef.current.scrollHeight}px`;
    // }
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
                    this.getDataInfo('auto');
                }, 1000 * 60 * 3);
            }
        }
    }

    componentWillUnmount() {
        this.pageContainerRef.current.removeEventListener('scroll', this.handleScrollEventThrottle);
        // document.querySelector(`#imp-unicom-content-root`).removeEventListener('scroll', this.handleScrollEventThrottle);
        GlobalMessage.off('activeChanged', this.tabActiveChangeHandle);
        clearInterval(this.getScrollAnchorThresholdTimer);
        clearInterval(this.timer);
    }

    handleScrollEventThrottle = (event) => {
        _.throttle(this.handleScrollEvent, 500)(event);
    };

    handleScrollEvent = (event) => {
        const { id, scrollTop } = event.target;

        let totalTop = scrollTop;
        // if (id !== 'imp-unicom-content-root') {
        //     this.currentModuleTop = scrollTop;
        // } else {
        //     totalTop = this.currentModuleTop + scrollTop;
        // }
        // console.log(totalTop);
        // 当前滚动在哪个模块范围内
        const index = this.scrollAnchorThreshold.findIndex((item) => item[1] > totalTop);

        if (this.clickCurAnchorModuleNaviLock) {
            return;
        }

        this.setState({
            curAnchorModuleId: this.scrollAnchorThreshold[index - 1]?.[0],
        });
    };

    bindActiveChangeEvent = () => {
        this.setState(
            {
                // eslint-disable-next-line react/no-unused-state
                bindActiveChangeEventFlagNoUse: true,
            },
            () => {
                GlobalMessage.on('activeChanged', this.tabActiveChangeHandle);
            },
        );
    };

    tabActiveChangeHandle = ({ isActive }) => {
        if (isActive) {
            this.setState({
                pageActive: true,
            });
            setTimeout(() => {
                this.getAnchorThreshold();

                this.handleCurAnchorModule(this.state.curAnchorModuleId);
            });
        } else {
            this.setState({
                pageActive: false,
            });
        }
    };

    getSelectedModuleByGroup = (data) => {
        api.getSelectedModuleByGroup(data).then((res) => {
            const dynamicModulesMergePro = res.filter((item) => item.checked);
            const dynamicModules = formatDynamicModules(res);

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
        });
    };

    getDataInfo = async (type) => {
        const {
            login: { userId },
            groupInfo,
        } = this.props;
        const data = {
            userId,
            groupId: groupInfo?.groupId,
        };

        const result = await api.queryShiftingOfDutyNow(data);
        const provinceData = await api.getProvinceData(userId);
        if (type === 'auto') {
            this.autoUpdateFlag = true;
        }
        this.clickCurAnchorModuleNaviLock = true;
        this.setState(
            {
                schedulingObj: result?.resultObj,
                refreshFlag: true,
                provinceData,
                type: result.resultObj.isDuty?.toString(),
                // eslint-disable-next-line eqeqeq
                operation: result?.resultObj.isDuty === 1 ? 'editable' : 'readonly',
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

    // 定时获取各模块偏移量
    getScrollAnchorThreshold = () => {
        clearInterval(this.getScrollAnchorThresholdTimer);
        this.getAnchorThreshold();

        this.getScrollAnchorThresholdTimer = setInterval(() => {
            this.getAnchorThreshold();
        }, 30 * 1000);
    };

    // 进入当班记录页面
    gotoShiftRecord = () => {
        if (this.state.operId) {
            logNew('交接班', this.state.operId);
        } else {
            logNew('交接班', '300047');
        }
        this.setState({
            operation: 'editable',
        });
    };

    // 保存当班记录信息
    saveChangeShifts = async (modifyScope) => {
        const { schedulingObj } = this.state;
        const {
            login: { userId },
            onCompChange,
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
            onCompChange,
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
                message.warning(result.resultMsg, 4, onCompChange);
            } else if (result.resultCode === '500') {
                this.props.history.push({
                    pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/change-shifts-page/abnormal-page`,
                    state: { type: '9', message: result.resultMsg },
                });
            }
        }
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

                    this.getDataInfo();
                },
            });
        } else {
            this.getDataInfo();
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
            url: `/home-unicom/call-test-record`,
            search: { edit: operation === 'editable' },
        });
    };

    onLastWorkSummaryClick = () => {
        const { schedulingObj, operation } = this.state;
        const { dateTime, groupId, workShiftId } = schedulingObj || {};

        openFrameworkRouteFn({
            history: this.props.history,
            url: `/home-unicom/change-shifts-page/previous-duty-summary`,
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
            url: `/home-unicom/network-management-system-alarm-monitoring`,
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
            url: `/home-unicom/modules-fault-management${ifIntel ? '/intel' : ''}`,
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
            url: `/home-unicom/network-cutover${ifIntel ? '/internet' : ''}`,
            search: { groupId, dateTime, workShiftId, edit: operation === 'editable' },
        });
    };

    onCutExecutionRecordClick = () => {
        const { schedulingObj, operation } = this.state;

        const provinceId = schedulingObj?.provinceId;

        openFrameworkRouteFn({
            history: this.props.history,
            url: `/home-unicom/cutting-execution-record`,
            search: { provinceId, edit: operation === 'editable' },
        });
    };

    onMaintainJobClick = () => {
        sendLogFn({ authKey: 'workbench-Workbench-MaintenanceOperationPlan-Button' });
        const { operation, schedulingObj } = this.state;

        const groupId = schedulingObj?.groupId || '';
        const provinceId = schedulingObj?.provinceId || '';
        const workingPlanId = schedulingObj?.workingPlanId || '';
        const workShiftId = schedulingObj?.workShiftId || '';
        const dateTime = schedulingObj?.dateTime || '';
        const edit = operation === 'editable';

        console.log('维护作业计划search', { groupId, edit, provinceId, workingPlanId });
        openFrameworkRouteFn({
            history: this.props.history,
            url: `/home-unicom/setting/views/maintain-job`,
            search: { groupId, edit, provinceId, workingPlanId, dateTime, workShiftId },
        });
    };
    // #endregion

    /**
     * 值班评价
     */
    recordDutyEvaluate = () => {
        const { userInfo } = useLoginInfoModel.data;
        const { operationsButton = [] } = JSON.parse(userInfo);

        const evaluateKey = 'recordDutySetting:evaluate';
        const hasAuth = !_isEmpty(operationsButton) && operationsButton.find((item) => item.key === evaluateKey);
        let edit = false;
        const { groupId, workShiftId, dateTime, isLeader } = this.state.schedulingObj;

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
    getLeaveContentData = async () => {
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
        return leaveContents;
    };

    /**
     * 遗留工单统一调用接口
     */
    sheetStay = async () => {
        const {
            login: { userName, userId },
        } = this.props;
        const { schedulingObj } = this.state;

        // const leaveContentsMap = new Map();

        // this.handLeaveOverKeysCache.forEach((value, keyObj) => {
        //     const { moduleId } = keyObj;

        //     const oldValue = leaveContentsMap.get(moduleId);

        //     leaveContentsMap.set(moduleId, oldValue ? [...oldValue, ...value] : value);
        // });
        // const allList = await this.requestNetworkFault();
        // console.log(allList, '===allList');
        // const leaveData = allList.data.filter((item) => item.isRemain === 1).map((item) => item.summaryId);
        // const leaveContents = [];
        // leaveContentsMap.forEach((value, key) => {
        //     if (key === 1) {
        //         leaveContents.push({ [key]: leaveData });
        //     } else {
        //         leaveContents.push({ [key]: value });
        //     }
        // });
        const leaveContents = await this.getLeaveContentData();
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
        console.log(sheetParam, '===sheetParam');
        return api.sheetStay(sheetParam);
    };

    saveItemInfoCheck = async () => {
        const { schedulingObj } = this.state;
        const {
            login: { userId },
            onCompChange,
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
            message.warning(checkResult?.resultMsg, 4, onCompChange);
            return false;
        }

        return true;
    };

    handleCurAnchorModule = (moduleId) => {
        const clickItem = this.scrollAnchorThreshold.find((item) => item[0] === moduleId);

        if (clickItem && !this.autoUpdateFlag) {
            this.pageContainerRef.current?.scrollTo(0, clickItem[1]);
        }
        this.setState({
            curAnchorModuleId: moduleId,
        });
        this.clickCurAnchorModuleNaviLock = true;

        setTimeout(() => {
            const doms = [...document.querySelectorAll('.change-shifts-common-wrapper')];

            const destDom = doms.find((item) => Number(item.dataset.moduleid) === moduleId);

            const { top = 0 } = destDom?.getBoundingClientRect() || {};

            const rootContent = document.querySelector(`#imp-unicom-content-root`);

            if (top > window.innerHeight) {
                const { scrollHeight, clientHeight } = rootContent;

                rootContent.scrollTo(0, scrollHeight - clientHeight);
            } else if (top < 0) {
                // rootContent.scrollTo(0, 0);
            }
            this.autoUpdateFlag = false;
            this.clickCurAnchorModuleNaviLock = false;
        }, 100);
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
    handleExpandedChange = () => {
        this.setState((prev) => ({ isExpanded: !prev.isExpanded }));
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
                    this.props.groupInfo?.refreshGroupInfo();
                    this.getDataInfo();
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
            provinceData,
            dynamicModulesMergePro,
            showMenuEntry,
            isExpanded,
            curAnchorModuleId,
            pageActive,
            contentTemplateModalVisible,
        } = this.state;
        const { login, history, handleSwitchUser, onCompChange } = this.props;
        this.wrapperRef.current = [];
        // console.log(type, '===type');
        // console.log(schedulingObj, '===schedulingObj');

        return (
            <div className="change-shifts-container workbench">
                {/* <div
                    onClick={async () => {
                        const v = await this.getLeaveContentData();
                        console.log(v, '===v');
                    }}
                    style={{ position: 'fixed', right: 0, top: '50%', backgroundColor: '#ccc', width: 100, height: 100, zIndex: 100 }}
                >
                    查看遗留
                </div> */}
                <div ref={this.pageContainerRef} className="change-shifts-scroll-container">
                    {showMenuEntry && pageActive && (
                        <MenuEntry
                            dynamicModulesMergePro={dynamicModulesMergePro}
                            onClickModule={this.handleCurAnchorModule}
                            schedulingObj={schedulingObj}
                            history={history}
                            operation={operation}
                            checkButtonDisabledFn={this.checkButtonDisabled}
                            // axis="none"
                            initPosition={{ top: 0, right: '-10px' }}
                            curAnchorModuleId={curAnchorModuleId}
                            isExpanded={isExpanded}
                            handleExpandedChange={this.handleExpandedChange}
                            placePage="workbench"
                        />
                    )}
                    <CommonWrapper
                        moduleId={27}
                        title="基本信息"
                        titleSuffix={
                            null
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
                        }
                    >
                        <div className="base-info-content-container">
                            <DoChange
                                schedulingObj={schedulingObj}
                                personnelState={type}
                                onCompChange={onCompChange}
                                theme="light"
                                handleSwitchUser={handleSwitchUser}
                                sheetStay={this.sheetStay}
                                disabled={schedulingObj?.isDuty === 0}
                                getDataInfo={() => {
                                    this.props.groupInfo?.refreshGroupInfo();
                                    this.getDataInfo();
                                }}
                                checkHandSubmit={this.checkHandSubmit}
                            />
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
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            sendLogFn({ authKey: 'workbench-Workbench-CallTestingRecord-Button' });

                                            this.onCallTestRecordClick();
                                        }}
                                    >
                                        拨测记录
                                    </Button>
                                )}
                                {/* 3 这个枚举值是传输网专业 */}
                                {this.judgeMenuPermission('割接执行记录') && this.checkButtonDisabled([3]) && (
                                    <NewAuthButton
                                        type="primary"
                                        onClick={() => {
                                            this.onCutExecutionRecordClick();
                                        }}
                                        authKey="workbench-Workbench-Shift-CutExecutionRecord"
                                        ignoreAuth
                                    >
                                        割接执行记录
                                    </NewAuthButton>
                                )}
                                {/* 1 这个枚举值是核心网专业 */}
                                {this.judgeMenuPermission('网管系统告警监测') && this.checkButtonDisabled([1]) && (
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            sendLogFn({ authKey: 'workbench-Workbench-NMS-AlarmMonitoring-Button' });
                                            this.onNMSAlarmMonitoringClick();
                                        }}
                                    >
                                        网管系统告警监测
                                    </Button>
                                )}
                                {this.judgeMenuPermission('网络故障管理') && this.checkButtonDisabled([9999]) && (
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            sendLogFn({ authKey: 'workbench-Workbench-NMS-AlarmMonitoring-Button' });
                                            this.onModulesFaultManagementClick();
                                        }}
                                    >
                                        网络故障管理
                                    </Button>
                                )}
                                {this.judgeMenuPermission('网络割接管理') && this.checkButtonDisabled([9999]) && (
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            sendLogFn({ authKey: 'workbench-Workbench-NMS-AlarmMonitoring-Button' });
                                            this.onNetworkCutoverClick();
                                        }}
                                    >
                                        网络割接管理
                                    </Button>
                                )}
                                {this.judgeMenuPermission('上班次总结') && schedulingObj?.groupId && (
                                    <NewAuthButton
                                        type="primary"
                                        ignoreAuth
                                        authKey="workbench-Workbench-components-Handover-Job-Summary-Button"
                                        onClick={() => {
                                            this.onLastWorkSummaryClick();
                                        }}
                                    >
                                        上班次总结
                                    </NewAuthButton>
                                )}
                                {this.judgeMenuPermission('维护作业计划') && schedulingObj?.groupId && (
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            sendLogFn({ authKey: 'workbench-Workbench-MaintenanceOperationPlan-Button' });
                                            this.onMaintainJobClick();
                                        }}
                                    >
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
                                ref={(el) => {
                                    this.wrapperRef.current[index] = el;
                                }}
                                {...item}
                                pageType={type}
                                provinceData={provinceData}
                                // eslint-disable-next-line
                                pattern={operation === 'editable' ? (schedulingObj?.isDuty === 0 ? 'readonly' : 'editable') : 'readonly'}
                                schedulingObj={schedulingObj}
                                refreshFlag={refreshFlag}
                                history={history}
                                loginInfo={login}
                                onSelectedKeysChange={(keys) => this.onSelectedKeysChange(item.moduleId, item.currentProfessional, keys)}
                                saveItemInfoCb={this.saveItemInfoCb}
                                saveItemInfoCheck={this.saveItemInfoCheck}
                                refreshDutyInfo={this.getDataInfo}
                                delRecordOrInformData={this.delData}
                                onEditRecordOrInform={(stateType) => this.onTimelineEdit(stateType)}
                                allRemainSwitchClick={this.allRemainSwitchClick}
                            />
                        );
                    })}

                    {schedulingObj?.groupName === '集团-总值班' && operation !== 'readonly' ? (
                        <div className="btn-wrapper">
                            <Button type="primary" onClick={() => this.oneKeySave()} style={{ fontSize: '14px', lineHeight: '18px' }}>
                                一键保存
                            </Button>
                        </div>
                    ) : null}

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
            </div>
        );
    }
}

export default withModel([useLoginInfoModel, useHistory], ([login, history]) => ({
    login,
    history,
}))(ChangeShifts);
