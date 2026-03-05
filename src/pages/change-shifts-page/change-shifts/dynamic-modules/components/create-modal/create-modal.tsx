import React from 'react';
import { Modal, Form, Select, Input, Row, Col, DatePicker, message } from 'oss-ui';
import moment from 'moment';
import './create-modal.less';

export default function Index({ isModalVisible = false, onClose = () => {}, onSave = () => {} }) {
    const [form] = Form.useForm();

    function handleOk() {
        form.validateFields().then(() => {
            console.log('form values:', form.getFieldsValue());
            onSave();
            message.success('保存成功');
            onClose();
        });
    }
    return (
        <Modal title="无线基站大面积断站" visible={isModalVisible} onOk={handleOk} onCancel={onClose} destroyOnClose width="50vw">
            <div className="cs-create-modal--local">
                <Form form={form}>
                    <Row>
                        <Col span={8}>
                            <Form.Item label="省份" required labelAlign="right">
                                <Select disabled defaultValue="江苏" />
                            </Form.Item>
                        </Col>
                        <Col offset={4} span={8}>
                            <Form.Item label="专业" required valuePropName="defaultValue">
                                <Select disabled defaultValue="核心网" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="值班人员" required>
                                <Input disabled defaultValue="张三" />
                            </Form.Item>
                        </Col>
                        <Col span={20}>
                            <Form.Item
                                name="record"
                                label="记录内容"
                                required
                                rules={[{ max: 30, message: '记录内容不能超过300字' }]}
                                validateTrigger="onSubmit"
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="完成情况" required>
                                <Select disabled defaultValue="是" />
                            </Form.Item>
                        </Col>
                        <Col offset={4} span={8}>
                            <Form.Item label="时间" required>
                                <DatePicker showTime defaultValue={moment()} disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>
    );
}
