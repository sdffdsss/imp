import React, { useState, useMemo } from 'react';
import { Modal, Form, Input, DatePicker, Col, Row, Select } from 'oss-ui';
import { addTemporaryRoute, editTemporaryRoute } from '../api';
import moment from 'moment';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
const { TextArea } = Input;

const AddEditModal = (props) => {
    const {
        isModalOpen,
        handleCancel,
        reloadTable,
        currentItem,
        editType,
        userId,
        userName,
        provinceIdForModal,
        currProvince,
        professionalList,
        operationContentList,
    } = props;
    const [form] = Form.useForm();
    const [startTime, setStartTime] = useState(null);
    // 确认按钮
    const handleOk = async () => {
        form.validateFields()
            .then(async (values) => {
                const { provinceId, professionalType, vendorId, accountPower, operationTime, operator, description, operationContent, reviewer } =
                    values;
                const data = {
                    recordId: currentItem ? currentItem.recordId : undefined,
                    provinceId: typeof provinceId === 'object' ? provinceId.value : provinceId,
                    professionalType: typeof professionalType === 'object' ? professionalType.value : professionalType,
                    vendorId: typeof vendorId === 'object' ? vendorId.value : vendorId,
                    accountPower,
                    operationTime: operationTime.format('YYYY-MM-DD'),
                    operator,
                    description,
                    operationContent,
                    reviewer,
                };
                const result = (await currentItem) ? editTemporaryRoute(data) : addTemporaryRoute(data);
                result?.then((res) => {
                    if (res.code === 200) {
                        reloadTable && reloadTable();
                        handleCancel && handleCancel();
                    }
                });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };
    // 给表单项赋初始值
    const initialValue = useMemo(() => {
        switch (editType) {
            case 'edit':
                return {
                    operationTime: moment(currentItem.operationTime),
                    provinceId: { value: Number(currentItem.provinceId), label: currProvince?.regionName },
                    professionalType: { value: Number(currentItem.professionalType), label: currentItem.professionalDesc },
                    accountPower: currentItem.accountPower,
                    operationContent: currentItem.operationContent,
                    vendorId: { value: Number(currentItem.vendorId), label: currentItem.vendorName },
                    operator: currentItem.operator,
                    reviewer: currentItem.reviewer,
                    description: currentItem.description,
                };
            case 'add':
                return {
                    recorder: userName,
                    recorderId: userId,
                    provinceId: { value: Number(provinceIdForModal), label: currProvince?.regionName },
                    operationTime: moment().endOf('day'),
                    operator: userName,
                    operationContent: 0,
                };
            case 'view':
                return {
                    operationTime: moment(currentItem.operationTime),
                    provinceId: { value: Number(currentItem.provinceId), label: currProvince?.regionName },
                    professionalType: { value: Number(currentItem.professionalType), label: currentItem.professionalDesc },
                    accountPower: currentItem.accountPower,
                    operationContent: currentItem.operationContent,
                    vendorId: { value: Number(currentItem.vendorId), label: currentItem.vendorName },
                    operator: currentItem.operator,
                    reviewer: currentItem.reviewer,
                    description: currentItem.description,
                };
        }
    }, []);

    return (
        <>
            <Modal
                title={currentItem ? (editType === 'view' ? '查看网管操作记录' : '编辑') : '新增'}
                visible={isModalOpen}
                width={600}
                destroyOnClose
                onCancel={handleCancel}
                onOk={handleOk}
                okButtonProps={{ disabled: editType === 'view' }}
            >
                <Form
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    layout="horizontal"
                    form={form}
                    initialValues={initialValue}
                >
                    <Row gutter={10}>
                        <Col span={12}>
                            <Form.Item label="省份" name="provinceId" rules={[{ required: true, message: '请选择省份' }]}>
                                <SelectCondition labelInValue title="省份" id="key" label="value" dictName="province_id" searchName="province_id" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="专业" name="professionalType" rules={[{ required: true, message: '请选择专业' }]}>
                                <Select>
                                    {professionalList.map((item) => {
                                        return (
                                            <Select.Option value={item.key} key={item.key} label={item.value}>
                                                {item.value}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="日期" name="operationTime" rules={[{ required: true }]}>
                                <DatePicker
                                    style={{ width: '100%' }}
                                    onChange={(date) => {
                                        setStartTime(date);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="账号权限" name="accountPower">
                                <Input maxLength={20} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="操作内容" name="operationContent" rules={[{ required: true, message: '请输入操作内容' }]}>
                                <Select>
                                    {operationContentList.map((item) => {
                                        return (
                                            <Select.Option value={item.key} key={item.key} label={item.value}>
                                                {item.value}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="设备厂商名称" name="vendorId" rules={[{ required: true, message: '请选择厂家' }]}>
                                <SelectCondition
                                    labelInValue
                                    title="厂家"
                                    label="value"
                                    id="key"
                                    dictName="vendor_id"
                                    searchName="vendor_id"
                                    pageSize={99999}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="操作人" name="operator">
                                <Input disabled bordered={false} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="审核人" name="reviewer">
                                <Input maxLength={10} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="操作描述" name="description" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <TextArea rows={4} maxLength={1000} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default AddEditModal;
