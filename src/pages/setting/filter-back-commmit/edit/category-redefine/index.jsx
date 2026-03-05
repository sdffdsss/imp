import React from 'react';
import { Form, Select } from 'oss-ui';

export default React.forwardRef((props, ref) => {
    const initialValues = () => {
        const { initialValues } = props;

        if (!initialValues) {
            return {
                url: undefined,
            };
        }

        return initialValues;
    };

    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作:</div>
            <Form ref={ref} initialValues={initialValues()} labelCol={{ span: 2 }}>
                <Form.Item label="重定义到" name="url">
                    <Select placeholder="请选择" style={{ width: 180 }} options={[]}></Select>
                </Form.Item>
            </Form>
        </>
    );
});
