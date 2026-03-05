import React from 'react';
import { Tooltip, message } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import request from '@Src/common/api';

function jumpEmos(row) {
    const { loginId } = useLoginInfoModel.data;
    const data = {
        logInId: loginId,
        sheetNumber: row.sheetNumber,
    };
    request('shiftOfDutyBusinessFaultSheet/queryBusinessFaultSheetDetail', {
        data,
        type: 'get',
        showSuccessMessage: false,
        baseUrlType: 'dutyManagerUrl',
    })
        .then((res) => {
            if (res) {
                if (res.code === 200) {
                    window.open(res.data);
                } else {
                    message.warn(res.message);
                }
            }
        })
        .catch(() => {});
}
const columns = [
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
        title: '工单编号',
        dataIndex: 'sheetNumber',
        key: 'sheetNumber',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 80,
        render: (_, row) => {
            return (
                <Tooltip title={row.sheetNumber}>
                    <div className="table-ellipsis">
                        <a onClick={() => jumpEmos(row)}>{row.sheetNumber}</a>
                    </div>
                </Tooltip>
            );
        },
    },
    {
        title: '客户名称',
        dataIndex: 'customerName',
        key: 'customerName',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 30,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障专线',
        dataIndex: 'faultLineNo',
        key: 'faultLineNo',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 30,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '工单状态',
        dataIndex: 'woStatus',
        key: 'woStatus',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 30,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '建单时间',
        dataIndex: 'creationDate',
        key: 'creationDate',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 50,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '受理时间',
        dataIndex: 'acceptTime',
        key: 'acceptTime',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 50,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障原因简述',
        dataIndex: 'faultShortDesc',
        key: 'faultShortDesc',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        width: 50,
        render: (text) => {
            return (
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '故障描述',
        dataIndex: 'remark',
        key: 'remark',
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
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
    {
        title: '处理结果',
        dataIndex: 'results',
        key: 'results',
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
                <Tooltip overlayClassName="white-tooltip-content" title={text}>
                    <div className="table-ellipsis">{text}</div>
                </Tooltip>
            );
        },
    },
];
export default columns;
