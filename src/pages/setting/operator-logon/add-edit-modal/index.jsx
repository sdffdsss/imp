import React, { useMemo } from 'react';
import { Modal, Form, Input, DatePicker, Col, Row, InputNumber, Select, message } from 'oss-ui';
import moment from 'moment';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { addOperationRegistration, editOperationRegistration } from '../api';

const { TextArea } = Input;

const AddEditModal = (props) => {
    const { isModalOpen, handleCancel, reloadTable, currentItem, editType, userId, userName, provinceId, currProvince, professionalData } = props;
    const [form] = Form.useForm();
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';

    // 确认按钮
    const handleOk = async () => {
        const values = await form.validateFields();
        const { contactInfo = '' } = values;
        if (!contactInfo) {
            message.warn('手机号不可为空');
            return;
        }
        if (Object.is(Number(contactInfo), NaN)) {
            message.warn('手机号不可包含非数字字符');
            return;
        }
        if (contactInfo.length !== 11) {
            message.warn('手机号位数错误');
            return;
        }

        const data = {
            id: currentItem ? currentItem.id : undefined,
            provinceId: Number(values.province.value),
            provinceName: values.province.label,
            professionalType: values.professional ? Number(values.professional.key) : undefined, // number
            professionalName: values.professional ? values.professional.label : undefined, // string
            dateTime: values.dateTime ? moment(values.dateTime).format(dateFormat) : '',
            recordTime: values.recordTime ? moment(values.recordTime).format(dateFormat) : '',
            leaveTime: values.leaveTime ? moment(values.leaveTime).format(dateFormat) : '',
            name: values.name,
            sex: Number(values.sex.key),
            numberOfPeople: values.numberOfPeople,
            unitName: values.unitName,
            workReasons: values.workReasons,
            applicationFormFlag: Number(values.applicationFormFlag),
            recordMan: values.recordMan,
            recorderId: values.recorderId,
            supportDepartment: values.supportDepartment,
            workContent: values.workContent,
            entryTime: values.entryTime ? moment(values.entryTime).format(dateFormat) : '',
            contactInfo: values.contactInfo,
            receiver: values.receiver,
        };
        currentItem ? await editOperationRegistration(data) : await addOperationRegistration(data);
        reloadTable && reloadTable();
        handleCancel && handleCancel();
    };
    // 给表单项赋初始值
    const initialValue = useMemo(() => {
        switch (editType) {
            case 'edit':
                return {
                    ...currentItem,
                    dateTime: currentItem.dateTime && moment(currentItem.dateTime),
                    leaveTime: currentItem.leaveTime && moment(currentItem.leaveTime),
                    recordTime: moment(currentItem.recordTime).format('YYYY-MM-DD HH:mm:ss'),
                    professional: { value: currentItem.professionalType, label: currentItem.professionalName },
                    recordMan: userName,
                    recorderId: userId,
                    sex: { key: currentItem.sex, value: currentItem.sex === 0 ? '男' : '女' },
                    applicationFormFlag: { key: currentItem.applicationFormFlag, value: currentItem.applicationFormFlag === 0 ? '否' : '是' },
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                    entryTime: currentItem.entryTime ? moment(currentItem.entryTime) : null,
                    contactInfo: currentItem.contactInfo,
                    receiver: currentItem.receiver,
                };
            case 'add':
                return {
                    recordMan: userName,
                    recorderId: userId,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                    sex: { key: '0', value: '男' },
                    dateTime: moment(new Date(), dateFormat),
                };
            default:
                return {};
        }
    }, []);

    const enumSex = [
        { key: '0', value: '男' },
        { key: '1', value: '女' },
    ];
    const enumApplication = [
        { key: '1', value: '是' },
        { key: '0', value: '否' },
    ];
    return (
        <>
            <Modal
                title={currentItem ? '编辑' : '新增'}
                visible={isModalOpen}
                width={800}
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
                            <Form.Item label="专业" name="professional" rules={[{ required: true, message: '请选择专业' }]}>
                                <Select labelInValue>
                                    {professionalData
                                        ?.filter(
                                            (item) =>
                                                item.txt !== '全部' && item.txt !== 'IP承载A网' && item.txt !== 'IP承载B网' && item.txt !== '数据网',
                                        )
                                        .map((item) => {
                                            return (
                                                <option value={item.txt} key={item.id}>
                                                    {item.txt}
                                                </option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="日期" name="dateTime" rules={[{ required: true, message: '请选择日期' }]}>
                                <DatePicker style={{ width: '100%' }} showTime />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="人员姓名" name="name" rules={[{ required: true, message: '请输入人员姓名' }]}>
                                <Input maxLength={50} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="性别" name="sex" rules={[{ required: true, message: '请选择性别' }]}>
                                <Select
                                    labelInValue
                                    options={enumSex.map((item) => {
                                        return { label: item.value, value: item.key };
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="人数" name="numberOfPeople" rules={[{ required: true, message: '请输入人数' }]}>
                                <InputNumber style={{ width: '100%' }} min={0} precision={0} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="进入时间" name="entryTime" rules={[{ required: true, message: '请输入进入时间' }]}>
                                <DatePicker style={{ width: '100%' }} showTime />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="人员联系方式" name="contactInfo" rules={[{ required: true, message: '请输入人员联系方式' }]}>
                                <Input bordered maxLength={50} />
                            </Form.Item>
                            <Form.Item hidden name="recorderId">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="离开时间" name="leaveTime" rules={[{ required: true, message: '请选择离开时间' }]}>
                                <DatePicker style={{ width: '100%' }} showTime />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="单位" name="unitName" rules={[{ required: true, message: '请输入单位' }]}>
                                <Input maxLength={100} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="是否有申请表" name="applicationFormFlag" rules={[{ required: true, message: '请选择是否有申请表' }]}>
                                <Select
                                    options={enumApplication.map((item) => {
                                        return { label: item.value, value: item.key };
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="接待人" name="receiver" rules={[{ required: true, message: '请输入接待人' }]}>
                                <Input bordered />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="支撑部门"
                                name="supportDepartment"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: true, message: '请输入支撑部门' }]}
                            >
                                <Input rows={4} maxLength={100} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="工作原因"
                                name="workReasons"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: true, message: '请输入工作原因' }]}
                            >
                                <TextArea rows={4} maxLength={200} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="工作内容"
                                name="workContent"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: true, message: '请输入工作内容' }]}
                            >
                                <TextArea rows={4} maxLength={200} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default AddEditModal;
