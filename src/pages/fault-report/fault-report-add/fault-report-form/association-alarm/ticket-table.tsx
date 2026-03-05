import { Table } from 'oss-ui';
// import { VirtualTable } from 'oss-web-common';
import React from 'react';
import cls from 'classnames';
import './index.less';

export default function index(props) {
    const { rowSelection, columns, dataSource, loading = false, ticketModalClassName, pagination, onChange, rowKey, onExpand, scrollLimit } = props;
    const xWidth =
        columns &&
        columns.reduce((total, item) => {
            return item.hideInSearch ? total + item.Width : total;
        }, 0);
    return (
        <Table
            // size="small"
            // global={window}
            // search={false}
            // options={false}
            // bordered
            // scroll={{ x: xWidth, y: 450 }}
            rowKey={rowKey}
            className={cls(`association-ticket-table-wrapper ${scrollLimit ? 'backShowTable' : ''}`, {
                ticketModalClassName: !!ticketModalClassName,
            })}
            rowSelection={rowSelection}
            columns={columns}
            scroll={{ x: xWidth }}
            dataSource={dataSource}
            loading={loading}
            pagination={{ ...pagination, showSizeChanger: true }}
            onChange={onChange}
            expandable={{
                onExpand,
            }}
        />
    );
}
