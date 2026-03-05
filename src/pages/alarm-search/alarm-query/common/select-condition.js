import React, { useState, useEffect } from 'react';
import { Select } from 'oss-ui';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import columnInfoModel from './hox';
import { _ } from 'oss-web-toolkits';
import { getFilterByType } from './api';

const SelectCondition = (props) => {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState([]);
    const login = useLoginInfoModel();
    const columnsInfo = columnInfoModel();
    const getOptions = async () => {
        if (props.dictName) {
            const enumValuesInfo = [];
            const enumValues = _.find(columnsInfo.columnInfo, (item) => item.storeFieldName === props.dictName)?.enumValues;
            _.forOwn(enumValues, (v, key) => {
                enumValuesInfo.push({ key, value: v });
            });
            setOptions(enumValuesInfo);
        }
        if (props.dictName === 'filterName') {
            let type = '';
            const filterType = props.form.getFieldValue('filter_type');
            if (filterType === 'myFilters') {
                type = 'MY';
            } else {
                type = 'ALL';
            }
            const res = await getFilterByType(login.userId, type);
            const filterOptions = [];
            if (res && res.data) {
                res.data.forEach((item) => {
                    filterOptions.push({
                        key: item.filterId,
                        value: item.filterName,
                    });
                });
            }
            setOptions(filterOptions);
        }
        if (props.dictName === 'alarm_origin') {
            setOptions([
                { key: 0, value: '普通查询' },
                { key: 1, value: '关联查询' },
                { key: 2, value: '只查询关联告警' },
            ]);
            setValue(useEnvironmentModel.data.environment.associatedQueryFlag);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const onChange = (value) => {
        if (!value) {
            setValue([]);
            props.form.setFieldsValue({ [props.searchName]: [] });
        } else {
            setValue(value);
            props.form.setFieldsValue({ [props.searchName]: value });
        }
    };

    useEffect(() => {
        getOptions();
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnsInfo.columnInfo, props.form.getFieldValue('filter_type')]);
    return (
        <Select
            allowClear
            showArrow
            showSearch
            value={value}
            mode={props.mode}
            placeholder={`请选择${props.title}`}
            align="left"
            onChange={onChange}
            optionFilterProp="children"
            maxTagCount={3}
        >
            {options.map((item) => (
                <Select.Option key={item.key}>{item.value}</Select.Option>
            ))}
        </Select>
    );
};

export default SelectCondition;
