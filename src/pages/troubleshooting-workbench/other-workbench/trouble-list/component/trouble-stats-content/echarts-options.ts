import Picture from './images';

// const xAxisData = ['无线', '传输', '核心', '固网', '动环', '接入', '数据', '增值', '其他'];
export const handiworkDispatch = (data: any) => {
    const xAxisData = data.map((el) => el.name);
    const leftData = data.map((el) => el.todoValue);
    const rightData = data.map((el) => el.autoValue);
    const leftMax = Math.max(...leftData);
    const rightMax = Math.max(...rightData);
    return {
        legend: {
            type: 'plain',
            show: true,
            right: '15%',
            top: '2%',
            icon: 'rect',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                color: 'rgb(170, 182, 205)',
                fontSize: 12,
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
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisTick: {
                show: false,
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgb(170, 182, 205)',
                    width: 2,
                },
            },
            axisLabel: {
                show: true,
                color: 'rgb(170, 182, 205)',
                fontSize: 13,
                interval: 0,
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(0,0,0,0.05)',
                    width: 0.8,
                    type: 'dashed',
                },
            },
        },
        yAxis: [
            {
                name: '告警:个',
                nameTextStyle: {
                    color: 'rgb(170, 182, 205)',
                    padding: [0, 0, 0, 0],
                    lineHeight: 5,
                    fontSize: 12,
                },

                type: 'value',
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false, // 横向虚线
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
                max: leftMax,
                interval: Math.ceil(leftMax / 4),
            },
            {
                name: '工单:单',
                nameTextStyle: {
                    color: 'rgb(170, 182, 205)',
                    padding: [0, 0, 0, 0],
                    lineHeight: 5,
                    fontSize: 12,
                },
                type: 'value',
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
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
                max: rightMax,
                interval: Math.ceil(rightMax / 4),
            },
        ],
        series: [
            {
                name: '待手工派单',
                data: leftData,
                type: 'bar',
                itemStyle: {
                    normal: {
                        label: {
                            show: false,
                        },
                        barBorderRadius: 30,
                        borderWidth: 0,
                        color: 'rgb(51, 119, 255)',
                    },
                },
                barWidth: 10,
                yAxisIndex: 0,
            },
            {
                type: 'bar',
                name: '自动调度故障',
                data: rightData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false,
                        },
                        barBorderRadius: 30,
                        borderWidth: 2,
                        color: 'rgb(121, 210, 222)',
                    },
                },
                barWidth: 10,
                yAxisIndex: 1,
            },
        ],
    };
};
// const data = [200, 250, 350, 300];
// const dataName = ['超30min未受理', '超1h未受理', '超2h未受理', '超4h未归档'];
export const timeoutFault = (data: number[], dataName: string[]) => {
    const maxData = data.map(() => Math.max(...data));

    return {
        xAxis: {
            show: false,
        },
        grid: {
            show: false,
            top: '8%',
            bottom: '5%',
            left: '5%',
            right: '5%',
        },
        yAxis: [
            {
                axisTick: 'none',
                axisLine: 'none',
                inverse: true,
                offset: '5',
                axisLabel: {
                    inside: true,
                    textStyle: {
                        color: '#000',
                        fontSize: 12,
                        verticalAlign: 'bottom',
                        align: 'left',
                        padding: [0, 0, 10, 0],
                    },
                    formatter: (value) => {
                        return `{warnValue|} {value|${value}}`;
                    },
                    rich: {
                        warnValue: {
                            height: 20,
                            width: 20,
                            align: 'left',
                            backgroundColor: {
                                image: Picture.prefix,
                            },
                        },
                        value: {
                            color: '000',
                            fontSize: 12,
                        },
                    },
                },
                data: dataName,
            },
            {
                axisTick: 'none',
                axisLine: 'none',
                inverse: true,
                axisLabel: {
                    inside: true,
                    textStyle: {
                        color: '#000',
                        fontSize: 14,
                        padding: [10, 0, 40, 10],
                        align: 'right',
                    },
                    formatter: (value) => {
                        return `{value|${value}单}`;
                    },
                    rich: {
                        value: {
                            align: 'right',
                            color: '#000',
                            fontSize: 14,
                        },
                    },
                },
                data,
            },
            {
                axisLine: {
                    lineStyle: {
                        color: 'rgba(0,0,0,0)',
                    },
                },
                data: [],
            },
        ],

        series: [
            {
                name: '条',
                type: 'bar',
                stack: '圆',
                yAxisIndex: 0,
                data,
                barWidth: 8,
                itemStyle: {
                    normal: {
                        color: '#79D2DE',
                    },
                },
                z: 2,
            },
            {
                type: 'pictorialBar',
                symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAyNJREFUOI3Vlc+KXEUUxr9zzq17+1+a7pYEIiM0TZCgSBYXXLiSvICryUofQFd5g5gn0OfILHyDIAhZCFcIgUFkaIY4EHGku53pnu57655zXPTfce3G2lRx6vt+9VEUp8jd6cnJCY9HU76XP2bFOKlmNwEhbVQ1tSWJbSXKAEDcS63DIk18gVit0l4rCkb1n8VLG4379uL42BIAwDGQI8cbXHJvoqJpDCKNRkLefRoeffYBdx4CwO82//V7On0FZlWPKhO12eDS8jy3aT4GAAh9S3yJb+ivs9cSYpQyNJJFUmYQ6jD4va/Th19+zL2v3ufWpw1O6h/s7S+RtVy5R7autv5e+vUfc08HX9gpnoMB4BI/Eh4AFaeUccltkkRizMy0XUFTbEYFTc20LTFmbZIk45IrTgkPNgxgDQSA5XmTunRFJUWuKTBRSxiSGiBbjQHCkJSoJTUFLilyl65oed6krYaBZ7gufiMMgciBlIRqKCtcYC4O7MQOEMxF4VJDWUkociAMsWbg2T4hMAQGQBNCKTEJEbk6u/keaE6uzkJEKTE1IYTBxrtPCOR5jvLiHcXp/CCNEgsRYLsaYMRC5NBdLU7nVF68ozzP90AAONrMSiuyFa8NckuyXm9u1FZMSis69P5b/Z+M/xHwYjOLN5wb5gAABQA7kNumBnDDXLzhh94dsCgKZEf3PfQ7vt0giJu6A+wHcjd1J8iuFvodz47ue1EUtxMC58AEWEK9cnN1dxIyYtofwuQkZOrulZsvoY7JxrtP+Bx38g8d50Cw6OLqCcQEpGBSAg5Sw8GkAtIEYuLqwaLjHGvGtjkAQHO49CvveubBEo/mfqMGrXh3awADatDK/UYTj5Z5sCvvenO49AMNcBefO86A1CovLbOFa60hlMyySCHVVpxCKmZZaAjlwrUuLbPUKsfZhgGA3J2e4IT7GPEbVElvMgvzdJ5Jcqdt5v2n4aPbDTaevmKmqdbXi07VKWeDXvwEaT3F2F5g27FPgGJU4F7+2HRwrTILEWSruqar7/z1T0r08/pJbb8AW0kdog5Ee7hrRfESo3EfOAb+AaEjriz/O+BxAAAAAElFTkSuQmCC',
                symbolSize: [20, 15],
                symbolPosition: 'end',
                z: 12,
                itemStyle: {
                    normal: {
                        color: '#fff',
                    },
                },
                data: data.map((el) => {
                    // 图像需要偏移，由于symbol有宽度，导致数据为0的时候和不为0时展示的不一样
                    return { value: el, symbolOffset: el === 0 ? [-10, 0] : [10, 0] };
                }),
            },
            {
                name: '背景',
                type: 'bar',
                barWidth: 8,
                barGap: '-100%',
                data: maxData,
                itemStyle: {
                    normal: {
                        color: 'rgba(28, 128, 213, 0.19)',
                    },
                },
            },
        ],
    };
};
