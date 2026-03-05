import React from 'react';
import { VirtualTable } from 'oss-web-common';
import './index.less';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { ruleApi } from './service/ruleApi';
import { filterApi } from './service/filterApi';
import moment from 'moment';
import { Icon, Input, Select, Space, Button, Col, Form, message, Modal, Progress, Radio, Row, Tooltip } from 'oss-ui';
import { getInitialProvince } from '@Common/utils/getInitialProvince';
import { getUserProvinceName } from './utils/loginInfo';
import AuthButton from '@Src/components/auth-button';
import Detail from '@Src/pages/auto-sheet-rule/edit';
import DatePickTime from '@Src/components/date-range-time';
import CustomModalFooter from '@Components/custom-modal-footer';
import constants from '@Common/constants';

const { Option } = Select;
const InputNumberField = ({ value, onChange }) => {
    const inputChanage = (e) => {
        const values = parseInt(e.target.value, 10) || '';
        onChange(values);
    };
    return <Input value={value} style={{ width: 60 }} onChange={inputChanage} />;
};
export class Index extends React.Component {
    constructor(props) {
        super(props);
        // this.provinceData = [];
        this.state = {
            selectedRows: [],
            selectedRowKeys: [],
            progress: 0,
            modalVisible: false,
            result: [],
            professionalTypeOps: [],
            resultVisible: false,
            loading: false,
            logParams: {},
            viewSheetId: '',
            viewModalTitle: '',
            viewModalVisible: false,
        };
        this.actionRef = React.createRef();
        this.formRef = React.createRef();
        this.timer = undefined;
    }
    componentDidMount() {
        this.ininProfessionalTypeOps();
    }

    get api() {
        return ruleApi;
    }

    get format() {
        return 'YYYY-MM-DD HH:mm';
    }

    get zoneInfo() {
        const userInFo = JSON.parse(this.props.login.userInfo);
        const zoneInfo = userInFo?.zones;
        const { state } = this.props.location;
        return {
            userProvinceId: getInitialProvince(this.props.login),
            groupUser: zoneInfo && zoneInfo[0]?.zoneLevel ? parseInt(zoneInfo[0].zoneLevel, 10) === 1 : false,
            userId: this.props.login.userId,
            userProvinceName: state?.provinces[0]?.label,
            filterProvince: getInitialProvince(this.props.login),
            creator: this.props.login.userId,
            userName: this.props.login.userName,
        };
    }

    get columns() {
        return [
            {
                title: '规则ID',
                dataIndex: 'filterId',
                key: 'filterId',
                hideInSearch: true,
                render(text, record) {
                    const { filterId } = record;
                    return (
                        <div title={filterId} className="table-ellipsis">
                            {filterId}
                        </div>
                    );
                },
            },
            {
                title: '派单规则名称',
                dataIndex: 'filterName',
                key: 'filterName',
                hideInSearch: true,
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                title: '专业',
                dataIndex: 'filterProfessionalLabel',
                key: 'filterProfessionalLabel',
                hideInSearch: true,
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                title: '规则创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                hideInSearch: true,
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                title: '规则更新时间',
                dataIndex: 'modifyTime',
                key: 'modifyTime',
                hideInSearch: true,
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                title: '规则描述',
                dataIndex: 'filterDesc',
                key: 'filterDesc',
                hideInSearch: true,
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                title: '规则查询条件',
                dataIndex: 'filterName',
                key: 'filterName',
                hideInTable: true,
                renderFormItem: () => <Input allowClear placeholder="请输入规则名称或规则描述的关键字" />,
            },
            {
                title: '操作',
                valueType: 'option',
                dataIndex: 'actions',
                fixed: 'right',
                width: '50px',
                render: (text, record) => {
                    return [
                        <Space>
                            <Tooltip title="查看" trigger={['hover', 'click']}>
                                <Icon type="SearchOutlined" antdIcon onClick={this.viewSheetClick.bind(this, record, 'view')} />
                            </Tooltip>
                        </Space>,
                    ];
                },
            },
        ];
    }
    ininProfessionalTypeOps = async () => {
        const data = {
            pageSize: 2500,
            dictName: 'professional_type',
            en: false,
            modelId: 2,
            creator: this.props.login.userId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
        };
        const res = await filterApi.getDictEntry(data);
        this.setState({ professionalTypeOps: Array.isArray(res) ? res : [] });
    };

    viewSheetClick = (record) => {
        this.setState(
            {
                viewSheetId: record.filterId,
                viewModalTitle: record.filterName,
            },
            () => {
                this.setState({
                    viewModalVisible: true,
                });
            },
        );
    };
    onModalCancel = () => {
        this.setState({
            viewModalVisible: false,
        });
    };
    renderModal = () => {
        const { viewSheetId } = this.state;
        return (
            <Detail
                match={{
                    params: {
                        type: 'edit',
                        moduleId: 10,
                        id: viewSheetId,
                        isCheck: true,
                    },
                }}
            />
        );
    };
    getDefaultTime(sendStrategy) {
        const end = moment();
        const start = sendStrategy === 1 ? moment().subtract(3, 'days') : moment().add(1, 'day');
        return sendStrategy === 1 ? [start, end] : [end, start];
    }

    tableRequest = async (params) => {
        try {
            this.setState({ loading: true });
            const values = this.formRef.current.getFieldsValue();
            const { filterName, filterProfessional } = values;
            const queryParam = {
                ...this.zoneInfo,
                ...params,
                filterName,
            };
            if (filterProfessional && filterProfessional.length > 0) {
                queryParam.filterProfessional = filterProfessional.join(',');
            }
            const result = await this.api.getSimulationRules(queryParam);
            let { data, total } = result;
            if (total === 0 || !data) {
                return {
                    data: [],
                    total: 0,
                    success: true,
                };
            }
            data = data.sort((a, b) => {
                const aTime = moment(a.modifyTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                const bTime = moment(b.modifyTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                return bTime - aTime;
            });
            return { data, total, success: true };
        } catch (e) {
            return {
                data: [],
                total: 0,
                success: false,
            };
        } finally {
            this.setState({ loading: false });
        }
    };

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    };

    openModal = async (params) => {
        const { selectedRows } = this.state;
        await this.formRef.current.validateFields();
        if (!selectedRows.length) {
            message.error('请选择规则！');
            return;
        }
        this.setState({ modalVisible: true });
        this.timer = setInterval(() => {
            const { progress } = this.state;
            if (progress >= 100) {
                clearInterval(this.timer);
                this.addValidator(params);
                return;
            }
            this.setState({ progress: progress + 3 });
        }, 100);
    };

    addValidator = async (params) => {
        const { selectedRows } = this.state;
        const values = await this.formRef.current.validateFields();
        // const { time, sendStrategy, long, unit } = values;
        const { time, sendStrategy, long } = values;
        let unit = values.unit;
        if (unit === '分') {
            unit = 'minutes';
        }
        const { userProvinceId, userProvinceName, userId, userName } = this.zoneInfo;
        let alarmStartTime = moment().format(this.format) + ':00';
        let alarmEndTime = moment().format(this.format) + ':00';
        if (sendStrategy === 1) {
            alarmStartTime = time[0].format(this.format) + ':00';
            alarmEndTime = time[1].format(this.format) + ':00';
        } else {
            alarmStartTime = moment().format(this.format) + ':00';
            alarmEndTime = moment().add(long, unit).format(this.format) + ':00';
            console.log(moment(), moment().add(long, unit));
        }
        const data = {
            sendStrategy,
            origin: sendStrategy === 1 ? 2 : 1,
            type: 2,
            alarmStartTime,
            alarmEndTime,
            creator: userId,
            creatorName: userName,
            createProvinceId: userProvinceId,
            createProvinceName: userProvinceName,
        };
        const recordList = selectedRows.map((item) => ({ ruleId: item.filterId, ruleName: item.filterName }));
        try {
            const result = await this.api.addValidator(data, recordList, params);
            this.setState({ modalVisible: false, progress: 0, selectedRowKeys: [], selectedRows: [], result, resultVisible: true });
        } catch (e) {
            this.setState({ modalVisible: false, progress: 0 });
        }
    };

    goList = () => {
        this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/simulation-validation-list`);
    };

    closeResult = () => {
        this.setState({ resultVisible: false, result: [] });
    };

    cancelValidate = () => {
        clearInterval(this.timer);
        this.setState({ modalVisible: false, progress: 0 });
    };

    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    disabledDate = (current) => {
        // 今天的日期
        const today = moment().endOf('day');
        // 三天前的日期
        const threeDaysBefore = moment().subtract(3, 'days').startOf('day');

        // 禁用今天之后的日期和三天前的日期（不包括三天前的当天）
        return current.isAfter(today) || current.isBefore(threeDaysBefore);
    };
    disabledTime = (current) => {
        const now = moment();
        let disabledHours = [];
        let disabledMinutes = [];

        // 对于今天或未来的日期，禁用当前小时之后的小时和当前分钟之后的分钟
        if (current && !current.isBefore(now, 'day')) {
            for (let i = now.hour() + 1; i < 24; i++) {
                disabledHours.push(i);
            }
            if (current.hour() === now.hour()) {
                for (let i = now.minute() + 1; i < 60; i++) {
                    disabledMinutes.push(i);
                }
            }
        }

        // 对于3天前的日期，禁用当前小时之前的小时和当前分钟之前的分钟
        if (current && current.isSame(now.subtract(3, 'days'), 'day')) {
            for (let i = 0; i < now.hour(); i++) {
                disabledHours.push(i);
            }
            if (current.hour() === now.hour()) {
                for (let i = 0; i < now.minute(); i++) {
                    disabledMinutes.push(i);
                }
            }
        }

        return {
            disabledHours: () => disabledHours,
            disabledMinutes: () => disabledMinutes,
            disabledSeconds: () => [],
        };
    };

    onStrategyChange = (e) => {
        const sendStrategy = Number(e.target.value);
        const time = this.getDefaultTime(sendStrategy);
        this.formRef.current.setFieldsValue({ time });
    };

    reload = () => {
        this.actionRef.current.reload();
    };

    render() {
        const { progress, modalVisible, selectedRowKeys, resultVisible, result, loading, professionalTypeOps, viewModalTitle, viewModalVisible } =
            this.state;
        return (
            <div className="simulation-validation-wrapper">
                <Form
                    className="simulation-form"
                    ref={this.formRef}
                    initialValues={{
                        sendStrategy: 1,
                        time: this.getDefaultTime(1),
                    }}
                >
                    <div className="form-item-title">任务属性</div>
                    <Row>
                        <Col>
                            <Form.Item
                                label="告警来源"
                                name="sendStrategy"
                                onChange={this.onStrategyChange}
                                style={{ marginRight: '20px', marginBottom: 0 }}
                            >
                                <Radio.Group>
                                    <Radio value={1}>历史告警</Radio>
                                    <Radio value={2}>实时告警</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item label="起止时间" noStyle shouldUpdate>
                                {({ getFieldValue }) =>
                                    getFieldValue('sendStrategy') === 1 ? (
                                        <Form.Item label="起止时间" name="time">
                                            <DatePickTime
                                                disabledDate={this.disabledDate}
                                                disabledTime={this.disabledTime}
                                                allowClear={false}
                                                placeholder={['开始时间', '结束时间']}
                                                showTime={{ format: 'HH:mm' }}
                                                format="YYYY-MM-DD HH:mm"
                                                disabled={getFieldValue('sendStrategy') === 2}
                                            />
                                            {/* <DatePicker.RangePicker
                                                disabledDate={this.disabledDate}
                                                disabledTime={this.disabledTime}
                                                allowClear={false}
                                                placeholder={['开始时间', '结束时间']}
                                                showTime={{ format: 'HH:mm' }}
                                                format="YYYY-MM-DD HH:mm"
                                                disabled={[getFieldValue('sendStrategy') === 2, false]}
                                            /> */}
                                        </Form.Item>
                                    ) : (
                                        <Form.Item required label="告警发送时长">
                                            <Row>
                                                <Form.Item name="long" rules={[{ required: true, message: '请输入' }]} initialValue={5}>
                                                    {/* <InputNumber /> */}
                                                    <Select style={{ width: '80px' }}>
                                                        <Option key={5} value={5}>
                                                            5
                                                        </Option>
                                                        <Option key={10} value={10}>
                                                            10
                                                        </Option>
                                                        <Option key={15} value={15}>
                                                            15
                                                        </Option>
                                                        <Option key={30} value={30}>
                                                            30
                                                        </Option>
                                                        <Option key={45} value={45}>
                                                            45
                                                        </Option>
                                                        <Option key={60} value={60}>
                                                            60
                                                        </Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    style={{ marginLeft: '10px' }}
                                                    name="unit"
                                                    rules={[{ required: true, message: '请选择' }]}
                                                    initialValue={'分'}
                                                >
                                                    {/* <Select style={{ width: '80px' }}>
                                                    <Option key="minutes" value="minutes">分</Option>
                                                    <Option key="hours" value="hours">时</Option>
                                                    <Option key="days" value="days">天</Option>
                                                </Select> */}
                                                    <Input bordered={false}></Input>
                                                </Form.Item>
                                            </Row>
                                        </Form.Item>
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col style={{ flex: 1, textAlign: 'right', paddingRight: '12px' }}>
                            <Tooltip title="返回">
                                <Icon antdIcon onClick={this.goList} type="ArrowLeftOutlined" style={{ fontSize: '16px' }} />
                            </Tooltip>
                        </Col>
                    </Row>
                    <div className="form-item-title">规则选择</div>
                    <Row>
                        <Col>
                            <Form.Item label="规则查询条件" name="filterName">
                                <Input allowClear placeholder="请输入规则名称" />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item label="专业选择" name="filterProfessional" style={{ marginLeft: '10px' }}>
                                <Select
                                    allowClear
                                    style={{ minWidth: '260px' }}
                                    mode="multiple"
                                    placeholder="全部"
                                    align="left"
                                    maxTagCount="responsive"
                                >
                                    {professionalTypeOps.map((item) => (
                                        <Select.Option key={item.key}>{item.value}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: '10px' }}>
                            <Button loading={loading} onClick={this.reload}>
                                查询
                            </Button>
                        </Col>
                        <Col style={{ flex: 1, textAlign: 'right' }}>
                            <Button addLog type="primary" key="validate" onClick={this.openModal}>
                                开始验证
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <div className="simulation-table-wrapper">
                    <VirtualTable
                        x={100}
                        rowKey="filterId"
                        global={window}
                        columns={this.columns}
                        actionRef={this.actionRef}
                        request={this.tableRequest}
                        options={false}
                        rowSelection={{
                            selectedRowKeys,
                            onChange: this.onSelectChange,
                        }}
                        search={false}
                    />
                </div>
                <Modal
                    title="正在验证"
                    okText="取消验证"
                    closable={false}
                    visible={modalVisible}
                    onOk={this.cancelValidate}
                    footer={
                        <div style={{ textAlign: 'center' }}>
                            <AuthButton
                                type="default"
                                authKey="associationRulesVa:stop"
                                onClick={() => {
                                    this.cancelValidate();
                                }}
                            >
                                取消验证
                            </AuthButton>
                        </div>
                    }
                    cancelButtonProps={{ style: { display: 'none' } }}
                    okButtonProps={{ disabled: progress >= 100 }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <Progress percent={progress} />
                        规则验证中，请稍后
                    </div>
                </Modal>
                <Modal
                    maskClosable={false}
                    onOk={this.goList}
                    title="任务创建结果"
                    okText="查看任务列表"
                    visible={resultVisible}
                    onCancel={this.closeResult}
                    cancelButtonProps={{ style: { display: 'none' } }}
                >
                    <div className="result-wrapper">
                        {result.map((item) => (
                            <p>
                                <span>{item.filterName}</span>
                                <span className={item.status === 1 ? 'success-text' : 'fail-text'}>{item.statusDesc}</span>
                                <span>{item.msg}</span>
                            </p>
                        ))}
                    </div>
                </Modal>
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
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
