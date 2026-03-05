import { Enums } from 'oss-web-common';

const { rebuild: rebuildEnums } = Enums;

// 坐标系枚举
const coordinateTypes = [
    { id: 'rect', key: 'rect', name: 'rect' },
    { id: 'polar', key: 'polar', name: 'polar' },
    { id: 'theta', key: 'theta', name: 'theta' },
    { id: 'helix', key: 'helix', name: 'helix' },
];

// chart类型枚举
const chartTypes = [
    { id: 'area', key: 'area' },
    { id: 'line', key: 'line' },
    { id: 'column', key: 'column' }, // 柱状图
    { id: 'bar', key: 'bar' }, // 条形图 === 水平柱状图
    { id: 'pie', key: 'pie' }, // 饼图
    { id: 'radar', key: 'radar' }, // 饼图
    { id: 'rose', key: 'rose' }, // 玫瑰图
    { id: 'gauge', key: 'gauge' }, // 仪表盘
    { id: 'dualAxes', key: 'dualAxes' }, // 双轴图
    { id: 'radialBar', key: 'radialBar' }, // 双轴图
    { id: 'scatter', key: 'scatter' }, // 双轴图
    { id: 'funnel', key: 'funnel' }, // 漏斗图
    { id: 'liquid', key: 'liquid' }, // 水球图
    { id: 'wordCloud', key: 'wordCloud' }, // 词云图
    { id: 'bidirectionalBar', key: 'bidirectionalBar' }, // 对称条形图
    { id: 'sankey', key: 'sankey' }, // 桑基图
    { id: 'chord', key: 'chord' }, // 弦图
    { id: 'histogram', key: 'histogram' }, // 直方图
    { id: 'sunburst', key: 'sunburst' }, // 旭日图
    { id: 'box', key: 'box' }, // 箱型图
    { id: 'stock', key: 'stock' }, // 股票图
    { id: 'heatmap', key: 'heatmap' }, // 热力图
    { id: 'waterfall', key: 'waterfall' }, // 瀑布图
    { id: 'treemap', key: 'treemap' }, // 矩形树图
    { id: 'bullet', key: 'bullet' }, // 矩形树图
];

// 地图图层
const mapLayerLevelTypes = [
    { id: -1, key: 'china' }, // 查找全国的数据
    { id: 10000, key: 'province' }, // 查找省份的数据
    { id: 10003, key: 'city' }, // 查找城市的数据
    { id: 10004, key: 'district' }, // 查找区县的数据
];

// 地图图层类型
const mapLayerTypes = [
    { id: 'lines', key: 'lines' }, // 飞线图
    { id: 'scatter', key: 'scatter' }, // 散点图
    { id: 'heatmap', key: 'heatmap' }, // 热力图
    { id: 'pathmap', key: 'pathmap' }, // 板块图
];

const enumcontainer = Object.assign(
    {},
    {
        coordinateTypes,
        chartTypes,
        mapLayerLevelTypes,
        mapLayerTypes,
    }
);
rebuildEnums.call(enumcontainer);

export default enumcontainer;
