import React from 'react';
import { DatePicker, Icon, Tooltip, Button, Select } from 'oss-ui';
import AllSelect from '@Src/components/all-select';
import AuthButton from '@Src/components/auth-button';
import { faultCloseName, specialist } from '../enum';

const { RangePicker } = DatePicker;

export const getColumns = (props) => {
    const { showUserEditViewClick, delCurrentUserClick } = props;

    return [
        {
            title: '序号',
            dataIndex: 'serialNumber',
            align: 'center',
            search: false,
            width: 100,
        },
        {
            title: '故障名称',
            dataIndex: 'faultName',
            align: 'center',
            search: false,
            width: 200,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '故障开始时间',
            dataIndex: 'faultStartTime',
            align: 'center',
            width: 150,
            search: false,
        },

        {
            title: '故障结束时间',
            dataIndex: 'faultEndTime',
            align: 'center',
            width: 150,
            search: false,
        },

        {
            title: '故障历时',
            dataIndex: 'faultDuration',
            search: false,
            align: 'center',

            width: 100,
        },

        {
            title: '故障现象',
            dataIndex: 'faultPhenomenon',
            search: false,
            align: 'center',
            width: 380,

            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '故障平台',
            dataIndex: 'faultPlatform',
            search: false,
            align: 'center',
            width: 200,

            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '故障所在大区/省份',
            dataIndex: 'provinceName',
            search: false,
            align: 'center',
            width: 200,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '业务影响情况',
            dataIndex: 'businessEffect',
            search: false,
            align: 'center',
            width: 100,
        },
        {
            title: '影响范围',
            dataIndex: 'effectScope',
            search: false,
            align: 'center',
            width: 380,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '业务恢复时间',
            dataIndex: 'faultRestoreTime',
            search: false,
            align: 'center',
            width: 150,
        },
        {
            title: '业务中断历时',
            dataIndex: 'businessDuration',
            search: false,
            align: 'center',
            width: 100,
        },
        {
            title: '投诉情况',
            dataIndex: 'complaintStatus',
            search: false,
            align: 'center',
            width: 380,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '是否上报平台室',
            dataIndex: 'reportPlatform',
            search: false,
            align: 'center',
            width: 100,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '是否派单',
            dataIndex: 'sendOrder',
            search: false,
            align: 'center',
            width: 90,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '故障处理责任人',
            dataIndex: 'contactsName',
            search: false,
            align: 'center',
            width: 90,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '故障原因',
            dataIndex: 'faultCause',
            search: false,
            align: 'center',
            width: 380,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '故障专业',
            dataIndex: 'majorId',
            search: false,
            align: 'center',
            width: 100,
            render: (_, record) => {
                const itm = specialist.find((el) => el.value === record.majorId);
                if (itm) {
                    return itm.label;
                }
                return '-';
            },
        },
        {
            title: '故障闭环',
            dataIndex: 'faultCloseName',
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            search: false,
            align: 'center',
            width: 380,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '创建人',
            dataIndex: 'createdBy',
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            search: false,
            align: 'center',
            width: 150,
        },

        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            align: 'center',
            width: 140,
            fixed: 'right',
            className: 'action-columns',
            render: (text, row) => [
                <Tooltip title="编辑">
                    <AuthButton
                        key="edit"
                        onClick={() => showUserEditViewClick(row, 'edit')}
                        authKey="serviceFaultManagement:edit"
                        type="text"
                        antdIcon
                    >
                        <Icon key="userEdit" antdIcon type="EditOutlined" />
                    </AuthButton>
                </Tooltip>,
                <Tooltip title="查看">
                    <Button key="show" onClick={() => showUserEditViewClick(row, 'view')} type="text" antdIcon>
                        <Icon key="userEdit" antdIcon type="SearchOutlined" />
                    </Button>
                </Tooltip>,
                <Tooltip title="删除">
                    <AuthButton
                        key="delete"
                        onClick={() => delCurrentUserClick(row)}
                        authKey="serviceFaultManagement:delete"
                        type="text"
                        antdIcon
                        addLog
                    >
                        <Icon key="userDel" antdIcon type="DeleteOutlined" />
                    </AuthButton>
                </Tooltip>,
            ],
        },
    ];
};
export const tableForm = [
    {
        title: '故障开始时间',
        dataIndex: 'findTime',
        order: 5,
        hideInTable: true,
        valueType: 'dateTimeRange',
        renderFormItem: () => {
            return <RangePicker placeholder={['起始时间', '结束时间']} showTime={{ format: 'HH:mm:ss' }} />;
        },
    },

    {
        title: '故障专业',
        dataIndex: 'majorObj',
        hideInTable: true,
        order: 4,
        renderFormItem: () => {
            return <AllSelect options={specialist} placeholder="全部" />;
        },
    },
    {
        title: '故障闭环',
        dataIndex: 'faultCloseName',
        hideInTable: true,
        order: 3,
        renderFormItem: () => {
            return <Select options={[{ label: '全部', value: -1 }, ...faultCloseName]} placeholder="全部" />;
        },
    },
    {
        title: '故障名称',
        dataIndex: 'faultNames',
        search: true,
        align: 'center',
        order: 2,
        hideInTable: true,
        fieldProps: {
            maxLength: 200,
        },
    },
];
