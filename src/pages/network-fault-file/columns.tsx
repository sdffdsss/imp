import React from 'react';

import { Checkbox, DatePicker, Select, Tooltip } from 'oss-ui';
import AllSelect from '@Components/all-select';
// import { ActionType } from './type';

const boolValueEnum = {
    0: {
        text: '全部',
    },
    1: {
        text: '是',
    },
    2: {
        text: '否',
    },
};

const CellContent = ({ text }) => {
    return (
        <Tooltip title={text || '-'}>
            <div
                style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                }}
            >
                {text || '-'}
            </div>
        </Tooltip>
    );
};

export const getColumns = (provinceList, cityList, enums) => [
    {
        title: '序号',
        dataIndex: 'serialNumber',
        width: 60,
        hideInSearch: true,
        align: 'center',
        render: (text, record, index) => index + 1,
    },
     {
        title: '工单编号',
        dataIndex: 'associatedSheetNo',
        width: 150,
        hideInSearch: true,
        align: 'center',
        render: (text, record) => <CellContent text={record.associatedSheetNo} />,
    },
    {
        title: '是否存在故障',
        dataIndex: 'haveMalfunction',
        width: 100,
        hideInSearch: false,
        align: 'center',
        order: 10,
        initialValue: '0',
        valueEnum: boolValueEnum,
        render: (text, record) => <CellContent text={record.haveMalfunctionCn} />,
    },
    {
        title: '数据状态',
        dataIndex: 'dataStateCn',
        width: 100,
        align: 'center',
        sorter: true,
    },
    {
        title: '云池类型',
        dataIndex: 'cloudPoolTypeCn',
        width: 100,
        align: 'center',
        sorter: true,
    },
    {
        title: '上报省份',
        dataIndex: 'reportProvince',
        width: 100,
        hideInSearch: false,
        align: 'center',
        render: (text, record) => <CellContent text={record.reportProvinceName} />,
        order: 12,
        renderFormItem: (item, { fieldProps }) => {
            return (
                <Select
                    {...fieldProps}
                    options={[
                        {
                            label: '全部',
                            value: 'all',
                        },
                    ].concat(
                        provinceList.map((province) => ({
                            label: province.zoneName,
                            value: province.zoneId,
                        })),
                    )}
                    optionFilterProp="label"
                    placeholder="默认全部"
                    allowClear
                    showSearch
                />
            );
        },
    },
    {
        title: '国家地区',
        dataIndex: 'area',
        width: 120,
        hideInSearch: false,
        align: 'center',
        render: (text) => <CellContent text={text} />,
        order: 15,
        formItemProps: () => {
            return {
                labelCol: {
                    span: 6,
                },
                wrapperCol: {
                    span: 18,
                },
            };
        },
    },
    {
        title: '省份',
        dataIndex: 'provinceId',
        width: 100,
        hideInSearch: false,
        align: 'center',
        render: (text, record) => <CellContent text={record.provinceName} />,
        order: 14,
        renderFormItem: (item, { fieldProps }, form) => {
            return (
                <Select
                    {...fieldProps}
                    options={[
                        {
                            label: '全部',
                            value: 'all',
                        },
                    ].concat(
                        provinceList.map((province) => ({
                            label: province.zoneName,
                            value: province.zoneId,
                        })),
                    )}
                    onClear={() => {
                        form.setFieldsValue({ regionId: [] });
                    }}
                    placeholder="默认全部"
                    optionFilterProp="label"
                    allowClear
                    showSearch
                    maxTagCount="responsive"
                />
            );
        },
    },
    {
        title: '地市',
        dataIndex: 'regionId',
        width: 100,
        hideInSearch: false,
        align: 'center',
        render: (text, record) => <CellContent text={record.regionName} />,
        order: 13,
        renderFormItem: (item, { fieldProps }) => {
            return (
                <AllSelect
                    {...fieldProps}
                    options={cityList.map((city) => ({
                        label: city.zoneName,
                        value: city.zoneId,
                    }))}
                    placeholder="默认全部"
                    allowClear
                    showSearch
                    maxTagCount="responsive"
                    optionFilterProp="label"
                />
            );
        },
    },
    {
        title: '故障发生日期',
        dataIndex: 'eventDate',
        width: 150,
        align: 'center',
        render: (text) => <CellContent text={text} />,
        hideInSearch: true,
    },
    {
        title: '故障发生网络层级',
        dataIndex: 'networkLayer',
        width: 200,
        align: 'center',
        render: (text, record) => <CellContent text={record.networkLayerCn} />,
        formItemProps: () => {
            return {
                label: '网络层级',
            };
        },
        order: 9,

        renderFormItem: (item, { formItemProps, fieldProps, ...rest }) => {
            return (
                <AllSelect
                    {...fieldProps}
                    options={enums.networkLayer?.map((itemIn) => ({
                        label: itemIn.value,
                        value: itemIn.key,
                    }))}
                    optionFilterProp="label"
                    placeholder="默认全部"
                    mode="multiple"
                    maxTagCount="responsive"
                    allowClear
                />
            );
        },
    },
    {
        title: '是否影响业务',
        dataIndex: 'isEffectBusiness',
        width: 100,
        hideInSearch: false,
        align: 'center',
        render: (text, record) => <CellContent text={record.isEffectBusinessCn} />,
        order: 6,
        valueEnum: boolValueEnum,

        initialValue: '0',
    },
    {
        title: '故障影响专业',
        dataIndex: 'effectProfession',
        width: 200,
        hideInSearch: true,
        align: 'center',
        render: (text, record) => <CellContent text={record.effectProfession} />,
    },
    {
        title: '根因故障专业',
        dataIndex: 'rootCauseProfession',
        width: 120,
        hideInSearch: false,
        align: 'center',
        render: (text, record) => <CellContent text={record.rootCauseProfessionCn} />,
        order: 16,
        colSize: 24,

        formItemProps: () => {
            return {
                style: {
                    marginLeft: 55,
                },
            };
        },
        renderFormItem: (item, { formItemProps, fieldProps, ...rest }) => {
            const options = enums.rootCauseProfession?.map((itemIn) => ({
                label: itemIn.value,
                value: itemIn.key,
            }));
            return <Checkbox.Group {...fieldProps} options={options} />;
        },
    },
    {
        title: '影响业务具体情况',
        dataIndex: 'effectBusinessDetail',
        width: 280,
        hideInSearch: true,
        align: 'center',
        render: (text, record) => <CellContent text={record.effectBusinessDetail} />,
    },
    {
        title: '是否产生重大舆情投诉',
        dataIndex: 'havePublicSentiment',
        width: 150,
        align: 'center',
        render: (text, record) => <CellContent text={record.havePublicSentimentCn} />,
        formItemProps: () => {
            return {
                label: '是否有重大舆情',
                labelCol: {
                    span: 6,
                },
                wrapperCol: {
                    span: 18,
                },
            };
        },
        valueEnum: boolValueEnum,
        initialValue: '0',

        order: 7,
    },
    {
        title: '故障发生时间',
        dataIndex: 'eventTime',
        width: 200,
        hideInSearch: false,
        align: 'center',
        render: (text, record) => <CellContent text={record.eventTime} />,
        order: 11,
        renderFormItem: () => {
            return (
                <DatePicker.RangePicker
                    style={{ width: '100%' }}
                    placeholder={['开始时间', '结束时间']}
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                />
            );
        },
        formItemProps: () => {
            return {
                labelCol: {
                    span: 6,
                },
                wrapperCol: {
                    span: 18,
                },
            };
        },
    },
    {
        title: '业务受影响开始时间',
        dataIndex: 'businessEffectedStartTime',
        width: 200,
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '故障是否恢复',
        dataIndex: 'hasRestored',
        width: 120,
        hideInSearch: false,
        align: 'center',
        render: (text, record) => <CellContent text={record.hasRestoredCn} />,
        order: 8,
        valueEnum: boolValueEnum,
        initialValue: '0',
    },
    {
        title: '业务恢复时间',
        dataIndex: 'businessRecoveryTime',
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '故障消除时间',
        dataIndex: 'clearTime',
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '业务受影响历时(分钟)',
        dataIndex: 'businessEffectedDurationMinutes',
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
        width: 150,
    },
    {
        title: '故障历时(分钟)',
        dataIndex: 'faultDurationMinutes',
        width: 150,
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '故障现象',
        dataIndex: 'faultPhenomenon',
        width: 320,
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '故障原因',
        dataIndex: 'faultReason',
        width: 320,
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '故障等级',
        dataIndex: 'faultLevel',
        align: 'center',
        width: 100,
        render: (text, record) => <CellContent text={record.faultLevelCn} />,
        fieldProps: () => {
            return { showSearch: true, mode: 'multiple' };
        },
        hideInSearch: false,
        order: 4,
        renderFormItem: (item, { formItemProps, fieldProps }) => {
            return (
                <AllSelect
                    {...fieldProps}
                    options={enums['faultLevel-net']?.map((itemIn) => ({
                        label: itemIn.value,
                        value: itemIn.key,
                    }))}
                    placeholder="默认全部"
                    mode="multiple"
                    maxTagCount="responsive"
                    optionFilterProp="label"
                    allowClear
                />
            );
        },
    },
    {
        title: '故障产生原因类型',
        dataIndex: 'faultCauseType',
        width: 200,
        hideInSearch: false,
        hideInTable: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
        order: 2,
        formItemProps: () => {
            return {
                label: '故障原因类型',
            };
        },

        // initialValue: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
        renderFormItem: (item, { fieldProps }) => {
            return (
                <AllSelect
                    {...fieldProps}
                    options={enums['faultCauseType2']?.map((itemIn) => ({
                        label: itemIn.value,
                        value: itemIn.key,
                    }))}
                    placeholder="默认全部"
                    mode="multiple"
                    maxTagCount="responsive"
                    optionFilterProp="label"
                    allowClear
                />
            );
        },
    },
    {
        title: '故障产生原因类型一',
        dataIndex: 'faultCauseType1Cn',
        width: 200,
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '故障产生原因类型二',
        dataIndex: 'faultCauseType2Cn',
        width: 200,
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '故障是否存在隐患导致',
        dataIndex: 'causedByHidden',
        width: 150,
        hideInSearch: false,
        align: 'center',
        render: (text, record) => <CellContent text={record.causedByHiddenCn} />,
        order: 3,
        formItemProps: () => {
            return {
                label: '是否隐患导致',
                labelCol: {
                    span: 6,
                },
                wrapperCol: {
                    span: 18,
                },
            };
        },
        valueEnum: boolValueEnum,
        initialValue: '0',
    },
    {
        title: '创建人',
        dataIndex: 'creatorName',
        width: 100,
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '上报时间',
        dataIndex: 'createTime',
        width: 200,
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '修改人',
        dataIndex: 'modifierName',
        width: 100,
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '修改时间',
        dataIndex: 'modifyTime',
        width: 200,
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '数据源',
        dataIndex: 'dataSourceCn',
        width: 80,
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
    {
        title: '同步唯一标识',
        dataIndex: 'sheetNo',
        width: 120,
        hideInSearch: true,
        align: 'center',
    },
    {
        title: '备注',
        dataIndex: 'note',
        width: 200,
        hideInSearch: true,
        align: 'center',
        render: (text) => <CellContent text={text} />,
    },
];
