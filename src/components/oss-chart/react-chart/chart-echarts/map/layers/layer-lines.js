import PropTypes from 'prop-types';
import ChartEnums from '@Components/oss-chart/chart-enums';
// import { createLayer } from '../layers-utils'; // 这样导入不了,有毒啊~~~~
import { createLayer } from '../layers-utils/create-layer';
import { MapBaseLayer } from './base.js';

// 1.构建图层类
class CustomMapLayer extends MapBaseLayer {
    //#region chart option
    geo(ownerProps, currentOption) {
        if (Array.isArray(currentOption)) return currentOption;
        const superOption = super.geo(ownerProps, currentOption);
        return Object.assign({}, superOption, {
            name: ChartEnums.mapLayerTypes.lines.id,
        });
    }

    _convertSeriesData(originData, extraConfig = {}) {
        const data = [];
        const { coord } = extraConfig.mapConfig || {};
        if (originData && Array.isArray(originData) && coord) {
            originData.forEach((item) => {
                const source = coord.find((i) => i.name === item.source.name);
                const target = coord.find((i) => i.name === item.target.name);
                if (source && target) {
                    const newItem = {
                        coords: [source.cp, target.cp],
                        __originData__: item,
                    };
                    data.push(newItem);
                } else {
                    if (!source) {
                        console.error(`找不到 ${item.fromName} 的位置数据`);
                    }
                    if (!target) {
                        console.error(`找不到 ${item.toName} 的位置数据`);
                    }
                }
            });
        }
        return data;
    }
    _convertEffectScatterData(originData, extraConfig = {}) {
        const data = new Map();
        const { coord } = extraConfig.mapConfig || {};
        if (originData && Array.isArray(originData) && coord) {
            originData.forEach((item) => {
                const source = coord.find((d) => d.name === item.source.name);
                const target = coord.find((d) => d.name === item.target.name);
                if (source) {
                    if (!data.has(source.name)) {
                        data.set(source.name, {
                            name: source.name,
                            value: source.cp.concat(item.source.value || 1),
                            __originData__: item,
                        });
                    }
                } else {
                    console.error(`找不到 ${item.source.name} 的位置数据`);
                }

                if (target) {
                    if (!data.has(target.name)) {
                        data.set(target.name, {
                            name: target.name,
                            value: target.cp.concat(item.target.value || 1),
                            __originData__: item,
                        });
                    }
                } else {
                    console.error(`找不到 ${item.source.name} 的位置数据`);
                }
            });
        }
        return [...data.values()];
    }
    series(ownerProps, currentOption, extraConfig) {
        const series = [];
        const data = this._convertSeriesData(ownerProps.data, extraConfig);
        if (data.length === 0) return [];
        const seriesItemLinesOption = {
            name: 'map_lines',
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 3,
            tooltip: {
                formatter: (params = {}) => {
                    const data = params?.data?.__originData__ || {};
                    return `${data.source?.name}--->${data.target?.name}`;
                },
            },
            effect: {
                show: true,
                period: 4, //箭头指向速度，值越小速度越快
                trailLength: 0.001, //特效尾迹长度[0,1]值越大，尾迹越长重
                symbol: 'arrow', //箭头图标
                symbolSize: 14, //图标大小
            },
            lineStyle: {
                color: 'rgb(0,255,24)',
                width: 3, //线条宽度
                opacity: 1, //尾迹线条透明度
                curveness: 0.3, //尾迹线条曲直度
            },
            emphasis: {
                lineStyle: {
                    color: '#66CC00',
                    width: 2,
                    opacity: 0.9,
                    curveness: 0.3,
                },
            },
            data,
        };
        series.push(seriesItemLinesOption);
        // add scatter option
        if (ownerProps.showScatter) {
            series.push({
                name: 'map_scatter',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 3,
                tooltip: {
                    show: false,
                },
                showEffectOn: 'render',
                hoverAnimation: true,
                rippleEffect: {
                    brushType: 'stroke',
                    scale: 4,
                },
                itemStyle: {
                    color: 'rgb(0,255,24)',
                },
                symbol: 'circle',
                symbolSize: 10,
                data: this._convertEffectScatterData(ownerProps.data, extraConfig),
            });
        }
        return series;
    }
    //#region
}

// 2.创建图层
const lines = createLayer(CustomMapLayer, ChartEnums.mapLayerTypes.lines, {
    defaultProps: {
        showScatter: true,
    },
    propTypes: {
        showScatter: PropTypes.bool,
    },
});

// 3.导出图层
export { lines, CustomMapLayer as MapLinesLayer };
