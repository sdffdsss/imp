import * as MapVGL from 'mapvgl';
import { _ } from 'oss-web-toolkits';
import { useEnvironmentModel } from '@Src/hox';
import getMapConfig, { getMapConfigApi, loadMapJSON } from '@Common/services/configService';
import request from '@Common/api';
import constants from '@Common/constants';
// @ts-ignore
import styleJson from './custom_map_config_blue_1013.json';

///
// 统一地图相关Api
///

type BMapApi = {
    map: any;
    view: any;
    isDestroyed: boolean;
    centerAndZoom: (cp: any, zoom?: number | null, id?: string) => void;
    destroy: () => void;
};

type TBMapEnvConfig = {
    regionZoom: any;
    styleUrl: string;
    minZoom: number;
    maxZoom: number;
    zoom: number;
    center: [number, number];
    heatmap: {
        min: number;
        max: number;
    };
    enableHeatmapProfessionalCode: {
        list: any[];
    };
};

const getEnvConfig = () => {
    return _.get(useEnvironmentModel, 'data.environment.baiduPathConfig') as TBMapEnvConfig;
};

const removeAllLayers = (api: BMapApi) => {
    api.view.removeAllLayers();
};

const createPolygonLayer = (options: any) => {
    return new MapVGL.PolygonLayer(options || {});
};

const createTextLayer = (options: any) => {
    return new MapVGL.TextLayer(options || {});
};

const createIconLayer = (options: any) => {
    return new MapVGL.IconLayer(options || {});
};

const createHeatmapLayer = (options: any) => {
    return new MapVGL.HeatmapLayer({
        ...(options || {}),
        gradient: {
            0.25: 'rgba(0, 255, 0, 0.6)',
            0.75: 'rgba(255, 255, 0, 1)',
            1: 'rgba(255, 0, 0, 1)',
        },
    });
};
const createLineLayer = (options: any) => {
    return new MapVGL.LineLayer({
        ...(options || {}),
        blend: 'lighter',
    });
};

const createPoint = (lng: number, lat: number) => {
    return new window.BMapGL.Point(lng, lat);
};

const createMarker = (point: any, options: any) => {
    return new window.BMapGL.Marker(point, {
        icon: new window.BMapGL.Icon(options?.icon, new window.BMapGL.Size(options?.iconSize?.width || 47, options?.iconSize?.height || 105), {
            anchor: new window.BMapGL.Size(options?.iconSize?.anchor?.x || 23.5, options?.iconSize?.anchor?.y || 105),
            enableMassClear: true, // 确保可以批量清除
            enableClicking: true, // 确保可以交互
            zIndex: options?.zIndex || 10,
        }),
    });
};

const createLabel = (options: any) => {
    return new window.BMapGL.Label(options.html, {
        offset: new window.BMapGL.Size(options?.offset?.x || 50, options?.offset?.y || 20),
        position: options?.position,
    });
};

const initMap = (container: string | HTMLElement) => {
    const baiduPathConfig = getEnvConfig();
    const map = new window.BMapGL.Map(container, {
        styleUrl:
            process.env.NODE_ENV === 'development'
                ? baiduPathConfig?.styleUrl
                : `${window.location.origin}/znjk/${constants.CUR_ENVIRONMENT}${baiduPathConfig?.styleUrl}`,
        minZoom: baiduPathConfig?.minZoom,
        maxZoom: baiduPathConfig?.maxZoom,
    });
    map.enableScrollWheelZoom(true);
    map.centerAndZoom(new window.BMapGL.Point(baiduPathConfig?.center[0], baiduPathConfig?.center[1]), baiduPathConfig?.zoom);
    map.disableDoubleClickZoom();

    const view = new MapVGL.View({ map });
    map.setMapStyleV2({ styleJson });

    let isDestroyed = false;

    const api: BMapApi = {
        get map() {
            return map;
        },
        get view() {
            return view;
        },
        get isDestroyed() {
            return isDestroyed;
        },
        centerAndZoom: (cp, zoom, id = '0') => {
            if (cp && cp.length > 1) {
                let regions = [];

                let zoomValue = zoom;
                let offsetX = 0;
                let offsetY = 0;
                if (!zoom) {
                    if (baiduPathConfig?.regionZoom) {
                        regions = baiduPathConfig?.regionZoom.filter((item) => item.id === parseFloat(id));
                    }
                    const region: any = regions.length > 0 ? regions[0] : null;
                    offsetX = region && region.offsetX ? region.offsetX : 0;
                    offsetY = region && region.offsetY ? region.offsetY : 0;
                    zoomValue = region && region.zoom ? region.zoom : 8;
                }
                map.setZoom(zoomValue);
                map.centerAndZoom(createPoint(cp[0] + offsetX, cp[1] + offsetY), zoomValue);
            }
        },
        destroy: () => {
            isDestroyed = true;
            view.stopAnimation();
            view.destroy();
            map.destroy();
        },
    };

    return api;
};

const MAP_PATH_DATA = {};
const getPathMapConfig = async (name: string): Promise<{ name: string; json: any; info: any }> => {
    return new Promise((resolve) => {
        if (!MAP_PATH_DATA[name]) {
            Promise.all([getMapConfig(name), getMapConfigApi()]).then((res) => {
                const [json, configRes] = res;
                // 地图标题切换到几何中心点
                json.features = json.features?.map((e) => {
                    e.properties.center = e.properties.centroid || e.properties.center;
                    return {
                        ...e,
                    };
                });
                MAP_PATH_DATA[name] = json;
                const info = configRes?.data?.find((d) => d.adcode === name);
                MAP_PATH_DATA[`${name}_info`] = info;
                resolve({ name, json, info });
            });
        } else {
            resolve({ name, json: MAP_PATH_DATA[name], info: MAP_PATH_DATA[`${name}_info`] });
        }
    });
};

const outlineDataCache = new Map();
const getMapOutLineJson = async (adcode: 'china' | number) => {
    return new Promise((resolve) => {
        if (!outlineDataCache.has(adcode)) {
            const isFullChinaOutline = adcode === 'china';
            const url = isFullChinaOutline ? 'map/china-outline.json' : 'map/province/china.json';
            loadMapJSON(url).then((geoJson) => {
                if (isFullChinaOutline) {
                    outlineDataCache.set(adcode, geoJson);
                } else {
                    geoJson.features.forEach((feature) => {
                        outlineDataCache.set(feature.id, {
                            type: 'FeatureCollection',
                            features: [feature],
                        });
                    });
                }
                resolve(outlineDataCache.get(adcode));
            });
        } else {
            resolve(outlineDataCache.get(adcode));
        }
    });
};

const getMapGeoData = (adcode) => {
    function formatName(name) {
        // 特殊处理区县名称
        if (name === '新市区') {
            return name;
        }
        if (name.length <= 2) {
            return name;
        }
        if (name.includes('市') || name.includes('自治州') || name.includes('自治县')) {
            return name.replace('市', '').replace('自治州', '').replace('自治县', '');
        }
        return name;
    }

    function transformer(res) {
        return {
            ...res,
            features: res?.features?.map((item) => {
                return {
                    ...item,
                    properties: {
                        ...item.properties,
                        name: formatName(item.properties.name),
                        center: item.properties.centroid || item.properties.center,
                    },
                };
            }),
        };
    }

    return new Promise((resolve) => {
        if (Number(adcode) === 100000 || adcode === 'china') {
            getMapOutLineJson(adcode).then((res) => {
                resolve(transformer(res));
            });
        } else {
            request('/getMapGeoAndLevelData', {
                type: 'post',
                data: {
                    adcode,
                },
                showSuccessMessage: false,
                showErrorMessage: false,
                baseUrlType: 'wirelessUrl',
            }).then((res) => {
                resolve(transformer(res.data));
            });
        }
    });
};

export {
    //
    initMap,
    getEnvConfig,
    removeAllLayers,
    createPolygonLayer,
    createTextLayer,
    createIconLayer,
    createHeatmapLayer,
    createPoint,
    getPathMapConfig,
    getMapOutLineJson,
    createLineLayer,
    createMarker,
    createLabel,
    getMapGeoData,
};

export type { BMapApi };
