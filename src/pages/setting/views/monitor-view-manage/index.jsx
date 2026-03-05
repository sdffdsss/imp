import React from 'react';
import { Radio, Icon, Input, Modal, Tooltip, Space, Button, Select, Row, Col, Form, message } from 'oss-ui';
import PageContainer from '@Components/page-container';
import { VirtualTable } from 'oss-web-common';
import OldEdit from './edit';
import { _ } from 'oss-web-toolkits';
import { makeCRC32 } from '@Common/utils';
import { withModel } from 'hox';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import request from '@Src/common/api';
import dayjs from 'dayjs';
import { getInitialProvince } from './utils';
import './index.less';

import AuthButton from '@Src/components/auth-button';

/**
 * 监控视图
 */

const Edit = OldEdit;
const isUnicom = useEnvironmentModel?.data?.environment?.version === 'unicom';
// const isUnicom = true;
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.confirmFormRef = React.createRef();
        this.state = {
            searchWindowName: null,
            windowType: props.match.params.id ? '1' : '-1',
            value: 2,
            editVisible: false,
            searchVisible: false,
            rowData: null,
            selectedRowIds: [],
            columns: [],
            others: [],
            mine: [],
            data: [],
            selectedRowKeys: [],
            params: {},
            searchKey: '',
            pagination: {
                current: 1,
                pageSize: 20,
                total: 20,
            },
            userInfo: {},
            centerWindowData: [],
            windowTypeObj: [],
            provinceData: [],
            provinceList: [],
            regionId: [],
            professionData: [],
            professionType: [],
            batchDeleteLoading: false,
            addLogParams: {},
        };
    }

    getColumns = () => {
        this.setState({
            columns: [
                {
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center',
                    width: 50,
                    hideInSearch: true,
                    ellipsis: true,
                },
                {
                    title: '视图名称',
                    key: 'windowName',
                    dataIndex: 'windowName',
                    hideInSearch: true,
                    // valueType: 'text',
                    width: 150,
                    sorter: true,
                    render: (text, row) => {
                        return (
                            <div
                                onClick={this.showSearchModal.bind(this, row)}
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
                    title: '中心视图名称',
                    dataIndex: 'viewName',
                    key: 'viewName',
                    hideInSearch: true,
                    hideInTable: !this.props.match.params.id || true,
                    width: 100,
                    sorter: false,
                },
                {
                    title: '视图分类',
                    dataIndex: 'windowType',
                    key: 'windowType',
                    hideInSearch: true,
                    render: (text) => {
                        if (String(text) === '0') {
                            return '当班窗口';
                        }
                        return String(text) === '1' ? '自定义视图' : '监控中心视图';
                    },
                    width: 100,
                    sorter: true,
                },
                {
                    title: '归属省份',
                    key: 'viewProvinceLabel',
                    dataIndex: 'viewProvinceLabel',
                    hideInSearch: true,
                    hideInTable: !isUnicom,
                    // valueType: 'text',
                    ellipsis: true,
                    width: 150,
                },
                {
                    title: '归属专业',
                    key: 'viewProfessionalLabel',
                    dataIndex: 'viewProfessionalLabel',
                    hideInSearch: true,
                    hideInTable: !isUnicom,
                    // valueType: 'text',
                    ellipsis: true,
                    width: 150,
                    sorter: true,
                },
                {
                    title: '创建人',
                    dataIndex: 'userName',
                    key: 'userName',
                    hideInSearch: true,
                    align: 'center',
                    width: 70,
                    sorter: false,
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    hideInSearch: true,
                    align: 'center',
                    width: 100,
                    sorter: true,
                },
                {
                    title: '修改时间',
                    dataIndex: 'latestTime',
                    key: 'latestTime',
                    hideInSearch: true,
                    align: 'center',
                    width: 100,
                    sorter: true,
                },
                {
                    title: '是否共享',
                    align: 'center',
                    dataIndex: 'windowAttribute',
                    key: 'windowAttribute',
                    hideInSearch: true,
                    render: (text) => {
                        const emun = ['否', '是'];
                        return emun[text] || '-';
                    },
                    width: 80,
                    sorter: true,
                },
                {
                    title: '是否启用',
                    align: 'center',
                    dataIndex: 'ifUsed',
                    key: 'ifUsed',
                    hideInSearch: true,
                    render: (text) => {
                        const emun = ['否', '是'];
                        return emun[text] || '-';
                    },
                    width: 80,
                    sorter: true,
                },
                {
                    title: '视图备注信息',
                    dataIndex: 'note',
                    key: 'note',
                    hideInSearch: true,
                    ellipsis: true,
                    width: 100,
                    sorter: true,
                },
                {
                    title: '操作',
                    valueType: 'option',
                    dataIndex: 'id',
                    hideInSearch: true,
                    fixed: 'right',
                    width: 110,
                    render: (text, row) => {
                        let showFlag = row?.windowOwner === this.props.login.userId || this.state.userInfo.isAdmin;
                        return (
                            <Space>
                                {showFlag && (
                                    <Tooltip title={row.ifUsed === 0 ? '启用' : '停用'}>
                                        <AuthButton
                                            onClick={this.isAvailable.bind(this, row)}
                                            type="text"
                                            style={{ padding: 0 }}
                                            authKey="alarmMonitor:action"
                                            addLog
                                        >
                                            <Icon key="1" antdIcon={true} type={row.ifUsed === 0 ? 'PlayCircleOutlined' : 'PauseCircleOutlined'} />
                                        </AuthButton>
                                    </Tooltip>
                                )}
                                <Tooltip title="查看">
                                    <Icon key="1" antdIcon={true} type="SearchOutlined" onClick={this.showSearchModal.bind(this, row)} />
                                </Tooltip>
                                {showFlag && (
                                    <Tooltip title="编辑">
                                        <AuthButton
                                            onClick={this.showEditModal.bind(this, row)}
                                            type="text"
                                            style={{ padding: 0 }}
                                            authKey="alarmMonitor:edit"
                                        >
                                            <Icon key="1" antdIcon={true} type="EditOutlined" />
                                        </AuthButton>
                                    </Tooltip>
                                )}
                                {showFlag && (
                                    <Tooltip title="删除">
                                        <AuthButton
                                            onClick={this.delModal.bind(this, row)}
                                            type="text"
                                            style={{ padding: 0 }}
                                            authKey="alarmMonitor:delete"
                                            addLog={true}
                                        >
                                            <Icon key="2" antdIcon={true} type="DeleteOutlined" />
                                        </AuthButton>
                                    </Tooltip>
                                )}
                                {this.state.value === 1 && (
                                    <Tooltip title="引用">
                                        <Icon antdIcon={true} type="ShareAltOutlined" onClick={this.shareCopyToSelfConfirm.bind(this, row)} />
                                    </Tooltip>
                                )}
                            </Space>
                        );
                    },
                },
            ],
        });
    };
    // 获取归属省份
    getProvinceData = () => {
        const { userInfo } = this.state;
        const { login } = this.props;
        const { systemInfo } = login;
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: userInfo.userId,
            },
        }).then((res) => {
            if (res && Array.isArray(res)) {
                const list = JSON.parse(JSON.stringify(res));
                //list.unshift({ regionId: 'all', regionName: '全部' });
                this.setState({
                    provinceData: list,
                    provinceList: res,
                    regionId: [getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo)],
                });
            }
        });
    };
    handleProvinceChange = (e) => {
        // const { regionId } = this.state;
        // if (regionId?.toString() === 'all' && e.toString() !== 'all') {
        //     this.setState({
        //         regionId: e.filter((item) => item !== 'all')
        //     });
        //     return;
        // }
        // if (e.find((item) => item === 'all') === 'all') {
        //     this.setState({
        //         regionId: ['all']
        //     });
        //     return;
        // }
        this.setState({
            regionId: e,
        });
    };
    // 获取归属专业
    getprofession = () => {
        const { userInfo } = this.state;
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                pageSize: 100,
                dictName: 'professional_type',
                en: false,
                modelId: 2,
                creator: userInfo.userId,
            },
        }).then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
                const list = res.data;
                // list.unshift({ key: 'all', value: '全部' });
                this.setState({
                    professionData: list,
                });
            }
        });
    };
    handleProfessionType = (e) => {
        // const { professionType } = this.state;
        // if (professionType.toString() === 'all' && e.toString() !== 'all') {
        //     this.setState({
        //         professionType: e.filter((item) => item !== 'all'),
        //     });
        //     return;
        // }
        // if (e.find((item) => item === 'all') === 'all') {
        //     this.setState({
        //         professionType: ['all'],
        //     });
        //     return;
        // }
        this.setState({
            professionType: e,
        });
    };
    // getSelectData = () => {
    //     const { userInfo } = this.state;
    //     request(`v1/center-view/${userInfo.userProvinceId}`, {
    //         type: 'get',
    //         baseUrlType: 'monitorSetUrl',
    //         // 是否需要显示失败消息提醒
    //         showErrorMessage: true,
    //     }).then((res) => {
    //         if (!_.isEmpty(res.data)) {
    //             const list = res.data.map((item) => {
    //                 return {
    //                     field: item,
    //                     value: item.id,
    //                     label: item.name,
    //                     id: item.id,
    //                 };
    //             });
    //             this.setState(
    //                 {
    //                     centerWindowData: list,
    //                 },
    //                 () => {
    //                     this.getColumns();
    //                 }
    //             );
    //         }
    //     });
    // };
    getTableData = (params, sorter) => {
        const {
            login: { userId },
        } = this.props;
        const { login } = this.props;
        const { systemInfo } = login;
        const { searchKey, value, windowType, regionId, professionType, provinceData, professionData } = this.state;
        const { current, pageSize } = params;
        let orderType = '';
        let orderFieldName = '';
        if (!_.isEmpty(sorter)) {
            orderType = Object.values(sorter)?.toString();
            if (orderType === 'ascend') {
                orderType = 'asc';
            } else {
                orderType = 'desc';
            }
            orderFieldName = Object.keys(sorter)?.toString();
        }
        let regionList = [];
        let professionList = [];
        if (regionId?.toString() === 'all') {
            provinceData.map((item) => {
                if (item.regionId !== 'all') {
                    return regionList.push(item.regionId);
                }
            });
        } else {
            regionList = regionId || [];
        }
        if (professionType.length === 0) {
            professionList = [''];
        } else {
            professionList = professionType || [];
        }
        const queryParam = {
            current,
            pageSize,
            showType: value,
            userId,
            windowType,
            windowName: searchKey,
            orderType,
            orderFieldName,
            viewProvince: regionList.toString() || getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
            viewProfessional: professionList?.toString(),
        };
        if (value === 1) {
            queryParam.windowAttribute = '1';
        }

        return request('v1/monitor-view', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        })
            .then((res) => {
                if (res && !_.isEmpty(res.data)) {
                    return {
                        data: res.data.map((item, index) => ({
                            ...item,
                            index: index + 1 + (current - 1) * pageSize,
                        })),
                        success: true,
                        total: res.total,
                    };
                }
                return {
                    data: [],
                    success: true,
                    total: 0,
                };
            })
            .catch(() => {
                return {
                    data: [],
                    success: false,
                    total: 0,
                };
            });
    };

    /**
     * 点击快速查询栏搜索逻辑
     */
    onSearchClick = () => {
        const { regionId } = this.state;
        if (!regionId?.length) {
            return message.warn('请选择归属省份');
        }
        this.tableResetAndReload();
    };
    /**
     * 点击快速查询栏重置逻辑
     */
    resetClick = () => {
        const { provinceList } = this.state;
        const { login } = this.props;
        const provinceId = login?.systemInfo?.currentZone?.zoneId;
        this.setState(
            {
                windowType: '1',
                searchKey: '',
                regionId: [getInitialProvince(provinceId, login.userInfo)] || [provinceList[0].regionId],
                professionType: [],
            },
            this.tableResetAndReload,
        );
    };

    onWindowNameChange = (e) => {
        this.setState({ searchKey: e.target.value });
    };

    /**
     * 点击模板选择按钮逻辑
     */
    onChange = (e) => {
        this.setState(
            {
                value: e.target.value,
                // windowType: this.props.match.params.id ? '2' : '-1',
                searchKey: '',
                selectedRowIds: [],
                selectedRowKeys: [],
            },
            () => {
                this.tableResetAndReload();
            },
        );
    };

    /**
     * 选择窗口类型事件
     */
    handleChangeWindowType = (option) => {
        this.setState(
            {
                windowType: option,
                searchKey: '',
            },
            () => {
                this.tableResetAndReload();
            },
        );
    };

    /**
     * 窗口类型下拉选项
     */

    /**
     * 复选框change
     */
    onSelectChange = (id, rows) => {
        let selectedRowKeys = [];
        selectedRowKeys = rows.map((row) => {
            return row.windowId;
        });

        this.setState({
            selectedRowKeys,
        });
    };

    /**
     * 复选框selected
     */
    // onSelect = (record, selected, selectedRows) => {
    //     this.setState({
    //         rowData: selectedRows
    //     });
    // };

    onSelectAll = (id, rows) => {
        let selectedRowKeys = [];
        selectedRowKeys = rows.map((row) => {
            return row.windowId;
        });

        this.setState({
            selectedRowKeys,
        });
    };

    /**
     * 显示新增、修改弹窗
     */
    showEditModal = (row) => {
        this.setState({
            editVisible: true,
            rowData: row,
        });
    };

    showSearchModal = (row) => {
        this.setState({
            searchVisible: true,
            rowData: row,
        });
    };
    /**
     * 是否启用
     */

    isAvailable = (row, params) => {
        const available = row;
        if (available.ifUsed === 0) {
            available.ifUsed = 1;
            this.isAvailableHandle(available, params);
        } else {
            available.ifUsed = 0;
            this.isAvailableHandle(available, params);
        }
    };

    /**
     * 是否启用操作后续
     */
    isAvailableHandle = (row, params) => {
        request(`v1/monitor-view/${row.windowId}/${this.props.login.userId}/${row.ifUsed}`, {
            type: 'put',
            baseUrlType: 'monitorSetUrl',
            showSuccessMessage: false,
            showErrorMessage: true,
            handlers: {
                params,
            },
        }).then((res) => {
            if (_.get(this, 'myRef.current.reloadAndRest')) {
                this.myRef.current.reloadAndRest();
            }
            if (res.data.code === 1) {
                message.success(res.data.message);
            } else {
                this.isAvailableMessage(res.data.message);
            }
        });
    };
    /**
     * 能否启用的确认信息
     */
    isAvailableMessage = (contentMessage) => {
        Modal.error({
            title: '提示',
            content: contentMessage,
            prefixCls: 'oss-ui-modal',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
        });
    };

    /**
     * 删除本行
     */
    delModal = async (row, params) => {
        const { windowType } = this.state;
        this.setState({
            addLogParams: params || {},
        });
        if (windowType === '1') {
            await this.validateForDelete(row.windowId).then((res) => {
                if (res.code === -100 && res.data) {
                    this.setState({
                        popContent: (
                            <div>
                                该自定义视图已被引用，无法删除
                                {res.data.map((item) => {
                                    return <p>{item}</p>;
                                })}
                            </div>
                        ),
                        isUsed: true,
                    });
                } else {
                    this.setState({
                        popContent: null,
                        isUsed: false,
                    });
                }
            });
            this.showDelModal(row.windowId);
            return;
        }
        this.setState(
            {
                popContent: null,
                isUsed: false,
            },
            () => {
                this.showDelModal(row.windowId);
            },
        );
    };

    /**
     * 批量删除
     */
    delModals = async (params) => {
        const { selectedRowKeys, windowType } = this.state;
        const selectedRowIdsStr = selectedRowKeys.join(',');
        if (!selectedRowIdsStr) {
            message.warning('请至少选择一条再操作');
            return;
        }
        this.setState({
            addLogParams: params || {},
        });
        if (windowType === '1') {
            this.setState({
                batchDeleteLoading: true,
            });
            await this.validateForDelete(selectedRowIdsStr.split(',')).then((res) => {
                this.setState({
                    batchDeleteLoading: false,
                });
                if (res.code === -100 && res.data) {
                    this.setState({
                        popContent: (
                            <div>
                                该自定义视图已被引用，无法删除
                                {res.data.map((item) => {
                                    return <p>{item}</p>;
                                })}
                            </div>
                        ),
                        isUsed: true,
                    });
                } else {
                    this.setState({
                        popContent: null,
                        isUsed: false,
                    });
                }
            });
            this.showDelModal(selectedRowIdsStr);
            return;
        }
        this.setState(
            {
                popContent: null,
                isUsed: false,
            },
            () => {
                this.showDelModal(selectedRowIdsStr);
            },
        );
    };
    componentDidMount() {
        const userInFo = JSON.parse(this.props.login.userInfo);
        const { systemInfo } = this.props.login;
        // console.log(userInFo);
        const zoneInfo = userInFo?.zones;
        const userInfo = {
            userProvinceId:
                zoneInfo && zoneInfo[0]?.zoneLevel && (parseInt(zoneInfo[0].zoneLevel, 10) === 1 ? zoneInfo[0]?.zoneId : zoneInfo[0].zoneLevel_2Id),
            groupUser: zoneInfo && zoneInfo[0]?.zoneLevel ? parseInt(zoneInfo[0].zoneLevel, 10) === 1 : false,
            userId: this.props.login.userId,
            userName: this.props.login.userName,
            userProvinceName: zoneInfo && zoneInfo[0]?.zoneName,
            userMobile: userInFo.userMobile,
            isAdmin: userInFo.isAdmin,
        };
        if (this.props.match.params.id) {
            this.setState({
                windowTypeObj: [
                    {
                        text: '自定义视图',
                        status: '1',
                    },
                ],
            });
        } else {
            this.setState({
                windowTypeObj: [
                    {
                        text: '自定义视图',
                        status: '1',
                    },
                ],
            });
        }
        this.getColumns();
        let regionId = undefined;
        if (systemInfo?.currentZone?.zoneId) {
            regionId = [systemInfo.currentZone.zoneId];
        }
        this.setState(
            {
                userInfo,
                regionId,
            },
            () => {
                if (this.props.match.params.id) {
                    this.getProvinceData();
                    this.getprofession();
                    setTimeout(() => {
                        this.myRef.current.reload();
                        // this.getSelectData();
                    }, 0);
                }
            },
        );
    }
    /**
     * 显示确认删除弹窗
     */
    showDelModal = (ids) => {
        const { popContent, addLogParams } = this.state;
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: popContent || '此操作将永久删除选中项，是否继续？',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                this.delMonitorView(ids, addLogParams);
            },
            onCancel() {},
        });
    };

    // 删除前查询是否被引用
    validateForDelete = (id) => {
        let arr = [];
        if (!Array.isArray(id)) {
            arr.push(id);
        } else {
            arr = id;
        }
        return request(`v1/monitor-view/validateForDelete`, {
            type: 'post',
            data: arr,
            baseUrlType: 'monitorSetUrl',
            showErrorMessage: true,
            showSuccessMessage: false,
        });
    };

    /**
     * 确认删除操作后续
     */
    delMonitorView = (ids, params) => {
        const { isUsed } = this.state;
        if (isUsed) {
            return;
        }
        const queryParam = {
            windowIds: ids,
            userId: this.props.login.userId,
        };
        request('v1/monitor-view', {
            type: 'delete',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
            handlers: {
                params,
            },
        }).then(() => {
            this.myRef?.current?.reloadAndRest();
            this.setState({
                selectedRowIds: [],
                selectedRowKeys: [],
            });
            message.success('删除成功');
        });
    };

    /**
     * 共享当前视图模板确认
     */
    shareCopyToSelfConfirm = (row) => {
        let content = `是否确认引用${row.windowName}？`;
        let onOk = () => {
            this.shareCopyToSelf(row, _.trim(`${row.windowName}[引用]`));
        };
        if (isUnicom) {
            content = (
                <div>
                    <div style={{ marginBottom: '10px' }}>是否确认引用“{row.windowName}”呢？</div>
                    <Form ref={this.confirmFormRef}>
                        <Form.Item
                            style={{ marginRight: '20px' }}
                            name="shareWindowName"
                            initialValue={`${row.windowName}${dayjs().format('YYYYMMDDHHmm')}`}
                            label="引用名称"
                            rules={[
                                {
                                    required: true,
                                    message: '名称不能为空，请输入',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        // eslint-disable-next-line no-control-regex
                                        const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                        if (valueLength > 64) {
                                            callback('列模板名称不能超过64位（1汉字=2位）');
                                        } else {
                                            callback();
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </div>
            );
            onOk = (close) => {
                this.confirmFormRef.current
                    .validateFields()
                    .then((values) => {
                        this.shareCopyToSelf(row, _.trim(values.shareWindowName));
                        close();
                    })
                    .catch(() => {});
            };
        }
        Modal.confirm({
            title: '',
            bodyStyle: { overflow: 'hidden' },
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content,
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk,
            onCancel: (close) => close(),
        });
    };

    /**
     * 共享当前视图模板给自己
     */
    shareCopyToSelf = (row, newName) => {
        const {
            login: { userId },
        } = this.props;
        const queryParam = {
            windowId: makeCRC32(new Date().getTime() + userId),
            windowName: newName,
            windowType: row.windowType,
            userId: userId || -1,
            windowAttribute: row.windowAttribute,
            ifUsed: row.ifUsed,
            childwindowShow: row.childwindowShow,
            colDispTemplet: row.colDispTemplet,
            statusDispTemplet: row.statusDispTemplet,
            filterIdList: row.filterIdList,
            note: row.note,
            windowBarType: row.windowBarType,
        };
        if (row.filterSplitFlag) {
            queryParam.filterSplitFlag = row.filterSplitFlag;
        }

        request('v1/monitor-view', {
            type: 'post',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            showSuccessMessage: false,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            if (res.code !== 0) {
                message.error(res.message);
                return;
            }
            message.success('保存成功');
            if (_.get(this, 'myRef.current.reloadAndRest')) {
                this.myRef.current.reloadAndRest();
            }
        });
    };

    // 弹窗中选择告警标题
    onModalSelectedChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            modalSelectedRows: selectedRows,
        });
    };

    switchEditVisble = (editVisible, refreshTable) => {
        this.setState({
            editVisible,
        });
        if (!editVisible) {
            this.setState({
                rowData: null,
            });
            if (refreshTable) {
                this.tableResetAndReload();
            }
        }
    };

    switchSearchVisble = (searchVisible) => {
        this.setState({
            searchVisible,
        });
        if (!searchVisible) {
            this.setState({
                rowData: null,
            });
        }
    };

    tableResetAndReload = () => {
        if (_.get(this, 'myRef.current')) {
            // if (this.props.match.params.id) {
            //     this.getSelectData();
            // }
            this.myRef.current.reset();
            this.myRef.current.reload();
        }
    };

    render() {
        const {
            columns,
            userInfo,
            editVisible,
            searchVisible,
            rowData,
            selectedRowKeys,
            windowType,
            params,
            searchKey,
            value,
            windowTypeObj,
            provinceData,
            regionId,
            professionData,
            professionType,
        } = this.state;
        const xWidth = columns.reduce((total, item) => {
            return total + item.width;
        }, 0);
        const rowSelection = {
            selectedRowKeys,
            columnWidth: 30,
            onChange: this.onSelectChange,
            // onSelect: this.onSelect,
            onSelectAll: this.onSelectAll,
        };
        const { systemInfo } = this.props.login;
        const headerTitle = (
            <Form name="basic" style={{ minWidth: '1100px', height: '40px' }}>
                <Row gutter={16} wrap={false}>
                    <Col span={5}>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Radio.Group onChange={this.onChange} value={this.state.value}>
                                <Radio value={2}>全部视图</Radio>
                                <Radio value={0}>我的视图</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            label="视图分类"
                            // name="windowType"
                            style={{ marginBottom: 0 }}
                        >
                            <Select
                                onChange={this.handleChangeWindowType}
                                defaultValue={this.props.match.params.id ? '2' : '-1'}
                                style={{ width: '100%' }}
                                value={windowType}
                            >
                                {windowTypeObj.map((windowTypeItme) => (
                                    <Select.Option key={windowTypeItme.status} value={windowTypeItme.status}>
                                        {windowTypeItme.text}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            label="视图名称"
                            // name="WindowName"
                            style={{ marginBottom: 0 }}
                        >
                            <Input placeholder="请输入视图名称" onChange={this.onWindowNameChange} value={searchKey} allowClear />
                        </Form.Item>
                    </Col>
                    {isUnicom && (
                        <Col span={4}>
                            <Form.Item
                                label="归属省份"
                                // name="windowType"
                                style={{ marginBottom: 0 }}
                                wrapperCol={{ span: 14, offset: 0 }}
                                labelCol={{ span: 8, offset: 0 }}
                            >
                                <Select
                                    onChange={this.handleProvinceChange}
                                    style={{ overflow: 'hidden' }}
                                    value={regionId}
                                    // mode="multiple"
                                    maxTagCount={1}
                                    filterOption={(item, itm) => {
                                        return itm.children?.includes(item);
                                    }}
                                    placeholder="请选择省份"
                                >
                                    {provinceData
                                        .filter((item) =>
                                            systemInfo?.currentZone?.zoneId ? systemInfo?.currentZone?.zoneId === item.regionId : true,
                                        )
                                        .map((item) => (
                                            <Select.Option key={item.regionId} value={item.regionId}>
                                                {item.regionName}
                                            </Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}
                    {isUnicom && (
                        <Col span={4}>
                            <Form.Item
                                label="归属专业"
                                // name="windowType"
                                style={{ marginBottom: 0 }}
                                wrapperCol={{ span: 18, offset: 0 }}
                                labelCol={{ span: 8, offset: 0 }}
                            >
                                <Select
                                    onChange={this.handleProfessionType}
                                    style={{ overflow: 'hidden' }}
                                    value={professionType}
                                    mode="multiple"
                                    placeholder="全部"
                                    maxTagCount={1}
                                    filterOption={(item, itm) => {
                                        return itm.children?.includes(item);
                                    }}
                                >
                                    {professionData.map((item) => (
                                        <Select.Option key={item.key} value={item.key}>
                                            {item.value}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={3} style={{ position: 'absolute', right: '0' }}>
                        <Form.Item name="ownerType" style={{ marginBottom: 0 }}>
                            <Space>
                                <Button type="default" onClick={this.resetClick.bind(this, null)}>
                                    重置
                                </Button>
                                <Button type="primary" onClick={this.onSearchClick.bind(this, null)} htmlType="submit">
                                    查询
                                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );

        const toolBarRender = () => {
            const { batchDeleteLoading } = this.state;
            const buttons = [
                <AuthButton
                    onClick={this.showEditModal.bind(this, null)}
                    // type="text"
                    // style={{ padding: 0 }}
                    authKey="alarmMonitor:add"
                >
                    <Icon antdIcon type="PlusOutlined" />
                    新建
                </AuthButton>,
                <AuthButton
                    type="default"
                    onClick={(params) => this.delModals(params)}
                    loading={batchDeleteLoading}
                    addLog={true}
                    // type="text"
                    // style={{ padding: 0 }}
                    authKey="alarmMonitor:batchDelete"
                >
                    批量删除
                </AuthButton>,
            ];
            if (this.state.value === 1) {
                buttons.length = 0;
            }
            return buttons; // 此处需要加上当前登录用户及是否管理员账号判断
        };

        return (
            <PageContainer divider showHeader={false}>
                <div className="monitor-view-manager-content">
                    <div style={{ padding: '10px 10px 0 10px', backgroundColor: systemInfo?.theme === 'light' ? 'white' : '' }}>{headerTitle}</div>
                    <div className="monitor-view-table">
                        {value === 0 && (
                            <VirtualTable
                                global={window}
                                actionRef={this.myRef}
                                columns={columns}
                                size="small"
                                x={xWidth}
                                rowSelection={rowSelection}
                                tableAlertRender={false}
                                tableAlertOptionRender={false}
                                params={params}
                                request={this.getTableData}
                                rowKey="windowId"
                                dateFormatter="string"
                                search={false}
                                rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                                bordered
                                // headerTitle={headerTitle}
                                options={{ reload: true, setting: true, fullScreen: false }}
                                toolBarRender={toolBarRender}
                            />
                        )}
                        {value !== 0 && (
                            <VirtualTable
                                global={window}
                                actionRef={this.myRef}
                                columns={columns}
                                size="small"
                                x={xWidth}
                                tableAlertRender={false}
                                tableAlertOptionRender={false}
                                params={params}
                                request={this.getTableData}
                                rowKey="windowId"
                                rowSelection={rowSelection}
                                dateFormatter="string"
                                search={false}
                                rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                                bordered
                                // headerTitle={headerTitle}
                                options={{ reload: true, setting: true, fullScreen: false }}
                                toolBarRender={toolBarRender}
                            />
                        )}
                    </div>
                    {editVisible && (
                        <Edit
                            visible={editVisible}
                            isEdit={true}
                            rowData={rowData}
                            windowType={windowType}
                            // userName={userName}
                            // userId={userId}
                            userInfo={userInfo}
                            login={this.props.login}
                            unicomFlag={this.props.match.params.id}
                            visibleChange={this.switchEditVisble}
                        />
                    )}
                    {searchVisible && (
                        <Edit
                            visible={searchVisible}
                            rowData={rowData}
                            windowType={windowType}
                            // userName={userName}
                            // userId={userId}
                            login={this.props.login}
                            userInfo={userInfo}
                            unicomFlag={this.props.match.params.id}
                            visibleChange={this.switchSearchVisble}
                        />
                    )}
                </div>
            </PageContainer>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
