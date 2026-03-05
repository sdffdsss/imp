import React from 'react';
import { Form, Select, Input, Row, Col } from 'oss-ui';

const ModalEdit = (props: any) => {
    const { enums, form, mode } = props;
    const provinceList = enums.provinceList.map((el) => ({ ...el, label: el.zoneName, value: el.zoneId }));
    const isDisabled = mode === 'view' || mode === 'edit';
    const hiddenFields = ['id'];
    return (
        <div>
            <Form form={form}>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="省份"
                            name="provinceId"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            rules={[{ required: true, message: '请选择省份' }]}
                        >
                            <Select options={provinceList} disabled={isDisabled} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="网内网间专业"
                            name="intraProfessionalType"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                            rules={[{ required: true, message: '请选择网内网间专业' }]}
                        >
                            <Select options={enums.networkTypeOptions} disabled={isDisabled} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="备注"
                            name="notes"
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 22 }}
                            rules={[{ required: true, message: '请输入备注' }]}
                        >
                            <Input.TextArea rows={12} disabled={mode === 'view'} maxLength={1000} allowClear showCount />
                        </Form.Item>
                    </Col>
                </Row>
                {hiddenFields.map((field) => {
                    return (
                        <Form.Item hidden key={field} name={field}>
                            <Input />
                        </Form.Item>
                    );
                })}
            </Form>
        </div>
    );
};
export default ModalEdit;
