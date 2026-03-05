import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, Input, Select, Switch } from 'oss-ui';
import type { IModalContentProps } from './types';

export default forwardRef((props: IModalContentProps, ref) => {
    const [form] = Form.useForm();

    // 点击确定时需要调用此方法
    const formSubmit = async () => {
        const values = await form.validateFields();

        // ...

        return values;
    };

    useImperativeHandle(ref, () => ({
        getValues: formSubmit,
    }));

    function formValueChange() {}

    // UI部分是form，可以是任何内容 目前业务大部分modal中是form
    return (
        <Form
            className="edit-modal-content-form"
            labelCol={{
                span: 6,
            }}
            wrapperCol={{
                span: 12,
            }}
            form={form}
            onValuesChange={formValueChange}
        >
            <Form.Item label="字段" name="field_1">
                <Input />
            </Form.Item>
            <Form.Item label="字段" name="field_2">
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="字段" name="field_3">
                <Select />
            </Form.Item>
            <Form.Item label="字段" name="field_4">
                <Switch />
            </Form.Item>
        </Form>
    );
});
