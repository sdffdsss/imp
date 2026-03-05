import React from 'react';
import { Tooltip } from 'oss-ui';

const columns = [
    {
        title: '工单编号',
        dataIndex: 'sheetNo',
        key: 'sheetNo',
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
        // render: (_, row) => {
        //     return <a onClick={() => this.jumpEmos(row)}>{row.sheetNo}</a>;
        // },
    },
    {
        title: '客户名称',
        dataIndex: 'sheetTitle',
        key: 'sheetTitle',
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
        title: '电路名称',
        dataIndex: 'sheetStatus',
        key: 'sheetStatus',
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
        title: '派单时间',
        dataIndex: 'forwardTime',
        key: 'forwardTime',
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
        title: '受理时间',
        dataIndex: 'acceptanceTime',
        key: 'acceptanceTime',
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
        title: '故障描述',
        dataIndex: 'faultDesc',
        key: 'faultDesc',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 50,
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
