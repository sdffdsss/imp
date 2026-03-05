import React, { PureComponent } from 'react';
import DictSelect from '@Components/dict-select';
import { Select } from 'oss-ui';
import CustomModalFooter from '@Components/custom-modal-footer';
import { Modal, Form, Input, Spin, Button, message } from 'oss-ui';
import { addNewAlarmAdvice, editNewAlarmAdvice } from '../api';
import { _ } from 'oss-web-toolkits';

const { TextArea } = Input;

class index extends PureComponent {
    experiencesForm = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            spinning: false,
        };
    }

    get provinceName() {
        const { provinceId, provincesList, editRow } = this.props;
        if (editRow && !_.isEmpty(editRow)) {
            return editRow.provinceName;
        }
        const target = provincesList.find((item) => item.value === provinceId);
        return target ? target.label : '';
    }

    componentDidMount() {
        const { editRow, jumpParams } = this.props;
        if (editRow && !_.isEmpty(editRow)) {
            const { vendorId = '', netWorkTop = '', objectClass = '', alarmTitle = '', alarmAdvice = '' } = editRow;
            const params = { vendorId, netWorkTop, objectClass, alarmTitle, alarmAdvice };
            this?.experiencesForm?.current?.setFieldsValue(params);
            return;
        }
        if (jumpParams) {
            const params = {
                ...jumpParams,
                vendorId: jumpParams.vendorId && Number(jumpParams.vendorId),
                netWorkTop: jumpParams.netWorkTop && Number(jumpParams.netWorkTop),
                objectClass: jumpParams.objectClass && Number(jumpParams.objectClass),
            };
            this?.experiencesForm?.current?.setFieldsValue(params);
            return;
        }
        this.experiencesForm.current?.resetFields();
    }

    /**
     * @description: 点击保存
     * @param n*o
     * @return n*o
     */

    handleSave = (handlers) => {
        const { editRow, jumpParams } = this.props;
        this.experiencesForm.current?.validateFields().then((values) => {
            const params = {
                ...values,
                vendorId: values.vendorId && Number(values.vendorId),
                netWorkTop: values.netWorkTop && Number(values.netWorkTop),
                objectClass: values.objectClass && Number(values.objectClass),
            };
            this.setState(
                {
                    spinning: true,
                },
                () => {
                    if (editRow && !_.isEmpty(editRow)) {
                        this.editAlarmAdvice(editRow.id, params, handlers);
                    } else if (jumpParams && Object.keys(jumpParams).length > 0 && jumpParams?.id !== null && jumpParams?.id !== undefined) {
                        this.editAlarmAdvice(jumpParams.id, params, handlers);
                    } else {
                        this.addAlarmAdvice(params, handlers);
                    }
                },
            );
        });
    };

    /**
     * @description: 添加新告警经验
     * @param {*} params
     * @return n*o
     */

    addAlarmAdvice = async (params, handlers) => {
        const { provinceId, login } = this.props;
        const data = {
            ...params,
            provinceId,
            createUserId: Number(login.userId),
        };
        const res = await addNewAlarmAdvice(data, handlers);
        if (res.code === 200) {
            message.success('保存成功');
        } else {
            message.error(res.message);
        }
        this.setState(
            {
                spinning: false,
            },
            () => {
                this.props.okCallback();
            },
        );
    };

    /**
     * @description: 编辑新告警经验
     * @param {*} params
     * @return n*o
     */
    editAlarmAdvice = async (id, params, handlers) => {
        const { alarmAdvice } = params;
        const data = { alarmAdvice };
        const res = await editNewAlarmAdvice(id, data, handlers);
        if (res.code === 200) {
            message.success('保存成功');
        } else {
            message.error(res.message);
        }
        this.setState(
            {
                spinning: false,
            },
            () => {
                this.props.okCallback();
            },
        );
    };

    render() {
        const { handleCancel, jumpParams, editRow, alarmProvincesList, alarmProvinceId, modalType, editModalVisible, login, provinceId } = this.props;
        const { spinning } = this.state;
        const isView = modalType === 'view';
        const isEdit = modalType === 'edit';
        const isJumpEdit = jumpParams && Object.keys(jumpParams).length > 0 && jumpParams?.id !== null && jumpParams?.id !== undefined;
        const overStep = !(login?.userProvinceId === provinceId);
        // const isAdd=!isEdit;
        return (
            <Modal
                width={600}
                title={isView ? '查看' : '新建/编辑'}
                visible={editModalVisible}
                centered
                closable
                onCancel={handleCancel}
                footer={
                    isView ? (
                        <div style={{ textAlign: 'center' }}>
                            <Button onClick={handleCancel}>取消</Button>
                        </div>
                    ) : (
                        <CustomModalFooter
                            authKey={editRow && !_.isEmpty(editRow) ? 'experiencesManage:edit' : 'experiencesManage:add'}
                            onCancel={handleCancel}
                            onOk={this.handleSave}
                        />
                    )
                }
            >
                <Spin spinning={spinning} tip="数据保存中">
                    <Form labelAlign="right" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={this.experiencesForm}>
                        <Form.Item label="数据省份">
                            <Input disabled value={this.provinceName} />
                        </Form.Item>
                        <Form.Item
                            name="alarmProvinceId"
                            label="告警省份"
                            rules={[{ required: true, message: '请选择告警省份' }]}
                            initialValue={
                                editRow && !_.isEmpty(editRow)
                                    ? editRow.alarmProvinceId.toString()
                                    : jumpParams?.alarmProvinceId == null
                                    ? alarmProvinceId
                                    : jumpParams?.alarmProvinceId
                            }
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                disabled={
                                    isView || isEdit || overStep || (isJumpEdit && (jumpParams.alarmProvinceId != null || alarmProvinceId != null))
                                }
                            >
                                {alarmProvincesList.map((item) => {
                                    return (
                                        <Select.Option value={item.value} key={item.value} label={item.label}>
                                            {item.label}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name="vendorId" label="设备厂家" rules={[{ required: true, message: '请选择设备厂家' }]}>
                            <DictSelect
                                dictName="vendor_id"
                                disabled={isView || isEdit || overStep || (isJumpEdit && jumpParams.vendorId != null)}
                                placeholder="请选择设备厂家"
                                id="key"
                                label="value"
                                pageSize={99999}
                            />
                        </Form.Item>
                        <Form.Item name="netWorkTop" label="专业" rules={[{ required: true, message: '请选择专业' }]}>
                            <DictSelect
                                dictName="professional_type"
                                disabled={isView || isEdit || overStep || (isJumpEdit && jumpParams.netWorkTop != null)}
                                placeholder="请选择专业"
                                id="key"
                                label="value"
                                pageSize={99999}
                            />
                        </Form.Item>
                        <Form.Item name="objectClass" label="设备类型" rules={[{ required: true, message: '请选择设备类型' }]}>
                            <DictSelect
                                dictName="eqp_object_class"
                                disabled={isView || isEdit || overStep || (isJumpEdit && jumpParams.objectClass != null)}
                                placeholder="请选择设备类型"
                                id="key"
                                label="value"
                                pageSize={99999}
                            />
                        </Form.Item>
                        <Form.Item
                            label="告警标题"
                            name="alarmTitle"
                            rules={[
                                { required: true, message: '请输入告警标题' },
                                { max: 255, message: '告警标题不可超过255个字符' },
                            ]}
                        >
                            <Input
                                disabled={isView || isEdit || overStep || (isJumpEdit && jumpParams.alarmTitle != null)}
                                placeholder="请输入告警标题"
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item
                            name="alarmAdvice"
                            label="告警处理建议"
                            rules={[
                                { required: true, message: '请输入告警处理建议' },
                                { max: 2000, message: '告警处理建议不可超过2000个字符' },
                            ]}
                        >
                            <TextArea allowClear disabled={isView || overStep} placeholder="请输入告警处理建议" />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default index;
