import React, { useState, useEffect, useRef } from 'react';
import './style.less';
import { Radio, Select, List, Icon, Spin, Divider, Badge, Descriptions, Tabs } from 'oss-ui';
import { getFaultByTab, getFaultByPage, getSheetStatusInfo, unreadMessageo, unreadMessageoSum } from './api';
import AlarmTable from '@Src/pages/troubleshooting-workbench/other-workbench/alarm-table';
// import { OssPiePlotChart } from 'oss-chart';
import moment from 'moment';
import constants from '@Src/common/constants';
import TalkviewList from '@Components/talk-view-list';
import useLoginInfoModel from '@Src/hox';
import { useHistory } from 'react-router-dom';
import GlobalMessage from '@Common/global-message';
import { ReactComponent as WindowSvg1 } from '../img/u291.svg';
import { ReactComponent as WindowSvg2 } from '../img/u304.svg';
import { ReactComponent as WindowSvgDarkBlue1 } from '../img/u3111.svg';
import classNames from 'classnames';
import { logNew } from '@Common/api/service/log';
import PoressChart from './poress-chart';
import dayjs from 'dayjs';
const { TabPane } = Tabs;

const { Option } = Select;
interface TabListJson {
    code: string;
    desc: string;
    num: string;
}
interface StateListJson {
    key: string;
    value: string;
}
interface ChartListJson {
    type: string;
    count: string;
    key: string;
}

interface TroubleListJson {
    alarmLevel: string;
    masterMan: string;
    masterTel: string;
    provinceId: string;
    regionId: string;
    regionName: string;
    sheetNo: string;
    sheetStatus: string;
    sheetTitle: string;
    num: number;
    forwardTime: string;
}

let pagetion = {
    current: 1,
    pageSize: 20,
    total: 0,
};
let scrollDiv: any = null;
let compareTypeVal = '1';
let tabKeyVal = '';
let stateTypeVal = '';
let troubleListVal = [];
let timer: NodeJS.Timeout;
// const data = [
//     { type: '分类一', count: 27 },
//     { type: '分类二', count: 25 },
//     { type: '分类三', count: 18 },
//     { type: '分类四', count: 15 },
//     { type: '分类五', count: 10 },
//     { type: '其他', count: 5 },
// ];

const FaultCommand = (props) => {
    const [compareType, setCompareType] = useState('1');
    const faultRef: any = useRef();
    const [tabKey, setTabKey] = useState('');
    const [stateType, setStateType] = useState('');
    const [tabList, setTabList] = useState<TabListJson[]>([]);
    const [stateList, setStateList] = useState<StateListJson[]>([]);
    const [AlarmTableVisible, setAlarmTableVisible] = useState(false);
    const [troubleList, setTroubleList] = useState<TroubleListJson[]>([]);
    const [condition, setCondition] = useState({
        sheet_no: { operator: 'eq', value: '' },
        event_time: {
            operator: 'between',
            value: [dayjs(), dayjs()],
        },
    });
    const [loading, setLoading] = useState(true);
    const [chartList, setChartList] = useState<ChartListJson[]>([]);
    const [chartCount, setChartCount] = useState(0);
    const [visible, setVisible] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const frameInfo = useLoginInfoModel();
    const { userInfo, systemInfo, userId } = frameInfo;
    //const userInfos = (userInfo && JSON.parse(userInfo)) || {};

    const history = useHistory();

    // const jumpPage = () => {};

    // 获取故障类型
    const getFaultByTabData = async () => {
        const dataCode = {
            provinceId: systemInfo.currentZone?.zoneId ? systemInfo.currentZone?.zoneId : JSON.parse(userInfo).zones[0]?.zoneId,
            type: compareType,
        };
        const result = await getFaultByTab(dataCode);

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
            setTabList(result.data);
            setTabKey(result.data && result.data.length === 0 ? '' : result.data[0].code);
            tabKeyVal = result.data && result.data.length === 0 ? '' : result.data[0].code;
        } else {
            setLoading(false);
            setTabList([]);
            setTroubleList([]);
            setTabKey('');
            tabKeyVal = '';
            troubleListVal = [];
            setChartList([]);
        }
    };

    // 获取故障类型列表
    const getFaultByPageData = async (current) => {
        const dataCode = {
            faultType: compareTypeVal === '1' ? tabKeyVal : '',
            pageSize: 20,
            pageIndex: current,
            professionalType: compareTypeVal === '2' ? tabKeyVal : '',
            provinceId: systemInfo.currentZone?.zoneId ? systemInfo.currentZone?.zoneId : JSON.parse(userInfo).zones[0]?.zoneId,
            sheetStatus: stateTypeVal === 'all' ? '' : stateTypeVal,
            type: compareTypeVal,
        };

        const result = await getFaultByPage(dataCode);

        if (result && result.data) {
            const groupIds: string[] = [];
            result.data.forEach((item) => {
                groupIds.push(item.sheetNo);
            });

            const numData = {
                appKey: 'BOCO',
                params: JSON.stringify({
                    groupIds: groupIds,
                    userId: JSON.parse(userInfo).loginId,
                    timeStamp: moment().format('YYYYMMDDHHmmss'),
                }),
            };

            const resultNum = await unreadMessageo(numData);
            setLoading(false);
            if (pagetion.total === 0) {
                setTroubleList(
                    result.data.map((item) => {
                        return {
                            ...item,
                            num: resultNum.data[item.sheetNo],
                        };
                    }),
                );
                troubleListVal = result.data.map((item) => {
                    return {
                        ...item,
                        num: resultNum.data[item.sheetNo],
                    };
                });
            } else {
                setTroubleList(
                    troubleListVal.concat(
                        result.data.map((item) => {
                            return {
                                ...item,
                                num: resultNum.data[item.sheetNo],
                            };
                        }),
                    ),
                );
                troubleListVal = troubleListVal.concat(
                    result.data.map((item) => {
                        return {
                            ...item,
                            num: resultNum.data[item.sheetNo],
                        };
                    }),
                );
            }
            pagetion = { current: result.current, total: result.total, pageSize: 20 };
            setLoading(false);
        } else {
            setTroubleList([]);

            setLoading(false);
            troubleListVal = [];
        }
    };
    const unreadMessageoSumData = async () => {
        const res = await unreadMessageoSum({ userId });
        setTotalCount(res?.data?.totalCount || 0);
    };
    // 获取工单状态
    const getSheetStatusInfoData = async () => {
        const data = {
            pageSize: 2500,
            dictName: 'sheet_status',
            en: false,
            modelId: 2,
            creator: frameInfo.userId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
        };
        const result = await getSheetStatusInfo(data);
        result.data.unshift({
            key: 'all',
            value: '全部',
        });
        if (result) {
            setStateList(
                result.data.filter(
                    (item) =>
                        item.key === '2' ||
                        item.key === 'all' ||
                        item.key === '3' ||
                        item.key === '23' ||
                        item.key === '9' ||
                        item.key === '13' ||
                        item.key === '5' ||
                        item.key === '7',
                ),
            );
            setStateType('all');
            stateTypeVal = 'all';
        }
    };

    const onScroll = (event) => {
        const { clientHeight } = event.target;
        const { scrollHeight } = event.target;
        const { scrollTop } = event.target;
        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;

        if (isBottom && pagetion.pageSize > 19) {
            if (pagetion.total <= pagetion.current * 20) {
                return;
            }
            setLoading(true);
            getFaultByPageData(pagetion.current + 1);
        }
    };

    const handleTimer = () => {
        if (stateType !== '' && tabKey !== '') {
            getFaultByPageData(pagetion.current);
        }
        timer = setTimeout(() => {
            setTroubleList([]);
            pagetion = {
                current: 1,
                pageSize: 20,
                total: 0,
            };
            handleTimer();
        }, 30000);
    };

    const watchTabActiveChange = () => {
        if (props.theme !== 'light') {
            const bodyNodes = document.getElementsByTagName('body')[0];
            bodyNodes.className = 'fault-view-darkBlue';
        }
        GlobalMessage.off('activeChangedFault', null, null);
        GlobalMessage.on(
            'activeChangedFault',
            ({ isActive }) => {
                const bodyNodes = document.getElementsByTagName('body')[0];
                if (props.theme !== 'light') {
                    bodyNodes.className = 'fault-view-darkBlue';
                }
                if (!isActive) {
                    bodyNodes.className = '';
                    clearTimeout(timer);
                }
            },
            null,
        );
    };
    useEffect(() => {
        watchTabActiveChange();
        if (stateType !== '' && tabKey !== '') {
            handleTimer();
        }
        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateType, tabKey]);

    useEffect(() => {
        getFaultByTabData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [compareType]);

    useEffect(() => {
        setCompareType('1');
        setTabList([
            // { code: '1', desc: 'nihao', num: '1' },
            // { code: '2', desc: '李四', num: '2' },
        ]);
        setTroubleList([]);
        setTabKey('');
        tabKeyVal = '';
        troubleListVal = [];
        compareTypeVal = '1';
        getSheetStatusInfoData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scrollDiv = document.querySelector('.trouble-list-table');
        scrollDiv.addEventListener('scroll', (e) => {
            onScroll(e);
        });
        return () => {
            // cleanup
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.loading) {
            if (compareTypeVal === '1') {
                setLoading(true);
                setStateType('all');
                stateTypeVal = 'all';
                setTroubleList([]);
                troubleListVal = [];
                getFaultByTabData();
            } else {
                setLoading(true);
                setCompareType('1');
                setTabList([]);
                setTroubleList([]);
                setStateType('all');
                setTabKey('');
                tabKeyVal = '';
                troubleListVal = [];
                compareTypeVal = '1';
                stateTypeVal = 'all';
            }
            clearTimeout(timer);
            handleTimer();
            // getFaultByTabData();
        }
        unreadMessageoSumData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.loading]);

    const onSelectChange = (e) => {
        logNew('监控工作台调度待办组件', '300019');
        setCompareType(e.target.value);
        compareTypeVal = e.target.value;
        setLoading(true);
        pagetion = {
            current: 1,
            pageSize: 20,
            total: 0,
        };
    };

    const onSelectCard = (key) => {
        if (key !== tabKeyVal) {
            setTabKey(key);
            tabKeyVal = key;
            pagetion = {
                current: 1,
                pageSize: 20,
                total: 0,
            };
            setLoading(true);
        }
    };

    const onStateChange = (key) => {
        setStateType(key);
        stateTypeVal = key;
        pagetion = {
            current: 1,
            pageSize: 20,
            total: 0,
        };
        setLoading(true);
    };

    const closeModal = () => {
        setAlarmTableVisible(false);
        setCondition({
            sheet_no: { operator: 'eq', value: '' },
            event_time: {
                operator: 'between',
                value: [dayjs(), dayjs()],
            },
        });
    };

    const jumpFaultDetails = (obj) => {
        history.push({
            pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/fault-details`,
            state: { sheetInfo: obj, chatFlag: false, workBench: true },
        });
    };

    const onVisible = (flag) => {
        setVisible(flag);
    };
    const openTalkView = () => {
        onVisible(true);
    };
    // useEffect(() => {
    //     const tabsNode = document.querySelector('.fault-command-continer .oss-ui-tabs-nav-operations');
    //     const
    // }, []);
    return (
        <div ref={faultRef} className="fault-command-continer view-component-home-page-tabs">
            {/* <div className="title">
                交接班待办
                <div
                    className="title-jump"
                    onClick={() => {
                        jumpPage();
                    }}
                >
                    more {'>'}
                </div>
            </div> */}

            <div className="demo">
                <div className={classNames('demo-left', chartList.length > 6 ? 'demo-left-hover' : '')}>
                    <div className="record-switch" style={{ marginBottom: 10 }}>
                        <div className="header-switch">
                            <Radio.Group value={compareType} buttonStyle="solid" onChange={(value) => onSelectChange(value)}>
                                <Radio.Button className="switch-left" value="1" style={{ width: '90px', textAlign: 'center' }}>
                                    故障类型
                                </Radio.Button>
                                <Radio.Button className="switch-right" value="2" style={{ width: '70px', textAlign: 'center' }}>
                                    专业
                                </Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className="header-session" onClick={openTalkView}>
                            <Badge overflowCount={999} count={totalCount}>
                                {props.theme === 'light' ? (
                                    <WindowSvg1 className="session-incon" />
                                ) : (
                                    <WindowSvgDarkBlue1 className="session-incon" />
                                )}
                            </Badge>
                            <span>会话列表</span>
                            {/* <div className="session-warning">{totalCount}</div> */}
                        </div>
                    </div>
                    <div className="record-content">
                        <PoressChart
                            id={'content'}
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
                        {/* <Progress
                            type="circle"
                            percent={75}
                            width={170}
                            strokeWidth={10}
                            strokeColor="#3377FF"
                            format={() => {
                                return (
                                    <div className="view-component-home-page-tabs-progress-content">
                                        <div style={{ fontSize: 12, color: 'rgba(144,152,174)' }}>总故障</div>
                                        <div style={{ fontSize: 30 }}>{chartCount}</div>
                                    </div>
                                );
                            }}
                        /> */}
                    </div>
                    {/* <div className="record-button">
                        {chartList.map((item) => {
                            return (
                                <div key={item.key} className="button-name" style={{ margin: '0 5px' }}>
                                    <div className="name" style={{ width: 14 * item.type.length }}>
                                        {item.type}
                                    </div>
                                    <div className="num">{item.count || 0}</div>
                                </div>
                            );
                        })}
                    </div> */}
                    <div className="record-button">
                        <Descriptions title="" column={{ sm: 2, xxl: 3 }} size="small">
                            {chartList.map((item) => {
                                return (
                                    <Descriptions.Item key={item.key} label={item.type}>
                                        {item.count || <span className="oss-ui-descriptions-item-content">0</span>}
                                    </Descriptions.Item>
                                );
                            })}
                        </Descriptions>
                    </div>
                </div>
                <Divider style={{ height: 'auto' }} dashed type="vertical" />
                <div className="demo-right">
                    <div className="trouble-list-tab">
                        <Tabs activeKey={tabKey} className="tabs-list" onChange={(code) => onSelectCard(code)}>
                            {tabList.map((item) => {
                                return <TabPane key={item.code} tab={item.desc} />;
                            })}
                        </Tabs>
                        <div className="select-list">
                            <div className="select-title">筛选</div>
                            <div className="select-drop-down">
                                <Select
                                    getPopupContainer={(trigger) => trigger}
                                    value={stateType}
                                    style={{ width: 120 }}
                                    onChange={(value) => onStateChange(value)}
                                >
                                    {stateList.map((item) => {
                                        return (
                                            <Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="trouble-list-table">
                        <div className="example">
                            <Spin spinning={loading}>
                                {troubleList && troubleList.length > 0 ? (
                                    <List
                                        itemLayout="horizontal"
                                        size="large"
                                        dataSource={troubleList}
                                        locale={{ emptyText: '暂无数据' }}
                                        renderItem={(item) => {
                                            const perList = item.masterMan && item.masterMan !== 'null' ? item.masterMan.split(',') : [];
                                            const telList = item.masterTel && item.masterTel !== 'null' ? item.masterTel.split(',') : [];

                                            return (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<WindowSvg2 className="avatar-div" />}
                                                        title={<div>{item.sheetTitle}</div>}
                                                        description={
                                                            <div className="table-description">
                                                                <div className="table-description-content">{item.sheetNo}</div>
                                                                <div>{item.forwardTime}</div>
                                                                <div className="table-description-personnel">
                                                                    {perList &&
                                                                        perList.map((items, indexs) => {
                                                                            return (
                                                                                <div key={items} className="personnel-card">
                                                                                    {perList[indexs]}
                                                                                    {telList && telList.length >= indexs ? telList[indexs] : ''}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                </div>
                                                            </div>
                                                        }
                                                    />
                                                    <div>
                                                        <span
                                                            onClick={() => {
                                                                logNew('监控工作台调度待办组件', '300019');
                                                                setAlarmTableVisible(true);
                                                                const startTime = dayjs().add(-72, 'hour');
                                                                const endTime = dayjs().add(24, 'hour');
                                                                setCondition({
                                                                    sheet_no: { operator: 'like', value: item.sheetNo },
                                                                    event_time: {
                                                                        operator: 'between',
                                                                        value: [startTime, endTime],
                                                                    },
                                                                });
                                                            }}
                                                        >
                                                            <Icon
                                                                antdIcon
                                                                key="icona-2"
                                                                type="icona-2"
                                                                style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }}
                                                            />
                                                        </span>
                                                        <span
                                                            onClick={() => {
                                                                logNew('监控工作台调度待办组件', '300019');
                                                                jumpFaultDetails(item);
                                                            }}
                                                        >
                                                            <Icon
                                                                antdIcon
                                                                key="icona-1"
                                                                type="icona-1"
                                                                style={{ fontSize: '20px', cursor: 'pointer' }}
                                                            />
                                                        </span>
                                                        {item.num !== 0 && <div className="resume-warning">{item.num >= 100 ? '...' : item.num}</div>}
                                                    </div>
                                                </List.Item>
                                            );
                                        }}
                                    />
                                ) : (
                                    <div className="important-notice-nothing">
                                        <div className="important-notice-img" />
                                        <div className="important-notice-word">暂无数据</div>
                                    </div>
                                )}
                            </Spin>
                        </div>
                    </div>
                </div>
            </div>
            <AlarmTable
                visible={AlarmTableVisible}
                condition={condition}
                closeModal={() => {
                    closeModal();
                }}
            />
            {visible && <TalkviewList onVisible={onVisible} visible={visible} workBench={true} />}
        </div>
    );
};
export default FaultCommand;
