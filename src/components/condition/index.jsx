/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Typography, message } from 'oss-ui';
import FilterCondition from './filter-condition';
import DimensionPanel from './dimension-panel';
import { DndProvider } from 'react-dnd-cjs';
import HTML5Backend from 'react-dnd-html5-backend-cjs';
import { _ } from 'oss-web-toolkits';
import produce from 'immer';
import './index.less';

export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: (!_.isEmpty(props.data) && props.data) || {
                logicalType: 'or',
                children: [
                    {
                        logicalType: 'and',
                        children: [],
                        conditionLabel: '新建条件组1',
                        reverse: 2
                    }
                ]
            }
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                data: (!_.isEmpty(this.props.data) && this.props.data) || {
                    logicalType: 'or',
                    children: [
                        {
                            logicalType: 'and',
                            children: [],
                            conditionLabel: '新建条件组1',
                            reverse: 2
                        }
                    ]
                }
            });
        }
    }

    /**
     * @description: 增加条件组
     * @param {*} index 添加的位置
     * @param {*} groupData 复制的条件组数据 若无值 则为新增空条件组
     * @return {*}
     */
    onGroupAdd = (index, groupData) => {
        const { data } = this.state;
        const nullGroup = { logicalType: 'or', children: [], conditionLabel: `新建条件组${index + 2}`, reverse: 2 };
        const nextGroupData = groupData || nullGroup;
        const nextData = produce(data, (draft) => {
            if (draft.children.length === 1 && !draft.logicalType) {
                draft.logicalType = 'or';
            }
            draft.children.splice(index + 1, 0, nextGroupData);
        });

        this.setState({
            data: nextData
        });
    };

    /**
     * @description: 删除条件组
     * @param {*} groupIndex 删除的位置下标
     * @return {*}
     */
    onGroupDelete = (groupIndex) => {
        const { data } = this.state;
        const nullGroup = { logicalType: 'or', children: [], conditionLabel: `新建条件组1`, reverse: 2 };
        // 当删除的条件组只剩下一个的时候 将默认逻辑值设置成与
        const nextData = produce(data, (draft) => {
            if (draft.children.length === 2) {
                draft.logicalType = 'or';
            }
            if (draft.children.length === 1) {
                draft.children.splice(groupIndex, 1, nullGroup);
            } else {
                draft.children.splice(groupIndex, 1);
            }
        });
        this.setState({
            data: nextData
        });
    };

    /**
     * @description: 条件组中条件改变（删除重新插入）
     * @param {*} groupIndex 改变条件组的下标
     * @param {*} groupItem 改变条件组
     * @return {*}
     */
    onGroupChange(groupIndex, groupItem) {
        const { data } = this.state;

        this.setState({
            data: produce(data, (draft) => {
                draft.children.splice(groupIndex, 1, groupItem);
            })
        });
    }

    /**
     * @description: 总条件的逻辑改变
     * @param {*} value 逻辑值 'and' 'or'
     * @return {*}
     */
    onAllCondLogicChange(value) {
        const { data } = this.state;

        this.setState({
            data: produce(data, (draft) => {
                draft.logicalType = value;
            })
        });
    }

    /**
     * @description: 校验数据
     * @param {*}
     * @return {*}
     */

    validateFields = () => {
        const { data } = this.state;
        return new Promise((resolve, reject) => {
            if (data.children.length === 0) {
                message.error('筛选条件必须至少包含一个条件组');
                reject(new Error('报错'));
                return;
            }

            if (data.children.some((item) => item.length === 0)) {
                message.error('条件组中必须至少包含一条过滤条件');
                reject(new Error('报错'));
                return;
            }

            if (data.children.some((item) => !item.conditionLabel)) {
                message.error('条件组名称不能为空');
                reject(new Error('报错'));
                return;
            }

            if (_.unionBy(data.children, 'conditionLabel').length !== data.children.length) {
                message.error('条件组名称不能重复');
                reject(new Error('报错'));
                return;
            }

            if (data.children.some((item) => item.children.length === 0)) {
                message.error('条件组中最少包含一条条件');
                reject(new Error('报错'));
                return;
            }

            if (data.children.some((item) => item.children.some((conditionItem) => _.isEmpty(conditionItem)))) {
                message.error('条件不可为空,请从过滤条件中添加条件');
                reject(new Error('报错'));
                return;
            }

            if (data.children.some((item) => item.children.some((conditionItem) => !conditionItem.compareType))) {
                message.error('条件逻辑操作不能为空');
                reject(new Error('报错'));
                return;
            }

            if (
                data.children.some((item) =>
                    item.children.some((conditionItem) => {
                        if (conditionItem.compareType !== 'is_null' && conditionItem.compareType !== 'not_null') {
                            return Array.isArray(conditionItem.value) && conditionItem.value.length === 0;
                        }
                        return false;
                    })
                )
            ) {
                message.error('条件值不能为空');
                reject(new Error('报错'));
                return;
            }

            if (
                data.children.some((item) =>
                    item.children.some((conditionItem) => {
                        if (conditionItem.compareType === 'between') {
                            return conditionItem.value[0] >= conditionItem.value[1];
                        }
                        return false;
                    })
                )
            ) {
                message.error('条件组中有数值范围设置有误，介于前后值相等');
                reject(new Error('报错'));
                return;
            }
            resolve(data);
        });
    };

    onSearch = (value) => {
        if (this.props.onSearch) {
            this.props.onSearch(value);
        }
    };

    render() {
        const { data } = this.state;
        const { availableConditions, groupList, disabledGroupLogicType, accordionActiveKey, heightCustomSet } = this.props;
        return (
            <DndProvider backend={HTML5Backend}>
                <div className="condition-edit-wrapper">
                    <div className="condition-main-content">
                        <Typography.Title level={4} style={{ fontSize: '14px' }}>
                            编辑条件
                        </Typography.Title>
                        <FilterCondition
                            availableConditions={availableConditions}
                            data={data}
                            onAllCondLogicChange={this.onAllCondLogicChange.bind(this)}
                            onChange={this.onGroupChange.bind(this)}
                            onGroupAdd={this.onGroupAdd}
                            onGroupDelete={this.onGroupDelete}
                            disabledGroupLogicType={disabledGroupLogicType}
                        />
                    </div>
                    <div className="condition-right-content">
                        <DimensionPanel
                            data={availableConditions}
                            groupList={groupList}
                            onSearch={this.onSearch}
                            accordionActiveKey={accordionActiveKey}
                            heightCustomSet={heightCustomSet}
                        />
                    </div>
                </div>
            </DndProvider>
        );
    }
}
