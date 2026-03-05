import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import { FormUpload } from '@Pages/components';
import React, { FC, useState, useEffect } from 'react';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { Button, Form, Modal, Input, Row, Col, Select, DatePicker, message, Spin } from 'oss-ui';
import { MODAL_TYPE, MODAL_TYPE_NAME, ALL_ENUMS, YES_NO_OPTION, MAJOR_ENUM, ActionType, YES_NO_SHOW_ON_SCREEN } from '../../../type';
import { formatOption, convertFileData, convertParamsFileData, disabledDate, disabledTime } from '../../../util';
import { getCutoverDetail, postCutoverInsert, postCutoverUpdate } from '../../../api';
import style from './style.module.less';

interface Props {
    enums: ALL_ENUMS;
    visible: boolean;
    modalType: MODAL_TYPE;
    openId: number | string | null;
    setVisible: (data: boolean) => void;
    tableRef: React.MutableRefObject<ActionType | undefined>;
    handleSaveCheck?: Function;
}

const BuModal: FC<Props> = (props) => {
    const { visible, modalType, enums, openId, tableRef, setVisible, wrapClassName } = props;

    const [form] = Form.useForm<Record<string, any>>();
    const { userName, provinceId } = useLoginInfoModel();

    const [loading, setLoading] = useState<boolean>(false);
    const [subLoading, setSubLoading] = useState<boolean>(false);

    // 这里统一修改属性
    const itemConfig = {
        // 查看下禁止编辑其他皆可编辑
        disabled: modalType === MODAL_TYPE.SEARCH,
    };

    const getDetail = async () => {
        setLoading(true);
        try {
            const res = await getCutoverDetail({
                id: openId,
            });
            if (res.code === 200) {
                const data = {
                    ...res.data,
                    completionStatus: res?.data?.completionStatus && Number(res?.data?.completionStatus),
                    affiliatedNetwork: res?.data?.affiliatedNetwork && Number(res?.data?.affiliatedNetwork),
                    cutoverStartTime: res?.data?.cutoverStartTime && moment(res.data.cutoverStartTime),
                    cutoverEndTime: res?.data?.cutoverEndTime && moment(res.data.cutoverEndTime),
                    attachment: convertFileData(res?.data?.attachmentList),
                };
                form.setFieldsValue(data);
            }
        } catch {
            message.error('接口错误');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (openId && openId !== 0) {
            getDetail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openId]);

    const handleCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    const onFinish = async (values: any) => {
        try {
            setSubLoading(true);
            const params = {
                ...values,
                id: openId,
                attachment: values?.attachment && convertParamsFileData(values.attachment),
                cutoverStartTime: values?.cutoverStartTime && moment(values.cutoverStartTime).format('YYYY-MM-DD HH:mm:ss'),
                cutoverEndTime: values?.cutoverEndTime && moment(values.cutoverEndTime).format('YYYY-MM-DD HH:mm:ss'),
            };
            if (openId && openId !== 0) {
                // 更新
                const res = await postCutoverUpdate(params);
                if (res.code === 200) {
                    message.success('更新成功');
                    handleCancel();
                    tableRef.current?.reload();
                } else {
                    message.error('更新失败');
                }
            } else {
                // 新增
                const res = await postCutoverInsert(params);
                if (res.code === 200) {
                    message.success('新增成功');
                    handleCancel();
                    tableRef.current?.reload();
                } else {
                    message.error('新增失败');
                }
            }
        } catch {
            message.error('接口错误');
        } finally {
            setSubLoading(false);
        }
    };

    const onSave = async () => {
        if (props.handleSaveCheck) {
            const checkResult = await props.handleSaveCheck();

            if (!checkResult) {
                return;
            }
        }

        form.submit();
    };

    const footer = (
        <div className={style.footer}>
            {modalType !== MODAL_TYPE.SEARCH && (
                <Button type="primary" onClick={onSave} loading={subLoading}>
                    保存
                </Button>
            )}
            <Button onClick={handleCancel}>取消</Button>
        </div>
    );

    return (
        <>
            <Modal
                title={`网络割接记录${MODAL_TYPE_NAME[modalType]}`}
                visible={visible}
                onCancel={handleCancel}
                footer={footer}
                width={wrapClassName ? 1100 : 900}
                bodyStyle={{ marginRight: 20 }}
                wrapClassName={wrapClassName}
            >
                <Spin spinning={loading}>
                    <section className={style.content}>
                        <Form
                            form={form}
                            onFinish={onFinish}
                            initialValues={{
                                provinceId: Number(provinceId),
                                professionType: MAJOR_ENUM.INTERNET,
                                recorder: userName,
                                completionStatus: 4,
                                // cutoverStartTime: moment(moment().format('YYYY-MM-DD 00:00:00')),
                                // cutoverEndTime: moment(moment().format('YYYY-MM-DD 00:00:00')),
                                groupSource: enums.groupSourceEnum?.[0],
                            }}
                        >
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Form.Item label="省份" name="provinceId">
                                        <SelectCondition
                                            form={form}
                                            // mode="multiple"
                                            title="省份"
                                            id="key"
                                            label="value"
                                            dictName="province_id"
                                            searchName="province_id"
                                            disabled
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="专业" name="professionType">
                                        <Select
                                            placeholder="请选择专业"
                                            disabled
                                            options={formatOption(enums.professionalEnum, [MAJOR_ENUM.INTERNET])}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="记录人" name="recorder" rules={[{ required: true, message: '请输入记录人!' }]}>
                                        <Input placeholder="请输入记录人" maxLength={100} disabled />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        label="是否中断业务"
                                        name="isInterruptBusiness"
                                        rules={[{ required: true, message: '请选择是否中断业务!' }]}
                                    >
                                        <Select placeholder="请选择是否中断业务" options={YES_NO_OPTION} {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="完成情况" name="completionStatus">
                                        <Select placeholder="请选择完成情况" options={formatOption(enums.completionStatusEnum)} {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="割接开始时间" name="cutoverStartTime">
                                        <DatePicker
                                            placeholder="请选择割接开始时间"
                                            disabledDate={(current) => disabledDate(current, undefined, form.getFieldValue('cutoverEndTime'))}
                                            disabledTime={(current) => disabledTime(current, undefined, form.getFieldValue('cutoverEndTime'))}
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            {...itemConfig}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="割接结束时间" name="cutoverEndTime">
                                        <DatePicker
                                            placeholder="请选择割接结束时间"
                                            disabledDate={(current) => disabledDate(current, form.getFieldValue('cutoverStartTime'), undefined)}
                                            disabledTime={(current) => disabledTime(current, form.getFieldValue('cutoverStartTime'), undefined)}
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            {...itemConfig}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item name="departmentName" label="操作单位">
                                        <Input placeholder="请输入操作单位" {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="所属网络" name="affiliatedNetwork">
                                        <Select placeholder="请选择所属网络" options={formatOption(enums.affiliatedNetworkEnum)} {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item name="cutoverLocation" label="割接地点">
                                        <Input placeholder="请输入割接地点" maxLength={200} {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item name="operator" label="操作人">
                                        <Input placeholder="请输入操作人" maxLength={100} {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        name="operatorPhoneNumber"
                                        label="操作人联系电话"
                                        rules={[{ pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, 'g'), message: '请输入正确的手机号' }]}
                                        validateTrigger={['onBlur', 'onSubmit']}
                                    >
                                        <Input placeholder="请输入操作人联系电话" maxLength={100} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="是否展示在大屏"
                                        name="isShowOnBigScreen"
                                        rules={[{ required: true, message: '请选择是否展示在大屏!' }]}
                                    >
                                        <Select placeholder="请选择是否展示在大屏" options={YES_NO_SHOW_ON_SCREEN} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="班组来源" name="groupSource" rules={[{ required: true, message: '请选择班组来源' }]}>
                                        <Select showSearch options={formatOption(enums.groupSourceEnum)} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="cutoverInfo" label="割接信息">
                                        <Input.TextArea placeholder="请输入割接信息" maxLength={2000} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item name="affectedSystems" label="受影响的系统">
                                        <Input.TextArea placeholder="请输入受影响的系统" maxLength={2000} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item name="impactOnBusiness" label="割接影响的业务">
                                        <Input.TextArea placeholder="请输入割接影响的业务" maxLength={2000} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="割接总结" name="cutoverSummary" rules={[{ required: true, message: '割接总结不能为空' }]}>
                                        <Input.TextArea placeholder="请输入割接总结" maxLength={200} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="附件" name="attachment">
                                        <FormUpload
                                            accept=".ppt, .pptx, .doc, .docx, .xls, .xlsx, .zip"
                                            messageText="附件支持上传支持上传office文档和压缩包；"
                                            {...itemConfig}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </section>
                </Spin>
            </Modal>
        </>
    );
};

export default BuModal;
