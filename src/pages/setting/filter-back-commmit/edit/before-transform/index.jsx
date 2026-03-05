import React from 'react';
import {
    Checkbox,
    Form,
    Row,
    Col,
    Modal,
    InputNumber,
    TimePicker,
    Select,
    DatePicker,
    Radio,
    Input,
    Button,
} from 'oss-ui';
import SMSTemplate from '@Components/sms-template';
import moment from 'moment';

export default React.forwardRef((props, ref) => {
    const [visible, setVisible] = React.useState(false);
    const [form] = Form.useForm();
    const initialValues = () => {
        const { initialValues } = props;

        if (!initialValues) {
            return {
                transformMode: 'pattern4checked',
                delayTime: 0,
                modifyUseTime: false,
                useTime: [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')],
                forwardDate: false,
                startForwardDate: moment(),
                endForwardDate: moment().add(1, 'days'),
                noEndDate: false,
                isClearSMSContent: false,
                numUpDownRepeatTimes: 1,
                sendMode: 'isCustom',
            };
        }
        return {
            ...initialValues,
            useTime: [moment(initialValues.startUseTime[0], 'HH:mm'), moment(initialValues.startUseTime[1], 'HH:mm')],
            startForwardDate: moment(initialValues.startForwardDate[0], 'YYYY-MM-DD'),
            endForwardDate: moment(initialValues.startForwardDate[1], 'YYYY-MM-DD'),
        };
    };

    const showSMSTemplateClick = () => {
        setVisible(true);
    };

    const onCancel = () => {
        setVisible(false);
    };

    // const onTemplateValue = (value) => {
    //     console.log(value);
    // };

    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作:</div>
            <Form initialValues={initialValues()} labelCol={{ span: 3 }} form={form} ref={ref}>
                <Form.Item label="前转模式" name="transformMode">
                    <Radio.Group
                        options={[
                            { label: '语音呼叫', value: 'pattern14checked' },
                            { label: '短信前转', value: 'pattern4checked' },
                            { label: '呼叫并前转', value: 'pattern18checked' },
                        ]}
                    ></Radio.Group>
                </Form.Item>
                <Form.Item label="延时时间" name="delayTime">
                    <InputNumber min={0} formatter={(value) => `${value}分钟`} />
                </Form.Item>
                <Row>
                    <Col span={3} style={{ textAlign: 'right', lineHeight: '32px' }}>
                        启用时间<span style={{ margin: '0 8px 0 2px' }}>:</span>
                    </Col>
                    <Col span={21}>
                        <Row>
                            <Col span={3}>
                                <Form.Item valuePropName="checked" name="modifyUseTime">
                                    <Checkbox>启用</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={21}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item name="useTime" noStyle>
                                                <TimePicker.RangePicker
                                                    disabled={!getFieldValue('modifyUseTime')}
                                                    format="HH:mm"
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Form.Item label="前转日期" name="forwardDate" valuePropName="checked">
                    <Checkbox>启用</Checkbox>
                </Form.Item>
                <Row style={{ marginBottom: 24 }}>
                    <Col span={21} offset={3}>
                        <Row>
                            <Col span={24}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item
                                                labelAlign="left"
                                                labelCol={{ span: 3 }}
                                                label="开始日期"
                                                name="startForwardDate"
                                            >
                                                <DatePicker
                                                    format="YYYY-MM-DD"
                                                    disabled={!getFieldValue('forwardDate')}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={21} offset={3}>
                        <Row>
                            <Col span={3}>结束日期:</Col>
                            <Col span={21}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item noStyle name="endForwardDate">
                                                <DatePicker
                                                    format="YYYY-MM-DD"
                                                    disabled={
                                                        !getFieldValue('forwardDate') || getFieldValue('noEndDate')
                                                    }
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item name="noEndDate" noStyle valuePropName="checked">
                                                <Checkbox
                                                    disabled={!getFieldValue('forwardDate')}
                                                    style={{ marginLeft: '8px' }}
                                                >
                                                    无结束日
                                                </Checkbox>
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Form.Item label="选择模板">
                    <Input.Group>
                        <Row gutter={8}>
                            <Col>
                                <Select
                                    style={{ width: 120 }}
                                    onChange={(value) => {
                                        form.setFieldsValue({ templateContent: value });
                                    }}
                                    options={[
                                        {
                                            label: '模板1',
                                            value: '电路代号:<circuit_no>事件唯一标识:<event_id>电路代号:<circuit_no>',
                                        },
                                    ]}
                                ></Select>
                            </Col>
                            <Col>
                                <Button onClick={showSMSTemplateClick}>模板管理</Button>
                            </Col>
                        </Row>
                    </Input.Group>
                </Form.Item>
                <Form.Item name="templateContent" wrapperCol={{ offset: 3 }}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="isClearSMSContent" label="清除告警发短信">
                    <Checkbox>清除告警发短信</Checkbox>
                </Form.Item>
                <Form.Item
                    label="前转次数"
                    name="numUpDownRepeatTimes"
                    rules={[{ required: true, message: '不能为空' }]}
                >
                    <InputNumber min={1} max={5} formatter={(value) => `${value}次`} />
                </Form.Item>
                <Form.Item label="呼叫方式" name="sendMode">
                    <Radio.Group
                        options={[
                            { label: '自定义发送', value: 'isCustom' },
                            { label: '外呼系统确定呼叫人员', value: 'isSystem' },
                            { label: '网元确定呼叫人员', value: 'isWithNe' },
                            { label: '匹配受理人规则', value: 'isWithReceiveRule' },
                        ]}
                    ></Radio.Group>
                </Form.Item>
            </Form>
            <Modal
                title="短信模板管理"
                width={800}
                bodyStyle={{ height: '450px' }}
                onCancel={onCancel}
                visible={visible}
                footer={null}
            >
                <SMSTemplate />
            </Modal>
        </>
    );
});
