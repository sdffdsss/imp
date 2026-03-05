import React from 'react';
import { DatePicker, Icon, Tooltip, Button, Select } from 'oss-ui';
import AuthButton from '@Src/components/auth-button';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';

const { RangePicker } = DatePicker;

const getColumns = (props) => {
    const { showUserEditViewClick, delCurrentUserClick, provinceId, searchTime, currProvince, pagination, provinceData } = props;

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
            // initialValue: { value: provinceId, label: currProvince?.regionName },
            renderFormItem: (item, { fieldProps }, form) => {
                return (
                    // <SelectCondition
                    //     {...fieldProps}
                    //     form={form}
                    //     title="省份"
                    //     id="key"
                    //     label="value"
                    //     dictName="province_id"
                    //     searchName="province_id"
                    // />
                    <Select placeholder="请选择" options={provinceData} allowClear />
                );
            },
        },
        {
            title: '厂家',
            dataIndex: 'vendorName',
            // ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
        },
        {
            title: '厂家',
            dataIndex: 'vendorIds',
            hideInTable: true,
            renderFormItem: (item, { fieldProps }, form) => {
                return (
                    <SelectCondition
                        {...fieldProps}
                        form={form}
                        mode="multiple"
                        title="厂家"
                        label="value"
                        id="key"
                        dictName="vendor_id"
                        searchName="vendor_id"
                        pageSize={99999}
                    />
                );
            },
        },
        {
            title: '业务名称',
            dataIndex: 'businessName',
            // ellipsis: true,
            search: false,
            align: 'center',
            // width: 20,
        },
        {
            title: '倒接区段',
            dataIndex: 'invertedSection',
            // ellipsis: true,
            align: 'center',
            // width: 20,
        },
        {
            title: '原始路由',
            dataIndex: 'originalRoute',
            // ellipsis: true,
            search: false,
            align: 'center',
            // width: 20,
        },
        {
            title: '当前路由',
            dataIndex: 'currentRoute',
            // ellipsis: true,
            search: false,
            align: 'center',
            // width: 20,
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 140,
        },
        {
            title: '结束时间',
            key: 'endTime',
            dataIndex: 'endTime',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 140,
        },
        {
            title: '时间',
            dataIndex: 'searchTime',
            order: 1,
            hideInTable: true,
            valueType: 'dateTimeRange',
            initialValue: searchTime,
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} showTime />;
            },
        },
        {
            title: '记录人',
            dataIndex: 'recorder',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '原因',
            dataIndex: 'reason',
            // ellipsis: true,
            search: true,
            align: 'center',
            width: 120,
        },
        {
            title: '备注（进展情况）',
            dataIndex: 'memo',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 120,
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
                    <AuthButton
                        key="edit"
                        onClick={() => showUserEditViewClick(row, 'edit')}
                        authKey="recordTemporaryRoute:edit"
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
                        authKey="recordTemporaryRoute:delete"
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
