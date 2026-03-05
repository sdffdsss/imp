import proxy from '@Common/api';
import constants from '@Common/constants';
import ChartEnums from '@Components/oss-chart/chart-enums';
import { MapBaseLayer, AbstractLayer } from '../layers';

/************** register map layer  start ******************/
const MAP_LAYERS = new Map();
/**
 * registerMapLayer
 * @param {*} layerType 图层类型
 * @param {*} customLayer 自定义图层实例
 */
function registerMapLayer(layerType, customLayer) {
    if (!(customLayer instanceof AbstractLayer)) {
        throw Error('customLayer must be an instance of AbstractLayer');
    }
    const layerTypeEnum = ChartEnums.mapLayerTypes.get(layerType);
    if (layerTypeEnum) {
        MAP_LAYERS.set(layerTypeEnum.id, customLayer);
    } else {
        console.error(`请在chart-enums中添加图层${layerType}枚举`);
    }
}

const _mapBaseLayer = new MapBaseLayer();
/**
 * 多图层组合,还是要声明不同的类型
 * 所以要把各种图层类export 出去,以便组合使用
 * @param {*} layerType
 */
function getMapLayer(layerType) {
    if (layerType) {
        const layerTypeId = ChartEnums.mapLayerTypes.get(layerType)?.id;

        if (layerTypeId !== undefined && !MAP_LAYERS.has(layerTypeId)) {
            throw new Error(`地图图层未注册`, layerType);
        }

        if (MAP_LAYERS.has(layerTypeId)) {
            return MAP_LAYERS.get(layerTypeId);
        }
    }

    return _mapBaseLayer;
}

/**
 * loadLocalGeoJson 获取本地geoJson的方法
 * TODO:这块使用的 constants, proxy 是否足够自由？？
 * @param {*} option.mapName
 * @param {*} option.mapLevel
 * @param {*} option.adcodeList
 * @param {*} option.mappath
 */
function loadLocalGeoJson(option = {}) {
    const { mapName, mapLevel, adcodeList, mappath } = option;
    let fullUrl = undefined;
    const mapLevelEnum = ChartEnums.mapLayerLevelTypes.get(mapLevel);
    const baseUrl = `${constants.STATIC_PATH}/map`;
    if (mapLevel && mapName && adcodeList && mappath) {
        if (mapLevelEnum === ChartEnums.mapLayerLevelTypes.city) {
            const adcodeObj = adcodeList.find((i) => i.NAME.indexOf(mapName) !== -1);
            if (adcodeObj) {
                fullUrl = `${baseUrl}/citys/${adcodeObj.ADCODE}.json`;
            }
        } else if (mapLevelEnum === ChartEnums.mapLayerLevelTypes.province) {
            const name = mappath.pathConfig[mapName];
            if (name) {
                fullUrl = `${baseUrl}/province/${name}.json`;
            }
        } else {
            fullUrl = `${baseUrl}/china.json`;
        }
    }

    // 没有加取消请求的方法
    return new Promise((resolve, reject) => {
        if (fullUrl) {
            proxy
                .loadJSON({ fullUrl, type: 'get' })
                .then((geoJson) => resolve(geoJson))
                .catch((error) => {
                    reject(`初始化地图，加载地图组件异常: ${mapName}`, error);
                });
        } else {
            console.error(`初始化地图，加载地图组件异常: ${mapName}`);
            reject(`初始化地图，加载地图组件异常: ${mapName}`);
        }
    });
}

export { registerMapLayer, getMapLayer, loadLocalGeoJson };
