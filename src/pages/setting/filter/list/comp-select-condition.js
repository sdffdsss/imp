import React from 'react';
import DictSelectSearch from '@Components/dict-select';

const SelectCondition = (props) => {
    /**
     * @description: 获取枚举值接口
     * @param {*}
     * @return {*}
     */
    const onChange = (value) => {
        if (value.length > 1 && value.indexOf('') > -1) {
            if (value.indexOf('') === value.length - 1) {
                props.form?.setFieldsValue({ [props.searchName]: [''] });
                props.onChange(['']);
            } else {
                props.form?.setFieldsValue({ [props.searchName]: value.filter((item) => item !== '') });
                props.onChange(value);
            }
        } else {
            props.form?.setFieldsValue({ [props.searchName]: value });
            props.onChange(value);
        }
    };
    return (
        <DictSelectSearch
            {...props}
            dictName={props.dictName}
            onChange={onChange}
            placeholder={props.title === '归属专业' ? '全部' : `请选择${props.title}`}
            mode={props.mode}
            maxTagCount="responsive"
        />
    );
};

export default SelectCondition;
