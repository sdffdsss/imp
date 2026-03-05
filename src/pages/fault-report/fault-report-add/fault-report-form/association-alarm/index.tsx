import React, { useState, useEffect } from 'react';
import useLoginInfoModel from '@Src/hox';
import AssTable from './ticket-table';
import AssModal, { DataType } from './modal';
import './index.less';

import { getAllAlarmColumns, setColumnsInfo, getUserQueryDefaultColumns } from './rest';

interface IIndexProps {
    value?: DataType[];
    onChange?: (value: DataType[], searchTime: any) => void;
    mode?: 'editable' | 'readonly';
    ticketModalClassName?: string;
    specialty?: any;
    assTicketVisible?: boolean;
    setAssTicketVisible?: (visible: boolean) => void;
}
// const nanoid = customAlphabet('4567890', 15);
const alarmLevel = {
    1: (
        <div
            className="overview-monitor-alarm-table-cell-alarm"
            style={{
                background: 'rgb(230,44,37)',
                color: '#000',
            }}
        >
            一级告警
        </div>
    ),
    2: (
        <div
            className="overview-monitor-alarm-table-cell-alarm"
            style={{
                background: 'rgb(239,157,65)',
                color: '#000',
            }}
        >
            二级告警
        </div>
    ),
    3: (
        <div
            className="overview-monitor-alarm-table-cell-alarm"
            style={{
                background: 'rgb(255,251,95)',
                color: '#000',
            }}
        >
            三级告警
        </div>
    ),
    4: (
        <div
            className="overview-monitor-alarm-table-cell-alarm"
            style={{
                background: 'rgb(71,171,251)',
                color: '#000',
            }}
        >
            四级告警
        </div>
    ),
};

const Index = (props: IIndexProps): JSX.Element => {
    const { assTicketVisible, setAssTicketVisible, value, onChange, ticketModalClassName, specialty } = props;

    const [selectRows, setSelectRows] = useState<DataType[]>([]);
    const [columns, setColumns] = useState<any>([]);
    const [fieldIds, setFieldIds] = useState([]);
    const login = useLoginInfoModel();
    // const [initSelectedRowKeys, setInitSelectedRowKeys] = useState<string[]>([]);
    const frameVisible = window.location.href.indexOf('hideNav') !== -1; // 是否为嵌入的故障上报
    let modalClassName = 'default-association-ticket-modal';
    if (ticketModalClassName) {
        modalClassName = `${modalClassName} ${ticketModalClassName}`;
    }
    if (frameVisible) {
        modalClassName = 'default-association-ticket-modal';
    }
    const getViewColumn = () => {
        const { userName } = login;

        Promise.all([getUserQueryDefaultColumns(userName), getAllAlarmColumns()])
            .then((res) => {
                const { queryAlarmColumnDefault: activeAlarmColumn } = setColumnsInfo(res[0], res[1], 'query');
                const Columns: any = [
                    {
                        title: '',
                        dataIndex: 'key',
                        key: 'key',
                        hideInSearch: true,
                        align: 'left',
                        width: 35,
                        render: (text, record) => {
                            return <div className="overview-monitor-alarm-table-sub" style={{ display: record?.dropLine ? 'flex' : 'none' }}></div>;
                        },
                    },
                ];
                const fieldId: any = [];
                activeAlarmColumn.forEach((item) => {
                    const field = {
                        title: item.alias,
                        dataIndex: item.field,
                        key: item.field,
                        hideInSearch: true,
                        ellipsis: true,
                        align: 'center',
                        width: `${item.width}px`,
                    };
                    fieldId.push(item.id);
                    if (item.field === 'org_severity') {
                        Columns.push({
                            ...field,
                            render: (text, record) => {
                                return alarmLevel[record?.org_severity];
                            },
                        });
                    } else {
                        Columns.push(field);
                    }
                });
                setColumns(Columns);
                const fieldIdss = fieldId.join(',');
                setFieldIds(fieldIdss);
            })
            .catch(() => {});
    };

    useEffect(() => {
        getViewColumn();
        const newValue = value?.filter((e) => e);
        setSelectRows(newValue ?? []);
        // setInitSelectedRowKeys(value?.map((item) => item.sheetNo) ?? []);
    }, [value]);

    return (
        <>
            <AssTable columns={columns.filter((e) => e.dataIndex !== 'key')} dataSource={selectRows} scrollLimit pagination={false} />
            {assTicketVisible && (
                <AssModal
                    visible={assTicketVisible}
                    onCancle={() => {
                        setAssTicketVisible?.(false);
                    }}
                    specialty={specialty}
                    fieldIds={fieldIds}
                    columns={columns}
                    onSaveCallback={(selectedRows, searchTime) => {
                        onChange?.(selectedRows, searchTime);
                        setSelectRows(selectedRows);
                        // setInitSelectedRowKeys(selectKeys);
                    }}
                    selectedRows={selectRows}
                    // initSelectedRowKeys={initSelectedRowKeys}
                    ticketModalClassName={modalClassName}
                />
            )}
        </>
    );
};

export default Index;
