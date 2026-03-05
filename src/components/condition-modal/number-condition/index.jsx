/* eslint-disable array-callback-return */
import React from 'react';
import { Form, Space, Select, InputNumber, Icon, message } from 'oss-ui';
import { produce } from 'immer';
import { _ } from 'oss-web-toolkits';

export default (props) => {
    const { onConditionDataChange, disabled, rightValues, currentSelectedCondition } = props;

    // 改变运算符
    const onNumberOperatorChange = (index, value) => {
        let nextRightValues;
        nextRightValues = produce(rightValues, (draft) => {
            draft[index].compareType = value;
            if (value !== 'between') {
                draft[index].valueList = draft[index].valueList[0];
            }
        });
        onConditionDataChange(nextRightValues);
    };

    // 改变数值
    const onNumberChange = (index, v, num) => {
        let nextRightValues;
        nextRightValues = produce(rightValues, (draft) => {
            if (draft[index].compareType === 'between') {
                draft[index].valueList[num] = { key: v, value: v };
            } else {
                draft[index].valueList = [{ key: v, value: v }];
            }
        });
        onConditionDataChange(nextRightValues);
    };

    // 增加条件
    const onAddNumber = (index) => {
        let nextRightValues;
        nextRightValues = produce(rightValues, (draft) => {
            draft.splice(index + 1, 0, {
                fieldLabel: currentSelectedCondition.fieldLabel,
                fieldName: currentSelectedCondition.fieldName,
                reverse: props.FILTER_EMUN.REVERSE.FALSE,
                compareType:
                    currentSelectedCondition &&
                    currentSelectedCondition.expressionList &&
                    _.isArray(currentSelectedCondition.expressionList) &&
                    currentSelectedCondition.expressionList[0] &&
                    currentSelectedCondition.expressionList[0].name,
                valueList: [],
            });
        });
        onConditionDataChange(nextRightValues);
    };

    // 删除条件
    const onDeleteNumber = (index) => {
        let nextRightValues;
        const selectValue = _.filter(rightValues, { fieldName: currentSelectedCondition.fieldName }) || [];
        if (selectValue.length === 1) {
            message.error('至少保留一个条件');
            return;
        }
        nextRightValues = produce(rightValues, (draft) => {
            draft.splice(index, 1);
        });
        onConditionDataChange(nextRightValues);
    };

    return (
        <div className="condition-list" style={{ height: `${window.innerHeight - 350}px`, overflow: 'auto' }}>
            <Form>
                {rightValues.map((item, index) => {
                    if (item.fieldName === currentSelectedCondition.fieldName) {
                        return (
                            <Form.Item label="操作类型">
                                <Space>
                                    <Select
                                        disabled={disabled}
                                        onChange={(value) => onNumberOperatorChange(index, value)}
                                        value={item.compareType}
                                        style={{ width: 150 }}
                                        options={currentSelectedCondition.expressionList.map((item) => ({
                                            label: item.label,
                                            value: item.name,
                                        }))}
                                    ></Select>
                                    {(item.compareType !== props.FILTER_EMUN.COMPARETYPE.ISNULL ||
                                        item.compareType !== props.FILTER_EMUN.COMPARETYPE.NOTNULL) && (
                                        <InputNumber
                                            value={_.get(item, `valueList[0].key`)}
                                            disabled={disabled}
                                            min={0}
                                            onChange={(v) => onNumberChange(index, v, 0)}
                                        />
                                    )}
                                    {item.compareType === props.FILTER_EMUN.COMPARETYPE.BETWEEN && (
                                        <InputNumber
                                            onChange={(v) => onNumberChange(index, v, 1)}
                                            value={_.get(item, `valueList[1].key`)}
                                            min={0}
                                            disabled={disabled}
                                        />
                                    )}
                                    <Icon antdIcon style={{ cursor: 'pointer' }} onClick={() => onAddNumber(index)} type="PlusOutlined" />
                                    <Icon antdIcon style={{ cursor: 'pointer' }} onClick={() => onDeleteNumber(index)} type="MinusCircleOutlined" />
                                </Space>
                            </Form.Item>
                        );
                    }
                })}
            </Form>
        </div>
    );
};
