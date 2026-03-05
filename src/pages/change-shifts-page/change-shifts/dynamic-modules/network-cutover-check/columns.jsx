import React from 'react';
import { Tooltip } from 'oss-ui';
// import src\pages\network-cutover\business\columns.tsx
import getColumns from '@Src/pages/network-cutover/business/columns';

function formatValueEnum(enumData, value) {
    return enumData?.find((item) => String(item.key || item.value) === String(value))?.value || '-';
}
export const businessPlatformColumns = [
    {
        title: '主题',
        dataIndex: 'theme',
        ellipsis: true,
        align: 'center',
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '割接开始时间',
        dataIndex: 'cutoverStartTime',
        ellipsis: true,
        align: 'center',
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '割接结束时间',
        dataIndex: 'cutoverEndTime',
        ellipsis: true,
        align: 'center',
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
];

const affiliatedNetworkEnum = [
    {
        key: '1',
        value: '互联网',
    },
    {
        key: '2',
        value: 'China169网',
    },
    {
        key: '3',
        value: 'CUII',
    },
    {
        key: '4',
        value: '承载B网',
    },
];
const completionStatusEnum = [
    {
        key: '1',
        value: '正在进行中',
    },
    {
        key: '2',
        value: '按计划完成',
    },
    {
        key: '3',
        value: '割接已撤销',
    },
    {
        key: '4',
        value: '割接失败已回退',
    },
];
const recordSourceEnum = [
    {
        key: '0',
        value: '其他',
    },
    {
        key: '1',
        value: '工单',
    },
    {
        key: '2',
        value: '微信',
    },
    {
        key: '3',
        value: '电话',
    },
    {
        key: '4',
        value: '邮件',
    },
];
const nmsTypeEnum = [
    {
        key: '1',
        value: '移网',
    },
    {
        key: '2',
        value: '固网',
    },
    {
        key: '3',
        value: '其他',
    },
];

export function getCoreNetworkColumns(enums) {
    return [
        {
            title: '流水号',
            dataIndex: 'serialNumber',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '操作开始时间',
            dataIndex: 'cutoverStartTime',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '操作结束时间',
            dataIndex: 'cutoverEndTime',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '专业',
            dataIndex: 'professionTypeName',
            align: 'center',
            width: 100,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '大区省份',
            dataIndex: 'provinceName',
            align: 'center',
            width: 80,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '省份地市',
            dataIndex: 'regionName',
            ellipsis: true,
            align: 'center',
            width: 80,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '网络类型',
            dataIndex: 'nmsType',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text, record) => {
                return (
                    <Tooltip title={formatValueEnum(nmsTypeEnum, record.nmsType)} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{formatValueEnum(nmsTypeEnum, record.nmsType)}</div>
                    </Tooltip>
                );
            },
        },

        {
            title: '操作网元',
            dataIndex: 'operateNe',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '是否完成',
            dataIndex: 'isCutoverFinish',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text ? '是' : '否'}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '值班人',
            dataIndex: 'dutyman',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '记录人',
            dataIndex: 'recorder',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '记录来源',
            dataIndex: 'recordSource',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text, record) => {
                return (
                    <Tooltip title={formatValueEnum(recordSourceEnum, record.recordSource)} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{formatValueEnum(recordSourceEnum, record.recordSource)}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '告警网管',
            dataIndex: 'alarmStation',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '记录时间',
            dataIndex: 'recordTime',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '操作内容',
            dataIndex: 'operateContent',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '割接详情',
            dataIndex: 'cutoverContent',
            ellipsis: true,
            align: 'center',
            width: 200,
            render: (text, record) => {
                return (
                    <Tooltip title={record.cutoverContent} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{record.cutoverContent}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '主要网管告警清除时间',
            dataIndex: 'alarmClearTime',
            ellipsis: true,
            align: 'center',
            width: 180,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '配合割接完成情况',
            dataIndex: 'coordinateSituation',
            ellipsis: true,
            align: 'center',
            width: 140,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '备注',
            dataIndex: 'notes',
            ellipsis: true,
            align: 'center',
            width: 140,
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '割接地点',
            dataIndex: 'cutoverLocation',
            ellipsis: true,
            align: 'center',
            width: 140,
            fieldProps: (form, config) => {
                return {
                    ...config,
                    maxLength: 200,
                };
            },
        },
        {
            title: '是否展示在大屏',
            dataIndex: 'isShowOnBigScreen',
            ellipsis: true,
            align: 'center',
            width: 140,
            render: (_, row) => {
                return row.isShowOnBigScreen === 1 ? '是' : '否';
            },
            search: false,
        },
        {
            title: '割接总结',
            dataIndex: 'cutoverSummary',
            ellipsis: true,
            align: 'center',
            search: false,
            width: 140,
        },
        {
            title: '班组来源',
            dataIndex: 'groupSource',
            ellipsis: true,
            align: 'center',
            search: false,
            width: 140,
        },
    ];
}

export function getInternetColumns(enums) {
    return [
        {
            title: '所属网络',
            dataIndex: 'affiliatedNetwork',
            ellipsis: true,
            align: 'center',
            width: 120,
            render(text, record) {
                return formatValueEnum(affiliatedNetworkEnum, record.affiliatedNetwork);
                // return formatValueEnum(enums.affiliatedNetworkEnum, text);
            },
        },
        {
            title: '割接地点',
            dataIndex: 'cutoverLocation',
            ellipsis: true,
            width: 120,
            align: 'center',
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '操作单位',
            dataIndex: 'departmentName',
            ellipsis: true,
            width: 120,
            align: 'center',
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '割接开始时间',
            dataIndex: 'cutoverStartTime',
            ellipsis: true,
            width: 120,
            align: 'center',
            // valueType: 'dateTimeRange',
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '割接结束时间',
            dataIndex: 'cutoverEndTime',
            ellipsis: true,
            width: 120,
            align: 'center',
            // valueType: 'dateTimeRange',
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '割接总结',
            dataIndex: 'cutoverSummary',
            ellipsis: true,
            align: 'center',
            search: false,
        },
        {
            title: '是否展示在大屏',
            dataIndex: 'isShowOnBigScreen',
            ellipsis: true,
            order: 3,
            align: 'center',
            render: (_, row) => {
                return row.isShowOnBigScreen === 1 ? '是' : '否';
            },
            search: false,
        },
        {
            title: '班组来源',
            dataIndex: 'groupSource',
            ellipsis: true,
            order: 3,
            align: 'center',
            search: false,
        },
    ];
}

export function getAtmColumns(enums) {
    return [
        {
            title: '记录人',
            dataIndex: 'recorder',
            ellipsis: true,
            search: false,
            width: 120,
            align: 'center',
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '是否中断业务',
            dataIndex: 'isInterruptBusiness',
            ellipsis: true,
            search: true,
            width: 120,
            align: 'center',
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text ? '是' : '否'}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '完成情况',
            dataIndex: 'completionStatus',
            ellipsis: true,
            search: true,
            width: 120,
            align: 'center',
            render(text, record) {
                return formatValueEnum(completionStatusEnum, record.completionStatus);
                // return formatValueEnum(enums.completionStatusEnum, text);
            },
        },
        {
            title: '割接开始时间',
            dataIndex: 'cutoverStartTime',
            ellipsis: true,
            width: 120,
            align: 'center',
            // valueType: 'dateTimeRange',
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '割接结束时间',
            dataIndex: 'cutoverEndTime',
            ellipsis: true,
            width: 120,
            align: 'center',
            // valueType: 'dateTimeRange',
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '操作单位',
            dataIndex: 'departmentName',
            ellipsis: true,
            search: true,
            width: 120,
            align: 'center',
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
            dataIndex: 'affiliatedNetwork',
            ellipsis: true,
            search: true,
            width: 120,
            align: 'center',
            render(text, record) {
                return formatValueEnum(affiliatedNetworkEnum, record.affiliatedNetwork);
                // return formatValueEnum(enums.affiliatedNetworkEnum, text);
            },
        },
        {
            title: '割接信息',
            dataIndex: 'cutoverInfo',
            ellipsis: true,
            search: false,
            width: 120,
            align: 'center',
            render: (text) => {
                return (
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
    ];
}
export { getColumns };
