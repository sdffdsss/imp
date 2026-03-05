import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, DatePicker, Checkbox, Space, Button, Upload, message } from 'oss-ui';
import { UploadOutlined } from '@ant-design/icons';
import './index.less';
import { addNotice, updateNotice, importNotice } from '../api';
import moment from 'moment';
import AuthButton from '@Src/components/auth-button';
import DateRangeTime from '@Components/date-range-time';

const EditModal = (props) => {
    const { type, onCancel, onOk, rowData, login } = props;
    const userInfo = JSON.parse(login.userInfo);
    // 标题自定义验证
    const [titleValiDateVisible, handleTitleValiDateVisible] = useState(false);
    const [titleValiDate, handleTitleValiDate] = useState('请输入公告标题');
    // 内容自定义验证
    const [textValiDateVisible, handleTextValiDateVisible] = useState(false);
    const [textValiDate, handleTextValiDate] = useState('请输入公告内容');
    const [form] = Form.useForm();

    const [fileList, handleFileList] = useState([]);

    const parrten = /^[a-zA-Z0-9-_,.:;"()+*/?（）“”：！!，【】？；\u4e00-\u9fa5]+$/;

    // 保存
    const handleOk = async (param) => {
        if (!form.getFieldValue('noticeTitle')) {
            handleTitleValiDateVisible(true);
        }
        if (!form.getFieldValue('noticeText')) {
            handleTextValiDateVisible(true);
        }
        const valiDate = await form.validateFields();
        if (!valiDate) {
            return;
        }
        const values = await form.getFieldsValue();
        const nameList = fileList?.map((item) => item.name) || [];
        const params = {
            noticeTitle: values.noticeTitle,
            noticeText: values.noticeText,
            creator: rowData.userId,
            creatorName: rowData.userName,
            provinceId: rowData.provinceId,
            provinceName: rowData.provinceData?.filter((item) => Number(item.regionId) === Number(rowData.provinceId))[0]?.regionName,
            fileName: nameList?.toString(),
            isGroup: values.isGroup ? true : false,
        };
        const dataFormat = 'YYYY-MM-DD HH:mm:ss';
        if (values.isEnd && values.time) {
            params.publishTime = moment(values.time).format(dataFormat);
        }
        if (!values.isEnd && values.time) {
            params.publishTime = moment(values.time[0]).format(dataFormat);
            params.cutTime = moment(values.time[1]).format(dataFormat);
        }
        if (values.isEnd) {
            delete params.publishTime;
            params.publishTime = moment(values.time).format(dataFormat);
        }
        if (!values.isCheck) {
            delete params.publishTime;
            delete params.cutTime;
        }
        if (type === 'add') {
            addNotice(params, param).then((res) => {
                if (res.code === 200 && onOk) {
                    onOk();
                }
            });
        }
        if (type === 'edit') {
            updateNotice({ ...params, noticeId: rowData.noticeId }, param).then((res) => {
                if (res.code === 200 && onOk) {
                    onOk();
                }
            });
        }
    };

    // 取消
    const handleCancel = () => {
        onCancel();
    };

    // 公告标题校验
    const handleTitle = async (flag, title) => {
        handleTitleValiDateVisible(flag);
        handleTitleValiDate(title);
    };
    const handleTitleBlur = async (flag, title) => {
        const values = await form.getFieldsValue();
        if (!values.noticeTitle) {
            handleTitleValiDate('请输入公告标题');
            return;
        }
        if (parrten.test(values?.noticeTitle)) {
            handleTitleValiDateVisible(flag);
            handleTitleValiDate(title);
        }
    };

    // 公告内容校验
    const handleText = async (flag, title) => {
        handleTextValiDateVisible(flag);
        handleTextValiDate(title);
    };
    const handleTextBlur = async (flag, title) => {
        const values = await form.getFieldsValue();
        if (!values.noticeText) {
            handleTextValiDate('请输入公告内容');
            return;
        }
        if (values.noticeText.length <= 200) {
            handleTextValiDateVisible(flag);
            handleTextValiDate(title);
        }
    };

    // 是否无结束日
    const handleEndChange = (e) => {
        const { cutTime, publishTime } = rowData;
        let newTime = moment();
        let newTimeRenge = [moment(), moment().subtract('days', -2)];
        if (cutTime && publishTime) {
            newTimeRenge = [moment(publishTime), moment(cutTime)];
        }
        if (publishTime) {
            newTime = moment(publishTime);
        }
        form.setFieldsValue({
            time: e.target.checked ? newTime : newTimeRenge,
        });
    };

    // 编辑
    useEffect(() => {
        const { noticeTitle, noticeText, cutTime, publishTime, fileName, isGroup } = rowData;
        form.setFieldsValue({
            time: moment(),
            isEnd: true,
        });
        if (type === 'edit') {
            if (!cutTime) {
                form.setFieldsValue({
                    isEnd: true,
                });
            } else {
                form.setFieldsValue({
                    isEnd: false,
                });
            }
            if (publishTime) {
                form.setFieldsValue({
                    isCheck: true,
                });
            }
            form.setFieldsValue({
                noticeTitle,
                noticeText,
                isGroup: isGroup === 'true' ? true : false,
                time: cutTime ? [moment(publishTime), moment(cutTime)] : moment(publishTime),
            });
        }
        const newList = fileName?.split(',').map((item) => {
            return { name: item };
        });
        handleFileList(fileName?.length ? newList : []);
    }, [form, rowData, type]);

    function disabledDate(current, disabledDates) {
        // Can not select days before today and today
        return (current && current < moment().subtract('days', 1).endOf('day')) || (disabledDates && disabledDates(current));
    }

    const defineFileType = (types) => {
        console.log(types);
        if (
            types.indexOf('document') !== -1 ||
            types.indexOf('msword') !== -1 ||
            types.indexOf('powerpoint') !== -1 ||
            types.indexOf('excel') !== -1 ||
            types.indexOf('pdf') !== -1 ||
            types.indexOf('sheet') !== -1
        ) {
            return true;
        } else {
            message.warn('附件支持上传word/excel/ppt/pdf文件');
            return false;
        }
    };

    const handleChange = (info) => {
        let newList = [...info.fileList];
        newList = newList.slice(-2);
        newList = newList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            return file;
        });
        const newLis = [];
        newList.map((item) => {
            if (item.size / 1024 / 1024 < 2 && defineFileType(item.type)) {
                return newLis.push(item);
            }
        });

        handleFileList(newLis);
    };

    const uploadScripts = async ({ file, onError, onSuccess }) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            return message.error('文件大小不能超过2M');
        }
        const params = new FormData();
        params.append('file', file);
        const data = await importNotice(params);
        if (data.code === 200) {
            onSuccess('上传成功', file);
        } else {
            onError('上传失败', file);
        }
    };

    return (
        <div className="notice-modal">
            <Form form={form} className="notice-form" labelCol={{ span: 3 }}>
                <Form.Item
                    label="公告标题"
                    name="noticeTitle"
                    help={<div style={{ height: '20px' }}>{titleValiDateVisible && titleValiDate}</div>}
                    rules={[
                        {
                            required: true,
                            message: '请输入公告标题',
                        },
                        {
                            pattern: parrten,
                            message: '限制字符不超过30个，可填汉字、英文、数字、_-"".:;!()+*/?？：；，【】（）！“”  符号',
                        },
                    ]}
                >
                    <Input
                        maxLength={30}
                        onFocus={() => {
                            handleTitle(true, '限制字符不超过30个，可填汉字、英文、数字、_-"".:;,!()+*/?？：；，【】（）！“”  符号');
                        }}
                        onBlur={() => {
                            handleTitleBlur(false, null);
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="公告内容"
                    name="noticeText"
                    help={<div style={{ height: '20px' }}>{textValiDateVisible && textValiDate}</div>}
                    rules={[
                        {
                            required: true,
                            message: '请输入公告内容',
                        },
                    ]}
                >
                    <Input.TextArea
                        autoSize={{ minRows: 6, maxRows: 8 }}
                        maxLength={200}
                        style={{ height: '150px' }}
                        onFocus={() => {
                            handleText(true, '限制字符不超过200个');
                        }}
                        onBlur={() => {
                            handleTextBlur(false, null);
                        }}
                    />
                </Form.Item>
                <Form.Item label="上传附件" name="fileName" help="附件支持上传word/excel/ppt/pdf文件；每个附件不超过2M">
                    <Upload
                        multiple={true}
                        customRequest={(e) => {
                            uploadScripts(e);
                        }}
                        onChange={(e) => {
                            handleChange(e);
                        }}
                        fileList={fileList}
                        accept=".ppt, .doc, .docx, .pdf, .xls, xlsx"
                    >
                        <Button disabled={fileList?.length > 1} icon={<UploadOutlined />}>
                            上传
                        </Button>
                    </Upload>
                </Form.Item>
                <Form.Item label="发布时间段">
                    <Space>
                        <Form.Item noStyle shouldUpdate>
                            {() => {
                                return (
                                    <Form.Item name="isCheck" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                return (
                                    <Form.Item name="time">
                                        {getFieldValue('isEnd') ? (
                                            <DatePicker size="small" showTime disabled={!getFieldValue('isCheck')} disabledDate={disabledDate} />
                                        ) : (
                                            <DateRangeTime
                                                size="small"
                                                showTime
                                                disabled={!getFieldValue('isCheck')}
                                                disabledDate={disabledDate}
                                                format="YYYY-MM-DD HH:mm:ss"
                                            />
                                        )}
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                return (
                                    <Form.Item name="isEnd" valuePropName="checked">
                                        <Checkbox
                                            disabled={!getFieldValue('isCheck')}
                                            onChange={(e) => {
                                                handleEndChange(e);
                                            }}
                                        >
                                            无结束日
                                        </Checkbox>
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item valuePropName="checked" label="全国公告" name="isGroup">
                    <Switch disabled={userInfo.zones[0].zoneLevel !== '1'} />
                </Form.Item>
            </Form>
            <div className="footers">
                <Space>
                    <AuthButton
                        authKey={`unicomNotice:${type}`}
                        addLog={true}
                        type="primary"
                        onClick={(params) => {
                            handleOk(params);
                        }}
                    >
                        确定
                    </AuthButton>
                    <Button
                        onClick={() => {
                            handleCancel();
                        }}
                    >
                        取消
                    </Button>
                </Space>
            </div>
        </div>
    );
};
export default EditModal;
