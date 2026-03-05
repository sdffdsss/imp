import { Table } from 'oss-ui';
import React from 'react';
import cls from 'classnames';
import './index.less';

export default function index(props) {
    const { rowSelection, columns, dataSource, loading = false, ticketModalClassName, pagination, onChange } = props;
    return (
        <Table
            // size="small"
            className={cls('association-ticket-table-wrapper', { ticketModalClassName: !!ticketModalClassName })}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={pagination}
            onChange={onChange}
        />
    );
}
