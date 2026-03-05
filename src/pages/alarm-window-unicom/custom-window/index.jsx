import React from 'react';
import WindowModal from '../window-modal';
import PageContainer from '@Components/page-container';
import AlarmWindowWrapper from '../alarm-window-wrapper';
import { windowTypeEnum } from '../common/enums';
import { withModel } from 'hox';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import actionss from '@Src/share/actions';
import copy from 'copy-to-clipboard';
import request from '@Src/common/api';
import GlobalMessage from '@Src/common/global-message';
import { _ } from 'oss-web-toolkits';
import Detail from '@Src/pages/auto-sheet-rule/edit';
import { getWay } from '../common/api';
import { Modal, Button } from 'oss-ui';
import './index.less';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showWindowModal: false,
            selectedRows: [],
            copyMessage: '',
            componentKey: Date.now(),
        };
        this.userIdCache = props.login.userId;
        this.customWindowRef = React.createRef();
    }

    componentDidMount() {
        this.initListener();
        this.watchUserChangeFromOtherTab();
        this.judgeRule();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.login.userInfo && this.props.login.userInfo) {
            const prepOperation = JSON.parse(prevProps.login.userInfo).operations.findIndex((e) => e.operName === '自定义视图');
            const propsOperation = JSON.parse(this.props.login.userInfo).operations.findIndex((e) => e.operName === '自定义视图');
            if (prepOperation === -1 || propsOperation === -1) {
                const { actions, messageTypes } = actionss;
                // 关闭流水窗
                if (actions && actions.postMessage) {
                    actions.postMessage(messageTypes.closeTabs, {
                        entry: useLoginInfoModel.data?.uuIdValue,
                    });
                }
            }
        }

        if (prevProps.login.currentZone.zoneLevel !== this.props.login.currentZone.zoneLevel) {
            const { actions, messageTypes } = actionss;
            // 关闭流水窗
            if (actions && actions.postMessage) {
                actions.postMessage(messageTypes.closeTabs, {
                    entry: useLoginInfoModel.data.uuIdValue,
                });
            }
        }
        // if (prevProps.login.userId !== this.props.login.userId) {
        //     const { actions, messageTypes } = actionss;
        //     // 关闭流水窗
        //     if (actions && actions.postMessage) {
        //         actions.postMessage(messageTypes.modifyTabDisplayName, {
        //             uuid: useLoginInfoModel.data.uuIdValue,
        //             display: this.customWindowRef.current,
        //         });
        //     }
        // }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.copyCellMessage, false);
        GlobalMessage.off('activeChanged', this.userChangeCallbackFromOtherTab);
    }

    userChangeCallbackFromOtherTab = ({ isActive }) => {
        if (this.userIdCache !== this.props.login.userId && isActive) {
            // setTimeout(() => {
            //     this.userIdCache = this.props.login.userId;
            //     // 重新获取gateUrl
            //     this.gateWayData();
            // }, 1000);
        }
    };

    /**
     * @description: 其他tab下微应用主动切换登录用户后，流水窗需要刷新
     */
    watchUserChangeFromOtherTab = () => {
        GlobalMessage.on('activeChanged', this.userChangeCallbackFromOtherTab);
    };

    initListener = () => {
        window.addEventListener('keydown', this.copyCellMessage, false);
    };

    copyCellMessage = (e) => {
        if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
            copy(this.state.copyMessage);
        }
    };

    /**
     * @description: 打开modal弹窗
     * @param {*}
     * @return {*}
     */
    openWindowModal = () => {
        this.setState({
            showWindowModal: true,
        });
    };

    /**
     * @description: 关闭modal弹窗
     * @param {*}
     * @return {*}
     */
    closeWindowModal = () => {
        this.setState({
            showWindowModal: false,
        });
    };

    /**
     * @description: 监听selectedRows变化
     * @param {*}
     * @return {*}
     */
    onSelectedRowsChange = (selectedRows) => {
        const { actions, messageTypes } = actionss;
        let nextSelectedRows = selectedRows;
        if (!_.isEmpty(selectedRows)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            let str = '';
            console.log(selectedRows);
            if (selectedRows.length === 1) {
                str = selectedRows[0]?.windowName;
                // eslint-disable-next-line no-param-reassign
                nextSelectedRows = [
                    {
                        ...selectedRows[0],
                        filterName: selectedRows[0]?.filterName,
                    },
                ];
            } else {
                str = selectedRows.map((item) => item.windowName).join(',');
            }
            this.customWindowRef.current = str;

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            actions?.postMessage &&
                actions.postMessage(messageTypes.modifyTabDisplayName, {
                    uuid: useLoginInfoModel.data.uuIdValue,
                    display: str,
                });
        }
        this.setState({
            selectedRows: nextSelectedRows,
            showWindowModal: false,
        });
    };

    onCellClick = (otdata, record, dataIndex) => {
        this.setState({
            copyMessage: record[dataIndex].lable,
        });
    };

    judgeRule = () => {
        const { search } = window.location;
        const searchParamsIns = new URLSearchParams(search);
        const ruleId = searchParamsIns.get('ruleId');
        const windowId = searchParamsIns.get('windowId');
        if (ruleId || windowId) {
            // 跳转过来的打开流水窗和自动派单规则
            request(`v1/monitor-view/${windowId}`, {
                type: 'get',
                baseUrlType: 'monitorSetUrl',
                data: {},
                // 是否需要显示失败消息提醒
                showErrorMessage: '获取自定义视图失败',
                showSuccessMessage: false,
            }).then((res) => {
                const backData = [res.data];
                backData.forEach((item) => {
                    item.filterName = item.windowName;
                    item.filterId = item.filterIdList;
                });
                const newSelectedRows = [...backData];
                this.onSelectedRowsChange(newSelectedRows);
                this.setState(
                    {
                        viewSheetId: ruleId,
                        viewModalTitle: '自动派单规则',
                        showWindowModal: false,
                    },
                    () => {
                        this.setState({
                            viewModalVisible: false,
                        });
                    },
                );
            });
        } else {
            this.setState({
                showWindowModal: true,
            });
        }
    };
    renderModal = () => {
        const { viewSheetId } = this.state;
        return (
            <Detail
                match={{
                    params: {
                        type: 'edit',
                        moduleId: '10',
                        id: viewSheetId,
                        isCheck: true,
                    },
                }}
            />
        );
    };

    onModalCancel = () => {
        this.setState({
            viewModalVisible: false,
        });
    };

    render() {
        const {
            login: { container },
        } = this.props;
        const { showWindowModal, selectedRows, componentKey, viewModalTitle, viewModalVisible } = this.state;

        return (
            <PageContainer showHeader={false} className="alarm-window-page-container">
                {showWindowModal && <WindowModal container={container} onOk={this.onSelectedRowsChange} onCancel={this.closeWindowModal} />}
                <AlarmWindowWrapper
                    selectedRows={selectedRows}
                    windowType={windowTypeEnum.CUSTOM}
                    onSelectedRowsChange={this.onSelectedRowsChange}
                    openWindowModal={this.openWindowModal}
                    onCellClick={this.onCellClick}
                    key={componentKey}
                />
                <Modal
                    destroyOnClose
                    title={viewModalTitle}
                    width={1200}
                    visible={viewModalVisible}
                    onCancel={this.onModalCancel}
                    footer={
                        <div style={{ textAlign: 'center' }}>
                            <Button
                                type="default"
                                onClick={() => {
                                    this.onModalCancel();
                                }}
                            >
                                取消
                            </Button>
                        </div>
                    }
                >
                    {this.renderModal()}
                </Modal>
            </PageContainer>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
