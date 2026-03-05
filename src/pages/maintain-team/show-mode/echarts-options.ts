export function getPieChartOption() {
    return {
        tooltip: {
            show: false,
            formatter: '{b}: {c}',
        },
        legend: {
            show: false,
        },
        title: {
            text: '班组总数',
            textStyle: { color: 'rgba(0, 0, 0, 0.65)', fontSize: 16, formatter: 'sdfdf' },
            subtextStyle: { color: 'rgb(51, 51, 51)', fontSize: 36, fontWeight: 'bold' },
            subtext: '',
            left: 'center',
            top: '35%',
            // itemGap: 10,
        },
        color: ['rgb(255, 160, 67)', 'rgb(51, 106, 255)'],
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['100%', '120%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 20,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                labelLine: {
                    show: false,
                },
                data: [
                    {
                        value: 0,
                        name: '包机班组',
                        label: {
                            formatter: '{circle|}  {b}   {color|{c}}   个',
                            borderWidth: 1,
                            borderColor: 'rgba(150,150,150,0.1)',
                            shadowColor: '#ddd',
                            shadowBlur: 7,
                            backgroundColor: '#fff',
                            padding: 10,
                            rich: {
                                color: {
                                    color: '#3377ff',
                                },
                                circle: {
                                    backgroundColor: 'rgb(255, 160, 67)',
                                    height: 8,
                                    width: 8,
                                    borderRadius: 8,
                                },
                            },
                        },
                    },
                    {
                        value: 0,
                        name: '值班班组',
                        label: {
                            formatter: '{arc|}  {b}   {color|{c}}   个',
                            borderWidth: 1,
                            borderColor: 'rgba(150,150,150,0.1)',
                            shadowColor: '#ddd',
                            shadowBlur: 7,
                            backgroundColor: '#fff',
                            padding: 10,
                            rich: {
                                color: {
                                    color: '#3377ff',
                                },
                                arc: {
                                    backgroundColor: 'rgb(51, 106, 255)',
                                    height: 8,
                                    width: 8,
                                    borderRadius: 8,
                                },
                            },
                        },
                    },
                ],
                top: 40,
                bottom: 40,
            },
        ],
    };
}

export function getBarStackChartOption() {
    return {
        tooltip: {
            trigger: 'axis',
            // formatter: '{c1}<br />{c0}',
            textStyle: {
                color: 'rgb(51, 119, 255)',
            },
        },
        legend: {
            itemWidth: 8,
            itemHeight: 8,
            borderRadius: 8,
            icon: 'circle',
            itemStyle: {
                borderCap: 'round',
            },
            textStyle: {
                color: 'rgba(0, 0, 0, 0.45)',
            },
        },
        color: ['rgb(51, 106, 255)', 'rgb(255, 160, 67)'],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisLabel: {
                    rotate: 45,
                },
                axisTick: {
                    show: false,
                },
            },
        ],
        yAxis: [
            {
                type: 'value',
                name: '单位：个',
                splitNumber: 2,
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        dashOffset: 30,
                    },
                    show: true,
                },
            },
        ],
        series: [
            {
                name: '包机班组数量',
                type: 'bar',
                barWidth: 12,
                stack: 'team',
                itemStyle: {
                    borderRadius: [0, 0, 6, 6],
                },
                data: [],
            },
            {
                name: '值班班组数量',
                type: 'bar',
                stack: 'team',
                barWidth: 12,
                itemStyle: {
                    borderRadius: [6, 6, 0, 0],
                },
                data: [],
            },
        ],
    };
}
