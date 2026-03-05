import React from 'react';
import { Select } from 'oss-ui';

export default function ViewModal(props) {
    const { onChange, record, tableCompFunc, ...otherProps } = props;

    return (
        <Select
            {...otherProps}
            style={{ width: '100%' }}
            onChange={(newVal) => {
                tableCompFunc.onForceSelectRow(record, newVal);

                onChange(newVal);
            }}
            options={[
                {
                    label: '已完成',
                    value: 1,
                },
                {
                    label: '未完成',
                    value: 0,
                },
            ]}
        />
    );
}
