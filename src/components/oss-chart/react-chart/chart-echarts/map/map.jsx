// import PropTypes from 'prop-types';
import ChartEnums from '@Components/oss-chart/chart-enums';
import EChartBaseMap from './react-ec-map-renderer';
import { autoRegisterLayer } from './layers-utils';

// 1. 导入需要注册的图层
import { lines, scatter, heatmap, pathmap } from './layers';
const LAYERS = [lines, scatter, heatmap, pathmap];

// 2. 增强地图组件
class EChartMap extends EChartBaseMap {
    static LAYERS = ChartEnums.mapLayerTypes;
}

// 3.自动注册地图组件相关属性
autoRegisterLayer(EChartMap, ...LAYERS);

// 4.导出地图组件
export default EChartMap;

/**
 * 单图层注册(如果一个项目中只用到一个图层,可以使用如下方式注册使用)
 * import EChartBaseMap from './react-ec-map-renderer';
 * import { registerCustomLayer } from './layers-utils';
 * import { lines } from './layers';
 *
 * class EChartMap extends EChartBaseMap {
 *      static defaultProps = Object.assign({},EChartBaseMap.defaultProps,{
 *             layer: ChartEnums.mapLayerTypes.lines
 *      })
 * }
 *
 * registerCustomLayer(EChartMap, lines);
 * export default EChartMap;
 */
