export const filterColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: 80,

        hideInSearch: true,
        valueType: 'index',
    },
    {
        title: '是否私有',
        dataIndex: 'isPrivate',

        width: 120,
        hideInSearch: true,
        valueEnum: {
            true: {
                text: '是',
                value: true,
            },
            false: {
                text: '否',
                value: false,
            },
        },
    },
    {
        title: '过滤器id',
        dataIndex: 'id',
    },
    {
        title: '名称',
        dataIndex: 'name',
        width: 180,
        ellipsis: true,
    },
    {
        title: '启动状态',
        dataIndex: 'isValid',

        width: 120,
        valueEnum: {
            '-1': { text: '全部' },
            true: { text: '是' },
            false: { text: '否' },
        },
        formItemProps: {
            initialValue: '-1',
        },
    },
    {
        title: '创建人',
        dataIndex: 'owner',
        width: 130,
        hideInSearch: true,
        render: (text, row) => (text ? text.userName : '-'),
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 180,
        // valueType: 'dateTimeRange',
        hideInSearch: true,
        // formItemProps: {
        //     format: 'YYYY-MM-DD HH:mm:ss',
        //     showTime: true,
        // },
        render: (text) => text || '-',
    },
    {
        title: '最近修改时间',
        dataIndex: 'updateTime',
        width: 180,
        valueType: 'dateTimeRange',
        formItemProps: {
            format: 'YYYY-MM-DD HH:mm:ss',
            showTime: true,
        },
        hideInSearch: true,
    },
    {
        title: '最近修改人',
        dataIndex: 'updateUser',
        width: 120,
        hideInSearch: true,
        render: (text, row) => (text ? text.userName : '-'),
    },
    {
        title: '描述',
        dataIndex: 'description',
        width: 200,
        ellipsis: true,
        hideInSearch: true,
    },
];
export const commonRuleColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: 80,

        hideInSearch: true,
        valueType: 'index',
    },
    {
        title: '是否私有',
        dataIndex: 'isPrivate',

        width: 120,
        hideInSearch: true,
        valueEnum: {
            true: {
                text: '是',
                value: true,
            },
            false: {
                text: '否',
                value: false,
            },
        },
    },
    {
        title: '规则id',
        dataIndex: 'id',

        width: 200,
    },
    {
        title: '名称',
        dataIndex: 'name',
        width: 180,
        ellipsis: true,
    },
    {
        title: '启动状态',
        dataIndex: 'isValid',

        width: 120,
        valueEnum: {
            '-1': { text: '全部' },
            true: { text: '是' },
            false: { text: '否' },
        },
        formItemProps: {
            initialValue: '-1',
        },
    },
    {
        title: '创建人',
        dataIndex: 'owner',
        width: 130,
        hideInSearch: true,
        render: (text, row) => (text ? text.userName : '-'),
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 180,
        // valueType: 'dateTimeRange',
        hideInSearch: true,
        // formItemProps: {
        //     format: 'YYYY-MM-DD HH:mm:ss',
        //     showTime: true,
        // },
        render: (text) => text || '-',
    },
    {
        title: '最近修改时间',
        dataIndex: 'updateTime',
        width: 180,
        valueType: 'dateTimeRange',
        formItemProps: {
            format: 'YYYY-MM-DD HH:mm:ss',
            showTime: true,
        },
        hideInSearch: true,
    },
    {
        title: '最近修改人',
        dataIndex: 'updateUser',
        width: 120,
        hideInSearch: true,
        render: (text, row) => (text ? text.userName : '-'),
    },
    {
        title: '描述',
        dataIndex: 'description',
        width: 200,
        ellipsis: true,
        hideInSearch: true,
    },
];
export const preTreatColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: 80,

        hideInSearch: true,
        valueType: 'index',
    },
    {
        title: '规则id',
        dataIndex: 'id',

        width: 200,
    },
    {
        title: '名称',
        dataIndex: 'name',
        width: 180,
        ellipsis: true,
    },
    {
        title: '启动状态',
        dataIndex: 'isValid',

        width: 120,
        valueEnum: {
            '-1': { text: '全部' },
            true: { text: '是' },
            false: { text: '否' },
        },
        formItemProps: {
            initialValue: '-1',
        },
    },
    {
        title: '创建人',
        dataIndex: 'owner',
        width: 130,
        hideInSearch: true,
        render: (text, row) => (text ? text.userName : '-'),
    },
    {
        title: '延迟时间',
        dataIndex: 'commonOptions',
        width: 150,
        hideInSearch: true,
        render: (text, row) => {
            if (Array.isArray(text) && text.length > 0) {
                const delayTime = text.find((item) => item.name === 'delayTime');

                return delayTime ? delayTime.value : '-';
            } 
                return '-';
            
        },
    },
    {
        title: '预处理时间段',
        dataIndex: 'commonOptions',
        width: 150,
        hideInSearch: true,
        render: (text, row) => {
            if (Array.isArray(text) && text.length > 0) {
                const timePeriod = text.find((item) => item.name === 'timeperiod');

                return timePeriod ? timePeriod.value : '-';
            } 
                return '-';
            
        },
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 180,
        valueType: 'dateTimeRange',
        hideInSearch: true,
        formItemProps: {
            format: 'YYYY-MM-DD HH:mm:ss',
            showTime: true,
        },
        render: (text) => text || '-',
    },
    {
        title: '最近修改时间',
        dataIndex: 'updateTime',
        width: 180,
        hideInSearch: true,
        valueType: 'dateTimeRange',
        formItemProps: {
            format: 'YYYY-MM-DD HH:mm:ss',
            showTime: true,
        },
    },
    {
        title: '最近修改人',
        dataIndex: 'updateUser',
        width: 120,
        hideInSearch: true,
        render: (text, row) => (text ? text.userName : '-'),
    },
    {
        title: '描述',
        dataIndex: 'description',
        width: 200,
        hideInSearch: true,
        ellipsis: true,
    },
];

export const anotherFilterCondition = [
    {
        title: '大区',
        dataIndex: 'region_id',
        hideInTable: true,
        hideInSearch: false,
        formItemProps: {
            allowClear: true,
        },
        // valueType: 'select',
    },
    {
        title: '省份',
        dataIndex: 'province',
        hideInTable: true,
        hideInSearch: false,
        formItemProps: {
            allowClear: true,
        },
        // valueType: 'select',
    },
    {
        title: '一级专业',
        hideInTable: true,
        dataIndex: 'network_type_top',
        hideInSearch: false,
        formItemProps: {
            allowClear: true,
        },
        // valueType: 'select',
    },
    {
        title: '网管告警级别',
        hideInTable: true,
        dataIndex: 'org_severity',
        hideInSearch: false,
        formItemProps: {
            allowClear: true,
        },
        // valueType: 'select',
    },
    {
        title: '设备类型',
        dataIndex: 'eqp_object_class',
        hideInTable: true,
        hideInSearch: false,
        formItemProps: {
            allowClear: true,
        },
        // valueType: 'select',
    },
    {
        title: '设备厂家',
        dataIndex: 'vendor_id',
        hideInTable: true,
        hideInSearch: false,
        formItemProps: {
            allowClear: true,
        },
        // valueType: 'select',
    },
    // {
    //     title: '网元版本',
    //     dataIndex: 'province',
    //     hideInTable: true,
    //     hideInSearch: false,
    // },
    {
        title: '网元名称',
        dataIndex: 'eqp_label',
        hideInTable: true,
        hideInSearch: false,
    },
    {
        title: '告警标题',
        dataIndex: 'title_text',
        hideInTable: true,
        hideInSearch: false,
    },
    {
        title: '网管告警ID',
        dataIndex: 'standard_alarm_id',
        hideInTable: true,
        hideInSearch: false,
    },
];
