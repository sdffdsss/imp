import { loadLocalGeoJson } from '../layers-utils';

// 抽象的图层
class AbstractLayer {
    geo(ownerProps, currentOption) {
        throw new Error('abstract class');
    }
    visualMap(ownerProps, currentOption) {
        throw new Error('abstract class');
    }
    series(ownerProps, currentOption) {
        throw new Error('abstract class');
    }
    tooltip(ownerProps, currentOption) {
        throw new Error('abstract class');
    }
}

// 基础图层
class MapBaseLayer extends AbstractLayer {
    loadConfig(ownerProps) {
        return Promise.resolve();
    }

    loadMapGeoJson(ownerProps, mapConfig) {
        const { mapName, mapLevel } = ownerProps;
        return loadLocalGeoJson({ mapName, mapLevel, ...mapConfig });
    }

    geo(ownerProps, currentOption) {
        if (Array.isArray(currentOption)) return currentOption;
        return Object.assign({}, currentOption || {}, {
            zoom: ownerProps.zoom,
            map: ownerProps.mapName,
            zlevel: 1,
            selectedMode: ownerProps.selectedMode,
            silent: false,
            itemStyle: {
                areaColor: 'rgb(7,17,50)', //省市区块颜色
                borderColor: 'rgb(9,191,224)', //省市边界线00fcff 516a89
                borderWidth: 2, //设置外层边框
                shadowBlur: 1,
                shadowOffsetY: 1,
                shadowOffsetX: 0,
                shadowColor: '#01012a',
            },
            label: {
                show: true,
                color: '#1ADDDF',
                fontFamily: 'Microsoft YaHei',
                fontSize: 18,
            },
            emphasis: {
                itemStyle: {
                    areaColor: '#0B0B61', //悬浮背景
                },
                label: {
                    color: '#1ADDDF',
                },
            },
            show: true,
        });
    }

    tooltip(ownerProps, currentOption) {
        return currentOption || {};
    }

    visualMap(ownerProps, currentOption) {
        return [];
    }

    series(ownerProps, currentOption) {
        return currentOption;
    }
}

export { AbstractLayer, MapBaseLayer };
