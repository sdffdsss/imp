import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Form, message, Row, Col, InputNumber, Select, Input, Button, Tabs, Tag } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import produce from 'immer';
import request from '@Common/api';
import { limitDecimals } from '@Common/format';
import formatReg from '@Common/formatReg';

interface IUser {
    email?: string;
    groupId?: number;
    groupIds?: string;
    groupNames?: string;
    mobilephone?: string;
    userId?: string;
    userName?: string;
}
interface IOutputData {
    [key: number]: {
        interval: undefined | number;
        users: IUser[];
        temps: string[];
    };
}
interface IOptions {
    showInterval: boolean;
}
interface IProps {
    tabKey: string;
    mode: 'read' | 'edit';
    userGroupList: any[];
    ruleType: 'email' | 'mobilephone';
    initData?: IOutputData;
    options?: IOptions;
}

const ENUMSNUMS = ['一', '二', '三', '四', '五'];
const supportRuleTypeMap = {
    email: {
        columnTitle: '邮箱',
        temp: {
            formLabel: '临时邮件地址',
            validateEmptyTip: '请输入邮件地址',
            validateRepeatTip: '邮件地址重复',
            validateFormatTip: '邮件地址格式不对',
        },
    },
    mobilephone: {
        columnTitle: '电话',
        temp: {
            formLabel: '临时手机号码',
            validateEmptyTip: '请输入手机号码',
            validateRepeatTip: '手机号码重复',
            validateFormatTip: '手机号格式不对',
        },
    },
};

export default forwardRef(function UserSelectModal(props: IProps, ref) {
    const { tabKey: tabKeyProps, mode, userGroupList, ruleType, initData = {}, options = { showInterval: true } } = props;
    const [form] = Form.useForm();
    const tempTips = supportRuleTypeMap[ruleType].temp;
    const [tabKey, setTabKey] = useState(tabKeyProps || '0');
    // 记录当前tab下是否全选标志位
    const [isSelectedAll, setIsSelectedAll] = useState(false);
    const [outputData, setOutputData] = useState<IOutputData>(initData);
    const [showInfoInTab, setShowInfoInTab] = useState<
        Record<
            string,
            {
                groupId: undefined | number;
                users: any[];
            }
        >
    >({
        0: {
            groupId: undefined,
            users: [],
        },
        1: {
            groupId: undefined,
            users: [],
        },
        2: {
            groupId: undefined,
            users: [],
        },
        3: {
            groupId: undefined,
            users: [],
        },
        4: {
            groupId: undefined,
            users: [],
        },
    });

    useEffect(() => {
        getUserTableData(showInfoInTab[tabKey]?.groupId || userGroupList[0]?.value).then((showUsers) => {
            setShowInfoInTab((prev) => {
                return produce(prev, (draft) => {
                    draft[tabKey].users = showUsers;
                });
            });
        });
    }, [tabKey]);

    useEffect(() => {
        setIsSelectedAll(
            showInfoInTab[tabKey]?.users.every((item) => outputData[tabKey]?.users.findIndex((itemIn) => itemIn.userId === item.userId) > -1) ||
                false,
        );
    }, [showInfoInTab, tabKey, outputData]);

    useImperativeHandle(
        ref,
        () => ({
            getValues: () => outputData,
        }),
        [outputData],
    );

    function onTabChange(activeKey) {
        if (activeKey !== tabKey) {
            const tabKeyNum = parseInt(tabKey, 10);

            const totalSelectUserNum = outputData[tabKeyNum].users.length + outputData[tabKeyNum].temps.length;
            if (totalSelectUserNum > 0) {
                setTabKey(activeKey);
                form.setFieldsValue({ 'temp-email': '' });
            } else {
                message.error(`第${tabKeyNum + 1}次未设置用户，请设置`);
            }
        }
    }

    async function getUserTableData(groupId) {
        if (!groupId) {
            return;
        }
        const res = await request('alarmmodel/filter/v1/filter/userinfo', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                groupId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        });
        if (Array.isArray(res?.data)) {
            return res.data;
        } else {
            return [];
        }
    }

    function onRowSelectChange(selectedRowKeys, selectedRows) {
        setOutputData((prev) =>
            produce(prev, (draft) => {
                // 在这里一次性push，然后执行去重
                draft[tabKey].users.push(...selectedRows);

                const tempArr: IUser[] = [];
                draft[tabKey].users.forEach((item) => {
                    const hasInserted = tempArr.some((itemIn) => itemIn.userId === item.userId);
                    if (!hasInserted) {
                        tempArr.push(item);
                    }
                });

                draft[tabKey].users = tempArr;
            }),
        );
    }

    async function userGroupChange(value) {
        const users = await getUserTableData(value);

        setShowInfoInTab((prev) => {
            return produce(prev, (draft) => {
                draft[tabKey] = { groupId: value, users };
            });
        });
    }

    // 切换全选/全不选
    function handleSwitchSelectedAll() {
        setOutputData((prev) =>
            produce(prev, (draft) => {
                showInfoInTab[tabKey].users.forEach((item) => {
                    // 该项是否是选中状态
                    const searchIndex = draft[tabKey].users.findIndex((itemIn) => itemIn.userId === item.userId);
                    // 全选状态 => 全不选状态
                    if (isSelectedAll) {
                        draft[tabKey].users.splice(searchIndex, 1);
                    } else {
                        // 非全选状态 => 全选状态
                        // 非全选状态下 如果该项是未选中才会添加
                        if (searchIndex === -1) {
                            draft[tabKey].users.push(item);
                        }
                    }
                });
            }),
        );
    }

    function handleTempAdd() {
        const temp = form.getFieldValue('temp-email');

        if (!temp) {
            message.warn(tempTips.validateEmptyTip);
            return;
        }

        if (outputData[tabKey]?.temps.includes(temp)) {
            message.warn(tempTips.validateRepeatTip);
            return;
        }
        if (formatReg[ruleType].test(temp)) {
            setOutputData((prev) =>
                produce(prev, (draft) => {
                    draft[tabKey].temps.push(temp);
                }),
            );
            form.setFieldsValue({ 'temp-email': '' });
        } else {
            message.warn(tempTips.validateFormatTip);
        }
    }

    return (
        <Form style={{ height: '100%' }} form={form}>
            <Tabs type="card" style={{ flex: 1 }} onChange={onTabChange} activeKey={`${tabKey}`}>
                {Object.keys(outputData).map((_, index) => (
                    <Tabs.TabPane tab={`第${ENUMSNUMS[index]}次`} key={index} forceRender>
                        <div style={{ display: 'flex', height: '100%' }}>
                            <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                                <Form.Item label="用户组" labelCol={{ span: 4 }} name={'userGroup'}>
                                    <Select
                                        showSearch
                                        optionFilterProp="label"
                                        style={{
                                            width: 200,
                                            marginLeft: 3,
                                        }}
                                        placeholder="请选择用户组"
                                        defaultValue={userGroupList[0]?.value}
                                        onChange={userGroupChange}
                                        options={userGroupList}
                                    />
                                    <Button onClick={handleSwitchSelectedAll}>{isSelectedAll ? '取消全选' : '全选'}</Button>
                                </Form.Item>
                                <VirtualTable
                                    global={window}
                                    rowKey={(record) => `${record.userId}`}
                                    bordered
                                    search={false}
                                    options={false}
                                    rowSelection={{
                                        selectedRowKeys: outputData[tabKey].users.map((item) => item.userId),
                                        onChange: onRowSelectChange,
                                        getCheckboxProps: (record) => {
                                            return {
                                                disabled: record[ruleType] === '' || mode === 'read',
                                            };
                                        },
                                    }}
                                    dataSource={showInfoInTab[tabKey].users}
                                    columns={[
                                        {
                                            dataIndex: 'userName',
                                            title: '用户名',
                                            width: 200,
                                        },
                                        {
                                            dataIndex: ruleType,
                                            title: supportRuleTypeMap[ruleType].columnTitle,
                                            width: 200,
                                            ellipsis: true,
                                        },
                                    ]}
                                />
                                {/* {isShowError(userTableData, field.name) && (
                                    <div
                                        style={{
                                            color: '#db2039',
                                            marginLeft: 14,
                                            position: 'relative',
                                            top: -30,
                                            width: 300,
                                        }}
                                    >
                                        该用户组下存在电话号码为空的用户，请修改!
                                    </div>
                                )} */}
                            </div>
                            <div className="message-user-modal-right">
                                {options.showInterval && tabKey !== '0' && (
                                    <Form.Item labelCol={{ span: 5 }} label="时间间隔（分钟）">
                                        <InputNumber
                                            onChange={(value) => {
                                                setOutputData((prev) =>
                                                    produce(prev, (draft) => {
                                                        draft[tabKey].interval = value;
                                                    }),
                                                );
                                            }}
                                            min={0}
                                            formatter={limitDecimals}
                                            parser={limitDecimals}
                                            value={outputData[tabKey].interval}
                                        />
                                    </Form.Item>
                                )}
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label={tempTips.formLabel} labelCol={{ span: 8 }} name="temp-email">
                                            <Input disabled={mode === 'read'} placeholder={tempTips.validateEmptyTip} />
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Button type="primary" disabled={mode === 'read'} onClick={handleTempAdd}>
                                            添加
                                        </Button>
                                    </Col>
                                </Row>

                                <div className="tag-groups">
                                    {(outputData[tabKey]?.temps || []).map((item, index) => {
                                        return (
                                            <Tag
                                                key={index}
                                                onClose={() => {
                                                    setOutputData((prev) =>
                                                        produce(prev, (draft) => {
                                                            draft[tabKey]?.temps.splice(index, 1);
                                                        }),
                                                    );
                                                }}
                                                closable={mode !== 'read'}
                                            >
                                                {item}
                                            </Tag>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </Form>
    );
});
