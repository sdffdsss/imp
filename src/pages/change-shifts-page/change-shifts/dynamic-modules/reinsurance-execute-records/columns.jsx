import React from 'react';
import { Tooltip } from 'oss-ui';
import DateEdit from '../../components/date-edit';

const columns = [
    {
        title: '执行时间',
        dataIndex: 'executeTime',
        key: 'executeTime',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 80,
        inlineEditProps: {
            editable: true,
            editComponentSetting: {
                component: <DateEdit />,
            },
        },
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '执行人',
        dataIndex: 'executor',
        key: 'executor',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 80,
        inlineEditProps: {
            editable: true,
            editComponentSetting: {
                maxLength: 20,
            },
        },
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '执行情况',
        dataIndex: 'executiveCondition',
        key: 'executiveCondition',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 120,
        inlineEditProps: {
            editable: true,
            editComponentSetting: {
                maxLength: 2000,
            },
        },
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 30,
        inlineEditProps: {
            editable: true,
            editComponentSetting: {
                maxLength: 2000,
            },
        },
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
];
export default columns;
