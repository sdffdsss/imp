// import PropTypes from 'prop-types';
import ChartEnums from '@Components/oss-chart/chart-enums';
// import { createLayer } from '../layers-utils'; 这样导入不了,有毒啊~~~~
import { createLayer } from '../layers-utils/create-layer';
import { MapBaseLayer } from './base.js';

// 1.构建图层类
class CustomMapLayer extends MapBaseLayer {
    //#region chart option
    geo(ownerProps, currentOption) {
        if (Array.isArray(currentOption)) return currentOption;
        const superOption = super.geo(ownerProps, currentOption);
        return Object.assign({}, superOption, {
            name: ChartEnums.mapLayerTypes.pathmap.id,
        });
    }

    visualMap(ownerProps, currentOption) {
        return {
            type: 'continuous',
            show: true,
            inRange: {
                color: ['rgb(200,216,234)', 'rgb(46,107,177)'],
            },
            ...(ownerProps.visualMap || {}),
        };
    }

    _convertSeriesData = (ownerProps, extraConfig = {}) => {
        const originData = ownerProps.data;
        const data = [];
        if (originData && Array.isArray(originData)) {
            originData.forEach((item) => {
                data.push({
                    name: item.name,
                    value: item.value,
                    __originData__: item,
                });
            });
        }
        return data;
    };
    series(ownerProps, currentOption, extraConfig) {
        const geoOption = this.geo(ownerProps, currentOption.geo || {}) || {};

        const data = this._convertSeriesData(ownerProps, extraConfig);
        if (data.length === 0) return [];

        const seriesItemOption = {
            ...geoOption,
            name: 'pathmap',
            type: 'map',
            map: ownerProps.mapName,
            // coordinateSystem: 'geo',
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
            data,
        };

        return [seriesItemOption];
    }
    //#region
}

// 2.创建图层
const pathmap = createLayer(CustomMapLayer, ChartEnums.mapLayerTypes.pathmap, {
    defaultProps: {},
    propTypes: {},
});

// 3.导出图层
export { pathmap, CustomMapLayer as PathmapLayer };
