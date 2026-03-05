import React from 'react';
import { Form, InputNumber } from 'oss-ui';

export default React.forwardRef((props, ref) => {
    const getInitialValues = () => {
        const { initialValues } = props;

        if (!initialValues) {
            return {
                delaySeconds: 0,
                failureSeconds: 0,
                alarmCounts: 0,
            };
        }

        return initialValues;
    };
    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作：</div>
            <Form initialValues={getInitialValues()} ref={ref} labelCol={{ span: 3 }}>
                <Form.Item name="delaySeconds" label="延迟时间">
                    <InputNumber min={0} formatter={(value) => `${value}秒`} />
                </Form.Item>
                <Form.Item name="failureSeconds" label="失效时间">
                    <InputNumber min={0} formatter={(value) => `${value}秒`} />
                </Form.Item>
                <Form.Item name="alarmCounts" label="告警计数">
                    <InputNumber min={0} formatter={(value) => `${value}次`} />
                </Form.Item>
            </Form>
        </>
    );
});
