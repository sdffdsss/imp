import React, { useMemo } from 'react';
import { Select } from 'oss-ui';

interface Iprops {
    value?: string[];
    onChange?: (value: string[]) => void;
    options?: {
        label: string;
        value: string;
    }[];
    placeholder: string;
    [key: string]: any;
}
/**
 *
 * @description: 全选组件
 *
 */
const AllSelect = (props: Iprops) => {
    const { value = [], onChange, options = [], ...rest } = props;
    const selectOptions = useMemo(() => {
        return [
            {
                label: '全部',
                value: 'all',
            },
            ...options,
        ];
    }, [options]);
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
    return <Select options={selectOptions} value={value} onChange={selectChange} mode="multiple" {...rest} />;
};
export default AllSelect;
