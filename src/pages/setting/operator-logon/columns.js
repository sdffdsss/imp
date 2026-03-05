import React from 'react';
import { DatePicker, Icon, Tooltip, Select } from 'oss-ui';
import AuthButton from '@Src/components/auth-button';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
const { RangePicker } = DatePicker;
const getColumns = (props) => {
    const { showUserEditViewClick, delCurrentUserClick, searchTime, professionalData, provinceId, pagination, professionalTypeInitial } = props;
    return [
        {
            title: '序号',
            dataIndex: 'index',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 40,
            render: (text, row, index) => {
                const { current, pageSize } = pagination;
                return (current - 1) * pageSize + index + 1;
            },
        },
        {
            title: '省份',
            dataIndex: 'provinceName',
            ellipsis: true,
            align: 'center',
            width: 80,
            search: false,
        },
        {
            title: '省份',
            dataIndex: 'provinceId',
            hideInTable: true,
            initialValue: provinceId,
            order: 5,
            renderFormItem: (item, { fieldProps }, form) => {
                return (
                    <SelectCondition
                        {...fieldProps}
                        form={form}
                        disabled
                        title="省份"
                        id="key"
                        label="value"
                        dictName="province_id"
                        searchName="province_id"
                    />
                );
            },
        },
        {
            title: '专业',
            dataIndex: 'professionalName',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
        },
        {
            title: '专业',
            dataIndex: 'professionalType',
            hideInTable: true,
            order: 4,
            initialValue: professionalTypeInitial,
            renderFormItem: () => {
                return (
                    <Select
                        mode="multiple"
                        maxTagCount="responsive"
                        placeholder="全部"
                        options={professionalData.map((item) => {
                            return { label: item.txt, value: item.id.toString() };
                        })}
                        filterOption={(input, option) => option?.label?.includes(input)}
                    />
                );
            },
        },
        {
            title: '日期',
            dataIndex: 'dateTime',
            // ellipsis: true,
            search: false,
            align: 'center',
            hideInSearch: true,
            sorter: true,
            sortDirections: ['descend', 'ascend'],
            width: 140,
        },
        {
            title: '人员姓名',
            dataIndex: 'name',
            ellipsis: true,
            search: false,
            align: 'center',
            // width: 20,
        },
        {
            title: '性别',
            dataIndex: 'sex',
            ellipsis: true,
            align: 'center',
            search: false,
            valueEnum: {
                0: { text: '男' },
                1: { text: '女' },
            },
            width: 80,
        },
        {
            title: '人数',
            dataIndex: 'numberOfPeople',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '单位',
            dataIndex: 'unitName',
            ellipsis: true,
            search: true,
            align: 'center',
            // width: 20,
        },
        {
            title: '日期',
            dataIndex: 'dateTimeRange',
            order: 1,
            hideInTable: true,
            valueType: 'dateTimeRange',
            initialValue: searchTime,
            renderFormItem: () => {
                return <RangePicker placeholder={['起始日期', '结束日期']} />;
            },
        },
        {
            // title: '支撑部门',
            // dataIndex: 'supportDepartment',
            // ellipsis: true,
            // search: true,
            // align: 'center',
            // width: 80,

            title: '工作原因',
            // key: 'workReasons',
            dataIndex: 'workReasons',
            ellipsis: true,
            search: true,
            align: 'center',
            // width: 100,
        },
        {
            title: '工作内容',
            dataIndex: 'workContent',
            ellipsis: true,
            search: false,
            align: 'center',
            // width: 100,
        },
        {
            title: '是否有申请表',
            dataIndex: 'applicationFormFlag',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 140,
            valueEnum: {
                0: { text: '否' },
                1: { text: '是' },
            },
        },
        {
            title: '进入时间',
            dataIndex: 'entryTime',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '离开时间',
            dataIndex: 'leaveTime',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '支撑部门',
            dataIndex: 'supportDepartment',
            ellipsis: true,
            search: true,
            align: 'center',
            // width: 80,
        },
        {
            title: '人员联系方式',
            dataIndex: 'contactInfo',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 120,
        },
        {
            title: '接待人',
            dataIndex: 'receiver',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },

        {
            title: '操作',
            dataIndex: 'actions',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 120,
            fixed: 'right',
            render: (text, row) => [
                <Tooltip title="编辑">
                    <AuthButton key="edit" onClick={() => showUserEditViewClick(row, 'edit')} authKey="recordOperatorLogon:edit" type="text" antdIcon>
                        <Icon key="userEdit" antdIcon type="EditOutlined" />
                    </AuthButton>
                </Tooltip>,
                <Tooltip title="删除">
                    <AuthButton
                        key="delete"
                        onClick={() => delCurrentUserClick(row)}
                        authKey="recordOperatorLogon:delete"
                        type="text"
                        antdIcon
                        addLog
                    >
                        <Icon key="userDel" antdIcon type="DeleteOutlined" />
                    </AuthButton>
                </Tooltip>,
            ],
        },
    ];
};
export default getColumns;
