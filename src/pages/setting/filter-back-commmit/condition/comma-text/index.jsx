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
    } = props;

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    return (
        <>
            <Radio.Group
                disabled={disabled}
                // className="txt-rule-wrapper"
                onChange={onRightTextChange}
                value={
                    rightValues[currentSelectedCondition.id]
                        ? rightValues[currentSelectedCondition.id].type.textValueType
                        : 'NULL'
                }
            >
                <Radio style={radioStyle} value="NULL">
                    空
                </Radio>
                <Radio style={radioStyle} value="NOTNULL">
                    非空
                </Radio>
                <Radio style={radioStyle} value="REGEXP">
                    <Space>
                        <span>字符串匹配(输入以,分隔的字符串)</span>
                        <Checkbox
                            checked={
                                rightValues[currentSelectedCondition.id] &&
                                rightValues[currentSelectedCondition.id].isNegative
                            }
                            onChange={onTxtNegativeChange}
                            disabled={disabled}
                        >
                            取反
                        </Checkbox>
                    </Space>
                </Radio>
            </Radio.Group>
            {rightValues[currentSelectedCondition.id] &&
                rightValues[currentSelectedCondition.id].type.textValueType === 'REGEXP' && (
                    <Input.TextArea
                        value={rightValues[currentSelectedCondition.id].valueString.join('|')}
                        onChange={onRegExpStrChange}
                        disabled={disabled}
                    />
                )}
        </>
    );
};
