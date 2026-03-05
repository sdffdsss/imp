import React from 'react';
import { DatePicker, Icon, Tooltip, Select, Button } from 'oss-ui';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';

const { RangePicker } = DatePicker;

const getColumns = (props) => {
    const { showViewClick, centerList, provinceId, currProvince, groupList, pagination, groupInitial } = props;
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
            title: '日期',
            dataIndex: 'dateTime',
            hideInTable: true,
            valueType: 'dateRange',
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} />;
            },
        },
        {
            title: '归属省份',
            dataIndex: 'provinceName',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '归属省份',
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
            title: '归属监控中心',
            dataIndex: 'centerName',
            align: 'center',
            ellipsis: true,
            hideInSearch: true,
            sorter: false,
        },
        {
            title: '归属监控中心',
            dataIndex: 'monitorCenterId',
            align: 'center',
            ellipsis: true,
            width: 120,
            hideInTable: true,
            renderFormItem: (item, { fieldProps }, form) => {
                return (
                    <Select form={form} {...fieldProps} allowClear placeholder="全部">
                        {centerList.map((center) => {
                            return (
                                <Select.Option key={center.centerId} value={center.centerId}>
                                    {center.centerName}
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
            },
        },
        {
            title: '班组名称',
            dataIndex: 'groupName',
            align: 'center',
            sorter: false,
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: '班组名称',
            dataIndex: 'groupId',
            align: 'center',
            sorter: false,
            hideInTable: true,
            initialValue: groupInitial,
            renderFormItem: (item, { fieldProps }, form) => {
                return (
                    <Select
                        form={form}
                        {...fieldProps}
                        allowClear
                        placeholder="全部"
                        mode="multiple"
                        filterOption={(filter, itm) => {
                            return itm.children?.includes(filter);
                        }}
                    >
                        {groupList.map((group) => {
                            return (
                                <Select.Option key={group.groupId} value={group.groupId}>
                                    {group.groupName}
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
            },
        },
        {
            title: '网络故障工单累计数',
            dataIndex: 'networkWorkSheetTotal',
            align: 'center',
            ellipsis: true,
            width: 120,
            hideInSearch: true,
            sorter: false,
        },
        {
            title: '业务故障单累计数',
            dataIndex: 'businessFaultTotal',
            align: 'center',
            ellipsis: true,
            width: 120,
            sorter: false,
            hideInSearch: true,
        },
        {
            title: '割接累计数量',
            dataIndex: 'cutoverScheduleTotal',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
            width: 120,
            sorter: false,
        },
        {
            title: '重保累计数',
            dataIndex: 'reinsuranceScheduleTotal',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
            width: 120,
            sorter: false,
        },
        {
            title: '得分评价',
            dataIndex: 'evaluateScore',
            align: 'center',
            ellipsis: true,
            width: 180,
            sorter: false,
            hideInSearch: true,
        },
        {
            title: '操作',
            dataIndex: 'actions',
            search: false,
            align: 'center',
            width: 120,
            fixed: 'right',
            render: (text, row) => [
                <Button key="show" onClick={() => showViewClick(row)} type="text" antdIcon>
                    <Icon key="userEdit" antdIcon type="SearchOutlined" />
                </Button>,
            ],
        },
    ];
};
export default getColumns;
