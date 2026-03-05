import React from 'react';
import { Tooltip } from 'oss-ui';

export const coreNetWorkColumns = [
    {
        title: '说明',
        dataIndex: 'explainFlag',
        key: 'explainFlag',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 60,
        render: (_, row) => {
            return row.explainFlag === '上' ? <div className="is-last-remain">上</div> : '本';
        },
    },
    {
        title: '专业网类型',
        dataIndex: 'networkTypeText',
        key: 'networkTypeText',
        hideInSearch: true,
        align: 'center',
        ellipsis: true,
        width: 120,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障所在省',
        dataIndex: 'faultProvince',
        key: 'faultProvince',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障点所属地区',
        dataIndex: 'faultPointArea',
        key: 'faultPointArea',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障开始日期/时间',
        dataIndex: 'faultCreateTime',
        key: 'faultCreateTime',
        align: 'center',
        width: 140,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障结束日期/时间',
        dataIndex: 'faultOverTime',
        key: 'faultOverTime',
        align: 'center',
        width: 140,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障原因',
        align: 'center',
        dataIndex: 'causeObstacleText',
        hideInSearch: false,
        ellipsis: true,
        width: 120,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '业务影响情况',
        dataIndex: 'businessImpactText',
        key: 'businessImpactText',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '中断业务历时(分钟)',
        dataIndex: 'interruptionDuration',
        key: 'interruptionDuration',
        hideInSearch: true,
        align: 'center',
        width: 180,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障记录',
        dataIndex: 'faultRecord',
        key: 'faultRecord',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '处理结果',
        dataIndex: 'processingResultText',
        key: 'processingResultText',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '处理人',
        dataIndex: 'recorder',
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '班组来源',
        dataIndex: 'groupSource',
        ellipsis: true,
        align: 'center',
        search: false,
        width: 120,
        order: 1,
    },
];

export const notCoreNetColumns = [
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
        title: '申告单位',
        dataIndex: 'reportUnit',
        key: 'reportUnit',
        hideInSearch: false,
        align: 'center',
        width: 120,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '障碍现象',
        dataIndex: 'obstaclePhenomenon',
        key: 'obstaclePhenomenon',
        align: 'center',
        width: 120,
        ellipsis: true,
        // render: (text) => {
        //     return (
        //         <Tooltip title={text} overlayClassName="tooltip-render">
        //             {text.split('\n').map((line) => (
        //                 <span>
        //                     {line}
        //                     <br />
        //                 </span>
        //             ))}
        //         </Tooltip>
        //     );
        // },
    },
    {
        title: '受理时间',
        dataIndex: 'receptionTime',
        key: 'receptionTime',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障地点',
        dataIndex: 'faultLocation',
        key: 'faultLocation',
        hideInSearch: false,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障原因',
        dataIndex: 'causeObstacleText',
        key: 'causeObstacleText',
        hideInSearch: false,
        align: 'center',
        width: 120,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '所属网络',
        dataIndex: 'owningNetworkText',
        key: 'owningNetworkText',
        align: 'center',
        width: 120,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障发生时间',
        dataIndex: 'faultCreateTime',
        key: 'faultCreateTime',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障是否恢复',
        dataIndex: 'faultRecoveryText',
        key: 'faultRecoveryText',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
];
export const networkColumns = [
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
        title: '申告单位',
        dataIndex: 'reportUnit',
        key: 'reportUnit',
        hideInSearch: false,
        align: 'center',
        width: 120,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '所属网络',
        dataIndex: 'owningNetworkText',
        key: 'owningNetworkText',
        align: 'center',
        width: 120,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },

    {
        title: '受理时间',
        dataIndex: 'receptionTime',
        key: 'receptionTime',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障地点',
        dataIndex: 'faultLocation',
        key: 'faultLocation',
        hideInSearch: false,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障原因',
        dataIndex: 'causeObstacleText',
        key: 'causeObstacleText',
        hideInSearch: false,
        align: 'center',
        width: 120,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },

    {
        title: '故障发生时间',
        dataIndex: 'faultCreateTime',
        key: 'faultCreateTime',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障历时（分钟）',
        dataIndex: 'faultDuration',
        key: 'faultDuration',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
    },
    {
        title: '故障是否恢复',
        dataIndex: 'faultRecoveryText',
        key: 'faultRecoveryText',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障恢复时间',
        dataIndex: 'faultOverTime',
        key: 'faultOverTime',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
    },
    {
        title: '故障受理历时(分钟)',
        dataIndex: 'faultHandDuration',
        key: 'faultHandDuration',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
    },
    {
        title: '障碍现象',
        dataIndex: 'obstaclePhenomenon',
        key: 'obstaclePhenomenon',
        hideInSearch: true,
        align: 'center',
        width: 240,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    {text.split('\n').map((line) => (
                        <span>
                            {line}
                            <br />
                        </span>
                    ))}
                </Tooltip>
            );
        },
    },
    {
        title: '班组来源',
        dataIndex: 'groupSource',
        key: 'groupSource',
        hideInSearch: true,
        align: 'center',
        width: 120,
        ellipsis: true,
    },
];
