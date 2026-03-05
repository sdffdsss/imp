import React from 'react';
import { Form, InputNumber, Space, Select } from 'oss-ui';
import Field from '@ant-design/pro-field';

export default React.forwardRef((props, ref) => {
    const { modelType, initialValues, mode = 'edit' } = props;

    React.useEffect(() => {
        if (!(modelType === 'new')) {
            if (ref.current && initialValues) {
                const editValues = {
                    delayTime: Number(initialValues.find((item) => item.key === 'max_delay_time_seconds')?.value),
                    unit: initialValues.find((item) => item.key === 'unit')?.value,
                };
                ref.current.setFieldsValue(editValues);
            }
        }
    }, [initialValues, modelType, ref]);

    // eslint-disable-next-line consistent-return
    const getInitialValues = () => {
        if (initialValues && initialValues.length === 0) {
            return {
                delayTime: 1,
                unit: '0',
            };
        }
    };
    const options = ['秒', '分'];
    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作:</div>
            <Form initialValues={getInitialValues()} ref={ref}>
                <Space>
                    <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                            return (
                                <Form.Item
                                    name="delayTime"
                                    label="监控呈现时延"
                                    rules={[
                                        { required: true, message: '不能为空' },
                                        {
                                            validator: async (rule, val) => {
                                                // eslint-disable-next-line no-restricted-properties
                                                const max = Math.pow(10, 12) - 1;
                                                if (val && val > max) {
                                                    throw new Error(`可输入的最大值为${max}`);
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <Field
                                        mode={mode}
                                        render={() => {
                                            return getFieldValue('delayTime') || '暂无';
                                        }}
                                        renderFormItem={() => {
                                            return <InputNumber min={1} />;
                                        }}
                                    />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                            return (
                                <Form.Item name="unit">
                                    <Field
                                        mode={mode}
                                        text={getFieldValue('unit')}
                                        valueEnum={{
                                            0: {
                                                text: '秒',
                                            },
                                            1: {
                                                text: '分',
                                            },
                                        }}
                                        renderFormItem={() => {
                                            return (
                                                <Select
                                                    options={options.map((item, index) => {
                                                        return { value: `${index}`, label: item };
                                                    })}
                                                />
                                            );
                                        }}
                                    />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                </Space>
            </Form>
        </>
    );
});
