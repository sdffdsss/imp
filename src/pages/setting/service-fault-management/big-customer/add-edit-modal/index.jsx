import React, { useMemo } from 'react';
import { Modal, Form, Input, DatePicker, Col, Row, Select } from 'oss-ui';
import moment from 'moment';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { addDutyBusinessFaultManagement, editDutyBusinessFaultManagement } from '../api';
import { majorType } from '../../enum';

const { TextArea } = Input;

const AddEditModal = (props) => {
    const {
        isModalOpen,
        handleCancel,
        reloadTable,
        currentItem,
        editType,
        provinceId,
        currProvince,
        acceptMethodEnum,
        businessTypeEnum,
        wrapClassName,
    } = props;
    const [form] = Form.useForm();

    // 确认按钮
    const handleOk = async () => {
        if (props.handleSaveCheck) {
            const checkResult = await props.handleSaveCheck();

            if (!checkResult) {
                return;
            }
        }

        const values = await form.validateFields();

        const params = {
            id: currentItem ? currentItem.id : undefined,
            provinceId: values.province.value,
            majorId: majorType.bigCustomer,
            customName: values.customName || undefined,
            dutyName: values.dutyName || undefined,
            acceptMethod: values.acceptMethod || undefined,
            businessType: values.businessType || undefined,
            circuitCodeName: values.circuitCodeName || undefined,
            sheetNum: values.sheetNum || undefined,
            declarationCustom: values.declarationCustom || undefined,
            contactsName: values.contactsName || undefined,
            phone: values.phone || undefined,
            declarationContent: values.declarationContent || undefined,
            handleProcess: values.handleProcess || undefined,
            faultCause: values.faultCause || undefined,
            acceptTime: values.acceptTime ? moment(values.acceptTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
            findTime: values.findTime ? moment(values.findTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
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

                    acceptTime: currentItem?.acceptTime && moment(currentItem?.acceptTime),
                    findTime: currentItem?.findTime && moment(currentItem?.findTime),
                    majorId: majorType?.bigCustomer,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                };
            case 'add':
                return {
                    // createdBy: userName,
                    // createUserId: userId,
                    acceptTime: moment(),
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                    bussinessType: 1,
                    professionalNetworkType: 1,
                    acceptMethod: 1,
                    majorId: majorType.bigCustomer,
                    businessType: 1,
                };
            default:
            case 'view':
                return {
                    ...currentItem,
                    acceptTime: currentItem.acceptTime && moment(currentItem.acceptTime),
                    findTime: currentItem.findTime && moment(currentItem.findTime),
                    majorId: majorType.bigCustomer,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                };
        }
    }, []);

    return (
        <>
            <Modal
                title={editType === 'view' ? '查看' : currentItem ? '编辑' : '新增'}
                visible={isModalOpen}
                width={wrapClassName ? 1000 : 800}
                destroyOnClose
                onCancel={handleCancel}
                onOk={handleOk}
                okButtonProps={{ disabled: editType === 'view' }}
                wrapClassName={wrapClassName}
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
                                <Select disabled>
                                    <Select.Option value={majorType.bigCustomer} label="大客户业务专业">
                                        大客户业务专业
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="客户名称" name="customName" rules={[{ required: true, message: '请输入客户名称' }]}>
                                <Input maxLength={50} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="值班人员" name="dutyName" rules={[{ required: true, message: '请输入值班人员名称' }]}>
                                <Input maxLength={50} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="受理方式" name="acceptMethod" rules={[{ required: true, message: '请选择受理方式' }]}>
                                <Select
                                    disabled={editType === 'view'}
                                    options={acceptMethodEnum.map((item) => {
                                        return { label: item.lable, value: item.value };
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="业务类型" name="businessType" rules={[{ required: true, message: '请选择业务类型' }]}>
                                <Select
                                    disabled={editType === 'view'}
                                    options={businessTypeEnum.map((item) => {
                                        return { label: item.lable, value: item.value };
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="受理时间" name="acceptTime" rules={[{ required: true, message: '请选择受理时间' }]}>
                                <DatePicker
                                    style={{ width: '100%' }}
                                    showTime
                                    disabled={editType === 'view' || editType === 'add' || editType === 'edit'}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障发生时间" name="findTime" rules={[{ required: true, message: '请选择故障发生时间' }]}>
                                <DatePicker style={{ width: '100%' }} showTime disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="电路代号" name="circuitCodeName">
                                <Input maxLength={100} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="工单号" name="sheetNum" rules={[{ required: true, message: '请输入工单号' }]}>
                                <Input maxLength={100} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="申告客户" name="declarationCustom" rules={[{ required: true, message: '请输入申告客户' }]}>
                                <Input maxLength={100} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="联系人" name="contactsName" rules={[{ required: true, message: '请输入联系人' }]}>
                                <Input maxLength={50} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="联系方式" name="phone" rules={[{ required: true, message: '请输入联系方式' }]}>
                                <Input maxLength={50} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="申告内容详述" name="declarationContent" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <TextArea rows={4} maxLength={2000} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="处理过程" name="handleProcess" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <TextArea rows={4} maxLength={2000} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="故障（事件）原因" name="faultCause" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
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
