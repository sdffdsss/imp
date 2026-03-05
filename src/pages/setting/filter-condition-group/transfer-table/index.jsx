import React from 'react';
import { Transfer, Table } from 'antd';
import { _ } from 'oss-web-toolkits';

// Customize Table Transfer
const TableTransfer = ({
    leftColumns,
    rightColumns,
    onTransChange,
    tablePagination,
    tableLoading,
    dataSource,
    totalDataSource,
    targetKeys,
    scrollY,
    ...restProps
}) => {
    let selectTableRows = [];
    const onTransferChange = (selectedRowKeys) => {
        onTransChange && onTransChange(selectedRowKeys, selectTableRows);
    };
    return (
        <Transfer {...restProps} dataSource={dataSource} targetKeys={targetKeys} onChange={onTransferChange} showSelectAll={false}>
            {({ direction, onItemSelectAll, onItemSelect, selectedKeys: listSelectedKeys, disabled: listDisabled }) => {
                const columns = direction === 'left' ? leftColumns : rightColumns;

                const rowSelection = {
                    getCheckboxProps: (item) => ({ disabled: listDisabled || item.disabled }),
                    onSelectAll(selected, selectedRows) {
                        const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ neId }) => neId);
                        const diffKeys = selected
                            ? _.difference(treeSelectedKeys, listSelectedKeys)
                            : _.difference(listSelectedKeys, treeSelectedKeys);
                        onItemSelectAll(diffKeys, selected);
                    },
                    onSelect({ neId }, selected) {
                        onItemSelect(neId, selected);
                    },
                    onChange(selectedRowKeys, selectedRows) {
                        selectTableRows = selectedRows;
                    },
                    selectedRowKeys: listSelectedKeys,
                };
                const xWidth = columns.reduce((total, item) => {
                    return total + item.width;
                }, 0);
                const rightDataSource = totalDataSource.filter((item) => targetKeys.includes(item.neId));
                const leftDataSource = dataSource.map((item) => ({
                    ...item,
                    disabled: targetKeys.includes(item.neId),
                }));
                return (
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={direction === 'left' ? leftDataSource : rightDataSource}
                        size="small"
                        loading={tableLoading}
                        bordered
                        scroll={{ x: xWidth, y: scrollY }}
                        pagination={
                            direction === 'left'
                                ? {
                                      ...tablePagination,
                                      onChange: (page, pageSize) => {
                                          restProps.onPageChange && restProps.onPageChange(page, pageSize);
                                      },
                                  }
                                : false
                        }
                        onRow={({ key, disabled: itemDisabled }) => ({
                            onClick: () => {
                                if (itemDisabled) return;
                                onItemSelect(key, !listSelectedKeys.includes(key));
                            },
                        })}
                    />
                );
            }}
        </Transfer>
    );
};

export default TableTransfer;
