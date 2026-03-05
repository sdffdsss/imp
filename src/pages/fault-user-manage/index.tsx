import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, Icon, Select, Form, message, Input } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import * as Api from './api';
import { useSetState } from 'ahooks';
import useLoginInfoModel from '@Src/hox';
import AuthButton from '@Src/components/auth-button';
import ModalContent from './modalContent';
import './index.less';

const FaultUserManage: React.FC = () => {
    const actionRef = useRef<any>();
    const formRef = useRef<any>();
    const hasInitSearchRef = useRef<boolean>(false);
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [editReadonly, setEditReadonly] = useState<boolean>(false);
    const [editingRecord, setEditingRecord] = useState<any>();
    const [editForm] = Form.useForm();
    const [enums, setEnums] = useSetState({
        roles: [],
        professionals: [],
    });
    const modalContentRef = useRef<{
        getSelectedUsers: () => any[];
        getOriginalUsers: () => any[];
    }>(null); // ModalContent组件的引用

    // 获取当前区域信息
    const { currentZone, zoneLevelFlags } = useLoginInfoModel.data;
    const userInfo = JSON.parse(useLoginInfoModel?.data?.userInfo || '{}');
    const currentZoneId = currentZone?.zoneId || 0;
    const currentZoneLevel = currentZone?.zoneLevel || '1';
    
    // 判断是否是集团或大区账号切换到省份
    const isHighLevelUserSwitchedToProvince = () => {
        // 用户原始层级是集团(1)或大区(5)，但当前切换到省份(2)
        const originalZoneLevel = userInfo?.zones?.[0]?.zoneLevel;
        const currentLevel = currentZone?.zoneLevel;
        return (originalZoneLevel === '1' || originalZoneLevel === '5') && currentLevel === '2';
    };

    const columns: any[] = [
        {
            title: '序号',
            dataIndex: 'num',
            align: 'center',
            hideInSearch: true,
            width: 60,
        },
        {
            title: '角色',
            dataIndex: 'roleTypeName',
            align: 'center',
            renderFormItem: (_, { fieldProps }) => (
                <Select
                    showSearch
                    mode="multiple"
                    maxTagCount={3}
                    placeholder="请选择角色"
                    options={enums.roles || []}
                    optionFilterProp="label"
                    allowClear
                    // onChange={(values: any) => {
                    //     if (Array.isArray(values) && values.includes('__ALL__')) {
                    //         const allValues = (enums.roles || []).map((item: any) => item.value);
                    //         formRef.current?.setFieldsValue?.({ roleTypeName: allValues });
                    //         return;
                    //     }
                    //     fieldProps?.onChange?.(values);
                    // }}
                    {...fieldProps}
                />
            ),
        },
        {
            title: '专业',
            dataIndex: 'professionalName',
            align: 'center',
            renderFormItem: (_, { fieldProps }) => (
                <Select
                    showSearch
                    mode="multiple"
                     maxTagCount={3}
                    placeholder="请选择专业"
                    options={enums.professionals || []}
                    optionFilterProp="label"
                    allowClear
                    // onChange={(values: any) => {
                    //     if (Array.isArray(values) && values.includes('__ALL__')) {
                    //         const allValues = (enums.professionals || []).map((item: any) => item.value);
                    //         formRef.current?.setFieldsValue?.({ professionalName: allValues });
                    //         return;
                    //     }
                    //     fieldProps?.onChange?.(values);
                    // }}
                    {...fieldProps}
                />
            ),
        },
        {
            title: '人员',
            dataIndex: 'userNames',
            align: 'center',
            renderFormItem: (_, { fieldProps }) => <Input allowClear placeholder="请输入人员" {...fieldProps} />,
        },
        {
            title: '操作',
            dataIndex: 'actions',
            valueType: 'option',
            fixed: 'right',
            width: 180,
            align: 'center',
            hideInSearch: true,
            render: (_: any, row: any) => {
                // 检查row对象结构
                return [
                    <Button
                        type="text"
                        title="查看"
                        onClick={() => {
                            viewUser(row);
                        }}
                    >
                        <Icon antdIcon type="EyeOutlined" />
                    </Button>,
                    <AuthButton
                        authKey="troubleshootingWorkbench:ruleUserEdit"
                        type="text"
                        title="编辑"
                        onClick={() => {
                            editUser(row);
                        }}
                    >
                        <Icon antdIcon type="EditOutlined" />
                    </AuthButton>,

                    <AuthButton
                        authKey="troubleshootingWorkbench:ruleUserDelete"
                        type="text"
                        title="删除"
                        onClick={() => {
                            deleteUser(row);
                        }}
                        disabled={row.roleEditType === 2 || isHighLevelUserSwitchedToProvince()} // 内置角色不可删除，集团或大区账号切换到省份后也不可删除
                    >
                        <Icon antdIcon type="DeleteOutlined" />
                    </AuthButton>,
                ];
            },
        },
    ];

    const normalizeMultiSelect = (value: any) => {
        const list = Array.isArray(value) ? value : [];
        return list.filter((v) => v !== '' && v !== undefined && v !== null);
    };

    const request = async (_params: any) => {
        // 使用正确的字段名映射筛选值
        const params: any = {
            pageNum: _params.current || 1,
            pageSize: _params.pageSize || 10,
            zoneId: currentZoneId,
            roleTypeIdList: normalizeMultiSelect(_params.roleTypeName),
            professionalIdList: normalizeMultiSelect(_params.professionalName),
            userName: _params.userNames || '',
        };

        return Api.getDataList(params)
            .then((res) => {
                if (res && res.code === 200 && res.data) {
                    return {
                        success: res.success ?? true,
                        total: res.total ?? 0,
                        data: Array.isArray(res.data) ? res.data : res.data?.list || [],
                    };
                } else {
                    return {
                        success: false,
                        total: 0,
                        data: [],
                    };
                }
            })
            .catch(() => {
                return {
                    success: false,
                    total: 0,
                    data: [],
                };
            });
    };

    const resetSearch = () => {
        formRef.current?.setFieldsValue?.({
            roleTypeName: [''],
            professionalName: [''],
            userNames: undefined,
        });
        formRef.current?.submit?.();
    };

    const viewUser = (row: any) => {
        // 转换数据格式，匹配表单字段名
        const actualId = row.id;
        const professionalForForm =
            row.professionalName === undefined || row.professionalName === null || row.professionalName === ''
                ? undefined
                : row.professionalId === undefined || row.professionalId === null || row.professionalId === ''
                ? undefined
                : String(row.professionalId);
        const formData = {
            ...row,
            id: actualId,
            role: row.roleTypeId === undefined || row.roleTypeId === null || row.roleTypeId === '' ? '' : String(row.roleTypeId),
            professional: professionalForForm,
            personnel: row.userNames,
            roleId: actualId,
        };
        setEditingRecord(formData);
        setEditReadonly(true);
        editForm.resetFields();
        editForm.setFieldsValue(formData);
        setEditVisible(true);
    };

    const editUser = (row: any) => {
        // 转换数据格式，匹配表单字段名
        const actualId = row.id;
        const professionalForForm =
            row.professionalName === undefined || row.professionalName === null || row.professionalName === ''
                ? undefined
                : row.professionalId === undefined || row.professionalId === null || row.professionalId === ''
                ? undefined
                : String(row.professionalId);
        const formData = {
            ...row,
            id: actualId,
            role: row.roleTypeId === undefined || row.roleTypeId === null || row.roleTypeId === '' ? '' : String(row.roleTypeId),
            professional: professionalForForm,
            personnel: row.userNames,
            roleId: actualId,
        };
        setEditingRecord(formData);
        setEditReadonly(false);
        editForm.resetFields();
        editForm.setFieldsValue(formData);
        setEditVisible(true);
    };

    const deleteUser = (row: any) => {
        const actualId = row.id;
        Modal.confirm({
            title: '提示',
            content: '确定要删除该角色吗？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                Api.deleteRole({ id: actualId })
                    .then(() => {
                        message.success('删除成功');
                        actionRef.current?.reload?.();
                    })
                    .catch(() => {
                        message.error('删除失败');
                    });
            },
        });
    };

    const handleAddRole = () => {
        setEditingRecord({});
        setEditReadonly(false);
        editForm.resetFields();
        setEditVisible(true);
    };

    const handleSaveRole = () => {
        editForm.validateFields().then(async (values) => {
            try {
                let roleId = editingRecord?.id;

                const selectedUsers = modalContentRef.current?.getSelectedUsers() || [];
                if (selectedUsers.length === 0) {
                    message.warning('请至少选择一个用户');
                    return;
                }

                // 获取角色和专业名称
                const roleItem = enums.roles?.find((item: any) => item.value === values.role);
                const professionalItem = enums.professionals?.find((item: any) => item.value === values.professional);
                const professionalIdForSave =
                    values.professional === undefined || values.professional === null || values.professional === '' ? null : values.professional;
                const professionalNameForSave = professionalIdForSave === null ? '' : professionalItem?.label || '';

                // 如果是新增角色
                if (!editingRecord || typeof editingRecord.id === 'undefined' || editingRecord.id === null) {
                    // 先创建角色
                    const addResponse = await Api.addRole({
                        roleTypeId: values.role,
                        roleTypeName: roleItem?.label || '',
                        professionalId: professionalIdForSave,
                        professionalName: professionalNameForSave,
                    });

                    if (addResponse && addResponse.code === 200) {
                        // 创建成功后，调用列表接口获取角色ID
                        const listResponse = await Api.getDataList({
                            roleTypeIdList: [],
                            professionalIdList: [],
                            userName: '',
                            zoneId: currentZoneId,
                            pageNum: 1,
                            pageSize: 10,
                        });
                        const roleList = Array.isArray(listResponse?.data) ? listResponse.data : listResponse?.data?.list || [];

                        if (listResponse && listResponse.code === 200 && Array.isArray(roleList)) {
                            // 从列表中找到刚创建的角色（根据角色类型和专业匹配）
                            // 注意：values.* 可能是字符串，返回的 role.* 可能是数字
                            const roleTypeId = String(values.role);
                            const professionalId =
                                values.professional === undefined || values.professional === null || values.professional === ''
                                    ? ''
                                    : String(values.professional);
                            const createdRole = roleList
                                .filter((role: any) => {
                                    const roleProfessionalId =
                                        role?.professionalId === undefined || role?.professionalId === null || role?.professionalId === ''
                                            ? ''
                                            : String(role.professionalId);
                                    return String(role.roleTypeId) === roleTypeId && roleProfessionalId === professionalId;
                                })
                                .reduce((max: any, cur: any) => {
                                    if (!max) return cur;
                                    const maxId = Number(max.id);
                                    const curId = Number(cur.id);
                                    return curId > maxId ? cur : max;
                                }, null);

                            if (createdRole && createdRole.id) {
                                roleId = createdRole.id;
                            } else {
                                console.error('创建角色成功，但在列表中找不到该角色:', roleList);
                                message.error('创建角色成功，但获取角色ID失败');
                                return;
                            }
                        } else {
                            console.error('获取角色列表失败:', listResponse);
                            message.error('创建角色成功，但获取角色列表失败');
                            return;
                        }
                    } else {
                        message.error(addResponse?.message || '创建角色失败');
                        return;
                    }
                } else {
                    // 如果是编辑角色，先更新角色基本信息
                    const editResponse = await Api.editRole({
                        id: editingRecord.id,
                        roleTypeId: values.role,
                        roleTypeName: roleItem?.label || '',
                        professionalId: professionalIdForSave,
                        professionalName: professionalNameForSave,
                    });

                    if (editResponse && editResponse.code !== 200) {
                        message.error(editResponse?.message || '更新角色失败');
                        return;
                    }
                }

                // 处理用户分配
                if (roleId) {
                    // 直接从ModalContent组件获取当前选中的用户列表和原始用户列表
                    const originalUsers = modalContentRef.current?.getOriginalUsers() || [];
                    const currentUserIds = selectedUsers.map((user: any) => user.id);
                    const originalUserIds = originalUsers.map((user: any) => user.id);

                    // 计算需要添加和删除的用户
                    const usersToAdd = currentUserIds.filter((id: string) => !originalUserIds.includes(id));
                    const usersToRemove = originalUserIds.filter((id: string) => !currentUserIds.includes(id));

                    // 添加新用户
                    if (usersToAdd.length > 0) {
                        const addUserResponse = await Api.addUserToRole({
                            roleId: roleId,
                            userIds: usersToAdd,
                        });

                        if (addUserResponse && addUserResponse.code !== 200) {
                            message.error(addUserResponse?.message || '添加用户失败');
                            return;
                        }
                    }

                    // 删除用户
                    if (usersToRemove.length > 0) {
                        const deleteUserResponse = await Api.deleteUserFromRole({
                            roleId: roleId,
                            userIds: usersToRemove,
                        });

                        if (deleteUserResponse && deleteUserResponse.code !== 200) {
                            message.error(deleteUserResponse?.message || '删除用户失败');
                            return;
                        }
                    }
                }

                message.success(editingRecord?.id ? '更新成功' : '新增成功');
                setEditVisible(false);
                actionRef.current?.reload();
            } catch (error) {
                console.error('保存角色信息失败:', error);
                message.error('保存失败，请重试');
            }
        });
    };

    // 获取枚举值
    useEffect(() => {
        // 获取角色枚举
        Api.getDictByFieldName({ fieldName: 'roleTypeId' }).then((res) => {
            if (res && res.code === 200 && Array.isArray(res.data)) {
                const roles = res.data.map((item: any) => ({
                    label: item.dictValue,
                    value: item.dictKey,
                }));
                roles.unshift({
                    label: '全部',
                    value: '',
                });
                setEnums({ roles });
            }
        });

        // 获取专业枚举
        Api.getDictByFieldName({ fieldName: 'FaultReportProfessional' }).then((res) => {
            if (res && res.code === 200 && Array.isArray(res.data)) {
                const professionals = res.data.map((item: any) => ({
                    label: item.dictValue,
                    value: item.dictKey,
                }));
                professionals.unshift({
                    label: '全部',
                    value: '',
                });
                setEnums({ professionals });
            }
        });
    }, []);

    // 默认筛选：角色/专业 全选；人员为空（查全部）
    useEffect(() => {
        if (hasInitSearchRef.current) return;
        if (!Array.isArray(enums.roles) || enums.roles.length === 0) return;
        if (!Array.isArray(enums.professionals) || enums.professionals.length === 0) return;

        hasInitSearchRef.current = true;
        formRef.current?.setFieldsValue({
            roleTypeName: [''],
            professionalName: [''],
            userNames: undefined,
        });
        formRef.current?.submit?.();
    }, [enums.roles, enums.professionals]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <VirtualTable
                actionRef={actionRef}
                global={window}
                columns={columns}
                request={request}
                formRef={formRef}
                rowKey={(record: any) => record?.id || `${Math.random()}`}
                bordered
                tableAlertRender={false}
                tableAlertOptionRender={false}
                search={{
                    span: 6,
                    collapsed: false,
                    collapseRender: false,
                }}
                onReset={resetSearch}
                scroll={{ x: 'max-content' }}
                className="fault-user-table"
                toolBarRender={() => [
                    <AuthButton authKey="troubleshootingWorkbench:ruleUseradd" type="primary" onClick={handleAddRole} title="新增用户">
                        新增用户
                    </AuthButton>,
                ]}
            />

            <Modal
                title={`${
                    editReadonly ? '查看' : editingRecord && typeof editingRecord.id !== 'undefined' && editingRecord.id !== null ? '编辑' : '新增'
                }`}
                visible={editVisible}
                onCancel={() => setEditVisible(false)}
                className="edit-user-modal"
                width={900}
                destroyOnClose
                footer={
                    editReadonly
                        ? [
                              <Button key="close" onClick={() => setEditVisible(false)}>
                                  关闭
                              </Button>,
                          ]
                        : [
                              <Button key="save" type="primary" onClick={handleSaveRole}>
                                  保存
                              </Button>,
                              <Button key="close" onClick={() => setEditVisible(false)}>
                                  关闭
                              </Button>,
                          ]
                }
            >
                <ModalContent
                    ref={modalContentRef}
                    form={editForm}
                    editingRecord={editingRecord}
                    enums={enums}
                    disabled={editReadonly}
                    disableRoleProfessional={
                        !editReadonly && !!(editingRecord && typeof editingRecord.id !== 'undefined' && editingRecord.id !== null)
                    }
                    noticeTemplateList={[]}
                    setNoticeVisible={() => {}}
                    zoneId={currentZoneId}
                    zoneLevel={currentZoneLevel}
                />
            </Modal>
        </div>
    );
};

export default FaultUserManage;
