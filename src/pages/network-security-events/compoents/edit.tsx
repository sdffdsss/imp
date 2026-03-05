import React, { useEffect } from 'react';
import { Form, Input, Modal, message, Select, DatePicker, Row, Col, Button, Space } from 'oss-ui';
import { _ } from 'oss-web-toolkits';

import CustomModalFooter from '@Components/custom-modal-footer';
import moment from 'moment';
import { api, isLegalLength, gridOptions } from '../utils';

const Edit = (props) => {
    const { editRow, editType, loginInfo, dic, visible, onClose, refreshTable } = props;
    const { professionDic, unsealFlagDic, provinceDic } = dic;
    const { frameInfo, userId, zoneId, zoneName } = loginInfo;
    const [form] = Form.useForm();
    //
    const onInnerClose = () => {
        if (form !== undefined) {
            form.resetFields();
        }
        onClose();
    };

    // 新增/编辑/复制 入库处理
    const onSave = () => {
        if (form === undefined) {
            onClose();
            return;
        }
        form.validateFields().then((values) => {
            const { pluggingTime, ...record } = values;
            record.pluggingTime = pluggingTime.format('YYYY-MM-DD HH:mm:ss');
            record.professionName = (professionDic || []).find((item) => item.value === record.professionId).label;

            if (editType === 'add') {
                record.createUserId = userId; // 增加时有
                record.provinceId = zoneId;
                record.provinceName = zoneName;

                api.addRecord(record)
                    .then((result) => {
                        const { code } = result;
                        if (code === 200) {
                            refreshTable();
                        }
                        onInnerClose();
                        message.success('记录新建成功');
                    })
                    .catch((e) => {
                        message.error(e);
                    });
            } else {
                record.id = editRow.id;
                record.updateUserId = userId; // 修改时有

                api.editRecord(record)
                    .then((result) => {
                        const { code } = result;
                        if (code === 200) {
                            refreshTable();
                        }
                        onInnerClose();
                        message.success('记录更新成功');
                    })
                    .catch((e) => {
                        message.error(e);
                    });
            }
        });
    };

    useEffect(() => {
        if (!_.isEmpty(editRow)) {
            const { pluggingTime, provinceId, ...record } = editRow;
            record.pluggingTime = moment(pluggingTime);
            record.provinceId = provinceId.toString();
            form.setFieldsValue(record);
        } else {
            // add 情况，为表单赋初始值
            form.setFieldsValue({
                provinceId: zoneId, // 默认当前账号省份，不可修改
                professionId: '9999', // 默认互联网
                grid: 'china169', //  默认china169
                unsealFlag: '否', // 默认否
            });
        }
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editType, editRow]);
    const fromItemDisabled = editType === 'look';
    const fromProps = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        name: 'networkSecurity',
        form,
    };

    const titleMap = { add: '新增', edit: '编辑', look: '查看' };
    const modalFooterRender = () => {
        return editType === 'look' ? (
            <Button onClick={onInnerClose}>关闭</Button>
        ) : (
            <Space>
                <Button onClick={onSave} type="primary">
                    确定
                </Button>
                <Button onClick={onInnerClose}>取消</Button>
            </Space>
        );
    };
    return (
        <Modal
            destroyOnClose
            maskClosable={false}
            width={800}
            title={titleMap[`${editType}`]}
            visible={visible}
            centered
            getContainer={frameInfo?.container}
            onCancel={onInnerClose}
            footer={<CustomModalFooter render={modalFooterRender} />}
        >
            <Form {...fromProps}>
                <Row gutter={[16, 8]}>
                    <Col span={11}>
                        <Form.Item
                            name="provinceId"
                            label="省份"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Select options={provinceDic} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item
                            name="professionId"
                            label="专业"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Select options={professionDic?.filter((item) => item.label !== '全部')} disabled={fromItemDisabled} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 8]}>
                    <Col span={11}>
                        <Form.Item
                            name="pluggingTime"
                            label="封堵时间"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" disabled={fromItemDisabled} />
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item
                            name="grid"
                            label="所属网格"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                                {
                                    whitespace: true,
                                    message: '不能为空',
                                },
                            ]}
                        >
                            <Select options={gridOptions} disabled={fromItemDisabled} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 8]}>
                    <Col span={11}>
                        <Form.Item
                            name="pluggingIpSource"
                            label="封堵ip来源"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入',
                                },
                                {
                                    whitespace: true,
                                    message: '不能为空',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (!isLegalLength(value, 200)) {
                                            callback('输入封堵ip来源，100个汉字以内');
                                        } else {
                                            callback();
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input disabled={fromItemDisabled} />
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item
                            name="pluggingMan"
                            label="封堵人"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入',
                                },
                                {
                                    whitespace: true,
                                    message: '不能为空',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (!isLegalLength(value, 30)) {
                                            callback('输入封堵人信息，15个汉字以内');
                                        } else {
                                            callback();
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input disabled={fromItemDisabled} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 8]}>
                    <Col span={11}>
                        <Form.Item
                            name="unsealFlag"
                            label="是否解封"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Select options={unsealFlagDic} disabled={fromItemDisabled} />
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item
                            name="operator"
                            label="所属运营商"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入',
                                },
                                {
                                    whitespace: true,
                                    message: '不能为空',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (!isLegalLength(value, 40)) {
                                            callback('输入所属运营商信息，20个汉字以内');
                                        } else {
                                            callback();
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input disabled={fromItemDisabled} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 8]}>
                    <Col span={22}>
                        <Form.Item
                            name="pluggingIp"
                            label="被封堵IP"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入',
                                },
                                {
                                    whitespace: true,
                                    message: '不能为空',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (!isLegalLength(value, 600)) {
                                            callback('输入被封堵IP信息，300个汉字以内');
                                        } else {
                                            callback();
                                        }
                                    },
                                },
                            ]}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                        >
                            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} disabled={fromItemDisabled} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
export default Edit;
