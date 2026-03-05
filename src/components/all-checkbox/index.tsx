import React, { useMemo } from 'react';
import { Checkbox } from 'oss-ui';

interface Iprops {
    value?: string[];
    onChange?: (value: string[]) => void;
    options?: {
        label: string;
        value: string;
    }[];

    [key: string]: any;
}
/**
 *
 * @description: 复选框圈选组件
 *
 */
const AllCheckBox = (props: Iprops) => {
    const { value = [], onChange, options = [], ...rest } = props;

    const selectOptions = useMemo(() => {
        return [...options];
    }, [options]);
    const checkAll = selectOptions.length === value.length;
    const indeterminate = value.length > 0 && value.length < selectOptions.length;
    const selectChange = (val: string[]) => {
        const allValue = options.map((item) => item.value);

        if (val.includes('all')) {
            if (value.length === options.length) {
                onChange?.([]);
            } else {
                onChange?.(allValue.filter((item) => item !== 'all'));
            }
        } else {
            onChange?.(val);
        }
    };

    return (
        <>
            <Checkbox indeterminate={indeterminate} onChange={() => selectChange(['all'])} checked={checkAll}>
                全部
            </Checkbox>
            <Checkbox.Group value={value} onChange={selectChange} {...rest}>
                {selectOptions.map((item) => {
                    return (
                        <Checkbox key={item.value} value={item.value}>
                            {item.label}
                        </Checkbox>
                    );
                })}
            </Checkbox.Group>
        </>
    );
};
export default AllCheckBox;
