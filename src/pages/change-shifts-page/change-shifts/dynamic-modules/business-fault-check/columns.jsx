import React from 'react';

const specialist = [
    { label: '业务平台', value: 9996 },
    { label: '核心网专业', value: 1 },
    { label: '云资源专业', value: 86 },
    { label: '传输专业', value: 3 },
    { label: '互联网专业', value: 9999 },
    { label: '网管系统', value: 5 },
    { label: '其他', value: 10000 },
];
export const getColumns = () => {
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
            width: 200,
            search: false,
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
    ];
};
