import React from 'react';
import { Button, Icon, message, Modal, Select, Tooltip } from 'oss-ui';
import { withModel } from 'hox';
import constants from '@Common/constants';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { openRoute } from '@Src/hooks';
import shareActions from '@Src/share/actions';
import './index.less';
import { createFileFlow } from '@Common/utils/download';
import { VirtualTable } from 'oss-web-common';
import moment from 'moment';
import DateRangeTime from '@Components/date-range-time';
import { urlSearchObjFormat } from '@Common/utils/urlSearchObjFormat';
import dayjs from 'dayjs';
import request from '@Common/api';
import { _ } from 'oss-web-toolkits';
import { logNew } from '@Common/api/service/log';
import AuthButton from '@Src/components/auth-button';
import { blobDownLoad } from '@Common/utils/download';
import { sendLogFn } from '@Pages/components/auth/utils';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';
import {
    getCenterListApi,
    getCenterForControlList,
    getProvinceList,
    getProvinceListForControl,
    findTrackList,
    findTrackCount,
    exportWorkingPlanRecordByTrackList,
    dutyEvaluateExportAll,
    getGroupListApi,
    getGroupListForControlApi,
    getExportProgressApi,
    fileDownLoadApi,
    autoSendOrder,
} from './api';
import EvaluateModal from './evaluateModal';
import AsyncExportModal from './async-export-modal';
import { getInitialProvince, getSearchParms } from './utils';

class Index extends React.PureComponent {
    // defaultGroupId = '';
    formRef = React.createRef();
    actionRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            centerList: [],
            provinceList: [],
            isEvaluateModal: false,
            evaluateModalParams: {},
            editable: true, // 未增加权限临时使用字段 true代表值班评价可编辑,false代表不可以  传入EvaluateModal组件
            pagination: {},
            sorter: undefined,
            groupList: [],
            defaultGroupId: '',
            asyncExportModalVisible: false,
            totalNum: 0,
            hasControlAuth: props.login.parsedUserInfo?.operationsButton.find((e) => e.key === 'recordDutySetting:control'),
        };
    }
    // async componentDidMount() {
    //     console.log(this.props.login, '==login');
    //     await this.getProvinceList();
    //     getDefaultGroupByUser().then((res) => {
    //         this.formRef.current?.setFieldsValue({
    //             searchGroup: res.groupName || '',
    //         });
    //         // this.defaultGroupId = res.groupId;
    //         setTimeout(() => {
    //             this.actionRef.current.reload();
    //         }, 200);
    //     });
    // }
    get columns() {
        return [
            {
                title: '日期',
                dataIndex: 'dateTime',
                valueType: 'date',
                initialValue: [dayjs(new Date()).subtract(1, 'months').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
                hideInTable: true,
                ellipsis: true,
                width: 160,
                renderFormItem: () => {
                    return <DateRangeTime format={'YYYY-MM-DD'} />;
                },
            },
            {
                title: '归属省份',
                dataIndex: 'provinceId',
                hideInTable: true,
                hideInSearch: false,
                align: 'center',
                width: 120,
                ellipsis: true,
                initialValue: this.state.hasControlAuth
                    ? undefined
                    : getInitialProvince(this.props.login.systemInfo?.currentZone?.zoneId, this.props.login.userInfo),
                renderFormItem: (item, { fieldProps }, form) => {
                    const { provinceList } = this.state;
                    return (
                        <Select
                            form={form}
                            {...fieldProps}
                            placeholder="全部"
                            optionFilterProp="children"
                            allowClear={this.state.hasControlAuth}
                            onChange={this.onProvinceChange}
                            mode={this.state.hasControlAuth ? 'multiple' : 'single'}
                        >
                            {provinceList
                                .filter((items) =>
                                    this.state.hasControlAuth
                                        ? true
                                        : items.regionId ===
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
                dataIndex: 'centerId',
                align: 'center',
                ellipsis: true,
                width: 120,
                hideInTable: true,
                renderFormItem: (item, { fieldProps }, form) => {
                    const { centerList } = this.state;
                    return (
                        <Select form={form} {...fieldProps} allowClear placeholder="全部" onChange={this.onCenterChange}>
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
                title: '班组名称',
                key: 'searchGroup',
                dataIndex: 'searchGroup',
                align: 'center',
                ellipsis: true,
                width: 120,
                hideInTable: true,
                initialValue: getSearchParms(['groupId']).groupId ? +getSearchParms(['groupId']).groupId : undefined,
                renderFormItem: (item, { fieldProps }, form) => {
                    const { groupList } = this.state;
                    return (
                        <Select form={form} {...fieldProps} allowClear placeholder="全部">
                            {groupList?.map((group) => {
                                return (
                                    <Select.Option key={group.groupId} value={group.groupId}>
                                        {group.groupName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '班次名称',
                key: 'workShiftName',
                dataIndex: 'workShiftName',
                align: 'center',
                ellipsis: true,
                hideInTable: true,
            },
            {
                title: '当班人',
                key: 'findUsers',
                dataIndex: 'findUsers',
                align: 'center',
                hideInTable: true,
            },
            {
                title: '序号',
                dataIndex: 'number',
                key: 'number',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
                width: 60,
                render: (text, record, index) => {
                    return index + 1;
                },
            },
            {
                title: '归属省份',
                dataIndex: 'provinceName',
                key: 'provinceName',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '归属监控中心',
                dataIndex: 'centerName',
                key: 'centerName',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '班组名称',
                dataIndex: 'groupName',
                key: 'groupName',
                align: 'center',
                hideInSearch: true,
                // ellipsis: true,
                sorter: true,
                render: (text, row) => {
                    return (
                        <div
                            onClick={this.searchDetails.bind(this, row)}
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
                title: '当班人',
                key: 'dutyUserNames',
                dataIndex: 'dutyUserNames',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '接班类型',
                key: 'takeType',
                dataIndex: 'takeType',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '值班日期',
                dataIndex: 'takeOverTime',
                key: 'takeOverTime',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '班次',
                dataIndex: 'workShiftName',
                key: 'workShiftName',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '接班时间',
                dataIndex: 'takeTime',
                key: 'takeTime',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '交班时间',
                dataIndex: 'handTime',
                key: 'handTime',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '操作',
                valueType: 'option',
                dataIndex: 'id',
                hideInSearch: true,
                fixed: 'right',
                width: '50px',
                ellipsis: true,
                render: (text, row) => [
                    <div>
                        <Tooltip title="查看">
                            <Icon
                                antdIcon
                                key="search"
                                type="SearchOutlined"
                                onClick={this.searchDetails.bind(this, row)}
                                style={{ marginRight: '10px' }}
                            />
                        </Tooltip>

                        <Tooltip title="导出">
                            <Icon
                                antdIcon
                                key="export"
                                type="ExportOutlined"
                                onClick={this.exportList.bind(this, row)}
                                style={{ marginRight: '10px' }}
                            />
                        </Tooltip>

                        <Tooltip title="值班评价">
                            <AuthButton
                                onClick={this.openModal.bind(this, row)}
                                type="text"
                                style={{ padding: 0 }}
                                authKey="recordDutySetting:evaluate"
                            >
                                <Icon antdIcon key="evaluate" type="SnippetsOutlined" />
                            </AuthButton>
                        </Tooltip>
                    </div>,
                ],
            },
        ];
    }

    async componentDidMount() {
        await this.getProvinceList();
        this.formRef.current?.setFieldsValue({
            dateTime: [dayjs(new Date()).subtract(1, 'months').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        });
        getDefaultGroupByUser().then((res) => {
            const groupId = res.groupId || '';
            this.setState({
                defaultGroupId: groupId,
            });

            setTimeout(() => {
                if (!getSearchParms(['groupId']).groupId) {
                    this.actionRef.current.reload();
                }
            }, 200);
        });
    }

    /**
     * @description: 获取省份信息
     * @param {*}
     * @return {*}
     */

    getProvinceList = async () => {
        // 若为集团则默认第一个，若为其他则选取当前省份
        const { login } = this.props;
        const { hasControlAuth } = this.state;

        const data = {
            creator: login.userId,
        };
        if (hasControlAuth) {
            data.dataProvinceId = login.systemInfo?.currentZone?.zoneId;
        }
        const res = await (hasControlAuth ? getProvinceListForControl(data) : getProvinceList(data));
        if (Array.isArray(res)) {
            this.setState({
                provinceList: res || [],
            });
            if (login.systemInfo?.currentZone?.zoneId) {
                this.formRef.current?.setFieldsValue({
                    provinceId: hasControlAuth ? undefined : login.systemInfo?.currentZone?.zoneId,
                });
            } else {
                this.formRef.current?.setFieldsValue({
                    provinceId: hasControlAuth
                        ? undefined
                        : getInitialProvince(this.props.login.systemInfo?.currentZone?.zoneId, this.props.login.userInfo),
                });
            }

            this.getCenterList();
            this.getGroupList();
        }
    };

    /**
     * @description: 监听省份变化
     * @param {*}
     * @return {*}
     */

    onProvinceChange = (value) => {
        this.formRef.current.setFieldsValue({
            provinceId: value,
        });
        this.getCenterList();
        this.getGroupList();
    };

    /**
     * @description: 获取监控中心列表
     * @param {*}
     * @return {*}
     */

    getCenterList = async () => {
        const { login } = this.props;
        const { hasControlAuth } = this.state;
        const provinceId = this.formRef.current?.getFieldValue('provinceId');
        // if (!provinceId) return;
        const data = {
            provinceId,
            associatedGroupId: '',
        };
        const controlData = {
            dataProvinceId: login.systemInfo?.currentZone?.zoneId,
            operateUser: login.userId,
            provinceIds: provinceId,
        };
        const res = await (hasControlAuth ? getCenterForControlList(controlData) : getCenterListApi(data));
        if (Array.isArray(res.data || res.rows)) {
            const list = res.data || res.rows;
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

    onCenterChange = async (centerId) => {
        this.getGroupList(centerId);
    };

    getGroupList = async (centerId) => {
        const { defaultGroupId, hasControlAuth } = this.state;
        const { login } = this.props;

        const {
            login: { userId },
        } = this.props;
        this.formRef.current.setFieldsValue({
            centerId,
        });

        let param = { centerId, operateUser: userId };
        const provinceId = this.formRef.current?.getFieldValue('provinceId');
        if (!centerId) {
            param = { ...param, provinceId };
        }
        const controlParam = {
            dataProvinceId: login.systemInfo?.currentZone?.zoneId,
            operateUser: login.userId,
            provinceIds: provinceId,
            centerId: centerId,
        };
        const res = await getGroupListApi(hasControlAuth ? controlParam : param);
        if (Array.isArray(res.rows) && res.rows.length > 0) {
            const list = res.rows;

            const tempGroup = list.find((item) => item.groupId == defaultGroupId) || list[0].userStatus != -1 ? list[0] : undefined;

            this.setState(
                {
                    groupList: list || [],
                },
                () => {
                    if (centerId) {
                        this.formRef.current?.setFieldsValue({
                            searchGroup: tempGroup?.groupId || undefined,
                        });
                    } else {
                        this.formRef.current?.setFieldsValue({
                            searchGroup: undefined,
                        });
                    }
                },
            );
        } else {
            this.setState(
                {
                    groupList: [],
                },
                () => {
                    this.formRef.current?.setFieldsValue({
                        searchGroup: undefined,
                    });
                },
            );
        }
    };

    /**
     * @description: 获取列表数据
     * @param params
     * @return n*o
     */

    getTableData = async (params, sorter) => {
        const {
            login: { userId },
        } = this.props;
        const { userInfo } = this.props?.login;
        const userInfos = JSON.parse(userInfo);
        const { hasControlAuth } = this.state;
        const formValues = this.formRef.current.getFieldsValue();
        const { pageSize, current } = params;
        this.setState({
            pagination: {
                current: params.current,
                pageSize: params.pageSize,
            },
            sorter,
        });
        let orderType = 'desc';
        let orderFieldName = 'takeOverTime';
        if (!_.isEmpty(sorter)) {
            orderType = Object.values(sorter).toString();
            if (orderType === 'ascend') {
                orderType = 'asc';
            } else {
                orderType = 'desc';
            }
            orderFieldName = Object.keys(sorter).toString();
        }
        const data = {
            beginTime: formValues.dateTime[0] && dayjs(formValues.dateTime[0]).format('YYYY-MM-DD'),
            endTime: formValues.dateTime[1] && dayjs(formValues.dateTime[1]).format('YYYY-MM-DD'),
            provinceId: getInitialProvince(this.props.login.systemInfo?.currentZone?.zoneId, this.props.login.userInfo),
            centerId: formValues?.centerId,
            groupId: formValues?.searchGroup,
            loginProvinceId: userInfos?.zones[0]?.zoneId,
            loginUserId: userId,
            pageSize: pageSize,
            pageNum: current,
            workShiftName: formValues?.workShiftName,
            orderType,
            orderFieldName,
            findUsers: formValues?.findUsers,
            controlAccountFlag: hasControlAuth ? 1 : 0,
        };
        if (hasControlAuth) {
            data.provinceIds = formValues.provinceId || [];
        }
        try {
            const result = await findTrackList(data);
            const result2 = await findTrackCount(data);
            this.setState({
                groupData: result.data,
                totalNum: result2.resultObj,
            });
            return {
                success: true,
                total: result?.total || 0,
                data: result?.rows || [],
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
     * @description: 重置表单查询项
     * @param n*o
     * @return n*o
     */

    resetTable = () => {
        const { hasControlAuth } = this.state;
        this.formRef.current.setFieldsValue({
            provinceId: hasControlAuth ? undefined : getInitialProvince(this.props.login.systemInfo?.currentZone?.zoneId, this.props.login.userInfo),
            searchGroup: undefined,
            centerId: null,
            workShiftName: '',
            dateTime: [dayjs(new Date()).subtract(1, 'months').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
            findUsers: '',
        });
        this.getCenterList();
        this.getGroupList();
        this.actionRef.current.reload();
    };

    /**
     * @description:导出表单
     * @param
     * @return
     */
    openModal = (data) => {
        const sendData = {
            groupId: data.groupId,
            workShiftId: data.workShiftId,
            workDate: data.takeOverTime,
        };
        this.setState({
            evaluateModalParams: sendData,
            isEvaluateModal: true,
        });
    };
    cancelEvaluate = () => {
        this.setState({
            isEvaluateModal: false,
        });
    };
    exportList = (data) => {
        sendLogFn({ authKey: 'recordDutySetting:exportoperation' });
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: '是否导出此条值班记录？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                request('shiftingOfDuty/exportOneTrackList', {
                    type: 'GET',
                    baseUrlType: 'groupUrl',
                    showSuccessMessage: false,
                    defaultErrorMessage: false,
                    data: {
                        takeOverTime: data.takeOverTime,
                        workShiftId: data.workShiftId,
                        groupId: data.groupId,
                    },
                    responseType: 'blob',
                }).then((res) => {
                    // type 为需要导出的文件类型，此处为xls表格类型
                    const blob = new Blob([res]);
                    // 兼容不同浏览器的URL对象
                    const url = window.URL || window.webkitURL || window.moxURL;
                    // 创建下载链接
                    const downloadHref = url.createObjectURL(blob);
                    // 创建a标签并为其添加属性
                    const downloadLink = document.createElement('a');
                    downloadLink.href = downloadHref;
                    downloadLink.download = `值班记录导出${moment().format('YYYYMMDDHHmmss')}.xls`;
                    // 触发点击事件执行下载
                    downloadLink.click();
                    // this.actionRef.current.reload();
                    // this.setState(
                    //     {
                    //         selectedRowKeys: [],
                    //     },
                    //     () => {
                    //         this.actionRef.current.reload();
                    //     },
                    // );
                });
            },
        });
    };

    /**
     * 维护作业计划导出
     */
    exportMaintainJobList = () => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content: '是否导出维护作业计划记录？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                const {
                    login: { userId },
                } = this.props;
                const { pagination, sorter } = this.state;
                const { userInfo } = this.props?.login;
                const userInfos = JSON.parse(userInfo);
                const formValues = this.formRef.current.getFieldsValue();
                const { pageSize, current } = pagination;
                let orderType = 'desc';
                let orderFieldName = 'takeOverTime';
                if (!_.isEmpty(sorter)) {
                    orderType = Object.values(sorter).toString();
                    if (orderType === 'ascend') {
                        orderType = 'asc';
                    } else {
                        orderType = 'desc';
                    }
                    orderFieldName = Object.keys(sorter).toString();
                }

                const data = {
                    loginUserId: userId,
                    pageSize,
                    pageNum: current,
                    orderType,
                    orderFieldName,
                    beginTime: formValues.dateTime[0] && dayjs(formValues.dateTime[0]).format('YYYY-MM-DD'),
                    endTime: formValues.dateTime[1] && dayjs(formValues.dateTime[1]).format('YYYY-MM-DD'),
                    provinceId: formValues?.provinceId,
                    centerId: formValues?.centerId,
                    groupId: formValues?.searchGroup,
                    loginProvinceId: userInfos?.zones[0]?.zoneId,
                    workShiftName: formValues?.workShiftName,
                    findUsers: formValues?.findUsers,
                };

                exportWorkingPlanRecordByTrackList(data).then((res) => {
                    if (res) {
                        blobDownLoad(res, `维护作业计划详情${moment().format('YYYYMMDDHHmmss')}.xlsx`);
                    }
                });
            },
        });
    };

    /**
     * @description:导出所有数据
     * @param
     * @return
     */

    exportAllList = async () => {
        sendLogFn({ authKey: 'recordDutySetting:export' });
        const {
            login: { userId },
        } = this.props;
        const { userInfo } = this.props?.login;
        const userInfos = JSON.parse(userInfo);
        const { hasControlAuth } = this.state;
        const formValues = this.formRef.current.getFieldsValue();
        const orderType = 'desc';
        const orderFieldName = 'takeOverTime';
        const data = {
            beginTime: formValues.dateTime && dayjs(formValues.dateTime[0]).format('YYYY-MM-DD'),
            endTime: formValues.dateTime && dayjs(formValues.dateTime[1]).format('YYYY-MM-DD'),
            provinceId: getInitialProvince(this.props.login.systemInfo?.currentZone?.zoneId, this.props.login.userInfo),
            centerId: formValues?.centerId,
            groupId: formValues?.searchGroup,
            loginProvinceId: userInfos?.zones[0]?.zoneId,
            loginUserId: userId,
            workShiftName: formValues?.workShiftName,
            orderType,
            orderFieldName,
            findUsers: formValues?.findUsers,
            controlAccountFlag: hasControlAuth ? 1 : 0,
            // centerIds: [formValues.centerId],
            // groupIds: [formValues.groupId],
        };
        if (hasControlAuth) {
            data.provinceIds = formValues.provinceId;
        }
        request('shiftingOfDuty/exportAllTrackList', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
            responseType: 'blob',
        }).then((res) => {
            // type 为需要导出的文件类型，此处为xls表格类型
            const blob = new Blob([res]);
            // 兼容不同浏览器的URL对象
            const url = window.URL || window.webkitURL || window.moxURL;
            // 创建下载链接
            const downloadHref = url.createObjectURL(blob);
            // 创建a标签并为其添加属性
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadHref;
            downloadLink.download = `值班记录导出${moment().format('YYYYMMDDHHmmss')}.xls`;
            // 触发点击事件执行下载
            downloadLink.click();
            // this.actionRef.current.reload();
            // this.setState(
            //     {
            //         selectedRowKeys: [],
            //     },
            //     () => {
            //         this.actionRef.current.reload();
            //     },
            // );
        });
    };

    // 跳转到详情页
    searchDetails = (data) => {
        const mytooltipList = document.querySelectorAll('.oss-ui-tooltip'); // 获取页面所有tooltip的dom集合
        // 分别遍历让所有的悬浮框隐藏
        mytooltipList.forEach((value: any) => {
            // eslint-disable-next-line no-param-reassign
            value.style.display = 'none';
        });

        const { history } = this.props;
        const { actions } = shareActions;
        sendLogFn({ authKey: 'workbenches:dutyLogDetails' });
        logNew('值班日志查询', '300008');

        const searchObj = _.pick(data, ['groupId', 'workShiftId']);

        if (actions?.postMessage) {
            openRoute('/duty-record-detail', { ...searchObj, dateTime: data.takeOverTime });
        } else {
            history.push(
                `/znjk/${constants.CUR_ENVIRONMENT}/unicom/duty-record-detail?${urlSearchObjFormat(
                    { ...searchObj, dateTime: data.takeOverTime },
                    'str',
                )}`,
            );
        }
    };
    handleExport = async () => {
        const { login } = this.props;
        const userInfos = JSON.parse(login.userInfo);
        const values = this.formRef.current.getFieldsValue();
        const params = {
            beginTime: values.dateTime[0] ? moment(values.dateTime[0]).format('YYYY-MM-DD') : '',
            endTime: values.dateTime[1] ? moment(values.dateTime[1]).format('YYYY-MM-DD') : '',
            provinceId: values.provinceId,
            groupId: null,
            loginProvinceId: userInfos?.zones[0]?.zoneId,
            loginUserId: login.userId,
        };
        const res = await dutyEvaluateExportAll(params);
        blobDownLoad(res, `值班评价导出${moment().format('YYYYMMDDHHmmss')}.xlsx`);
    };
    sendOrder = async () => {
        const { hasControlAuth } = this.state;
        const {
            login: { userId },
            login,
        } = this.props;
        const formValues = this.formRef.current.getFieldsValue();
        const params = {
            provinceId: getInitialProvince(this.props.login.systemInfo?.currentZone?.zoneId, this.props.login.userInfo),
            beginTime: formValues.dateTime && dayjs(formValues.dateTime[0]).format('YYYY-MM-DD'),
            endTime: formValues.dateTime && dayjs(formValues.dateTime[1]).format('YYYY-MM-DD'),
            loginUserId: userId,
            orderType: 'desc',
            orderFieldName: 'takeOverTime',
            controlAccountFlag: hasControlAuth ? 1 : 0,
            dataProvinceId: login.systemInfo?.currentZone?.zoneId,
            centerId: formValues.centerId,
            groupId: formValues.groupId,
        };
        if (hasControlAuth) {
            params.provinceIds = formValues.provinceId;
        }
        await autoSendOrder(params);
    };

    getExportProgress = async () => {
        const result = await getExportProgressApi({});
        if (result) {
            const { total, exportTimeStr, exportType = 'excel', progressShow: progress, fileSrc, status } = result;
            const defaultStatus = {
                str: '',
                status: '',
            };
            if (+status === 200 && +progress === 100) {
                defaultStatus.str = '导出完成';
                defaultStatus.status = 'success';
            }
            if (+status === 0 && +progress !== 100) {
                defaultStatus.str = '正在导出';
                defaultStatus.status = 'active';
            }
            if (+status !== 200 && +status !== 0) {
                defaultStatus.str = '导出失败';
                defaultStatus.status = 'exception';
            }
            if (+status === 500) {
                defaultStatus.str = '';
                defaultStatus.status = '';
            }

            const list = {
                exportFormat: total > 200000 ? 'ZIP' : 'EXCEL',
                exportTime: exportTimeStr,
                exportTotal: total,
                exportState: defaultStatus.str,
                exportSchedule: { status: defaultStatus.status, percent: +progress },
            };
            this.setState({
                asyncExportList: defaultStatus.str ? [list] : [],
                exportBtnLoading: false,
            });
            if (+progress < 100 && !this.asyncExportTimer && +progress >= 0) {
                this.asyncExportTimer = setInterval(() => {
                    this.getExportProgress();
                }, 2000);
            }
            if (+progress === 100 || (+status !== 200 && +status !== 0)) {
                this.fileSrc = fileSrc;
                clearInterval(this.asyncExportTimer);
                this.asyncExportTimer = null;
            }
        }
    };
    onExport = () => {
        if (this.state.totalNum < 30000) {
            this.exportAllList();
        } else {
            this.sendOrder();
            this.asyncExportTimer = setInterval(() => {
                this.getExportProgress();
            }, 2000);
        }
    };
    onDownLoad = async () => {
        const url = `${useEnvironmentModel.data.environment.groupUrl.direct}${this.fileSrc}`;
        const str = this.fileSrc.replace('/cloud-view-maintainteam/export/', '');
        createFileFlow(str, url);
    };
    onClose = () => {
        clearInterval(this.asyncExportTimer);
        this.asyncExportTimer = null;
    };

    render() {
        const { asyncExportModalVisible, asyncExportList, totalNum } = this.state;
        return (
            <>
                <div className="gray-manage-wrapper">
                    <VirtualTable
                        x={100}
                        global={window}
                        columns={this.columns}
                        actionRef={this.actionRef}
                        formRef={this.formRef}
                        request={this.getTableData}
                        // rowSelection={{
                        //     fixed: true,
                        //     type: 'checkbox',
                        //     selectedRowKeys,
                        //     onChange: (rowKeys) => this.setState({ selectedRowKeys: rowKeys }),
                        // }}
                        // rowKey="groupId"
                        bordered
                        dateFormatter="string"
                        search={{
                            span: { xs: 24, sm: 6, md: 6, lg: 6, xl: 4, xxl: 6 },
                            optionRender: (searchConfig, formProps, dom) => [
                                <Button key="reset" onClick={this.resetTable}>
                                    重置
                                </Button>,
                                ...dom.slice(1, 2),
                            ],
                        }}
                        rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                        toolBarRender={() => [
                            <Button
                                onClick={() => {
                                    this.handleExport();
                                }}
                            >
                                <Icon antdIcon type="ExportOutlined" />
                                值班评价导出
                            </Button>,
                            <Button
                                onClick={() => {
                                    this.exportMaintainJobList();
                                }}
                            >
                                <Icon antdIcon type="ExportOutlined" />
                                维护作业计划导出
                            </Button>,
                            <Button
                                onClick={() => {
                                    if (totalNum < 30000) {
                                        this.exportAllList();
                                    } else {
                                        this.getExportProgress();
                                        this.setState({ asyncExportModalVisible: true });
                                    }
                                }}
                            >
                                <Icon antdIcon type="ExportOutlined" />
                                值班记录导出
                            </Button>,
                        ]}
                    />
                </div>

                {this.state.isEvaluateModal && (
                    <EvaluateModal
                        userId={this.props.login.userId}
                        sourceTableParams={this.state.evaluateModalParams}
                        isEvaluateModalOpen={this.state.isEvaluateModal}
                        handleCancel={this.cancelEvaluate}
                        editable={this.state.editable}
                    />
                )}
                <AsyncExportModal
                    visible={asyncExportModalVisible}
                    setVisible={(v) => this.setState({ asyncExportModalVisible: v })}
                    onExport={() => this.onExport()}
                    exportList={asyncExportList}
                    onDownLoad={() => this.onDownLoad()}
                    onClose={() => this.onClose()}
                    total={totalNum}
                />
            </>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
