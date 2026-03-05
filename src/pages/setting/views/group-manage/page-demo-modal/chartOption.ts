export const getPieChartOption = (data: any) => {
    return {
        title: {
            text: `{a|值班班组}\n{b|${data.allGroupCount}}{c|  个}`,
            x: 'center',
            y: 'center',
            textStyle: {
                rich: {
                    a: {
                        fontSize: 16,
                        lineHeight: 40,
                    },
                    b: {
                        fontSize: 32,
                        fontWeight: 700,
                        color: '#1890FF',
                    },
                    c: {
                        fontSize: 14,
                    },
                },
            },
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            show: false,
        },
        series: [
            {
                name: '值班班组',
                type: 'pie',
                radius: ['60%', '80%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 50,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                label: {
                    show: false,
                },
                labelLine: {
                    show: false,
                },
                data: [
                    { value: data.jkGroupCount, name: '监控班组', itemStyle: { color: '#3336FF' } },
                    { value: data.ddGroupCount, name: '调度班组', itemStyle: { color: '#FFA043' } },
                ],
            },
        ],
    };
};
export const getBarChartOption = (data: any) => {
    const xAxisData = data.map((el) => el?.groupName);
    const seriesData = data.map((el) => el?.userCount);
    return {
        xAxis: {
            type: 'category',
            data: xAxisData,

            axisLabel: {
                show: true,
                color: 'rgba(0, 0, 0,0.45)',
                fontSize: 13,
                interval: 0,
                width: 78,
                overflow: 'truncate',
                ellipsis: '...',
            },
            axisTick: {
                show: false,
            },
        },
        tooltip: {
            show: true,
        },
        grid: {
            show: false,
            top: 35,
            bottom: '15%',
            left: '8%',
            right: '8%',
        },
        yAxis: {
            name: '单位: 人',
            type: 'value',
            splitLine: {
                show: true, // 横向虚线
                lineStyle: {
                    color: 'rgba(0,0,0,0.1)',
                    width: 0.8,
                    type: 'dashed',
                },
            },
            axisLine: {
                show: true,
                onZero: true,
                lineStyle: {
                    color: 'rgb(170, 182, 205)',
                    width: 2,
                },
            },
            axisLabel: {
                show: true,
                color: 'rgb(170, 182, 205)',
            },

            minInterval: 1,
        },
        series: [
            {
                type: 'bar',
                data: seriesData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false,
                        },
                        barBorderRadius: 30,
                        borderWidth: 2,
                        color: '#1890FF',
                    },
                },
                barWidth: 15,
            },
        ],
    };
};
