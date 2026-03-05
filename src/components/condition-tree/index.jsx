import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Tree, Button, Input } from 'oss-ui';
import Enums from '@Src/common/enum';
import { FILTER_EMUN } from '@Src/pages/setting/filter/index';
import { _ } from 'oss-web-toolkits';
import usesEelectModel from '../condition-modal/hox/hox.js';
import _orderBy from 'lodash/orderBy';
import './index.less';

const defaultData = [];

export default React.forwardRef((props, ref) => {
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [conditionTreeData, setConditionTreeData] = useState([]);

    const [searchValue, setSearchValue] = useState('');
    const [isExpend, setIsExpend] = useState(false);

    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const selectInfo = usesEelectModel();
    const selectData = selectInfo.leftCheckedData.valueSize;

    const dataList = useRef([]);
    const allKeys = useRef([]);

    const generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { key } = node;
            dataList.current.push({
                key,
                title: node.title,
            });

            if (node.children) {
                generateList(node.children);
            }
        }
    };

    // 将条件格式化为tree组件数据
    const formatTreeData = useCallback(
        (data) => {
            const conditionTreeData = [];
            const expandedKeys = [];
            // debugger;
            data.forEach((itemCond, indexCond) => {
                expandedKeys.push(`${indexCond}`);

                const conditionItem = {
                    key: `${indexCond}`,
                    title: `${itemCond.conditionLabel}${itemCond.reverse === FILTER_EMUN.REVERSE.TRUE ? '[取反]' : ''}`,
                    value: itemCond,
                    children: [],
                };
                const conditionItemList = [...itemCond.conditionExpr.conditionItemList];

                const uniqConditionItemList = _.uniqBy(conditionItemList, `fieldName`);

                const repeatConditions = [];
                /** *
                 * 条件组中，存在重复条件,找出重复条件，另做处理
                 */
                if (!(conditionItemList.length === uniqConditionItemList.length)) {
                    const newConditionItemList = [...conditionItemList];

                    //
                    conditionItemList.forEach((itemIn) => {
                        const arr = _.filter(newConditionItemList, (o) => o.fieldName === itemIn.fieldName);
                        if (arr.length > 1) {
                            // 将重复条件从原始集合中移除
                            _.remove(newConditionItemList, (o) => o.fieldName === itemIn.fieldName);

                            // 将重复的条件存储
                            repeatConditions.push({ key: itemIn.fieldName, value: arr });
                        }
                    });
                }

                uniqConditionItemList.forEach((itemIn, indexIn) => {
                    const strType = itemIn?.fieldName === 'locate_info' ? '|' : ',';
                    expandedKeys.push(`${indexCond}-${indexIn}`);

                    const conditionChild = {
                        key: `${indexCond}-${indexIn}`,
                        title: `${itemIn.fieldLabel}${itemIn.reverse === FILTER_EMUN.REVERSE.TRUE ? '[取反]' : ''}`,
                        children: [],
                    };

                    const repeatCondition = _.find(repeatConditions, (o) => o.key === itemIn.fieldName);
                    if (repeatCondition && Object.keys(repeatCondition).length > 0) {
                        const repeatarr = _.map(repeatCondition.value, (item) => {
                            if (item.compareType === 'between') {
                                return `[介于${item.valueList[0].value}-${item.valueList[1].value}之间]`;
                            }
                            const valuestr = _.map(item.valueList, (item) => item.value);
                            // console.log(Enums.numberOperator);
                            const operatorText = Enums.numberOperator.getName(item.compareType);
                            return `[${operatorText}${_.join(valuestr, strType)}]`;
                        });

                        conditionChild.children.push({
                            title: repeatarr.length === 1 ? repeatarr[0] : `${_.join(repeatarr, '或')}`,
                            key: `${indexCond}-${indexIn}-0`,
                        });
                    } else if (itemIn.valueList && itemIn.valueList.length > 0) {
                        // if(itemIn.dataType === 'string' && Number(selectData) ===1){
                        //      // 普通条件
                        //      itemIn.valueList.forEach((itemChild, indexChild) => {
                        //         conditionChild.children.push({
                        //             title: `${itemChild.value}`,
                        //             key: `${indexCond}-${indexIn}-${indexChild}-${itemChild.key}`,
                        //         });
                        //     });
                        // }
                        // debugger;
                        if (itemIn.dataType === 'string') {
                            let children = {};
                            if (itemIn.compareType === FILTER_EMUN.COMPARETYPE.ISNULL || itemIn.compareType === FILTER_EMUN.COMPARETYPE.NOTNULL) {
                                children = {
                                    title: Enums.strOperator.getName(itemIn.compareType),
                                    key: `${indexCond}-${indexIn}-0`,
                                };
                            } else {
                                // 字符类型，仅高级条件
                                const str = itemIn.valueList.map((item) => item.value);
                                children = {
                                    title: `${_.join(str, strType)}`,
                                    key: `${indexCond}-${indexIn}-0`,
                                };
                            }
                            conditionChild.children.push(children);
                        } else if (itemIn.dataType === 'date' || itemIn.dataType === 'time') {
                            // 时间类型, 仅高级条件
                            const date = itemIn.valueList.map((item) => item.value);
                            conditionChild.children.push({
                                title: `${_.join(date, '-')}`,
                                key: `${indexCond}-${indexIn}-0`,
                            });
                        } else if (itemIn.dataType === 'integer' || itemIn.dataType === 'long' || itemIn.dataType === 'double') {
                            // 普通条件
                            let newVal = itemIn?.valueList || [];
                            if (itemIn.compareType !== FILTER_EMUN.COMPARETYPE.ISNULL && itemIn.compareType !== FILTER_EMUN.COMPARETYPE.NOTNULL) {
                                newVal = itemIn.valueList.filter((item) => item.key !== 'NULL' && item.value !== 'NULL');
                            }
                            newVal?.forEach((itemChild, indexChild) => {
                                let children = {};
                                if (itemIn.compareType === FILTER_EMUN.COMPARETYPE.ISNULL || itemIn.compareType === FILTER_EMUN.COMPARETYPE.NOTNULL) {
                                    children = {
                                        title: Enums.strOperator.getName(itemIn.compareType),
                                        key: `${indexCond}-${indexIn}-0`,
                                    };
                                } else {
                                    children = {
                                        title: `${itemChild.value}`,
                                        key: `${indexCond}-${indexIn}-${indexChild}-${itemChild.key}`,
                                    };
                                }
                                conditionChild.children.push(children);
                            });
                        }
                    }

                    conditionItem.children.push(conditionChild);
                });

                conditionTreeData.push(conditionItem);
            });

            allKeys.current = expandedKeys;
            return {
                conditionTreeData,
                expandedKeys,
            };
        },
        [selectData],
    );

    const getParentKey = (key, tree) => {
        let parentKey;

        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];

            if (node.children) {
                if (node.children.some((item) => item.key === key)) {
                    parentKey = node.key;
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }

        return parentKey;
    };

    const onExpand = (expandedKeys, { expanded, node }) => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    useEffect(() => {
        // debugger;
        if (props.data && Object.keys(props.data).length > 0) {
            // 展示/编辑
            const { conditionTreeData, expandedKeys } = formatTreeData(props.data);
            // setExpandedKeys(expandedKeys);
            setConditionTreeData(conditionTreeData);

            generateList(conditionTreeData);
        } else {
            // 删除操作
            setExpandedKeys([]);
            setConditionTreeData([]);
        }
    }, [formatTreeData, props.data]);

    useEffect(() => {
        // debugger;
        if (isExpend) {
            setExpandedKeys(allKeys.current);
        } else {
            setExpandedKeys([]);
        }
    }, [isExpend]);

    const onChange = (e) => {
        const { value } = e.target;
        const newExpandedKeys = dataList.current
            .map((item) => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, conditionTreeData);
                }

                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        setExpandedKeys(newExpandedKeys);
        setSearchValue(value);
        setAutoExpandParent(true);
    };

    const treeData = useMemo(() => {
        const loop = (data, flag) =>
            // const newData = searchValue ? data.sort((param1, param2) => param1.localeCompare(param2)) : data;
            // console.log(newData);
            data.map((item) => {
                const strTitle = item.title;
                const index = strTitle.indexOf(searchValue);
                const beforeStr = strTitle.substring(0, index);
                const afterStr = strTitle.slice(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span className="site-tree-search-value">{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{strTitle}</span>
                    );

                if (item.children) {
                    const newData = item.children.sort((param1, param2) => param1.title.localeCompare(param2.title));
                    return {
                        title,
                        key: item.key,
                        children: loop(newData),
                        selectable: flag,
                    };
                }

                return {
                    title,
                    key: item.key,
                    selectable: flag,
                };
            });
        const newData = conditionTreeData.sort((param1, param2) => param1.title.localeCompare(param2.title));

        return loop(newData, true);
    }, [searchValue, conditionTreeData]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    onClick={() => {
                        setIsExpend(!isExpend);
                    }}
                >
                    {isExpend ? '一键折叠' : '一键展开'}
                </Button>
                <Input.Search
                    style={{
                        marginBottom: 8,
                        width: 240,
                    }}
                    placeholder=""
                    onChange={onChange}
                    allowClear
                />
            </div>
            <Tree
                showLine={{ showLeafIcon: false }}
                ref={ref}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                treeData={treeData}
                selectedKeys={[props.selectedKey]}
                onSelect={props.onSelect}
            />
        </div>
    );
});
