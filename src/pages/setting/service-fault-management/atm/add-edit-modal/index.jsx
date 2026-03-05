import React, { useMemo } from 'react';
import { Modal, Form, Input, DatePicker, Col, Row, Select } from 'oss-ui';
import moment from 'moment';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { addDutyBusinessFaultManagement, editDutyBusinessFaultManagement } from '../api';
import { majorType } from '../../enum';

const { TextArea } = Input;

const AddEditModal = (props) => {
    const { isModalOpen, handleCancel, reloadTable, currentItem, editType, userName, provinceId, currProvince, serviceTypeEnum, processStatusEnum } =
        props;
    const [form] = Form.useForm();

    // 确认按钮
    const handleOk = async () => {
        const values = await form.validateFields();
        const params = {
            id: currentItem ? currentItem.id : undefined,
            provinceId: values.province.value,
            // provinceName: values.province.label,
            majorId: majorType.atm,
            circuitCode: values.circuitCode,
            acceptTime: values.acceptTime ? moment(values.acceptTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
            faultRestoreTime: values.faultRestoreTime ? moment(values.faultRestoreTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
            processStatus: values.processStatus,
            customName: values.customName,
            businessType: values.businessType,
            faultDescription: values.faultDescription,
        };
        currentItem ? await editDutyBusinessFaultManagement(params) : await addDutyBusinessFaultManagement(params);
        reloadTable && reloadTable();
        handleCancel && handleCancel();
    };
    // 给表单项赋初始值
    const initialValue = useMemo(() => {
        switch (editType) {
            case 'edit':
                return {
                    ...currentItem,
                    acceptTime: currentItem.acceptTime && moment(currentItem.acceptTime),
                    faultRestoreTime: currentItem.faultRestoreTime && moment(currentItem.faultRestoreTime),
                    // createdBy: userName,
                    majorId: majorType.atm,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                };
            case 'add':
                return {
                    createdBy: userName,
                    // createUserId: userId,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                    businessType: 1,
                    processStatus: 1,
                };
            case 'view':
                return {
                    ...currentItem,
                    acceptTime: currentItem.acceptTime && moment(currentItem.acceptTime),
                    faultRestoreTime: currentItem.faultRestoreTime && moment(currentItem.faultRestoreTime),
                    majorId: majorType.atm,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                };
            default:
                return {};
        }
    }, []);

    return (
        <>
            <Modal
                title={editType === 'view' ? '查看' : currentItem ? '编辑' : '新增'}
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
                            <Form.Item label="省份" name="province">
                                <SelectCondition
                                    labelInValue
                                    title="省份"
                                    id="key"
                                    label="value"
                                    dictName="province_id"
                                    searchName="province_id"
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="专业" name="majorId">
                                <Select defaultValue={majorType.atm} disabled>
                                    <Select.Option value={majorType.atm} label="ATM专业">
                                        ATM专业
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="电路编码" name="circuitCode">
                                <Input maxLength={100} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="客户名称" name="customName" rules={[{ required: true, message: '请输入客户名称' }]}>
                                <Input maxLength={100} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="处理状态" name="processStatus">
                                <Select
                                    defaultValue={1}
                                    disabled={editType === 'view'}
                                    options={processStatusEnum.map((item) => {
                                        return { label: item.lable, value: item.value };
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="业务类型" name="businessType" rules={[{ required: true, message: '请选择业务类型' }]}>
                                <Select
                                    defaultValue={1}
                                    disabled={editType === 'view'}
                                    options={serviceTypeEnum.map((item) => {
                                        return { label: item.lable, value: item.value };
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="受理时间" name="acceptTime">
                                <DatePicker style={{ width: '100%' }} showTime disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="恢复时间" name="faultRestoreTime">
                                <DatePicker style={{ width: '100%' }} showTime disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="故障简述"
                                name="faultDescription"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: true, message: '请输入故障简述' }]}
                            >
                                <TextArea rows={4} maxLength={2000} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default AddEditModal;
