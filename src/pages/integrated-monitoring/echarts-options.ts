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
            text: '1026个',
            textStyle: { color: 'rgb(24, 144, 255)', fontSize: 32 },
            // subtextStyle: { color: 'rgb(51, 51, 51)', fontSize: 36, fontWeight: 'bold' },
            // subtext: '',
            left: 'center',
            top: '40%',
        },
        color: ['rgb(255, 160, 67)', 'rgb(51, 106, 255)'],
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['70%', '90%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                labelLine: {
                    show: false,
                },
                label: { show: false },
                data: [
                    { value: 1048, name: '跨专业' },
                    { value: 735, name: '单专业' },
                ],
            },
        ],
    };
}

export function getLineChartOption() {
    return {
        title: {
            show: false,
            text: 'Stacked Line',
        },
        tooltip: {
            trigger: 'axis',
            // formatter: '{c0}<br />{c1}',
            formatter: function (params) {
                return params.reduce((accu, item, index) => {
                    let str = index > 0 ? `<br />${item.data}` : item.data;

                    return accu + str;
                }, '');
            },
            textStyle: {
                color: 'rgb(51, 119, 255)',
            },
        },
        legend: {
            itemWidth: 8,
            itemHeight: 8,
            // itemStyle:{

            // },
            data: ['近一周平均派单量', '近24小时派单量'],
        },
        color: ['rgb(51, 106, 255)', 'rgb(255, 160, 67)'],
        grid: {
            left: '3%',
            right: '6%',
            top: 40,
            bottom: '3%',
            containLabel: true,
        },
        xAxis: {
            name: '时',
            type: 'category',
            boundaryGap: false,
            axisTick: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 0, 0, 0.45)',
                },
            },
            data: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22'],
        },
        yAxis: {
            type: 'value',
            name: '单位：单',
            splitNumber: 2,
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    dashOffset: 30,
                },
                show: true,
            },
            nameTextStyle: {
                padding: [0, 0, 0, 20],
            },
        },
        series: [
            {
                name: '近一周平均派单量',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                lineStyle: {
                    width: 3,
                },
                data: [120, 132, 101, 134, 90, 230, 210, 220, 182, 191, 234, 290, 330, 310],
            },
            {
                name: '近24小时派单量',
                type: 'line',
                symbol: 'circle',
                smooth: true,
                lineStyle: {
                    width: 3,
                },
                data: [220, 182, 191, 234, 290, 330, 310, 120, 132, 101, 134, 90, 230, 210],
            },
        ],
    };
}

export function getBarChartOption() {
    return {
        tooltip: {
            trigger: 'axis',
            formatter: '{c0}',
            textStyle: {
                color: 'rgb(51, 119, 255)',
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            top: 40,
            bottom: '3%',
            containLabel: true,
        },
        color: ['rgb(51, 106, 255)', 'rgb(255, 160, 67)'],
        // legend: {
        //     itemWidth: 8,
        //     itemHeight: 8,
        //     icon: 'circle',
        //     data: ['派单规则数', '各省当日派单量'],
        // },
        xAxis: {
            type: 'category',
            data: ['小区退服', '基站退服', ' LT脱网', '业务中断 ', '市电停电 ', '光缆中断'],
            // boundaryGap: false,
            axisTick: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 0, 0, 0.45)',
                },
            },
        },
        yAxis: [
            {
                type: 'value',
                name: '单位：%',
                splitNumber: 2,
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        dashOffset: 30,
                    },
                    show: true,
                },
                nameTextStyle: {
                    padding: [0, 0, 0, 20],
                },
            },
        ],
        series: [
            {
                name: '派单规则数',
                type: 'bar',
                barMaxWidth: 12,
                itemStyle: {
                    borderRadius: 6,
                },
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            },
        ],
    };
}
