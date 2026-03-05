import React, { useMemo } from 'react';
import { Modal, Form, Input, DatePicker, Col, Row, Select } from 'oss-ui';
import moment from 'moment';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { addNetworkHazardRecord, editNetworkHazardRecord } from '../api';

const { TextArea } = Input;

const AddEditModal = (props) => {
    const {
        isModalOpen,
        handleCancel,
        provinceId,
        currProvince,
        userId,
        userName,
        reloadTable,
        currentItem,
        editType,
        currentTime = moment(),
        professionalList,
        vendorList,
    } = props;
    const [form] = Form.useForm(); // 获取表单数据的钩子
    // const [recordTime, setRecordTime] = useState(currentTime);
    // const [recoveryTime, setRecoveryTime] = useState(null);
    // console.log(currentItem, 11);
    const handleOk = async () => {
        form.validateFields()
            .then(async (values) => {
                console.log(values, 13);
                const { recordId } = currentItem || {};
                const { recorderId, recorder, province, vendor, recordTime, recoveryTime, professional, impactSystem, disposeInfo, description } =
                    values;
                const data = {
                    recordId,
                    recorderId,
                    recorder,
                    provinceId: province.value,
                    provinceName: province.label,
                    vendorId: vendor.value,
                    vendorName: vendor.label,
                    recordTime: recordTime && moment(recordTime).format('YYYY-MM-DD HH:mm:ss'),
                    recoveryTime: recoveryTime && moment(recoveryTime).format('YYYY-MM-DD HH:mm:ss'),
                    professionalType: professional.value,
                    professionalDesc: professional.label,
                    impactSystem,
                    disposeInfo,
                    description,
                };
                console.log(data, 42);
                const result =
                    recordId !== null && recordId !== undefined && editType === 'edit' ? editNetworkHazardRecord(data) : addNetworkHazardRecord(data);
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
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                    professional: { value: currentItem.professionalType, label: currentItem.professionalDesc },
                    vendor: { value: currentItem.vendorId, label: currentItem.vendorName },
                    recordTime: currentItem.recordTime && moment(currentItem.recordTime),
                    recoveryTime: currentItem.recoveryTime && moment(currentItem.recoveryTime),
                };
            case 'add':
                return {
                    recorderId: userId,
                    recorder: userName,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                    vendor: { value: '7', label: '中兴' },
                    professional: { value: '3', label: '传输网' },
                    recordTime: currentTime,
                };
            case 'view':
                return {
                    ...currentItem,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                    professional: { value: currentItem.professionalType, label: currentItem.professionalDesc },
                    vendor: { value: currentItem.vendorId, label: currentItem.vendorName },
                    recordTime: currentItem.recordTime && moment(currentItem.recordTime),
                    recoveryTime: currentItem.recoveryTime && moment(currentItem.recoveryTime),
                };
            default:
                return {};
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Modal
                // eslint-disable-next-line no-nested-ternary
                title={editType === 'view' ? '查看' : currentItem ? '编辑' : '新增'}
                width={700}
                destroyOnClose
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{ disabled: editType === 'view' }}
            >
                <Form
                    labelCol={{
                        span: 10,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal"
                    initialValues={initialValue}
                    form={form}
                >
                    <Row gutter={10}>
                        <Col span={12}>
                            <Form.Item label="省份" name="province" rules={[{ required: true, message: '请选择省份' }]}>
                                <SelectCondition labelInValue title="省份" id="key" label="value" dictName="province_id" searchName="province_id" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="专业" name="professional" rules={[{ required: true, message: '请选择专业' }]}>
                                {/* <SelectCondition
                                    labelInValue
                                    title="专业"
                                    label="value"
                                    id="key"
                                    dictName="professional_type"
                                    searchName="professional_type"
                                /> */}
                                <Select options={professionalList?.filter((item) => item.label !== '全部')} optionFilterProp="label" labelInValue />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="厂家" name="vendor" rules={[{ required: true, message: '请选择厂家' }]}>
                                <Select options={vendorList} optionFilterProp="label" labelInValue />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="记录时间" name="recordTime" rules={[{ required: true, message: '请选择时间' }]}>
                                <DatePicker
                                    style={{ width: '100%' }}
                                    // onChange={(date) => {
                                    //     setRecordTime(date);
                                    // }}
                                    // disabledDate={(current) => {
                                    //     return current && current > moment(recoveryTime);
                                    // }}
                                    showTime
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="恢复时间" name="recoveryTime">
                                <DatePicker
                                    style={{ width: '100%' }}
                                    // onChange={(date) => {
                                    //     setRecoveryTime(date);
                                    // }}
                                    // disabledDate={(current) => {
                                    //     return current && current < moment(recordTime);
                                    // }}
                                    showTime
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="记录人" name="recorder" rules={[{ required: true }]}>
                                <Input disabled bordered={false} />
                            </Form.Item>
                            <Form.Item hidden name="recorderId">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="涉及系统" name="impactSystem" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                                <TextArea rows={4} maxLength={1000} showCount />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="具体描述" name="description" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                                <TextArea rows={4} maxLength={1000} showCount />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="问题/隐患处理情况"
                                name="disposeInfo"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 19 }}
                                rules={[{ required: true, message: '请填写问题/隐患处理情况' }]}
                            >
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
