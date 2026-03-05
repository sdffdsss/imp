import PropTypes from 'prop-types';
import ChartEnums from '@Components/oss-chart/chart-enums';

import { createLayer } from '../layers-utils/create-layer';
import { MapBaseLayer } from './base.js';

// 1.构建图层类
class CustomMapLayer extends MapBaseLayer {
    //#region chart option

    visualMap(ownerProps, currentOption) {
        return {
            show: true,
            bottom: 10,
            left: 330,
            inRange: {
                color: ['rgb(222,22,38)', 'rgb(255,218,0)', 'rgb(12,182,56)'],
            },
            min: 0,
            max: 500,
            itemWidth: 10,
            calculable: true,
            textStyle: {
                color: '#fff',
                fontSize: 12,
            },
            ...(ownerProps.visualMap || {}),
        };
    }

    geo(ownerProps, currentOption) {
        if (Array.isArray(currentOption)) return currentOption;
        const superOption = super.geo(ownerProps, currentOption);
        return Object.assign({}, superOption, {
            name: ChartEnums.mapLayerTypes.heatmap.id,
            silent: true,
        });
    }

    _convertSeriesData = (originData, extraConfig = {}) => {
        const data = [];
        const { coord } = extraConfig.mapConfig || {};
        if (originData && Array.isArray(originData) && coord) {
            originData.forEach((item) => {
                const coordItem = coord.find((i) => i.name.indexOf(item.name) !== -1);
                if (coordItem && !isNaN(item.value)) {
                    data.push({
                        name: item.name,
                        value: coordItem.cp.concat(item.value),
                        __originData__: item,
                    });
                } else {
                    if (Array.isArray(item.value)) {
                        data.push(item);
                    }
                }
            });
        }
        return data;
    };
    series(ownerProps, currentOption, extraConfig) {
        const data = this._convertSeriesData(ownerProps.data, extraConfig);
        if (data.length === 0) return [];

        return [
            {
                name: 'map_heatmap',
                type: 'heatmap',
                coordinateSystem: 'geo',
                blurSize: 20,
                zlevel: 1,
                data,
            },
        ];
    }
    //#region
}

// 2.创建图层
const heatmap = createLayer(CustomMapLayer, ChartEnums.mapLayerTypes.heatmap, {
    defaultProps: {
        visualMap: {},
    },
    propTypes: {
        visualMap: PropTypes.object,
    },
});

// 3.导出图层
export { heatmap, CustomMapLayer as MapHeatmapLayer };
