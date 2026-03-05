import React from 'react';
import ProtableSerachProvince from '@Pages/components/business-select/protable-search-province';

export default function getColumns({ currentZone }) {
    return [
        {
            title: '省份',
            dataIndex: 'provinceId',
            order: 9,
            initialValue: currentZone.zoneId,
            align: 'center',
            renderFormItem: (item, { fieldProps }) => {
                return <ProtableSerachProvince {...fieldProps} />;
            },
            render: (_, row) => {
                return row.provinceName;
            },
        },
    ];
}
