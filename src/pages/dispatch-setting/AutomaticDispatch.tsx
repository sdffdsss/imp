import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Form, Card, List, Menu, Button, Space, message, Spin } from 'oss-ui';
import { InfiniteScroll } from 'antd-mobile';
import ConditionEdit from '@Components/condition-edit';
import {
    getDispatchAutoPublishApi,
    addDispatchAutoConfigApi,
    getDispatchAutoConfigApi,
    publishDispatchAutoConfigApi,
    recoverDispatchAutoPublishConfigApi,
} from './api';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';

const FILTER_EMUN = {
    ENABLE: {
        TRUE: 1,
        FALSE: 2,
    },
    REVERSE: {
        TRUE: 1,
        FALSE: 2,
    },
    ORDER: {
        ASC: 1,
        DESC: 2,
    },
    ISPRIVATE: {
        TRUE: 1,
        FALSE: 2,
    },
    COMPARETYPE: {
        EQ: 'eq', // 等于
        LE: 'le',
        LT: 'lt',
        GE: 'ge',
        GT: 'gt',
        LIKE: 'like',
        IN: 'in',
        BETWEEN: 'between',
        ISNULL: 'is_null',
        NOTNULL: 'not_null',
        MIX: 'mix',
    },
};
const topFieldNames = 'org_type,network_type_top,province_id,professional_type,alarm_title';
const defaultFilterConditionList = () => {
    return [
        {
            fieldLabel: '省份名称',
            fieldName: 'province_id',
            dataType: 'integer',
            itemDesc: '1',
            reverse: 2,
            compareType: 'in',
            valueList: [],
        },
        {
            fieldLabel: '告警类别',
            fieldName: 'org_type',
            dataType: 'integer',
            itemDesc: '1',
            reverse: 2,
            compareType: 'in',
            valueList: [
                {
                    key: '1',
                    value: '设备告警',
                },
                {
                    key: '2',
                    value: '性能告警',
                },
            ],
        },
        {
            fieldLabel: '一级网络类型',
            fieldName: 'network_type_top',
            dataType: 'integer',
            itemDesc: '1',
            reverse: 2,
            compareType: 'in',
            valueList: [
                {
                    key: '0',
                    value: '总部',
                },
            ],
        },
        {
            fieldLabel: '专业',
            fieldName: 'professional_type',
            dataType: 'integer',
            itemDesc: '1',
            reverse: 2,
            compareType: 'in',
            valueList: [],
        },
    ];
};
const AutomaticDispatch = () => {
    const treeHeight = `calc(100vh - 366px)`;
    const [filterExprVersionThree, setFilterExprVersionThree] = useState({ filterConditionList: [], logicalType: null });
    const [filterExprVersionTwo, setFilterExprVersionTwo] = useState({ filterConditionList: [], logicalType: null });
    const [selectedKeys, setSelectedKeys] = useState(['0']);
    const pagetions = useRef({ pageNum: 0, total: 20 });
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loadingDispatch, setLoadingDispatch] = useState(false);
    const [editFlag, setEditFlag] = useState(true);
    const { configType } = useParams();

    const onChangeTreeDataTwo = (newTreeData, newLogicalType) => {
        setEditFlag(false);
        setFilterExprVersionTwo({ filterConditionList: newTreeData, logicalType: newLogicalType });
    };
    const onChangeTreeDataThree = (newTreeData, newLogicalType) => {
        setEditFlag(false);
        setFilterExprVersionThree({ filterConditionList: newTreeData, logicalType: newLogicalType });
    };
    const getData = async (num) => {
        if (pagetions.current.pageNum === num || pagetions.current.pageNum * 50 >= pagetions.current.total) {
            return;
        }
        const result = await getDispatchAutoPublishApi({ current: num, pageSize: 50 });
        if (result.data) {
            setDataSource(result.data);
        }
        if (result) {
            const { current, total } = result;
            pagetions.current = {
                pageNum: current,
                total,
            };
            setLoading(current * 20 < total);
        }
    };
    const addSave = async () => {
        const data = {
            filterExprVersionThree,
            filterExprVersionTwo,
        };
        if (data.filterExprVersionThree.filterConditionList.length === 0 || data.filterExprVersionTwo.filterConditionList.length === 0) {
            message.success('条件不能为空');
            return;
        }
        const result = await addDispatchAutoConfigApi({
            dispatchAutoEnvironmentConfig: data,
            operateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            publishStatus: 0,
            configType,
        });
        if (result.data) {
            setEditFlag(true);
            message.success('保存成功');
        }
    };
    const onSearch = async () => {
        setSelectedKeys(['0']);
        const result = await getDispatchAutoConfigApi(configType);
        if (result?.data?.dispatchAutoEnvironmentConfig) {
            setFilterExprVersionThree(result.data.dispatchAutoEnvironmentConfig.filterExprVersionThree);
            setFilterExprVersionTwo(result.data.dispatchAutoEnvironmentConfig.filterExprVersionTwo);
        }
    };
    const publish = async () => {
        setLoadingDispatch(true);
        const res = await getDispatchAutoConfigApi(configType);
        if (res?.data?.dispatchAutoEnvironmentConfig && res?.data?.dispatchAutoConfigId) {
            const result = await publishDispatchAutoConfigApi({
                ...res.data, operateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                publishStatus: 1,
                configType
            });
            if (result.data) {
                pagetions.current = { pageNum: 0, total: 20 };
                setLoading(true);
                onSearch();
                getData(1);
                setSelectedKeys(['0']);
                setLoadingDispatch(false);
                message.success('发布成功');
            }
            return;
        }
        // message.error('请先保存最新草稿再发布');
    };
    useEffect(() => {
        onSearch();
    }, []);
    const cancel = async () => {
        const result = await recoverDispatchAutoPublishConfigApi({ dispatchAutoConfigId: selectedKeys[0] });
        if (result.data) {
            message.success('恢复成功');
            onSearch();
            setSelectedKeys(['0']);
        }
    };
    const onPushlishChange = (item) => {
        setSelectedKeys([`${item.dispatchAutoConfigId}`]);
        setFilterExprVersionThree(item.dispatchAutoEnvironmentConfig.filterExprVersionThree);
        setFilterExprVersionTwo(item.dispatchAutoEnvironmentConfig.filterExprVersionTwo);
    };
    return (
        <div className="automatic-dispatch-page" style={{ height: '100%' }}>
            <Spin spinning={loadingDispatch} tip="发布时间稍长,请耐心等候">
                <Form labelAlign="right" style={{ height: '100%' }} labelCol={{ span: 6 }}>
                    <Row style={{ height: '100%' }}>
                        <Col span={4} style={{ height: '100%' }}>
                            <Card bordered={true} style={{ height: '100%', paddingRight: 0 }}>
                                <div>
                                    <List
                                        size="small"
                                        header={'未发布'}
                                        dataSource={['草稿']}
                                        renderItem={(item) => (
                                            <Menu selectedKeys={selectedKeys} onClick={onSearch} style={{ width: '100%' }}>
                                                <Menu.Item key={'0'}>{item}</Menu.Item>
                                            </Menu>
                                        )}
                                    />
                                </div>
                                <div style={{ paddingLeft: '10px', overflowY: 'auto' }}>
                                    <List
                                        size="small"
                                        header={'已发布'}
                                        dataSource={dataSource}
                                        renderItem={(item, index) => (
                                            <Menu selectedKeys={selectedKeys} onClick={() => onPushlishChange(item)} style={{ width: '100%' }}>
                                                <Menu.Item key={`${item.dispatchAutoConfigId}`}>
                                                    {item.operateTime}
                                                    {!index ? <Button type="link">当前版本</Button> : ''}
                                                </Menu.Item>
                                            </Menu>
                                        )}
                                    />
                                    <InfiniteScroll threshold={20} loadMore={() => getData(pagetions.current.pageNum + 1)} hasMore={loading} />
                                </div>
                            </Card>
                        </Col>
                        <Col span={20} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: 10, textAlign: 'right' }}>
                                {selectedKeys[0] === '0' ? (
                                    <Space>
                                        <Button type="primary" onClick={addSave}>
                                            保存
                                        </Button>
                                        <Button type="primary" disabled={!editFlag} onClick={publish}>
                                            发布
                                        </Button>
                                    </Space>
                                ) : (
                                    <Button type="primary" onClick={cancel}>
                                        恢复至草稿
                                    </Button>
                                )}
                            </div>
                            <Row style={{ flex: 1 }}>
                                <Col span={12}>
                                    <Card bordered={true} style={{ height: '100%', padding: '0 20px' }}>
                                        <Form.Item
                                            label="派单环境"
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 18 }}
                                        // name="refRuleFlag"
                                        >
                                            <strong>2.0 正式环境</strong>
                                        </Form.Item>

                                        <Form.Item shouldUpdate noStyle>
                                            {({ getFieldValue }) => (
                                                <Form.Item
                                                    label="自动派单条件"
                                                    labelCol={{ span: 6 }}
                                                    wrapperCol={{ span: 28 }}
                                                    name="condition"
                                                // rules={[
                                                //     {
                                                //         required: true,
                                                //         message: '请编辑监测器条件'
                                                //     }
                                                // ]}
                                                >
                                                    <ConditionEdit
                                                        // disabled={getFieldValue('refRuleFlag') === 1}
                                                        moduleId={10}
                                                        treeHeight={treeHeight}
                                                        treeData={filterExprVersionTwo.filterConditionList}
                                                        FILTER_EMUN={FILTER_EMUN}
                                                        // onChange={this.onChangeTreeData}
                                                        // disabledFields={this.provinceId ? ['province_id'] : undefined}
                                                        disabledFields={[]}
                                                        onChange={onChangeTreeDataTwo}
                                                        isCheck={false}
                                                        // defaultFilterConditionList={[]}
                                                        topFieldNames={topFieldNames}
                                                        defaultFilterConditionList={defaultFilterConditionList()}
                                                    />
                                                </Form.Item>
                                            )}
                                        </Form.Item>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card bordered={true} style={{ height: '100%', padding: '0 20px' }}>
                                        <Form.Item
                                            label="派单环境"
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 18 }}
                                        // name="refRuleFlag"
                                        >
                                            <strong>3.0 正式环境</strong>
                                        </Form.Item>

                                        <Form.Item shouldUpdate noStyle>
                                            {({ getFieldValue }) => (
                                                <Form.Item
                                                    label="自动派单条件"
                                                    labelCol={{ span: 6 }}
                                                    wrapperCol={{ span: 28 }}
                                                    name="condition3"
                                                // rules={[
                                                //     {
                                                //         required: true,
                                                //         message: '请编辑监测器条件'
                                                //     }
                                                // ]}
                                                >
                                                    <ConditionEdit
                                                        // disabled={getFieldValue('refRuleFlag') === 1}
                                                        moduleId={10}
                                                        treeHeight={treeHeight}
                                                        treeData={filterExprVersionThree.filterConditionList}
                                                        FILTER_EMUN={FILTER_EMUN}
                                                        onChange={onChangeTreeDataThree}
                                                        // disabledFields={this.provinceId ? ['province_id'] : undefined}
                                                        isCheck={false}
                                                        // defaultFilterConditionList={[]}
                                                        topFieldNames={topFieldNames}
                                                        defaultFilterConditionList={defaultFilterConditionList()}
                                                    />
                                                </Form.Item>
                                            )}
                                        </Form.Item>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </div>
    );
};
export default AutomaticDispatch;
