// eslint-disable-next-line import/no-extraneous-dependencies
import { runFunction } from '@ant-design/pro-utils';
import type { TableColumnType } from 'antd';
import { Checkbox, Popover, Space, Tooltip, Tree, Icon } from 'oss-ui';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ConfigProvider } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';
import type { DataNode } from 'antd/lib/tree';
import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import omit from 'omit.js';
import React, { useContext, useMemo, memo, useRef, useCallback } from 'react';

const useRefFunction = <T extends (...args: any[]) => any>(re: T) => {
    const ref = useRef<T>(re);
    ref.current = re;
    return useCallback((...args: Parameters<T>) => {
        return ref.current?.(...args);
    }, []);
};
import { SettingOptionType, ProColumns, ColumnsState } from './types';
import { TableContext, Container } from './provide';
import styles from './styles.module.less';

type ColumnSettingProps<T = any> = SettingOptionType & {
    columns: TableColumnType<T>[];
    columnsState: ColumnsState;
    allColumnsData: any[];
    onChange: (columnsState: ColumnsState) => void;
};

const ToolTipIcon: React.FC<{
    title: string;
    columnKey: string;
    show: boolean;
    fixed: 'left' | 'right' | undefined;
    children?: React.ReactNode;
}> = ({ title, show, children, columnKey, fixed }) => {
    const { columnsMap, setColumnsMap, onChange } = useContext(TableContext);
    if (!show) {
        return null;
    }
    const currentData = columnKey.split('-');
    const id = currentData[0];
    const groupId = currentData[1];

    const onClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const config = columnsMap?.[groupId][id] || {};
        const columnKeyMap = {
            ...columnsMap,
            [groupId]: {
                ...columnsMap?.[groupId],
                [id]: { ...config, fixed } as ColumnsState,
            },
        };
        setColumnsMap(columnKeyMap);
        onChange(columnKeyMap);
    };

    return (
        <Tooltip title={title}>
            <span onClick={onClick}>{children}</span>
        </Tooltip>
    );
};

const CheckboxListItem: React.FC<{
    columnKey: string;
    className?: string;
    title?: React.ReactNode;
    fixed?: boolean | 'left' | 'right';
    showListItemOption?: boolean;
    isLeaf?: boolean;
}> = ({ columnKey, isLeaf, title, className, fixed, showListItemOption }) => {
    const dom = (
        <span className={`${className}-list-item-option`.trim()}>
            <ToolTipIcon columnKey={columnKey} fixed="left" title="固定在列首" show={fixed !== 'left'}>
                <Icon type="VerticalAlignTopOutlined" antdIcon />
            </ToolTipIcon>
            <ToolTipIcon columnKey={columnKey} fixed={undefined} title="不固定" show={!!fixed}>
                <Icon type="VerticalAlignMiddleOutlined" antdIcon />
            </ToolTipIcon>
            <ToolTipIcon columnKey={columnKey} fixed="right" title="固定在列尾" show={fixed !== 'right'}>
                <Icon type="VerticalAlignBottomOutlined" antdIcon />
            </ToolTipIcon>
        </span>
    );
    return (
        <span className={`${className}-list-item`.trim()} key={columnKey}>
            <div className={`${className}-list-item-title`.trim()}>{title}</div>
            {showListItemOption && !isLeaf ? dom : null}
        </span>
    );
};

const CheckboxList: React.FC<{
    list: (ProColumns<any> & { index?: number })[];
    className?: string;
    title: string;
    draggable: boolean;
    checkable: boolean;
    showListItemOption: boolean;
    showTitle?: boolean;
    listHeight?: number;
    id: string | number;
}> = ({ list, draggable, checkable, showListItemOption, className, showTitle = true, title: listTitle, listHeight = 320, id }) => {
    const { columnsMap, setColumnsMap, sortKeyMap, setSortKeyMap, onChange } = useContext(TableContext);
    const show = list && list.length > 0;
    const treeDataConfig = useMemo(() => {
        if (!show) return {};
        const checkedKeys: string[] = [];
        const treeMap = new Map<string | number, DataNode>();

        const loopData = (
            data: any[],
            parentConfig?: ColumnsState & {
                columnKey: string;
            },
        ): DataNode[] =>
            data.map(({ key, dataIndex, children, ...rest }) => {
                const treeId = `${dataIndex}-${id}`;
                const config = columnsMap?.[id]?.[dataIndex] || { show: true };
                if (config.show !== false && !children) {
                    checkedKeys.push(treeId);
                }

                const item: DataNode = {
                    key: treeId,
                    ...omit(rest, ['className']),
                    selectable: false,
                    disabled: config.disable === true,
                    disableCheckbox: typeof config.disable === 'boolean' ? config.disable : config.disable?.checkbox,
                    isLeaf: parentConfig ? true : undefined,
                };
                treeMap.set(key, item);
                return item;
            });
        return { list: loopData(list), keys: checkedKeys, map: treeMap };
    }, [columnsMap, list, show, id]);

    /** 移动到指定的位置 */
    const move = useRefFunction((ids: string, targetId: string, dropPosition: number) => {
        const newMap = { ...columnsMap };
        const newColumns = { ...sortKeyMap };

        // 获取当前要移动项
        const current = ids.split('-');
        const currentRealId = current[0]; //  获取分组下的id
        const currentGroupId = current[1]; // 获取分组的id

        // 获取移动到的目标位置
        const target = targetId.split('-');
        const targetRealId = target[0];

        // 当前真正操作的分组数据
        const currentColumns = newColumns[currentGroupId];
        const currentMap = newMap[currentGroupId];

        const findIndex = currentColumns.findIndex((columnKey) => columnKey === currentRealId);
        const targetIndex = currentColumns.findIndex((columnKey) => columnKey === targetRealId);

        const isDownWard = dropPosition > findIndex;
        if (findIndex < 0) return;
        const targetItem = currentColumns[findIndex];
        currentColumns.splice(findIndex, 1);

        if (dropPosition === 0) {
            currentColumns.unshift(targetItem);
        } else {
            currentColumns.splice(isDownWard ? targetIndex : targetIndex + 1, 0, targetItem);
        }

        // 重新生成排序数组
        currentColumns.forEach((key, order) => {
            currentMap[key] = { ...(currentMap[key] || {}), order };
        });

        const formatMap = { ...newMap, [currentGroupId]: currentMap };
        // 更新数组
        setColumnsMap(formatMap);
        onChange(formatMap);
        setSortKeyMap(newColumns);
    });

    /** 选中反选功能 */
    const onCheckTree = useRefFunction((e) => {
        const newColumnMap = { ...columnsMap };
        const showData = Object.keys(newColumnMap[id]).filter((item) => newColumnMap[id][item].show);
        if (showData.length === 1 && !e.checked) {
            return;
        }
        const loopSetShow = (key: string) => {
            const currentKey = key.split('-')[0];
            const newSetting = { ...newColumnMap[id][currentKey] };
            newSetting.show = e.checked;
            newColumnMap[id][currentKey] = newSetting;
        };
        loopSetShow(e.node.key);
        setColumnsMap({ ...newColumnMap });
        onChange({ ...newColumnMap });
    });

    if (!show) {
        return null;
    }

    const listDom = (
        <Tree
            itemHeight={24}
            draggable={draggable && !!treeDataConfig.list?.length && treeDataConfig.list?.length > 1}
            checkable={checkable}
            onDrop={(info: any) => {
                const dropKey = info.node.key;
                const dragKey = info.dragNode.key;
                const { dropPosition, dropToGap } = info;
                const position = dropPosition === -1 || !dropToGap ? dropPosition + 1 : dropPosition;
                move(dragKey, dropKey, position);
            }}
            blockNode
            onCheck={(_, e) => onCheckTree(e)}
            checkedKeys={treeDataConfig.keys}
            showLine={false}
            titleRender={(_node: any) => {
                const node = { ..._node, children: undefined };
                if (!node.title) return null;
                return (
                    <CheckboxListItem
                        className={className}
                        {...node}
                        showListItemOption={showListItemOption}
                        title={runFunction(node.title, node)}
                        columnKey={node.key}
                    />
                );
            }}
            height={listHeight}
            treeData={treeDataConfig.list?.map(({ disabled /* 不透传 disabled，使子节点禁用时也可以拖动调整顺序 */, ...config }) => config)}
        />
    );

    return (
        <>
            {showTitle && <span className={`${className}-list-title`.trim()}>{listTitle}</span>}
            {listDom}
        </>
    );
};

const GroupCheckboxList: React.FC<{
    className?: string;
    draggable: boolean;
    checkable: boolean;
    showListItemOption: boolean;
    listsHeight?: number;
    title?: string;
    itemData: {
        columns: any[];
        title?: string;
        id: number | string;
    };
}> = ({ className, draggable, checkable, showListItemOption, listsHeight, itemData }) => {
    const { columnsMap } = useContext(TableContext);
    const { columns, title, id } = itemData;

    const sortColumns = columns
        .map((item: any) => {
            return { ...item, ...columnsMap?.[id][item.dataIndex] };
        })
        .sort((a, b) => a.order - b.order);

    const rightList: (ProColumns<any> & { index?: number })[] = [];
    const leftList: (ProColumns<any> & { index?: number })[] = [];
    const list: (ProColumns<any> & { index?: number })[] = [];

    sortColumns.forEach((item) => {
        /** 不在 setting 中展示的 */
        if (item.hideInSetting) {
            return;
        }
        const { fixed } = item;

        if (fixed === 'left') {
            leftList.push(item);
            return;
        }
        if (fixed === 'right') {
            rightList.push(item);
            return;
        }
        list.push(item);
    });

    const showRight = rightList && rightList.length > 0;
    const showLeft = leftList && leftList.length > 0;
    return (
        <div
            className={classNames(`${className}-list`, {
                [`${className}-list-group`]: showRight || showLeft,
            })}
        >
            <div className={styles.title}>{title}</div>
            <CheckboxList
                title="固定在左侧"
                list={leftList}
                draggable={draggable}
                checkable={checkable}
                id={id}
                showListItemOption={showListItemOption}
                className={className}
                listHeight={listsHeight}
            />
            {/* 如果没有任何固定，不需要显示title */}
            <CheckboxList
                list={list}
                draggable={draggable}
                checkable={checkable}
                showListItemOption={showListItemOption}
                title="不固定"
                showTitle={showLeft || showRight}
                className={className}
                listHeight={listsHeight}
                id={id}
            />
            <CheckboxList
                title="固定在右侧"
                list={rightList}
                draggable={draggable}
                checkable={checkable}
                showListItemOption={showListItemOption}
                className={className}
                listHeight={listsHeight}
                id={id}
            />
        </div>
    );
};

function ColumnSetting<T>(props: ColumnSettingProps<T>) {
    const counter = useContext(TableContext);

    const { checkedReset = true } = props;
    const { allColumnsData, columnsMap, setColumnsMap, onChange, defaultColumnsMap } = counter;

    /**
     * 设置全部选中，或全部未选中
     *
     * @param show
     */
    const setAllSelectAction = useRefFunction((show: boolean = true) => {
        const columnKeyMap = {};
        const loopColumns = (columns: any) => {
            columns?.forEach((item) => {
                const newColumnState = {};
                Object.keys(item.columnState).forEach((key) => {
                    newColumnState[key] = {
                        ...item.columnState[key],
                        show,
                    };
                });
                columnKeyMap[item.id] = newColumnState;
            });
        };
        loopColumns(allColumnsData);
        setColumnsMap(columnKeyMap);
        onChange(columnKeyMap);
    });

    /** 全选和反选 */
    const checkedAll = useRefFunction((e: CheckboxChangeEvent) => {
        setAllSelectAction(e.target.checked);
    });

    /** 重置项目 */
    const clearClick = () => {
        setColumnsMap(defaultColumnsMap);
        onChange(defaultColumnsMap);
    };

    const { getPrefixCls } = useContext<any>(ConfigProvider.ConfigContext);
    const className = getPrefixCls('pro-table-column-setting');

    // 获取选中项目长度和所有数据长度
    const getLen = () => {
        let allLen = 0;
        let selectLen = 0;

        if (columnsMap) {
            Object.keys(columnsMap).forEach((key) => {
                allLen += Object.keys(columnsMap[key]).length;
                Object.keys(columnsMap[key]).forEach((key2) => {
                    if (columnsMap[key][key2].show) {
                        selectLen += 1;
                    }
                });
            });
        }
        return { allLen, selectLen };
    };

    const { allLen, selectLen } = getLen();

    return (
        <Popover
            title={
                <div className={`${className}-title`.trim()}>
                    {props.checkable === false ? (
                        <div />
                    ) : (
                        <Checkbox indeterminate={selectLen > 0 && allLen !== selectLen} checked={allLen === selectLen} onChange={checkedAll}>
                            列展示
                        </Checkbox>
                    )}
                    {checkedReset ? (
                        <a onClick={clearClick} className={`${className}-action-rest-button`.trim()}>
                            重置
                        </a>
                    ) : null}
                    {props?.extra ? (
                        <Space size={12} align="center">
                            {props.extra}
                        </Space>
                    ) : null}
                </div>
            }
            overlayClassName={`${className}-overlay`.trim()}
            trigger="click"
            placement="bottomRight"
            content={allColumnsData?.map((item) => (
                <GroupCheckboxList
                    checkable={props.checkable ?? true}
                    draggable={props.draggable ?? true}
                    showListItemOption={props.showListItemOption ?? true}
                    className={className}
                    listsHeight={props.listsHeight}
                    itemData={item}
                    key={item.id}
                />
            ))}
        >
            {props.children || <Tooltip title="列设置">{props.settingIcon ?? <Icon type="SettingOutlined" />}</Tooltip>}
        </Popover>
    );
}

const ProvideBox = (props) => {
    const { defaultColumnsMap, allColumnsData, onChange } = props;
    return (
        <Container
            initValue={{
                defaultColumnsMap,
                allColumnsData,
                onChange,
            }}
        >
            <ColumnSetting {...props} />
        </Container>
    );
};

export default memo(ProvideBox);
