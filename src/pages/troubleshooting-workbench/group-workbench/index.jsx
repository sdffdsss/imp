import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import moment from 'moment';
// import _isEmpty from 'lodash/isEmpty';
import { usePersistFn } from 'ahooks';
import stompjs from 'stompjs';
import { Spin, message } from 'oss-ui';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { useOpenFrameworkRoute } from '@Src/hooks';
import Iframe from 'react-iframe';
import { _ } from 'oss-web-toolkits';
import constants from '@Common/constants';
import classNames from 'classnames';
import GlobalMessage from '@Src/common/global-message';
import { getMapConfigApi } from '@Common/services/configService';
import zoneLevel from '@Common/enum/zoneLevel';
import { getConfiguration } from '@Pages/large-screen-console/api';
import Legend from '../components/legend';
import GroupHeader from '../components/header';
import GroupProfessional from './components/professional';
import FaultCards from '../components/fault-cards';
import ProvinceSelect from './components/province-select';
import FaultReportMsg from '../components/fault-report-msg';
import StatisticsCard from '../components/statistics-card';
import FloatingWindow from '../components/floating-window';
import LegendCard from '../components/legend-card';
import GisMap from '../components/bmap';
import { OpticCableDetailModal } from '../components/modals';
import {
    getOnlineProvinceData,
    getShiftingOfDutyStatus,
    getLightSetting,
    clearInfos,
    getFaultInvolveCount,
    getReportCount,
    getZones,
    confirmReport,
    confirmNomralReport,
    getCardBtnList,
} from '../api';
import { useBMapState, useForceReInitMapGis } from './hooks/bmap-state';
import { getInitialProvince } from '@Common/utils/getInitialProvince';
import './index.less';
import KeepAlive from 'react-activation';
import { MajorFaultReportEnum, ModifyList } from '@Src/common/enum/majorFaultReportEnum';
import { getFaultReportSpecialtyApi } from '@Pages/large-screen-console/api';

let stompClient = null;
const time = moment().format('yyyy-MM-DD HH:mm:ss');
export default forwardRef((props, ref) => {
    const [receiveMsg, setReceiveMsg] = useState();
    const [receiveMsgForMap, setReceiveMsgForMap] = useState();
    const [upDateMsg, setUpDateMsg] = useState();
    const [newMsgToProfession, setNewMsgToProfession] = useState();
    const [mapMode, setMapMode] = useState('');
    // const [onDuty, setOnDuty] = useState(false);
    const [goDownFlag, setGoDownFlag] = useState(false);
    const [clickFlag, setClickFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [areaId, setAreaId] = useState('china');
    const [provinceId, setProvinceId] = useState('');
    const [cityId, setCityId] = useState('');
    const [tempProvinceList, setTempProvinceList] = useState([]);
    const [selProfessional, setSelProfessional] = useState({});
    const [faultInvolveCount, setFaultInvolveCount] = useState({});
    const login = useLoginInfoModel();
    const [relatedVisible, setRelatedVisible] = useState(false);
    const [showRelatedLine, setShowRelatedLine] = useState(false);
    const [floatingWindowInfo, setFloatingWindowInfo] = useState();
    const [selectedCard, setSelectedCard] = useState({});

    const [, forceUpdate] = useState(false);
    const voiceFlagRef = useRef(false);
    const lightFlagRef = useRef(true);
    const needOpenSpecialtyRef = useRef([]);
    const [visible, setVisible] = useState(false);
    const [lineInfo, setLineInfo] = useState({});
    const [professionalData, setProfessionalData] = useState([]);
    const [provinceData, setProvinceData] = useState([]);
    const [provinceOnlineCount, setProvinceOnlineCount] = useState(0);
    const [provinceList, setProvinceList] = useState([]);
    const openFrameworkRoute = useOpenFrameworkRoute();
    const agentIframeRef = useRef(null);
    const headerRef = useRef(null);
    const cardCompRef = useRef(null);
    const isFirstLoad = useRef(false);
    const faultPageUrlRef = useRef({
        coreFault: '',
        transFault: '',
    });
    const legendListData = [
        { label: '脱网设备', legendImgUrl: `${constants.IMAGE_PATH}/group-workbench/unrelated.png` },
        { label: '关联设备', legendImgUrl: `${constants.IMAGE_PATH}/group-workbench/related.png` },
        { label: '关联线路', legendImgUrl: `${constants.IMAGE_PATH}/group-workbench/associateTheLine.png` },
    ];
    const currentZoneId = _.get(login.currentZone, 'zoneId');
    const { timeType, lowerFlag, setLowerFlag, curShowType, noAuth, cardsDockedLeft, setCardsDockedLeft, reportRoleTypeName } = props;
    const getSetting = async () => {
        const res = await getLightSetting(login.userId);

        if (res?.data) {
            voiceFlagRef.current = res.data.voiceFlag !== '0';
            lightFlagRef.current = res.data.lightFlag !== '0';
            needOpenSpecialtyRef.current = res.data.specialty?.split(',') || [];
        } else {
            voiceFlagRef.current = false;
            lightFlagRef.current = true;
            needOpenSpecialtyRef.current = [];
        }
        forceUpdate((prev) => !prev);

        return voiceFlagRef.current;
    };

    const showLineModal = (item) => {
        const data = { ...item };
        const { currentZone } = login;
        data.regionId = currentZone.zoneId;
        setLineInfo(data);
        setVisible(true);
    };

    const handleIncomingMessage = usePersistFn((messageData) => {
        if (!messageData) return;
        const { notificationType, specialty, faultDistinctionType, source } = messageData;
        if (faultDistinctionType === 2 && source === 0) return;
        if (lightFlagRef.current) {
            setReceiveMsgForMap(messageData);
        }
        if (voiceFlagRef.current && needOpenSpecialtyRef.current.includes(specialty) && notificationType !== 4 && notificationType !== 5) {
            setReceiveMsg(messageData);
        } else {
            setNewMsgToProfession(messageData);
        }

        setUpDateMsg(messageData);
    });

    const pushMessage = usePersistFn((info) => {
        handleIncomingMessage(info);
    });

    const sendWebScoket = () => {
        // const socket = 'ws://172.24.131.231:8888/chatOps-dev/chatUrlWs/chatroom';
        const socketUrl = useEnvironmentModel?.data?.environment?.chatUrlWsUrl;
        const socketType = useEnvironmentModel?.data?.environment?.chatUrlType;

        const socket = socketType
            ? `ws://${window.location.host}/znjk/${constants.CUR_ENVIRONMENT}${socketUrl}`
            : useEnvironmentModel?.data?.environment?.chatUrlWs;
        stompClient = stompjs.client(socket); // 使用STMOP子协议的WebSocket客户端
        // if (stompClient.ws.readyState === 1) {
        stompClient?.connect(
            {},
            (frame) => {
                // 连接WebSocket服务端
                console.log(`Connected:${frame}`);
                // 广播接收信息
                stompTopic();
            },
            (errorCallBack) => {
                console.log(errorCallBack);
                if (stompClient.ws.readyState === 1) {
                    stompClient?.disconnect();
                }
                sendWebScoket();
            },
        );
        // }
    };
    const stompTopic = () => {
        // 通过stompClient.subscribe订阅/topic/getResponse 目标(destination)发送的消息（广播接收信息）

        if (stompClient.ws.readyState === 1) {
            stompClient?.subscribe(`/topic/response`, (response) => {
                if (response.body) {
                    const messageData = JSON.parse(response.body);
                    console.log(messageData, '=====data');
                    if (messageData?.updateTodo === true) {
                        const agentIframeRef = document.getElementById('AGENT-IFRAME');
                        if (agentIframeRef && messageData.userIds.includes(login.loginId)) {
                            agentIframeRef.contentWindow.postMessage(
                                {
                                    type: 'SEND_SEARCH_TODOLIST',
                                },
                                '*',
                            );
                        }
                    }
                    if (messageData?.ruleId !== null) {
                        // 新流程
                        if (messageData?.flagId || messageData?.standardAlarmId) {
                            getCardBtnList({
                                flagId: messageData?.flagId,
                                standardAlarmId: messageData?.standardAlarmId,
                            }).then((res) => {
                                if (res?.data) {
                                    messageData.buttonList = res.data;
                                }
                                console.log('newData===22', messageData);
                                handleIncomingMessage(messageData);
                            });
                        }
                    } else {
                        handleIncomingMessage(messageData);
                    }
                }
            });
        }
    };

    const clearLastInfos = async (specialty, failureClass) => {
        const { userId } = login;
        const params = {
            specialty,
            failureClass,
            userId,
            provinceId: provinceId === 'country' ? '0' : provinceId,
        };
        const res = await clearInfos(params);
        console.log(res);
    };
    const changeSubject = (item, type) => {
        const param = selProfessional;
        const { specialty, failureClass } = selProfessional;
        if (type === 'professional') {
            param.specialty = item.code;
            param.failureClass = '';
            if (specialty) {
                clearLastInfos(specialty);
            }
        } else {
            param.failureClass = item.code;
            if (specialty && failureClass) {
                clearLastInfos(specialty, failureClass);
            }
        }
        setSelProfessional({ ...param });
    };
    const getProvinceInfo = async () => {
        const res = await getOnlineProvinceData({});
        if (res?.data) {
            setTempProvinceList(res?.data?.provinceOnlineDetailList);
            setProvinceOnlineCount(res?.data?.provinceOnlineCount);
            setLoading(false);
        }
    };
    // const authorityJudge = async () => {
    //     const { userId } = login;
    //     const data = {
    //         userId,
    //         regionId: '0',
    //     };
    //     const res = await getShiftingOfDutyStatus(data);
    //     if (res.resultCode === '500' || res.resultCode === '9') {
    //         setOnDuty(false);
    //     } else {
    //         setOnDuty(true);
    //     }
    // };

    const getProvinceAndSpecilty = async () => {
        if (!provinceId || !timeType) return;
        const param = {
            userId: login.userId,
            time,
            provinceId: provinceId === 'country' ? 0 : provinceId,
            timeType,
        };
        const res = await getReportCount(param);
        if (res?.data) {
            setProfessionalData(res.data.faultSpecialtyCount);
        }
    };
    // 这里要求专业与省份联动，由于这俩是同一个接口返回，切到省份时，省份列表会变，所以这俩数据分开来取
    const getProvince = async () => {
        const param = {
            userId: login.userId,
            time,
            provinceId: 0,
            timeType,
        };
        const res = await getReportCount(param);
        if (res?.data) {
            setProvinceData(res.data.faultProvinceCount);
        }
    };

    useEffect(() => {
        console.log('工作台的mount :>> ');
        const fn = ({ isActive }) => {
            console.log('isActiveisActive', isActive);
            setTimeout(() => {
                // const frameworkTab = document.getElementsByClassName('framework-tab')[0];
                const frameworkTab = document.querySelector('.framework-tab');
                const tabcontainer = frameworkTab.querySelector(':scope>div>.oss-ui-tabs-nav');
                const overViewContainer = document.querySelector("div[data-name='oss-imp-unicom']");
                if (!isActive) {
                    if (overViewContainer) {
                        overViewContainer.parentNode.style.padding = '0px 2px 2px';
                    }
                    if (tabcontainer) {
                        tabcontainer.style.display = 'flex';
                    }
                } else {
                    if (overViewContainer) {
                        overViewContainer.parentNode.style.padding = '0px';
                    }

                    if (tabcontainer) {
                        tabcontainer.style.display = 'none';
                    }
                }
            }, 1000);
        };

        // 初次隐藏tab
        const frameworkTab = document.querySelector('.framework-tab');
        const tabcontainer = frameworkTab?.querySelector(':scope>div>.oss-ui-tabs-nav');
        if (window.location.pathname === `/znjk/${constants.CUR_ENVIRONMENT}/main/unicom/home/troubleshooting-workbench` && tabcontainer) {
            tabcontainer.style.display = 'none';
        }

        GlobalMessage.off('activeChanged', fn);
        GlobalMessage.off('activeChanged', 'imp-unicom', null);
        GlobalMessage.on('activeChanged', 'imp-unicom', fn);

        return () => {
            console.log('工作台的unmount :>> ');
            GlobalMessage.off('activeChanged', fn);
            GlobalMessage.off('activeChanged', 'imp-unicom', null);
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        getSetting().then(() => {
            sendWebScoket();
            // authorityJudge();
            getProvince();
            getProvinceInfo();
        });
        // watchTabActiveChange();
        const frameVisible = window.location.href.indexOf('hideNav') !== -1; // 是否为嵌入的故障上报
        // const tabcontainer = document.getElementsByClassName('oss-ui-tabs-nav')[0];
        const overViewContainer = document.querySelector("div[data-name='oss-imp-unicom']");
        if (overViewContainer || frameVisible) {
            overViewContainer.parentNode.style.padding = '0px';
        }
        // if (window.location.pathname.includes('/unicom/home/troubleshooting-workbench') && tabcontainer) {
        //     tabcontainer.style.display = 'none';
        // }

        return () => {
            if (stompClient != null) {
                // stompClient?.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeType]);
    useEffect(() => {
        getProvinceAndSpecilty();
    }, [provinceId, timeType]);
    useEffect(() => {
        if (selProfessional.specialty === '7') {
            const params = { provinceId: provinceId && provinceId === 'country' ? '0' : provinceId, specialty: selProfessional.specialty };

            getFaultInvolveCount(params).then((res) => setFaultInvolveCount(res.data));
        } else {
            setRelatedVisible(false);
            setShowRelatedLine(false);
            setSelectedCard({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selProfessional]);

    useEffect(() => {
        const timer = setInterval(() => {
            getProvinceInfo();
        }, 1000 * 60 * 3);
        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        getConfiguration({ userId: login.userId }).then((res) => {
            if (res.code === 0) {
                let coreFaultUrl = '';
                let transFaultUrl = '';

                res.data.forEach((item) => {
                    if (Array.isArray(item.children) && item.children.length > 0) {
                        item.children.forEach((itemIn) => {
                            if (itemIn.largeScreenId === 'core-fault') {
                                const globalUniqueID = localStorage.getItem('globalUniqueID');

                                coreFaultUrl = itemIn.url.replace('${globalUniqueID}', globalUniqueID);
                                // coreFaultUrl = `${itemIn.url}&globalUniqueID=${globalUniqueID}`;
                            } else if (itemIn.largeScreenId === 'fault') {
                                transFaultUrl = itemIn.url;
                            }
                        });
                    }
                });

                faultPageUrlRef.current = {
                    coreFault: coreFaultUrl,
                    transFault: transFaultUrl,
                };
            }
        });
    }, []);

    const getFaultInvolvedCount = (areaId) => {
        if (selProfessional.specialty === '7') {
            const params = { provinceId: areaId && areaId === 'country' ? '0' : areaId, specialty: selProfessional.specialty };
            getFaultInvolveCount(params).then((res) => {
                console.log(res.data);
                setFaultInvolveCount(res.data);
            });
        }
    };
    const fetchProvinceList = usePersistFn(async () => {
        const res = await getZones({ parent_zone_id: getInitialProvince(login) });
        const list = res?._embedded?.zoneResourceList || [];
        setProvinceList(list);
    });

    useEffect(() => {
        if (curShowType === 'province') {
            fetchProvinceList();
        }
    }, [curShowType, fetchProvinceList]);
    function onMapTypeAndProvinceChange({ modeInfo, selectedProvince }) {
        setProvinceId(selectedProvince.code);
        if (cityId) {
            setCityId('');
        }
        if (selectedProvince.code === 'country' || !selectedProvince.code) {
            setGoDownFlag(false);
        } else {
            setGoDownFlag(true);
        }
        // mapmode   online  在线用户数   fault 故障数
        const id = tempProvinceList.find((e) => e.areaName.indexOf(selectedProvince.desc) > -1)?.areaId;
        getFaultInvolvedCount(selectedProvince.code);
        setMapMode(modeInfo);
        setAreaId(id || 'china');
    }

    function handleSpeechSpeakEnd(newMsg) {
        setNewMsgToProfession(newMsg);
    }

    function onGisClick(areaId) {
        if (mapMode?.mode === 'online') {
            return;
        }
        if (goDownFlag) {
            setCityId(areaId);
        } else {
            setProvinceId(areaId);
        }
    }

    function onGisAreaChange(areaId) {
        console.log(areaId, '双击===', provinceId);
        if (mapMode?.mode === 'online') {
            return;
        }
        setClickFlag(true);
        setTimeout(() => {
            setProvinceId(areaId);
            setGoDownFlag(true);
        }, 100);
        console.log(selProfessional);
        getFaultInvolvedCount(areaId);
    }

    const [bMapState] = useBMapState({ selProfessional, mapMode: mapMode?.mode, areaId });

    const { state: bMapForceUpdateState, forceReInitMapGis } = useForceReInitMapGis({
        areaId,
        selProfessional,
        receiveMsg: receiveMsgForMap,
        enableHeatmap: bMapState.enableHeatmap,
    });

    const gisMapRequestParamsFormatter = usePersistFn(async (type) => {
        if (bMapState.enableHeatmap && type === 'heatmap') {
            const params = {};

            if (areaId === 'china') {
                Object.assign(params, {
                    regionLevel: 1,
                });
            } else {
                const configList = await getMapConfigApi();
                const item = configList.data.find((d) => d.adcode === areaId);

                Object.assign(params, {
                    regionId: areaId,
                    regionLevel: item ? zoneLevel[item.level] : undefined,
                });
            }

            return params;
        }
        return {};
    });

    const viewFault = (item) => {
        // 查看故障
        const isView = true;
        headerRef.current?.onShowFaultReport(item, isView);
    };
    const faultReport = (item) => {
        // 故障续保
        headerRef.current?.onShowFaultReport(item);
    };
    const updateCardList = () => {
        cardCompRef.current?.updateCardList();
    };

    const jumpToTransFault = () => {
        // 故障调度需要先判断是否有故障，若有则跳转，无则提示
        getFaultReportSpecialtyApi({
            timeType: 3,
            provinceName: '集团',
            specialtyType: '传输网',
        }).then((res) => {
            const localAccessToken = `Bearer ${
                localStorage.getItem('access_token') ||
                'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MjYyMjU5NzQyMDksImlhdCI6MTcyNjEzOTU3NCwidXNlcklkIjoiOTY4NjE3IiwianRpIjoiOWFlNzc3MWRjMTlhMWM0OTI4Yjg4MGMzNzVkNTIwOTc1ZjRjNTBkOSJ9.WoLpHb2UraYVVQFsxTiv-UzI7zjN7ahtxvxDDE9vBUo'
            }`;
            if (res.data.count) {
                // 跳转
                return window.open(`${faultPageUrlRef.current.transFault}&token=${localAccessToken}&eventId=${res.data.details[0]?.eventId}`);
            }
            const jumpznjkssoUrl = `${useEnvironmentModel?.data?.environment.jumpznjkssoNoVal?.url}&token=${localAccessToken}`;
            return window.open(jumpznjkssoUrl);
        });
    };

    useEffect(() => {
        window.addEventListener('message', (event) => {
            console.log('智能体传递消息 :>> ', event);
            if (event.data?.type === 'CLOSE_AGENT') {
                // setShowAgent(false);
                setCardsDockedLeft((prev) => !prev);
            }

            if (event.data?.type?.startsWith('openNewTab:')) {
                if (event.data.type === 'openNewTab:OPEN_FAULT_REPORT_LIST') {
                    const { operations = [] } = JSON.parse(login.userInfo);
                    const hasAuth = operations.find(
                        (items) => items.path === `/znjk/${constants.CUR_ENVIRONMENT}/main/unicom/home/troubleshooting-workbench/fault-report`,
                    );

                    if (!hasAuth) {
                        message.warn(`您没有故障查询权限，请联系管理员在角色管理中授权`);
                        return;
                    }

                    openFrameworkRoute('/home/troubleshooting-workbench/fault-report', event.data.data);
                }
                if (event.data.type === 'openNewTab:OPEN_ALARM_REPORT_LIST') {
                    const { operations = [] } = JSON.parse(login.userInfo);
                    const hasAuth = operations.find(
                        (items) => items.path === `/znjk/${constants.CUR_ENVIRONMENT}/main/unicom/home-unicom/search/alarm-query`,
                    );

                    if (!hasAuth) {
                        message.warn(`您没有告警查询权限，请联系管理员在角色管理中授权`);
                        return;
                    }

                    openFrameworkRoute('/home-unicom/search/alarm-query', {
                        alarmTime: encodeURIComponent(event.data.data.alarmTime),
                        standardAlarmId: event.data.data.standardAlarmId,
                        alarmTitle: encodeURIComponent(event.data.data.alarmTitle),
                        source: 'group-workbench-agent',
                    });
                }
                if (event.data.type === 'openNewTab:OPEN_TICKET_REPORT_LIST') {
                    const { operations = [] } = JSON.parse(login.userInfo);
                    const hasAuth = operations.find(
                        (items) => items.path === `/znjk/${constants.CUR_ENVIRONMENT}/main/unicom/home-unicom/failure-sheet`,
                    );

                    if (!hasAuth) {
                        message.warn(`您没有工单查询权限，请联系管理员在角色管理中授权`);
                        return;
                    }

                    openFrameworkRoute('/home-unicom/failure-sheet', event.data.data);
                }
            }

            if (event.data?.type?.includes('Report')) {
                const formatData = {};
                if (event.data.data) {
                    Object.keys(event.data.data).forEach((key) => {
                        formatData[key.replace('button_ai_', '')] = event.data.data[key];
                    });
                }
                // 请求接口或者打开弹窗等逻辑
                // 1.只是请求个后端接口，不需要弹窗的情况
                // 示意代码
                // if (event.data.type.includes('agree')) {
                if (Object.keys(ModifyList).includes(event.data.type)) {
                    const params = {
                        flagId: formatData.flagId,
                        standardAlarmId: formatData.standardAlarmId,
                        continueType: ModifyList[event.data.type],
                    };
                    let Fn = event.data.type.includes('agree') ? confirmReport : confirmNomralReport;
                    Fn(params).then(() => {
                        agentIframeRef.current = document.getElementById('AGENT-IFRAME');
                        agentIframeRef.current.contentWindow?.postMessage(
                            {
                                type: 'SEND_AGENT_QUESTION',
                                data: {
                                    // 这里的type是把智能体给的key再回传回去
                                    type: event.data.type,
                                    // 这里的data是给智能体发消息的数据。成功或失败
                                    // 成功时： data: { ai_handle_status: 200 }
                                    // 失败时： data: { ai_handle_status: 非200的数值。约定500，ai_handle_message: "失败原因或后端返回报错，非200时必传" }
                                    data:
                                        res.code === 200
                                            ? {
                                                  ai_handle_status: res.code,
                                                  ai_flagId: formatData.flagId,
                                                  ai_standard_alarmId: formatData.standardAlarmId,
                                              }
                                            : {
                                                  ai_handle_status: res.code,
                                                  ai_flagId: formatData.flagId,
                                                  ai_standard_alarmId: formatData.standardAlarmId,
                                                  ai_handle_message: `您不具备故障当前${MajorFaultReportEnum[event.data.type]}环节操作权限。`,
                                              },
                                },
                            },
                            '*',
                        );
                    });
                } else {
                    // 2. 需要弹窗的情况
                    // 这里打开弹窗，然后在弹窗提交后给智能体发消息，同上
                    props.showFaultModal(formatData, event.data.type, MajorFaultReportEnum[event.data.type]);
                }
            }

            // 打开重大故障指挥调度大屏
            if (event.data?.type?.startsWith('openPage:')) {
                if (event.data.type === 'openPage:coreFault') {
                    if (faultPageUrlRef.current.coreFault) {
                        window.open(faultPageUrlRef.current.coreFault);

                        return;
                    }
                }
                if (event.data.type === 'openPage:transFault') {
                    if (faultPageUrlRef.current.transFault) {
                        jumpToTransFault();

                        return;
                    }
                }
            }
        });
    }, []);
    const faultSchedulingAgentUrl = `${window.location.origin}/znjk/${constants.CUR_ENVIRONMENT}/oss-fault-scheduling-agent/`;
    console.log('Object.keys(ModifyList)', Object.keys(ModifyList));

    return (
        <div className="group-workbench-home">
            <Spin wrapperClassName="group-workbench-home-spin" spinning={loading} tip="正在加载中，请稍等片刻...">
                <div className="group-workbench-gis">
                    <GisMap
                        mapMode={mapMode?.mode}
                        isOnline={mapMode?.isOnline}
                        areaId={areaId}
                        selProfessional={selProfessional}
                        newMsgs={receiveMsgForMap}
                        lightFlag={lightFlagRef.current}
                        needOpenSpecialty={needOpenSpecialtyRef.current}
                        onClick={onGisClick}
                        onChange={onGisAreaChange}
                        enableHeatmap={bMapState.enableHeatmap}
                        enableLinemap={bMapState.enableLinemap}
                        requestParamsFormatter={gisMapRequestParamsFormatter}
                        forceReInitMap={forceReInitMapGis}
                        showLineModal={showLineModal}
                        setFloatingWindowInfo={setFloatingWindowInfo}
                        showRelatedLine={showRelatedLine}
                        relatedVisible={relatedVisible}
                        setRelatedVisible={setRelatedVisible}
                        currentZoneId={currentZoneId}
                        selectedCard={selectedCard}
                        tempProvinceList={tempProvinceList}
                        provinceOnlineCount={provinceOnlineCount}
                        timeType={timeType}
                        {...bMapForceUpdateState}
                    />
                </div>
                <div className="group-workbench-content">
                    <GroupHeader getSetting={getSetting} ref={headerRef} cardsDockedLeft={cardsDockedLeft} updateCardList={updateCardList} />
                    <GroupProfessional
                        data={professionalData}
                        receiveMsg={newMsgToProfession}
                        changeSubject={changeSubject}
                        provinceId={provinceId}
                        time={time}
                        timeType={timeType}
                        setLowerFlag={setLowerFlag}
                        {...(curShowType === 'province'
                            ? {
                                  benchType: true,
                                  noAuth,
                                  provinceList,
                              }
                            : {})}
                    />
                    {selProfessional.specialty === '7' && (
                        <StatisticsCard
                            title="脱网设备"
                            cityNumber={faultInvolveCount?.cityNum}
                            provinceNumber={faultInvolveCount?.provinceNum}
                            y={405}
                            x={210}
                        />
                    )}
                    {showRelatedLine ? <LegendCard legendList={legendListData} left="18vw" top="75vh" /> : null}

                    <ProvinceSelect
                        // time={time}
                        data={provinceData}
                        provinceId={provinceId}
                        setClickFlag={setClickFlag}
                        clickFlag={clickFlag}
                        goDownFlag={goDownFlag}
                        tempProvinceList={tempProvinceList}
                        provinceOnlineCount={provinceOnlineCount}
                        onChange={onMapTypeAndProvinceChange}
                        timeType={timeType}
                        lowerFlag={lowerFlag}
                    />
                    {voiceFlagRef.current && (+receiveMsg?.latestReportStatus < 10 || !receiveMsg?.latestReportStatus) && (
                        <FaultReportMsg newMsgs={receiveMsg} onSpeakEnd={handleSpeechSpeakEnd} />
                    )}
                </div>
                <FaultCards
                    selProfessional={selProfessional}
                    lightFlag={lightFlagRef.current}
                    needOpenSpecialty={needOpenSpecialtyRef.current}
                    time={time}
                    mapMode={mapMode?.mode}
                    provinceId={provinceId}
                    cityId={cityId}
                    receiveMsg={upDateMsg}
                    viewFault={viewFault}
                    faultReport={faultReport}
                    setShowRelatedLine={setShowRelatedLine}
                    setRelatedVisible={setRelatedVisible}
                    selectedCard={selectedCard}
                    setSelectedCard={setSelectedCard}
                    timeType={timeType}
                    lowerFlag={lowerFlag}
                    ref={cardCompRef}
                    dockLeft={cardsDockedLeft}
                />
                <button type="button" className="fault-cards-toggle" onClick={() => setCardsDockedLeft((prev) => !prev)}>
                    {cardsDockedLeft ? '› 向右' : '‹ 向左'}
                </button>
                {selProfessional.specialty === '8' && <Legend cardsDockedLeft={cardsDockedLeft} isCountry={areaId === 'china'} provinceId={areaId} />}
            </Spin>
            <OpticCableDetailModal visible={visible} setVisible={setVisible} paramsData={lineInfo} />
            {relatedVisible ? (
                <FloatingWindow
                    onClick={() => {
                        setRelatedVisible(false);
                    }}
                    floatingWindowInfo={floatingWindowInfo}
                />
            ) : null}
            <div
                className={classNames('agent-robot', {
                    hide: cardsDockedLeft,
                })}
                onClick={() => {
                    if (isFirstLoad.current) {
                        isFirstLoad.current = false;
                        agentIframeRef.current.contentWindow?.postMessage(
                            {
                                type: 'APPEND_START_MESSAGE',
                            },
                            '*',
                        );
                    }
                    setCardsDockedLeft((prev) => !prev);
                }}
            >
                <img src={`${constants.IMAGE_PATH}/group-workbench/agent-robot.png`} alt="" />
            </div>

            <div
                className={classNames('agent-wrapper', {
                    show: cardsDockedLeft,
                })}
                // style={{ opacity: cardsDockedLeft ? 1 : 0, zIndex: cardsDockedLeft ? 999 : 0 }}
            >
                <Iframe
                    onLoad={() => {
                        agentIframeRef.current = document.getElementById('AGENT-IFRAME');

                        if (agentIframeRef.current) {
                            setTimeout(() => {
                                agentIframeRef.current.contentWindow?.postMessage(
                                    {
                                        type: 'INIT_INFO',
                                        data: {
                                            userInfo: _.pick(login, ['userId', 'userName', 'currentZone']),
                                            parentOrigin: `${window.location.origin}/znjk/${constants.CUR_ENVIRONMENT}`,
                                            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                                            ai_role_type: reportRoleTypeName,
                                        },
                                    },
                                    '*',
                                );
                                agentIframeRef.current.contentWindow?.postMessage(
                                    {
                                        type: 'APPEND_START_MESSAGE',
                                    },
                                    '*',
                                );
                            }, 1000);
                        }
                    }}
                    id="AGENT-IFRAME"
                    frameBorder="0"
                    height="100%"
                    width="100%"
                    scrolling="no"
                    loading="auto"
                    url={faultSchedulingAgentUrl}
                />
            </div>
        </div>
    );
});
