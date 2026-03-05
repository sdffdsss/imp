import React from 'react';
import moment from 'moment';
import AuthButton from '@Components/auth-button';
import type { ProColumns } from '@ant-design/pro-table';
import { Icon, Tooltip, Button, DatePicker } from 'oss-ui';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { MODAL_TYPE, ALL_ENUMS, YES_NO_VALUE_ENUM, MAJOR_ENUM } from '../type';
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
    const { openModalClick, deleteClick, provinceId, enums } = props;
    return [
        {
            title: '流水号',
            dataIndex: 'serialNumber',
            ellipsis: true,
            search: false,
            align: 'center',
        },
        {
            title: '省份',
            dataIndex: 'provinceId',
            initialValue: Number(provinceId),
            hideInSearch: false,
            order: 9,
            align: 'center',
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
            order: 8,
            align: 'center',
            initialValue: String(MAJOR_ENUM.ATM),
            valueEnum: formatValueEnum(enums.professionalEnum, [MAJOR_ENUM.ATM]),
            fieldProps: {
                allowClear: false,
            },
        },
        {
            title: '是否中断业务',
            dataIndex: 'isInterruptBusiness',
            ellipsis: true,
            search: true,
            align: 'center',
            order: 3,
            valueEnum: YES_NO_VALUE_ENUM,
        },
        {
            title: '完成情况',
            dataIndex: 'completionStatus',
            ellipsis: true,
            search: true,
            align: 'center',
            order: 1,
            valueEnum: formatValueEnum(enums.completionStatusEnum),
        },
        {
            title: '割接开始时间',
            dataIndex: 'cutoverStartTime',
            ellipsis: true,
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
                return row.cutoverStartTime;
            },
            order: 5,
        },
        {
            title: '割接结束时间',
            dataIndex: 'cutoverEndTime',
            ellipsis: true,
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
                return row.cutoverEndTime;
            },
            order: 4,
        },
        {
            title: '操作单位',
            dataIndex: 'departmentName',
            ellipsis: true,
            search: true,
            align: 'center',
            order: 2,
            fieldProps: (form, config) => {
                return {
                    ...config,
                    maxLength: 200,
                };
            },
        },
        {
            title: '所属网络',
            dataIndex: 'affiliatedNetwork',
            ellipsis: true,
            search: true,
            align: 'center',
            order: 7,
            valueEnum: formatValueEnum(enums.affiliatedNetworkEnum),
        },
        {
            title: '割接信息',
            dataIndex: 'cutoverInfo',
            ellipsis: true,
            search: false,
            align: 'center',
        },
        {
            title: '操作人',
            dataIndex: 'operator',
            ellipsis: true,
            search: false,
            align: 'center',
        },
        {
            title: '操作人联系电话',
            dataIndex: 'operatorPhoneNumber',
            ellipsis: true,
            search: false,
            align: 'center',
        },
        {
            title: '割接地点',
            dataIndex: 'cutoverLocation',
            ellipsis: true,
            search: true,
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
            title: '受影响的系统',
            dataIndex: 'affectedSystems',
            ellipsis: true,
            search: false,
            align: 'center',
        },
        {
            title: '割接影响的业务',
            dataIndex: 'impactOnBusiness',
            ellipsis: true,
            search: false,
            align: 'center',
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
