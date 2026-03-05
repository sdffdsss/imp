import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Spin, Select, List, Button, Input, Tooltip, Badge, Popover, Form, DatePicker, Space, message } from 'oss-ui';
import dayjs from 'dayjs';
import moment from 'moment';
import uniqBy from 'lodash/uniqBy';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useHistory } from 'react-router';
import useLoginInfoModel from '@Src/hox';
import TalkviewList from '@Components/talk-view-list';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import actionss from '@Src/share/actions';
import { logNew } from '@Common/api/service/log';
import constants from '@Src/common/constants';
import {
    getFaultByTab,
    getFaultByPage,
    getSheetStatusInfo,
    unreadMessageo,
    unreadMessageoSum,
    getTimeOutTab,
    getReportFaultBoard,
    getReportCountTab,
    getProvinceDrop,
} from '../../../api';
import AlarmTable from '../../../alarm-table';
import SearchUrl from '../../../svgs/search.svg';
import NoticeUrl from '../../../img/notice.png';
import DetailUrl from '../../../img/detail.png';
import FaultDispathched from '../../../fault-dispatched';

const { RangePicker } = DatePicker;
const { Option } = Select;

export enum reportTypeEnum {
    'first' = '0',
    'not-first-last' = '1',
    'last' = '2',
    'all' = '3',
}
interface TabListJson {
    code: string;
    desc: string;
    num: string;
}

interface StateListJson {
    key: string;
    value: string;
}
interface OptionType {
    label: number;
    value: number;
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
    flagDeal?: string;
    reportType: keyof typeof reportTypeEnum;
    flagId: string;
    topic: string;
    cityName: string;
    provinceName: string;
    createTime: string;
}

interface IPagination {
    current: number;
    pageSize: number;
    total: number;
}

const reportTypeOptions: { label: string; value: keyof typeof reportTypeEnum }[] = [
    {
        label: '全部',
        value: 'all',
    },
    {
        label: '首报',
        value: 'first',
    },
    {
        label: '续报',
        value: 'not-first-last',
    },
    {
        label: '终报',
        value: 'last',
    },
];
const flagDealOption = [
    { label: '其他', value: 0 },
    { label: 'L1', value: 1 },
    { label: 'L2', value: 2 },
    { label: 'L3', value: 3 },
    { label: 'L4', value: 4 },
    { label: 'L5', value: 5 },
    { label: 'L6', value: 6 },
    { label: 'L7', value: 7 },
    { label: 'L8', value: 8 },
];

const TroubleList = (props) => {
    const { compareType, dispatchPanelType, setShowType, setSheetInfo, updateRefreshTimeFn, curZoneId, onListClick } = props;
    const [totalCount, setTotalCount] = useState(0);
    const [currentKey, setCurrentKey] = useState<any>(null);
    const [tabKey, setTabKey] = useState<any>(null);
    const [tabList, setTabList] = useState<TabListJson[]>([]);
    const [stateList, setStateList] = useState<StateListJson[]>([]);
    const [provinceListOptions, setProvinceListOptions] = useState<{ label: string; value: string }[]>([]);
    const [AlarmTableVisible, setAlarmTableVisible] = useState(false);
    const [troubleList, setTroubleList] = useState<TroubleListJson[]>([]);
    const [visible, setVisible] = useState(false);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [regionOption, setRegionOption] = useState<OptionType[]>([]);
    const [condition, setCondition] = useState({
        sheet_no: { operator: 'eq', value: '' },
        event_time: {
            operator: 'between',
            value: [dayjs(), dayjs()],
        },
    });
    const [loading, setLoading] = useState(false);
    const [locked, setLocked] = useState(false);

    const timerRef = useRef<NodeJS.Timer>();
    const typeRef = useRef('');

    // const urlData = urlSearch(window.location.href);

    const paginationRef = useRef<IPagination>({
        current: 1,
        pageSize: 15,
        total: 0,
    });
    const history = useHistory();

    const frameInfo = useLoginInfoModel();
    const { userInfo, systemInfo } = frameInfo;

    const { zones } = JSON.parse(userInfo);

    const curLoginProvinceId = props?.failMapInfo?.failMapParams?.province
        ? props?.failMapInfo?.failMapParams?.province
        : systemInfo.currentZone?.zoneId
        ? systemInfo.currentZone?.zoneId
        : JSON.parse(userInfo).zones[0]?.zoneId;
    const userInfos = systemInfo?.currentZone?.zoneId ? systemInfo.currentZone : JSON.parse(userInfo).zones[0];
    const curLoginZoneLevel = userInfos.zoneLevel;
    const [form] = Form.useForm();
    const changeLoading = (bl: boolean) => {
        // setLoading(bl);
    };

    // 获取故障类型
    const getFaultByTabData = async () => {
        changeLoading(true);
        const dataCode = {
            provinceId: props?.failMapInfo?.failMapParams?.province
                ? props?.failMapInfo?.failMapParams?.province
                : systemInfo.currentZone?.zoneId
                ? systemInfo.currentZone?.zoneId
                : JSON.parse(userInfo).zones[0]?.zoneId,
            regionId: props?.failMapInfo?.failMapParams?.city ? props?.failMapInfo?.failMapParams?.city + '' : '',
            type: compareType,
            showType: dispatchPanelType === '2' ? undefined : dispatchPanelType,
        };
        const result = await getFaultByTab(dataCode);

        if (result?.data && result.data.length !== 0) {
            return result.data;
        } else {
            return [];
        }
    };

    // 获取超时故障tab
    const getTimeOutTabList = async () => {
        changeLoading(true);
        const dataCode = {
            provinceId: props?.failMapInfo?.failMapParams?.province
                ? props?.failMapInfo?.failMapParams?.province
                : systemInfo.currentZone?.zoneId
                ? systemInfo.currentZone?.zoneId
                : JSON.parse(userInfo).zones[0]?.zoneId,
            regionId: props?.failMapInfo?.failMapParams?.city ? props?.failMapInfo?.failMapParams?.city + '' : '',
            type: compareType,
        };
        const result = await getTimeOutTab(dataCode);

        if (result?.data && result.data.length !== 0) {
            return result.data;
        } else {
            return [];
        }
    };

    // 获取超时故障tab
    const getReportTroubleTabList = async () => {
        changeLoading(true);
        const dataCode = {
            provinceId: props?.failMapInfo?.failMapParams?.province
                ? props?.failMapInfo?.failMapParams?.province
                : systemInfo.currentZone?.zoneId
                ? systemInfo.currentZone?.zoneId
                : JSON.parse(userInfo).zones[0]?.zoneId,
            regionId: props?.failMapInfo?.failMapParams?.city ? props?.failMapInfo?.failMapParams?.city + '' : '',
            type: compareType,
        };
        const result = await getReportCountTab(dataCode);

        if (result?.data && result.data.length !== 0) {
            return result.data;
        } else {
            return [];
        }
    };

    // 获取故障类型列表 高级别故障、超时故障
    const getFaultByPageData = async () => {
        const { appendTime, searchStr, stateType, regionIds, flagDeal } = form.getFieldsValue();
        const [startTime, endTime] = appendTime ?? [null, null];
        const regionIdsToNum = regionIds?.map((el: string) => Number(el));
        try {
            changeLoading(true);
            const dataCode = {
                faultType: dispatchPanelType === '4' ? undefined : compareType === '1' ? tabKey : '',
                pageSize: 20,
                pageIndex: paginationRef.current.current,
                professionalType: dispatchPanelType === '4' ? undefined : compareType === '2' ? tabKey : '',
                provinceId: props?.failMapInfo?.failMapParams?.province
                    ? props?.failMapInfo?.failMapParams?.province
                    : systemInfo.currentZone?.zoneId
                    ? systemInfo.currentZone?.zoneId
                    : JSON.parse(userInfo).zones[0]?.zoneId,
                regionId: props?.failMapInfo?.failMapParams?.city ? props?.failMapInfo?.failMapParams?.city + '' : '',
                regionIds: regionIdsToNum,
                flagDeal,
                sheetStatus: stateType === 'all' ? '' : stateType,
                type: compareType,
                keyWord: searchStr?.trim(),
                startTime: startTime ? moment(startTime).format('YYYY-MM-DD HH:mm:ss') : startTime,
                endTime: endTime ? moment(endTime).format('YYYY-MM-DD HH:mm:ss') : endTime,
                showType: dispatchPanelType,
                timeoutShowType: dispatchPanelType === '4' ? tabKey : undefined,
            };
            if (dispatchPanelType === '4' && !tabKey) {
                setTroubleList([]);
                paginationRef.current = { current: 1, total: 0, pageSize: 15 };
                return;
            }

            const result = await getFaultByPage(dataCode);

            if (result.code !== 200) {
                message.error(result.message);
                return;
            }
            if (result?.data) {
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

                setTroubleList((prev) => {
                    return uniqBy(
                        [
                            ...prev,
                            ...result.data.map((item) => {
                                return {
                                    ...item,
                                    num: resultNum.data?.[item.sheetNo],
                                };
                            }),
                        ],
                        'sheetNo',
                    );
                });
                paginationRef.current.total = result.total;
            } else {
                setTroubleList([]);
                paginationRef.current = { current: 1, total: 0, pageSize: 20 };
            }
        } finally {
            changeLoading(false);
        }
    };

    // 获取已上报故障列表
    const getReportFaultBoardData = async () => {
        const { provinceId, reportType, appendTime } = form.getFieldsValue();
        const [startTime, endTime] = appendTime ?? [null, null];
        try {
            changeLoading(true);
            const dataCode = {
                provinceId: curLoginProvinceId,
                reportType: reportType === 'all' ? undefined : reportTypeEnum[reportType],
                specialty: tabKey,
                provinceIdList: provinceId?.includes('all') ? undefined : provinceId,
                startTime: startTime ? moment(startTime).format('YYYY-MM-DD HH:mm:ss') : startTime,
                endTime: endTime ? moment(endTime).format('YYYY-MM-DD HH:mm:ss') : endTime,
                current: paginationRef.current.current,
                pageSize: 15,
                time: moment().format('YYYY-MM-DD HH:mm:ss'),
                userId: userInfo.userId,
            };

            const result = await getReportFaultBoard(dataCode);
            console.log(result.data, '==listdata');

            if (result?.data) {
                setTroubleList((prev) => {
                    if (paginationRef.current.current !== 1) {
                        return uniqBy([...prev, ...result.data], 'flagId').filter((e) => e.flagId);
                    }
                    return result.data;
                });
                paginationRef.current.total = result.total;
            } else {
                setTroubleList([]);
                paginationRef.current = { current: 1, total: 0, pageSize: 15 };
            }
        } finally {
            changeLoading(false);
        }
    };

    function getProvinceListOptions() {
        const requestProvinceId =
            curLoginZoneLevel === '5' || curLoginZoneLevel === '2' ? curLoginProvinceId : JSON.parse(userInfo).zones[0]?.parentZoneId;

        getProvinceDrop({ provinceId: requestProvinceId }).then((res) => {
            if (res?.data) {
                let arr: { label: any; value: any }[] = [];

                if (curLoginZoneLevel === '5') {
                    arr = [
                        {
                            label: '全部',
                            value: 'all',
                        },
                        {
                            label: systemInfo.currentZone.zoneName,
                            value: systemInfo.currentZone.zoneId,
                        },
                    ];
                }

                setProvinceListOptions(
                    arr.concat(
                        res.data.map((item) => ({
                            label: item.provinceName,
                            value: item.provinceId,
                        })),
                    ),
                );
            }
        });
    }

    function getFaultList() {
        (typeRef.current === '3' ? getReportFaultBoardData : getFaultByPageData)();
    }

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
        if (result?.data) {
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
        }
    };
    const getRegionDict = async () => {
        const { currentZone } = systemInfo;

        const data = {
            pageSize: 2500,
            dictName: 'region_id',
            en: false,
            provinceId: currentZone?.zoneId,
            modelId: 2,
            creator: JSON.parse(userInfo).userId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
        };
        const result = await getSheetStatusInfo(data);
        if (result.data.length > 0) {
            const optionList = result.data.map((el) => {
                return { label: el.value, value: el.key };
            });
            setRegionOption(optionList);
        }
    };
    const onScroll = (event) => {
        if (loading || !event) return;
        const { clientHeight } = event?.target;
        const { scrollHeight } = event?.target;
        const { scrollTop } = event?.target;
        if (scrollTop) {
            const isBottom = clientHeight + scrollTop >= scrollHeight - 10;

            if (isBottom) {
                if (paginationRef.current.total <= paginationRef.current.current * 10) {
                    return;
                }
                // eslint-disable-next-line operator-assignment
                paginationRef.current.current = paginationRef.current.current + 1;
                getFaultList();
            }
        }
    };
    const requestData = () => {
        updateRefreshTimeFn();
        refreshTabData();
        unreadMessageoSumData();
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current!);
            }
        };
    }, []);

    useEffect(() => {
        getProvinceListOptions();
        getSheetStatusInfoData();
        getRegionDict();
    }, []);

    useEffect(() => {
        setLocked(false);
        form.resetFields();
        setTabKey(null);
        typeRef.current = dispatchPanelType;
    }, [compareType, dispatchPanelType]);

    useEffect(() => {
        paginationRef.current = { current: 1, total: 0, pageSize: 15 };
        typeRef.current = dispatchPanelType;
        setLocked(false);
        setTroubleList([]);
    }, [tabKey, compareType, dispatchPanelType]);

    useEffect(() => {
        typeRef.current = dispatchPanelType;
        requestData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [compareType, dispatchPanelType]);

    useEffect(() => {
        return () => {
            clearInterval(timerRef.current!);
        };
    }, []);

    useEffect(() => {
        clearInterval(timerRef.current!);

        if (locked) {
            return;
        }

        // if (!tabKey) {
        //     requestData();
        // }
        typeRef.current = dispatchPanelType;

        timerRef.current = setInterval(() => {
            requestData();
        }, 1000 * 60 * 3);

        return () => {
            clearInterval(timerRef.current!);
        };
    }, [locked, tabKey, dispatchPanelType]);

    useEffect(() => {
        if (locked) {
            return;
        }

        // if (!tabKey) {
        //     return;
        // }
        getFaultList();

        const timer = setInterval(() => {
            paginationRef.current = { current: 1, total: 0, pageSize: 15 };

            getFaultList();
        }, 1000 * 60 * 3);

        return () => {
            clearInterval(timer);
        };
    }, [locked, compareType, tabKey]);

    function refreshTabData() {
        const isHighLevelTrouble = typeRef.current === '1';
        const isTimeoutTrouble = typeRef.current === '4';

        let api = isHighLevelTrouble ? getFaultByTabData : isTimeoutTrouble ? getTimeOutTabList : getReportTroubleTabList;

        api().then((data) => {
            setTabList(data);
            let newTabKey = tabKey;
            if (!tabKey) {
                newTabKey = data[0]?.code || null;
                setTabKey(newTabKey);
                getFaultList();
            } else {
                newTabKey = data[0]?.code || null;
                setTabKey(newTabKey);
            }
        });
    }

    const onSelectCard = (key) => {
        sendLogFn({ authKey: 'troubleshootingWorkbench:professionalRange' });
        setLocked(false);
        if (key !== tabKey) {
            setTabKey(key);
        }
    };

    const openTalkView = () => {
        sendLogFn({ authKey: 'troubleshootingWorkbench:chatList' });
        setLocked(true);
        logNew(`调度工作台会话列表`, '300040');
        setVisible(true);
    };

    const jumpFaultDetails = (obj) => {
        setSheetInfo(obj);
        setShowType('detail');
    };

    const unreadMessageoSumData = async () => {
        const res = await unreadMessageoSum({ userId: JSON.parse(userInfo).userId });
        setTotalCount(res?.data?.totalCount || 0);
    };
    const formLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 17,
        },
        colon: false,
    };
    const resetForm = () => {
        form.resetFields();
    };
    const searchQuery = () => {
        setLocked(false);
        setTroubleList([]);
        setShowSearch(false);

        if (!locked) {
            getFaultList();
        }
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
    const onListItemClick = (item) => {
        if (currentKey === item.sheetNo) {
            setCurrentKey(null);
        } else {
            onListClick(item);
            setCurrentKey(item.sheetNo);
        }
    };
    const goFaultReportDetail = (data) => {
        if (String(curLoginProvinceId) !== String(data.provinceId)) {
            message.warn(`右上角切换至对应省份的调度工作台的故障上报查看`);
            return;
        }

        const flagId = data.flagId;
        const url = `/unicom/home/troubleshooting-workbench/fault-report/fault-report-detail`;
        const { operations = [] } = JSON.parse(userInfo);
        const fieldFlag = operations.find((items) => items.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${url}`));

        if (!fieldFlag) {
            message.warn(`您没有故障详情查看权限，请联系管理员在角色管理中授权`);
            return;
        }

        const { actions, messageTypes } = actionss;
        if (actions && actions.postMessage) {
            actions.postMessage(messageTypes.openRoute, {
                entry: url,
                extraContent: {
                    search: {
                        flagId: flagId || '',
                        standardAlarmId: data?.standardAlarmId || '',
                    },
                },
            });
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}${url}?flagId=${flagId}`);
        }
    };
    const isCityRegionIds = frameInfo.zoneLevelFlags.isCityZone ? [zones[0].zoneId] : undefined;
    const content = (
        <div className="trouble-list-search-form">
            <Form
                {...formLayout}
                form={form}
                initialValues={{
                    stateType: 'all',
                    reportType: 'all',
                    regionIds: isCityRegionIds,
                    provinceId:
                        curLoginZoneLevel !== '1' && curLoginZoneLevel !== '5'
                            ? provinceListOptions[0]
                                ? [provinceListOptions[0].value]
                                : []
                            : ['all'],
                }}
            >
                {typeRef.current === '3' ? (
                    <>
                        <Form.Item label="省份" name="provinceId">
                            <Select
                                disabled={curLoginZoneLevel !== '5' && curLoginZoneLevel !== '2'}
                                mode="multiple"
                                options={provinceListOptions}
                                placeholder="全部"
                            />
                        </Form.Item>
                        <Form.Item label="最新上报类型" name="reportType">
                            <Select>
                                {reportTypeOptions.map((item) => {
                                    return (
                                        <Option key={item.value} value={item.value}>
                                            {item.label}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </>
                ) : (
                    <>
                        <Form.Item label="地市" name="regionIds">
                            <Select
                                disabled={curLoginZoneLevel !== '2'}
                                mode="multiple"
                                options={regionOption}
                                maxTagCount={3}
                                allowClear
                                placeholder="全部"
                            />
                        </Form.Item>
                        <Form.Item label="工单优先级" name="flagDeal">
                            <Select mode="multiple" allowClear placeholder="全部">
                                {flagDealOption.map((item) => {
                                    return (
                                        <Option key={item.value} value={item.value}>
                                            {item.label}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="工单状态" name="stateType">
                            <Select>
                                {stateList.map((item) => {
                                    return (
                                        <Option key={item.key} value={item.key}>
                                            {item.value}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="关键字" name="searchStr">
                            <Input placeholder="请输入工单号或工单名称" />
                        </Form.Item>
                    </>
                )}
                <Form.Item label={typeRef.current === '3' ? '故障上报时间' : '发生时间'} name="appendTime">
                    <RangePicker showTime />
                </Form.Item>
            </Form>
            <div className="trouble-list-search-form-control">
                <Space>
                    <Button onClick={resetForm}>清除</Button>
                    <Button type="primary" onClick={searchQuery}>
                        搜索
                    </Button>
                </Space>
            </div>
        </div>
    );

    function getTypeContent() {
        switch (typeRef.current) {
            case '1':
            case '3':
            case '4':
                return (
                    <div className="trouble-list-wrapper">
                        <div className="trouble-list-tab">
                            <div className="tabs-list">
                                {tabList.map((item) => {
                                    return (
                                        <div
                                            key={item.code}
                                            className="tabs-card"
                                            onClick={() => {
                                                onSelectCard(item.code);
                                            }}
                                        >
                                            <div className="tabs-title" style={{ color: item.code === tabKey ? 'rgba(0, 0, 0, 0.85)' : undefined }}>
                                                {item.desc}
                                            </div>
                                            <div className="tabs-num">{item.num}</div>
                                            {item.code === tabKey ? <div className="tabs-selected"></div> : null}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="actions-wrapper">
                                <Popover
                                    visible={showSearch}
                                    placement="bottomRight"
                                    content={content}
                                    trigger="click"
                                    overlayClassName="trouble-list-search"
                                    getPopupContainer={(trigger: any) => trigger.parentElement}
                                >
                                    <img
                                        alt=""
                                        src={SearchUrl}
                                        onClick={() => {
                                            setShowSearch(!showSearch);
                                        }}
                                    />
                                </Popover>
                                {typeRef.current !== '3' && (
                                    <div className="right-buttons">
                                        <Button
                                            type={locked ? 'primary' : 'default'}
                                            shape="round"
                                            style={{
                                                height: 26,
                                                padding: '0 10px',
                                            }}
                                            onClick={() => setLocked(!locked)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <img
                                                    width={locked ? '12px' : '14px'}
                                                    src={constants.IMAGE_PATH + (locked ? '/lock.png' : '/unlock.png')}
                                                    alt=""
                                                />
                                                <span style={{ marginLeft: 5, lineHeight: '26px' }}>{locked ? '解锁' : '锁定'}</span>
                                            </div>
                                        </Button>
                                        <Badge overflowCount={999} count={totalCount}>
                                            <Button type="primary" onClick={openTalkView}>
                                                会话列表
                                            </Button>
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="trouble-list-table" onScroll={onScroll}>
                            <div className="example">
                                <List
                                    itemLayout="horizontal"
                                    size="large"
                                    dataSource={troubleList}
                                    locale={{ emptyText: '暂无数据' }}
                                    renderItem={(item) => {
                                        if (typeRef.current === '3') {
                                            return (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<img src={`${constants.IMAGE_PATH}/report-type-${item.reportType}.svg`} alt="bg" />}
                                                        title={
                                                            <div>
                                                                【{item.flagId}】 {item.topic}
                                                            </div>
                                                        }
                                                        description={
                                                            <div className="report-trouble-item-description">
                                                                <div className="province-city-name">{item.provinceName}</div>
                                                                {item.cityName && <div className="province-city-name">{item.cityName}</div>}
                                                                <div className="report-time">{item.createTime}</div>
                                                            </div>
                                                        }
                                                    />
                                                    <div style={{ position: 'relative' }}>
                                                        <Space>
                                                            <img
                                                                style={{ cursor: 'pointer' }}
                                                                src={NoticeUrl}
                                                                onClick={() => goFaultReportDetail(item)}
                                                                alt=""
                                                            />
                                                        </Space>
                                                    </div>
                                                </List.Item>
                                            );
                                        }
                                        const perList =
                                            item.masterMan && item.masterMan !== 'null' ? item.masterMan.replaceAll('，', ',').split(',') : [];
                                        // const telList = item.masterTel && item.masterTel !== 'null' ? item.masterTel.split(',') : [];
                                        if (typeRef.current === '1' || typeRef.current === '4') {
                                            return (
                                                <List.Item
                                                    onClick={() => onListItemClick(item)}
                                                    className={currentKey === item.sheetNo ? 'selected-item' : ''}
                                                    style={{ height: 50 }}
                                                >
                                                    <List.Item.Meta
                                                        avatar={
                                                            item?.flagDeal !== '0' && item?.flagDeal ? (
                                                                <img src={`${constants.IMAGE_PATH}/${item?.flagDeal}.svg`} alt="" />
                                                            ) : (
                                                                <div style={{ width: 40, height: 40 }} />
                                                            )
                                                        }
                                                        // title={<div>{item.sheetTitle}</div>}
                                                        description={
                                                            <div className="table-description">
                                                                <Tooltip title={item.sheetTitle}>
                                                                    <div className="table-description-title">{item.sheetTitle}</div>
                                                                </Tooltip>
                                                                <Tooltip title={item.sheetNo}>
                                                                    <div className="table-description-content">{item.sheetNo}</div>
                                                                </Tooltip>
                                                                <div className="table-description-time">{item.forwardTime}</div>
                                                                <div className="table-description-status">{item.sheetStatus}</div>
                                                                <div className="table-description-personnel">
                                                                    {perList.length > 0 && (
                                                                        <Tooltip title={perList.join(',')}>
                                                                            <div className="personnel-card">{perList[0]}</div>
                                                                        </Tooltip>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        }
                                                    />
                                                    <div style={{ position: 'relative' }}>
                                                        <Space>
                                                            {/* <img
                                                                alt=""
                                                                style={{ cursor: 'pointer' }}
                                                                src={NoticeUrl}
                                                                onClick={() => {
                                                                    setLocked(true);
                                                                    sendLogFn({ authKey: 'troubleshootingWorkbench:viewAlarm' });
                                                                    logNew(`调度工作台告警详情`, '300043');
                                                                    const startTime = dayjs().add(-72, 'hour');
                                                                    const endTime = dayjs().add(24, 'hour');
                                                                    setAlarmTableVisible(true);
                                                                    setCondition({
                                                                        sheet_no: { operator: 'like', value: item.sheetNo },
                                                                        event_time: {
                                                                            operator: 'between',
                                                                            value: [startTime, endTime],
                                                                        },
                                                                    });
                                                                }}
                                                            /> */}
                                                            <img
                                                                style={{ cursor: 'pointer' }}
                                                                src={DetailUrl}
                                                                onClick={() => {
                                                                    setLocked(true);
                                                                    logNew(`调度工作台工单详情`, '300044');
                                                                    jumpFaultDetails(item);
                                                                }}
                                                                alt=""
                                                            />
                                                        </Space>
                                                        {item.num > 0 && <div className="resume-warning">{item.num >= 100 ? '...' : item.num}</div>}
                                                    </div>
                                                </List.Item>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );
            case '2':
                return (
                    <div className="fault-dispath-alarm-wrapper">
                        <FaultDispathched failMapInfo={props.failMapInfo} />
                    </div>
                );
            default:
                return <div>暂无数据</div>;
        }
    }

    return (
        <>
            {getTypeContent()}
            <AlarmTable visible={AlarmTableVisible} condition={condition} closeModal={closeModal} />
            <Spin spinning={loading} className="trouble-list-spinning-element" tip="正在加载中，请稍等片刻..." />
            {visible && (
                <TalkviewList setSheetInfo={setSheetInfo} setShowType={setShowType} onVisible={setVisible} visible={visible} workBench={false} />
            )}
        </>
    );
};
export default TroubleList;
