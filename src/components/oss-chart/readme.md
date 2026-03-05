### 通用图表g2plot (29 - 4 = 25)
> 进度 + 迷你 暂时不做
- [x] 折线图 OssLinePlotChart
- [x] 面积图 OssAreaPlotChart
- [x] 柱状图 OssColumnPlotChart
- [x] 条形图 OssBarPlotChart
- [x] 饼图   OssPiePlotChart
- [x] 仪表盘 OssGaugePiePlotChart
- [x] 雷达图 OssRadarPlotChart
- [x] 玫瑰图 OssRosePiePlotChart
- [x] 双轴图 OssDualAxesPlotChart
- [x] 玉珏图 OssRadialBarPlotChart ==极坐标下的柱形图==
- [x] 进度环图 OssRingProgressPlotChart
- [x] 散点图 OssScatterPlotChart
- [x] 漏斗图 OssFunnelPlotChart
- [x] 水球图 OssLiquidPlotChart
- [x] 词云图 OssWordCloudPlotChart
- [x] 对称条形图 OssBidirectionalBarPlotChart
- [x] 桑基图 OssSankeyPlotChart
- [x] 弦图 OssChordPlotChart
- [x] 直方图 OssHistogramPlotChart
- [x] 旭日图 OssSunburstPlotChart
- [x] 箱型图 OssBoxPlotChart
- [x] 股票图 OssStockPlotChart
- [x] 热力图 OssHeatmapPlotChart
- [x] 瀑布图 OssWaterfallPlotChart
- [x] 矩阵树图 OssTreemapPlotChart
- [x] 子弹图 OssBulletPlotChart


### 通用图表ECharts
- [x] 地图
- [ ] 图层
  - [x] lines
  - [x] scatter 支持三种scatter类型
  - [ ] heatmap
  - [ ] subway

### 图表+
- [x] 圆柱图 黑龙江数据中心
- [ ] 电池百分比 黑龙江数据中心
- [ ] ring-percent 黑龙江家客
- [ ] ring-percent
- [ ] 2.5d-Box图

### 项目成品
- [x] comp-bar-chart 多彩条形图
- [x] comp-line-chart 多彩线图
- [x] comp-area-chart 面积图
- [x] comp-gauge-percent-chart 仪表盘百分比图

### 目录说明
- react-chart/
  - chart/
    - bizchart相关封装
  - chart-echarts/
    - 目前为echarts板块地图服务
- bizchart-custom-shape
  - bizchart使用的自定义形状
- svg-shape/ 
  - 原生js的svg形状
- comp-chart-beta/
  - 项目中可以直接使用的图表
  - 可能是oss-report的前置实践
  - 基本配置可能只有：colors tooltipFormatter data等少数属性
- utils/
  - deep-assign 合并
  - g-gradient-color 创建g的渐变色
  - isEqual 相等



