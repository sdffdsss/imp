import React from 'react';
import { Modal, message } from 'oss-ui';
import CustomModalFooter from '@Components/custom-modal-footer';
import Condition from '@Components/condition';
import produce from 'immer';
import { _ } from 'oss-web-toolkits';
import request from '@Common/api';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            groupList: [],
            conditionOptions: [],
            accordionActiveKey: ['1', '3']
        };
        this.conditionRef = React.createRef();
        this.baseHandleList = React.createRef([]);
        this.allList = React.createRef([]);
    }

    componentDidMount() {
        this.getConditionsList();
    }

    /**
     * @description: 关闭弹窗
     * @param {*}
     * @return {*}
     */

    onCancel = () => {
        this.props.onCloseEditModal();
    };

    /**
     * @description: 设置activeKey
     * @param {*}
     * @return {*}
     */
    setActiveKey = (groupData) => {
        const activeKeys = groupData.filter((item) => item.children.length > 0).map((item) => item.groupType);
        this.setState({
            accordionActiveKey: activeKeys
        });
    };

    /**
     * @description: 保存数据
     * @param {*}
     * @return {*}
     */

    handleSaveData = () => {
        const { editConditionInfo, conditionList } = this.props;
        this.conditionRef.current
            .validateFields()
            .then((res) => {
                try {
                    const repeatName = [];

                    const allLabels = conditionList.children
                        .filter((group, index) => index !== editConditionInfo.index)
                        .map((group) => group.conditionLabel);
                    res.children.forEach((group) => {
                        if (allLabels.includes(group.conditionLabel)) {
                            repeatName.push(group.conditionLabel);
                        }
                    });
                    if (repeatName.length > 0) {
                        message.error(`条件组中已存在名称“${repeatName.join('、')}”，请修改`);
                        return;
                    }
                    this.props.onConditionDataChange(res);
                } catch (e) {
                    message.error(e.message);
                }
            })
            .catch(() => {});
    };

    /**
     * @description: 获取故障组列表
     * @param {*}
     * @return {*}
     */

    getGroupList = (conditionName) => {
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
            const handleAllList = _.cloneDeep(this.allList.current);
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
                const nextData = produce(this.baseHandleList.current, () => {
                    _.find(this.baseHandleList.current, { groupType: '3' }).children = handleData;
                });
                if (conditionName) {
                    this.setState({
                        groupList: nextData
                    });
                    this.setActiveKey(nextData);
                } else {
                    if (conditionName !== undefined) {
                        this.setActiveKey(nextData);
                    }
                    this.setState({
                        groupList: nextData,
                        conditionOptions: handleAllList
                    });
                }
            }
        });
    };

    /**
     * @description: 获取条件列表
     * @param {*}
     * @return {*}
     */

    getConditionsList = (conditionName) => {
        const { moduleId } = this.props;
        request('alarmmodel/filter/v1/filter/conditions/normal', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                modelId: 2,
                ruleTypeId: moduleId,
                conditionName,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token')
                })
            }
        }).then((res) => {
            const handleList = [
                {
                    groupType: '1',
                    groupTitle: '常用',
                    children: []
                },
                {
                    groupType: '3',
                    groupTitle: '故障组',
                    children: []
                },
                {
                    groupType: '2',
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
                    this.baseHandleList.current = handleList;
                    this.getGroupList(conditionName);
                } else {
                    this.setState({
                        conditionOptions: res.data
                    });
                    this.allList.current = res.data;
                    this.baseHandleList.current = handleList;
                    this.getGroupList(conditionName);
                }
            }
        });
    };

    render() {
        const { conditionOptions, groupList, accordionActiveKey } = this.state;
        const { editConditionInfo } = this.props;
        return (
            <Modal
                destroyOnClose
                maskClosable={false}
                width={'80%'}
                title={'规则条件'}
                visible={true}
                centered
                wrapClassName="alarm-window-context-modal"
                prefixCls="oss-ui-modal"
                okButtonProps={{ prefixCls: 'oss-ui-btn' }}
                cancelButtonProps={{ prefixCls: 'oss-ui-btn' }}
                onCancel={this.onCancel}
                bodyStyle={{
                    height: 'calc(100vh - 162px)'
                }}
                footer={<CustomModalFooter onCancel={this.onCancel} onOk={this.handleSaveData} />}
            >
                <Condition
                    ref={this.conditionRef}
                    availableConditions={conditionOptions}
                    data={editConditionInfo.data}
                    groupList={groupList}
                    onSearch={this.getConditionsList}
                    disabledGroupLogicType={true}
                    accordionActiveKey={accordionActiveKey}
                    heightCustomSet={true}
                />
            </Modal>
        );
    }
}
