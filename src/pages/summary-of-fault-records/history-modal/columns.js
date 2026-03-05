import dayjs from 'dayjs';
import React from 'react';
import { _ } from 'oss-web-toolkits';

export const getColumns = () => {
    const columns = [
        {
            title: '故障编号',
            dataIndex: 'faultRecordId',
            width: 180,
            align: 'center',
            ellipsis: true,
            // sorter: true,
            hideInSearch: true,
        },
        {
            title: '工单编号',
            dataIndex: 'sheetNo',
            align: 'center',
            width: 180,
            // sorter: true,
            onFilter: false,
            filters: false,
            ellipsis: true,
            hideInSearch: true,
        },

        {
            title: '操作人',
            dataIndex: 'operator',
            align: 'center',
            width: 120,
            // sorter: true,
            ellipsis: true,
            hideInSearch: true,
            onFilter: false,
            filters: false,
        },

        {
            title: '操作时间',
            dataIndex: 'operateTime',
            align: 'center',
            // sorter: true,
            ellipsis: true,
            onFilter: false,
            filters: false,
            hideInSearch: true, // 列表展示
        },
        {
            title: '故障描述',
            dataIndex: 'faultReasonDesc',
            width: 200,
            hideInSearch: true,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '处理结果',
            dataIndex: 'dealResult',
            width: 200,
            hideInSearch: true,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '操作类型',
            dataIndex: 'operateTypeName',
            width: 100,
            ellipsis: true,
            hideInSearch: true,
        },
    ];

    return columns;
};
