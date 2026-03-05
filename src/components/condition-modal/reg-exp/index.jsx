import React, { Fragment, useState, useEffect } from 'react';
import { Radio, Space, Checkbox, Input, Icon } from 'oss-ui';
import { produce } from 'immer';
import { _ } from 'oss-web-toolkits';

export default (props) => {
    const { onConditionDataChange, disabled, rightValues, currentSelectedCondition, FILTER_EMUN, moduleId } = props;

    const selectValue = _.find(rightValues, { fieldName: currentSelectedCondition.fieldName }) || {};
    console.log(selectValue);
    const str1 = selectValue.fieldName === 'locate_info' ? '|' : ',';
    const textAreaMessage = selectValue.valueList?.map((v) => v.key).join(str1) || '';

    const [errorShow, setErrorShow] = useState(false);

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    // const radioList = [
    //     { name: 'like', label: '模糊匹配(多个以,分隔)', isNegation: true },
    //     { name: 'accurate', label: '精确匹配(多个以,分隔)', isNegation: true },
    //     { name: 'array', label: '数组匹配(多个以,分隔)', isNegation: false },
    //     { name: 'is_null', label: '空', isNegation: false },
    //     { name: 'not_null', label: '非空', isNegation: false },
    // ];

    const onRightTextChange = (e) => {
        let nextRightValues;
        if (e.target.value === FILTER_EMUN.COMPARETYPE.ISNULL) {
            nextRightValues = produce(rightValues, (draft) => {
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList = [{ key: 'NULL', value: 'NULL' }];
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).compareType = FILTER_EMUN.COMPARETYPE.ISNULL;
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).reverse = FILTER_EMUN.REVERSE.FALSE;
            });
        }
        if (e.target.value === FILTER_EMUN.COMPARETYPE.NOTNULL) {
            nextRightValues = produce(rightValues, (draft) => {
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList = [{ key: 'NULL', value: 'NULL' }];
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).compareType = FILTER_EMUN.COMPARETYPE.NOTNULL;
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).reverse = FILTER_EMUN.REVERSE.FALSE;
            });
        }
        if (e.target.value === FILTER_EMUN.COMPARETYPE.LIKE) {
            nextRightValues = produce(rightValues, (draft) => {
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList = [];
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).compareType = FILTER_EMUN.COMPARETYPE.LIKE;
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).reverse = FILTER_EMUN.REVERSE.FALSE;
            });
        }
        if (e.target.value === FILTER_EMUN.COMPARETYPE.IN) {
            nextRightValues = produce(rightValues, (draft) => {
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList = [];
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).compareType = FILTER_EMUN.COMPARETYPE.IN;
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).reverse = FILTER_EMUN.REVERSE.FALSE;
            });
        }
        if (e.target.value === FILTER_EMUN.COMPARETYPE.MIX) {
            nextRightValues = produce(rightValues, (draft) => {
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList = [];
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).compareType = FILTER_EMUN.COMPARETYPE.MIX;
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).reverse = FILTER_EMUN.REVERSE.FALSE;
            });
        }

        onConditionDataChange(nextRightValues);
    };

    const onTxtNegativeChange = (e) => {
        let nextRightValues;
        nextRightValues = produce(rightValues, (draft) => {
            _.find(draft, { fieldName: currentSelectedCondition.fieldName }).reverse = e.target.checked
                ? FILTER_EMUN.REVERSE.TRUE
                : FILTER_EMUN.REVERSE.FALSE;
        });
        onConditionDataChange(nextRightValues);
    };

    const onRegExpStrChange = (e) => {
        const strs = currentSelectedCondition?.fieldName === 'locate_info' ? '|' : ',';
        let nextRightValues;
        nextRightValues = produce(rightValues, (draft) => {
            _.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList = e.target.value
                .split(strs)
                .map((s) => ({ key: s, value: s }));
        });
        onConditionDataChange(nextRightValues);
    };

    useEffect(() => {
        checkValue(textAreaMessage);
    }, [textAreaMessage]);

    const checkValue = (message) => {
        let exp = new RegExp(/\s+/g);
        let result = exp.test(message);
        setErrorShow(result);
    };

    const str = selectValue?.fieldName === 'locate_info' ? '|' : ',';

    return (
        <Fragment>
            <Radio.Group disabled={disabled} onChange={onRightTextChange} value={selectValue.compareType}>
                {currentSelectedCondition &&
                    _.isArray(currentSelectedCondition.expressionList) &&
                    currentSelectedCondition.expressionList.map((item) => {
                        // if (moduleId === 63 && (item.name === 'like' || item.name === 'mix')) {
                        //     return;
                        // }
                        if (item.name === FILTER_EMUN.COMPARETYPE.ISNULL || item.name === FILTER_EMUN.COMPARETYPE.NOTNULL) {
                            return (
                                <Radio disabled={disabled} style={radioStyle} value={item.name}>
                                    {item.label}
                                </Radio>
                            );
                        }
                        if (
                            item.name === FILTER_EMUN.COMPARETYPE.LIKE ||
                            item.name === FILTER_EMUN.COMPARETYPE.IN ||
                            item.name === FILTER_EMUN.COMPARETYPE.MIX
                        ) {
                            return (
                                <Radio disabled={disabled} style={radioStyle} value={item.name}>
                                    <Space>
                                        {item.name === FILTER_EMUN.COMPARETYPE.LIKE && <span>{`模糊匹配(输入以${str}分隔的字符串)`}</span>}
                                        {item.name === FILTER_EMUN.COMPARETYPE.IN && <span>{`精确匹配(输入以${str}分隔的字符串)`}</span>}
                                        {item.name === FILTER_EMUN.COMPARETYPE.MIX && <span>{`数组匹配(输入以${str}分隔的字符串)`}</span>}
                                        {moduleId !== 63 && (
                                            <Checkbox
                                                checked={
                                                    Number(selectValue.reverse) === FILTER_EMUN.REVERSE.TRUE && selectValue.compareType === item.name
                                                }
                                                onChange={onTxtNegativeChange}
                                                disabled={disabled || selectValue.compareType !== item.name}
                                                //     disabled={disabled || selectValue.compareType !== FILTER_EMUN.COMPARETYPE.LIKE}
                                            >
                                                取反
                                            </Checkbox>
                                        )}
                                    </Space>
                                </Radio>
                            );
                        }
                        return <Fragment></Fragment>;
                    })}

                {/* {radioList.map((item) => {
                    if (item.isNegation) {
                        return (
                            <Radio disabled={disabled} style={radioStyle} value={item.name}>
                                <Space>
                                    <span>{`字符串匹配(输入以${str}分隔的字符串)`}</span>
                                    <Checkbox
                                        checked={Number(selectValue.reverse) === FILTER_EMUN.REVERSE.TRUE}
                                        onChange={onTxtNegativeChange}
                                        disabled={disabled || selectValue.compareType !== item.name}
                                    >
                                        取反
                                    </Checkbox>
                                </Space>
                            </Radio>
                        );
                    } else {
                        return (
                            <Radio disabled={disabled} style={radioStyle} value={item.name}>
                                {item.label}
                            </Radio>
                        );
                    }
                })} */}
            </Radio.Group>
            {(selectValue.compareType === FILTER_EMUN.COMPARETYPE.LIKE ||
                selectValue.compareType === FILTER_EMUN.COMPARETYPE.IN ||
                selectValue.compareType === FILTER_EMUN.COMPARETYPE.MIX) && (
                <Input.TextArea
                    value={textAreaMessage}
                    onChange={onRegExpStrChange}
                    disabled={disabled}
                    allowClear
                    style={{
                        height: 'calc(100% - 150px)',
                    }}
                />
            )}
            {errorShow && (
                <div style={{ color: '#faad14' }}>
                    <Icon antdIcon type="WarningFilled" />
                    文本框中存在空格。
                </div>
            )}
        </Fragment>
    );
};
