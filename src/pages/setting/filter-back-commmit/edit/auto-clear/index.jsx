import React from 'react';
import { Form, InputNumber, Input } from 'oss-ui';

export default React.forwardRef((props, ref) => {
    const initialValues = () => {
        const { initialValues } = props;

        if (!initialValues) {
            return {
                delayTime: 0,
                belongRuleID: 8989,
            };
        }

        return initialValues;
    };

    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作:</div>
            <Form initialValues={initialValues()} ref={ref} labelCol={{ span: 2 }}>
                <Form.Item name="belongRuleID" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="delayTime" label="清除时延">
                    <InputNumber formatter={(value) => `${value} 分钟`} />
                </Form.Item>
            </Form>
        </>
    );
});
