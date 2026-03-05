import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import { FormUpload } from '@Pages/components';
import React, { FC, useState, useEffect, useMemo } from 'react';
import { getProvince } from '@Common/utils/getProvince';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { Button, Form, Modal, Input, Row, Col, Select, DatePicker, message, Spin } from 'oss-ui';
import { MODAL_TYPE, MODAL_TYPE_NAME, ALL_ENUMS, YES_NO_OPTION, MAJOR_ENUM, ActionType, YES_NO_SHOW_ON_SCREEN } from '../../../type';
import { formatOption, getInitialProvince, convertFileData, convertParamsFileData } from '../../../util';
import { getCutoverDetail, postCutoverInsert, postCutoverUpdate, getRegionList } from '../../../api';
import style from './style.module.less';

interface Props {
    visible: boolean;
    enums: ALL_ENUMS;
    modalType: MODAL_TYPE;
    openId: number | string | null;
    setVisible: (data: boolean) => void;
    tableRef: React.MutableRefObject<ActionType | undefined>;
    handleSaveCheck?: Function;
    provinceList?: any;
}

const BuModal: FC<Props> = (props) => {
    const { visible, modalType, setVisible, enums, openId, tableRef, provinceList, wrapClassName } = props;
    const { currentZone, userId, userName, provinceId, userInfo } = useLoginInfoModel();
    const [form] = Form.useForm<Record<string, any>>();

    const [cityList, setCityList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [subLoading, setSubLoading] = useState<boolean>(false);
    const [provinceListOther, setProvinceListOther] = useState<any>([]);

    // 这里统一修改属性
    const itemConfig = {
        // 查看下禁止编辑其他皆可编辑
        disabled: modalType === MODAL_TYPE.SEARCH,
    };

    const getDefaultMenu = async () => {
        const res = await getRegionList({
            creator: userId,
            parentRegionId: getInitialProvince(currentZone.zoneId, userInfo),
        });
        // if (res.code === 200) {
        setCityList(res);
        // }
    };
    const getCityList = async (val) => {
        const res = await getRegionList({
            creator: userId,
            parentRegionId: val,
        });
        form.setFieldsValue({
            regionId: undefined,
        });
        // if (res.code === 200) {
        setCityList(res);
        // }
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
                    nmsType: res?.data?.nmsType && Number(res?.data?.nmsType),
                    recordSource: res?.data?.recordSource && Number(res?.data?.recordSource),
                    createTime: res?.data?.createTime && moment(res.data.createTime),
                    cutoverStartTime: res?.data?.cutoverStartTime && moment(res.data.cutoverStartTime),
                    cutoverEndTime: res?.data?.cutoverEndTime && moment(res.data.cutoverEndTime),
                    recordTime: res?.data?.recordTime && moment(res.data.recordTime),
                    alarmClearTime: res?.data?.alarmClearTime && moment(res.data.alarmClearTime),
                    attachment: convertFileData(res?.data?.attachmentList),
                };
                // if (!res?.data?.provinceId) {
                //     data.provinceId = undefined;
                // }
                setCityList([{ regionId: res?.data?.regionId, regionName: res?.data?.regionName }]);
                form.setFieldsValue(data);
            }
        } finally {
            setLoading(false);
        }
    };
    const getProvinceList = async () => {
        const options = await getProvince();
        setProvinceListOther(options);
    };

    useEffect(() => {
        getDefaultMenu();
        getProvinceList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (openId && openId !== 0) {
            getDetail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openId]);

    const handleCancel = () => {
        setCityList([]);
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
                recordTime: values?.recordTime && moment(values.recordTime).format('YYYY-MM-DD HH:mm:ss'),
                alarmClearTime: values?.alarmClearTime && moment(values.alarmClearTime).format('YYYY-MM-DD HH:mm:ss'),
                dataProvince: provinceId,
                // provinceId: values?.provinceId || '',
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

    // 给表单项赋初始值
    const initialValue = useMemo(() => {
        return {
            // provinceId: Number(provinceId),
            professionType: MAJOR_ENUM.CORE,
            recorder: userName,
            recordTime: moment(),
            groupSource: enums.groupSourceEnum?.[0],
        };
    }, [enums.groupSourceEnum, userName]);

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
                        <Form form={form} onFinish={onFinish} initialValues={initialValue} labelCol={{ style: { width: 140 } }}>
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Form.Item
                                        label="操作开始时间"
                                        name="cutoverStartTime"
                                        rules={[{ required: true, message: '请选择操作开始时间!' }]}
                                    >
                                        <DatePicker
                                            placeholder="请选择操作开始时间"
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            {...itemConfig}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="操作结束时间"
                                        name="cutoverEndTime"
                                        rules={[{ required: true, message: '请选择操作结束时间!' }]}
                                    >
                                        <DatePicker
                                            placeholder="请选择操作结束时间"
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            {...itemConfig}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="网络类型" name="nmsType">
                                        <Select placeholder="请选择网络类型" options={formatOption(enums.nmsTypeEnum)} {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={0}>
                                    <Form.Item label="专业" name="professionType">
                                        <Select placeholder="请选择专业" disabled options={formatOption(enums.professionalEnum, [MAJOR_ENUM.CORE])} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="大区省份" name="provinceName">
                                        {/* <SelectCondition
                                            form={form}
                                            // mode="multiple"
                                            title="省份"
                                            id="key"
                                            label="value"
                                            dictName="province_id"
                                            searchName="province_id"
                                            // disabled
                                        /> */}
                                        <Input placeholder="请输入大区省份" maxLength={100} {...itemConfig} />
                                        {/* <Select placeholder="请选择" options={provinceListOther} onChange={(val) => getCityList(val)} allowClear /> */}
                                    </Form.Item>
                                </Col>

                                {/* 新建时需要下拉数据匹配 */}
                                {/* {modalType === MODAL_TYPE.BUILD && ( */}
                                <Col span={8}>
                                    <Form.Item
                                        name="regionName"
                                        label="省份地市"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: '请输入省份地市',
                                        //     },
                                        // ]}
                                    >
                                        {/* <SelectCondition
                                            cityList={cityList}
                                            title="地市"
                                            mode=""
                                            label="value"
                                            id="key"
                                            dictName="region_id"
                                            pageSize={2500}
                                            {...itemConfig}
                                        /> */}
                                        <Input placeholder="请输入省份地市" maxLength={100} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                {/* )} */}

                                {/* 编辑查看时直接反显不与下拉数据匹配 */}
                                {/* {modalType !== MODAL_TYPE.BUILD && (
                                    <Col span={8}>
                                        <Form.Item label="地市" name="regionName" required>
                                            <Input placeholder="请输入地市" maxLength={100} {...itemConfig} />
                                        </Form.Item>
                                    </Col>
                                )} */}

                                <Col span={8}>
                                    <Form.Item label="割接是否完成" name="isCutoverFinish">
                                        <Select placeholder="请选择割接是否完成" options={YES_NO_OPTION} {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item name="cutoverLocation" label="割接地点">
                                        <Input placeholder="请输入割接地点" maxLength={200} {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="值班人" name="dutyman">
                                        <Input placeholder="请输入值班人" maxLength={100} {...itemConfig} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="记录人" name="recorder" rules={[{ required: true, message: '请输入记录人!' }]}>
                                        <Input placeholder="请输入记录人" maxLength={100} disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="记录时间" name="recordTime">
                                        <DatePicker placeholder="请选择记录时间" showTime {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="记录来源" name="recordSource">
                                        <Select placeholder="请选择记录来源" options={formatOption(enums.recordSourceEnum)} {...itemConfig} />
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
                                    <Form.Item label="告警网管" name="alarmStation">
                                        <Input.TextArea placeholder="请输入告警网管" maxLength={2000} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="操作网元" name="operateNe">
                                        <Input.TextArea placeholder="请输入操作网元" maxLength={2000} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="操作内容" name="operateContent">
                                        <Input.TextArea placeholder="请输入操作内容" maxLength={2000} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="割接详情" name="cutoverContent" rules={[{ required: true, message: '割接详情不能为空' }]}>
                                        <Input.TextArea placeholder="请输入割接详情" maxLength={2000} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="割接总结" name="cutoverSummary" rules={[{ required: true, message: '割接总结不能为空' }]}>
                                        <Input.TextArea placeholder="请输入割接总结" maxLength={200} rows={4} {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="主要网管告警清除时间"
                                        name="alarmClearTime"
                                        // rules={[{ required: true, message: '主要网管告警清除时间不能为空' }]}
                                    >
                                        <DatePicker placeholder="请选择主要网管告警清除时间" showTime {...itemConfig} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="配合割接完成情况"
                                        name="coordinateSituation"
                                        // rules={[{ required: true, message: '配合割接完成情况不能为空' }]}
                                    >
                                        <Input.TextArea
                                            placeholder="如协助省公司拨测、帮助各省确认告警是否恢复等"
                                            maxLength={1000}
                                            rows={4}
                                            {...itemConfig}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="备注" name="notes">
                                        <Input.TextArea placeholder="割接失败原因" rows={4} {...itemConfig} />
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
