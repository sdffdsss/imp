import React, { useEffect } from 'react';
import { Modal, Input, Radio, Button, Row, Col, Form, message } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { approvalBatchApi } from '../api';

const ModalWapper = (props) => {
    const { onCancel, visible, selectedRows } = props;
    const { userId, provinceId } = useLoginInfoModel();

    const [form] = Form.useForm();

    async function onOk() {
        const values = await form.validateFields();
        const params = {
            ...values,
            userId,
            recordIdList: selectedRows.map((e) => e.id),
        };

        const res = await approvalBatchApi(params);
        if (res.code === 200) {
            if (provinceId === '0') {
                // 集团用户
                if (res.data < 1) {
                    message.success('没有可操作的数据(待审核+集团驳回+已归档)');
                } else {
                    message.success(`${res.data}条（待审核+集团驳回+已归档）数据审核成功`);
                }
            } else {
                // 非集团用户
                if (res.data < 1) {
                    message.success('没有可操作的数据(待确认+省内驳回+集团驳回)');
                } else {
                    message.success(`${res.data}条（待确认+省内驳回+集团驳回）数据审核成功`);
                }
            }
            onCancel();
        }
    }
    useEffect(() => {
        form.setFieldsValue({
            pass: true,
            suggestions: '',
        });
    }, [form, visible]);

    return (
        <Modal
            title="批量审核"
            onCancel={onCancel}
            {...props}
            destroyOnClose
            footer={
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button type="primary" onClick={onOk}>
                        确定
                    </Button>
                    <Button onClick={onCancel}>关闭</Button>
                </div>
            }
        >
            <Form labelAlign="right" form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label="审核结果" name="pass">
                            <Radio.Group>
                                <Radio value>通过</Radio>
                                <Radio value={false}>驳回</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item noStyle dependencies={['pass']}>
                            {({ getFieldValue }) => {
                                const isPass = getFieldValue('pass');
                                return (
                                    <Form.Item label="反馈建议" name="suggestions" rules={[{ required: !isPass, message: '请输入反馈建议' }]}>
                                        <Input.TextArea maxLength={200} disabled={isPass} />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalWapper;
