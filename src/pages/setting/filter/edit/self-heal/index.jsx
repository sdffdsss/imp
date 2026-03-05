import React from 'react';
import { Form, InputNumber } from 'oss-ui';

export default React.forwardRef((props, ref) => {
    const getInitialValues = () => {
        const { initialValues } = props;

        if (!initialValues) {
            return {
                delayTime: 0,
            };
        }

        return initialValues;
    };
    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作:</div>
            <Form initialValues={getInitialValues()} ref={ref} labelCol={{ span: 3 }}>
                <Form.Item name="delayTime" label="延迟时间">
                    <InputNumber min={0} formatter={(value) => `${value}秒`} />
                </Form.Item>
            </Form>
        </>
    );
});
