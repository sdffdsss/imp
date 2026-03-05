import React, { PureComponent } from 'react';
import { Modal, message } from 'oss-ui';
import Condition from '@Components/condition';
import moment from 'moment';
import request from '@Common/api';
import produce from 'immer';
import { _ } from 'oss-web-toolkits';
import './index.less';

export default class index extends PureComponent {
    state = {
        visible: true,
        allList: [],
        conditionList: {},
        groupList: []
    };

    conditionRef = React.createRef();

    componentDidMount() {
        this.getConditionsList();
        this.getDataList();
    }

    /**
     * @description: 获取条件列表
     * @param {*}
     * @return {*}
     */
    getConditionsList = (conditionName) => {
        // const { groupList } = this.state;
        request('alarmmodel/filter/v1/filter/conditions/normal', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                modelId: 2,
                ruleTypeId: 1,
                conditionName,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token')
                })
            }
        }).then((res) => {
            const handleList = [
                {
                    groupType: 1,
                    groupTitle: '常用',
                    children: []
                },
                {
                    groupType: 3,
                    groupTitle: '故障组',
                    children: []
                },
                {
                    groupType: 2,
                    groupTitle: '其他',
                    children: []
                }
            ];
            if (res && Array.isArray(res.data)) {
                const errorData = [];
                res.data.forEach((item) => {
                    if (_.find(handleList, { groupType: item.conditionGroup })) {
                        _.find(handleList, { groupType: item.conditionGroup }).children.push(item);
                    } else {
                        errorData.push(item);
                    }
                });

                const errorMessage = errorData.map((item) => {
                    return `${item.fieldLabel}(${item.fieldName})`;
                });

                if (Array.isArray(errorMessage) && errorMessage.length > 0) {
                    message.error(errorMessage.join(','));
                }
                if (conditionName) {
                    this.setState(
                        {
                            groupList: handleList
                        },
                        () => {
                            this.getGroupList(conditionName);
                        }
                    );
                } else {
                    this.setState(
                        {
                            allList: res.data,
                            groupList: handleList
                        },
                        () => {
                            this.getGroupList();
                        }
                    );
                }
            }
        });
    };

    /**
     * @description: 获取故障组列表
     * @param {*}
     * @return {*}
     */

    getGroupList = (conditionName) => {
        const { groupList, allList } = this.state;
        request('alarmmodel/filter/v1/filter/conditions/fault', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                modelId: 2,
                ruleTypeId: 1,
                conditionName,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token')
                })
            }
        }).then((res) => {
            const handleAllList = _.cloneDeep(allList);
            if (res && Array.isArray(res.data)) {
                const handleData = res.data.map((item) => {
                    let handleConditionFieldList = [];
                    if (item && Array.isArray(item.conditionFieldVoList)) {
                        handleConditionFieldList = item.conditionFieldVoList.map((condition) => {
                            const tempObj = {
                                ...condition,
                                groupType: item.groupType
                            };
                            if (!conditionName) {
                                if (!_.find(handleAllList, { fieldName: tempObj.fieldName })) {
                                    handleAllList.push(tempObj);
                                }
                            }
                            return tempObj;
                        });
                    }
                    return {
                        isGroup: true,
                        fieldLabel: item.groupTypeName,
                        conditionFieldList: handleConditionFieldList
                    };
                });
                const nextData = produce(groupList, () => {
                    _.find(groupList, { groupType: 3 }).children = handleData;
                });
                if (conditionName) {
                    this.setState({
                        groupList: nextData
                    });
                } else {
                    this.setState({
                        groupList: nextData,
                        allList: handleAllList
                    });
                }
            }
        });
    };

    /**
     * @description: 获取数据
     * @param {*}
     * @return {*}
     */
    getDataList = () => {
        request('alarmmodel/filter/v1/filter', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                modelId: 2,
                moduleId: 1,
                filterId: -1
            }
        }).then((res) => {
            if (res && res.data) {
                const data = res.data.filterExpr || [];
                this.handleData(data);
            }
        });
    };

    /**
     * @description: 处理数据
     * @param {*}
     * @return {*}
     */
    handleData = (data) => {
        if (!data) return;
        const tempData = {};
        const tempArr =
            Array.isArray(data.filterConditionList) &&
            data.filterConditionList.map((item) => {
                const conditionArr =
                    Array.isArray(item?.conditionExpr?.conditionItemList) &&
                    item?.conditionExpr?.conditionItemList.map((condition) => {
                        return {
                            ...condition,
                            name: condition.fieldName,
                            label: condition.fieldLabel,
                            value:
                                Array.isArray(condition.valueList) &&
                                condition.valueList.map((value) => {
                                    if (condition.valueSize > 0) {
                                        return {
                                            value: value.key,
                                            label: value.value,
                                            key: value.key
                                        };
                                    }
                                    if (condition.dataType === 'time' || condition.dataType === 'date') {
                                        return moment(value);
                                    }
                                    return value.key;
                                })
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
        tempData.logicalType = data.logicalType || null;
        this.setState({
            conditionList: tempData
        });
        console.log(tempData);
        // console.log(tempData);
    };

    handleOk = () => {
        this.conditionRef.current
            .validateFields()
            .then((res) => {
                console.log(res);
                const filterConditionList =
                    res.children &&
                    Array.isArray(res.children) &&
                    res.children.map((item) => {
                        const conditionItemList = item.children.map((conditionItem) => {
                            console.log(conditionItem);
                            return {
                                compareType: conditionItem.compareType,
                                dataType: conditionItem.dataType,
                                fieldLabel: conditionItem.label,
                                fieldName: conditionItem.name,
                                valueList:
                                    Array.isArray(conditionItem.value) &&
                                    conditionItem.value.map((value) => {
                                        if (
                                            (conditionItem.isEnum === 1 && conditionItem.enableAdvanceSetting !== 1) ||
                                            conditionItem.compareType === 'groupSelect'
                                        ) {
                                            return {
                                                key: value.value,
                                                value: value.label
                                            };
                                        }
                                        if (conditionItem.dataType === 'time') {
                                            return {
                                                key: moment(value).format('HH:mm'),
                                                value: moment(value).format('HH:mm')
                                            };
                                        }
                                        if (conditionItem.dataType === 'date') {
                                            return {
                                                key: moment(value).format('YYYY-MM-DD HH:mm:ss'),
                                                value: moment(value).format('YYYY-MM-DD HH:mm:ss')
                                            };
                                        }
                                        return {
                                            key: value,
                                            value
                                        };
                                    })
                            };
                        });
                        const conditionExpr = {
                            logicalType: item.logicalType,
                            conditionItemList
                        };
                        const tempObj = {
                            conditionLabel: item.conditionLabel,
                            reverse: item.reverse,
                            conditionExpr
                        };
                        return tempObj;
                    });
                const filterExpr = {
                    filterConditionList,
                    logicalType: res.logicalType
                };
                console.log(filterExpr);
            })
            .catch((res) => {
                console.log(res);
            });
    };
    render() {
        const { visible, allList, conditionList, groupList } = this.state;
        return (
            <Modal
                title="条件编辑"
                width={1100}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.onCancel}
                destroyOnClose
                bodyStyle={{
                    height: '750px'
                }}
            >
                <div className="condition-container">
                    <Condition
                        ref={this.conditionRef}
                        availableConditions={allList}
                        data={conditionList}
                        groupList={groupList}
                        onSearch={this.getConditionsList}
                    />
                </div>
            </Modal>
        );
    }
}
