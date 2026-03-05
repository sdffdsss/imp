import React from 'react';
import { _ } from 'oss-web-toolkits';
import { Select, Tooltip, Icon, Popconfirm } from 'oss-ui';

export const getColumns = ({ handleEditModal, handleDeleteModal }) => {
    return [
        {
            title: '时间',
            dataIndex: 'pluggingTime2Search',
            align: 'center',
            width: 120,

            valueType: 'dateTimeRange',
            onFilter: false,
            filters: false, // 仅搜素栏查询使用
            hideInTable: true,
            fieldProps: {
                allowClear: false,
            },
            search: {
                transform: (value) => {
                    if (!_.isEmpty(value)) {
                        return {
                            beginTime: value[0],
                            endTime: value[1],
                        };
                    }
                    return {
                        beginTime: '',
                        endTime: '',
                    };
                },
            },
        },
        {
            title: '省份',
            dataIndex: 'provinceName',
            key: 'provinceName',
            align: 'center',
            width: 80,
            hideInSearch: true,
        },

        {
            title: '专业',
            dataIndex: 'professionalName',
            key: 'professionalName',
            align: 'center',
            hideInSearch: true,

            width: 40,
        },
        {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            hideInSearch: true,
            align: 'center',
            width: 80,
            render: (text) => {
                return (
                    <Tooltip title={text}>
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '完成情况',
            dataIndex: 'completion',
            key: 'completion',
            align: 'center',
            width: 50,
            initialValue: 'all',
            renderFormItem: (item) => {
                const options = [
                    { value: 'all', label: '全部' },
                    { value: '是', label: '是' },
                    { value: '否', label: '否' },
                ];
                return <Select {...item} options={options} />;
            },

            render: (text) => {
                return (
                    <Tooltip title={text}>
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '记录内容',
            dataIndex: 'recordContent',
            key: 'recordContent',

            width: 380,
            align: 'center',

            render: (text) => {
                return (
                    <Tooltip title={text}>
                        <div>{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '值班人员',
            dataIndex: 'watchMan',
            key: 'watchMan',

            align: 'center',
            width: 60,

            render: (text) => {
                return (
                    <Tooltip title={text}>
                        <div className="table-ellipsis">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: '操作',
            key: 'rowKey',
            align: 'center',
            width: 50,
            hideInSearch: true,
            render: (__, record) => {
                return (
                    <div className="table-action-list">
                        <div className="table-action" onClick={() => handleEditModal(record)}>
                            <Icon antdIcon type="EditOutlined" />
                        </div>
                        <Popconfirm title="确认删除吗？" placement="topLeft" onConfirm={() => handleDeleteModal(record)} style={{}}>
                            <div className="table-action">
                                <Icon antdIcon type="DeleteOutlined" />
                            </div>
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];
};
