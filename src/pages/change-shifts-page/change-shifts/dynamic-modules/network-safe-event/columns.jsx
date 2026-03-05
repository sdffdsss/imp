import React from 'react';
import { Tooltip } from 'oss-ui';

export const columns = [
    {
        title: '所属网络',
        dataIndex: 'grid',
        align: 'center',
        width: 100,
        onFilter: false,
        filters: false,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '封堵时间',
        dataIndex: 'pluggingTime',
        align: 'center',
        width: 120,
        ellipsis: true,
        onFilter: false,
        filters: false,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '被封堵IP',
        dataIndex: 'pluggingIp',
        align: 'center',
        width: 100,
        onFilter: false,
        filters: false,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '所属运营商',
        dataIndex: 'operator',
        align: 'center',
        width: 100,
        onFilter: false,
        filters: false,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '封堵IP来源',
        dataIndex: 'pluggingIpSource',
        align: 'center',
        width: 100,
        onFilter: false,
        filters: false,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '封堵人',
        dataIndex: 'pluggingMan',
        align: 'center',
        width: 80,
        ellipsis: true,
        hideInSearch: true,
        onFilter: false,
        filters: false,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '是否解封',
        dataIndex: 'unsealFlag',
        align: 'center',
        width: 100,
        onFilter: false,
        filters: false,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
];
