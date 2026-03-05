import React from 'react';
import moment from 'moment';
import AllSelect from '@Src/components/all-select';
import { DatePicker } from 'oss-ui';

export const tableColumns = (options: any) => {
    const { operationRender, enums, initProvinceValue, initIntraProfessionalType } = options;
    const provinceOptions = enums.provinceList.map((el) => ({ ...el, label: el.zoneName, value: el.zoneId }));

    return [
        {
            title: '序号',
            dataIndex: 'order',
            width: 50,
            align: 'center',
            search: false,
        },
        {
            title: '省份名称',
            dataIndex: 'provinceName',
            width: 100,
            align: 'center',
            order: 4,
            colSize: 2,
            search: {
                initialValue: initProvinceValue,
                renderFormItem: () => {
                    return <AllSelect options={provinceOptions} placeholder="请选择省份" maxTagCount="responsive" allowClear />;
                },
            },
        },
        {
            title: '备注',
            dataIndex: 'notes',
            width: 480,
            align: 'left',
            colSize: 2,
            order: 1,
            render: (text) => {
                return (
                    <div className="text-ellipsis-2" title={text}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '网内网间专业',
            dataIndex: 'intraProfessionalTypeCn',

            width: 100,
            align: 'center',
            order: 3,
            colSize: 2,
            search: {
                initialValue: initIntraProfessionalType,
                renderFormItem: () => {
                    return <AllSelect options={enums.networkTypeOptions} placeholder="请选择专业" maxTagCount="responsive" allowClear />;
                },
            },
        },
        {
            title: '上报人',
            dataIndex: 'creator',
            width: 100,
            align: 'center',
            order: 2,
            colSize: 2,
        },
        {
            title: '上报时间',
            dataIndex: 'createTime',
            width: 140,
            align: 'center',
            order: 5,
            colSize: 2,
            search: {
                type: 'dateRange',
                initialValue: [moment().startOf('day'), moment().endOf('day')],

                renderFormItem: (a, b, form) => {
                    return (
                        <DatePicker.RangePicker
                            style={{ width: '100%' }}
                            placeholder={['开始时间', '结束时间']}
                            showTime={{ format: 'HH:mm:ss' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            onChange={(value) => {
                                form.setFieldsValue({ createTime: value ?? [] });
                            }}
                            allowClear
                        />
                    );
                },
            },
        },
        {
            title: '修改人',
            dataIndex: 'modifier',
            width: 100,
            align: 'center',
            search: false,
        },
        {
            title: '修改时间',
            dataIndex: 'modifyTime',
            width: 140,
            align: 'center',
            search: false,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            align: 'center',
            search: false,
            render: operationRender,
        },
    ];
};
