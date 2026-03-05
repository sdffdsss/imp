import React, { useMemo, useEffect, useState, useRef } from 'react';
import { Image } from 'oss-ui';
import './index.less';
import FaultList from './fault-list';
import OrderList from './order-list';
import AlarmStatistics from './alarm-statistics';
import useLoginInfoModel from '@Src/hox';
import SystemNotice from '@Components/system-notice';
import FaultSvg from './img/重大故障.svg';
import InterruptSvg from './img/中断监测.svg';
import CutoverSvg from './img/工程割接.svg';
import OrderSvg from './img/投诉工单.svg';
import hexin from './img/核心网.svg';
import chuanshu from './img/传输网.svg';
import fivegc from './img/5GC.svg';
import wuxian from './img/无线网.svg';
import shuju from './img/数据网.svg';
import jieru from './img/接入网.svg';
import donghuan from './img/动环网.svg';
import zengzhi from './img/增值网.svg';
import guwang from './img/固网.svg';
import Api from './api.jsx';
import urlSearch from '@Common/utils/urlSearch';
import WorkbenchCommonTopInfo from '@Pages/components/workbench-common-top-info';
const DutyMonitorView = () => {
    const [overallStatistics, setOverallStatistics] = useState<any>({});
    const [operationStatistics, setOperationStatistics] = useState<any>([]);
    const [chartData, setChartData] = useState<any>({});
    const [data, setData] = useState<any>([]);
    // const [topLeftdata, setTopLeftData] = useState<any>([]);
    const [cutData, setCutData] = useState<any>([]);
    const [sheetData, setSheetData] = useState<any>([]);
    const [interruptData, setInterruptData] = useState<any>([]);
    const [bigErrorData, setBigErrorData] = useState<any>([]);
    const login = useLoginInfoModel();
    const { systemInfo } = login;
    const { zones = [] } = JSON.parse(login?.userInfo);
    const urlData = urlSearch(window.location.href);
    const zoneId = urlData.provinceId ? urlData.provinceId : systemInfo?.currentZone?.zoneId || zones[0].zoneId;
    // const zoneId = '-662225376';
    const timerRef = useRef<any>(null);
    const faultTotal = useMemo(() => {
        let total = 0;
        bigErrorData.forEach((item: any) => {
            total += item?.data.length;
        });
        return total;
    }, [bigErrorData]);

    const statisticsEnum = useMemo(() => {
        const { interrupt, project, complaint } = overallStatistics;
        return [
            {
                img: FaultSvg,
                count: faultTotal || 0,
                title: '重大故障',
            },
            {
                img: InterruptSvg,
                count: interrupt || 0,
                title: '中断监测',
            },
            {
                img: CutoverSvg,
                count: project || 0,
                title: '工程割接',
            },
            {
                img: OrderSvg,
                count: complaint || 0,
                title: '投诉工单',
            },
        ];
    }, [overallStatistics, faultTotal]);
    const getAllData = () => {
        Api.getAlarmData({ regionId: zoneId }).then((res) => {
            console.log(res);
            if (res.dataObject) {
                // setOverallStatistics(res.dataObject?.overallStatistics);
                setOperationStatistics(res.dataObject?.operationStatistics);
                setChartData(res.dataObject);
                setData(res.dataObject?.alarmStatistics);
            }
        });
        // Api.getTopLeftData({ provinceId: zoneId }).then((res) => {
        //   if (res.data) {
        //     setTopLeftData(res.data[0]);
        //   }
        // });
        Api.getInterruptData({ provinceId: zoneId }).then((res) => {
            if (res.data) {
                setInterruptData(res.data);
                overallStatistics.interrupt = res.count;
                setOverallStatistics({ ...overallStatistics });
            }
        });
        Api.getCutSheetData({ provinceId: zoneId, pageSize: 999999, pageNum: 1 }).then((res) => {
            if (res.data) {
                setCutData(res.data);
                overallStatistics.project = res.total;
                setOverallStatistics({ ...overallStatistics });
            }
        });
        Api.getComplaintSheetData({ provinceId: zoneId }).then((res) => {
            if (res.data) {
                setSheetData(res.data);
                overallStatistics.complaint = res.total;
                setOverallStatistics({ ...overallStatistics });
            }
        });
        Api.getBigErrorData({ provinceId: zoneId, faultType: 1 }).then((res) => {
            if (res.data) {
                bigErrorData[0] = {
                    title: '线路故障',
                    data: res.data,
                };
                setBigErrorData([...bigErrorData]);
            }
        });
        Api.getBigErrorData({ provinceId: zoneId, faultType: 2 }).then((res) => {
            if (res.data) {
                bigErrorData[1] = {
                    title: '机房动力故障',
                    data: res.data,
                };
                setBigErrorData([...bigErrorData]);
            }
        });
        Api.getBigErrorData({ provinceId: zoneId, faultType: 3 }).then((res) => {
            if (res.data) {
                bigErrorData[2] = {
                    title: '基站退服故障',
                    data: res.data,
                };
                setBigErrorData([...bigErrorData]);
            }
        });
        Api.getBigErrorData({ provinceId: zoneId, faultType: 4 }).then((res) => {
            if (res.data) {
                bigErrorData[3] = {
                    title: '传输设备故障',
                    data: res.data,
                };
                setBigErrorData([...bigErrorData]);
            }
        });
    };
    useEffect(() => {
        getAllData();
        timerRef.current = setInterval(() => {
            getAllData();
        }, 1000 * 60 * 3);
        return () => {
            clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [login.userId, zoneId]);

    const renderTitle = (arg, i) => {
        const { img, count, title } = arg;
        return (
            <div className="duty-monitor-page-left-top-item" key={i}>
                <Image src={img} preview={false} />
                <div className="duty-monitor-page-left-top-item-right">
                    <div className="duty-monitor-page-left-top-item-right-count">{count}</div>
                    <div className="duty-monitor-page-left-top-item-right-title">{title}</div>
                </div>
            </div>
        );
    };
    const changeTabData = (type) => {
        Api.getBigErrorData({ provinceId: zoneId, faultType: type }).then((res) => {
            if (res.data && bigErrorData.length === 4) {
                bigErrorData[type - 1].data = res.data;
                setBigErrorData([...bigErrorData]);
            }
        });
    };

    const imgArr = [hexin, chuanshu, fivegc, wuxian, shuju, jieru, donghuan, zengzhi, guwang];

    const perationalStatisticsEnum = useMemo(() => {
        return operationStatistics.map((item: any, i: number) => {
            return {
                img: imgArr[i],
                alarmCount: item?.activeAlarm,
                pendingOrder: item?.workSheetTodo,
                confirmedOrder: item?.workSheetToConfirm,
                timeoutOrder: item?.workSheetTimeOut,
                title: item.name,
            };
        });
    }, [operationStatistics]);
    const renderStatistics = (arg, i) => {
        const { img, alarmCount, pendingOrder, confirmedOrder, timeoutOrder, title } = arg;
        return (
            <div className="duty-monitor-page-right-bottom-list-item" key={i}>
                <div className="duty-monitor-page-right-bottom-list-item-top">
                    <Image src={img} preview={false} width={17} />
                    <div className="duty-monitor-page-right-bottom-list-item-top-title">{title}</div>
                </div>
                <div className="duty-monitor-page-right-bottom-list-item-bottom">
                    <div className="item">
                        <div className="title">一级设备告警数</div>
                        <div className="count">{alarmCount}</div>
                    </div>
                    <div className="item">
                        <div className="title"> 待受理工单数</div>
                        <div className="count">{pendingOrder}</div>
                    </div>
                    <div className="item">
                        <div className="title">待确认工单数</div>
                        <div className="count">{confirmedOrder}</div>
                    </div>
                    <div className="item">
                        <div className="title">超时工单数</div>
                        <div className="count" style={{ color: '#F21932' }}>
                            {timeoutOrder}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="duty-monitor-page-wrapper">
            <SystemNotice />
            <WorkbenchCommonTopInfo loginInfo={login} isManagementButtonVisible={false} />
            <div className="duty-monitor-page">
                <div className="duty-monitor-page-left">
                    <div className="duty-monitor-page-left-top">{statisticsEnum.map((item, index) => renderTitle(item, index))}</div>
                    <div className="duty-monitor-page-left-center">
                        <FaultList title="重大故障列表" dataSource={bigErrorData} changeTabData={changeTabData} />
                    </div>
                    <div className="duty-monitor-page-left-center2">
                        <FaultList title="中断监测列表" dataSource={interruptData} />
                    </div>
                    <div className="duty-monitor-page-left-bottom">
                        <OrderList title={'工程割接列表'} dataSource={cutData} />
                        <OrderList title={'投诉工单列表'} dataSource={sheetData} />
                    </div>
                </div>
                <div className="duty-monitor-page-right">
                    <div className="duty-monitor-page-right-top">
                        <AlarmStatistics title={'告警统计'} chartData={chartData} data={data} />
                    </div>
                    <div className="duty-monitor-page-right-bottom">
                        <div className="duty-view-title">{'运营统计'}</div>
                        <div className="duty-monitor-page-right-bottom-list">
                            {perationalStatisticsEnum &&
                                perationalStatisticsEnum.map((item, i) => {
                                    return renderStatistics(item, i);
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DutyMonitorView;
