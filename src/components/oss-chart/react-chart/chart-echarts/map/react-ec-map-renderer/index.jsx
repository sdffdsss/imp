import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { _ } from 'oss-web-toolkits';
import { _isEqual } from '@Components/oss-chart/utils';
import ChartEnums from '@Components/oss-chart/chart-enums';
import ReactEChart, { registerMap } from '../../react-echart';
import { getMapLayer } from '../layers-utils';

// EChartMapRenderer
class EChartMapRenderer extends PureComponent {
    static defaultProps = {
        notMerge: undefined,

        // 地图基础配置
        layer: undefined, // 图层名称 枚举 or 字符串
        mapName: 'china', // 地图名称
        mapLevel: ChartEnums.mapLayerLevelTypes.china,
        zoom: 1.15,
        selectedMode: false,

        // local配置
        loadMapConfig: undefined, // 导入配置
        mapConfig: undefined, // 外部直接指定地图配置
        loadMapGeoJson: undefined, // 导入地图geoJson
        geoJson: undefined, // 外部直接指定额geoJson
        registerMap: undefined, // 注册地图的回调,用于处理多个地图的情况,这块看下下面的代码

        actionParams: undefined,

        // 通用配置
        rebuildOption: undefined, // 重置地图的配置信息
        data: undefined, // 数据
        events: {}, // 事件
        errorElement: null, // 错误的时候显示的内容
    };

    static propTypes = {
        notMerge: PropTypes.bool,

        layer: PropTypes.any.isRequired, // 枚举 or 字符串
        mapName: PropTypes.string,
        mapLevel: PropTypes.any,
        zoom: PropTypes.number,
        selectedMode: PropTypes.oneOf([false, 'single', 'multiple']),

        loadMapConfig: PropTypes.func,
        loadMapGeoJson: PropTypes.func,
        mapConfig: PropTypes.object,
        geoJson: PropTypes.object,
        registerMap: PropTypes.func,

        rebuildOption: PropTypes.func,
    };

    state = {
        option: {
            // geo: {},
            // tooltip: {},
            // visualMap: null,
            // series: [],
        },
        mapConfig: {},
        layer: undefined,

        mapHasError: false,

        // 带下划线的state慎用,一定不要主动轻易的去改变
        _forceUpdateEChartMapFlag: false,
        _registerMapFinished: false,
        _mapName: undefined,
    };

    //#region private
    _destroyed = false;
    _isDestroyed = () => !this || this._destroyed;
    // 导入地图配置
    _loadMapConfig = () => {
        const { layer } = this.state;
        const props = this.props;

        let loadConfigPromise = undefined;

        if (props.mapConfig) {
            loadConfigPromise = Promise.resolve(props.mapConfig);
        } else {
            if (typeof props.loadMapConfig === 'function') {
                loadConfigPromise = props.loadMapConfig();
            } else {
                if (layer) {
                    loadConfigPromise = layer.loadConfig(this.props);
                }
            }
        }

        return new Promise((resolve) => {
            if (!loadConfigPromise) {
                resolve();
            }

            loadConfigPromise
                .then((mapConfig) => {
                    if (this._isDestroyed() || !mapConfig) return;

                    resolve(mapConfig);
                })
                .catch((e) => {
                    resolve();
                });
        });
    };
    // 注册地图
    _registerMap = (config) => {
        const { layer, mapConfig: configFromState } = this.state;
        const props = this.props;

        const mapConfig = config || configFromState;
        let loadMapGeoJsonPromise = undefined;

        // 这里强制清除了地图的数据, 测试的时候发现geo图层有缓存~~~~
        this._clearChart();
        this.setState({
            _registerMapFinished: false,
        });
        // 外部自行注册
        if (_.isFunction(props.registerMap)) {
            loadMapGeoJsonPromise = new Promise((resolve, reject) => {
                props.registerMap({
                    success: resolve,
                    error: reject,
                    registerMap,
                });
            });
        } else {
            if (props.geoJson) {
                loadMapGeoJsonPromise = Promise.resolve(props.geoJson);
            } else {
                if (typeof props.loadMapGeoJson === 'function') {
                    loadMapGeoJsonPromise = props.loadMapGeoJson(mapConfig);
                } else {
                    loadMapGeoJsonPromise = layer.loadMapGeoJson(this.props, mapConfig);
                }
            }

            loadMapGeoJsonPromise = loadMapGeoJsonPromise.then((geoJson) => {
                if (this._isDestroyed()) return;

                if (!props.mapName || !geoJson) {
                    console.error(`地图名称 或 地图json 未定义`);
                    return Promise.reject();
                }

                registerMap(props.mapName, geoJson);
                return Promise.resolve(true);
            });
        }

        loadMapGeoJsonPromise
            .then(() => {
                // update
                this.setState({
                    _forceUpdateEChartMapFlag: true,
                    _registerMapFinished: true,
                    mapHasError: false,
                });
            })
            .catch((e) => {
                console.log(e);
                this._mapHasError();
            });
    };
    _chartInstance = undefined;
    _getChartInstance = (ins) => {
        this._chartInstance = ins;
    };
    _clearChart = () => {
        if (this._chartInstance) {
            this._chartInstance.clear();
        }
    };
    _mapHasError = () => {
        this.setState({
            mapHasError: true,
        });
    };
    //#endregion

    //#region life circle
    static getDerivedStateFromProps(props, state) {
        const layerEnum = ChartEnums.mapLayerTypes.get(props.layer);

        if (!layerEnum) {
            console.error('请在枚举中定义地图图层枚举');
            return state;
        }

        const layer = getMapLayer(layerEnum.id);

        /**
         * 这里对state进行了处理, 有直接赋值的
         * 是因为这个生命周期是同步的, 并且没有 this (～￣▽￣)～
         */
        if (state.layer !== layer) {
            state.layer = layer;
        }

        /**
         * 当地图名称发生变化的时候，地图需要重新注册,
         * option应该重置掉
         */
        if (props.mapName !== state._mapName) {
            state.option = {};
            state._mapName = props.mapName;
            state._registerMapFinished = false;
        }

        // 地图未注册完成之前,不进行option的计算
        if (!state._registerMapFinished) return state;

        const { mapConfig, option: stateOption } = state;
        const omittedProps = _.omit(props, ['rebuildOption']);
        const extraConfig = { mapConfig };
        const option = {
            geo: layer.geo(omittedProps, stateOption.geo, extraConfig),
            tooltip: layer.tooltip(omittedProps, stateOption.tooltip, extraConfig),
            visualMap: layer.visualMap(omittedProps, stateOption.visualMap, extraConfig),
            series: layer.series(omittedProps, stateOption.series, extraConfig),
        };

        if (!_isEqual(state.option, option)) {
            state = Object.assign({}, state, { option });
        }

        // 调用外部的重置option的方法
        if (typeof props.rebuildOption === 'function') {
            state.option = props.rebuildOption(state.option, extraConfig);
        }

        // 当地图注册完成后, 需要重新渲染echarts的地图
        // 如果调用重置这个api一定要知道直接想要干嘛, 别因为出不来就直接调用
        if (state._forceUpdateEChartMapFlag) {
            state._forceUpdateEChartMapFlag = false;
            state.option = { ...state.option };
        }

        return state;
    }
    //#endregion

    render() {
        const { events, errorElement: ErrorElement, notMerge, actionParams } = this.props;
        const { option, mapHasError } = this.state;
        if (mapHasError) return ErrorElement ? <ErrorElement /> : <div>地图有错误,请查看控制台</div>;

        return (
            <ReactEChart option={option} getChartInstance={this._getChartInstance} events={events} notMerge={notMerge} actionParams={actionParams} />
        );
    }

    //#region life circle
    async componentDidMount() {
        // 更新
        const mapConfig = await this._loadMapConfig();
        if (!mapConfig) {
            console.error('请加载地图相关配置');
            return;
        }
        this.setState({ mapConfig }, () => {
            this._registerMap(mapConfig);
        });
    }

    componentDidUpdate(preProps, preState) {
        // 更新
        const { props } = this;
        // fixme:只验证了mapName？？
        // if (preProps.mapName !== props.mapName || preProps.data !== props.data) {
        //     this._registerMap();
        // }
        if (preProps.mapName !== props.mapName) {
            this._registerMap();
        }
        if (preProps.data !== props.data && this._chartInstance) {
            let options = this._chartInstance.getOption();
            if (options.series[0]) {
                options.series[0].data = props.data;
                this._chartInstance.setOption(options);
            }
        }
        // if (preProps.mapName !== props.mapName) {
        //     this._registerMap();
        // }
    }

    componentWillUnmount() {
        this._destroyed = true;
    }
    //#endregion
}

export default EChartMapRenderer;
