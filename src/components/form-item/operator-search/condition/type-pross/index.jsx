import React, { useState, useEffect, useCallback } from 'react';
import { Select, Icon } from 'oss-ui';
import request from '@Common/api';
import isEmpty from 'lodash/isEmpty';
const TypeProssIndex = ({
    fieldSearch,
    operatorValue = [],
    fieldPlaceholder = '全部',
    fieldMode = '',
    disabled,
    onChange,
    dataIndex,
    onFieldTypeChange,
    onTypesDataList,
    fieldType,
    fieldValue,
}) => {
    const [value, setValue] = useState([]);
    const [dataOptions, setDataOptions] = useState([]);
    const [allKey, setAllKey] = useState(false);
    const getDataOtion = () => {
        request(`sysadminAlarm/ProfessionalAndObjectTypes`, {
            type: 'post',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            defaultErrorMessage: '获取过滤器数据失败',
            data: {
                query: dataIndex === 'professional_type' ? 'professional' : 'object',
                types: fieldValue && !isEmpty(fieldValue) ? fieldValue : null,
            },
        }).then((res) => {
            if (res.data) {
                let list = res.data.map((item) => {
                    return {
                        label: dataIndex === 'professional_type' ? item.professionalName : item.objectTypeName,
                        value: dataIndex === 'professional_type' ? item.professionalType : item.objectType,
                    };
                });
                onTypesDataList(dataIndex === 'professional_type' ? 'professional_type' : 'eqp_object_class', list);
                setDataOptions(list);
                if (dataIndex !== 'professional_type') {
                    const data = list.map((item) => item.value);
                    if (data.filter((item) => !value.includes(item)).length) {
                        setAllKey(false);
                    } else {
                        setAllKey(true);
                    }
                }
            }
        });
    };
    const handleChange = (key) => {
        if (dataOptions.filter((item) => !key.includes(item.value)).length) {
            //
            setAllKey(false);
        } else {
            setAllKey(true);
        }
        onChange(key);
        if (dataIndex === 'professional_type') {
            onFieldTypeChange('professional_type', 'eqp_object_class', key);
        }
        // if(dataIndex === 'eqp_object_class'){
        //     onFieldTypeChange('eqp_object_class','professional_type', key);
        // }
        // switch (dataIndex) {
        //     case 'filterprofessional_type_type':

        //         break;
        //     default:
        // }
    };
    useEffect(() => {
        setValue(operatorValue?.value || []);
    }, [operatorValue]);
    useEffect(() => {
        if (fieldType && fieldType === 'professional_type') {
            getDataOtion();
        }
        // if (fieldType && fieldType === 'eqp_object_class') {
        //     getDataOtion();
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldType, fieldValue]);
    useEffect(() => {
        getDataOtion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // const onDropdownVisibleChange = () => {

    // };
    const selectOnClick = (flag) => {
        let list = [];
        if (!flag) {
            list = dataOptions.map((item) => item.value);
        }
        onChange(list);
        setAllKey(!flag);
    };
    const dropdownRender = (menu) => {
        if (fieldMode === 'multiple') {
            return (
                <>
                    <div
                        onClick={() => selectOnClick(allKey)}
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '5px 8px', cursor: 'pointer' }}
                    >
                        全部 {allKey ? <Icon antdIcon type="CheckOutlined" /> : null}
                    </div>
                    <div style={{ overflowY: 'auto' }}>{menu}</div>
                </>
            );
        }
        return menu;
    };
    return (
        <Select
            disabled={disabled}
            maxTagCount="responsive"
            optionFilterProp="label"
            mode={fieldMode}
            showSearch={fieldSearch}
            value={value}
            placeholder={fieldPlaceholder}
            onChange={handleChange}
            options={dataOptions}
            allowClear={true}
            dropdownRender={dropdownRender}
            // onDropdownVisibleChange={onDropdownVisibleChange}
            showArrow={true}
        />
    );
};
export default TypeProssIndex;
