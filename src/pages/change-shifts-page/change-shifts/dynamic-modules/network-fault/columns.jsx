import React from 'react';
import { message, Tooltip, DatePicker, Select } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { getInitialProvince } from '@Common/utils/getInitialProvince';
import request from '@Src/common/api';
import moment from 'moment';
import { sendLogFn } from '@Pages/components/auth/utils';
import TransmissionNetworkTreatResultEdit from './transmission-network-treat-result-edit';
import FinishColumnEdit from './finish-column-edit';
import DateEdit from '../../components/date-edit';

function jumpEmos(row) {
    sendLogFn({ authKey: 'workbench-Workbench-NetworkFaultOrder-Detail' });

    const { loginId } = useLoginInfoModel.data;
    const { professionalType, forwardTime } = row;
    const provinceId = getInitialProvince(useLoginInfoModel.data);
    const data = {
        logInId: loginId,
        provinceId,
        sheetNo: row.sheetNo,
        professionalType,
        forwardTime,
    };
    request('work/sheet/v1/getEmosUrlForDutyManager', {
        data,
        type: 'post',
        showSuccessMessage: false,
        baseUrlType: 'failureSheetExportUrl',
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
        width: 80,
        render: (_, row) => {
            return row.explainFlag === '上' ? <div className="is-last-remain">上</div> : '本';
        },
    },
    {
        title: '是否完成',
        dataIndex: 'finishedFlag',
        key: 'finishedFlag',
        align: 'center',
        width: 100,
        inlineEditProps: {
            editable: true,
            editComponentSetting: {
                component: <FinishColumnEdit />,
            },
        },
        render: (text) => {
            const showText = text === 0 ? '未完成' : '已完成';
            return <Tooltip title={showText}>{showText}</Tooltip>;
        },
    },
    {
        title: '工单编号',
        dataIndex: 'sheetNo',
        key: 'sheetNo',
        align: 'center',
        width: 280,
        render: (_, row) => {
            return (
                <Tooltip title={row.sheetNo}>
                    <a onClick={() => jumpEmos(row)}>{row.sheetNo}</a>
                </Tooltip>
            );
        },
    },
    {
        title: '工单标题',
        dataIndex: 'sheetTitle',
        key: 'sheetTitle',
        align: 'center',
        width: 250,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    {text}
                </Tooltip>
            );
        },
    },
    {
        title: '工单状态',
        dataIndex: 'sheetStatus',
        key: 'sheetStatus',
        align: 'center',
        width: 120,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    {text}
                </Tooltip>
            );
        },
    },
    {
        title: '建单人',
        dataIndex: 'sendPerson',
        key: 'sendPerson',
        align: 'center',
        width: 120,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    {text}
                </Tooltip>
            );
        },
    },
    {
        title: '派单时间',
        dataIndex: 'forwardTime',
        key: 'forwardTime',
        align: 'center',
        width: 180,
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    {text}
                </Tooltip>
            );
        },
    },
    {
        title: '故障发生时间',
        dataIndex: 'faultStartTime',
        key: 'faultStartTime',
        align: 'center',
        width: 180,
        inlineEditProps: {
            editable: true,
            editComponentSetting: {
                component: <DateEdit />,
            },
        },
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    {text}
                </Tooltip>
            );
        },
    },
    {
        title: '故障结束时间',
        dataIndex: 'faultEndTime',
        key: 'faultEndTime',
        align: 'center',
        width: 180,
        inlineEditProps: {
            editable: true,
            editComponentSetting: {
                component: <DateEdit />,
            },
        },
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    {text}
                </Tooltip>
            );
        },
    },
    {
        title: '故障描述',
        dataIndex: 'bearerService',
        key: 'bearerService',
        align: 'center',
        width: 250,
        inlineEditProps: {
            editable: true,
            editComponentSetting: {
                maxLength: 2000,
                autoSize: true,
            },
        },
        render: (text) => {
            return (
                <div style={{ maxWidth: 400 }}>
                    <Tooltip title={text} overlayClassName="tooltip-render">
                        {text}
                    </Tooltip>
                </div>
            );
        },
    },
    {
        title: '处理结果',
        dataIndex: 'faultReasonDesc',
        key: 'faultReasonDesc',
        align: 'center',
        width: 250,
        inlineEditProps: {
            editable: true,
            editComponentSetting: {
                component: <TransmissionNetworkTreatResultEdit />,
                maxLength: 700,
            },
        },
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    {text}
                </Tooltip>
            );
        },
    },
    {
        title: '追加信息',
        dataIndex: 'chaseInfo',
        key: 'chaseInfo',
        align: 'center',
        width: 250,
        inlineEditProps: {
            editable: true,
            editComponentSetting: {
                maxLength: 1000,
                autoSize: true,
            },
        },
        render: (text) => {
            return (
                <Tooltip title={text} overlayClassName="tooltip-render">
                    {text}
                </Tooltip>
            );
        },
    },
];

export const getSupplementColumns = ({ provinceData, professionalTypes, defaultProfession }) => [
    {
        dataIndex: 'sheetNo',
        key: 'sheetNo',
        title: '工单编号',
        align: 'center',
        width: 260,
        order: 1,
    },
    {
        dataIndex: 'sheetTitle',
        key: '',
        title: '主题',
        align: 'center',
        hideInSearch: true,
        width: 300,
    },
    {
        dataIndex: 'faultTime',
        key: 'faultTime',
        title: '故障开始时间',
        align: 'center',
        width: 150,
        hideInTable: true,
        order: 4,
        initialValue: [moment(`${moment().subtract(1, 'days').format('YYYY-MM-DD')} 00:00:00`), moment(`${moment().format('YYYY-MM-DD')} 23:59:59`)],
        renderFormItem: () => {
            return <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['起始时间', '结束时间']} />;
        },
    },
    {
        dataIndex: 'faultStartTime',
        key: 'faultStartTime',
        title: '故障开始时间',
        align: 'center',
        width: 150,
        hideInSearch: true,
    },
    {
        dataIndex: 'faultEndTime',
        key: 'faultEndTime',
        title: '故障结束时间',
        align: 'center',
        hideInSearch: true,
        width: 150,
    },
    {
        dataIndex: 'bearerService',
        key: 'bearerService',
        title: '故障描述',
        align: 'center',
        hideInSearch: true,
        width: 300,
    },
    {
        dataIndex: 'faultReasonDesc',
        key: 'faultReasonDesc',
        title: '处理结果',
        align: 'center',
        hideInSearch: true,
        width: 300,
    },
    {
        dataIndex: 'forwardTime',
        key: 'forwardTime',
        title: '派单时间',
        align: 'center',
        hideInSearch: true,
        width: 150,
    },
    {
        dataIndex: 'provinceId',
        key: 'provinceId',
        title: '故障省份',
        hideInTable: true,
        renderFormItem: () => {
            return <Select placeholder="请选择" options={provinceData} allowClear />;
        },
        order: 3,
    },
    {
        dataIndex: 'profession',
        key: 'profession',
        title: '专业',
        hideInTable: true,
        initialValue: defaultProfession,
        renderFormItem: () => {
            return <Select placeholder="请选择" options={professionalTypes} allowClear />;
        },
        order: 2,
    },
];
export default columns;
