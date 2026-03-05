import React from 'react';
import constants from '@Src/common/constants';
import { Button, Col, Modal, Progress, Row, Spin, Tooltip, Popconfirm, Table, Icon } from 'oss-ui/es';
import { withModel } from 'hox';
import { ruleApi } from '../service/ruleApi';
import './index.less';
import { download } from '../utils/download';
import { AlarmWindowWithProcessor } from '@Components/oss-alarm-window/es';
import useLoginInfoModel, { useAlarmWindowConfigModel, useEnvironmentModel } from '@Src/hox';
import Detail from '@Src/pages/auto-sheet-rule/edit';
import AuthButton from '@Src/components/auth-button';
import request from '@Common/api';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.timer = undefined;
        this.stopTimeout = 0;
        this.state = {
            dataSource: {},
            xmlVisible: false,
            loading: false,
            percentObj: {},
            logParams: {},
            gateUrl: false,
            // 规则详情显示
            viewModalVisible: false,
            stepsData: [
                { percent: 100, status: 'finish', title: '数据准备' },
                { percent: 0, status: 'finish', title: '模拟发送' },
                { percent: 0, status: 'finish', title: '结果分析' },
            ],
        };
    }
    getWay = (zoneId) => {
        return request(`gateway/service`, {
            type: 'get',
            baseUrlType: 'gatewayUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data: {
                serviceName: 'cloud.view.server-imc',
                identifier: zoneId,
            },
        });
    };
    get api() {
        return ruleApi;
    }

    get columns() {
        // const { dataSource } = this.state;
        const columns = [
            {
                key: 'simulationNum',
                dataIndex: 'simulationNum',
                title: '模拟告警数',
            },
            {
                key: 'dispatchNum',
                dataIndex: 'dispatchNum',
                title: '派单条件告警数',
            },
            {
                key: 'sheetNum',
                dataIndex: 'sheetNum',
                title: '工单总数',
            },
        ];

        return columns;
    }

    get urlRecordId() {
        return this.props.match?.params?.recordId;
    }

    get recordId() {
        return this.urlRecordId || this.props.recordId;
    }

    get contextAndToolbar() {
        return { alarmContextMenu: { active: [] }, alarmToolBar: { active: ['AlarmExport', 'ColumnSettings'] } };
    }

    get frameInfo() {
        const {
            login: { systemInfo, userInfo, loginId },
        } = this.props;
        const info = JSON.parse(userInfo) || {};
        return {
            serviceConfig: {
                isUseIceGrid: useEnvironmentModel.data.environment.iceUrl.isUseIceGrid.direct,
                icegridUrl: useEnvironmentModel.data.environment.iceUrl.icegridUrl.direct,
                icegridBackupUrl: useEnvironmentModel.data.environment.iceUrl.icegridBackupUrl.direct,
                icegridSvcId:
                    `znjk/${constants.CUR_ENVIRONMENT}/` + useEnvironmentModel.data.environment.iceUrl.icegridSvcId.direct.replace(/^\//, ''),
                directSvcId:
                    `znjk/${constants.CUR_ENVIRONMENT}/` +
                    (this.state.gateUrl || useEnvironmentModel.data.environment.iceUrl.directSvcAutoId.direct).replace(/^\//, ''),
                directServiceUrl: useEnvironmentModel.data.environment.iceUrl.directServiceUrl.direct,
                batchSize: useAlarmWindowConfigModel.data.environment.batchSize,
                clientTimeOutSeconds: 3000,
                refreshInterval: useEnvironmentModel.data.environment.iceUrl.refreshInterval.direct,
            },
            userInfo: {
                userId: useLoginInfoModel.data.userId,
                userName: useLoginInfoModel.data.userName,
                loginId: loginId || '',
                operationsButton: info?.operationsButton || [],
                buttonAuthorize: useEnvironmentModel.data.environment.buttonAuthorize,
                zoneId: useLoginInfoModel.data?.currentZone?.zoneId,
                zoneName: systemInfo?.currentZone?.zoneId || info?.zones[0]?.zoneName,
            },
            otherService: {
                viewItemExportUrl: `${useEnvironmentModel.data.environment.viewItemExportUrl?.direct}/`,
            },
        };
    }

    get registerWindow() {
        return [
            {
                winType: 1, //活动
                winName: 'active',
            },
        ];
    }

    componentDidMount() {
        this.gateWayData();
        this.percentHandle();
    }
    gateWayData = async () => {
        if (!useEnvironmentModel.data.environment.gateWayBtn) {
            return;
        }
        const {
            login: { systemInfo, userInfo },
        } = this.props;
        const info = JSON.parse(userInfo);
        let zoneId = systemInfo.currentZone?.zoneId || info?.zones[0]?.zoneId;
        const res = await this.getWay(zoneId);
        if (res.location) {
            // gateRef.current = res.location;
            this.setState({
                gateUrl: res.location,
            });
        } else {
            this.setState({
                gateUrl: false,
            });
        }
    };
    getPercent = async () => {
        const percentObj = await this.getSimulationPercent();
        this.timer = setTimeout(async () => {
            if (percentObj.percent !== 100) {
                this.getPercent();
            } else if (this.stopTimeout < 120) {
                this.stopTimeout += 1;
                this.getPercent();
            }
        }, 1000);
    };

    percentHandle = async () => {
        const data = await this.tableRequest();
        const { status, simulationNum, dispatchNum, sheetNum } = data;
        let percentObj = { simulationNum, dispatchNum, sheetNum, percent: 0 };
        switch (status) {
            case 1:
                percentObj.percent = 100;
                break;
            case 2:
                percentObj.percent = 0;
                break;
            default:
                percentObj = await this.getSimulationPercent();
                break;
        }
        this.setState(percentObj, () => {
            this.getPercent();
        });
    };

    getSimulationPercent = async () => {
        const percentObj = await this.api.getSimulationPercent(this.recordId);
        percentObj.percent = Number(percentObj.percent);

        this.setState({
            percentObj,
            stepsData: [
                { percent: 100, status: 'finish', title: '数据准备' },
                { percent: percentObj.percent, status: 'finish', title: '模拟发送' },
                { percent: percentObj.percent === 100 ? 100 : 0, status: percentObj.percent === 100 ? 'finish' : 'wait', title: '结果分析' },
            ],
        });
        return percentObj;
    };

    componentDidUpdate(prevProps) {
        if (prevProps.recordId !== this.props.recordId) {
            this.tableRequest();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    tableRequest = async () => {
        this.setState({ loading: true });
        const recordId = this.recordId;
        const data = await this.api.getValidatorDetail(recordId);
        this.setState({ dataSource: data || {}, loading: false });
        return data;
    };

    showXml = () => {
        this.setState({ xmlVisible: true });
    };

    hideXml = () => {
        this.setState({ xmlVisible: false });
    };

    downloadXml = async () => {
        const { ruleName, startTime } = this.state.dataSource;
        const result = await this.api.downloadValidateXml(this.recordId);
        download(result, ruleName + '_' + startTime + '.xml');
    };

    onCancel = async () => {
        const { percentObj, logParams, dataSource } = this.state;
        await this.api.cancelValidate(this.recordId, this.state.dataSource.ruleId, logParams);
        percentObj.percent = 0;
        dataSource.status = 2;
        this.setState({ percentObj: { ...percentObj }, dataSource: { ...dataSource } });
        clearTimeout(this.timer);
    };

    goList = () => {
        this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/simulation-validation-list`);
    };
    registerParamFormatter = (windowData) => {
        const { dataSource } = this.state;
        const data = {
            ...windowData,
            subscribeInfoJSON: {
                ...windowData.subscribeInfoJSON,
                type: 1,
                beginTimeStr: dataSource.startTime,
                endTimeStr: dataSource.endTime,
                subscribeProperties: {
                    ...windowData.subscribeInfoJSON.subscribeProperties,
                    filterIds: [dataSource.conditionFilterId],
                },
            },
        };
        return data;
    };

    // 格式化规则名称
    formatRuleName = (ruleName) => {
        // 超过15个字符用...代替
        if (ruleName?.length > 15) {
            return `${ruleName?.substring(0, 15)}...`;
        }
        return ruleName;
    };
    renderModal = () => {
        const { dataSource } = this.state;
        return (
            <Detail
                match={{
                    params: {
                        type: 'edit',
                        moduleId: 10,
                        id: dataSource?.oldRuleId,
                        isCheck: true,
                        isSimulation: true,
                        date: dataSource?.createTime,
                    },
                }}
            />
        );
    };

    // 关闭规则详情弹框
    onDetailModalCancel = () => {
        this.setState({
            viewModalVisible: false,
        });
    };

    // 获取步骤样式
    getStepItemStyle = (index) => {
        if (index === 1) {
            return {
                position: 'relative',
                left: '-2.2vw',
                top: '-4px',
            };
        }
        if (index === 2) {
            return {
                position: 'relative',
                left: '-2.8vw',
                top: '-4px',
            };
        }
        return {};
    };

    // 步骤验证
    getProgressByStep = () => {
        const { stepsData, percentObj } = this.state;
        return (
            <>
                {stepsData?.map((item, index) => {
                    return (
                        <div className="step-item" key={index} style={item.percent !== 100 ? this.getStepItemStyle(index) : {}}>
                            <div
                                className="step-item-title-percent"
                                style={item.percent === 100 && index === 2 ? { marginLeft: '-10vw' } : { marginLeft: '-5vw' }}
                            >
                                {item.percent}%
                            </div>
                            <Progress percent={item.percent} status={item.status} showInfo={index === 0 || item.percent === 100} />
                            {index === 1 && item.percent !== 100 && <div className="step-content-2">2</div>}
                            {index === 2 && item.percent !== 100 && <div className="step-content-3">3</div>}
                            <div
                                className="step-item-title"
                                style={item.percent === 100 && index === 2 ? { marginLeft: '-10vw' } : { marginLeft: '-5vw' }}
                            >
                                <span className="step-item-title-text">{item.title}</span>
                            </div>
                        </div>
                    );
                })}
                {percentObj?.timeRemaining && <div className="time-remaining">预计剩余时间：{percentObj?.timeRemaining}分钟</div>}
            </>
        );
    };

    render() {
        const { dataSource, xmlVisible, loading, percentObj, viewModalVisible } = this.state;
        const { filterId, filterName, columnId, statusId } = dataSource;
        const { isAdmin, userId } = this.props.login;
        return (
            <div className="simulation-detail">
                <Spin spinning={loading}>
                    {this.urlRecordId && (
                        <div className="simulation-info">
                            <h2 className="simulation-title">
                                <span>任务基础信息</span>
                                <div>
                                    <Button type="primary" onClick={this.goList}>
                                        返回
                                    </Button>
                                    {/* <Popconfirm title="是否确认取消验证？" onConfirm={this.onCancel}> */}
                                    <AuthButton
                                        addLog
                                        style={{ marginLeft: '10px' }}
                                        authKey="associationRulesVa:stop"
                                        onClick={(logParams) => {
                                            Modal.confirm({
                                                title: '提示',
                                                icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                                                content: '是否确认取消验证？',
                                                okText: '确认',
                                                okButtonProps: { prefixCls: 'oss-ui-btn' },
                                                cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                                                okType: 'danger',
                                                cancelText: '取消',
                                                prefixCls: 'oss-ui-modal',
                                                onOk: () => {
                                                    this.setState({ logParams });
                                                    this.onCancel();
                                                },
                                                onCancel() {},
                                            });
                                        }}
                                        disabled={
                                            // false
                                            percentObj.percent === 100 || dataSource.status !== 0
                                                ? true
                                                : isAdmin
                                                ? false
                                                : userId !== dataSource.creator
                                        }
                                    >
                                        取消验证
                                    </AuthButton>
                                    {/* </Popconfirm> */}
                                </div>
                            </h2>
                            <Row>
                                <Col span={8} className="content-col">
                                    <label className="content-label">规则名称</label>
                                    <Tooltip title={dataSource.ruleName}>
                                        <span className="content-value">{this.formatRuleName(dataSource.ruleName)}</span>
                                    </Tooltip>
                                    <Tooltip title={'查看规则详情'}>
                                        <Button
                                            type="link"
                                            style={{ marginLeft: 5 }}
                                            onClick={() => {
                                                this.setState({ viewModalVisible: true });
                                            }}
                                        >
                                            <Icon antdIcon type="SearchOutlined"></Icon>
                                        </Button>
                                    </Tooltip>
                                </Col>
                                <Col span={8} className="content-col">
                                    <label className="content-label">验证类型</label>
                                    <Tooltip title={dataSource.typeDesc}>
                                        <span className="content-value">{dataSource.typeDesc}</span>
                                    </Tooltip>
                                </Col>
                                <Col span={8} className="content-col">
                                    <label className="content-label">告警来源</label>
                                    <Tooltip title={dataSource.originDesc}>
                                        <span className="content-value">{dataSource.originDesc}</span>
                                    </Tooltip>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8} className="content-col">
                                    <label className="content-label">告警开始时间</label>
                                    <Tooltip title={dataSource.alarmStartTime}>
                                        <span className="content-value">{dataSource.alarmStartTime}</span>
                                    </Tooltip>
                                </Col>
                                <Col className="content-col">
                                    <label className="content-label">告警结束时间</label>
                                    <Tooltip title={dataSource.alarmEndTime}>
                                        <span className="content-value">{dataSource.alarmEndTime}</span>
                                    </Tooltip>
                                </Col>
                            </Row>
                        </div>
                    )}
                    <h2 className="simulation-title">验证结果</h2>
                    <Row>
                        <Col className="content-col" span={24}>
                            <label className="content-label">验证进度</label>
                            <div className="progress-content">{this.getProgressByStep()}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="content-col" span={24} style={{ display: 'none', alignItems: 'center' }}>
                            <label className="content-label">规则XML文件</label>
                            <Button type="link" onClick={this.showXml}>
                                查看
                            </Button>
                            <Button type="link" onClick={this.downloadXml}>
                                下载
                            </Button>
                        </Col>
                    </Row>
                    {percentObj.percent > 0 ? (
                        <Row>
                            <Col className="content-col" span={24}>
                                <label className="content-label">验证数目</label>
                                <Table bordered className="nums-table" pagination={false} columns={this.columns} dataSource={[percentObj]} />
                            </Col>
                        </Row>
                    ) : null}
                    <Row className="rule-alarm-window-wrapper">
                        <Col className="content-col rule-alarm-window-col" span={24}>
                            <label className="content-label">告警详情</label>
                            <div style={{ flex: 1, overflow: 'hidden', height: '100%' }}>
                                {filterId && (
                                    <AlarmWindowWithProcessor
                                        needFp={false}
                                        exportHtmlType={false}
                                        onDoubleClick={() => {}}
                                        filterIdList={[filterId]}
                                        filterNameList={[filterName]}
                                        colDispTemplet={columnId}
                                        statusDispTemplet={statusId}
                                        frameInfo={this.frameInfo}
                                        alarmTitlelist={{ active: '' }}
                                        registerWindow={this.registerWindow}
                                        contextAndToolbar={this.contextAndToolbar}
                                        registerParamFormatter={this.registerParamFormatter}
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                </Spin>
                <Modal
                    title="规则快照详情"
                    visible={xmlVisible}
                    maskClosable={false}
                    onCancel={this.hideXml}
                    className="xml-view-modal"
                    footer={
                        <Button type="primary" onClick={this.hideXml}>
                            确定
                        </Button>
                    }
                >
                    {dataSource.ruleContent}
                </Modal>
                {viewModalVisible && (
                    <Modal
                        destroyOnClose
                        title={dataSource.ruleName}
                        width={1200}
                        visible={viewModalVisible}
                        onCancel={this.onDetailModalCancel}
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
                )}
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
