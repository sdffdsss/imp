import React, { useRef, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import Img1 from '../img/img_1.png';
import Img2 from '../img/img_2.png';
import Icon16 from '../img/icon_16.png';
import { getPieChartOption, getBarStackChartOption } from './echarts-options';
import { getMteamSumStatistics, getMteamBarStatistics } from '../api';
import { getInitialRegion } from '@Common/utils/getInitialProvince';
import './index.less';

export default function Index({ frameInfo }) {
    const pieDomRef = useRef<HTMLDivElement | null>(null);
    const pieChartInsRef = useRef<echarts.ECharts>();

    const barDomRef = useRef<HTMLDivElement | null>(null);
    const barChartInsRef = useRef<echarts.ECharts>();
    const [curTime, setCurTime] = useState<string>();
    // const { systemInfo } = frameInfo;
    const zoneId = getInitialRegion(frameInfo).zoneId;
    const zoneLevel = getInitialRegion(frameInfo).zoneLevel;
    // 是否是集团或大区账号
    const isGroupOrArea = zoneLevel === '1' || zoneLevel === '5';

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (let index = 0; index < entries.length; index++) {
                const entry = entries[index];

                if (entry.target === pieDomRef.current) {
                    renderPieChart();
                } else if (entry.target === barDomRef.current) {
                    renderBarChart();
                }
            }
        });

        resizeObserver.observe(pieDomRef.current!);
        resizeObserver.observe(barDomRef.current!);
    }, []);

    function renderPieChart() {
        // if (barChartInsRef.current) {
        //     barChartInsRef.current.showLoading();
        // }
        // 班组数
        getMteamSumStatistics({ operator: frameInfo.userId, provinceId: zoneId }).then((res) => {
            if (res?.success) {
                const { allCount, bjMteamCount, zbMteamCount } = res?.data || {};
                const pieChartOption = getPieChartOption();

                pieChartOption.title.subtext = allCount;
                pieChartOption.series[0].data[0].value = bjMteamCount;
                pieChartOption.series[0].data[1].value = zbMteamCount;

                if (!pieChartInsRef.current) {
                    pieChartInsRef.current = echarts.init(pieDomRef.current!);
                }

                if (window.innerWidth < 1450) {
                    pieChartOption.title.textStyle.fontSize = 12;
                    pieChartOption.title.subtextStyle.fontSize = 18;
                    // pieChartOption.title.top = '35%';
                }

                pieChartInsRef.current?.setOption(pieChartOption);
                pieChartInsRef.current?.resize();
                // pieChartInsRef.current.hideLoading();
            }
        });
    }

    function renderBarChart() {
        // if (barChartInsRef.current) {
        //     barChartInsRef.current.showLoading();
        // }
        // 班组数
        getMteamBarStatistics({ operator: frameInfo.userId, provinceId: zoneId }).then((res) => {
            if (res?.success) {
                const data = res?.data || [];
                const barStackChartOption = getBarStackChartOption();
                barStackChartOption.xAxis[0].data = data.map((item) => (isGroupOrArea ? item.provinceName : item.professionalName));
                barStackChartOption.series[0].data = data.map((item) => item.bjCount);
                barStackChartOption.series[1].data = data.map((item) => item.zbCount);

                if (isGroupOrArea) {
                    barStackChartOption.xAxis[0].data = data.map((item) => {
                        if (
                            item.provinceName.includes('广西') ||
                            item.provinceName.includes('新疆') ||
                            item.provinceName.includes('西藏') ||
                            item.provinceName.includes('宁夏')
                        ) {
                            return item.provinceName.slice(0, 2);
                        } else if (item.provinceName.includes('内蒙古')) {
                            return item.provinceName.slice(0, 3);
                        }

                        return item.provinceName;
                    });
                }
                if (!barChartInsRef.current) {
                    barChartInsRef.current = echarts.init(barDomRef.current!);
                }
                setCurTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
                barChartInsRef.current?.setOption(barStackChartOption);
                barChartInsRef.current?.resize();

                // barChartInsRef.current?.hideLoading();
            }
        });
    }

    return (
        <div className="maintain-team-show-mode-top-content-wrapper">
            <div>
                <div className="left-content-wraper">
                    <div className="box-item box-item-1">
                        <div className="box-title">1. 定义排班维度</div>
                        <div className="img-wrapper">
                            <img src={Img1} alt="" />
                        </div>
                    </div>
                    <div className="box-item box-item-2">
                        <div className="box-title">2. 编排值班人员</div>
                        <div className="img-wrapper">
                            <img src={Img2} alt="" />
                        </div>
                    </div>
                </div>
                <div className="right-content-wraper">
                    <div className="right-content-top-wrapper">
                        <div ref={pieDomRef} style={{ width: '100%', height: '100%' }}></div>
                    </div>
                    <div className="right-content-bottom-wrapper">
                        <div className="content-title">
                            {isGroupOrArea ? '各省班组统计图' : '各专业班组统计图'}
                            <img src={Icon16} alt="" style={{ cursor: 'pointer' }} onClick={renderBarChart} />
                            <span>更新时间：{curTime} </span>
                        </div>
                        <div className="chart-wrapper">
                            <div ref={barDomRef} style={{ width: '100%', height: '100%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
