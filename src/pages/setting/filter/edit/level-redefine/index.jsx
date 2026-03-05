import React, { useState, useEffect } from 'react';
import { Form, Select } from 'oss-ui';
import request from '@Common/api';

export default React.forwardRef((props, ref) => {
    const [options, setOptions] = useState();
    const getInitialValues = () => {
        const { initialValues } = props;
        if (!initialValues || initialValues.length === 0) {
            return '请选择';
        }
        return initialValues[0].value;
    };
    const getDictEntry = (dictName) => {
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
                creator: props.login.userId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        }).then((res) => {
            if (res && res.data && res.data.length) {
                setOptions(res.data);
            }
        });
    };
    useEffect(() => {
        getDictEntry('org_severity');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作:</div>
            {props.initialValues && (props.modelType === 'edit' || props.modelType === 'copy') && (
                <Form ref={ref} initialValues={{ url: getInitialValues() }} labelCol={{ span: 2 }}>
                    <Form.Item label="重定义到" name="url">
                        <Select placeholder="请选择" style={{ width: '180px' }}>
                            {options && options.map((type) => <Select.Option key={type.key}>{type.value}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            )}
            {props.modelType === 'new' && (
                <Form ref={ref} initialValues={{ url: getInitialValues() }} labelCol={{ span: 2 }}>
                    <Form.Item label="重定义到" name="url">
                        <Select placeholder="请选择" style={{ width: '180px' }}>
                            {options && options.map((type) => <Select.Option key={type.key}>{type.value}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            )}
        </>
    );
});
