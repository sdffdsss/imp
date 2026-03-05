import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { Modal, Table, Tooltip, Empty, Button, message } from 'oss-ui';
import { useHistory } from 'react-router-dom';
import { ColumnsType } from 'oss-ui/lib/table';
import NewFaultReportDetailContent from '@Pages/fault-report/fault-report-detail/NewFaultReportDetailContent';
import shareActions from '@Src/share/actions';
import useLoginInfoModel from '@Src/hox';
import { getFaultSchedulingKanban, getProvinceFaultReport, getReportFaultCard, getNoticeRecord } from './api';
import {
    ReportTableColumnsType,
    TableColumnsType,
    FaultDataType,
    FaultItem,
    FaultReportDataType,
    FaultDetailListDataType,
    StatisticsType,
} from '../../types';
import Picture from './images';
import { handiworkDispatch, timeoutFault } from './echarts-options';
import ModalTable from '../modal-table';
import './index.less';
import constants from '@Src/common/constants';

interface Iprops {
    curZoneId: number;
}
const initTimeoutFaultData: FaultDataType = {
    timeoutFaultNum: 0,
    timeoutFaultList: [],
    autoDispatchNum: 0,
    autoDispatchList: [],
    todoDispatchNum: 0,
    todoDispatchList: [],
};

const initFaultReportData: FaultReportDataType = {
    provinceReportDataList: [],
    reportFaultSum: 0,
};
const initStatistics: StatisticsType = {
    successCount: 0,
    failureCount: 0,
};

const TroubleStatsContent: React.FC<Iprops> = (props) => {
    const { curZoneId } = props;
    // 待手工派单
    const chartRef = useRef<HTMLDivElement>(null);
    // 超时待调度故障
    const faultChartRef = useRef<HTMLDivElement>(null);
    const date = dayjs();
    const nowDate = useRef(date.format('YYYY-MM-DD HH:mm'));

    const [faultData, setFaultData] = useState<FaultDataType>(initTimeoutFaultData);

    const [currentDetailPage, setCurrentDetailPage] = useState({
        pageSize: 1,
        switch: true,
    });
    const selectId = useRef<number>();

    const [faultReportData, setFaultReportData] = useState<FaultReportDataType>(initFaultReportData);
    const [faultDetailListData, setFaultDetailListData] = useState<FaultDetailListDataType[]>([]);
    const [faultDispatchData, setFaultDispatchData] = useState<TableColumnsType[]>([]);
    const [statistics, setStatistics] = useState<StatisticsType>(initStatistics);

    const [modelVisible, setModelVisible] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<string>('');
    const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);

    const secondRowRef = useRef<HTMLDivElement>(null);
    const secondRowRefHeight = secondRowRef.current?.getBoundingClientRect().height as number;

    const handleDispatch = useMemo(() => {
        const { autoDispatchNum = 0 } = faultData;
        return autoDispatchNum;
    }, [faultData]);

    const hasDispatchData = useMemo(() => {
        const { autoDispatchList, todoDispatchList } = faultData;
        return (autoDispatchList && autoDispatchList.length > 0) || (todoDispatchList && todoDispatchList.length > 0);
    }, [faultData]);

    const history = useHistory();
    const { zoneLevelFlags, userInfo, systemInfo } = useLoginInfoModel();
    const { zones } = JSON.parse(userInfo);

    const goTo = (record: any) => {
        const url = '/unicom/home/fault-scheduling-notification';
        const { operations } = JSON.parse(userInfo);
        const fieldFlag = operations.find((items) => items.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${url}`));
        if (!fieldFlag) {
            message.warn(`暂无权限`);
            return;
        }
        const { noticeId } = record;
        localStorage.setItem('noticeId', noticeId);
        history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/fault-scheduling-notification/view`);
    };
    const getTextWidth = (text: string) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = `12px 微软雅黑`;
            return context.measureText(text).width;
        }
        return 0;
    };

    const newTableColumns: ColumnsType<TableColumnsType> = [
        {
            title: '通知规则名称',
            align: 'center',
            dataIndex: 'noticeRuleName',
            ellipsis: true,
            width: 120,
            render: (text: string, record: TableColumnsType) => {
                return (
                    <a onClick={() => goTo(record)} className="notice-rule-name">
                        {getTextWidth(text) > 120 ? <Tooltip title={text}>{text}</Tooltip> : text}
                    </a>
                );
            },
        },
        {
            title: zoneLevelFlags.isCountryOrRegionZone ? '省份' : '地市',
            align: 'center',
            dataIndex: 'areaName',
        },
        {
            title: '通知失败对象',
            align: 'center',
            dataIndex: 'noticeFailureObject',
        },
        {
            title: '通知时间',
            align: 'center',
            dataIndex: 'noticeTime',
        },
        {
            title: '工单编号',
            align: 'center',
            dataIndex: 'workNum',
        },
    ];

    /**
     * @description 过滤合并手工待派单和超时待调度故障的数据
     */
    const computedArray = (arr1: FaultItem[], arr2: FaultItem[]) => {
        if (arr1 && arr2) {
            const list1 = arr1.map((el) => {
                const listItem = arr2.find((item) => item.name === el.name);
                if (listItem) {
                    return { name: el.name, autoValue: el.value, todoValue: listItem.value };
                }
                return { name: el.name, autoValue: el.value, todoValue: 0 };
            });

            const list2 = arr2
                .filter((el) => arr1.every((item) => item.name !== el.name))
                .map((el) => {
                    return { name: el.name, autoValue: 0, todoValue: el.value };
                });
            return [...list1, ...list2];
        }
        if (arr1) {
            const list = arr1.map((el) => {
                return { name: el.name, autoValue: el.value, todoValue: 0 };
            });
            return list;
        }

        if (arr2) {
            const list = arr2.map((el) => {
                return { name: el.name, autoValue: 0, todoValue: el.value };
            });
            return list;
        }
        return [];
    };

    const onHandleSelect = (id: string) => {
        if (currentItem === id) {
            setCurrentItem('');
        } else {
            setCurrentItem(id);
            setDetailModalVisible(true);
        }
    };
    const onDetailModalCancel = () => {
        setDetailModalVisible(false);
    };
    const getStatsChartData = async () => {
        let params: any = { provinceIds: [curZoneId], cityIds: [] };
        if (zoneLevelFlags.isCityZone) {
            params = { provinceIds: [curZoneId], cityIds: [zones[0].zoneId] };
        }
        const result = await getFaultSchedulingKanban(params);
        if (result.code !== 200) {
            const { timeOutWCount, timeOutWTotal, autoWTotal, autoWCount, todoHandAlarmsTotal, todoHandAlarmsCount } = result.dataObject || {};
            setFaultData({
                timeoutFaultNum: timeOutWTotal,
                timeoutFaultList: timeOutWCount,
                autoDispatchNum: autoWTotal,
                autoDispatchList: autoWCount,
                todoDispatchNum: todoHandAlarmsTotal,
                todoDispatchList: todoHandAlarmsCount,
            });
        }
    };
    const getProvinceFaultReportData = async () => {
        const params = {
            accountProvinceId: curZoneId,
            provinceId: curZoneId,
        };
        const result = await getProvinceFaultReport(params);
        if (+result.code === 200) {
            setFaultReportData(result.data);
        }
    };
    /**
     * @description 获取上报关键故障列表
     * @returns
     */
    const getFaultDetailListData = async () => {
        console.log({ systemInfo, curZoneId, selectId });
        /**
         * @params current 当前页数
         * @params pageSize 一页多少条
         * @params accountProvinceId 右上角框架省份id
         * @params provinceId 集团和大区用户点击省份id
         * @params cityId 省份和地市用户点击地市id
         * @params select 大区用户表头和表格内参数一样，用这个区分
         */
        const params = {
            current: currentDetailPage.pageSize,
            pageSize: 15,
            accountProvinceId: curZoneId,
            provinceId: curZoneId,
            cityId: selectId.current,
            select: 1,
        };
        // 后端说，大区账号右上角选择了或大区，不用再传cityId了
        if (zones[0].zoneLevel === '5' && systemInfo.currentZone?.zoneLevel === '5') {
            delete params.cityId;
        }
        // 后端说，集团账号右上角选择了大区，不用再传cityId了
        if (zones[0].zoneLevel === '1' && systemInfo.currentZone?.zoneLevel === '5') {
            delete params.cityId;
        }
        // 前面俩判断会删除params.cityId ，如果不存在就是集团或大区账号,点击表格里的数字selectId不为空
        if (!params.cityId && selectId.current) {
            params.provinceId = selectId.current as number;
        }
        if (!selectId.current) {
            params.select = 0;
        }
        // 初始为true,请求数据不足15条时改为false
        if (currentDetailPage.switch) {
            const result = await getReportFaultCard(params);
            if (+result.code === 200 && result.data) {
                const listData = result.data.map((el: any) => {
                    return {
                        faultTopic: el.topic,
                        profession: el.specialtyName,
                        faultCategory: el.failureClassName,
                        reportNewClass: el.reportTypeName,
                        reportTime: el.reportTime,
                        id: el.flagId,
                    };
                });

                if (listData.length < 15) {
                    setFaultDetailListData([...faultDetailListData, ...listData]);
                    setCurrentDetailPage({
                        ...currentDetailPage,
                        switch: false,
                    });
                    return;
                }

                setFaultDetailListData([...faultDetailListData, ...listData]);
                setCurrentDetailPage({ ...currentDetailPage, pageSize: currentDetailPage.pageSize + 1 });
            }
        }
    };
    const reportColumnsClick = (id?: number) => {
        selectId.current = id;
        setModelVisible(true);
        getFaultDetailListData();
    };

    const reportColumns: ColumnsType<ReportTableColumnsType> = [
        {
            title: '地市',
            align: 'center',
            dataIndex: 'areaName',
        },
        {
            title: '群障数量(个)',
            align: 'center',
            dataIndex: 'reportFaultCount',
            render: (text: string, record) => {
                return <a onClick={() => reportColumnsClick(record.areaId as number)}>{text}</a>;
            },
        },
    ];
    const getGroupTroubleData = async () => {
        const params = {
            beginTime: date.subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
            cityId: [],
            earlyWarningLevel: [],
            endTime: nowDate.current,
            msgStatus: [],
            provinceId: curZoneId,
            pageNum: 0,
            pageSize: 1000,
        };
        const result = await getNoticeRecord(params);
        if (+result.code === 200 && result.data) {
            const { datas, successCount, failCount } = result.data;
            const failureData = datas.filter((el: any) => el.msgStatus !== 1);
            const tableData = failureData.map((el: any) => {
                return {
                    noticeRuleName: el.noticeName,
                    // 大区集团展示省份，别的展示地市
                    areaName: zoneLevelFlags.isCountryOrRegionZone ? el.provinceName : el.cityName,
                    noticeFailureObject: el.failPhones,
                    noticeTime: el.noticeTime,
                    workNum: el.sheetNo,
                    noticeId: el.noticeId,
                };
            });
            setStatistics({
                successCount,
                failureCount: failCount,
            });
            setFaultDispatchData(tableData);
        }
    };

    useEffect(() => {
        getStatsChartData();
        getProvinceFaultReportData();
        getGroupTroubleData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handiworkDispatchRender = useCallback(() => {
        const { autoDispatchList, todoDispatchList } = faultData;
        if (!chartRef.current) return;
        const myChart = echarts.init(chartRef.current);
        const dataList = computedArray(autoDispatchList, todoDispatchList);
        const options = handiworkDispatch(dataList);
        myChart.setOption(options);
    }, [faultData]);

    const timeoutFaultChartRender = useCallback(() => {
        const { timeoutFaultList } = faultData;
        if (!faultChartRef.current) return;
        const myChart = echarts.init(faultChartRef.current);
        if (timeoutFaultList && timeoutFaultList.length > 0) {
            const data = faultData.timeoutFaultList.map((el) => el.value);
            const dataName = faultData.timeoutFaultList.map((el) => el.name);
            const options = timeoutFault(data, dataName);
            myChart.setOption(options);
        }
    }, [faultData]);

    useEffect(() => {
        handiworkDispatchRender();
        timeoutFaultChartRender();
    }, [timeoutFaultChartRender, handiworkDispatchRender]);

    const handleCancel = () => {
        setModelVisible(false);
        setCurrentItem('');
        setFaultDetailListData([]);
        setCurrentDetailPage({
            pageSize: 1,
            switch: true,
        });
    };
    const clickFaultNum = () => {
        const cityId = zones.zoneId;
        if (zoneLevelFlags.isCityZone) {
            reportColumnsClick(cityId);
            return;
        }
        reportColumnsClick();
    };
    const addCurrentPage = () => {
        getFaultDetailListData();
    };
    return (
        <div className="trouble-stats-wrapper">
            <div className="first-row-wrapper">
                <div className="manual-dispatch-wrapper">
                    <div className="chart-header-wrapper">
                        <div className="title-left">
                            <img src={Picture.Img1} alt="" className="title-pic" />
                            <span title="故障调度统计" className="module-title">
                                故障调度统计
                            </span>
                        </div>
                        <div className="title-right">
                            <span className="num">{handleDispatch}</span>单
                        </div>
                    </div>
                    <div className="chart-body">
                        {hasDispatchData ? <div className="chart-wrapper" ref={chartRef} /> : <Empty image={Picture.empty} />}
                    </div>
                </div>
                <div className="timeout-dispatch-trouble-wrapper">
                    <div className="chart-header-wrapper">
                        <div className="title-left">
                            <img src={Picture.PathU491} alt="" className="title-pic" />
                            <span title="超时待调度故障" className="module-title">
                                超时待调度故障
                            </span>
                        </div>
                        <div className="title-right">
                            <span className="num">{faultData.timeoutFaultNum}</span>单
                        </div>
                    </div>
                    <div className="chart-body">
                        {faultData.timeoutFaultList && faultData.timeoutFaultList.length > 0 ? (
                            <div className="chart-wrapper" ref={faultChartRef} />
                        ) : (
                            <Empty image={Picture.empty} />
                        )}
                    </div>
                </div>
            </div>
            <div className="second-row-wrapper" ref={secondRowRef}>
                <div className="panel-table-wrapper">
                    <div className="chart-header-wrapper">
                        <div className="title-left">
                            <img src={Picture.PathU491} alt="" className="title-pic" />
                            <span className="module-title">故障分级调度</span>
                        </div>
                        <div className="title-right-pro">
                            <Tooltip title="近24小时通知次数" placement="bottomLeft">
                                <img src={Picture.hour24} alt="pic not found" />
                            </Tooltip>
                            <div className="notice-number">
                                <span className="notice-number-count">{statistics.failureCount + statistics.successCount}</span>
                                <span className="notice-number-font">次</span>
                            </div>
                            <div className="failure-or-success">
                                (成功<span className="failure-or-success-count">{statistics.successCount}</span>/失败
                                <span className="failure-or-success-count">{statistics.failureCount}</span>)
                            </div>
                            <div className="failure-arrow">
                                <span>失败详情</span>
                                <img src={Picture.arrow} alt="pic not found" />
                            </div>
                        </div>
                    </div>
                    <div className="group-trouble-stats-table-wrapper">
                        {faultDispatchData.length > 0 ? (
                            <Table
                                className="group-trouble-table-list"
                                columns={newTableColumns}
                                size="middle"
                                scroll={{ y: secondRowRefHeight - 130 }}
                                pagination={false}
                                dataSource={faultDispatchData}
                            />
                        ) : (
                            <div className="empty-box">
                                <Empty image={Picture.empty} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="panel-group-trouble-list">
                    <div className="chart-header-wrapper">
                        <div className="title-left">
                            <img src={Picture.RingIcon} alt="" className="title-pic" />
                            <span className="module-title">上报关键故障</span>
                        </div>
                        <div className="title-right">
                            <span className="num" onClick={clickFaultNum}>
                                {faultReportData.reportFaultSum}
                            </span>
                            个
                        </div>
                    </div>
                    <div className="group-trouble-stats-table-wrapper">
                        {faultReportData.reportFaultSum !== 0 ? (
                            <Table
                                className="group-trouble-table-list"
                                columns={reportColumns}
                                size="middle"
                                scroll={{ y: secondRowRefHeight - 130 }}
                                pagination={false}
                                dataSource={faultReportData.provinceReportDataList}
                            />
                        ) : (
                            <div className="empty-box">
                                <Empty image={Picture.empty} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal title="故障详情" visible={modelVisible} width={900} footer={null} onCancel={handleCancel}>
                <ModalTable
                    onHandleSelect={onHandleSelect}
                    currentItem={currentItem}
                    faultDetailListData={faultDetailListData}
                    addCurrentPage={addCurrentPage}
                />
                <div className="table-modal-footer">
                    <button type="button" onClick={handleCancel} className="table-footer-btn">
                        取消
                    </button>
                </div>
            </Modal>
            <Modal title="详情" visible={detailModalVisible} width={1250} footer={null} onCancel={onDetailModalCancel}>
                <div className="trouble-stats-wrapper-detail-modal">
                    <NewFaultReportDetailContent flagId={currentItem} />
                </div>
                <div className="detail-modal-button-box">
                    <Button onClick={onDetailModalCancel}>取消</Button>
                </div>
            </Modal>
        </div>
    );
};
export default TroubleStatsContent;
