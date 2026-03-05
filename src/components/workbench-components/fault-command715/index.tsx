import React, { useState, useEffect, useRef, useCallback } from 'react';
import './style.less';
import { Radio, Icon, Spin, Divider, Badge, Descriptions, Tabs, message, Tooltip } from 'oss-ui';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { getFaultByTab, getSheetStatusInfo, unreadMessageo, unreadMessageoSum, faultPersonCount, timeOutTab } from './api';
import TalkviewList from '@Components/talk-view-list';
import useLoginInfoModel from '@Src/hox';
import { ReactComponent as WindowSvg1 } from '../img/u291.svg';
import { ReactComponent as WindowSvg2 } from '../img/notice.svg';
import { ReactComponent as WindowSvgDarkBlue1 } from '../img/u3111.svg';
import { logNew } from '@Common/api/service/log';
import PoressChart from './poress-chart';
import actionss from '@Src/share/actions';
import constants from '@Common/constants';
const { TabPane } = Tabs;

interface ChartListJson {
    type: string;
    count: string;
    key: string;
}
let timer: NodeJS.Timeout;

const FaultCommand = (props) => {
    const [compareType, setCompareType] = useState('3');
    const compareTypeRef = useRef('3');
    const [tabKey, setTabKey] = useState('1');
    const tabKeyRef = useRef('1');
    const faultRef: any = useRef();
    const [sheetData, setSheetData] = useState({
        faultCount: 0,
        waitingForAcceptance: 0,
        processing: 0,
        pendingFile: 0,
        archived: 0,
    });
    const [timeOutTabData, setTimeOutTabData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chartList, setChartList] = useState<ChartListJson[]>([]);
    const [chartCount, setChartCount] = useState(0);
    const [visible, setVisible] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [personCount, setPersonCount] = useState(0);
    const frameInfo = useLoginInfoModel();
    const { userInfo, systemInfo, userId, provinceId } = frameInfo;

    // const jumpPage = () => {};

    // 获取故障类型
    const getFaultByTabData = async () => {
        const dataCode = {
            provinceId: systemInfo.currentZone?.zoneId ? systemInfo.currentZone?.zoneId : JSON.parse(userInfo).zones[0]?.zoneId,
            type: compareTypeRef.current,
        };
        const result = await getFaultByTab(dataCode);
        setLoading(false);
        if (result && result.data.length !== 0) {
            let counts = 0;
            setChartList(
                result.data.map((item) => {
                    if (item.num) {
                        counts += item.num;
                    }
                    return {
                        type: item.desc,
                        count: item.num,
                        key: item.code,
                    };
                }),
            );
            setChartCount(counts);
        } else {
            setChartList([]);
        }
    };
    const unreadMessageoSumData = async () => {
        const res = await unreadMessageoSum({ userId });
        setLoading(false);
        setTotalCount(res?.data?.totalCount || 0);
    };
    // 获取工单状态
    const getSheetStatusInfoData = async () => {
        const data = {
            provinceId,
            professionalType: '1',
        };
        const result = await getSheetStatusInfo(data);
        setLoading(false);
        if (result.data) {
            setSheetData(result.data);
            setChartCount(result.data?.faultCount);
            setChartList([
                { type: '待受理', count: result.data?.waitingForAcceptance, key: 'waitingForAcceptance' },
                { type: '处理中', count: result.data?.processing, key: 'processing' },
                { type: '待归档', count: result.data?.pendingFile, key: 'pendingFile' },
                { type: '已归档', count: result.data?.pendingFile, key: 'archived' },
            ]);
        } else {
            setSheetData({
                faultCount: 0,
                waitingForAcceptance: 0,
                processing: 0,
                pendingFile: 0,
                archived: 0,
            });
            setChartList([]);
        }
    };
    //获取通知失败数量
    const getFaultPersonCount = async () => {
        const res = await faultPersonCount({ creatorId: userId });
        setLoading(false);
        setPersonCount(res?.total || 0);
    };
    const getTimeOutTab = async () => {
        const res = await timeOutTab({ provinceId, findType: '1' });
        setLoading(false);
        if (res.data) {
            setTimeOutTabData(res?.data);
            setChartCount(res.clientRequestId || 0);
            setChartList(
                res.data.map((item) => {
                    return {
                        type: item.desc,
                        count: item.num,
                        key: item.code,
                    };
                }),
            );
        } else {
            setChartList([]);
        }
    };
    const initContentData = () => {
        if (tabKeyRef.current === '1') {
            if (['1', '2'].includes(compareTypeRef.current)) {
                getFaultByTabData();
            } else {
                getSheetStatusInfoData();
            }
        } else {
            getTimeOutTab();
        }
    };
    const handleTimer = () => {
        // 自动刷新
        // if (timer) {
        //     clearTimeout(timer);
        // }
        // timer = setInterval(() => {
        //     initContentData();
        //     getFaultPersonCount();
        //     unreadMessageoSumData();
        // }, 30000);
        initContentData();
        getFaultPersonCount();
        unreadMessageoSumData();
    };

    const openType = (url: any) => {
        const { operations = [], loginId } = JSON.parse(userInfo);
        const fieldFlag = operations.find((items) => items.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${url}`));
        if (!fieldFlag) {
            message.warn(`您没有${name}权限，请联系管理员在角色管理中授权`);
            return;
        }
        logNew('监控工作台调度待办组件', '300019');
        const { actions, messageTypes } = actionss;
        let atimer = null;
        actions.postMessage(messageTypes.closeTabs, {
            entry: url,
        });
        if (atimer) {
            clearTimeout(atimer);
        }
        atimer = setTimeout(() => {
            actions &&
                actions.postMessage &&
                actions.postMessage(messageTypes.openRoute, {
                    entry: url,
                });
        }, 1000);
    };

    const gofaultcheduling = () => {
        sendLogFn({ authKey: 'workbench-Workbench-DispatchBacklog-NotificationFailure' });
        openType(`/unicom/home/fault-scheduling-notification`);
    };

    useEffect(() => {
        // console.log(compareType, tabKey, '=====tab');
        initContentData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [compareType, tabKey]);

    // 自动刷新打开
    // useEffect(() => {
    //     handleTimer();
    //     return () => {
    //         if (timer) {
    //             clearTimeout(timer);
    //         }
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
        if (props.loading) {
            setLoading(true);
            handleTimer();
        }
    }, [props.loading]);

    const onSelectChange = (e) => {
        // console.log(e);
        switch (e.target.value) {
            case '1':
                sendLogFn({ authKey: 'workbench-Workbench-DispatchBacklog-FaultBacklog' });
                break;
            case '2':
                sendLogFn({ authKey: 'workbench-Workbench-DispatchBacklog-MajorBacklog' });
                break;
            case '3':
                sendLogFn({ authKey: 'workbench-Workbench-DispatchBacklog-OrderBacklog' });
                break;
            default:
                break;
        }
        logNew('监控工作台调度待办组件', '300019');
        setCompareType(e.target.value);
        compareTypeRef.current = e.target.value;
    };

    const onVisible = (flag) => {
        setVisible(flag);
    };
    const openTalkView = () => {
        sendLogFn({ authKey: 'workbench-Workbench-DispatchBacklog-List' });
        onVisible(true);
    };
    const checkoutTabs = (value: any) => {
        switch (value) {
            case '1':
                sendLogFn({ authKey: 'workbench-Workbench-DispatchBacklog-DispatchBacklog' });
                break;
            case '2':
                sendLogFn({ authKey: 'workbench-Workbench-DispatchBacklog-TimeOutFault' });
                break;
            default:
                break;
        }

        logNew('监控工作台监控待办组件', '300022');
    };
    return (
        <div ref={faultRef} className="fault-command-continer715 view-component-home-page-tabs">
            <div className="header-session" onClick={openTalkView} style={{ top: '22px' }}>
                <Badge overflowCount={999} count={totalCount}>
                    {props.theme === 'light' ? <WindowSvg1 className="session-incon" /> : <WindowSvgDarkBlue1 className="session-incon" />}
                </Badge>
                <span className="sname">会话列表</span>
            </div>
            <div className="header-session" onClick={gofaultcheduling} style={{ top: '47px' }}>
                <WindowSvg2 className="session-incon" />
                <span className="sname">通知失败</span>
                <span className="snum">{personCount}</span>
            </div>
            <div className="monitor-visual-page-content">
                <Spin spinning={loading}>
                    <Tabs
                        defaultActiveKey="1"
                        onTabClick={(key) => {
                            setTabKey(key);
                            tabKeyRef.current = key;
                        }}
                        activeKey={tabKey}
                        onChange={checkoutTabs}
                        type="line"
                        tabPosition="left"
                    >
                        <TabPane tab="调度待办" key="1" forceRender>
                            <div className="demo">
                                <div className="demo-top">
                                    <div className="record-switch">
                                        <div className="header-switch">
                                            <Radio.Group value={compareType} name="headerbtns" onChange={(value) => onSelectChange(value)}>
                                                <Radio.Button value="3" className="header-btns">
                                                    工单状态
                                                </Radio.Button>
                                                <Radio.Button value="2" className="header-btns">
                                                    专业
                                                </Radio.Button>
                                                <Radio.Button value="1" className="header-btns">
                                                    故障类型
                                                </Radio.Button>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                </div>
                                <div className="record-content">
                                    <div className="chart">
                                        <PoressChart
                                            sumCount={chartCount}
                                            theme={props.theme}
                                            alarmData={
                                                chartList.find((item) => item.count)
                                                    ? chartList.map((item) => {
                                                          return { name: item.type, value: item.count };
                                                      })
                                                    : []
                                            }
                                        />
                                    </div>
                                    {compareType === '3' ? (
                                        <div className="record-items">
                                            <div className="items">
                                                待受理<span className="snum">{sheetData.waitingForAcceptance}</span>
                                            </div>
                                            <div className="items">
                                                处理中<span className="snum">{sheetData.processing}</span>
                                            </div>
                                            <div className="items">
                                                待归档<span className="snum">{sheetData.pendingFile}</span>
                                            </div>
                                            <div className="items">
                                                已归档<span className="snum">{sheetData.archived}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    {['2'].includes(compareType) ? (
                                        <div className="record-items">
                                            {chartList.map((item) => {
                                                return (
                                                    <div className="items">
                                                        {item.type.length > 5 ? (
                                                            <Tooltip title={item.type}>
                                                                <div className="items-type-name">{item.type}</div>
                                                            </Tooltip>
                                                        ) : (
                                                            <div className="items-type-name">{item.type}</div>
                                                        )}
                                                        <div className="snum">{item.count}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    {['1'].includes(compareType) ? (
                                        <div className="record-items">
                                            {chartList.map((item) => {
                                                return (
                                                    <div className="items1">
                                                        {item.type.length > 5 ? (
                                                            <Tooltip title={item.type}>
                                                                <div className="items-type-name">{item.type}</div>
                                                            </Tooltip>
                                                        ) : (
                                                            <div className="items-type-name">{item.type}</div>
                                                        )}
                                                        <span className="snum">{item.count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="超时故障" key="2">
                            <div className="demo">
                                <div className="demo-top" style={{ height: '28px', width: '1px' }} />
                                <div className="record-content">
                                    <div className="chart">
                                        <PoressChart
                                            sumCount={chartCount}
                                            theme={props.theme}
                                            alarmData={
                                                chartList.find((item) => item.count)
                                                    ? chartList.map((item) => {
                                                          return { name: item.type, value: item.count };
                                                      })
                                                    : []
                                            }
                                        />
                                    </div>
                                    <div className="record-items">
                                        {timeOutTabData.map((item) => {
                                            return (
                                                <div className="items2">
                                                    {item.desc}
                                                    <span className="snum">{item.num}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </Spin>
            </div>

            {visible && <TalkviewList onVisible={onVisible} visible={visible} workBench={true} />}
        </div>
    );
};
export default FaultCommand;
