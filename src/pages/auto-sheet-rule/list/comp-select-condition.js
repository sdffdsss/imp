import React, { useState, useEffect } from 'react';
import { Select } from 'oss-ui';
import request from '@Common/api';
import useLoginInfoModel from '@Src/hox';

const SelectCondition = (props) => {
    const { form, formatOption } = props;
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(props.value || []);
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
                        return res.data.filter((item) =>
                            dictName === 'province_id'
                                ? login.systemInfo?.currentZone?.zoneId
                                    ? login.systemInfo?.currentZone?.zoneId === item.key
                                    : true
                                : true,
                        );
                    }
                    return [];
                })
                .catch(() => {
                    return [];
                }),
        );
    };

    const getInitialProvince = (province, userInfo) => {
        const info = userInfo && JSON.parse(userInfo);
        let initialProvince = info.zones[0]?.zoneId;
        if (province) {
            return (initialProvince = province);
        }
        if (info.zones[0]?.zoneLevel === '3') {
            initialProvince = info.zones[0]?.parentZoneId;
        }
        return initialProvince;
    };

    const getOptions = async () => {
        if (props.dictName) {
            const result = await getDictEntry(props.dictName);
            if (props.dictName === 'province_id') {
                form.setFieldsValue({
                    filterProvince: getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo),
                });
            }

            setOptions(formatOption ? formatOption(result) : result);
        }
    };
    useEffect(() => {
        // if(props.dictName === 'province_id'){
        //     form?.setFieldsValue({
        //         filterProvince:'加载中...'
        //     })
        // }
        getOptions();
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

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

        if (values?.length > 0 && values.indexOf('all') > -1 && props.dictName !== 'province_id') {
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
            allowClear={props.dictName !== 'province_id'}
            value={value}
            mode={props.mode}
            placeholder="全部"
            align="left"
            onChange={onChange}
            optionFilterProp="children"
            maxTagCount="responsive"
        >
            {/* {props.showAll && <Select.Option key="all">{'全部'}</Select.Option>} */}
            {options.map((item) => (
                <Select.Option key={item.key}>{item.value}</Select.Option>
            ))}
        </Select>
    );
};

export default SelectCondition;
