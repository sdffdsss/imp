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
        userName,
        provinceId,
        currProvince,
        networkTypeEnum,
        professionalNetworkTypeEnum,
        declarationTypeEnum,
        coordinationResultsEnum,
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
            // provinceName: values.province.label,
            majorId: majorType.coreNetwork,
            networkType: values.networkType,
            coordinationProcessingTime: moment(values.coordinationProcessingTime).format('YYYY-MM-DD HH:mm:ss'),
            professionalNetworkType: values.professionalNetworkType,
            declarationType: values.declarationType,
            coordinationResults: values.coordinationResults,
            coordinationPeople: values.coordinationPeople,
            coordinationContent: values.coordinationContent,
            eventTrackProgress: values.eventTrackProgress,
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
                    coordinationProcessingTime: currentItem.coordinationProcessingTime && moment(currentItem.coordinationProcessingTime),
                    createdBy: userName,
                    majorId: majorType.coreNetwork,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                };
            case 'add':
                return {
                    createdBy: userName,
                    // createUserId: userId,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                    majorId: majorType.coreNetwork,
                    networkType: 1,
                    professionalNetworkType: 1,
                    declarationType: 1,
                    coordinationResults: 1,
                };
            case 'view':
                return {
                    ...currentItem,
                    coordinationProcessingTime: currentItem.coordinationProcessingTime && moment(currentItem.coordinationProcessingTime),
                    createdBy: userName,
                    majorId: majorType.coreNetwork,
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
                width={wrapClassName ? 1000 : 800}
                destroyOnClose
                onCancel={handleCancel}
                onOk={handleOk}
                okButtonProps={{ disabled: editType === 'view' }}
                wrapClassName={wrapClassName}
            >
                <Form
                    labelCol={{
                        span: 10,
                    }}
                    wrapperCol={{
                        span: 14,
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
                                <Select defaultValue={majorType.coreNetwork} disabled>
                                    <Select.Option value={majorType.coreNetwork} label="核心网专业">
                                        核心网专业
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="系统" name="networkType" rules={[{ required: true, message: '请选择系统' }]}>
                                <Select
                                    defaultValue={1}
                                    disabled={editType === 'view'}
                                    options={networkTypeEnum.map((item) => {
                                        return { label: item.lable, value: item.value };
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="专业网类型" name="professionalNetworkType" rules={[{ required: true, message: '请选择专业网类型' }]}>
                                <Select
                                    defaultValue={1}
                                    disabled={editType === 'view'}
                                    options={professionalNetworkTypeEnum.map((item) => {
                                        return { label: item.lable, value: item.value };
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="申告类型" name="declarationType" rules={[{ required: true, message: '请选择申告类型' }]}>
                                <Select
                                    defaultValue={1}
                                    disabled={editType === 'view'}
                                    options={declarationTypeEnum.map((item) => {
                                        return { label: item.lable, value: item.value };
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="协调结果" name="coordinationResults" rules={[{ required: true, message: '请选择协调结果' }]}>
                                <Select
                                    defaultValue={1}
                                    disabled={editType === 'view'}
                                    options={coordinationResultsEnum.map((item) => {
                                        return { label: item.lable, value: item.value };
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="协调人" name="coordinationPeople" rules={[{ required: true, message: '请输入协调人' }]}>
                                <Input maxLength={50} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="处理时间" name="coordinationProcessingTime" rules={[{ required: true, message: '请选择处理时间' }]}>
                                <DatePicker style={{ width: '100%' }} showTime disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="协调工作具体内容"
                                name="coordinationContent"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 19 }}
                                rules={[{ required: true, message: '请输入协调工作具体内容' }]}
                            >
                                <TextArea rows={4} maxLength={2000} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="未处理完事件跟踪进展" name="eventTrackProgress" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
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
