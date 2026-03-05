import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button, Col, DatePicker, Form, Icon, Input, InputNumber, Row, Select, Upload } from 'oss-ui';
import { getZonesNormalCase } from '@Common/utils/commonProvincesList';
import useLoginInfoModel from '@Src/hox';
import AlarmCopyModal from '@Pages/setting/alarm-optimization-management/alarm-copy-modal';
import moment from 'moment';
import type { IModalContentProps } from './types';
import { enumRadio, enumAlarmLevel } from '../enum';
import { getProfessionalTypeList, uploadAlarmOptimization } from '../api';

export default forwardRef((props: IModalContentProps, ref) => {
    const [form] = Form.useForm();

    const { mode, initialValues } = props;

    const disabled = mode === 'view';
    const { userId, userName } = useLoginInfoModel();

    const { userInfo, systemInfo } = useLoginInfoModel.data;
    const [provinceList, setProvinceList] = useState<Array<any>>([]);
    const [professionalData, setProfessionalData] = useState<Array<any>>([]);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

    // 获取监控班组专业属性
    const getProfessionalData = async () => {
        const res = await getProfessionalTypeList({});
        if (res && Array.isArray(res.data)) {
            const list = res.data;
            setProfessionalData(list);
        }
    };

    // 获取归属省份
    const getProvinceData = async () => {
        const info = userInfo && JSON.parse(userInfo);
        getZonesNormalCase(info?.zones[0], systemInfo?.currentZone).then((res) => {
            setProvinceList(res);
        });
    };

    useEffect(() => {
        getProvinceData();
        getProfessionalData();
    }, []);

    // 点击确定时需要调用此方法
    const formSubmit = async () => {
        const values = await form.validateFields();

        return values;
    };

    useImperativeHandle(ref, () => ({
        getValues: formSubmit,
    }));

    function formValueChange() {}

    const handleCopy = () => {
        setIsCopyModalOpen(true);
    };

    const handleCopyCancel = () => {
        setIsCopyModalOpen(false);
    };

    const handleCopyOk = (row) => {
        setIsCopyModalOpen(false);
        delete row.createTime;
        form.setFieldsValue({
            ...row,
            lastTime: row.lastTime && moment(row.lastTime),
            firstTime: row.firstTime && moment(row.firstTime),
            clearTime: row.clearTime && moment(row.clearTime),
            professional: { value: row.professionId, label: row.professionName },
            createUserName: userName,
            createUserId: userId,
            province: { value: row.provinceId, label: row.provinceName },
        });
    };

    /** *
     *自定义文件上传
     */
    const uploadScripts = async (file) => {
        const { file: fileInfo } = file;
        const formData = new FormData();
        formData.append('file', file);
        const result = await uploadAlarmOptimization(formData);
        const { annexPath } = result;
        form.setFieldsValue({ annexPath: annexPath || fileInfo.name });
    };

    // UI部分是form，可以是任何内容 目前业务大部分modal中是form
    return (
        <>
            <Form
                form={form}
                onValuesChange={formValueChange}
                initialValues={initialValues}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 16,
                }}
                layout="horizontal"
            >
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <Button type="primary" onClick={handleCopy} disabled={disabled}>
                        告警复制
                    </Button>
                </div>
                <Row>
                    <Col span={8}>
                        <Form.Item label="省份" name="province">
                            <Select
                                disabled
                                options={provinceList.map((item) => {
                                    return { label: item.zoneName, value: item.zoneId };
                                })}
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
                            rules={[{ required: true, message: '请选择专业' }]}
                            wrapperCol={{ span: 22 }}
                        >
                            <Select
                                placeholder="全部"
                                labelInValue
                                disabled={disabled}
                                options={professionalData.map((item) => {
                                    return { label: item.txt, value: item.id };
                                })}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="告警平台" name="alarmPlatform" rules={[{ required: true, message: '请输入告警平台' }]}>
                            <Input maxLength={200} disabled={disabled} />
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
                            rules={[{ required: true, message: '请输入告警主题' }]}
                        >
                            <Input maxLength={200} disabled={disabled} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="首次发生时间" name="firstTime">
                            <DatePicker disabled={disabled} showTime style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="最后发生时间" name="lastTime">
                            <DatePicker disabled={disabled} showTime style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="创建时间" name="createTime" wrapperCol={{ span: 18 }}>
                            <DatePicker showTime disabled style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="清除时间" name="clearTime">
                            <DatePicker disabled={disabled} showTime style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="是否需要优化" name="optimizationFlag">
                            <Select disabled={disabled}>
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
                            <Select disabled={disabled} style={{ width: '100%' }}>
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
                            <InputNumber min={0} max={9999} disabled={disabled} style={{ width: '100%' }} />
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
                            <Select disabled={disabled}>
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
                            <Input disabled={disabled} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="已派工单编号" name="sheetNo">
                            <Input maxLength={200} disabled={disabled} />
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
                            <Input maxLength={200} disabled={disabled} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="告警内容" name="alarmContent" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    <Input maxLength={2000} disabled={disabled} />
                </Form.Item>
                <Form.Item label="告警原因" name="alarmReason" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    <Input maxLength={2000} disabled={disabled} />
                </Form.Item>
                <Form.Item label="影响范围" name="incidence" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    <Input maxLength={2000} disabled={disabled} />
                </Form.Item>
                <Form.Item label="优化措施" name="optimizationMeasures" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    <Input maxLength={2000} disabled={disabled} />
                </Form.Item>
                <Form.Item label="备注" name="memo" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    <Input maxLength={2000} disabled={disabled} />
                </Form.Item>
                <Form.Item label="附件" name="annexPath" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    <Input disabled />
                </Form.Item>
                <Row>
                    <Col span={22} offset={2}>
                        <Upload
                            multiple={false}
                            customRequest={uploadScripts}
                            maxCount={1}
                            showUploadList={false}
                            accept=".ppt, .pptx, .doc, .docx, .pdf, .xls, .xlsx, .zip, .rar"
                        >
                            <Button type="primary" disabled={disabled} icon={<Icon type="UploadOutlined" antdIcon />}>
                                选择文件
                            </Button>
                        </Upload>
                    </Col>
                </Row>
            </Form>

            {isCopyModalOpen && <AlarmCopyModal isModalOpen={isCopyModalOpen} handleCancel={handleCopyCancel} handleCopyOk={handleCopyOk} />}
        </>
    );
});
