import moment from 'moment';
import React, { FC, useState, useEffect } from 'react';
import { Button, Form, Modal, Input, Row, Col, Select, message, Spin } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { MODAL_TYPE, MODAL_TYPE_NAME, ActionType } from '../../../type';
import { getCutoverDetail, postCutoverInsert, postCutoverUpdate } from '../../../api';
import style from './style.module.less';

interface Props {
    visible: boolean;
    modalType: MODAL_TYPE;
    openId: number | string | null;
    setVisible: (data: boolean) => void;
    tableRef: React.MutableRefObject<ActionType | undefined>;
    handleSaveCheck?: Function;
}

const BuModal: FC<Props> = (props) => {
    const { visible, modalType, openId, tableRef, setVisible } = props;

    const [form] = Form.useForm<Record<string, any>>();
    const { userName } = useLoginInfoModel();

    const [loading, setLoading] = useState<boolean>(false);
    const [subLoading, setSubLoading] = useState<boolean>(false);

    const getDetail = async () => {
        setLoading(true);
        try {
            const res = await getCutoverDetail({
                id: openId,
            });
            if (res.code === 200) {
                const data = {
                    ...res.data,
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

    const onSave = async () => {
        if (props.handleSaveCheck) {
            const checkResult = await props.handleSaveCheck();

            if (!checkResult) {
                return;
            }
        }
        form.submit();
    };

    const onFinish = async (values: any) => {
        try {
            setSubLoading(true);
            const params = {
                ...values,
                modifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                professionType: 70,
                modifyUser: userName,
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
                width={800}
                bodyStyle={{ marginRight: 20 }}
                confirmLoading={loading}
            >
                <Spin spinning={loading}>
                    <section className={style.content}>
                        <Form form={form} onFinish={onFinish} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item hidden name="id">
                                        <Input disabled />
                                    </Form.Item>
                                    <Form.Item required labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="割接单号" name="sheetNo">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item required label="大区" name="cutoverLocation">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item required label="割接时间" name="cutoverEndTime">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        required
                                        label="是否展示在大屏"
                                        name="isShowOnBigScreen"
                                        rules={[{ required: true, message: '请选择是否展示在大屏' }]}
                                    >
                                        <Select
                                            disabled={modalType === MODAL_TYPE.SEARCH}
                                            options={[
                                                { label: '是', value: 1 },
                                                { label: '否', value: 0 },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        required
                                        label="割接状态"
                                        name="isCutoverFinish"
                                        rules={[{ required: true, message: '请选择割接状态' }]}
                                    >
                                        <Select
                                            disabled={modalType === MODAL_TYPE.SEARCH}
                                            options={[
                                                { label: '未完成', value: 0 },
                                                { label: '已完成', value: 1 },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        required
                                        rules={[{ required: true, message: '请输入割接总结' }]}
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        label="割接总结"
                                        name="cutoverSummary"
                                    >
                                        <Input.TextArea
                                            disabled={modalType === MODAL_TYPE.SEARCH}
                                            maxLength={200}
                                            autoSize={{ minRows: 4 }}
                                            showCount
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
