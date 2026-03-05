import React from 'react';
import { Select } from 'oss-ui';
// import request from '@Common/api';
// import useLoginInfoModel from '@Src/hox';
import formatReg from '@Common/formatReg';
import { filterTypeOptions } from '@Src/pages/auto-sheet-rule/enum';
import SelectCondition from './comp-select-condition';

export const filterColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: 80,

        hideInSearch: true,
    },

    {
        title: '过滤器名称',
        dataIndex: 'filterName',
        width: 220,

        ellipsis: true,
        sorter: true,
        formItemProps: {
            rules: [
                { whitespace: true, message: '不可为空格!' },
                { max: 64, type: 'string', message: '总长度不能超过64位（1汉字=2位）' },
            ],
        },
    },
    {
        title: '是否私有',
        dataIndex: 'isPrivate',

        width: 120,
        hideInSearch: true,
        sorter: true,
        filters: true,
        onFilter: false,

        valueEnum: {
            1: { text: '是' },
            2: { text: '否' },
        },
    },
    {
        title: '是否启用',
        dataIndex: 'enable',

        width: 120,
        sorter: true,
        hideInSearch: true,
        onFilter: false,
        filters: true,
        valueEnum: {
            1: { text: '是' },
            2: { text: '否' },
        },
        fieldProps: {
            initialValue: '-1',
        },
    },
    {
        title: '创建人',
        dataIndex: 'creator',
        width: 80,

        sorter: true,
        hideInSearch: true,
        render: (text, row) => text || '-',
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 150,

        sorter: true,
        hideInSearch: true,
        render: (text) => text || '-',
    },
    {
        title: '最近修改时间',
        dataIndex: 'modifyTime',
        width: 150,
        sorter: true,

        render: (text) => text || '-',
        hideInSearch: true,
    },
    {
        title: '最近修改人',
        dataIndex: 'modifier',
        width: 110,
        sorter: true,

        hideInSearch: true,
        render: (text, row) => text || '-',
    },
    {
        title: '描述',
        dataIndex: 'filterDesc',
        width: 200,
        sorter: true,
        ellipsis: true,
        hideInSearch: true,
    },
    {
        title: '过滤器id',
        dataIndex: 'filterId',
        ellipsis: true,
        width: 200,
        sorter: true,
        hideInSearch: true,
        formItemProps: {
            rules: [{ pattern: formatReg.intNumberWithZero, message: '请输入正整数/负整数/0' }],
        },
    },
];

export function commonRuleColumns(params) {
    const { viewSheetClick, isAddBloc } = params;
    return [
        {
            title: '序号',
            dataIndex: 'index',
            ellipsis: true,
            width: 50,
            hideInSearch: true,
        },
        {
            title: '规则类型',
            dataIndex: 'moduleName',
            ellipsis: true,
            width: 120,
            hideInSearch: false,

            renderFormItem: (_, { fieldProps }) => {
                return <Select {...fieldProps} placeholder="请选择" options={filterTypeOptions} />;
            },
        },
        {
            title: '规则名称',
            dataIndex: 'filterName',
            ellipsis: true,
            width: 220,
            sorter: true,
            formItemProps: {
                rules: [
                    { whitespace: true, message: '不可为空格!' },
                    { max: 64, type: 'string', message: '总长度不能超过64位（1汉字=2位）' },
                ],
            },
            render: (text, record) => {
                return (
                    <div
                        onClick={viewSheetClick.bind(this, record, 'view')}
                        title={text}
                        style={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            ellipsis: true,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#1677ff',
                        }}
                    >
                        {text}
                    </div>
                );
            },
        },
        {
            title: '归属省份',
            dataIndex: 'filterProvince',
            hideInTable: false,
            hideInSearch: false,
            render: (_, record) => {
                return record.filterProvinceLabel;
            },
            renderFormItem: (item, { fieldProps }, form) => {
                return (
                    <SelectCondition
                        {...fieldProps}
                        form={form}
                        // mode="multiple"
                        title="归属省份"
                        label="txt"
                        dictName="province_id"
                        searchName="filterProvince"
                        formatOption={(option) => {
                            const bloc = { dictName: 'province_id', key: '0', modelId: 2, valid: 1, value: '集团', valueEn: '集团' };
                            if (isAddBloc) {
                                return [...option, bloc];
                            }
                            return option;
                        }}
                    />
                );
            },
            search: {
                transform: (value) => {
                    return { filterProvince: value };
                },
            },
        },
        {
            title: '归属专业',
            hideInSearch: true,
            dataIndex: 'filterProfessionalLabel',
            ellipsis: true,
        },
        {
            title: '归属专业',
            hideInTable: true,
            dataIndex: 'filterProfessional',
            render: (_, record) => {
                return record.filterProfessionalLabel;
            },
            ellipsis: true,
            hideInSearch: false,
            renderFormItem: (item, { fieldProps }, form) => {
                return (
                    <SelectCondition
                        {...fieldProps}
                        form={form}
                        mode="multiple"
                        title="归属专业"
                        label="txt"
                        dictName="professional_type"
                        showAll={true}
                        searchName="filterProfessional"
                    />
                );
            },
            search: {
                transform: (value) => {
                    return { filterProfessional: value ? value?.join(',') : '' };
                },
            },
        },
        {
            title: '是否启用',
            dataIndex: 'enable',

            width: 100,
            sorter: true,
            hideInSearch: true,
            onFilter: false,
            filters: true,
            valueEnum: {
                1: { text: '是' },
                2: { text: '否' },
            },
            fieldProps: {
                initialValue: '-1',
            },
        },
        {
            title: '创建人',
            dataIndex: 'creator',
            ellipsis: true,
            width: 110,

            sorter: true,
            hideInSearch: true,
            render: (text, row) => text || '-',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            ellipsis: true,
            width: 120,

            sorter: true,
            hideInSearch: true,
            render: (text) => text || '-',
        },
        {
            title: '最近修改人',
            dataIndex: 'modifier',
            ellipsis: true,
            width: 110,
            sorter: true,

            hideInSearch: true,
            render: (text, row) => text || '-',
        },
        {
            title: '最近修改时间',
            dataIndex: 'modifyTime',
            ellipsis: true,
            width: 120,
            sorter: true,

            render: (text) => text || '-',
            hideInSearch: true,
        },

        {
            title: '描述',
            dataIndex: 'filterDesc',
            ellipsis: true,
            width: 200,
            sorter: true,
            hideInSearch: true,
        },
        {
            title: '规则id',
            dataIndex: 'filterId',

            width: 200,
            sorter: true,
            hideInSearch: true,
            formItemProps: {
                rules: [{ pattern: formatReg.intNumberWithZero, message: '请输入正整数/负整数/0' }],
            },
        },
    ];
}

// export const preTreatColumns = [
//     {
//         title: '序号',
//         dataIndex: 'index',
//         width: 80,
//         align: 'center',
//         hideInSearch: true,
//         render: (text, record, index) => index + 1,
//     },
//     {
//         title: '规则id',
//         dataIndex: 'id',
//         align: 'center',
//         width: 200,
//     },
//     {
//         title: '名称',
//         dataIndex: 'name',
//         width: 180,
//         ellipsis: true,
//     },
//     {
//         title: '是否启用',
//         dataIndex: 'isValid',
//         align: 'center',
//         width: 120,
//         valueEnum: {
//             '-1': { text: '全部' },
//             true: { text: '是' },
//             false: { text: '否' },
//         },
//         fieldProps: {
//             initialValue: '-1',
//         },
//     },
//     {
//         title: '创建人',
//         dataIndex: 'owner',
//         width: 130,
//         hideInSearch: true,
//         render: (text, row) => (text ? text.userName : '-'),
//     },
//     {
//         title: '延迟时间',
//         dataIndex: 'commonOptions',
//         width: 150,
//         hideInSearch: true,
//         render: (text, row) => {
//             if (Array.isArray(text) && text.length > 0) {
//                 let delayTime = text.find((item) => item.name === 'delayTime');

//                 return delayTime ? delayTime.value : '-';
//             } else {
//                 return '-';
//             }
//         },
//     },
//     {
//         title: '预处理时间段',
//         dataIndex: 'commonOptions',
//         width: 150,
//         hideInSearch: true,
//         render: (text, row) => {
//             if (Array.isArray(text) && text.length > 0) {
//                 let timePeriod = text.find((item) => item.name === 'timeperiod');

//                 return timePeriod ? timePeriod.value : '-';
//             } else {
//                 return '-';
//             }
//         },
//     },
//     {
//         title: '创建时间',
//         dataIndex: 'createTime',
//         width: 180,
//         valueType: 'dateTimeRange',
//         hideInSearch: true,
//         fieldProps: {
//             format: 'YYYY-MM-DD HH:mm:ss',
//             showTime: true,
//         },
//         render: (text) => text || '-',
//     },
//     {
//         title: '最近修改时间',
//         dataIndex: 'updateTime',
//         width: 180,
//         hideInSearch: true,
//         valueType: 'dateTimeRange',
//         fieldProps: {
//             format: 'YYYY-MM-DD HH:mm:ss',
//             showTime: true,
//         },
//     },
//     {
//         title: '最近修改人',
//         dataIndex: 'updateUser',
//         width: 120,
//         hideInSearch: true,
//         render: (text, row) => (text ? text.userName : '-'),
//     },
//     {
//         title: '描述',
//         dataIndex: 'description',
//         width: 200,
//         hideInSearch: true,
//         ellipsis: true,
//     },
// ];

export const searchFormConfig = (moduleId = 0) => {
    /**
     * moduleId 0 默认
     * moduleId 605 督办单派单规则
     *
     */

    return [
        // TODO:应产品要求暂时去掉
        // {
        //     title: '大区',
        //     dataIndex: 'region_id',
        //     hideInTable: true,
        //     hideInSearch: false,
        //     renderFormItem: (item, { value, onChange }, form) => {
        //         return (
        //             <SelectCondition
        //                 form={form}
        //                 mode="multiple"
        //                 title="大区"
        //                 label="txt"
        //                 dictName="district_id"
        //                 searchName="district_id"
        //             />
        //         );
        //     },
        // },

        {
            title: '网管告警级别',
            hideInTable: true,
            dataIndex: 'org_severity',
            hideInSearch: false,
            renderFormItem: (item, { value, onChange, fieldProps }, form) => {
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

            search: {
                transform: (value) => ({ org_severity_queryProperties: value }),
            },
        },
        {
            title: '设备类型',
            dataIndex: 'eqp_object_class',
            hideInTable: true,
            hideInSearch: false,
            renderFormItem: (item, { value, onChange, fieldProps }, form) => {
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
            search: {
                transform: (value) => ({ eqp_object_class_queryProperties: value }),
            },
        },
        {
            title: '设备厂家',
            dataIndex: 'vendor_id',
            hideInTable: true,
            hideInSearch: false,
            renderFormItem: (item, { value, onChange }, form) => {
                return <SelectCondition form={form} mode="multiple" title="设备厂家" label="txt" dictName="vendor_id" searchName="vendor_id" />;
            },
            search: {
                transform: (value) => ({ vendor_id_queryProperties: value }),
            },
        },
        {
            title: '网元名称',
            dataIndex: 'eqp_label',
            hideInTable: true,
            hideInSearch: false,
            search: {
                transform: (value) => ({
                    eqp_label_queryProperties: value ? [value] : [],
                }),
            },
            formItemProps: {
                rules: [
                    { whitespace: true, message: '不可为空格!' },
                    { max: 64, type: 'string', message: '总长度不能超过64位（1汉字=2位）' },
                ],
            },
        },

        {
            title: '告警标题',
            dataIndex: 'title_text',
            hideInTable: true,
            hideInSearch: false,
            search: {
                transform: (value) => ({
                    title_text_queryProperties: value ? [value] : [],
                }),
            },
            formItemProps: {
                rules: [
                    { whitespace: true, message: '不可为空格!' },
                    { max: 64, type: 'string', message: '总长度不能超过64位（1汉字=2位）' },
                ],
            },
        },
        {
            title: '网管告警ID',
            dataIndex: 'standard_alarm_id',
            hideInTable: true,
            hideInSearch: false,
            search: {
                transform: (value) => ({
                    standard_alarm_id_queryProperties: value ? [value] : [],
                }),
            },
            formItemProps: {
                rules: [
                    { whitespace: true, message: '不可为空格!' },
                    { max: 64, type: 'string', message: '总长度不能超过32位' },
                ],
            },
        },
        {
            title: '派单专业',
            dataIndex: 'dispatchProfession',
            hideInTable: true,
            hideInSearch: moduleId === '605',
            renderFormItem: (item, { fieldProps }, form) => {
                return (
                    <SelectCondition
                        {...fieldProps}
                        form={form}
                        mode="multiple"
                        title="派单专业"
                        label="txt"
                        dictName="dispatchProfession"
                        searchName="dispatchProfession"
                    />
                );
            },
            search: {
                transform: (value) => {
                    console.log(value.join(','));
                    return { dispatchProfession_queryProperties: value };
                },
            },
        },
    ];
};
export const anotherFilterCondition = searchFormConfig();
