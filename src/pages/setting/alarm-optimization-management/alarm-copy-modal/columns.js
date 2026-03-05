import React from 'react';
import { DatePicker, Select } from 'oss-ui';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { enumAlarmLevel, enumRadio } from '../enum';

const { RangePicker } = DatePicker;

const getColumns = (props) => {
    const { professionalData, provinceId } = props;

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
            initialValue: provinceId,
            order: 10,
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
            dataIndex: 'professionName',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
        },
        {
            title: '专业',
            dataIndex: 'professionId',
            hideInTable: true,
            order: 9,
            renderFormItem: () => {
                return (
                    <Select
                        mode="multiple"
                        options={professionalData.map((item) => {
                            return { label: item.txt, value: item.id };
                        })}
                    />
                );
            },
        },
        {
            title: '告警平台',
            dataIndex: 'alarmPlatform',
            ellipsis: true,
            search: true,
            align: 'center',
            order: 8,
            // width: 80,
        },
        {
            title: '告警主题',
            dataIndex: 'alarmTitle',
            ellipsis: true,
            search: true,
            align: 'center',
            order: 7,
            // width: 20,
        },
        {
            title: '告警级别',
            dataIndex: 'alarmLevel',
            ellipsis: true,
            align: 'center',
            search: true,
            order: 6,
            renderFormItem: () => {
                return (
                    <Select
                        options={enumAlarmLevel.map((item) => {
                            return { label: item.value, value: item.value };
                        })}
                    />
                );
            },
        },
        {
            title: '是否需要优化',
            dataIndex: 'optimizationFlag',
            hideInTable: true,
            order: 5,
            renderFormItem: () => {
                return (
                    <Select
                        options={enumRadio.map((item) => {
                            return { label: item.value, value: item.value };
                        })}
                    />
                );
            },
        },
        {
            title: '是否完成优化',
            dataIndex: 'optimizationCompleteFlag',
            hideInTable: true,
            order: 4,
            renderFormItem: () => {
                return (
                    <Select
                        options={enumRadio.map((item) => {
                            return { label: item.value, value: item.value };
                        })}
                    />
                );
            },
        },
        {
            title: '首次发生时间',
            dataIndex: 'firstTime',
            ellipsis: true,
            search: false,
            align: 'center',
            sorter: true,
            sortDirections: ['descend', 'ascend'],
            // width: 20,
        },
        {
            title: '清除时间',
            dataIndex: 'clearTime',
            ellipsis: true,
            search: false,
            align: 'center',
            sorter: true,
            sortDirections: ['descend', 'ascend'],
            // width: 20,
        },
        {
            title: '最后发生时间',
            dataIndex: 'lastTime',
            ellipsis: true,
            search: false,
            align: 'center',
            sorter: true,
            sortDirections: ['descend', 'ascend'],
            // width: 20,
        },
        {
            title: '首次发生时间',
            dataIndex: 'firstTime',
            order: 3,
            hideInTable: true,
            valueType: 'dateRange',
            // initialValue: firstTime,
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} />;
            },
        },
        {
            title: '最后发生时间',
            dataIndex: 'lastTime',
            order: 2,
            hideInTable: true,
            valueType: 'dateRange',
            // initialValue: clearTime,
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} />;
            },
        },
        {
            title: '清除时间',
            dataIndex: 'clearTime',
            order: 1,
            hideInTable: true,
            valueType: 'dateRange',
            // initialValue: searchTime,
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} />;
            },
        },
        {
            title: '告警内容',
            dataIndex: 'alarmContent',
            ellipsis: true,
            search: false,
            align: 'center',
            // width: 80,
        },
        {
            title: '告警原因',
            dataIndex: 'alarmReason',
            ellipsis: true,
            search: false,
            align: 'center',
            // width: 80,
        },
        {
            title: '影响范围',
            dataIndex: 'incidence',
            ellipsis: true,
            search: false,
            align: 'center',
            // width: 80,
        },
        {
            title: '重复次数',
            dataIndex: 'repeatTimes',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '是否需要优化',
            dataIndex: 'optimizationFlag',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '优化措施',
            dataIndex: 'optimizationMeasures',
            ellipsis: true,
            search: false,
            align: 'center',
            // width: 80,
        },
        {
            title: '是否完成优化',
            dataIndex: 'optimizationCompleteFlag',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '已派工单编号',
            dataIndex: 'sheetNo',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '告警网管系统',
            dataIndex: 'alarmSystem',
            ellipsis: true,
            search: false,
            align: 'center',
            // width: 80,
        },
        {
            title: '创建人',
            dataIndex: 'createUserName',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
    ];
};
export default getColumns;
