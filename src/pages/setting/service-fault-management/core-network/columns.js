import React from 'react';
import { DatePicker, Icon, Tooltip, Button, Select } from 'oss-ui';
import AuthButton from '@Src/components/auth-button';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { majorType } from '../enum';

const { RangePicker } = DatePicker;

const getColumns = (props) => {
    const {
        showUserEditViewClick,
        delCurrentUserClick,
        networkTypeEnum,
        professionalNetworkTypeEnum,
        declarationTypeEnum,
        coordinationResultsEnum,
        provinceId,
    } = props;
    return [
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
                    <Select defaultValue={majorType.coreNetwork} disabled>
                        <Select.Option value={majorType.coreNetwork} label="核心网专业">
                            核心网专业
                        </Select.Option>
                    </Select>
                );
            },
        },
        {
            title: '专业网类型',
            dataIndex: 'professionalNetworkTypeText',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
        },
        {
            title: '专业网类型',
            dataIndex: 'professionalNetworkType',
            ellipsis: true,
            align: 'center',
            search: true,
            order: 5,
            hideInTable: true,
            renderFormItem: () => {
                return (
                    <Select allowClear placeholder="全部">
                        {professionalNetworkTypeEnum.map((item) => {
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
            title: '系统',
            dataIndex: 'networkTypeText',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
        },
        {
            title: '系统',
            dataIndex: 'networkType',
            ellipsis: true,
            align: 'center',
            search: true,
            order: 4,
            hideInTable: true,
            renderFormItem: () => {
                return (
                    <Select
                        allowClear
                        options={networkTypeEnum.map((item) => {
                            return { label: item.lable, value: item.value };
                        })}
                    />
                );
            },
        },
        {
            title: '申告类型',
            dataIndex: 'declarationTypeText',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
        },
        {
            title: '申告类型',
            dataIndex: 'declarationType',
            ellipsis: true,
            align: 'center',
            search: true,
            order: 3,
            hideInTable: true,
            renderFormItem: () => {
                return (
                    <Select
                        allowClear
                        options={declarationTypeEnum.map((item) => {
                            return { label: item.lable, value: item.value };
                        })}
                    />
                );
            },
        },
        {
            title: '协调结果',
            dataIndex: 'coordinationResultsText',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
        },
        {
            title: '协调结果',
            dataIndex: 'coordinationResults',
            ellipsis: true,
            align: 'center',
            search: true,
            order: 2,
            hideInTable: true,
            renderFormItem: () => {
                return (
                    <Select
                        allowClear
                        options={coordinationResultsEnum.map((item) => {
                            return { label: item.lable, value: item.value };
                        })}
                    />
                );
            },
        },
        {
            title: '协调处理时间',
            dataIndex: 'coordinationProcessingTime',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
            sorter: true,
        },
        {
            title: '协调处理时间',
            dataIndex: 'searchTime',
            order: 1,
            hideInTable: true,
            valueType: 'dateTimeRange',
            // initialValue: searchTime,
            renderFormItem: () => {
                return <RangePicker placeholder={['开始时间', '结束时间']} />;
            },
        },
        {
            title: '协调人',
            dataIndex: 'coordinationPeople',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '协调工作具体内容',
            dataIndex: 'coordinationContent',
            ellipsis: true,
            search: false,
            align: 'center',
        },
        {
            title: '未处理完事件跟踪进展',
            dataIndex: 'eventTrackProgress',
            ellipsis: true,
            search: false,
            align: 'center',
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
