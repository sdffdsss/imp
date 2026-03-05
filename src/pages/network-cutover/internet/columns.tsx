import React from 'react';
import moment from 'moment';
import AuthButton from '@Components/auth-button';
import type { ProColumns } from '@ant-design/pro-table';
import { Icon, Tooltip, Button, DatePicker } from 'oss-ui';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { TRUEORFALSE_INTERRUPT_BUSINESS, ALL_ENUMS, MODAL_TYPE, MAJOR_ENUM } from '../type';
import { formatValueEnum } from '../util';
import { authData } from '../auth';

const { RangePicker } = DatePicker;

interface Props {
    enums: ALL_ENUMS;
    provinceId: string;
    deleteClick: (row) => void;
    openModalClick: (row, type: MODAL_TYPE) => void;
}

const getColumns = (props: Props) => {
    const { provinceId, enums, openModalClick, deleteClick } = props;
    return [
        {
            title: '流水号',
            dataIndex: 'serialNumber',
            ellipsis: true,
            search: false,
            align: 'center',
            sorter: true,
        },
        {
            title: '省份',
            dataIndex: 'provinceId',
            initialValue: Number(provinceId),
            hideInSearch: false,
            align: 'center',
            order: 9,
            renderFormItem: (item, { fieldProps }: any, form) => {
                return (
                    <SelectCondition
                        {...fieldProps}
                        form={form}
                        // mode="multiple"
                        title="省份"
                        id="key"
                        label="value"
                        dictName="province_id"
                        searchName="province_id"
                    />
                );
            },
            search: {
                transform: (value) => ({ provinceId: value }),
            },
            render: (_, row) => {
                return row.provinceName;
            },
        },
        {
            title: '专业',
            dataIndex: 'professionType',
            hideInSearch: false,
            align: 'center',
            order: 8,
            initialValue: String(MAJOR_ENUM.INTERNET),
            valueEnum: formatValueEnum(enums.professionalEnum, [MAJOR_ENUM.INTERNET]),
            fieldProps: {
                allowClear: false,
            },
        },
        {
            title: '所属网络',
            dataIndex: 'affiliatedNetwork',
            ellipsis: true,
            order: 7,
            align: 'center',
            valueEnum: formatValueEnum(enums.affiliatedNetworkEnum),
        },
        {
            title: '割接地点',
            dataIndex: 'cutoverLocation',
            ellipsis: true,
            order: 6,
            align: 'center',
            fieldProps: (form, config) => {
                return {
                    ...config,
                    maxLength: 200,
                };
            },
        },
        {
            title: '操作单位',
            dataIndex: 'departmentName',
            ellipsis: true,
            order: 2,
            align: 'center',
            fieldProps: (form, config) => {
                return {
                    ...config,
                    maxLength: 200,
                };
            },
        },
        {
            title: '割接开始时间',
            dataIndex: 'cutoverStartTime',
            ellipsis: true,
            order: 5,
            align: 'center',
            valueType: 'dateTimeRange',
            sorter: true,
            search: {
                transform: (value: any) => ({
                    cutoverStartTimeBegin: moment(value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    cutoverStartTimeEnd: moment(value[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                }),
            },
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} />;
            },

            render: (_, row) => {
                return row.cutoverStartTime || '-';
            },
        },
        {
            title: '割接结束时间',
            dataIndex: 'cutoverEndTime',
            ellipsis: true,
            order: 4,
            align: 'center',
            valueType: 'dateTimeRange',
            sorter: true,
            search: {
                transform: (value: any) => ({
                    cutoverEndTimeBegin: moment(value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    cutoverEndTimeEnd: moment(value[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                }),
            },
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} />;
            },
            render: (_, row) => {
                return row.cutoverEndTime || '-';
            },
        },
        {
            title: '是否中断业务',
            dataIndex: 'isInterruptBusiness',
            ellipsis: true,
            order: 3,
            align: 'center',
            valueEnum: TRUEORFALSE_INTERRUPT_BUSINESS,
        },
        {
            title: '完成情况',
            dataIndex: 'completionStatus',
            ellipsis: true,
            order: 1,
            align: 'center',
            sorter: true,
            valueEnum: formatValueEnum(enums.completionStatusEnum),
        },
        {
            title: '割接总结',
            dataIndex: 'cutoverSummary',
            ellipsis: true,
            align: 'center',
            search: false,
        },
        {
            title: '是否展示在大屏',
            dataIndex: 'isShowOnBigScreen',
            ellipsis: true,
            align: 'center',
            render: (_, row) => {
                return row.isShowOnBigScreen === 1 ? '是' : '否';
            },
            search: false,
        },
        {
            title: '班组来源',
            dataIndex: 'groupSource',
            ellipsis: true,
            align: 'center',
            search: false,
        },
        {
            title: '操作',
            dataIndex: 'actions',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 120,
            fixed: 'right',
            render: (text, row) => [
                <Tooltip title="编辑" key="edit">
                    <AuthButton authKey={authData.edit} onClick={() => openModalClick(row, MODAL_TYPE.EDIT)} type="text" logFalse>
                        <Icon antdIcon type="EditOutlined" />
                    </AuthButton>
                    {/* <Button onClick={() => openModalClick(row, MODAL_TYPE.EDIT)} type="text">
                        <Icon antdIcon type="EditOutlined" />
                    </Button> */}
                </Tooltip>,
                <Tooltip title="删除" key="delete">
                    <AuthButton authKey={authData.delete} onClick={() => deleteClick(row)} type="text" logFalse>
                        <Icon antdIcon type="DeleteOutlined" />
                    </AuthButton>
                    {/* <Button onClick={() => deleteClick(row)} type="text">
                        <Icon antdIcon type="DeleteOutlined" />
                    </Button> */}
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
