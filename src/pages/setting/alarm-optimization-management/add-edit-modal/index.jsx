import React, { useState, useMemo } from 'react';
import { Modal, Form, Input, DatePicker, Col, Row, InputNumber, Select, Upload, Button, Icon, message } from 'oss-ui';
import moment from 'moment';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { addAlarmOptimizationManagement, editAlarmOptimizationManagement, uploadAlarmOptimization } from '../api';
import AlarmCopyModal from '../alarm-copy-modal';
import { enumRadio, enumAlarmLevel } from '../enum';

const AddEditModal = (props) => {
    const { isModalOpen, handleCancel, reloadTable, currentItem, editType, userId, userName, provinceId, currProvince, professionalData } = props;
    const [form] = Form.useForm();
    const [createTime] = useState(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

    const beforeUpload = (file) => {
        const upLoadFileType = [
            'application/x-zip-compressed',
            'application/vnd.ms-excel',
            'application/msword',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-powerpoint',
        ];
        const upLoadFileName = ['.rar', '.zip', 'xls', 'xlsx', 'ppt', 'pptx', 'doc', 'docx'];
        const isUpLoad = upLoadFileType.includes(file.type) || upLoadFileName.some((item) => file.name.endsWith(item));
        if (!isUpLoad) {
            message.error('仅支持上传office文档和压缩包');
        }

        return isUpLoad;
    };

    /** *
     *自定义文件上传
     */
    const uploadScripts = async (file) => {
        const { file: fileInfo } = file;
        const formData = new FormData();
        formData.append('file', fileInfo);
        const result = await uploadAlarmOptimization(formData);
        if (result.code === 200) {
            const { annexPath } = result;
            form.setFieldsValue({ annexPath: annexPath || fileInfo.name });
        } else {
            message.error(result.message);
        }
    };

    // 确认按钮
    const handleOk = async () => {
        const values = await form.validateFields();
        const params = {
            id: currentItem ? currentItem.id : undefined,
            provinceId: values.province.value,
            provinceName: values.province.label,
            professionId: values.professional.value,
            professionName: values.professional.label,
            alarmPlatform: values.alarmPlatform,
            alarmTitle: values.alarmTitle,
            firstTime: values.firstTime ? moment(values.firstTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
            lastTime: values.lastTime ? moment(values.lastTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
            createTime: moment(values.createTime).format('YYYY-MM-DD HH:mm:ss'),
            clearTime: values.clearTime ? moment(values.clearTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
            optimizationFlag: values.optimizationFlag,
            optimizationCompleteFlag: values.optimizationCompleteFlag,
            repeatTimes: values.repeatTimes,
            alarmLevel: values.alarmLevel,
            createUserId: userId,
            createUserName: userName,
            sheetNo: values.sheetNo,
            alarmSystem: values.alarmSystem,
            alarmContent: values.alarmContent,
            alarmReason: values.alarmReason,
            incidence: values.incidence,
            optimizationMeasures: values.optimizationMeasures,
            memo: values.memo,
            annexPath: values.annexPath,
        };
        currentItem ? await editAlarmOptimizationManagement(params) : await addAlarmOptimizationManagement(params);
        reloadTable && reloadTable();
        handleCancel && handleCancel();
    };
    // 给表单项赋初始值
    const initialValue = useMemo(() => {
        switch (editType) {
            case 'edit':
                return {
                    ...currentItem,
                    lastTime: currentItem.lastTime && moment(currentItem.lastTime),
                    firstTime: currentItem.firstTime && moment(currentItem.firstTime),
                    clearTime: currentItem.clearTime && moment(currentItem.clearTime),
                    createTime: currentItem.createTime,
                    professional: { value: currentItem.professionId, label: currentItem.professionName },
                    createUserName: userName,
                    createUserId: userId,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                };
            case 'add':
                return {
                    createUserName: userName,
                    createUserId: userId,
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                    optimizationCompleteFlag: '否',
                    optimizationFlag: '否',
                    alarmLevel: '严重',
                    firstTime: moment(moment().format('YYYY-MM-DD 00:00:00')),
                    lastTime: moment(moment().format('YYYY-MM-DD 00:00:00')),
                    clearTime: moment(moment().format('YYYY-MM-DD 00:00:00')),
                };
            case 'view':
                return {
                    ...currentItem,
                    createUserName: userName,
                    createUserId: userId,
                    clearTime: currentItem.clearTime && moment(currentItem.clearTime),
                    createTime: currentItem.createTime,
                    lastTime: currentItem.lastTime && moment(currentItem.lastTime),
                    firstTime: currentItem.firstTime && moment(currentItem.firstTime),
                    professional: { value: currentItem.professionId, label: currentItem.professionName },
                    province: { value: Number(provinceId), label: currProvince?.regionName },
                };
            default:
                break;
        }
    }, []);

    const handleCopy = () => {
        setIsCopyModalOpen(true);
    };

    const handleCopyCancel = () => {
        setIsCopyModalOpen(false);
    };

    const handleCopyOk = (row) => {
        setIsCopyModalOpen(false);

        form.setFieldsValue({
            ...row,
            lastTime: row.lastTime && moment(row.lastTime),
            firstTime: row.firstTime && moment(row.firstTime),
            clearTime: row.clearTime && moment(row.clearTime),
            createTime: row.createTime,
            professional: { value: row.professionId, label: row.professionName },
            createUserName: userName,
            createUserId: userId,
            province: { value: Number(provinceId), label: currProvince?.regionName },
        });
    };
    const checkStrLength = (ruler, inx) => {};

    return (
        <>
            <Modal
                title={editType === 'view' ? '查看' : currentItem ? '编辑' : '新增'}
                visible={isModalOpen}
                width={1000}
                destroyOnClose
                onCancel={handleCancel}
                onOk={handleOk}
                okButtonProps={{ disabled: editType === 'view' }}
                bodyStyle={{ padding: '16px 24px' }}
            >
                <Form
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    layout="horizontal"
                    form={form}
                    initialValues={initialValue}
                >
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                        <Button type="primary" onClick={handleCopy} disabled={editType === 'view'}>
                            告警复制
                        </Button>
                    </div>
                    <Row>
                        <Col span={8}>
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
                        <Col span={16}>
                            <Form.Item
                                label="专业"
                                name="professional"
                                labelCol={{
                                    span: 3,
                                }}
                                wrapperCol={{ span: 22 }}
                                rules={[{ required: true, message: '请选择专业' }]}
                            >
                                <Select
                                    placeholder="请选择专业"
                                    labelInValue
                                    disabled={editType === 'view'}
                                    options={professionalData
                                        ?.filter((item) => item.txt !== '全部')
                                        .map((item) => {
                                            return { label: item.txt, value: item.id };
                                        })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Form.Item
                                label="告警平台"
                                name="alarmPlatform"
                                rules={[
                                    { required: true, message: '' },
                                    {
                                        validator: async (rule, val, callback) => {
                                            if (!val) {
                                                throw new Error('请输入告警平台！');
                                            } else if (val.length > 200) {
                                                throw new Error('告警平台输入不能超过200个字符！');
                                            } else {
                                                callback();
                                            }
                                        },
                                    },
                                ]}
                            >
                                <Input placeholder="请输入告警平台！" disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item
                                label="告警主题"
                                name="alarmTitle"
                                labelCol={{
                                    span: 3,
                                }}
                                wrapperCol={{ span: 22 }}
                                rules={[
                                    { required: true, message: '' },
                                    {
                                        validator: async (rule, val, callback) => {
                                            if (!val) {
                                                throw new Error('请输入告警主题！');
                                            } else if (val.length > 200) {
                                                throw new Error('告警主题输入不能超过200个字符！');
                                            } else {
                                                callback();
                                            }
                                        },
                                    },
                                ]}
                            >
                                <Input placeholder="请输入告警主题！" disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Form.Item label="首次发生时间" name="firstTime">
                                <DatePicker disabled={editType === 'view'} showTime style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="最后发生时间" name="lastTime">
                                <DatePicker disabled={editType === 'view'} showTime style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="创建时间" name="createTime" wrapperCol={{ span: 18 }}>
                                <Input disabled bordered defaultValue={createTime} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Form.Item label="清除时间" name="clearTime">
                                <DatePicker disabled={editType === 'view'} showTime style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="是否需要优化" name="optimizationFlag">
                                <Select disabled={editType === 'view'}>
                                    {enumRadio.map((item) => {
                                        return (
                                            <Select.Option label={item.value} value={item.value}>
                                                {item.value}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="是否完成优化" name="optimizationCompleteFlag" wrapperCol={{ span: 18 }}>
                                <Select disabled={editType === 'view'} style={{ width: '100%' }}>
                                    {enumRadio.map((item) => {
                                        return (
                                            <Select.Option label={item.value} value={item.value}>
                                                {item.value}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Form.Item label="重复次数" name="repeatTimes">
                                <InputNumber min={0} max={9999} defaultValue={0} disabled={editType === 'view'} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="告警级别"
                                name="alarmLevel"
                                rules={[{ required: true, message: '请选择告警级别' }]}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 16 }}
                            >
                                <Select disabled={editType === 'view'}>
                                    {enumAlarmLevel.map((item) => {
                                        return (
                                            <Select.Option label={item.value} value={item.value}>
                                                {item.value}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="创建人" name="createUserName" wrapperCol={{ span: 18 }}>
                                <Input disabled bordered />
                            </Form.Item>
                            <Form.Item hidden name="createUserId">
                                <Input placeholder="请输入创建人！" disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Form.Item label="已派工单编号" name="sheetNo">
                                <Input placeholder="请输入已派工单编号！" maxLength={200} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item
                                label="告警网管系统"
                                name="alarmSystem"
                                labelCol={{
                                    span: 3,
                                }}
                                wrapperCol={{ span: 21 }}
                            >
                                <Input placeholder="请输入告警网管系统！" maxLength={200} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="告警内容"
                        name="alarmContent"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        rules={[
                            {
                                validator: async (rule, val, callback) => {
                                    if (!val) {
                                        // throw new Error('');
                                    } else if (val.length > 2000) {
                                        throw new Error('描述不能超过2000字!');
                                    } else {
                                        callback();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input placeholder="请输入告警内容！" disabled={editType === 'view'} maxLength={2000} />
                    </Form.Item>
                    <Form.Item
                        label="告警原因"
                        name="alarmReason"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        rules={[
                            {
                                validator: async (rule, val, callback) => {
                                    if (!val) {
                                        // throw new Error('');
                                    } else if (val.length > 2000) {
                                        throw new Error('描述不能超过2000字!');
                                    } else {
                                        callback();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input placeholder="请输入告警原因！" disabled={editType === 'view'} maxLength={2000} />
                    </Form.Item>
                    <Form.Item
                        label="影响范围"
                        name="incidence"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        rules={[
                            {
                                validator: async (rule, val, callback) => {
                                    if (!val) {
                                        // throw new Error('');
                                    } else if (val.length > 2000) {
                                        throw new Error('描述不能超过2000字!');
                                    } else {
                                        callback();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input placeholder="请输入影响范围！" disabled={editType === 'view'} maxLength={2000} />
                    </Form.Item>
                    <Form.Item
                        label="优化措施"
                        name="optimizationMeasures"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        rules={[
                            {
                                validator: async (rule, val, callback) => {
                                    if (!val) {
                                        // throw new Error('');
                                    } else if (val.length > 2000) {
                                        throw new Error('描述不能超过2000字!');
                                    } else {
                                        callback();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input placeholder="请输入优化措施！" disabled={editType === 'view'} maxLength={2000} />
                    </Form.Item>
                    <Form.Item
                        label="备注"
                        name="memo"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        rules={[
                            {
                                validator: async (rule, val, callback) => {
                                    if (!val) {
                                        // throw new Error('');
                                    } else if (val.length > 2000) {
                                        throw new Error('描述不能超过2000字!');
                                    } else {
                                        callback();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input placeholder="请输入备注！" disabled={editType === 'view'} maxLength={2000} />
                    </Form.Item>
                    <Form.Item label="附件" name="annexPath" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                        <Input disabled />
                    </Form.Item>
                    <Row>
                        <Col span={22} offset={2}>
                            <Upload
                                multiple={false}
                                customRequest={uploadScripts}
                                // onDownload={onDownload}
                                maxCount={1}
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                accept=".ppt, .pptx, .doc, .docx, .pdf, .xls, .xlsx, .zip, .rar"
                            >
                                <Button type="primary" disabled={editType === 'view'} icon={<Icon type="UploadOutlined" antdIcon />}>
                                    选择文件
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            {isCopyModalOpen && <AlarmCopyModal isModalOpen={isCopyModalOpen} handleCancel={handleCopyCancel} handleCopyOk={handleCopyOk} />}
        </>
    );
};

export default AddEditModal;
