import React, { useState, useEffect } from 'react';
import { Select } from 'oss-ui';
import request from '@Common/api';
import useLoginInfoModel from '@Src/hox';

const SelectCondition = (props) => {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState([]);
    const login = useLoginInfoModel();

    const getDictEntry = (dictName) => {
        return request('alarmmodel/dict/v1/getDict', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                pageSize: 2500,
                dictName,
                en: false,
                modelId: 2,
                creator: login.userId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token')
                })
            }
        })
            .then((res) => {
                if (res && res.data && res.data.length) {
                    return res.data;
                }
                return [];
            })
            .catch(() => {
                return [];
            });
    };

    const getOptions = async () => {
        if (props.dictName) {
            const result = await getDictEntry(props.dictName);
            setOptions(result);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const onChange = (value) => {
        if (!value.length) {
            setValue([]);
            props.form.setFieldsValue({ [props.searchName]: [] });
        } else if (!value.length || (value.length === 1 && value[0] === 'all')) {
            setValue(['all']);
            props.form.setFieldsValue({ [props.searchName]: [] });
        } else {
            if (value.filter((s) => s !== 'all').length !== options.length) {
                setValue(value.filter((s) => s !== 'all'));
            } else {
                setValue(value.concat('all'));
            }
            props.form.setFieldsValue({ [props.searchName]: value.filter((s) => s !== 'all') });
        }
    };

    useEffect(() => {
        getOptions();
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Select
            allowClear
            value={value}
            mode={props.mode}
            placeholder={`请选择${props.title}`}
            align="left"
            onChange={onChange}
            optionFilterProp="children"
            maxTagCount={3}
        >
            <Select.Option key="all">{'全部'}</Select.Option>
            {options.map((item) => (
                <Select.Option key={item.key}>{item.value}</Select.Option>
            ))}
        </Select>
    );
};

export default SelectCondition;
