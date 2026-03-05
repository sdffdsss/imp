import React from 'react';
import { _ } from 'oss-web-toolkits';
import SelectComp from '../select.jsx';

const showColumnsList = [
    {
        type: 'title_text',
        enumType: 'title_text',
        columns: [
            {
                dataIndex: 'rank',
                align: 'center',
                width: 80,
                title: '序号',
                render: (text, record, index) => {
                    return index + 1;
                },
            },
            {
                dataIndex: 'name',
                align: 'center',
                title: '告警标题',
                ellipsis: true,
            },
        ],
    },
    {
        type: 'standard_alarm_id',
        enumType: 'standard_alarm_id',
        columns: [
            {
                dataIndex: 'rank',
                align: 'center',
                width: 80,
                title: '序号',
                render: (text, record, index) => {
                    return index + 1;
                },
            },
            {
                dataIndex: 'name',
                align: 'center',
                title: '网管告警id',
                ellipsis: true,
            },
        ],
    },
    {
        type: 'standard_alarm_name',
        columns: [
            {
                dataIndex: 'rank',
                align: 'center',
                title: '序号',
                width: 80,
                render: (text, record, index) => {
                    return index + 1;
                },
            },
            {
                dataIndex: 'name',
                align: 'center',
                title: '告警标准名',
                ellipsis: true,
            },
        ],
    },
];

const searchColumnsList = [
    {
        type: 'title_text',
        columns: [
            {
                dataIndex: 'rank',
                align: 'center',
                width: 80,
                title: '序号',
                hideInSearch: true,
                render: (text, record, index) => {
                    return index + 1;
                },
            },
            {
                dataIndex: 'vendorName',
                align: 'center',
                title: '厂家',
                ellipsis: true,
                renderFormItem: (item, { fieldProps }, form) => {
                    return <SelectComp {...fieldProps} form={form} mode="" label="value" dictName="vendor_id" id="key" />;
                },
            },
            {
                dataIndex: 'title',
                align: 'center',
                title: '告警标题',
                ellipsis: true,
            },
        ],
    },
    {
        type: 'standard_alarm_id',
        columns: [
            {
                dataIndex: 'rank',
                align: 'center',
                width: 80,
                hideInSearch: true,
                title: '序号',
                render: (text, record, index) => {
                    return index + 1;
                },
            },
            {
                dataIndex: 'value',
                align: 'center',
                title: '网管告警id',
                ellipsis: true,
            },
        ],
    },
    {
        type: 'standard_alarm_name',
        columns: [
            {
                dataIndex: 'rank',
                width: 80,
                align: 'center',
                hideInSearch: true,
                title: '序号',
                render: (text, record, index) => {
                    return index + 1;
                },
            },
            {
                dataIndex: 'value',
                align: 'center',
                title: '告警标准名',
                ellipsis: true,
            },
        ],
    },
];

export function getShowColumnsByType(type) {
    return _.find(showColumnsList, { type })?.columns || [];
}

export function getSearchColumnsByType(type) {
    return _.find(searchColumnsList, { type })?.columns || [];
}
