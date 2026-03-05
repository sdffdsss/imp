/* eslint-disable no-param-reassign */
import React from 'react';
import { RightAngleLogicLine } from '@Components/line';
import { Icon, Tooltip, Button, Space, Input, message, Modal } from 'oss-ui';
import ConditionGroup from './condition-show-group';
import ConditionWrapper from '@Components/condition-wrapper';
import produce from 'immer';
import HighLightWords from 'react-highlight-words';
import ConditionEditComp from './edit';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import themeConfig from './theme';
import './index.less';

class Default extends React.PureComponent {
    state = {
        conditionList: {},
        lines: [],
        searchWords: '',
        conditionEditShow: false,
        editConditionInfo: {
            data: null,
            index: -1
        }
    };

    logicalTypeEnum = {
        and: '与',
        or: '或'
    };

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            const conditionData =
                Array.isArray(this.props.data?.children) &&
                this.props.data.children.map((item) => {
                    const conditionArr =
                        Array.isArray(item.children) &&
                        item.children.map((condition) => {
                            return {
                                ...condition,
                                isExpend: false
                            };
                        });
                    return {
                        ...item,
                        children: conditionArr || [],
                        isExpend: false
                    };
                });
            const conditionList = {
                logicalType: this.props.data.logicalType || 'or',
                children: conditionData
            };
            this.drawLineByCondition(conditionList);
            this.setState({
                searchWords: ''
            });
        }
    }

    // 根据条件组画线
    drawLineByCondition = (conditionList) => {
        this.setState(
            {
                conditionList
            },
            () => {
                this.setState({
                    lines: this.strokeLine()
                });
            }
        );
    };

    // 画线
    strokeLine() {
        const { conditionList } = this.state;
        const { login } = this.props;
        const theme = login?.systemInfo?.theme || 'light';
        const lines = [];

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < (conditionList.children && conditionList.children.length); i++) {
            lines.push(
                <RightAngleLogicLine
                    key={i}
                    lineColor={themeConfig.lines[theme]}
                    from="#global-logic"
                    to={`#group-${i}`}
                    fromAnchor="right"
                    toAnchor="left"
                    orientation="h"
                    lineWidth={1}
                    within=".filter-wrapper"
                />
            );
        }

        return lines;
    }

    // 显示
    toggleConditionGroupShow = (index) => {
        const { conditionList } = this.state;
        const nextData = produce(conditionList, (draft) => {
            draft.children[index].isExpend = !draft.children[index].isExpend;
        });
        this.drawLineByCondition(nextData);
    };

    /**
     * @description: 一键折叠展开
     * @param {*}
     * @return {*}
     */

    onToggleExpand = (allExpand) => {
        const { conditionList } = this.state;
        const nextData = produce(conditionList, (draft) => {
            draft.children.forEach((group) => {
                group.isExpend = !allExpand;
                group.children.forEach((item) => {
                    item.isExpend = !allExpand;
                });
            });
        });
        this.setState(
            {
                conditionList: nextData
            },
            () => {
                this.setState({
                    lines: this.strokeLine()
                });
            }
        );
    };

    /**
     * @description: 条件搜索
     * @param {*}
     * @return {*}
     */

    onConditionSearch = (value) => {
        const { conditionList } = this.state;
        const nextData = produce(conditionList, (draft) => {
            draft.children.forEach((group) => {
                if (group.conditionLabel.includes(value) && value !== '') {
                    group.isExpend = true;
                } else {
                    group.isExpend = false;
                }
                group.children.forEach((item) => {
                    if (
                        (item.fieldLabel.includes(value) ||
                            item.valueList
                                .map((val) => val.value)
                                .join(',')
                                .includes(value)) &&
                        value !== ''
                    ) {
                        item.isExpend = true;
                        group.isExpend = true;
                    } else {
                        item.isExpend = false;
                    }
                });
            });
        });
        this.drawLineByCondition(nextData);
        this.setState({
            searchWords: value
        });
    };

    /**
     * @description: 监听数据变化
     * @param {*}
     * @return {*}
     */

    onDataChange = (groupIndex, newData) => {
        const { conditionList } = this.state;
        const nextData = produce(conditionList, (draft) => {
            draft.children.splice(groupIndex, 1, newData);
        });
        this.setState(
            {
                conditionList: nextData
            },
            () => {
                this.setState({
                    lines: this.strokeLine()
                });
            }
        );
    };

    /**
     * @description: 新增条件组
     * @param {*}
     * @return {*}
     */

    onAddNewConditionGroup = () => {
        const { conditionList } = this.state;
        this.setState({
            conditionEditShow: true,
            editConditionInfo: {
                data: {
                    logicalType: conditionList.logicalType || 'or',
                    children: [
                        {
                            logicalType: 'and',
                            children: [],
                            conditionLabel: '新建条件组1',
                            reverse: 2
                        }
                    ]
                },
                index: -1
            }
        });
    };

    /**
     * @description: 编辑条件组
     * @param {*}
     * @return {*}
     */

    onEditConditionGroup = () => {
        const { conditionList, editConditionInfo } = this.state;
        if (editConditionInfo.index === -1) {
            message.error('未选择编辑的条件组');
            return;
        }
        this.setState({
            conditionEditShow: true,
            editConditionInfo: {
                data: {
                    logicalType: conditionList.logicalType || 'or',
                    children: [editConditionInfo.data]
                },
                index: editConditionInfo.index
            }
        });
    };

    /**
     * @description: 删除条件组
     * @param {*}
     * @return {*}
     */

    onDeleteConditionGroup = () => {
        const { editConditionInfo, conditionList } = this.state;
        if (editConditionInfo.index === -1) {
            message.error('未选择删除的条件组');
            return;
        }
        if (conditionList.children.length === 1) {
            message.error('最少存在一个条件组');
            return;
        }
        Modal.confirm({
            title: '提示',
            content: '是否确认删除此条件组？',
            onOk: () => {
                const nextData = produce(conditionList, (draft) => {
                    draft.children.splice(editConditionInfo.index, 1);
                });
                this.props.onDataChange(nextData);
                // 重置选中状态
                this.setState({
                    editConditionInfo: {
                        index: -1,
                        data: null
                    }
                });
            },
            onCancel() {}
        });
    };

    /**
     * @description: 关闭条件组
     * @param {*}
     * @return {*}
     */

    onCloseEditModal = () => {
        this.setState({
            conditionEditShow: false,
            editConditionInfo: {
                index: -1,
                data: null
            }
        });
    };

    /**
     * @description: 数据变化
     * @param {*}
     * @return {*}
     */

    onConditionDataChange = (result) => {
        try {
            const { editConditionInfo, conditionList } = this.state;
            const nextData = produce(conditionList, (draft) => {
                if (editConditionInfo.index === -1) {
                    draft.children.push(...result.children);
                } else {
                    draft.children.splice(editConditionInfo.index, 1, ...result.children);
                }
            });
            this.props.onDataChange(nextData);
            this.onCloseEditModal();
        } catch (e) {
            message.error(e.message);
        }
    };

    /**
     * @description: 选择条件组
     * @param {*}
     * @return {*}
     */

    chooseConditionGroup = (groupItem, groupIndex) => {
        this.setState({
            editConditionInfo: {
                index: groupIndex,
                data: groupItem
            }
        });
    };

    /**
     * @description: 获取折叠展开状态
     * @param {*}
     * @return {*}
     */
    getAllExpandList = () => {
        const { conditionList } = this.state;
        return (
            Array.isArray(conditionList?.children) &&
            conditionList?.children.reduce((result, group) => {
                if (result) {
                    result =
                        (group.isExpend && !Array.isArray(group.children)) ||
                        (group.isExpend && Array.isArray(group.children) && group.children.every((child) => child.isExpend));
                }
                return result;
            }, true)
        );
    };

    render() {
        const { conditionList, searchWords, conditionEditShow, editConditionInfo } = this.state;
        const { availableConditions, moduleId, login, showOpreationBtn } = this.props;
        const theme = login?.systemInfo?.theme || 'light';
        const allExpand = this.getAllExpandList();
        return (
            <div className="condition-show-container">
                {Array.isArray(conditionList.children) && conditionList.children.length > 0 && (
                    <div className="opreation-btn-group">
                        <Space className="all-expand-button">
                            <Button onClick={this.onToggleExpand.bind(this, allExpand)}>
                                <Icon type={allExpand ? 'iconyijianzhedie' : 'iconyijianzhankai'} />
                                {allExpand ? '一键折叠' : '一键展开'}
                            </Button>
                            <Input.Search onSearch={this.onConditionSearch} enterButton />
                        </Space>
                        {showOpreationBtn && (
                            <Space>
                                <Button onClick={this.onAddNewConditionGroup}>
                                    <Icon antdIcon type="PlusOutlined" />
                                    新建
                                </Button>
                                <Button onClick={this.onEditConditionGroup}>
                                    <Icon antdIcon type="EditOutlined" />
                                    编辑
                                </Button>
                                <Button onClick={this.onDeleteConditionGroup}>
                                    <Icon antdIcon type="DeleteOutlined" />
                                    删除
                                </Button>
                            </Space>
                        )}
                    </div>
                )}
                <div className={`filter-wrapper${conditionList.children && conditionList.children.length > 1 ? ' has-logic' : ''}`}>
                    <div className="filter-wrapper-inner">
                        {conditionList.children && conditionList.children.length > 1 && (
                            <section id="global-logic" className={`global-logic-${theme}`}>
                                <span>{this.logicalTypeEnum[conditionList.logicalType]}</span>
                            </section>
                        )}
                        {conditionList.children &&
                            conditionList.children.map((groupItem, groupIndex) => {
                                return (
                                    <div className="condition-group-wrapper" id={`group-${groupIndex}`} key={`group-${groupIndex}`}>
                                        <div className="condition-group-wrapper-inner">
                                            <div className="condition-name">
                                                <Tooltip title={groupItem.conditionLabel}>
                                                    <HighLightWords
                                                        className={`condition-name-text ${
                                                            editConditionInfo.index === groupIndex ? 'condition-name-text-active' : ''
                                                        } condition-name-text-${theme}`}
                                                        searchWords={[searchWords]}
                                                        textToHighlight={groupItem.conditionLabel}
                                                        onClick={this.chooseConditionGroup.bind(this, groupItem, groupIndex)}
                                                        highlightStyle={{
                                                            background: themeConfig.searchText[theme]
                                                        }}
                                                    />
                                                </Tooltip>
                                                {groupItem.reverse.toString() === '1' && <span className="condition-reverse">[取反]</span>}
                                                <Icon
                                                    antdIcon
                                                    type={groupItem.isExpend ? 'MinusCircleOutlined' : 'PlusCircleOutlined'}
                                                    className="expand-icon"
                                                    onClick={this.toggleConditionGroupShow.bind(this, groupIndex)}
                                                ></Icon>
                                                {/* <div>是否取反：{groupItem.reverse.toString() === '1' ? '是' : '否'}</div> */}
                                            </div>
                                            {groupItem.isExpend && (
                                                <ConditionGroup
                                                    searchWords={searchWords}
                                                    groupIndex={groupIndex}
                                                    data={groupItem}
                                                    logicalTypeEnum={this.logicalTypeEnum}
                                                    availableConditions={availableConditions}
                                                    onDataChange={this.onDataChange}
                                                    theme={theme}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        {conditionList.children && conditionList.children.length > 1 && this.state.lines}
                        {conditionEditShow && (
                            <ConditionEditComp
                                onCloseEditModal={this.onCloseEditModal}
                                onConditionDataChange={this.onConditionDataChange}
                                editConditionInfo={editConditionInfo}
                                moduleId={moduleId}
                                conditionList={conditionList}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login
}))(ConditionWrapper(Default));
