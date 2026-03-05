import React from 'react';
import moment from 'moment';
import AuthButton from '@Components/auth-button';
import type { ProColumns } from '@ant-design/pro-table';
import { Icon, Tooltip, Button, DatePicker } from 'oss-ui';
import { MODAL_TYPE } from '../type';
import { authData } from '../auth';

const { RangePicker } = DatePicker;

interface Props {
    provinceId: string;
    deleteClick: (row) => void;
    openModalClick: (row, type: MODAL_TYPE) => void;
    sheetNo: string;
}

const getColumns = (props: Props) => {
    const { openModalClick, deleteClick, sheetNo } = props;
    return [
        {
            title: '序号',
            dataIndex: 'index',
            search: false,
            width: 80,
            align: 'center',
            hideInSearch: true,
        },
        {
            title: '割接单号',
            dataIndex: 'sheetNo',
            align: 'center',
            width: 300,
            order: 2,
            fieldProps: {
                allowClear: true,
            },
            initialValue: sheetNo,
            // render: (_, row) => {
            //     return (
            //         <Button type="link" onClick={() => {}}>
            //             {row.sheetNo}
            //         </Button>
            //     );
            // },
        },
        {
            title: '大区',
            dataIndex: 'cutoverLocation',
            align: 'center',
            width: 150,
            order: 1,
            fieldProps: {
                allowClear: true,
            },
        },
        {
            title: '割接时间',
            dataIndex: 'cutoverEndTime',
            align: 'center',
            width: 150,
            valueType: 'dateTimeRange',
            search: {
                transform: (value: any) => ({
                    cutoverEndTimeBegin: moment(value[0]).format('YYYY-MM-DD HH:mm:ss'),
                    cutoverEndTimeEnd: moment(value[1]).format('YYYY-MM-DD HH:mm:ss'),
                }),
            },
            renderFormItem: () => {
                return <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['起始时间', '结束时间']} />;
            },
            render: (_, row) => {
                return row.cutoverEndTime;
            },
            order: 5,
        },
        {
            title: '割接状态',
            dataIndex: 'isCutoverFinish',
            align: 'center',
            width: 120,
            valueType: 'select',
            order: 4,
            initialValue: -1,
            fieldProps: {
                allowClear: true,
                showSearch: true,
                options: [
                    {
                        label: '全部',
                        value: -1,
                    },
                    {
                        label: '已完成',
                        value: 1,
                    },
                    {
                        label: '未完成',
                        value: 0,
                    },
                ],
            },
            render: (_, row) => {
                return row.isCutoverFinish === 1 ? '已完成' : '未完成';
            },
        },
        {
            title: '割接总结',
            dataIndex: 'cutoverSummary',
            width: 300,
            align: 'center',
            hideInSearch: true,
            render(text) {
                return text ? <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div> : '-';
            },
        },
        {
            title: '是否展示在大屏',
            dataIndex: 'isShowOnBigScreen',
            align: 'center',
            width: 150,
            valueType: 'select',
            order: 3,
            formItemProps: {
                labelCol: {
                    span: 8,
                },
                wrapperCol: {
                    span: 16,
                },
            },
            initialValue: -1,
            fieldProps: {
                allowClear: true,
                options: [
                    {
                        label: '全部',
                        value: -1,
                    },
                    {
                        label: '是',
                        value: 1,
                    },
                    {
                        label: '否',
                        value: 0,
                    },
                ],
            },
            render: (_, row) => {
                return row.isShowOnBigScreen === 1 ? '是' : '否';
            },
        },
        {
            title: '最近修改人',
            dataIndex: 'modifyUser',
            align: 'center',
            width: 130,
            hideInSearch: true,
        },
        {
            title: '最近修改时间',
            dataIndex: 'modifyTime',
            align: 'center',
            width: 150,
            hideInSearch: true,
        },
        {
            title: '操作',
            dataIndex: 'actions',
            align: 'center',
            width: 180,
            fixed: 'right',
            hideInSearch: true,
            render: (text, row) => [
                <Tooltip title="编辑" key="edit">
                    <AuthButton authKey={authData.edit} onClick={() => openModalClick(row, MODAL_TYPE.EDIT)} type="text" logFalse>
                        <Icon antdIcon type="EditOutlined" />
                    </AuthButton>
                </Tooltip>,
                <Tooltip title="删除" key="delete">
                    <AuthButton authKey={authData.delete} onClick={() => deleteClick(row)} type="text" logFalse>
                        <Icon antdIcon type="DeleteOutlined" />
                    </AuthButton>
                </Tooltip>,
                <Tooltip title="查看" key="show">
                    <Button onClick={() => openModalClick(row, MODAL_TYPE.SEARCH)} type="text">
                        <Icon antdIcon type="SearchOutlined" />
                    </Button>
                </Tooltip>,
            ],
        },
    ] as ProColumns<any>[];
};

export default getColumns;
