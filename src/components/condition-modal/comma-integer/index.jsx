import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Space, Input, Button, Checkbox, Icon, List, Radio } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { produce } from 'immer';

export default (props) => {
    const {
        dictData,
        onConditionDataChange,
        disabled,
        rightValues,
        currentSelectedCondition,
        onSearch,
        FILTER_EMUN,
        pageInfo,
        userInfo,
        hasDefaultValue,
        moduleId,
    } = props;
    const [currentDictName, handleName] = useState('');
    // 搜索值
    const [searchValue, handleSearchValue] = useState('');
    const isRadio = currentSelectedCondition.fieldLabel === '自动派单规则';
    const isShowNullCheck =
        currentSelectedCondition?.expressionList?.filter((item) => item.name === 'is_null' || item.name === 'not_null')?.length > 0;
    const curItem = rightValues?.find(
        (item) => item.fieldName === currentSelectedCondition?.fieldName && item.fieldLabel === currentSelectedCondition?.fieldLabel,
    );
    let defaultIsNull = '';
    if (curItem?.compareType === 'is_null') {
        defaultIsNull = FILTER_EMUN.COMPARETYPE.ISNULL;
    } else if (curItem?.compareType === 'not_null') {
        defaultIsNull = FILTER_EMUN.COMPARETYPE.NOTNULL;
    }
    const [isNull, setIsNull] = useState(defaultIsNull);
    const isNullRef = useRef(isNull);
    isNullRef.current = defaultIsNull;

    const [isShowNullRadio, setIsShowNullRadio] = useState(defaultIsNull);
    const isShowNullRadioRef = useRef(isShowNullRadio);
    isShowNullRadioRef.current = isShowNullRadio;

    const onKeywordChange = ({ target: { value } }) => {
        handleSearchValue(value);
        onSearch({ value });
    };

    const selectRightValue = _.find(rightValues, { fieldName: currentSelectedCondition.fieldName }) || {};

    // React.useEffect(() => {
    //     if (props.currentSelectedCondition.enumName === 'province_id') {
    //         if (userInfo.zones[0]?.zoneLevel === '1') {
    //             const valList = [
    //                 { key: userInfo.zones[0]?.zoneId, value: dictData.filter((item) => item.key === userInfo.zones[0]?.zoneId)[0]?.value },
    //             ];
    //             selectRightValue.valueList = valList;
    //         } else {
    //             const valList = [
    //                 {
    //                     key: userInfo.zones[0]?.zoneLevel_2Id,
    //                     value: dictData.filter((item) => item.key === userInfo.zones[0]?.zoneLevel_2Id)[0]?.value,
    //                 },
    //             ];
    //             selectRightValue.valueList = valList;
    //         }
    //     } else if (props.currentSelectedCondition.enumName === 'network_type_top') {
    //         if (userInfo.zones[0]?.zoneLevel === '1') {
    //             const valList = [{ key: '0', value: dictData.filter((item) => item.key === '0')[0]?.value }];
    //             selectRightValue.valueList = valList;
    //         } else {
    //             const valList = [{ key: '1', value: dictData.filter((item) => item.key === '1')[0]?.value }];
    //             selectRightValue.valueList = valList;
    //         }
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [props.dictData]);

    const setIsShowRadio = () => {
        const { moduleId } = props;
        let isShowRadio = isShowNullCheck;
        const roles = [
            {
                key: 'org_type',
                value: '告警类别',
            },
            {
                key: 'network_type_top',
                value: '一级网络类型',
            },
            {
                key: 'province_id',
                value: '省份名称',
            },
            {
                key: 'professional_type',
                value: '专业',
            },
            {
                value: '电联共享标识',
                key: 'is_share',
            },
        ];

        roles.forEach((item) => {
            if (currentSelectedCondition?.fieldName === item.key) {
                isShowRadio = false;
            }
        });

        if (moduleId === 604) {
            if (currentSelectedCondition?.fieldName === 'pivot_station_name') {
                isShowRadio = false;
            }
        }
        setIsShowNullRadio(isShowRadio);
    };

    useEffect(() => {
        setIsShowRadio();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSelectedCondition.fieldName]);

    const getCompareType = (currentCondition) => {
        let compareType = 'eq';
        // 专业网管ID特殊处理
        if (currentCondition.fieldName === 'nms_alarm_id') {
            compareType = 'in';
        } else {
            /** 高级条件中，字符类型默认展示like组 */
            compareType =
                // eslint-disable-next-line no-nested-ternary
                Number(currentCondition.valueSize) > 0
                    ? 'in'
                    : currentCondition.enableSelectGroup === 1
                    ? 'groupSelect'
                    : currentCondition.dataType === 'string' && moduleId === 63
                    ? 'in'
                    : currentCondition.dataType === 'string'
                    ? 'like'
                    : currentCondition.dataType === 'time'
                    ? 'between'
                    : currentCondition.dataType === 'date'
                    ? 'between'
                    : 'eq';
        }
        return compareType;
    };

    const onCheckedOrNotAll = (type) => {
        let nextRightValues;
        if (type === 'checkd') {
            nextRightValues = produce(rightValues, (draft) => {
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList = dictData.map((item) => ({
                    key: item.key,
                    value: item.value,
                }));
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).compareType = getCompareType(currentSelectedCondition);
            });
        }
        if (type === 'clear') {
            nextRightValues = produce(rightValues, (draft) => {
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList = [];
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).compareType = getCompareType(currentSelectedCondition);
            });
        }
        setTimeout(() => {
            onConditionDataChange(nextRightValues);
        }, 10);
    };

    const onTxtNegativeChange = (e) => {
        let nextRightValues;
        let reverse;
        e.target.checked ? (reverse = FILTER_EMUN.REVERSE.TRUE) : (reverse = FILTER_EMUN.REVERSE.FALSE);
        nextRightValues = produce(rightValues, (draft) => {
            _.find(draft, { fieldName: currentSelectedCondition.fieldName }).reverse = reverse;
        });
        setTimeout(() => {
            onConditionDataChange(nextRightValues);
        }, 10);
    };

    const onRightNormalValuesChange = (e) => {
        // debugger;
        let nextRightValues;
        if (isRadio) {
            nextRightValues = produce(rightValues, (draft) => {
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList = [
                    {
                        key: e.target.value.key,
                        value: e.target.value.value,
                    },
                ];
                _.find(draft, { fieldName: currentSelectedCondition.fieldName }).compareType = getCompareType(currentSelectedCondition);
            });
        } else {
            if (e.target.checked) {
                nextRightValues = produce(rightValues, (draft) => {
                    _.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList.push({
                        key: e.target.value.key,
                        value: e.target.value.value,
                    });
                    _.find(draft, { fieldName: currentSelectedCondition.fieldName }).compareType = getCompareType(currentSelectedCondition);
                });
            } else {
                nextRightValues = produce(rightValues, (draft) => {
                    _.remove(_.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList, (item) => {
                        return item.key === e.target.value.key;
                    });
                    _.find(draft, { fieldName: currentSelectedCondition.fieldName }).compareType = getCompareType(currentSelectedCondition);
                });
            }
        }
        setTimeout(() => {
            onConditionDataChange(nextRightValues);
        }, 10);
        setIsNull('');
    };

    const onRadioChange = (e) => {
        const nextRightValues = produce(rightValues, (draft) => {
            _.find(draft, { fieldName: currentSelectedCondition.fieldName }).valueList = [{ key: 'NULL', value: 'NULL' }];
            _.find(draft, { fieldName: currentSelectedCondition.fieldName }).compareType = e.target.value;
        });
        setTimeout(() => {
            onConditionDataChange(nextRightValues);
        }, 10);
        setIsNull(e.target.value);
    };

    const handleCurrentDict = (name) => {
        handleName(name);
    };

    const reversable = currentDictName === 'professional_type';

    return (
        <Fragment>
            <Space>
                <Input
                    disabled={disabled}
                    onChange={onKeywordChange}
                    suffix={<Icon antdIcon type="SearchOutlined" />}
                    style={{ width: 220 }}
                    allowClear
                />
                {!isRadio && (
                    <Button disabled={disabled || reversable} onClick={() => onCheckedOrNotAll('checkd')}>
                        全选
                    </Button>
                )}
                <Button disabled={disabled || reversable} onClick={() => onCheckedOrNotAll('clear')}>
                    清空
                </Button>
                {moduleId !== 63 && (
                    <Checkbox
                        checked={selectRightValue.reverse === FILTER_EMUN.REVERSE.TRUE}
                        disabled={disabled || reversable}
                        onChange={onTxtNegativeChange}
                    >
                        取反
                    </Checkbox>
                )}
                {isShowNullRadioRef.current && (
                    <Radio.Group
                        value={isNullRef.current}
                        disabled={disabled}
                        onChange={(e) => {
                            onRadioChange(e);
                        }}
                    >
                        <Radio value={FILTER_EMUN.COMPARETYPE.ISNULL}>空</Radio>
                        <Radio value={FILTER_EMUN.COMPARETYPE.NOTNULL}>非空</Radio>
                    </Radio.Group>
                )}
            </Space>
            <div className="condition-list" style={{ height: `${window.innerHeight - 350}px`, overflow: 'auto' }}>
                <List
                    split={false}
                    size="small"
                    bordered={false}
                    pagination={{
                        onChange: (current, pageSize) => {
                            onSearch({ current, pageSize, value: searchValue });
                        },
                        pageSize: pageInfo.pageSize,
                        current: pageInfo.current,
                        total: pageInfo.total,
                    }}
                    dataSource={dictData}
                    renderItem={(item) => {
                        const isCity = userInfo.zones[0]?.zoneLevel === '3';
                        handleCurrentDict(item.dictName);
                        const checked =
                            selectRightValue && selectRightValue.valueList && selectRightValue.valueList?.map((s) => s.key).includes(item.key);
                        const defaultValue = hasDefaultValue && (item.dictName === 'professional_type' || (item.dictName === 'region_id' && isCity));
                        return (
                            <List.Item>
                                <div className="condition-item" key={item.key}>
                                    {isRadio ? (
                                        <Radio
                                            disabled={disabled || defaultValue}
                                            value={item}
                                            checked={checked}
                                            onChange={onRightNormalValuesChange}
                                        />
                                    ) : (
                                        <Checkbox
                                            disabled={disabled || defaultValue}
                                            value={item}
                                            checked={checked}
                                            onChange={onRightNormalValuesChange}
                                        />
                                    )}
                                    <span className={`name${checked ? ' active' : ''}`}>{item.value}</span>
                                </div>
                            </List.Item>
                        );
                    }}
                />
            </div>
        </Fragment>
    );
};
