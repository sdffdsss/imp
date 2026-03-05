/* eslint-disable no-control-regex */
import React from 'react';
import formatReg from '@Common/formatReg';
import SelectCondition from './comp-select-condition';
import { Tooltip, Radio, Button } from 'oss-ui';
import { useEnvironmentModel } from '@Src/hox';

const titleVersion = useEnvironmentModel?.data?.environment?.version === 'unicom' ? '归属专业' : '一级专业';
const professionDictName = useEnvironmentModel?.data?.environment?.version === 'unicom' ? 'professional_type' : 'network_type_top';
export function test() {
    return;
}
export function filterColumns(viewFilterClick) {
    return [
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
            // ellipsis: true,
            sorter: true,
            formItemProps: {
                rules: [
                    { whitespace: true, message: '不可为空格!' },
                    {
                        validator: (rule, value, callback) => {
                            // eslint-disable-next-line no-control-regex
                            const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                            if (valueLength > 64) {
                                callback('总长度不能超过64位（1汉字=2位）');
                            } else {
                                callback();
                            }
                        },
                    },
                ],
            },
            render: (text, record) => {
                return (
                    <div
                        onClick={viewFilterClick.bind(this, record, 'view')}
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
            dataIndex: 'filterProvinceLabel',
            width: 100,
            align: 'center',
            hideInSearch: true,
            ellipsis: true,
            render: (text) => text || '-',
        },
        {
            title: '归属专业',
            dataIndex: 'filterProfessionalLabel',
            width: 100,
            align: 'center',
            sorter: true,
            hideInSearch: true,
            ellipsis: true,
            render: (text) => text || '-',
        },
        // {
        //     title: '类型',
        //     dataIndex: 'filterTypeName',
        //     width: 120,
        //     ellipsis: true,
        //     hideInSearch: true
        // },
        // {
        //     title: '是否私有',
        //     dataIndex: 'isPrivate',

        //     width: 120,
        //     hideInSearch: true,
        //     sorter: true,
        //     filters: true,
        //     onFilter: false,

        //     valueEnum: {
        //         1: { text: '是' },
        //         2: { text: '否' },
        //     },
        // },
        // {
        //     title: '是否启用',
        //     dataIndex: 'enable',

        //     width: 120,
        //     sorter: true,
        //     hideInSearch: true,
        //     onFilter: false,
        //     filters: true,
        //     valueEnum: {
        //         1: { text: '是' },
        //         2: { text: '否' },
        //     },
        //     fieldProps: {
        //         initialValue: '-1',
        //     },
        // },
        {
            title: '创建人',
            dataIndex: 'creator',
            width: 100,
            align: 'center',
            sorter: true,
            hideInSearch: true,
            ellipsis: true,
            render: (text) => {
                return <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{!text ? '-' : text}</div>;
            },
        },
        {
            title: '监控视图引用',
            dataIndex: 'tfpMonitorviewinfoList',
            key: 'tfpMonitorviewinfoList',
            hideInSearch: true,
            width: 150,
            render: (text, row) => {
                return (
                    <Tooltip
                        placement="topLeft"
                        title={
                            row.tfpMonitorviewinfoList &&
                            row.tfpMonitorviewinfoList
                                .map((viewInfo) => {
                                    return viewInfo.windowName;
                                })
                                .join('，')
                        }
                        arrowPointAtCenter
                    >
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {!row.tfpMonitorviewinfoList
                                ? '-'
                                : row.tfpMonitorviewinfoList
                                      .map((viewInfo) => {
                                          return viewInfo.windowName;
                                      })
                                      .join('，')}
                        </div>
                    </Tooltip>
                );
            },
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
            render: (text) => text || '-',
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
}

export function commonRuleColumns(viewFilterClick) {
    return [
        {
            title: '序号',
            dataIndex: 'index',
            ellipsis: true,
            width: 50,

            hideInSearch: true,
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
                    {
                        validator: (rule, value, callback) => {
                            const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                            if (valueLength > 64) {
                                callback('总长度不能超过64位（1汉字=2位）');
                            } else {
                                callback();
                            }
                        },
                    },
                ],
            },
            render: (text, record) => {
                return (
                    <div
                        onClick={viewFilterClick.bind(this, record, 'view')}
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
            dataIndex: 'filterProvinceLabel',
            width: 100,
            align: 'center',
            hideInSearch: true,
            ellipsis: true,
            render: (text) => text || '-',
        },
        {
            title: '归属专业',
            dataIndex: 'filterProfessionalLabel',
            width: 100,
            align: 'center',
            sorter: true,
            hideInSearch: true,
            ellipsis: true,
            render: (text) => text || '-',
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
            render: (text) => text || '-',
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
            render: (text) => text || '-',
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

export const anotherFilterCondition = [
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
        title: '归属省份',
        dataIndex: 'province_id',
        hideInTable: true,
        hideInSearch: false,
        renderFormItem: (item, { fieldProps }, form) => {
            return (
                <SelectCondition
                    {...fieldProps}
                    form={form}
                    // mode="multiple"
                    title="省份"
                    id="key"
                    label="value"
                    dictName="province_id"
                    searchName="province_id"
                />
            );
        },
        search: {
            transform: (value) => ({ province_id: value }),
        },
    },
    {
        title: titleVersion,
        hideInTable: true,
        dataIndex: professionDictName,
        hideInSearch: false,
        renderFormItem: (item, { fieldProps }, form) => {
            return (
                <SelectCondition
                    {...fieldProps}
                    form={form}
                    mode="multiple"
                    title={titleVersion}
                    id="key"
                    label="value"
                    dictName={professionDictName}
                    searchName={professionDictName}
                    // addOptions={[
                    //     {
                    //         value: '',
                    //         label: '全部',
                    //     },
                    // ]}
                />
            );
        },
        search: {
            transform: (value) => ({ [`${professionDictName}_queryProperties`]: value }),
        },
    },
    // TODO:应产品要求暂时去掉
    {
        title: '网管告警级别',
        hideInTable: true,
        dataIndex: 'org_severity',
        hideInSearch: false,
        renderFormItem: (item, { fieldProps }, form) => {
            return (
                <SelectCondition
                    {...fieldProps}
                    form={form}
                    mode="multiple"
                    title="网管告警级别"
                    label="value"
                    id="key"
                    dictName="org_severity"
                    searchName="org_severity"
                    // addOptions={[
                    //     {
                    //         value: '',
                    //         label: '全部',
                    //     },
                    // ]}
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
        renderFormItem: (item, { fieldProps }, form) => {
            return (
                <SelectCondition
                    {...fieldProps}
                    form={form}
                    mode="multiple"
                    title="设备类型"
                    label="value"
                    id="key"
                    dictName="eqp_object_class"
                    searchName="eqp_object_class"
                    // addOptions={[
                    //     {
                    //         value: '',
                    //         label: '全部',
                    //     },
                    // ]}
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
        renderFormItem: (item, { fieldProps }, form) => {
            return (
                <SelectCondition
                    {...fieldProps}
                    form={form}
                    mode="multiple"
                    title="设备厂家"
                    id="key"
                    label="value"
                    dictName="vendor_id"
                    searchName="vendor_id"
                    // addOptions={[
                    //     {
                    //         value: '',
                    //         label: '全部',
                    //     },
                    // ]}
                />
            );
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
                {
                    validator: (rule, value, callback) => {
                        const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                        if (valueLength > 64) {
                            callback('总长度不能超过64位（1汉字=2位）');
                        } else {
                            callback();
                        }
                    },
                },
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
                {
                    validator: (rule, value, callback) => {
                        const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                        if (valueLength > 64) {
                            callback('总长度不能超过64位（1汉字=2位）');
                        } else {
                            callback();
                        }
                    },
                },
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
                {
                    validator: (rule, value, callback) => {
                        const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                        if (valueLength > 64) {
                            callback('总长度不能超过64位（1汉字=2位）');
                        } else {
                            callback();
                        }
                    },
                },
            ],
        },
    },
    {
        title: '电话',
        dataIndex: 'phone',
        hideInTable: true,
        hideInSearch: false,
        search: {
            transform: (value) => ({
                phone_queryProperties: value ? [value] : [],
            }),
        },
        formItemProps: {
            rules: [
                { whitespace: true, message: '不可为空格!' },
                {
                    pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                    message: '请输入正确的手机号',
                    max: 11,
                },
            ],
        },
    },
];

// TODO:过滤器条件查询
export const anotherFilterConditionFilter = [
    {
        title: '归属省份',
        dataIndex: 'filterProvince',
        hideInTable: true,
        hideInSearch: false,
        renderFormItem: (item, { fieldProps }, form) => {
            console.log(form.getFieldsValue());
            return (
                <SelectCondition
                    {...fieldProps}
                    form={form}
                    // mode="multiple"
                    title="省份"
                    id="key"
                    label="value"
                    dictName="province_id"
                    searchName="province_id"
                />
            );
        },
        search: {
            //transform: (value) => ({ filterProvince: value ? value?.join(',') : '' }),
            //transform: (value) => ({ filterProvince: value ? value : '' }),
            transform: (value) => ({ filterProvince: value }),
        },
    },
    {
        title: '归属专业',
        hideInTable: true,
        dataIndex: 'professionDictName',
        hideInSearch: false,
        renderFormItem: (item, { fieldProps }, form) => {
            return (
                <SelectCondition
                    {...fieldProps}
                    form={form}
                    mode="multiple"
                    title={titleVersion}
                    id="key"
                    label="value"
                    dictName={professionDictName}
                    searchName={professionDictName}
                    // addOptions={[
                    //     {
                    //         value: '',
                    //         label: '全部',
                    //     },
                    // ]}
                />
            );
        },
        search: {
            transform: (value) => ({ filterProfessional: value ? value?.join(',') : '' }),
        },
    },
];

export const onlyEmailFilterConditionColumn = {
    title: '邮箱',
    dataIndex: 'email',
    hideInTable: true,
    hideInSearch: false,
    search: {
        transform: (value) => ({
            email_queryProperties: value ? [value] : [],
        }),
    },
    formItemProps: {
        rules: [
            { whitespace: true, message: '不可为空格!' },
            {
                pattern: formatReg.email,
                message: '请输入正确的邮件地址',
            },
        ],
    },
};
