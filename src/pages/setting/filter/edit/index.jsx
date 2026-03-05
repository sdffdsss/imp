/* eslint-disable no-param-reassign */
import React, { PureComponent, Fragment } from 'react';
import { Button, Form, Input, Row, Space, Checkbox, Col, message, Card, Modal, Icon, Spin, Select } from 'oss-ui';
import PageContainer from '@Src/components/page-container';
import { _ } from 'oss-web-toolkits';
import { moduleIdEditContentMap, moduleIdFormatMap, hasActionIds, showPrivateFields, defaultFilterConditionList, buttonKes } from './util';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import constants from '@Common/constants';
import { FILTER_EMUN } from '../index';
import { getCommonMsgWithSelectFilter } from '../utils';
import formatReg from '@Common/formatReg';
import ConditionEdit from '@Components/condition-edit';
import shareActions from '@Src/share/actions';
import usePageInfo from '../hox';
import produce from 'immer';
import { getFilterInfo, saveFilter, getProvinceData } from '../api';
import Field from '@ant-design/pro-field';
import './index.less';
import SelectCondition from '../list/comp-select-condition';
import AuthButton from '@Src/components/auth-button';
const sendSmsNoStr = `该告警是第<send_no>次发送短信`;
class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.moduleId = props.match.params.moduleId;
        this.isCheck = props.match.params.isCheck;
        this.msg = getCommonMsgWithSelectFilter(this.moduleId);
        const userInFo = JSON.parse(this.props.login.userInfo);
        const zoneInfo = userInFo?.zones;
        this.state = {
            visible: false,
            conditionVisible: false,
            filterInfo: {
                filterName: '',
                filterDesc: '',
                filterProvince: zoneInfo && zoneInfo[0]?.zoneLevel === '1' ? '' : zoneInfo && zoneInfo[0]?.zoneLevel_2Id?.toString(), // 所属省份
                filterProfessional: [], // 所属专业
                enable:
                    Number(props.match.params.moduleId) === 4 ||
                    Number(props.match.params.moduleId) === 14 ||
                    Number(props.match.params.moduleId) === 63
                        ? FILTER_EMUN.ENABLE.FALSE
                        : FILTER_EMUN.ENABLE.TRUE,
                isPrivate: FILTER_EMUN.ISPRIVATE.FALSE,
                creator: props.login.userId,
                filterExpr: { filterConditionList: [], logicalType: null },
                modelId: 2,
                moduleId: Number(props.match.params.moduleId),
            },
            // 当前是否新建条件
            isCreateCondition: false,
            // 当前编辑的条件信息
            editingConditionInfo: null,
            // 当前选中的条件
            selectedKey: '',
            modelType: this.props.match.params.type,
            showCreator: props.login.userName,
            loading: false,
            typeDataList: [],
            provinceList: [],
        };
    }

    get disabled() {
        const { filterInfo, modelType } = this.state;
        const target = filterInfo?.filterProperties?.find((item) => item.key === 'synchro_filter');
        return modelType !== 'new' && target && target.value === '1';
    }

    /** *
     * 规则动作ref
     */
    actionFormRef = React.createRef();
    /**
     * 过滤器及规则公共页面ref，主要用于名称及描述的校验
     */
    filterFormRef = React.createRef();

    componentDidMount() {
        this.loadFilterData();
        this.getTypeData();
        this.getProvinceList();
    }

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
        const { modelType } = this.state;
        const { login } = this.props;
        if (modelType !== 'new') {
            this.setState({
                loading: true,
            });
            const data = {
                moduleId: this.props.match?.params?.moduleId,
                modelId: 2,
                filterId: this.props.match?.params?.id,
            };
            const res = await getFilterInfo(data);
            if (res && res.data) {
                let filterInfo = res.data;
                if (modelType === 'copy') {
                    filterInfo = { ...res.data, filterName: `${res.data.filterName}-copy` };
                }
                this.setState({
                    filterInfo,
                    loading: false,
                });

                let param = {};
                if (
                    this.props.match?.params?.moduleId === '1' ||
                    this.props.match?.params?.moduleId === '8' ||
                    this.props.match?.params?.moduleId === '4' ||
                    this.props.match?.params?.moduleId === '14' ||
                    this.props.match?.params?.moduleId === '64' ||
                    this.props.match?.params?.moduleId === '63' ||
                    this.props.match?.params?.moduleId === '70'
                ) {
                    param = {
                        filterName: `${filterInfo.filterName}`,
                        filterDesc: `${filterInfo.filterDesc ? filterInfo.filterDesc : ''}`,
                        filterTypeId: filterInfo.filterTypeId,
                        filterProvince: this.isCheck ? filterInfo?.filterProvinceLabel : filterInfo?.filterProvince?.toString(),
                        filterProfessional: this.isCheck
                            ? filterInfo?.filterProfessionalLabel
                            : filterInfo?.filterProfessional?.split(',').map((item) => {
                                  return Number(item);
                              }),
                    };
                } else {
                    param = {
                        filterName: `${filterInfo.filterName}`,
                        filterDesc: `${filterInfo.filterDesc ? filterInfo.filterDesc : ''}`,
                        filterTypeId: filterInfo.filterTypeId,
                    };
                }
                // 修改or 复制表单赋值-名称及描述
                this.filterFormRef?.current?.setFieldsValue(param);
            }
        } else {
            const userInFo = JSON.parse(this.props.login.userInfo);
            const zoneInfo = userInFo?.zones;
            const param = {
                filterProvince: zoneInfo && zoneInfo[0]?.zoneLevel === '1' ? '' : zoneInfo && zoneInfo[0]?.zoneLevel_2Id?.toString(),
            };
            if (this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo)) {
                param.filterProvince = this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo);
            }
            this.filterFormRef?.current?.setFieldsValue(param);
        }
    };

    checkAllSoundIsEmpty = (filterProperties) => {
        let flag = true;

        if (!filterProperties || (filterProperties && !_.isArray(filterProperties))) {
            return flag;
        }
        for (let index = 0; index < filterProperties.length; index++) {
            const item = filterProperties[index];
            if (item?.key.includes('SoundPath_') && item?.value) {
                flag = false;
                break;
            }
        }
        return flag;
    };

    handleSave = async (params) => {
        const { moduleId } = this.props?.match?.params;
        const { modelType } = this.state;
        // eslint-disable-next-line prefer-const
        let { filterInfo, typeDataList } = this.state;
        const { userId } = this.props.login;
        // 过滤器名称及描述校验
        this.filterFormRef.current.validateFields().then((values) => {
            let url = 'alarmmodel/filter/v1/filter';
            let method = 'post';
            // 过滤器名称及描述赋值
            filterInfo.filterName = values.filterName;
            filterInfo.filterDesc = values.filterDesc;
            filterInfo.filterTypeId = values.filterTypeId;
            if (
                moduleId === '1' ||
                moduleId === '8' ||
                moduleId === '64' ||
                moduleId === '4' ||
                moduleId === '14' ||
                moduleId === '63' ||
                moduleId === '70'
            ) {
                filterInfo.filterProvince = values.filterProvince;
                filterInfo.filterProfessional = values.filterProfessional?.join(',');
            } else {
                delete filterInfo.filterProfessional;
                delete filterInfo.filterProvince;
            }
            filterInfo.filterTypeName = typeDataList.find((item) => item.value === values.filterTypeId)?.label || null;
            if (
                filterInfo.filterExpr &&
                _.isArray(filterInfo.filterExpr.filterConditionList) &&
                filterInfo.filterExpr.filterConditionList.length === 0
            ) {
                message.error(`请编辑${this.msg}条件`);
                return;
            }

            this.setState({
                loading: true,
            });

            if (modelType === 'new') {
                method = 'post';
                url = 'alarmmodel/filter/v1/filter';
            }
            if (modelType === 'copy') {
                method = 'post';
                url = 'alarmmodel/filter/v1/filter/copy';
                filterInfo.creator = userId;
                // 复制时不传modifier、filterId
                filterInfo = _.omit(filterInfo, ['filterId', 'modifier']);
            }
            if (modelType === 'edit') {
                method = 'put';
                url = 'alarmmodel/filter/v1/filter';
                filterInfo.modifier = userId;
                // 修改时不传creator
                filterInfo = _.omit(filterInfo, ['creator']);
            }

            const saveProxy = async (info, methods) => {
                const data = {
                    alarmModelFilter: info,
                };
                if (methods) {
                    method = methods;
                }
                try {
                    const res = await saveFilter(url, method, data, params);
                    this.setState({
                        loading: false,
                    });
                    // 新增修改过程不调用过滤器接口，改为服务端统一保存
                    // if ((moduleId === '4' || moduleId === '14') && (modelType === 'new' || modelType === 'edit')) {
                    //     const { filterProperties } = info;
                    //     const target = filterProperties.find((item) => item.key === 'synchroFilter');
                    //     const synchroFilterValue = this.state.filterInfo?.filterProperties?.find((item) => item.key === 'synchroFilter');
                    //     if (target && target.value && synchroFilterValue?.value !== 'true') {
                    //         const nextData = produce(info, (draft) => {
                    //             draft.moduleId = 1;
                    //             draft.enable = 1;
                    //             draft.filterName = `【短信】${draft.filterName}`;
                    //             draft.filterDesc = '';
                    //             draft.creator = userId;
                    //             draft.filterProperties = [
                    //                 {
                    //                     key: 'synchro_filter',
                    //                     value: '1',
                    //                     valueDesc: '是否规则自动生成',
                    //                 },
                    //                 {
                    //                     key: 'max_delay_time_seconds',
                    //                     value: 1,
                    //                     valueDesc: '是否启用',
                    //                 },
                    //                 {
                    //                     key: 'unit',
                    //                     value: '0',
                    //                     valueDesc: '时延单位 0: 秒  1：分',
                    //                 },
                    //             ];
                    //         });

                    //         saveProxy(nextData, 'post');
                    //     }
                    // }
                    if (this.props.match.params.callback === 'close-tab') {
                        const { actions, messageTypes } = shareActions;
                        if (actions && actions.postMessage) {
                            actions.postMessage(messageTypes.closeTabs, {
                                entry: `/alarm/setting/filter/${modelType}/${this.props.match.params.moduleId}/${this.props.match.params.id}/list/close-tab`,
                            });
                        }
                    } else {
                        if (moduleId === '201' && this.props.openType === 'modal') {
                            if (this.props.onSave) {
                                this.props.onSave({ ...info, filterId: res.data });
                            }
                            return;
                        }
                        this.props.history.push(
                            `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/${moduleId}/${this.props.match.params.mode}`,
                        );
                        this.props.pageInfo.setLoadType('reload');
                        // this.props.pageInfo.setLoadType('refresh');
                    }
                } catch (e) {
                    this.setState({
                        loading: false,
                    });
                }
            };
            const actionValidAndSave = () => {
                if (this.actionFormRef.current) {
                    console.log(this.actionFormRef.current);
                    this.actionFormRef.current
                        .validateFields()
                        .then((actionFormValues) => {
                            let action = actionFormValues;
                            console.log(action, '==action');
                            if (action.sendNo) {
                                action.smsTitle += sendSmsNoStr;
                            }
                            if (actionFormValues.sendMode === 3) {
                                actionFormValues.userId = this.props.login?.userId;
                            }
                            if (actionFormValues.whetherSmsMerge && actionFormValues.smsMergeFields?.length === 0) {
                                this.setState({
                                    loading: false,
                                });
                                return message.error('请勾选合并短信的维度');
                            }

                            if (
                                actionFormValues.sendMode === 3 &&
                                action.everyTimes.length > 1 &&
                                action.everyTimes.slice(1).some((item) => !item.times)
                            ) {
                                this.setState({
                                    loading: false,
                                });
                                return message.error('时间间隔不能为空');
                            }

                            if (
                                action.sendMode === 3 &&
                                action.everyTimes.some(
                                    (item) =>
                                        !item.receiver || item.receiver?.length === 0 || !item.relatedMeTeam || item.relatedMeTeam?.length === 0,
                                )
                            ) {
                                this.setState({
                                    loading: false,
                                });
                                return message.error('请完善用户班组角色');
                            }
                            // if (action.sendMode === 3 && typeof action.temporaryNum === 'string' && action.temporaryNum.split(',').length > 19) {
                            //     this.setState({
                            //         loading: false,
                            //     });
                            //     return message.error('手机号数量过多');
                            // }
                            let hasNoticer = false;
                            action.everyTimes?.forEach((item) => {
                                if (item.userIds || item.temporaryNum) {
                                    hasNoticer = true;
                                }
                            });
                            if (action.sendMode === 0 && action.notificationType?.indexOf('1') > -1 && !hasNoticer) {
                                // 勾选了短信，通知用户不能为空
                                this.setState({
                                    loading: false,
                                });
                                return message.error('至少选择一个通知用户或填写一个号码');
                            }
                            const formatUtil = moduleIdFormatMap[moduleId];

                            if (formatUtil) {
                                action = formatUtil(actionFormValues);
                            }

                            // return;

                            filterInfo.filterProperties = action;

                            if (moduleId === '8' && this.checkAllSoundIsEmpty(filterInfo.filterProperties)) {
                                this.setState({
                                    loading: false,
                                });
                                return message.error(`请上传声音文件`);
                            }

                            if (modelType === 'edit' && this.disabled) {
                                filterInfo.filterProperties.push({
                                    key: 'synchro_filter',
                                    value: '1',
                                    valueDesc: '是否规则自动生成',
                                });
                            }
                            saveProxy(filterInfo);
                        })
                        .catch((errorInfo) => {
                            console.log(errorInfo);
                            this.setState({
                                loading: false,
                            });
                        });
                } else {
                    saveProxy(filterInfo);
                }
            };

            if (modelType === 'copy' && (moduleId === '2' || moduleId === '3')) {
                Modal.confirm({
                    title: '',
                    icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                    content: moduleId === '2' ? '复制将新增一条告警级别重定义规则，是否确认复制?' : '复制将新增一条告警类别重定义规则，是否确认复制?',
                    okText: '确认',
                    okButtonProps: { prefixCls: 'oss-ui-btn' },
                    cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                    okType: 'danger',
                    cancelText: '取消',
                    prefixCls: 'oss-ui-modal',
                    onOk: () => {
                        actionValidAndSave();
                    },
                    onCancel() {},
                });
            } else {
                actionValidAndSave();
            }
        });
    };

    /**
     * @description: 取消编辑操作
     * @param {*}
     * @return {*}
     */

    handleCancel = () => {
        if (this.props.match.params.moduleId === '201' && this.props.openType === 'modal') {
            this.props.onCancel();
            return;
        }
        this.props.pageInfo.setLoadType('keepAlive');
        this.props.history.push(
            `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/${this.props.match.params.moduleId}/${this.props.match.params.mode}`,
        );
    };

    /**
     * @description: 启停操作
     * @param {*}
     * @return {*}
     */

    onStartUse = (e) => {
        this.setState({
            filterInfo: {
                ...this.state.filterInfo,
                enable: e.target.checked === true ? FILTER_EMUN.ENABLE.TRUE : FILTER_EMUN.ENABLE.FALSE,
            },
        });
    };

    /**
     * @description: 是否私有切换
     * @param {*}
     * @return {*}
     */

    onPrivateChange = (e) => {
        this.setState({
            filterInfo: {
                ...this.state.filterInfo,
                isPrivate: e.target.checked === true ? FILTER_EMUN.ISPRIVATE.TRUE : FILTER_EMUN.ISPRIVATE.FALSE,
            },
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
        });
    };
    getTypeData = async () => {
        // const res = await getTypeData({ creator: this.props.login.userId });
        // if (res?.data) {
        //     const list = res.data.map((item) => {
        //         return {
        //             ...item,
        //             value: item.filterTypeId,
        //             label: item.filterTypeName
        //         };
        //     });
        //     this.setState({
        //         typeDataList: list
        //     });
        // }
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

    renderOkButton = () => {
        const { filterInfo, modelType, loading } = this.state;
        const { moduleId } = this.props?.match?.params;
        const { enable } = filterInfo;
        if (enable === 1) {
            return (
                <AuthButton
                    addLog={true}
                    type="primary"
                    loading={loading}
                    authKey={this.getAuthKey()}
                    onClick={(params) => {
                        Modal.confirm({
                            title: '提示',
                            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                            content: '该规则为启用状态，是否确认保存？',
                            okText: '确认',
                            okButtonProps: { prefixCls: 'oss-ui-btn' },
                            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                            okType: 'danger',
                            cancelText: '取消',
                            prefixCls: 'oss-ui-modal',
                            onOk: () => {
                                this.handleSave(params);
                            },
                            onCancel() {},
                        });
                    }}
                >
                    保存
                </AuthButton>
            );
        }
        if (moduleId === '14' && modelType === 'copy') {
            return (
                <AuthButton
                    addLog={true}
                    type="primary"
                    loading={loading}
                    authKey={this.getAuthKey()}
                    onClick={(params) => {
                        Modal.confirm({
                            title: '提示',
                            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                            content: '复制将新增一条IVR外呼规则，是否确认复制？',
                            okText: '确认',
                            okButtonProps: { prefixCls: 'oss-ui-btn' },
                            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                            okType: 'danger',
                            cancelText: '取消',
                            prefixCls: 'oss-ui-modal',
                            onOk: () => {
                                this.handleSave(params);
                            },
                            onCancel() {},
                        });
                    }}
                >
                    保存
                </AuthButton>
            );
        }
        return (
            <AuthButton addLog={true} loading={loading} authKey={this.getAuthKey()} type="primary" onClick={(params) => this.handleSave(params)}>
                保存
            </AuthButton>
        );
    };

    getAuthKey = () => {
        let keys = '';
        const { modelType } = this.state;
        const { match } = this.props;
        const { moduleId } = match.params;
        switch (modelType) {
            case 'new':
                return (keys = buttonKes.add[moduleId]);
            case 'edit':
                return (keys = buttonKes.edit[moduleId]);
            case 'copy':
                return (keys = buttonKes.copy[moduleId]);
            default:
                break;
        }
        return keys;
    };

    render() {
        const { filterInfo, modelType, loading, provinceList } = this.state;
        const { match, login } = this.props;

        const { moduleId } = match.params;

        const TypeContent = moduleIdEditContentMap[moduleId];

        const treeHeight = !hasActionIds.includes(match.params.moduleId) ? `${window.innerHeight - 408}px` : `160px`;

        const title = { new: '新建', edit: '编辑', copy: '拷贝' };
        // 需要置顶的条件项
        const topFieldNames = 'org_type,network_type_top,province_id,professional_type,alarm_title,title_text';
        return (
            <PageContainer
                gridContentStyle={{ height: `calc(100% - 50px)` }}
                title={
                    <div className="volume-title" style={{ display: this.isCheck ? 'none' : '' }}>
                        <span className="volume-form-box" />
                        <span>{title[`${modelType}`]}</span>
                    </div>
                }
            >
                <Card bodyStyle={{ height: '100%', overflow: 'hidden' }} style={{ height: '100%' }} className="filter-edit-container-card">
                    <Spin spinning={loading}>
                        <Row>
                            <Col span={24}>
                                <Form labelAlign="right" labelCol={{ span: 6 }} ref={this.filterFormRef} style={{ height: '100%' }}>
                                    {moduleId === '1' ||
                                    moduleId === '8' ||
                                    moduleId === '64' ||
                                    moduleId === '4' ||
                                    moduleId === '14' ||
                                    moduleId === '63' ||
                                    moduleId === '70' ? (
                                        <Fragment>
                                            <Row>
                                                <Col span={24}>
                                                    <Row style={{ height: '100%' }}>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                label={moduleId === '1' ? '过滤器名称' : '规则名称'}
                                                                name="filterName"
                                                                rules={[
                                                                    { required: true, message: '不可为空' },
                                                                    { pattern: formatReg.noEmpety, message: '不可为空格' },
                                                                    { pattern: formatReg.noSpecialSymbol, message: '规则名称不可存在特殊符号' },
                                                                    {
                                                                        validator: (rule, value, callback) => {
                                                                            // eslint-disable-next-line no-control-regex
                                                                            const valueLength = value
                                                                                ? value.replace(/[^\x00-\xff]/g, 'aa').length
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
                                                                        return <Input disabled={this.disabled} allowClear />;
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                label="描述"
                                                                name="filterDesc"
                                                                rules={[
                                                                    { pattern: formatReg.noEmpety, message: '不可为空格' },
                                                                    {
                                                                        validator: (rule, value, callback) => {
                                                                            // eslint-disable-next-line no-control-regex
                                                                            const valueLength = value
                                                                                ? value.replace(/[^\x00-\xff]/g, 'aa').length
                                                                                : 0;
                                                                            if (valueLength > 200) {
                                                                                callback('总长度不能超过200位（1汉字=2位）');
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
                                                                        return <Input disabled={this.disabled} allowClear />;
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    <Row style={{ height: '100%' }}>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                label={'归属省份'}
                                                                name="filterProvince"
                                                                rules={[{ required: true, message: '不可为空' }]}
                                                            >
                                                                <Field
                                                                    mode={this.isCheck ? 'read' : 'edit'}
                                                                    renderFormItem={() => {
                                                                        return (
                                                                            <Select>
                                                                                {provinceList
                                                                                    .filter((items) =>
                                                                                        this.getInitialProvince(
                                                                                            login.systemInfo?.currentZone?.zoneId,
                                                                                            login.userInfo,
                                                                                        )
                                                                                            ? items.regionId ===
                                                                                              this.getInitialProvince(
                                                                                                  login.systemInfo?.currentZone?.zoneId,
                                                                                                  login.userInfo,
                                                                                              )
                                                                                            : true,
                                                                                    )
                                                                                    .map((item) => {
                                                                                        return (
                                                                                            <Select.Option
                                                                                                value={item.regionId}
                                                                                                key={item.regionId}
                                                                                                label={item.regionName}
                                                                                            >
                                                                                                {item.regionName}
                                                                                            </Select.Option>
                                                                                        );
                                                                                    })}
                                                                            </Select>
                                                                        );
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                label={'归属专业'}
                                                                name="filterProfessional"
                                                                rules={[{ required: true, message: '不可为空' }]}
                                                            >
                                                                <Field
                                                                    mode={this.isCheck ? 'read' : 'edit'}
                                                                    renderFormItem={(item, { fieldProps }) => {
                                                                        return (
                                                                            <SelectCondition
                                                                                {...fieldProps}
                                                                                form={this.filterFormRef?.current}
                                                                                mode="multiple"
                                                                                title={'归属专业'}
                                                                                id="key"
                                                                                label="value"
                                                                                dictName={'professional_type'}
                                                                                searchName={'professional_type'}
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row style={{ display: moduleId === '1' ? 'none' : null }}>
                                                <Col span={24}>
                                                    <Row style={{ height: '100%' }}>
                                                        <Col span={8} style={{ height: '100%' }}>
                                                            <Form.Item label="创建人">
                                                                <Field
                                                                    mode={this.isCheck ? 'read' : 'edit'}
                                                                    text={modelType === 'new' ? this.props.login.userName : filterInfo.creator}
                                                                    renderFormItem={() => {
                                                                        return (
                                                                            <Input
                                                                                disabled
                                                                                value={
                                                                                    modelType === 'new'
                                                                                        ? this.props.login.userName
                                                                                        : filterInfo.creator
                                                                                }
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        {/* {moduleId !== '1' && ( */}
                                                        <Col span={6} offset={1} style={{ height: '100%', lineHeight: '32px' }}>
                                                            <Field
                                                                mode={this.isCheck ? 'read' : 'edit'}
                                                                text={Number(filterInfo.enable) === FILTER_EMUN.ENABLE.TRUE ? '启用' : '未启用'}
                                                                renderFormItem={() => {
                                                                    return (
                                                                        <Checkbox
                                                                            checked={Number(filterInfo.enable) === FILTER_EMUN.ENABLE.TRUE}
                                                                            disabled={Number(filterInfo.moduleId) === 14}
                                                                            onChange={this.onStartUse}
                                                                        >
                                                                            是否启用
                                                                        </Checkbox>
                                                                    );
                                                                }}
                                                            />

                                                            {showPrivateFields.includes(match.params.moduleId) && (
                                                                <>
                                                                    {this.isCheck ? '，' : null}
                                                                    <Field
                                                                        mode={this.isCheck ? 'read' : 'edit'}
                                                                        text={filterInfo.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE ? '私有' : '非私有'}
                                                                        renderFormItem={() => {
                                                                            return (
                                                                                <Checkbox
                                                                                    checked={filterInfo.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE}
                                                                                    onChange={this.onPrivateChange}
                                                                                >
                                                                                    是否私有
                                                                                </Checkbox>
                                                                            );
                                                                        }}
                                                                    />
                                                                </>
                                                            )}
                                                        </Col>
                                                        {/* )} */}
                                                    </Row>
                                                </Col>
                                                {/* <Col span={24}>
                                            <Row>
                                                <Col span={8}>
                                                    <Form.Item label={'类型'} name="filterTypeId" rules={[{ required: true, message: '不可为空' }]}>
                                                        <Field
                                                            mode={this.isCheck ? 'read' : 'edit'}
                                                            renderFormItem={() => {
                                                                return <Select options={typeDataList}></Select>;
                                                            }}
                                                            render={() => {
                                                                return filterInfo.filterTypeName;
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} offset={2} style={{ height: '100%', lineHeight: '32px' }}>
                                                    <Field
                                                        mode={this.isCheck ? 'read' : 'edit'}
                                                        text={Number(filterInfo.enable) === FILTER_EMUN.ENABLE.TRUE ? '启用' : '未启用'}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Checkbox
                                                                    checked={Number(filterInfo.enable) === FILTER_EMUN.ENABLE.TRUE}
                                                                    onChange={this.onStartUse}
                                                                >
                                                                    是否启用
                                                                </Checkbox>
                                                            );
                                                        }}
                                                    />

                                                    {showPrivateFields.includes(match.params.moduleId) && (
                                                        <>
                                                            {this.isCheck ? '，' : null}
                                                            <Field
                                                                mode={this.isCheck ? 'read' : 'edit'}
                                                                text={filterInfo.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE ? '私有' : '非私有'}
                                                                renderFormItem={() => {
                                                                    return (
                                                                        <Checkbox
                                                                            checked={filterInfo.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE}
                                                                            onChange={this.onPrivateChange}
                                                                        >
                                                                            是否私有
                                                                        </Checkbox>
                                                                    );
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </Col>
                                            </Row>
                                        </Col> */}
                                            </Row>
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                            <Row>
                                                <Col span={24}>
                                                    <Row style={{ height: '100%' }}>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                label={moduleId === '1' ? '过滤器名称' : '规则名称'}
                                                                name="filterName"
                                                                rules={[
                                                                    { required: true, message: '不可为空' },
                                                                    { pattern: formatReg.noEmpety, message: '不可为空格' },
                                                                    {
                                                                        validator: (rule, value, callback) => {
                                                                            // eslint-disable-next-line no-control-regex
                                                                            const valueLength = value
                                                                                ? value.replace(/[^\x00-\xff]/g, 'aa').length
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
                                                                        return <Input disabled={this.disabled} allowClear />;
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8} style={{ height: '100%' }}>
                                                            <Form.Item label="创建人">
                                                                <Field
                                                                    mode={this.isCheck ? 'read' : 'edit'}
                                                                    text={modelType === 'new' ? this.props.login.userName : filterInfo.creator}
                                                                    renderFormItem={() => {
                                                                        return (
                                                                            <Input
                                                                                disabled
                                                                                value={
                                                                                    modelType === 'new'
                                                                                        ? this.props.login.userName
                                                                                        : filterInfo.creator
                                                                                }
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        {/* {moduleId !== '1' && ( */}
                                                        <Col span={6} offset={1} style={{ height: '100%', lineHeight: '32px' }}>
                                                            <Field
                                                                mode={this.isCheck ? 'read' : 'edit'}
                                                                text={Number(filterInfo.enable) === FILTER_EMUN.ENABLE.TRUE ? '启用' : '未启用'}
                                                                renderFormItem={() => {
                                                                    return (
                                                                        <Checkbox
                                                                            checked={Number(filterInfo.enable) === FILTER_EMUN.ENABLE.TRUE}
                                                                            onChange={this.onStartUse}
                                                                        >
                                                                            是否启用
                                                                        </Checkbox>
                                                                    );
                                                                }}
                                                            />

                                                            {showPrivateFields.includes(match.params.moduleId) && (
                                                                <>
                                                                    {this.isCheck ? '，' : null}
                                                                    <Field
                                                                        mode={this.isCheck ? 'read' : 'edit'}
                                                                        text={filterInfo.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE ? '私有' : '非私有'}
                                                                        renderFormItem={() => {
                                                                            return (
                                                                                <Checkbox
                                                                                    checked={filterInfo.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE}
                                                                                    onChange={this.onPrivateChange}
                                                                                >
                                                                                    是否私有
                                                                                </Checkbox>
                                                                            );
                                                                        }}
                                                                    />
                                                                </>
                                                            )}
                                                        </Col>
                                                        {/* )} */}
                                                    </Row>
                                                </Col>
                                                {/* <Col span={24}>
                                            <Row>
                                                <Col span={8}>
                                                    <Form.Item label={'类型'} name="filterTypeId" rules={[{ required: true, message: '不可为空' }]}>
                                                        <Field
                                                            mode={this.isCheck ? 'read' : 'edit'}
                                                            renderFormItem={() => {
                                                                return <Select options={typeDataList}></Select>;
                                                            }}
                                                            render={() => {
                                                                return filterInfo.filterTypeName;
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} offset={2} style={{ height: '100%', lineHeight: '32px' }}>
                                                    <Field
                                                        mode={this.isCheck ? 'read' : 'edit'}
                                                        text={Number(filterInfo.enable) === FILTER_EMUN.ENABLE.TRUE ? '启用' : '未启用'}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Checkbox
                                                                    checked={Number(filterInfo.enable) === FILTER_EMUN.ENABLE.TRUE}
                                                                    onChange={this.onStartUse}
                                                                >
                                                                    是否启用
                                                                </Checkbox>
                                                            );
                                                        }}
                                                    />

                                                    {showPrivateFields.includes(match.params.moduleId) && (
                                                        <>
                                                            {this.isCheck ? '，' : null}
                                                            <Field
                                                                mode={this.isCheck ? 'read' : 'edit'}
                                                                text={filterInfo.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE ? '私有' : '非私有'}
                                                                renderFormItem={() => {
                                                                    return (
                                                                        <Checkbox
                                                                            checked={filterInfo.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE}
                                                                            onChange={this.onPrivateChange}
                                                                        >
                                                                            是否私有
                                                                        </Checkbox>
                                                                    );
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </Col>
                                            </Row>
                                        </Col> */}
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Row style={{ height: '100%' }}>
                                                        <Col span={16}>
                                                            <Form.Item
                                                                label="描述"
                                                                name="filterDesc"
                                                                labelCol={{ span: 3 }}
                                                                rules={[
                                                                    { pattern: formatReg.noEmpety, message: '不可为空格' },
                                                                    {
                                                                        validator: (rule, value, callback) => {
                                                                            // eslint-disable-next-line no-control-regex
                                                                            const valueLength = value
                                                                                ? value.replace(/[^\x00-\xff]/g, 'aa').length
                                                                                : 0;
                                                                            if (valueLength > 200) {
                                                                                callback('总长度不能超过200位（1汉字=2位）');
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
                                                                        return (
                                                                            <Input.TextArea
                                                                                disabled={this.disabled}
                                                                                autoSize={{ minRows: 2, maxRows: 3 }}
                                                                                allowClear
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Fragment>
                                    )}
                                    {hasActionIds.includes(match.params.moduleId) && (
                                        <Row>
                                            <Col style={{ height: '100%' }} span={24}>
                                                <Row style={{ height: '100%' }}>
                                                    <Col span={16}>
                                                        <Form.Item label="条件编辑：" style={{ marginBottom: 0 }} labelCol={{ span: 3 }}>
                                                            <ConditionEdit
                                                                isCheck={this.isCheck}
                                                                moduleId={Number(this.props.match.params.moduleId)}
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
                                                </Row>
                                            </Col>
                                        </Row>
                                    )}
                                </Form>
                            </Col>
                        </Row>

                        {!hasActionIds.includes(match.params.moduleId) && (
                            <Row gutter={24} style={{ height: `calc(100% - 200px)` }}>
                                <Col span={6} offset={2}>
                                    <Card bordered="true" size="small" style={{ height: '100%' }} bodyStyle={{ height: '100%' }}>
                                        <Form.Item label="条件编辑：" labelAlign="left" labelCol={{ span: 5 }} style={{ marginBottom: '8px' }} />
                                        <ConditionEdit
                                            isCheck={this.isCheck}
                                            disabled={this.disabled}
                                            moduleId={Number(this.props.match.params.moduleId)}
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
                                    </Card>
                                </Col>

                                <Col
                                    style={{
                                        height: '100%',
                                        overflow: 'auto',
                                    }}
                                    span={16}
                                >
                                    <div className="rightContent_edit">
                                        <TypeContent
                                            filterInfo={filterInfo}
                                            mode={this.props.mode}
                                            login={this.props.login}
                                            initialValues={filterInfo.filterProperties || []}
                                            ref={this.actionFormRef}
                                            modelType={modelType}
                                            moduleId={Number(this.props.match.params.moduleId)}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        )}
                        {this.isCheck ? (
                            ''
                        ) : (
                            <Row style={{ padding: '16px 0' }}>
                                <Col span={24}>
                                    <div style={{ textAlign: 'center' }}>
                                        <Space>
                                            {moduleId === '4' || moduleId === '14' ? (
                                                this.renderOkButton()
                                            ) : (
                                                <AuthButton
                                                    addLog={true}
                                                    type="primary"
                                                    loading={loading}
                                                    authKey={this.getAuthKey()}
                                                    onClick={(params) => this.handleSave(params)}
                                                >
                                                    保存
                                                </AuthButton>
                                            )}
                                            <Button onClick={this.handleCancel}>取消</Button>
                                        </Space>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Spin>
                </Card>
            </PageContainer>
        );
    }
}

export default withModel([useLoginInfoModel, usePageInfo], (shareInfo) => ({
    login: shareInfo[0],
    pageInfo: shareInfo[1],
}))(Index);
