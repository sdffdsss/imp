import React from 'react';
import { Tooltip } from 'oss-ui';
import { sendLogFn } from '@Pages/components/auth/utils';

function otherJumpEmos(row) {
    if (row.detailUrl) {
        sendLogFn({ authKey: 'workbench-Workbench-ReassuranceSchedule-Detail' });
        window.open(row.detailUrl);
    }
}

const columns = [
    {
        title: '工单编号',
        dataIndex: 'sheetNumber',
        key: 'sheetNumber',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 80,
        render: (_, row) => {
            return <a onClick={() => otherJumpEmos(row)}>{row.sheetNumber}</a>;
        },
    },
    {
        title: '工单主题',
        dataIndex: 'sheetTopic',
        key: 'sheetTopic',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 120,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '重保原因',
        dataIndex: 'reinsuranceReason',
        key: 'reinsuranceReason',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 30,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '重保等级',
        dataIndex: 'reinsuranceLevel',
        key: 'reinsuranceLevel',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 50,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '紧急程度',
        dataIndex: 'urgency',
        key: 'urgency',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 50,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '重保开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 50,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '重保结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 50,
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
