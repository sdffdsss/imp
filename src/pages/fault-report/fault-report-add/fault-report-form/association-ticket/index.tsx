import { Button } from 'oss-ui';
import React, { useState, useEffect } from 'react';
import { ItemCard } from '../../../components';
import AssTable from './ticket-table';
import AssModal, { columns, DataType } from './modal';
import './index.less';

interface IIndexProps {
    value?: DataType[];
    onChange?: (value: DataType[]) => void;
    mode?: 'editable' | 'readonly';
    ticketModalClassName?: string;
    assTicketVisible?: boolean;
    setAssTicketVisible?: (visible: boolean) => void;
}

const Index = (props: IIndexProps): JSX.Element => {
    const { mode = 'editable', value, onChange, ticketModalClassName, assTicketVisible, setAssTicketVisible } = props;
    const [selectRows, setSelectRows] = useState<DataType[]>([]);
    // const [initSelectedRowKeys, setInitSelectedRowKeys] = useState<string[]>([]);

    let modalClassName = 'default-association-ticket-modal';
    const frameVisible = window.location.href.indexOf('hideNav') !== -1; // 是否为嵌入的故障上报
    if (ticketModalClassName) {
        modalClassName = `${modalClassName} ${ticketModalClassName}`;
    }
    if (frameVisible) {
        modalClassName = 'default-association-ticket-modal';
    }

    useEffect(() => {
        setSelectRows(value ?? []);
        // setInitSelectedRowKeys(value?.map((item) => item.sheetNo) ?? []);
    }, [value]);

    return (
        <>
            {/* <ItemCard
                title="关联工单"
                hideDivider
                extra={
                    mode === 'editable' && (
                        <Button
                            type="primary"
                            onClick={() => {
                                setAssTicketVisiable(true);
                            }}
                            style={{ marginBottom: 8 }}
                        >
                            +
                        </Button>
                    )
                }
                extraStyle={{ top: 8, left: 120 }}
            > */}
            <AssTable columns={columns} dataSource={selectRows} pagination={{ pageSize: 10, total: selectRows?.length ?? 0 }} />
            {assTicketVisible && (
                <AssModal
                    visible={assTicketVisible}
                    onCancle={() => {
                        setAssTicketVisible(false);
                    }}
                    onSaveCallback={(selectedRows) => {
                        onChange?.(selectedRows);
                        setSelectRows(selectedRows);
                        // setInitSelectedRowKeys(selectKeys);
                    }}
                    selectedRows={selectRows}
                    // initSelectedRowKeys={initSelectedRowKeys}
                    ticketModalClassName={modalClassName}
                />
            )}
            {/* </ItemCard> */}
        </>
    );
};

export default Index;
