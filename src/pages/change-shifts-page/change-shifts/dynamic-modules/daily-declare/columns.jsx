import React from 'react';
import { Tooltip } from 'oss-ui';
import './index.less';

export const columns = [
    // {
    //     title: '说明',
    //     dataIndex: 'explainFlag',
    //     key: 'explainFlag',
    //     align: 'center',
    //     hideInSearch: true,
    //     ellipsis: true,
    //     width: 40,
    //     render: (_, row) => {
    //         return row.explainFlag === '上' ? <div className="is-last-remain">上</div> : '本';
    //     },
    // },

    {
        title: '专业网类型',
        dataIndex: 'professionalNetworkTypeText',
        ellipsis: true,
        align: 'center',
        width: 100,
        search: false,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '系统',
        dataIndex: 'networkTypeText',
        ellipsis: true,
        align: 'center',
        width: 100,
        search: false,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '申告类型',
        dataIndex: 'declarationTypeText',
        ellipsis: true,
        align: 'center',
        width: 100,
        search: false,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '协调处理时间',
        dataIndex: 'coordinationProcessingTime',
        ellipsis: true,
        align: 'center',
        width: 100,
        search: false,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '协调人',
        dataIndex: 'coordinationPeople',
        ellipsis: true,
        align: 'center',
        width: 100,
        search: false,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },

    {
        title: '协调工作具体内容',
        dataIndex: 'coordinationContent',
        ellipsis: true,
        search: false,
        align: 'center',
        width: 300,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
        // width: 20,
    },
    {
        title: '协调结果',
        dataIndex: 'coordinationResultsText',
        ellipsis: true,
        align: 'center',
        width: 100,
        search: false,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
];
