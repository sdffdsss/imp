import React, { useState, useEffect } from 'react';
import { _ } from 'oss-web-toolkits';
import { Transfer, Switch, Table, Tag } from 'antd';
import difference from 'lodash/difference';

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, onTransferChange, ...restProps }) => (
    <Transfer {...restProps}>
        {({ direction, filteredItems, onItemSelectAll, onItemSelect, selectedKeys: listSelectedKeys, disabled: listDisabled }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;

            const rowSelection = {
                getCheckboxProps: (item) => ({
                    disabled: listDisabled || item.disabled,
                }),
                onSelectAll(selected, selectedRows) {
                    const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ userId }) => userId);
                    const diffKeys = selected ? _.difference(treeSelectedKeys, listSelectedKeys) : _.difference(listSelectedKeys, treeSelectedKeys);
                    onItemSelectAll(diffKeys, selected);
                },
                onSelect({ userId }, selected) {
                    onItemSelect(userId, selected);
                },
                selectedRowKeys: listSelectedKeys,
            };

            return (
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredItems}
                    size="small"
                    rowKey={'userId'}
                    pagination={false}
                    style={{ pointerEvents: listDisabled ? 'none' : null }}
                    scroll={{ y: 310 }}
                />
            );
        }}
    </Transfer>
);

const ScheduleTransfer = (props) => {
    const { dataSource, columns, onTransferChange } = props;
    const [targetKeys, handleTargetKeys] = useState();
    useEffect(() => {
        // const newKeys = props.targetKeys;
        // targetKeys?.forEach((item) => {
        //     newKeys.unshift(item);
        // });
        // handleTargetKeys(_.uniq(newKeys));
        handleTargetKeys(props.targetKeys);
    }, [props.targetKeys]);
    const onChange = (e) => {
        // 新增往下排
        let curArr = [];
        const newKeys = [...e];
        const news = [...targetKeys];
        if (e.length > targetKeys.length) {
            const arr = news.concat(newKeys);
            arr?.forEach((item) => {
                if (newKeys.find((ite) => ite === item)) {
                    curArr.push(item);
                }
            });
        } else {
            curArr = newKeys;
        }
        handleTargetKeys(_.uniq(curArr));
    };
    useEffect(() => {
        onTransferChange &&
            targetKeys &&
            onTransferChange(
                targetKeys,
                dataSource.filter((item) => item.userId === targetKeys[0]),
            );
    }, [targetKeys]);
    return (
        <>
            <TableTransfer
                dataSource={dataSource}
                targetKeys={targetKeys}
                showSelectAll={false}
                showSearch={true}
                onChange={onChange}
                filterOption={(inputValue, item) => item.userName.indexOf(inputValue) !== -1}
                leftColumns={columns}
                rightColumns={columns}
                onTransferChange={onTransferChange}
            />
        </>
    );
};

export default ScheduleTransfer;
