import React, { PureComponent } from 'react';
import { message } from 'oss-ui';
import actionss from '@Src/share/actions';
import GridLayout, { WidthProvider } from 'react-grid-layout';
import produce from 'immer';
import { _ } from 'oss-web-toolkits';
import { withResizeDetector } from 'react-resize-detector';
import PageContainer from '@Components/page-container';
import AlarmDetailContainer from '@Components/alarm-detail-container';
import { withModel } from 'hox';
import FloatButton from '@Components/float-button';
import shareActions from '@Src/share/actions';
import request from '@Common/api';
import useLoginInfoModel, { useEnvironmentModel, useAlarmWindowConfigModel } from '@Src/hox';
import { AlarmWindowWithProcessor } from '@Components/oss-alarm-window/es';
import { extendContextMenu } from '@Common/alarm-window-extend/extend-context-menus';
import Enums from '@Src/common/enum';
import constants from '@Common/constants';
// import { getContextMenu } from '@Common/alarm-contextmenu';
import { logger } from 'oss-web-toolkits';

import './index.less';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

function urlSplit(str) {
    const searchList = _.trimStart(str, '?').split('&');
    let urlObj = {};
    searchList.forEach((item) => {
        const list = item.split('=');
        urlObj = {
            ...urlObj,
            [list[0]]: list[1],
        };
    });
    return urlObj;
}
const ReactGridLayout = WidthProvider(GridLayout);

function WindowCard({ selectedRows, onDeleteItem, onMaxShowItem, onMaXshow, theme, height = 0, onTableSelect, onAlarmDetailStatusChange }) {
    const filterIdList = selectedRows.filterIdList?.toString().split(',').map(Number);
    const filterNameList = selectedRows.filterNameList?.toString().split(',');
    const { colDispTemplet, windowId } = selectedRows;
    const statusDispTemplet = selectedRows.statusDispTemplet || 0;
    const registerWindow = [];
    const windowBarType = selectedRows.windowBarType.split(',');
    windowBarType.forEach((item) => {
        registerWindow.push({ winType: Number(item), winName: Enums.registerWindow.getName(item) });
    });
    const frameInfo = {
        serviceConfig: {
            isUseIceGrid: useEnvironmentModel.data.environment.iceUrl.isUseIceGrid.direct,
            icegridUrl: useEnvironmentModel.data.environment.iceUrl.icegridUrl.direct,
            icegridBackupUrl: useEnvironmentModel.data.environment.iceUrl.icegridBackupUrl.direct,
            icegridSvcId: `znjk/${constants.CUR_ENVIRONMENT}/` + useEnvironmentModel.data.environment.iceUrl.icegridSvcId.direct.replace(/^\//, ''),
            directSvcId: `znjk/${constants.CUR_ENVIRONMENT}/` + useEnvironmentModel.data.environment.iceUrl.directSvcId.direct.replace(/^\//, ''),
            directServiceUrl: useEnvironmentModel.data.environment.iceUrl.directServiceUrl.direct,
            batchSize: useAlarmWindowConfigModel.data.environment.batchSize,
            clientTimeOutSeconds: 3000,
            refreshInterval: useEnvironmentModel.data.environment.iceUrl.refreshInterval.direct,
        },
        userInfo: {
            userId: useLoginInfoModel.data.userId,
            userName: useLoginInfoModel.data.userName,
            loginId: JSON.parse(useLoginInfoModel.data.userInfo)?.loginId || '',
            zoneId: useLoginInfoModel.data?.currentZone?.zoneId,
        },
        otherService: {
            alarmSoundUrl: `${useEnvironmentModel.data.environment.alarmSoundUrl?.direct}/`,
            filterUrl: `${useEnvironmentModel.data.environment.filterUrl?.direct}/`,
            experienceUrl: `${useEnvironmentModel.data.environment.experienceUrl?.direct}/`,
            viewItemUrl: `${useEnvironmentModel.data.environment.viewItemUrl?.direct}/`,
            noticeUrl: `${useEnvironmentModel.data.environment.noticeUrl?.direct}/`,
            viewItemExportUrl: `${useEnvironmentModel.data.environment.viewItemExportUrl?.direct}/`,
            allLifeUrl: `${useEnvironmentModel.data.environment.allLifeUrl?.direct}/`,
            outboundMail: `${useEnvironmentModel.data.environment.outboundMail?.direct}/`,
        },
    };

    const operatorEventListenerRealAlarm = (session, num) => {
        logger.default.info('time:\n', session, num);
    };

    // const contextmenuActionMap = { NewAlarmDetails: () => onAlarmDetailStatusChange('open') };

    // const formatContextMenu = getContextMenu(contextmenuActionMap);

    const formatExtendContextMenu = extendContextMenu.map((item) => {
        const newItem = { ...item };
        if (item.key === 'NewAlarmDetails') {
            newItem.action = () => onAlarmDetailStatusChange('open');
        }
        return newItem;
    });
    return (
        <AlarmWindowWithProcessor
            title={selectedRows.windowName}
            getContainer={useLoginInfoModel.data.container}
            filterIdList={filterIdList}
            filterNameList={filterNameList}
            colDispTemplet={colDispTemplet}
            statusDispTemplet={statusDispTemplet}
            registerWindow={registerWindow}
            alarmTitlelist={useAlarmWindowConfigModel.data.environment.alarmTitlelist}
            defaultSize={useAlarmWindowConfigModel.data.environment.defaultSize}
            needFp={useAlarmWindowConfigModel.data.environment.needFp}
            frameInfo={frameInfo}
            onDeleteItem={onDeleteItem}
            height={height}
            onMaXshow={onMaXshow}
            onMaxShowItem={onMaxShowItem}
            contextAndToolbar={useAlarmWindowConfigModel.data.environment.contextAndToolbar}
            extendContextMenu={formatExtendContextMenu}
            // contextmenuList={formatContextMenu}
            clickLock={useAlarmWindowConfigModel.data.environment.clickLock}
            autoUnLock={useAlarmWindowConfigModel.data.environment.autoUnLock}
            unLockTime={useAlarmWindowConfigModel.data.environment.clickLock}
            theme={theme}
            shareActions={shareActions}
            windowId={windowId}
            columnBehaviorRecord={useAlarmWindowConfigModel.data.environment.columnBehaviorRecord}
            doubleClickType={useAlarmWindowConfigModel.data.environment.doubleClickType}
            exportHtmlType={useAlarmWindowConfigModel.data.environment.exportHtmlType}
            processorAction={{ operatorEventListenerRealAlarm }}
            onTableSelect={onTableSelect}
        />
    );
}
const WindowCardWrapper = withResizeDetector(WindowCard);

class Index extends PureComponent {
    constructor(props) {
        super();
        this.preViewMode = 'flowlayout';
        this.isFullScreen = false;
        this.alarmDetailInfo = null;
        this.state = {
            visible: true,
            filterData: [],
            ruleData: [],
            loading: true,
            selectedRowKeys: [],
            selectedRows: [],
            layoutChildrenDom: null,
            currentViewMode: 'flowlayout', // todo:看是否需要页面响应
            activeKeyMap: {},
            layout: [],
            floatButtonVisible: false,
            onMaxShowIndex: -1,
            drawerStatus: 'close',
            drawerData: {},
            buttonList: [
                {
                    value: 'vertical',
                    label: '垂直显示',
                },
                {
                    value: 'horizontal',
                    label: '水平显示',
                },
                {
                    value: 'flowlayout',
                    label: '平铺显示',
                },
                {
                    value: 'fullscreen',
                    label: '全屏显示',
                },
            ],
        };
    }

    componentDidMount() {
        const { userId } = this.props.login;
        const { actions, messageTypes } = actionss;
        if (!userId && userId !== 0) {
            message.error('请检查用户Id');
        } else if (window.location?.search && window.location.search.indexOf('centerWindowId') !== '-1') {
            const urlData = urlSplit(window.location?.search);
            actions?.postMessage &&
                actions.postMessage(messageTypes.modifyTabDisplayName, {
                    uuid: useLoginInfoModel.data.uuIdValue,
                    display: decodeURI(urlData.centerWindowName),
                });
            this.getMonitorView(urlData.centerWindowId);
        } else {
            this.getDefaultView(userId);
        }

        this.watchExitFullScreen();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.height !== this.props.height) {
            this.generateView();
        }

        if (prevProps.login.systemInfo.theme !== this.props.login.systemInfo.theme) {
            const { selectedRows: dataObj, activeKeyMap, layout, currentViewMode } = this.state;
            this.setState({
                layoutChildrenDom: this.generateDOM(dataObj, activeKeyMap, currentViewMode, layout),
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('fullscreenchange', this.onFullScreenChange);
    }

    /**
     * @description: 监听全屏事件
     * @param {*}
     * @return {*}
     */
    watchExitFullScreen = () => {
        document.addEventListener('fullscreenchange', this.onFullScreenChange);
    };

    /**
     * @description: 监听全屏事件
     * @param {*}
     * @return {*}
     */
    onFullScreenChange = () => {
        const { onMaxShowIndex } = this.state;
        if (!document.fullscreenElement) {
            this.isFullScreen = false;
            if (onMaxShowIndex !== -1) {
                this.generateView('maxOne');
            } else {
                this.setState(
                    {
                        currentViewMode: this.preViewMode,
                    },
                    () => {
                        this.generateView();
                    },
                );
            }
        } else {
            this.isFullScreen = true;
            this.setState(
                {
                    currentViewMode: 'fullscreen',
                    onMaxShowIndex,
                },
                () => {
                    this.generateView();
                },
            );
        }
    };
    // 获取监控视图中心流水窗
    getMonitorView = (data) => {
        const { currentViewMode } = this.state;
        let dataObj = [];
        request(`v1/monitor-views/${data}`, {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            dataObj = res.data;
            if (dataObj.length === 0) {
                message.error('没有关联自定义视图');
            } else {
                const layout = this.generateLayout(dataObj, currentViewMode);
                const activeKeyMap = new Map(
                    Array.isArray(dataObj) &&
                        dataObj.map((item) => {
                            return [`${item.windowId}`, ['0']];
                        }),
                );

                this.setState({
                    selectedRows: dataObj,
                    activeKeyMap,
                    layout,
                    floatButtonVisible: true,
                    layoutChildrenDom: this.generateDOM(dataObj, activeKeyMap, currentViewMode, layout),
                });
            }
        });
    };
    // 获取监控视图
    getDefaultView = (userId) => {
        const { currentViewMode } = this.state;
        request(`v1/monitor-view/userId/${userId}`, {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            if (res.data.length === 0) {
                message.error('没有关联自定义视图');
            } else {
                const layout = this.generateLayout(res.data, currentViewMode);
                const activeKeyMap = new Map(
                    Array.isArray(res.data) &&
                        res.data.map((item) => {
                            return [`${item.windowId}`, ['0']];
                        }),
                );

                this.setState({
                    selectedRows: Array.isArray(res.data) ? res.data : [res.data],
                    activeKeyMap,
                    layout,
                    floatButtonVisible: true,
                    layoutChildrenDom: this.generateDOM(res.data, activeKeyMap, currentViewMode, layout),
                });
            }
        });
    };

    /**
     * @description: 布局监听
     * @param {*} selectedRows: 流水窗集合
     * @param {*} type: 布局方式
     * @return {*}
     */
    generateLayout = (selectedRows, type) => {
        /**
         * gird最终的高度不是简单的rowHeight * h值
         * 源码 https://github.com/STRML/react-grid-layout/blob/83251e5e682abfa3252ff89d4bacf47fdc1f4270/lib/calculateUtils.js
         * h值应为源码中calcWH方法的逆运算
         * 10 + 1 为rowHeight + margin[1]
         */
        const { length } = selectedRows;
        const { height } = this.props;
        const fullH = window.innerHeight;
        const { onMaxShowIndex } = this.state;
        // 用于在全屏模式下切换显示方式
        const commonH = this.isFullScreen ? fullH : height;
        // 平铺模式下布局
        const getFlowlayout = (length, index, totalH) => {
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
            return layOutMap[length - 1][index];
        };
        // 全屏模式下布局
        const getItemHeightByType = (length, index) => {
            if (this.state.onMaxShowIndex !== -1) {
                return commonH / (10 + 1);
            }
            switch (this.preViewMode) {
                case 'flowlayout':
                    return getFlowlayout(length, index, commonH)?.h;
                case 'vertical':
                    return commonH / (10 + 1);
                case 'horizontal':
                    return commonH / length / (10 + 1);
                default:
                    return commonH / (10 + 1);
            }
        };
        if (type === 'vertical') {
            return selectedRows.map((item, i) => {
                const layout = {
                    x: i * 1 * (24 / length),
                    y: 0,
                    w: 24 / length,
                    h: commonH / (10 + 1),
                    i: `${item.windowId}`,
                };
                return layout;
            });
        }
        if (type === 'horizontal') {
            return selectedRows.map((item, i) => {
                return {
                    x: 0,
                    y: i * 1 * (24 / length),
                    w: 24,
                    h: commonH / length / (10 + 1),
                    i: `${item.windowId}`,
                };
            });
        }

        if (type === 'flowlayout') {
            return selectedRows.map((item, i) => {
                return { ...getFlowlayout(length, i, commonH), i: `${item.windowId}` };
            });
        }

        if (type === 'fullscreen') {
            return this.state.layout.map((item, i) => {
                return {
                    ...item,
                    h: getItemHeightByType(length, i),
                };
            });
        }
        if (type === 'maxOne') {
            return selectedRows.map((item, i) => {
                return {
                    x: i === onMaxShowIndex ? 0 : 24,
                    y: i === onMaxShowIndex ? 0 : 24,
                    w: i === onMaxShowIndex ? 24 : -1,
                    h: i === onMaxShowIndex ? Math.floor(commonH / (10 + 1)) : -1,
                    i: `${item.windowId}`,
                };
            });
        }
    };

    generateDOM(selectedRows, activeKeyMap, currentViewMode, layout) {
        const { onMaxShowIndex } = this.state;
        const {
            login: { systemInfo },
        } = this.props;

        return layout.map((l, i) => {
            const onMaXshow = onMaxShowIndex === i;
            return (
                <div key={`${l.i}`}>
                    <WindowCardWrapper
                        key={`${l.i}`}
                        i={`${l.i}`}
                        currentViewMode={currentViewMode}
                        selectedRows={_.find(selectedRows, { windowId: Number(l.i) })}
                        activeKeyMap={activeKeyMap}
                        onDeleteItem={this.onDeleteItem.bind(this, i)}
                        isDevelop={this.state.isDevelop}
                        onMaXshow={onMaXshow}
                        onMaxShowItem={this.onMaxShowItem.bind(this, onMaXshow, i)}
                        theme={systemInfo?.theme}
                        onTableSelect={this.onTableSelect}
                        onAlarmDetailStatusChange={this.onAlarmDetailStatusChange}
                    />
                </div>
            );
        });
    }

    generateView = (viewMode) => {
        const { selectedRows, currentViewMode, activeKeyMap, drawerStatus } = this.state;
        const nextViewMode = viewMode || currentViewMode;
        let layout = this.generateLayout(selectedRows, nextViewMode);
        if (drawerStatus === 'fixed') {
            layout = layout.map((item) => ({ ...item, x: item.x * 0.8, w: item.w * 0.8 }));
        }
        this.setState({
            layout,
            layoutChildrenDom: this.generateDOM(selectedRows, activeKeyMap, currentViewMode, layout),
        });
    };

    onMaxShowItem = (onMax, onMaxShowIndex) => {
        this.setState({ onMaxShowIndex: onMax ? -1 : onMaxShowIndex }, () => {
            const mode = onMax ? this.preViewMode : 'maxOne';
            this.generateView(mode);
        });
    };

    onDeleteItem = (i) => {
        const { selectedRows, onMaxShowIndex } = this.state;

        const newSelectedRows = produce(selectedRows, (draft) => {
            draft.splice(i, 1);
        });
        this.setState(
            {
                selectedRows: newSelectedRows,
                onMaxShowIndex: onMaxShowIndex !== -1 ? -1 : onMaxShowIndex,
            },
            () => {
                if (newSelectedRows.length === 0) {
                    const { actions, messageTypes } = shareActions;
                    actions.postMessage(messageTypes.closeTabs, {
                        entry: '/alarm/duty-window',
                    });
                } else {
                    this.generateView(this.preViewMode);
                }
            },
        );
    };

    /**
     * @description: 获取流水窗视图展示方式
     * @param {*} type 视图展示方式  vertical: 垂直 horizontal: 水平 flowlayout：平铺 fullscreen：全屏
     * @return {*}
     */
    onWidgetsItemClickHandle = (type) => {
        let { onMaxShowIndex } = this.state;
        if (type === 'fullscreen') {
            this.fullScreen();
            return;
        }
        this.preViewMode = type;
        onMaxShowIndex = -1;

        this.setState(
            {
                currentViewMode: type,
                onMaxShowIndex,
            },
            () => {
                this.generateView();
            },
        );
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

    onTableSelect = (selectRowKeys, registerInfo, clickType) => {
        const { drawerStatus } = this.state;
        this.alarmDetailInfo = { selectRowKeys, registerInfo, clickType };
        if (clickType === 'click' && ['open', 'unfold', 'fixed', 'free'].includes(drawerStatus)) {
            this.setState({ drawerData: { sessionId: registerInfo.clientSessionId, selectRowKey: selectRowKeys[0] } });
        }
    };

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
        const { layout, layoutChildrenDom, floatButtonVisible, buttonList, drawerStatus, drawerData } = this.state;

        return (
            <PageContainer showHeader={false} className="alarm-window-page-container">
                <AlarmDetailContainer detailStatus={drawerStatus} drawerData={drawerData} onAlarmDetailStatusChange={this.onAlarmDetailStatusChange}>
                    {floatButtonVisible && <FloatButton onWidgetsItemClickHandle={this.onWidgetsItemClickHandle} buttonList={buttonList} />}
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
            </PageContainer>
        );
    }
}

const ResizeDetector = withResizeDetector((props) => {
    return <Index {...props} />;
});

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(ResizeDetector);
