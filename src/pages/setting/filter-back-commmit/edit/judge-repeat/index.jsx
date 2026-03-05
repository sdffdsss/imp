import React from 'react';
import { Form, Select, Checkbox, Radio, Button, Tooltip, InputNumber } from 'oss-ui';

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
            <div style={{ marginBottom: '16px' }}>规则动作</div>
            <Form ref={ref} initialValues={initialValues()} labelCol={{ span: 3 }}>
                <Form.Item
                    name="isNotJudgeRepeat"
                    label={
                        <Tooltip title="勾选并进行条件选择后符合该条件的告警将不再派单或抑制，下方其它动作不生效。">
                            进行判重操作
                        </Tooltip>
                    }
                >
                    <Radio.Group>
                        <Radio value={0}>是</Radio>
                        <Radio value={1}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 3 }}>
                    <Button type="primary">条件选择</Button>
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => (
                        <Form.Item label="规则优先级">
                            <Select
                                disabled={!getFieldValue('isNotJudgeRepeat')}
                                style={{ width: 120 }}
                                options={[
                                    { label: '高', value: 0 },
                                    { label: '中', value: 1 },
                                    { label: '低', value: 2 },
                                ]}
                            ></Select>
                        </Form.Item>
                    )}
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => (
                        <Form.Item label="判重后操作">
                            <Radio.Group disabled={!getFieldValue('isNotJudgeRepeat')}>
                                <Radio value="1">判重抑制</Radio>
                                <Radio value="2">判重追单</Radio>
                            </Radio.Group>
                        </Form.Item>
                    )}
                </Form.Item>
                <div>判重追单/抑制范围</div>
                <div style={{ marginBottom: '16px' }}>
                    （注：判重追单/抑制范围包括工单状态和时间两部分的设置。当不勾选任何工单状态时，代表派单告警工单状态处于下面任何环节，符合判重条件的告警均可判重追单或抑制。当不填写时间时，代表对判重时长没要求。）
                </div>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => (
                        <Form.Item label="判重条件">
                            <Checkbox.Group
                                disabled={!getFieldValue('isNotJudgeRepeat')}
                                options={[
                                    { label: '地区相同', value: 'region_id' },
                                    { label: '区县相同', value: 'city_id' },
                                    { label: '机房相同', value: 'site_no' },
                                    { label: '网元相同', value: 'int_id' },
                                    { label: '告警对象相同', value: 'eqp_int_id' },
                                    { label: '告警标题相同', value: 'alarm_title_text' },
                                    { label: '维护人员相同', value: 'specia_filed' },
                                ]}
                            ></Checkbox.Group>
                        </Form.Item>
                    )}
                </Form.Item>
                <Form.Item label="工单状态">
                    <Checkbox.Group
                        options={[
                            { label: '待受理', value: '1' },
                            { label: '处理完成', value: '2' },
                            { label: '待审批', value: '3' },
                            { label: '处理超时', value: '4' },
                            { label: '待确认', value: '5' },
                            { label: 'T1处理中', value: '6' },
                            { label: 'T2处理中', value: '6' },
                            { label: 'T3处理中', value: '6' },
                        ]}
                    ></Checkbox.Group>
                </Form.Item>
                <Form.Item label="时间">
                    <InputNumber formatter={(value) => `${value}分钟`} />
                </Form.Item>
            </Form>
        </>
    );
});
