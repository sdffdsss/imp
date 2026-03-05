import React, { useRef, useEffect } from 'react';
import { Checkbox, Switch, Form, Space, Row, Col, TimePicker, Button, Radio, Input, Upload, message, Icon } from 'oss-ui';
import { getEditValues, initialValues } from './util';
import { useEnvironmentModel } from '@Src/hox';
import { uploadAudio } from '../../api';
import { _ } from 'oss-web-toolkits';
import constants from '@Src/common/constants';
import './index.less';
import request from '@Common/api';
import Field from '@ant-design/pro-field';

export default React.forwardRef((props, ref) => {
    const { mode = 'edit' } = props;
    const [form] = Form.useForm();
    const audioRef = useRef();
    const [audioSrc, setAudioSrc] = React.useState('');
    const [btnDisabled, setBtnDisabled] = React.useState(false);
    const [radioType, setRadioType] = React.useState(1);
    const [radioTextType, setRadioTextType] = React.useState(1);
    const [text, setText] = React.useState('');
    const playAlarmMap = useRef([
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
    ]);
    const DEFAULT_BASE_URL = 'uploadProducitonUrl'; // 生产上传接口
    const earPhone = `${constants.IMAGE_PATH}/earphone.png`;

    /**
     * @description: 上传音频文件
     * @param {*}
     * @return {*}
     */
    const uploadScripts = async (type, { file }) => {
        if (file.name.indexOf('mp3') === -1) {
            return message.error('上传失败，请上传mp3类型文件');
        }
        if (file.type.indexOf('audio') === -1) {
            return message.error('上传失败，请上传音频文件');
        }
        if (file.size / 1024 / 1024 > 3) {
            return message.error('上传失败，文件不能超过3M');
        }
        setBtnDisabled(true);
        const params = new FormData();
        params.append('momo', '音频');
        params.append('currentPath', '');
        params.append('audio', file);
        const data = await uploadAudio(params);
        setBtnDisabled(false);
        if (data.success) {
            const audioFileSrc = `${useEnvironmentModel.data.environment[`${DEFAULT_BASE_URL}`].direct}/${data?.data?.relationPath}/${
                data?.data?.filename
            }`;
            // setAudioSrc(audioFileSrc);
            createFileFlow(audioFileSrc);
            let formData = form.getFieldsValue();
            formData[`SoundPath_${type}`] = audioFileSrc;
            formData[`FileName_${type}`] = data?.data?.filename;
            formData[`FileExtension_${type}`] = file.name.split('.')[file.name.split('.').length - 1];
            form.setFieldsValue(formData);

            // form.setFieldsValue({
            //     SoundPath: audioFileSrc,
            //     FileName: data?.data?.filename,
            //     // 满足接口需要，需要文件扩展名
            //     FileExtension: file.name.split('.')[file.name.split('.').length - 1],
            // });
            message.success('上传成功');
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

    /**
     * @description: 点击播放
     * @param {*}
     * @return {*}
     */
    const audioClick = () => {
        if (!audioSrc) {
            message.error('未检测到音频文件');
            return;
        }
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    /**
     * 清除已选择的文件
     */
    const onClearFileClick = (type) => {
        const formData = form.getFieldsValue();
        formData[`SoundPath_${type}`] = '';
        formData[`FileName_${type}`] = '';
        formData[`FileExtension_${type}`] = '';
        form.setFieldsValue(formData);
    };

    /**
     * @description: 设置初始值
     * @param {*}
     * @return {*}
     */
    const setInitialValues = (modelType, values) => {
        if (!(modelType === 'new') && ref.current) {
            const editValues = getEditValues(values);
            ref.current.setFieldsValue(editValues);
            setShowMessage(form.getFieldValue(`SoundText_${radioTextType}`));
        }
    };

    useEffect(() => {
        setInitialValues(props.modelType, props.initialValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.initialValues, props.modelType]);

    useEffect(() => {
        // const editValues = getEditValues(props.initialValues);
        // setAudioSrc(form.getFieldValue(`SoundPath_${radioType}`));
        if (form.getFieldValue(`SoundPath_${radioType}`)) {
            createFileFlow(form.getFieldValue(`SoundPath_${radioType}`));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.initialValues, props.modelType, radioType]);

    const radioTypeChange = (e) => {
        setRadioType(e.target.value);
    };

    const radioTextTypeChange = (e) => {
        const actionValue = form.getFieldValue(`SoundText_${radioTextType}`);
        if (actionValue && Array.isArray(actionValue) && actionValue.length > 0) {
            setRadioTextType(e.target.value);
        } else {
            message.error('请选择播放告警字段');
        }
    };

    useEffect(() => {
        setShowMessage(form.getFieldValue(`SoundText_${radioTextType}`));
    }, [radioTextType]);

    const onFieldsChange = (changedFields, allFields) => {
        if (
            changedFields[0].name[0] === 'SoundText_1' ||
            changedFields[0].name[0] === 'SoundText_2' ||
            changedFields[0].name[0] === 'SoundText_0' ||
            changedFields[0].name[0] === 'SoundText_3'
        ) {
            setShowMessage(changedFields[0].value);
        }
    };

    const setShowMessage = (valueList) => {
        let message = '有新告警. ';
        Array.isArray(valueList) &&
            valueList.forEach((item, i) => {
                message += `${_.find(playAlarmMap.current, { value: item }).label}:<${item}>${i !== valueList.length - 1 ? ',' : ''}`;
            });
        setText(message);
    };

    return (
        <div className="unicom-phonation-contain">
            <div style={{ marginBottom: '16px' }}>规则动作:</div>
            <Form initialValues={initialValues} form={form} ref={ref} onFieldsChange={onFieldsChange}>
                <Row>
                    <Col span={3} style={{ textAlign: 'right', lineHeight: '32px' }}>
                        启用时间<span style={{ margin: '0 8px 0 2px' }}>:</span>
                    </Col>
                    <Col span={21}>
                        <Row>
                            <Col span={2}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item name="IsValid" valuePropName="checked">
                                                <Field
                                                    mode={mode}
                                                    render={() => {
                                                        const str = getFieldValue('IsValid') ? '开' : '关';
                                                        return <span>{str}</span>;
                                                    }}
                                                    renderFormItem={() => {
                                                        return (
                                                            <Switch
                                                                checked={getFieldValue('IsValid')}
                                                                checkedChildren="开"
                                                                unCheckedChildren="关"
                                                                size="small"
                                                            ></Switch>
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }}
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
                                                        validator: async (rule, val) => {
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
                                                <Field
                                                    mode={mode}
                                                    valueType="timeRange"
                                                    text={getFieldValue('Timeperiod')}
                                                    renderFormItem={() => {
                                                        return <TimePicker.RangePicker format="HH:mm" disabled={!getFieldValue('IsValid')} />;
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        return (
                            <Form.Item labelCol={{ span: 3 }} name="SoundFlag" label="发声方式">
                                <Field
                                    text={getFieldValue('SoundFlag')}
                                    mode={mode}
                                    valueType="radio"
                                    valueEnum={{
                                        0: { text: '播放发声文件' },
                                        // 1: {
                                        //     text: '播放告警',
                                        // },
                                    }}
                                    renderFormItem={() => {
                                        return (
                                            <Radio.Group>
                                                <Radio value={0}>播放发声文件</Radio>
                                                {/* <Radio value={1}>播放告警</Radio> */}
                                            </Radio.Group>
                                        );
                                    }}
                                />
                            </Form.Item>
                        );
                    }}
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        const arr = {};
                        if (Array.isArray(playAlarmMap?.current)) {
                            playAlarmMap?.current.map((item) => {
                                arr[item.value] = { text: item.label };
                                return arr;
                            });
                        }
                        return getFieldValue('SoundFlag') === 0 ? (
                            <Form.Item wrapperCol={{ offset: 3 }}>
                                <div className="raido-contain">
                                    <Radio.Group onChange={radioTypeChange} value={radioType}>
                                        <Radio.Button value={1}>未清除未确认</Radio.Button>
                                        <Radio.Button value={2}>未清除已确认</Radio.Button>
                                        <Radio.Button value={0}>已清除未确认</Radio.Button>
                                        <Radio.Button value={3}>已清除已确认</Radio.Button>
                                    </Radio.Group>
                                </div>

                                <Space size={0}>
                                    <span>声音文件:</span>
                                    <Form.Item hidden={radioType !== 1} noStyle name="FileName_1">
                                        {getFieldValue([`FileName_${radioType}`]) ? (
                                            <div className="sound-file">
                                                <img style={{ width: 14 }} alt="" src={earPhone} />
                                                <span style={{ margin: '0 6px' }}>{getFieldValue([`FileName_${radioType}`])}</span>
                                                {mode != 'read' && <Icon antdIcon type="CloseOutlined" onClick={() => onClearFileClick(radioType)} />}
                                            </div>
                                        ) : (
                                            <Input style={{ width: 120, margin: '0 16px' }} disabled />
                                        )}
                                    </Form.Item>
                                    <Form.Item hidden={radioType !== 2} noStyle name="FileName_2">
                                        {getFieldValue([`FileName_${radioType}`]) ? (
                                            <div className="sound-file">
                                                <img style={{ width: 14 }} alt="" src={earPhone} />
                                                <span style={{ margin: '0 6px' }}>{getFieldValue([`FileName_${radioType}`])}</span>
                                                {mode != 'read' && <Icon antdIcon type="CloseOutlined" onClick={() => onClearFileClick(radioType)} />}
                                            </div>
                                        ) : (
                                            <Input style={{ width: 120, margin: '0 16px' }} disabled />
                                        )}
                                    </Form.Item>
                                    <Form.Item hidden={radioType !== 0} noStyle name="FileName_0">
                                        {getFieldValue([`FileName_${radioType}`]) ? (
                                            <div className="sound-file">
                                                <img style={{ width: 14 }} alt="" src={earPhone} />
                                                <span style={{ margin: '0 6px' }}>{getFieldValue([`FileName_${radioType}`])}</span>
                                                {mode != 'read' && <Icon antdIcon type="CloseOutlined" onClick={() => onClearFileClick(radioType)} />}
                                            </div>
                                        ) : (
                                            <Input style={{ width: 120, margin: '0 16px' }} disabled />
                                        )}
                                    </Form.Item>
                                    <Form.Item hidden={radioType !== 3} noStyle name="FileName_3">
                                        {getFieldValue([`FileName_${radioType}`]) ? (
                                            <div className="sound-file">
                                                <img style={{ width: 14 }} alt="" src={earPhone} />
                                                <span style={{ margin: '0 6px' }}>{getFieldValue([`FileName_${radioType}`])}</span>
                                                {mode != 'read' && <Icon antdIcon type="CloseOutlined" onClick={() => onClearFileClick(radioType)} />}
                                            </div>
                                        ) : (
                                            <Input style={{ width: 120, margin: '0 16px' }} disabled />
                                        )}
                                    </Form.Item>
                                    <Form.Item hidden noStyle name="SoundPath_1">
                                        <Input allowClear />
                                    </Form.Item>
                                    <Form.Item hidden noStyle name="SoundPath_2">
                                        <Input allowClear />
                                    </Form.Item>
                                    <Form.Item hidden noStyle name="SoundPath_0">
                                        <Input allowClear />
                                    </Form.Item>
                                    <Form.Item hidden noStyle name="SoundPath_3">
                                        <Input allowClear />
                                    </Form.Item>
                                    <Upload accept="audio/*" customRequest={(res) => uploadScripts(radioType, res)} custom showUploadList={false}>
                                        <Button type="primary" disabled={btnDisabled || mode === 'read'}>
                                            选择文件
                                        </Button>
                                    </Upload>
                                    {/* <Button type="primary" onClick={() => onClearFileClick(radioType)}>
                                        清除
                                    </Button> */}
                                    <Button style={{ marginLeft: 8 }} onClick={audioClick}>
                                        试听
                                    </Button>
                                </Space>
                                <audio ref={audioRef} src={audioSrc}></audio>

                                <Form.Item hidden name="FileExtension_1">
                                    <Input allowClear disabled={mode === 'read'}></Input>
                                </Form.Item>
                                <Form.Item hidden name="FileExtension_2">
                                    <Input allowClear disabled={mode === 'read'}></Input>
                                </Form.Item>
                                <Form.Item hidden name="FileExtension_0">
                                    <Input allowClear disabled={mode === 'read'}></Input>
                                </Form.Item>
                                <Form.Item hidden name="FileExtension_3">
                                    <Input allowClear disabled={mode === 'read'}></Input>
                                </Form.Item>
                                {/* {radioType == 2 && (
                                    <>
                                        <Space>
                                            <span>声音文件:</span>
                                            
                                            <Form.Item hidden noStyle name="SoundPath_2">
                                                <Input allowClear />
                                            </Form.Item>
                                            <Upload
                                                accept="audio/*"
                                                customRequest={(res) => uploadScripts(radioType, res)}
                                                custom
                                                showUploadList={false}
                                            >
                                                <Button type="primary" disabled={btnDisabled || mode === 'read'}>
                                                    选择文件
                                                </Button>
                                            </Upload>
                                            <Button onClick={audioClick}>试听</Button>
                                        </Space>
                                        <audio ref={audioRef} src={audioSrc}></audio>

                                        <Form.Item hidden name="FileExtension_2">
                                            <Input allowClear disabled={mode === 'read'}></Input>
                                        </Form.Item>
                                    </>
                                )}
                                {radioType == 0 && (
                                    <>
                                        <Space>
                                            <span>声音文件:</span>
                                            <Form.Item noStyle name="FileName_0">
                                                <Input style={{ width: 120 }} disabled />
                                            </Form.Item>
                                            <Form.Item hidden noStyle name="SoundPath_0">
                                                <Input allowClear />
                                            </Form.Item>
                                            <Upload
                                                accept="audio/*"
                                                customRequest={(res) => uploadScripts(radioType, res)}
                                                custom
                                                showUploadList={false}
                                            >
                                                <Button type="primary" disabled={btnDisabled || mode === 'read'}>
                                                    选择文件
                                                </Button>
                                            </Upload>
                                            <Button onClick={audioClick}>试听</Button>
                                        </Space>
                                        <audio ref={audioRef} src={audioSrc}></audio>

                                        <Form.Item hidden name="FileExtension_0">
                                            <Input allowClear disabled={mode === 'read'}></Input>
                                        </Form.Item>
                                    </>
                                )}
                                {radioType == 3 && (
                                    <>
                                        <Space>
                                            <span>声音文件:</span>
                                            <Form.Item noStyle name="FileName_3">
                                                <Input style={{ width: 120 }} disabled />
                                            </Form.Item>
                                            <Form.Item hidden noStyle name="SoundPath_3">
                                                <Input allowClear />
                                            </Form.Item>
                                            <Upload
                                                accept="audio/*"
                                                customRequest={(res) => uploadScripts(radioType, res)}
                                                custom
                                                showUploadList={false}
                                            >
                                                <Button type="primary" disabled={btnDisabled || mode === 'read'}>
                                                    选择文件
                                                </Button>
                                            </Upload>
                                            <Button onClick={audioClick}>试听</Button>
                                        </Space>
                                        <audio ref={audioRef} src={audioSrc}></audio>

                                        <Form.Item hidden name="FileExtension_3">
                                            <Input allowClear disabled={mode === 'read'}></Input>
                                        </Form.Item>
                                    </>
                                )} */}
                            </Form.Item>
                        ) : (
                            <>
                                <Form.Item wrapperCol={{ offset: 3 }}>
                                    <div className="raido-contain">
                                        <Radio.Group onChange={radioTextTypeChange} value={radioTextType}>
                                            <Radio.Button value={1}>未清除未确认</Radio.Button>
                                            <Radio.Button value={2}>未清除已确认</Radio.Button>
                                            <Radio.Button value={0}>已清除未确认</Radio.Button>
                                            <Radio.Button value={3}>已清除已确认</Radio.Button>
                                        </Radio.Group>
                                    </div>
                                </Form.Item>
                                <Form.Item
                                    wrapperCol={{ offset: 3 }}
                                    name="SoundText_1"
                                    hidden={radioTextType !== 1}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择播放告警字段',
                                        },
                                    ]}
                                >
                                    <Field
                                        mode={mode}
                                        text={getFieldValue('SoundText_1')}
                                        valueEnum={arr}
                                        renderFormItem={() => {
                                            return <Checkbox.Group options={playAlarmMap?.current}></Checkbox.Group>;
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    wrapperCol={{ offset: 3 }}
                                    name="SoundText_2"
                                    hidden={radioTextType !== 2}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择播放告警字段',
                                        },
                                    ]}
                                >
                                    <Field
                                        mode={mode}
                                        text={getFieldValue('SoundText_2')}
                                        valueEnum={arr}
                                        renderFormItem={() => {
                                            return <Checkbox.Group options={playAlarmMap?.current}></Checkbox.Group>;
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    wrapperCol={{ offset: 3 }}
                                    name="SoundText_0"
                                    hidden={radioTextType !== 0}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择播放告警字段',
                                        },
                                    ]}
                                >
                                    <Field
                                        mode={mode}
                                        text={getFieldValue('SoundText_0')}
                                        valueEnum={arr}
                                        renderFormItem={() => {
                                            return <Checkbox.Group options={playAlarmMap?.current}></Checkbox.Group>;
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    wrapperCol={{ offset: 3 }}
                                    name="SoundText_3"
                                    hidden={radioTextType !== 3}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择播放告警字段',
                                        },
                                    ]}
                                >
                                    <Field
                                        mode={mode}
                                        text={getFieldValue('SoundText_3')}
                                        valueEnum={arr}
                                        renderFormItem={() => {
                                            return <Checkbox.Group options={playAlarmMap?.current}></Checkbox.Group>;
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 3 }}>
                                    <Input.TextArea disabled value={text}></Input.TextArea>
                                </Form.Item>
                            </>
                        );
                    }}
                </Form.Item>
            </Form>
        </div>
    );
});
