import React from 'react';
import { Tooltip } from 'oss-ui';

const columns = [
    {
        title: '主题',
        dataIndex: 'topic',
        key: 'topic',
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
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
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
        title: '重保标识',
        dataIndex: 'reinsuranceLogoName',
        key: 'reinsuranceLogoName',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
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
        title: '重保开始时间',
        dataIndex: 'reinsuranceStartTime',
        key: 'reinsuranceStartTime',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 100,
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
        dataIndex: 'reinsuranceEndTime',
        key: 'reinsuranceEndTime',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 100,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '重保类型',
        dataIndex: 'reinsuranceTypeName',
        key: 'reinsuranceTypeName',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
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
        title: '重保等级',
        dataIndex: 'reinsuranceLevelName',
        key: 'reinsuranceLevelName',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
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
        title: '紧急程度',
        dataIndex: 'urgencyName',
        key: 'urgencyName',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 80,
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
