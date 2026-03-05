import React from 'react';
import { DatePicker, Select } from 'oss-ui';
import EllipsisText from '@Pages/components/ellipsis-text';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import moment from 'moment';

const { RangePicker } = DatePicker;

const getColumns = (props) => {
    const { searchTime, professionalData, groupData, provinceId, pagination, groupInitial } = props;
    const dateFormat = 'YYYY-MM-DD';
    const frontday = moment().subtract(30, 'days').format(dateFormat);
    const now = moment().format(dateFormat);

    let dates = [moment() - 30, moment()];
    function disabledDate(current) {
        if (dates?.length === 2) {
            const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
            const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
            return !!tooEarly || !!tooLate;
        }
        return false;
    }

    function setDates(val) {
        dates = val;
    }

    return [
        {
            title: '序号',
            dataIndex: 'index',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 40,
            render: (text, row, index) => {
                const { current, pageSize } = pagination;
                return (current - 1) * pageSize + index + 1;
            },
        },
        {
            title: '省份',
            dataIndex: 'provinceName',
            ellipsis: true,
            align: 'center',
            width: 80,
            search: false,
        },
        {
            title: '省份',
            dataIndex: 'provinceId',
            hideInTable: true,
            initialValue: provinceId,
            order: 5,
            renderFormItem: (item, { fieldProps }, form) => {
                return (
                    <SelectCondition
                        {...fieldProps}
                        form={form}
                        disabled
                        title="省份"
                        id="key"
                        label="value"
                        dictName="province_id"
                        searchName="province_id"
                    />
                );
            },
        },
        {
            title: '专业',
            dataIndex: 'professionalName',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
        },
        {
            title: '班组名称',
            dataIndex: 'groupName',
            ellipsis: true,
            align: 'center',
            width: 100,
            search: false,
            render: (_, record) => {
                return <EllipsisText text={record.groupName} maxLength={12} />;
            },
        },
        {
            title: '专业',
            dataIndex: 'professionalObj',
            hideInTable: true,
            order: 4,
            renderFormItem: () => {
                return (
                    <Select
                        mode="multiple"
                        placeholder="全部"
                        showSearch
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        options={professionalData.map((item) => {
                            return { label: item.txt, value: item.id };
                        })}
                    />
                );
            },
        },
        {
            title: '班组名称',
            dataIndex: 'groupObj',
            hideInTable: true,
            initialValue: groupInitial,
            order: 3,
            renderFormItem: () => {
                return (
                    <Select
                        allowClear
                        showSearch
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        options={groupData.map((item) => {
                            return { label: item.groupName, value: item.groupId };
                        })}
                    />
                );
            },
        },
        {
            title: '人员名称',
            dataIndex: 'mainName',
            ellipsis: true,
            // order: 2,
            search: true,
            align: 'center',
            width: 120,
        },
        {
            title: '值班时间',
            dataIndex: 'dateTime',
            // order: 1,
            hideInTable: true,
            valueType: 'dateTimeRange',
            search: {
                transform: (value) => ({ dateTime: value }),
            },
            // initialValue: searchTime,
            renderFormItem: () => {
                return (
                    <RangePicker
                        placeholder={['起始日期', '结束日期']}
                        defaultValue={[moment(frontday, dateFormat), moment(now, dateFormat)]}
                        disabledDate={disabledDate}
                        onCalendarChange={(val) => setDates(val)}
                    />
                );
            },
        },
        {
            title: '值班时间',
            dataIndex: 'dateTime',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 140,
        },
        {
            title: '接班时间',
            dataIndex: 'takeOverTime',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '交班时间',
            dataIndex: 'handOverTime',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
        {
            title: '班次',
            dataIndex: 'workShiftName',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 80,
        },
        // {
        //     title: '列表值班统计',
        //     dataIndex: '',
        //     // ellipsis: true,
        //     render: () => (
        //         <h5 style={{ color: 'red' }}>
        //             总值班班次数:{dutyData[1]},正常值班班次数:{dutyData[2]},未正常值班班次数:{dutyData[3]}
        //         </h5>
        //     ),
        //     search: false,
        //     align: 'center',
        //     width: 140,
        //     fixed: 'right',
        //     onCell: (_, index) => {
        //         return index === 1 ? { rowSpan: 20 } : { rowSpan: 0 };
        //     },
        // },
    ];
};
const fomartRate = (rate) => {
    let color = '#000';
    if (+rate < 90) {
        color = 'red';
    }
    return <div style={{ color }}>{(+rate).toFixed(1)}%</div>;
};
const getModalColumns = ({ groupData, professionalData, faultReportExportHandle, initDate, groupId }) => {
    return [
        {
            title: '专业',
            dataIndex: 'professional',
            align: 'center',
            search: true,
            renderFormItem: () => {
                return (
                    <Select
                        mode="multiple"
                        placeholder="全部"
                        showSearch
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        options={professionalData.map((item) => {
                            return { label: item.txt, value: item.id };
                        })}
                    />
                );
            },
        },
        {
            title: '班组名称',
            dataIndex: 'teamName',
            align: 'center',
            search: true,
            initialValue: groupId,

            renderFormItem: () => {
                return (
                    <Select
                        showSearch
                        placeholder="全部"
                        allowClear
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        options={groupData.map((item) => {
                            return { label: item.groupName, value: item.groupId };
                        })}
                    />
                );
            },
        },
        {
            title: '值班人员',
            dataIndex: 'dutyPerson',
            align: 'center',
            search: false,
        },
        {
            title: '巡检及时率',
            dataIndex: 'inspectionTimelinessRate',
            align: 'center',
            search: false,
            render: (text) => fomartRate(text),
        },
        {
            title: '通报及时率',
            dataIndex: 'notificationTimelinessRate',
            align: 'center',
            search: false,
            render: (text) => fomartRate(text),
        },
        {
            title: '通报准确率',
            dataIndex: 'notificationAccuracyRate',
            align: 'center',
            search: false,
            render: (text) => fomartRate(text),
        },
        {
            title: '报告质量等级',
            dataIndex: 'reportQualityLevel',
            align: 'center',
            search: false,
            render: (text, record) => {
                return (
                    <a style={{ color: '#000' }} onClick={() => faultReportExportHandle(record)}>
                        {text}
                    </a>
                );
            },
        },
        {
            title: '统计时间',
            dataIndex: 'dateTimes',
            hideInTable: true,
            initialValue: initDate,
            fieldProps: {
                allowClear: false, // 禁用清除按钮
            },
            search: {
                transform: (value) => {
                    return {
                        startTime: value[0],
                        endTime: value[1],
                    };
                },
            },
            valueType: 'dateRange',
        },
    ];
};

export default getColumns;
export { getModalColumns };
