import React, { PureComponent } from 'react';
import { Layout, Modal, message, Button, Steps, Space, Card } from 'oss-ui';
import WindowInfo from './edit-windowinfo';
import ColTemplate from './edit-col-template';
import StatusManager from './edit-status';
import MonitorView from './edit-monitor-view';
import Filter from './edit-filter';
import { makeCRC32 } from '@Common/utils';
import { _ } from 'oss-web-toolkits';
import request from '@Src/common/api';
import AuthButton from '@Src/components/auth-button';
import { getInitialProvince } from './utils';
import formatReg from '@Common/formatReg';

const { Step } = Steps;
const { Header, Footer, Content } = Layout;

/**
 * 视图管理新增/编辑页面
 */
class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            windowName: null,
            windowAttribute: 0,
            windowType: 0,
            ifUsed: 0,
            childwindowShow: 0,
            note: null,
            param: null,
            tab1: {
                windowName: _.get(props, 'rowData.windowName', null),
                windowAttribute: String(_.get(props, 'rowData.windowAttribute', '0')),
                windowType: String(_.get(props, 'rowData.windowType', '1')),
                ifUsed: String(_.get(props, 'rowData.ifUsed', '0')),
                childwindowShow: String(_.get(props, 'rowData.childwindowShow', '0')),
                note: _.get(props, 'rowData.note', null),
                centerViewId: _.get(props, 'rowData.centerViewId', null),
                windowBarType: _.get(props, 'rowData.windowBarType', null),
            },
            colDisptemplet: _.get(props, 'rowData.colDispTemplet', null),
            statusDispTemplet: _.get(props, 'rowData.statusDispTemplet', null),
            filterIds:
                props.windowType === '2' ? _.get(props, 'rowData.customWindowIdList', null)?.toString() : _.get(props, 'rowData.filterIdList', null),
            current: 0,
            stepStatus: ['wait', 'wait', 'wait', 'wait'],
            onSubmit: false,
        };
    }

    /**
     * 保存
     */
    handleSave = async (params) => {
        // TODO: 不明白这里是在干嘛 处理 setState逻辑有很大问题
        // this.setState({ onSubmit: true });
        // 编辑的四个部分做校验：窗口信息、展示列、状态标识、过滤器，期间保存按钮禁用
        const allStatus = this.props.windowType === '2' ? await this.getMonitorStatus(true) : await this.getAllStepsStatus(true);
        if (allStatus.filter((s) => s === 'finish').length < (this.props.windowType === '2' ? 2 : 4)) {
            this.setState({ onSubmit: false });
            return;
        }
        // 全部通过方可保存
        const { visibleChange } = this.props;
        const param = this.setParams();
        if (this.props.rowData) {
            param.windowId = this.props.rowData.windowId;
            param.modifier = this.props.userInfo.userId;
        }
        request('v1/monitor-view', {
            type: this.props.rowData ? 'put' : 'post',
            baseUrlType: 'monitorSetUrl',
            data: param,
            handlers: {
                params,
            },
            showSuccessMessage: false,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        })
            .then((res) => {
                this.setState({ onSubmit: false });
                if (res.code === 0) {
                    message.success('保存成功！');
                    visibleChange(false, true);
                } else {
                    message.error(`保存失败！${res.message}`);
                }
            })
            .catch(() => {
                this.setState({ onSubmit: false });
            });
    };

    setParams = () => {
        const { tab1, colDisptemplet, statusDispTemplet, filterIds } = this.state;
        const typeList = ['1', '2', '0', '3'];
        const {
            userInfo: { userId },
            windowType,
            login,
        } = this.props;
        const { systemInfo } = login;
        const windowId = makeCRC32(new Date().getTime() + tab1.windowName + userId);
        const param = {
            windowId,
            windowName: _.trim(tab1.windowName),
            windowType: tab1.windowType,
            userId,
            windowAttribute: tab1.windowAttribute,
            ifUsed: tab1.ifUsed,
            colDispTemplet: colDisptemplet,
            statusDispTemplet,
            filterIdList: filterIds,
            note: tab1.note,
            windowBarType:
                tab1.windowBarType && Array.isArray(tab1.windowBarType)
                    ? typeList.filter((item) => tab1.windowBarType.includes(item))?.join(',')
                    : tab1.windowBarType,
            viewProvince: tab1.regionId,
            viewProfessional: tab1.professionType?.toString(),
        };
        if (windowType === '2') {
            const newList = param.filterIdList.split(',').map((item) => Number(item));
            param.customWindowIdList = newList;
            delete param.filterIdList;
            delete param.colDispTemplet;
            delete param.statusDispTemplet;
        }
        // if (tab1.windowType === '2') {
        //     param.centerViewId = tab1.centerViewId;
        // }
        return param;
    };

    /**
     * 窗口信息变化
     */
    onTab1DataChange = (values) => {
        let professionList = [];
        if (values.provinceData && Array.isArray(values.provinceData) && values.professionType) {
            if (values.professionType.toString() === 'all') {
                values.professionData.map((item) => {
                    if (item.key !== 'all') {
                        return professionList.push(item.key);
                    }
                });
            } else {
                professionList = values.professionType;
            }
        }
        this.setState({
            tab1: { ...values, professionType: professionList.toString() },
        });
    };

    /**
     * 展示列选择
     */
    onTab2DataChange = (value) => {
        this.setState({
            colDisptemplet: value.join(','),
        });
    };

    /**
     * 状态标识模板选择
     */
    onTab3DataChange = (value) => {
        this.setState({
            statusDispTemplet: value.join(','),
        });
    };

    /**
     * 过滤器选择
     */
    onTab4DataChange = (values) => {
        this.setState({
            filterIds: values.join(','),
        });
    };

    async checkStepFormValid(stepIndex, showMessage) {
        const { isEdit, windowType } = this.props;
        const { tab1, colDisptemplet, statusDispTemplet, filterIds } = this.state;
        let validate = true;
        if (!isEdit) {
            return true;
        }
        switch (stepIndex) {
            case 0: {
                const regName = _.trim(tab1.windowName);
                // eslint-disable-next-line no-control-regex
                const noteByteLength = tab1.note ? tab1.note.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                // 转义是否可行需要确认
                // eslint-disable-next-line no-control-regex
                const regNameByteLength = regName ? regName.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                if (!regName) {
                    validate = false;
                    if (showMessage) {
                        message.warning('请输入视图名称');
                    }
                }
                // if (tab1.windowType === '2') {
                //     if (!tab1.centerViewId) {
                //         validate = false;
                //         if (showMessage) {
                //             message.warning('中心视图不能为空');
                //         }
                //     }
                // }
                if (regNameByteLength > 64) {
                    validate = false;
                    if (showMessage) {
                        message.warning('视图名称长度不超过64位（即汉字不超过32个文字）');
                    }
                }

                if (!formatReg.noSpecialSymbol.test(regName)) {
                    validate = false;
                    if (showMessage) {
                        message.warning('视图名称不可存在特殊符号');
                    }
                }
                if (noteByteLength > 255) {
                    validate = false;
                    if (showMessage) {
                        message.warning('视图备注长度不超过255位（即汉字不超过128个文字）');
                    }
                }
                if (tab1?.professionType === '') {
                    validate = false;
                    if (showMessage) {
                        message.warning('请选择归属专业');
                    }
                }
                break;
            }

            case 1:
                validate = !!colDisptemplet || colDisptemplet === 0;
                if (!validate && showMessage) {
                    message.warning('请选择列模板');
                }
                break;
            case 2:
                validate = !!statusDispTemplet || statusDispTemplet === 0;
                if (!validate && showMessage) {
                    message.warning('请选择状态模板');
                }
                break;
            case 3:
                if (!filterIds) {
                    validate = false;
                    if (showMessage) {
                        message.warning(`请选择${windowType === '2' ? '自定义视图' : '过滤器'}`);
                    }
                }
                if (filterIds && filterIds.split(',').length > 20) {
                    validate = false;
                    if (showMessage) {
                        message.warning('最多选择20个过滤器');
                    }
                }
                break;
            default:
                validate = true;
        }
        return validate;
    }

    validateWindowName = (param) => {
        return request('v1/monitor-view/validateWindowName', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: param,
            showSuccessMessage: false,
            // 是否需要显示失败消息提醒
            showErrorMessage: false,
        });
    };

    async next() {
        const valid = await this.checkStepFormValid(this.state.current, true);
        if (!valid) {
            return;
        }
        const { stepStatus, tab1 } = this.state;
        if (this.state.current === 0) {
            const params = {
                windowName: tab1.windowName,
                windowId: this.props?.rowData?.windowId || null,
                viewProvince: tab1.regionId,
            };
            const res = await this.validateWindowName(params);
            if (res.code === -1) {
                return message.warn(res.message);
            }
        }
        const newStepStatus = [...stepStatus];
        newStepStatus[this.state.current] = 'finish';
        newStepStatus[this.state.current + 1] = 'process';
        const current = this.state.current + 1;
        this.setState({ current, stepStatus: newStepStatus });
    }

    prev() {
        const { stepStatus } = this.state;
        const newStepStatus = [...stepStatus];
        newStepStatus[this.state.current] = 'wait';
        newStepStatus[this.state.current - 1] = 'process';
        const current = this.state.current - 1;
        this.setState({ current, stepStatus: newStepStatus });
    }

    handleCancel = () => {
        this.props.visibleChange(false);
    };

    getMonitorStatus = async (showMessage) => {
        const status = [];
        const valid0 = await this.checkStepFormValid(0, showMessage);
        status[0] = valid0 ? 'finish' : 'error';
        const valid3 = await this.checkStepFormValid(3, showMessage);
        status[1] = valid3 ? 'finish' : 'error';
        return status;
    };

    getAllStepsStatus = async (showMessage) => {
        const status = [];
        const valid0 = await this.checkStepFormValid(0, showMessage);
        status[0] = valid0 ? 'finish' : 'error';
        const valid1 = await this.checkStepFormValid(1, showMessage);
        status[1] = valid1 ? 'finish' : 'error';
        const valid2 = await this.checkStepFormValid(2, showMessage);
        status[2] = valid2 ? 'finish' : 'error';
        const valid3 = await this.checkStepFormValid(3, showMessage);
        status[3] = valid3 ? 'finish' : 'error';
        return status;
    };

    onStepChange = async (current) => {
        const allStatus = await this.getAllStepsStatus(false);
        const newStatus = [];
        _.forEach(allStatus, (step, index) => {
            if (index === current) {
                newStatus[index] = 'process';
            }
            if (index < current) {
                newStatus[index] = allStatus[index];
            }
            if (index > current) {
                newStatus[index] = 'wait';
            }
        });
        this.setState({
            current,
            stepStatus: newStatus,
        });
    };

    render() {
        const { visible, rowData, userInfo, isEdit, unicomFlag, windowType } = this.props;
        const { current, tab1, colDisptemplet, statusDispTemplet, filterIds, stepStatus, onSubmit } = this.state;
        let steps = [
            {
                title: '视图信息',
                status: stepStatus[0],
                content: (
                    <WindowInfo
                        cacheData={tab1}
                        isEdit={isEdit}
                        rowData={rowData}
                        onOk={this.handleSave}
                        onCancel={this.handleCancel}
                        onDataChange={this.onTab1DataChange}
                        userInfo={userInfo}
                        addType={windowType}
                        unicomFlag={unicomFlag}
                        login={this.props.login}
                    />
                ),
            },
            {
                title: '展示列',
                status: stepStatus[1],
                content: (
                    <ColTemplate
                        cacheData={colDisptemplet}
                        isEdit={isEdit}
                        ifMonitorView={true}
                        ifTitle={false}
                        rowData={rowData}
                        onDataChange={this.onTab2DataChange}
                        userInfo={userInfo}
                        login={this.props.login}
                    />
                ),
            },
            {
                title: '状态标识',
                status: stepStatus[2],
                content: (
                    <StatusManager
                        cacheData={statusDispTemplet}
                        isEdit={isEdit}
                        ifTitle={false}
                        rowData={rowData}
                        onDataChange={this.onTab3DataChange}
                        userInfo={userInfo}
                        login={this.props.login}
                    />
                ),
            },
            {
                title: '过滤器',
                status: stepStatus[3],
                content: (
                    <Filter
                        cacheData={filterIds}
                        isEdit={isEdit}
                        rowData={rowData}
                        onDataChange={this.onTab4DataChange}
                        userInfo={userInfo}
                        login={this.props.login}
                    />
                ),
            },
        ];
        if (windowType === '2') {
            steps = [
                {
                    title: '视图信息',
                    status: stepStatus[0],
                    content: (
                        <WindowInfo
                            cacheData={tab1}
                            isEdit={isEdit}
                            rowData={rowData}
                            onOk={this.handleSave}
                            onCancel={this.handleCancel}
                            onDataChange={this.onTab1DataChange}
                            userInfo={userInfo}
                            addType={windowType}
                            unicomFlag={unicomFlag}
                            login={this.props.login}
                        />
                    ),
                },
                {
                    title: '自定义视图',
                    status: stepStatus[1],
                    content: (
                        <MonitorView
                            cacheData={tab1}
                            isEdit={isEdit}
                            ifMonitorView={true}
                            ifTitle={false}
                            rowData={rowData}
                            onDataChange={this.onTab4DataChange}
                            userInfo={userInfo}
                            login={this.props.login}
                        />
                    ),
                },
            ];
        }
        // eslint-disable-next-line no-nested-ternary
        const title = rowData ? (isEdit ? '编辑' : '查看') : '新建';
        return (
            <Modal
                destroyOnClose
                width={'60%'}
                bodyStyle={{ maxHeight: 'inherit' }}
                title={title}
                visible={visible}
                centered
                maskClosable={false}
                onCancel={this.handleCancel}
                footer={null}
            >
                <Layout style={{ backgroundColor: 'transparent' }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Header style={{ height: 'auto', backgroundColor: 'transparent' }}>
                            <Steps size="small" current={current} onChange={this.onStepChange}>
                                {steps.map((item) => (
                                    <Step key={item.title} title={item.title} status={item.status} />
                                ))}
                            </Steps>
                        </Header>
                        <Content style={{ height: '380px', backgroundColor: 'transparent', overflow: 'auto' }}>
                            <Card bordered={false} size="middle">
                                {steps[current].content}
                            </Card>
                        </Content>
                        <Footer style={{ textAlign: 'center', padding: 0, backgroundColor: 'transparent' }}>
                            <Space direction="horizontal" size="large" align="center">
                                <Button type="primary" onClick={() => this.prev()} disabled={current === 0}>
                                    上一步
                                </Button>
                                <Button type="primary" onClick={() => this.next()} disabled={current === steps.length - 1}>
                                    下一步
                                </Button>
                                {isEdit && (
                                    <AuthButton
                                        addLog={true}
                                        authKey={this.props.rowData ? 'alarmMonitor:edit' : 'alarmMonitor:add'}
                                        type="primary"
                                        onClick={(params) => this.handleSave(params)}
                                        disabled={onSubmit}
                                    >
                                        保存
                                    </AuthButton>
                                )}
                                {isEdit && (
                                    <Button type="primary" onClick={this.handleCancel}>
                                        取消
                                    </Button>
                                )}
                            </Space>
                        </Footer>
                    </Space>
                </Layout>
            </Modal>
        );
    }
}

export default Index;
