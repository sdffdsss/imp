import React from 'react';
import { Form, TimePicker, Switch } from 'oss-ui';
import moment from 'moment';
import './index.less';
import { _ } from 'oss-web-toolkits';

export default React.forwardRef((props, ref) => {
    const getInitialValues = () => {
        return { timeperiod: [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')] };
    };

    /**
     * 表单值变更事件
     */
    const onValuesChange = (changedValues) => {
        if (!_.isUndefined(changedValues.timeperiodSwitch)) {
            ref.current.validateFields(['timeperiod']);
        }
    };

    React.useEffect(() => {
        if (!(props.modelType === 'new')) {
            // console.log('!new');
            const {initialValues} = props;
            if (ref.current && initialValues && _.isArray(initialValues)) {
                const data = initialValues.find((item) => item.key === 'timeperiod').value;
                if (!_.isEmpty(data)) {
                    ref.current.setFieldsValue({
                        timeperiod: [moment(data.split('~')[0], 'HH:mm'), moment(data.split('~')[1], 'HH:mm')],
                        timeperiodSwitch: true,
                    });
                }
            }
        }
    }, [props, props.initialValues, props.modelType, ref]);

    return (
        <>
            <div className="dispatch-inhibition-title">规则动作</div>
            <Form
                name="dispatchInhibitionRule"
                initialValues={getInitialValues()}
                ref={ref}
                className="dispatch-inhibition-content"
                labelCol={{ span: 5 }}
                onValuesChange={onValuesChange}
            >
                <Form.Item label="启用时间段" name="timeperiodSwitch" valuePropName="checked" wrapperCol={{ span: 2 }}>
                    <Switch checkedChildren="开" unCheckedChildren="关" size="small"></Switch>
                </Form.Item>
                <Form.Item noStyle>
                    <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                            return (
                                <Form.Item
                                    name="timeperiod"
                                    label="时间范围"
                                    rules={[
                                        {
                                            validator: async (rule, val, callback) => {
                                                const remark = getFieldValue('timeperiodSwitch');
                                                if (remark) {
                                                    if (!val) {
                                                        throw new Error('不能为空');
                                                    }
                                                    if (!(val[0] < val[1])) {
                                                        throw new Error('开始时间必须早于结束时间');
                                                    }
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <TimePicker.RangePicker
                                        format="HH:mm"
                                        disabled={!getFieldValue('timeperiodSwitch')}
                                    />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                </Form.Item>
            </Form>
        </>
    );
});
