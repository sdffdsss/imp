/* eslint-disable no-empty */
/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import Logic from './logic';
import { Button, Icon, Form, Input, Row, Col, Divider, Checkbox, Space, Modal, Radio } from 'oss-ui';
import ConditionGroup from './condition-group';
import { message } from 'oss-ui';
import { RightAngleLogicLine } from '../../line';
import produce from 'immer';
import DropZone from './drop-zone';
import { _ } from 'oss-web-toolkits';

export default class index extends PureComponent {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            lines: [],
            modalVisible: false,
            fieldList: [],
            handleGroupIndex: 0,
            choosedFieldName: ''
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

    /**
     * @description: 条件内容变化监听
     * @param {*} groupItem
     * @param {*} groupIndex
     * @param {*} conditionItem
     * @param {*} conditionIndex
     * @return {*}
     */

    onConditionChange(groupItem, groupIndex, conditionItem, conditionIndex) {
        const { onChange } = this.props;
        onChange(
            groupIndex,
            produce(groupItem, (draft) => {
                draft.children.splice(conditionIndex, 1, conditionItem);
            })
        );
    }

    /**
     * @description: 条件组中增加条件
     * @param {*} groupItem 条件组
     * @param {*} groupIndex 条件组下标
     * @param {*} conditionItem 新增的条件
     * @return {*}
     */

    onConditionAdd(groupItem, groupIndex, conditionItem) {
        const { onChange } = this.props;
        // 如果添加前只有一种条件,则添加后为logic设置默认值:与
        const nextData = produce(groupItem, (draft) => {
            if (draft.children.length === 1) {
                draft.logicalType = 'and';
            }
            draft.children.push(conditionItem);
        });
        onChange(groupIndex, nextData);
    }

    /**
     * @description: 条件组中删除条件
     * @param {*} groupItem 条件组
     * @param {*} groupIndex 条件组下标
     * @param {*} conditionItem 新增的条件
     * @return {*}
     */
    onConditionDelete(groupItem, groupIndex, conditionIndex) {
        const { onChange } = this.props;
        onChange(
            groupIndex,
            produce(groupItem, (draft) => {
                draft.children.splice(conditionIndex, 1);
            })
        );
    }

    /**
     * @description: 条件组中逻辑改变
     * @param {*} groupItem
     * @param {*} groupIndex
     * @param {*} value
     * @return {*}
     */

    onGroupLogicChange(groupItem, groupIndex, value) {
        const { onChange } = this.props;

        onChange(
            groupIndex,
            produce(groupItem, (draft) => {
                draft.logicalType = value;
            })
        );
    }

    /**
     * @description: 清空条件组中某个已添加的条件
     * @param {*} groupItem
     * @param {*} groupIndex
     * @param {*} conditionIndex
     * @return {*}
     */

    onConditionValueClear(groupItem, groupIndex, conditionIndex) {
        const { onChange } = this.props;

        onChange(
            groupIndex,
            produce(groupItem, (draft) => {
                draft.children[conditionIndex].value = [];
            })
        );
    }

    // 画线
    strokeLine() {
        const { data } = this.props;
        const lines = [];

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < (data.children && data.children.length); i++) {
            lines.push(
                <RightAngleLogicLine
                    key={i}
                    lineColor="#d9d9d9"
                    from="#edit-global-logic"
                    to={`#edit-group-${i}`}
                    fromAnchor="right"
                    toAnchor="left"
                    orientation="h"
                    lineWidth={1}
                    within=".edit-filter-wrapper"
                />
            );
        }

        return lines;
    }

    /**
     * @description: 设置条件组名称
     * @param {*}
     * @return {*}
     */
    setConditionLabelValue(groupItem, groupIndex, e) {
        const { onChange } = this.props;
        onChange(
            groupIndex,
            produce(groupItem, (draft) => {
                draft.conditionLabel = e.target.value || '';
            })
        );
    }

    /**
     * @description: 设置条件组取反
     * @param {*}
     * @return {*}
     */
    setReverseValue(groupItem, groupIndex, e) {
        const { onChange } = this.props;

        onChange(
            groupIndex,
            produce(groupItem, (draft) => {
                draft.reverse = e.target.checked ? 1 : 2;
            })
        );
    }

    /**
     * @description: 拖动新增操作
     * @param {*} item 拖拽添加过来的条件
     * @param {*} idx 回传来的插入数据的下标
     * @return {*}
     */

    onDrop = async (groupItem, groupIndex, conditionItem) => {
        if (conditionItem.isGroup && Array.isArray(conditionItem.conditionFieldList)) {
            if (conditionItem.conditionFieldList.length === 1) {
                this.setConditionData(groupItem, groupIndex, conditionItem.conditionFieldList[0], true);
            } else {
                this.setState({
                    modalVisible: true,
                    fieldList: conditionItem.conditionFieldList,
                    handleGroupIndex: groupIndex,
                    choosedFieldName: conditionItem.conditionFieldList[0]?.fieldName
                });
            }
        } else {
            this.setConditionData(groupItem, groupIndex, conditionItem, false);
        }
    };

    /**
     * @description: 获取字段数据
     * @param {*}
     * @return {*}
     */

    setConditionData = async (groupItem, groupIndex, conditionItem, isGroup) => {
        if (!conditionItem) {
            message.error('数据错误');
        }
        try {
            const conditionItemObj = {
                ...conditionItem,
                label: conditionItem.fieldLabel,
                name: conditionItem.fieldName,
                compareType: isGroup ? 'groupSelect' : conditionItem.conditionCompareTypeList[0]?.name,
                dataType: conditionItem.dataType || 'string',
                operatorDisabled: isGroup,
                // 默认值
                value: []
            };
            this.onConditionAdd(groupItem, groupIndex, conditionItemObj);
        } catch (e) {}
    };

    /**
     * @description: 删除条件组
     * @param {*}  groupIndex 删除的组
     * @return {*}
     */

    deleteGroup = (groupIndex) => {
        Modal.confirm({
            title: '提示',
            content: '是否确认删除此条件组？',
            onOk: () => {
                this.props.onGroupDelete(groupIndex);
            },
            onCancel() {}
        });
    };

    /**
     * @description: 复制条件组
     * @param {*} groupItem 条件组
     * @return {*}
     */

    copyGroup = (groupIndex, groupItem) => {
        const nextData = produce(groupItem, (draft) => {
            draft.conditionLabel = `复制-${groupItem.conditionLabel}`;
        });
        this.props.onGroupAdd(groupIndex, nextData);
    };

    /**
     * @description: 关闭告警关联字段弹窗
     * @param {*}
     * @return {*}
     */

    onModalClose = () => {
        this.setState({
            modalVisible: false,
            handleGroupIndex: 0
        });
    };

    /**
     * @description: 监听radio框
     * @param {*}
     * @return {*}
     */

    onRadioChange = (e) => {
        this.setState({
            choosedFieldName: e.target.value
        });
    };

    /**
     * @description: 关闭选择弹窗
     * @param {*}
     * @return {*}
     */
    onChoosedField = () => {
        const { data } = this.props;
        const { fieldList, choosedFieldName, handleGroupIndex } = this.state;
        this.setState(
            {
                modalVisible: false
            },
            () => {
                const field = _.find(fieldList, { fieldName: choosedFieldName });
                const isGroup = true;
                this.setConditionData(data.children[handleGroupIndex], handleGroupIndex, field, isGroup);
            }
        );
    };

    render() {
        const { data, onGroupAdd, availableConditions, onAllCondLogicChange, disabledGroupLogicType } = this.props;
        const { modalVisible, fieldList, choosedFieldName } = this.state;
        return (
            <div className={`edit-filter-wrapper${data.children && data.children.length > 1 ? ' has-logic' : ''}`}>
                <div className="filter-wrapper-inner">
                    {data.children && data.children.length > 1 && (
                        <Logic
                            onChange={onAllCondLogicChange}
                            logicalType={data.logicalType}
                            id="edit-global-logic"
                            disabledGroupLogicType={disabledGroupLogicType}
                        />
                    )}
                    {data.children &&
                        data.children.map((groupItem, groupIndex) => {
                            return (
                                <div className="condition-group-wrapper" id={`edit-group-${groupIndex}`} key={`edit-group-${groupIndex}`}>
                                    <div className="condition-group-wrapper-inner">
                                        <Form>
                                            <Form.Item label="条件组名称" style={{ paddingLeft: '15px' }}>
                                                <Row gutter={8} justify="justify-between">
                                                    <Col span={12}>
                                                        <Form.Item noStyle>
                                                            <Input
                                                                value={groupItem.conditionLabel}
                                                                onChange={this.setConditionLabelValue.bind(this, groupItem, groupIndex)}
                                                                maxLength={64}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Form.Item>
                                                            <Checkbox
                                                                checked={groupItem.reverse.toString() === '1'}
                                                                onChange={this.setReverseValue.bind(this, groupItem, groupIndex)}
                                                            >
                                                                取反
                                                            </Checkbox>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Space>
                                                            <Button onClick={this.deleteGroup.bind(this, groupIndex)}>
                                                                <Icon type="DeleteOutlined" antdIcon />
                                                                删除
                                                            </Button>
                                                            <Button onClick={this.copyGroup.bind(this, groupIndex, groupItem)}>
                                                                <Icon type="CopyOutlined" antdIcon />
                                                                复制
                                                            </Button>
                                                        </Space>
                                                    </Col>
                                                </Row>
                                            </Form.Item>
                                        </Form>
                                        <Divider style={{ margin: '6px 0' }} />
                                        <ConditionGroup
                                            groupIndex={groupIndex}
                                            onGroupLogicChange={this.onGroupLogicChange.bind(this, groupItem, groupIndex)}
                                            onChange={this.onConditionChange.bind(this, groupItem, groupIndex)}
                                            onConditionDelete={this.onConditionDelete.bind(this, groupItem, groupIndex)}
                                            onConditionValueClear={this.onConditionValueClear.bind(this, groupItem, groupIndex)}
                                            data={groupItem}
                                            availableConditions={availableConditions}
                                        />
                                        <DropZone index={index} onDrop={this.onDrop.bind(this, groupItem, groupIndex)} />
                                    </div>

                                    <Button type="link" style={{ marginTop: '8px' }} onClick={() => onGroupAdd(groupIndex)}>
                                        <Icon antdIcon type="PlusOutlined" />
                                        新增条件组
                                    </Button>
                                </div>
                            );
                        })}
                    {data.children && data.children.length > 1 && this.state.lines}
                </div>
                <Modal visible={modalVisible} title="告警关联字段" onCancel={this.onModalClose} onOk={this.onChoosedField}>
                    <Radio.Group onChange={this.onRadioChange} value={choosedFieldName}>
                        {Array.isArray(fieldList) &&
                            fieldList.map((field) => {
                                return (
                                    <Radio value={field.fieldName} key={field.fieldName}>
                                        {field.fieldLabel}
                                    </Radio>
                                );
                            })}
                    </Radio.Group>
                </Modal>
            </div>
        );
    }
}
