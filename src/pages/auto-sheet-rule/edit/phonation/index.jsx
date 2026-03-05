import React, { useRef, useEffect } from 'react';
import { Checkbox, Switch, Form, Space, Row, Col, TimePicker, Button, Radio, Input, Upload, message } from 'oss-ui';
// import moment from 'moment';
// import request from '@Common/api';
import api from './api';
import { getEditValues, initialValues } from './util';
import { useEnvironmentModel } from '@Src/hox';

const playAlarmMap = [
    {
        label: '地市',
        value: 'region_name',
    },
    {
        label: '区县',
        value: 'city_name',
    },
    {
        label: '告警发声时间',
        value: 'event_time',
    },
    {
        label: '网元名称',
        value: 'eqp_label',
    },
    {
        label: '告警对象名称',
        value: 'ne_label',
    },
    {
        label: '告警标题',
        value: 'title_text',
    },
    {
        label: '网管告警级别',
        value: 'org_severity',
    },
    {
        label: '设备厂家',
        value: 'vendor_name',
    },
];
const DEFAULT_BASE_URL = 'uploadProducitonUrl'; // 生产上传接口
export default React.forwardRef((props, ref) => {
    const [form] = Form.useForm();
    const [audioSrc, setAudioSrc] = React.useState('');
    const [btnDisabled, setBtnDisabled] = React.useState(false);

    const uploadScripts = ({ file, onProgress, onError, onSuccess }) => {
        setBtnDisabled(true);
        const params = new FormData();
        params.append('momo', '音频');
        params.append('currentPath', '');
        params.append('audio', file);
        api.uploadScripts(
            params,
            (data) => {
                setBtnDisabled(false);
                if (data.success) {
                    createFileFlow(`${useEnvironmentModel.data.environment[`${DEFAULT_BASE_URL}`].direct}/${data.data.filePath}/${data.data.id}`);
                    // setAudioSrc(`${useEnvironmentModel.data.environment[`${DEFAULT_BASE_URL}`].direct}/${data.data.filePath}/${data.data.id}`);
                    form.setFieldsValue({
                        SoundPath: `${useEnvironmentModel.data.environment[`${DEFAULT_BASE_URL}`].direct}/${data.data.filePath}/${data.data.id}`,
                        FileName: data.data.filename,
                        FileExtension: file.name.split('.')[file.name.split('.').length - 1],
                    });
                    message.success('上传成功');
                } else {
                    onError(data.message);
                }
            },
            (error) => {
                setBtnDisabled(false);
                onError(error.message);
                return false;
            },
        );
    };
    const audioClick = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };
    const createFileFlow = (urls) => {
        request(null, {
            type: 'get',
            fullUrl: urls,
            showSuccessMessage: false,
            defaultErrorMessage: '导出失败，请检查服务',
            data: {},
            responseType: 'blob',
        }).then((ress) => {
            const blob = new Blob([ress], { type: 'application/vnd.ms-excel;charset=utf-8' });
            // 兼容不同浏览器的URL对象
            const url = window.URL || window.webkitURL || window.moxURL;
            // 创建下载链接
            const downloadHref = url.createObjectURL(blob);
            setAudioSrc(downloadHref);
        });
    };
    const setInitialValues = (modelType, initialValues, ref) => {
        if (!(modelType === 'new') && ref.current) {
            const editValues = getEditValues(initialValues);
            // setAudioSrc(editValues.SoundPath);
            createFileFlow(editValues.SoundPath);
            ref.current.setFieldsValue(editValues);
        }
    };
    useEffect(() => {
        setInitialValues(props.modelType, props.initialValues, ref);
    }, [props.initialValues, props.modelType, ref]);
    const audioRef = useRef();
    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作:</div>
            <Form initialValues={initialValues} form={form} ref={ref}>
                <Row>
                    <Col span={3} style={{ textAlign: 'right', lineHeight: '32px' }}>
                        启用时间<span style={{ margin: '0 8px 0 2px' }}>:</span>
                    </Col>
                    <Col span={21}>
                        <Row>
                            <Col span={2}>
                                <Form.Item name="IsValid" valuePropName="checked">
                                    <Switch checkedChildren="开" unCheckedChildren="关" size="small"></Switch>
                                </Form.Item>
                            </Col>
                            <Col span={22}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item
                                                name="Timeperiod"
                                                rules={[
                                                    {
                                                        validator: async (rule, val, callback) => {
                                                            const remark = getFieldValue('IsValid');
                                                            if (remark) {
                                                                if (!val) {
                                                                    throw new Error('不能为空');
                                                                }
                                                                if (val[0].format() === val[1].format()) {
                                                                    throw new Error('开始时间不能等于结束时间');
                                                                }
                                                            }
                                                        },
                                                    },
                                                ]}
                                            >
                                                <TimePicker.RangePicker format="HH:mm" disabled={!getFieldValue('IsValid')} />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Form.Item labelCol={{ span: 3 }} name="SoundFlag" label="发声方式">
                    <Radio.Group>
                        <Radio value={0}>播放发声文件</Radio>
                        {/* <Radio value={1}>播放告警</Radio> */}
                    </Radio.Group>
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        return getFieldValue('SoundFlag') === 0 ? (
                            <Form.Item wrapperCol={{ offset: 3 }}>
                                <Space>
                                    <span>声音文件:</span>
                                    <Form.Item
                                        noStyle
                                        name="FileName"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择声音文件',
                                            },
                                        ]}
                                    >
                                        <Input style={{ width: 120 }} disabled />
                                    </Form.Item>
                                    <Form.Item hidden noStyle name="SoundPath">
                                        <Input allowClear />
                                    </Form.Item>
                                    <Upload accept="audio/*" customRequest={uploadScripts} custom showUploadList={false}>
                                        <Button type="primary" disabled={btnDisabled}>
                                            选择文件
                                        </Button>
                                    </Upload>
                                    <Button onClick={audioClick}>试听</Button>
                                </Space>
                                <audio ref={audioRef} src={audioSrc}></audio>

                                <Form.Item hidden name="FileExtension">
                                    <Input allowClear></Input>
                                </Form.Item>
                            </Form.Item>
                        ) : (
                            <Form.Item
                                wrapperCol={{ offset: 3 }}
                                name="SoundText"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择播放告警字段',
                                    },
                                ]}
                            >
                                <Checkbox.Group options={playAlarmMap}></Checkbox.Group>
                            </Form.Item>
                        );
                    }}
                </Form.Item>
            </Form>
        </>
    );
});
