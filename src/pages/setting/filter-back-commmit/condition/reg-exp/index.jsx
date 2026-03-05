import React from 'react';
import { Radio, Space, Checkbox, Input } from 'oss-ui';

export default (props) => {
    const {
        disabled,
        rightValues,
        currentSelectedCondition,
        onRegExpStrChange,
        onRightTextChange,
        onTxtNegativeChange,
        splitType,
    } = props;

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    if (rightValues[currentSelectedCondition.id]) {
    }

    const calcValue = () => {
        let value = 'NULL';
        const currentValue = rightValues[currentSelectedCondition.id];

        if (currentValue) {
            if (currentValue.valueString === 'NULL') {
                if (currentValue.isNegative) {
                    value = 'NOTNULL';
                }
            } else {
                value = 'REGEXP';
            }
        }

        return value;
    };

    return (
        <>
            <Radio.Group
                disabled={disabled}
                // className="txt-rule-wrapper"
                onChange={onRightTextChange}
                value={calcValue()}
            >
                <Radio style={radioStyle} value="NULL">
                    空
                </Radio>
                <Radio style={radioStyle} value="NOTNULL">
                    非空
                </Radio>
                <Radio style={radioStyle} value="REGEXP">
                    <Space>
                        <span>{`字符串匹配${splitType ? `(输入以${  splitType  }分隔的字符串)` : ''}`}</span>
                        <Checkbox
                            checked={
                                rightValues[currentSelectedCondition.id] &&
                                calcValue() === 'REGEXP' &&
                                rightValues[currentSelectedCondition.id].isNegative
                            }
                            onChange={onTxtNegativeChange}
                            disabled={disabled || calcValue() !== 'REGEXP'}
                        >
                            取反
                        </Checkbox>
                    </Space>
                </Radio>
            </Radio.Group>
            {calcValue() === 'REGEXP' && (
                <Input.TextArea
                    value={rightValues[currentSelectedCondition.id].valueString}
                    onChange={onRegExpStrChange}
                    disabled={disabled}
                />
            )}
        </>
    );
};
