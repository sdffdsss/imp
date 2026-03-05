import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import React, { FC, useState, useEffect, useMemo } from 'react';
import { Button, Form, Modal, Input, Row, Col, Select, DatePicker, message, Spin } from 'oss-ui';
import { convertFileData, convertParamsFileData, disabledDate, disabledTime, formatOption } from '../../../util';
import { MODAL_TYPE, MODAL_TYPE_NAME, ALL_ENUMS, ActionType, YES_NO_SHOW_ON_SCREEN } from '../../../type';
import { getCutoverDetail, postCutoverInsert, postCutoverUpdate } from '../../../api';
import WorkOrderModal from '../workorder-modal';
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
    const [orderVisible, setOrderVisible] = useState<boolean>(false);

    // 这里统一修改属性
    const itemConfig = {
        // 查看下禁止编辑其他皆可编辑
        disabled: modalType === MODAL_TYPE.SEARCH,
    };

    const getDetail = async (id) => {
        try {
            setLoading(true);
            const res = await getCutoverDetail({
                id,
            });
            if (res.code === 200) {
                const data = {
                    ...res.data,
                    attachment: convertFileData(res?.data?.attachmentList),
                    createTime: res?.data?.createTime && moment(res.data.createTime),
                    cutoverStartTime: res?.data?.cutoverStartTime && moment(res.data.cutoverStartTime),
                    cutoverEndTime: res?.data?.cutoverEndTime && moment(res.data.cutoverEndTime),
                    cutoverProfession: res.data.cutoverProfession?.toString(),
                    cutoverClassification: res.data.cutoverClassification?.toString(),
                    operateLevel: res.data.operateLevel?.toString(),
                    cutoverFinishStatus: res.data.cutoverFinishStatus?.toString(),
                    isEffectBusiness: res.data.isEffectBusiness?.toString(),
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
            getDetail(openId);
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
                attachment: values?.attachment?.length ? convertParamsFileData(values.attachment) : undefined,
                cutoverStartTime: values?.cutoverStartTime && moment(values.cutoverStartTime).format('YYYY-MM-DD HH:mm:ss'),
                cutoverEndTime: values?.cutoverEndTime && moment(values.cutoverEndTime).format('YYYY-MM-DD HH:mm:ss'),
                createTime: moment(values.cutoverEndTime).format('YYYY-MM-DD HH:mm:ss'),
                cutoverFinishStatus: values?.cutoverFinishStatus == undefined ? null : values?.cutoverFinishStatus,
                dataProvince: provinceId,
                professionType: '85',
                provinceId,
            };
            delete params.createTime; // 创建时间后端自动生成前端无需传参
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

    const openWorkModal = () => {
        setOrderVisible(true);
    };
    const onStartOk = (_, value) => {
        const endTime = form.getFieldValue('cutoverEndTime');

        if (value && endTime) {
            if (value.isAfter(endTime)) {
                return Promise.reject(new Error('割接开始时间不能大于割接结束时间'));
            }
        }
        return Promise.resolve();
    };
    const onEndOk = (_, value) => {
        const startTime = form.getFieldValue('cutoverStartTime');

        if (value && startTime) {
            if (value.isBefore(startTime)) {
                return Promise.reject(new Error('割接结束时间不能小于割接开始时间'));
            }
        }
        return Promise.resolve();
    };
    const workorderCallback = async (value) => {
        try {
            setLoading(true);
            const res = await getCutoverDetail({
                id: value.id,
            });
            if (res.code === 200) {
                const data = {
                    ...res.data,
                    attachment: convertFileData(res?.data?.attachmentList),
                    cutoverStartTime: res?.data?.cutoverStartTime && moment(res.data.cutoverStartTime),
                    cutoverEndTime: res?.data?.cutoverEndTime && moment(res.data.cutoverEndTime),
                };
                delete data.createTime; // 创建时间需要保持原来的

                const formParams = {
                    ...data,
                    cutoverProfession: data.cutoverProfession?.toString(),
                    cutoverClassification: data.cutoverClassification?.toString(),
                    operateLevel: data.operateLevel?.toString(),
                    cutoverFinishStatus: data.cutoverFinishStatus?.toString(),
                    isEffectBusiness: data.isEffectBusiness?.toString(),
                };

                form.setFieldsValue(formParams);
            }
        } finally {
            setLoading(false);
        }
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
    const formInitialValues = useMemo(() => {
        const initData = {
            cutoverProfession: '1',
            cutoverClassification: '1',
            operateLevel: '1',
            creator: userName,
            recordSource: '2',
            isEffectBusiness: '0',
        };

        return initData;
    }, [userName, enums.groupSourceEnum]);

    return (
        <>
            <WorkOrderModal visible={orderVisible} setVisible={setOrderVisible} okCallback={workorderCallback} provinceId={provinceId} />
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
                    <header className={style.header}>
                        {modalType !== MODAL_TYPE.SEARCH && (
                            <Button type="primary" onClick={openWorkModal}>
                                复制工单
                            </Button>
                        )}
                    </header>
                    <section className={style.content}>
                        <Form form={form} onFinish={onFinish} initialValues={formInitialValues}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label="割接主题" name="theme" rules={[{ required: true, message: '请输入割接主题!' }]}>
                                        <Input placeholder="请输入割接主题" maxLength={200} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="割接平台" name="cutoverPlatform" rules={[{ required: true, message: '请输入割接平台!' }]}>
                                        <Input placeholder="请输入割接平台" maxLength={200} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="大区省份" name="regionProvince" rules={[{ required: true, message: '请输入大区省份!' }]}>
                                        <Input placeholder="请输入大区省份" maxLength={100} {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="割接开始时间"
                                        name="cutoverStartTime"
                                        rules={[{ required: true, message: '请选择割接开始时间!' }, { validator: onStartOk }]}
                                    >
                                        <DatePicker
                                            placeholder="请选择割接开始时间"
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            disabledDate={(current) => disabledDate(current, undefined, form.getFieldValue('cutoverEndTime'))}
                                            disabledTime={(current) => disabledTime(current, undefined, form.getFieldValue('cutoverEndTime'))}
                                            {...itemConfig}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="割接结束时间"
                                        name="cutoverEndTime"
                                        rules={[{ required: true, message: '请选择割接结束时间!' }, { validator: onEndOk }]}
                                    >
                                        <DatePicker
                                            placeholder="请选择割接结束时间"
                                            disabledDate={(current) => disabledDate(current, form.getFieldValue('cutoverStartTime'), undefined)}
                                            disabledTime={(current) => disabledTime(current, form.getFieldValue('cutoverStartTime'), undefined)}
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            {...itemConfig}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="割接专业" name="cutoverProfession">
                                        <Select placeholder="请输入割接专业" options={enums.cutoverProfessionEnum} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="割接分类" name="cutoverClassification">
                                        <Select placeholder="请输入割接分类" options={enums.cutoverClassificationEnum} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="操作级别" name="operateLevel">
                                        <Select placeholder="请输入操作级别" options={enums.operateLevelEnum} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="是否影响业务" name="isEffectBusiness">
                                        <Select placeholder="请输入是否影响业务" options={enums.isEffectBusinessEnum} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="操作人" name="operator">
                                        <Input placeholder="请输入操作人" maxLength={100} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="操作人联系电话"
                                        name="operatorPhoneNumber"
                                        rules={[{ pattern: new RegExp(/^1[3-9]\d{9}(,1[3-9]\d{9})*$/, 'g'), message: '请输入正确的手机号' }]}
                                        validateTrigger={['onBlur', 'onSubmit']}
                                    >
                                        <Input placeholder="请输入操作人联系电话" maxLength={100} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="记录来源" name="recordSource">
                                        <Select placeholder="请输入记录来源" options={enums.recordSourcePlatformEnum} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="工单编号" name="sheetNo" rules={[{ required: true, message: '请输入工单编号!' }]}>
                                        <Input placeholder="请输入工单编号" {...itemConfig} maxLength={100} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="工程预约" name="projectAppointment">
                                        <Input placeholder="请输入工程预约" maxLength={100} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="割接是否完成" name="cutoverFinishStatus">
                                        <Select
                                            placeholder="请输入割接割接是否完成"
                                            allowClear
                                            options={enums.cutoverFinishStatusEnum}
                                            {...itemConfig}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="cutoverLocation" label="割接地点">
                                        <Input placeholder="请输入割接地点" maxLength={200} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="割接确认人" name="cutoverAckMan">
                                        <Input placeholder="请输入割接确认人" maxLength={100} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="创建人" name="creator">
                                        <Input placeholder="请输入创建人" disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="是否展示在大屏"
                                        name="isShowOnBigScreen"
                                        rules={[{ required: true, message: '请选择是否展示在大屏!' }]}
                                    >
                                        <Select placeholder="请选择是否展示在大屏" options={YES_NO_SHOW_ON_SCREEN} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="割接原因描述" name="cutoverReasonDesc">
                                        <Input.TextArea placeholder="请输入割接原因描述" maxLength={1000} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="业务影响描述" name="businessEffectDesc">
                                        <Input.TextArea placeholder="请输入业务影响范围" maxLength={1000} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="告警情况" name="alarmSituation">
                                        <Input.TextArea placeholder="请输入自身系统或周边系统告警量" maxLength={1000} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="割接总结" name="cutoverSummary" rules={[{ required: true, message: '割接总结不能为空' }]}>
                                        <Input.TextArea placeholder="请输入割接总结" maxLength={200} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="备注" name="notes">
                                        <Input.TextArea placeholder="失败原因，割接需关注的信息等" maxLength={1000} rows={4} {...itemConfig} />
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
