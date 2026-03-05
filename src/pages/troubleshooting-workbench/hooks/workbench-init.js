import { useEffect, useState, useRef } from 'react';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { getInitialProvince } from '@Common/utils/getInitialProvince';
import stompjs from 'stompjs';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import GlobalMessage from '@Src/common/global-message';
import constants from '@Common/constants';
import { getLightSetting, clearInfos, getZones, getCardBtnList } from '../api';

let stompClient = null;
const time = moment().format('yyyy-MM-DD HH:mm:ss');
export const useWorkbenchStates = () => {
    const [receiveMsg, setReceiveMsg] = useState();
    const [upDateMsg, setUpDateMsg] = useState();
    const [newMsgToProfession, setNewMsgToProfession] = useState();
    const [mapMode, setMapMode] = useState('');
    const [goDownFlag, setGoDownFlag] = useState(false);
    const [clickFlag, setClickFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [areaId, setAreaId] = useState('china');
    const [provinceId, setProvinceId] = useState('');
    const [provinceList, setProvinceList] = useState([]);
    const [cityId, setCityId] = useState('');
    const [tempProvinceList, setTempProvinceList] = useState([]);
    const [selProfessional, setSelProfessional] = useState({});
    const currentTime = useRef(moment().format('yyyy-MM-DD HH:mm:ss')).current;
    const login = useLoginInfoModel();
    const needOpenSpecialtyRef = useRef([]);

    const [, forceUpdate] = useState(false);
    const voiceFlagRef = useRef(false);
    const lightFlagRef = useRef(true);
    const listRef = useRef([]);

    const getSetting = async () => {
        const res = await getLightSetting(login.userId);

        if (res?.data) {
            voiceFlagRef.current = res.data.voiceFlag === '0' ? false : true;
            lightFlagRef.current = res.data.lightFlag === '0' ? false : true;
            needOpenSpecialtyRef.current = res.data.specialty?.split(',') || [];
        } else {
            voiceFlagRef.current = false;
            lightFlagRef.current = true;
            needOpenSpecialtyRef.current = [];
        }
        forceUpdate((prev) => !prev);

        return voiceFlagRef.current;
    };

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
                stompClient?.disconnect();
                sendWebScoket();
            },
        );
        // }
    };
    const stompTopic = () => {
        // 通过stompClient.subscribe订阅/topic/getResponse 目标(destination)发送的消息（广播接收信息）

        // if (stompClient.ws.readyState === 1) {
        stompClient?.subscribe(`/topic/response`, (response) => {
            if (response.body) {
                const messageData = JSON.parse(response.body);
                console.log(messageData, '=====data');
                if (messageData.notificationType === 2) {
                    // 半小时倒计时通知
                    messageData.voiceContext = messageData.voiceContextDown.replace('${countdownTime}', '30分钟');
                }
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
                            receiveChange(messageData);
                        });
                    }
                } else {
                    receiveChange(messageData);
                }
            }
        });
        // }
    };
    const receiveChange = (messageData) => {
        const { latestReportStatus, notificationType, specialty, faultDistinctionType, source } = messageData;
        if (login.currentZone.zoneLevel === '5') {
            console.log(
                listRef.current.findIndex((e) => e.zoneId == messageData?.provinceId) === -1 && login.currentZone.zoneId !== messageData?.provinceId,
                '===bool',
                login.currentZone,
                listRef.current,
                messageData,
            );
            if (
                listRef.current.findIndex((e) => e.zoneId == messageData?.provinceId) === -1 &&
                login.currentZone.zoneId !== messageData?.provinceId
            ) {
                return;
            }
        }
        setUpDateMsg(messageData);
        const isDraft = latestReportStatus === '1' || latestReportStatus === '3' || latestReportStatus === '5';
        if (isDraft || (faultDistinctionType === 2 && source === 0)) return;
        if (voiceFlagRef.current && notificationType !== 4 && notificationType !== 5 && needOpenSpecialtyRef.current.includes(specialty)) {
            setReceiveMsg(messageData);
        } else {
            setNewMsgToProfession(messageData);
        }
    };

    const pushMessage = (info) => {
        receiveChange(info);
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
        let param = selProfessional;
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
    const getPublicProvince = async () => {
        const result = await getZones({ parent_zone_id: getInitialProvince(login) });
        console.log(result, '===res');
        listRef.current = result?._embedded.zoneResourceList;
        setProvinceList(result?._embedded.zoneResourceList);
    };

    useEffect(() => {
        console.log('工作台的mount :>> ');
        const fn = ({ isActive }) => {
            console.log('isActiveisActive', isActive);
            setTimeout(() => {
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
            // getProvinceInfo();
            setLoading(false);
        });
        if (login.currentZone.zoneLevel === '5') {
            getPublicProvince();
        }
        const frameVisible = window.location.href.indexOf('hideNav') !== -1; // 是否为嵌入的故障上报
        // let tabcontainer = document.getElementsByClassName('oss-ui-tabs-nav')[0];
        let overViewContainer = document.querySelector("div[data-name='oss-imp-unicom']");
        if (overViewContainer || frameVisible) {
            overViewContainer.parentNode.style.padding = '0px';
        }
        // if (window.location.pathname.includes('/unicom/home/troubleshooting-workbench') && tabcontainer) {
        //     tabcontainer.style.display = 'none';
        // }

        return () => {
            if (stompClient != null) {
                stompClient.disconnect();
            }
        };
    }, []);

    function onMapTypeAndProvinceChange({ mode, selectedProvince }) {
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
        const id = tempProvinceList.find((e) => e.areaName === selectedProvince.desc)?.areaId;
        setMapMode(mode);
        setAreaId(id || 'china');
    }

    function handleSpeechSpeakEnd(newMsg) {
        setNewMsgToProfession(newMsg);
    }

    function onGisClick(areaId) {
        console.log('单击===', areaId, provinceId, mapMode, goDownFlag);
        if (mapMode === 'online') {
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
        if (mapMode === 'online') {
            return;
        }
        setClickFlag(true);
        setTimeout(() => {
            setProvinceId(areaId);
            setGoDownFlag(true);
        }, 100);
    }

    return {
        mapMode,
        areaId,
        selProfessional,
        receiveMsg,
        onGisClick,
        voiceFlag: voiceFlagRef.current,
        lightFlag: lightFlagRef.current,
        changeSubject,
        onMapTypeAndProvinceChange,
        handleSpeechSpeakEnd,
        onGisAreaChange,
        upDateMsg,
        newMsgToProfession,
        clickFlag,
        loading,
        time: currentTime,
        getSetting,
        pushMessage,
        needOpenSpecialty: needOpenSpecialtyRef.current,
        provinceList,
    };
};
