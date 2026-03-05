/* eslint-disable consistent-return */
import React from 'react';
import { Button, Icon, Tooltip, Select, Modal } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import './index.less';
// import { groupApi } from '../../common/api/service/groupApi';
import { filterApi } from '@Common/api/service/filterApi';
import { monitor } from '@Common/api/service/monitor';
import constants from '@Common/constants';
import Detail from './edit/edit-content';
import AuthButton from '@Src/components/auth-button';
import { getInitialProvince } from '@Common/utils/getInitialProvince';

const REFRESH_TIME = 60000;

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.actionRef = React.createRef();
        this.state = {
            moduleId: this.props.match.params.moduleId,
            provinceList: [],
            professionalList: [],
            viewModalVisible: false,
            viewModuleId: '',
            viewId: '',
        };
    }

    refreshTimer = null;

    get api() {
        return filterApi;
    }

    get monitorApi() {
        return monitor;
    }

    get statusList() {
        return [
            { value: '', label: '全部' },
            { value: 1, label: '正常' },
            { value: 2, label: '异常' },
        ];
    }

    get timeUnitList() {
        return {
            1: '分',
            2: '时',
        };
    }

    get columns() {
        const { provinceList, professionalList } = this.state;
        return [
            {
                title: '状态',
                dataIndex: 'businessStatus',
                width: 50,
                align: 'center',
                initialValue: '',
                renderFormItem: () => <Select options={this.statusList} />,
                render: (text, record) => {
                    return (
                        <div className="status-content">
                            {record.businessStatus === 1 ? <div className="normal-status" /> : <div className="abnormal-status" />}
                        </div>
                    );
                },
            },
            {
                title: '监测器名称',
                dataIndex: 'monitorName',
                align: 'center',
                width: 100,
                hideInSearch: true,
            },
            {
                title: '监测周期',
                dataIndex: 'timeValue',
                align: 'center',
                width: 100,
                hideInSearch: true,
                render: (text, record) => record.timeValue + '' + this.timeUnitList[record.timeUnit],
            },
            {
                title: '创建人',
                dataIndex: 'creator',
                align: 'center',
                width: 100,
                hideInSearch: true,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                align: 'center',
                width: 100,
                hideInSearch: true,
            },
            {
                title: '操作',
                valueType: 'option',
                dataIndex: 'actions',
                align: 'center',
                fixed: 'right',
                width: 50,
                render: (text, record) => {
                    let actions = [
                        <Tooltip title="查看日志">
                            <Icon antdIcon type="FileSearchOutlined" onClick={this.editClick.bind(this, record, 'view')} />
                        </Tooltip>,
                        <Tooltip title="查看详情">
                            <Icon
                                antdIcon
                                type="SearchOutlined"
                                onClick={() => {
                                    this.handleModalView(record);
                                }}
                            />
                        </Tooltip>,
                    ];
                    const { login } = this.props;
                    const { isAdmin } = JSON.parse(login.userInfo);
                    const { userId } = login;
                    if (isAdmin || record.creatorId == Number(userId)) {
                        actions = [
                            ...actions,
                            <Tooltip title="编辑">
                                <AuthButton
                                    onClick={this.editClick.bind(this, record, 'edit')}
                                    type="text"
                                    style={{ padding: 0 }}
                                    authKey="alarmBreakMonitor:edit"
                                >
                                    <Icon type="EditOutlined" title="编辑" antdIcon moduleId={this.state.moduleId} />
                                </AuthButton>
                            </Tooltip>,
                            <Tooltip title="删除">
                                <AuthButton
                                    addLog={true}
                                    onClick={this.deleteClick.bind(this, record)}
                                    type="text"
                                    style={{ padding: 0 }}
                                    authKey="alarmBreakMonitor:delete"
                                >
                                    <Icon antdIcon type="DeleteOutlined" />
                                </AuthButton>
                            </Tooltip>,
                        ];
                    }
                    return actions;
                },
            },
            {
                title: '省份',
                dataIndex: 'province_id',
                hideInTable: true,
                renderFormItem: () => {
                    return (
                        <Select
                            showSearch
                            // options={provinceList.filter((item) =>
                            //     this.props.login.systemInfo?.currentZone?.zoneId
                            //         ? `${this.props.login.systemInfo?.currentZone?.zoneId}` === `${item.value}`
                            //         : true,
                            // )}
                            options={provinceList}
                            optionFilterProp="label"
                            placeholder={`请选择省份`}
                        />
                    );
                },
            },
            // {
            //     title: '专业',
            //     dataIndex: 'professional_type',
            //     hideInTable: true,
            //     initialValue: '',
            //     renderFormItem: () => {
            //         return <Select showSearch placeholder="请选择专业" optionFilterProp="label" options={professionalList} />;
            //     },
            // },
            {
                title: '关键字',
                dataIndex: 'keyWork',
                hideInTable: true,
            },
        ];
    }

    editClick = (record, type) => {
        const { moduleId, provinceList } = this.state;
        let targetUrl = `/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-interrupt-monitor/${type}/${moduleId}/${record.monitorId}`;
        const province_id = this.formRef.current?.getFieldValue('province_id') || record.filterProvince;
        const target = provinceList.find((item) => item.value === province_id);
        if (province_id) {
            targetUrl = `/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-interrupt-monitor/${type}/${moduleId}/${record.monitorId}/${province_id}/${target?.label}`;
        }
        this.props.history.push({ pathname: targetUrl, state: { province_id: province_id } });
    };

    getMonitorData = async (params) => {
        const {
            login: { userId },
        } = this.props;
        // const { moduleId } = this.state;
        const values = this.formRef.current?.getFieldsValue();
        const { current, pageSize } = params;
        const { keyWork = '' } = values || {};
        const businessStatus = values?.businessStatus || null;
        const province_id = Number(values?.province_id);
        // const arr = [];
        // if (province_id) {
        //     arr.push({ key: 'province_id', value: [province_id] });
        //     //arr.push({ key: 'filterProvince', value: [province_id] });
        // }
        // if (professional_type) {
        //     arr.push({ key: 'professional_type', value: [professional_type] });
        // }
        // const queryProperties = JSON.stringify(arr);
        // const data = {
        //     ...rest,
        //     current,
        //     pageSize,
        //     modelId: 2,
        //     moduleId,
        //     queryProperties,
        //     filterName,
        //     filterProvince: province_id,
        //     professionalType: professional_type,
        //     filterProvince: province_id,
        //     creator: this.props.login.userId,
        //     orderFieldName: 'businessStatus',
        //     order: 2,
        // };
        // const res = await this.api.getInterruptMonitorList(data);
        const res = await this.monitorApi.getMonitorList({
            current,
            pageSize,
            businessStatus,
            provinceId: province_id,
            keyWork,
            userId: String(userId),
        });
        // if (res && Array.isArray(res.data)) {
        //     const result = res.data.map((item) => {
        //         const unit = item.filterProperties[1]?.value === 'M' ? '分' : '时';
        //         const useTime = item.filterProperties[0]?.value + unit;
        //         return { ...item, useTime };
        //     });
        //     const sort = result.sort((a, b) => {
        //         const aTime = moment(a.createTime).valueOf();
        //         const bTime = moment(b.createTime).valueOf();
        //         return bTime - aTime;
        //     });
        //     const normal = sort.filter((item) => item.businessStatus === 1);
        //     const error = sort.filter((item) => item.businessStatus === 2);
        //     return {
        //         success: true,
        //         total: res.total,
        //         data: [...error, ...normal],
        //     };
        // }
        return {
            success: true,
            total: res.total,
            data: res.data,
        };
    };

    async componentDidMount() {
        const {
            login: { userId, systemInfo, userInfo },
        } = this.props;
        let zoneObj = {};
        let userInfos = userInfo && JSON.parse(userInfo);

        if (systemInfo.currentZone?.zoneLevel === '5' && userInfos?.zones[0].zoneLevel === '1') {
            zoneObj = { zoneId: systemInfo.currentZone?.zoneId };
        }
        this.getProfessionalList();
        // let provinceList = await groupApi.getProvinces(userId);
        // provinceList = provinceList.map((item) => ({ label: item.regionName, value: item.regionId }));
        let provinceList = await filterApi.getProvinceList(userId, zoneObj);
        provinceList = provinceList.map((item) => ({ label: item.value, value: item.key }));

        const province_id = getInitialProvince(this.props.login);
        provinceList = provinceList.filter((item) => item.value === province_id);
        this.setState({ provinceList });
        this.formRef?.current?.setFieldsValue({ province_id });
        this.refreshData();
    }

    componentWillUnmount() {
        clearTimeout(this.refreshTimer);
    }

    refreshData = () => {
        this.actionRef.current.reload();
        this.refreshTimer = setTimeout(() => {
            this.refreshData();
        }, REFRESH_TIME);
    };

    getProfessionalList = async () => {
        const { userId } = this.props.login;
        let professionalList = await filterApi.getProfessionList(userId);
        if (professionalList.length > 1) {
            professionalList.unshift({ value: '全部', key: '' });
        }
        professionalList = professionalList.map((item) => ({ label: item.value, value: item.key }));
        this.setState({ professionalList });
    };

    deleteClick = (record, params) => {
        const { moduleId } = this.state;
        const modifier = this.props.login.userId;
        const { monitorId } = record || {};
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: '此操作将永久删除选中项，是否继续？',
            width: '350px',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: async () => {
                await this.monitorApi.deleteMontiorData(
                    {
                        // filterId: record.filterId, // 过滤器ID
                        // moduleId,
                        // modelId: 2, // 所属模型ID
                        // modifier,
                        monitorId,
                    },
                    params,
                );
                this.actionRef.current.reload();
            },
        });
    };

    goAdd = () => {
        const { moduleId, provinceList } = this.state;
        let targetUrl = `/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-interrupt-monitor/new/${moduleId}/new`;
        const province_id = this.formRef.current.getFieldValue('province_id');
        const target = provinceList.find((item) => item.value === province_id);
        if (province_id) {
            targetUrl = `/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-interrupt-monitor-add/new/${moduleId}/new/${province_id}/${target?.label}`;
        }
        this.props.history.push({ pathname: targetUrl, state: { province_id } });
    };

    onReset = () => {
        // const { provinceList } = this.state;
        // const province_id = provinceList.length ? provinceList[0].value : '';
        const provinceId = getInitialProvince(this.props.login);
        this.formRef.current.setFieldsValue({ businessStatus: '', province_id: provinceId, keyWork: '' });
        this.actionRef.current.reload();
    };

    renderModal = () => {
        const { viewModuleId, viewId } = this.state;
        const province_id = this.formRef.current?.getFieldValue('province_id');
        return (
            <Detail
                modeParams={{
                    type: 'edit',
                    moduleId: viewModuleId,
                    id: viewId,
                    isCheck: true,
                    provinceId: province_id,
                }}
                mode={'read'}
            />
        );
    };

    handleModalView = (value) => {
        this.setState(
            {
                viewModuleId: value.modelId,
                viewId: value.monitorId,
                viewName: value.monitorName,
            },
            () => {
                this.setState({
                    viewModalVisible: true,
                });
            },
        );
    };

    handleModalCancel = () => {
        this.setState({
            viewModalVisible: false,
        });
    };

    render() {
        const { viewModalVisible, viewName } = this.state;
        return (
            <div className="alarm-interrupt-monitor-content">
                <VirtualTable
                    rowKey="rowKey"
                    manualRequest
                    request={this.getMonitorData}
                    global={window}
                    columns={this.columns}
                    x={'100%'}
                    rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                    borderd="true"
                    formRef={this.formRef}
                    actionRef={this.actionRef}
                    search={{
                        className: 'virtualTable-form-setting',
                        span: { xs: 24, sm: 6, md: 6, lg: 6, xl: 4, xxl: 4 },
                        optionRender: (searchConfig, formProps, dom) => [...dom.slice(1, 2), <Button onClick={this.onReset}>重置</Button>],
                    }}
                    toolBarRender={() => [
                        <AuthButton
                            onClick={this.goAdd}
                            // type="text"
                            // style={{ padding: 0 }}
                            authKey="alarmBreakMonitor:add"
                        >
                            <Icon antdIcon type="PlusOutlined" />
                            新建
                        </AuthButton>,
                    ]}
                />
                <Modal
                    destroyOnClose
                    visible={viewModalVisible}
                    width={1200}
                    onCancel={() => {
                        this.handleModalCancel();
                    }}
                    footer={
                        <div style={{ textAlign: 'center' }}>
                            <Button
                                type="default"
                                onClick={() => {
                                    this.handleModalCancel();
                                }}
                            >
                                取消
                            </Button>
                        </div>
                    }
                    title={viewName}
                >
                    {this.renderModal()}
                </Modal>
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
