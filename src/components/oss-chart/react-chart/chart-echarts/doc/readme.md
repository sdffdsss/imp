## 基于echarts封装可自由拓展的图层的组件

### react-echart.jsx
- 基于react封装的echarts的简单容器
### map/
- layers/
  - base.js 声明的基础图层类
  - lines.js 飞线图图层
- layers-utils/
  - map-layer-utils.js 
    - registerMapLayer 注册图层
    - getMapLayer 获取图层
    - loadLocalGeoJson 导入地图json数据 **地图静态资源管理**
  - auto-register-layer.js
    - autoRegisterLayer 自动注册地图
    - registerCustomLayer 自助注册地图
  - create-layer.js
    - createLayer 创建图层
- react-ec-map-renderer/
  - index.js 地图的基础组件
- map.jsx
  - 地图通用组件
### oss-chart-scene/
- utils/
  - load-map-config.js
    - loadSceneMapConfig 导入场景地图的配置

## 构建地图图层
### 新图层.js
```js
import ChartEnums from '@Components/oss-chart/chart-enums';
import { createLayer } from '../layers-utils/create-layer';
import { MapBaseLayer } from './base.js';

// 1.构建图层类
class CustomMapLayer extends MapBaseLayer {
    // 创建图层配置项
}

// 2.创建图层
const layer = createLayer(CustomMapLayer, ChartEnums.mapLayerTypes.lines);

// 3.导出图层
export { layer, CustomMapLayer};
```

### 使用新图层(本操作只需要完成第1、3步)
```jsx
// 1. 导入需要注册的图层
import { lines, scatter } from './layers';

// 2. 增强地图组件
class EChartMap extends EChartBaseMap {
    static LAYERS = ChartEnums.mapLayerTypes;
}

// 3.自动注册地图组件相关属性
autoRegisterLayer(EChartMap, lines, scatter);

// 4.导出地图组件
export default EChartMap;
```

### 项目中使用
```jsx
export default function Map() {
    return (
        <div style={{ width: 1000, height: 800 }}>
            <EChartMap 
                // 指定图层
                layer={EChartMap.LAYERS.scatter}  
                // 数据
                data={data} 
                // 导入场景监控配置
                loadMapConfig={loadSceneMapConfig} 
                {...其他属性}/>
        </div>
    );
}
```