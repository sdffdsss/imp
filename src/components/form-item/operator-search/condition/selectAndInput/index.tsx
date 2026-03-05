import React, { useMemo } from 'react';
import { useSetState } from 'ahooks';
import { Input, Select } from 'oss-ui';
import './index.less';

const SelectAndInput = (props) => {
    const { value, onChange, disabled, placeholder, parentProps } = props;
    const { fieldEnum, operatorOptions, operatorValue, fieldValue } = parentProps;

    const [state, setState] = useSetState({
        operator: operatorValue.operator,
        type: fieldValue,
        value,
    });
    const select1Options = useMemo(() => {
        return operatorOptions.map((el) => {
            return {
                label: el.value,
                value: el.key,
            };
        });
    }, [operatorOptions]);

    const onInputChange = (e) => {
        setState({ value: e.target.value });
        onChange({ ...state, value: e.target.value });
    };
    const onSelect1Change = (v) => {
        setState({ operator: v });
        onChange({ ...state, operator: v });
    };
    const onSelect2Change = (v) => {
        setState({ type: v });
        onChange({ ...state, type: v });
    };

    return (
        <div className="select-and-input">
            <Select options={select1Options} value={state.operator} onChange={onSelect1Change} />
            <Select options={fieldEnum} value={state.type} onChange={onSelect2Change} />
            <Input onChange={onInputChange} value={state.value} disabled={disabled} placeholder={placeholder} />
        </div>
    );
};
export default SelectAndInput;
