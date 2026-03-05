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
            text: '规则总数',
            textStyle: { color: 'rgba(0, 0, 0, 0.65)', fontSize: 16 },
            subtextStyle: { color: 'rgb(51, 51, 51)', fontSize: 36, fontWeight: 'bold' },
            subtext: '',
            left: 'center',
            top: 55,
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
            formatter: (params) => {
                return params.reduce((accu, item, index) => {
                    return `${accu}${index == 0 ? '' : '<br />'}${item.data}`;
                }, '');
            },
            textStyle: {
                color: 'rgb(51, 119, 255)',
            },
        },
        legend: {
            itemWidth: 8,
            itemHeight: 8,
            data: ['上周平均自动派单量', '当日自动派单量'],
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
            nameTextStyle: {
                padding: [0, 0, 0, 25],
            },
            splitNumber: 2,
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    dashOffset: 30,
                },
                show: true,
            },
            // min: 'dataMin',
        },
        series: [
            {
                name: '上周平均自动派单量',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                data: [120, 132, 101, 134, 90, 230, 210],
            },
            {
                name: '当日自动派单量',
                type: 'line',
                symbol: 'circle',
                smooth: true,
                data: [220, 182, 191, 234, 290, 330, 310],
            },
        ],
    };
}

export function getLineBarChartOption() {
    return {
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                return params.reduce((accu, item, index) => {
                    let str = index > 0 ? `<br />${item.data}` : item.data;

                    return accu + str;
                }, '');
            },
            // formatter: '{c0}<br />{c1}',
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
        legend: {
            itemWidth: 8,
            itemHeight: 8,
            icon: 'circle',
            data: ['派单规则数', '当日派单量'],
        },
        xAxis: {
            type: 'category',
            data: [],
            boundaryGap: false,
            axisTick: {
                show: false,
            },
            axisLabel: {
                rotate: 45,
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
                name: '单位：个',
                splitNumber: 2,
                nameTextStyle: {
                    padding: [0, 0, 0, 25],
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        dashOffset: 30,
                    },
                    show: true,
                },
            },
            {
                type: 'value',
                name: '单位：单',
                splitNumber: 2,
                nameTextStyle: {
                    padding: [0, 25, 0, 0],
                },
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
                name: '派单规则数',
                type: 'bar',
                barMaxWidth: 12,
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            },
            {
                name: '当日派单量',
                type: 'line',
                symbol: 'circle',
                yAxisIndex: 1,
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
            },
        ],
    };
}
