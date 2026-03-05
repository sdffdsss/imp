import React from 'react';
import { Form, Space, Select, InputNumber, Icon } from 'oss-ui';
import Enums from '@Common/enum';

export default (props) => {
    const {
        disabled,
        onNumberOperatorChange,
        onNumberChange,
        rightValues,
        currentSelectedCondition,
        onNumberCountChange,
    } = props;
    const currentValue = rightValues[currentSelectedCondition.id];

    const formatValue = () => {
        let processArr = [];

        if (currentValue) {
            const currentValueArr = currentValue.valueString.split(',').slice(1, -1);

            currentValueArr.forEach((item) => {
                let operator;
                let firstNumber = 0;
                let secondNumber = 0;

                if (item.includes('-')) {
                    const index = item.indexOf('-');

                    if (index === 0) {
                        operator = 'lteq';
                        firstNumber = item.substring(1);
                    } else if (index === item.length - 1) {
                        operator = 'gteq';
                        firstNumber = item.substring(0, item.length - 1);
                    } else {
                        operator = 'between';
                        firstNumber = item.substring(0, index);
                        secondNumber = item.substring(index + 1);
                    }
                } else {
                    operator = 'eq';
                    firstNumber = item;
                }
                processArr.push({
                    operator,
                    firstNumber,
                    secondNumber,
                });
            });
        } else {
            processArr = [
                {
                    operator: undefined,
                    firstNumber: 0,
                    secondNumber: 0,
                },
            ];
        }

        return processArr;
    };

    function onAddNumber(index) {
        if (!disabled) {
            onNumberCountChange('plus', index);
        }
    }

    function onDeleteNumber(index) {
        if (!disabled) {
            onNumberCountChange('minus', index);
        }
    }

    return (
        <div className="condition-list">
            <Form>
                {formatValue().map((item, index) => {
                    return (
                        <Form.Item label="操作类型">
                            <Space>
                                <Select
                                    disabled={disabled}
                                    onChange={(value) => onNumberOperatorChange(index, value)}
                                    value={item.operator}
                                    style={{ width: 150 }}
                                    options={Enums.numberOperator.map((item) => ({
                                        label: item.name,
                                        value: item.id,
                                    }))}
                                ></Select>
                                <InputNumber
                                    value={item.firstNumber}
                                    disabled={disabled}
                                    min={0}
                                    onChange={onNumberChange.bind(this, index, item.operator, 'first')}
                                />
                                {item.operator === 'between' && (
                                    <InputNumber
                                        onChange={onNumberChange.bind(this, index, item.operator, 'second')}
                                        value={item.secondNumber}
                                        min={0}
                                        disabled={disabled}
                                    />
                                )}
                                <Icon
                                    antdIcon
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => onAddNumber(index)}
                                    type="PlusOutlined"
                                />
                                <Icon
                                    antdIcon
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => onDeleteNumber(index)}
                                    type="MinusCircleOutlined"
                                />
                            </Space>
                        </Form.Item>
                    );
                })}
            </Form>
        </div>
    );
};
