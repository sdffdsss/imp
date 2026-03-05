import React from 'react';
import { DatePicker, Icon, Tooltip, Button, Select } from 'oss-ui';
const { RangePicker } = DatePicker;
import AuthButton from '@Src/components/auth-button';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';

const getColumns = (props) => {
    const {
        showUserEditViewClick,
        delCurrentUserClick,
        provinceId,
        searchTime,
        currProvince,
        professionalList,
        pageNum,
        pageSize,
        professionalTypeInitial,
    } = props;
    return [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 40,
            render: (text, record, index) => {
                return index + 1 + (pageNum - 1) * pageSize;
            },
        },
        {
            title: '省份',
            dataIndex: 'provinceName',
            key: 'provinceName',
            ellipsis: true,
            align: 'center',
            width: 80,
            search: false,
        },
        {
            title: '省份',
            dataIndex: 'provinceId',
            key: 'provinceId',
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
            key: 'professionalDesc',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
        },
        {
            title: '专业',
            align: 'center',
            dataIndex: 'professionalType',
            key: 'professionalType',
            ellipsis: true,
            hideInTable: true,
            width: 60,
            initialValue: professionalTypeInitial,
            renderFormItem: () => {
                return (
                    <Select showSearch placeholder="全部" mode="multiple" maxTagCount="responsive" allowClear optionFilterProp="children">
                        {professionalList.map((item) => {
                            return (
                                <Select.Option value={item.key} key={item.key} label={item.value}>
                                    {item.value}
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
            },
        },
        {
            title: '日期',
            dataIndex: 'operationTime',
            key: 'operationTime',
            ellipsis: true,
            search: false,
            align: 'center',
            // width: 20,
        },
        {
            title: '设备厂商',
            dataIndex: 'vendorName',
            key: 'vendorName',
            ellipsis: true,
            search: false,
            align: 'center',
            // width: 20,
        },
        {
            title: '账号权限',
            dataIndex: 'accountPower',
            ellipsis: true,
            search: false,
            align: 'center',
            // width: 20,
        },
        {
            title: '操作内容',
            dataIndex: 'operationContentName',
            key: 'operationContentName',
            ellipsis: true,
            search: false,
            align: 'center',
            // width: 20,
        },
        {
            title: '操作描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            search: true,
            align: 'center',
            width: 140,
        },
        {
            title: '操作人',
            key: 'operator',
            dataIndex: 'operator',
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
            title: '审核人',
            dataIndex: 'reviewer',
            key: 'reviewer',
            // ellipsis: true,
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
                    <AuthButton
                        key="edit"
                        onClick={() => showUserEditViewClick(row, 'edit')}
                        authKey="networkOperationRecord:edit"
                        type="text"
                        antdIcon={true}
                    >
                        <Icon key="userEdit" antdIcon type="EditOutlined" />
                    </AuthButton>
                </Tooltip>,
                <Tooltip title="查看">
                    <Button key="show" onClick={() => showUserEditViewClick(row, 'view')} type="text" antdIcon={true}>
                        <Icon key="userEdit" antdIcon type="SearchOutlined" />
                    </Button>
                </Tooltip>,
                <Tooltip title="删除">
                    <AuthButton
                        key="delete"
                        onClick={() => delCurrentUserClick(row)}
                        authKey="networkOperationRecord:delete"
                        type="text"
                        antdIcon={true}
                        addLog={true}
                    >
                        <Icon key="userDel" antdIcon type="DeleteOutlined" />
                    </AuthButton>
                </Tooltip>,
            ],
        },
    ];
};
export default getColumns;
