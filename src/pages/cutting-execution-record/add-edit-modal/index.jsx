import React, { useState, useMemo } from 'react';
import { Modal, Form, Input, DatePicker, Col, Row, message, Tooltip } from 'oss-ui';
import moment from 'moment';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { addTemporaryRoute, editTemporaryRoute } from '../api';

const AddEditModal = (props) => {
    const { isModalOpen, handleCancel, reloadTable, currentItem, editType, userId, userName, provinceId, currProvince } = props;
    const [form] = Form.useForm();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [planTime, setPlanTime] = useState(null);
    // 确认按钮
    const handleOk = async () => {
        const values = await form.validateFields();
        const {
            province,
            profession,
            mainLineName,
            systemName,
            aBeforeCutting,
            aAfterCutting,
            bBeforeCutting,
            bAfterCutting,
            beforeNetRun,
            afterNetRun,
            cutResult,
            memo,
        } = values;
        const data = {
            createUserId: userId,
            id: currentItem ? currentItem.id : undefined,
            provinceId: province.value,
            provinceName: province.label,
            professionId: profession.value,
            professionName: profession.label,
            mainLineName,
            systemName,
            aBeforeCutting,
            aAfterCutting,
            bBeforeCutting,
            bAfterCutting,
            planCutTime: planTime ? moment(planTime).format('YYYY-MM-DD HH:mm:ss') : '',
            cutTaskStartTime: startTime ? moment(startTime).format('YYYY-MM-DD HH:mm:ss') : '',
            cutTaskEndTime: endTime ? moment(endTime).format('YYYY-MM-DD HH:mm:ss') : '',
            beforeNetRun,
            afterNetRun,
            cutResult,
            memo,
        };
        if (currentItem) {
            data.updateUserId = userId;
            editTemporaryRoute(data).then((res) => {
                if (res.code === 200) {
                    message.success('修改成功');
                }
            });
        } else {
            data.createUserId = userId;
            addTemporaryRoute(data).then((res) => {
                if (res.code === 200) {
                    message.success('新增成功');
                }
            });
        }
        reloadTable && reloadTable();
        handleCancel && handleCancel();
    };
    // 给表单项赋初始值
    const initialValue = useMemo(() => {
        switch (editType) {
            case 'edit':
                return {
                    ...currentItem,
                    province: { value: Number(currentItem.provinceId), label: currentItem.provinceName },
                    profession: { value: Number(currentItem.professionId), label: currentItem.professionName },
                    planTime: currentItem.planCutTime && moment(currentItem.planCutTime),
                    startTime: currentItem.cutTaskStartTime && moment(currentItem.cutTaskStartTime),
                    endTime: currentItem.cutTaskEndTime && moment(currentItem.cutTaskEndTime),
                };
            case 'add':
                return {
                    recorder: userName,
                    recorderId: userId,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                    profession: { value: Number(3), label: '传输网' },
                };
            case 'view':
                return {
                    ...currentItem,
                    province: { value: Number(currentItem.provinceId), label: currentItem.provinceName },
                    profession: { value: Number(currentItem.professionId), label: currentItem.professionName },
                    planTime: currentItem.planCutTime && moment(currentItem.planCutTime),
                    startTime: currentItem.cutTaskStartTime && moment(currentItem.cutTaskStartTime),
                    endTime: currentItem.cutTaskEndTime && moment(currentItem.cutTaskEndTime),
                };
        }
    }, []);

    return (
        <>
            <Modal
                title={currentItem ? (editType === 'edit' ? '编辑' : '查看') : '新增'}
                visible={isModalOpen}
                width={1000}
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
                            <Form.Item label="专业" name="profession" rules={[{ required: true, message: '请选择专业' }]}>
                                {/* <Select options={professionalList} optionFilterProp="label" labelInValue /> */}
                                <SelectCondition
                                    disabled
                                    labelInValue
                                    title="专业"
                                    label="value"
                                    id="key"
                                    dictName="professional_type"
                                    searchName="professional_type"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.mainLineName : ''}>
                                <Form.Item label="干线名称" name="mainLineName">
                                    <Input disabled={editType === 'view'} maxLength={50} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.systemName : ''}>
                                <Form.Item label="系统名称" name="systemName">
                                    <Input disabled={editType === 'view'} maxLength={50} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.aBeforeCutting : ''}>
                                <Form.Item label="割前A端接收光功率(dB)" name="aBeforeCutting">
                                    <Input disabled={editType === 'view'} maxLength={50} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.aAfterCutting : ''}>
                                <Form.Item label="割后A端接收光功率(dB)" name="aAfterCutting">
                                    <Input disabled={editType === 'view'} maxLength={50} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.bBeforeCutting : ''}>
                                <Form.Item label="割前B端接收光功率(dB)" name="bBeforeCutting">
                                    <Input disabled={editType === 'view'} maxLength={50} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.bAfterCutting : ''}>
                                <Form.Item label="割后B端接收光功率(dB)" name="bAfterCutting">
                                    <Input disabled={editType === 'view'} maxLength={50} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="计划割接时间" name="planTime">
                                <DatePicker
                                    disabled={editType === 'view'}
                                    style={{ width: '100%' }}
                                    showTime
                                    onChange={(date) => {
                                        setPlanTime(date);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="实际开始时间" name="startTime">
                                <DatePicker
                                    disabled={editType === 'view'}
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
                            <Form.Item label="实际结束时间" name="endTime">
                                <DatePicker
                                    disabled={editType === 'view'}
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
                            <Tooltip title={editType === 'view' ? currentItem?.beforeNetRun : ''}>
                                <Form.Item label="割接前网络运行情况" name="beforeNetRun">
                                    <Input disabled={editType === 'view'} maxLength={200} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.afterNetRun : ''}>
                                <Form.Item label="割接后网络运行情况" name="afterNetRun">
                                    <Input disabled={editType === 'view'} maxLength={200} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.cutResult : ''}>
                                <Form.Item label="割接结果" name="cutResult">
                                    <Input disabled={editType === 'view'} maxLength={200} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={24}>
                            <Tooltip title={editType === 'view' ? currentItem?.memo : ''}>
                                <Form.Item label="备注" name="memo" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                    <Input disabled={editType === 'view'} maxLength={200} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default AddEditModal;
