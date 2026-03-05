import { Select } from 'oss-ui';
import React, { useState, useMemo } from 'react';
import MultiSelect from '../multiSelect';
import './index.less';

export default (props) => {
    const { onChange, fieldEnum, fieldValue, value = {} } = props;

    // console.log(props);
    const [myValue, setMyValue] = useState({
        value: value.value,
        type: fieldValue,
    });
    const onValueChange = (val: any) => {
        setMyValue({
            ...myValue,
            value: val,
        });
        onChange({
            ...myValue,
            value: val,
        });
    };
    const onTypeChange = (val: any) => {
        setMyValue({
            ...myValue,
            type: val,
        });
        onChange({
            ...myValue,
            type: val,
        });
    };
    const multiType = useMemo(() => {
        return fieldEnum.find((item) => item.value === myValue.type)?.type;
    }, [fieldEnum, myValue.type]);
    return (
        <div className="select-and-select">
            <Select options={fieldEnum} value={myValue.type} onChange={onTypeChange} />
            <div>
                <MultiSelect {...props} onChange={onValueChange} value={myValue.value} type={multiType} />
            </div>
        </div>
    );
};
