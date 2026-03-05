import React from 'react';
import { Form, TimePicker } from 'oss-ui';
import moment from 'moment';

export default React.forwardRef((props, ref) => {
    const initialValues = () => {
        const { initialValues } = props;
        if (!initialValues) {
            return {
                forwardTime: [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')]
            };
        }

        return {
            forwardTime: [moment(initialValues.startTime, 'HH:mm'), moment(initialValues.endTime, 'HH:mm')]
        };
    };

    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作</div>
            <Form initialValues={initialValues()} ref={ref} labelCol={{ span: 2 }}>
                <Form.Item label="时间范围" name="forwardTime">
                    <TimePicker.RangePicker format="HH:mm" />
                </Form.Item>
            </Form>
        </>
    );
});
