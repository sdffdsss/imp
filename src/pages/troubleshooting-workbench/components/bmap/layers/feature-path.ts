import { BMap } from '@Components/bmap-gl';

const mapStyle = {
    common: {
        path: {
            fillColor: 'rgb(8,56,105)',
            lineColor: '#74EAF8',
        },
        text: {
            color: 'rgba(255, 255, 255, 1)',
            fontSize: 16,
            fontFamily: 'Noto Sans SC',
            fontWeight: 900,
        },
    },
    selected: {
        path: {
            fillColor: '#15579a', // 悬浮选中项颜色
            lineColor: '#16d0ff',
        },
        text: {
            color: 'rgba(255, 255, 255, 1)', // 选中项颜色
            fontSize: 16,
        },
    },
};

const createFeatureLayer = (options: Record<string, any> = {}) => {
    return BMap.createPolygonLayer({
        enablePicked: true,
        autoSelect: false,
        pickWidth: 30,
        pickHeight: 30,
        selectedColor: '#15579a', // 悬浮选中项颜色
        border: true,
        fillColor: 'rgb(8,56,105)',
        selectedFillColor: '#15579a', // 悬浮选中项颜色
        fillOpacity: 1,
        lineWidth: 1,
        lineColor: 'rgb(22,135,184)',
        selectedLineColor: '#16d0ff',
        ...(options || {}),
    });
};

const createHighlightFeatureLayer = () => {
    return BMap.createPolygonLayer({
        enablePicked: true,
        autoSelect: false,
        pickWidth: 30,
        pickHeight: 30,
        selectedColor: '#15579a', // 悬浮选中项颜色
        border: true,
        // @ts-ignore
        fillColor: 'rgb(8,56,105)',
        selectedFillColor: '#15579a', // 悬浮选中项颜色
        fillOpacity: 1,
        lineWidth: 2,
        // @ts-ignore
        lineColor: 'rgb(22,135,184)',
        selectedLineColor: '#16d0ff',
        ...mapStyle.selected.path,
    });
};

const createHighlightTextLayer = () => {
    return BMap.createTextLayer({
        fontFamily: 'Noto Sans SC',
        selectedColor: 'rgba(255, 255, 255, 1)', // 选中项颜色
        // @ts-ignore
        color: 'rgba(255, 255, 255, 0.6)',
        border: false,
        // @ts-ignore
        fontSize: 12,
        autoSelect: false,
        fontWeight: 400,
        lineHeight: 22,
        letterSpacing: -1,
        textAlign: 'center',
        zIndex: -1,
        collides: false,
        offset: [0, 23],
        ...mapStyle.selected.text,
    });
};

const createFeatureTextLayer = (options: { data: Array<any>; offset: any }) => {
    return BMap.createTextLayer({
        fontFamily: 'Noto Sans SC',
        selectedColor: 'rgba(255, 255, 255, 1)', // 选中项颜色
        color: 'rgba(255, 255, 255, 1)',
        border: false,
        fontSize: 16,
        autoSelect: false,
        fontWeight: 900,
        lineHeight: 22,
        letterSpacing: -1,
        textAlign: 'center',
        zIndex: -1,
        collides: false,
        data: options.data,
        offset: options.offset,
    });
};

export {
    mapStyle,
    //
    createHighlightFeatureLayer,
    createHighlightTextLayer,
    createFeatureTextLayer,
    createFeatureLayer,
};
