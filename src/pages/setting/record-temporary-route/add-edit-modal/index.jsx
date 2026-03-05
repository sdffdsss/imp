import React, { useState, useMemo } from 'react';
import { Modal, Form, Input, DatePicker, Col, Row, Select } from 'oss-ui';
import moment from 'moment';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { addTemporaryRoute, editTemporaryRoute } from '../api';

const { TextArea } = Input;

const AddEditModal = (props) => {
    const { isModalOpen, handleCancel, reloadTable, currentItem, editType, userId, userName, provinceId, currProvince, provinceData } = props;
    const [form] = Form.useForm();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    // 确认按钮
    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                const {
                    recorderId,
                    recorder,
                    province,
                    vendor,
                    startTime: startTimeValue,
                    endTime: endTimeValue,
                    businessName,
                    invertedSection,
                    originalRoute,
                    currentRoute,
                    reason,
                    memo,
                } = values;
                const data = {
                    id: currentItem ? currentItem.id : undefined,
                    provinceId: province,
                    provinceName: provinceData.find((e) => e.value === province).label,
                    vendorId: vendor.value,
                    vendorName: vendor.label,
                    startTime: startTimeValue ? moment(startTimeValue).format('YYYY-MM-DD HH:mm:ss') : '',
                    endTime: endTimeValue ? moment(endTimeValue).format('YYYY-MM-DD HH:mm:ss') : '',
                    businessName,
                    invertedSection,
                    originalRoute,
                    currentRoute,
                    recorderId,
                    recorder,
                    reason,
                    memo,
                    dataProvinceId: provinceId,
                };
                const result = (await currentItem) ? editTemporaryRoute(data) : addTemporaryRoute(data);
                result?.then((res) => {
                    if (res.code === 200) {
                        reloadTable?.();
                        handleCancel?.();
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
                    ...currentItem,
                    endTime: currentItem.endTime && moment(currentItem.endTime),
                    startTime: currentItem.startTime && moment(currentItem.startTime),
                    vendor: { value: currentItem.vendorId, label: currentItem.vendorName },
                    recorder: userName,
                    recorderId: userId,
                    province: currentItem.provinceId,
                };
            case 'add':
                return {
                    recorder: userName,
                    recorderId: userId,
                    // province: { value: Number(provinceId), label: currProvince?.regionName },
                };
            case 'view':
                return {
                    ...currentItem,
                    endTime: currentItem.endTime && moment(currentItem.endTime),
                    startTime: currentItem.startTime && moment(currentItem.startTime),
                    vendor: { value: currentItem.vendorId, label: currentItem.vendorName },
                    province: currentItem.provinceId,
                };
            default:
                return {};
        }
    }, []);

    return (
        <>
            <Modal
                title={currentItem ? (editType === 'view' ? '临时路由调整查看' : '编辑') : '新增'}
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
                            <Form.Item label="省份" name="province" rules={[{ required: true }]}>
                                {/* <SelectCondition labelInValue title="省份" id="key" label="value" dictName="province_id" searchName="province_id" /> */}
                                <Select placeholder="请选择" options={provinceData} allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="厂家" name="vendor" rules={[{ required: true, message: '请选择厂家' }]}>
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
                            <Form.Item label="开始时间" name="startTime">
                                <DatePicker
                                    style={{ width: '100%' }}
                                    showTime
                                    onChange={(date) => {
                                        setStartTime(date);
                                    }}
                                    disabledDate={(current) => {
                                        return current && current > moment(endTime);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="结束时间" name="endTime">
                                <DatePicker
                                    style={{ width: '100%' }}
                                    showTime
                                    onChange={(date) => {
                                        setEndTime(date);
                                    }}
                                    disabledDate={(current) => {
                                        return current && current < moment(startTime);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="业务名称" name="businessName">
                                <Input maxLength={40} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="倒接区段" name="invertedSection">
                                <Input maxLength={40} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="原始路由" name="originalRoute">
                                <Input maxLength={40} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="当前路由" name="currentRoute">
                                <Input maxLength={40} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="记录人" name="recorder" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} rules={[{ required: true }]}>
                                <Input disabled bordered={false} />
                            </Form.Item>
                            <Form.Item hidden name="recorderId">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="原因" name="reason" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <TextArea rows={4} maxLength={1000} showCount />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="备注(进展情况)" name="memo" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <TextArea rows={4} maxLength={1000} showCount />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default AddEditModal;
