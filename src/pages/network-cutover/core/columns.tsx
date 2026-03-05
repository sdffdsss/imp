import React from 'react';
import AuthButton from '@Components/auth-button';
import type { ProColumns } from '@ant-design/pro-table';
import { DatePicker, Icon, Tooltip, Button, Input } from 'oss-ui';
// import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { MAJOR_ENUM, YES_NO_VALUE_ENUM, MODAL_TYPE, ALL_ENUMS } from '../type';
import { formatValueEnum } from '../util';
import { authData } from '../auth';

const { RangePicker } = DatePicker;

interface Props {
    openModalClick: (row, type: MODAL_TYPE) => void;
    deleteClick: (row) => void;
    provinceId: string;
    enums: ALL_ENUMS;
    provinceList: any;
}

const getColumns = (props: Props) => {
    const { openModalClick, deleteClick, provinceId, enums, provinceList } = props;

    return [
        {
            title: '流水号',
            dataIndex: 'serialNumber',
            ellipsis: true,
            search: false,
            align: 'center',
        },
        {
            title: '操作开始时间',
            dataIndex: 'cutoverStartTime',
            ellipsis: true,
            align: 'center',
            valueType: 'dateTimeRange',
            sorter: true,
            // search: {
            //     // transform: (value: any) => ({
            //     //     cutoverStartTimeBegin: moment(value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            //     //     cutoverStartTimeEnd: moment(value[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            //     // }),
            // },
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} />;
            },
            render: (_, row) => {
                return row.cutoverStartTime || '-';
            },
            order: 8,
        },
        {
            title: '操作结束时间',
            dataIndex: 'cutoverEndTime',
            ellipsis: true,
            align: 'center',
            valueType: 'dateTimeRange',
            sorter: true,
            // search: {
            //     // transform: (value: any) => ({
            //     //     cutoverEndTimeBegin: moment(value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            //     //     cutoverEndTimeEnd: moment(value[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            //     // }),
            // },
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} />;
            },
            render: (_, row) => {
                return row.cutoverEndTime || '-';
            },
            order: 7,
        },
        {
            title: '专业',
            dataIndex: 'professionType',
            hideInSearch: false,
            align: 'center',
            initialValue: String(MAJOR_ENUM.CORE),
            valueEnum: formatValueEnum(enums.professionalEnum, [MAJOR_ENUM.CORE]),
            fieldProps: {
                allowClear: false,
            },
            order: 5,
        },
        {
            title: '大区省份',
            dataIndex: 'provinceName',
            // initialValue: Number(provinceId),
            align: 'center',
            renderFormItem: (item, { fieldProps }: any, form) => {
                return (
                    // <SelectCondition
                    //     {...fieldProps}
                    //     form={form}
                    //     // mode="multiple"
                    //     title="省份"
                    //     id="key"
                    //     label="value"
                    //     dictName="province_id"
                    //     searchName="province_id"
                    // />
                    // <Select placeholder="请选择" options={provinceList} allowClear />
                    <Input placeholder="请输入大区省份" maxLength={100} />
                );
            },
            search: {
                transform: (value) => ({ provinceName: value }),
            },
            render: (_, row) => {
                return row.provinceName || '-';
            },
            order: 6,
        },
        {
            title: '省份地市',
            dataIndex: 'regionName',
            ellipsis: true,
            search: false,
            align: 'center',
        },
        {
            title: '网络类型',
            dataIndex: 'nmsType',
            ellipsis: true,
            search: true,
            align: 'center',
            valueEnum: formatValueEnum(enums.nmsTypeEnum),
            order: 4,
        },
        {
            title: '操作网元',
            dataIndex: 'operateNe',
            ellipsis: true,
            search: true,
            align: 'center',
            fieldProps: (form, config) => {
                return {
                    ...config,
                    maxLength: 100,
                };
            },
            order: 3,
        },
        {
            title: '是否完成',
            dataIndex: 'isCutoverFinish',
            ellipsis: true,
            search: true,
            align: 'center',
            fieldProps: () => {
                return {
                    maxLength: 100,
                };
            },
            valueEnum: YES_NO_VALUE_ENUM,
            order: 2,
        },
        {
            title: '值班人',
            dataIndex: 'dutyman',
            ellipsis: true,
            search: false,
            align: 'center',
        },
        {
            title: '记录人',
            dataIndex: 'recorder',
            ellipsis: true,
            search: false,
            align: 'center',
        },
        {
            title: '记录来源',
            dataIndex: 'recordSource',
            ellipsis: true,
            search: true,
            valueEnum: formatValueEnum(enums.recordSourceEnum),
            align: 'center',
            order: 1,
        },
        {
            title: '告警网管',
            dataIndex: 'alarmStation',
            ellipsis: true,
            search: false,
            align: 'center',
        },
        {
            title: '记录时间',
            dataIndex: 'recordTime',
            ellipsis: true,
            search: false,
            sorter: true,
            align: 'center',
        },
        {
            title: '操作内容',
            dataIndex: 'operateContent',
            ellipsis: true,
            width: 200,
            search: false,
            align: 'center',
        },
        {
            title: '割接详情',
            dataIndex: 'cutoverContent',
            ellipsis: true,
            width: 200,
            search: false,
            align: 'center',
        },
        {
            title: '主要网管告警清除时间',
            dataIndex: 'alarmClearTime',
            ellipsis: true,
            width: 130,
            search: false,
            align: 'center',
        },
        {
            title: '配合割接完成情况',
            dataIndex: 'coordinateSituation',
            ellipsis: true,
            width: 200,
            search: false,
            align: 'center',
        },
        {
            title: '备注',
            dataIndex: 'notes',
            ellipsis: true,
            width: 200,
            search: false,
            align: 'center',
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
            title: '是否展示在大屏',
            dataIndex: 'isShowOnBigScreen',
            ellipsis: true,
            order: 3,
            align: 'center',
            render: (_, row) => {
                return row.isShowOnBigScreen === 1 ? '是' : '否';
            },
            search: false,
        },
        {
            title: '割接总结',
            dataIndex: 'cutoverSummary',
            ellipsis: true,
            order: 3,
            align: 'center',
            search: false,
        },
        {
            title: '班组来源',
            dataIndex: 'groupSource',
            ellipsis: true,
            order: 3,
            align: 'center',
            search: false,
        },
        {
            title: '操作',
            dataIndex: 'actions',
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
