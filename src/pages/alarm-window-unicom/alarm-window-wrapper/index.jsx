/* eslint-disable consistent-return */
import React from 'react';
import GridLayout, { WidthProvider } from 'react-grid-layout';
import WindowCardWrapper from '../window-card';
import AlarmDetailContainer from '@Components/alarm-detail-container';
import FloatButton from '@Components/float-button';
import shareActions from '@Src/share/actions';
import { withResizeDetector } from 'react-resize-detector';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import produce from 'immer';
import getBtnList from '../common/btn-list';
import GlobalMessage from '@Src/common/global-message';
import { windowTypeEnum } from '../common/enums';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(GridLayout);

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            layout: [],
            layoutChildrenDom: [],
            drawerData: {},
            drawerStatus: 'close',
        };
        this.currentViewMode = 'flowlayout'; // 当前的布局模式
        this.preViewMode = 'flowlayout'; // 记录上一个布局方式
        this.isFullScreen = false; // 是否全屏
        this.onMaxShowIndex = -1; // 最大化
        this.alarmDetailInfo = null;
    }

    componentDidMount() {
        this.watchExitFullScreen();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.height !== this.props.height || !_.isEqual(prevProps.selectedRows, this.props.selectedRows)) {
            this.generateView();
        }

        if (prevProps.login.systemInfo.theme !== this.props.login.systemInfo.theme) {
            const { layout } = this.state;
            this.setState({
                layoutChildrenDom: this.generateDOM(layout),
            });
        }
        this.watchTabActiveChange();
    }

    componentWillUnmount() {
        document.removeEventListener('fullscreenchange', this.onFullScreenChange);
        GlobalMessage.off('activeChanged', this.tabActiveChangeHandle, null);
    }

    tabActiveChangeHandle = ({ isActive }) => {
        if (isActive) {
            // TODO: 框架传递isActive的时页面dom渲染可能没完成，故加延时两秒等到页面渲染
            setTimeout(() => {
                if (document.createEvent) {
                    const event = document.createEvent('HTMLEvents');
                    event.initEvent('resize', true, true);
                    window.dispatchEvent(event);
                } else if (document.createEventObject) {
                    window.fireEvent('onresize');
                }
            }, 2000);
        }
    };

    /**
     * @description: 主框架切换tab 手动触发一次resize
     * @param {*}
     * @return {*}
     */
    watchTabActiveChange = () => {
        GlobalMessage.off('activeChanged', this.tabActiveChangeHandle, null);
        GlobalMessage.on('activeChanged', this.tabActiveChangeHandle);
    };

    /**
     * @description: 监听全屏事件
     * @param {*}
     * @return {*}
     */
    watchExitFullScreen = () => {
        document.addEventListener('fullscreenchange', this.onFullScreenChange);
    };

    /**
     * @description: 重置布局
     * @param {*} mode 布局类型
     * @return {*}
     */
    generateView = (mode) => {
        // if (!mode) {
        //     return;
        // }
        const { drawerStatus } = this.state;
        if (mode !== 'maxOne') {
            this.onMaxShowIndex = -1;
        }
        const viewMode = mode || this.currentViewMode;
        let layout = this.generateLayout(viewMode);
        if (drawerStatus === 'fixed') {
            layout = layout.map((item) => ({ ...item, x: item.x * 0.8, w: item.w * 0.8 }));
        }
        this.setState({
            layout,
            layoutChildrenDom: this.generateDOM(layout),
        });
    };

    /**
     * @description: 布局监听
     * @param {*} type: 布局方式
     * @return {*}
     */
    generateLayout = (type) => {
        /**
         * gird最终的高度不是简单的rowHeight * h值
         * 源码 https://github.com/STRML/react-grid-layout/blob/83251e5e682abfa3252ff89d4bacf47fdc1f4270/lib/calculateUtils.js
         * h值应为源码中calcWH方法的逆运算
         */
        const { selectedRows, windowType } = this.props;
        const selectedRowsLength = selectedRows.length;
        const { height } = this.props;
        const fullH = window.innerHeight;
        const commonH = this.isFullScreen ? fullH : height;

        // 平铺模式下布局
        const getFlowlayout = (index, totalH) => {
            const maxH = Math.floor(totalH / (10 + 1));
            const layOutMap = [
                [{ x: 0, y: 0, w: 24, h: maxH }],
                [
                    { x: 0, y: 0, w: 12, h: maxH },
                    { x: 12, y: 0, w: 12, h: maxH },
                ],
                [
                    { x: 0, y: 0, w: 12, h: maxH },
                    { x: 12, y: 0, w: 12, h: maxH / 2 },
                    { x: 12, y: 12, w: 12, h: maxH / 2 },
                ],
                [
                    { x: 0, y: 0, w: 12, h: maxH / 2 },
                    { x: 12, y: 0, w: 12, h: maxH / 2 },
                    { x: 0, y: 12, w: 12, h: maxH / 2 },
                    { x: 12, y: 12, w: 12, h: maxH / 2 },
                ],
                [
                    { x: 0, y: 0, w: 12, h: maxH / 2 },
                    { x: 12, y: 0, w: 12, h: maxH / 3 },
                    { x: 0, y: 12, w: 12, h: maxH / 2 },
                    { x: 12, y: 8, w: 12, h: maxH / 3 },
                    { x: 12, y: 16, w: 12, h: maxH / 3 },
                ],
                [
                    { x: 0, y: 0, w: 12, h: maxH / 3 },
                    { x: 12, y: 0, w: 12, h: maxH / 3 },
                    { x: 0, y: 8, w: 12, h: maxH / 3 },
                    { x: 12, y: 8, w: 12, h: maxH / 3 },
                    { x: 0, y: 16, w: 12, h: maxH / 3 },
                    { x: 12, y: 16, w: 12, h: maxH / 3 },
                ],
            ];
            return layOutMap[selectedRowsLength - 1][index];
        };
        // 全屏模式下布局
        const getItemHeightByType = (index) => {
            if (this.onMaxShowIndex !== -1) {
                return commonH / (10 + 1);
            }
            switch (this.preViewMode) {
                case 'flowlayout':
                    return getFlowlayout(index, commonH)?.h;
                case 'vertical':
                    return commonH / (10 + 1);
                case 'horizontal':
                    return commonH / selectedRowsLength / (10 + 1);
                default:
                    return commonH / (10 + 1);
            }
        };
        if (type === 'vertical') {
            return selectedRows.map((item, i) => {
                return {
                    x: i * 1 * (24 / selectedRowsLength),
                    y: 0,
                    w: 24 / selectedRowsLength,
                    h: commonH / (10 + 1),
                    i: windowType === windowTypeEnum.DUTY ? item.windowId.toString() : i.toString(),
                };
            });
        }
        if (type === 'horizontal') {
            return selectedRows.map((item, i) => {
                return {
                    x: 0,
                    y: i * 1 * (24 / selectedRowsLength),
                    w: 24,
                    h: commonH / selectedRowsLength / (10 + 1),
                    i: windowType === windowTypeEnum.DUTY ? item.windowId.toString() : i.toString(),
                };
            });
        }

        if (type === 'flowlayout') {
            return selectedRows.map((item, i) => {
                return { ...getFlowlayout(i, commonH), i: windowType === windowTypeEnum.DUTY ? item.windowId.toString() : i.toString() };
            });
        }

        if (type === 'fullscreen') {
            return this.state.layout.map((item, i) => {
                return {
                    ...item,
                    h: getItemHeightByType(i),
                };
            });
        }

        if (type === 'maxOne') {
            return selectedRows.map((item, i) => {
                return {
                    x: i === this.onMaxShowIndex ? 0 : 24,
                    y: i === this.onMaxShowIndex ? 0 : 24,
                    w: i === this.onMaxShowIndex ? 24 : -1,
                    h: i === this.onMaxShowIndex ? commonH / (10 + 1) : -1,
                    i: windowType === windowTypeEnum.DUTY ? item.windowId.toString() : i.toString(),
                };
            });
        }
    };

    /**
     * @description: 一组流水窗布局
     * @param {*} layout 单组流水窗位置及大小布局
     * @return {*}
     */
    generateDOM(layout) {
        const {
            login: { systemInfo },
            selectedRows,
            windowType,
            onCellClick,
        } = this.props;
        console.log(selectedRows, '==selectRows');
        return layout.map((l, i) => {
            const onMaXshow = this.onMaxShowIndex === i;
            return windowType === windowTypeEnum.DUTY ? (
                <div key={`${l.i}`}>
                    <WindowCardWrapper
                        i={`${l.i}`}
                        selectedRows={_.find(selectedRows, { windowId: Number(l.i) })}
                        onDeleteItem={this.onDeleteItem.bind(this, i)}
                        onMaXshow={onMaXshow}
                        onMaxShowItem={this.onMaxShowItem.bind(this, onMaXshow, i)}
                        theme={systemInfo?.theme}
                        onTableSelect={this.onTableSelect}
                        onAlarmDetailStatusChange={this.onAlarmDetailStatusChange}
                        windowType={windowType}
                        onCellClick={onCellClick}
                        operId={this.props.operId}
                    />
                </div>
            ) : (
                <div key={i}>
                    <WindowCardWrapper
                        i={i}
                        selectedRows={[...selectedRows]}
                        onDeleteItem={this.onDeleteItem.bind(this, i)}
                        onMaXshow={onMaXshow}
                        onMaxShowItem={this.onMaxShowItem.bind(this, onMaXshow, i)}
                        theme={systemInfo?.theme}
                        onTableSelect={this.onTableSelect}
                        onAlarmDetailStatusChange={this.onAlarmDetailStatusChange}
                        windowType={windowType}
                        onCellClick={onCellClick}
                        operId={'400001'}
                    />
                </div>
            );
        });
    }

    /**
     * @description: 监听全屏事件
     * @param {*}
     * @return {*}
     */
    onFullScreenChange = () => {
        if (!document.fullscreenElement) {
            this.isFullScreen = false;
            if (this.onMaxShowIndex !== -1) {
                this.generateView('maxOne');
            } else {
                this.currentViewMode = this.preViewMode;
                this.generateView();
            }
        } else {
            this.isFullScreen = true;
            this.currentViewMode = 'fullscreen';
            this.generateView();
        }
    };

    /**
     * @description: 删除流水窗集合
     * @param {*}
     * @return {*}
     */
    onDeleteItem = (i) => {
        const { selectedRows, windowType } = this.props;
        const newSelectedRows = produce(selectedRows, (draft) => {
            draft.splice(i, 1);
        });
        this.onMaxShowIndex = -1;
        if (newSelectedRows.length === 0) {
            const { actions, messageTypes } = shareActions;
            if (actions?.postMessage) {
                actions.postMessage(messageTypes.closeTabs, {
                    entry:
                        windowTypeEnum.DUTY === windowType
                            ? `/unicom/home-work/alarm-window-unicom/duty-window`
                            : `/unicom/home-work/alarm-window-unicom/custom-window`,
                });
            }
        } else {
            this.generateView(this.preViewMode);
        }
        this.props.onSelectedRowsChange(newSelectedRows);
    };

    /**
     * @description: 获取流水窗视图展示方式
     * @param {*} type 视图展示方式  vertical: 垂直 horizontal: 水平 flowlayout：平铺 fullscreen：全屏
     * @return {*}
     */
    onWidgetsItemClickHandle = (type) => {
        if (type === 'customView') {
            this.props.openWindowModal();
            return;
        }
        if (type === 'fullscreen') {
            this.fullScreen();
            return;
        }
        this.preViewMode = type;
        this.onMaxShowIndex = -1;
        this.currentViewMode = type;
        this.generateView();
    };

    /**
     * @description: 全屏事件
     * @param {*}
     * @return {*}
     */
    fullScreen = async () => {
        const {
            login: { container },
        } = this.props;
        if (container && !document.fullscreenEnabled) {
            return;
        }
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            container.requestFullscreen();
        }
    };

    /**
     * @description: 最大化操作
     * @param {*}
     * @return {*}
     */
    onMaxShowItem = (onMax, i) => {
        this.onMaxShowIndex = onMax ? -1 : i;
        const mode = onMax ? this.preViewMode : 'maxOne';
        this.generateView(mode);
    };

    onTableSelect = (selectRowKeys, registerInfo, clickType) => {
        const { drawerStatus } = this.state;
        this.alarmDetailInfo = { selectRowKeys, registerInfo, clickType };
        if (clickType === 'click' && ['open', 'unfold', 'fixed', 'free'].includes(drawerStatus)) {
            this.setState({ drawerData: { sessionId: registerInfo.clientSessionId, selectRowKey: selectRowKeys[0] } });
        }
    };

    /**
     * @description: 告警详情切换
     * @param {*}
     * @return {*}
     */
    onAlarmDetailStatusChange = (status) => {
        const { selectRowKeys, registerInfo } = this.alarmDetailInfo;
        if (!status || status === 'open') {
            this.setState({ drawerStatus: status, drawerData: { sessionId: registerInfo.clientSessionId, selectRowKey: selectRowKeys[0] } });
        } else if (status === 'close') {
            this.setState({ drawerStatus: status, drawerData: {} }, this.generateView);
        } else if (status === 'fixed') {
            // 抽屉与原有布局分占页面
            this.setState({ drawerStatus: status }, this.generateView);
        } else if (status === 'free') {
            // 抽屉正常蒙层方式展示
            this.setState({ drawerStatus: status }, this.generateView);
        } else {
            this.setState({ drawerStatus: status });
        }
    };

    render() {
        const { layoutChildrenDom, layout, drawerStatus, drawerData } = this.state;
        const { windowType, selectedRows } = this.props;
        return (
            <AlarmDetailContainer detailStatus={drawerStatus} drawerData={drawerData} onAlarmDetailStatusChange={this.onAlarmDetailStatusChange}>
                {selectedRows.length > 0 && (
                    <FloatButton onWidgetsItemClickHandle={this.onWidgetsItemClickHandle} buttonList={getBtnList(windowType)} />
                )}
                <ReactGridLayout
                    draggableHandle=".dragIcon"
                    className="alarm-window-grid-layout"
                    rowHeight={10}
                    layout={layout}
                    cols={24}
                    margin={[1, 1]}
                    width={window.innerWidth}
                >
                    {layoutChildrenDom}
                </ReactGridLayout>
            </AlarmDetailContainer>
        );
    }
}

const ResizeDetector = withResizeDetector((props) => {
    return <Index {...props} />;
});

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(ResizeDetector);
