import React, { useRef, useState, useEffect } from 'react';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import Icon1 from '../img/icon_1.png';
import Icon2 from '../img/icon_2.png';
import Icon3 from '../img/icon_3.png';
import Icon4 from '../img/icon_4.png';
import Icon5 from '../img/icon_5.png';
import Icon6 from '../img/icon_6.png';
import Icon7 from '../img/icon_7.png';
import Icon8 from '../img/icon_8.png';
import Icon9 from '../img/icon_9.png';
import Icon16 from '../img/icon_16.png';
import { getPieChartOption, getLineChartOption, getLineBarChartOption } from './echarts-options';
import { getLeftRuleData, getWorksheetAutoSend, getWorksheetRuleSend, getWorksheetDayStatics } from '../api';
import useLoginInfoModel from '@Src/hox';
import { getInitialProvince, getInitialRegion } from '@Common/utils/getInitialProvince';
import './index.less';

export default function Index(props) {
    const pieDomRef = useRef<HTMLDivElement | null>(null);
    const pieChartInsRef = useRef<echarts.ECharts>();

    const lineDomRef = useRef<HTMLDivElement | null>(null);
    const lineChartInsRef = useRef<echarts.ECharts>();

    const lineBarDomRef = useRef<HTMLDivElement | null>(null);
    const lineBarChartInsRef = useRef<echarts.ECharts>();

    const [curLineChartTime, setCurLineChartTime] = useState<string>();
    const [curBarChartTime, setCurBarChartTime] = useState<string>();
    const [leftRuleData, setLeftRuleData] = useState<Record<string, any>>({});
    const [dayStatics, setDayStatics] = useState<Record<string, any>>({});
    const login = useLoginInfoModel();
    // const { systemInfo } = login;
    const zoneId = getInitialProvince(login);
    const zoneLevel = getInitialRegion(login).zoneLevel;
    // 是否是集团或大区账号
    const isGroupOrArea = zoneLevel === '1' || zoneLevel === '5';

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (let index = 0; index < entries.length; index++) {
                const entry = entries[index];

                if (entry.target === pieDomRef.current) {
                    renderPieChart();
                } else if (entry.target === lineDomRef.current) {
                    renderLineChart();
                } else if (entry.target === lineBarDomRef.current) {
                    renderLineBarChart();
                }
            }
        });
        getWorksheetDayStatics({ provinceId: zoneId }).then((res) => {
            if (res.data) {
                setDayStatics(res.data[0] || {});
            }
        });

        resizeObserver.observe(pieDomRef.current!);
        resizeObserver.observe(lineDomRef.current!);
        resizeObserver.observe(lineBarDomRef.current!);
    }, []);

    function renderPieChart() {
        // if (pieChartInsRef.current) {
        //     pieChartInsRef.current.showLoading();
        // }

        getLeftRuleData({ areaId: zoneId }).then((res) => {
            if (res?.success) {
                const data = res?.data || {};
                const pieChartOption = getPieChartOption();
                pieChartOption.title.subtext = data.dispatchRuleTotalNum;
                pieChartOption.series[0].data[0].value = data.crossSpecialtyTotalNum;
                pieChartOption.series[0].data[1].value = data.singleSpecialtyTotalNum;

                if (!pieChartInsRef.current) {
                    pieChartInsRef.current = echarts.init(pieDomRef.current!);
                }
                pieChartInsRef.current?.setOption(pieChartOption);
                pieChartInsRef.current?.resize();
                // pieChartInsRef.current?.hideLoading();

                setLeftRuleData(data);
            }
        });
    }

    function renderLineChart() {
        // if (lineChartInsRef.current) {
        //     lineChartInsRef.current.showLoading();
        // }

        getWorksheetAutoSend({ provinceId: zoneId }).then((res) => {
            if (res?.success) {
                const data = res.data || [];
                const lineChartOption = getLineChartOption();
                lineChartOption.series[0].data = data.map((item) => item.weekAvgCount);
                lineChartOption.series[1].data = data.filter((item) => item.for24Count !== null).map((item) => item.for24Count);
                lineChartOption.xAxis.data = data.map((item) => item.timeHour);

                if (!lineChartInsRef.current) {
                    try {
                        lineChartInsRef.current = echarts.init(lineDomRef.current!);
                    } catch (e) {}
                }
                setCurLineChartTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
                lineChartInsRef.current?.setOption(lineChartOption);
                // lineChartInsRef.current?.hideLoading();
            }
        });
    }

    function renderLineBarChart() {
        // if (lineBarChartInsRef.current) {
        //     lineBarChartInsRef.current.showLoading();
        // }

        // const api = isGroupOrArea ? getWorksheetRuleProvince : getWorksheetRuleSend;

        getWorksheetRuleSend({ provinceId: zoneId }).then((res) => {
            if (res?.success) {
                const data = res.data || [];
                const lineBarChartOption = getLineBarChartOption();
                lineBarChartOption.series[0].data = data.map((item) => item.ruleCount);
                lineBarChartOption.series[1].data = data.map((item) => item.sendCount);

                if (isGroupOrArea) {
                    lineBarChartOption.xAxis.data = data.map((item) => {
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
                    lineBarChartOption.xAxis.axisLabel = {
                        rotate: 90,
                    };

                    lineBarChartOption.legend.data = ['派单规则数', '各省当日派单量'];
                    lineBarChartOption.series[1].name = '各省当日派单量';
                } else {
                    lineBarChartOption.xAxis.data = data.map((item) => item.professionalName);
                }
                if (!lineBarChartInsRef.current) {
                    lineBarChartInsRef.current = echarts.init(lineBarDomRef.current!);
                }
                setCurBarChartTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
                lineBarChartInsRef.current?.setOption(lineBarChartOption);
                // lineBarChartInsRef.current?.hideLoading();
            }
        });
    }

    return (
        <div className="auto-sheet-show-mode-top-content-wrapper">
            <div className="left-content-wraper">
                <div className="box-1">
                    <div className="pie-chart-dom" ref={pieDomRef}></div>
                    <div className="item-stats item-stats-1">
                        <span>
                            <em></em>
                            <span>跨专业</span>
                        </span>
                        <span className="num">{leftRuleData.crossSpecialtyTotalNum}</span>
                        <span>个</span>
                    </div>
                    <div className="item-stats item-stats-2">
                        <span>
                            <em></em>
                            <span>单专业</span>
                        </span>
                        <span className="num">{leftRuleData.singleSpecialtyTotalNum}</span>
                        <span>个</span>
                    </div>
                </div>
                <div className="box-2"></div>
                <div className="box-3">
                    <div className="section-1">
                        <div className="section-title">告警过滤</div>
                        <div className="item-box">
                            <img src={Icon4} alt="" />
                        </div>
                    </div>
                    <div className="section-2">
                        <div className="section-title">关联班组</div>
                        <div className="item-box">
                            <img src={Icon5} alt="" />
                            <span className="num">{leftRuleData.relationGroupNum}</span>
                            <span>个</span>
                        </div>
                    </div>
                    <div className="section-3">
                        <div className="section-title">设置派单动作</div>
                        <div className="item-box-wrapper">
                            <div className="item-box">
                                <img src={Icon6} alt="" />
                                <span>是否派单</span>
                            </div>
                            <div className="item-box">
                                <img src={Icon7} alt="" />
                                <span>派单日期</span>
                            </div>
                            <div className="item-box">
                                <img src={Icon8} alt="" />
                                <span>延期时间</span>
                            </div>
                            <div className="item-box">
                                <img src={Icon9} alt="" />
                                <span>故障类别</span>
                            </div>
                        </div>
                    </div>
                    <div className="section-4">
                        <div className="section-title">配置派单内容</div>
                        <div className="item-box-wrapper">
                            <div className="item-box">
                                <img src={Icon6} alt="" />
                                <span>告警详情</span>
                            </div>
                            <div className="item-box">
                                <img src={Icon7} alt="" />
                                <span>主送人</span>
                            </div>
                            <div className="item-box">
                                <img src={Icon8} alt="" />
                                <span>抄送人</span>
                            </div>
                            <div className="item-box">
                                <img src={Icon9} alt="" />
                                <span>短信发送人</span>
                            </div>
                            <div className="item-box">
                                <img src={Icon9} alt="" />
                                <span>工单标题</span>
                            </div>
                            <div className="item-box">
                                <img src={Icon9} alt="" />
                                <span>工单处理时限</span>
                            </div>
                        </div>
                        <div className="section-4-desc">
                            自定义配置字段 必填 <span>{leftRuleData.requiredFieldNum}</span> 个 非必填 <span>{leftRuleData.notRequiredFieldNum}</span>{' '}
                            个
                        </div>
                    </div>
                </div>
                <div className="box-4"></div>
                <div className="box-5">
                    <img src={Icon1} alt="" />
                    <div>当日派单总量</div>
                    <div>
                        <span>{dayStatics?.totalCount}</span>单
                    </div>
                </div>
                <div className="box-6"></div>
                <div className="box-7">
                    <div className="section section-1">
                        <img src={Icon2} alt="" />
                        <div>
                            <div>当日派单成功数</div>
                            <div>
                                <span>{dayStatics?.succCount}</span>单
                            </div>
                        </div>
                    </div>
                    <div className="section section-2">
                        <img src={Icon3} alt="" />
                        <div>
                            <div>当日派单失败数</div>
                            <div>
                                <span>{dayStatics?.failCount}</span>单
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right-content-wraper">
                <div className="right-content-top-wrapper">
                    <div className="content-title">
                        当日自动派单量统计图
                        <img src={Icon16} alt="" style={{ cursor: 'pointer' }} onClick={renderLineChart} />
                        <span>更新时间：{curLineChartTime} </span>
                    </div>
                    <div className="chart-wrapper">
                        <div ref={lineDomRef} style={{ width: '100%', height: '100%' }}></div>
                    </div>
                </div>

                <div className="right-content-bottom-wrapper">
                    <div className="content-title">
                        {isGroupOrArea ? '各省派单规则和当日派单量统计' : '各专业派单规则和当日派单量统计'}
                        <img src={Icon16} alt="" style={{ cursor: 'pointer' }} onClick={renderLineBarChart} />
                        <span>更新时间：{curBarChartTime} </span>
                    </div>
                    <div className="chart-wrapper">
                        <div ref={lineBarDomRef} style={{ width: '100%', height: '100%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
