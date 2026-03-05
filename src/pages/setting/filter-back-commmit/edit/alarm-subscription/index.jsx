import React from 'react';
import { Form, Select } from 'oss-ui';

/**
 * 字段未定
 */
export default React.forwardRef((props, ref) => {
    const initialValues = () => {
        const { initialValues } = props;

        if (!initialValues) {
            return {
                zone: undefined,
                node: undefined,
            };
        }

        return initialValues;
    };

    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作:</div>
            <Form initialValues={initialValues()} ref={ref} labelCol={{ span: 2 }}>
                <Form.Item name="zone" label="所属大区">
                    <Select style={{ width: '220px' }} />
                </Form.Item>
                <Form.Item name="node" label="选择订阅节点">
                    <Select style={{ width: '220px' }} />
                </Form.Item>
            </Form>
        </>
    );
});
