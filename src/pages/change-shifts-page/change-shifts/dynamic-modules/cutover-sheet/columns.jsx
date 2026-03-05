import React from 'react';
// import { Tooltip } from 'oss-ui';

const columns = [
    {
        title: '省份',
        dataIndex: 'province',
        key: 'province',
        align: 'center',
        hideInSearch: true,
        // ellipsis: true,
        width: 100,
        // render: (_, row) => {
        //     let str = row.province;
        //     if (str?.length > 4) {
        //         str = `${str.substring(0, 4)}...`;
        //     }
        //     return (
        //         <Tooltip title={row.province}>
        //             <div className="table-ellipsis">{str}</div>
        //         </Tooltip>
        //     );
        // },
    },
    {
        title: '专业',
        dataIndex: 'specialty',
        key: 'specialty',
        align: 'center',
        hideInSearch: true,
        // ellipsis: true,
        width: 100,
        // render: (_, row) => {
        //     let str = row.specialty;
        //     if (str?.length > 3) {
        //         str = `${str.substring(0, 3)}...`;
        //     }
        //     return (
        //         <Tooltip title={row.specialty}>
        //             <div className="table-ellipsis">{str}</div>
        //         </Tooltip>
        //     );
        // },
    },
    {
        title: '工单编号',
        dataIndex: 'sheetNumber',
        key: 'sheetNumber',
        align: 'center',
        hideInSearch: true,
        // ellipsis: true,
        width: 100,
        render: (_, row) => {
            return <a onClick={() => otherJumpEmos(row)}>{row.sheetNumber}</a>;
        },
    },
    {
        title: '主题',
        dataIndex: 'sheetTopic',
        key: 'sheetTopic',
        align: 'center',
        hideInSearch: true,
        // ellipsis: true,
        width: 150,
        // render: (text) => {
        //     return (
        //         <Tooltip title={text}>
        //             <div className="table-ellipsis">{text}</div>
        //         </Tooltip>
        //     );
        // },
    },
    {
        title: '申请单位',
        dataIndex: 'applicationDepartment',
        key: 'applicationDepartment',
        align: 'center',
        hideInSearch: true,
        // ellipsis: true,
        width: 100,
        // render: (text) => {
        //     return (
        //         <Tooltip title={text}>
        //             <div className="table-ellipsis">{text}</div>
        //         </Tooltip>
        //     );
        // },
    },
    {
        title: '割接开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        align: 'center',
        hideInSearch: true,
        // ellipsis: true,
        width: 100,
        // render: (text) => {
        //     return (
        //         <Tooltip title={text}>
        //             <div className="table-ellipsis">{text}</div>
        //         </Tooltip>
        //     );
        // },
    },
    {
        title: '割接结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        align: 'center',
        hideInSearch: true,
        // ellipsis: true,
        width: 100,
        // render: (text) => {
        //     return (
        //         <Tooltip title={text}>
        //             <div className="table-ellipsis">{text}</div>
        //         </Tooltip>
        //     );
        // },
    },
    {
        title: '割接结果',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        hideInSearch: true,
        // ellipsis: true,
        width: 100,
        // render: (text) => {
        //     return (
        //         <Tooltip title={text}>
        //             <div className="table-ellipsis">{text}</div>
        //         </Tooltip>
        //     );
        // },
    },
    {
        title: '割接审核',
        dataIndex: 'review',
        key: 'review',
        align: 'center',
        hideInSearch: true,
        // ellipsis: true,
        width: 100,
        // render: (text) => {
        //     return <div>{text}</div>
        // },
    },
];
export default columns;
