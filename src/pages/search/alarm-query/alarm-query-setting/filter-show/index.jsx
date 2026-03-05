import React, { useState, useEffect } from 'react';
import moment from 'moment';
import ConditionShow from '@Components/condition-show/index.jsx';
import request from '@Common/api';

const Index = (props) => {
    const [conditionList, setConditionList] = useState([]);
    useEffect(() => {
        getDataList(props.filter);
    }, [getDataList, props.filter]);
    /**
     * @description: 获取数据
     * @param {*}
     * @return {*}
     */
    const getDataList = (filterId) => {
        request('alarmmodel/filter/v1/filter', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                modelId: 2,
                moduleId: 1,
                filterId,
                // filterId: 276314717,
            },
        }).then((res) => {
            if (res && res.data) {
                const data = res.data.filterExpr || [];
                handleData(data);
            }
        });
    };

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
                                            label: value.value,
                                        };
                                    } 
                                        if (condition.dataType === 'time' || condition.dataType === 'date') {
                                            return moment(value);
                                        } 
                                            return value.key;
                                        
                                    
                                }),
                            ...condition,
                        };
                    });
                return {
                    conditionId: item.conditionId,
                    conditionLabel: item.conditionLabel,
                    reverse: item.reverse,
                    logicalType: item?.conditionExpr?.logicalType,
                    children: conditionArr || [],
                };
            });
        tempData.children = tempArr || [];
        tempData.logicalType = data.logicalType || 'and';
        // this.setState({
        //     conditionList: tempData,
        // });
        setConditionList(tempData);
        // console.log(tempData);
        // console.log(tempData);
    };

    return <ConditionShow data={conditionList}></ConditionShow>;
};
export default Index;
