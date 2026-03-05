import React from 'react';
import { Tooltip } from 'oss-ui';

export const columns = [
    {
        title: '说明',
        dataIndex: 'explainFlag',
        key: 'explainFlag',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 40,
        render: (_, row) => {
            return row.explainFlag === '上' ? <div className="is-last-remain">上</div> : '本';
        },
    },
    {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        hideInSearch: true,
        align: 'center',
        width: 80,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '值班人员',
        dataIndex: 'watchMan',
        key: 'watchMan',
        hideInSearch: true,
        align: 'center',
        // ellipsis: true,
        width: 60,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '记录内容',
        dataIndex: 'recordContent',
        key: 'recordContent',
        hideInSearch: true,
        width: 380,
        align: 'center',

        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div>{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '完成情况',
        dataIndex: 'completion',
        key: 'completion',
        hideInSearch: true,
        align: 'center',
        // ellipsis: true,
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
