import { BMap } from '@Components/bmap-gl';

const createPointIconLayer = (options: { icon: string; data?: Array<any>; onClick?: (e: any) => void }) => {
    return BMap.createIconLayer({
        border: false,
        width: 16,
        height: 35,
        offset: [0, -25],
        icon: options.icon,
        enablePicked: false, // 是否可以拾取
        autoSelect: false, // 根据鼠标位置来自动设置选中项
        zIndex: -1,
        data: options?.data,
        onClick: options?.onClick,
    });
};

const createPointTextLayer = (options: { data?: Array<any> }) => {
    return BMap.createTextLayer({
        minWidth: 10,
        height: 12,
        offset: [0, -35],
        color: 'rgb(255, 255, 255)',
        backgroundColor: 'transparent',
        border: false,
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 10,
        textAlign: 'center',
        fontFamily: 'Noto Sans SC',
        zIndex: -1,
        data: options?.data,
    });
};

export {
    //
    createPointIconLayer,
    createPointTextLayer,
};
