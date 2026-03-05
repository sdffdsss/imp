import React from 'react';
import { DatePicker, Icon, Tooltip, Button, Select } from 'oss-ui';
import AuthButton from '@Src/components/auth-button';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { majorType } from '../enum';

const { RangePicker } = DatePicker;

const getColumns = (props) => {
    const { showUserEditViewClick, delCurrentUserClick, searchTime, serviceTypeEnum, provinceId } = props;
    return [
        {
            title: '流水号',
            dataIndex: 'serialNum',
            ellipsis: true,
            align: 'center',
            // width: 80,
            search: false,
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
            order: 7,
            initialValue: provinceId,
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
            dataIndex: 'majorText',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
        },
        {
            title: '专业',
            dataIndex: 'majorObj',
            hideInTable: true,
            order: 6,
            renderFormItem: () => {
                return (
                    <Select defaultValue={majorType.atm} disabled>
                        <Select.Option value={majorType.atm} label="ATM专业">
                            ATM专业
                        </Select.Option>
                    </Select>
                );
            },
        },
        {
            title: '电路编码',
            dataIndex: 'circuitCode',
            ellipsis: true,
            align: 'center',
            width: 100,
            order: 5,
            search: true,
            fieldProps: {
                maxLength: 100,
            },
        },
        {
            title: '客户名称',
            dataIndex: 'customName',
            ellipsis: true,
            align: 'center',
            width: 100,
            order: 4,
            search: true,
            fieldProps: {
                maxLength: 100,
            },
        },
        {
            title: '业务类型',
            dataIndex: 'businessTypeText',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
            fieldProps: {
                maxLength: 100,
            },
        },
        {
            title: '业务类型',
            dataIndex: 'businessType',
            ellipsis: true,
            align: 'center',
            search: true,
            order: 3,
            hideInTable: true,
            renderFormItem: () => {
                return (
                    <Select allowClear placeholder="全部">
                        {serviceTypeEnum.map((item) => {
                            return (
                                <option value={item.value} key={item.lable}>
                                    {item.lable}
                                </option>
                            );
                        })}
                    </Select>
                );
            },
        },
        {
            title: '处理状态',
            dataIndex: 'processStatusText',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
        },
        {
            title: '受理时间',
            dataIndex: 'acceptTime',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
            sorter: true,
        },
        {
            title: '受理开始时间',
            dataIndex: 'searchTime',
            order: 2,
            hideInTable: true,
            valueType: 'dateTimeRange',
            initialValue: searchTime,
            renderFormItem: () => {
                return <RangePicker placeholder={['开始时间', '结束时间']} />;
            },
        },
        {
            title: '恢复时间',
            dataIndex: 'faultRestoreTime',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
            sorter: true,
        },
        {
            title: '故障简述',
            dataIndex: 'faultDescription',
            ellipsis: true,
            search: true,
            align: 'center',
            order: 1,
            width: 80,
            fieldProps: {
                maxLength: 300,
            },
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
                        authKey="serviceFaultManagement:edit"
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
                        authKey="serviceFaultManagement:delete"
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
