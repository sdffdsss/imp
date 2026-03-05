import React, { Fragment } from 'react';
import { getViewData, getDefaultViews } from '../common/api';
import urlSearch from '@Common/utils/urlSearch';
import shareActions from '@Src/share/actions';
import { withModel } from 'hox';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import GlobalMessage from '@Src/common/global-message';
import PageContainer from '@Components/page-container';
import AlarmWindowWrapper from '../alarm-window-wrapper';
import { windowTypeEnum } from '../common/enums';
import copy from 'copy-to-clipboard';
import { message, Modal, Icon } from 'oss-ui';
import { ReactComponent as WindowSvg1 } from '@Components/workbench-components/img/u600.svg';
import actionss from '@Src/share/actions';
import CustomModalFooter from '@Components/custom-modal-footer';
import { getDefaultUser } from '../../home-work/common/api';
import { Table } from 'oss-ui';
import './index.less';
import { groupApi } from '../../../common/api/service/groupApi';
import { getWay } from '../common/api';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            monitorViews: [],
            copyMessage: '',
            leftScroll: 0,
            page: 1,
            componentKey: Date.now(),
            visible: false,
            loading: false,
            groupData: [],
            selectedRowKeys: [],
            columns: [
                {
                    title: '班组名称',
                    dataIndex: 'groupName',
                    width: 160,
                    ellipsis: true,
                },
                {
                    title: '关联的视图名称',
                    dataIndex: 'viewName',
                    // width: 180,
                    // ellipsis: true,
                },
            ],
            viewPagination: {
                pageSize: 20,
                current: 1,
                total: 0,
            },
        };
        this.ref = React.createRef();
        this.userIdCache = props.login.userId;
    }

    initListener = () => {
        window.addEventListener('keydown', this.copyCellMessage, false);
    };

    copyCellMessage = (e) => {
        if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
            copy(this.state.copyMessage);
        }
    };

    componentDidMount() {
        this.init();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.login.currentZone.zoneLevel !== this.props.login.currentZone.zoneLevel) {
            const { actions, messageTypes } = actionss;
            // 关闭流水窗
            if (actions && actions.postMessage) {
                actions.postMessage(messageTypes.closeTabs, {
                    entry: `/unicom/home-unicom/alarm-window-unicom/duty-window`,
                });
            }
        }
    }

    init = () => {
        const { userId } = this.props.login;
        const { srcString } = useLoginInfoModel.data;
        this.initListener();
        if (!userId && userId !== 0) {
            message.error('请检查用户Id');
            return;
        }
        if (urlSearch(srcString)?.centerWindowId) {
            this.getMonitorView();
        } else {
            this.beforeCreateWindow();
        }
    };

    userChangeCallbackFromOtherTab = ({ isActive }) => {
        if (this.userIdCache !== this.props.login.userId && isActive) {
            setTimeout(() => {
                // 初始化状态
                this.setState({
                    monitorViews: [],
                    copyMessage: '',
                    leftScroll: 0,
                    page: 1,
                });

                this.userIdCache = this.props.login.userId;

                this.init();
            }, 1000);
        }
    };

    /**
     * @description: 其他tab下微应用主动切换登录用户后，流水窗需要刷新
     */
    watchUserChangeFromOtherTab = () => {
        GlobalMessage.on('activeChanged', this.userChangeCallbackFromOtherTab);
    };

    componentWillUnmount() {
        window.removeEventListener('keydown', this.copyCellMessage, false);
        GlobalMessage.off('activeChanged', this.userChangeCallbackFromOtherTab);
    }

    beforeCreateWindow = async () => {
        const { userId, userInfo } = this.props.login;
        const userInfos = userInfo ? JSON.parse(userInfo) : null;
        const zoneId = userInfos?.zones[0]?.zoneId;
        const res = await getDefaultUser(userId, zoneId, true);
        let relateCount = 0;
        if (res?.rows) {
            if (res?.rows.length > 0) {
                res?.rows.forEach((e) => {
                    if (e.viewName) {
                        relateCount++;
                    }
                });
                if (relateCount > 1) {
                    // 弹窗选择
                    this.setState({
                        visible: true,
                        groupData: res.rows.filter((e) => e.viewName),
                    });
                } else if (relateCount === 1) {
                    // 直接进入
                    const groupId = res?.rows.filter((e) => e.viewName)[0].groupId;
                    const viewData = await getViewData(groupId);
                    const monitorViews = viewData.data;
                    this.setState({ monitorViews });
                } else {
                    message.error('当班班组没有关联视图');
                }
            } else {
                message.error('对不起，您不是当班人');
            }
        }
    };

    /**
     * @description: 获取监控视图模版
     * @param {*}
     * @return {*}
     */
    getMonitorView = async () => {
        const { srcString } = useLoginInfoModel.data;
        try {
            const urlData = urlSearch(srcString);
            const { actions, messageTypes } = shareActions;
            if (actions?.postMessage) {
                actions.postMessage(messageTypes.modifyTabDisplayName, {
                    uuid: useLoginInfoModel.data.uuIdValue,
                    display: decodeURI(urlData.centerWindowName),
                });
            }
            const res = await getViewData(urlData.centerWindowId);
            const dataObj = res?.data;

            if (Array.isArray(dataObj)) {
                if (dataObj.length === 0) {
                    message.error('没有关联自定义视图');
                } else {
                    this.setState({
                        monitorViews: dataObj,
                    });
                }
            }
            // eslint-disable-next-line no-empty
        } catch (e) {}
    };

    pushActions = (url) => {
        const { actions, messageTypes } = shareActions;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        if (actions && actions.postMessage) {
            actions.postMessage(messageTypes.openRoute, {
                entry: url,
            });
            actions.postMessage(messageTypes.closeTabs, {
                entry: `/unicom/home-unicom/alarm-window-unicom/duty-window`,
            });
        }
    };

    /**
     * @description: 获取默认的监控视图
     * @param {*}
     * @return {*}
     */
    getDefaultView = async (userId) => {
        try {
            const {
                login: { systemInfo },
            } = this.props;
            const zoneId = systemInfo.currentZone?.zoneId;
            const res = await getDefaultViews(userId, zoneId);
            if (res.data.length === 0 || res.data === null) {
                Modal.confirm({
                    title: '',
                    icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                    content: '该用户不在监控班组内，请前往配置',
                    okText: '确认',
                    okButtonProps: { prefixCls: 'oss-ui-btn' },
                    cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                    okType: 'danger',
                    cancelText: '取消',
                    prefixCls: 'oss-ui-modal',
                    onOk: () => {
                        const { userInfo } = this.props.login;
                        const { operations } = JSON.parse(userInfo);
                        let flag = false;
                        if (operations && Array.isArray(operations)) {
                            operations.map((item) => {
                                if (item.key === 'groupManage') {
                                    flag = true;
                                }
                            });
                            if (flag) {
                                this.pushActions(`/unicom/setting/core/group-manage`);
                            } else {
                                this.pushActions(`/unicom/home/home-work`);
                            }
                        } else {
                            this.pushActions(`/unicom/home/home-work`);
                        }
                    },
                    onCancel: () => {
                        // this.props.history.push('/home-work')
                        this.pushActions(`/unicom/home/home-work`);
                    },
                });
                return true;
            }
            this.setState({
                monitorViews: Array.isArray(res.data) ? res.data : [res.data],
            });
            return false;
            // eslint-disable-next-line no-empty
        } catch (e) {}
    };

    /**
     * @description: 监听selectedRows变化
     * @param {*}
     * @return {*}
     */
    onSelectedRowsChange = (selectedRows) => {
        this.setState({
            monitorViews: selectedRows,
        });
    };

    onCellClick = (otdata, record, dataIndex) => {
        this.setState({
            copyMessage: record[dataIndex].lable,
        });
    };

    toLeft = () => {
        const { page, leftScroll } = this.state;
        this.setState({ page: page + 1, leftScroll: leftScroll + (this.ref?.current?.offsetWidth || 0) });
    };

    toReft = () => {
        const { page, leftScroll } = this.state;
        this.setState({ page: page - 1, leftScroll: leftScroll - (this.ref?.current?.offsetWidth || 0) });
    };

    /**
     * @description: 监听监控视图分页
     * @param n*o
     * @return n*o
     */

    onViewPageChange = (pagination) => {
        const { viewPagination } = this.state;
        this.setState(
            {
                viewPagination: {
                    ...viewPagination,
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                },
                viewFilterLoading: true,
            },
            () => {
                this.getCustomMonitorViews();
            },
        );
    };

    onSelectChanges = (record) => {
        console.log(record);
        this.setState({
            selectedRowKeys: [record.groupId],
        });
    };

    onCancel = () => {
        this.setState({
            selectedRowKeys: [],
            visible: false,
        });
    };

    onOk = async () => {
        const { selectedRowKeys } = this.state;
        const groupId = selectedRowKeys[0];
        if (!groupId) {
            message.error('请选择班组-视图');
            return;
        }
        const viewData = await getViewData(groupId);
        const monitorViews = viewData.data;
        if (!monitorViews?.length) {
            message.error('该班组没有关联视图');
        } else {
            this.setState({ monitorViews, visible: false });
        }
        this.initListener();
    };

    getGroupData = async () => {
        const { userId, userInfo } = this.props.login;
        const userInfos = userInfo ? JSON.parse(userInfo) : null;
        const zoneId = userInfos?.zones[0]?.zoneId;
        const res = await getDefaultUser(userId, zoneId);
        if (res?.rows && res?.rows.length > 1) {
            this.setState({
                groupData: res.rows.filter((e) => e.viewName),
            });
        }
    };

    render() {
        const { monitorViews, page, leftScroll, componentKey, visible, groupData, columns, viewPagination, loading, selectedRowKeys } = this.state;
        const { srcString } = useLoginInfoModel.data;
        return (
            <PageContainer showHeader={false} className="alarm-window-page-container">
                {page !== 1 && (
                    <div className="left-btn" onClick={this.toLeft}>
                        <WindowSvg1 />
                    </div>
                )}
                <Fragment key={componentKey}>
                    <div
                        className={`alarm-window-page-container-box ${monitorViews.length > 6 && 'double'}`}
                        style={{ transform: `translateX(${leftScroll}px)`, transition: 'all 1s ease 0s' }}
                    >
                        <div ref={this.ref} style={{ width: '50%', height: '100%', position: 'relative' }}>
                            <AlarmWindowWrapper
                                selectedRows={[...monitorViews].splice(0, 6)}
                                windowType={windowTypeEnum.DUTY}
                                onSelectedRowsChange={this.onSelectedRowsChange}
                                onCellClick={this.onCellClick}
                                operId={urlSearch(srcString)?.centerWindowId ? '400016' : '400000'}
                            />
                        </div>
                        {monitorViews.length > 6 && (
                            <div style={{ width: '50%', height: '100%', position: 'relative' }}>
                                <AlarmWindowWrapper
                                    selectedRows={[...monitorViews].splice(6, 4)}
                                    windowType={windowTypeEnum.DUTY}
                                    onSelectedRowsChange={this.onSelectedRowsChange}
                                    onCellClick={this.onCellClick}
                                    operId={urlSearch(srcString)?.centerWindowId ? '400016' : '400000'}
                                />
                            </div>
                        )}
                    </div>
                </Fragment>
                {monitorViews.length > 6 && page === 1 && (
                    <div className="right-btn" onClick={this.toReft}>
                        <WindowSvg1 />
                    </div>
                )}
                <Modal
                    destroyOnClose
                    maskClosable={false}
                    width={900}
                    visible={visible}
                    title="选择当班班组"
                    // getContainer={container}
                    // onCancel={this.onCancel}
                    footer={<CustomModalFooter onCancel={this.onCancel} onOk={this.onOk} />}
                    className="unicom-spaicing-style"
                >
                    <div style={{ margin: 12 }}>选择当班班组，打开班组对应的当班监控视图</div>
                    <Table
                        rowSelection={{
                            selectedRowKeys,
                            onSelect: this.onSelectChanges,
                            type: 'radio',
                        }}
                        scroll={{ y: 350 }}
                        rowKey="groupId"
                        bordered
                        rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                        columns={columns}
                        size="small"
                        dataSource={groupData}
                        pagination={false}
                        onChange={this.onViewPageChange}
                        loading={loading}
                    />
                </Modal>
            </PageContainer>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
