import React, { useMemo } from 'react';

import moment from 'moment';
import { Modal, Form, Input, DatePicker, Col, Row, message, Select } from 'oss-ui';

import { addDutyBusinessFaultManagementPlatform, updateDutyBusinessFaultManagementPlatform } from '../api';
import { specialist, faultCloseName } from '../../enum';
import { disabledDate, disabledTime } from './utils';
import './index.less';

const AddEditModal = (props) => {
    const { isModalOpen, handleCancel, reloadTable, currentItem, editType, userName, provinceId, currProvince, wrapClassName } = props;
    const [form] = Form.useForm();

    const modalTitle = useMemo(() => {
        if (editType === 'view') {
            return '查看';
        }
        return currentItem ? '编辑' : '新增';
    }, [currentItem, editType]);
    const onClose = () => {
        form.resetFields();
        handleCancel();
    };
    const initialValue = useMemo(() => {
        let initData = {};
        const faultStartTime = moment().startOf('hour');
        const faultEndTime = moment().add(5, 'hour').startOf('hour');
        const faultDuration = faultEndTime.diff(faultStartTime, 'minutes');
        if (editType === 'add') {
            initData = {
                faultStartTime,
                faultEndTime,
                faultDuration,
                businessEffect: '否',
                faultRestoreTime: faultEndTime,
                businessDuration: faultDuration,
                complaintStatus: '收到用户投诉0起，申诉0起',
                reportPlatform: '已上报',
                sendOrder: '自动派单',
                majorId: 9996,
                faultCloseName: 0,
                createdBy: userName,
                createTime: moment(),
            };
        }

        if ((editType === 'edit' || editType === 'view') && currentItem) {
            console.log(currentItem);
            initData = {
                ...currentItem,
                faultStartTime: currentItem.faultStartTime ? moment(currentItem.faultStartTime) : undefined,
                faultEndTime: currentItem.faultEndTime ? moment(currentItem.faultEndTime) : undefined,
                faultRestoreTime: currentItem.faultRestoreTime ? moment(currentItem.faultRestoreTime) : undefined,
                faultDuration: currentItem.faultDuration === null ? undefined : currentItem.faultDuration,
                businessDuration: currentItem.businessDuration === null ? undefined : currentItem.businessDuration,
                faultCloseName: currentItem.faultClose,
                createTime: moment(currentItem.createTime),
            };
        }

        return initData;
    }, [currentItem, editType, userName]);

    const onStartOk = (_, value) => {
        const endTime = form.getFieldValue('faultEndTime');
        const endTime1 = form.getFieldValue('faultRestoreTime');
        if (!endTime || !endTime1) {
            return Promise.resolve();
        }

        if (value && endTime && endTime1 && !value.isAfter(endTime) && !value.isAfter(endTime1)) {
            form.setFieldsValue({ faultDuration: endTime.diff(value, 'minutes'), businessDuration: endTime1.diff(value, 'minutes') });
            return Promise.resolve();
        }

        if (value && !value.isBefore(endTime)) {
            if (endTime === null) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('开始时间不能大于结束时间'));
        }
        if (value && !value.isBefore(endTime1)) {
            if (endTime1 === null) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('开始时间不能大于恢复时间'));
        }
        return Promise.reject();
    };
    const onEndOk = (_, value) => {
        const startTime = form.getFieldValue('faultStartTime');
        if (value && startTime && !value.isBefore(startTime)) {
            form.setFieldsValue({ faultDuration: value.diff(startTime, 'minutes') });
            return Promise.resolve();
        }
        if (value && startTime && !value.isAfter(startTime)) {
            return Promise.reject(new Error('结束时间不能小于开始时间'));
        }
        if (!value) {
            form.setFieldsValue({ faultDuration: undefined });
            return Promise.resolve();
        }
        return Promise.reject();
    };
    const onRestoreTimeOk = (_, value) => {
        const startTime = form.getFieldValue('faultStartTime');
        if (value && startTime && !value.isBefore(startTime)) {
            form.setFieldsValue({ businessDuration: value.diff(startTime, 'minutes') });
            return Promise.resolve();
        }
        if (value && startTime && !value.isAfter(startTime)) {
            return Promise.reject(new Error('恢复时间不能小于开始时间'));
        }
        if (!value) {
            form.setFieldsValue({ businessDuration: undefined });
            return Promise.resolve();
        }
        return Promise.reject();
    };
    const onSubmit = async () => {
        const values = await form.validateFields();
        const params = {
            ...values,
            faultStartTime: values.faultStartTime.format('YYYY-MM-DD HH:mm:ss'),
            faultEndTime: values.faultEndTime?.format('YYYY-MM-DD HH:mm:ss'),
            faultRestoreTime: values.faultRestoreTime?.format('YYYY-MM-DD HH:mm:ss'),
            createTime: values.createTime.format('YYYY-MM-DD HH:mm:ss'),
            dataProvinceId: Number(provinceId),
            professionalType: '平台',
            faultClose: values.faultCloseName,
            provinceId: Number(provinceId),
            faultCloseName: values.faultCloseName === 0 ? '未闭环' : '已闭环',
        };
        if (editType === 'add') {
            const result = await addDutyBusinessFaultManagementPlatform(params);
            if (result.code === 200) {
                message.success('添加成功');
            }
        }
        if (editType === 'edit') {
            const editParams = {
                ...params,
                id: currentItem.id,
            };
            const result = await updateDutyBusinessFaultManagementPlatform(editParams);
            if (result.code === 200) {
                message.success('修改成功');
            }
        }
        reloadTable();
        onClose();
    };

    return (
        <>
            <Modal
                title={modalTitle}
                visible={isModalOpen}
                width={wrapClassName ? 1000 : 800}
                onCancel={onClose}
                onOk={onSubmit}
                okButtonProps={{ disabled: editType === 'view' }}
                wrapClassName={wrapClassName}
            >
                <div className="form-body">
                    <Form form={form} initialValues={initialValue}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item label="故障名称" name="faultName" rules={[{ required: true, message: '请输入故障名称' }]}>
                                    <Input maxLength={200} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    label="故障开始时间"
                                    name="faultStartTime"
                                    rules={[{ validator: onStartOk }, { required: true, message: '请选择故障开始时间' }]}
                                >
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm:ss"
                                        showTime
                                        disabled={editType === 'view'}
                                        disabledDate={(current) => {
                                            const endTime = form.getFieldValue('faultEndTime');
                                            const restoreTime = form.getFieldValue('faultRestoreTime');
                                            if (endTime?.isBefore(restoreTime)) {
                                                return disabledDate(current, undefined, endTime);
                                            }
                                            return disabledDate(current, undefined, restoreTime);
                                        }}
                                        disabledTime={(current) => {
                                            const endTime = form.getFieldValue('faultEndTime');
                                            const restoreTime = form.getFieldValue('faultRestoreTime');
                                            if (endTime?.isBefore(restoreTime)) {
                                                return disabledTime(current, undefined, endTime);
                                            }
                                            return disabledTime(current, undefined, restoreTime);
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="故障结束时间" name="faultEndTime" rules={[{ validator: onEndOk }]}>
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm:ss"
                                        showTime
                                        disabled={editType === 'view'}
                                        disabledDate={(current) => disabledDate(current, form.getFieldValue('faultStartTime'), undefined)}
                                        disabledTime={(current) => disabledTime(current, form.getFieldValue('faultStartTime'), undefined)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="故障历时" name="faultDuration">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="故障所在大区/省" name="provinceName">
                                    <Input maxLength={100} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="业务恢复时间" name="faultRestoreTime" rules={[{ validator: onRestoreTimeOk }]}>
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm:ss"
                                        showTime
                                        disabled={editType === 'view'}
                                        disabledDate={(current) => disabledDate(current, form.getFieldValue('faultStartTime'), undefined)}
                                        disabledTime={(current) => disabledTime(current, form.getFieldValue('faultStartTime'), undefined)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="业务中断历时" name="businessDuration">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="故障平台" name="faultPlatform">
                                    <Input maxLength={200} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="业务影响情况" name="businessEffect">
                                    <Select
                                        options={[
                                            { label: '是', value: '是' },
                                            { label: '否', value: '否' },
                                        ]}
                                        disabled={editType === 'view'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="故障专业" name="majorId">
                                    <Select options={specialist} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="故障处理责任人" name="contactsName">
                                    <Input maxLength={100} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="是否上报平台室" name="reportPlatform">
                                    <Input maxLength={100} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="是否派单" name="sendOrder">
                                    <Input maxLength={100} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="故障闭环" name="faultCloseName">
                                    <Select options={faultCloseName} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="故障现象" name="faultPhenomenon">
                                    <Input.TextArea maxLength={1000} style={{ height: 65 }} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="影响范围" name="effectScope">
                                    <Input.TextArea maxLength={1000} style={{ height: 65 }} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="投诉情况" name="complaintStatus">
                                    <Input.TextArea maxLength={1000} style={{ height: 65 }} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="故障原因" name="faultCause">
                                    <Input.TextArea maxLength={1000} style={{ height: 65 }} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="备注" name="remark">
                                    <Input.TextArea maxLength={1000} style={{ height: 65 }} disabled={editType === 'view'} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="创建人" name="createdBy">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="创建时间" name="createTime">
                                    <DatePicker disabled format="YYYY-MM-DD HH:mm:ss" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default AddEditModal;
