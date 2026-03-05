import React from 'react';
import { Form, TimePicker } from 'oss-ui';
import moment from 'moment';

export default (props) => {
    const { onChange, disabled, rightValues, currentSelectedCondition } = props;

    const minFormat = (mins) => {
        let hour = parseInt(mins / 60, 10);
        let min = `${mins % 60  }`;

        if (hour < 10) {
            hour = `0${  hour}`;
        }

        if (min < 10) {
            min = `0${  hour}`;
        }

        return `${hour}:${min}`;
    };

    const valueFunc = () => {
        if (!rightValues[currentSelectedCondition.id]) {
            return [];
        }

        const valueStringArr = rightValues[currentSelectedCondition.id].valueString.split(',');

        if (valueStringArr.length !== 2) {
            return [];
        }

        return [moment(minFormat(valueStringArr[0]), 'HH:mm'), moment(minFormat(valueStringArr[1]), 'HH:mm')];
    };

    return (
        <Form>
            <Form.Item label="时间范围">
                <TimePicker.RangePicker disabled={disabled} onChange={onChange} value={valueFunc()} format="HH:mm" />
            </Form.Item>
        </Form>
    );
};
