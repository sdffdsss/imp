import React, { useState, useEffect, useRef } from 'react';
import { Input, Select, Tag, Form, Card, Button, message } from 'oss-ui';
// import SmsTemplate from '@Src/components/sms-template/edit';
import SmsTemplate from './sms-edit';
import request from '@Common/api';
import { _ } from 'oss-web-toolkits';
import { smsTemplateShow } from './config';
// import serviceConfig from '../../../hox';

import './index.less';

const Component = (props) => {
    const { menuComponentFormRef, record, modalContainer, type, userId, systemInfo } = props;
    const smsMsg = { sms: '短信', ivr: '语音' };
    // const initialSms = `【综合监控${smsMsg[type]}通知】，${smsTemplateShow
    //     .map((item) => `${item.label}：${record[0][item.fieldName]}`)
    //     .join('，')}\n`;
    const initialSms = `【综合监控${smsMsg[type]}通知】`;
    const smsTitles = { sms: '短信正文：', ivr: 'IVR正文：' };
    const userTitles = { sms: '短信接收人员：', ivr: 'IVR呼叫人员：' };
    const phoneTitles = { sms: '接收人员', ivr: '呼叫人员' };
    const [showEdit, setEditVisible] = useState(false);
    const smsContext = useRef('');
    const [userGroupList, setUserGroupList] = useState([]);
    const [selectUserList, setSelectUserList] = useState([]);
    const [selectedFields, setSelectedFields] = useState(smsTemplateShow.map((item) => item.fieldName));

    useEffect(() => {
        smsContext.current = initialSms;
        menuComponentFormRef.current.setFieldsValue({
            sms: initialSms,
            type: 'sms',
            reason: '',
            userList: '',
            phoneList: '',
        });
        getUserGroupList();
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleSaveSms = (values) => {
        let str = `【综合监控${smsMsg[type]}通知】，`;
        if (values.content) {
            const fileds = values.content
                .split('>')
                .slice(0, -1)
                .map((fieldItem) => ({
                    displayName: fieldItem.split(':')[0],
                    storeFieldName: fieldItem.split(':')[1].slice(1),
                }));
            let dataList = _.map(fileds, (element) => {
                return `${element.displayName}：${record[0][element.storeFieldName] || ''}`;
            });
            str += dataList.join(',');
        }
        smsContext.current = str;
        menuComponentFormRef.current.setFieldsValue({
            sms: str,
        });
        setEditVisible(false);
    };
    const handleCancel = () => {
        setEditVisible(false);
    };
    const onVisibleChange = (visible, values, rowClickId) => {
        if (values) {
            handleSaveSms(values);
            setSelectedFields(rowClickId);
        } else {
            handleCancel();
        }
    };
    const smsChange = (e) => {
        smsContext.current = e.target.value;
        menuComponentFormRef.current.setFieldsValue({
            sms: e.target.value,
        });
    };
    const onSelectGroupChange = (value) => {
        getUsersByGroupId(value);
    };
    const onUserRemove = (userId, e) => {
        e.preventDefault();
        const selectUsers = selectUserList.filter((user) => user.userId !== userId);
        setSelectUserList(selectUsers);
        menuComponentFormRef.current.setFieldsValue({
            userList: selectUsers.map((s) => s.userId).join(','),
        });
    };
    const phoneListChange = (e) => {
        menuComponentFormRef.current.setFieldsValue({
            phoneList: e.target.value,
        });
    };

    //获取用户组
    const getUserGroupList = () => {
        let data = {
            userId,
        };
        if (systemInfo?.currentZone?.zoneId) {
            data = {
                ...data,
                zoneId: systemInfo?.currentZone?.zoneId,
                zoneLevel: systemInfo?.currentZone?.zoneLevel,
            };
        }
        request('alarmmodel/filter/v1/filter/usergroup', {
            baseUrlType: 'filterUrl',
            // fullUrl: `${serviceConfig.data.serviceConfig.otherService.filterUrl}alarmmodel/filter/v1/filter/usergroup`,
            type: 'get',
            showSuccessMessage: false,
            data: {
                ...data,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        }).then((res) => {
            if (res && res.data) {
                let list = res.data.map((item) => ({
                    label: item.groupName,
                    value: item.groupId,
                }));
                setUserGroupList(list);
            }
        });
    };
    //获取用户组用户
    const getUsersByGroupId = (groupId) => {
        request('alarmmodel/filter/v1/filter/userinfo', {
            baseUrlType: 'filterUrl',
            // fullUrl: `${serviceConfig.data.serviceConfig.otherService.filterUrl}alarmmodel/filter/v1/filter/userinfo`,
            type: 'get',
            showSuccessMessage: false,
            data: {
                groupId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        }).then((res) => {
            if (res && res.data && res.data.length) {
                const selectUsers = _.uniqBy([...selectUserList, ...res.data], 'userId');
                setSelectUserList(selectUsers);
                menuComponentFormRef.current.setFieldsValue({
                    userList: selectUsers.map((s) => s.userId).join(','),
                });
            }
        });
    };
    return (
        <Form ref={menuComponentFormRef}>
            <div className="alarm-sms-distribution-message">
                <span>{smsTitles[type]}</span>
                {Array.isArray(record) && (
                    <Button
                        className="alarm-sms-distribution-edit"
                        size="small"
                        onClick={() => {
                            setEditVisible(true);
                        }}
                    >
                        编辑
                    </Button>
                )}
            </div>
            <div>
                <Form.Item
                    name="sms"
                    onChange={smsChange}
                    rules={[
                        {
                            required: true,
                            message: '请输入短信内容！',
                        },
                        {
                            whitespace: true,
                            message: '请输入短信内容！',
                        },
                    ]}
                >
                    <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
                </Form.Item>
            </div>
            <div className="alarm-sms-distribution-user-select">
                <span>用户组选择：</span>
                <Form.Item style={{ width: '30%' }}>
                    <Select size="small" defaultValue={-999999} onChange={onSelectGroupChange} showSearch optionFilterProp="children">
                        <Select.Option key={-999999} value={-999999}>
                            请选择用户组
                        </Select.Option>
                        {userGroupList.map((item) => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
            <div className="alarm-sms-distribution-user-tag">
                <span>{userTitles[type]}</span>
                <div className="alarm-sms-distribution-user-tag-dom">
                    <Form.Item name="userList">
                        <Card
                            bordered
                            bodyStyle={{
                                padding: '16px',
                                minHeight: '30px',
                                overflowY: 'auto',
                            }}
                        >
                            {selectUserList.map((user) => (
                                <Tag closable color="#2db7f5" onClose={_.partial(onUserRemove, user.userId)}>
                                    {user.userName}
                                </Tag>
                            ))}
                        </Card>
                    </Form.Item>
                </div>
            </div>
            <div className="alarm-sms-distribution-user-input">
                <span>{`手动输入${phoneTitles[type]}：（输入手机号，用逗号分割）`}</span>
                <div className="alarm-sms-distribution-user-input-dom">
                    <Form.Item
                        onChange={phoneListChange}
                        name="phoneList"
                        rules={[
                            {
                                validator: async (rule, val, callback) => {
                                    const reg = new RegExp('^1[3578][0-9]{9}(,1[3578][0-9]{9})*$');
                                    const reg2 = new RegExp('1[3578][0-9]{9}，');
                                    if (val && reg2.test(val)) {
                                        throw new Error('请输入英文逗号分隔！');
                                    } else if (val && !reg.test(val)) {
                                        throw new Error('请输入正确的手机号码！');
                                    } else {
                                        callback();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input.TextArea></Input.TextArea>
                    </Form.Item>
                    <Form.Item
                        name="validator"
                        rules={[
                            {
                                validator: (rule, val, callback) => {
                                    if (
                                        !menuComponentFormRef.current.getFieldValue('phoneList') &&
                                        !menuComponentFormRef.current.getFieldValue('userList')
                                    ) {
                                        message.warning('用户组选择和手工短信接收人必选其一！');
                                        callback('');
                                    } else {
                                        callback();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input type="hidden"></Input>
                    </Form.Item>
                </div>
            </div>

            {showEdit && (
                <SmsTemplate
                    modalContainer={modalContainer}
                    // smsTemplateList={smsTemplateList}
                    selectedFields={selectedFields}
                    type="alarmRightClick"
                    visible={showEdit}
                    onVisibleChange={onVisibleChange}
                />
            )}
        </Form>
    );
};

export default Component;
