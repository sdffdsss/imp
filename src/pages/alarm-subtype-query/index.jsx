import React from 'react';
import { Icon, Modal, Tooltip, Space, message } from 'oss-ui';
import PageContainer from '@Components/page-container';
import { VirtualTable } from 'oss-web-common';
import { _ } from 'oss-web-toolkits';
import SelectCondition from './select-condition';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import request from '@Src/common/api';
import Edit from './components/edit';
import './index.less';
import dayjs from 'dayjs';
import AuthButton from '@Src/components/auth-button';
/**
 * 告警子类型配置页面
 */
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            editVisible: false,
            searchVisible: false,
            rowData: null,
            selectedRowIds: [],
            allData: [], // 保存页面列表数据
            selectedRowKeys: [],
            searchRef: {}, // 保存查询条件信息
            isEdit: '', // 用来改变弹窗的状态(新建? 编辑? 查看?)
            defaultPagination: {
                pageSize: 1000,
            },
            modelId: 0,
            dictDatas: [],
            nmsAlarmId: '', // 网关告警ID
            titleText: '', // 告警标题
            alarmSub: [], // 告警子类型
            alarmObj: [], // 告警对象类型
            vendorDatas: [], // 厂家
            networkType: [], // 网元类型
            columns: [
                {
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center',
                    width: 30,
                    hideInSearch: true,
                    ellipsis: true,
                },
                {
                    title: '厂家',
                    key: 'vendorId',
                    dataIndex: 'vendorName',
                    hideInSearch: true,
                    width: 100,
                    sorter: true,
                    ellipsis: true,
                },
                {
                    title: '厂家',
                    dataIndex: 'vendorId',
                    hideInTable: true,
                    hideInSearch: false,
                    renderFormItem: (item, { fieldProps }, form) => {
                        return (
                            <SelectCondition
                                {...fieldProps}
                                form={form}
                                mode="multiple"
                                title="厂家"
                                label="txt"
                                dictName="vendor_id"
                                searchName="vendorId"
                            />
                        );
                    },
                    search: {
                        transform: (value) => ({ vendor_id_queryProperties: value }),
                    },
                },
                {
                    title: '网元类型',
                    key: 'eqpObjectClassName',
                    dataIndex: 'eqpObjectClassName',
                    hideInSearch: true,
                    width: 100,
                    sorter: true,
                    ellipsis: true,
                },
                {
                    title: '网元类型',
                    dataIndex: 'eqpObjectClass',
                    hideInTable: true,
                    hideInSearch: false,
                    renderFormItem: (item, { fieldProps }, form) => {
                        return (
                            <SelectCondition
                                {...fieldProps}
                                form={form}
                                mode="multiple"
                                title="网元类型"
                                label="txt"
                                dictName="object_class"
                                searchName="eqpObjectClass"
                            />
                        );
                    },
                    search: {
                        transform: (value) => ({ object_class_text_queryProperties: value }),
                    },
                },
                {
                    title: '告警对象类型',
                    dataIndex: 'objectClassName',
                    key: 'objectClassName',
                    hideInSearch: true,
                    width: 100,
                    sorter: true,
                    ellipsis: true,
                },
                {
                    title: '告警对象类型',
                    hideInTable: true,
                    dataIndex: 'objectClass',
                    hideInSearch: false,
                    renderFormItem: (item, { fieldProps }, form) => {
                        return (
                            <SelectCondition
                                {...fieldProps}
                                form={form}
                                mode="multiple"
                                title="告警对象类型"
                                label="txt"
                                dictName="eqp_object_class"
                                searchName="objectClass"
                            />
                        );
                    },

                    search: {
                        transform: (value) => ({ eqp_object_class_text_queryPropertiespe: value }),
                    },
                },
                {
                    title: '告警子类型',
                    dataIndex: 'subAlarmTypeText',
                    key: 'subAlarmTypeText',
                    hideInSearch: true,
                    width: 100,
                    sorter: true,
                    ellipsis: true,
                },
                {
                    title: '告警子类型',
                    dataIndex: 'subAlarmType',
                    hideInTable: true,
                    hideInSearch: false,
                    renderFormItem: (item, { fieldProps }, form) => {
                        return (
                            <SelectCondition
                                {...fieldProps}
                                form={form}
                                mode="multiple"
                                title="告警子类型"
                                label="txt"
                                dictName="sub_alarm_type"
                                searchName="subAlarmType"
                            />
                        );
                    },
                    search: {
                        transform: (value) => ({ sub_alarm_type_queryProperties: value }),
                    },
                },
                {
                    title: '告警标题',
                    dataIndex: 'titleText',
                    key: 'titleText',
                    hideInSearch: true,
                    width: 100,
                    sorter: true,
                    ellipsis: true,
                },
                {
                    title: '告警标题',
                    dataIndex: 'titleText',
                    hideInTable: true,
                    hideInSearch: false,
                    ellipsis: true,
                },
                {
                    title: '网管告警ID',
                    dataIndex: 'nmsAlarmId',
                    key: 'nmsAlarmId',
                    hideInSearch: true,
                    width: 100,
                    sorter: true,
                    ellipsis: true,
                },
                {
                    title: '网管告警ID',
                    dataIndex: 'nmsAlarmId',
                    hideInTable: true,
                    hideInSearch: false,
                    ellipsis: true,
                },
                {
                    title: '描述',
                    dataIndex: 'memo',
                    key: 'memo',
                    hideInSearch: true,
                    align: 'center',
                    width: 100,
                    sorter: true,
                    ellipsis: true,
                },
                {
                    title: '创建人',
                    dataIndex: 'createUser',
                    key: 'createUser',
                    hideInSearch: true,
                    align: 'center',
                    width: 100,
                    ellipsis: true,
                    sorter: true,
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    hideInSearch: true,
                    align: 'center',
                    width: 150,
                    sorter: true,
                    ellipsis: true,
                },
                {
                    title: '最近修改时间',
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                    hideInSearch: true,
                    align: 'center',
                    width: 150,
                    sorter: true,
                    ellipsis: true,
                },
                {
                    title: '最近修改人',
                    dataIndex: 'updateUser',
                    key: 'updateUser',
                    hideInSearch: true,
                    align: 'center',
                    width: 100,
                    sorter: true,
                    ellipsis: true,
                },
                {
                    title: '操作',
                    valueType: 'option',
                    dataIndex: 'option',
                    hideInSearch: true,
                    fixed: 'right',
                    width: 50,
                    render: (text, row) => [
                        <Space>
                            <Tooltip title="编辑" trigger={['hover', 'click']}>
                                <AuthButton
                                    key="2"
                                    onClick={this.showEditModal.bind(this, row)}
                                    authKey="AlarmSubQuery:edit"
                                    type="text"
                                    style={{ padding: 0 }}
                                >
                                    <Icon antdIcon={true} type="EditOutlined" />
                                </AuthButton>
                            </Tooltip>

                            <Tooltip title="删除">
                                <AuthButton
                                    key="3"
                                    authKey="AlarmSubQuery:delete"
                                    type="text"
                                    style={{ padding: 0 }}
                                    onClick={this.delModal.bind(this, row)}
                                >
                                    <Icon antdIcon={true} type="DeleteOutlined" />
                                </AuthButton>
                            </Tooltip>
                        </Space>,
                    ],
                },
            ],
        };
    }

    /**
     * 页面初始话以及点击搜索时加载数据
     */
    getTableData = (params, sorter) => {
        const { userId } = this.props.login;
        const { searchRef } = this.state;
        const { current, pageSize } = params;
        // 获取查询字符串
        const query = searchRef && searchRef.current && searchRef.current.getFieldsValue();
        if (query) {
            Object.keys(query).forEach((key1) => {
                if (query[key1] && Array.isArray(query[key1])) {
                    query[key1] = query[key1].join(',');
                }
            });
        }
        if (query) {
            _.forOwn(query, (index, key2) => {
                if (query[key2] === undefined) {
                    query[key2] = '';
                }
            });
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
        if (orderFieldName === 'vendorName') {
            orderFieldName = 'vendorId';
        }

        if (orderFieldName === 'eqpObjectClassName') {
            orderFieldName = 'eqpObjectClass';
        }

        if (orderFieldName === 'objectClassName') {
            orderFieldName = 'objectClass';
        }
        const queryParam = {
            current,
            pageSize,
            user: userId,
            orderFieldName,
            order: orderType,
            ...query,
        };
        const newPar = {};
        _.forOwn(queryParam, (index, key3) => {
            // 如果对象属性的值不为空，就保存该属性（这里我做了限制，如果属性的值为0，保存该属性。如果属性的值全部是空格，属于为空。
            if (
                (queryParam[key3] === 0 || queryParam[key3] === false || queryParam[key3]) &&
                queryParam[key3].toString().replace(/(^\s*)|(\s*$)/g, '') !== ''
            ) {
                newPar[key3] = queryParam[key3];
            }
        });
        return Promise.resolve(
            request('alarmmodel/subalarm/v1/subalarm', {
                type: 'get',
                baseUrlType: 'filterUrl',
                data: newPar,
                // 是否需要显示失败消息提醒
                showErrorMessage: true,
            })
                .then((res) => {
                    if (res && !_.isEmpty(res.data)) {
                        this.setState({
                            allData: res.data,
                        });
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
                }),
        );
    };
    /**
     * 复选框change
     */
    onSelectChange = (id, rows) => {
        let selectedRowKeys = [];
        selectedRowKeys = rows.map((row) => {
            return row.recId;
        });

        this.setState({
            selectedRowKeys,
        });
    };

    /**
     * 复选框selected
     */
    onSelect = (record, selected, selectedRows) => {
        this.setState({
            rowData: selectedRows,
        });
    };

    onSelectAll = (id, rows) => {
        let selectedRowKeys = [];
        selectedRowKeys = rows.map((row) => {
            return row.recId;
        });

        this.setState({
            selectedRowKeys,
        });
    };

    /**
     * 有权限时可以进行的编辑操作
     */
    showEditModal = (row) => {
        this.setState({
            editVisible: true,
            rowData: row,
            isEdit: 'edit',
        });
    };

    /**
     * 无权限时进行查看操作
     */

    showSearchModal = (row) => {
        this.setState({
            searchVisible: true,
            rowData: row,
            isEdit: 'look',
        });
    };

    /**
     * 删除本行
     */
    delModal = (row) => {
        this.showDelModal(row.recId, row.subAlarmTypeText);
    };

    /**
     * 显示确认删除弹窗
     */
    showDelModal = (ids, subAlarmTypeText) => {
        Modal.confirm({
            title: '',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: `是否确认删除选中告警子类型：${subAlarmTypeText}？`,
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                this.delMonitorView1(ids);
            },
            onCancel() {},
        });
    };

    /**
     * 确认删除操作后续
     */
    delMonitorView1 = (ids) => {
        request(`alarmmodel/subalarm/v1/subalarm/${ids}`, {
            type: 'delete',
            baseUrlType: 'filterUrl',
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        })
            .then((res) => {
                if (res) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    _.get(this, 'myRef.current.reloadAndRest') && this.myRef.current.reloadAndRest();
                    this.setState({
                        selectedRowIds: [],
                        selectedRowKeys: [],
                    });
                    message.success('删除成功');
                }
            })
            .catch(() => {});
    };

    tableResetAndReload = () => {
        if (_.get(this, 'myRef.current')) {
            this.myRef.current.reset();
            this.myRef.current.reload();
        }
    };

    onSearchCollapse = (collapsed) => {
        this.setState({
            scrollY: collapsed ? window.innerHeight - 360 : window.innerHeight - 420,
        });
    };

    /**
     * 导出按钮  如果返回二进制的就用下面这个
     * 如果返回一个url 直接用window.open
     */

    exportModals = () => {
        const { selectedRowKeys } = this.state;
        const selectedRowIdsStr = selectedRowKeys.join(',');

        if (!selectedRowIdsStr) {
            message.warning('请至少选择一条再操作');
            return;
        }
        request('alarmmodel/subalarm/v1/subalarm/export', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: '导出成功',
            defaultErrorMessage: '导出失败，请检查服务',
            responseType: 'blob',
            data: {
                recId: selectedRowIdsStr,
            },
        }).then((res) => {
            // type 为需要导出的文件类型，此处为xls表格类型
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
            // 兼容不同浏览器的URL对象
            const url = window.URL || window.webkitURL || window.moxURL;
            // 创建下载链接
            const downloadHref = url.createObjectURL(blob);
            // 创建a标签并为其添加属性
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadHref;
            downloadLink.download = `告警子类型页面配置导出${dayjs().format('YYYYMMDD')}.xls`;
            // 触发点击事件执行下载
            downloadLink.click();
        });
    };

    /**
     * 改变编辑按钮的值
     */

    isEditChange = (isEdit) => {
        this.setState({ isEdit });
        this.tableResetAndReload();
    };

    /**
     * 获取字典列表数据
     */
    getDictEntry = (dictName) => {
        const { userId } = this.props.login;
        request('alarmmodel/dict/v1/getDict', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                pageSize: 2500,
                dictName,
                en: false,
                modelId: 2,
                creator: userId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        })
            .then((res) => {
                if (res && res.data && res.data.length) {
                    if (dictName === 'sub_alarm_type') {
                        this.setState({ alarmSub: res.data });
                    } else if (dictName === 'eqp_object_class') {
                        this.setState({ alarmObj: res.data });
                    } else if (dictName === 'vendor_id') {
                        this.setState({ vendorDatas: res.data });
                    } else {
                        this.setState({ networkType: res.data });
                    }
                } else {
                    this.setState({ dictDatas: [] });
                }
            })
            .catch(() => {
                return [];
            });
    };
    // 新增/编辑时将文本框的值赋值给state中的值
    receiveParams = (params, type) => {
        if (type === 'id') {
            this.setState({
                nmsAlarmId: params, // 告警ID
            });
        } else {
            this.setState({
                titleText: params, // 告警标题
            });
        }
    };
    render() {
        const {
            columns,
            rowData,
            selectedRowKeys,
            searchRef,
            isEdit,
            dictDatas,
            allData,
            nmsAlarmId, // 网管告警ID
            titleText, // 告警标题
            alarmSub, // 告警子类型
            alarmObj, // 告警对象类型
            vendorDatas, // 厂家
            networkType, // 网元类型
        } = this.state;
        const {
            login: { userName, userId },
        } = this.props;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelect,
            onSelectAll: this.onSelectAll,
        };
        const scrollY = window.innerHeight - 266;
        return (
            <PageContainer divider showHeader={false}>
                <div className="monitor-view-manager-content">
                    <VirtualTable
                        global={window}
                        actionRef={this.myRef}
                        formRef={searchRef}
                        columns={columns}
                        size="small"
                        rowSelection={rowSelection}
                        tableAlertRender={false}
                        tableAlertOptionRender={false}
                        request={this.getTableData}
                        rowKey="recId"
                        dateFormatter="string"
                        scroll={{ y: scrollY }}
                        search={{
                            onCollapse: this.onSearchCollapse,
                            span: 6,
                        }}
                        rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                        bordered="true"
                        options={{ reload: true, setting: true, fullScreen: false }}
                        toolBarRender={() => {
                            const buttons = [
                                <Edit
                                    receiveParams={this.receiveParams}
                                    isEditChange={this.isEditChange}
                                    dictDatas={dictDatas}
                                    getDictEntry={this.getDictEntry}
                                    allData={allData}
                                    nmsAlarmId={nmsAlarmId} // 网管告警ID
                                    titleText={titleText} // 网管告警标题
                                    alarmSub={alarmSub} // 告警子类型
                                    alarmObj={alarmObj} // 告警对象类型
                                    vendorDatas={vendorDatas} // 厂家
                                    networkType={networkType} // 网元类型
                                    userId={userId}
                                />,
                                <AuthButton type="default" onClick={this.exportModals.bind(this, null)} authKey="AlarmSubQuery:export">
                                    <Icon type="DownloadOutlined" antdIcon />
                                    导出
                                </AuthButton>,
                            ];
                            return buttons; // 此处需要加上当前登录用户及是否管理员账号判断
                        }}
                    />
                    {isEdit === 'edit' && (
                        <Edit
                            rowData={rowData}
                            userName={userName}
                            userId={userId}
                            isEdit={isEdit}
                            allData={allData}
                            isEditChange={this.isEditChange}
                            dictDatas={dictDatas}
                            getDictEntry={this.getDictEntry}
                            receiveParams={this.receiveParams}
                            nmsAlarmId={nmsAlarmId} // 网管告警ID
                            titleText={titleText} // 网管告警标题
                            alarmSub={alarmSub} // 告警子类型
                            alarmObj={alarmObj} // 告警对象类型
                            vendorDatas={vendorDatas} // 厂家
                            networkType={networkType} // 网元类型
                        />
                    )}
                    {isEdit === 'look' && (
                        <Edit
                            rowData={rowData}
                            userName={userName}
                            userId={userId}
                            isEdit={isEdit}
                            isEditChange={this.isEditChange}
                            dictDatas={dictDatas}
                            getDictEntry={this.getDictEntry}
                            allData={allData}
                            receiveParams={this.receiveParams}
                            alarmSub={alarmSub} // 告警子类型
                            alarmObj={alarmObj} // 告警对象类型
                            vendorDatas={vendorDatas} // 厂家
                            networkType={networkType} // 网元类型
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
