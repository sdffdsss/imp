import React from 'react';
import getData from '@Common/services/dataService';
import { makeCRC32 } from '@Common/utils';
import { Modal, Input, Row, Col, Form, Button, Select, InputNumber } from 'oss-ui';

const { TextArea } = Input;

const { Option } = Select;
export default class Index extends React.PureComponent {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            editRow: {},
            vendorData: [],
            neTypeData: []
        };
    }

    componentDidUpdate() {}

    componentDidMount() {
        this.getVendorData();
        this.getNeTypeData();
    }

    handleOk = (e) => {
        this.formRef.current.validateFields().then((values) => {
            this.insertThreshold(values);
        });
    };
    getVendorData = () => {
        getData('SelectVendorData', { showSuccessMessage: false }, {}).then((res) => {
            this.setState({
                vendorData: res.data.data
            });
        });
    };
    getNeTypeData = () => {
        getData('SelectNeTypeName', { showSuccessMessage: false }, {}).then((res) => {
            this.setState({
                neTypeData: res.data.data
            });
        });
    };
    handleCancel = (e) => {
        const { onChange } = this.props;
        onChange();
    };
    insertThreshold = (value) => {
        const threshold = makeCRC32((value.vendorId + new Date().getTime()).toString());
        getData(
            'InsertThresholdData',
            { showSuccessMessage: false },
            {
                vendorId: value.vendorId,
                alarmtimeDuration: value.alarmtimeDuration,
                dataFailType: value.dataFailType,
                neLabel: value.neLabel,
                neType: value.neType,
                intId: threshold
            }
        ).then((res) => {
            if (res && res.dealResult) {
                this.props.refresh();
                this.props.onCancel();
            }
        });
    };
    onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    // 清空查询条件
    onReset = () => {
        this.formRef.current.resetFields();
    };

    render() {
        const { visible } = this.props;
        const { vendorData, neTypeData } = this.state;
        return (
            <Modal width={1200} title="新增监控阀值" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                <Form name="advanced_search" className="oss-ui-advanced-search-form" onFinish={this.onFinish} ref={this.formRef}>
                    <Row gutter={24}>
                        <Col className="gutter-row" span={3}>
                            派单监控条件设置:
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item name="vendorId" label="厂家">
                                <Select placeholder="请选择厂家">
                                    {vendorData.map((type) => (
                                        <Select.Option key={type.vendorId} value={type.vendorId}>
                                            {type.vendorName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item name="neType" label="设备类型">
                                <Select placeholder="请选设备类型">
                                    {neTypeData.map((type) => (
                                        <Select.Option key={type.id} value={type.id}>
                                            {type.txt}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item name="neLabel" label="网元名称">
                                <Input placeholder="请输入元名称" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col className="gutter-row" span={3}>
                            监控阀值设置:
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item name="alarmtimeDuration" label="预警时间(小时)">
                                <InputNumber min={1} max={10} />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item name="dataFailType" label="失败类型">
                                <Select placeholder="请选失败类型">
                                    <Option value="0">无派单</Option>
                                    <Option value="1">派单失败</Option>
                                    <Option value="2">派单延迟</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Button onClick={this.onReset}>重置</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}
