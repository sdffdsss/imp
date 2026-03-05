import dayjs from 'dayjs';
import { _ } from 'oss-web-toolkits';

export const getColumns = (professionDic) => {
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
            title: '专业',
            dataIndex: 'professionalTypeList',
            align: 'center',
            width: 200,
            hideInTable: true, // 仅搜素栏查询使用
            fieldProps: {
                options: professionDic || [],
                mode: 'multiple',
                placeholder: '全部',
            },

            valueType: 'select',
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
            width: 200,
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
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: '处理结果',
            dataIndex: 'dealResult',
            width: 200,
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: '操作类型',
            dataIndex: 'operateTypeName',
            width: 100,
            ellipsis: true,
            hideInSearch: true,
        },

        {
            title: '操作时间',
            dataIndex: 'operateTime2Search',
            align: 'center',
            width: 120,
            ellipsis: true,
            valueType: 'dateTimeRange',
            onFilter: false,
            filters: false, // 仅搜素栏查询使用
            hideInTable: true,
            initialValue: [dayjs().subtract(2, 'month').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')],
            search: {
                transform: (value) => {
                    if (!_.isEmpty(value)) {
                        return {
                            operateStartTime: value[0],
                            operateEndTime: value[1],
                        };
                    }
                    return {
                        operateStartTime: '',
                        operateEndTime: '',
                    };
                },
            },
        },
    ];

    return columns;
};
