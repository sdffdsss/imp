/**
 * @description 这个组件没有复用的价值，别到处复制这用了
 * 开发的时候要分清楚这两个，别混着用
 * areaId 服务端的id
 * adcode 行政区划代码
 */
import React from 'react';
import { _ } from 'oss-web-toolkits';
import { Image, message } from 'oss-ui';
import constants from '@Common/constants';
import { BMap } from '@Components/bmap-gl';
import { getMapConfigApi } from '@Common/services/configService';
import GlobalMessage from '@Src/common/global-message';
import {
    createFeatureTextLayer,
    createHighlightFeatureLayer,
    createHighlightTextLayer,
    createPointIconLayer,
    createPointTextLayer,
    createFeatureLayer,
    createHeatmapLayer,
    createLineLayer,
    mapStyle,
} from './layers';
import { MAP_MODE } from './config';
import { getOnlineDataApi, getFaultReportDataApi, getHeatmapDataApi, getLineDataApi, getRelatedLineDataApi } from './api';
import { getFaultEquipmentInfo } from '../../api';
import type { TroubleshootingWorkbenchMapProps } from './types';
import './index.less';
import { createIconLayer, createPoint, createMarker, createLabel } from '@Src/components/bmap-gl/map';
import { PUBLIC_OPINION } from '../../types';
import ReactDOMServer from 'react-dom/server';
import OnlineUsers from '../onlineUsers';
import jiuduanxian from '../../img/九段线.png';

const isProfessionalWithHeatmap = (selProfessional: any) => {
    const env = BMap.getEnvConfig();
    if (_.isEmpty(env.enableHeatmapProfessionalCode?.list)) return false;
    return env.enableHeatmapProfessionalCode.list.includes(Number(selProfessional.specialty));
};

const isProfessionalWithLinemap = (selProfessional: any) => {
    return Number(selProfessional.specialty) === 8;
};

/**
 * 业务组件，定制地图，理论上不具备通用的复用能力
 */
class Index extends React.PureComponent<TroubleshootingWorkbenchMapProps, any> {
    static defaultProps = {
        id: 'container',
        enableDrilldown: true,
        enableSelect: true,
        enableRequestLoop: true,
    };

    bMapApi: ReturnType<typeof BMap.initMap> | null = null;
    preHeatLayer = null;
    preLineLayer = null;
    relateLineLayer = null;
    iconLayer = null;
    mapConfigList: any[] = [];
    heatmapRenderCounter = 0;
    linemapRenderCounter = 0;
    outlineMapLayer = null;
    pannelTimer = 0;

    constructor(props: TroubleshootingWorkbenchMapProps) {
        super(props);
        this.rContentRef = React.createRef();
        this.mapJsonRef = React.createRef();
        this.curMapItem = React.createRef();
        this.state = {
            areaId: props.areaId || 'china',
            areaList: [],
            // selList: [],
            areaCenter: {},
            onlineData: {},
            faultReportData: {},
            layerList: [],
            iconLayerList: [],
            iconLayerRelatedList: [],
            shapeLayerList: [],
            isShowAnimation: false,
            animationArea: [],
            areaParam: {},
            floatWindowInfo: {},
            onlineLayerList: [],
            curAdcode: '',
        };
        this.heartTimer = null;
        this.timer = null;
        this.animationTimer = null;
    }

    componentDidMount() {
        this.highlightFeatureLayer = createHighlightFeatureLayer();
        this.highlightFeatureLayer.renderOrder = 9999;
        this.highlightTextLayer = createHighlightTextLayer();
        this.highlightTextLayer.renderOrder = 9999;
        this.initMap();

        if (this.props.enableRequestLoop) {
            this.heartTimer = setInterval(() => {
                this.getOnlineData();
                // this.getFaultReportData();
            }, 1000 * 60 * 3);
        }

        let i = 1;
        const render = () => {
            i += 0.01;
            if (i > 1.5) {
                i = 1;
            }
            const { layerList, isShowAnimation, animationArea } = this.state;
            if (isShowAnimation) {
                layerList?.forEach((item) => {
                    const point = item.data?.length > 0 ? item.data[0].geometry.point : null;
                    if (point && animationArea.some((itemArea) => itemArea.code === point.code)) {
                        if (item.name === 'IconLayer') {
                            item.setOptions({
                                width: 16 * 1 * i,
                                height: 35 * 1 * i,
                                offset: [0, -25 * 0.5 * i],
                            });
                        } else {
                            item.setOptions({
                                offset: [0, -23 * i],
                            });
                        }
                    }
                });
            }
            this.animationTimer = requestAnimationFrame(render);
        };
        this.animationTimer = requestAnimationFrame(render);
        GlobalMessage.on('activeChangedGisMap', null, ({ isActive }) => {
            if (isActive) {
                this.props.forceReInitMap?.();
            } else {
                this.unmount();
            }
        });
    }

    componentDidUpdate(preProps: any) {
        if (preProps.forceReInitFlag === false && this.props.forceReInitFlag && this.props.forceReInitFlag !== preProps.forceReInitFlag) {
            this.initMap(this.props.areaId);
        }

        if (this.props.mapMode && this.props.mapMode !== preProps.mapMode) {
            if (this.props.mapMode === MAP_MODE.FAULT) {
                this.getFaultReportData();
            }
        }
        if (this.props.isOnline !== preProps.isOnline) {
            this.removeOnlinePoints();
            this.getOnlineData();
            this.changePath('china');
        }
        if (this.props.showRelatedLine !== preProps.showRelatedLine || this.props.selectedCard !== preProps.selectedCard) {
            if (this.props.showRelatedLine) {
                this.addRelatedLine();
                this.removeAddPoints();
            } else {
                // this.getFaultReportData();
                this.removeRelatedLinemap();
                this.addPoints(this.props.areaId);
            }
        }

        if (this.props.showRelatedLine !== preProps.showRelatedLine) {
            if (this.props.showRelatedLine) {
                this.addRelatedLine();
            } else {
                this.getFaultReportData();
            }
        }

        if (this.props.areaId && this.props.areaId !== preProps.areaId && this.props.mapMode === MAP_MODE.FAULT) {
            const newAreaId = this.props.areaId === 'country' ? 'china' : this.props.areaId;
            if (newAreaId !== 'china') {
                this.removeOnlinePoints();
            }
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ areaId: this.props.areaId }, () => {
                this.changePath(newAreaId);
                this.getFaultReportData();
            });
        }

        if (this.props.selProfessional && this.props.selProfessional !== preProps.selProfessional && this.props.mapMode === MAP_MODE.FAULT) {
            this.getFaultReportData();
        }
        if (this.props.timeType && this.props.timeType !== preProps.timeType && this.props.mapMode === MAP_MODE.FAULT) {
            this.getFaultReportData();
        }

        if (this.props.newMsgs && this.props.newMsgs !== preProps.newMsgs) {
            if (this.props.mapMode !== MAP_MODE.FAULT) {
                return;
            }

            if (this.props.newMsgs.specialty === '8') {
                // 干线光缆推送时更新光览地图
                this.addLinemap();
            }

            const { specialty, failureClass } = this.props.selProfessional;

            if (this.props.newMsgs.specialty !== PUBLIC_OPINION) {
                if (specialty && !failureClass) {
                    if (specialty !== this.props.newMsgs.specialty) {
                        return;
                    }
                } else if (specialty && failureClass) {
                    if (specialty !== this.props.newMsgs.specialty || failureClass !== this.props.newMsgs.failureClass) {
                        return;
                    }
                } else {
                    // nothing
                }
            }
            this.updatePointStatus();
        }

        // 禁用的时候清除之前的图层
        if (!this.props.enableHeatmap) {
            this.removeHeatmap();
        }
        if (!this.props.enableLinemap) {
            this.removeLinemap();
        }

        if (this.props.enableHeatmap !== preProps.enableHeatmap) {
            if (this.props.enableHeatmap) {
                this.addHeatmap();
            }
        }
        if (this.props.enableLinemap !== preProps.enableLinemap) {
            if (this.props.enableLinemap) {
                this.addLinemap();
            }
        }

        if (this.props.enableHeatmap && !this.preHeatLayer && this.props.forceReInitFlag) {
            this.addHeatmap();
        }
        if (this.props.enableLinemap && !this.preLineLayer && this.props.forceReInitFlag) {
            this.addLinemap();
        }
        // if (this.props.selProfessional.specialty !== preProps.selProfessional.specialty) {
        //     const { specialty } = this.props.selProfessional;
        //     if (Number(specialty) === 8) {
        //         // 专业为干线光缆的时候
        //         this.addLine();
        //     }
        // }

        const computePoint = () => {
            const { floatWindowInfo } = this.state;

            if (this.bMapApi && !_.isEmpty(floatWindowInfo)) {
                const { x, y } = this.bMapApi?.map.pointToPixel(
                    new window.BMapGL.Point(floatWindowInfo.lonAndLatRq?.longitude, floatWindowInfo.lonAndLatRq?.latitude),
                );
                if (floatWindowInfo.top !== y || floatWindowInfo.left !== x) {
                    this.setState(
                        {
                            floatWindowInfo: {
                                ...floatWindowInfo,
                                left: x,
                                top: y,
                            },
                        },
                        () => {
                            this.props.setFloatingWindowInfo(this.state.floatWindowInfo);
                        },
                    );
                }
            }
            if (Object.keys(this.props.selectedCard).length !== 0) {
                this.pannelTimer = requestAnimationFrame(computePoint);
            }
        };

        this.pannelTimer = requestAnimationFrame(computePoint);
    }

    componentWillUnmount() {
        this.unmount();
        GlobalMessage.off('activeChangedGisMap', null, null);
    }

    unmount = () => {
        cancelAnimationFrame(this.animationTimer);
        if (this.bMapApi) {
            this.bMapApi.destroy();
            this.bMapApi = null;
        }

        console.log('%c[Baidu Map]: Dispose', 'color:yellow;');
    };

    initMap = async (areaId?) => {
        if (!window.BMapGL) {
            return;
        }

        const mapConfigListRes = await getMapConfigApi();
        this.mapConfigList = mapConfigListRes.data;

        if (this.bMapApi) {
            this.bMapApi.destroy();
        }
        this.bMapApi = BMap.initMap(this.props.id as string);
        setTimeout(() => {
            const currentId = areaId || this.state.areaId;
            const { adcode = 'china' } = this.mapConfigList.find((d) => d.id === currentId || d.adcode === currentId) || {};
            this.getPathMapConfig(adcode);
            if (this.bMapApi?.map) {
                this.bMapApi?.map.on('click', (evt) => {
                    if (evt?.target?.innerHTML) {
                        return;
                    }
                    // 将点击的像素坐标转换为经纬度
                    if (this.rContentRef.current) {
                        this.bMapApi?.map?.removeOverlay(this.rContentRef.current);
                        this.bMapApi?.map?.enableScrollWheelZoom();
                    }
                });
                this.bMapApi?.map.on('dragend', () => {
                    if (this.mapJsonRef.current) {
                        this.setPathMap(this.mapJsonRef.current);
                        this.addPoints(this.state.curAdcode);
                    }
                });
            }
        }, 1000);
    };

    // 读取全国地图配置信息
    getPathMapConfig = async (name: string) => {
        let currentItem: any = null;
        if (name !== 'china') {
            currentItem = this.mapConfigList.find((d) => [Number(d.id), Number(d.adcode)].includes(Number(name)));
        }
        const adcode = currentItem ? currentItem.adcode : name;
        const { json, info } = await BMap.getPathMapConfig(adcode);
        this.initAreas(adcode, json, info);
    };

    initAreas = (name: string, res: { features: any[] }, info: any) => {
        const { areaCenter } = this.state;
        const areaArr: any = [];
        const selList: any = [];
        const baiduPathConfig = BMap.getEnvConfig();
        if (name === 'china') {
            selList.push({ key: 'china', name: '全国' });
            areaCenter['china'] = baiduPathConfig?.center;
        }

        if (info) {
            areaCenter[name] = info.cp;
        }
        res?.features?.forEach((item) => {
            const cp = item?.properties?.cp || item?.properties?.center;
            const id = item?.properties?.id || item?.properties?.adcode;
            if (cp) {
                const area = {
                    key: id,
                    name: item?.properties?.name,
                    longitude: cp[0],
                    latitude: cp[1],
                };
                areaCenter[id] = cp;
                areaArr.push(area);
                selList.push(area);
            }
        });

        const nextState = {
            areaList: areaArr,
        };

        if (name === 'china') {
            Object.assign(nextState, { selList });
        }
        this.setState(nextState, () => {
            this.setPathMapOutline();
            this.setPathMap(res);
            this.mapJsonRef.current = res;
            this.addPoints(name);
            this.setState({ curAdcode: name });
            const { specialty } = this.props.selProfessional;
            if (Number(specialty) === 8 && name === 'china') {
                // 专业为光缆
                this.addLinemap();
            } else {
                this.removeLinemap();
            }

            const cp = areaCenter[name];
            setTimeout(() => {
                const regions = baiduPathConfig?.regionZoom.filter((item) => item.id === parseFloat(name));
                const region = regions.length > 0 ? regions[0] : null;
                const zoom = region && region.zoom ? region.zoom : 8;
                this.bMapApi?.centerAndZoom(cp, name === 'china' ? baiduPathConfig.zoom : zoom, name);
                console.log('地图定位1：');
                console.log('areaId', name);
                console.log('cp', cp);
            }, 1000);
        });
    };

    // 获取在线省份打点数据
    getOnlineData = async () => {
        if (!this.props.isOnline) return;
        const { tempProvinceList } = this.props;
        this.setState({ onlineData: { provinceOnlineDetailList: tempProvinceList } }, () => {
            this.addPoints('china');
        });
    };

    // 获取地图上报故障统计
    getFaultReportData = async () => {
        const params: any = {
            selProfessional: this.props.selProfessional,
            areaId: this.state.areaId,
            areaParam: this.state.areaParam,
            timeType: this.props.timeType,
        };

        if (this.props.requestParamsFormatter) {
            const formatted = await this.props.requestParamsFormatter('fault', params);
            Object.assign(params, formatted || params);
        }

        const { faultReportData, areaParam, areaId } = await getFaultReportDataApi(params, { mapConfigList: this.mapConfigList });
        let currentItem: any = null;
        if (areaId !== 'china') {
            currentItem = this.mapConfigList.find((d) => [Number(d.id), Number(d.adcode)].includes(Number(areaId)));
        }
        const adcode = currentItem ? currentItem.adcode : areaId;
        this.setState({ faultReportData, areaParam }, () => {
            this.addPoints(adcode);
        });
    };

    updatePointStatus = () => {
        const { newMsgs, needOpenSpecialty } = this.props;
        if (!newMsgs) {
            return;
        }
        const { notificationType, latestReportStatus, specialty, involvedProvince, failureClass, faultDistinctionType, source } = newMsgs as any;
        const { faultReportData, areaId } = this.state;
        /**
         * 省份
         * 地市
         * 专业
         * 类别
         */
        if (newMsgs.cityName === '省本部' && areaId !== 'china' && areaId !== 'country') {
            return;
        }
        console.log('打点增加', newMsgs);
        if (faultDistinctionType === 2 && source === 0) return;
        // 通知类型 1:故障通知 2:倒计时通知，3：活动告警，4：清除告警   5.手动清楚  notificationType
        // 最新上报状态 1 首报草稿,2 首报上报,3续报草稿,4 续报上报,5终报草稿,6终报上报    latestReportStatus
        // eslint-disable-next-line eqeqeq
        let payload = 0;
        switch (notificationType) {
            case 1:
                payload = 1;
                break;
            case 4:
                payload = -1;
                break;
            case 5:
                payload = -1;
                break;
            default:
                payload = 0;
        }
        if (newMsgs.provinceId === '0' && specialty !== PUBLIC_OPINION) return; // 集团上报省份不用新增变化
        let isChange = false;
        let areaInfo: any = null;
        if (latestReportStatus == 23) {
            this.addPoints(areaId);
            return;
        }

        if (payload && latestReportStatus == 2) {
            faultReportData.faultProvinceCount?.forEach((p) => {
                if (p.code === newMsgs.provinceId) {
                    // eslint-disable-next-line no-param-reassign
                    p.num += payload;
                    isChange = true;
                    areaInfo = [p];
                }
            });
            faultReportData.faultCityCount?.forEach((p) => {
                if (p.code === newMsgs.cityId) {
                    // eslint-disable-next-line no-param-reassign
                    p.num += payload;
                    isChange = true;
                    areaInfo = [p];
                }
            });
        } else {
            if (specialty === PUBLIC_OPINION) {
                if (this.props.selProfessional.specialty === PUBLIC_OPINION) {
                    if (this.props.benchType) {
                        // faultReportData.faultCityCount?.forEach((p) => {
                        //     if (p.code === newMsgs.cityId) {
                        //         // eslint-disable-next-line no-param-reassign
                        //         p.num += payload;
                        //         isChange = true;
                        //         areaInfo = [p];
                        //     }
                        // });
                        if (payload && involvedProvince?.findIndex((e) => Number(e) === Number(areaId)) > -1) {
                            isChange = true;
                            areaInfo =
                                faultReportData.faultCityCount?.map((item) => {
                                    if (item.code === newMsgs.cityId) {
                                        return {
                                            ...item,
                                            num: payload,
                                        };
                                    }

                                    return { ...item };
                                }) || [];
                        }
                    } else {
                        if (payload) {
                            faultReportData.faultProvinceCount?.forEach((p) => {
                                if (p.code === newMsgs.provinceId) {
                                    // eslint-disable-next-line no-param-reassign
                                    p.num += payload;
                                    isChange = true;
                                    areaInfo = [p];
                                }
                            });
                        }
                    }
                } else {
                    if (this.props.benchType && failureClass !== '21' && involvedProvince?.findIndex((e) => Number(e) === Number(areaId)) > -1) {
                        isChange = true;
                        areaInfo = faultReportData.faultCityCount?.map((item) => ({ ...item })) || [];
                    }
                }
            }
        }

        if (isChange && areaInfo?.some((itemArea) => !!itemArea.areaId)) {
            this.addPoints(areaId);
            if (this.props.lightFlag && needOpenSpecialty.includes(specialty)) {
                this.setState({
                    isShowAnimation: true,
                    animationArea: areaInfo,
                });
            }

            setTimeout(() => {
                const { layerList, animationArea } = this.state;
                layerList?.forEach((item) => {
                    const point = item.data?.length > 0 ? item.data[0].geometry.point : null;
                    if (point && animationArea.some((itemArea) => itemArea.code === point.code)) {
                        if (item.name === 'IconLayer') {
                            item.setOptions({
                                width: 16,
                                height: 35,
                                offset: [0, -25],
                            });
                        } else {
                            item.setOptions({
                                offset: [0, -35],
                            });
                        }
                    }
                });
                this.setState({
                    isShowAnimation: false,
                    animationArea: [],
                });
            }, 3000);
        }
    };
    removeAddPoints = () => {
        if (this.bMapApi) {
            const { layerList } = this.state;
            layerList?.forEach((layer) => {
                this.bMapApi?.view.removeLayer(layer);
            });
        }
    };
    removeOnlinePoints = () => {
        if (this.bMapApi) {
            const { onlineLayerList } = this.state;
            onlineLayerList?.forEach((layer) => {
                this.bMapApi?.view.removeLayer(layer);
            });
            this.bMapApi?.map?.clearOverlays();
        }
    };
    getPyPosition = (areaName) => {
        const pos = {
            x: 0.1,
            y: -1.2,
        };
        if (
            areaName?.indexOf('北京') > -1 ||
            areaName?.indexOf('天津') > -1 ||
            areaName?.indexOf('海南') > -1 ||
            areaName?.indexOf('宁夏') > -1 ||
            areaName?.indexOf('深圳') > -1 ||
            areaName?.indexOf('澳门') > -1
        ) {
            pos.x = 0.1;
            pos.y = -0.5;
        } else if (areaName?.indexOf('上海') > -1) {
            pos.x = 0.1;
            pos.y = -0.4;
        } else if (areaName?.indexOf('广东') > -1) {
            pos.x = 0.1;
            pos.y = -0.6;
        } else if (areaName?.indexOf('重庆') > -1) {
            pos.x = 0.1;
            pos.y = -0.3;
        }
        return pos;
    };
    addPoints = (adcode) => {
        const { onlineData, layerList, faultReportData, areaList } = this.state;
        if (!this.props.isOnline) {
            this.removeOnlinePoints();
        }
        if (this.bMapApi) {
            layerList?.forEach((layer) => {
                this.bMapApi?.view.removeLayer(layer);
            });
            const layerArr: any = [];
            const onlineLayerArr: any = [];
            const onlineOverlayArr: any = [];
            const iconData: any = [];
            const nameData: any = [];
            if (this.props.isOnline && adcode === 'china' && onlineData && onlineData.provinceOnlineDetailList) {
                onlineData.provinceOnlineDetailList.forEach((item) => {
                    if (item?.onlineCount > 0) {
                        const area = areaList.find((a) => Number(a.key) === Number(item.areaId));
                        const pos = this.getPyPosition(area?.name);
                        // 防止重叠手动偏移
                        const newPosition = [+area?.longitude + pos.x, area?.latitude + pos.y];
                        iconData.push({
                            geometry: {
                                type: 'Point',
                                coordinates: newPosition,
                                point: item,
                            },
                        });

                        nameData.push({
                            geometry: {
                                type: 'Point',
                                coordinates: newPosition,
                                point: item,
                            },
                            properties: {
                                text: item?.onlineCount,
                            },
                        });
                    }
                });
            }

            const iconDataFault: any = [];
            const nameDataFault: any = [];

            if (this.props.mapMode === MAP_MODE.FAULT && faultReportData) {
                let data = faultReportData.faultProvinceCount || [];
                if (adcode !== 'china') {
                    data = faultReportData.faultCityCount || [];
                }

                data.forEach((item) => {
                    if (item?.num > 0) {
                        const area = areaList.find((a) => Number(a.key) === Number(item.areaId));
                        let newPosition = [+area?.longitude, +area?.latitude];
                        if (this.props.isOnline) {
                            // 防止重叠手动偏移
                            newPosition = [+area?.longitude, area?.latitude + 0.01];
                        }
                        iconDataFault.push({
                            geometry: {
                                type: 'Point',
                                coordinates: newPosition,
                                point: item,
                            },
                        });

                        nameDataFault.push({
                            geometry: {
                                type: 'Point',
                                coordinates: newPosition,
                                point: item,
                            },
                            properties: {
                                text: item?.num,
                            },
                        });
                    }
                });
            }

            if (this.props.selProfessional?.specialty !== '8') {
                setTimeout(() => {
                    if (iconData.length > 0) {
                        iconData.forEach((item) => {
                            const icon = `${constants.MAP_PATH}/online_user.png`;
                            const iconLayer = createPointIconLayer({
                                icon,
                                data: [item],
                            });
                            this.bMapApi?.view.addLayer(iconLayer);
                            const point = createPoint(item.geometry.coordinates[0], item.geometry.coordinates[1]);
                            const marker = createMarker(point, {
                                icon,
                                iconSize: {
                                    width: 14,
                                    height: 42,
                                    anchor: {
                                        x: 7,
                                        y: 42,
                                    },
                                },
                            });
                            marker.setZIndex(499);
                            marker.addEventListener('click', (e) => {
                                if (this.rContentRef.current) {
                                    this.bMapApi?.map?.removeOverlay(this.rContentRef.current);
                                    this.bMapApi?.map?.enableScrollWheelZoom();
                                }
                                e.domEvent.preventDefault();
                                // e.domEvent.stopPropagation();
                                e.domEvent.stopImmediatePropagation();

                                // 获取DOM事件对象
                                const domEvent = e.domEvent || window.event;

                                // 方法1：直接使用 pageY（推荐）
                                const clickPageY = domEvent.pageY;
                                // 获取屏幕高度和限值
                                const screenHeight = window.innerHeight;

                                // 计算到屏幕底部的距离（使用视口坐标）
                                const viewportY = clickPageY - window.pageYOffset; // 转换为视口坐标
                                const distanceToBottom = screenHeight - viewportY;

                                const limitHeight = 378 - distanceToBottom;
                                const onlineArea = onlineData?.provinceOnlineDetailList?.find(
                                    (a) => Number(a.areaId) === Number(item.geometry?.point?.areaId),
                                );
                                const rContent = <OnlineUsers source={onlineArea?.onlineUsers || []} />;
                                const div = document.createElement('div');
                                div.innerHTML = ReactDOMServer.renderToString(rContent);
                                const overLabel = createLabel({
                                    html: div.innerHTML,
                                    offset: {
                                        x: -3,
                                        y: limitHeight > 0 ? -limitHeight - 25 : -20,
                                    },
                                    position: point,
                                });
                                overLabel.setStyle({
                                    border: 0,
                                    color: '#fff',
                                    display: 'block',
                                    background: 'transparent',
                                });
                                this.bMapApi?.map.addOverlay(overLabel);
                                this.bMapApi?.map?.disableScrollWheelZoom();
                                this.rContentRef.current = overLabel;
                            });
                            this.bMapApi?.map.addOverlay(marker);

                            layerArr.push(iconLayer);
                            onlineLayerArr.push(iconLayer);
                            onlineOverlayArr.push(marker);
                        });
                        if (nameData.length > 0) {
                            nameData.forEach((item) => {
                                const pointNameLayer = createPointTextLayer({ data: [item] });
                                this.bMapApi?.view.addLayer(pointNameLayer);
                                layerArr.push(pointNameLayer);
                                onlineLayerArr.push(pointNameLayer);
                            });
                        }
                    }
                }, 1000);

                if (iconDataFault.length > 0) {
                    iconDataFault.forEach((item) => {
                        const icon = `${constants.MAP_PATH}/area_point.svg`;
                        const iconLayer = createPointIconLayer({
                            icon,
                            data: [item],
                        });
                        this.bMapApi?.view.addLayer(iconLayer);
                        layerArr.push(iconLayer);
                    });
                }

                if (nameDataFault.length > 0 && this.props.mapMode === MAP_MODE.FAULT) {
                    nameDataFault.forEach((item) => {
                        const pointNameLayer = createPointTextLayer({ data: [item] });
                        this.bMapApi?.view.addLayer(pointNameLayer);
                        layerArr.push(pointNameLayer);
                    });
                }
            }

            this.setState({
                layerList: layerArr,
                onlineLayerList: onlineLayerArr,
            });
        }
    };

    setPathMapOutline = async () => {
        const areaInfo = this.mapConfigList.find((d) => [d.id, d.adcode].map(Number).includes(Number(this.props.areaId)));
        // eslint-disable-next-line no-nested-ternary
        const adcode = this.props.areaId === 'china' ? this.props.areaId : areaInfo?.adcode ? areaInfo.adcode : 'china';
        if (adcode) {
            const outlineJson: any = await BMap.getMapOutLineJson(adcode);
            // const outlineJson: any = await BMap.getMapGeoData(adcode);
            const opt = {
                data: outlineJson.features,
                enablePicked: false,
                autoSelect: false,
                border: true,
                fillColor: '#193e70',
                selectedFillColor: 'transparent', // 悬浮选中项颜色
                fillOpacity: 1,
                lineWidth: this.props.areaId === 'china' ? 1 : 0,
                lineColor: '#74EAF8',
                selectedLineColor: '#74EAF8',
            };
            if (this.props.areaId === 'china') {
                opt.lineWidth = 2;
            }
            const outlineMapLayer = createFeatureLayer({
                ...opt,
            });

            if (this.outlineMapLayer) {
                this.bMapApi?.view.removeLayer(this.outlineMapLayer);
            }
            this.bMapApi?.view.addLayer(outlineMapLayer);
            this.outlineMapLayer = outlineMapLayer;
        }
    };

    resetInitMap = () => {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        // reset
        if (this.preSelectedLayer) {
            this.preSelectedLayer.setOptions(mapStyle.common.path);
            this.highlightFeatureLayer.setData(null);
        }
        if (this.preSelectedNameLayer) {
            this.preSelectedNameLayer.setOptions(mapStyle.common.text);
            this.highlightTextLayer.setData(null);
        }
        if (this.props.onClick) {
            if (this.rContentRef.current) {
                this.bMapApi?.map?.removeOverlay(this.rContentRef.current);
                this.bMapApi?.map?.enableScrollWheelZoom();
            }
            this.props.onClick('', { info: { level: 'province', id: this.props.areaId === 'china' ? '0' : this.props.areaId } });
        }
        this.curMapItem.current = null;
    };

    setPathMap = (areaData) => {
        const { areaList } = this.state;
        if (this.bMapApi) {
            this.bMapApi.view.removeAllLayers();
            const that = this;

            const layerArr: any = areaData.features?.map((ele: any, index: number) => {
                const shapeLayer = createFeatureLayer({
                    data: [ele],
                    lineWidth: 1,
                    lineColor: '#74EAF8',
                    fillColor: '#193e70',
                    // fillOpacity: 1,
                    selectedFillColor: 'transparent', // 悬浮选中项颜色
                    onClick: async (e: any) => {
                        if (this.props.isOnline) {
                            return;
                        }
                        if (e.dataItem) {
                            if (this.curMapItem.current === e.dataItem) {
                                console.log('点击了相同的区域', e.dataItem);
                                this.resetInitMap();
                                return;
                            }
                            this.curMapItem.current = e.dataItem;
                            const id = e.dataItem.id || e.dataItem.properties?.adcode;
                            let currentAreaItemInfo: any = null;
                            if (this.mapConfigList) {
                                currentAreaItemInfo = this.mapConfigList.find((d) => d.id === id || String(d.adcode) === String(id));
                                const parentItem = this.mapConfigList.find((d) => String(d.adcode) === String(currentAreaItemInfo?.parent));
                                currentAreaItemInfo = { ...currentAreaItemInfo, parentId: parentItem?.id };
                            }
                            const { zoneLevelFlags, currentZoneId, benchType, mgmtZones } = this.props;

                            if (zoneLevelFlags && benchType) {
                                if (!zoneLevelFlags.isCountryZone && this.props.areaId === 'china') {
                                    if (zoneLevelFlags.isRegionZone) {
                                        const flag = mgmtZones.find((e) => e.zoneId === currentAreaItemInfo.id);
                                        if (!flag) {
                                            // eslint-disable-next-line consistent-return
                                            return message.error('无省份权限');
                                        }
                                    }
                                    if (zoneLevelFlags.isProvinceZone) {
                                        if (currentAreaItemInfo.id !== currentZoneId) {
                                            // eslint-disable-next-line consistent-return
                                            return message.error('无省份权限');
                                        }
                                    }
                                }
                            }
                            const enableSelect = _.isFunction(this.props.enableSelect)
                                ? // @ts-ignore
                                  this.props.enableSelect(currentAreaItemInfo)
                                : this.props.enableSelect;

                            if (enableSelect && typeof this.props.onClick === 'function') {
                                if (this.timer) {
                                    clearTimeout(this.timer);
                                    this.timer = null;
                                    return;
                                }
                                this.timer = setTimeout(() => {
                                    const { shapeLayerList, areaNameLayerList } = this.state;
                                    // reset
                                    if (this.preSelectedLayer) {
                                        this.preSelectedLayer.setOptions(mapStyle.common.path);
                                    }
                                    if (this.preSelectedNameLayer) {
                                        this.preSelectedNameLayer.setOptions(mapStyle.common.text);
                                    }
                                    // current
                                    const currentLayer = shapeLayerList[index];
                                    if (currentLayer) {
                                        this.highlightFeatureLayer.setData(currentLayer.getData());
                                        this.bMapApi?.view.addLayer(this.highlightFeatureLayer);
                                        this.preSelectedLayer = currentLayer;
                                    }
                                    const currentNameLayer = areaNameLayerList[index];
                                    if (currentNameLayer) {
                                        this.highlightTextLayer.setData(currentNameLayer.getData());
                                        this.bMapApi?.view.addLayer(this.highlightTextLayer);
                                        this.preSelectedNameLayer = currentNameLayer;
                                    }

                                    this.changeHeatmapZIndex(this.highlightTextLayer.options.renderOrder + 1);

                                    this.timer = null;

                                    if (this.props.onClick && currentAreaItemInfo) {
                                        if (this.rContentRef.current) {
                                            this.bMapApi?.map?.removeOverlay(this.rContentRef.current);
                                            this.bMapApi?.map?.enableScrollWheelZoom();
                                        }
                                        this.props.onClick(currentAreaItemInfo.id, { info: currentAreaItemInfo });
                                    }
                                }, 300);
                            }
                        }
                    },
                    onDblClick: async (e: any) => {
                        clearTimeout(this.timer);
                        if (e.dataItem && e.dataItem.properties) {
                            if (e.dataItem.id) {
                                const id = e.dataItem.id || e.dataItem.properties?.adcode;
                                let currentAreaItemInfo: any = null;
                                if (this.mapConfigList) {
                                    currentAreaItemInfo = this.mapConfigList.find((d) => d.id === id || String(d.adcode) === String(id));
                                    const parentItem = this.mapConfigList.find((d) => d.adcode === currentAreaItemInfo.parent);
                                    currentAreaItemInfo = { ...currentAreaItemInfo, parentId: parentItem?.id };
                                }
                                const { zoneLevelFlags, currentZoneId, benchType, mgmtZones } = this.props;

                                if (zoneLevelFlags && benchType && this.props.areaId === 'china') {
                                    if (!zoneLevelFlags.isCountryZone) {
                                        if (zoneLevelFlags.isRegionZone) {
                                            const flag = mgmtZones.find((e) => e.zoneId === currentAreaItemInfo.id);
                                            if (!flag) {
                                                // eslint-disable-next-line consistent-return
                                                return message.error('无省份权限');
                                            }
                                        }
                                        if (zoneLevelFlags.isProvinceZone) {
                                            if (currentAreaItemInfo.id !== currentZoneId) {
                                                // eslint-disable-next-line consistent-return
                                                return message.error('无省份权限');
                                            }
                                        }
                                    }
                                }

                                const enableDrilldown = _.isFunction(this.props.enableDrilldown)
                                    ? // @ts-ignore
                                      this.props.enableDrilldown(currentAreaItemInfo)
                                    : this.props.enableDrilldown;

                                if (enableDrilldown) {
                                    this.bMapApi?.view.removeAllLayers();
                                    const cp = e.dataItem.properties?.cp;
                                    const baiduPathConfig = BMap.getEnvConfig();
                                    const regions = baiduPathConfig?.regionZoom.filter((item) => item.id === parseFloat(e.dataItem.id));
                                    const region = regions.length > 0 ? regions[0] : null;
                                    const zoom = region && region.zoom ? region.zoom : 8;
                                    setTimeout(() => {
                                        this.bMapApi?.centerAndZoom(cp, zoom, e.dataItem.id);
                                        console.log('地图定位2：');
                                        console.log('cp', cp);
                                    }, 1000);
                                    // 导致地图重复渲染
                                    that.getPathMapConfig(e.dataItem.id);
                                    that.setState({ areaId: e.dataItem.id }, () => {
                                        // that.getFaultReportData();
                                    });

                                    if (typeof this.props.onChange === 'function' && currentAreaItemInfo) {
                                        this.props.onChange(currentAreaItemInfo.id, { info: currentAreaItemInfo });
                                    }
                                }
                            }
                        }
                    },
                });
                this.bMapApi?.view.addLayer(shapeLayer);
                return shapeLayer;
            });
            const nameData: any = [];
            areaList?.forEach((item) => {
                nameData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [item?.longitude, item?.latitude],
                    },
                    properties: {
                        text: item?.name,
                    },
                });
            });
            const nameLayerArr: any = [];
            const bigAreaId = ['754433304', '254116531', '-1264953364', '794451466', '-1551163024', '-1449683664'];
            const SelProfessional =
                (!this.props.selProfessional.specialty || this.props.selProfessional.specialty === '7') &&
                this.props.areaId !== 'china' &&
                !bigAreaId.includes(this.props.areaId)
                    ? [0, 0]
                    : [0, 0];
            setTimeout(() => {
                nameData.forEach((a) => {
                    const textLayer = createFeatureTextLayer({ data: [a], offset: SelProfessional });
                    this.bMapApi?.view.addLayer(textLayer);
                    nameLayerArr.push(textLayer);
                });
            }, 2000);

            this.setState({
                shapeLayerList: layerArr,
                areaNameLayerList: nameLayerArr,
            });
        }
    };

    changePath = (curId) => {
        const { areaCenter } = this.state;
        const currentItem = this.mapConfigList.find((d) => [Number(d.id), Number(d.adcode)].includes(Number(curId)));
        const areaId = currentItem?.adcode || 'china';
        if (this.bMapApi) {
            const baiduPathConfig = BMap.getEnvConfig();
            this.bMapApi.view.removeAllLayers();
            const cp = areaCenter[areaId];
            if (cp && cp.length > 1 && baiduPathConfig?.regionZoom) {
                const regions = baiduPathConfig?.regionZoom.filter((item) => item.id === parseFloat(areaId));
                const region = regions.length > 0 ? regions[0] : null;
                const offsetX = region && region.offsetX ? region.offsetX : 0;
                const offsetY = region && region.offsetY ? region.offsetY : 0;
                const zoom = region && region.zoom ? region.zoom : 8;

                const lng: number = cp[0] + offsetX;
                const lat: number = areaId === 'china' ? cp[1] : cp[1] + offsetY;
                setTimeout(() => {
                    this.bMapApi.centerAndZoom(BMap.createPoint(lng, lat), areaId === 'china' ? baiduPathConfig?.zoom : zoom);
                    console.log('地图定位3：');
                    console.log('areaId', areaId);
                    console.log('zoom', zoom);
                    console.log('cp', cp);
                }, 1000);

                if (areaId !== 'china') {
                    setTimeout(() => {
                        this.bMapApi?.map.setZoom(zoom);
                    }, 1000);
                }
            }
            this.setState({ areaId }, () => {
                const id = cp ? areaId : 'china';
                this.getPathMapConfig(id);
                this.getFaultReportData();
            });
        }
    };

    removeHeatmap = () => {
        if (this.bMapApi && this.preHeatLayer) {
            this.bMapApi.view.removeLayer(this.preHeatLayer);
            this.preHeatLayer = null;
        }
    };
    addHeatmap = async () => {
        this.removeHeatmap();

        if (!this.props.enableHeatmap) {
            return;
        }

        this.heatmapRenderCounter = +1;
        const currentCounter = this.heatmapRenderCounter;

        const params: any = {
            specialty: _.get(this, 'props.selProfessional.specialty'),
        };
        if (this.props.requestParamsFormatter) {
            const formatted = await this.props.requestParamsFormatter('heatmap', params);
            Object.assign(params, formatted || params);
        }

        const response = await getHeatmapDataApi(params);
        if (currentCounter !== this.heatmapRenderCounter) return;
        if (this.bMapApi) {
            this.removeHeatmap();

            const data: any = (response || []).map((item) => {
                return {
                    geometry: {
                        type: 'Point',
                        coordinates: [item.longitude, item.latitude],
                    },
                    properties: {
                        info: item,
                    },
                };
            });

            if (!_.isEmpty(data) && this.props.enableHeatmap) {
                const layer = createHeatmapLayer({ data });
                this.preHeatLayer = layer;
                this.bMapApi.view.addLayer(layer);
            }
        }
    };
    removeLinemap = () => {
        if (this.bMapApi && this.preLineLayer) {
            const { iconLayerList } = this.state;
            iconLayerList?.forEach((layer) => {
                this.bMapApi?.view.removeLayer(layer);
            });
            this.bMapApi.view.removeLayer(this.preLineLayer);
            this.preLineLayer = null;
        }
    };
    addLinemap = async () => {
        this.removeLinemap();

        if (!this.props.enableLinemap || this.props.areaId !== 'china') {
            return;
        }

        const layerArr: any = [];

        this.linemapRenderCounter = +1;
        const currentCounter = this.linemapRenderCounter;

        const params: any = {
            specialty: _.get(this, 'props.selProfessional.specialty'),
        };
        if (this.props.requestParamsFormatter) {
            const formatted = await this.props.requestParamsFormatter('heatmap', params);
            Object.assign(params, formatted || params);
        }

        const responseData = await getLineDataApi(params);
        const response = responseData.mapDatas?.filter((e) => e.startLongAndLat.longitude && e.endLongAndLat.longitude);
        if (currentCounter !== this.linemapRenderCounter) return;
        if (this.bMapApi) {
            this.removeLinemap();

            const data: any = (response || []).map((item) => {
                return {
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [item.startLongAndLat.longitude, item.startLongAndLat.latitude],
                            [item.endLongAndLat.longitude, item.endLongAndLat.latitude],
                        ],
                    },
                    color: item.isAlarm ? 'rgb(255, 0, 0)' : 'rgb(0, 255, 255)',
                    properties: {
                        info: item,
                    },
                };
            });

            const iconData1 = response.map((ites) => {
                return ites.startLongAndLat;
            });
            const iconData2 = response.map((ites) => {
                return ites.endLongAndLat;
            });
            const iconData3 = response
                .filter((e) => e.isAlarm)
                .map((ites) => {
                    return ites.startLongAndLat;
                });
            const iconData4 = response
                .filter((e) => e.isAlarm)
                .map((ites) => {
                    return ites.endLongAndLat;
                });
            const iconDatas = iconData1.concat(iconData2);
            const iconDatas2 = iconData3.concat(iconData4);
            if (!_.isEmpty(data) && this.props.enableLinemap) {
                const layer = createLineLayer({
                    icon: '',
                    data,
                    onClick: (item) => {
                        if (item.dataItem?.properties?.info) {
                            this.props?.showLineModal(item.dataItem?.properties?.info);
                        }
                    },
                });
                this.preLineLayer = layer;
                this.bMapApi.view.addLayer(layer);
                iconDatas.forEach((items) => {
                    const isAlarm = iconDatas2.find((e) => e.longitude === items.longitude);
                    const iconLayer = createIconLayer({
                        width: 30,
                        height: 30,
                        icon: isAlarm ? `${constants.IMAGE_PATH}/group-workbench/offline.png` : `${constants.IMAGE_PATH}/group-workbench/online.png`,
                        offset: [0, 0],
                        data: [
                            {
                                geometry: {
                                    type: 'Point',
                                    coordinates: [items.longitude, items.latitude],
                                },
                            },
                        ],
                    });
                    layerArr.push(iconLayer);
                    this.bMapApi?.view.addLayer(iconLayer);
                });
                this.setState({
                    iconLayerList: layerArr,
                });
            }
        }
    };
    removeRelatedLinemap = () => {
        if (this.bMapApi && this.relateLineLayer) {
            const { iconLayerRelatedList } = this.state;
            iconLayerRelatedList?.forEach((layer) => {
                this.bMapApi?.view.removeLayer(layer);
            });
            this.bMapApi.view.removeLayer(this.relateLineLayer);
            this.relateLineLayer = null;
        }
        this.setState({
            iconLayerRelatedList: [],
        });
    };
    addRelatedLine = async () => {
        this.removeRelatedLinemap();

        const layerArr: any = [];

        this.linemapRenderCounter = +1;
        const currentCounter = this.linemapRenderCounter;

        const params: any = {
            specialty: _.get(this, 'props.selProfessional.specialty'),
        };
        if (this.props.requestParamsFormatter) {
            const formatted = await this.props.requestParamsFormatter('heatmap', params);
            Object.assign(params, formatted || params);
        }
        const query = { provinceId: this.props.areaId === 'china' ? 0 : this.props.areaId, equipmentId: this.props.selectedCard.equipmentId };
        if (this.props.areaId === 'china' && this.props.zoneLevelFlags?.isRegionZone) {
            query.provinceId = this.props.currentZoneId;
        }
        const responseDatas = await getFaultEquipmentInfo(query);
        if (+responseDatas.code !== 200) {
            message.error('请求失败');
            this.props.setRelatedVisible(false);
            return;
        }
        // 故障网元的type是1
        const info = responseDatas.data.equipmentInfos?.find((item) => item.type === 1);
        // const info = [].find((item) => item.type === 1);
        // 如图获取的故障网元信息为空，则不展示浮窗
        if (info) {
            this.props.setRelatedVisible(true);
            const { x, y } = this.bMapApi?.map.pointToPixel(new window.BMapGL.Point(info?.lonAndLatRq.longitude, info?.lonAndLatRq.latitude));
            this.setState(
                {
                    floatWindowInfo: {
                        systemInfo: info.transSystem || '--',
                        NEInfo: info.equipmentName || '--',
                        reuse: info.segName || '--',
                        left: x,
                        top: y,
                        lonAndLatRq: info.lonAndLatRq,
                    },
                },
                () => {
                    this.props.setFloatingWindowInfo({
                        systemInfo: info.transSystem || '--',
                        NEInfo: info.equipmentName || '--',
                        reuse: info.segName || '--',
                        left: x,
                        top: y,
                    });
                },
            );
        } else {
            this.props.setRelatedVisible(false);
        }

        const response = responseDatas.data.onlineInfos?.filter((e) => e.startLongAndLat.longitude && e.endLongAndLat.longitude);
        if (currentCounter !== this.linemapRenderCounter) return;
        if (this.bMapApi) {
            this.removeRelatedLinemap();

            const data: any = (response || []).map((item) => {
                return {
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [item.startLongAndLat.longitude, item.startLongAndLat.latitude],
                            [item.endLongAndLat.longitude, item.endLongAndLat.latitude],
                        ],
                    },
                    color: 'rgb(255, 0, 0)',
                    properties: {
                        info: item,
                    },
                };
            });

            if (!_.isEmpty(data) || (!_.isEmpty(responseDatas.data.equipmentInfos) && this.props.showRelatedLine)) {
                const layer = createLineLayer({
                    icon: '',
                    data,
                    onClick: (item) => {},
                });

                this.relateLineLayer = layer;
                this.bMapApi.view.addLayer(layer);
                responseDatas.data.equipmentInfos?.forEach((items) => {
                    const iconLayer = createIconLayer({
                        width: 22,
                        height: 22,
                        icon:
                            items.type === 1
                                ? `${constants.IMAGE_PATH}/group-workbench/unrelated.png`
                                : `${constants.IMAGE_PATH}/group-workbench/related.png`,
                        offset: [0, 0],
                        data: [
                            {
                                geometry: {
                                    type: 'Point',
                                    coordinates: [items.lonAndLatRq.longitude, items.lonAndLatRq.latitude],
                                },
                            },
                        ],
                        enablePicked: true,
                        // selectedIndex: -1, // 选中项
                        onRightClick: (e) => {
                            if (e.dataItem) {
                                // 点击会触发所有点的点击事件，这边是把点击的故障点筛选出来了
                                const clickCoordinates = JSON.stringify(e.dataItem.geometry.coordinates);
                                const faultItem = responseDatas.data.equipmentInfos?.find((el) => el.type === 1);
                                const faultCoordinates = JSON.stringify([faultItem?.lonAndLatRq.longitude, faultItem?.lonAndLatRq.latitude]);

                                if (clickCoordinates === faultCoordinates && !this.props.relatedVisible) {
                                    this.props.setRelatedVisible?.(true);
                                }
                            }
                        },
                    });
                    layerArr.push(iconLayer);
                    this.bMapApi?.view.addLayer(iconLayer);
                });
                this.setState({
                    iconLayerRelatedList: layerArr,
                });
            }
        }
    };

    changeHeatmapZIndex = (zIndex: number) => {
        if (this.preHeatLayer && this.bMapApi) {
            const layer: any = this.preHeatLayer;
            layer.options.renderOrder = zIndex;
            this.bMapApi.view.removeLayer(this.preHeatLayer);
            this.bMapApi.view.addLayer(layer);
        }
    };

    // [p: string]: any;

    render() {
        const { props, state } = this;
        const { currentZoneId } = this.props;

        return (
            <div className="map-path">
                <div
                    id={props.id}
                    className="map-path-container"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />
                {this.props.areaId === 'china' && <img className="outline-map" alt="南海九段线" src={jiuduanxian} />}
                {/* 附件 */}
                {props.enableRollupButton && state.areaId !== 'china' && state.areaId !== currentZoneId && (
                    <span className="btn-rollup" onClick={props.onRollupButtonClick}>
                        <Image src={`${constants.MAP_PATH}/btn-back.png`} preview={false} />
                    </span>
                )}
            </div>
        );
    }
}

export default Index;

export { MAP_MODE, isProfessionalWithHeatmap, isProfessionalWithLinemap };
