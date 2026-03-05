import React, { useState, useEffect, useRef, useMemo } from 'react';
import './index.less';
import api from '@Pages/change-shifts-page/api';
import useLoginInfoModel from '@Src/hox';
import { Modal, message } from 'oss-ui';
import useAuth from '@Pages/components/auth/hooks/useAuth';
import { logNew } from '@Common/api/service/log';
import AuthButton from '@Pages/components/auth/auth-button';
import ShiftInformationModal from '../components/Shift-Information-modal';

const DoChange = (props) => {
    const { personnelState, onCompChange, schedulingObj, handleSwitchUser, sheetStay, getDataInfo, checkHandSubmit } = props;
    const frameInfo = useLoginInfoModel();
    const { parsedUserInfo } = frameInfo;
    const timer = useRef();

    const [countdown, setCountdown] = useState('00:00:00');
    const [visible, setVisible] = useState(false);
    const { hasAuth } = useAuth({
        authKey: 'changeShiftsSetting:takeover',
        unauthorizedDisplayMode: 'disabled',
    });

    let secondNum = 0;

    const userInfos = parsedUserInfo || {};

    const formatSeconds = (value) => {
        const hh = parseInt(String(value / 3600), 10); // 小时

        const shh = value - hh * 3600;

        const mm = parseInt(String(shh / 60), 10);

        const ss = shh - mm * 60;

        setCountdown((hh < 10 ? '0' + hh : hh) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (ss < 10 ? '0' + ss : ss));
    };

    const startCountdown = async () => {
        secondNum = schedulingObj?.timeCountDown?.split('|')[0];
        if (secondNum > 0) {
            clearInterval(timer.current);
            timer.current = setInterval(() => {
                if (secondNum > 0) {
                    formatSeconds(secondNum);
                    secondNum--;
                }
            }, 1000);
        } else {
            clearInterval(timer.current);
            setCountdown('00:00:00');
        }
    };

    useEffect(() => {
        clearInterval(timer.current);
        startCountdown();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schedulingObj]);

    const takeOrHandPrompt = (code, messgae, successCb) => {
        Modal.confirm({
            title: '提示',
            content: messgae,
            okButtonProps: code === '201' ? { prefixCls: 'oss-ui-btn' } : { prefixCls: 'oss-ui-btn', style: { display: 'none' } },
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                if (code === '201') {
                    successCb();
                }
            },
            onCancel: () => {
                if (code === '401' || code === '400') {
                    clearInterval(timer.current);
                    startCountdown();
                    getDataInfo();
                }
            },
        });
    };

    // 交接班打卡
    const punchCard = (type) => {
        const { dateTime, groupId, workShiftId, takeOrHandWorkShiftId, takeOrHandDateTime } = schedulingObj || {};
        const { userId } = userInfos;

        api.handOrTakePunchCard({
            groupId,
            workShiftId: type === 'hand' ? workShiftId : takeOrHandWorkShiftId,
            dutyDate: takeOrHandDateTime,
            userId,
            punchCardType: type,
        }).then((result) => {
            if (result && result.resultCode === '200') {
                // onCompChange();
                getDataInfo();
            }
        });
    };
    // 接班信息提交
    const saveTake = async () => {
        const {
            dateTime,
            groupId,
            workShiftId,
            nextTakeOrHandWorkShiftId,
            lastTakeOrHandDateTime,
            lastTakeOrHandWorkShiftId,
            takeOrHandWorkShiftId,
            takeOrHandDateTime,
        } = schedulingObj;
        const data = {
            userId: userInfos.userId,
            dateTime: takeOrHandDateTime,
            groupId,
            workShiftId: takeOrHandWorkShiftId,
            nextWorkShiftId: nextTakeOrHandWorkShiftId,
            lastDateTime: lastTakeOrHandDateTime,
            lastWorkShiftId: lastTakeOrHandWorkShiftId,
        };
        const result = await api.shiftingOfDutyTakeOver(data);
        if (result && result.resultCode === '200') {
            // onCompChange();
            getDataInfo();
        } else {
            message.warning(result.resultMsg);
        }
    };
    // 点击交班
    const handover = async () => {
        Modal.confirm({
            title: '提示',
            content: '是否确认交班？',
            okText: '确认',
            cancelText: '取消',
            okType: 'danger',
            className: props.theme === 'light' ? '' : 'work-bench-modal-confirm',
            onOk: async () => {
                logNew('监控工作台交接班待办组件', '300016');
                const {
                    dateTime,
                    groupId,
                    workShiftId,
                    nextTakeOrHandWorkShiftId,
                    lastTakeOrHandDateTime,
                    lastTakeOrHandWorkShiftId,
                    takeOrHandWorkShiftId,
                    takeOrHandDateTime,
                } = schedulingObj;

                const data = {
                    userId: userInfos.userId,
                    dateTime: takeOrHandDateTime,
                    groupId,
                    workShiftId: workShiftId,
                    nextWorkShiftId: nextTakeOrHandWorkShiftId,
                    lastDateTime: lastTakeOrHandDateTime,
                    lastWorkShiftId: lastTakeOrHandWorkShiftId,
                };
                const result = await api.checkHandSubmit(data);

                if (result) {
                    const { resultCode, resultMsg } = result;

                    switch (resultCode) {
                        case '200':
                            setVisible(true);
                            break;
                        case '1001':
                            punchCard('hand');
                            break;
                        case '201':
                        case '400':
                        case '401':
                            takeOrHandPrompt(resultCode, resultMsg, () => {
                                setVisible(true);
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
    const takeover = async () => {
        const { userId } = userInfos;
        const {
            dateTime,
            groupId,
            workShiftId,
            nextTakeOrHandWorkShiftId,
            lastTakeOrHandDateTime,
            lastTakeOrHandWorkShiftId,
            takeOrHandWorkShiftId,
            takeOrHandDateTime,
        } = schedulingObj;

        const data = {
            userId,
            dateTime: takeOrHandDateTime,
            groupId,
            workShiftId: takeOrHandWorkShiftId,
            nextWorkShiftId: nextTakeOrHandWorkShiftId,
            lastDateTime: lastTakeOrHandDateTime,
            lastWorkShiftId: lastTakeOrHandWorkShiftId,
        };

        function errorHandle(result, cb) {
            if (result) {
                const { resultCode, resultMsg } = result;
                switch (resultCode) {
                    case '200':
                        cb();
                        break;
                    case '1002':
                        punchCard('take');
                        break;
                    case '201':
                    case '400':
                    case '401':
                        takeOrHandPrompt(resultCode, resultMsg, saveTake);
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
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: saveTake,
                });
            });

            return;
        }

        Modal.confirm({
            title: '提示',
            content: '是否确认接班？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            className: props.theme === 'light' ? '' : 'work-bench-modal-confirm',
            onOk: async () => {
                logNew('监控工作台交接班待办组件', '300016');

                const result = await api.checkTakeSubmit(data);
                errorHandle(result, saveTake);
            },
        });
    };

    const defaultData = useMemo(() => {
        return {
            ...schedulingObj,
            ...frameInfo,
        };
    }, [schedulingObj, frameInfo]);

    let disabled = false;

    if (personnelState === '0') {
        disabled = !schedulingObj?.groupId || !hasAuth;
    } else if (['1', '1001'].includes(personnelState)) {
        disabled = schedulingObj?.isDuty === 0;
    } else if (['2', '1002'].includes(personnelState)) {
        disabled = schedulingObj?.isDuty === 0;
    }

    return (
        <div className="dochange-shifts-container">
            {visible && (
                <ShiftInformationModal
                    visible={visible}
                    setVisible={setVisible}
                    defaultData={defaultData}
                    handleSwitchUser={handleSwitchUser}
                    sheetStay={sheetStay}
                    getDataInfo={getDataInfo}
                    checkHandSubmit={checkHandSubmit}
                />
            )}
            <AuthButton
                type="primary"
                authKey="workbench-Workbench-components-Handover-Shift-Over"
                ignoreAuth
                disabled={disabled}
                style={{ height: '32px', fontSize: '14px' }}
                onClick={() => {
                    if (['0', '2', '1002'].includes(personnelState)) {
                        takeover();
                    } else {
                        handover();
                    }
                }}
            >
                {['0'].includes(personnelState) && <div className="button-style-word">我要接班</div>}
                {['1', '1001'].includes(personnelState) && <div className="button-style-word">交班</div>}
                {['2', '1002'].includes(personnelState) && <div className="button-style-word">接班</div>}
            </AuthButton>
            <div className="remaining-time">
                {['1', '1001'].includes(personnelState) && personnelState === '1' && `剩余时间${countdown || '00:00'}`}
            </div>
        </div>
    );
};
export default DoChange;
