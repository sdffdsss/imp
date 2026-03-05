import { useState, useRef } from 'react';
import { _ } from 'oss-web-toolkits';

export function useTableSelection(rowKey, initialValues?: any) {
    const [selectedRows, setSelectedRows] = useState<any[]>(initialValues || []);
    const noSelectedRows = useRef<any[]>([]);

    function onSelect(record, selected) {
        if (selected) {
            setSelectedRows((prev) => [...prev, record]);
            noSelectedRows.current = noSelectedRows.current.filter((item) => item[rowKey] !== record[rowKey]);
        } else {
            noSelectedRows.current.push(record);
            setSelectedRows(selectedRows.filter((item) => item[rowKey] !== record[rowKey]));
        }
    }
    function onSelectAll(selected, curSelectedRows, changeRows) {
        if (selected) {
            setSelectedRows((prev) => _.uniqBy([...prev, ...changeRows], rowKey));
            noSelectedRows.current = noSelectedRows.current.filter((item) => !changeRows.some((e) => e[rowKey] === item[rowKey]));
        } else {
            setSelectedRows((prev) => _.differenceBy(prev, changeRows, rowKey));
            noSelectedRows.current = [...noSelectedRows.current, ...changeRows];
        }
    }
    function clearSelection() {
        setSelectedRows([]);
        noSelectedRows.current = [];
    }
    return {
        selectedRows,
        setSelectedRows,
        onSelect,
        onSelectAll,
        noSelectedRows,
        clearSelection,
    };
}
