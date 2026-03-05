/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Select } from 'oss-ui';
import produce from 'immer';

export default class ConditionOperator extends PureComponent {
    onOperatorChange = (value) => {
        const { onChange, data, index } = this.props;

        const temp = produce(data, (draft) => {
            const filterValue = ['between', 'is_null', 'not_null', 'groupSelect'];
            if (filterValue.includes(value) || filterValue.includes(draft.compareType)) {
                draft.value = [];
            }
            draft.compareType = value;
        });

        onChange(temp, index);
    };

    render() {
        const { data, currentConditionProps } = this.props;
        return (
            <Select
                placeholder="请选择"
                value={data.compareType}
                className="condition-operator"
                filterOption={false}
                options={(currentConditionProps?.conditionCompareTypeList || []).map((itemOption) => ({
                    label: itemOption.label,
                    value: itemOption.name,
                }))}
                disabled={data?.operatorDisabled || false}
                onChange={this.onOperatorChange}
            ></Select>
        );
    }
}
