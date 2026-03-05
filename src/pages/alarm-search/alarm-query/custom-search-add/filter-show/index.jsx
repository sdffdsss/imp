import React, { useState, useEffect } from 'react';
import moment from 'moment';
import ConditionShow from '@Components/condition-show/index.jsx';
import { getRuleConditions } from '../../common/api';

const FilterShow = (props) => {
    const { filterId, moduleId } = props;
    const [conditionList, setConditionList] = useState([]);

    // 获取规则条件
    const getRuleCondition = async () => {
        const res = await getRuleConditions(filterId, moduleId);
        if (res && res.data) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            handleData(res.data.filterExpr || []);
        }
    };

    useEffect(() => {
        getRuleCondition(filterId, moduleId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterId, moduleId]);

    /**
     * @description: 处理数据
     * @param {*}
     * @return {*}
     */
    const handleData = (data) => {
        if (!data) return;
        const tempData = {};
        const tempArr =
            Array.isArray(data.filterConditionList) &&
            data.filterConditionList.map((item) => {
                const conditionArr =
                    Array.isArray(item?.conditionExpr?.conditionItemList) &&
                    item?.conditionExpr?.conditionItemList.map((condition) => {
                        return {
                            name: condition.fieldName,
                            label: condition.fieldLabel,
                            value:
                                Array.isArray(condition.valueList) &&
                                condition.valueList.map((value) => {
                                    if (condition.valueSize > 0) {
                                        return {
                                            value: value.key,
                                            label: value.value
                                        };
                                    }
                                    if (condition.dataType === 'time' || condition.dataType === 'date') {
                                        return moment(value);
                                    }
                                    return value.key;
                                }),
                            ...condition
                        };
                    });
                return {
                    conditionId: item.conditionId,
                    conditionLabel: item.conditionLabel,
                    reverse: item.reverse,
                    logicalType: item?.conditionExpr?.logicalType,
                    children: conditionArr || []
                };
            });
        tempData.children = tempArr || [];
        tempData.logicalType = data.logicalType || 'and';
        setConditionList(tempData);
    };

    return <ConditionShow data={conditionList}></ConditionShow>;
};
export default FilterShow;
