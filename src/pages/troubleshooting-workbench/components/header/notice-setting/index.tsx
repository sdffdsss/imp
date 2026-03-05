import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, List, Button, Space, message, Checkbox } from 'oss-ui';
import ReportNotice from '@Src/pages/fault-report/fault-report-add/fault-report-form/first-report-form/report-notice';
import { defaultNotificationDetailList } from '@Src/pages/fault-report/type';
import classnames from 'classnames';
import { queryReportSetting, saveOrUpdateReportSetting } from '../../../api';

import './index.less';

const DEFAULT_VALUE = {
    notificationContent: '',
    notificationTel: '',
    notificationType: '',
    notificationUser: '',
    notificationUserInfos: [],
    notificationDetailList: defaultNotificationDetailList,
    whetherGroupDisplay: false,
};

const NoticeSetting = (props) => {
    const [formRef] = Form.useForm();

    const { visible, reportSettingTree, onCancel = () => {} } = props;
    // 通知错误信息
    const [reportNoticeError, setReportNoticeError] = useState('');
    // 当前专业
    const [currentProfessional, setCurrentProfessional] = useState('');
    // 故障类别列表
    const [faultTypeList, setFaultTypeList] = useState(reportSettingTree?.[0]?.faultTypes || []);
    // 当前故障类别
    const [currentFaultType, setCurrentFaultType] = useState('');

    const [currentDefaultValue, setCurrentDefaultValue]: any = useState(DEFAULT_VALUE);

    const onReportNoticeChange = (values) => {
        const { notificationTel, notificationUser, notificationType, continueContent, finalContent } = values;

        if (notificationType) {
            if (!notificationTel && !notificationUser && notificationType !== '3') {
                setReportNoticeError('通知对象不能为空！');
            } else if (!continueContent) {
                setReportNoticeError('续报的通知内容不能为空！');
            } else if (!finalContent) {
                setReportNoticeError('终报的通知内容不能为空！');
            } else {
                setReportNoticeError('');
            }
        } else {
            setReportNoticeError('');
        }
    };
    const onProfessionalTypeClick = (item) => {
        if (item.professionalType === currentProfessional) {
            return;
        }
        setCurrentFaultType('');
        setCurrentProfessional(item.professionalType);
    };
    const onFaultTypeClick = (item) => {
        setCurrentFaultType(item);
    };

    const queryReportSettingData = () => {
        if (currentFaultType && currentProfessional) {
            const params = {
                professionalType: currentProfessional,
                faultType: currentFaultType,
            };
            queryReportSetting(params).then((res) => {
                if (res.code === 500) {
                    message.error(res.message || '通报设置查询失败');
                    return;
                }
                if (res && res.data) {
                    setCurrentDefaultValue(res.data);
                } else {
                    setCurrentDefaultValue({ ...DEFAULT_VALUE });
                }
            });
        }
    };

    const onFinish = useCallback(
        (values) => {
            const {
                notificationTel,
                notificationType,
                notificationUser,
                reportNoticeError: finalReportNoticeError,
                selectedNoticeData,
                notificationDetailList,
                continueContent,
                finalContent,
                notificationContent,
            } = values?.notice || {};
            if (finalReportNoticeError) {
                message.error(finalReportNoticeError);
                return;
            }

            const params = {
                professionalType: currentProfessional,
                faultType: currentFaultType,
                notificationUser,
                notificationType,
                notificationTel,
                notificationContent,
                continueContent,
                finalContent,
                notificationDetailList,
                whetherGroupDisplay: values.whetherGroupDisplay,
            };

            saveOrUpdateReportSetting(params).then((res) => {
                if (res && res.code === 200) {
                    message.success('保存成功');
                    setCurrentDefaultValue({
                        ...params,
                        notificationTel,
                        notificationContent,
                        continueContent,
                        finalContent,
                        notificationUserInfos: selectedNoticeData,
                    });
                    queryReportSettingData();
                } else {
                    message.error('保存失败');
                }
            });
        },
        [currentFaultType, currentProfessional],
    );

    const onReset = () => {
        setCurrentDefaultValue({ ...DEFAULT_VALUE });
    };

    useEffect(() => {
        if (!reportSettingTree) {
            return;
        }
        const currentData = reportSettingTree.find((item) => item.professionalType === currentProfessional);
        if (currentData) {
            setFaultTypeList(currentData.faultTypes);
            setCurrentFaultType(currentData.faultTypes[0]);
        }
    }, [currentProfessional, reportSettingTree]);

    useEffect(() => {
        setCurrentProfessional(reportSettingTree?.[0]?.professionalType || '');
    }, [reportSettingTree]);

    useEffect(() => {
        queryReportSettingData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFaultType, currentProfessional]);

    useEffect(() => {
        const { notificationContent, notificationTel, notificationType, notificationUser, notificationDetailList, whetherGroupDisplay } =
            currentDefaultValue || DEFAULT_VALUE;

        formRef.setFieldsValue({
            notice: {
                notificationUser,
                notificationType,
                notificationTel,
                notificationContent,
                notificationDetailList,
            },
            whetherGroupDisplay,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDefaultValue]);

    return (
        <Modal
            visible={visible}
            width={1100}
            className="notice-setting-modal"
            style={{
                position: 'relative',
                left: props.cardsDockedLeft ? -270 : 0,
                top: props.cardsDockedLeft ? 257 : undefined,
            }}
            bodyStyle={{ padding: 0 }}
            footer={null}
            onCancel={onCancel}
            getContainer={false}
            destroyOnClose
        >
            <div className="notice-setting-container">
                <div className="notice-setting-title">通报设置</div>
                <div className="notice-setting-body">
                    <div className="notice-setting-left">
                        <div className="notice-setting-left-content">
                            <div className="notice-setting-left-specialty">
                                <List
                                    split={false}
                                    rowKey="professionalType"
                                    dataSource={reportSettingTree}
                                    renderItem={(item: any) => {
                                        return (
                                            <List.Item
                                                onClick={() => {
                                                    onProfessionalTypeClick(item);
                                                }}
                                                className={classnames('notice-setting-left-list-item', {
                                                    active: item.professionalType === currentProfessional,
                                                })}
                                            >
                                                {item.professionalType}
                                            </List.Item>
                                        );
                                    }}
                                />
                            </div>
                            <div className="notice-setting-left-failure-class">
                                <List
                                    split={false}
                                    dataSource={faultTypeList}
                                    rowKey={(item) => item}
                                    renderItem={(item: any) => {
                                        return (
                                            <List.Item
                                                onClick={() => {
                                                    onFaultTypeClick(item);
                                                }}
                                                className={classnames('notice-setting-right-list-item', {
                                                    active: item === currentFaultType,
                                                })}
                                            >
                                                {item}
                                            </List.Item>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="notice-setting-right">
                        <Form name="notice-setting-form" form={formRef} onFinish={onFinish}>
                            <div className="notice-setting-right-content">
                                <Form.Item name="whetherGroupDisplay" valuePropName="checked">
                                    <Checkbox style={{ marginLeft: '60px' }}>集团同步展示未确认群障</Checkbox>
                                </Form.Item>
                                <Form.Item name="notice">
                                    <ReportNotice
                                        onChange={onReportNoticeChange}
                                        reportNoticeError={reportNoticeError}
                                        className="notice-setting-report-notice"
                                        templateBtnType="primary"
                                        tableDeleteBtnType="icon"
                                        tableMaxHeight={200}
                                        defaultValue={currentDefaultValue}
                                        disabledProvince
                                        noticeTemplateClassName="group-workbench-notice-setting-notice-template"
                                        noticeTemplateAddClassName="group-workbench-notice-setting-notice-template-add"
                                        userGroupSelectModalClassName="group-workbench-notice-setting-user-group-select"
                                        labelColSpan={3}
                                        wrapperColSpan={20}
                                        noticeSettingFlag
                                    />
                                </Form.Item>
                            </div>
                            <div className="notice-setting-right-bottom">
                                <Space>
                                    <Button type="ghost" onClick={onReset}>
                                        重置
                                    </Button>

                                    <Button type="primary" htmlType="submit">
                                        保存
                                    </Button>
                                </Space>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
export default NoticeSetting;
