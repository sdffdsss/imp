import React from 'react';
import { Icon, Tooltip, Button, Select, DatePicker } from 'oss-ui';
import AuthButton from '@Src/components/auth-button';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { majorType } from '../enum';

const { RangePicker } = DatePicker;

const getColumns = (props) => {
    const { showUserEditViewClick, delCurrentUserClick, acceptMethodEnum, provinceId } = props;
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
            // width: 80,
            search: false,
        },
        {
            title: '省份',
            dataIndex: 'provinceId',
            hideInTable: true,
            initialValue: provinceId,
            order: 7,
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
            search: false,
        },
        {
            title: '专业',
            dataIndex: 'majorObj',
            hideInTable: true,
            order: 6,
            renderFormItem: () => {
                return (
                    <Select defaultValue={majorType.bigCustomer} disabled>
                        <Select.Option value={majorType.bigCustomer} label="大客户平台专业">
                            大客户平台专业
                        </Select.Option>
                    </Select>
                );
            },
        },
        {
            title: '受理方式',
            dataIndex: 'acceptMethod',
            ellipsis: true,
            align: 'center',
            search: true,
            order: 5,
            hideInTable: true,
            renderFormItem: () => {
                return (
                    <Select allowClear placeholder="全部">
                        {acceptMethodEnum.map((item) => {
                            return (
                                <Select.Option value={item.value} key={item.lable}>
                                    {item.lable}
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
            },
        },
        {
            title: '故障发生时间',
            dataIndex: 'findTime',
            ellipsis: true,
            align: 'center',
            order: 5,
            renderFormItem: () => {
                return <RangePicker placeholder={['开始时间', '结束时间']} />;
            },
            search: true,
            sorter: true,
        },
        {
            title: '申告客户',
            dataIndex: 'declarationCustom',
            ellipsis: true,
            align: 'center',
            order: 5,
            hideInTable: true,
            search: true,
            fieldProps: {
                maxLength: 100,
            },
        },
        {
            title: '客户名称',
            dataIndex: 'customName',
            // ellipsis: true,
            search: false,
            align: 'center',
            // width: 80,
        },
        {
            title: '业务类型',
            dataIndex: 'businessTypeText',
            ellipsis: true,
            search: false,
            align: 'center',
            // width: 20,
        },
        // {
        //     title: '处理状态',
        //     dataIndex: 'processStatusText',
        //     ellipsis: true,
        //     align: 'center',
        //     width: 100,
        //     search: false,
        // },
        {
            title: '受理时间',
            dataIndex: 'acceptTime',
            ellipsis: true,
            align: 'center',
            // width: 100,
            search: false,
            sorter: true,
        },
        {
            title: '恢复时间',
            dataIndex: 'faultRestoreTime',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
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
