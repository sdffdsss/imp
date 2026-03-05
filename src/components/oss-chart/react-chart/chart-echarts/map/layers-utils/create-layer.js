import { registerMapLayer } from './map-layer-utils.js';

const layerTypeMap = new Map();

/**
 * 创建图层
 * @param {*} CustomMapLayer 自定义图层类
 * @param {object} layerType  图层类型 ---> chart-enums
 * @param {object} extraConfig 额外的配置
 */
function createLayer(CustomMapLayer, layerType, extraConfig = {}) {
    // 1.图层实例
    if (!layerTypeMap.has(layerType)) {
        layerTypeMap.set(layerType, new CustomMapLayer());
    }
    const _customLayer = layerTypeMap.get(layerType);

    // 2.注册地图图层方法
    const registerCustomMapLayer = () => {
        registerMapLayer(layerType.id, _customLayer);
    };

    // 3. 图层基类模板
    return {
        type: layerType,
        registerMapLayer: registerCustomMapLayer,
        defaultProps: {},
        propTypes: {},
        ...extraConfig,
    };
}

export { createLayer };
