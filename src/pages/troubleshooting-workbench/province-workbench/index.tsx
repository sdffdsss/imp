import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { usePersistFn, useSetState } from 'ahooks';
import { _ } from 'oss-web-toolkits';
import { Spin, message } from 'oss-ui';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { getMapConfigApi } from '@Common/services/configService';
import { getInitialProvince } from '@Common/utils/getInitialProvince';
import { useOpenFrameworkRoute } from '@Src/hooks';
import zoneLevel from '@Common/enum/zoneLevel';
import constants from '@Common/constants';
import { getConfiguration } from '@Pages/large-screen-console/api';
import Header from '../components/header';
import BMapGis, { MAP_MODE } from '../components/bmap';
import Legend from '../components/legend';
import { useWorkbenchStates } from '../hooks';
import Professional from './components/professional';
import { useBMapState, useForceReInitMapGis } from './hooks/bmap-state';
import { OpticCableDetailModal } from '../components/modals';
import StatisticsCard from '../components/statistics-card';
import FaultReportMsg from '../components/fault-report-msg';
import FaultCards from '../components/fault-cards';
import FloatingWindow from '../components/floating-window';
import LegendCard from '../components/legend-card';
import { clearInfos, getFaultInvolveCount, getZones, confirmReport, confirmNomralReport } from '../api';
import classNames from 'classnames';
import Iframe from 'react-iframe';
import './index.less';
import KeepAlive from 'react-activation';
import { MajorFaultReportEnum, ModifyList } from '@Src/common/enum/majorFaultReportEnum';
import { getFaultReportSpecialtyApi } from '@Pages/large-screen-console/api';

interface FloatingWindowInfoType {
    systemInfo: string;
    NEInfo: string;
    reuse: string;
    top: number;
    left: number;
}
// const a = {
//     voiceContext: '南京市客服舆情信息发生gj测试自动识别告警52-江苏客服舆情10',
//     topic: 'gj测试自动识别告警52-江苏客服舆情10',
//     provinceId: '-662225376',
//     provinceName: '江苏省',
//     reportTypeName: '终报',
//     specialtyName: '客服舆情信息',
//     failureClassName: '话务量突变',
//     createTime: '2024-01-17 10:38:08',
//     failureTime: '2024-01-17 10:38:08',
//     specialty: '16',
//     failureClass: '22',
//     cityId: '539864141',
//     cityName: '南京市',
//     flagId: 'js-20240117-015',
//     source: 1,
//     notificationType: 1,
//     countdownContextUp: '首报时间已超过${countdownTime}，请及时续报',
//     countdownContextDown: '距离续报时间还剩${countdownTime}，请及时续报',
//     voiceContextUp: '南京市客服舆情信息gj测试自动识别告警52-江苏客服舆情10故障发生已达到${countdownTime},请及时续报',
//     voiceContextDown: '南京市客服舆情信息gj测试自动识别告警52-江苏客服舆情10的故障距离续报时间还剩${countdownTime},请及时续报',
//     finalReportCountdownContext: '故障发生已超过${countdownTime}，请及时终报',
//     finalReportVoiceContext: '南京市客服舆情信息gj测试自动识别告警52-江苏客服舆情10的故障发生已超过${countdownTime}，请及时终报',
//     countdownNode: [1800, 2700, 3300, 3600],
//     finalReportCountdownNode: [86400],
//     countdownTime: 39,
//     standardAlarmId: '30192674034_123_587_852',
//     latestReportStatus: '6',
//     reportUser: null,
//     equipmentType: 'ONU',
//     equipmentId: '接入网管-0514010048195991苏省扬州市广陵区文峰街道渡江南路海棠苑2栋1102室调端口-1810368',
//     involvedProvince: ['-662225376'],
//     application: null,
//     alarmStatus: null,
//     whetherGroupDisplay: false,
//     faultReportStatus: null,
//     reportLifeCycleList: null,
//     reportCancelList: null,
//     reportLevel: '0,1',
// };

export default forwardRef((props, ref) => {
    const legendListData = [
        { label: '脱网设备', legendImgUrl: `${constants.IMAGE_PATH}/group-workbench/unrelated.png` },
        { label: '关联设备', legendImgUrl: `${constants.IMAGE_PATH}/group-workbench/related.png` },
        { label: '关联线路', legendImgUrl: `${constants.IMAGE_PATH}/group-workbench/associateTheLine.png` },
    ];

    const {
        loading,
        mapMode,
        selProfessional,
        changeSubject,
        newMsgToProfession,
        areaId,
        voiceFlag,
        lightFlag,
        upDateMsg,
        receiveMsg,
        time,
        getSetting,
        handleSpeechSpeakEnd,
        pushMessage,
        needOpenSpecialty,
        provinceList,
    } = useWorkbenchStates();
    const { timeType, noAuth, cardsDockedLeft, setCardsDockedLeft, reportRoleTypeName } = props;
    const login = useLoginInfoModel();
    // const [upDateMsg, setUpDateMsg] = useState();
    const { zoneLevelFlags, currentZone, mgmtZones, userId } = useLoginInfoModel();
    const currentZoneId = _.get(currentZone, 'zoneId');
    const {
        state: bMapState,
        setState: setBMapState,
        enableInteraction,
    } = useBMapState({
        zoneLevelFlags,
        currentZoneId,
        mapMode,
        areaId,
        selProfessional,
        mgmtZones,
    });
    const openFrameworkRoute = useOpenFrameworkRoute();

    const headerRef: any = useRef(null);
    const agentIframeRef = useRef(null);
    const isFirstLoad = useRef(false);

    const [regionId, setRegionId] = useSetState({ provinceId: currentZoneId, cityId: null });
    const [visible, setVisible] = useState<boolean>(false);
    const [relatedVisible, setRelatedVisible] = useState<boolean>(false);
    const [showRelatedLine, setShowRelatedLine] = useState<boolean>(false);
    const [lineInfo, setLineInfo] = useState<any>({});
    const [selectedCard, setSelectedCard] = useState({});
    const [faultInvolveCount, setFaultInvolveCount] = useState<any>({});
    const [floatingWindowInfo, setFloatingWindowInfo] = useState<FloatingWindowInfoType>();
    const cardCompRef = useRef(null);
    const faultPageUrlRef = useRef({
        coreFault: '',
        transFault: '',
    });

    const clearLastInfos = async () => {
        const params = {
            specialty: selProfessional.specialty,
            failureClass: selProfessional.failureClass,
            userId,
            provinceId: regionId.provinceId,
            cityId: regionId.cityId,
        };
        const res = await clearInfos(params);
        console.log(res);
    };
    const changeRegionIdByMapInfo = async (info: any) => {
        clearLastInfos();
        switch (info.level) {
            case 'province':
                setRegionId({ provinceId: info.id, cityId: null });
                break;
            case 'city':
                setRegionId({ provinceId: info.parentId, cityId: info.id });
                break;
            default:
            // nothing;
        }
    };

    const getFaultInvolvedCount = (areaId) => {
        if (selProfessional.specialty === '7') {
            const params = { provinceId: areaId && areaId === 'country' ? '0' : areaId, specialty: selProfessional.specialty };
            getFaultInvolveCount(params).then((res) => {
                console.log(res.data);
                setFaultInvolveCount(res.data);
            });
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-shadow
    function onGisAreaChange(areaId: string, extra: any) {
        if (mapMode === MAP_MODE.ONLINE) {
            return;
        }
        getFaultInvolvedCount(areaId);
        setBMapState({ areaId });
        changeRegionIdByMapInfo(extra.info);
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    function onGisClick(areaId: string, extra: any) {
        changeRegionIdByMapInfo(extra.info);
    }

    const gisMapRequestParamsFormatter = usePersistFn(async (type) => {
        if (((type === 'heatmap' && bMapState.enableHeatmap) || (type === 'line' && bMapState.enableLinemap)) && bMapState.areaId !== null) {
            const params = {};
            if (bMapState.areaId === 'china') {
                Object.assign(params, {
                    regionLevel: 1,
                });
            } else {
                const configList = await getMapConfigApi();
                const item = configList.data.find((d) => d.id === bMapState.areaId || d.adcode === bMapState.areaId);

                Object.assign(params, {
                    regionId: item.adcode,
                    regionLevel: item ? zoneLevel[item.level] : undefined,
                });
            }

            return params;
        }

        if (type === 'fault') {
            return {
                accountProvinceId: currentZoneId,
                provinceId: bMapState.areaId === 'china' ? currentZoneId : bMapState.areaId,
            };
        }
        return undefined;
    });

    const { forceReInitMapGis, state: forceReInitMapGisState } = useForceReInitMapGis({
        selProfessional,
        newMsgs: upDateMsg,
        enableHeatmap: bMapState.enableHeatmap,
        enableLinemap: bMapState.enableLinemap,
    });

    const viewFault = (item) => {
        // 查看故障
        console.log(item, '===');
        const isView = true;
        headerRef.current?.onShowFaultReport(item, isView);
    };
    const faultReport = (item) => {
        // 故障续保
        console.log(item, '===');
        headerRef.current?.onShowFaultReport(item);
    };
    const showLineModal = (item) => {
        const data = { ...item };
        data.regionId = currentZone.zoneId;
        setLineInfo(data);
        setVisible(true);
    };
    const showRelatedLineModal = (item) => {
        const data = { ...item };
        data.regionId = currentZone.zoneId;
        setLineInfo(data);
        setVisible(true);
    };

    useImperativeHandle(ref, () => ({
        after: noticeAgent,
    }));

    const noticeAgent = usePersistFn((info) => {
        agentIframeRef.current.contentWindow?.postMessage(
            {
                type: 'SEND_AGENT_QUESTION',
                data: {
                    // 这里的type是把智能体给的key再回传回去
                    type: event.data.type,
                    // 这里的data是给智能体发消息的数据。成功或失败
                    // 成功时： data: { ai_handle_status: 200 }
                    // 失败时： data: { ai_handle_status: 非200的数值。约定500，ai_handle_message: "失败原因或后端返回报错，非200时必传" }
                    data: {},
                },
            },
            '*',
        );
    });

    useEffect(() => {
        if (selProfessional.specialty === '8') {
            setBMapState({ areaId: 'china' });
        } else {
            setBMapState({ areaId: currentZoneId });
        }

        if (selProfessional.specialty === '7') {
            const params = { provinceId: regionId.provinceId, specialty: selProfessional.specialty };
            getFaultInvolveCount(params).then((res) => setFaultInvolveCount(res.data));
        } else {
            setRelatedVisible(false);
            setShowRelatedLine(false);
            setSelectedCard({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selProfessional]);

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
    const iframeOnLoad = () => {
        getZones({ parent_zone_id: '0', zone_level: 2 }).then((res) => {
            const arr = res?._embedded?.zoneResourceList;
            if (Array.isArray(arr)) {
                const newCurrentZone = arr.find((item) => String(item.zoneId) === String(currentZoneId));
                agentIframeRef.current = document.getElementById('AGENT-IFRAME');

                if (agentIframeRef.current) {
                    setTimeout(() => {
                        agentIframeRef.current.contentWindow?.postMessage(
                            {
                                type: 'INIT_INFO',
                                data: {
                                    userInfo: {
                                        ..._.pick(login, ['userId', 'userName', 'currentZone']),
                                        currentZone: newCurrentZone,
                                    },
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
            }
        });
    };
    useEffect(() => {
        window.addEventListener('message', (event) => {
            if (event.data.type === 'CLOSE_AGENT') {
                // setShowAgent(false);
                setCardsDockedLeft((prev) => !prev);
            }

            if (event.data.type?.startsWith('openNewTab:')) {
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
                const formatData: any = {};
                if (event.data.data) {
                    Object.keys(event.data.data).forEach((key) => {
                        formatData[key.replace('button_ai_', '')] = event.data.data[key];
                    });
                }
                // 请求接口或者打开弹窗等逻辑
                // 1.只是请求个后端接口，不需要弹窗的情况
                // 示意代码
                if (Object.keys(ModifyList).includes(event.data.type)) {
                    const params = {
                        flagId: formatData.flagId,
                        standardAlarmId: formatData.standardAlarmId,
                        continueType: ModifyList[event.data.type],
                    };
                    let Fn = event.data.type.includes('agree') ? confirmReport : confirmNomralReport;
                    Fn(params).then((res) => {
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
            if (event.data.type?.startsWith('openPage:')) {
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

    return (
        <div className="province-workbench-root">
            <Spin spinning={loading} tip="正在加载中，请稍等片刻...">
                <section className="province-workbench-gis">
                    {bMapState.areaId && (
                        <BMapGis
                            mapMode={bMapState.mapMode}
                            showRelatedLine={showRelatedLine}
                            areaId={bMapState.areaId as any}
                            lightFlag={lightFlag}
                            needOpenSpecialty={needOpenSpecialty}
                            newMsgs={upDateMsg}
                            selProfessional={selProfessional}
                            enableRequestLoop={false}
                            enableHeatmap={bMapState.enableHeatmap}
                            enableLinemap={bMapState.enableLinemap}
                            onChange={onGisAreaChange}
                            onClick={onGisClick}
                            enableSelect={enableInteraction}
                            enableDrilldown={enableInteraction}
                            enableRollupButton={zoneLevelFlags.isRegionZone || selProfessional.specialty === '8'}
                            showLineModal={showLineModal}
                            showRelatedLineModal={showRelatedLineModal}
                            onRollupButtonClick={() => {
                                getFaultInvolvedCount(currentZoneId);
                                setBMapState({ areaId: currentZoneId });
                                setRegionId({ provinceId: currentZoneId, cityId: null });
                            }}
                            requestParamsFormatter={gisMapRequestParamsFormatter}
                            forceReInitMap={forceReInitMapGis}
                            benchType
                            zoneLevelFlags={zoneLevelFlags}
                            currentZoneId={currentZoneId}
                            mgmtZones={mgmtZones}
                            selectedCard={selectedCard}
                            setFloatingWindowInfo={setFloatingWindowInfo}
                            floatingWindowInfo={floatingWindowInfo}
                            relatedVisible={relatedVisible}
                            setRelatedVisible={setRelatedVisible}
                            timeType={timeType}
                            {...forceReInitMapGisState}
                        />
                    )}
                </section>
                <section className="province-workbench-content">
                    <Header
                        workbenchType="province"
                        ref={headerRef}
                        getSetting={getSetting}
                        cardsDockedLeft={cardsDockedLeft}
                        updateCardList={updateCardList}
                        noAuth={noAuth}
                    />
                    {selProfessional.specialty === '7' && (
                        <StatisticsCard
                            title="脱网设备"
                            cityNumber={faultInvolveCount?.cityNum}
                            provinceNumber={faultInvolveCount?.provinceNum}
                            y={215}
                            x={500}
                        />
                    )}

                    {showRelatedLine ? <LegendCard legendList={legendListData} right="25vw" top="68vh" /> : null}

                    <Professional
                        time={time}
                        timeType={timeType}
                        receiveMsg={newMsgToProfession}
                        changeSubject={changeSubject}
                        noAuth={noAuth}
                        provinceList={provinceList}
                    />
                    {voiceFlag && (+receiveMsg?.latestReportStatus < 10 || !receiveMsg?.latestReportStatus) && (
                        <FaultReportMsg newMsgs={receiveMsg} workbenchType="province" onSpeakEnd={handleSpeechSpeakEnd} />
                    )}
                </section>
                <FaultCards
                    selProfessional={selProfessional}
                    lightFlag={lightFlag}
                    needOpenSpecialty={needOpenSpecialty}
                    time={time}
                    mapMode={bMapState.mapMode}
                    provinceId={regionId.provinceId}
                    cityId={regionId.cityId}
                    receiveMsg={upDateMsg}
                    benchType // true 省份工作台  集团工作台不传
                    viewFault={viewFault}
                    faultReport={faultReport}
                    pushMessage={pushMessage}
                    setShowRelatedLine={setShowRelatedLine}
                    setRelatedVisible={setRelatedVisible}
                    setSelectedCard={setSelectedCard}
                    selectedCard={selectedCard}
                    timeType={timeType}
                    ref={cardCompRef}
                    noAuth={noAuth}
                    provinceList={provinceList}
                    dockLeft={cardsDockedLeft}
                />
                {selProfessional.specialty === '8' && <Legend benchType isCountry={bMapState.areaId === 'china'} provinceId={bMapState.areaId} />}
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
                    onLoad={iframeOnLoad}
                    id="AGENT-IFRAME"
                    frameBorder={0}
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
