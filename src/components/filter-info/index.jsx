import React from 'react';
import { Button, Input, Space, Form, Row, Col, Card, Divider } from 'oss-ui';
import request from '@Src/common/api';
import './index.less';
import { FILTER_EMUN } from '@Src/pages/setting/filter/index';
import ConditionTree from '@Components/condition-tree';
import { useEnvironmentModel } from '@Src/hox';
import { _ } from 'oss-web-toolkits';

const SHOW_DELAY_TIME = useEnvironmentModel?.data?.environment?.version === 'unicom';
export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.treeRef = React.createRef();
        this.state = {
            expandAllTextStatus: true,
            filterInfo: {},
            treeData: {},
        };
    }

    componentDidMount() {
        const { data, type } = this.props;
        if (type === 'history' && data && data.filterId) {
            this.getHistoryData();
        } else if (data && data.filterId) {
            this.getFilterInfo();
        }
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    getHistoryData = () => {
        const { data } = this.props;
        this.setState({
            filterInfo: _.cloneDeep(data),
            treeData: data?.filterExpr?.filterConditionList,
        });
    };

    getFilterInfo = () => {
        const { data, moduleId } = this.props;
        if (!data || !data.filterId) {
            this.setState({
                filterInfo: {},
                treeData: [],
            });
            return;
        }
        request('alarmmodel/filter/v1/filter', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                modelId: 2,
                moduleId: moduleId || data.moduleId,
                filterId: data.filterId,
            },
        }).then((res) => {
            if (res && res.data) {
                this.setState({
                    filterInfo: _.cloneDeep(res.data),
                    treeData: res.data.filterExpr.filterConditionList,
                });
            }
        });
    };

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            if (this.props.type !== 'history') {
                this.getFilterInfo();
            } else {
                this.getHistoryData();
            }
        }
    }

    expandAllSwitchClick = () => {
        const { expandAllTextStatus } = this.state;

        this.setState({
            expandAllTextStatus: !expandAllTextStatus,
        });
    };

    // 搜索过滤条件
    searchCondition = (value) => {
        const { filterInfo } = this.state;
        const showData = [];
        const fullData = _.cloneDeep(_.get(filterInfo, 'filterExpr.filterConditionList', []));
        if (fullData.length) {
            _.forEach(fullData, (item) => {
                if (item.conditionLabel.includes(value)) {
                    showData.push(item);
                } else {
                    const searchConditionItem =
                        item.conditionExpr.conditionItemList && item.conditionExpr.conditionItemList.length
                            ? _.find(item.conditionExpr.conditionItemList, (s) => s.fieldLabel.includes(value))
                            : null;
                    if (searchConditionItem) {
                        item.conditionExpr.conditionItemList = item.conditionExpr.conditionItemList.filter((s) => s.fieldLabel.includes(value));
                        showData.push(item);
                    } else {
                        const conditionItemList = _.find(item.conditionExpr.conditionItemList, (conditionItem) => {
                            return _.find(conditionItem.valueList, (valueItem) => valueItem.value.includes(value));
                        });
                        if (conditionItemList) {
                            item.conditionExpr.conditionItemList = item.conditionExpr.conditionItemList.filter((conditionItem) =>
                                _.find(conditionItem.valueList, (valueItem) => valueItem.value.includes(value)),
                            );
                            _.forEach(item.conditionExpr.conditionItemList, (conditionItem) => {
                                conditionItem.valueList = conditionItem.valueList.filter((valueItem) => valueItem.value.includes(value));
                            });
                            showData.push(item);
                        }
                    }
                }
            });
            this.setState({
                treeData: showData,
            });
        }
    };

    // getBaseInfo = (data, modelId) => {
    //     const filterArr = [
    //         {
    //             label: '名称',
    //             value: data.filterName || '',
    //             key: 'filterName',
    //             span: 1,
    //         },
    //         {
    //             label: '创建人',
    //             value: data.creator || '',
    //             key: 'creator',
    //             span: 1,
    //         },
    //         {
    //             label: '创建时间',
    //             key: 'createTime',
    //             value: data.createTime || '',
    //             span: 1,
    //         },
    //         {
    //             label: '最近调用',
    //             key: 'modifyTime',
    //             value: data.modifyTime || '',
    //             span: 1,
    //         },
    //         {
    //             label: '是否私有',
    //             key: 'isPrivate',
    //             value: data.isPrivate ? (data.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE ? '是' : '否') : '',
    //             span: 1,
    //         },
    //         {
    //             label: '是否启用',
    //             key: 'enable',
    //             value: data.enable ? (data.enable === FILTER_EMUN.ENABLE.TRUE ? '是' : '否') : '',
    //             span: modelId === 1 ? 1 : 2,
    //         },
    //         {
    //             label: '描述',
    //             key: 'filterDesc',
    //             value: data.filterDesc || '',
    //             span: 2,
    //         },
    //     ];

    //     if (modelId === 1) {
    //         return filterArr;
    //     } else {
    //         const ruleArr = _.remove(filterArr, (item) => {
    //             return !(item.key === 'isPrivate');
    //         });
    //         return ruleArr;
    //     }
    // };

    render() {
        const { expandAllTextStatus, treeData, filterInfo } = this.state;
        const { moduleId } = this.props;
        const moduleIdMap = {
            10: '故障派单规则',
            604: '高铁派单规则',
            605: '督办派单规则',
            606: '共建共享派单规则',
        };
        const currentModuleId = moduleId ? Number(moduleId) : Number(filterInfo.moduleId);
        // const data = this.getBaseInfo(filterInfo, currentModuleId);

        return (
            <Card className="filter-show-content">
                {/* <Descriptions column={2} bordered>
                    {_.map(data, (item) => {
                        return (
                            <Descriptions.Item label={item.label} span={item.span}>
                                {item.value}
                            </Descriptions.Item>
                        );
                    })}
                </Descriptions> */}
                <Form labelAlign="right" name="baseFilterForm">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} label="名称">
                                <Input disabled value={filterInfo.filterName || ''} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} label="创建人">
                                <Input disabled value={filterInfo.creator || ''} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} label="创建时间">
                                <Input disabled value={filterInfo.createTime || ''} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} label="修改时间">
                                <Input disabled value={filterInfo.modifyTime || ''} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} label="归属省份">
                                <Input disabled value={filterInfo.filterProvinceLabel || ''} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} label="归属专业">
                                <Input.TextArea disabled value={filterInfo.filterProfessionalLabel || ''} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} label="规则类型">
                                <Input disabled value={moduleIdMap[filterInfo.moduleId] || ''} />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* currentModuleId === 1 ? (
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item labelCol={{ span: 6 }} label="是否私有">
                                    <Input
                                        disabled
                                        value={filterInfo.isPrivate ? (filterInfo.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE ? '是' : '否') : ''}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item labelCol={{ span: 6 }} label="是否启用">
                                    <Input disabled value={filterInfo.enable ? (filterInfo.enable === FILTER_EMUN.ENABLE.TRUE ? '是' : '否') : ''} />
                                </Form.Item>
                            </Col>
                        </Row>
                    ) : (
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item labelCol={{ span: 6 }} disabled label="是否启用">
                                    <Input disabled value={filterInfo.enable ? (filterInfo.enable === FILTER_EMUN.ENABLE.TRUE ? '是' : '否') : ''} />
                                </Form.Item>
                            </Col>
                        </Row>
                    ) */}

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item labelCol={{ span: 3 }} disabled label="描述" style={{ marginBottom: 0 }}>
                                <Input.TextArea style={{ resize: 'none', height: '30px' }} disabled value={filterInfo.filterDesc || ''} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <Divider className="volume-divider" dashed />
                <div className="filter-condition-show">
                    <div style={{ width: '50%' }}>
                        {/* <Space>
                            <Button onClick={this.expandAllSwitchClick}>{!expandAllTextStatus ? '一键展开' : '一键折叠'}</Button>
                            <Input.Search enterButton onSearch={this.searchCondition} placeholder="请输入过滤条件" allowClear />
                        </Space> */}
                        <ConditionTree ref={this.treeRef} data={treeData} expandAll={expandAllTextStatus}></ConditionTree>
                    </div>
                    {SHOW_DELAY_TIME && moduleId === '1' && (
                        <div style={{ flex: '1' }}>
                            <div style={{ paddingLeft: 12, display: 'flex' }}>
                                <span
                                    style={{
                                        whiteSpace: 'nowrap',
                                        textAlign: 'right',
                                        verticalAlign: 'middle',
                                        flex: '0 0 25%',
                                        // maxWidth: '25%',
                                        lineHeight: '28px',
                                    }}
                                >
                                    监控呈现延时：
                                </span>
                                <Input
                                    style={{ flex: '1' }}
                                    value={_.find(filterInfo.filterProperties, { key: 'max_delay_time_seconds' })?.value}
                                    disabled
                                    addonAfter={_.find(filterInfo.filterProperties, { key: 'unit' })?.value === '0' ? '秒' : '分钟'}
                                ></Input>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        );
    }
}
