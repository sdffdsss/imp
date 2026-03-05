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
        width: 30,
        render: (_, row) => {
            return row.explainFlag === '上' ? <div className="is-last-remain">上</div> : '本';
        },
    },
    {
        title: '值班人员',
        dataIndex: 'dutyName',
        key: 'dutyName',
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
        title: '受理方式',
        dataIndex: 'acceptMethodText',
        key: 'acceptMethodText',
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
        title: '故障发生时间',
        dataIndex: 'findTime',
        key: 'findTime',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 40,
        render: (text) => {
            return (
                <Tooltip title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '业务类型',
        dataIndex: 'businessTypeText',
        key: 'businessTypeText',
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
        title: '电路代号',
        dataIndex: 'circuitCodeName',
        key: 'circuitCodeName',
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
        title: '申告内容详述',
        dataIndex: 'declarationContent',
        key: 'declarationContent',
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
        title: '处理结果',
        dataIndex: 'processStatus',
        key: 'processStatus',
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
        title: '故障(事件)原因',
        dataIndex: 'faultCause',
        key: 'faultCause',
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
        title: '申告客户',
        dataIndex: 'declarationCustom',
        key: 'declarationCustom',
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
        title: '联系人',
        dataIndex: 'contactsName',
        key: 'contactsName',
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
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
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
