import React from 'react';
import SelectCondition from './select-condition';
import dayjs from 'dayjs';
import { DatePicker } from 'oss-ui';
import InputAddBefore from './input_add_before';
import ProvinceRegionCity from './province_region_city';

const Tabs = [
    {
        tab: '通用查询',
        key: '1',
        queryType: 'commonSearch',
        columns: [
            {
                title: '告警发生时间',
                dataIndex: 'event_time',
                hideInTable: true,
                hideInSearch: false,
                valueType: 'dateTimeRange',
                initialValue: [dayjs().subtract(1, 'day').startOf('day'), dayjs().startOf('day')],
                renderFormItem: () => {
                    const dateFormat = 'YYYY-MM-DD HH:mm:ss ';
                    return <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} format={dateFormat} showTime />;
                },
            },
            {
                title: '告警状态',
                dataIndex: 'active_status',
                hideInTable: true,
                hideInSearch: false,
                valueType: 'enumeration',
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="告警状态"
                            label="txt"
                            dictName="active_status"
                            searchName="active_status"
                        />
                    );
                },
            },
            {
                title: '省市区',
                dataIndex: 'province_region_city',
                hideInTable: true,
                hideInSearch: false,
                valueType: 'cascader',
                renderFormItem: () => {
                    return <ProvinceRegionCity />;
                },
            },
            {
                title: '一级专业',
                dataIndex: 'network_type_top',
                hideInTable: true,
                hideInSearch: false,
                valueType: 'enumeration',
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="一级专业"
                            label="txt"
                            dictName="network_type_top"
                            searchName="network_type_top"
                        />
                    );
                },
            },
            {
                title: '二级专业',
                dataIndex: 'network_type',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="二级专业"
                            label="txt"
                            dictName="network_type"
                            searchName="network_type"
                        />
                    );
                },
            },

            {
                title: '厂家',
                dataIndex: 'vendor_id',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="厂家"
                            label="txt"
                            dictName="vendor_id"
                            searchName="vendor_id"
                        />
                    );
                },
            },
            {
                title: '设备类型',
                dataIndex: 'eqp_object_class',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="设备类型"
                            label="txt"
                            dictName="eqp_object_class"
                            searchName="eqp_object_class"
                        />
                    );
                },
            },
            {
                title: '网元名称',
                dataIndex: 'eqp_label',
                valueType: 'textAddSelect',
                key: 'eqp_label',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return <InputAddBefore searchName="eqp_label_condition" {...fieldProps} form={form} name="eqp_label" />;
                },
            },
            {
                title: '告警对象类型',
                dataIndex: 'object_class',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="告警对象类型"
                            label="txt"
                            dictName="object_class"
                            searchName="object_class"
                        />
                    );
                },
            },
            {
                title: '告警对象名称',
                dataIndex: 'ne_label',
                valueType: 'textAddSelect',
                key: 'ne_label',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return <InputAddBefore searchName="ne_label_condition" {...fieldProps} form={form} name="ne_label" />;
                },
            },
            {
                title: '网管告警级别',
                dataIndex: 'org_severity',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="网管告警级别"
                            label="txt"
                            dictName="org_severity"
                            searchName="org_severity"
                        />
                    );
                },
            },
            {
                title: '告警业务子类',
                dataIndex: 'extra_id3',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="告警业务子类"
                            label="txt"
                            dictName="extra_id3"
                            searchName="extra_id3"
                        />
                    );
                },
            },
            {
                title: '告警标题',
                dataIndex: 'title_text',
                valueType: 'textAddSelect',
                key: 'title_text',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return <InputAddBefore searchName="title_text_condition" {...fieldProps} form={form} name="title_text" />;
                },
            },
            {
                title: '网管告警ID',
                dataIndex: 'standard_alarm_id',
                key: 'standard_alarm_id',
                valueType: 'textAddSelect',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return <InputAddBefore searchName="standard_alarm_id_condition" {...fieldProps} form={form} name="standard_alarm_id" />;
                },
            },
            {
                title: '工程状态',
                dataIndex: 'alarm_resource_status',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="工程状态"
                            label="txt"
                            dictName="alarm_resource_status"
                            searchName="alarm_resource_status"
                        />
                    );
                },
            },
            {
                title: '派单状态',
                dataIndex: 'send_status',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="派单状态"
                            label="txt"
                            dictName="send_status"
                            searchName="send_status"
                        />
                    );
                },
            },
            {
                title: '确认状态',
                dataIndex: 'ack_flag',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="确认状态"
                            label="txt"
                            dictName="ack_flag"
                            searchName="ack_flag"
                        />
                    );
                },
            },
            {
                title: '是否派单告警',
                dataIndex: 'is_undistributed_send_status',
                key: 'is_undistributed_send_status',
                hideInTable: true,
                hideInSearch: false,
                valueEnum: {
                    0: { text: '否' },
                    '-1': { text: '是' },
                },
            },
            {
                title: '关联查询',
                dataIndex: 'alarm_origin',
                hideInTable: true,
                hideInSearch: false,
                valueType: 'enumeration',
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode=""
                            title="关联查询"
                            label="txt"
                            dictName="alarm_origin"
                            searchName="alarm_origin"
                        />
                    );
                },
            },
            {
                title: '工单状态',
                dataIndex: 'sheet_status',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="工单状态"
                            label="txt"
                            dictName="sheet_status"
                            searchName="sheet_status"
                        />
                    );
                },
            },
            {
                title: '工单编号',
                dataIndex: 'sheet_no',
                key: 'sheet_no',
                hideInTable: true,
                valueType: 'textAddSelect',
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return <InputAddBefore searchName="sheet_no_condition" {...fieldProps} form={form} name="sheet_no" />;
                },
            },
            {
                title: '客户名称',
                dataIndex: 'gcss_client_name',
                key: 'gcss_client_name',
                hideInTable: true,
                valueType: 'textAddSelect',
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return <InputAddBefore searchName="gcss_client_name_condition" {...fieldProps} form={form} name="gcss_client_name" />;
                },
            },
            {
                title: '电路号',
                dataIndex: 'circuit_no',
                key: 'circuit_no',
                valueType: 'textAddSelect',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return <InputAddBefore searchName="circuit_no_condition" {...fieldProps} form={form} name="circuit_no" />;
                },
            },
            {
                title: '客户级别',
                dataIndex: 'gcss_client_level',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="客户级别"
                            label="txt"
                            dictName="gcss_client_level"
                            searchName="gcss_client_level"
                        />
                    );
                },
            },
            {
                title: '集客业务级别',
                dataIndex: 'gcss_service_level',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="集客业务级别"
                            label="txt"
                            dictName="gcss_service_level"
                            searchName="gcss_service_level"
                        />
                    );
                },
            },
            {
                title: '电路中断状态',
                dataIndex: 'interrupt_circuit_state',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="电路中断状态"
                            label="txt"
                            dictName="interrupt_circuit_state"
                            searchName="interrupt_circuit_state"
                        />
                    );
                },
            },
            {
                title: '是否异常告警',
                dataIndex: 'alarm_abnormal_type',
                key: 'alarm_abnormal_type',
                hideInTable: true,
                hideInSearch: false,
                valueEnum: {
                    0: { text: '是' },
                    1: { text: '否' },
                },
            },
        ],
    },
    {
        tab: '按过滤器查询',
        key: '2',
        queryType: 'filterSearch',
        columns: [
            {
                title: '告警发生时间',
                dataIndex: 'event_time',
                hideInTable: true,
                hideInSearch: false,
                valueType: 'dateTimeRange',
                initialValue: [dayjs().subtract(1, 'day').startOf('day'), dayjs().startOf('day')],
                renderFormItem: () => {
                    const dateFormat = 'YYYY-MM-DD HH:mm:ss ';
                    return <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} format={dateFormat} showTime />;
                },
            },
            {
                title: '过滤方式',
                dataIndex: 'filter_type',
                key: 'filter_type',
                hideInTable: true,
                hideInSearch: false,
                initialValue: 'myFilters',
                valueEnum: {
                    myFilters: { text: '我的过滤器' },
                    allFilters: { text: '全部过滤器' },
                },
            },
            {
                title: '过滤器名称',
                dataIndex: 'filter_id',
                key: 'filter_id',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode=""
                            title="过滤器名称"
                            label="txt"
                            dictName="filterName"
                            searchName="filter_id"
                        />
                    );
                },
            },
            {
                title: '告警状态',
                dataIndex: 'active_status',
                hideInTable: true,
                hideInSearch: false,
                valueType: 'enumeration',
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="告警状态"
                            label="txt"
                            dictName="active_status"
                            searchName="active_status"
                        />
                    );
                },
            },
            {
                title: '派单状态',
                dataIndex: 'send_status',
                valueType: 'enumeration',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode="multiple"
                            title="派单状态"
                            label="txt"
                            dictName="send_status"
                            searchName="send_status"
                        />
                    );
                },
            },
            {
                title: '关联查询',
                dataIndex: 'alarm_origin',
                valueType: 'enumSingle',
                hideInTable: true,
                hideInSearch: false,
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            mode=""
                            title="关联查询"
                            label="txt"
                            dictName="alarm_origin"
                            searchName="alarm_origin"
                        />
                    );
                },
            },
        ],
    },
    {
        tab: '按唯一标识查询',
        key: '3',
        queryType: 'fp',
        columns: [
            {
                title: '告警发生时间',
                dataIndex: 'event_time',
                hideInTable: true,
                hideInSearch: false,
                valueType: 'dateTimeRange',
                initialValue: [dayjs().subtract(1, 'day').startOf('day'), dayjs().startOf('day')],
                renderFormItem: () => {
                    const dateFormat = 'YYYY-MM-DD HH:mm:ss ';
                    return <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} format={dateFormat} showTime />;
                },
                search: {
                    transform: (value) => ({ riskCreatTime_queryProperties: value }),
                },
            },
            {
                title: '厂家唯一标识',
                key: 'nms_alarm_id',
                dataIndex: 'nms_alarm_id',
                valueType: 'text',
                hideInTable: true,
                hideInSearch: false,
            },
            {
                title: '原始流水号',
                key: 'nms_alarm_id',
                dataIndex: 'nms_alarm_id',
                valueType: 'text',
                hideInTable: true,
                hideInSearch: false,
            },
            {
                title: 'fp0',
                key: 'fp0',
                dataIndex: 'fp0',
                valueType: 'text',
                hideInTable: true,
                hideInSearch: false,
            },
            {
                title: 'fp1',
                key: 'fp1',
                dataIndex: 'fp1',
                valueType: 'text',
                hideInTable: true,
                hideInSearch: false,
            },
            {
                title: 'fp2',
                key: 'fp2',
                dataIndex: 'fp2',
                valueType: 'text',
                hideInTable: true,
                hideInSearch: false,
            },
            {
                title: 'fp3',
                key: 'fp3',
                dataIndex: 'fp3',
                valueType: 'text',
                hideInTable: true,
                hideInSearch: false,
            },
        ],
    },
];

export default Tabs;
