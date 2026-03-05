/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useEffect, useLayoutEffect, useState, useRef, useMemo, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import { _ } from 'oss-web-toolkits';
import { Row, Col, Form, message, Button, Spin, Modal, Space } from 'oss-ui';
import { useHistory } from 'react-router-dom';
import useLoginInfoModel from '@Src/hox';
import { useNavigatePage, useAuth, useFaultAgentQuery } from '@Src/hooks';
import { authData } from '@Src/pages/network-fault-file/auth';
import constants from '@Common/constants';
import dayjs from 'dayjs';
import moment from 'moment';
import actionss from '@Src/share/actions';
import { useDebounceEffect } from 'ahooks';
import html2canvas from 'html2canvas';
import { Api } from '@Src/pages/fault-rule-manage/api';
import { ItemCard, LayoutItem, FileDown } from '../../../components';
import { formatFirst, formatContinue } from '../../../utils';
// import { MajorFaultReportEnum } from '@Src/common/enum/majorFaultReportEnum';
import generateQuestionTxt from './questionTxtMap';
import {
    ReportType,
    failureReportingLevelList,
    failureReportingUsageList,
    continueReportTypeList,
    REPORT_STATUS,
    FAILURE_REPORT_DRAFTS,
    FAILURE_REPORT_STATUS,
    ReportNoticeDefaultValue,
    defaultNotificationDetailList,
    FAILURE_SOURCE_TYPE,
    FAULT_NOTIFICATION_ENUM,
} from '../../../type';
import {
    firstReport,
    faultFirstReport,
    firstReportApprove,
    firstReportEdit,
    continueReport,
    continueReportApprove,
    continueReportUpdate,
    getAllReportList,
    getProvinceList,
    getDeptsInfo,
    getAutoFpWorkSheets,
    getUsersBySpecialtyList,
    validateReport,
    getFaultReportDetail,
    getFaultUsers,
    getFaultReportDerivedRule,
    queryDetailByAlarmId,
    queryRuleConfigReportInfo,
    getManualReportDerivedRuleNotificationSetting,
} from '../../../api';
import useEnumHooks from '../../../enum-hooks';
import FirstReportForm from '../first-report-form';
import SubsequentReportForm from '../subsequent-report-form';
import './index.less';

const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
};

export type FormContainerProps = {
    setLoading: (loading: boolean) => void;
    flagId?: string | null;
    dataSource?: any;
    // form: any;
    reportNoticeClassName?: string;
    noticeTemplateClassName?: string;
    noticeTemplateAddClassName?: string;
    userGroupSelectModalClassName?: string;
    goToListPage?: () => void;
    hideListButton?: boolean;
    faultReportStatus?: string | null;
    onFinish?: () => void;
    source?: number;
    // 告警ID
    standardAlarmId?: string;
    ticketModalClassName?: string;
    darkTheme?: boolean;
    setFaultReportDataSource?: any;
    setIsView?: any;
    isWireless?: any;
    sync?: any;
    setIsContinueReportView?: any;
    updateCardList?: () => void;
    isMajor?: boolean; // 是否重大故障上报
    title?: string; // 处理环节
    btnKey?: string; // 弹窗确认按钮key
    theme?: string; // 主题 ''| white
    isFaultReportNew?: boolean; // 是否新的故障上报
    ruleConfig?: any; // 规则配置
    isManual?: boolean; // 是否手动上报
};
export type FormContainerRef = {
    onSubmit: () => void;
    onSave: () => void;
    // onGetFormValues: () => void;
    onReset: () => void;
};

const FinalReportId = 'form-container-scroll-flag-final-report';

const FormContainer: ForwardRefRenderFunction<FormContainerRef, FormContainerProps> = (props, ref) => {
    const {
        setLoading,
        flagId: flagIdProps,
        reportNoticeClassName,
        noticeTemplateClassName,
        noticeTemplateAddClassName,
        userGroupSelectModalClassName,
        goToListPage,
        hideListButton,
        faultReportStatus,
        onFinish: onFinishProps,
        source: sourceProps,
        standardAlarmId: standardAlarmIdProps,
        ticketModalClassName,
        darkTheme,
        dataSource,
        setFaultReportDataSource,
        setIsView,
        isWireless,
        sync,
        setIsContinueReportView,
        updateCardList,
        isMajor = false,
        title,
        btnKey, // 弹窗确认按钮key
        theme, // 主题 ''| white
        isFaultReportNew, // 是否新的故障上报
        ruleConfig, // 规则配置
        isManual, // 是否手动上报
    } = props;

    // let flagId = flagIdProps;
    const [flagId, setFlagId] = useState(flagIdProps);
    const [confirmVisible, setConfirmVisible] = useState<any>(false);
    const [flagIdReady, setFlagIdReady] = useState(false);
    const [hasDraftStatus, setHasDraftStatus] = useState(faultReportStatus && FAILURE_REPORT_DRAFTS.includes(faultReportStatus));
    // let hasDraftStatus = faultReportStatus && FAILURE_REPORT_DRAFTS.includes(faultReportStatus);
    const [isFirstDraft, setIsFirstDraft] = useState(faultReportStatus === FAILURE_REPORT_STATUS.FIRST_DRAFT);
    // let isFirstDraft = faultReportStatus === FAILURE_REPORT_STATUS.FIRST_DRAFT;

    const [form] = Form.useForm();
    const reportNoticeRef: any = useRef(null);
    const editDataRef: any = useRef(null);
    const history = useHistory();
    const { pushActions } = useNavigatePage();
    const { isHasAuth, isHasPathAuth } = useAuth();
    // 通知方式数据
    const [noticeTypeData, setNoticeTypeData] = useState<ReportNoticeDefaultValue>({});
    const [GNOCdisable, setGNOCdisable] = useState(true);
    const [allReportList, setAllReportList] = useState<any[]>([]);
    // 草稿数据
    const [draftData, setDraftData] = useState<any>({});

    // 省份数据
    const [provinceData, setProvinceData] = useState<any>([]);
    const [deptName, setDeptName] = useState('');

    const [loadingData, setLoadingData] = useState(false);

    const [autoFpWorkSheets, setAutoFpWorkSheets] = useState<any>([]);

    const [infoBoxHeight, setInfoBoxHeight] = useState(0);

    const [cableData, setCransData] = useState<Record<string, any>>({}); // 光缆首报数据回显

    const [restType, setRestType] = useState<boolean>(true);

    const [newData, setNewData] = useState<any>({});
    const [validateInfo, setValidateInfo] = useState<any>({});

    const { userId, userName, userInfo, systemInfo, provinceId } = useLoginInfoModel();
    const parseUserInfo = userInfo && JSON.parse(userInfo);
    const editRef = useRef<HTMLDivElement>(null);
    const submitFlagRef = useRef(false);
    const specialtyUserInfoListRef = useRef([]);
    const { currentZone } = systemInfo;

    const isProvinceZone = systemInfo?.currentZone?.zoneLevel === '2' || parseUserInfo?.zones?.[0]?.zoneLevel === '2';
    const frameVisible = window.location.href.indexOf('hideNav') !== -1; // 是否为嵌入的故障上报
    const searchParams = new URLSearchParams(window.location.search);
    const windowTheme = searchParams.get('windowTheme'); // 是否为嵌入的故障上报-无线工作台
    const [faultReportDerivedRule, setFaultReportDerivedRule] = useState<any>({});
    const [autoFaultReportDerivedRule, setAutoFaultReportDerivedRule] = useState<any>({});
    const [agentData, setAgentData] = useState<any>({});
    const [flowData, setFlowData] = useState<any>({});

    const faultAgentIntentQueryApi = useFaultAgentQuery();

    const [curContinueType, setCurContinueType] = useState('');
    const curContinueTypeRef = useRef('');
    curContinueTypeRef.current = curContinueType;

    useEffect(() => {
        if (flagIdProps) {
            setFlagId(flagIdProps);
        }
    }, [flagIdProps]);

    // 最新一次上报的内容
    const latestReport = useMemo(() => {
        if (allReportList && allReportList.length > 0) {
            return allReportList[allReportList.length - 1];
        }
        return {};
    }, [allReportList]);

    // 首报上报的内容（为了取故障发生时间等续报中没有的字段值）
    const firstReportData = useMemo(() => {
        if (allReportList && allReportList.length > 0) {
            return allReportList[0];
        }
        return {};
    }, [allReportList]);

    const isContinueDraft = faultReportStatus === FAILURE_REPORT_STATUS.CONTINUE_DRAFT;
    const isFinalDraft = faultReportStatus === FAILURE_REPORT_STATUS.FINAL_DRAFT;
    const isFinalReport = faultReportStatus === FAILURE_REPORT_STATUS.FINAL_REPORT || faultReportStatus === FAILURE_REPORT_STATUS.FINAL_REPORT_MAJOR;

    const allEnumData = useEnumHooks({ province: provinceId });
    const { regionList } = allEnumData;

    const getFaultReportDerivedRuleById = async (alarmId: string) => {
        getFaultReportDerivedRule({ standardAlarmId: alarmId }).then((res) => {
            setFaultReportDerivedRule(res?.data);
            if (res?.data?.ruleId) {
                Api.getFaultReportDerivedRuleConfig({ ruleId: res?.data?.ruleId }).then((res1) => {
                    setAutoFaultReportDerivedRule(res1?.data);
                });
            }
        });
    };

    useLayoutEffect(() => {
        const alarmId = standardAlarmIdProps || dataSource?.standardAlarmId;
        if (alarmId) {
            getFaultReportDerivedRuleById(alarmId);
        }
    }, [standardAlarmIdProps, dataSource?.standardAlarmId]);

    const getFlowData = (val: any = null) => {
        if (
            flagId &&
            (btnKey === 'majorFaultReport:supplementalReportApplication' ||
                btnKey === 'majorFaultReport:supplementalReport' ||
                btnKey === 'majorFaultReport:progressReportSupplementalApplication' ||
                btnKey === 'majorFaultReport:progressReportSupplemental' ||
                btnKey === 'faultReport:progressReport' ||
                btnKey === 'majorFaultReport:progressReportApplication' ||
                btnKey === 'faultReport:finalReport' ||
                btnKey === 'majorFaultReport:finalReportApplication')
        ) {
            let continueType = 1;
            if (
                btnKey === 'majorFaultReport:supplementalReportApplication' ||
                btnKey === 'majorFaultReport:supplementalReport' ||
                btnKey === 'majorFaultReport:progressReportSupplementalApplication' ||
                btnKey === 'majorFaultReport:progressReportSupplemental' ||
                btnKey === 'faultReport:progressReport' ||
                btnKey === 'majorFaultReport:progressReportApplication'
            ) {
                continueType = 1;
            } else if (btnKey === 'faultReport:finalReport' || btnKey === 'majorFaultReport:finalReportApplication') {
                continueType = 2;
            }
            const param = {
                flagId,
                continueType: val || continueType,
                userId,
            };
            queryRuleConfigReportInfo(param).then((res) => {
                setFlowData(res?.data?.length > 0 ? res?.data[0] : {});
            });
        }
    };

    useLayoutEffect(() => {
        if (
            btnKey === 'majorFaultReport:firstReportApplication' ||
            btnKey === 'faultReport:firstReportApplicationCancel' ||
            btnKey === 'majorFaultReport:supplementalReportApplication' ||
            btnKey === 'majorFaultReport:supplementalReport' ||
            btnKey === 'majorFaultReport:progressReportSupplementalApplication' ||
            btnKey === 'majorFaultReport:progressReportSupplemental' ||
            btnKey === 'faultReport:progressReport' ||
            btnKey === 'majorFaultReport:progressReportApplication' ||
            btnKey === 'faultReport:finalReport' ||
            btnKey === 'majorFaultReport:finalReportApplication'
        ) {
            getFlowData();
            // 智能体不处理查询接口
            if (dataSource?.isAgent) {
                setAgentData({
                    failureLevel: dataSource?.ai_failureLevel,
                    rootSpecialty: dataSource?.ai_rootSpecialty,
                    reportDescribe: dataSource?.ai_reportDescribe,
                    isEffectBusiness: dataSource?.ai_isEffectBusiness,
                    influenceScope: dataSource?.ai_influenceScope,
                    businessImpactScope: dataSource?.ai_businessImpactScope,
                    causesAnalysis: dataSource?.ai_causesAnalysis,
                    treatmentMeasure: dataSource?.ai_treatmentMeasure,
                    businessRecoverProcess: dataSource?.ai_businessRecoverProcess,
                });
                return;
            }
            const agentParam = {
                button_ai_flagId: flagId,
                button_ai_standardAlarmId: standardAlarmIdProps || dataSource?.standardAlarmId,
                button_ai_buttonKey: btnKey,
                button_ai_topic: dataSource?.topic,
                question: generateQuestionTxt(btnKey),
            };
            if (!agentParam.button_ai_flagId && !agentParam.button_ai_standardAlarmId) {
                return;
            }
            faultAgentIntentQueryApi(agentParam).then((res) => {
                console.log('智能体返回结果 :>> ', res);
                setAgentData(res);
            });
        }
    }, [flagId, btnKey, standardAlarmIdProps]);

    const setDefaultNotificationUser = () => {
        const specialtyId = form.getFieldValue('specialty') || allReportList[0]?.specialty;
        if (specialtyId) {
            getManualReportDerivedRuleNotificationSetting({ professionalType: specialtyId, reportType: '0' }).then((res) => {
                form.setFieldsValue({
                    notice: {
                        notificationUserInfos: res?.data?.notificationUserInfos || [],
                    },
                });
            });
        }
    };

    // 专业改变时，清空子专业和故障类别
    const onSpecialtyChange = async (type = 'default') => {
        let specialtyId = form.getFieldValue('specialty') || allReportList[0]?.specialty;
        const reportLevel = form.getFieldValue('reportLevel') || allReportList[0]?.reportLevel;
        const ifWireless = allReportList[0]?.faultDistinctionType === 2 && allReportList[0]?.source === 0; // 续报的时候判断是不是无线故障
        let userList = [];

        if (type === 'continue' && dataSource) {
            specialtyId = dataSource.specialty;
        }
        if (allReportList.length > 0) {
            userList = allReportList[allReportList.length - 1].faultNotice.notificationUserInfos || [];
        }
        if (!specialtyId) return;
        const { data: curSpecialtyUserInfoList } = await getUsersBySpecialtyList({ specialtyId: isWireless || ifWireless ? '1011' : specialtyId });
        // if (specialtyId !== form.getFieldValue('specialty')) return;
        // console.log({ curSpecialtyUserInfoList, userList }, 'curSpecialtyUserInfoList');
        const tempList = userList.map((el: any) => {
            const findItem = curSpecialtyUserInfoList.find((item) => item.userId === el.userId);
            if (findItem) {
                return {
                    ...el,
                    provinceNames: el.zoneName || el.provinceNames,
                    originType: 'origin',
                };
            }
            return { ...el, provinceNames: el.zoneName || el.provinceNames };
        });
        let newList = curSpecialtyUserInfoList.map((el) => ({ ...el, originType: 'origin' }));
        if (reportLevel?.length === 1 && reportLevel?.[0] === '1') {
            // 报省份故障不带默认通知用户
            newList = [];
        }

        specialtyUserInfoListRef.current = allReportList.length > 0 ? tempList : newList;
        console.log('3', allReportList, tempList, newList);
        reportNoticeRef.current?.handleSelectedNoticeData?.((allReportList.length > 0 ? tempList : newList) || []);
        if (type !== 'draft') {
            form.setFieldsValue({
                subSpecialty: undefined,
                failureClass: '20',
                relationAlarmDetails: undefined,
            });
        }

        if (type !== 'draft' && type !== 'continue') {
            let level = String(specialtyId) === '11' ? '4' : '6';
            if (isMajor && level === '6') {
                level = '';
            }
            form.setFieldsValue({
                failureLevel: level,
            });
        }

        // 切换专业时如果有数据则填充数据
        // 干线光缆下自动填充 传输系统 传输段 光缆段 字段
        if (cableData?.transSystemName || cableData?.transSegId || cableData?.cableSegment) {
            form.setFieldsValue({
                transSystem: cableData?.transSystemName,
                transSegId: cableData?.transSegId,
                reuseTransSeg: cableData?.cableSegment,
            });
        }
        // 手工上报， 报集团总部时，回填默认规则配置的通知用户
        if (isManual && reportLevel?.includes('0')) {
            setDefaultNotificationUser();
        }
    };
    const onReportLevelChange = (val) => {
        if (!flagId || isFirstDraft) {
            const notice = form.getFieldValue('notice');
            if (val.length === 1 && val[0] === '1') {
                // 首报 故障上报级别只选了报省公司  gnoc通知默认不勾选
                reportNoticeRef.current?.handleSelectedNoticeData([]);
                // 报省公司时，不可勾选gnoc通知
                setGNOCdisable(true);
                form.setFieldsValue({
                    notice: {
                        ...notice,
                        whetherNotifyGNOC: false,
                    },
                });
            } else {
                console.log(specialtyUserInfoListRef.current, 'specialtyUserInfoListRef.current');
                reportNoticeRef.current?.handleSelectedNoticeData(specialtyUserInfoListRef.current || []);
                setGNOCdisable(true);
                form.setFieldsValue({
                    notice: {
                        ...notice,
                        whetherNotifyGNOC: true,
                    },
                });
            }
            // 手工上报， 报集团总部时，回填默认规则配置的通知用户
            if (isManual && val?.includes('0')) {
                setDefaultNotificationUser();
            }
        }
    };
    const confirmCancle = () => {
        setConfirmVisible(false);
        submitFlagRef.current = false;
    };

    const getStatusName = (status: string) => {
        const statusMap = {
            21: '首报申请',
            22: '首报-修改申请',
            23: '首报-修改',
            41: '续报申请',
            42: '续报-修改申请',
            43: '续报-修改',
            61: '终报申请',
            62: '终报-修改申请',
            63: '终报-修改',
        };
        return statusMap[status] || '续报';
    };

    // 已经提交的首报和续报
    const allData: any[] = allReportList.map((item, index) => {
        let isShowUpload = false;

        if (isMajor) {
            if (index === 0) {
                return {
                    name: '首报',
                    dataList: isWireless ? formatFirst(item).slice(0, -3) : formatFirst(item),
                };
            }
            if (btnKey === 'faultReport:upload') {
                isShowUpload = index === allReportList?.length - 1;
                return {
                    name: isMajor ? getStatusName(item?.reportStatus) : '续报',
                    dataList: isWireless ? formatContinue(item, isShowUpload).slice(0, -3) : (formatContinue(item, isShowUpload) as any),
                };
            }
            return {
                name: isMajor ? getStatusName(item?.reportStatus) : '续报',
                dataList: isWireless ? formatContinue(item).slice(0, -3) : (formatContinue(item, isShowUpload) as any),
            };
        }
        if (index === 0) {
            return {
                name: '首报',
                dataList: isWireless ? formatFirst(item).slice(0, -3) : formatFirst(item),
            };
        }
        if (item.continueType === ReportType.FINAL_REPORT) {
            return {
                name: '终报',
                dataList: isWireless ? formatContinue(item).slice(0, -3) : formatContinue(item, isShowUpload),
                faultReportDetailCardId: FinalReportId,
            };
        }
        return {
            name: '续报',
            dataList: isWireless ? formatContinue(item).slice(0, -3) : (formatContinue(item) as any),
        };
    });

    // 故障上报来源
    let source = FAILURE_SOURCE_TYPE.MANUAL; // 默认手动上报
    if (hasDraftStatus && draftData?.source !== undefined && draftData?.source !== null) {
        // 有草稿的时候，取草稿的source
        source = draftData?.source;
    } else if (latestReport?.source !== undefined && latestReport?.source !== null) {
        // 有上一次的上报，取上一次的source
        source = latestReport?.source;
    }
    // props里存在source的话，就一定用props里的
    if (sourceProps !== undefined && sourceProps !== null) {
        source = sourceProps || dataSource?.source;
    }

    // 自动上报的时候需要传告警ID standardAlarmId
    const standardAlarmId =
        source === FAILURE_SOURCE_TYPE.AUTO
            ? standardAlarmIdProps || draftData?.standardAlarmId || latestReport?.standardAlarmId || dataSource?.standardAlarmId
            : undefined;

    // 当前状态是【任意草稿】或【终报上报】时，保存和提交都要传这个参数
    const disposeId = isFinalReport ? latestReport?.disposeId : draftData?.disposeId;
    const skip2NetWorkFaultFile = (id) => {
        const editFlag = isHasAuth(authData.editFault) && isHasPathAuth('/unicom/network-fault-file');
        if (!editFlag) {
            message.warn('请先分配网络故障集中存档的编辑权限');
            return;
        }
        pushActions(`/network-fault-file`, { flagId: id });
    };
    const onSyncNotice = (flagIds) => {
        message.success({
            className: 'fault-report-message-success',

            content: (
                <div className="fault-report-modal-success">
                    <div>上报成功！已同步至网络故障集中存档！</div>
                    <div className="fault-report-modal-success-link" onClick={() => skip2NetWorkFaultFile(flagIds)}>
                        {'>>前往补充故障信息'}
                    </div>
                </div>
            ),
        });
    };

    const getScreenShoot = async () => {
        const dom = document.getElementById('fault-report-form-container');
        const [svg1, svg2] = document.body.childNodes;
        (svg1 as SVGAElement).setAttribute('data-html2canvas-ignore', '');
        // (svg2 as SVGAElement).setAttribute('data-html2canvas-ignore', '');
        console.time('创建时间');
        const canvas = await html2canvas(dom as HTMLDivElement, {
            logging: false,
        });
        console.timeEnd('创建时间');
        console.time('转换时间');
        const url = canvas.toDataURL('image/png');
        console.timeEnd('转换时间');
        return url;
    };

    const getAgentFaultUsers = async (data) => {
        const userIdArr = data?.notificationUser?.split(',') || [];
        const res = await getFaultUsers({
            userIds: userIdArr,
        });
        return (
            res?.data?.map((item) => {
                return { ai_user_id: item.userId, ai_role_type: item.roleTypeNames };
            }) || []
        );
    };

    // 判断是否需要关闭上报窗口，刷新列表
    const checkStatus = (msg) => {
        let isNeedRefresh = false;
        if (msg?.indexOf('上报流程已进入后续流转环节，请勿重复操作') >= 0) {
            isNeedRefresh = true;
        } else if (msg?.indexOf('有续报在处理中，请处理完成后再续报') >= 0) {
            isNeedRefresh = true;
        } else if (msg?.indexOf('告警已清除，请停止上报') >= 0) {
            isNeedRefresh = true;
        }
        return isNeedRefresh;
    };

    // 旧流程上报没有btnKey，判断获取key传给智能体
    const getBtnKey = () => {
        let key = btnKey;
        if (key) {
            if (btnKey === 'faultReport:firstReportApplicationCancel') {
                // 首报取消上报时，又取消"取消上报"，然后申请，这时返回首报申请状态
                key = 'majorFaultReport:firstReportApplication';
            } else if (btnKey === 'faultReport:firstReportApproveCancel') {
                // 首报审核取消上报时，又取消"取消上报",然后审核，这时返回审核成功
                key = 'majorFaultReport:firstReportApprove';
            }
        } else if (isFinalReport) {
            key = 'faultReport:finalReport';
        } else if (flagId && !isFirstDraft) {
            key = 'faultReport:progressReport';
        } else {
            key = 'faultReport:confirmReportWindow';
        }
        return key;
    };

    // 提交
    const onFinish = async (values: any) => {
        let data: any = {};
        if (isFinalReport) {
            // 终报上报状态的时候，只更新文件
            data = {
                fileSessionId: values?.uploudFiles?.[0]?.fileSessionId,
                disposeId,
                uploudFiles: values?.uploudFiles || [],
                onlyUploudFile: 1, // 1只更新文件 0或空 正常续报
                syncState: sync.isSync,
                flagId,
                userId,
            };
        } else {
            const { notice } = values;

            // 上报通知没填完整
            if (notice?.reportNoticeError) {
                message.error(notice.reportNoticeError);
                return;
            }

            // 终报时故障级别一次都没填写
            if (values.continueType === ReportType.FINAL_REPORT) {
                const hasFailureLevel = allReportList.some((item) => item.failureLevel !== null && item.failureLevel !== undefined);
                if (!hasFailureLevel && !values.failureLevel) {
                    message.error('请在终报中填写故障等级预警');
                    return;
                }
                const hasFailureClass = allReportList.some((item) => item.failureClass !== null && item.failureClass !== undefined);
                if (!hasFailureClass && !values.failureClassHis) {
                    message.error('请在终报中填写故障类别');
                    return;
                }
            }

            const hasNotice = notice && notice.notificationType && notice.notificationType.length > 0;
            const noticeData = hasNotice
                ? {
                      reportNoticeError: undefined,
                      notificationType: notice.notificationType,
                      notificationDetailList: notice.notificationDetailList,
                      notificationTel: notice.notificationTel,
                      notificationUser: notice.notificationUser,
                      notificationContent: notice.notificationContent,
                  }
                : {
                      notificationContent: notice?.notificationContent,
                  };
            let textareaValue = {};

            // 有flagId并且不是首报草稿时说明是续报
            if (flagId && !isFirstDraft) {
                // 续报的那几个文本框格式不一样
                textareaValue = {
                    ...values.influenceScope,
                    ...values.causesAnalysis,
                    ...values.treatmentMeasure,
                    ...values.businessImpactScope,
                    ...values.businessRecoverProcess,
                };
                if (values.influenceScope?.influenceScopeFollow === 'yes') {
                    if ((isWireless || (latestReport?.faultDistinctionType === 2 && latestReport?.source === 0)) && !values.influenceScope) {
                        message.error('故障网络影响范围不能为空');
                        return;
                    }
                    textareaValue = {
                        ...textareaValue,
                    };
                }
                if (values.causesAnalysis?.causesAnalysisFollow === 'yes') {
                    if (!values.causesAnalysis) {
                        message.error('故障原因分析不能为空');
                        return;
                    }
                    textareaValue = {
                        ...textareaValue,
                    };
                }
                if (values.businessImpactScope?.businessImpactScopeFollow === 'yes') {
                    if (!values.businessImpactScope && values.isEffectBusiness === '1') {
                        message.error('故障业务影响不能为空');
                        return;
                    }
                    textareaValue = {
                        ...textareaValue,
                    };
                }
                if (values.businessRecoverProcess?.businessRecoverProcessFollow === 'yes') {
                    if (!values.businessRecoverProcess && values.isEffectBusiness === '1') {
                        message.error('业务恢复进展不能为空');
                        return;
                    }
                    textareaValue = {
                        ...textareaValue,
                    };
                }
                if (values.treatmentMeasure?.treatmentMeasureFollow === 'yes') {
                    if (!values.treatmentMeasure) {
                        message.error('故障处理进展不能为空');
                        return;
                    }
                    textareaValue = {
                        ...textareaValue,
                    };
                }
            }

            data = {
                ...values,
                failureTime: dayjs(values.failureTime).format('YYYY-MM-DD HH:mm:ss'),
                failureRecoverTime: values.failureRecoverTime && dayjs(values.failureRecoverTime).format('YYYY-MM-DD HH:mm:ss'),
                businessRecoverTime: values.businessRecoverTime && dayjs(values.businessRecoverTime).format('YYYY-MM-DD HH:mm:ss'),
                city: values.city?.value || typeof values.city === 'object' ? values.city.value : values.city,
                cityName: values.city?.label,
                notice: undefined,
                ...noticeData,
                reportLevel: _.isArray(values.reportLevel) ? values.reportLevel.join(',') : values.reportLevel,
                application: _.isArray(values.application) ? values.application.join('') : values.application,
                flagId,
                fileSessionId: values?.uploudFiles?.[0]?.fileSessionId,
                ...textareaValue,
                nowReportStatus: REPORT_STATUS.SUBMIT,
                source,
                standardAlarmId,
                disposeId,
                faultWorkNos: values?.faultWorkNoDetails?.map((item) => item.sheetNo),
                whetherNotifyGNOC: values?.notice?.whetherNotifyGNOC,
                reportUser: userId,
                reportUserName: userName,
                deptName: deptName || userName,
                syncState: sync.isSync,
            };
        }
        setNewData(data); // 存储当前编辑的内容
        editDataRef.current = values;

        if (values?.relationAlarmDetails?.length > 0 && !submitFlagRef.current) {
            const validateReportParam = values?.relationAlarmDetails.map((e) => e.standard_alarm_id);
            const validateRes = await validateReport(validateReportParam);
            if (validateRes.data) {
                // 0:不在自动识别告警中
                // 1:所在的自动识别告警对应主告警已清除，不在调度工作台卡片中
                // 2:所在的自动识别告警待确认上报
                // 3:所在的自动识别衍生告警已取消
                // 4:所在的自动识别衍生告警已上报（未终报）
                // 5:所在自动识别衍生告警已终报
                const valiDateType = validateRes.data.resultType;
                setValidateInfo(validateRes.data);
                switch (valiDateType) {
                    case 0: // 不在自动识别告警中
                        break;
                    case 1:
                        break;
                    case 2:
                        setConfirmVisible(2);
                        return;
                    case 3:
                        setConfirmVisible(3);
                        return;
                    case 4:
                        setConfirmVisible(4);
                        return;
                    case 5:
                        setConfirmVisible(5);
                        return;
                    default:
                }
            }
        }

        if (isWireless) {
            // @ts-ignore
            data.whetherNotifyGNOC = false;
            // @ts-ignore
            data.faultDistinctionType = 2;
        } else {
            // @ts-ignore
            data.faultDistinctionType = dataSource?.faultDistinctionType || 1;
        }

        let reportFn;
        console.log(isWireless, '===is', props);
        if (flagId && !isFirstDraft) {
            // 续报
            reportFn = continueReport;
            // @ts-ignore
            // data.faultDistinctionType = allReportList[0].faultDistinctionType;
        } else {
            // 首次上报
            reportFn = firstReport;
        }
        console.log('dataSource', dataSource);
        // 增加联系方式参数，表单没有时，默认传登录用户的联系方式
        data.telephone = data.telephone || parseUserInfo.userMobile;
        if (isMajor && btnKey) {
            if (source !== FAILURE_SOURCE_TYPE.MANUAL) {
                data.standardAlarmId =
                    standardAlarmIdProps || draftData?.standardAlarmId || latestReport?.standardAlarmId || dataSource?.standardAlarmId || null;
            }

            if (btnKey === 'majorFaultReport:firstReportApplication' || btnKey === 'faultReport:firstReportApplicationCancel') {
                // 首报申请、首报申请取消上报时，又取消"取消上报"
                data = {
                    ...data,
                    nowReportStatus: REPORT_STATUS.FIRST_WAIT_APPROVE,
                    disposeId: latestReport?.disposeId || undefined,
                };
                if (isFaultReportNew) {
                    data = {
                        ...data,
                        ruleId: ruleConfig?.ruleId || null,
                        nowReportStatus: ruleConfig?.whetherFirstAutoReport ? REPORT_STATUS.SUBMIT : REPORT_STATUS.FIRST_WAIT_APPROVE,
                    };
                    reportFn = faultFirstReport;
                }
            } else if (btnKey === 'majorFaultReport:firstReportApprove' || btnKey === 'faultReport:firstReportApproveCancel') {
                // 首报审核、首报审核取消上报时，又取消"取消上报"
                data = {
                    ...data,
                    nowReportStatus: 2,
                    disposeId: latestReport?.disposeId || undefined,
                };
                if (allReportList?.length > 0) {
                    data = {
                        topic: allReportList[0].topic,
                        ...data,
                        specialty: data?.specialty || allReportList[0].specialty,
                        reportDescribe: data.reportDescribe || allReportList[0].reportDescribe,
                        province: data?.province || allReportList[0].province,
                        provinceName: data?.provinceName || allReportList[0].provinceName,
                        city: data?.city || allReportList[0].city,
                        cityName: data?.cityName || allReportList[0].cityName,
                    };
                }
                reportFn = firstReportApprove;
            } else if (btnKey === 'majorFaultReport:progressReportApplication') {
                // 续报
                data = {
                    ...data,
                    continueType: '1',
                    nowReportStatus: REPORT_STATUS.CONTINUE_WAIT_APPROVE,
                    disposeId: latestReport?.disposeId || undefined,
                };
                reportFn = continueReport;
            } else if (btnKey === 'majorFaultReport:finalReportApplication') {
                // 终报
                data = {
                    ...data,
                    continueType: '2',
                    nowReportStatus: REPORT_STATUS.FINAL_WAIT_APPROVE,
                    disposeId: latestReport?.disposeId || undefined,
                };
                reportFn = continueReport;
            } else if (
                btnKey === 'majorFaultReport:supplementalReportApplication' ||
                btnKey === 'majorFaultReport:supplementalReport' ||
                btnKey === 'majorFaultReport:progressReportSupplemental'
            ) {
                // 首报-追加上报申请 、首报-追加上报、续报-追加上报
                data = {
                    ...data,
                    nowReportStatus:
                        values.continueType === ReportType.FINAL_REPORT ? REPORT_STATUS.FINAL_WAIT_APPROVE : REPORT_STATUS.CONTINUE_WAIT_APPROVE,
                };
                reportFn = continueReport;
            } else if (btnKey === 'majorFaultReport:progressReportSupplementalApplication') {
                // 续报-追加上报申请
                data = {
                    ...data,
                    nowReportStatus:
                        values.continueType === ReportType.FINAL_REPORT ? REPORT_STATUS.FINAL_WAIT_APPROVE : REPORT_STATUS.CONTINUE_WAIT_APPROVE,
                    disposeId: latestReport?.disposeId || undefined,
                };
                reportFn = continueReport;
            } else if (btnKey === 'majorFaultReport:firstReportEditApplication') {
                // 首报-修改申请
                data = {
                    ...data,
                    nowReportStatus: REPORT_STATUS.FIRST_EDIT,
                    disposeId: latestReport?.disposeId || undefined,
                };
                if (allReportList?.length > 0) {
                    data = {
                        topic: allReportList[0].topic,
                        ...data,
                        specialty: data?.specialty || allReportList[0].specialty,
                        reportDescribe: data.reportDescribe || allReportList[0].reportDescribe,
                        province: data?.province || allReportList[0].province,
                        provinceName: data?.provinceName || allReportList[0].provinceName,
                        city: data?.city || allReportList[0].city,
                        cityName: data?.cityName || allReportList[0].cityName,
                        disposeId: latestReport?.disposeId || undefined,
                    };
                }
                reportFn = firstReportEdit;
            } else if (btnKey === 'majorFaultReport:firstReportEdit' || btnKey === 'majorFaultReport:firstReportEditApprove') {
                // 首报-修改、首报-修改审核
                data = {
                    ...data,
                    nowReportStatus: REPORT_STATUS.FIRST_EDIT_APPROVE,
                    disposeId: latestReport?.disposeId || undefined,
                };
                if (allReportList?.length > 0) {
                    data = {
                        topic: allReportList[0].topic,
                        ...data,
                        specialty: data?.specialty || allReportList[0].specialty,
                        reportDescribe: data.reportDescribe || allReportList[0].reportDescribe,
                        province: data?.province || allReportList[0].province,
                        provinceName: data?.provinceName || allReportList[0].provinceName,
                        city: data?.city || allReportList[0].city,
                        cityName: data?.cityName || allReportList[0].cityName,
                        disposeId: latestReport?.disposeId || undefined,
                    };
                }
                reportFn = firstReportEdit;
            } else if (btnKey === 'majorFaultReport:progressReportEditApplication') {
                // 续报-修改申请
                data = {
                    ...data,
                    nowReportStatus: REPORT_STATUS.CONTINUE_EDIT,
                    disposeId: latestReport?.disposeId || undefined,
                };
                reportFn = continueReportUpdate;
            } else if (btnKey === 'majorFaultReport:progressReportApprove') {
                // 续报-审核
                data = {
                    ...data,
                    nowReportStatus: 2,
                    disposeId: latestReport?.disposeId || undefined,
                };
                reportFn = continueReportApprove;
            } else if (btnKey === 'majorFaultReport:finalReportApprove') {
                // 终报-审核
                data = {
                    ...data,
                    continueType: '2',
                    nowReportStatus: 2,
                    disposeId: latestReport?.disposeId || undefined,
                };
                reportFn = continueReportApprove;
            } else if (btnKey === 'majorFaultReport:progressReportEdit') {
                // 续报-修改
                data = {
                    ...data,
                    nowReportStatus: REPORT_STATUS.CONTINUE_EDIT_APPROVE,
                    disposeId: latestReport?.disposeId || undefined,
                };
                reportFn = continueReportUpdate;
            } else if (btnKey === 'majorFaultReport:progressReportEditApprove') {
                // 续报-修改审核
                data = {
                    ...data,
                    nowReportStatus: REPORT_STATUS.CONTINUE_EDIT_APPROVE,
                    disposeId: latestReport?.disposeId || undefined,
                };
                reportFn = continueReportUpdate;
            } else if (btnKey === 'majorFaultReport:finalReportEditApplication') {
                // 终报-修改申请
                data = {
                    ...data,
                    nowReportStatus: REPORT_STATUS.FINAL_EDIT,
                    disposeId: latestReport?.disposeId || undefined,
                };
                reportFn = continueReportUpdate;
            } else if (btnKey === 'majorFaultReport:finalReportEdit' || btnKey === 'majorFaultReport:finalReportEditApprove') {
                // 终报修改、终报修改审核
                data = {
                    ...data,
                    nowReportStatus: REPORT_STATUS.FINAL_EDIT_APPROVE,
                    disposeId: latestReport?.disposeId || undefined,
                };
                reportFn = continueReportUpdate;
            }
        }
        console.log('调度工作台提交的数据', data);
        setLoading(true);
        const agentIframeRef = {
            current: null,
        };
        agentIframeRef.current = document.getElementById('AGENT-IFRAME');
        reportFn(data).then(
            (res: any) => {
                if (res && res.code === 200) {
                    if (flagId && !isFirstDraft && res.data?.syncState === 1) {
                        console.log('终报-同步成功');
                        onSyncNotice(flagId);
                    } else {
                        message.success('保存成功！');
                    }
                    if (onFinishProps) {
                        onFinishProps();
                    }
                    updateCardList?.();
                    if (agentIframeRef.current) {
                        getAgentFaultUsers(data).then((users) => {
                            const lastKey = getBtnKey();
                            agentIframeRef.current.contentWindow?.postMessage(
                                {
                                    type: 'SEND_AGENT_QUESTION',
                                    data: {
                                        // 这里的type是把智能体给的key再回传回去
                                        type: lastKey,
                                        // 这里的data是给智能体发消息的数据。成功或失败
                                        // 成功时： data: { ai_handle_status: 200 }
                                        // 失败时： data: { ai_handle_status: 非200的数值。约定500，ai_handle_message: "失败原因或后端返回报错，非200时必传" }
                                        data: {
                                            ai_handle_status: 200,
                                            ai_topic: data?.topic,
                                            ai_topic_alarm: data?.topic,
                                            ai_flagId: data?.flagId || res?.message,
                                            ai_standard_alarmId: data?.standardAlarmId,
                                            ai_notify_users: users || [],
                                        },
                                    },
                                },
                                '*',
                            );
                        });
                    }
                }
                setLoading(false);
            },
            (ex) => {
                message.error('上报失败！');
                setLoading(false);
                if (agentIframeRef.current) {
                    const lastKey = getBtnKey();
                    agentIframeRef.current.contentWindow?.postMessage(
                        {
                            type: 'SEND_AGENT_QUESTION',
                            data: {
                                type: lastKey,
                                data: {
                                    ai_handle_status: 500,
                                    ai_flagId: data?.flagId,
                                    ai_standard_alarmId: data?.standardAlarmId,
                                    ai_handle_message: ex,
                                },
                            },
                        },
                        '*',
                    );
                }
            },
        );
    };
    // 保存草稿
    const onSave = async () => {
        const values = form.getFieldsValue();
        const { notice } = values;
        console.log(values, '==val');

        const noticeData = notice
            ? {
                  reportNoticeError: undefined,
                  notificationType: notice.notificationType,
                  notificationDetailList: notice.notificationDetailList,
                  notificationTel: notice.notificationTel,
                  notificationUser: notice.notificationUser,
                  notificationContent: notice.notificationContent,
              }
            : undefined;
        let textareaValue = {};

        // 有flagId并且不是首报草稿时说明是续报
        if (flagId && !isFirstDraft) {
            // 续报的那几个文本框格式不一样
            textareaValue = {
                ...values.influenceScope,
                ...values.causesAnalysis,
                ...values.treatmentMeasure,
                ...values.businessImpactScope,
                ...values.businessRecoverProcess,
            };
        }

        const data = {
            ...values,
            failureTime: dayjs(values.failureTime).format('YYYY-MM-DD HH:mm:ss'),
            failureRecoverTime: values.failureRecoverTime && dayjs(values.failureRecoverTime).format('YYYY-MM-DD HH:mm:ss'),
            businessRecoverTime: values.businessRecoverTime && dayjs(values.businessRecoverTime).format('YYYY-MM-DD HH:mm:ss'),
            city: values.city?.value,
            cityName: values.city?.label,
            notice: undefined,
            ...noticeData,
            reportLevel: _.isArray(values.reportLevel) ? values.reportLevel?.join(',') : values.reportLevel,
            application: _.isArray(values.application) ? values.application.join('') : values.application,
            flagId,
            fileSessionId: values?.uploudFiles?.[0]?.fileSessionId,
            ...textareaValue,
            nowReportStatus: REPORT_STATUS.SAVE,
            source,
            standardAlarmId,
            disposeId,
            faultWorkNos: values?.faultWorkNoDetails?.map((item) => item.sheetNo),
            whetherNotifyGNOC: values?.notice?.whetherNotifyGNOC,
            syncState: sync.isSync,
        };

        let reportFn;

        // 有flagId并且不是首报草稿时说明是续报
        if (flagId && !isFirstDraft) {
            // 续报
            reportFn = continueReport;
        } else {
            // 首次上报
            reportFn = firstReport;
        }

        console.log(isWireless, '===is', props);
        if (isWireless) {
            // @ts-ignore
            data.whetherNotifyGNOC = false;
            // @ts-ignore
            data.faultDistinctionType = 2;
        } else {
            // @ts-ignore
            data.faultDistinctionType = dataSource?.faultDistinctionType || 1;
        }

        setLoading(true);
        reportFn(data).then(
            (res) => {
                if (res && res.code === 200) {
                    message.success('保存成功！');

                    if (onFinishProps) {
                        onFinishProps();
                    }
                    updateCardList?.();
                } else {
                    message.error(res.message || '保存失败！');
                }

                setLoading(false);
            },
            () => {
                message.error('保存失败！');
                setLoading(false);
            },
        );
    };

    const onReset = () => {
        const fieldsValue = form.getFieldsValue();
        const fieldsKeys = Object.keys(fieldsValue);
        const ifWireless = allReportList[0]?.faultDistinctionType === 2 && allReportList[0]?.source === 0;
        const fieldsValueEmpty = fieldsKeys.reduce((acc, cur) => {
            acc[cur] = undefined; // undefined赋值无效 null有些值清不掉  ''有些会报错
            return acc;
        }, {} as any);

        let city: any = {
            label: currentZone?.zoneName || parseUserInfo?.zones?.[0]?.zoneName,
            value: currentZone?.zoneId || parseUserInfo?.zones?.[0]?.zoneId,
        };
        if (isProvinceZone) {
            city = regionList && regionList[0] && { label: regionList[0].regionName, value: regionList[0].regionId };
        }

        const currProvince = provinceData.find((item) => item.regionId === provinceId);

        // 基本用户信息
        const baseUserInfo = {
            province: provinceId, // 用 state.provinceData.regionId也可以
            provinceName: currProvince?.regionName,
            reportUser: userId,
            reportUserName: userName,
            city,
            deptName,
            deptId: parseUserInfo.deptId,
            telephone: parseUserInfo.userMobile,
        };
        const noticeData = {
            notificationTel: '',
            notificationContent: '',
            notificationContentId: '',
            notificationUserInfos: [],
            // 有草稿的时候以草稿为准，草稿里的值是空的代表用户手动取消过，不是草稿状态的时候才默认选中短信和钉钉
            notificationType: [FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE, FAULT_NOTIFICATION_ENUM.DINGDING].join(','),
            notificationDetailList: defaultNotificationDetailList,
            whetherNotifyGNOC: !(flagId && !isFirstDraft),
            disableGNOC: !(flagId && !isFirstDraft),
        };

        // #region 回填字段"通知对象","临时手机号"
        if (!hasDraftStatus && _.isEmpty(noticeData.notificationUserInfos)) {
            Object.assign(noticeData, {
                notificationUserInfos: _.get(latestReport, 'faultNotice.notificationUserInfos') || [],
            });
        }

        if (!hasDraftStatus && !noticeData.notificationTel) {
            Object.assign(noticeData, {
                notificationTel: _.get(latestReport, 'faultNotice.notificationTel'),
            });
        }
        // #endregion
        // 设置通知类型的 初始值/草稿值
        setNoticeTypeData(noticeData);

        // const notificationTypeAndDetailList = {
        //     // 有草稿的时候以草稿为准，草稿里的值是空的代表用户手动取消过，不是草稿状态的时候才默认选中短信和钉钉
        //     notificationType: [FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE, FAULT_NOTIFICATION_ENUM.DINGDING].join(','),
        //     // 通知类型时间配置默认值
        //     notificationDetailList: DefaultNotificationDetailList,
        // };

        if (flagId && !isFirstDraft) {
            // 续报重置

            const {
                influenceScope,
                influenceScopeFollow,
                causesAnalysis,
                causesAnalysisFollow,
                treatmentMeasure,
                treatmentMeasureFollow,
                businessImpactScope,

                businessRecoverProcess,
                businessRecoverProcessFollow,
                uploudFiles,
                faultNotice,
                reportLevel,
                failureLevel,
                isEffectBusiness,
                businessRecoverTime,
                failureClass,
                faultWorkNoDetails,
                failureRecoverTime,
                continueType,
                rootSpecialty,
                actionScene,
            } = latestReport || {};
            // const noticeTemplateItem = state.noticeTemplateList.find((item: any) => item.templateType === NoticeTemplateType.RENEWAL) || {};

            const finalContinueReportDefaultValue = {
                influenceScope: {
                    influenceScope,
                    influenceScopeFollow: ifWireless ? 'no' : influenceScopeFollow || 'yes',
                },
                causesAnalysis: {
                    causesAnalysis,
                    causesAnalysisFollow: ifWireless ? 'no' : causesAnalysisFollow || 'no',
                },
                treatmentMeasure: {
                    treatmentMeasure,
                    treatmentMeasureFollow: ifWireless ? 'no' : treatmentMeasureFollow || 'no',
                },
                businessImpactScope: {
                    businessImpactScope,
                    businessImpactScopeFollow: ifWireless ? 'no' : continueType === ReportType.RENEWAL ? 'yes' : 'no',
                },
                businessRecoverProcess: {
                    businessRecoverProcess,
                    businessRecoverProcessFollow: ifWireless ? 'no' : continueType === ReportType.RENEWAL ? 'yes' : 'no',
                },
                continueType: continueType === '0' ? '1' : continueType,
                uploudFiles,
                reportUser: userId,
                reportUserName: userName,
                // 下面是需要特殊处理的上一次上报的值
                reportLevel: reportLevel?.split(','), // 后端传回来的是逗号分割的字符串
                failureLevel: failureLevel === '6' ? undefined : failureLevel,
                failureClassHis: failureClass,
                isEffectBusiness: isEffectBusiness || '0',
                businessRecoverTime: businessRecoverTime ? moment(businessRecoverTime) : undefined,
                faultWorkNoDetails,
                failureRecoverTime: failureRecoverTime ? moment(failureRecoverTime) : undefined, // 最新的有时间就用最新的，没有就undefined
                // 回填上一次的值
                notificationTelAndUserInfos: {
                    notificationTel: faultNotice.notificationTel,
                    notificationUserInfos: faultNotice.notificationUserInfos,
                },
                // notificationContent: noticeTemplateItem.templateContent,
                // notificationTemplate: noticeTemplateItem.value,
                notificationType: [FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE, FAULT_NOTIFICATION_ENUM.DINGDING].join(','),
                notificationDetailList: defaultNotificationDetailList, // 通知类型时间配置
                rootSpecialty,
                actionScene: actionScene || '',
            };
            console.log(finalContinueReportDefaultValue, 'finalFirstReportDefaultValue');

            form.setFieldsValue(finalContinueReportDefaultValue);

            reportNoticeRef.current?.handleReportTypeChange?.(ReportType.RENEWAL);

            if (finalContinueReportDefaultValue.continueType === '2' || (isMajor && btnKey?.indexOf('finalReport') >= 0)) {
                setIsContinueReportView(true);
            } else {
                setIsContinueReportView(false);
            }
        } else {
            // 首报重置
            const { faultNotice } = draftData || {};

            const thisNoticeTypeData = {
                notificationContent: faultNotice?.notificationContentId,
                notificationContentId: faultNotice?.notificationContentId,
                notificationType: [FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE, FAULT_NOTIFICATION_ENUM.DINGDING].join(','),
                notificationDetailList: defaultNotificationDetailList,
                notificationTel: '',
                notificationUserInfos: [],
                whetherNotifyGNOC: faultNotice?.whetherNotifyGNOC,
                disableGNOC: true,
            };
            const finalFirstReportDefaultValue = {
                ...fieldsValueEmpty,
                ...baseUserInfo,
                failureTime: moment(),
                reportLevel: [failureReportingLevelList[0].value],
                application: [failureReportingUsageList[0].value],
                faultWorkNoDetails: autoFpWorkSheets,
                relationAlarmDetails: [],
                faultWorkNos: autoFpWorkSheets.map((item: any) => item.sheetNo),
                flagId,
                failureLevel: '6', // 首报默认6 待确认
                influenceScope: ifWireless
                    ? 'XX省XX市XX县（区）4G BBU故障数量XX个，故障比例XX%；5G BBU故障数量XX个，故障比例XX%；物理站故障数量XX个，故障比例XX%'
                    : '',
                ...thisNoticeTypeData,

                // 默认其他
                failureClass: '20',
            };
            setNoticeTypeData(thisNoticeTypeData);
            // 首报
            form.setFieldsValue(finalFirstReportDefaultValue);
            reportNoticeRef.current?.handleReportTypeChange?.(ReportType.FIRST_NEWSPAPER);
            setRestType(!restType);
        }
        if (isWireless) {
            form.setFieldsValue({
                specialty: '11',
                influenceScope: 'XX省XX市XX县（区）4G BBU故障数量XX个，故障比例XX%；5G BBU故障数量XX个，故障比例XX%；物理站故障数量XX个，故障比例XX%',
            });
            onSpecialtyChange();
        }
    };
    // 触发提交
    const onSubmit = () => {
        form.submit();
    };

    const goBack = () => {
        history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report`);
    };

    // 渲染每一个card
    const faultListDom = () => {
        if (!allReportList?.length) {
            return null;
        }
        return allData.map((i) => {
            const { name, dataList, faultReportDetailCardId = '' } = i;

            return (
                <ItemCard
                    title={name}
                    extra={
                        !hideListButton && !frameVisible && name === '首报' ? (
                            <Button type="primary" onClick={goToListPage || goBack} style={{ marginLeft: 20 }}>
                                故障查询
                            </Button>
                        ) : null
                    }
                    faultReportDetailCardId={faultReportDetailCardId}
                >
                    <Row gutter={[16, 16]}>
                        {dataList.map((item: any, index) => {
                            return item?.hidden ? null : (
                                <Col span={item?.span ? item?.span : 8} key={index}>
                                    <LayoutItem name={item?.name} value={item?.value}>
                                        {!!item?.children && (
                                            <div style={{ width: item?.name ? 'calc(100% - 150px)' : '100%' }}>{item?.children}</div>
                                        )}
                                        <FileDown fileList={item?.uploudFiles} />
                                    </LayoutItem>
                                </Col>
                            );
                        })}
                    </Row>
                </ItemCard>
            );
        });
    };

    // 获取已提交的所有数据
    const getAllReportListData = async () => {
        if (flagId) {
            const data = {
                flagId,
                reportUser: userId,
            };

            setLoadingData(true);
            const res = await getAllReportList(data);
            setLoadingData(false);
            if (res && res.data) {
                const finalAllData = [...res.data];
                let draft = {
                    publicSentiment: {},
                };
                // 如果是草稿状态，就把最后一个数据拿出来存为草稿数据，其余的都是已经提交的数据
                if (hasDraftStatus) {
                    if (res.data.length > 0) {
                        draft = finalAllData.pop();
                    }
                }
                // 客服舆情专业下 新增数据在 publicSentiment 字段中
                const newDraft = { ...draft, ...draft.publicSentiment };
                setDraftData(newDraft);
                setAllReportList(finalAllData.length > 0 ? finalAllData : [newDraft]);
            }
        }
    };

    // 获取归属省份
    const getProvinceData = async () => {
        // const zoneId = systemInfo.currentZone?.zoneId;

        const data = {
            creator: userId,
            // provinceId: zoneId,
        };
        const res = await getProvinceList(data);
        if (res && Array.isArray(res)) {
            const list = res;
            setProvinceData(list);
        }
    };
    const getDepts = async () => {
        const data = {
            deptId: parseUserInfo.deptId,
        };
        const res = await getDeptsInfo(data);
        // eslint-disable-next-line no-underscore-dangle
        if (res && res._embedded && res._embedded.deptResourceList) {
            // eslint-disable-next-line no-underscore-dangle
            const deptInfo = res._embedded.deptResourceList.find((item) => item.deptId === parseUserInfo.deptId);
            setDeptName(deptInfo?.deptName);
        }
    };

    // 获取初始化数据
    useDebounceEffect(() => {
        if (flagIdReady) {
            getAllReportListData();
            getProvinceData();
            getDepts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flagId, hasDraftStatus, flagIdReady]);

    // 获取自动上报的关联工单, 用于没有存过草稿的自动上报首次保存或提交
    useEffect(() => {
        if (!flagId) {
            getAutoFpWorkSheets({ standardAlarmId, source, reportUser: userId }).then((res) => {
                if (res && res.data) {
                    const { data } = res;
                    setAutoFpWorkSheets(data?.autoFpWorkSheets || []);
                    setCransData(data?.trunkCable);
                    if (data?.flagId && !isWireless) {
                        setFlagId(data?.flagId);
                        setHasDraftStatus(true);
                        setIsFirstDraft(true);
                        setFlagIdReady(true);
                    }
                }
            });
        }
        setFlagIdReady(true);
    }, [standardAlarmId, flagId]);

    useEffect(() => {
        if (document.getElementById('fault-report-form-container') && infoBoxHeight > 0) {
            if (document.getElementById(FinalReportId)) {
                if (btnKey === 'faultReport:upload') {
                    document.getElementById(FinalReportId)?.scrollIntoView(true);
                    (document.getElementById(FinalReportId) as any).scrollTop = infoBoxHeight + 205;
                } else {
                    document.getElementById(FinalReportId)?.scrollIntoView(true);
                }
            } else if (document.getElementById('fault-report-form-container')) {
                const lastHeight = btnKey === 'faultReport:upload' ? 355 : 15;
                (document.getElementById('fault-report-form-container') as any).scrollTop = infoBoxHeight + lastHeight;
            }
        }
        if (windowTheme === 'white' || theme === 'white') {
            (document.querySelector('.fault-report-modal-white') as any).scrollTop = infoBoxHeight;
        }
    }, [infoBoxHeight]);

    useLayoutEffect(() => {
        setInfoBoxHeight(document.getElementById('form-container-info-box')?.offsetHeight || 0);
    });

    // 获取新流程默认模板
    const getDefaultTemplateId = (faultId: string) => {
        let defaultId = faultId;
        switch (btnKey) {
            case 'majorFaultReport:firstReportEditApplication':
            case 'majorFaultReport:firstReportEdit':
                defaultId = '6';
                break;
            case 'majorFaultReport:progressReportEditApplication':
            case 'majorFaultReport:progressReportEdit':
                defaultId = '7';
                break;
            case 'majorFaultReport:finalReportEditApplication':
            case 'majorFaultReport:finalReportEdit':
                defaultId = '8';
                break;
            default:
                break;
        }
        return defaultId;
    };

    // 获取首报的默认值
    const getDefaultData = () => {
        let manualDefaultData: any = {};
        if (isManual) {
            manualDefaultData = {
                notice: {
                    notificationTel: ruleConfig?.firstNotificationTel,
                    notificationContent: ruleConfig?.firstNotificationContent,
                    notificationUserInfos: ruleConfig?.firstNotificationUser || [],
                    notificationType: ruleConfig?.firstNotificationType,
                    notificationDetailList: ruleConfig?.firstNotificationDetailList,
                },
            };
        } else {
            const lastReport = allReportList?.length > 0 ? allReportList?.[allReportList?.length - 1] : {};
            manualDefaultData = {
                reportDescribe: autoFaultReportDerivedRule?.whetherFirstReportDescribeLLM
                    ? agentData?.reportDescribe
                    : lastReport?.reportDescribe || '',
                influenceScope: autoFaultReportDerivedRule?.whetherFirstInfluenceScopeLLM
                    ? agentData?.influenceScope
                    : lastReport?.influenceScope || '',
                causesAnalysis: autoFaultReportDerivedRule?.whetherFirstCausesAnalysisLLM
                    ? agentData?.causesAnalysis
                    : lastReport?.causesAnalysis || '',
                treatmentMeasure: autoFaultReportDerivedRule?.whetherFirstTreatmentMeasureLLM
                    ? agentData?.treatmentMeasure
                    : lastReport?.treatmentMeasure || '',
                notice: dataSource?.faultNotice,
            };
        }
        return manualDefaultData;
    };

    const getDefaultFlowData = (code: string) => {
        // 首报申请，首报申请阶段取消上报按钮，又取消"取消上报"，则相当于走首报申请逻辑
        if (btnKey === 'majorFaultReport:firstReportApplication' || btnKey === 'faultReport:firstReportApplicationCancel') {
            const lastReport = allReportList?.length > 0 ? allReportList?.[allReportList?.length - 1] : {};
            return lastReport?.[code] || '';
        }
        if (!flowData) {
            return '';
        }
        return flowData[code] || '';
    };

    const convertIsEffectBusiness = (isEffectBusiness: string) => {
        return isEffectBusiness === '是' ? '1' : '0';
    };

    const convertFailureLevel = (failureLevel: any) => {
        if (failureLevel === '6') {
            return '';
        }
        return failureLevel || '';
    };

    // 获取续报的默认值
    const getContinueDefaultData = () => {
        let manualDefaultData: any = {};
        if (isManual) {
            manualDefaultData = {
                failureLevel:
                    ruleConfig?.whetherContinueFailureLevelLLM && agentData?.failureLevel
                        ? convertFailureLevel(agentData?.failureLevel)
                        : convertFailureLevel(flowData?.failureLevel), // 默认待确认
                rootSpecialty:
                    ruleConfig?.whetherContinueRootSpecialtyLLM && agentData?.rootSpecialty
                        ? agentData?.rootSpecialty
                        : flowData?.rootSpecialty || '',
                isEffectBusiness: ruleConfig?.whetherContinueIsEffectLLM
                    ? agentData?.isEffectBusiness
                    : convertIsEffectBusiness(flowData?.isEffectBusiness || ''),
                influenceScope: ruleConfig?.whetherContinueInfluenceScopeLLM
                    ? { influenceScope: agentData?.influenceScope, influenceScopeFollow: ruleConfig?.whetherContinueInfluenceScopeLLM ? 'no' : 'yes' }
                    : {
                          influenceScope: getDefaultFlowData('influenceScope'),
                          influenceScopeFollow: ruleConfig?.continueInfluenceScope ? 'no' : 'yes',
                      },
                businessImpactScope: ruleConfig?.whetherContinueBusinessImpactScopeLLM
                    ? {
                          businessImpactScope: agentData?.businessImpactScope,
                          businessImpactScopeFollow: ruleConfig?.whetherContinueBusinessImpactScopeLLM ? 'no' : 'yes',
                      }
                    : {
                          businessImpactScope: getDefaultFlowData('businessImpactScope'),
                          businessImpactScopeFollow: ruleConfig?.continueBusinessImpactScope ? 'no' : 'yes',
                      },
                causesAnalysis: ruleConfig?.whetherContinueCausesAnalysisLLM
                    ? { causesAnalysis: agentData?.causesAnalysis, causesAnalysisFollow: ruleConfig?.whetherContinueCausesAnalysisLLM ? 'no' : 'yes' }
                    : {
                          causesAnalysis: getDefaultFlowData('causesAnalysis'),
                          causesAnalysisFollow: ruleConfig?.continueCausesAnalysis ? 'no' : 'yes',
                      },
                treatmentMeasure: ruleConfig?.whetherContinueTreatmentMeasureLLM
                    ? {
                          treatmentMeasure: agentData?.treatmentMeasure,
                          treatmentMeasureFollow: ruleConfig?.whetherContinueTreatmentMeasureLLM ? 'no' : 'yes',
                      }
                    : {
                          treatmentMeasure: getDefaultFlowData('treatmentMeasure'),
                          treatmentMeasureFollow: ruleConfig?.continueTreatmentMeasure ? 'no' : 'yes',
                      },
                businessRecoverProcess: ruleConfig?.whetherContinueBusinessRecoverProcessLLM
                    ? {
                          businessRecoverProcess: agentData?.businessRecoverProcess,
                          businessRecoverProcessFollow: ruleConfig?.whetherContinueBusinessRecoverProcessLLM ? 'no' : 'yes',
                      }
                    : {
                          businessRecoverProcess: getDefaultFlowData('businessRecoverProcess'),
                          businessRecoverProcessFollow: autoFaultReportDerivedRule?.continueBusinessRecoverProcess ? 'no' : 'yes',
                      },
                notice: flowData?.faultNotice,
            };
        } else {
            manualDefaultData = {
                failureLevel:
                    autoFaultReportDerivedRule?.whetherContinueFailureLevelLLM && agentData?.failureLevel
                        ? convertFailureLevel(agentData?.failureLevel)
                        : convertFailureLevel(flowData?.failureLevel), // 默认待确认
                rootSpecialty:
                    autoFaultReportDerivedRule?.whetherContinueRootSpecialtyLLM && agentData?.rootSpecialty
                        ? agentData?.rootSpecialty
                        : flowData?.rootSpecialty || '',
                isEffectBusiness: autoFaultReportDerivedRule?.whetherContinueIsEffectLLM
                    ? agentData?.isEffectBusiness
                    : convertIsEffectBusiness(flowData?.isEffectBusiness || ''),
                influenceScope: autoFaultReportDerivedRule?.whetherContinueInfluenceScopeLLM
                    ? {
                          influenceScope: agentData?.influenceScope,
                          influenceScopeFollow: autoFaultReportDerivedRule?.whetherContinueInfluenceScopeLLM ? 'no' : 'yes',
                      }
                    : {
                          influenceScope: getDefaultFlowData('influenceScope'),
                          influenceScopeFollow: autoFaultReportDerivedRule?.continueInfluenceScope ? 'no' : 'yes',
                      },
                businessImpactScope: autoFaultReportDerivedRule?.whetherContinueBusinessImpactScopeLLM
                    ? {
                          businessImpactScope: agentData?.businessImpactScope,
                          businessImpactScopeFollow: autoFaultReportDerivedRule?.whetherContinueBusinessImpactScopeLLM ? 'no' : 'yes',
                      }
                    : {
                          businessImpactScope: getDefaultFlowData('businessImpactScope'),
                          businessImpactScopeFollow: autoFaultReportDerivedRule?.continueBusinessImpactScope ? 'no' : 'yes',
                      },
                causesAnalysis: autoFaultReportDerivedRule?.whetherContinueCausesAnalysisLLM
                    ? {
                          causesAnalysis: agentData?.causesAnalysis,
                          causesAnalysisFollow: autoFaultReportDerivedRule?.whetherContinueCausesAnalysisLLM ? 'no' : 'yes',
                      }
                    : {
                          causesAnalysis: getDefaultFlowData('causesAnalysis'),
                          causesAnalysisFollow: autoFaultReportDerivedRule?.continueCausesAnalysis ? 'no' : 'yes',
                      },
                treatmentMeasure: autoFaultReportDerivedRule?.whetherContinueTreatmentMeasureLLM
                    ? {
                          treatmentMeasure: agentData?.treatmentMeasure,
                          treatmentMeasureFollow: autoFaultReportDerivedRule?.whetherContinueTreatmentMeasureLLM ? 'no' : 'yes',
                      }
                    : {
                          treatmentMeasure: getDefaultFlowData('treatmentMeasure'),
                          treatmentMeasureFollow: autoFaultReportDerivedRule?.continueTreatmentMeasure ? 'no' : 'yes',
                      },
                businessRecoverProcess: autoFaultReportDerivedRule?.whetherContinueBusinessRecoverProcessLLM
                    ? {
                          businessRecoverProcess: agentData?.businessRecoverProcess,
                          businessRecoverProcessFollow: autoFaultReportDerivedRule?.whetherContinueBusinessRecoverProcessLLM ? 'no' : 'yes',
                      }
                    : {
                          businessRecoverProcess: getDefaultFlowData('businessRecoverProcess'),
                          businessRecoverProcessFollow: autoFaultReportDerivedRule?.continueBusinessRecoverProcess ? 'no' : 'yes',
                      },
                notice: flowData?.faultNotice,
            };
        }
        return manualDefaultData;
    };

    // 获取终报的默认值
    const getFinalDefaultData = () => {
        let manualDefaultData: any = {};
        if (isManual) {
            manualDefaultData = {
                failureLevel:
                    ruleConfig?.whetherFinalFailureLevelLLM && agentData?.failureLevel
                        ? convertFailureLevel(agentData?.failureLevel)
                        : convertFailureLevel(flowData?.failureLevel), // 默认待确认
                rootSpecialty:
                    ruleConfig?.whetherFinalRootSpecialtyLLM && agentData?.rootSpecialty ? agentData?.rootSpecialty : flowData?.rootSpecialty || '',
                isEffectBusiness: ruleConfig?.whetherFinalIsEffectLLM
                    ? agentData?.isEffectBusiness
                    : convertIsEffectBusiness(flowData?.isEffectBusiness || ''),
                influenceScope: ruleConfig?.whetherFinalInfluenceScopeLLM
                    ? { influenceScope: agentData?.influenceScope, influenceScopeFollow: ruleConfig?.whetherContinueInfluenceScopeLLM ? 'no' : 'yes' }
                    : {
                          influenceScope: getDefaultFlowData('influenceScope'),
                          influenceScopeFollow: ruleConfig?.finalInfluenceScope ? 'no' : 'yes',
                      },
                businessImpactScope: ruleConfig?.whetherFinalBusinessImpactScopeLLM
                    ? {
                          businessImpactScope: agentData?.businessImpactScope,
                          businessImpactScopeFollow: ruleConfig?.whetherContinueBusinessImpactScopeLLM ? 'no' : 'yes',
                      }
                    : {
                          businessImpactScope: getDefaultFlowData('businessImpactScope'),
                          businessImpactScopeFollow: ruleConfig?.finalBusinessImpactScope ? 'no' : 'yes',
                      },
                causesAnalysis: ruleConfig?.whetherFinalCausesAnalysisLLM
                    ? { causesAnalysis: agentData?.causesAnalysis, causesAnalysisFollow: ruleConfig?.whetherContinueCausesAnalysisLLM ? 'no' : 'yes' }
                    : {
                          causesAnalysis: getDefaultFlowData('causesAnalysis'),
                          causesAnalysisFollow: ruleConfig?.finalCausesAnalysis ? 'no' : 'yes',
                      },
                treatmentMeasure: ruleConfig?.whetherFinalTreatmentMeasureLLM
                    ? {
                          treatmentMeasure: agentData?.treatmentMeasure,
                          treatmentMeasureFollow: ruleConfig?.whetherContinueTreatmentMeasureLLM ? 'no' : 'yes',
                      }
                    : {
                          treatmentMeasure: getDefaultFlowData('treatmentMeasure'),
                          treatmentMeasureFollow: ruleConfig?.finalTreatmentMeasure ? 'no' : 'yes',
                      },
                businessRecoverProcess: ruleConfig?.whetherFinalBusinessRecoverProcessLLM
                    ? {
                          businessRecoverProcess: agentData?.businessRecoverProcess,
                          businessRecoverProcessFollow: ruleConfig?.whetherFinalBusinessRecoverProcessLLM ? 'no' : 'yes',
                      }
                    : {
                          businessRecoverProcess: getDefaultFlowData('businessRecoverProcess'),
                          businessRecoverProcessFollow: ruleConfig?.continueBusinessRecoverProcess ? 'no' : 'yes',
                      },
                notice: flowData?.faultNotice,
            };
        } else {
            manualDefaultData = {
                failureLevel:
                    autoFaultReportDerivedRule?.whetherFinalFailureLevelLLM && agentData?.failureLevel
                        ? convertFailureLevel(agentData?.failureLevel)
                        : convertFailureLevel(flowData?.failureLevel), // 默认待确认
                rootSpecialty:
                    autoFaultReportDerivedRule?.whetherFinalRootSpecialtyLLM && agentData?.rootSpecialty
                        ? agentData?.rootSpecialty
                        : flowData?.rootSpecialty || '',
                isEffectBusiness: autoFaultReportDerivedRule?.whetherFinalIsEffectLLM
                    ? agentData?.isEffectBusiness
                    : convertIsEffectBusiness(flowData?.isEffectBusiness || ''),
                influenceScope: autoFaultReportDerivedRule?.whetherFinalInfluenceScopeLLM
                    ? {
                          influenceScope: agentData?.influenceScope,
                          influenceScopeFollow: autoFaultReportDerivedRule?.whetherContinueInfluenceScopeLLM ? 'no' : 'yes',
                      }
                    : {
                          influenceScope: getDefaultFlowData('influenceScope'),
                          influenceScopeFollow: autoFaultReportDerivedRule?.finalInfluenceScope ? 'no' : 'yes',
                      },
                businessImpactScope: autoFaultReportDerivedRule?.whetherFinalBusinessImpactScopeLLM
                    ? {
                          businessImpactScope: agentData?.businessImpactScope,
                          businessImpactScopeFollow: autoFaultReportDerivedRule?.whetherContinueBusinessImpactScopeLLM ? 'no' : 'yes',
                      }
                    : {
                          businessImpactScope: getDefaultFlowData('businessImpactScope'),
                          businessImpactScopeFollow: autoFaultReportDerivedRule?.finalBusinessImpactScope ? 'no' : 'yes',
                      },
                causesAnalysis: autoFaultReportDerivedRule?.whetherFinalCausesAnalysisLLM
                    ? {
                          causesAnalysis: agentData?.causesAnalysis,
                          causesAnalysisFollow: autoFaultReportDerivedRule?.whetherContinueCausesAnalysisLLM ? 'no' : 'yes',
                      }
                    : {
                          causesAnalysis: getDefaultFlowData('causesAnalysis'),
                          causesAnalysisFollow: autoFaultReportDerivedRule?.finalCausesAnalysis ? 'no' : 'yes',
                      },
                treatmentMeasure: autoFaultReportDerivedRule?.whetherFinalTreatmentMeasureLLM
                    ? {
                          treatmentMeasure: agentData?.treatmentMeasure,
                          treatmentMeasureFollow: autoFaultReportDerivedRule?.whetherContinueTreatmentMeasureLLM ? 'no' : 'yes',
                      }
                    : {
                          treatmentMeasure: getDefaultFlowData('treatmentMeasure'),
                          treatmentMeasureFollow: autoFaultReportDerivedRule?.finalTreatmentMeasure ? 'no' : 'yes',
                      },
                businessRecoverProcess: autoFaultReportDerivedRule?.whetherFinalBusinessRecoverProcessLLM
                    ? {
                          businessRecoverProcess: agentData?.businessRecoverProcess,
                          businessRecoverProcessFollow: autoFaultReportDerivedRule?.whetherFinalBusinessRecoverProcessLLM ? 'no' : 'yes',
                      }
                    : {
                          businessRecoverProcess: getDefaultFlowData('businessRecoverProcess'),
                          businessRecoverProcessFollow: autoFaultReportDerivedRule?.continueBusinessRecoverProcess ? 'no' : 'yes',
                      },
                notice: flowData?.faultNotice,
            };
        }
        return manualDefaultData;
    };

    // 设置默认值
    useDebounceEffect(
        () => {
            if (loadingData) return;
            const ifWireless = allReportList[0]?.faultDistinctionType === 2 && allReportList[0]?.source === 0;
            const lastReport = allReportList?.length > 0 ? allReportList?.[allReportList?.length - 1] : {};
            let city: any = {
                label: currentZone?.zoneName || parseUserInfo?.zones?.[0]?.zoneName,
                value: currentZone?.zoneId || parseUserInfo?.zones?.[0]?.zoneId,
            };
            if (isProvinceZone) {
                city = regionList && regionList[0] && { label: regionList[0].regionName, value: regionList[0].regionId };
            }
            if (dataSource?.city) {
                city = {
                    label: dataSource.cityName,
                    value: dataSource.cityId,
                };
            }
            // 回填上一环节地市
            if (lastReport?.city) {
                city = {
                    label: lastReport?.cityName || '',
                    value: lastReport?.city || '',
                };
            }

            console.log(draftData, city);
            const currProvince = provinceData.find((item) => item.regionId === provinceId);

            let faultNotice: any = {};
            if (isMajor && allReportList?.length > 0) {
                // 重大故障上报回填通知信息
                faultNotice = allReportList?.[allReportList?.length - 1]?.faultNotice || {};
                faultNotice.notificationContentId = getDefaultTemplateId(faultNotice.notificationContentId);
            } else {
                faultNotice = draftData?.faultNotice || {};
                faultNotice.notificationContentId = getDefaultTemplateId(faultNotice.notificationContentId);
            }
            // 有模版默认值时，回填默认值
            if (flowData?.faultNotice) {
                faultNotice = flowData?.faultNotice || {};
                faultNotice.notificationContentId = getDefaultTemplateId(faultNotice.notificationContentId);
            }
            let lastNotificationDetailList = faultNotice?.notificationDetailList || defaultNotificationDetailList;
            if (
                isMajor &&
                btnKey?.indexOf('majorFaultReport:firstReportApplication') < 0 &&
                btnKey?.indexOf('faultReport:firstReportApplicationCancel') < 0
            ) {
                // 重大故障上报回填通知信息
                lastNotificationDetailList = faultNotice?.notificationDetailList;
            }
            const noticeData = {
                notificationTel: faultNotice?.notificationTel,
                notificationContent: faultNotice?.notificationContent,
                notificationContentId: faultNotice?.notificationContentId,
                notificationUserInfos: faultNotice?.notificationUserInfos || [],
                // 有草稿的时候以草稿为准，草稿里的值是空的代表用户手动取消过，不是草稿状态的时候才默认选中短信和钉钉
                notificationType:
                    hasDraftStatus ||
                    (isMajor &&
                        btnKey?.indexOf('majorFaultReport:firstReportApplication') < 0 &&
                        btnKey?.indexOf('faultReport:firstReportApplicationCancel') < 0)
                        ? faultNotice?.notificationType
                        : [FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE, FAULT_NOTIFICATION_ENUM.DINGDING].join(','),
                notificationDetailList: lastNotificationDetailList,
                whetherNotifyGNOC: faultNotice?.whetherNotifyGNOC || !(flagId && !isFirstDraft),
                disableGNOC: faultNotice?.disableGNOC || !(flagId && !isFirstDraft),
            };

            // #region 回填字段"通知对象","临时手机号"
            if (!hasDraftStatus && _.isEmpty(noticeData.notificationUserInfos)) {
                Object.assign(noticeData, {
                    notificationUserInfos: _.get(latestReport, 'faultNotice.notificationUserInfos') || [],
                });
            }

            if (!hasDraftStatus && !noticeData.notificationTel) {
                Object.assign(noticeData, {
                    notificationTel: _.get(latestReport, 'faultNotice.notificationTel'),
                });
            }
            /**
             * 最新上报状态 1 首报草稿,2 首报上报,3续报草稿,4 续报上报,5终报草稿,6终报上报
             */
            if (
                (dataSource && dataSource.source === 1 && +dataSource.latestReportStatus !== 1 && !isMajor) ||
                btnKey === 'majorFaultReport:firstReportApplication' ||
                btnKey === 'faultReport:firstReportApplicationCancel'
            ) {
                onSpecialtyChange();
            }
            if (draftData?.reportStatusName?.includes('草稿')) {
                setTimeout(() => {
                    onSpecialtyChange('draft');
                }, 500);
                city = {
                    label: draftData.cityName,
                    value: draftData.city,
                };
            }

            // 有附件都显示
            form.setFieldsValue({
                uploudFiles: latestReport?.uploudFiles,
            });

            // #endregion
            // 设置通知类型的 初始值/草稿值
            setNoticeTypeData(noticeData);
            // 没有flagId说明是正常首报
            if (!flagId) {
                // 手工上报首报回填规则默认值
                const manualDefaultData = getDefaultData();

                form.setFieldsValue({
                    ...dataSource,
                    specialty: dataSource?.professionalType ? `${dataSource?.professionalType}` : dataSource?.specialty || undefined,
                    subSpecialty: dataSource?.subSpecialty || undefined,
                    notificationDetailList: defaultNotificationDetailList, // 通知类型时间配置
                    province: provinceId,
                    provinceName: currProvince?.regionName,
                    reportUser: userId,
                    reportUserName: userName,
                    city,
                    deptName,
                    deptId: parseUserInfo.deptId,
                    telephone: parseUserInfo.userMobile,
                    failureTime: dataSource?.failureTime ? moment(dataSource?.failureTime) : moment(),
                    reportLevel: faultReportDerivedRule?.ruleType === 1 ? [failureReportingLevelList[0].value] : [failureReportingLevelList[1].value],
                    failureLevel: autoFaultReportDerivedRule?.whetherFirstFailureLevelLLM && agentData?.failureLevel ? agentData?.failureLevel : '', // 默认待确认
                    rootSpecialty:
                        autoFaultReportDerivedRule?.whetherFirstRootSpecialtyLLM && agentData?.rootSpecialty ? agentData?.rootSpecialty : undefined,
                    application: [failureReportingUsageList[0].value],
                    faultWorkNoDetails: autoFpWorkSheets,
                    // relationStandardAlarmIds: autoFpWorkSheets,
                    faultWorkNos: autoFpWorkSheets.map((item) => item.sheetNo),
                    // 干线光缆下自动填充 传输系统 传输段 光缆段 字段
                    transSystem: cableData?.transSystemName,
                    transSegId: cableData?.transSegId,
                    reuseTransSeg: cableData?.cableSegment,
                    // 默认其他
                    failureClass: '20',
                    notice: { ...noticeData },
                    ...manualDefaultData,
                });
                if (isWireless) {
                    form.setFieldsValue({
                        specialty: '11',
                        influenceScope:
                            'XX省XX市XX县（区）4G BBU故障数量XX个，故障比例XX%；5G BBU故障数量XX个，故障比例XX%；物理站故障数量XX个，故障比例XX%',
                    });
                    onSpecialtyChange();
                }
            }
            // 草稿状态是首报草稿的时候，是草稿首报
            else if (isFirstDraft) {
                // 上报人 省份 部门 联系方式等信息均为当前账号信息
                // 防止后期增加可修改其它用户的上报信息的需求，所以这里和上一个if分开写

                const data = {
                    notificationDetailList: defaultNotificationDetailList, // 通知类型时间配置
                    ...draftData,
                    province: provinceId,
                    provinceName: currProvince?.regionName,
                    reportUser: userId,
                    reportUserName: userName,
                    city,
                    deptName,
                    failureLevel: draftData?.failureLevel, // 默认待确认
                    deptId: parseUserInfo.deptId,
                    telephone: parseUserInfo.userMobile,
                    failureTime: draftData?.failureTime ? moment(draftData?.failureTime) : moment(), // 草稿里有时间就用草稿里的，没有就用当前时间
                    failureRecoverTime: draftData?.failureRecoverTime ? moment(draftData?.failureRecoverTime) : undefined, // 草稿里有时间就用草稿里的，没有就undefined
                    businessRecoverTime: draftData?.businessRecoverTime ? moment(draftData?.businessRecoverTime) : undefined,
                    reportLevel: draftData?.reportLevel?.split(','), // 后端传回来的是逗号分割的字符串
                    notice: { ...noticeData },
                };

                console.log('草稿数据', draftData);
                form.setFieldsValue(data);
            } else if (!isFirstDraft && btnKey?.indexOf('firstReport') >= 0) {
                // 回填规则默认值
                let manualDefaultData = {};
                if (btnKey === 'majorFaultReport:firstReportApplication' || btnKey === 'faultReport:firstReportApplicationCancel') {
                    manualDefaultData = getDefaultData();
                }

                // 上报人 省份 部门 联系方式等信息均为当前账号信息
                // 防止后期增加可修改其它用户的上报信息的需求，所以这里和上一个if分开写
                const { influenceScope, influenceScopeFollow } = dataSource;
                const data = {
                    influenceScope,
                    influenceScopeFollow,
                    notificationDetailList: defaultNotificationDetailList, // 通知类型时间配置
                    ...lastReport,
                    province: provinceId,
                    provinceName: currProvince?.regionName,
                    reportUser: userId,
                    reportUserName: userName,
                    city,
                    deptName,
                    failureLevel: lastReport?.failureLevel, // 默认待确认
                    deptId: parseUserInfo.deptId,
                    telephone: parseUserInfo.userMobile,
                    failureTime: lastReport?.failureTime ? moment(lastReport?.failureTime) : moment(), // 草稿里有时间就用草稿里的，没有就用当前时间
                    failureRecoverTime: lastReport?.failureRecoverTime ? moment(lastReport?.failureRecoverTime) : undefined, // 草稿里有时间就用草稿里的，没有就undefined
                    businessRecoverTime: lastReport?.businessRecoverTime ? moment(lastReport?.businessRecoverTime) : undefined,
                    reportLevel: lastReport?.reportLevel?.split(','), // 后端传回来的是逗号分割的字符串
                    notice: { ...noticeData },
                    ...manualDefaultData,
                };

                console.log('回填数据', lastReport);
                form.setFieldsValue(data);
            }
            // 续报或终报有草稿
            else if ((isContinueDraft || isFinalDraft) && !isMajor) {
                const {
                    influenceScope,
                    influenceScopeFollow,
                    causesAnalysis,
                    causesAnalysisFollow,
                    treatmentMeasure,
                    treatmentMeasureFollow,
                    businessImpactScope,
                    businessImpactScopeFollow,
                    businessRecoverProcess,
                    businessRecoverProcessFollow,
                } = draftData;
                const textareaValue = {
                    influenceScope: {
                        influenceScope,
                        influenceScopeFollow,
                    },
                    causesAnalysis: {
                        causesAnalysis,
                        causesAnalysisFollow,
                    },
                    treatmentMeasure: {
                        treatmentMeasure,
                        treatmentMeasureFollow,
                    },
                    businessImpactScope: {
                        businessImpactScope,
                        businessImpactScopeFollow,
                    },
                    businessRecoverProcess: {
                        businessRecoverProcess,
                        businessRecoverProcessFollow,
                    },
                };

                form.setFieldsValue({
                    notificationDetailList: defaultNotificationDetailList, // 通知类型时间配置
                    ...draftData,
                    notice: { ...noticeData },
                    reportUser: userId,
                    reportUserName: userName,
                    telephone: parseUserInfo?.userMobile || '',
                    reportLevel: draftData?.reportLevel?.split(','), // 后端传回来的是逗号分割的字符串
                    ...textareaValue,
                    failureClassHis: draftData?.failureClass,
                    failureRecoverTime: draftData?.failureRecoverTime ? moment(draftData?.failureRecoverTime) : undefined, // 草稿里有时间就用草稿里的，没有就undefined
                    businessRecoverTime: draftData?.businessRecoverTime ? moment(draftData?.businessRecoverTime) : undefined,
                });
            }
            /* else if (isFinalReport && !isMajor) {
                // 终报上报状态，此时可以追加或删除附件,所以要回填附件值
                form.setFieldsValue({
                    uploudFiles: latestReport?.uploudFiles,
                });
            } */
            // 正常的续报或终报
            else {
                let lastContinueType = btnKey?.indexOf('finalReport') >= 0 ? continueReportTypeList[1].value : continueReportTypeList[0].value;
                // 新故障上报终报:最起初规划btnKey的问题，只能接着用
                if (btnKey === 'majorFaultReport:progressReportSupplemental') {
                    lastContinueType = continueReportTypeList[1].value;
                }
                // 回填规则默认值
                let manualDefaultData = {};
                if (
                    btnKey === 'majorFaultReport:supplementalReportApplication' ||
                    btnKey === 'majorFaultReport:supplementalReport' ||
                    btnKey === 'majorFaultReport:progressReportSupplementalApplication' ||
                    btnKey === 'majorFaultReport:progressReportSupplemental' ||
                    btnKey === 'faultReport:progressReport' ||
                    btnKey === 'majorFaultReport:progressReportApplication'
                ) {
                    if (curContinueTypeRef.current === '2') {
                        manualDefaultData = getFinalDefaultData();
                    } else {
                        manualDefaultData = getContinueDefaultData();
                    }
                } else if (btnKey === 'faultReport:finalReport' || btnKey === 'majorFaultReport:finalReportApplication') {
                    if (curContinueTypeRef.current === '1') {
                        manualDefaultData = getContinueDefaultData();
                    } else {
                        manualDefaultData = getFinalDefaultData();
                    }
                }
                form.setFieldsValue({
                    influenceScope: {
                        influenceScope: latestReport?.influenceScope,
                        influenceScopeFollow: ifWireless ? 'no' : latestReport?.influenceScopeFollow || 'yes',
                    },
                    causesAnalysis: {
                        causesAnalysis: latestReport?.causesAnalysis,
                        causesAnalysisFollow: ifWireless ? 'no' : latestReport?.causesAnalysisFollow || 'no',
                    },
                    treatmentMeasure: {
                        treatmentMeasure:
                            latestReport?.treatmentMeasure ||
                            (ifWireless
                                ? '处理过程：请一句话填写故障处理措施和进度\n基站恢复数量：4G BBU已恢复数量XX个，5G BBU已恢复数量XX个，物理站故障已恢复数量XX个。'
                                : ''),
                        treatmentMeasureFollow: ifWireless ? 'no' : latestReport?.treatmentMeasureFollow || 'no',
                    },
                    businessImpactScope: {
                        businessImpactScope:
                            latestReport?.businessImpactScope ||
                            (ifWireless ? '区县无线业务是否全阻：是/否\n无线业务全阻的典型区域：XX镇/XX街道' : ''),
                        businessImpactScopeFollow: ifWireless ? 'no' : latestReport?.continueType === ReportType.RENEWAL ? 'yes' : 'no',
                    },
                    businessRecoverProcess: {
                        businessRecoverProcess: latestReport?.businessRecoverProcess,
                        // 上一次续报 则不为第一次续报 默认为沿用
                        businessRecoverProcessFollow: ifWireless ? 'no' : latestReport?.continueType === ReportType.RENEWAL ? 'yes' : 'no',
                    },
                    notificationDetailList: defaultNotificationDetailList, // 通知类型时间配置
                    notice: { ...noticeData },
                    continueType: curContinueTypeRef.current || lastContinueType,
                    reportUser: userId,
                    reportUserName: userName,
                    telephone: parseUserInfo?.userMobile || '',
                    isEffectBusiness: latestReport?.isEffectBusiness === '是' ? '1' : '0', // 续报是否影响业务 默认否
                    reportLevel: latestReport?.reportLevel?.split(','), // 后端传回来的是逗号分割的字符串
                    failureLevel: firstReportData?.specialty === '11' ? '4' : latestReport?.failureLevel === '6' ? null : latestReport?.failureLevel, // 续报待确认默认显示空
                    failureClassHis: latestReport?.failureClass || '20',
                    faultWorkNoDetails: latestReport?.faultWorkNoDetails,
                    failureRecoverTime: latestReport?.failureRecoverTime ? moment(latestReport?.failureRecoverTime) : undefined, // 最新的有时间就用最新的，没有就undefined
                    businessRecoverTime: latestReport?.businessRecoverTime ? moment(latestReport?.businessRecoverTime) : undefined,
                    transSystem: latestReport?.transSystem,
                    transSegId: latestReport?.transSegId,
                    reuseTransSeg: latestReport?.reuseTransSeg,
                    rootSpecialty: latestReport?.rootSpecialty,
                    actionScene: latestReport?.actionScene || '',
                    ...manualDefaultData,
                });
            }

            if (
                dataSource?.reportTypeName === '终报' ||
                latestReport?.reportStatusName === '终报上报' ||
                draftData.continueType === '2' ||
                (isMajor && btnKey?.indexOf('finalReport') >= 0) ||
                btnKey === 'faultReport:upload'
            ) {
                setIsContinueReportView(true);
                if (latestReport?.syncState === 1) {
                    sync.setIsSync(1);
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [
            provinceId,
            deptName,
            regionList,
            flagId,
            latestReport,
            provinceData,
            draftData,
            autoFpWorkSheets,
            isFirstDraft,
            loadingData,
            faultReportDerivedRule,
            autoFaultReportDerivedRule,
            flowData,
            agentData,
        ],
        { wait: 300 },
    );

    useImperativeHandle(ref, () => {
        return {
            onSave,
            onSubmit,
            onReset,
        };
    });

    const failureRecoverTimeDisabledDate = (current) => {
        const firstReportDataFailureTime = firstReportData?.failureTime || form.getFieldValue('failureTime');
        return current && current < moment(firstReportDataFailureTime).startOf('day');
    };

    const failureRecoverTimeDisabledTime = (current) => {
        const firstReportDataFailureTime = firstReportData?.failureTime || form.getFieldValue('failureTime');

        if (current) {
            const date = moment(firstReportDataFailureTime).date();
            const hour = moment(firstReportDataFailureTime).hour();
            const minute = moment(firstReportDataFailureTime).minute();
            const second = moment(firstReportDataFailureTime).second();

            return {
                disabledHours: () => {
                    if (current.date() > date) {
                        return [];
                    }

                    return Array.from({ length: hour }).map((item, index) => index);
                },
                disabledMinutes: (selectedHour) => {
                    if (current.date() > date) {
                        return [];
                    }
                    if (selectedHour > hour) {
                        return [];
                    }
                    return Array.from({ length: minute }).map((item, index) => index);
                },
                disabledSeconds: (selectedHour, selectedMinute) => {
                    if (current.date() > date) {
                        return [];
                    }
                    if (selectedHour > hour) {
                        return [];
                    }
                    if (selectedMinute > minute) {
                        return [];
                    }
                    return Array.from({ length: second }).map((item, index) => index);
                },
            };
        }
        return {
            disabledHours: () => [],
            disabledMinutes: () => [],
            disabledSeconds: () => [],
        };
    };
    const onFormValueChange = (changedValues, allValues) => {
        if (_.has(changedValues, 'continueType') && (changedValues.continueType === '2' || (isMajor && btnKey?.indexOf('finalReport') >= 0))) {
            sync.setIsSync(0);
            setIsContinueReportView(true);
        }

        if (_.has(changedValues, 'continueType') && changedValues.continueType !== '2') {
            setIsContinueReportView(false);
        }
    };
    const getTitle = () => {
        let lastTitle = title || '';
        if (title?.indexOf('审核') >= 0) {
            lastTitle = title.replace('审核', '');
        } else if (title?.indexOf('终报') >= 0 && title?.indexOf('申请') >= 0) {
            lastTitle = title.replace('申请', '');
        }
        if (title?.indexOf('追加上报') >= 0) {
            lastTitle = '追加上报';
        }
        if (btnKey === 'faultReport:firstReportApplicationCancel') {
            lastTitle = '首报申请';
        }
        if (btnKey === 'faultReport:firstReportApproveCancel') {
            lastTitle = '首报审核';
        }
        if (btnKey === 'majorFaultReport:progressReportSupplemental') {
            lastTitle = '终报';
        }
        return lastTitle || '续报';
    };
    const renderAdvancedTemplate = (template, data) => {
        return template.replace(/<([\w.]+)>/g, (match, path) => {
            // 分割路径，支持嵌套对象
            const keys = path.split('.');
            let value = data;

            // eslint-disable-next-line no-restricted-syntax
            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                } else {
                    return match; // 路径不存在，保持原样
                }
            }

            return value !== undefined ? value : match;
        });
    };
    const onAlarmChange = (row: any, searchTime: any) => {
        const param = {
            userId,
            startTime: searchTime[0],
            endTime: searchTime[1],
            standardAlarmId: row?.alarmId,
        };
        queryDetailByAlarmId(param).then((res) => {
            if (res?.code === 200) {
                const defaultData: any = {
                    reportDescribe: res?.data?.reportDescribe || '',
                    influenceScope: res?.data?.influenceScope || '',
                    causesAnalysis: res?.data?.causesAnalysis || '',
                    treatmentMeasure: res?.data?.treatmentMeasure || '',
                };
                form.setFieldsValue(defaultData);
            }
        });
    };
    const onConTypeChange = (val: any) => {
        getFlowData(val);
        setCurContinueType(val);
        curContinueTypeRef.current = val;
    };
    const onCustomTextareaChange = (values: any) => {
        if (values?.isRadioChange) {
            let defaultVal = {};
            if (values?.[`${values.fieldName}Follow`] === 'yes') {
                defaultVal = {
                    [values.fieldName]: {
                        ...values,
                        [values.fieldName]: flowData?.[values.fieldName],
                    },
                };
            } else {
                defaultVal = {
                    [values.fieldName]: {
                        ...values,
                        [values.fieldName]: '',
                    },
                };
            }
            form.setFieldsValue(defaultVal);
        }
    };
    const formDom =
        flagId && !isFirstDraft ? (
            <SubsequentReportForm
                title={getTitle()}
                allEnumData={allEnumData as any}
                latestReport={latestReport}
                allReportList={allReportList}
                // draftData={draftData}
                reportNoticeClassName={reportNoticeClassName}
                noticeTemplateClassName={noticeTemplateClassName}
                noticeTemplateAddClassName={noticeTemplateAddClassName}
                userGroupSelectModalClassName={userGroupSelectModalClassName}
                noticeTypeData={noticeTypeData}
                ticketModalClassName={ticketModalClassName}
                // originalAlarmCount={originalAlarmCount}
                // source={source}
                darkTheme={darkTheme}
                hasDraftStatus={!!hasDraftStatus}
                failureRecoverTimeDisabledDate={failureRecoverTimeDisabledDate}
                failureRecoverTimeDisabledTime={failureRecoverTimeDisabledTime}
                firstReportFailureTime={firstReportData?.failureTime || form.getFieldValue('failureTime')}
                reportNoticeRef={reportNoticeRef}
                onSpecialtyChange={onSpecialtyChange}
                GNOCdisable={GNOCdisable}
                isWireless={isWireless}
                isMajor={isMajor}
                btnKey={btnKey}
            />
        ) : (
            <FirstReportForm
                allEnumData={allEnumData as any}
                onSpecialtyChange={onSpecialtyChange}
                onReportLevelChange={onReportLevelChange}
                isProvinceZone={isProvinceZone}
                reportNoticeClassName={reportNoticeClassName}
                noticeTemplateClassName={noticeTemplateClassName}
                noticeTemplateAddClassName={noticeTemplateAddClassName}
                userGroupSelectModalClassName={userGroupSelectModalClassName}
                goToListPage={goToListPage}
                hideListButton={hideListButton}
                noticeTypeData={noticeTypeData}
                source={source}
                standardAlarmId={standardAlarmId}
                ticketModalClassName={ticketModalClassName}
                allReportList={allReportList}
                draftData={draftData}
                darkTheme={darkTheme}
                specialty={!flagId ? dataSource?.specialty || dataSource?.professionalType : null}
                hasDraftStatus={!!hasDraftStatus}
                failureRecoverTimeDisabledDate={failureRecoverTimeDisabledDate}
                failureRecoverTimeDisabledTime={failureRecoverTimeDisabledTime}
                reportNoticeRef={reportNoticeRef}
                restType={restType}
                GNOCdisable={GNOCdisable}
                isWireless={isWireless}
                theme={theme}
                isMajor={isMajor}
                ruleType={faultReportDerivedRule?.ruleType}
                onAlarmChange={onAlarmChange}
                onConTypeChange={onConTypeChange}
                onCustomTextareaChange={onCustomTextareaChange}
            />
        );

    const getFormDom = () => {
        if (!isMajor) {
            return formDom;
        }
        if (btnKey?.indexOf('firstReport') >= 0) {
            return (
                <FirstReportForm
                    allEnumData={allEnumData as any}
                    onSpecialtyChange={onSpecialtyChange}
                    onReportLevelChange={onReportLevelChange}
                    isProvinceZone={isProvinceZone}
                    reportNoticeClassName={reportNoticeClassName}
                    noticeTemplateClassName={noticeTemplateClassName}
                    noticeTemplateAddClassName={noticeTemplateAddClassName}
                    userGroupSelectModalClassName={userGroupSelectModalClassName}
                    goToListPage={goToListPage}
                    hideListButton={hideListButton}
                    noticeTypeData={noticeTypeData}
                    source={source}
                    standardAlarmId={standardAlarmId}
                    ticketModalClassName={ticketModalClassName}
                    allReportList={allReportList}
                    draftData={draftData}
                    darkTheme={darkTheme}
                    specialty={!flagId ? dataSource?.specialty || dataSource?.professionalType : null}
                    hasDraftStatus={!!hasDraftStatus}
                    failureRecoverTimeDisabledDate={failureRecoverTimeDisabledDate}
                    failureRecoverTimeDisabledTime={failureRecoverTimeDisabledTime}
                    reportNoticeRef={reportNoticeRef}
                    restType={restType}
                    GNOCdisable={GNOCdisable}
                    isWireless={isWireless}
                    theme={theme}
                    isMajor={isMajor}
                    isFaultReportNew={isFaultReportNew}
                    ruleType={faultReportDerivedRule?.ruleType}
                    onAlarmChange={onAlarmChange}
                />
            );
        }
        return (
            <SubsequentReportForm
                title={getTitle()}
                allEnumData={allEnumData as any}
                latestReport={latestReport}
                allReportList={allReportList}
                // draftData={draftData}
                reportNoticeClassName={reportNoticeClassName}
                noticeTemplateClassName={noticeTemplateClassName}
                noticeTemplateAddClassName={noticeTemplateAddClassName}
                userGroupSelectModalClassName={userGroupSelectModalClassName}
                noticeTypeData={noticeTypeData}
                ticketModalClassName={ticketModalClassName}
                // originalAlarmCount={originalAlarmCount}
                // source={source}
                darkTheme={darkTheme}
                hasDraftStatus={!!hasDraftStatus}
                failureRecoverTimeDisabledDate={failureRecoverTimeDisabledDate}
                failureRecoverTimeDisabledTime={failureRecoverTimeDisabledTime}
                firstReportFailureTime={firstReportData?.failureTime || form.getFieldValue('failureTime')}
                reportNoticeRef={reportNoticeRef}
                onSpecialtyChange={onSpecialtyChange}
                GNOCdisable={GNOCdisable}
                isWireless={isWireless}
                isMajor={isMajor}
                btnKey={btnKey}
                onConTypeChange={onConTypeChange}
                onCustomTextareaChange={onCustomTextareaChange}
            />
        );
    };
    const confirmInfo = () => {
        if (confirmVisible === 2 || confirmVisible === 4) {
            return (
                <div className="fault-confirm-modal-content">
                    <div className="confirm-info">系统已自动识别到相关故障，请前往确认上报</div>
                    <div className="confirm-footer">
                        <Space>
                            <Button
                                type="ghost"
                                onClick={() => {
                                    setConfirmVisible(false);
                                    // onSubmit();
                                }}
                            >
                                取消
                            </Button>
                            <Button
                                type="primary"
                                onClick={async () => {
                                    if (confirmVisible === 2) {
                                        const formData = form.getFieldsValue();
                                        console.log(newData, '=====newdata', formData);
                                        const jumpData = {
                                            ...newData,
                                            source: 1,
                                            reportLevel: formData.reportLevel,
                                            failureTime: moment(formData.failureTime),
                                            failureRecoverTime: formData.failureRecoverTime && moment(formData.failureRecoverTime),
                                            standardAlarmId: validateInfo?.standardAlarmId,
                                        };
                                        setFaultReportDataSource(jumpData);
                                        const { notice = {} } = editDataRef.current;
                                        console.log(jumpData, '====data', notice);
                                        const timers = setTimeout(() => {
                                            setNoticeTypeData({
                                                notificationContent: notice.notificationContent,
                                                notificationContentId: notice.notificationContentId,
                                                notificationType: notice.notificationType,
                                                notificationDetailList: notice.notificationDetailList,
                                                notificationTel: notice.notificationTel,
                                                notificationUserInfos: notice.selectedNoticeData,
                                                whetherNotifyGNOC: notice.whetherNotifyGNOC,
                                                disableGNOC: true,
                                            });
                                            form.setFieldsValue({
                                                ...jumpData,
                                                relationAlarmDetails: [],
                                            });
                                        }, 2000);
                                    } else {
                                        const param = {
                                            faultReportStatus: '1',
                                            flagId: validateInfo.flagId,
                                        };
                                        const res = await getFaultReportDetail(param);
                                        if (res.data) {
                                            console.log(res.data, '=====newdata');
                                            setFaultReportDataSource(res.data);
                                        }
                                        setFlagId(validateInfo.flagId);
                                    }
                                    submitFlagRef.current = true;
                                    setConfirmVisible(false);
                                    // if (onFinishProps) {
                                    //     onFinishProps();
                                    // }
                                }}
                            >
                                确认
                            </Button>
                        </Space>
                    </div>
                </div>
            );
        }
        if (confirmVisible === 3 || confirmVisible === 5) {
            return (
                <div className="fault-confirm-modal-content">
                    <div className="confirm-info">
                        系统自动识别到相关故障，{confirmVisible === 3 ? '但已被取消上报' : '已完成上报'}，是否继续上报？
                    </div>
                    <div className="confirm-footer">
                        <Space>
                            <Button
                                type="ghost"
                                onClick={async () => {
                                    const param = {
                                        faultReportStatus: confirmVisible === 3 ? '0' : '1',
                                        flagId: validateInfo.flagId,
                                    };
                                    const res = await getFaultReportDetail(param);
                                    if (validateInfo.whetherInWorkbench) {
                                        if (res.data) {
                                            setFaultReportDataSource(res.data);
                                            if (darkTheme) {
                                                setIsView(true);
                                            } else {
                                                history.push(
                                                    `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report/fault-report-detail?flagId=${res.data?.flagId}&faultReportStatus=${res.data?.faultReportStatus}&standardAlarmId=${res.data?.standardAlarmId}`,
                                                );
                                            }
                                        }
                                    } else {
                                        // 跳转故障查询取消故障查看页面
                                        if (res.data) {
                                            const { actions, messageTypes } = actionss;
                                            if (actions && actions.postMessage) {
                                                if (darkTheme) {
                                                    actions.postMessage(messageTypes.openRoute, {
                                                        entry: `/unicom/home/troubleshooting-workbench/fault-report/fault-report-detail`,
                                                        search: {
                                                            flagId: res.data?.flagId,
                                                            faultReportStatus: res.data?.faultReportStatus,
                                                            standardAlarmId: res.data?.standardAlarmId,
                                                        },
                                                    });
                                                    if (onFinishProps) {
                                                        onFinishProps();
                                                    }
                                                } else {
                                                    history.push(
                                                        `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report/fault-report-detail?flagId=${res.data?.flagId}&faultReportStatus=${res.data?.faultReportStatus}&standardAlarmId=${res.data?.standardAlarmId}`,
                                                    );
                                                }
                                            }
                                        }
                                    }
                                    setConfirmVisible(false);
                                }}
                            >
                                否，查看{confirmVisible === 3 ? '取消' : '上报'}故障
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    setConfirmVisible(false);
                                    submitFlagRef.current = true;
                                    onSubmit();
                                }}
                            >
                                是，继续上报
                            </Button>
                        </Space>
                    </div>
                </div>
            );
        }

        return null;
    };
    return (
        <div id="fault-report-form-container">
            <Spin spinning={loadingData}>
                <Form name="validate_other" {...formItemLayout} form={form} onFinish={onFinish} onValuesChange={onFormValueChange}>
                    {(!btnKey || btnKey?.indexOf('firstReport') < 0) && (
                        <div id="form-container-info-box">{flagId && !isFirstDraft ? faultListDom() : ''}</div>
                    )}
                    <div ref={editRef} id="form-container-scroll-flag">
                        {isFinalReport || btnKey === 'faultReport:upload' ? null : getFormDom()}
                    </div>
                </Form>
            </Spin>
            <Modal
                className={ticketModalClassName}
                visible={confirmVisible}
                width={800}
                title="确认上报提醒"
                footer={null}
                onCancel={confirmCancle}
                destroyOnClose
                getContainer={false}
            >
                <div>{confirmInfo()}</div>
            </Modal>
        </div>
    );
};

export default forwardRef(FormContainer);
