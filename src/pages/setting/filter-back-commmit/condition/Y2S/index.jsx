import React from 'react';
import { Form, DatePicker } from 'oss-ui';
import moment from 'moment';

export default (props) => {
    const { onChange, disabled, rightValues, currentSelectedCondition } = props;

    const valueFunc = () => {
        if (!rightValues[currentSelectedCondition.id]) {
            return [];
        }

        const valueStringArr = rightValues[currentSelectedCondition.id].valueString.split(',');

        if (valueStringArr.length === 0) {
            return [];
        }

        return [
            moment(valueStringArr[0] || null, 'YYYY-MM-DD HH:mm:ss'),
            moment(valueStringArr[1] || null, 'YYYY-MM-DD HH:mm:ss'),
        ];
    };

    return (
        <Form>
            <Form.Item label="时间范围">
                <DatePicker.RangePicker
                    disabled={disabled}
                    showTime
                    onChange={onChange}
                    value={valueFunc()}
                    format="YYYY-MM-DD HH:mm:ss"
                />
            </Form.Item>
        </Form>
    );
};
