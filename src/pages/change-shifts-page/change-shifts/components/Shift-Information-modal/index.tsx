// @ts-nocheck
import React, { useEffect, useState } from 'react';
import api from '@Pages/change-shifts-page/api';
import { FormInstance } from 'oss-ui/es/form';
import useLoginInfoModel from '@Src/hox';
import { Modal, Form, Input, Button, Tooltip, Icon, Select, Spin, message } from 'oss-ui';
import { GetCodeItem, HeadBox, Segmentation } from './components';
import './style.less';

const { Option } = Select;

interface FooterProps {
    form: FormInstance<any>;
    setVisible: (visible: boolean) => void;
}

const Footer: React.FC<FooterProps> = (props) => {
    const { form, setVisible, checkHandSubmit } = props;

    const onSave = () => {
        checkHandSubmit().then((res) => {
            if (res) {
                form.submit();
            } else {
                setVisible(false);
            }
        });
    };

    const onCancel = () => {
        setVisible(false);
    };

    return (
        <div className="shift-modal-footer">
            <Button type="primary" onClick={onSave}>
                确定
            </Button>
            <Button onClick={onCancel}>取消</Button>
        </div>
    );
};

const suffix = (
    <Tooltip title="输入接班账号后，系统将完成该账号在本班次的自动排班">
        <Icon antdIcon type="InfoCircleOutlined" style={{ cursor: 'pointer', width: 15, height: 15, color: '#4990E2' }} />
    </Tooltip>
);

interface Props {
    visible: boolean;
    setVisible: (data: boolean) => void;
    defaultData: Record<string, any>;
    handleSwitchUser: (usrId: string) => void;
    sheetStay: () => any;
    getDataInfo?: () => any;
}

const ShiftInformationModal: React.FC<Props> = React.memo((props) => {
    const { visible, setVisible, defaultData, handleSwitchUser, sheetStay, getDataInfo, checkHandSubmit } = props;
    const { groupId, workShiftId, dateTime, provinceId, loginId, userId } = defaultData;

    const loginInfo = useLoginInfoModel();
    const { appId = 110002 } = loginInfo.systemInfo;

    const [form] = Form.useForm();

    const [loading, setLoading] = useState<boolean>(true);
    const [takeInfo, setTakeInfo] = useState<Record<string, any>>({}); // 当前接班人信息
    const [takeList, setTakeList] = useState<Record<string, any>[]>([]); // 接班人列表
    const [nextAccount, setNextAccount] = useState<boolean>(true); // 是否有接班人

    useEffect(() => {
        form.resetFields(['takeName', 'takeLoginId', 'takeMobile']); // 先清空表单不然第二次执行setFieldsValue操作页面会卡死
        // form.setFieldsValue({ ...takeInfo });
        const { takeName, takeLoginId, takeMobile } = takeInfo;
        form.setFieldsValue({
            takeName,
            takeLoginId,
            takeMobile,
        });
    }, [takeInfo, form]);

    // 获取下一班次的人员信息
    const getNextClassesInfo = async () => {
        const data = {
            groupId,
            workShiftId,
            dateTime,
        };
        const res = await api.postNextClassesInfo(data);
        if (+res.resultCode === 200) {
            setTakeList(res.resultObj);
            if (res?.resultObj?.length) {
                setNextAccount(true);
                const values = res.resultObj[0];
                const newData = {
                    takeName: values.userName,
                    takeLoginId: values.loginId,
                    takeMobile: values.userMobile?.split(',')[0],
                    takeUserId: values.userId,
                };
                setTakeInfo(newData);
            } else {
                setNextAccount(false);
            }
        } else {
            setNextAccount(false);
        }
        return true;
    };

    // 获取交班人的人员信息
    const getCurrentClassesInfo = async () => {
        const data = {
            groupId,
            workShiftId,
            dateTime,
            provinceId,
            loginId,
            dutyType: 'hand',
        };
        const res = await api.postPersonInfo(data);
        const { resultMsg } = res;
        if (+res.resultCode === 200) {
            const { userName, userMobile } = res.resultObj;

            form.resetFields(['userName', 'loginId', 'userMobile']); // 先清空表单不然第二次执行setFieldsValue操作页面会卡死
            form.setFieldsValue({
                userName,
                loginId,
                userMobile: userMobile?.split(',')[0],
            });
        } else {
            // 设置交班班人账号错误状态及信息
            form?.setFields([
                {
                    name: ['loginId'],
                    errors: [resultMsg],
                },
            ]);
        }
        return true;
    };

    const fetchData = async () => {
        try {
            await getCurrentClassesInfo();
            await getNextClassesInfo();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!visible) {
            form.resetFields();
        }
    }, [form, visible]);

    const handleCancel = () => {
        setVisible(false);
    };

    const onFinish = async (values: any) => {
        const { userMobile, currentCode, nextCode, takeLoginId, takeMobile, takeName } = values;

        const userMobileData = {
            appId,
            loginId,
            userMobile,
            code: currentCode,
        };
        const takeMobileData = {
            appId,
            loginId: takeLoginId,
            userMobile: takeMobile,
            code: nextCode,
        };
        await sheetStay?.();
        // 当班人验证码
        const userMobileRes = await api.putSMSCode(userMobileData);
        // 接班人验证码
        const takeMobileRes = await api.putSMSCode(takeMobileData);

        const errorInfo = () => {
            if (+userMobileRes.code !== 200) {
                form?.setFields([
                    {
                        name: ['currentCode'],
                        errors: [userMobileRes.message],
                    },
                ]);
            }

            if (+takeMobileRes.code !== 200) {
                form?.setFields([
                    {
                        name: ['nextCode'],
                        errors: [takeMobileRes.message],
                    },
                ]);
            }
        };

        // 当班人和接班人手机号相同时 都校验不通过时才抛出验证码错误
        if (userMobile === takeMobile) {
            if (+userMobileRes.code !== 200 && +takeMobileRes.code !== 200) {
                errorInfo();
                return;
            }
        } else {
            if (+userMobileRes.code !== 200) {
                form?.setFields([
                    {
                        name: ['currentCode'],
                        errors: [userMobileRes.message],
                    },
                ]);
                return;
            }

            if (+takeMobileRes.code !== 200) {
                form?.setFields([
                    {
                        name: ['nextCode'],
                        errors: [takeMobileRes.message],
                    },
                ]);
                return;
            }
        }

        // 提交
        const data = {
            provinceId,
            groupId,
            workShiftId,
            dateTime,
            handuserId: userId,
            takeLoginId,
            takeName,
            takeMobile,
            isHandInput: nextAccount ? 0 : 1, // 是否手输 0 表示不是，1表示是 （有接班人则不是手输，没有则为手输）
        };
        const res = await api.postChangeShiftsSave(data);
        if (+res.resultCode !== 200) {
            form?.setFields([
                {
                    name: ['takeLoginId'],
                    errors: [res.resultMsg],
                },
            ]);
            return;
        }

        setVisible(false);
        message.success('交接班成功');
        // 自动切换登录账号
        handleSwitchUser?.(takeInfo.takeUserId);
        setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            getDataInfo && getDataInfo(true);
        }, 2000);
    };

    // 当班人验证码获取
    const mobileCallback = async (value, name) => {
        const data = {
            appId,
            loginId: name === 'takeMobile' ? takeInfo.takeLoginId : loginId, // 接班人时接班人id 当班人选当班人id
            userMobile: value,
        };
        const res = await api.postSMSCode(data);
        if (+res.code === 200) {
            return true;
        }
        form?.setFields([
            {
                name: [name],
                errors: [res.message],
            },
        ]);
        return false;
    };

    // 获取姓名手机号回调方法
    const takeLoginIdCallback = async (value) => {
        const data = {
            groupId,
            workShiftId,
            dateTime,
            provinceId,
            loginId: value,
            dutyType: 'take',
        };
        const res = await api.postPersonInfo(data);
        const { resultMsg } = res;
        if (+res.resultCode === 200) {
            const { userName, userMobile } = res.resultObj;
            setTakeInfo({
                takeName: userName,
                takeLoginId: value,
                takeMobile: userMobile?.split(',')[0],
                takeUserId: res?.resultObj?.userId,
            });
        } else {
            // 设置接班人账号错误状态及信息
            form?.setFields([
                {
                    name: ['takeLoginId'],
                    errors: [resultMsg],
                },
            ]);
        }

        return false;
    };

    // 修改接班人账号
    const takeLoginIdChange = (value: string) => {
        takeList.forEach((item) => {
            if (item.loginId === value) {
                setTakeInfo({
                    takeName: item.userName,
                    takeLoginId: item.loginId,
                    takeMobile: item.userMobile?.split(',')[0],
                    takeUserId: item.userId,
                });
            }
        });
    };

    return (
        <Modal
            title="交接班认证"
            visible={visible}
            onCancel={handleCancel}
            className="shift-modal"
            maskClosable={false}
            footer={<Footer form={form} setVisible={setVisible} checkHandSubmit={checkHandSubmit} />}
            width={985}
            destroyOnClose
        >
            <Spin spinning={loading}>
                <Form layout="vertical" onFinish={onFinish} form={form} className="shift-form">
                    <HeadBox title="当班人" color="#4990E2" width={340}>
                        <Form.Item label="姓名" name="userName" rules={[{ required: true, message: '请输入姓名!' }]}>
                            <Input className="no-edit" />
                        </Form.Item>
                        <Form.Item label="账号" name="loginId" rules={[{ required: true, message: '请输入账号!' }]}>
                            <Input className="no-edit" />
                        </Form.Item>
                        <Form.Item label="手机号" name="userMobile" rules={[{ required: true, message: '手机号不能为空!' }]}>
                            <GetCodeItem
                                form={form}
                                name="userMobile"
                                getCallback={(value) => mobileCallback(value, 'userMobile')}
                                className="no-edit"
                            />
                        </Form.Item>
                        <Form.Item label="验证码" name="currentCode" rules={[{ required: true, message: '请输入验证码!' }]}>
                            <Input placeholder="请输入验证码" />
                        </Form.Item>
                    </HeadBox>

                    <Segmentation />

                    <HeadBox title="接班人" color="#E6E6E6" width={340}>
                        <Form.Item label="姓名" name="takeName" rules={[{ required: true, message: '姓名不能为空!' }]}>
                            <Input disabled={!nextAccount} className="no-edit" />
                        </Form.Item>

                        {nextAccount ? (
                            <Form.Item label="账号" name="takeLoginId" rules={[{ required: true, message: '请输入账号!' }]}>
                                <Select onChange={takeLoginIdChange} style={{ height: 40 }}>
                                    {takeList.map((item) => (
                                        <Option value={item.loginId} id={item.loginId}>
                                            {item.loginId}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : (
                            <Form.Item label="账号" name="takeLoginId" rules={[{ required: true, message: '请输入账号!' }]}>
                                <GetCodeItem
                                    buttonText="获取姓名手机号"
                                    countdownType={false}
                                    form={form}
                                    name="takeLoginId"
                                    placeholder="无接班人，请输入接班账号!"
                                    suffix={suffix}
                                    getCallback={takeLoginIdCallback}
                                />
                            </Form.Item>
                        )}

                        <Form.Item label="手机号" name="takeMobile" rules={[{ required: true, message: '手机号不能为空!' }]}>
                            <GetCodeItem
                                form={form}
                                name="takeMobile"
                                getCallback={(value) => mobileCallback(value, 'takeMobile')}
                                className="no-edit"
                            />
                        </Form.Item>
                        <Form.Item label="验证码" name="nextCode" rules={[{ required: true, message: '请输入验证码!' }]}>
                            <Input placeholder="请输入验证码" />
                        </Form.Item>
                    </HeadBox>
                </Form>
            </Spin>
        </Modal>
    );
});

export default ShiftInformationModal;
