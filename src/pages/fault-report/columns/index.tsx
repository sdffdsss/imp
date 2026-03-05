import React from 'react';
import {
    TableListItem,
    ReportType,
    FAILURE_REPORTING_LEVEL,
    FAILURE_REPORTING_LEVEL_TEXT,
    ReportTypeText,
    FAILURE_SOURCE_TYPE,
    FaultSourceText,
    FAILURE_USEAGE,
    FaultUseageText,
} from '../type';
import { ProColumns } from '@ant-design/pro-table';
import { Select, DatePicker } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import SelectCondition from './CompSelectCondition';
import moment from 'moment';

type ColumnsType = (props) => ProColumns<TableListItem>[];
const { RangePicker } = DatePicker;

export const columns: ColumnsType = (props) => {
    const { regionList, majorList, equipmentTypeList, faultReportStatusList, derived } = props;
    const { provinceId, userInfo } = useLoginInfoModel();
    const parseUserInfo = userInfo && JSON.parse(userInfo);
    const isWireless = window.location.href.indexOf('isWireless') !== -1;
    // 集团用户
    const isGroup = provinceId === '0';
    const sourceEnum = {
        [FAILURE_SOURCE_TYPE.MANUAL]: {
            text: FaultSourceText[FAILURE_SOURCE_TYPE.MANUAL],
        },
        [FAILURE_SOURCE_TYPE.AUTO]: {
            text: FaultSourceText[FAILURE_SOURCE_TYPE.AUTO],
        },
        [FAILURE_SOURCE_TYPE.AUTO_REGION]: {
            text: FaultSourceText[FAILURE_SOURCE_TYPE.AUTO_REGION],
        },
    };
    if (isWireless) {
        sourceEnum[2] = {
            text: '省内填报',
        };
        sourceEnum[3] = {
            text: '自动识别（区县级）',
        };
    }

    /**
     * @params source 原数据
     * @params valueName 字段值
     * @params textName 字段名
     */
    const sourceToEnum = (source = [], valueName?, textName?) => {
        const arr = {};
        if (valueName && textName) {
            source.map((item: any) => {
                arr[item[valueName]] = { text: item[textName] };
            });
        } else {
            source.map((item: any) => {
                arr[item.value] = { text: item.value };
            });
        }
        return arr;
    };

    return [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            width: 72,
            align: 'center',
        },

        {
            title: '归属省份',
            dataIndex: 'provinceName',
            hideInSearch: false,
            align: 'center',
            order: 9,
            width: 100,
            initialValue: isGroup ? undefined : Number(provinceId),
            fieldProps: {
                mode: isGroup ? 'multiple' : undefined,
                // disabled: !isGroup,
                placeholder: '请选择',
            },
            renderFormItem: (item, { fieldProps }: any, form) => {
                if (isGroup) {
                    return (
                        <Select
                            optionFilterProp={'label'}
                            options={(parseUserInfo?.mgmtZones || []).map((item) => ({ label: item.zoneName, value: Number(item.zoneId) }))}
                        />
                    );
                } else {
                    return (
                        <SelectCondition
                            {...fieldProps}
                            form={form}
                            title="省份"
                            id="key"
                            label="value"
                            dictName="province_id"
                            searchName="province_id"
                        />
                    );
                }
            },
            search: {
                transform: (value) => {
                    if (isGroup) {
                        return { province: value?.map((item) => String(item)) };
                    } else {
                        return { province: [String(value)] };
                    }
                },
            },
        },

        {
            title: '归属地市',
            dataIndex: 'cityName',
            align: 'center',
            fieldProps: {
                mode: 'multiple',
                disabled: false,
            },
            width: 120,
            order: 8,
            search: {
                transform: (value) => ({ citys: value }),
            },
            renderFormItem: (item, { fieldProps }: any, form) => {
                return (
                    <Select form={form} {...fieldProps} allowClear placeholder="请选择地市">
                        {regionList.map((region) => {
                            return (
                                <Select.Option key={region.regionId} value={region.regionId}>
                                    {region.regionName}
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
            },
        },
        {
            title: '上报专业',
            align: 'center',
            width: 120,
            dataIndex: 'specialty',
            order: 5,
            fieldProps: {
                mode: 'multiple',
                disabled: isWireless,
            },
            hideInSearch: derived,
            search: {
                transform: (value) => ({ specialtys: value }),
            },
            initialValue: isWireless ? ['11'] : [],
            valueEnum: isWireless ? { 11: { text: '无线网' } } : sourceToEnum(majorList, 'dCode', 'dName'),
        },
        {
            title: '故障类别',
            dataIndex: 'failureClassName',
            align: 'center',
            width: 120,
            order: 4,
            hideInSearch: true,
            fieldProps: {
                mode: 'multiple',
            },
            search: {
                transform: (value) => ({ failureClasses: value }),
            },
            valueEnum: sourceToEnum(equipmentTypeList, 'dCode', 'dName'),
        },
        {
            title: '故障标识',
            dataIndex: 'flagId',
            align: 'center',
            width: 150,
            hideInSearch: true,
        },
        {
            title: '故障主题',
            dataIndex: 'topic',
            align: 'left',
            hideInSearch: true,
            width: 300,
        },
        {
            title: '故障上报级别',
            dataIndex: 'reportLevelName',
            align: 'center',
            width: 120,
            order: 7,
            fieldProps: {
                mode: 'multiple',
            },
            search: {
                transform: (value) => ({ reportLevels: value }),
            },
            valueEnum: {
                [FAILURE_REPORTING_LEVEL.NEWSPAPER_GROUP_HEADQUARTERS]: {
                    text: FAILURE_REPORTING_LEVEL_TEXT[FAILURE_REPORTING_LEVEL.NEWSPAPER_GROUP_HEADQUARTERS],
                },
                [FAILURE_REPORTING_LEVEL.PROVINCIAL_COMPANY]: {
                    text: FAILURE_REPORTING_LEVEL_TEXT[FAILURE_REPORTING_LEVEL.PROVINCIAL_COMPANY],
                },
            },
        },
        {
            title: '最新上报类型',
            dataIndex: 'latestContinueType',
            align: 'center',
            order: 6,
            width: 90,
            search: {
                transform: (value) => ({ latestReportTypes: value }),
            },
            fieldProps: {
                mode: 'multiple',
            },
            valueEnum: {
                [ReportType.FIRST_NEWSPAPER]: { text: ReportTypeText[ReportType.FIRST_NEWSPAPER] },
                [ReportType.RENEWAL]: {
                    text: ReportTypeText[ReportType.RENEWAL],
                },
                [ReportType.FINAL_REPORT]: {
                    text: ReportTypeText[ReportType.FINAL_REPORT],
                },
            },
            render: (text, row: any, _, action) => {
                return row.latestContinueType === ReportTypeText[ReportType.FIRST_NEWSPAPER] ? (
                    <div className="first-newspaper">{row.latestContinueType}</div>
                ) : (
                    <div>{row.latestContinueType}</div>
                );
            },
        },
        {
            title: '上报时间',
            dataIndex: 'reportTime',
            align: 'center',
            width: 150,
            hideInSearch: true,
        },
        {
            title: '上报用途',
            dataIndex: 'application',
            align: 'center',
            width: 120,
            hideInSearch: true,
        },
        {
            title: '来源',
            dataIndex: 'sourceName',
            align: 'center',
            width: 100,
            fieldProps: {
                mode: 'multiple',
            },
            search: {
                transform: (value) => ({ sources: value }),
            },
            valueEnum: sourceEnum,
            order: 2,
        },
        {
            title: '故障上报状态',
            dataIndex: 'faultReportStatus',
            align: 'center',
            fieldProps: {
                allowClear: false,
            },
            initialValue: '1',
            valueEnum: {
                0: {
                    text: '已取消上报',
                },
                1: {
                    text: '正常上报',
                },
                2: {
                    text: '清除未上报',
                },
                3: {
                    text: '未上报',
                },
            },
        },
        {
            title: '状态',
            dataIndex: 'reportStatusName',
            align: 'center',
            width: 90,
            valueEnum: sourceToEnum(faultReportStatusList, 'dCode', 'dName'),
            fieldProps: {
                mode: 'multiple',
            },
            search: {
                transform: (value) => ({ latestReportStatus: value }),
            },
            order: 1,
        },
        {
            title: '关键字',
            dataIndex: 'fuzzyQueryKey',
            align: 'center',
            hideInTable: true,
            order: 3,
            fieldProps: {
                placeholder: '请输入故障标识、故障主题或上报人',
            },
        },
        {
            title: '上报时间',
            dataIndex: 'failureTime',
            align: 'center',
            width: 180,
            hideInTable: true,
            initialValue: [
                moment()
                    .year(moment().year() - 1)
                    .startOf('year'),
                moment().endOf('day'),
            ],
            renderFormItem: () => (
                <RangePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ format: 'HH:mm:ss' }} placeholder={['开始时间', '结束时间']} />
            ),
        },
        {
            title: '上报用途',
            dataIndex: 'application',
            align: 'center',
            width: 180,
            fieldProps: {
                mode: 'multiple',
            },
            search: {
                transform: (value) => ({ application: value }),
            },
            hideInTable: true,
            valueEnum: {
                [FAILURE_USEAGE.TEST]: {
                    text: FaultUseageText[FAILURE_USEAGE.TEST],
                },
                [FAILURE_USEAGE.REPORT]: {
                    text: FaultUseageText[FAILURE_USEAGE.REPORT],
                },
            },
        },
        {
            title: '是否已同步',
            dataIndex: 'syncState',
            align: 'center',
            hideInSearch: true,
            width: 90,
            valueEnum: {
                0: {
                    text: '否',
                },
                1: {
                    text: '是',
                },
            },
            fieldProps: {
                mode: 'multiple',
            },
        },
        {
            title: '根因专业',
            align: 'center',
            dataIndex: 'rootSpecialtyName',
            width: 120,
            fieldProps: {
                mode: 'multiple',
            },
            search: {
                transform: (value) => ({ rootSpecialtys: value }),
            },
            initialValue: [],
            valueEnum: sourceToEnum(majorList, 'dCode', 'dName'),
        },
    ];
};
