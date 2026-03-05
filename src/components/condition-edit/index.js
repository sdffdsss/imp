import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { Button, Space, Card, Modal, Icon } from 'oss-ui';
import ConditionTree from '@Components/condition-tree';
import ConditionModal from '../condition-modal';
import CopyFilterModal from '@Components/copy-filter-modal';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';

const ConditionEdit = (props, ref) => {
    const {
        treeHeight,
        treeData,
        FILTER_EMUN,
        onChange,
        moduleId,
        disabled,
        disabledFields,
        isCheck,
        data,
        hasDefaultValue,
        // userInfo,
        defaultFilterConditionList,
        topFieldNames,
        hideReverse,
    } = props;
    const { userInfo, container } = useLoginInfoModel();
    const [selectedKey, setSelectedKey] = useState('');
    const [conditionVisible, setConditionVisible] = useState(false);
    const [isCreateCondition, setCreateCondition] = useState(false);
    const [filterShow, setFilterShow] = useState(false);
    const [editingConditionInfo, setEditingConditionInfo] = useState({});

    const editConditionClick = (type) => {
        if (type === 'new') {
            setCreateCondition(true);
            setConditionVisible(true);
            setEditingConditionInfo({
                conditionLabel: `新建条件${treeData && _.isArray(treeData) ? treeData.length + 1 : 1}`,
                reverse: FILTER_EMUN.REVERSE.FALSE,
                conditionExpr: {
                    conditionItemList: defaultFilterConditionList || [],
                },
            });
        } else {
            setCreateCondition(false);
            setConditionVisible(true);
            setEditingConditionInfo(treeData[selectedKey]);
        }
    };

    const onDeleteCondition = () => {
        Modal.confirm({
            title: '',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: '是否确认删除该条件？',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                const newTreeData = _.cloneDeep(treeData);
                let newLogicalType = null;
                _.remove(newTreeData, (item, index) => index === Number(selectedKey));
                if (newTreeData.length > 1) {
                    newLogicalType = 'or';
                }
                setSelectedKey('');

                onChange(newTreeData, newLogicalType);
            },
            onCancel() {},
        });
    };
    const clearTreeData = () => {
        const newTreeData = _.cloneDeep(treeData);
        let newLogicalType = null;
        if (newTreeData.length > 1) {
            newLogicalType = 'or';
        }
        setSelectedKey('');

        onChange([], newLogicalType);
    };

    const onConditionConfirm = (name, isNegative, result) => {
        const newTreeData = treeData && treeData.length > 0 ? _.cloneDeep(treeData) : [];
        let newLogicalType = null;

        if (isCreateCondition) {
            const newcondition = [];
            _.isArray(result) &&
                result.forEach((item) => {
                    newcondition.push(item);
                });

            newTreeData.push({
                reverse: Number(isNegative) === FILTER_EMUN.REVERSE.TRUE ? FILTER_EMUN.REVERSE.TRUE : FILTER_EMUN.REVERSE.FALSE,
                conditionLabel: name,
                conditionExpr: {
                    conditionItemList: newcondition,
                    logicalType: newcondition.length > 1 ? 'and' : null,
                },
            });
        } else {
            newTreeData[selectedKey].reverse = Number(isNegative) === FILTER_EMUN.REVERSE.TRUE ? FILTER_EMUN.REVERSE.TRUE : FILTER_EMUN.REVERSE.FALSE;
            newTreeData[selectedKey].conditionLabel = name;
            newTreeData[selectedKey].conditionExpr = {
                conditionItemList: result,
                logicalType: _.isArray(result) && result.length > 1 ? 'and' : null,
            };
        }
        if (newTreeData.length > 1) {
            newLogicalType = 'or';
        }

        onChange(newTreeData, newLogicalType);
    };

    const handleVisibleChange = (visible) => setConditionVisible(visible);

    const onSelect = (keys, e) => {
        setSelectedKey(e.node.selectable ? keys[0] : '');
    };

    const onCopyFilter = () => {
        setFilterShow(true);
    };

    const onCopyFilterClose = () => {
        setFilterShow(false);
    };

    const labelCheck = (nextTreeData, conditionLabel, i) => {
        if (i === 0) {
            if (_.find(nextTreeData, { conditionLabel: conditionLabel })) {
                return labelCheck(nextTreeData, conditionLabel, i + 1);
            } else {
                return '';
            }
        } else {
            if (_.find(nextTreeData, { conditionLabel: `${conditionLabel}(${i})` })) {
                return labelCheck(nextTreeData, conditionLabel, i + 1);
            } else {
                return `(${i})`;
            }
        }
    };

    const conditionExprChange = (data) => {
        let newLogicalType = null;
        let nextTreeData = [...treeData];
        data.map((item) => {
            let i = labelCheck(nextTreeData, item.conditionLabel, 0);
            nextTreeData.push({ conditionExpr: item.conditionExpr, conditionLabel: `${item.conditionLabel}${i}`, reverse: item.reverse });
        });
        if (nextTreeData.length > 1) {
            newLogicalType = 'or';
        }
        onChange(nextTreeData, newLogicalType);
    };
    useImperativeHandle(ref, () => {
        return {
            clearTreeData,
        };
    });
    return (
        <Space style={{ width: '100%' }} className="condition-vertical-space-wrapper" direction="vertical">
            <Space wrap>
                <Button disabled={disabled || isCheck} type="primary" onClick={() => editConditionClick('new')}>
                    新建
                </Button>
                <Button disabled={disabled || !selectedKey || isCheck} onClick={() => editConditionClick('edit')}>
                    编辑
                </Button>
                <Button disabled={disabled || !selectedKey || isCheck} onClick={onDeleteCondition}>
                    删除
                </Button>
                {moduleId === 8 && <Button onClick={onCopyFilter}>复制过滤器</Button>}
            </Space>
            <Card borderd="true" bodyStyle={{ padding: '8px', height: treeHeight, overflowY: 'auto' }}>
                <ConditionTree data={treeData} onSelect={onSelect} selectedKey={selectedKey} />
            </Card>

            {conditionVisible && (
                <ConditionModal
                    index={selectedKey || (treeData && _.isArray(treeData) ? treeData.length : 0)}
                    isEdit={!isCreateCondition}
                    conditionData={treeData}
                    conditionInfo={editingConditionInfo}
                    onConfirm={onConditionConfirm}
                    onVisibleChange={handleVisibleChange}
                    visible={conditionVisible}
                    moduleId={moduleId}
                    container={container}
                    FILTER_EMUN={FILTER_EMUN}
                    disabledFields={disabledFields}
                    data={data}
                    hasDefaultValue={hasDefaultValue}
                    login={userInfo}
                    topFieldNames={topFieldNames}
                    hideReverse={hideReverse}
                />
            )}
            {filterShow && <CopyFilterModal onCancel={onCopyFilterClose} conditionExprChange={conditionExprChange} />}
        </Space>
    );
};
export default forwardRef(ConditionEdit);
// export default withModel(useLoginInfoModel, (login) => ({
//     login,
// }))(ConditionEdit);
