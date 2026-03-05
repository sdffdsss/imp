import React, { useEffect, useState } from 'react';
import { Row, Col, Select, Form, Input } from 'oss-ui';
import { queryAlarmFieldDictApi } from '@Pages/international-resource-monitor/services/api';

export default function Index({ value, onChange }) {
    const [options, setOptions] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        // 如果值类型为字典值，获取下拉框的options
        if (value.dictName) {
            queryAlarmFieldDictApi({ dictName: value.dictName }).then((res) => {
                setOptions(res);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form
            form={form}
            initialValues={value}
            onValuesChange={(changedValues, allValues) => {
                onChange(allValues);
            }}
        >
            <Row justify="space-around">
                <Form.Item name="dictName" hidden>
                    <Input />
                </Form.Item>
                <Col>
                    <Form.Item name="fieldInfo">
                        <Select
                            labelInValue
                            style={{ width: '180px' }}
                            options={[
                                {
                                    label: value.fieldInfo.label,
                                    value: value.fieldInfo.value,
                                },
                            ]}
                            notFoundContent={<div style={{ textAlign: 'center' }}>暂无数据</div>}
                        />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item name="operator">
                        <Select
                            style={{ width: '100px' }}
                            options={[
                                {
                                    label: '包含',
                                    value: 'in',
                                },
                                {
                                    label: '不包含',
                                    value: 'not_in',
                                },
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item name="value">
                        {value.dictName ? (
                            <Select
                                placeholder="全部"
                                mode="multiple"
                                maxTagCount="responsive"
                                options={options}
                                style={{ width: '240px' }}
                                optionFilterProp="label"
                                notFoundContent={<div style={{ textAlign: 'center' }}>暂无数据</div>}
                            />
                        ) : (
                            <Input style={{ width: '240px' }} placeholder="全部" />
                        )}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}
