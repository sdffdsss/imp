/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, forwardRef, useEffect, useCallback, useImperativeHandle, useRef } from 'react';
import { Form, message, Row, Col, Select, Input, Button, Tag } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
// import produce from 'immer';
import formatReg from '@Common/formatReg';
import uniqBy from 'lodash/uniqBy';

interface IUser {
    email?: string;
    groupId?: number;
    groupIds?: string;
    groupNames?: string;
    userMobile?: string;
    userId?: string;
    userName?: string;
}
interface IOutputData {
    [groupId: number]: {
        users: IUser[];
    };
    temps?: string[];
}

interface IProps {
    mode: 'read' | 'edit';
    getUserGroupList: any;
    getProvinceList: any;
    getUserTableData: any;
    ruleType: 'email' | 'userMobile';
    initData?: IOutputData;
    noticeFinalData?: any;
    disabledProvince?: boolean;
    faultLevel: string[];
    isManualReport?: boolean; // 是否为手工上报
    professionalList?: any[]; // 专业列表
    defaultProfessional?: string; // 默认专业
    reportType?: 'First' | 'Continue' | 'Final'; // 报告类型：首报、续报、终报
    // 新增：获取手工上报通知设置的接口
    getManualReportNotificationSetting?: (data: any) => Promise<any>;
}

const supportRuleTypeMap = {
    email: {
        columnTitle: '邮箱',
        temp: {
            formLabel: '临时邮件地址',
            validateEmptyTip: '请输入邮件地址',
            validateRepeatTip: '邮件地址重复',
            validateFormatTip: '邮件地址格式不正确',
        },
    },
    userMobile: {
        columnTitle: '电话',
        temp: {
            formLabel: '临时手机号码',
            validateEmptyTip: '请输入手机号码',
            validateRepeatTip: '手机号码重复',
            validateFormatTip: '手机号格式不对',
        },
    },
};

export default forwardRef((props: IProps, ref) => {
    const {
        mode,
        ruleType,
        getProvinceList,
        getUserGroupList,
        getUserTableData,
        noticeFinalData,
        disabledProvince = false,
        faultLevel,
        isManualReport = false,
        professionalList = [],
        defaultProfessional,
        reportType,
        getManualReportNotificationSetting,
    } = props;
    const [provinceList, setProvinceList]: any = useState([]);
    const [userGroupList, setUserGroupList]: any = useState([]);
    const [provinceId, setProvinceId]: any = useState(null);
    const [userGroupId, setUserGroupId]: any = useState(null);
    const [userList, setUserList]: any = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTableData, setSelectedTableData] = useState<any[]>([]);
    const [currentProfessional, setCurrentProfessional] = useState(defaultProfessional || professionalList[0]?.value || '');

    const [form] = Form.useForm();
    const tempTips = supportRuleTypeMap[ruleType].temp;

    // 专业列表容器的ref
    const professionalListRef = useRef<HTMLDivElement>(null);

    // 记录当前tab下是否全选标志位
    const [isSelectedAll, setIsSelectedAll] = useState(false);
    const [finalData, setFinalData]: any = useState<IOutputData>(noticeFinalData || { temps: [] });
    const [checkedUsers, setCheckedUsers]: any = useState([]);

    const originDataList = useRef<any>({ flag: true, list: [] });

    // const [outputData, setOutputData] = useState<IOutputData>(initData);

    useEffect(() => {
        getProvinceList().then((res) => {
            if (res && res.data) {
                let list = res.data.map((item) => ({
                    ...item,
                    label: item.zoneName,
                    value: item.zoneId,
                }));

                // 手工上报只显示"集团"选项
                if (isManualReport) {
                    list = list.filter((item) => item.zoneName === '集团');
                }

                setProvinceList(list);
                setProvinceId(list[0]?.value);
            }
        });
    }, [isManualReport]);

    useEffect(() => {
        if (userGroupId !== null) {
            let currentData: any[] = [];
            currentData = currentData.concat(finalData[userGroupId] || []);
            const currentSelectedUser = selectedTableData.filter((item) => {
                return userList?.some((u) => u.userId === item.userId);
            });
            currentData = currentData.concat(currentSelectedUser);
            currentData = uniqBy(currentData, 'userId');
            // console.log(currentData, 'selectedTableData');
            if (originDataList.current.flag) {
                originDataList.current.flag = false;
                originDataList.current.list = selectedTableData;
            }
            setCheckedUsers(currentData);
        }
    }, [finalData, userGroupId, userList, selectedTableData]);

    useEffect(() => {
        const tableData: any = [];
        const groupIds = Object.keys(finalData).filter((item) => item !== 'temps');
        groupIds.forEach((groupId) => {
            finalData[groupId].forEach((item) => {
                tableData.push({
                    ...item,
                    provinceNames: item.zoneName,
                });
            });
        });
        // console.log('tableData:', tableData);
        setSelectedTableData(uniqBy(tableData, 'userId'));
    }, [finalData]);
    useEffect(() => {
        const currentProvince = provinceList.find((item) => {
            return item.value === provinceId;
        });

        if (!currentProvince) {
            return;
        }
        getUserGroupList({ zoneId: currentProvince.zoneId, zoneLevel: currentProvince.zoneLevel }).then((res) => {
            if (res?._embedded?.groupResourceList) {
                const list = res?._embedded?.groupResourceList.map((item) => ({
                    ...item,
                    label: item.groupName,
                    value: item.groupId,
                }));

                setUserGroupList(list);
                setUserGroupId(list[0]?.value);
            }
        });
    }, [provinceId]);

    useEffect(() => {
        const currentUserGroup = userGroupList.find((item) => {
            return item.value === userGroupId;
        });
        const { list } = originDataList.current;
        if (!currentUserGroup) {
            return;
        }
        setLoading(true);
        getUserTableData(userGroupId).then((res) => {
            setLoading(false);
            if (res && res.data) {
                const resData = res.data.map((el) => {
                    const findItem = list.find((item) => item.userId === el.userId);
                    if (findItem && findItem.originType === 'origin') {
                        return {
                            ...el,
                            originType: 'origin',
                        };
                    }
                    return el;
                });
                console.log(resData);
                setUserList(resData);
            }
        });
    }, [userGroupId]);

    // 专业切换时重新获取数据
    useEffect(() => {
        if (isManualReport && currentProfessional && getManualReportNotificationSetting) {
            // 构建报告类型映射
            const reportTypeMap = {
                First: 0,
                Continue: 1,
                Final: 2,
            };

            const params = {
                reportType: reportTypeMap[reportType] || 0,
                professionalType: currentProfessional,
            };

            // 调用接口获取该专业和报告类型的通知设置
            getManualReportNotificationSetting(params)
                .then((res) => {
                    if (res && res.data) {
                        const { notificationUser, notificationTel } = res.data;

                        // 构建回显数据结构
                        const backfillData: IOutputData = { temps: [] };

                        // 处理临时手机号码
                        if (notificationTel) {
                            const tempPhones = notificationTel.split(',').filter((phone) => phone && phone !== 'null' && phone !== '');
                            backfillData.temps = tempPhones;
                        }

                        // 处理用户选择
                        if (notificationUser) {
                            const userIds = notificationUser.split(',').filter((id) => id && id !== 'null' && id !== '');

                            if (userIds.length > 0 && userGroupId) {
                                const selectedUsers = userList.filter((user) => userIds.includes(user.userId) && user[ruleType]);
                                if (selectedUsers.length > 0) {
                                    backfillData[userGroupId] = selectedUsers;
                                }
                            }
                        }

                        setFinalData(backfillData);
                    }
                })
                .catch((error) => {
                    console.error('获取手工上报通知设置失败:', error);
                    // 如果接口失败，清空数据
                    setFinalData({ temps: [] });
                });
        }
    }, [currentProfessional, reportType, isManualReport, getManualReportNotificationSetting, userGroupId, userList, ruleType]);

    useEffect(() => {
        if (!userList || userList.length === 0) {
            setIsSelectedAll(false);
        } else {
            setIsSelectedAll(
                userList.every((item) => {
                    return checkedUsers.find((user) => user.userId === item.userId) || !item[ruleType] || item[ruleType] === '';
                }),
            );
        }
    }, [userList, checkedUsers]);

    const onRowSelectChange = useCallback(
        (selectedRowKeys, selectedRows) => {
            if (userGroupId === null) {
                return;
            }

            setFinalData((prev) => {
                return {
                    ...prev,
                    [userGroupId]: selectedRows,
                };
            });
        },
        [userGroupId],
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onRowSelect = useCallback((record, selected, selectedRows, nativeEvent) => {
        // 点击单个取消的时候需要将其他组存在的用户也取消
        if (!selected) {
            console.log('单个取消了', record);
            setFinalData((prev) => {
                const groupIds = Object.keys(prev).filter((item) => item !== 'temps');
                groupIds.forEach((groupId) => {
                    // eslint-disable-next-line no-param-reassign
                    prev[groupId] = prev[groupId].filter((item) => item.userId !== record.userId);
                });
                return prev;
            });
        }
    }, []);
    const onRowSelectAll = useCallback((selected, selectedRows, changeRows) => {
        // 点击全选按钮取消全部的时候需要将其它组存在的用户也取消
        console.log({ selected, selectedRows, changeRows });
        if (!selected) {
            console.log('全部取消了', changeRows);
            setFinalData((prev) => {
                const groupIds = Object.keys(prev).filter((item) => item !== 'temps');
                groupIds.forEach((groupId) => {
                    // eslint-disable-next-line no-param-reassign
                    prev[groupId] = prev[groupId].filter((item) => {
                        return changeRows.every((row) => row.userId !== item.userId);
                    });
                });

                return prev;
            });
        }
    }, []);

    function provinceChange(value) {
        setProvinceId(value);
        setUserGroupList([]);
    }

    async function userGroupChange(value) {
        setUserGroupId(value);
    }

    // 切换全选/全不选
    const handleSwitchSelectedAll = useCallback(() => {
        if (userGroupId === null) {
            return;
        }
        // 由于需要全选全不选功能，所以表格只能查回全部数据，前端做分页
        const usefulUserList = userList.filter((item) => !!item[ruleType]);
        const filterData = userList.filter((item) => item.originType === 'origin');

        setFinalData((prev) => {
            return {
                ...prev,
                [userGroupId]: !isSelectedAll ? usefulUserList : filterData,
            };
        });
        // 点击全不选的时候 需要取消其它组的存在的用户，手动触发onRowSelectAll全不选方法即可
        // if (isSelectedAll) onRowSelectAll(false, filterData, usefulUserList);
    }, [userGroupId, userList, isSelectedAll]);

    const onTagClose = (item) => {
        setFinalData((prev) => {
            return {
                ...prev,
                temps: prev.temps.filter((temp) => temp !== item),
            };
        });
    };

    function handleTempAdd() {
        const temp = form.getFieldValue('temp-email');

        if (!temp) {
            message.warn(tempTips.validateEmptyTip);
            return;
        }

        if (finalData?.temps.includes(temp)) {
            message.warn(tempTips.validateRepeatTip);
            return;
        }
        if (formatReg[ruleType].test(temp)) {
            setFinalData((prev) => {
                return {
                    ...prev,
                    temps: prev.temps.concat([temp]),
                };
            });

            form.setFieldsValue({ 'temp-email': '' });
        } else {
            message.warn(tempTips.validateFormatTip);
        }
    }

    const isShowError = (data) => {
        const tableData = data;
        let res = false;
        if (tableData && Array.isArray(tableData) && tableData.length > 0) {
            res = tableData.some((item) => {
                return !item[ruleType] || item[ruleType] === '';
            });
        }
        return res;
    };

    useImperativeHandle(
        ref,
        () => ({
            getValues: () => finalData,
            getProvinceList: () => provinceList,
            onTagClose,
            getSelectedTableData: () => selectedTableData,
            handleSetFinalData: () => setFinalData,
            // 新增：获取当前选中的专业信息
            getCurrentProfessional: () => ({
                value: currentProfessional,
                label: professionalList.find((item) => item.value === currentProfessional)?.label || '',
            }),
            // 新增：获取完整的选择数据（包含专业）
            getCompleteValues: () => ({
                professional: {
                    value: currentProfessional,
                    label: professionalList.find((item) => item.value === currentProfessional)?.label || '',
                },
                users: finalData, // 原有的用户和手机号数据
            }),
            // 新增：重置组件状态
            reset: () => {
                setFinalData({ temps: [] });
                setCheckedUsers([]);
                setSelectedTableData([]);
                setIsSelectedAll(false);
                setCurrentProfessional(defaultProfessional || professionalList[0]?.value || '');
                form.resetFields();
                originDataList.current = { flag: true, list: [] };
            },
            // 新增：滚动到专业列表
            scrollToProfessionalList: () => {
                if (professionalListRef.current && isManualReport) {
                    professionalListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            },
        }),
        [finalData, provinceList, currentProfessional, professionalList, form, defaultProfessional],
    );

    return (
        <Form style={{ height: '100%' }} form={form}>
            {isManualReport ? (
                // 手工上报：三列布局
                <div style={{ display: 'flex', height: '100%' }}>
                    {/* 左侧专业列 */}
                    <div ref={professionalListRef} style={{ width: '200px', borderRight: '1px solid #f0f0f0', padding: '8px' }}>
                        <div>
                            {professionalList.map((item: any) => (
                                <div
                                    key={item.value}
                                    style={{
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        backgroundColor: currentProfessional === item.value ? '#1890ff' : 'transparent',
                                        color: currentProfessional === item.value ? '#fff' : '#000',
                                        borderRadius: '4px',
                                        marginBottom: '4px',
                                    }}
                                    onClick={() => setCurrentProfessional(item.value)}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 中间：省份、用户组选择和用户列表 */}
                    <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                        <Row style={{ marginBottom: '16px' }}>
                            <Col span={12}>
                                <Form.Item label="省份" labelCol={{ span: 6 }}>
                                    <Select
                                        showSearch
                                        optionFilterProp="label"
                                        style={{
                                            width: 150,
                                            marginLeft: 3,
                                        }}
                                        placeholder="请选择省份"
                                        defaultValue={provinceList[0]?.value}
                                        value={provinceId}
                                        onChange={provinceChange}
                                        options={provinceList}
                                        disabled={disabledProvince}
                                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="用户组" labelCol={{ span: 6 }}>
                                    <Select
                                        showSearch
                                        optionFilterProp="label"
                                        style={{
                                            width: 150,
                                            marginLeft: 3,
                                        }}
                                        placeholder="请选择用户组"
                                        defaultValue={userGroupList[0]?.value}
                                        value={userGroupId}
                                        onChange={userGroupChange}
                                        options={userGroupList}
                                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{ marginBottom: '8px' }}>
                            <Button onClick={handleSwitchSelectedAll}>{isSelectedAll ? '取消全选' : '全选'}</Button>
                        </div>

                        <div style={{ flex: 1, minHeight: 0 }}>
                            <VirtualTable
                                global={window}
                                rowKey={(record) => `${record.userId}`}
                                bordered
                                search={false}
                                options={false}
                                loading={loading}
                                rowSelection={{
                                    selectedRowKeys: checkedUsers.map((item) => {
                                        return item.userId;
                                    }),
                                    onChange: onRowSelectChange,
                                    onSelect: onRowSelect,
                                    onSelectAll: onRowSelectAll,
                                    getCheckboxProps: (record) => {
                                        return {
                                            disabled:
                                                !record[ruleType] ||
                                                record[ruleType] === '' ||
                                                mode === 'read' ||
                                                (record.originType === 'origin' && faultLevel?.includes('0')),
                                        };
                                    },
                                }}
                                dataSource={userList}
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

                            {isShowError(userList) && (
                                <div
                                    style={{
                                        color: '#db2039',
                                        marginLeft: 14,
                                        position: 'relative',
                                        top: -30,
                                        width: 300,
                                    }}
                                >
                                    该用户组下存在电话号码为空的用户,请修改!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 右侧：临时联系方式 */}
                    <div style={{ width: '50%', padding: '0 16px', borderLeft: '1px solid #f0f0f0' }}>
                        <div className="message-user-modal-right">
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
                                {(finalData?.temps || []).map((item, index) => {
                                    return (
                                        <Tag
                                            key={index}
                                            closable={mode !== 'read'}
                                            onClose={() => {
                                                onTagClose(item);
                                            }}
                                        >
                                            {item}
                                        </Tag>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // 非手工上报：左右布局，无专业列
                <div style={{ display: 'flex', height: '100%' }}>
                    {/* 左侧：省份、用户组选择和用户列表 */}
                    <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                        <Row style={{ marginBottom: '16px' }}>
                            <Col span={12}>
                                <Form.Item label="省份" labelCol={{ span: 6 }}>
                                    <Select
                                        showSearch
                                        optionFilterProp="label"
                                        style={{
                                            width: 150,
                                            marginLeft: 3,
                                        }}
                                        placeholder="请选择省份"
                                        defaultValue={provinceList[0]?.value}
                                        value={provinceId}
                                        onChange={provinceChange}
                                        options={provinceList}
                                        disabled={disabledProvince}
                                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="用户组" labelCol={{ span: 6 }}>
                                    <Select
                                        showSearch
                                        optionFilterProp="label"
                                        style={{
                                            width: 150,
                                            marginLeft: 3,
                                        }}
                                        placeholder="请选择用户组"
                                        defaultValue={userGroupList[0]?.value}
                                        value={userGroupId}
                                        onChange={userGroupChange}
                                        options={userGroupList}
                                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{ marginBottom: '8px' }}>
                            <Button onClick={handleSwitchSelectedAll}>{isSelectedAll ? '取消全选' : '全选'}</Button>
                        </div>

                        <div style={{ flex: 1, minHeight: 0 }}>
                            <VirtualTable
                                global={window}
                                rowKey={(record) => `${record.userId}`}
                                bordered
                                search={false}
                                options={false}
                                loading={loading}
                                rowSelection={{
                                    selectedRowKeys: checkedUsers.map((item) => {
                                        return item.userId;
                                    }),
                                    onChange: onRowSelectChange,
                                    onSelect: onRowSelect,
                                    onSelectAll: onRowSelectAll,
                                    getCheckboxProps: (record) => {
                                        return {
                                            disabled:
                                                !record[ruleType] ||
                                                record[ruleType] === '' ||
                                                mode === 'read' ||
                                                (record.originType === 'origin' && faultLevel?.includes('0')),
                                        };
                                    },
                                }}
                                dataSource={userList}
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

                            {isShowError(userList) && (
                                <div
                                    style={{
                                        color: '#db2039',
                                        marginLeft: 14,
                                        position: 'relative',
                                        top: -30,
                                        width: 300,
                                    }}
                                >
                                    该用户组下存在电话号码为空的用户,请修改!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 右侧：临时联系方式 */}
                    <div style={{ width: '50%', padding: '0 16px', borderLeft: '1px solid #f0f0f0' }}>
                        <div className="message-user-modal-right">
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
                                {(finalData?.temps || []).map((item, index) => {
                                    return (
                                        <Tag
                                            key={index}
                                            closable={mode !== 'read'}
                                            onClose={() => {
                                                onTagClose(item);
                                            }}
                                        >
                                            {item}
                                        </Tag>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Form>
    );
});
