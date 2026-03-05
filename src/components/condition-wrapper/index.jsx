import React from 'react';
import request from '@Common/api';
import { _ } from 'oss-web-toolkits';
import produce from 'immer';

export default function getConditions(Comp) {
    return class Index extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {
                availableConditions: []
            };
        }
        componentDidMount() {
            this.getConditionsList();
        }
        /**
         * @description: 获取条件列表
         * @param {*}
         * @return {*}
         */
        getConditionsList = (conditionName) => {
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
                if (res && Array.isArray(res.data)) {
                    this.setState(
                        {
                            availableConditions: res.data
                        },
                        () => {
                            this.getGroupList();
                        }
                    );
                }
            });
        };

        /**
         * @description: 获取故障组列表
         * @param {*}
         * @return {*}
         */

        getGroupList = (conditionName) => {
            const { availableConditions } = this.state;
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
                const nextData = produce(availableConditions, (draft) => {
                    if (res && Array.isArray(res.data)) {
                        res.data.forEach((item) => {
                            if (item && Array.isArray(item.conditionFieldVoList)) {
                                item.conditionFieldVoList.forEach((condition) => {
                                    const tempObj = {
                                        ...condition,
                                        groupType: item.groupType
                                    };
                                    if (!_.find(draft, { fieldName: tempObj.fieldName })) {
                                        draft.push(tempObj);
                                    }
                                });
                            }
                        });
                    }
                });
                this.setState({
                    availableConditions: nextData
                });
            });
        };
        render() {
            const { availableConditions } = this.state;
            return <Comp {...this.props} availableConditions={availableConditions} />;
        }
    };
}
