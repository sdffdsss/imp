import React, { forwardRef } from 'react';
import PageContainer from '@Components/page-container';
import { VirtualTable } from 'oss-web-common';
import { Space, Icon, Tooltip, message, Select, DatePicker, Modal } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import dayjs from 'dayjs';
import AuthButton from '@Src/components/auth-button';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import urlSearch from '@Common/utils/urlSearch';
import { logNew } from '@Common/api/service/log';
import { defineScheduleData, getInitialProvince, getDefaultGroupByUser } from './utils';
import ProductionPlanModal from './production-plan-modal';
import { ReactComponent as svg1 } from './icon/schedule.svg';
import down from './icon/down.png';
import Schedule from '../../../../components/edit-schedule';
import { editEnumType } from './enum';
import EditModal from './edit';
import PageDemoModal from './page-demo-modal';
import Shift from './shift';
import { getGroupList, deleteGroup, getProvinceList, getRegionList, getCenterList, getRule, getLastNewRule, updateRule, setSendSms } from './api';
import { BatchGetDictByFieldName } from '../reinsurance-record/api';
import MessageNotice from './message-notice';
import constants from '@Common/constants';

const MyChild = forwardRef(Schedule);

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editModalShow: false,
            scheduleVisible: false,
            isProductionPlanModal: false,
            editType: 0,
            editRow: null,
            provinceList: [],
            regionList: [],
            centerList: [],
            scheduleData: {},
            scheduleRowData: {},
            scheduleTimeRange: '',
            groupFilterProvince: null,
            mode: 'edit',
            shiftVisible: false,
            operId: '',
            planModalTableData: [],
            maxMinute: 0,
            pageMode: false, // 页面模式，true-演示模式，false-常规模式
            disableBtn: false, // 禁用按钮
            isFirstLoad: true, // 是否是第一次加载
            professionalTypes: [],
            // spinning: true,
            professionalTypesInitialValues: [],
            messageModalVisible: false,
        };

        this.actionRef = React.createRef();
        this.formRef = React.createRef();
        this.scheduleRef = React.createRef();
        this.planModalRef = React.createRef();
        this.searchDom = React.createRef();
        this.provinceId = '';
        const { login } = props;
        const { userInfo = '', userId } = login;
        let userInfos = JSON.parse(userInfo);
        this.groupColumns = [
            {
                title: '班组名称',
                dataIndex: 'groupName',
                align: 'center',
                sorter: true,
                render: (text, row) => {
                    return (
                        <div
                            onClick={this.showEditModal.bind(this, editEnumType.READ, row)}
                            title={text}
                            style={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                ellipsis: true,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: '#1677ff',
                            }}
                        >
                            {text}
                        </div>
                    );
                },
            },
            {
                title: '归属省份',
                dataIndex: 'provinceName',
                hideInSearch: true,
                align: 'center',
                width: 120,
                ellipsis: true,
            },
            {
                title: '归属省份',
                dataIndex: 'provinceId',
                hideInTable: true,
                hideInSearch: false,
                align: 'center',
                width: 120,
                ellipsis: true,
                initialValue: getInitialProvince(this.props.login.systemInfo?.currentZone?.zoneId, this.props.login.userInfo),
                renderFormItem: (item, { fieldProps }, form) => {
                    const { provinceList } = this.state;
                    return (
                        <Select form={form} {...fieldProps} onChange={this.onProvinceChange}>
                            {provinceList
                                .filter(
                                    (items) =>
                                        items.regionId ===
                                        getInitialProvince(this.props.login.systemInfo?.currentZone?.zoneId, this.props.login.userInfo),
                                )
                                .map((province) => {
                                    return (
                                        <Select.Option key={province.regionId} value={province.regionId}>
                                            {province.regionName}
                                        </Select.Option>
                                    );
                                })}
                        </Select>
                    );
                },
            },
            {
                title: '归属监控中心',
                dataIndex: 'centerName',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
                sorter: true,
            },
            {
                title: '归属监控中心',
                dataIndex: 'centerId',
                align: 'center',
                ellipsis: true,
                width: 120,
                hideInTable: true,
                renderFormItem: (item, { fieldProps }, form) => {
                    const { centerList } = this.state;
                    return (
                        <Select form={form} {...fieldProps} allowClear placeholder="全部">
                            {centerList.map((center) => {
                                return (
                                    <Select.Option key={center.centerId} value={center.centerId}>
                                        {center.centerName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '专业',
                dataIndex: 'professionalTypes',
                align: 'center',
                // ellipsis: true,
                width: 120,
                initialValue: this.state.professionalTypesInitialValues,
                renderFormItem: (item, { fieldProps, ...rest }, form) => {
                    const { professionalTypes } = this.state;
                    return (
                        <Select
                            form={form}
                            {...fieldProps}
                            {...rest}
                            allowClear
                            placeholder="全部"
                            maxTagCount="responsive"
                            options={[{ label: '全部', value: '-1' }, ...professionalTypes]}
                            mode="multiple"
                        />
                    );
                },
                render: (text) => {
                    if (this.state.professionalTypes.length === 0) {
                        return '--';
                    }
                    if (!Array.isArray(text) || text.length === 0) {
                        return '--';
                    }
                    const professionalTypes = text
                        .filter(Boolean)
                        .map((item) => {
                            return this.state.professionalTypes.find((it) => it.value === item).label || '';
                        })
                        .join(',');
                    const showProfessionalTypes = professionalTypes.length > 15 ? `${professionalTypes.substring(0, 15)}...` : professionalTypes;
                    return (
                        <Tooltip title={professionalTypes}>
                            <span>{showProfessionalTypes}</span>
                        </Tooltip>
                    );
                },
            },
            {
                title: '归属地市',
                dataIndex: 'regionName',
                align: 'center',
                ellipsis: true,
                width: 120,
                hideInSearch: true,
                hideInTable: true,
                sorter: true,
            },
            {
                title: '归属地市',
                dataIndex: 'regionId',
                align: 'center',
                ellipsis: true,
                width: 120,
                hideInTable: true,
                hideInSearch: true,
                renderFormItem: (item, { fieldProps }, form) => {
                    const { regionList } = this.state;
                    return (
                        <Select form={form} {...fieldProps} allowClear placeholder="请选择地市">
                            {regionList.map((region) => {
                                return (
                                    <Select.Option key={region.regionId} value={region.regionId}>
                                        {region.regionName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '创建人',
                dataIndex: 'operateUserName',
                hideInSearch: true,
                align: 'center',
                ellipsis: true,
                width: 120,
                sorter: true,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                align: 'center',
                ellipsis: true,
                width: 180,
                sorter: true,
                hideInSearch: true,
                renderFormItem: (item, { fieldProps }, form) => {
                    return <DatePicker.RangePicker {...fieldProps} form={form} format="YYYY-MM-DD" placeholder={['开始日期', '结束日期']} />;
                },
            },
            {
                title: '操作',
                dataIndex: 'action',
                hideInSearch: true,
                fixed: 'right',
                width: 90,
                align: 'center',
                render: (text, row) => {
                    return (
                        <Space>
                            {(userId === row.operateUser || userInfos.isAdmin) && (
                                <Tooltip title="编辑">
                                    <AuthButton
                                        onClick={this.showEditModal.bind(this, editEnumType.EDIT, row)}
                                        type="text"
                                        logFalse={this.state.operId}
                                        style={{ padding: 0 }}
                                        authKey="groupManage:edit"
                                    >
                                        <Icon type="EditOutlined" antdIcon />
                                    </AuthButton>
                                </Tooltip>
                            )}
                            {(userId === row.operateUser || userInfos.isAdmin) && (
                                <Tooltip title="删除">
                                    <AuthButton
                                        type="text"
                                        style={{ padding: 0 }}
                                        authKey="groupManage:delete"
                                        addLog={true}
                                        logFalse={this.state.operId}
                                        onClick={(params) => {
                                            this.handleDelete(row, params);
                                        }}
                                    >
                                        <Icon type="DeleteOutlined" antdIcon />
                                    </AuthButton>
                                </Tooltip>
                            )}

                            <Tooltip title="查看" trigger={['hover', 'click']}>
                                <Icon type="SearchOutlined" antdIcon onClick={this.showEditModal.bind(this, editEnumType.READ, row)} />
                            </Tooltip>
                            <AuthButton
                                type="text"
                                style={{ padding: 0 }}
                                authKey="groupManage:scheduling"
                                addLog={true}
                                onClick={(params) => {
                                    this.handleSchedule(row);
                                }}
                            >
                                <Icon title="排班" component={svg1} />
                            </AuthButton>
                            <AuthButton
                                type="text"
                                style={{ padding: 0 }}
                                authKey="groupManage:operationPlan"
                                addLog
                                onClick={(params) => {
                                    this.handlePlanModal(row);
                                }}
                            >
                                <Icon title="作业计划" antdIcon type="ScheduleOutlined" />
                            </AuthButton>
                            <AuthButton type="text" style={{ padding: 0 }} authKey="groupManage:smsNotification" addLog onClick={() => {}}>
                                {/* {
                                    // 1是启用状态，0是停用状态
                                    row.sendSmsFlag === 1 ? (
                                        <Tooltip title="停用值班短信通知" trigger={['hover']}>
                                            <Icon type="MailOutlined" antdIcon onClick={() => this.shortMessageNotification('stop', row)} />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="启用值班短信通知" trigger={['hover']}>
                                            <Icon type="PlayCircleOutlined" antdIcon onClick={() => this.shortMessageNotification('start', row)} />
                                        </Tooltip>
                                    )
                                }  */}
                                <Tooltip title="值班短信通知设置" trigger={['hover']}>
                                    <Icon type="MailOutlined" antdIcon onClick={() => this.showMessageModal(row)} />
                                </Tooltip>
                            </AuthButton>
                        </Space>
                    );
                },
            },
        ];
        this.scrollX = this.groupColumns.reduce((total, item) => {
            return total + item.width;
        });
    }

    async componentDidMount() {
        await this.getProfessionalTypesList();
        await this.getProvinceList();
        this.searchDom = document.querySelector('.oss-ui-pro-table-search');
        const { srcString } = useLoginInfoModel.data;
        const urlData = urlSearch(srcString);
        if (urlData.operId) {
            this.setState({
                operId: urlData.operId,
            });
        }
        if (urlData.needInitAddModal) {
            this.showEditModal(editEnumType.ADD);
        }

        // getDefaultGroupByUser().then((res) => {
        //     this.formRef.current?.setFieldsValue({
        //         professionalTypes: res.professionalTypes,
        //     });
        //     setTimeout(() => {
        //         this.actionRef.current.reload();
        //     }, 200);
        // });
    }

    // 获取专业
    async getProfessionalTypesList() {
        const res = await BatchGetDictByFieldName(['dutyManagerProfession']);

        this.setState({
            professionalTypes: res.data.dutyManagerProfession.map((item) => ({
                label: item.value,
                value: item.key,
            })),
        });
    }
    componentDidUpdate(preProps, preState) {
        if (preState.pageMode !== this.state.pageMode) {
            if (this.state.pageMode) {
                this.searchDom.style.display = 'none';
            } else {
                this.searchDom.style.display = 'block';
            }
        }
    }
    handleDelete = (row, params) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: `班组删除后，班组下的排班将同步删除，是否继续？`,
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                if (this.state.operId) {
                    logNew('值班班组', this.state.operId);
                }
                this.deleteGroupHandler(row, params);
            },
            onCancel() {},
        });
    };

    /**
     * @description: 重置表格
     * @param {*}
     * @return {*}
     */

    onTableReset = () => {
        const { regionList } = this.state;
        this.formRef.current?.setFieldsValue({
            provinceId: getInitialProvince(this.props.login.systemInfo?.currentZone?.zoneId, this.props.login.userInfo),
            regionId: regionList[0]?.regionId,
            groupName: '',
            createTime: null,
            centerId: '',
        });
    };

    /**
     * @description: 获取省份信息
     * @param {*}
     * @return {*}
     */

    getProvinceList = async () => {
        // 若为集团则默认第一个，若为其他则选取当前省份
        const { login } = this.props;
        const data = {
            creator: login.userId,
        };
        const res = await getProvinceList(data);
        if (Array.isArray(res)) {
            this.setState({
                provinceList: res || [],
                groupFilterProvince: res.find(
                    (province) =>
                        province.regionId === getInitialProvince(this.props.login.systemInfo?.currentZone?.zoneId, this.props.login.userInfo),
                ),
            });
            // const provinceId = res[0].regionId;
            if (login.systemInfo?.currentZone?.zoneId) {
                this.formRef.current?.setFieldsValue({
                    provinceId: login.systemInfo?.currentZone?.zoneId,
                });
            } else {
                this.formRef.current?.setFieldsValue({
                    provinceId: getInitialProvince(this.props.login.systemInfo?.currentZone?.zoneId, this.props.login.userInfo),
                });
            }

            const userInfo = JSON.parse(login.userInfo);
            if (userInfo?.zones[0].zoneLevel === '3') {
                this.formRef.current?.setFieldsValue({
                    regionId: userInfo?.zones[0].zoneId,
                });
            }
            await this.getRegionList();
            await this.getCenterList();

            setTimeout(() => {
                getDefaultGroupByUser().then((res1) => {
                    this.formRef.current?.setFieldsValue({
                        professionalTypes: res1.professionalTypes,
                    });
                    setTimeout(() => {
                        this.actionRef.current.reload();
                    }, 200);
                });
            });
            // 拿到province默认值后去刷新表格
            // setTimeout(() => {
            //     this.actionRef.current.reload();
            // }, 200);
        }
    };

    /**
     * @description: 监听省份变化
     * @param {*}
     * @return {*}
     */

    onProvinceChange = (value) => {
        const { provinceList } = this.state;

        this.formRef.current.setFieldsValue({
            provinceId: value,
            regionId: '',
        });
        this.getRegionList();
        this.getCenterList();
        this.setState({
            groupFilterProvince: provinceList.find((province) => province.regionId === value),
        });
    };

    /**
     * @description: 获取监控中心列表
     * @param {*}
     * @return {*}
     */

    getCenterList = async () => {
        const provinceId = this.formRef.current?.getFieldValue('provinceId');
        if (!provinceId) return;
        const data = {
            provinceId,
            associatedGroupId: '',
        };
        const res = await getCenterList(data);
        if (Array.isArray(res.data)) {
            const list = res.data;
            // list.unshift({ centerId: '', centerName: '全部' });
            this.setState(
                {
                    centerList: list || [],
                },
                () => {
                    this.formRef.current?.setFieldsValue({
                        centerId: null,
                    });
                },
            );
        }
    };

    /**
     * @description: 获取地市列表
     * @param {*}
     * @return {*}
     */

    getRegionList = async () => {
        const { login } = this.props;
        const provinceId = this.formRef.current?.getFieldValue('provinceId');
        if (!provinceId) return;

        const data = {
            parentRegionId: provinceId,
            creator: login.userId,
        };
        const res = await getRegionList(data);

        if (Array.isArray(res)) {
            const userInfo = JSON.parse(login.userInfo);
            if (userInfo?.zones[0].zoneLevel === '3') {
                this.formRef.current?.setFieldsValue({
                    regionId: userInfo?.zones[0].zoneId,
                });

                this.setState({
                    regionList: res || [],
                });
                return;
            }
            if (Array.isArray(res.filter((item) => item.regionName === '省本部')) && res.filter((item) => item.regionName === '省本部')[0]) {
                res.unshift(
                    ...res.splice(
                        res.findIndex((i) => i.regionName === '省本部'),
                        1,
                    ),
                );
            }

            const { regionId } = res[0];
            this.formRef.current?.setFieldsValue({
                regionId,
            });
            this.setState({
                regionList: res || [],
            });
        }
    };

    /**
     * @description: 获取班组列表
     * @param {*}
     * @return {*}
     */

    getGroupListHandler = async (params, sorter) => {
        const provinceId = this.formRef.current?.getFieldValue('provinceId');
        const regionId = this.formRef.current?.getFieldValue('regionId');
        // const professionalTypes = this.formRef.current?.getFieldValue('professionalTypes');
        if (!provinceId || !regionId) {
            return {
                success: true,
                total: 0,
                data: [],
            };
        }
        let orderType = '';
        let orderFieldName = '';

        if (!_.isEmpty(sorter)) {
            // 当排序的对象不为空时，取出对象的value
            orderType = Object.values(sorter).toString();
            if (orderType === 'ascend') {
                orderType = 'asc';
            } else {
                orderType = 'desc';
            }
            orderFieldName = Object.keys(sorter).toString();
        }
        const professionalTypesV = this.formRef.current?.getFieldValue('professionalTypes');
        const professionalTypesA = professionalTypesV || params.professionalTypes;

        let professionalTypes = [];
        if (!professionalTypesA || professionalTypesA.includes('-1')) {
            professionalTypes = [];
        } else {
            professionalTypes = professionalTypesA;
        }

        const data = {
            pageSize: params.pageSize,
            pageNum: params.current,
            provinceId: provinceId || params.provinceId,
            // regionId: regionId || params.regionId,
            groupName: params.groupName,
            centerId: params.centerId,
            beginTime: params.createTime && dayjs(params.createTime[0]).format('YYYY-MM-DD'),
            endTime: params.createTime && dayjs(params.createTime[1]).format('YYYY-MM-DD'),
            orderType,
            orderFieldName,
            professionalTypes,
        };
        if (data.centerId === '') {
            delete data.centerId;
        }

        try {
            const res = await getGroupList(data);
            if (res.rows.length === 0) {
                this.setState({ disableBtn: true, isFirstLoad: false });
            } else {
                if (this.state.isFirstLoad) {
                    this.setState({ pageMode: true, isFirstLoad: false });
                }
                this.setState({ disableBtn: false });
            }

            if (Array.isArray(res.rows)) {
                return {
                    success: true,
                    total: res.total,
                    data: res.rows || [],
                    // data: [],
                };
            }

            return {
                success: true,
                total: 0,
                data: [],
            };
        } catch (e) {
            return {
                success: true,
                total: 0,
                data: [],
            };
        }
    };

    /**
     * @description: 展示编辑弹窗
     * @param {*}
     * @return {*}
     */

    showEditModal = (editType, editRow) => {
        if (this.state.operId) {
            logNew('值班班组', this.state.operId);
        }
        this.setState({
            editModalShow: true,
            editType,
            editRow,
        });
    };
    /**
     * @description: 值班短信通知弹窗
     * @param {*}
     * @return {*}
     */

    showMessageModal = (editRow) => {
        if (this.state.operId) {
            logNew('值班班组', this.state.operId);
        }
        this.setState({
            messageModalVisible: true,
            editRow,
        });
    };
    setMessageModal = (val) => {
        this.setState({
            messageModalVisible: val,
        });
        this.actionRef.current.reload();
    };

    // 排班弹窗
    handleSchedule = (row) => {
        getRule({ groupId: row.groupId }).then((res) => {
            if (res) {
                if (!res?.rules?.length) {
                    this.setState({
                        editRow: row,
                        scheduleVisible: true,
                        scheduleRowData: res,
                    });
                } else {
                    this.props.history.push({
                        pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/management-home-page/monitor-date-list`,
                        state: {
                            scheduleInfo: row,
                            scheduleRes: res.rules,
                            scheduleRange: res,
                        },
                    });
                }
            }
        });
    };
    // 作业计划弹窗
    handlePlanModal = (row) => {
        getLastNewRule({ groupId: row.groupId }).then((res) => {
            this.setState({
                editRow: { ...row, workShiftInfo: res },
                isProductionPlanModal: true,
            });
        });
    };
    refreshTableData = () => {
        this.setState({
            isProductionPlanModal: false,
        });
        this.actionRef.current.reload();
    };
    planHandleCancel = () => {
        this.setState({
            isProductionPlanModal: false,
        });
    };

    handleScheduleClose = () => {
        this.setState({
            scheduleVisible: false,
        });
    };

    handleScheduleOk = () => {
        this.scheduleRef.current.getData();
    };

    /**
     * @description: 监听编辑成功回调
     * @param {*}
     * @return {*}
     */

    onSaveGroupSuccess = () => {
        this.actionRef.current.reload();
        this.onEditModalCancel();
    };

    /**
     * @description: 关闭编辑弹窗
     * @param {*}
     * @return {*}
     */

    onEditModalCancel = () => {
        this.setState({
            editModalShow: false,
            editType: editEnumType.ADD,
            editRow: null,
        });
    };

    /**
     * @description: 删除班组
     * @param {*}
     * @return {*}
     */

    deleteGroupHandler = async (row, currentUserInfo) => {
        const data = {
            groupId: row.groupId,
        };
        try {
            const res = await deleteGroup(data, currentUserInfo);
            if (res && res.code === 200) {
                this.actionRef.current.reload();
                message.success('删除成功');
            } else {
                message.error(res.message);
            }
            // eslint-disable-next-line no-empty
        } catch (e) {}
    };

    getSchduleData = (e) => {
        const { scheduleTimeRange, editRow } = this.state;
        const { advanceTime, delayTime } = e;
        if (advanceTime + delayTime >= scheduleTimeRange) {
            return message.warn('提前时间+延后时间不能大于等于班次中最小的时间跨度');
        }
        if (defineScheduleData(e) === 'success') {
            const { date } = e;
            const rules = date.map((item) => {
                return {
                    workShiftName: item.name,
                    beginTime: moment(item.startTime).format('HH:mm:ss'),
                    endTime: moment(item.endTime).format('HH:mm:ss'),
                    timeType: item.type,
                };
            });
            const data = {
                groupId: editRow.groupId,
                rules,
                advanceTime,
                delayTime,
            };
            updateRule(data).then((res) => {
                if (res.code === 200) {
                    this.setState(
                        {
                            scheduleVisible: false,
                        },
                        () => {
                            this.handleSchedule(editRow);
                        },
                    );
                } else {
                    message.warn(res.message);
                }
            });
        } else {
            message.warn(defineScheduleData(e));
        }
    };

    getTimeRange = (e) => {
        this.setState({
            scheduleTimeRange: e,
        });
    };

    handleshiftClose = () => {
        this.setState({
            shiftVisible: false,
        });
    };
    shortMessageNotification = async (type, row) => {
        const { groupId } = row;
        if (type === 'start') {
            console.log('启用');
            this.actionRef.current.reload();
            await setSendSms({ groupId, sendSmsFlag: 1 });
        }
        if (type === 'stop') {
            console.log('停用');
            this.actionRef.current.reload();
            await setSendSms({ groupId, sendSmsFlag: 0 });
        }
    };

    render() {
        const {
            editModalShow,
            scheduleVisible,
            editType,
            editRow,
            provinceList,
            groupFilterProvince,
            centerList,
            scheduleRowData,
            shiftVisible,
            isProductionPlanModal,
            pageMode,
            disableBtn,
            maxMinute,
            messageModalVisible,
        } = this.state;
        const { login } = this.props;
        return (
            <PageContainer showHeader={false}>
                {pageMode ? <PageDemoModal /> : null}
                <div style={{ height: pageMode ? '55% ' : '100%' }}>
                    <VirtualTable
                        search={{
                            span: 6,
                        }}
                        global={window}
                        x={this.scrollX}
                        bordered
                        size="small"
                        onReset={this.onTableReset}
                        request={this.getGroupListHandler}
                        columns={this.groupColumns}
                        rowKey="groupId"
                        actionRef={this.actionRef}
                        formRef={this.formRef}
                        toolBarRender={() => [
                            <AuthButton
                                type="primary"
                                logFalse={this.state.operId}
                                authKey="groupManage:add"
                                bo
                                onClick={this.showEditModal.bind(this, editEnumType.ADD)}
                            >
                                新建
                            </AuthButton>,
                            <AuthButton
                                type="primary"
                                authKey="groupManage:shift"
                                onClick={() => {
                                    this.setState({ shiftVisible: true });
                                }}
                            >
                                换班
                            </AuthButton>,
                            <AuthButton
                                type="primary"
                                authKey="groupManage:shiftRecord"
                                onClick={() => {
                                    this.props.history.push({
                                        pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/shift-record`,
                                        state: { provinceId: this.formRef.current?.getFieldValue('provinceId') },
                                    });
                                }}
                            >
                                换班记录
                            </AuthButton>,
                            <AuthButton
                                type="primary"
                                authKey="groupManage:shiftRecord"
                                onClick={() => {
                                    this.props.history.push({
                                        pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/management-home-page/monitor-date-list`,
                                        state: {
                                            skipType: 'header',
                                        },
                                    });
                                }}
                            >
                                值班长排班
                            </AuthButton>,
                            <button
                                type="button"
                                style={{ backgroundColor: 'transparent', border: 'none', padding: 0, margin: 0 }}
                                disabled={disableBtn}
                                onClick={() => {
                                    this.setState({ pageMode: !pageMode });
                                }}
                            >
                                <img
                                    src={down}
                                    style={{ transform: pageMode ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.5s all', cursor: 'pointer' }}
                                    alt=""
                                />
                            </button>,
                        ]}
                    />
                </div>

                {editModalShow && (
                    <EditModal
                        editType={editType}
                        onSaveGroupSuccess={this.onSaveGroupSuccess}
                        editRow={editRow}
                        onEditModalCancel={this.onEditModalCancel}
                        provinceList={provinceList}
                        groupFilterProvince={groupFilterProvince}
                        centerList={centerList}
                    />
                )}
                <Modal
                    width={800}
                    destroyOnClose
                    title="修改班次"
                    visible={scheduleVisible}
                    onCancel={() => {
                        this.handleScheduleClose();
                    }}
                    onOk={() => {
                        this.handleScheduleOk();
                    }}
                >
                    <MyChild
                        ref={this.scheduleRef}
                        scheduleProps={this.props.login}
                        scheduleRange={scheduleRowData}
                        handleSchduleData={this.getSchduleData}
                        getTimeRange={this.getTimeRange}
                        rowData={scheduleRowData}
                    />
                </Modal>

                <Shift
                    shiftVisible={shiftVisible}
                    provinceList={provinceList}
                    handleshiftClose={this.handleshiftClose}
                    fieldsValue={this.formRef.current?.getFieldsValue()}
                />

                {isProductionPlanModal && (
                    <ProductionPlanModal
                        onRef={this.planModalRef}
                        handleCancel={this.planHandleCancel}
                        maxMinute={maxMinute}
                        rowInfo={editRow}
                        refreshTableData={this.refreshTableData}
                        loginInfo={login}
                    />
                )}
                {messageModalVisible && (
                    <MessageNotice
                        messageModalVisible={messageModalVisible}
                        row={editRow}
                        setMessageModal={(val) => {
                            this.setMessageModal(val);
                        }}
                    />
                )}
            </PageContainer>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
