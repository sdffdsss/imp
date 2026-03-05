import React from 'react';
import moment from 'moment';
import { DatePicker, Tooltip } from 'oss-ui';
import type { ProColumns } from '@ant-design/pro-table';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import { ALL_ENUMS, MAJOR_ENUM } from '../type';
import { formatValueEnum } from '../util';

const { RangePicker } = DatePicker;

interface Props {
    enums: ALL_ENUMS;
    provinceId: string;
    deleteClick: (row) => void;
}

const getColumns = (props: Props) => {
    const { enums, provinceId } = props;
    const sliceLength = 23;
    return [
        {
            title: '割接计划名称',
            dataIndex: 'planName',
            align: 'center',
            width: 120,
            hideInSearch: true,
        },
        {
            title: '省份',
            dataIndex: 'provinceId',
            initialValue: Number(provinceId),
            align: 'center',
            order: 2,
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
            width: 80,
        },
        {
            title: '专业',
            dataIndex: 'professionType',
            hideInSearch: false,
            align: 'center',
            order: 1,
            width: 80,
            initialValue: String(MAJOR_ENUM.TRANSMISSION),
            valueEnum: formatValueEnum(enums.professionalEnum, [MAJOR_ENUM.TRANSMISSION]),
            fieldProps: {
                allowClear: false,
            },
        },
        {
            title: '光缆名称',
            dataIndex: 'opticalCable',
            hideInTable: false,
            hideInSearch: true,
            align: 'left',
            ellipsis: true,
            width: 120,
        },
        {
            title: '割接段落',
            dataIndex: 'cutoverSegment',
            search: false,
            align: 'left',
            render: (_, row) => {
                let str = row.cutoverSegment || '-';
                if (str?.length > sliceLength) {
                    str = `${str.substring(0, sliceLength)}...`;
                }
                return (
                    <Tooltip title={row.cutoverSegment}>
                        <div className="table-ellipsis">{str}</div>
                    </Tooltip>
                );
            },
            width: 120,
        },
        {
            title: '计划开始时间',
            dataIndex: 'planStartTime',
            ellipsis: true,
            align: 'center',
            width: 100,
            hideInSearch: true,
        },
        {
            title: '计划结束时间',
            dataIndex: 'planEndTime',
            ellipsis: true,
            align: 'center',
            width: 100,
            hideInSearch: true,
        },
        {
            title: '割接开始时间',
            dataIndex: 'cutoverStartTime',
            ellipsis: true,
            align: 'center',
            order: 4,
            sort: 1,
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
            width: 100,
        },
        {
            title: '割接结束时间',
            dataIndex: 'cutoverEndTime',
            ellipsis: true,
            align: 'center',
            order: 3,
            sort: 2,
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
            width: 100,
        },
        {
            title: '割接对网络（系统）影响',
            dataIndex: 'affectedSystems',
            search: false,
            align: 'left',
            render: (_, row) => {
                let str = row.affectedSystems || '-';
                if (str?.length > sliceLength) {
                    str = `${str.substring(0, sliceLength)}...`;
                }
                return (
                    <Tooltip title={row.affectedSystems}>
                        <div className="table-ellipsis">{str}</div>
                    </Tooltip>
                );
            },
            width: 150,
        },
        {
            title: '割接对业务影响',
            dataIndex: 'impactOnBusiness',
            search: false,
            align: 'left',
            render: (_, row) => {
                let str = row.impactOnBusiness || '-';
                if (str?.length > sliceLength) {
                    str = `${str.substring(0, sliceLength)}...`;
                }
                return (
                    <Tooltip title={row.impactOnBusiness} overlayStyle={{ maxWidth: 550 }}>
                        <div className="table-ellipsis">{str}</div>
                    </Tooltip>
                );
            },
            width: 150,
        },
    ] as ProColumns<any>[];
};

export default getColumns;
