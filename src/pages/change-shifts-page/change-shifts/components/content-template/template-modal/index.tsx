import React, { useState } from 'react';
import './index.less';
import { Button, Form, Icon, Input, Modal } from 'oss-ui';

const TemplateModal = (props) => {
    const { form, state, onModalCancel, onOk } = props;
    const [tipVisible, setTipVisible] = useState(false);
    const onNamevalidator = (rule: any, val: string) => {
        const nameList = state.templateDataList.map((item) => item.templateName);
        if (val && val.length > 10) {
            return Promise.reject(new Error('长度不能超过10个字'));
        }
        if (nameList.includes(val) && state.modalType === 'add') {
            return Promise.reject(new Error('模板名称不能重复'));
        }
        return Promise.resolve();
    };
    const onTextAreavalidator = (rule: any, val: string) => {
        if ((val && val.length === 0) || val === undefined || val === '') {
            setTipVisible(true);
            return Promise.reject();
        }
        setTipVisible(false);

        return Promise.resolve();
    };
    const onTextAreaClear = () => {
        form.setFieldsValue({ templateContent: '' });
    };
    const onCancelClick = () => {
        onModalCancel();
        setTipVisible(false);
    };

    return (
        <Modal title="工作记录模板管理" visible={state.modalVisible} onCancel={onCancelClick} footer={null} width={832}>
            <div className="template-modal">
                <Form form={form} layout="horizontal">
                    <Form.Item
                        label="模板名称"
                        name="templateName"
                        rules={[{ required: true, message: '请输入模板名称' }, { validator: onNamevalidator }]}
                        wrapperCol={{ span: 5 }}
                    >
                        <Input placeholder="请输入模板名称" disabled={state.modalType === 'edit'} />
                    </Form.Item>
                    <div className="template-input-textarea">
                        <div className="input-header">
                            <span>
                                <span className="input-textarea-title">模板详情</span>
                                <span className="input-textarea-tip">（长度不超过600字）</span>
                                {tipVisible && <span className="input-textarea-tip danger">模板详情不能为空</span>}
                            </span>
                            <span onClick={onTextAreaClear}>
                                <Icon type="iconqingchu" className="clear-icon" />
                            </span>
                        </div>

                        <Form.Item name="templateContent" rules={[{ validator: onTextAreavalidator }]}>
                            <Input.TextArea style={{ height: 350, resize: 'none' }} showCount maxLength={600} />
                        </Form.Item>
                    </div>
                </Form>
                <div className="template-modal-footer">
                    <Button onClick={onCancelClick}>取消</Button>
                    <Button type="primary" onClick={onOk}>
                        确定
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
export default TemplateModal;
