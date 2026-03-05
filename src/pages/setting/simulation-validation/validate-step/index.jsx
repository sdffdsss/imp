import { ruleApi } from '../service/ruleApi';
import enums from '../common/enums';
import { Button, Col, DatePicker, Form, Input, Modal, Progress, Radio, Row, Select, Spin, Tooltip } from 'antd';
import React from 'react';
import './index.less';
import moment from 'moment';
import ConditionShow from '@Src/components/condition-show';
import { Icon } from 'oss-ui';
import SimulationDetail from '../detail';
import { filterApi } from '../service/filterApi';

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alarms: [],
            simulationVisible: false,
            simulationLoading: false,
            regressionVisible: false,
            recordId: undefined,
            progress: 0,
            modalVisible: false,
        };
        this.timer = undefined;
        this.simulationForm = React.createRef();
        this.regressionForm = React.createRef();
    }

    get api() {
        return ruleApi;
    }

    get defaultTime() {
        const end = moment();
        const start = moment().subtract(1, 'months');
        return [start, end];
    }

    get format() {
        return 'YYYY-MM-DD HH:mm';
    }

    componentDidMount() {
        this.getAlarms();
    }

    openSimulationModal = () => {
        this.setState({ simulationVisible: true });
    };

    closeSimulationModal = () => {
        this.setState({ simulationVisible: false });
    };

    getAlarms = async () => {
        const { ruleId } = this.props.ruleInfo;
        const result = await this.api.getHandleAlarm({ current: 1, pageSize: 1000, ruleId });
        const alarms = result.data.map((item) => {
            const { alarmDuration, alarmDurationUnit, networkType, equipType, vendorId } = item;
            const { vendeDic, objectClassDic, firstprofessionsDataDic } = this.props;
            item.count = [0];
            item.folder = true;
            item.alarmDurationName = alarmDuration + this.getName(enums.timeTypeList, alarmDurationUnit);
            item.vendorName = this.getName(vendeDic, vendorId.split(','));
            item.networkTypeName = this.getName(firstprofessionsDataDic, networkType.split(','));
            item.equipName = this.getName(objectClassDic, equipType.split(','));
            return item;
        });
        this.setState({ alarms });
    };

    // 根据值获得中文名
    getName = (arr, value, valueKey = 'value', nameKey = 'label') => {
        if (Array.isArray(value)) {
            const target = arr.filter((item) => value.includes(item[valueKey]));
            return target.map((item) => item[nameKey]).join(',');
        } else {
            const target = arr.find((item) => item[valueKey] === value);
            return target ? target[nameKey] : '';
        }
    };

    changeFolder = async (item) => {
        this.setState({ simulationLoading: true });
        item.folder = !item.folder;
        if (!item.filterData) {
            const result = await filterApi.getFilterData(item.alarmFilterId);
            item.filterData = this.handleData(result.filterExpr || []);
        }
        this.setState({ alarms: [...this.state.alarms], simulationLoading: false });
    };

    /**
     * @description: 处理数据
     * @param {*}
     * @return {*}
     */
    handleData = (data) => {
        if (!data) return;
        let tempData = {};
        let tempArr =
            Array.isArray(data.filterConditionList) &&
            data.filterConditionList.map((item) => {
                let conditionArr =
                    Array.isArray(item?.conditionExpr?.conditionItemList) &&
                    item?.conditionExpr?.conditionItemList.map((condition) => {
                        return {
                            name: condition.fieldName,
                            label: condition.fieldLabel,
                            value:
                                Array.isArray(condition.valueList) &&
                                condition.valueList.map((value) => {
                                    if (condition.valueSize > 0) {
                                        return {
                                            value: value.key,
                                            label: value.value,
                                        };
                                    } else {
                                        if (condition.dataType === 'time' || condition.dataType === 'date') {
                                            return moment(value);
                                        } else {
                                            return value.key;
                                        }
                                    }
                                }),
                            ...condition,
                        };
                    });
                return {
                    conditionId: item.conditionId,
                    conditionLabel: item.conditionLabel,
                    reverse: item.reverse,
                    logicalType: item?.conditionExpr?.logicalType,
                    children: conditionArr || [],
                };
            });
        tempData.children = tempArr || [];
        tempData.logicalType = data.logicalType || 'null';
        return tempData;
    };

    simulationSubmit = async () => {
        const result = this.simulationForm.current.getFieldsValue();
        console.log(result);
    };

    addCount = (item) => {
        const { count } = item;
        count.push(count[count.length - 1] + 1);
        this.setState({ alarms: [...this.state.alarms] });
    };

    removeCount = (item, index) => {
        const { count } = item;
        const set = new Set(count);
        set.delete(index);
        item.count = Array.from(set);
        this.setState({ alarms: [...this.state.alarms] });
    };

    addRegression = async (values) => {
        const { origin, alarmTime, sendStrategy } = values;
        const { userProvinceId, userProvinceName, userId } = this.props.userInfo;
        const { ruleId, ruleName } = this.props.ruleInfo;
        const alarmStartTime = alarmTime[0].format(this.format) + ':00';
        const alarmEndTime = alarmTime[1].format(this.format) + ':00';
        const params = {
            origin,
            type: 2,
            sendStrategy,
            alarmStartTime,
            alarmEndTime,
            creator: userId,
            createProvinceId: userProvinceId,
            createProvinceName: userProvinceName,
        };
        const recordList = [{ ruleId, ruleName }];
        const result = await this.api.addValidator(params, recordList);
        const recordId = Array.isArray(result) && result[0] ? result[0].recordId : undefined;
        this.setState({ modalVisible: false, recordId });
    };

    validateTime = (rule, value) => {
        if (!value || !Array.isArray(value) || !(value.length === 2)) {
            return Promise.reject('请正确选择时间范围！');
        }
        if (value[1].diff(value[0], 'day') > 31) {
            return Promise.reject('时间跨度最大支持31天！');
        }
        return Promise.resolve();
    };

    openModal = async () => {
        const values = await this.regressionForm.current.validateFields();
        this.setState({ regressionVisible: false, modalVisible: true });
        this.timer = setInterval(() => {
            const { progress } = this.state;
            if (progress >= 100) {
                clearInterval(this.timer);
                this.addRegression(values);
                return;
            }
            this.setState({ progress: progress + 3 });
        }, 100);
    };

    cancelValidate = () => {
        clearInterval(this.timer);
        this.setState({ modalVisible: false, progress: 0 });
    };

    render() {
        const { alarms, simulationVisible, simulationLoading, regressionVisible, recordId, modalVisible, progress } = this.state;
        return (
            <div className="validate-step">
                <header className="validate-step-header">
                    <Button
                        type="primary"
                        icon={<Icon antdIcon type="PlusOutlined" />}
                        style={{ marginRight: '10px' }}
                        onClick={this.openSimulationModal}
                    >
                        模拟验证
                    </Button>
                    <Button type="primary" icon={<Icon antdIcon type="PlusOutlined" />} onClick={() => this.setState({ regressionVisible: true })}>
                        回归验证
                    </Button>
                    <span className="hint">温馨提示：以上测试使用的模拟告警，非现网告警，不影响告警监控！</span>
                </header>
                <SimulationDetail recordId={recordId} />
                <Modal
                    width="80vw"
                    okText="开始验证"
                    title="新建模拟验证"
                    maskClosable={false}
                    visible={simulationVisible}
                    onCancel={this.closeSimulationModal}
                    onOk={this.simulationSubmit}
                >
                    <Spin spinning={simulationLoading}>
                        <Form ref={this.simulationForm}>
                            <div className="add-simulation-modal">
                                {alarms.map((item) => (
                                    <div className="add-simulation">
                                        <header onClick={this.changeFolder.bind(this, item)} className="add-simulation-header">
                                            告警组名称: {item.alarmAlias}
                                        </header>
                                        <div className={item.folder ? 'add-simulation-content hidebox' : 'add-simulation-content'}>
                                            <p className="content-title">告警基本信息</p>
                                            <Row>
                                                <Col span={8} className="content-col">
                                                    <label className="content-label">告警组名称</label>
                                                    <Tooltip title={item.alarmAlias}>
                                                        <span className="content-value">{item.alarmAlias}</span>
                                                    </Tooltip>
                                                </Col>
                                                <Col span={8} className="content-col">
                                                    <label className="content-label">关联字段</label>
                                                    <Tooltip title={item.relatedAlarmFieldName}>
                                                        <span className="content-value">{item.relatedAlarmFieldName}</span>
                                                    </Tooltip>
                                                </Col>
                                                <Col span={8} className="content-col">
                                                    <label className="content-label">关联时间窗</label>
                                                    <Tooltip title={item.alarmDurationName}>
                                                        <span className="content-value">{item.alarmDurationName}</span>
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={8} className="content-col">
                                                    <label className="content-label">专业</label>
                                                    <Tooltip title={item.networkTypeName}>
                                                        <span className="content-value">{item.networkTypeName}</span>
                                                    </Tooltip>
                                                </Col>
                                                <Col span={8} className="content-col">
                                                    <label className="content-label">厂家</label>
                                                    <Tooltip title={item.vendorName}>
                                                        <span className="content-value">{item.vendorName}</span>
                                                    </Tooltip>
                                                </Col>
                                                <Col span={8} className="content-col">
                                                    <label className="content-label">设备类型</label>
                                                    <Tooltip title={item.equipName}>
                                                        <span className="content-value">{item.equipName}</span>
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                            <p className="content-title">规则条件</p>
                                            {item.filterData && <ConditionShow data={item.filterData} />}
                                            <p className="content-title">字段赋值</p>
                                            <Row>
                                                <Col className="content-col" span={6} style={{ marginRight: '10px' }}>
                                                    <label className="content-form-label">关联字段</label>
                                                    <Tooltip title={item.relatedAlarmFieldName}>
                                                        <span className="content-value">{item.relatedAlarmFieldName}</span>
                                                    </Tooltip>
                                                </Col>
                                                <Col>
                                                    <Form.Item>
                                                        <Input allowClear />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            {item.count.map((c) => (
                                                <Row>
                                                    <Col span={6} style={{ marginRight: '10px' }}>
                                                        <Form.Item label="统计字段">
                                                            <Select width="200px" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col>
                                                        <Form.Item name={c.toString()}>
                                                            <Input allowClear />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col style={{ marginLeft: '10px' }}>
                                                        <Button onClick={this.addCount.bind(this, item)} icon={<Icon antdIcon type="PlusOutlined" />}>
                                                            增加
                                                        </Button>
                                                        <Button
                                                            onClick={this.removeCount.bind(this, item, c)}
                                                            icon={<Icon antdIcon type="MinusOutlined" />}
                                                        >
                                                            删除
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Form>
                    </Spin>
                </Modal>
                <Modal
                    destroyOnClose
                    title="创建回归验证"
                    maskClosable={false}
                    onOk={this.openModal}
                    visible={regressionVisible}
                    onCancel={() => this.setState({ regressionVisible: false })}
                >
                    <Form
                        ref={this.regressionForm}
                        initialValues={{
                            origin: 2,
                            sendStrategy: 1,
                            alarmTime: this.defaultTime,
                        }}
                    >
                        <Form.Item label="告警发送策略" name="sendStrategy">
                            <Radio.Group>
                                <Radio value={1}>按历史告警活动时间间隔发送</Radio>
                                <Radio value={2}>按活动告警活动时间间隔发送</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="数据来源" name="origin">
                            <Radio.Group>
                                <Radio value={2}>从告警库</Radio>
                                <Radio value={1}>从实时告警</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="时间范围" name="alarmTime" rules={[{ validator: this.validateTime }]}>
                            <DatePicker.RangePicker
                                allowClear={false}
                                format={this.format}
                                showTime={{ format: 'HH:mm' }}
                                placeholder={['开始时间', '结束时间']}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="正在验证"
                    okText="取消验证"
                    closable={false}
                    visible={modalVisible}
                    onOk={this.cancelValidate}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    okButtonProps={{ disabled: progress >= 100 }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <Progress percent={progress} />
                        规则验证中，请稍后
                    </div>
                </Modal>
            </div>
        );
    }
}
