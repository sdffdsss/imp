/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
type EChartsOption = echarts.EChartsOption;

const PoressChart = ({ sumCount = 0, alarmData = [], theme }: { sumCount: number; alarmData: any; theme: string }) => {
    const chartRef: any = useRef(); //拿到DOM容器
    const chart: any = useRef();
    const fontSize = sumCount / 1000000 > 1 ? 24 : 30;
    const option: EChartsOption = {
        // tooltip: {
        //     show: false,
        // },
        tooltip: {
            trigger: 'item',
            backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(51,58,81,0.9)',
            borderColor: theme === 'light' ? '#fff' : 'rgba(94,121,145,0.22)',
            textStyle: {
                color: theme === 'light' ? '#333' : '#fff',
            },
        },
        legend: {
            show: false,
        },

        graphic: {
            elements: [
                {
                    type: 'text',
                    left: 'center',
                    top: '35%',
                    style: {
                        text: '总故障',
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
                        fill: theme === 'light' ? '#333' : '#fff',
                        fontSize: fontSize,
                        fontWeight: 700,
                    },
                },
            ],
        },
        series: [
            {
                // selectedMode: false,
                // selectedOffset: 3,
                // name: 'Access From',
                type: 'pie',
                radius: ['58%', '75%'],
                avoidLabelOverlap: false,
                legendHoverLink: true,
                emptyCircleStyle: {
                    color: '#3377ff',
                },
                // emphasis: {
                //     disabled: true,
                // },
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

    useEffect(() => {
        chart.current = echarts.init(chartRef.current);
        chart.current.setOption(option);
    }, []);
    useEffect(() => {
        chart.current.setOption(option);
    }, [option]);
    return (
        <div
            ref={chartRef}
            style={{
                width: '160px',
                height: '160px',
            }}
        />
    );
};
export default PoressChart;
