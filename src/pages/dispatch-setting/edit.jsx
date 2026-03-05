/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Button, Form, Input, Row, Space, Col, message, Card, Icon, Spin, Table, Tooltip, Modal, Select } from 'oss-ui';
import PageContainer from '@Src/components/page-container';
import { _ } from 'oss-web-toolkits';
import moment from 'moment';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import formatReg from '@Common/formatReg';
import ConditionEdit from '@Components/condition-edit';
// import shareActions from '@Src/share/actions';
import Field from '@ant-design/pro-field';
import './style.less';
// import SelectCondition from '../list/comp-select-condition';
// import AuthButton from '@Src/components/auth-button';
import {
    getRuleDetailAPi,
    // saveFilter,
    getProvinceData,
    getDispatchAutoPublishApi,
    recoverDispatchAutoPublishConfigApi,
    // getDispatchAutoConfigApi,
    saveDispatchAutoConfigApi,
    publishDispatchAutoConfigApi,
    deleteRuleHistoryAPi,
} from './api';
import { hasActionIds, defaultFilterConditionList, buttonKes } from '../setting/filter/edit/util';

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
const editTitle = { new: '新建', edit: '编辑' };
const ruleType = {
    301: {
        NAME: '集团告警省内派单规则',
    },
    302: {
        NAME: '派单告警分发规则',
    },
    303: {
        NAME: '超长告警呈现规则',
    },
};

class Index extends PureComponent {
    /** *
     * 规则动作ref
     */
    actionFormRef = React.createRef();
    /**
     * 过滤器及规则公共页面ref，主要用于名称及描述的校验
     */
    filterFormRef = React.createRef();
    constructor(props) {
        super(props);
        // this.moduleId = props.match.params.moduleId;
        // this.isCheck = props.match.params.isCheck;
        this.isCheck = false;
        this.isRecover = false;
        // const userInFo = JSON.parse(this.props.login.userInfo);
        // const zoneInfo = userInFo?.zones;
        this.state = {
            // visible: false,
            // conditionVisible: false,
            filterInfo: {
                filterName: '',
                enable: FILTER_EMUN.ENABLE.TRUE,
                isPrivate: FILTER_EMUN.ISPRIVATE.FALSE,
                creator: props.login.userId,
                filterExpr: { filterConditionList: [], logicalType: null },
                modelId: 2,
                moduleId: 0,
            },
            // 当前是否新建条件
            // isCreateCondition: false,
            // 当前编辑的条件信息
            // editingConditionInfo: null,
            // 当前选中的条件
            // selectedKey: '',
            // modelType: this.props.match.params.type,
            modelType: 'new',
            configType: this.props.match?.params.configType,
            // showCreator: props.login.userName,
            loading: false,
            // typeDataList: [],
            provinceList: [],
            moduleId: props.moduleId,
            // filterId: 0,
            // isDraft: props.isDraft,
            tableData: [],
            editFlag: false, // 判断是否保存过
            rowSelection: [],
            // ruleDetail:{},
            dispatchAutoConfigId: 0,
            lastDetail: {},
            selectedRows: [],
        };
    }

    componentDidMount() {
        this.loadFilterData();
        this.getProvinceList();
        this.getTableData();
    }
    componentDidUpdate(prevProps) {
        if (this.props.filterId !== prevProps.filterId || this.props.moduleId !== prevProps.moduleId || this.props.isDraft !== prevProps.isDraft) {
            this.loadFilterData();
            if (this.props.filterId && !this.props.isDraft) {
                this.getTableData();
            }
        }
    }
    get disabled() {
        const { filterInfo, modelType } = this.state;
        const target = filterInfo?.filterProperties?.find((item) => item.key === 'synchro_filter');
        return modelType !== 'new' && target && target.value === '1';
    }
    getColumns = () => {
        const col = [
            {
                title: '修改人',
                dataIndex: 'operateUser',
                align: 'center',
                ellipsis: {
                    showTitle: true,
                },
            },
            {
                title: '修改时间',
                dataIndex: 'operateTime',
                align: 'center',
                ellipsis: {
                    showTitle: true,
                },
            },
            {
                title: '操作',
                dataIndex: 'actions',
                align: 'center',
                render: (text, record, index) => (
                    <Space>
                        <Tooltip title="恢复">
                            <Icon onClick={() => this.recoverVersion(record, false)} antdIcon type="SyncOutlined" />
                        </Tooltip>
                        {index !== 0 && (
                            <Tooltip title="删除">
                                <Icon onClick={() => this.deleteVersion(record, false)} antdIcon type="DeleteOutlined" />
                            </Tooltip>
                        )}
                    </Space>
                ),
            },
        ];
        return col;
    };

    confirmDelete = async (record, bool) => {
        console.log(record, bool, '=====');
        const params = {
            dispatchAutoConfigId: record.dispatchAutoConfigId,
        };
        const res = await deleteRuleHistoryAPi(params);
        if (res) {
            // this.props.getChildrenTreeData(record.moduleId, bool);
            this.getTableData();
        }
    };

    deleteVersion = (record, bool) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content: '是否确认删除？',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                this.confirmDelete(record, bool);
            },
            onCancel() {},
        });
    };

    recoverVersion = (item, bool) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content: '是否恢复至草稿中？',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                this.confirmRecover(item, bool);
            },
            onCancel() {},
        });
    };

    confirmRecover = async (item) => {
        const result = await recoverDispatchAutoPublishConfigApi({
            dispatchAutoConfigId: item.dispatchAutoConfigId,
            operateUser: this.props.login.userName,
        });
        if (result.data) {
            message.success('恢复成功');
            this.isRecover = true;
            this.props.getChildrenTreeData(item.moduleId, true, item.filterName, true);
        }
    };

    publishRule = () => {
        const { editFlag, filterInfo } = this.state;
        const filterName = this.filterFormRef?.current?.getFieldValue('filterName');
        if (editFlag || filterInfo.filterName !== filterName) {
            Modal.confirm({
                title: '提示',
                icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
                content: '还未保存更新内容，是否继续发布？',
                okText: '确认',
                okButtonProps: { prefixCls: 'oss-ui-btn' },
                cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                okType: 'danger',
                cancelText: '取消',
                prefixCls: 'oss-ui-modal',
                onOk: () => {
                    this.confirmLastPublish();
                },
                onCancel() {},
            });
        } else {
            this.confirmPublish();
        }
    };

    confirmLastPublish = async () => {
        const { configType, lastDetail } = this.state;
        const { dispatchAutoConfigId } = lastDetail;
        const result = await publishDispatchAutoConfigApi({
            dispatchAutoConfigId,
            operateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            configType,
            filterId: this.props.filterId,
            operateUser: this.props.login.userName,
        });
        if (result.data) {
            message.success('发布成功');
            this.isRecover = false;
            this.props.getChildrenTreeData(lastDetail.moduleId, false, lastDetail.filterName, true);
        }
    };
    confirmPublish = async () => {
        const { configType, dispatchAutoConfigId, filterInfo } = this.state;
        this.filterFormRef.current.validateFields().then(async (values) => {
            if (
                filterInfo.filterExpr &&
                _.isArray(filterInfo.filterExpr.filterConditionList) &&
                filterInfo.filterExpr.filterConditionList.length === 0
            ) {
                message.error(`请编辑${ruleType[`${this.props.moduleId}`]?.NAME}条件`);
                return;
            }
            const result = await publishDispatchAutoConfigApi({
                alarmModelFilter: filterInfo,
                dispatchAutoConfigId,
                operateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                configType,
                filterId: this.props.filterId,
                operateUser: this.props.login.userName,
            });
            if (result.data) {
                message.success('发布成功');
                this.isRecover = false;
                this.props.getChildrenTreeData(filterInfo.moduleId, false, values.filterName, true);
            }
        });
    };

    getTableData = async () => {
        if (this.props.filterId) {
            const result = await getDispatchAutoPublishApi({ current: 1, pageSize: 999, filterId: this.props.filterId });
            if (result.data) {
                this.setState({
                    tableData: result.data,
                    selectedRows: result.data[0]?.dispatchAutoConfigId,
                });
            }
        }
    };

    getProvinceList = async () => {
        const {
            login: { userId, systemInfo },
        } = this.props;
        const zoneId = systemInfo.currentZone?.zoneId;
        const provinceList = await getProvinceData(userId, zoneId);
        this.setState({
            provinceList,
        });
    };

    /**
     * @description: 加载过滤器信息
     * @param {*}
     * @return {*}
     */

    loadFilterData = async () => {
        const { filterId, login, moduleId, isDraft } = this.props;
        const { userId, userName } = login;
        if (filterId) {
            const data = {
                moduleId,
                modelId: 2,
                filterId,
                isDraft,
                userId,
            };
            this.setState({
                loading: true,
            });
            const res = await getRuleDetailAPi(data);
            const filterInfo = res.data.alarmModelFilter;
            const param = {
                filterName: `${filterInfo.filterName}`,
                filterId,
                operateUser: this.isRecover ? userName : res.data.operateUser || userName,
                operateTime: this.isRecover ? moment().format('YYYY-MM-DD HH:mm:ss') : res.data.operateTime,
                faultSheetProcess: +filterInfo.filterProperties?.[0]?.value || 0,
            };
            this.filterFormRef?.current?.setFieldsValue(param);
            this.isRecover = false;
            this.setState({
                filterInfo,
                dispatchAutoConfigId: res.data.dispatchAutoConfigId,
                loading: false,
                modelType: 'edit',
                moduleId,
                lastDetail: res.data,
            });
        } else {
            const param = {
                filterName: '',
                filterId: '',
                operateUser: userName,
                operateTime: '',
            };
            this.isRecover = false;
            this.setState({
                modelType: 'new',
                moduleId,
                filterInfo: {
                    filterName: '',
                    enable: FILTER_EMUN.ENABLE.TRUE,
                    isPrivate: FILTER_EMUN.ISPRIVATE.FALSE,
                    creator: userId,
                    filterExpr: { filterConditionList: [], logicalType: null },
                    modelId: 2,
                    moduleId: 0,
                },
            });
            this.filterFormRef?.current?.setFieldsValue(param);
        }
    };

    handleSave = async () => {
        const { dispatchAutoConfigId } = this.state;
        const { provinceId } = useLoginInfoModel.data;
        const { filterId, login, moduleId } = this.props;
        // eslint-disable-next-line prefer-const
        let { filterInfo } = this.state;

        // 过滤器名称及描述校验
        this.filterFormRef.current.validateFields().then((values) => {
            // 过滤器名称及描述赋值
            filterInfo.filterName = values.filterName;
            filterInfo.moduleId = moduleId;
            delete filterInfo.filterProfessional;
            delete filterInfo.filterProvince;
            delete filterInfo.filterDesc;
            if (
                filterInfo.filterExpr &&
                _.isArray(filterInfo.filterExpr.filterConditionList) &&
                filterInfo.filterExpr.filterConditionList.length === 0
            ) {
                message.error(`请编辑${ruleType[`${moduleId}`]?.NAME}条件`);
                return;
            }

            this.setState({
                loading: true,
            });
            this.isRecover = false;

            const saveProxy = async (info) => {
                const newInfo = {
                    ...info,
                    filterProvince: provinceId,
                    filterProfessional: '-1',
                    filterProperties: [{ key: 'setAlarmField#fault_sheet_process', value: values.faultSheetProcess, valueDesc: '派单流程' }],
                };

                const data = {
                    alarmModelFilter: newInfo,
                    operateUser: login.userName || values.operateUser,
                };
                if (filterId) {
                    data.filterId = filterId;
                    data.dispatchAutoConfigId = dispatchAutoConfigId;
                }

                try {
                    const res = await saveDispatchAutoConfigApi(data);
                    if (res.code === 500) {
                        message.error(res.message);
                        this.setState({
                            loading: false,
                            editFlag: false,
                        });
                        return;
                    }
                    if (res.data) {
                        this.props.getChildrenTreeData(filterInfo.moduleId, true, values.filterName);
                    }
                    this.setState({
                        loading: false,
                        editFlag: false,
                    });
                    // if (modelType === 'new') {
                    const param = {
                        filterName: values.filterName,
                        filterId,
                        operateUser: login.userName || values.operateUser,
                        operateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    };
                    this.filterFormRef?.current?.setFieldsValue(param);
                    // }
                } catch (e) {
                    this.setState({
                        loading: false,
                    });
                }
            };
            saveProxy(filterInfo);
        });
    };

    /**
     * @description: 取消编辑操作
     * @param {*}
     * @return {*}
     */

    handleCancel = () => {
        const { login, filterId } = this.props;
        const values = this.filterFormRef.current.getFieldsValue();
        const param = {
            filterName: '',
            filterId,
            operateUser: values.operateUser || login.userName,
            operateTime: values.operateTime,
        };
        this.filterFormRef?.current?.setFieldsValue(param);
        this.setState({
            filterInfo: {
                filterName: '',
                enable: FILTER_EMUN.ENABLE.TRUE,
                isPrivate: FILTER_EMUN.ISPRIVATE.FALSE,
                creator: login.userId,
                filterExpr: { filterConditionList: [], logicalType: null },
                modelId: 2,
                moduleId: 0,
            },
            editFlag: true,
        });
    };

    /**
     * @description: 条件树数据变化监听
     * @param {*}
     * @return {*}
     */

    onChangeTreeData = (newTreeData, newLogicalType) => {
        const { filterInfo } = this.state;
        this.setState({
            filterInfo: {
                ...filterInfo,
                filterExpr: { filterConditionList: newTreeData, logicalType: newLogicalType },
            },
            editFlag: true,
        });
    };

    getInitialProvince = (province, userInfo) => {
        const info = userInfo && JSON.parse(userInfo);
        let initialProvince = info.zones[0]?.zoneId;
        if (province) {
            return province;
        }
        if (info.zones[0]?.zoneLevel === '3') {
            initialProvince = info.zones[0]?.parentZoneId;
        }
        return initialProvince;
    };

    getAuthKey = () => {
        let keys = '';
        const { modelType, moduleId } = this.state;
        switch (modelType) {
            case 'new':
                return buttonKes.add[moduleId];
            case 'edit':
                return buttonKes.edit[moduleId];
            case 'copy':
                return buttonKes.copy[moduleId];
            default:
                break;
        }
        return keys;
    };
    onSelect = (record) => {
        const { filterName, filterId, operateUser, operateTime, alarmModelFilter } = record;
        const param = {
            filterName,
            filterId,
            operateUser,
            operateTime,
        };
        this.filterFormRef?.current?.setFieldsValue(param);
        this.setState({
            selectedRows: record.dispatchAutoConfigId,
            filterInfo: alarmModelFilter,
        });
    };

    render() {
        const { filterInfo, modelType, loading, provinceList, moduleId, tableData, rowSelection, selectedRows } = this.state;
        const { login, isDraft } = this.props;

        // const TypeContent = moduleIdEditContentMap[moduleId];

        const treeHeight = !hasActionIds.includes(moduleId) ? `${window.innerHeight - 408}px` : `160px`;

        // 需要置顶的条件项
        const topFieldNames = 'org_type,network_type_top,province_id,professional_type,alarm_title,title_text';
        return (
            <PageContainer
                gridContentStyle={{ height: `calc(100% - 50px)` }}
                title={
                    <div className="volume-title">
                        <div>
                            <span>{isDraft ? '草稿' : '已发布'}</span>
                            {'>'}
                            <span>{ruleType[`${moduleId}`]?.NAME}</span>
                            {'>'}
                            <span>{isDraft ? editTitle[`${modelType}`] : filterInfo.filterName}</span>
                        </div>
                        {isDraft && (
                            <Button type="primary" disabled={modelType === 'new'} onClick={() => this.publishRule()}>
                                发布
                            </Button>
                        )}
                    </div>
                }
            >
                <Card bodyStyle={{ height: '100%', overflow: 'hidden' }} style={{ height: '100%' }} className="filter-edit-container-card">
                    <Spin spinning={loading}>
                        <Row>
                            <Col span={24} style={{ position: 'relative' }}>
                                <Form labelAlign="right" labelCol={{ span: 6 }} ref={this.filterFormRef} style={{ height: '100%' }}>
                                    <Row span={24}>
                                        <Col span={16}>
                                            <Form.Item
                                                label="过滤器名称"
                                                name="filterName"
                                                labelCol={{ span: 3 }}
                                                rules={[
                                                    { required: true, message: '不可为空' },
                                                    { pattern: formatReg.noEmpety, message: '不可为空格' },
                                                    {
                                                        validator: (rule, value, callback) => {
                                                            // eslint-disable-next-line no-control-regex
                                                            const valueLength = value
                                                                ? // eslint-disable-next-line no-control-regex
                                                                  value.replace(/[^\x00-\xff]/g, 'aa').length
                                                                : 0;
                                                            if (valueLength > 64) {
                                                                callback('总长度不能超过64位（1汉字=2位）');
                                                            } else {
                                                                callback();
                                                            }
                                                        },
                                                    },
                                                ]}
                                            >
                                                <Field
                                                    mode={this.isCheck ? 'read' : 'edit'}
                                                    renderFormItem={() => {
                                                        return <Input style={{ width: '50%' }} disabled={this.disabled || !isDraft} allowClear />;
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8} style={{ height: '100%' }}>
                                            <Form.Item label="过滤器ID" labelCol={{ span: 6 }} name="filterId">
                                                <Field
                                                    mode={this.isCheck ? 'read' : 'edit'}
                                                    // text={modelType === 'new' ? this.props.login.userName : filterInfo.creator}
                                                    renderFormItem={() => {
                                                        return <Input disabled />;
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row span={24}>
                                        <Col span={16}>
                                            <Form.Item label={isDraft ? '操作人员' : '发布人员'} labelCol={{ span: 3 }} name="operateUser">
                                                <Field
                                                    mode={this.isCheck ? 'read' : 'edit'}
                                                    // text={modelType === 'new' ? this.props.login.userName : filterInfo.creator}
                                                    renderFormItem={() => {
                                                        return (
                                                            <Input
                                                                disabled
                                                                style={{ width: '50%' }}
                                                                // value={modelType === 'new' ? this.props.login.userName : filterInfo.creator}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item label={isDraft ? '操作时间' : '发布时间'} labelCol={{ span: 6 }} name="operateTime">
                                                <Field
                                                    mode={this.isCheck ? 'read' : 'edit'}
                                                    text={modelType === 'new' ? this.props.login.userName : filterInfo.creator}
                                                    renderFormItem={() => {
                                                        return (
                                                            <Input
                                                                disabled
                                                                // value={modelType === 'new' ? this.props.login.userName : filterInfo.creator}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row span={24}>
                                        <Col span={16}>
                                            <Form.Item label="派单流程" labelCol={{ span: 3 }} name="faultSheetProcess">
                                                <Field
                                                    mode={this.isCheck ? 'read' : 'edit'}
                                                    renderFormItem={() => {
                                                        return (
                                                            <Select
                                                                showSearch
                                                                style={{ width: '50%' }}
                                                                disabled={this.disabled || !isDraft}
                                                                defaultValue={0}
                                                                optionFilterProp="children"
                                                            >
                                                                <Select.Option value={0} key={0} label="集团">
                                                                    集团
                                                                </Select.Option>
                                                                <Select.Option value={1} key={1} label="省内">
                                                                    省内
                                                                </Select.Option>
                                                            </Select>
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row span={24}>
                                        <Col span={16} style={{ zIndex: 999 }}>
                                            <Form.Item label="过滤条件" wrapperCol={{ span: 18 }} style={{ marginBottom: 0 }} labelCol={{ span: 3 }}>
                                                <ConditionEdit
                                                    isCheck={!isDraft}
                                                    style={{ width: '85%' }}
                                                    moduleId={moduleId}
                                                    treeHeight={treeHeight}
                                                    treeData={filterInfo.filterExpr.filterConditionList}
                                                    FILTER_EMUN={FILTER_EMUN}
                                                    onChange={this.onChangeTreeData}
                                                    defaultFilterConditionList={defaultFilterConditionList(
                                                        login,
                                                        moduleId,
                                                        provinceList ? provinceList[0]?.regionName : '',
                                                    )}
                                                    topFieldNames={topFieldNames}
                                                />
                                            </Form.Item>
                                        </Col>
                                        {!isDraft && (
                                            <Col span={8}>
                                                <Form.Item label="发布历史版本" style={{ marginBottom: 0 }} labelCol={{ span: 6 }} />
                                            </Col>
                                        )}
                                    </Row>
                                    <Row span={24} style={{ position: 'absolute', top: 160 }}>
                                        <Col span={16} />
                                        <Col span={8}>
                                            <Form.Item label="" labelCol={{ span: 16 }}>
                                                {!isDraft && (
                                                    <Table
                                                        dataSource={tableData}
                                                        rowSelection={{
                                                            type: 'radio',
                                                            ...rowSelection,
                                                            onSelect: this.onSelect,
                                                            selectedRowKeys: [selectedRows],
                                                            renderCell(checked, record, index, node) {
                                                                return (
                                                                    <div className="working-content">
                                                                        {node}
                                                                        {index === 0 && <span className="working-item">生效中</span>}
                                                                    </div>
                                                                );
                                                            },
                                                        }}
                                                        rowKey="dispatchAutoConfigId"
                                                        columns={this.getColumns()}
                                                        scroll={{ y: 500 }}
                                                        pagination={false}
                                                    />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                        {this.props.isDraft && (
                            <div className="actions-btn" style={{ position: 'relative', textAlign: 'center' }}>
                                <Space>
                                    <Button addLog type="primary" onClick={() => this.handleSave()}>
                                        保存
                                    </Button>
                                    <Button onClick={this.handleCancel}>重置</Button>
                                </Space>
                            </div>
                        )}
                    </Spin>
                </Card>
            </PageContainer>
        );
    }
}

export default withModel([useLoginInfoModel], (shareInfo) => ({
    login: shareInfo[0],
    pageInfo: shareInfo[1],
}))(Index);
