import { BMap } from '@Components/bmap-gl';

const createLineLayer = (options: { icon: string; data?: Array<any>; onClick: any }) => {
    return BMap.createLineLayer({
        width: 2,
        enablePicked: true, // 是否可以拾取
        autoSelect: false, // 根据鼠标位置来自动设置选中项
        data: options?.data,
        ...(options || {}),
    });
};

export { createLineLayer };
