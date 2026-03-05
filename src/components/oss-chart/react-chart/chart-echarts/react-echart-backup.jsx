import React from 'react';
import PropTypes from 'prop-types';
import * as ec from 'echarts';
import { _ } from 'oss-web-toolkits';
import { withResizeDetector } from 'react-resize-detector';

class ReactEChart extends React.PureComponent {
    static defaultProps = {
        themeName: undefined,
        theme: undefined,
        option: {},
        notMerge: false,
        lazyUpdate: false,
        silent: false,
        isClear: false,

        /**
         * {
         *    [eventName]:()=>{},
         *    [eventName]:{
         *       query:{}
         *       callback:()=>{}
         *    }
         * }
         */
        events: {},
        actionParams: undefined, // action的参数

        rebuildOption: undefined, // 重置option
        getChartInstance: undefined, // 获取图表实例
        onBeforeUpdateOption: undefined, // 更新option之前
    };

    static propTypes = {
        themeName: PropTypes.string,
        theme: PropTypes.object,
        option: PropTypes.object,
        notMerge: PropTypes.bool,
        lazyUpdate: PropTypes.bool,
        silent: PropTypes.bool,

        events: PropTypes.object,

        rebuildOption: PropTypes.func,
        getChartInstance: PropTypes.func,
        onBeforeUpdateOption: PropTypes.func,
    };

    // constructor(props) {
    //     super(props);
    //     this._setOption = _.debounce(this._setOption.bind(this));
    // }

    //#region private
    _domRef = React.createRef();
    _chartInstance = undefined;
    _optionCache = undefined;

    // 获取实例
    _getChartInstance = () => {
        if (_.isFunction(this.props.getChartInstance)) {
            this.props.getChartInstance(this._chartInstance);
        }
    };
    // 初始化实例
    _initChart = () => {
        this._chartInstance = ec.init(this._domRef.current);
        this._getChartInstance();
    };
    // 设置数据 -- 其实这样不合理，可以分开setOption
    _setOption = (preProps = {}) => {
        const props = this.props;
        if (this._chartInstance) {
            let fullOption = props.option;
            if (_.isFunction(props.rebuildOption)) {
                fullOption = props.rebuildOption(fullOption);
            }
            const { notMerge, lazyUpdate, silent } = props;
            if (this.props.isClear) {
                this._chartInstance.clear();
            }
            let optionUpdateFlag = false;
            if (this._optionCache !== fullOption) {
                this._optionCache = fullOption;
                optionUpdateFlag = true;
            }

            if (preProps.notMerge !== notMerge || preProps.lazyUpdate !== lazyUpdate || preProps.silent !== silent || optionUpdateFlag) {
                optionUpdateFlag = false;

                if (_.isFunction(props.onBeforeUpdateOption)) {
                    props.onBeforeUpdateOption();
                }

                // FIXME: echarts缓存的visualMap没有办法换掉，这时候notMerge就起到了作用
                this._chartInstance.setOption(fullOption, { notMerge, lazyUpdate, silent });
            }
        }
    };
    // 销毁
    _disposeChart = () => {
        this._unbindEvents();
        this._chartInstance.dispose();
        this._chartInstance = null;
        this._optionCache = undefined;
        this._getChartInstance();
    };
    _resize = () => {
        if (this._chartInstance) {
            this._chartInstance.resize();
        }
    };
    // 绑定事件
    _bindEvents = () => {
        const events = this.props.events;
        const eventKeys = Object.keys(events || {});
        if (eventKeys.length > 0 && this._chartInstance) {
            eventKeys.forEach((eventName) => {
                this._chartInstance.off(eventName);

                /**
                 * georoam事件在echarts中没有暴漏出相关属性，这里劫持下，手动获取当前地图的options返回需要暴漏的属性
                 * 目的不想让外界操控echarts本身的options
                 */

                if (eventName === 'georoam') {
                    this._chartInstance.on(eventName, (e) => {
                        const options = this._chartInstance.getOption();

                        events[eventName]({
                            ...e,
                            type: 'georoam',
                            data: options.geo.map((item) => {
                                return { zoom: item.zoom, center: item.center, map: item.map };
                            }),
                        });
                    });

                    return;
                }

                const ev = events[eventName] || {};
                let arg1, arg2;
                if (_.isFunction(ev)) {
                    arg1 = ev;
                } else {
                    arg1 = ev.query;
                    arg2 = ev.callback;
                }
                const args = [arg1, arg2].filter(Boolean);
                this._chartInstance.on(eventName, ...args);
            });
        }
    };
    // 解绑事件
    _unbindEvents = () => {
        const events = this.props.events;
        const eventKeys = Object.keys(events);
        if (eventKeys.length > 0 && this._chartInstance) {
            eventKeys.forEach((eventName) => {
                this._chartInstance.off(eventName);
            });
        }
    };

    // action
    _dispatchAction = () => {
        if (this.props.actionParams && this._chartInstance) {
            this._chartInstance.dispatchAction(this.props.actionParams);
        }
    };
    //#endregion

    render() {
        // const { width, height } = this.props;
        // console.log(width, height);
        return (
            <div className="react-echart-container" key="react-echart-container" style={{ width: '100%', height: '100%' }}>
                <div className="react-echart" key="react-echart" style={{ width: '100%', height: '100%' }} ref={this._domRef} />
            </div>
        );
    }

    componentDidMount() {
        this._initChart();
        this._setOption();
        this._resize();
        this._bindEvents();
        this._dispatchAction();
    }

    componentDidUpdate(preProps) {
        if (preProps.theme !== this.props.theme || preProps.themeName !== this.props.themeName) {
            this._initChart();
        }
        // 并不是使用preProps进行渲染
        this._setOption(this.props);
        // resize
        if (preProps.width !== this.props.width || preProps.height !== this.props.height) {
            this._resize();
        }

        if (!_.isEqual(this.props.actionParams, preProps.actionParams) && this.props.actionParams) {
            this._dispatchAction();
        }
    }

    componentWillUnmount() {
        this._disposeChart();
    }
}

export default withResizeDetector(ReactEChart);
