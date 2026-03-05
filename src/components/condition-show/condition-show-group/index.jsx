/* eslint-disable @typescript-eslint/no-shadow */
import React, { Fragment, PureComponent } from 'react';
import { Tooltip, Icon } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { RightAngleLogicLine } from '@Components/line';
import HighLightWords from 'react-highlight-words';
import GroupModal from '../group-modal';
import produce from 'immer';
import themeConfig from '../theme';

export default class index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            lines: [],
            conditionItem: null,
            groupDetailModal: false
        };
    }
    componentDidMount() {
        this.setState({
            lines: this.strokeLine()
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({
                lines: this.strokeLine()
            });
        }
    }

    getOprationListByFieldName = (fieldName) => {
        const { availableConditions } = this.props;
        return _.find(availableConditions, { fieldName })?.conditionCompareTypeList || [];
    };
    // 画线
    strokeLine() {
        const { data, groupIndex, theme } = this.props;
        const lines = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.children.length; i++) {
            lines.push(
                <RightAngleLogicLine
                    key={i}
                    lineColor={themeConfig.lines[theme]}
                    from={`#group-${groupIndex}-logic`}
                    to={`#group-${groupIndex}-condition-${i}`}
                    fromAnchor="right"
                    toAnchor="left"
                    orientation="h"
                    lineWidth={1}
                    within={`#conditions-${groupIndex}-wrapper`}
                />
            );
        }
        return lines;
    }

    /**
     * @description: 条件值点击
     * @param {*} condition 条件对象
     * @param {*} value 条件值对象
     * @return {*}
     */

    onGroupDetailClick = (condition, value) => {
        if (condition.compareType !== 'groupSelect') {
            return;
        }
        this.setState({
            groupDetailModal: true,
            choosedGroup: {
                groupId: value.key,
                groupType: condition.groupType
            }
        });
    };

    /**
     * @description: 关闭弹窗
     * @param {*}
     * @return {*}
     */

    onCloseModal = () => {
        this.setState({
            groupDetailModal: false,
            choosedGroup: null
        });
    };

    /**
     * @description: 单个条件的展开折叠
     * @param {*}
     * @return {*}
     */

    onConditionExpandChange = (groupItem, groupIndex, conditionItem, conditionIndex, isExpend) => {
        const nextData = produce(groupItem, (draft) => {
            const newConditionItem = {
                ...conditionItem,
                isExpend: !isExpend
            };
            draft.children.splice(conditionIndex, 1, newConditionItem);
        });
        this.props.onDataChange(groupIndex, nextData);
    };

    render() {
        const { choosedGroup, groupDetailModal } = this.state;
        const { data, groupIndex, logicalTypeEnum, searchWords, theme } = this.props;
        return (
            <div className="condition-group" id={`group-${groupIndex}`}>
                {data.children.length > 1 && (
                    <section id={`group-${groupIndex}-logic`} className="conditions-show-logic">
                        {logicalTypeEnum[data.logicalType]}
                    </section>
                )}
                <div id={`conditions-${groupIndex}-wrapper`} className={`conditions-wrapper${data.children.length > 1 ? ' has-logic' : ''}`}>
                    {data.children.map((item, index) => {
                        return (
                            <Fragment key={`group-${groupIndex}-condition-${index}`}>
                                <div className="condition-wrapper" id={`group-${groupIndex}-condition-${index}`}>
                                    <>
                                        <span className={`condition-label condition-label-${theme}`}>
                                            <Tooltip
                                                title={`${item.label}【${
                                                    _.find(this.getOprationListByFieldName(item.name), { name: item.compareType })?.label
                                                }】`}
                                            >
                                                <HighLightWords
                                                    searchWords={[searchWords]}
                                                    textToHighlight={item.label}
                                                    highlightStyle={{
                                                        background: themeConfig.searchText[theme]
                                                    }}
                                                />
                                            </Tooltip>
                                            <span>【{_.find(this.getOprationListByFieldName(item.name), { name: item.compareType })?.label}】</span>
                                        </span>
                                        <span className="condition-value-expand">
                                            <Icon
                                                type={item.isExpend ? 'MinusCircleOutlined' : 'PlusCircleOutlined'}
                                                antdIcon
                                                onClick={this.onConditionExpandChange.bind(this, data, groupIndex, item, index, item.isExpend)}
                                            />
                                        </span>
                                        {item.isExpend && (
                                            <div className={`condition-operator-value condition-operator-value-${theme}`}>
                                                {item.compareType === 'is_null' || item.compareType === 'not_null' ? (
                                                    <div className="condition-operator-value-item-container">
                                                        <HighLightWords
                                                            searchWords={[searchWords]}
                                                            textToHighlight={
                                                                // eslint-disable-next-line no-nested-ternary
                                                                item.compareType === 'is_null' ? '空' : '非空'
                                                            }
                                                            className="condition-operator-value-item"
                                                            highlightStyle={{
                                                                background: themeConfig.searchText[theme]
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    item.valueList.map((val) => {
                                                        return (
                                                            <div key={val.key} className="condition-operator-value-item-container">
                                                                <HighLightWords
                                                                    searchWords={[searchWords]}
                                                                    textToHighlight={val?.value?.toString()}
                                                                    className={
                                                                        item.compareType === 'groupSelect'
                                                                            ? 'condition-operator-value-item group-value'
                                                                            : 'condition-operator-value-item'
                                                                    }
                                                                    onClick={this.onGroupDetailClick.bind(this, item, val)}
                                                                    highlightStyle={{
                                                                        background: themeConfig.searchText[theme]
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        )}
                                    </>
                                </div>
                            </Fragment>
                        );
                    })}
                    {data.children.length > 1 && this.state.lines}
                </div>
                {groupDetailModal && <GroupModal choosedGroup={choosedGroup} onCloseModal={this.onCloseModal} />}
            </div>
        );
    }
}
