import React, { PureComponent } from 'react';
import { Button, Form, Input, Row, Space, Checkbox, Col, Tree, message, Card } from 'oss-ui';
import ConditionModal from '../condition';
import PageContainer from '@Components/page-container';
import Enums from '@Common/enum';
import request from '@Common/api';
import { _ } from 'oss-web-toolkits';
import Dispatch from './dispatch';
import BeforeTransform from './before-transform';
import PreTreat from './pre-treat';
import Phonation from './phonation';
import SelfHeal from './self-heal';
import TimeoutCount from './timeout-count';
import LevelRedefine from './level-redefine';
import AutoClear from './auto-clear';
import JudgeRepeat from './judge-repeat';
import CategoryRedefine from './category-redefine';
import DispatchInhibition from './dispatch-inhibition';
import AlarmSubscription from './alarm-subscription';
import { makeCRC32 } from '@Common/utils';
import moment from 'moment';
import {
    formatDispatch,
    formatTransform,
    formatPretreat,
    formatPhonation,
    formatSelfHeal,
    formatTimeoutCount,
    formatLevelRedefine,
    formatCategoryRedefine,
    formatAutoClear,
    formatJudgeRepeat,
    formatDispatchInhibition,
    formatAlarmSubscrition
} from './util';
import './index.less';

const Default = () => {
    return <></>;
};

const moduleIdEditContentMap = {
    1: Default,
    9: Default, // 自动确认
    10: Dispatch,
    4: BeforeTransform,
    14: BeforeTransform,
    18: BeforeTransform,
    7: PreTreat,
    8: Phonation,
    106: SelfHeal,
    105: TimeoutCount,
    2: LevelRedefine,
    3: CategoryRedefine,
    67: AutoClear,
    63: JudgeRepeat,
    64: DispatchInhibition,
    107: AlarmSubscription
    // 6: 告警查询规则
};

const moduleIdFormatMap = {
    10: formatDispatch,
    4: formatTransform,
    14: formatTransform,
    18: formatTransform,
    7: formatPretreat,
    8: formatPhonation,
    6: formatSelfHeal,
    105: formatTimeoutCount,
    2: formatLevelRedefine,
    3: formatCategoryRedefine,
    67: formatAutoClear,
    63: formatJudgeRepeat,
    64: formatDispatchInhibition,
    107: formatAlarmSubscrition
};

class index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            conditionVisible: false,
            filterInfo: { name: '', description: '', isValid: true, isPrivate: false, conditions: [] },
            // 当前是否创建过滤器
            isCreate: true,
            // 当前是否新建条件
            isCreateCondition: false,
            // 当前编辑的条件信息
            editingConditionInfo: null,
            conditionTreeData: [],
            expandedKeys: [],
            // 当前选中的条件
            selectedKey: ''
        };
    }

    actionFormRef = React.createRef();

    componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            request('sysadminFilter/filter-detail-name', {
                type: 'post',
                baseUrlType: 'filter',
                showSuccessMessage: false,
                data: {
                    context: {
                        FILTER_ID: this.props.match.params.id
                    },
                    iceEndpoint: 'SysadminServer:default -h 10.10.1.170 -p 4508'
                }
            }).then((res) => {
                if (res && Array.isArray(res.data) && res.data.length > 0) {
                    const { conditionTreeData, expandedKeys } = this.formatTreeData(res.data[0].conditions);

                    this.setState({
                        filterInfo: res.data[0],
                        isCreate: false,
                        conditionTreeData,
                        expandedKeys
                    });
                }
            });
        }
    }

    // 将条件格式化为tree组件数据
    formatTreeData = (data) => {
        const conditionTreeData = [];
        const expandedKeys = [];

        data.forEach((itemCond, indexCond) => {
            expandedKeys.push(`${indexCond}`);

            const conditionItem = {
                key: `${indexCond}`,
                title: `${itemCond.name}${itemCond.isNegative ? '[取反]' : ''}`,
                value: itemCond,
                children: []
            };
            itemCond.items.forEach((itemIn, indexIn) => {
                expandedKeys.push(`${indexCond}-${indexIn}`);

                const conditionChild = {
                    key: `${indexCond}-${indexIn}`,
                    title: `${itemIn.type.displayName}${itemIn.isNegative ? '[取反]' : ''}`,
                    children: []
                };
                if (itemIn.valueStringList && itemIn.valueStringList.length > 0) {
                    if (itemIn.type.valueType === 'CommaIntegerWithRange') {
                        const valueStringArr = itemIn.valueString.split(',').slice(1, -1);

                        valueStringArr.forEach((itemValue, indexValue) => {
                            let title = '';
                            let operator;
                            if (itemValue.includes('-')) {
                                const index = itemValue.indexOf('-');

                                if (index === 0) {
                                    operator = 'lteq';
                                } else if (index === itemValue.length - 1) {
                                    operator = 'gteq';
                                } else {
                                    operator = 'between';
                                }
                            } else {
                                operator = 'eq';
                            }

                            if (operator === 'between') {
                                title = `介于${itemValue.split('-')[0]}-${itemValue.split('-')[1]}之间`;
                            } else {
                                console.log(itemValue.replace('-'));
                                const operatorText = Enums.numberOperator.getName(operator);
                                title = `${operatorText}${itemValue.replace('-', '')}`;
                            }

                            conditionChild.children.push({
                                title,
                                key: `${indexCond}-${indexIn}-${indexValue}`
                            });
                        });
                    } else {
                        itemIn.valueStringList.forEach((itemChild, indexChild) => {
                            switch (itemIn.type.valueType) {
                                case 'CommaInteger':
                                case 'CommaText':
                                case 'RegExp':
                                    conditionChild.children.push({
                                        title: itemChild,
                                        key: `${indexCond}-${indexIn}-${indexChild}`
                                    });
                                    break;
                                case 'TimeH2M':
                                    conditionChild.children.push({
                                        title: `${indexChild === 0 ? '开始时间' : '结束时间'}:${itemChild}`,
                                        key: `${indexCond}-${indexIn}-${indexChild}`
                                    });
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                }
                conditionItem.children.push(conditionChild);
            });

            conditionTreeData.push(conditionItem);
        });

        return {
            conditionTreeData,
            expandedKeys
        };
    };

    showModal = () => {
        this.setState({ visible: true });
    };

    handleSave = () => {
        const { filterInfo, isCreate } = this.state;
        const filterInfoNew = _.cloneDeep(filterInfo);
        let url = '';
        let method = '';
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

        if (!filterInfoNew.name) {
            message.error('请输入名称');

            return;
        }

        if (filterInfoNew.conditions.length === 0) {
            message.error('请编辑条件');

            return;
        }

        if (isCreate) {
            url = 'sysadminFilter/insert-filter';
            method = 'put';
            filterInfoNew.updateUser = filterInfoNew.owner = {
                groupId: 0,
                id: 1,
                isSupper: false,
                locked: false,
                mobilePhone: '',
                password: '',
                userName: 'devtest'
            };
            filterInfoNew.createTime = filterInfoNew.updateTime = currentTime;
            const filterId = makeCRC32(`${filterInfoNew.name}~${this.props.match.params.moduleId}~${filterInfoNew.owner.id}`);
            filterInfoNew.id = filterId;
            filterInfoNew.filterModule = this.props.match.params.moduleId;
        } else {
            url = 'sysadminFilter/filter';
            method = 'post';
            filterInfoNew.updateUser = filterInfoNew.owner;
            filterInfoNew.updateTime = currentTime;
        }

        // 重新为每一个condition添加conditionId
        filterInfoNew.conditions = filterInfoNew.conditions.map((item) => {
            const conditionId = makeCRC32(`${filterInfoNew.id}~${filterInfoNew.name}~${item.name}`);

            const newItem = {
                ...item,
                filterId: filterInfoNew.id,
                id: conditionId
            };

            newItem.items = newItem.items.map((itemIn) => {
                return {
                    ...itemIn,
                    conditionId
                };
            });

            return newItem;
        });

        const saveProxy = (info) => {
            request(url, {
                type: method,
                baseUrlType: 'filter',
                data: {
                    filter: info,
                    iceEndpoint: 'SysadminServer:default -h 10.10.1.170 -p 4508'
                }
            }).then((res) => {
                this.props.history.goBack();
                // this.setState({
                //     filterInfo: res.data,
                //     isCreate: false,
                //     conditionTreeData: this.formatTreeData(res.data.conditions),
                // });
            });
        };
        if (this.actionFormRef.current) {
            this.actionFormRef.current.validateFields().then((values) => {
                let action = values;
                const formatUtil = moduleIdFormatMap[this.props.match.params.moduleId];

                if (formatUtil) {
                    action = formatUtil(values);
                }
                filterInfoNew.action = { ...action, belongRuleID: filterInfoNew.id };

                saveProxy(filterInfoNew);
            });
        } else {
            saveProxy(filterInfoNew);
        }
    };

    handleCancel = () => {
        this.props.history.goBack();
    };

    onStartUse = (e) => {
        this.setState({ filterInfo: { ...this.state.filterInfo, isValid: e.target.checked } });
    };

    onPrivateChange = (e) => {
        this.setState({ filterInfo: { ...this.state.filterInfo, isPrivate: e.target.checked } });
    };

    // 新建/编辑
    editConditionClick = (type) => {
        const { selectedKey, filterInfo } = this.state;

        if (type === 'new') {
            this.setState({
                isCreateCondition: true,
                conditionVisible: true,
                editingConditionInfo: {
                    name: `新建条件${filterInfo.conditions.length + 1}`,
                    isNegative: false,
                    items: []
                }
            });
        } else {
            this.setState({
                isCreateCondition: false,
                conditionVisible: true,
                editingConditionInfo: filterInfo.conditions[Number(selectedKey)]
            });
        }
    };

    onNameChange = (event) => {
        this.setState({ filterInfo: { ...this.state.filterInfo, name: event.target.value } });
    };

    onDescChange = (event) => {
        this.setState({ filterInfo: { ...this.state.filterInfo, description: event.target.value } });
    };

    handleVisibleChange = (visible) => {
        this.setState({ conditionVisible: visible });
    };

    // 新建/编辑条件确认
    onConditionConfirm = ({ name, isNegative, result }) => {
        const { selectedKey, filterInfo, isCreateCondition } = this.state;
        const newFilterInfo = _.cloneDeep(filterInfo);

        if (isCreateCondition) {
            newFilterInfo.conditions.push({
                name,
                isNegative,
                items: result
            });
        } else {
            newFilterInfo.conditions[Number(selectedKey)] = {
                name,
                isNegative,
                items: result
            };
        }
        const { conditionTreeData, expandedKeys } = this.formatTreeData(newFilterInfo.conditions);

        this.setState({ conditionTreeData, expandedKeys, filterInfo: newFilterInfo });
    };

    // 树节点选中
    onSelect = (keys, e) => {
        this.setState({ selectedKey: e.node.value ? keys[0] : '' });
    };

    onExpand = (expandedKeys, { expanded, node }) => {
        this.setState({ expandedKeys });
    };

    // 删除节点
    onDeleteCondition = () => {
        const { selectedKey, filterInfo } = this.state;
        const newConditions = filterInfo.conditions.filter((item, index) => `${index}` !== selectedKey);

        this.setState({
            selectedKey: '',
            filterInfo: { ...filterInfo, conditions: newConditions },
            conditionTreeData: this.formatTreeData(newConditions)
        });
    };

    render() {
        const { filterInfo, conditionVisible, isCreate, conditionTreeData, selectedKey, expandedKeys, editingConditionInfo } = this.state;
        const { match } = this.props;
        // 有右侧规则动作设置的ids
        const hasActionIds = ['1', '68'];
        const { moduleId } = match.params;

        const TypeContent = moduleIdEditContentMap[moduleId];

        // 需要显示私有选项字段的列表
        const showPrivateFields = ['filter'];

        const conditionEdit = (
            <Space className="condition-vertical-space-wrapper" direction="vertical" style={{ width: '100%', height: '100%' }}>
                <Space>
                    <Button type="primary" onClick={this.editConditionClick.bind(this, 'new')}>
                        新建
                    </Button>
                    <Button disabled={!selectedKey} onClick={this.editConditionClick.bind(this, 'edit')}>
                        编辑
                    </Button>
                    <Button disabled={!selectedKey} onClick={this.onDeleteCondition}>
                        删除
                    </Button>
                </Space>
                {conditionTreeData.length > 0 && (
                    <Tree
                        style={{ border: '1px solid rgba(14, 73, 127)', padding: 8 }}
                        onExpand={this.onExpand}
                        showLine={{ showLeafIcon: false }}
                        selectedKeys={[selectedKey]}
                        defaultExpandAll
                        expandedKeys={expandedKeys}
                        onSelect={this.onSelect}
                        treeData={conditionTreeData}
                    />
                )}
            </Space>
        );

        return (
            <PageContainer
                gridContentStyle={{ height: `calc(100% - 89px)` }}
                className="filter-edit-wrapper"
                title={
                    <div className="volume-title">
                        <span className="volume-form-box"></span>新建/编辑
                    </div>
                }
            >
                <Card>
                    <Row>
                        <Col span={24}>
                            <Form labelAlign="right" labelCol={{ span: 4 }}>
                                <Row style={{ height: 'calc(100% - 254px)' }}>
                                    <Col style={{ height: '100%' }} span={24}>
                                        <Row style={{ height: '100%' }}>
                                            <Col
                                                span={8}
                                                // style={{ textAlign: 'right', height: '100%', overflow: 'auto', lineHeight: '32px' }}
                                            >
                                                <Form.Item label="名称">
                                                    <Input value={filterInfo.name} onChange={this.onNameChange} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8} style={{ height: '100%' }}>
                                                <Form.Item label="创建人">
                                                    <Input disabled value={isCreate ? 'admin' : filterInfo.owner.userName} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6} offset={1} style={{ height: '100%', lineHeight: '32px' }}>
                                                <Checkbox checked={filterInfo.isValid} onChange={this.onStartUse}>
                                                    启用
                                                </Checkbox>
                                                {showPrivateFields.includes(match.params.moduleId) && (
                                                    <Checkbox checked={filterInfo.isPrivate} onChange={this.onPrivateChange}>
                                                        私有
                                                    </Checkbox>
                                                )}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ height: 'calc(100% - 254px)' }}>
                                    <Col style={{ height: '100%' }} span={24}>
                                        <Row style={{ height: '100%' }}>
                                            <Col
                                                span={16}
                                                // style={{ textAlign: 'right', height: '100%', overflow: 'auto', lineHeight: '32px' }}
                                            >
                                                <Form.Item label="描述" labelCol={{ span: 2 }}>
                                                    <Input.TextArea value={filterInfo.description} onChange={this.onDescChange} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {hasActionIds.includes(match.params.moduleId) && (
                                    <Row style={{ height: 'calc(100% - 254px)' }}>
                                        <Col style={{ height: '100%' }} span={24}>
                                            <Row style={{ height: '100%' }}>
                                                <Col
                                                    span={16}
                                                    // style={{ textAlign: 'right', height: '100%', overflow: 'auto', lineHeight: '32px' }}
                                                >
                                                    <Form.Item label="条件编辑：" labelCol={{ span: 2 }}>
                                                        <div>{conditionEdit}</div>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                )}
                            </Form>
                        </Col>
                    </Row>

                    {!hasActionIds.includes(match.params.moduleId) && (
                        <Row style={{ height: 'calc(100% - 254px)' }}>
                            <Col
                                style={{
                                    border: '1px solid #0E497F',
                                    // height: '100%',
                                    overflow: 'auto',
                                    padding: '16px'
                                }}
                                span={6}
                                offset={1}
                            >
                                <div style={{ lineHeight: '32px', marginBottom: '16px' }}>条件编辑：</div>
                                {conditionEdit}
                            </Col>
                            <Col
                                style={{
                                    border: '1px solid #0E497F',
                                    marginLeft: '16px',
                                    padding: '16px',
                                    // height: '100%',
                                    overflow: 'auto'
                                }}
                                span={16}
                            >
                                <TypeContent initialValues={filterInfo.actions} ref={this.actionFormRef} />
                            </Col>
                        </Row>
                    )}
                    <Row style={{ padding: '16px 0' }}>
                        <Col span={24}>
                            <div style={{ textAlign: 'center' }}>
                                <Space>
                                    <Button type="primary" onClick={this.handleSave}>
                                        保存
                                    </Button>
                                    <Button onClick={this.handleCancel}>取消</Button>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                    {conditionVisible && (
                        <ConditionModal
                            conditionInfo={editingConditionInfo}
                            onConfirm={this.onConditionConfirm}
                            onVisibleChange={this.handleVisibleChange}
                            visible={conditionVisible}
                        />
                    )}
                </Card>
            </PageContainer>
        );
    }
}

export default index;
