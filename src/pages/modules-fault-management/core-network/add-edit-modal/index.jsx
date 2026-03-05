import React, { useState, useMemo } from 'react';
import { Modal, Form, Input, DatePicker, Col, Row, message, Select, InputNumber, Tooltip } from 'oss-ui';
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
        loginId,
        provinceId,
        currProvince,
        professionalList,
        professionalNetworkTypeList,
        businessImpactSituationList,
        faultCauseList,
        processingResultsList,
        wrapClassName,
        groupSourceEnum,
    } = props;
    const [form] = Form.useForm();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [planTime, setPlanTime] = useState(null);
    // 确认按钮
    const handleOk = async () => {
        if (props.handleSaveCheck) {
            const checkResult = await props.handleSaveCheck();

            if (!checkResult) {
                return;
            }
        }

        form.validateFields()
            .then((values) => {
                const {
                    recorderId,
                    recorder,
                    belongProvince,
                    majorType,
                    faultSource,
                    networkType,
                    faultPointArea,
                    businessImpact,
                    causeObstacle,
                    interruptionDuration,
                    isOffPoint,
                    processingResult,
                    faultRecord,
                    remarks,
                    faultProvince,
                    groupSource,
                } = values;
                let data = {
                    recorder,
                    createdBy: loginId,
                    id: currentItem ? currentItem.id : undefined,
                    belongProvince: provinceId,
                    majorType,
                    faultSource,
                    networkType,
                    faultPointArea,
                    businessImpact,
                    causeObstacle,
                    interruptionDuration,
                    isOffPoint,
                    processingResult,
                    faultRecord,
                    remarks,
                    faultCreateTime: startTime?.format('YYYY-MM-DD HH:mm:ss'),
                    faultOverTime: endTime?.format('YYYY-MM-DD HH:mm:ss'),
                    faultProvince,
                    groupSource,
                };
                if (currentItem) {
                    editTemporaryRoute(data).then((res) => {
                        if (res.code === 200) {
                            message.success('修改成功');

                            reloadTable?.();
                            handleCancel?.();
                        }
                    });
                } else {
                    addTemporaryRoute(data).then((res) => {
                        if (res.code === 200) {
                            message.success('新增成功');

                            reloadTable?.();
                            handleCancel?.();
                        }
                    });
                }
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
                    belongProvince: { value: Number(provinceId), label: currProvince?.regionName },
                    startTime: currentItem.faultCreateTime && moment(currentItem.faultCreateTime),
                    endTime: currentItem.faultOverTime && moment(currentItem.faultOverTime),
                };
            case 'add':
                return {
                    recorder: userName,
                    recorderId: userId,
                    belongProvince: { value: Number(provinceId), label: currProvince?.regionName },
                    majorType: professionalList[0].value,
                    faultSource: '自查',
                    groupSource: groupSourceEnum?.[0],
                };
            case 'view':
                return {
                    ...currentItem,
                    belongProvince: { value: Number(provinceId), label: currProvince?.regionName },
                    startTime: currentItem.faultCreateTime && moment(currentItem.faultCreateTime),
                    endTime: currentItem.faultOverTime && moment(currentItem.faultOverTime),
                };
        }
    }, []);

    return (
        <>
            <Modal
                title={currentItem ? (editType === 'edit' ? '编辑' : '查看') : '新增'}
                visible={isModalOpen}
                width={wrapClassName ? 1100 : 900}
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
                            <Form.Item
                                label="故障所在省"
                                name="faultProvince"
                                title={editType === 'view' ? currentItem?.faultProvince : ''}
                                rules={[{ required: true, message: '请输入故障所在省' }]}
                            >
                                <Input disabled={editType === 'view'} maxLength={20} />
                                {/* <SelectCondition
                                    disabled={editType === 'view'}
                                    labelInValue
                                    title="省份"
                                    id="key"
                                    label="value"
                                    dictName="province_id"
                                    searchName="province_id"
                                /> */}
                            </Form.Item>
                        </Col>
                        <Col span={0}>
                            <Form.Item label="专业" name="majorType" rules={[{ required: true, message: '请选择专业' }]}>
                                <Select
                                    disabled={editType === 'view'}
                                    showSearch
                                    placeholder="请选择专业"
                                    maxTagCount="responsive"
                                    optionFilterProp="children"
                                >
                                    {professionalList.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item.value} label={item.label}>
                                                {item.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={0}>
                            <Form.Item
                                label="故障来源"
                                name="faultSource"
                                rules={[{ required: true, message: '请输入故障来源' }]}
                                style={{ display: 'none' }}
                            >
                                <Input disabled={editType === 'view'} defaultValue="自查" maxLength={50} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="专业网类型" name="networkType" rules={[{ required: true, message: '请选择专业网类型' }]}>
                                <Select
                                    disabled={editType === 'view'}
                                    showSearch
                                    placeholder="请选择专业网类型"
                                    maxTagCount="responsive"
                                    optionFilterProp="children"
                                >
                                    {professionalNetworkTypeList.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item.value} label={item.lable}>
                                                {item.lable}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.faultPointArea : ''}>
                                <Form.Item label="故障点所属地区" name="faultPointArea">
                                    <Input disabled={editType === 'view'} maxLength={200} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="业务影响情况" name="businessImpact">
                                <Select
                                    disabled={editType === 'view'}
                                    showSearch
                                    allowClear
                                    placeholder="请选择业务影响情况"
                                    maxTagCount="responsive"
                                    optionFilterProp="children"
                                >
                                    {businessImpactSituationList.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item.value} label={item.lable}>
                                                {item.lable}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障开始日期/时间" name="startTime">
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
                            <Form.Item label="故障结束日期/时间" name="endTime">
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
                            <Form.Item
                                label="处理人"
                                title={editType === 'view' ? currentItem?.recorder : ''}
                                name="recorder"
                                rules={[{ required: true, message: '请输入处理人' }]}
                            >
                                <Input disabled={editType === 'view'} maxLength={50} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障原因" name="causeObstacle" rules={[{ required: true, message: '请选择故障原因' }]}>
                                <Select
                                    disabled={editType === 'view'}
                                    showSearch
                                    placeholder="请选择故障原因"
                                    maxTagCount="responsive"
                                    optionFilterProp="children"
                                >
                                    {faultCauseList.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item.value} label={item.lable}>
                                                {item.lable}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="中断业务历时(分钟)"
                                name="interruptionDuration"
                                title={editType === 'view' ? currentItem?.interruptionDuration : ''}
                            >
                                <Input disabled={editType === 'view'} maxLength={50} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="是否脱点" name="isOffPoint">
                                <Select
                                    disabled={editType === 'view'}
                                    showSearch
                                    allowClear
                                    placeholder="请选择是否脱点"
                                    maxTagCount="responsive"
                                    optionFilterProp="children"
                                >
                                    {businessImpactSituationList.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item.value} label={item.lable}>
                                                {item.lable}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="处理结果" name="processingResult" rules={[{ required: true, message: '请选择处理结果' }]}>
                                <Select
                                    disabled={editType === 'view'}
                                    showSearch
                                    placeholder="请选择处理结果"
                                    maxTagCount="responsive"
                                    optionFilterProp="children"
                                >
                                    {processingResultsList.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item.value} label={item.lable}>
                                                {item.lable}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="班组来源" name="groupSource" rules={[{ required: true, message: '请选择班组来源' }]}>
                                <Select disabled={editType === 'view'} showSearch placeholder="请选择班组来源">
                                    {groupSourceEnum.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item} label={item}>
                                                {item}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={0}>
                            <Form.Item label="数据省份" name="belongProvince" rules={[{ required: true }]}>
                                <SelectCondition
                                    disabled={editType === 'view'}
                                    labelInValue
                                    title="省份"
                                    id="key"
                                    label="value"
                                    dictName="province_id"
                                    searchName="province_id"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Tooltip title={editType === 'view' ? currentItem?.faultRecord : ''}>
                                <Form.Item label="故障记录" name="faultRecord" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                    <Input.TextArea disabled={editType === 'view'} maxLength={200} rows={3} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={24}>
                            <Tooltip title={editType === 'view' ? currentItem?.remarks : ''}>
                                <Form.Item label="备注" name="remarks" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                    <Input.TextArea disabled={editType === 'view'} maxLength={200} rows={3} />
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
