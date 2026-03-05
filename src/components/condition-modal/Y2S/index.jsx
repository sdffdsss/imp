import React from 'react';
import { Form, DatePicker } from 'oss-ui';
import moment from 'moment';
import { produce } from 'immer';
import { _ } from 'oss-web-toolkits';

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
            return [moment(selectValue.valueList[0].key, 'YYYY-MM-DD HH:mm:ss'), moment(selectValue.valueList[1].key, 'YYYY-MM-DD HH:mm:ss')];
        }
    };

    const onChange = (mount, time, c) => {
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
                <DatePicker.RangePicker disabled={disabled} showTime onChange={onChange} value={valueFunc()} format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
        </Form>
    );
};
