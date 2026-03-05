import React, { FC } from 'react';
import { Button, Form, Modal } from 'oss-ui';
import FormUpload from './form-upload';

interface Props {
    visible: boolean;
    flagId: number | string | null;
    setVisible: (data: boolean) => void;
    handleSaveCheck?: Function;
    wrapClassName?: string;
}

const Index: FC<Props> = (props) => {
    const { visible, setVisible, wrapClassName, flagId } = props;

    const [form] = Form.useForm<Record<string, any>>();

    const handleCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    const footer = (
        <div>
            <Button onClick={handleCancel}>关闭</Button>
        </div>
    );

    return (
        <>
            <Modal
                title="上传附件"
                visible={visible}
                onCancel={handleCancel}
                footer={footer}
                width={wrapClassName ? 1100 : 900}
                bodyStyle={{ marginRight: 20 }}
                wrapClassName={wrapClassName}
            >
                <Form.Item label="" name="attachment">
                    <FormUpload
                        flagId={flagId}
                        accept=".ppt, .pptx, .doc, .docx, .xls, .xlsx, .zip"
                        messageText="附件支持上传支持上传office文档和压缩包；"
                        onSuccess={(data, file) => {
                            form.setFieldsValue({
                                attachment: data,
                            });
                        }}
                    />
                </Form.Item>
            </Modal>
        </>
    );
};

export default Index;
