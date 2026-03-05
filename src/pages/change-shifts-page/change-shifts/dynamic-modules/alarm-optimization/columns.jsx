import React from 'react';
import { Tooltip } from 'oss-ui';

export const columns = [
    {
        title: '说明',
        dataIndex: 'explainFlag',
        key: 'explainFlag',
        align: 'center',
        hideInSearch: true,
        width: 60,
        render: (_, row) => {
            return row.explainFlag === '上' ? <div className="is-last-remain">上</div> : '本';
        },
    },
    {
        title: '告警平台',
        dataIndex: 'alarmPlatform',
        ellipsis: true,
        search: true,
        align: 'center',
        width: 100,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '告警级别',
        dataIndex: 'alarmLevel',
        ellipsis: true,
        align: 'center',
        search: true,
        width: 100,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '首次发生时间',
        dataIndex: 'firstTime',
        ellipsis: true,
        search: false,
        align: 'center',
        width: 200,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '清除时间',
        dataIndex: 'clearTime',
        ellipsis: true,
        search: false,
        align: 'center',
        width: 200,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '最后发生时间',
        dataIndex: 'lastTime',
        ellipsis: true,
        search: false,
        align: 'center',
        width: 200,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '告警主题',
        dataIndex: 'alarmTitle',
        ellipsis: true,
        search: true,
        align: 'center',
        order: 7,
        width: 80,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '告警内容',
        dataIndex: 'alarmContent',
        ellipsis: true,
        search: false,
        align: 'center',
        width: 120,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '告警原因',
        dataIndex: 'alarmReason',
        ellipsis: true,
        search: false,
        align: 'center',
        width: 80,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '影响范围',
        dataIndex: 'incidence',
        ellipsis: true,
        search: false,
        align: 'center',
        width: 80,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '重复次数',
        dataIndex: 'repeatTimes',
        ellipsis: true,
        search: false,
        align: 'center',
        width: 80,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '是否需要优化',
        dataIndex: 'optimizationFlag',
        ellipsis: true,
        search: false,
        align: 'center',
        width: 200,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '优化措施',
        dataIndex: 'optimizationMeasures',
        ellipsis: true,
        search: false,
        align: 'center',
        width: 80,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '是否完成优化',
        dataIndex: 'optimizationCompleteFlag',
        ellipsis: true,
        search: false,
        align: 'center',
        width: 200,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
];
