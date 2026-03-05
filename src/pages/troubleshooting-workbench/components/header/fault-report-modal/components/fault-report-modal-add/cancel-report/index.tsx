import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Row, Col, Checkbox, Input, Space, Button } from 'oss-ui';
import html2canvas from 'html2canvas';
import useLoginInfoModel from '@Src/hox';
import FormUpload from '../../../../../../../fault-report/components/form-upload';
import './index.less';

const cancelList = [
    {
        label: '告警数据问题',
        value: '告警数据问题',
    },
    {
        label: '资源数据问题',
        value: '资源数据问题',
    },
    {
        label: '本地网管故障',
        value: '本地网管故障',
    },
];
const FaultReportModal = (props, ref) => {
    const login = useLoginInfoModel();
    const [textareaValue, setTextareaValue] = useState('');
    const [textAreaVisible, setTextAreaVisible] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [form] = Form.useForm();

    const getScreenShoot = async () => {
        const dom = document.getElementById('root');
        const [svg1, svg2] = document.body.childNodes;
        if (svg1) {
            (svg1 as SVGAElement)?.setAttribute('data-html2canvas-ignore', '');
        }
        if (svg2) {
            (svg2 as SVGAElement)?.setAttribute('data-html2canvas-ignore', '');
        }
        console.time('创建时间');
        const canvas = await html2canvas(dom as HTMLDivElement, {
            logging: false,
        });
        console.timeEnd('创建时间');
        console.time('转换时间');
        const url = canvas.toDataURL('image/png');
        console.timeEnd('转换时间');
        return url;
    };
    const switchDom = () => {
        return new Promise((resolve) => {
            setTextAreaVisible(false);
            resolve(true);
        });
    };
    const cancelFault = () => {
        setBtnLoading(true);
        const fileParams = form.getFieldValue('uploudFiles')?.map((el) => {
            return {
                folderName: el.folderName,
                originalFileName: el.originalFileName,
                fileSessionId: el.fileSessionId,
            };
        });
        switchDom().then(() => {
            getScreenShoot().then((url) => {
                form.validateFields()
                    .then((res) => {
                        setBtnLoading(false);
                        props.cancelFaultInfoFunc({ ...res, uploudFiles: fileParams, deptName: login.userName, screenShoot: url });
                    })
                    .catch(() => {
                        setTextAreaVisible(true);
                    });
            });
        });
    };

    useImperativeHandle(ref, () => {
        return {
            cancelTextAreaVisible() {
                setTextAreaVisible(true);
            },
        };
    });
    return (
        <div className="cancel-report" id="cancel-report">
            <Form name="validate_other" form={form}>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="取消原因"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 15 }}
                            name="cancelCause"
                            rules={[{ required: true, message: '请选择取消原因！' }]}
                        >
                            <Checkbox.Group onChange={() => {}}>
                                {cancelList.map((item) => {
                                    return <Checkbox value={item.value}>{item.label}</Checkbox>;
                                })}
                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="取消详情"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 15 }}
                            name="cancelDetail"
                            rules={[{ required: true, message: '请填写具体的取消上报原因，并提供正确的数据' }]}
                        >
                            {textAreaVisible ? (
                                <Input.TextArea
                                    placeholder="请填写具体的取消上报原因，并提供正确的数据"
                                    autoSize={{ minRows: 6 }}
                                    maxLength={1000}
                                    value={textareaValue}
                                    onChange={(e) => setTextareaValue(e.target.value)}
                                />
                            ) : (
                                <div
                                    className={`${
                                        props.isIframe
                                            ? 'div-2-textarea-wireless'
                                            : props.theme === 'white'
                                            ? 'div-2-textarea-white'
                                            : 'div-2-textarea'
                                    }`}
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{ __html: textareaValue.replace(/(\n|\r|\r\n)/g, '<br />') }}
                                    placeholder="请填写具体的取消上报原因，并提供正确的数据"
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="附件" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} name="uploudFiles">
                            <FormUpload />
                        </Form.Item>
                    </Col>
                    <Col span={2} offset={11}>
                        <Form.Item>
                            <Space>
                                <Button key="back" onClick={() => props?.setVisible(false)} type="ghost">
                                    取消
                                </Button>
                                <Button key="ok" onClick={cancelFault} type="primary" disabled={btnLoading}>
                                    确定
                                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};
export default forwardRef(FaultReportModal);
