import React from 'react';
import { DatePicker, Icon, Tooltip, Button, Select } from 'oss-ui';
import AuthButton from '@Src/components/auth-button';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';

const { RangePicker } = DatePicker;
const getColumns = (props) => {
    const {
        provinceId,
        currProvince,
        recordTime,
        showUserEditViewClick,
        delCurrentUserClick,
        professionalList,
        pagination,
        professionalTypeInitial,
    } = props;
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
            // ellipsis: true,
            align: 'center',
            width: 80,
            search: false,
        },
        {
            title: '省份',
            dataIndex: 'provinceId',
            hideInTable: true,
            initialValue: { value: provinceId, label: currProvince?.regionName },
            renderFormItem: (item, { fieldProps }, form) => {
                return (
                    <SelectCondition
                        {...fieldProps}
                        form={form}
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
            dataIndex: 'professionalDesc',
            // ellipsis: true,
            align: 'center',
            width: 80,
            search: false,
        },
        {
            title: '专业',
            dataIndex: 'professionalType',
            hideInTable: true,
            initialValue: professionalTypeInitial,
            search: {
                transform: (value) => {
                    return { professionalType: value?.length > 0 && !value.includes('-1') ? value?.join(',') : undefined };
                },
            },
            renderFormItem: () => {
                return <Select mode="multiple" maxTagCount="responsive" options={professionalList} optionFilterProp="label" />;
            },
        },
        {
            title: '厂家',
            dataIndex: 'vendorName',
            // ellipsis: true,
            align: 'center',
            width: 80,
            search: false,
        },
        {
            title: '涉及系统',
            dataIndex: 'impactSystem',
            // ellipsis: true,
            align: 'center',
            // width: 200,
        },
        {
            title: '记录时间',
            dataIndex: 'recordTime',
            // ellipsis: true,
            align: 'center',
            order: 1,
            width: 80,
            initialValue: recordTime,
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} showTime />;
            },
        },
        {
            title: '记录人',
            dataIndex: 'recorder',
            // ellipsis: true,
            align: 'center',
            width: 80,
            search: false,
        },
        {
            title: '具体描述',
            dataIndex: 'description',
            // ellipsis: true,
            align: 'center',
            // width: 280,
            search: false,
        },
        {
            title: '恢复时间',
            dataIndex: 'recoveryTime',
            // ellipsis: true,
            align: 'center',
            width: 80,
            search: false,
        },
        {
            title: '问题/隐患处理情况',
            dataIndex: 'disposeInfo',
            // ellipsis: true,
            align: 'center',
            // width: 250,
            search: false,
        },
        {
            title: '操作',
            dataIndex: 'action',
            ellipsis: true,
            align: 'center',
            search: false,
            width: 120,
            fixed: 'right',
            render: (text, row) => [
                <Tooltip title="编辑">
                    <AuthButton
                        key="edit"
                        onClick={() => showUserEditViewClick(row, 'edit')}
                        authKey="record-network-hazard:edit"
                        type="text"
                        antdIcon
                    >
                        <Icon key="userEdit" antdIcon type="EditOutlined" />
                    </AuthButton>
                </Tooltip>,
                <Tooltip title="查看">
                    <Button key="show" onClick={() => showUserEditViewClick(row, 'view')} type="text" antdIcon>
                        <Icon key="userEdit" antdIcon type="SearchOutlined" />
                    </Button>
                </Tooltip>,
                <Tooltip title="删除">
                    <AuthButton
                        key="delete"
                        onClick={() => delCurrentUserClick(row)}
                        authKey="record-network-hazard:delete"
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
