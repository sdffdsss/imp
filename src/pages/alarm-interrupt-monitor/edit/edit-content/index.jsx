import React from 'react';
import ConditionEdit from '@Components/condition-edit';
import { Card, Form, Input, Row, Col, Select, Button, Space, Radio, Switch, message, Tabs, Spin } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { withRouter } from 'react-router';
import { filterApi } from '../../../../common/api/service/filterApi';
import { _ } from 'oss-web-toolkits';
import Field from '@ant-design/pro-field';
import AuthButton from '@Src/components/auth-button';
import request from '@Common/api';
import './index.less';
import { monitor } from '@Common/api/service/monitor';
import ConditionTree from '@Components/condition-tree';
import constants from '@Src/common/constants';

export const FILTER_EMUN = {
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

class EditContent extends React.PureComponent {
    constructor(props) {
        console.log(props);
        super(props);
        this.formRef = React.createRef();
        this.mode = props.mode || 'edit';
        this.state = {
            monitorInfo: {},
            filterInfo: {
                filterName: '',
                filterDesc: '',
                enable: FILTER_EMUN.ENABLE.TRUE,
                isPrivate: FILTER_EMUN.ISPRIVATE.FALSE,
                creator: props.login.userId,
                filterExpr: { filterConditionList: [], logicalType: null },
                modelId: 2,
                moduleId: this.mode === 'read' ? Number(props.modeParams.moduleId) : Number(props.match.params.moduleId),
            },
            modelType: this.mode === 'read' ? this.props.modeParams.type : this.props.match.params.type,
            moduleId: this.mode === 'read' ? this.props.modeParams.moduleId : this.props.match.params.moduleId,
            monitorId: this.mode === 'read' ? this.props.modeParams.id : this.props.match.params.id,
            provinceId: Number(this.props.match.params.provinceId),
            unitList: [
                {
                    id: 'M',
                    text: '分',
                },
                {
                    id: 'H',
                    text: '时',
                },
            ],
            unitTag: 'M',
            minuteList: [
                {
                    value: '5',
                    label: '5',
                },
                {
                    value: '10',
                    label: '10',
                },
                {
                    value: '15',
                    label: '15',
                },
                {
                    value: '30',
                    label: '30',
                },
            ],
            hourList: [
                {
                    value: '1',
                    label: '1',
                },
                {
                    value: '2',
                    label: '2',
                },
                {
                    value: '4',
                    label: '4',
                },
                {
                    value: '8',
                    label: '8',
                },
                {
                    value: '24',
                    label: '24',
                },
                {
                    value: '36',
                    label: '36',
                },
            ],
            filterList: [],
            filterConditionList: [],
            saveLoading: false,
            viewNameList: [],
            viewDataList: [],
            filterIdList: [],
            filterNameList: [],
            spinVisible: false,
            editName: '',
        };
    }

    get api() {
        return filterApi;
    }

    get monitorApi() {
        return monitor;
    }

    get provinceId() {
        return this.props.match?.params?.provinceId;
    }

    get provinceName() {
        return this.props.match?.params?.provinceName;
    }

    // get initialValues() {
    //     return {
    //         refRuleFlag: 0,
    //         Monitor_time_unit: 'M',
    //         send_interrupt_msg: false,
    //     };
    // }

    async componentDidMount() {
        this.setState({
            spinVisible: true,
        });
        await this.getTableData();
        this.setState({
            spinVisible: false,
        });
        const { modelType } = this.state;
        // this.getfilterList();
        if (modelType !== 'new') {
            this.getDetail();
        }
    }

    // 获取视图数据
    getTableData = async () => {
        const {
            login: { userId },
        } = this.props;
        const viewProvince = this.mode === 'read' ? this.props.modeParams?.provinceId : this.props.location?.state?.province_id;
        const queryParam = {
            current: 1,
            pageSize: 9999,
            showType: 2,
            userId,
            windowType: 1,
            viewProvince,
        };

        const result = await request('v1/monitor-view', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        });
        this.formRef?.current?.setFieldsValue({
            creator: this.props.login.userName,
        });
        this.setState({
            viewNameList: result.data.map((item) => ({ label: item.windowName, value: item.windowId })),
            viewDataList: result.data,
        });
    };

    // 获取编辑详情
    getDetail = async () => {
        // const { moduleId } = this.state;
        // const filterId = this.mode === 'read' ? this.props.modeParams.id : this.props.match.params.id;
        // const filterInfo = await this.api.getFilterDetail({
        //     modelId: 2,
        //     moduleId,
        //     filterId,
        // });
        // this.setState({
        //     filterInfo,
        // });
        // const { filterName, filterDesc, refRuleId, filterProperties, refRuleFlag, creator } = filterInfo;
        // const properties = this.transformFilterProperties(filterProperties);
        // this.formRef?.current?.setFieldsValue({
        //     filterName,
        //     filterDesc,
        //     refRuleId,
        //     refRuleFlag,
        //     ...properties,
        //     creator,
        //     send_interrupt_msg: properties.send_interrupt_msg === '1',
        // });
        const monitorId = this.mode === 'read' ? this.props.modeParams.id : Number(this.props.match.params.id);
        const monitorInfo = await this.monitorApi.getMontiorData(monitorId);
        this.setState({
            monitorInfo: monitorInfo?.data,
            editName: monitorInfo.data?.monitorName,
        });
        const { monitorDesc, monitorName, sendStatus, timeValue, windowId, creator } = monitorInfo.data || {};
        const timeUnit = monitorInfo.data.timeUnit === 1 ? 'M' : 'H';
        this.formRef?.current?.setFieldsValue({
            monitorName,
            monitorDesc,
            windowId: Number(windowId),
            timeUnit,
            timeValue,
            creator: creator || this.props.login.userName,
            sendStatus: sendStatus ? true : false,
        });
        this.viewSelectChange(Number(windowId));
    };

    transformFilterProperties(arr) {
        const result = {};
        arr?.forEach((item) => {
            const { value, key } = item;
            result[key] = value;
        });
        return result;
    }

    // 已有过滤器下拉框
    // getfilterList = async () => {
    //     const creator = this.props.login.userId;
    //     const result = await this.api.getFilterNameList({
    //         creator,
    //         modelId: 2,
    //         moduleId: 1,
    //         current: 1,
    //         filterProvince: this.provinceId,
    //         pageSize: 9999,
    //     });
    //     this.setState({
    //         filterList: result.map((item) => ({ label: item.filterName, value: item.filterId })),
    //     });
    // };

    // 保存
    handleSave = async (params) => {
        try {
            this.setState({ saveLoading: true });
            // let { filterInfo } = this.state;
            const { modelType, monitorId, provinceId } = this.state;
            // filterInfo = _.cloneDeep(filterInfo);
            const { userId } = this.props.login;
            const values = await this.formRef?.current?.validateFields();

            const { creator, monitorDesc, monitorName, sendStatus, timeValue, windowId } = values || {};
            const timeUnit = values.timeUnit === 'M' ? 1 : 2;
            // const { filterName, refRuleFlag, refRuleId, filterDesc, Monitor_time, Monitor_time_unit, send_interrupt_msg, window_id } = values;
            // 如果当前用户是省级用户则默认加上省id
            // const provinceTarget = filterInfo.filterExpr.filterConditionList.find((item) => {
            //     const target = item.conditionExpr.conditionItemList.find((conditionItem) => conditionItem.fieldName === 'province_id');
            //     return !!target;
            // });
            // if (this.provinceId && !provinceTarget) {
            //     filterInfo.filterExpr.filterConditionList.push({
            //         conditionExpr: {
            //             logicalType: null,
            //             conditionItemList: [
            //                 {
            //                     compareType: 'in',
            //                     dataType: 'integer',
            //                     fieldLabel: '省Id',
            //                     fieldName: 'province_id',
            //                     itemDesc: 1,
            //                     reverse: 2,
            //                     valueList: [{ key: this.provinceId, value: this.provinceName }],
            //                 },
            //             ],
            //         },
            //         conditionLabel: `新建条件${filterInfo.filterExpr.filterConditionList.length + 1}`,
            //         reverse: 2,
            //     });
            //     if (filterInfo.filterExpr.filterConditionList.length >= 2) {
            //         filterInfo.filterExpr.logicalType = 'or';
            //     }
            // }
            // const data = {
            //     alarmModelFilter: {
            //         // ...filterInfo,
            //         filterName,
            //         filterDesc,
            //         refRuleFlag,
            //         refRuleId,
            //         filterMode: 2,
            //         // filterProvince: this.provinceId,
            //         enableEndTime: '', // 规则启用时间
            //         enableStartTime: '', // 规则停用时间
            //         ruleGroupNameId: '', // 规则所属组名称ID，可空
            //         filterProperties: [
            //             {
            //                 key: 'Monitor_time', // 属性名
            //                 value: Monitor_time, // 属性值
            //             },
            //             {
            //                 key: 'Monitor_time_unit', // 属性名
            //                 value: Monitor_time_unit, // 属性值
            //             },
            //             {
            //                 key: 'send_interrupt_msg', // 属性名
            //                 value: send_interrupt_msg ? '1' : '0', // 属性值
            //             },
            //             {
            //                 key: 'window_id', // 属性名
            //                 value: window_id, // 属性值
            //             },
            //         ],
            //     },
            // };
            // if (modelType === 'new') {
            //     data.alarmModelFilter.creator = userId;
            //     await this.api.addFilter(data, params);
            // }
            // if (modelType === 'edit') {
            //     data.alarmModelFilter.modifier = userId;
            //     await this.api.editFilter(data, params);
            // }

            const data = {
                monitorName,
                timeValue: Number(timeValue),
                timeUnit,
                monitorDesc,
                sendStatus: sendStatus ? 1 : 0,
                windowId: String(windowId),
            };

            let result = await this.monitorApi.checkMontior({ monitorName });

            if (result?.code === 0 && this.state.editName !== monitorName) return message.error(result?.msg);

            let res = {};

            if (modelType === 'new') {
                data.creator = creator || this.props.login.userName;
                data.provinceId = provinceId;
                data.userId = userId;
                res = await this.monitorApi.addMonitorData(data);
            }
            if (modelType === 'edit') {
                data.monitorId = Number(monitorId);
                res = await this.monitorApi.updateMonitorData(data);
            }

            const { code, msg } = res;

            if (code === 1) {
                this.handleCancel();
            }
        } finally {
            this.setState({ saveLoading: false });
        }
    };

    handleCancel = () => {
        this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-interrupt-monitor/${this.state.moduleId}`);
    };

    // onChangeTreeData = (newTreeData, newLogicalType) => {
    //     const { filterInfo } = this.state;
    //     this.setState({
    //         filterInfo: {
    //             ...filterInfo,
    //             filterExpr: { filterConditionList: newTreeData, logicalType: newLogicalType },
    //         },
    //     });
    // };

    // onRefRuleFlagChange = (value) => {
    //     console.log(value);
    //     const { filterInfo } = this.state;
    //     filterInfo.filterExpr = { filterConditionList: [], logicalType: null };
    //     this.setState({ filterInfo });
    //     this.formRef?.current?.setFieldsValue({ refRuleFlag: value.target.value });
    // };

    // 选择已有过滤器查询监测器条件
    // onOldFilterSelected = async (filterId) => {
    //     const { moduleId, filterInfo } = this.state;
    //     const result = await this.api.getFilterDetail({ modelId: 2, moduleId, filterId });
    //     this.setState({
    //         filterInfo: { ...filterInfo, filterExpr: result.filterExpr },
    //     });
    // };

    // 选择已有视图查询视图列表数据
    onViewSelected = () => {};

    // 监测周期校验
    // validateTime = async (rule, value) => {
    //     if (Number.isNaN(value) || Number(value) < 0 || value.includes('.')) {
    //         throw new Error('请输入一个正整数');
    //     }
    // };

    defaultFilterConditionList = (provinceName) => {
        const { userInfo, systemInfo } = this.props.login;
        const { zones } = JSON.parse(userInfo);
        return [
            {
                fieldLabel: '省份名称',
                fieldName: 'province_id',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList:
                    zones[0].zoneLevel === '5' || zones[0].zoneLevel === '1'
                        ? []
                        : zones[0].zoneLevel === '3'
                        ? [
                              {
                                  key: this.getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo),
                                  value: provinceName,
                              },
                          ]
                        : [
                              {
                                  key: this.getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo),
                                  value: zones[0].zoneName,
                              },
                          ],
            },
        ];
    };

    getInitialProvince = (province, userInfo) => {
        const info = userInfo && JSON.parse(userInfo);
        let initialProvince = info.zones[0]?.zoneId;
        if (province) {
            return (initialProvince = province);
        }
        if (info.zones[0]?.zoneLevel === '3') {
            initialProvince = info.zones[0]?.parentZoneId;
        }
        return initialProvince;
    };

    unitChange = (value) => {
        this.formRef?.current?.setFieldsValue({
            timeValue: null,
            timeUnit: value,
        });
        this.setState({
            unitTag: value,
        });
    };

    tabChange = async (key) => {
        const result = await this.api.getFilterDetail({ modelId: 2, moduleId: 1, filterId: key });
        const filterInfo = this.state;
        this.setState({
            filterInfo: { ...filterInfo, filterExpr: result.filterExpr },
        });
    };

    viewSelectChange = (value) => {
        const target = this.state.viewDataList.find((item) => item.windowId === value);
        this.setState({
            filterIdList: target.filterIdList.split(','),
            filterNameList: target.filterNameList.split(','),
        });
        const defaultKey = target.filterIdList.split(',')[0];
        this.tabChange(defaultKey);
    };

    render() {
        const { TextArea } = Input;
        const {
            filterInfo,
            unitList,
            filterList,
            modelType,
            saveLoading,
            minuteList,
            hourList,
            unitTag,
            viewNameList,
            viewDataList,
            filterIdList,
            filterNameList,
            spinVisible,
            monitorInfo,
        } = this.state;
        const treeHeight = `calc(100vh - 366px)`;

        return (
            <Card bodyStyle={{ height: '100%', overflow: 'auto' }} style={{ height: '100%' }}>
                {spinVisible && (
                    <Spin
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                            background: 'rgba(255, 255, 255, 0.5)',
                        }}
                    />
                )}
                <div style={{ height: `calc(100% - 60px)` }}>
                    <Form labelAlign="right" ref={this.formRef} labelCol={{ span: 6 }}>
                        <Row>
                            <Col span={11}>
                                <Card bordered={false} style={{ height: '100%' }}>
                                    <Form.Item
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 14 }}
                                        label="监测器名称"
                                        name="monitorName"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入监测器名称',
                                            },
                                        ]}
                                    >
                                        <Field
                                            mode={this.mode}
                                            renderFormItem={() => {
                                                return <Input allowClear />;
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label="创建人" name="creator">
                                        <Field
                                            mode={this.mode}
                                            renderFormItem={() => {
                                                return <Input disabled />;
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <label>
                                                <span className="label-required">*</span>监测周期
                                            </label>
                                        }
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 14 }}
                                    >
                                        <Row gutter={20}>
                                            <Col span={this.mode === 'read' ? 6 : 18}>
                                                <Form.Item
                                                    name="timeValue"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择监测周期',
                                                        },
                                                        // {
                                                        //     validator: this.validateTime,
                                                        //     message: '请输入一个正整数',
                                                        // },
                                                    ]}
                                                >
                                                    <Field
                                                        mode={this.mode}
                                                        renderFormItem={() => {
                                                            const timeList = unitTag === 'M' ? minuteList : hourList;
                                                            return (
                                                                <Select
                                                                    placeholder="请选择"
                                                                    options={timeList}
                                                                    onChange={(value) => {
                                                                        this.formRef?.current?.setFieldsValue({
                                                                            timeValue: value,
                                                                        });
                                                                    }}
                                                                ></Select>
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item name="timeUnit" initialValue="M">
                                                    <Field
                                                        mode={this.mode}
                                                        valueEnum={{
                                                            M: {
                                                                text: '分',
                                                            },
                                                            H: {
                                                                text: '时',
                                                            },
                                                        }}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Select onChange={this.unitChange}>
                                                                    {unitList.map((item) => (
                                                                        <Select.Option key={item.id} value={item.id}>
                                                                            {item.text}
                                                                        </Select.Option>
                                                                    ))}
                                                                </Select>
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} name="monitorDesc" label="描述">
                                        <Field
                                            mode={this.mode}
                                            renderFormItem={() => {
                                                return <TextArea autoSize={{ minRows: 3, maxRows: 5 }} allowClear />;
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        labelCol={{ span: 8 }}
                                        valuePropName="checked"
                                        wrapperCol={{ span: 14 }}
                                        name="sendStatus"
                                        label="是否发送中断告警信息"
                                    >
                                        <Switch disabled={this.mode === 'read'} />
                                        {/* <Field
                                            mode={this.mode}
                                            renderFormItem={() => {
                                                return <Switch  />;
                                            }}
                                        /> */}
                                    </Form.Item>
                                    {monitorInfo.monitorId ? (
                                        <Form.Item
                                            shouldUpdate={(prevValues, currentValues) => prevValues.sendStatus !== currentValues.sendStatus}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 12, offset: 8 }}
                                        >
                                            {({ getFieldValue }) =>
                                                getFieldValue('sendStatus') ? (
                                                    <Form.Item noStyle>
                                                        <span style={{ color: '#1890ff' }}>
                                                            [中断]{monitorInfo.monitorName}
                                                            {monitorInfo.monitorId}监测到告警中断
                                                        </span>
                                                    </Form.Item>
                                                ) : null
                                            }
                                        </Form.Item>
                                    ) : null}
                                </Card>
                            </Col>
                            <Col span={13}>
                                <Card bordered={true} style={{ height: '76vh', padding: '0 20px' }}>
                                    <Row justify="center">
                                        <Col span={24}>
                                            <Form.Item
                                                label="已有视图"
                                                labelCol={{ span: 3 }}
                                                wrapperCol={{ span: 10 }}
                                                name="windowId"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请选择已有视图',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    showSearch
                                                    options={viewNameList}
                                                    optionFilterProp="label"
                                                    // style={{ width: '150px' }}
                                                    // onChange={this.onOldFilterSelected}
                                                    disabled={this.mode === 'read'}
                                                    onChange={this.viewSelectChange}
                                                />
                                                {/* <Field
                                                    mode={this.mode}
                                                    valueEnum={{
                                                        0: {
                                                            text: '新建监测器',
                                                        },
                                                        1: {
                                                            text: '已有过滤器',
                                                        },
                                                    }}
                                                    renderFormItem={() => {
                                                        return (
                                                            <Radio.Group onChange={this.onRefRuleFlagChange}>
                                                                <Radio value={0}>新建监测器</Radio>
                                                                <Radio value={1}>已有过滤器</Radio>
                                                            </Radio.Group>
                                                        );
                                                    }}
                                                /> */}
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            {/* <Form.Item shouldUpdate noStyle>
                                                {({ getFieldValue }) =>
                                                    getFieldValue('refRuleFlag') === 1 ? (
                                                        <Form.Item name="refRuleId">
                                                            <Select
                                                                showSearch
                                                                options={filterList}
                                                                optionFilterProp="label"
                                                                style={{ width: '150px' }}
                                                                onChange={this.onOldFilterSelected}
                                                                disabled={this.mode === 'read'}
                                                            />
                                                        </Form.Item>
                                                    ) : null
                                                }
                                            </Form.Item> */}
                                        </Col>
                                    </Row>
                                    <Row justify="center">
                                        <Col span={22}>
                                            <Tabs
                                                type="card"
                                                defaultActiveKey={filterIdList[0]}
                                                tabBarStyle={{ margin: '0 0 10px' }}
                                                onChange={this.tabChange}
                                            >
                                                {filterIdList.length &&
                                                    filterIdList.map((item, index) => (
                                                        <Tabs.TabPane tab={filterNameList[index]} key={item}>
                                                            <Card
                                                                borderd="true"
                                                                bodyStyle={{ padding: '8px', height: treeHeight, overflowY: 'auto' }}
                                                            >
                                                                <ConditionTree data={filterInfo.filterExpr.filterConditionList} />
                                                            </Card>
                                                        </Tabs.TabPane>
                                                    ))}
                                            </Tabs>
                                        </Col>
                                    </Row>
                                    {/* <Tabs defaultActiveKey={1} type="card">
                                        <TabPane tab={1} key={1}>
                                          
                                        </TabPane>
                                        <TabPane tab={2} key={1}>
                                            <ConditionTree />
                                        </TabPane>
                                    </Tabs> */}

                                    {/* <Form.Item shouldUpdate noStyle>
                                        {({ getFieldValue }) => (
                                            <Form.Item
                                                label="监测器条件"
                                                labelCol={{ span: 6 }}
                                                wrapperCol={{ span: 24 }}
                                                name="condition"
                                                // rules={[
                                                //     {
                                                //         required: true,
                                                //         message: '请编辑监测器条件'
                                                //     }
                                                // ]}
                                            >
                                                <ConditionEdit
                                                    disabled={getFieldValue('refRuleFlag') === 0}
                                                    moduleId={this.state.moduleId}
                                                    treeHeight={treeHeight}
                                                    treeData={filterInfo.filterExpr.filterConditionList}
                                                    FILTER_EMUN={FILTER_EMUN}
                                                    onChange={this.onChangeTreeData}
                                                    disabledFields={this.provinceId ? ['province_id'] : undefined}
                                                    isCheck={this.mode === 'read'}
                                                    defaultFilterConditionList={this.defaultFilterConditionList(
                                                        this.props.match?.params?.provinceName,
                                                    )}
                                                />
                                            </Form.Item>
                                        )}
                                    </Form.Item> */}
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <Row style={{ padding: '16px 0' }}>
                    <Col span={24}>
                        <div style={{ textAlign: 'center', display: this.mode === 'read' ? 'none' : '' }}>
                            <Space>
                                <AuthButton
                                    addLog={true}
                                    type="primary"
                                    loading={saveLoading}
                                    onClick={this.handleSave}
                                    authKey={modelType === 'new' ? 'alarmBreakMonitor:add' : 'alarmBreakMonitor:edit'}
                                >
                                    保存
                                </AuthButton>
                                <Button onClick={this.handleCancel}>取消</Button>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(withRouter(EditContent));
