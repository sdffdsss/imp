import dayjs from 'dayjs';
import { _ } from 'oss-web-toolkits';

export const getColumns = ({ dic, renderOptions, professionalTypeInitial }) => {
    const columns = [
        {
            title: '封堵时间',
            dataIndex: 'pluggingTime2Search',
            align: 'center',
            width: 120,
            ellipsis: true,
            valueType: 'dateTimeRange',
            onFilter: false,
            filters: false, // 仅搜素栏查询使用
            hideInTable: true,
            fieldProps: {
                allowClear: false,
            },
            initialValue: [dayjs().subtract(2, 'month').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')],
            search: {
                transform: (value) => {
                    if (!_.isEmpty(value)) {
                        return {
                            pluggingTimeStart: value[0],
                            pluggingTimeEnd: value[1],
                        };
                    }
                    return {
                        pluggingTimeStart: '',
                        pluggingTimeEnd: '',
                    };
                },
            },
        },
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
        },
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
            hideInSearch: true, // 列表展示
            hideInTable: true,
        },
        {
            title: '省份',
            dataIndex: 'provinceName',
            width: 180,
            align: 'center',
            ellipsis: true,
            fieldProps: {
                disabled: true,
                value: dic.provinceDic[0].value,
                options: dic.provinceDic,
            },

            valueType: 'select',
        },
        {
            title: '专业',
            dataIndex: 'professionName',
            align: 'center',
            width: 200,
            // hideInTable: true, // 仅搜素栏查询使用
            fieldProps: {
                options: dic.professionDic || [],
                mode: 'multiple',
                placeholder: '全部',
                maxTagCount: 'responsive',
            },
            initialValue: professionalTypeInitial,
            valueType: 'select',
            search: {
                transform: (value) => {
                    if (!_.isEmpty(value) && !value.includes('-1')) {
                        return {
                            professionIds: _.toString(value),
                        };
                    }
                    return {
                        professionIds: '',
                    };
                },
            },
        },
        {
            title: '封堵时间',
            dataIndex: 'pluggingTime',
            align: 'center',
            width: 200,
            // sorter: true,
            ellipsis: true,
            onFilter: false,
            filters: false,
            hideInSearch: true, // 列表展示
        },
        {
            title: '所属网格',
            dataIndex: 'grid',
            align: 'center',
            width: 180,
            // sorter: true,
            onFilter: false,
            filters: false,
            ellipsis: true,
            hideInSearch: true, // 列表展示
        },

        {
            title: '被封堵IP',
            dataIndex: 'pluggingIp',
            align: 'center',
            width: 180,
            // sorter: true,
            onFilter: false,
            filters: false,
            ellipsis: true,
        },
        {
            title: '所属运营商',
            dataIndex: 'operator',
            align: 'center',
            width: 180,
            // sorter: true,
            onFilter: false,
            filters: false,
            ellipsis: true,
        },
        {
            title: '封堵IP来源',
            dataIndex: 'pluggingIpSource',
            align: 'center',
            width: 180,
            // sorter: true,
            onFilter: false,
            filters: false,
            ellipsis: true,
            hideInSearch: true,
        },

        {
            title: '封堵人',
            dataIndex: 'pluggingMan',
            align: 'center',
            width: 120,
            // sorter: true,
            ellipsis: true,
            hideInSearch: true,
            onFilter: false,
            filters: false,
        },
        {
            title: '是否解封',
            dataIndex: 'unsealFlag',
            align: 'center',
            width: 180,
            // sorter: true,
            onFilter: false,
            filters: false,
            ellipsis: true,
            fieldProps: {
                options: dic.unsealFlagDic,
                placeholder: '全部',
            },

            valueType: 'select',
        },
        {
            title: '流水号',
            dataIndex: 'serialNo',
            align: 'center',
            width: 120,
            // sorter: true,
            ellipsis: true,
            hideInSearch: true,
            onFilter: false,
            filters: false,
        },
        {
            title: '操作',
            valueType: 'option',
            width: 100,
            align: 'center',
            dataIndex: 'actions',
            fixed: 'right',
            render: renderOptions,
        },
    ];

    return columns;
};
