import React from 'react';
import { Input, Select } from 'oss-ui';
import columnInfoModel from './hox';

const label = [
    { value: 'like', label: '包含' },
    { value: 'eq', label: '等于' },
];
const type = {};
const extraType = [
    'eqp_label_condition',
    'ne_label_condition',
    'title_text_condition',
    'standard_alarm_id_condition',
    'sheet_no_condition',
    'gcss_client_name_condition',
    'circuit_no_condition',
];
const InputAddBefore = (props) => {
    const info = columnInfoModel();
    const { searchName } = props;
    return (
        <Input
            placeholder="请输入"
            onChange={(e) => {
                props.form.setFieldsValue({ [props.name]: e.target.value });
            }}
            addonBefore={
                <Select
                    defaultValue="like"
                    onChange={(value) => {
                        extraType.forEach((item) => {
                            if (item === searchName) {
                                type[`${searchName}`] = value;
                            }
                        });
                        info.setInputSeleteType(type);
                    }}
                >
                    {label.map((item) => {
                        return <Select.Option key={item.value}>{item.label}</Select.Option>;
                    })}
                </Select>
            }
        />
    );
};

export default InputAddBefore;
