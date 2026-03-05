import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Col, DatePicker, Form, Input, Row, Select } from 'oss-ui';
import { getZonesNormalCase } from '@Common/utils/commonProvincesList';
import useLoginInfoModel from '@Src/hox';
import type { IModalContentProps } from './types';

export default forwardRef((props: IModalContentProps, ref) => {
    const [form] = Form.useForm();

    const { initialValues } = props;

    const { userInfo, systemInfo } = useLoginInfoModel.data;
    const [provinceList, setProvinceList] = useState<Array<any>>([]);

    useEffect(() => {
        const info = userInfo && JSON.parse(userInfo);
        getZonesNormalCase(info?.zones[0], systemInfo?.currentZone).then((res) => {
            setProvinceList(res);
        });
    }, []);

    // 点击确定时需要调用此方法
    const formSubmit = async () => {
        const values = await form.validateFields();

        return values;
    };

    useImperativeHandle(ref, () => ({
        getValues: formSubmit,
    }));

    function formValueChange() {}

    // UI部分是form，可以是任何内容 目前业务大部分modal中是form
    return (
        <Form
            form={form}
            onValuesChange={formValueChange}
            initialValues={initialValues}
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
        >
            <Row>
                <Col span={8}>
                    <Form.Item label="省份" name="provinceId" required labelAlign="right">
                        <Select disabled>
                            {provinceList.map((item) => {
                                return (
                                    <Select.Option value={item.zoneId} key={item.zoneId} label={item.zoneName}>
                                        {item.zoneName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col offset={4} span={8}>
                    <Form.Item label="专业" required name="professionalType">
                        <Select
                            disabled
                            options={[
                                {
                                    value: '85',
                                    label: '平台',
                                },
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="值班人员" name="watchMan" required>
                        <Input disabled />
                    </Form.Item>
                </Col>
                <Col span={21}>
                    <Form.Item
                        labelCol={{
                            span: 3,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        name="recordContent"
                        label="记录内容"
                        required
                        rules={[
                            {
                                required: true,
                                message: '请输入记录内容',
                            },
                        ]}
                        validateTrigger="onSubmit"
                    >
                        <Input.TextArea maxLength={300} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="完成情况" required name="completion">
                        <Select
                            placeholder="请选择完成情况"
                            options={[
                                {
                                    value: '否',
                                    label: '否',
                                },
                                {
                                    value: '是',
                                    label: '是',
                                },
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col offset={4} span={8}>
                    <Form.Item label="时间" required name="time">
                        <DatePicker showTime disabled />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
});
