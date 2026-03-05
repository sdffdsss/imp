import React, { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { useSetState } from 'ahooks';
import { VirtualTable } from 'oss-web-common';
import { Button, Icon, Modal } from 'oss-ui';
import AuthButton from '@Components/auth-button';
import moment from 'moment';
import { blobDownLoad } from '@Common/utils/download';
import * as Api from '../api';
import { dutyManStaticicColumns } from './columns';
import './index.less';

/**
 * 统计数据详情
 * @returns
 */
const StatisticalDataDetail = () => {
    const [columns, setColumns] = useState([]);
    const [state, setState] = useSetState({
        staticVisible: false,
        staticChartVisible: false,
        staticTableData: [],
        trendChartData: [], // 趋势图数据
    });

    const groupId = new URLSearchParams(window.location.search).get('groupId');
    const groupName = new URLSearchParams(window.location.search).get('groupName');
    const beginDate = new URLSearchParams(window.location.search).get('beginDate') || undefined;
    const endDate = new URLSearchParams(window.location.search).get('endDate') || undefined;
    const formRef = useRef();
    const chartRef = useRef();
    // 重加载
    const tableRef = useRef();

    /**
     * 导出详情数据
     * @param {*} params
     * @returns
     */
    const exportStatisticalDetailDataList = () => {
        const data = {
            groupId,
            beginDate,
            endDate,
        };
        return Api.exportShiftOfDutyStatisticsDetailData(data).then((res) => {
            blobDownLoad(res, `${groupName}统计数据${moment().format('YYYYMMDD')}.xlsx`);
        });
    };

    /**
     * 获取详情数据
     * @param {*} params
     * @returns
     */
    const getStatisticalDetailDataList = () => {
        const data = {
            groupId,
            beginDate,
            endDate,
        };
        return Api.getShiftOfDutyStatisticsDetailData(data).then((res) => {
            if (res.titles?.length > 0) {
                const titles = res.titles.map((item, index) => {
                    return {
                        title: item,
                        dataIndex: index,
                        ellipsis: true,
                        search: false,
                        align: 'center',
                    };
                });
                setColumns(titles);
            }
            if (res.datas?.length > 0) {
                const row = {};
                res.datas.forEach((item, index) => {
                    row[index] = item;
                });
                return { data: [row] };
            }
            return { data: [] };
        });
    };
    const selectDutyUserSumData = async () => {
        const params = { groupId, beginDate, endDate };
        const result = await Api.selectDutyUserSumApi(params);

        // const mockData = Array.from({ length: 40 }).map((_, index) => {
        //     return {
        //         dutyUserId: '10198',
        //         dutyUserName: '尧新杰',
        //         groupName: '集团-总值班',
        //         dutyTimes: 5,
        //         manualTransferTimes: 2,
        //         autoTransferTimes: 3,
        //         workRecordCount: index,
        //         importantNoticeCount: 1,
        //     };
        // });
        return {
            data: result,
        };
    };
    const exportDutyUserSumData = async () => {
        const params = {
            groupId,
            beginDate,
            endDate,
        };
        const res = await Api.exportDutyUserSumApi(params);
        blobDownLoad(res, `值班人员统计${moment().format('YYYYMMDDHHmmss')}.xlsx`);
    };
    const selectNetworkFaultTrend = async () => {
        const params = { groupId, beginDate, endDate };
        const result = await Api.selectNetworkFaultTrendApi(params);
        if (result) {
            setState({ trendChartData: result });
        }
    };

    const drawChart = () => {
        const { trendChartData } = state;
        if (!chartRef.current) return;
        const myChart = echarts.init(chartRef.current);
        const option = {
            title: {
                text: '网络故障工单数',
                left: 'center',
            },
            xAxis: {
                type: 'category',
                data: trendChartData.map((el) => el.faultDate),
                axisLabel: {
                    interval: 0,
                },
                axisTick: {
                    show: false,
                },
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    type: 'line',
                    showSymbol: false,
                    color: '#73A1FF',
                    data: trendChartData.map((el) => el.faultCount),
                },
                {
                    type: 'bar',
                    barWidth: 2,
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: '#73A1FF', // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(255,255,255,0)', // 100% 处的颜色
                            },
                        ],
                        global: false, // 缺省为 false
                    },
                    label: {
                        show: true,
                        color: '#73A1FF',
                        position: 'top',
                    },
                    data: trendChartData.map((el) => el.faultCount),
                },
            ],
        };
        myChart.setOption(option);
    };
    useEffect(() => {
        drawChart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.staticChartVisible, state.trendChartData]);
    useEffect(() => {
        getStatisticalDetailDataList();
    }, []);
    const openChartWindow = () => {
        selectNetworkFaultTrend();
        setState({ staticChartVisible: true });
    };
    return (
        <>
            <VirtualTable
                search={false}
                onReset={false}
                toolBarRender={() => [
                    <AuthButton type="primary" onClick={() => setState({ staticVisible: true })} authKey="statistical-data:dutyManStatic">
                        值班人员统计
                    </AuthButton>,
                    <AuthButton onClick={openChartWindow} type="text" variant="text" authKey="statistical-data:faultTrend">
                        <Icon antdIcon type="BarChartOutlined" style={{ fontSize: 18 }} />
                    </AuthButton>,
                    <Button
                        onClick={() => {
                            exportStatisticalDetailDataList();
                        }}
                    >
                        <Icon antdIcon type="ExportOutlined" />
                        导出
                    </Button>,
                ]}
                global={window}
                columns={columns}
                request={getStatisticalDetailDataList}
                actionRef={tableRef}
                formRef={formRef}
                scroll={{ x: 'max-content' }}
                pagination={false}
            />
            <Modal title="值班人员统计" visible={state.staticVisible} onCancel={() => setState({ staticVisible: false })} width={1000} footer={null}>
                <div className="table-container">
                    <VirtualTable
                        global={window}
                        search={false}
                        request={selectDutyUserSumData}
                        columns={dutyManStaticicColumns}
                        toolBarRender={() => [
                            <Button onClick={exportDutyUserSumData}>
                                <Icon antdIcon type="ExportOutlined" />
                                导出
                            </Button>,
                        ]}
                    />
                </div>
            </Modal>
            <Modal
                title="网络故障工单数"
                visible={state.staticChartVisible}
                onCancel={() => setState({ staticChartVisible: false })}
                width={1000}
                footer={null}
            >
                <div className="chart-container">
                    <div className="chart-root" ref={chartRef} />
                </div>
            </Modal>
        </>
    );
};

export default StatisticalDataDetail;
