import React, { useState, useEffect } from 'react';
import { Select } from 'oss-ui';
import request from '@Common/api';
import useLoginInfoModel from '@Src/hox';

const SelectCondition = (props) => {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(props.value || []);
    const [professionList, handleProfessionList] = useState([])
    const login = useLoginInfoModel();

    const getDictEntry = (dictName) => {
        return Promise.resolve(
            request('alarmmodel/field/v1/dict/entry', {
                type: 'get',
                baseUrlType: 'filterUrl',
                showSuccessMessage: false,
                defaultErrorMessage: '获取字典键值失败',
                data: {
                    pageSize: 2500,
                    dictName,
                    en: false,
                    modelId: 2,
                    creator: login.userId,
                    clientRequestInfo: JSON.stringify({
                        clientRequestId: 'nomean',
                        clientToken: localStorage.getItem('access_token'),
                    }),
                },
            })
                .then((res) => {
                    if (res && res.data && res.data.length) {
                        handleProfessionList(res.data)
                        return res.data.filter((item) =>
                            dictName === 'province_id'
                                ? login.systemInfo?.currentZone?.zoneId
                                    ? login.systemInfo?.currentZone?.zoneId === item.key
                                    : true
                                : true
                        );
                    }
                    return [];
                })
                .catch(() => {
                    return [];
                })
        );
    };

    const getOptions = async () => {
        if (props.dictName) {
            const result = await getDictEntry(props.dictName);
            setOptions(result);
        }
    };
    useEffect(() => {
        getOptions();
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(()=>{
        if(props.form){
            props.form.setFieldsValue({
                professionList
            })
        }
    },[props.form,professionList])

    useEffect(()=>{
        if(props.value?.length && professionList.length){
            if(props.value.length === professionList.length){
                return setValue(['all'])
             }
             setValue(props.value)
        }
    },[props.value,professionList])

    const onChange = (values) => {
        // if (!values.length) {
        //     setValue([]);
        //     props.form.setFieldsValue({ [props.searchName]: [] });
        // } else if (!values.length || (values.length === 1 && values[0] === 'all')) {
        //     setValue(['all']);
        //     props.form.setFieldsValue({ [props.searchName]: [] });
        // } else {
        //     if (values.filter((s) => s !== 'all').length !== options.length) {
        //         setValue(values.filter((s) => s !== 'all'));
        //     } else {
        //         setValue(values.concat('all'));
        //     }
        //     props.form.setFieldsValue({ [props.searchName]: values.filter((s) => s !== 'all') });
        // }

        if (values.length > 0 && values.indexOf('all') > -1) {
            if (values.indexOf('all') === values.length - 1) {
                props.form.setFieldsValue({ [props.searchName]: ['all'] });
                setValue(['all']);
            } else {
                props.form.setFieldsValue({ [props.searchName]: values.filter((item) => item !== 'all') });
                setValue(values.filter((item) => item !== 'all'));
            }
        } else {
            props.form.setFieldsValue({ [props.searchName]: values });
            setValue(values);
        }
    };

    return (
        <Select
            allowClear
            value={value}
            mode={props.mode}
            placeholder={`请选择${props.title}`}
            align="left"
            onChange={onChange}
            optionFilterProp="children"
            maxTagCount="responsive"
        >
            <Select.Option key="all">{'全部'}</Select.Option>
            {options.map((item) => (
                <Select.Option key={item.key}>{item.value}</Select.Option>
            ))}
        </Select>
    );
};

export default SelectCondition;
