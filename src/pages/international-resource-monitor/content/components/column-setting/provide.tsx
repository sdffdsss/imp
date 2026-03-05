import type { TableColumnType } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { ProTableProps, ColumnsState } from './types';

export type ProTableColumn<T> = ColumnsState & TableColumnType<T>;

export type UseContainerProps<T = any> = {
    columns?: ProTableColumn<T>[];
    columnsState?: ProTableProps<any, any, any>['columnsState'];
    allColumnsData?: {
        id: number | string;
        title: string;
        columns: ProTableColumn<T>[];
        columnState: Record<string, ColumnsState>;
    }[];
    onChange: (data: ProTableProps<any, any, any>['columnsState']) => void;
    defaultColumnsMap?: Record<string, ColumnsState>;
};

function useContainer(props: UseContainerProps = { onChange: () => {} }) {
    const { allColumnsData } = props;
    // 所有表格的 columnsState
    const [columnsMap, setColumnsMap] = useState<Record<string, ColumnsState>>();
    // 所有表格的 dataIndex 排序
    const [sortKeyMap, setSortKeyMap] = useState<Record<string, any>>();

    useEffect(() => {
        // // 设置分组 columnsMap
        const columnsState: any = {};
        // 设置分组 key 顺序
        const keyListMap = {};
        allColumnsData?.forEach((item) => {
            columnsState[item.id] = item.columnState;
            const formatColumns = item.columns
                .map((item2: any) => {
                    return {
                        ...item2,
                        ...columnsState[item.id][item2.dataIndex],
                    };
                })
                .sort((a, b) => a.order - b.order);
            const keyList = formatColumns.map((item2) => item2.dataIndex);
            keyListMap[item.id] = keyList;
        });
        setColumnsMap(columnsState);
        setSortKeyMap(keyListMap);
    }, [allColumnsData]);

    /** 默认全选中 */
    const defaultColumnsMap = useMemo(() => {
        if (props?.defaultColumnsMap) {
            return JSON.parse(JSON.stringify(props.defaultColumnsMap));
        }
        return {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allColumnsData]);

    const renderValue = {
        allColumnsData,
        columnsMap,
        setColumnsMap,
        sortKeyMap,
        setSortKeyMap,
        onChange: props.onChange,
        defaultColumnsMap,
    };
    return renderValue;
}
type ContainerReturnType = ReturnType<ContainerType>;

const TableContext = createContext<ContainerReturnType>({} as any);

export type ContainerType = typeof useContainer;

const Container: React.FC<{
    initValue: UseContainerProps<any>;
    children: React.ReactNode;
}> = (props) => {
    const value = useContainer(props.initValue);
    return <TableContext.Provider value={value}>{props.children}</TableContext.Provider>;
};

export { TableContext, Container };
