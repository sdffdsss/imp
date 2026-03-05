import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
type EChartsOption = echarts.EChartsOption;

const PoressChart = ({ id = 'content', sumCount = 0, alarmData = [] }: { id: any; sumCount: number; alarmData: any }) => {
    const contentRef: any = useRef();
    useEffect(() => {
        const contentId: any = document.getElementById(id);
        contentRef.current = echarts.init(contentId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (contentRef.current) {
            const fontSize = sumCount / 1000000 > 1 ? 24 : 30;
            const option: EChartsOption = {
                tooltip: {
                    show: false,
                },
                legend: {
                    show: false,
                },
                color: ['#FF6868', '#FFA044', '#3377FF', '#87EA85'],
                graphic: {
                    elements: [
                        {
                            type: 'text',
                            left: 'center',
                            top: '35%',
                            style: {
                                text: '总告警量',
                                //   textAlign: "center",
                                fill: '#8E9297',
                                fontSize: 16,
                            },
                        },
                        {
                            type: 'text',
                            left: 'center',
                            top: '50%',
                            style: {
                                text: `${sumCount}`,
                                //   textAlign: "center",
                                fill: '#333',
                                fontSize: fontSize,
                                fontWeight: 700,
                            },
                        },
                    ],
                },
                series: [
                    {
                        selectedMode: false,
                        name: 'Access From',
                        type: 'pie',
                        radius: ['80%', '100%'],
                        avoidLabelOverlap: false,
                        legendHoverLink: false,
                        emphasis: {
                            disabled: true,
                        },
                        labelLine: {
                            show: false,
                        },
                        label: {
                            show: false,
                        },
                        data: alarmData,
                    },
                ],
            };

            option && contentRef.current.setOption(option);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alarmData]);
    return <div id={id} style={{ width: '100%', height: '100%' }} />;
};
export default PoressChart;
