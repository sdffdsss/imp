import PropTypes from 'prop-types';
import ChartEnums from '@Components/oss-chart/chart-enums';
// import { createLayer } from '../layers-utils'; 这样导入不了,有毒啊~~~~
import { createLayer } from '../layers-utils/create-layer';
import { MapBaseLayer } from './base.js';

// 1.构建图层类
const VERTICAL_SCATTER = 'verticalScatter';
const EXTRA_SCATTER_TYPE = [VERTICAL_SCATTER];
class CustomMapLayer extends MapBaseLayer {
    //#region chart option
    geo(ownerProps, currentOption) {
        if (Array.isArray(currentOption)) return currentOption;
        const superOption = super.geo(ownerProps, currentOption);
        return Object.assign({}, superOption, {
            name: ChartEnums.mapLayerTypes.scatter.id,
        });
    }
    _convertSeriesData = (ownerProps, extraConfig = {}) => {
        const originData = ownerProps.data;
        const data = [];
        const { coord } = extraConfig.mapConfig || {};
        if (originData && Array.isArray(originData) && coord) {
            originData.forEach((item) => {
                // props中的data为格式化好的[经度,纬度,值],直接用
                if (Array.isArray(item.value) && item.value.length === 3 && item.value.slice(0, 2).every((item) => typeof item === 'number')) {
                    data.push({
                        ...item,
                        __originData__: item,
                    });

                    return;
                }

                const coordObj = coord.find((d) => d.name === item.name);
                let itemValue = item.value;
                // 上下结构的scatter
                if (EXTRA_SCATTER_TYPE.includes(ownerProps.scatterType)) {
                    itemValue = item.value[2];
                }
                if (coordObj) {
                    data.push({
                        ...item,
                        value: [...coordObj.cp, itemValue],
                        __originData__: item,
                    });
                }
            });
        }
        return data;
    };
    _buildVerticalScatterOptionByLabel = (ownerProps) => {
        const option = {};
        if (ownerProps.scatterType === VERTICAL_SCATTER) {
            const labelRichOption = {
                width: 50,
                height: 25,
                lineHeight: 25,
                fontSize: 18,
                align: 'center',
            };
            Object.assign(option, {
                itemStyle: {
                    color: 'rgba(255, 255, 255, 0)',
                },
                label: {
                    show: true,
                    verticalAlign: 'bottom',
                    position: 'top',
                    formatter: (params) => {
                        const originValues = params.data?.__originData__?.value;
                        return `{top|${originValues[0]}}\n{bottom|${originValues[1]}}`;
                    },
                    rich: {
                        top: {
                            ...labelRichOption,
                            color: 'rgb(255, 255, 255)',
                            backgroundColor: 'rgb(9, 126, 35)',
                            borderRadius: [25, 25, 0, 0],
                        },
                        bottom: {
                            ...labelRichOption,
                            color: 'rgb(128, 177, 251)',
                            backgroundColor: 'rgb(37, 61, 97)',
                            borderRadius: [0, 0, 25, 25],
                        },
                    },
                },
            });
        }
        return option;
    };
    // _buildHorizonScatterOptionByLabel = (ownerProps) => {
    //     const option = {};
    //     if (ownerProps.scatterType === HORIZON_SCATTER) {
    //         Object.assign(option, {});
    //     }
    //     return option;
    // };
    series(ownerProps, currentOption, extraConfig) {
        const data = this._convertSeriesData(ownerProps, extraConfig);
        if (data.length === 0) return [];

        const seriesItemOption = {
            name: 'scatter',
            type: ownerProps.scatterType,
            coordinateSystem: 'geo',
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke',
                scale: 4,
            },
            hoverAnimation: true,
            tooltip: {
                formatter: (parmas) => {
                    return `${parmas.name}:${parmas.value?.[2] || ''}`;
                },
            },
            itemStyle: {
                color: 'rgb(0,255,24)',
            },
            symbol: 'circle',
            symbolSize: 16,
            zlevel: 3,
            data,
        };

        if (EXTRA_SCATTER_TYPE.includes(ownerProps.scatterType)) {
            const labelOption = {};
            // 垂直
            Object.assign(labelOption, this._buildVerticalScatterOptionByLabel(ownerProps));
            // 合并Option
            Object.assign(seriesItemOption, {
                type: 'scatter',
                ...labelOption,
            });
        }
        return [seriesItemOption];
    }
    //#region
}

// 2.创建图层
const scatter = createLayer(CustomMapLayer, ChartEnums.mapLayerTypes.scatter, {
    defaultProps: {
        scatterType: 'scatter', // scatterType类型配置
    },
    propTypes: {
        scatterType: PropTypes.oneOf(['scatter', 'effectScatter', ...EXTRA_SCATTER_TYPE]),
    },
});

// 3.导出图层
export { scatter, CustomMapLayer as MapScatterLayer };
