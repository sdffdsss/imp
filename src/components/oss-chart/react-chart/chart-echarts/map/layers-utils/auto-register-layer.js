// 手动注册地图图层
const registerCustomLayer = (Chart, layer) => {
    // 1.注册图层
    layer.registerMapLayer();

    // 2.合并图层静态属性
    Chart.defaultProps = Object.assign({}, Chart.defaultProps || {}, layer.defaultProps);
    Chart.propTypes = Object.assign({}, Chart.propTypes || {}, layer.propTypes);
};

// 注册地图图层
function autoRegisterLayer(Chart, ...layers) {
    layers.forEach((layer) => {
        registerCustomLayer(Chart, layer);
    });

    return Chart;
}

export { autoRegisterLayer, registerCustomLayer };
