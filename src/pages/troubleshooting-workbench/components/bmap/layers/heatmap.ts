import { _ } from 'oss-web-toolkits';
import { BMap } from '@Components/bmap-gl';

export const createHeatmapLayer = (options: { data: Array<any> }) => {
    const env = BMap.getEnvConfig();
    return BMap.createHeatmapLayer({
        size: _.get(env, 'heatmap.size', 50), // 单个点绘制大小
        min: _.get(env, 'heatmap.min', 0),
        max: _.get(env, 'heatmap.max', 40),
        height: 0, // 最大高度，默认为0
        // unit: 'm', // 单位，m:米，px: 像素
        data: options.data,
    });
};
