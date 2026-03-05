import React, { useEffect, useState, useRef } from 'react';
import { Button, Space, Modal, Checkbox, message } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import FormContainer, { FormContainerRef } from '@Pages/fault-report/fault-report-add/fault-report-form/form-container';
import NewFaultReportDetailContent from '@Pages/fault-report/fault-report-detail/NewFaultReportDetailContent';
import { FAILURE_REPORT_STATUS } from '@Src/pages/fault-report/type';
import { sendLogFn } from '@Pages/components/auth/utils';
import { getFaultUsers, getAllReportList } from '@Src/pages/fault-report/api';
import CancelReport from './cancel-report';
import { cancelFaultInfo, getManualReportDerivedRuleConfig } from '../../../../../api';
import './index.less';

type FaultReportModalAddProps = {
    flagId?: string;
    dataSource?: any;
    onCancel: () => {};
    faultReportStatus: string;
    source?: number;
    isView?: boolean;
    standardAlarmId?: string;
    goToListPage: () => {};
    setFaultReportDataSource?: any;
    setIsView?: any;
    isIframe?: any;
    isWireless?: any;
    updateCardList?: any;
    title?: string;
    isMajor?: boolean; // 是否重大故障上报
    btnKey?: string; // 弹窗确认按钮key
    theme?: string; // 主题 ''| white
    isFaultReportNew?: boolean; // 是否新的故障上报
    isManual?: boolean; // 是否手动上报
};
const FaultReportModalAdd: React.FC<FaultReportModalAddProps> = (props) => {
    const {
        flagId,
        onCancel = () => {},
        faultReportStatus,
        source,
        isView,
        standardAlarmId,
        goToListPage,
        dataSource,
        setFaultReportDataSource,
        setIsView,
        isIframe,
        isWireless,
        updateCardList,
        title,
        isMajor = false,
        btnKey, // 弹窗确认按钮key
        theme, // 主题 ''| white
        isFaultReportNew, // 是否新的故障上报
        isManual, // 是否手动上报
    } = props;

    const ref = useRef<FormContainerRef>(null);
    const { userId, provinceId } = useLoginInfoModel();
    const [loading, setLoading] = useState(false);
    const isCancelReport = title?.indexOf('取消上报') >= 0;
    const [visible, setVisible] = useState(false || isCancelReport);
    const [cancelDisabled, setCancelDisabled] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const cancelReportRef = useRef<any>();
    const [cancelFaultData, setCancelFaultData] = useState({});
    const [isSync, setIsSync] = useState(0);
    const [isContinueReportView, setIsContinueReportView] = useState(false);
    const [ruleConfig, setRuleConfig] = useState(null);

    const getRuleConfig = async () => {
        const res = await getManualReportDerivedRuleConfig({ provinceId: provinceId || '' });
        if (res && res.data) {
            setRuleConfig(res.data);
        }
    };

    useEffect(() => {
        if (!provinceId) {
            return;
        }
        getRuleConfig();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onReset = () => {
        if (ref && ref.current && ref.current.onReset) {
            setIsSync(0);
            // setIsContinueReportView(false);
            ref.current.onReset();
        }
    };

    const onSave = () => {
        if (ref && ref.current && ref.current.onSave) {
            ref.current.onSave();
        }
    };
    const onSubmit = () => {
        if (ref && ref.current && ref && ref.current.onSubmit) {
            ref.current.onSubmit();
        }
    };

    const getAgentFaultUsers = async (data) => {
        const userIdArr = data?.notificationUserInfos?.map((item) => item.userId) || [];
        const res = await getFaultUsers({
            userIds: userIdArr,
        });
        return (
            res?.data?.map((item) => {
                return { ai_user_id: item.userId, ai_role_type: item.roleTypeNames };
            }) || []
        );
    };
    const getAllReports = async () => {
        const data = {
            flagId,
            reportUser: userId,
        };
        const res: any = await getAllReportList(data);
        return res;
    };

    const confirmCancel = async () => {
        setCancelDisabled(true);
        const params = {
            ...cancelFaultData,
            standardAlarmId: standardAlarmId || dataSource?.standardAlarmId || '',
        };
        // 手工上报逻辑
        if (source === 0 || dataSource?.source === 0 || (!dataSource?.standardAlarmId && dataSource?.flagId)) {
            params.standardAlarmId = dataSource?.flagId;
        }

        const result = await cancelFaultInfo(params);
        if (result.code === 0) {
            // 取消上报成功
            setConfirmVisible(false);
            setCancelDisabled(false);
            setVisible(false);
            props.onCancel();
            // 智能体消息回传
            const agentIframeRef = {
                current: null,
            };
            agentIframeRef.current = document.getElementById('AGENT-IFRAME');
            console.log('agentIframeRef', agentIframeRef);

            if (agentIframeRef.current) {
                let lastBtnKey = btnKey;
                if (btnKey === 'majorFaultReport:firstReportApplication') {
                    // 首报申请页面，点取消上报时，返回取消首报申请状态
                    lastBtnKey = 'faultReport:firstReportApplicationCancel';
                } else if (btnKey === 'majorFaultReport:firstReportApprove') {
                    // 首报审核页面，点取消上报时，这时返回取消审核状态
                    lastBtnKey = 'faultReport:firstReportApproveCancel';
                }
                let faultNotice: any = {};
                if (dataSource?.flagId) {
                    getAllReports().then((res) => {
                        if (res && res.data) {
                            const finalAllData = [...res.data];
                            if (isMajor && flagId && finalAllData?.length > 0) {
                                // 重大故障上报回填通知信息
                                faultNotice = finalAllData?.[finalAllData?.length - 1]?.faultNotice || {};
                            }
                        }
                        const { notificationUserInfos } = faultNotice;
                        getAgentFaultUsers(notificationUserInfos).then((users) => {
                            agentIframeRef.current.contentWindow?.postMessage(
                                {
                                    type: 'SEND_AGENT_QUESTION',
                                    data: {
                                        // 这里的type是把智能体给的key再回传回去
                                        type: lastBtnKey,
                                        // 这里的data是给智能体发消息的数据。成功或失败
                                        // 成功时： data: { ai_handle_status: 200 }
                                        // 失败时： data: { ai_handle_status: 非200的数值。约定500，ai_handle_message: "失败原因或后端返回报错，非200时必传" }
                                        data: {
                                            ai_handle_status: 200,
                                            ai_topic: dataSource?.topic,
                                            ai_flagId: dataSource?.flagId,
                                            ai_standard_alarmId: dataSource?.standardAlarmId,
                                            ai_topic_alarm: dataSource?.topic,
                                            ai_notify_users: users || [],
                                        },
                                    },
                                },
                                '*',
                            );
                        });
                    });
                } else {
                    agentIframeRef.current.contentWindow?.postMessage(
                        {
                            type: 'SEND_AGENT_QUESTION',
                            data: {
                                // 这里的type是把智能体给的key再回传回去
                                type: lastBtnKey,
                                // 这里的data是给智能体发消息的数据。成功或失败
                                // 成功时： data: { ai_handle_status: 200 }
                                // 失败时： data: { ai_handle_status: 非200的数值。约定500，ai_handle_message: "失败原因或后端返回报错，非200时必传" }
                                data: {
                                    ai_handle_status: 200,
                                    ai_topic: dataSource?.topic,
                                    ai_topic_alarm: dataSource?.topic,
                                    ai_flagId: dataSource?.flagId,
                                    ai_standard_alarmId: dataSource?.standardAlarmId,
                                    ai_notify_users: [],
                                },
                            },
                        },
                        '*',
                    );
                }
            }
        } else {
            // 取消上报失败
            setCancelDisabled(false);
            message.error(result.message || '取消上报失败');
        }
    };

    const cancelFault = (val) => {
        setCancelFaultData(val);
        setConfirmVisible(true);
    };

    let reportTitle = source === 1 ? '自动上报' : '手工上报';
    if (title) {
        reportTitle = title;
    }
    const modalTitle = isView ? '查看' : reportTitle;
    console.log(isWireless, '==wireless');
    let showSave = faultReportStatus !== FAILURE_REPORT_STATUS.FINAL_REPORT;
    console.log(faultReportStatus, dataSource, '==faultReportStatus');
    if (dataSource?.faultDistinctionType === 2 && dataSource?.source === 1) {
        // 区县级故障不显示保存
        showSave = false;
    }
    if (dataSource?.faultDistinctionType === 2 && dataSource?.source === 0) {
        // 省内填报故障不显示保存
        showSave = false;
    }
    if (!dataSource?.faultDistinctionType && isWireless) {
        // 无线运营新增不显示保存
        showSave = false;
    }

    const getTitle = () => {
        let lastTitle = modalTitle || '';
        if (lastTitle?.indexOf('追加上报') >= 0) {
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
        return lastTitle;
    };

    return (
        <div className="fault-report-modal-container">
            {!isIframe && <div className="fault-report-modal-title">{getTitle()}</div>}
            <div className="fault-report-modal-body">
                <div className="fault-report-modal-form-box">
                    {isView ? (
                        <NewFaultReportDetailContent
                            flagId={flagId}
                            dataSource={dataSource}
                            faultReportStatus={dataSource?.faultReportStatus}
                            isMajor={isMajor}
                            theme={props.theme}
                        />
                    ) : (
                        <FormContainer
                            setLoading={setLoading}
                            flagId={flagId}
                            dataSource={dataSource}
                            ref={ref}
                            faultReportStatus={faultReportStatus}
                            reportNoticeClassName={props.theme !== 'white' ? 'fault-report-modal-report-notice' : ''}
                            noticeTemplateClassName={props.theme !== 'white' ? 'fault-report-modal-notice-template' : ''}
                            noticeTemplateAddClassName={props.theme !== 'white' ? 'fault-report-modal-notice-template-add' : ''}
                            userGroupSelectModalClassName={props.theme !== 'white' ? 'fault-report-modal-user-group-select' : ''}
                            ticketModalClassName={props.theme !== 'white' ? 'ticket-modal' : ''}
                            onFinish={onCancel}
                            source={source}
                            standardAlarmId={standardAlarmId}
                            // ticketModalClassName="ticket-modal"
                            goToListPage={goToListPage}
                            darkTheme={props.theme !== 'white'}
                            setFaultReportDataSource={setFaultReportDataSource}
                            setIsView={setIsView}
                            isWireless={isWireless}
                            sync={{ isSync, setIsSync }}
                            setIsContinueReportView={setIsContinueReportView}
                            updateCardList={updateCardList}
                            isMajor={isMajor}
                            title={modalTitle}
                            btnKey={btnKey}
                            theme={props.theme}
                            isFaultReportNew={isFaultReportNew}
                            ruleConfig={ruleConfig}
                            isManual={isManual || dataSource?.source === 0 || source === 0}
                        />
                    )}
                </div>
                <div className="fault-report-add-btn-box">
                    <Space>
                        {!isView && faultReportStatus !== FAILURE_REPORT_STATUS.FINAL_REPORT ? (
                            <>
                                <Button type="ghost" onClick={() => props.onCancel()} loading={loading}>
                                    取消
                                </Button>
                                <Button type="ghost" onClick={onReset}>
                                    重置
                                </Button>
                            </>
                        ) : null}

                        {isView ? (
                            <Button type="ghost" onClick={() => props.onCancel()} loading={loading}>
                                关闭
                            </Button>
                        ) : (
                            <>
                                {showSave && !isMajor && btnKey !== 'faultReport:upload' ? (
                                    <Button type="ghost" onClick={onSave} loading={loading}>
                                        保存
                                    </Button>
                                ) : null}
                                {(standardAlarmId && !flagId) ||
                                (isMajor && btnKey?.indexOf('majorFaultReport:firstReportApprove') >= 0) ||
                                title?.indexOf('取消上报') >= 0 ? (
                                    <Button
                                        type="ghost"
                                        onClick={() => {
                                            sendLogFn({ authKey: 'faultReport:cancelReport' });
                                            setVisible(true);
                                        }}
                                    >
                                        取消上报
                                    </Button>
                                ) : null}
                                <Button type="primary" onClick={onSubmit} loading={loading}>
                                    提交
                                </Button>
                            </>
                        )}

                        {isContinueReportView ? (
                            <div>
                                <Checkbox checked={!!isSync} onChange={(e) => setIsSync(e.target.checked ? 1 : 0)} />
                                <span className="fault-report-modal-sync">同步至网络故障集中存档</span>
                            </div>
                        ) : null}
                    </Space>
                </div>
            </div>
            <Modal
                visible={visible}
                title="取消上报故障"
                width={850}
                className="fault-report-cancel-modal"
                style={{}}
                bodyStyle={{ padding: 16 }}
                onCancel={() => setVisible(false)}
                destroyOnClose
                getContainer={false}
                footer={null}
            >
                <CancelReport
                    ref={cancelReportRef}
                    setVisible={setVisible}
                    isWireless={isWireless}
                    isIframe={isIframe}
                    standardAlarmId={standardAlarmId}
                    cancelFaultInfoFunc={cancelFault}
                    theme={props.theme}
                />
            </Modal>
            <Modal
                visible={confirmVisible}
                title="取消上报确认"
                width={800}
                className="fault-report-confirm-modal"
                style={{}}
                bodyStyle={{ padding: 32 }}
                onCancel={() => setConfirmVisible(false)}
                destroyOnClose
                getContainer={false}
                footer={[
                    <div>
                        <Button
                            key="back"
                            onClick={() => {
                                cancelReportRef.current?.cancelTextAreaVisible();
                                setConfirmVisible(false);
                            }}
                            type="ghost"
                        >
                            取消
                        </Button>
                        <Button key="ok" onClick={confirmCancel} type="primary" loading={cancelDisabled}>
                            确认
                        </Button>
                    </div>,
                ]}
            >
                <div style={{ textAlign: 'center', color: isIframe || props.theme === 'white' ? '#000' : '#fff' }}>
                    集团专业和系统均会核实该故障取消原因，请务必确认无误后再取消上报！
                </div>
            </Modal>
        </div>
    );
};
export default FaultReportModalAdd;
