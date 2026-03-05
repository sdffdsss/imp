import React from 'react';
import { Form, TimePicker } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { produce } from 'immer';
import moment from 'moment';

export default (props) => {
    const { onConditionDataChange, disabled, rightValues, currentSelectedCondition } = props;

    const valueFunc = () => {
        const selectValue = _.find(rightValues, { fieldName: currentSelectedCondition.fieldName });
        if (selectValue) {
            if (selectValue.valueList.length !== 2) {
                return [];
            }
            if (!selectValue.valueList[0].key || !selectValue.valueList[1].key) {
                return [];
            }
            return [moment(selectValue.valueList[0].key, 'HH:mm'), moment(selectValue.valueList[1].key, 'HH:mm')];
        }
    };

    const onChange = (mount, time) => {
        const flag = time[0] === '' || time[1] === ''
        let nextRightValues;
        nextRightValues = produce(rightValues, (draft) => {
            _.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList = flag ? [] : [
                { key: time[0], value: time[0] },
                { key: time[1], value: time[1] }
            ];
        });
        onConditionDataChange(nextRightValues);
    };
    return (
        <Form>
            <Form.Item label="时间范围">
                <TimePicker.RangePicker disabled={disabled} onChange={onChange} value={valueFunc()} format="HH:mm" />
            </Form.Item>
        </Form>
    );
};
