import React, { useEffect, useState, useImperativeHandle } from 'react';
import { Form, Input, Select } from 'oss-ui';
import ColumnsSortDrag from './components/ColumnsSortDrag';
import { getUserList, getSelectedRoles } from './api';

interface ModalContentProps {
    form: any;
    editingRecord: any;
    enums: any;
    disabled: boolean;
    disableRoleProfessional?: boolean;
    noticeTemplateList: any[];
    setNoticeVisible: (visible: boolean) => void;
    zoneId?: string | number;
    zoneLevel?: string;
}

interface ModalContentRef {
    getSelectedUsers: () => any[];
    getOriginalUsers: () => any[];
}

const ModalContent = React.forwardRef<ModalContentRef, ModalContentProps>((props, ref) => {
    // 暴露selectedUsers和originalUsers给父组件
    React.useImperativeHandle(ref, () => ({
        getSelectedUsers: () => selectedUsers,
        getOriginalUsers: () => originalUsers,
    }));

    const { form, editingRecord, enums, disabled, disableRoleProfessional, zoneId, zoneLevel } = props;
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [selectedUsersView, setSelectedUsersView] = useState<any[]>([]);
    const [originalUsers, setOriginalUsers] = useState<any[]>([]); // 原始用户列表
    const [rightPagetions, setRightPagetions] = useState<any>({ pageSize: 10, pageNum: 1, scroll: true, total: 0 });

    const isBuiltInRole = editingRecord?.roleEditType === 2;

    const roleOptions = (enums.roles || []).filter((item: any) => item?.label !== '全部' && `${item?.value ?? ''}` !== '');
    const professionalOptions = (enums.professionals || []).filter((item: any) => item?.label !== '全部' && `${item?.value ?? ''}` !== '');

    useEffect(() => {
        const loadSelectedUsers = async () => {
            if (editingRecord && editingRecord.id && editingRecord.roleId) {
                try {
                    // 使用 getSelectedRoles 接口获取已分配的用户（全量）
                    const response = await getSelectedRoles({ roleId: editingRecord.roleId });
                    if (response && response.code === 200 && response.data) {
                        // 格式化用户数据，保持所有字段不变
                        const users = response.data.map((item: any) => ({
                            ...item,
                            id: item.userId,
                            userId: item.userId, // 保持userId字段不变
                        }));
                        setSelectedUsers(users);
                        setSelectedUsersView(users);
                        setOriginalUsers(users); // 保存原始用户列表
                        setRightPagetions((prev: any) => ({
                            ...prev,
                            pageNum: 1,
                            total: users.length,
                        }));
                    } else {
                        setSelectedUsers([]);
                        setSelectedUsersView([]);
                        setOriginalUsers([]);
                        setRightPagetions((prev: any) => ({ ...prev, pageNum: 1, total: 0 }));
                    }
                } catch (error) {
                    console.error('获取已分配用户失败:', error);
                    setSelectedUsers([]);
                    setSelectedUsersView([]);
                    setRightPagetions((prev: any) => ({ ...prev, pageNum: 1, total: 0 }));
                }
            } else {
                setSelectedUsers([]);
                setSelectedUsersView([]);
                setRightPagetions((prev: any) => ({ ...prev, pageNum: 1, total: 0 }));
            }
        };

        if (editingRecord && Object.keys(editingRecord).length > 0) {
            form.resetFields();
            // 确保role和professional值的类型与enums中的value类型匹配
            const professionalForForm =
                editingRecord.professionalName === undefined || editingRecord.professionalName === null || editingRecord.professionalName === ''
                    ? undefined
                    : editingRecord.professional === undefined || editingRecord.professional === null || editingRecord.professional === ''
                    ? undefined
                    : String(editingRecord.professional);
            const formValues = {
                ...editingRecord,
                role: editingRecord.role === undefined || editingRecord.role === null || editingRecord.role === '' ? '' : String(editingRecord.role),
                professional: professionalForForm,
            };
            form.setFieldsValue(formValues);
            // 加载已分配的用户
            loadSelectedUsers();
        } else {
            form.resetFields();
            setSelectedUsers([]);
            setSelectedUsersView([]);
            setOriginalUsers([]);
            setRightPagetions((prev: any) => ({ ...prev, pageNum: 1, total: 0 }));
        }
    }, [editingRecord, form]);

    const mapSelectedUsersFromResponse = (response: any) => {
        const rawList = Array.isArray(response?.data) ? response.data : [];
        const users = rawList.map((item: any) => ({
            ...item,
            id: item.userId,
            userId: item.userId,
        }));

        const total =
            response?.total ?? response?.pagination?.total ?? response?.data?.total ?? response?._embedded?.pagination?.total ?? users.length;

        return { users, total: Number(total) || 0 };
    };

    const onPagetionRightChange = async (pageNum: number, searchName?: string) => {
        if (!editingRecord?.roleId) return;
        try {
            const response = await getSelectedRoles({
                roleId: editingRecord.roleId,
                pageNum,
                pageSize: rightPagetions.pageSize,
                loginIdOrUserName: searchName,
            });

            if (!response || response.code !== 200) {
                setRightPagetions((prev: any) => ({ ...prev, pageNum, total: prev.total }));
                return;
            }

            const { users, total } = mapSelectedUsersFromResponse(response);
            setRightPagetions((prev: any) => ({ ...prev, pageNum, total: total || prev.total }));

            setSelectedUsersView((prev: any[]) => {
                if (pageNum === 1) return users;
                const seen = new Set(prev.map((u) => `${u.id}`));
                const next = [...prev];
                users.forEach((u) => {
                    const k = `${u.id}`;
                    if (!seen.has(k)) next.push(u);
                });
                return next;
            });
        } catch (e) {
            setRightPagetions((prev: any) => ({ ...prev, pageNum }));
        }
    };

    // 获取用户数据的函数
    const fetchUsers = async (params: any) => {
        try {
            // 调用区域用户接口，使用传入的zoneId和zoneLevel参数
            const response = await getUserList(params, zoneId?.toString(), zoneLevel);

            // 处理返回的数据格式，转换为组件需要的格式
            if (response && response._embedded && response._embedded.userResourceList) {
                const lastUsers = [];
                response._embedded.userResourceList.forEach((item: any) => {
                    lastUsers.push({
                        ...{ id: item.userId, userName: item.userName },
                        ...item,
                        userId: item.userId,
                    });
                });
                return {
                    data: lastUsers,
                    total: response.pagination ? response.pagination.total : 0,
                };
            }

            return {
                data: [],
                total: 0,
            };
        } catch (error) {
            console.error('获取用户列表失败:', error);
            return {
                data: [],
                total: 0,
            };
        }
    };
    // 人员修改
    const handleUserChange = (users: any[]) => {
        // users 是右侧当前“可见列表”变化后的结果；需要同步到全量 selectedUsers
        setSelectedUsers((prevAll: any[]) => {
            const prevViewIds = new Set(selectedUsersView.map((u) => `${u.id}`));
            const nextViewIds = new Set(users.map((u) => `${u.id}`));

            const removedIds: string[] = [];
            prevViewIds.forEach((id) => {
                if (!nextViewIds.has(id)) removedIds.push(id);
            });

            const addedUsers = users.filter((u) => !prevViewIds.has(`${u.id}`));

            const keptAll = prevAll.filter((u) => !removedIds.includes(`${u.id}`));
            const keptAllIds = new Set(keptAll.map((u) => `${u.id}`));
            const mergedAll = [...keptAll];
            addedUsers.forEach((u) => {
                const id = `${u.id}`;
                if (!keptAllIds.has(id)) mergedAll.push(u);
            });
            return mergedAll;
        });
        setSelectedUsersView(users);
        // 将选中的用户信息更新到表单
        console.log(
            'Selected user IDs:',
            users.map((u) => u.id),
        );
        if (users.length > 0) {
            form.setFieldsValue({
                personnel: users.map((u) => u.userName).join(','),
            });
        } else {
            form.setFieldsValue({
                personnel: '',
            });
        }
    };
    //人员分配展示列
    const userDragColumns = [
        {
            key: 'loginId',
            title: '用户名',
            width: 120,
            search: true,
        },
        {
            key: 'userName',
            title: '姓名',
            width: 80,
            search: true,
        },
        {
            key: 'userMobile',
            title: '联系方式',
            width: 120,
            search: true,
        },
        {
            key: 'deptName',
            title: '部门',
            width: 120,
            render: (text: any, record: any) => {
                return record.extraFields && record.extraFields.deptName ? record.extraFields.deptName : '';
            },
        },
        {
            key: 'roleType',
            title: '角色分类',
            width: 80,
            render: (text: any, record: any) => {
                let typeName = '-';
                const roleType = record && record.roleType ? record.roleType : '';
                switch (roleType) {
                    case '1':
                        typeName = '管理员';
                        break;
                    case '2':
                        typeName = '内置';
                        break;
                    case '3':
                        typeName = '普通用户';
                        break;
                    case '4':
                        typeName = '维护';
                        break;
                    default:
                        typeName = '-';
                }
                return typeName;
            },
        },
    ];

    return (
        <div>
            <Form form={form} labelCol={{ span: 3 }} wrapperCol={{ span: 17 }}>
                <Form.Item name="id" hidden>
                    <Input />
                </Form.Item>

                <Form.Item label="角色" name="role" rules={[{ required: true, message: '请选择角色!' }]} style={{ marginBottom: 24 }}>
                    <Select
                        showSearch
                        placeholder="请选择"
                        options={roleOptions}
                        optionFilterProp="label"
                        disabled={disabled || !!disableRoleProfessional}
                    />
                </Form.Item>

                <Form.Item
                    label="专业"
                    name="professional"
                    dependencies={['role']}
                    rules={[
                        ({ getFieldValue }) => ({
                            required: ['2', '3'].includes(String(getFieldValue('role') ?? '')),
                            message: '请选择专业!',
                        }),
                    ]}
                    style={{ marginBottom: 24 }}
                >
                    <Select
                        showSearch
                        placeholder="请选择"
                        options={professionalOptions}
                        optionFilterProp="label"
                        disabled={disabled || !!disableRoleProfessional}
                        allowClear
                    />
                </Form.Item>

                <Form.Item label="人员分配" required style={{ marginBottom: 8 }} />
                <Form.Item wrapperCol={{ span: 17, offset: 3 }}>
                    <Form.Item name="personnel" rules={[{ required: true, message: '请选择人员!' }]} noStyle>
                        <Input style={{ display: 'none' }} />
                    </Form.Item>
                    <ColumnsSortDrag
                        style={{ width: 750, height: 500 }}
                        columns={userDragColumns}
                        allOptionsLabel="所有用户"
                        selectOptionsLabel="已选用户"
                        request={fetchUsers}
                        searchParams={{
                            searchField: 'userName',
                            paging: true,
                            pageSize: 10,
                            searchRight: true,
                        }}
                        allOptionsList={[]}
                        selectOptionsList={selectedUsersView}
                        onChange={handleUserChange}
                        onPagetionRightChange={onPagetionRightChange}
                        rightPagetions={rightPagetions}
                        actionProps={{ showLeftSearch: true, showRightSearch: true }}
                        isCreate={!editingRecord || !editingRecord.id}
                        disabled={disabled}
                    />
                </Form.Item>
            </Form>
        </div>
    );
});

export default ModalContent;
