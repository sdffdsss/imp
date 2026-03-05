## 地图生成器基类EChartMapRenderer

### 地图基础配置
- layer 图层名称 枚举 or 字符串
- mapName  地图名称
- mapLevel 地图地区等级 枚举
- zoom 地图缩放等级
- selectedMode 地图选中模式

### local配置
- loadMapConfig  导入配置
- mapConfig  外部直接指定地图配置
- loadMapGeoJson 导入地图geoJson
- geoJson  外部直接指定额geoJson

###  通用配置
- rebuildOption  重置地图的配置信息
- data    数据
- events 事件
- errorElement 错误的时候显示的内容