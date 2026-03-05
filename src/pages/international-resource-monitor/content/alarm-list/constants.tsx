import React from 'react';
import EditTableItem from '../components/edit-table-item';

export const circuitRowKey = 'id';
export const alarmRowKey = 'standard_alarm_id';
export const actionsKey = 'actions';
// 父表格 电路ID
export const circuitId = 'CIRCUIT_ID';
// 子表格 告警ID
export const alarmId = 'ALARM_ID';

export const fixedMap = {
    0: false,
    1: 'left',
    2: 'right',
};

export const parentColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        // width: '-',
        render: (text) => <EditTableItem text={text} />,
    },
    {
        title: '电路ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        // width: '-',
        render: (text) => <EditTableItem text={text} />,
        onHeaderCell: (column) => ({
            onClick: () => {
                console.log(`Clicked on header cell of column ${column.key}`);
            },
        }),
    },
    {
        title: '电路名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        // width: '-',
        render: (text) => <EditTableItem text={text} />,
    },
    {
        title: '端口速率',
        dataIndex: 'sl',
        key: 'sl',
        align: 'center',
        // width: '-',
        render: (text) => <EditTableItem text={text} />,
    },
    {
        title: '客户名称',
        dataIndex: 'khname',
        key: 'khname',
        align: 'center',
        // width: '-',
        render: (text) => <EditTableItem text={text} />,
    },
    {
        title: '所属通道',
        dataIndex: 'td',
        key: 'td',
        align: 'center',
        // width: '-',
        render: (text) => <EditTableItem text={text} />,
    },
];
