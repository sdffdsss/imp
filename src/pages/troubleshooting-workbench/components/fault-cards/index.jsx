import React, { useEffect, useState, useRef, forwardRef, useLayoutEffect, useImperativeHandle } from 'react';
import { Virtuoso as VList } from 'react-virtuoso';
import { useHistory } from 'react-router-dom';
import { getInitialRegion, getInitialProvince } from '@Common/utils/getInitialProvince';
import useLoginInfoModel from '@Src/hox';
import { message, Modal, Image } from 'oss-ui';
import { sendLogFn } from '@Pages/components/auth/utils';
import { MajorList } from '@Src/common/enum/majorFaultReportEnum';
import AuthButton from '@Components/auth-button';
import constants from '@Src/common/constants';
import { useNavigatePage, useAuth } from '@Src/hooks';
import { FAILURE_REPORT_STATUS } from '@Src/pages/fault-report/type';
import { authData } from '@Src/pages/network-fault-file/auth';
import anime from 'animejs/lib/anime.es.js';
import { getCardsList, readCards, deleteCard } from '../../group-workbench/api';
import { syncCentralizationApi, getFaultReportDetail } from '../../api';
import './index.less';
import ViewIcon from '../../img/view.svg';
import AddIcon from '../../img/add.svg';
import ReadIcon from '../../img/read.svg';
import DeleteIcon from '../../img/delete.svg';
import SyncIcon from '../../img/sync.png';
import { MsgModal } from '../modals';
import Tips from './tips.jsx';
import { PUBLIC_OPINION } from '../../types';
import ProcessBtns from '@Components/processBtns';
import FaultReportModal from '@Src/pages/troubleshooting-workbench/components/header/fault-report-modal';

const Index = (props, ref) => {
    const {
        provinceId,
        selProfessional,
        receiveMsg,
        time,
        lightFlag,
        mapMode,
        cityId,
        benchType,
        pushMessage,
        setSelectedCard,
        selectedCard,
        needOpenSpecialty,
        timeType,
        lowerFlag,
        noAuth,
        provinceList,
        dockLeft,
    } = props; // benchType 集团为undefined  省份为true
    const { specialty, failureClass } = selProfessional;
    const [cardList, setCardList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [currentData, setCurrentData] = useState({});
    const [cardIndex, setCardIndex] = useState(8);
    const [showPublicOpinionBg, setShowPublicOpinionBg] = useState(false);
    const [hasPublicOpinion, setHasPublicOpinion] = useState(false);

    // 重大故障上报参数
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [editType, setEditType] = useState('');
    const [currentItem, setCurrentItem] = useState(null);
    const [isView, setIsView] = useState(false);

    // 该状态是为了防止卡片点击卡顿
    const [selectedCardState, setSelectedCardState] = useState({});
    const login = useLoginInfoModel();
    const { mgmtZones, zoneLevelFlags, userId, userInfo, currentZone, isAdmin } = login;
    const timerRef = useRef(null);
    const { pushActions } = useNavigatePage();
    const { isHasAuth, isHasPathAuth } = useAuth();
    const history = useHistory();

    const [isFold, setIsFold] = useState(false);

    const showFaultModal = (item, type, titles) => {
        console.log('item====', item);
        if (!item.flagId) {
            getFaultReportDetail({
                lifeType: 1,
                modelId: 2,
                standardAlarmId: item.standardAlarmId,
            }).then((res) => {
                setCurrentItem({ ...res.data, ...item });
            });
        } else {
            setCurrentItem(item);
        }
        setEditType(type);
        setTitle(titles);
        if (titles.indexOf('上传附件') >= 0) {
            const flagId = item?.flagId ? `flagId=${item?.flagId}` : '';
            const status = item?.latestReportStatus ? `&status=${item?.latestReportStatus}` : '';
            const faultDistinctionType = item?.faultDistinctionType ? `&type=${item?.faultDistinctionType}` : '';
            const btnKey = type ? `&btnKey=${type}` : '';
            history.push(
                `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report/fault-report-add?${flagId}${status}${faultDistinctionType}${btnKey}&isWorkbench=true`,
            );
        } else {
            setIsModalOpen(true);
        }
        setIsView(titles.indexOf('查看') >= 0);
    };

    const onFaultReportCancel = () => {
        setCurrentItem(null);
        setIsView(false);
        setIsModalOpen(false);
        setEditType('');
    };

    const getCardsInfo = async () => {
        const param = {
            provinceId: provinceId === 'china' || provinceId === 'country' ? '0' : provinceId,
            specialty,
            failureClass,
            time,
            userId: login.userId,
            cityId: cityId || undefined,
            reportUser: userId,
            timeType,
        };
        if (mapMode === 'online') {
            param.provinceId = '0';
            param.cityId = undefined;
        }
        if (benchType) {
            param.accountProvinceId = param.provinceId;
        }
        const res = await getCardsList(param);

        if (benchType) {
            setHasPublicOpinion(false);

            const publicOpinionData = await getCardsList({ ...param, cityId: undefined, specialty: PUBLIC_OPINION, failureClass: undefined });
            const count = publicOpinionData?.data?.filter((item) => item.failureClass !== '21')?.length || 0;
            setHasPublicOpinion(count > 0);
        }
        if (res.data) {
            if (!lightFlag) {
                setCardList(
                    res.data.map((e) => {
                        return { ...e, timer: null };
                    }),
                );
            }
            setCardList(res.data);
        }
    };
    const readCard = async (item, index) => {
        const { flagId, topic, standardAlarmId } = item;
        const newCardList = cardList;
        newCardList[index].new = false;
        const param = {
            flagId,
            topic,
            userId: login.userId,
            userName: login.userName,
            standardAlarmId,
            provinceId: login.provinceId,
            timeType,
        };
        // 调已读接口
        const res = await readCards(param);
        console.log(res);
        setCardList([...newCardList]);
    };
    const skip2NetWorkFaultFile = (id) => {
        pushActions(`/network-fault-file`, { flagId: id });
    };
    // const onSyncNotice = (flagIds) => {
    //     message.success({
    //         className: 'fault-report-message-success-b',
    //         content: (
    //             <div className="fault-report-modal-success">
    //                 <div>上报成功！已同步至网络故障集中存档！</div>
    //                 <div className="fault-report-modal-success-link" onClick={() => }>
    //                     {'>>前往补充故障信息'}
    //                 </div>
    //             </div>
    //         ),
    //     });
    // };
    const handleSyncButton = async (flagId) => {
        const params = {
            flagIdList: [flagId],
            userId,
        };
        const res = await syncCentralizationApi(params);
        if (res.code === 200) {
            const editFlag = isHasAuth(authData.editFault) && isHasPathAuth('/unicom/network-fault-file');
            if (editFlag) {
                skip2NetWorkFaultFile(flagId);
            } else {
                message.success('同步成功');
            }
        } else {
            message.error(res.message);
        }
    };
    const cardActions = async (e, item, index, type) => {
        e.stopPropagation();
        readCard(item, index);
        const { operationsButton = [] } = JSON.parse(userInfo);
        const fieldFlag = operationsButton.find((items) => items.key === item.authKey);
        switch (type) {
            case 'view':
                sendLogFn({ authKey: 'faultSchedule:faultCardShow' });
                // 查看故障弹窗
                props.viewFault(item);
                break;
            case 'add':
                sendLogFn({ authKey: 'faultSchedule:faultCardAdd' });
                // 故障续保弹窗
                if (!fieldFlag) {
                    message.warn(`您没有${item.authName}权限，请联系管理员在角色管理中授权`);
                } else {
                    props.faultReport(item);
                }

                break;
            case 'read':
                sendLogFn({ authKey: 'faultSchedule:faultCardRead' });
                // 查看已读弹窗
                if (item.flagId && item.flagId !== currentData.flagId && item.specialty === '7') {
                    props.setShowRelatedLine(true);
                } else {
                    props.setShowRelatedLine(false);
                }
                setCurrentData(item);
                setVisible(true);
                break;
            case 'sync':
                await handleSyncButton(item.flagId);
                await getCardsInfo();
                break;
            default:
        }
    };
    const bgStyle = (item) => {
        const { countdownTime, latestReportStatus, countdownNode, finalReportCountdownNode, reportStatus } = item;
        const yellowTime = countdownNode?.[0] || 1800;
        const orangeTime = countdownNode?.[1] || 2700;
        const redTime = countdownNode?.[2] || 3300;
        const endTime = countdownNode?.[3] || 3600;
        const passTime = finalReportCountdownNode?.[0] || 86400;
        const countTime = countdownTime;
        let color = 'normal';

        // 客服舆情信息专业不修改卡片样式
        if (item.specialty === PUBLIC_OPINION) {
            return color;
        }

        if (benchType && lightFlag && needOpenSpecialty.includes(item.specialty) && countdownTime >= yellowTime && latestReportStatus) {
            if (latestReportStatus === '2') {
                if (countTime >= redTime) {
                    color = 'red';
                } else if (countTime >= orangeTime && countTime < redTime) {
                    color = 'orange';
                } else if (countTime >= yellowTime && countTime < orangeTime) {
                    color = 'yellow';
                } else {
                    color = 'normal';
                }
            } else if (countTime >= passTime && latestReportStatus !== '6') {
                color = 'red';
            } else {
                color = 'normal';
            }
        }
        return color;
    };

    const cardDelete = (e, item) => {
        e.stopPropagation();
        const { flagId, standardAlarmId, topic } = item;
        Modal.destroyAll();
        Modal.confirm({
            title: <div className="delete-modal-title">是否确认删除？</div>,
            icon: '',
            okText: '确认',
            cancelText: '取消',
            className: 'delete-modal',
            onOk: async () => {
                const params = {
                    flagId,
                    standardAlarmId,
                };
                const res = await deleteCard(params);
                if (+res.code === 200) {
                    message.success(`${topic}删除成功`);
                    getCardsInfo();
                }
            },
        });
    };

    const deleteButton = (item) => {
        const { zoneId } = currentZone;
        // 集团账号只能删除集团的
        // 大区账号只能删除本大区的
        // 省账号只能删除本省的
        if (item.provinceId !== zoneId) {
            return null;
        }
        // 同区域下一般用户删除自己的，管理员可以删除同省下的所有
        if (!isAdmin && item.reportUser !== userId) {
            return null;
        }
        return (
            <AuthButton type="text" style={{ padding: 0 }} onClick={(e) => cardDelete(e, item)} authKey="faultReport:delete">
                <img src={DeleteIcon} alt="" className="user-info-row-icon" />
            </AuthButton>
        );
    };
    // const changeZIndex = (bool) => {
    //     console.log('bool', bool);

    //     setCardIndex(bool ? 9 : 8);
    // };

    const actionBtns = (items, index) => {
        const item = { ...items };
        if (item.reportTypeName && item.reportTypeName !== '告警待确认' && item.flagId) {
            item.authKey = 'faultReport:continue';
            item.authName = '故障上报续报';
        } else {
            item.authKey = 'faultReport:add';
            item.authName = '故障上报首保';
        }

        // 客服舆情信息专业下不显示新增按钮
        if (item.specialty === PUBLIC_OPINION) {
            item.authKey = '';
        }
        const isShowSync =
            item.syncState === 0 &&
            item.reportTypeName === '终报' &&
            item.specialty !== '16' &&
            item.provinceId === getInitialRegion(login).zoneId &&
            item.faultReportStatus !== '2' &&
            item.taskName !== '终报修改待审核';
        if (benchType) {
            return (
                <div style={{ display: 'flex' }}>
                    {item.buttonList ? (
                        <ProcessBtns row={item} cardsDockedLeft={props.dockLeft} openMajorModal={showFaultModal} />
                    ) : !noAuth && item.faultReportStatus !== '2' ? (
                        <AuthButton type="text" style={{ padding: 0 }} onClick={(e) => cardActions(e, item, index, 'add')} authKey={item.authKey}>
                            {item.provinceId === getInitialRegion(login).zoneId && item.alarmStatus !== '已取消' && (
                                <img src={AddIcon} alt="" className="user-info-row-icon" />
                            )}
                        </AuthButton>
                    ) : null}
                    {isShowSync ? (
                        <AuthButton
                            type="text"
                            style={{ padding: 0 }}
                            onClick={(e) => cardActions(e, item, index, 'sync')}
                            authKey="troubleshootingWorkbench:sync"
                        >
                            <img src={SyncIcon} alt="" className="user-info-row-icon" />
                        </AuthButton>
                    ) : null}
                    {/* {!noAuth ? (
                        <AuthButton type="text" style={{ padding: 0 }} onClick={(e) => cardActions(e, item, index, 'add')} authKey={item.authKey}>
                            {item.provinceId === getInitialRegion(login).zoneId && item.alarmStatus !== '已取消' && (
                                <img src={AddIcon} alt="" className="user-info-row-icon" />
                            )}
                        </AuthButton>
                    ) : null} */}
                    {/* {item.reportType !== '-1' && item.flagId && (
                        <img src={ViewIcon} alt="" className="user-info-row-icon" onClick={(e) => cardActions(e, item, 'view')} />
                    )} */}
                    <img src={ViewIcon} alt="" className="user-info-row-icon" onClick={(e) => cardActions(e, item, index, 'view')} />
                    {item.reportTypeName !== '告警待确认' && item.flagId && (
                        <img src={ReadIcon} alt="" className="user-info-row-icon" onClick={(e) => cardActions(e, item, index, 'read')} />
                    )}

                    {/* {deleteButton(item)} */}
                </div>
            );
        }
        return (
            <div style={{ display: 'flex' }}>
                {item.buttonList ? (
                    <ProcessBtns row={item} cardsDockedLeft={props.dockLeft} openMajorModal={showFaultModal} />
                ) : (
                    <AuthButton type="text" style={{ padding: 0 }} onClick={(e) => cardActions(e, item, index, 'add')} authKey={item.authKey}>
                        {item.provinceName === '集团' && item.alarmStatus !== '已取消' && <img src={AddIcon} alt="" className="user-info-row-icon" />}{' '}
                    </AuthButton>
                )}
                {isShowSync ? (
                    <AuthButton
                        type="text"
                        style={{ padding: 0 }}
                        onClick={(e) => cardActions(e, item, index, 'sync')}
                        authKey="troubleshootingWorkbench:sync"
                    >
                        <img src={SyncIcon} alt="" className="user-info-row-icon" />
                    </AuthButton>
                ) : null}
                {/* <AuthButton type="text" style={{ padding: 0 }} onClick={(e) => cardActions(e, item, index, 'add')} authKey={item.authKey}>
                    {item.provinceName === '集团' && item.alarmStatus !== '已取消' && <img src={AddIcon} alt="" className="user-info-row-icon" />}{' '}
                </AuthButton> */}
                <img src={ViewIcon} alt="" className="user-info-row-icon" onClick={(e) => cardActions(e, item, index, 'view')} />
                <img src={ReadIcon} alt="" className="user-info-row-icon" onClick={(e) => cardActions(e, item, index, 'read')} />

                {/* {deleteButton(item)} */}
            </div>
        );
    };

    const tipsOthers = (item, num) => {
        const { countdownNode, finalReportCountdownNode } = item;
        const endTime = countdownNode?.[3] || 3600;
        const passTime = finalReportCountdownNode?.[0] || 86400;
        return (
            // eslint-disable-next-line no-nested-ternary
            (
                item.countdownTime > passTime
                    ? item.finalReportCountdownContext
                    : item.countdownTime > endTime
                    ? item.countdownContextUp
                    : item.countdownContextDown
            )?.split('${countdownTime}')[num]
        );
    };
    const clickCard = (item, index, type = '') => {
        console.log(item);
        /**
         *   item.source 0是手动 其他是自动
         *   item.specialty '7'是干线承载网
         *   item.reportType '-1' 是告警待确认
         */
        // if (!item.source || item.specialty !== '7') return;
        // 如果点击已选项则清除选中
        if (
            (selectedCardState.flagId && selectedCardState.flagId === item.flagId) ||
            (selectedCardState.standardAlarmId && selectedCardState.standardAlarmId === item.standardAlarmId)
        ) {
            setSelectedCardState({});
            setTimeout(() => {
                setSelectedCard({});
                props.setShowRelatedLine(false);
                props.setRelatedVisible(false);
                if (type === 'skipRead') return;
                readCard(item, index);
            });
            return;
        }

        setSelectedCardState(item);
        setTimeout(() => {
            setSelectedCard(item);
            // 有flagId + flagId不是当前选中过的flagId + 选中卡片的专业为干线承载传输网 + 不为告警待确认的卡片&& item.reportType !== '-1';
            const flag1 = item.flagId && item.flagId !== currentData.flagId && item.specialty === '7' && item.reportType !== '-1';
            const flag2 =
                item.standardAlarmId && item.standardAlarmId !== currentData.standardAlarmId && item.specialty === '7' && item.reportType !== '-1';
            // 如果点击的是手动卡片则不展示图例和浮窗
            if (!item.source) {
                props.setShowRelatedLine(false);
                props.setRelatedVisible(false);
                return;
            }
            if (flag1) {
                props.setShowRelatedLine(true);
                return;
            }
            if (flag2) {
                props.setShowRelatedLine(true);
            } else {
                props.setShowRelatedLine(false);
                props.setRelatedVisible(false);
            }
            if (type === 'skipRead') return;
            readCard(item, index);
        });
    };
    const isSelectedClassName = (item) => {
        if (item.flagId && item.flagId === selectedCardState?.flagId) {
            return true;
        }
        if (item.standardAlarmId && item.standardAlarmId === selectedCardState?.standardAlarmId) {
            return true;
        }
        return false;
    };

    function executeAnimation() {
        if (benchType) {
            setShowPublicOpinionBg(false);
            setTimeout(() => {
                const cards = document.getElementsByClassName(`cards-item`);
                const cardsArr = Array.from(cards).filter((item) => {
                    const classList = Array.from(item.classList);

                    return classList.includes('normal');
                });

                for (let i = 0; i < cardsArr.length; i++) {
                    cardsArr[i].style.animation = 'publicOpinionFlicker 1s linear 0s 10';
                }

                setTimeout(() => {
                    setShowPublicOpinionBg(true);
                    for (let i = 0; i < cards.length; i++) {
                        cards[i].style.animation = 'initial';
                    }
                }, 10 * 1000);
            });
        }
    }

    useEffect(() => {
        if (provinceId) {
            getCardsInfo();
        }
        setSelectedCard({});
        props.setShowRelatedLine(false);
        props.setRelatedVisible(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specialty, failureClass, provinceId, cityId, timeType]);

    useEffect(() => {
        setSelectedCardState(selectedCard);
    }, [selectedCard]);
    useEffect(() => {
        if (!benchType && receiveMsg?.provinceId !== '0' && !receiveMsg?.flagId) {
            if (!receiveMsg?.whetherGroupDisplay && receiveMsg?.notificationType !== 5 && receiveMsg?.notificationType !== 4) {
                return;
            }
        }
        if (benchType && receiveMsg?.provinceId === '0' && receiveMsg?.specialty !== PUBLIC_OPINION) {
            return; // 集团账号上报的不通知省份工作台
        }
        if (noAuth && currentZone.zoneLevel === '5') {
            if (provinceList.findIndex((e) => e.zoneId == receiveMsg?.provinceId) === -1 && currentZone.zoneId !== receiveMsg?.provinceId) return;
        }

        if (receiveMsg?.flagId || receiveMsg?.standardAlarmId) {
            const {
                failureTime,
                provinceName,
                specialtyName,
                // failureClass,
                failureClassName,
                topic,
                countdownContext,
                countdownTime,
                flagId,
                source,
                reportTypeName,
                latestReportStatus,
                standardAlarmId,
                notificationType,
                reportUser,
                reportStatus,
                // specialty,
                involvedProvince,
                whetherGroupDisplay,
                faultDistinctionType,
            } = receiveMsg;
            console.log('新增卡片：', { receiveMsg });
            if (faultDistinctionType === 2 && source === 0) return;

            if (notificationType === 5 || notificationType === 4) {
                // ws推送删除卡片信息
                getCardsInfo();
                return;
            }
            const curItem = cardList.find((e) => (standardAlarmId && e.standardAlarmId === standardAlarmId) || (flagId && e.flagId === flagId));
            // curItem 为空  新增插入故障或者告警    不为空更新卡片
            if (
                (latestReportStatus === '2' && notificationType === 1) ||
                ((latestReportStatus === '2' || !latestReportStatus) && notificationType === 3) ||
                (latestReportStatus === '6' && notificationType === 1 && receiveMsg.specialty === PUBLIC_OPINION)
            ) {
                // latestReportStatus为2 插入故障 notificationType 为3 插入告警
                const newData = {
                    ...receiveMsg,
                    new: true,
                };
                if (curItem) {
                    const alarmIndex = cardList.findIndex(
                        (e) =>
                            (curItem.flagId && e.flagId === curItem.flagId) ||
                            (curItem.standardAlarmId && e.standardAlarmId === curItem.standardAlarmId),
                    );
                    if (alarmIndex > -1) {
                        cardList.splice(alarmIndex, 1);
                    }
                }
                if (receiveMsg?.specialty === specialty || (!specialty && receiveMsg?.specialty !== '16')) {
                    // 全部专业下，新增舆情不插入卡片
                    if (receiveMsg?.failureClass === failureClass || !failureClass) {
                        if (
                            receiveMsg?.provinceId === provinceId ||
                            ((receiveMsg.provinceId === '0' || receiveMsg.reportLevel?.indexOf('0') > -1 || whetherGroupDisplay) &&
                                (provinceId === 'country' || !provinceId)) ||
                            (zoneLevelFlags.isRegionZone && mgmtZones.find((item) => item.zoneId === receiveMsg.provinceId)) ||
                            involvedProvince?.findIndex((e) => Number(e) === Number(provinceId)) > -1
                        ) {
                            if (receiveMsg?.cityId === cityId || !cityId) {
                                console.log('newData===', newData);
                                cardList.unshift(newData);
                                setCardList([...cardList]);

                                setTimeout(() => {
                                    const dom = document.getElementById(`cards-${newData.flagId || newData.standardAlarmId}`);
                                    if (dom) {
                                        dom.style.opacity = 0;
                                        dom.style.right = '-190px';
                                        setTimeout(() => {
                                            anime({
                                                targets: dom,
                                                opacity: 1,
                                                right: 0,
                                                duration: 1250,
                                                easing: 'easeInOutQuad',
                                            });
                                        });
                                    }
                                });
                            }
                        }
                    }
                }

                if (
                    involvedProvince?.findIndex((e) => Number(e) === Number(provinceId)) > -1 &&
                    receiveMsg?.specialty === PUBLIC_OPINION &&
                    receiveMsg?.failureClass !== '21'
                ) {
                    setHasPublicOpinion(true);
                    setTimeout(() => {
                        executeAnimation();
                    });
                }
            } else {
                const newCardList = cardList.map((e) => {
                    const isUpdateArr = ['1', '3', '4', '5'];
                    let canUpdate = false;
                    if (isUpdateArr.includes(latestReportStatus)) {
                        if (reportUser === userId || receiveMsg?.ruleId) {
                            canUpdate = true;
                        }
                    } else {
                        canUpdate = true;
                    }
                    if (
                        canUpdate &&
                        ((e.flagId && e.flagId === receiveMsg.flagId) || (!e.flagId && e.standardAlarmId === receiveMsg.standardAlarmId))
                    ) {
                        const newData = {
                            ...e,
                            failureTime,
                            topic,
                            provinceId: receiveMsg.provinceId,
                            provinceName,
                            reportTypeName,
                            specialtyName,
                            failureClassName,
                            countdownContext,
                            countdownTime,
                            source,
                            flagId,
                            latestReportStatus:
                                latestReportStatus === '4' && e.latestReportStatus === '3' ? e.latestReportStatus : latestReportStatus,
                            notificationType,
                            reportStatus,
                            buttonList: receiveMsg?.buttonList || e?.buttonList,
                        };
                        return newData;
                    }
                    return e;
                });
                //  专业  故障   省份  地市  逐级对比
                if (receiveMsg?.specialty === specialty || !specialty) {
                    if (receiveMsg?.failureClass === failureClass || !failureClass) {
                        if (
                            receiveMsg?.provinceId === provinceId ||
                            ((receiveMsg.provinceId === '0' || receiveMsg.reportLevel?.indexOf('0') > -1) &&
                                (provinceId === 'country' || !provinceId)) ||
                            (mgmtZones?.isRegionZone && mgmtZones.find((item) => item.zoneId === receiveMsg.provinceId))
                        ) {
                            if (receiveMsg?.cityId === cityId || !cityId) {
                                console.log(newCardList, '=====');
                                setCardList(newCardList);
                            }
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receiveMsg]);
    const searchParams = new URLSearchParams(window.location.search);
    const VListRef = useRef(null);
    useEffect(() => {
        const skipFlagId = searchParams.get('flagId');
        if (skipFlagId) {
            const findItem = cardList.find((item) => item.flagId === skipFlagId);
            const findIndex = cardList.findIndex((item) => item.flagId === skipFlagId);

            if (findItem && VListRef.current) {
                VListRef.current.scrollToIndex({
                    index: findIndex,
                });
                clickCard(findItem, findIndex);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardList.length]);

    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (cardList.length > 0) {
            timerRef.current = setInterval(() => {
                cardList.forEach((item) => {
                    if (
                        item.specialty !== PUBLIC_OPINION &&
                        !!item.countdownTime &&
                        benchType &&
                        lightFlag &&
                        needOpenSpecialty.includes(item.specialty) &&
                        item.countdownTime < 3600
                    ) {
                        item.countdownTime++;
                    }
                });
            }, 1000);
        }
        return () => {
            clearInterval(timerRef.current);
        };
    }, [cardList, needOpenSpecialty, benchType, lightFlag]);

    useEffect(() => {
        if (hasPublicOpinion) {
            executeAnimation();
        }
        // eslint-disable-next-line
    }, [hasPublicOpinion]);
    useImperativeHandle(ref, () => {
        return {
            updateCardList: () => getCardsInfo(),
        };
    });

    useLayoutEffect(() => {
        if (!dockLeft || cardList.length === 0) {
            return;
        }

        const intervalId = setInterval(() => {
            const foldBtnEl = document.querySelector('.fold-btn');
            if (!foldBtnEl) {
                return;
            }

            clearInterval(intervalId);

            const cardsRootEl = document.querySelector('.group-workbench-cards');
            const cardItemParentEl = cardsRootEl?.firstChild?.firstChild?.firstChild;

            const cardsRootClientHeight = cardsRootEl?.clientHeight || 0;
            const cardItemParentClientHeight = cardItemParentEl?.clientHeight || 0;

            foldBtnEl.style.top = `${Math.min(cardsRootClientHeight, cardItemParentClientHeight) / 2}px`;
        }, 100);
    }, [cardList, dockLeft]);

    useEffect(() => {
        setIsFold(false);
    }, [dockLeft]);

    const cardStyle = {};
    cardStyle.height = `calc(100% - ${270}px)`;
    if (dockLeft) {
        cardStyle.height = `calc(100% - ${330}px)`;
    }
    if (cardList.length === 0) {
        cardStyle.height = 0;
    }

    // 首报、续报、终报不显示未确认、已确认状态
    const checkReportStatus = (item) => {
        return !(
            (item.reportStatus === FAILURE_REPORT_STATUS.FIRST_REPORT ||
                item.reportStatus === FAILURE_REPORT_STATUS.CONTINUE_REPORT ||
                item.reportStatus === FAILURE_REPORT_STATUS.FINAL_REPORT ||
                item.reportStatus === FAILURE_REPORT_STATUS.FINAL_REPORT_MAJOR) &&
            (item?.alarmStatus === '未确认' || item?.alarmStatus === '已确认')
        );
    };

    return (
        <div style={cardStyle} className={`group-workbench-cards ${dockLeft ? 'docked-left' : ''} ${isFold ? 'fold' : ''}`}>
            <MsgModal visible={visible} setVisible={setVisible} data={currentData} />
            <VList
                style={{
                    flex: 1,
                }}
                className="hide-scrollbar VList-wrapper-element"
                data={cardList}
                ref={VListRef}
                itemContent={(index, item) => {
                    const faultStatusMap = {
                        0: '手动',
                        1: '自动',
                    };
                    let faultStatus = faultStatusMap[item.source];
                    if (item.source === 1 && item.faultDistinctionType === 2) {
                        faultStatus = '自动识别(区县级)';
                    }
                    return (
                        <div
                            key={item.flagId || item.standardAlarmId}
                            id={`cards-${item.flagId || item.standardAlarmId}`}
                            className={`${item.new ? 'slide' : ''} cards-item ${bgStyle(item, index)} ${isSelectedClassName(item) ? 'selected' : ''}${
                                benchType && hasPublicOpinion && showPublicOpinionBg && bgStyle(item, index) === 'normal' ? ' has-public-opinion' : ''
                            }`}
                            onClick={() => clickCard(item, index)}
                        >
                            <div className="cards-item-time">
                                <div className="header-left">
                                    {item.new && <div className="red-dot" />}
                                    {/* 客服舆情信息专业不展示 自动 手工 */}
                                    {item.specialty !== PUBLIC_OPINION && <div className="fault-status">{faultStatus}</div>}
                                    {item.failureTime}
                                </div>
                                {actionBtns(item, index)}
                            </div>
                            <div className="cards-item-title">{item.topic}</div>
                            <div className="cards-item-enum">
                                <div className="cards-item-enum-sub region">{item?.provinceName || '江苏省'}</div>
                                {item.specialty !== PUBLIC_OPINION && item.reportTypeName && item.reportTypeName !== '告警待确认' && (
                                    <div className="cards-item-enum-sub">{item?.reportTypeName}</div>
                                )}
                                {item.specialtyName && <div className="cards-item-enum-sub">{item?.specialtyName}</div>}
                                {item.reportTypeName !== '告警待确认' && item.reportTypeName && item?.failureClassName && (
                                    <div className="cards-item-enum-sub">{item?.failureClassName}</div>
                                )}
                                {item.application && <div className="cards-item-enum-sub">{item?.application}</div>}
                                {Boolean(item.source) && Boolean(item?.alarmStatus) && checkReportStatus(item) && (
                                    <div className="cards-item-enum-sub">{item?.alarmStatus}</div>
                                )}
                            </div>
                            {item.specialty !== PUBLIC_OPINION &&
                                !!item.countdownTime &&
                                benchType &&
                                lightFlag &&
                                needOpenSpecialty.includes(item.specialty) &&
                                item.countdownTime >= 1800 && (
                                    <div
                                        id={`content-${item.flagId}`}
                                        // style={{ fontSize: px2rem(14) }}
                                        className={`tips-${bgStyle(item)} tips`}
                                    >
                                        {tipsOthers(item, 0)}
                                        {!!item.flagId && <Tips pushMessage={pushMessage} item={item} />}
                                        {tipsOthers(item, 1)}
                                    </div>
                                )}
                        </div>
                    );
                }}
            />
            {isModalOpen && (
                <FaultReportModal
                    title={title}
                    visible={isModalOpen}
                    onCancel={onFaultReportCancel}
                    dataSource={currentItem}
                    isView={isView}
                    // goToListPage={goToListPage}
                    setFaultReportDataSource={setCurrentItem}
                    setIsView={setIsView}
                    isMajor={editType.includes('major') || Object.keys(MajorList).includes(editType)}
                    btnKey={editType}
                    cardsDockedLeft={props.dockLeft}
                />
            )}
            {dockLeft && cardList.length > 0 && (
                <div className="fold-btn" onClick={() => setIsFold(!isFold)}>
                    <Image preview={false} width="24px" src={`${constants.IMAGE_PATH}/group-workbench/${isFold ? 'unfold' : 'fold'}.png`} />
                </div>
            )}
        </div>
    );
};
export default forwardRef(Index);
