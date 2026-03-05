import React from 'react';
import constants from '@Src/common/constants';
import { Button, Icon, Tooltip, Space, Modal, message, Radio } from 'oss-ui';
import Delete from '../delete';
import Export from '../export';
import History from '../history';
import { VirtualTable } from 'oss-web-common';
import { filterColumns, commonRuleColumns, anotherFilterCondition, anotherFilterConditionFilter, onlyEmailFilterConditionColumn } from './columns';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import usePageInfo from '../hox';
import { enableFilter } from '../api';
import { autoSendOrder } from './api';
import { _ } from 'oss-web-toolkits';
import request from '@Common/api';
import Detail from '../edit';
// import TypeManagement from '@Components/type-management';
import './index.less';
import { FILTER_EMUN } from '../index';
import AuthButton from '@Src/components/auth-button';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.clickExportRef = React.createRef(false);

        // if (templateColumnsState) {
        //     filterColumns.splice(1, 0, templateColumns);
        // }
        // templateColumnsState = false;
        let filterColumnsTemp = typeof filterColumns == 'function' ? filterColumns(this.viewFilterClick) : filterColumns;
        let commonRuleColumnsTemp = typeof commonRuleColumns == 'function' ? commonRuleColumns(this.viewFilterClick) : commonRuleColumns;
        const columns = props.moduleId === '1' ? [...filterColumnsTemp] : [...commonRuleColumnsTemp];

        this.state = {
            columns,
            columnsReady: true, // 否则表单默认值无法生效
            viewModalVisible: false,
            viewModalTitle: '详情',
            selectedRowKeys: [],
            userInfo: {},
            visible: 1,
            needConditionList: '',
            savedValue: {},
        };

        this.enableEnum = {
            ENABLE: 1,
            DISABLE: 2,
        };
    }

    componentDidMount() {
        const { login, moduleId } = this.props;

        const userInFo = JSON.parse(login.userInfo);
        const userInfo = {
            isAdmin: userInFo.isAdmin,
        };
        const templateColumns = {
            title: '',
            dataIndex: 'needConditionList',
            hideInTable: true,
            hideInSearch: false,
            // eslint-disable-next-line no-empty-pattern
            renderFormItem: (item, {}, form) => {
                return (
                    <Radio.Group onChange={this.onTemplateChange.bind(this, form)}>
                        <Radio value={2}>全部模板</Radio>
                        <Radio value={1}>我的模板</Radio>
                    </Radio.Group>
                );
            },
            search: {
                transform: (value) => {
                    if (value === 1) {
                        return { needConditionList: 1 };
                    }
                    return '';
                },
            },
        };
        const commonActions = {
            title: '操作',
            valueType: 'option',
            dataIndex: 'actions',
            fixed: 'right',
            width: 150,
            render: (text, record) => {
                return (
                    <Space>
                        {(login?.userId === String(record.creatorId) || userInfo.isAdmin) && moduleId !== '1' && (
                            <Tooltip title={record.enable === this.enableEnum.ENABLE ? '停用' : '启用'}>
                                <AuthButton
                                    key={5}
                                    onClick={this.onIsEnable.bind(this, record)}
                                    type="text"
                                    style={{ padding: 0 }}
                                    addLog={true}
                                    authKey={this.props.buttonKes.enable[moduleId]}
                                >
                                    <Icon antdIcon type={record.enable === this.enableEnum.ENABLE ? 'PauseCircleOutlined' : 'PlayCircleOutlined'} />
                                </AuthButton>
                            </Tooltip>
                        )}

                        {(login?.userId === record?.creatorId?.toString() || userInfo.isAdmin) && (
                            <Tooltip title="编辑" trigger={['hover', 'click']}>
                                <AuthButton
                                    onClick={this.editFilterClick.bind(this, record, 'edit')}
                                    type="text"
                                    style={{ padding: 0 }}
                                    authKey={this.props.buttonKes.edit[moduleId]}
                                >
                                    <Icon type="EditOutlined" antdIcon />
                                </AuthButton>
                            </Tooltip>
                        )}

                        <Tooltip title="复制" trigger={['hover', 'click']}>
                            <AuthButton
                                key={1}
                                onClick={this.editFilterClick.bind(this, record, 'copy')}
                                type="text"
                                style={{ padding: 0 }}
                                authKey={this.props.buttonKes.copy[moduleId]}
                            >
                                <Icon antdIcon type="CopyOutlined" />
                            </AuthButton>
                        </Tooltip>
                        {(login?.userId === record?.creatorId?.toString() || userInfo.isAdmin) && (
                            <Delete
                                key={2}
                                iconMode
                                onFresh={this.tableResetAndReload}
                                data={record}
                                moduleId={moduleId}
                                buttonKes={this.props.buttonKes}
                            />
                        )}

                        <Export key={3} iconMode data={record} moduleId={moduleId} buttonKes={this.props.buttonKes} />
                        <History
                            key={4}
                            iconMode
                            data={record}
                            moduleId={moduleId}
                            onFresh={this.tableResetAndReload}
                            buttonKes={this.props.buttonKes}
                        />
                        <Tooltip title="查看" trigger={['hover', 'click']}>
                            <Icon type="SearchOutlined" antdIcon onClick={this.viewFilterClick.bind(this, record, 'view')} />
                        </Tooltip>
                    </Space>
                );
            },
        };

        // TODO:根据需求，除短信前转，其余去掉电话查询条件
        let anotherFilterConditionScreen = [];
        let changeColumns = [];
        if (this.props.moduleId === '1') {
            // 过滤器走特殊条件
            anotherFilterConditionScreen = anotherFilterConditionFilter;
            changeColumns = templateColumns;
        } else if (this.props.moduleId === '4' || this.props.moduleId === '14') {
            anotherFilterConditionScreen = anotherFilterCondition;
        } else if (this.props.moduleId === '70') {
            anotherFilterConditionScreen = [...anotherFilterCondition];
            anotherFilterConditionScreen.splice(anotherFilterCondition.length - 1, 1, onlyEmailFilterConditionColumn);
        } else {
            anotherFilterConditionScreen = anotherFilterCondition.filter((item) => item.dataIndex !== 'phone');
        }
        let list = [...this.state.columns, commonActions, ...anotherFilterConditionScreen];
        if (this.props.moduleId === '1') {
            list = [changeColumns, ...list];
        }
        this.setState({
            columns: list,
            columnsReady: true,
            userInfo,
        });
    }

    componentDidUpdate(prevProps) {
        console.log(this.props.pageInfo.loadType, 'loadType=========');
        if (prevProps.pageInfo.loadType !== this.props.pageInfo.loadType) {
            if (this.props.pageInfo.loadType === 'refresh') {
                this.tableResetAndReload();
            }
            if (this.props.pageInfo.loadType === 'reload') {
                this.tableReload();
            }
        }
    }

    onTemplateChange = (form, e) => {
        form.setFieldsValue({
            needConditionList: e.target.value,
        });
        // console.log(form.getFieldsValue());
        // this.tableResetAndReload();
        // this.myRef.current.reload();
        if (e.target.value === 1) {
            this.setState({
                needConditionList: e.target.value,
            });
        } else {
            this.setState({
                needConditionList: '',
            });
        }
    };

    /**
     * @description: 是否启用按钮点击
     * @param row
     * @return n*o
     */

    onIsEnable = (row, params) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            //content: `是否确认删除${this.msg}:【${data.filterName}】？`,
            content: row.enable === this.enableEnum.ENABLE ? '是否确认停用？' : '是否确认启用？',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            width: '350px',
            onOk: () => {
                if (row.enable === this.enableEnum.ENABLE) {
                    this.isEnable('disable', row, params);
                } else {
                    this.isEnable('enable', row, params);
                }
            },
            onCancel() {},
        });
    };

    /**
     * @description: 调用启停用接口
     * @param n*o
     * @return n*o
     */
    isEnable = async (type, row, params) => {
        const {
            login: { userId },
        } = this.props;
        const data = {
            filterId: row.filterId,
            modelId: row.modelId,
            moduleId: row.moduleId,
            modifier: userId,
        };
        const res = await enableFilter(type, data, params);
        if (res?.data) {
            this.tableResetAndReload();
        }
    };

    /**
     * @description: 编辑/拷贝跳转
     * @param n*o
     * @return n*o
     */

    editFilterClick = (record, type) => {
        const { moduleId } = this.props;
        this.props.pageInfo.setLoadType('init');
        this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/${type}/${moduleId}/${record.filterId}/list`);
    };

    /**
     * @description: 查看
     * @param n*o
     * @return n*o
     */

    viewFilterClick = (record) => {
        this.setState(
            {
                viewFilterId: record.filterId,
                viewModalTitle: record.filterName,
            },
            () => {
                this.setState({
                    viewModalVisible: true,
                });
            },
        );
    };

    /**
     * @description: 重制列表
     * @param n*o
     * @return n*o
     */

    tableResetAndReloadButton = () => {
        this.setState({ needConditionList: '' }, () => {
            this?.myRef?.current?.reloadAndRest();
        });
    };

    onModalCancel = () => {
        this.setState({
            viewModalVisible: false,
        });
    };

    renderModal = () => {
        const { moduleId } = this.props;
        const { viewFilterId } = this.state;
        return (
            <Detail
                mode="read"
                match={{
                    params: {
                        type: 'edit',
                        moduleId,
                        id: viewFilterId,
                        isCheck: true,
                    },
                }}
            />
        );
    };
    tableResetAndReload = () => {
        // this.setState({ needConditionList: '' }, () => {

        // });
        if (this.myRef.current) {
            this.myRef.current.reloadAndRest();
        }
    };
    tableReload = () => {
        if (this.myRef.current) {
            this.myRef.current.reload();
        }
    };
    // 批量删除
    onBatchDelete = (params) => {
        const { selectedRowKeys } = this.state;
        const { moduleId, login } = this.props;
        if (!selectedRowKeys || !selectedRowKeys.length) {
            message.warning('请至少选择一条数据进行操作！');
        } else {
            Modal.confirm({
                title: '提示',
                icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                content: `此操作将永久删除选中项，是否继续？`,
                okText: '确认',
                okButtonProps: { prefixCls: 'oss-ui-btn' },
                cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                okType: 'danger',
                cancelText: '取消',
                prefixCls: 'oss-ui-modal',
                width: '350px',
                onOk: () => {
                    request('alarmmodel/filter/v1/filter/batch', {
                        type: 'delete',
                        baseUrlType: 'filterUrl',
                        showSuccessMessage: false,
                        showErrorMessage: true,
                        data: {
                            modelId: 2,
                            filterIdList: selectedRowKeys,
                            moduleId,
                            modifier: login.userId,
                            requestInfo: {
                                clientRequestId: 'nomean',
                                clientToken: localStorage.getItem('access_token'),
                            },
                        },
                        handlers: {
                            params,
                        },
                    })
                        .then((res) => {
                            this.tableResetAndReload();
                            message.success(res.message, 10);
                        })
                        .catch(() => {});
                },
                onCancel() {},
            });
        }
    };
    /**
     * 复选框change
     */
    onSelectChange = (id, rows) => {
        this.setState({
            selectedRowKeys: rows.map((item) => item.filterId),
        });
    };

    /**
     * 复选框selected
     */
    onRowSelect = (record, selected, selectedRows) => {
        this.setState({
            selectedRowKeys: selectedRows.map((item) => item.filterId),
        });
    };

    onSelectAll = (id, rows) => {
        const { login } = this.props;
        const { userInfo } = this.state;
        this.setState({
            selectedRowKeys: rows.filter((item) => login?.userId === item?.creatorId?.toString() || userInfo.isAdmin).map((item) => item.filterId),
        });
    };
    onTypeClck = () => {
        this.setState({
            visible: this.state.visible + 1,
        });
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
    saveFormValue = (params, sorter, filters) => {
        const { moduleId, login } = this.props;
        const { systemInfo } = login;
        const {
            login: { userId },
        } = this.props;
        let queryParam = {
            modelId: 2,
            moduleId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
            creator: userId,
            ..._.omitBy(params, (value, key) => !value || _.endsWith(key, 'queryProperties') || key === 'province_id'),
            filterProvince: Number(this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo)),
        };
        //  特殊查询参数处理
        const queryProperties = [];
        _.each(params, (value, key) => {
            if (_.isArray(value) && value.length > 0 && _.endsWith(key, 'queryProperties')) {
                const newkey = _.replace(key, '_queryProperties', '');
                queryProperties.push({ key: newkey, value });
            } else if (_.isArray(value) && value.length > 0 && key === 'province_id') {
                queryProperties.push({ key, value });
            }
        });
        if (queryProperties.length > 0) {
            queryParam.queryProperties = JSON.stringify(queryProperties);
        }
        // debugger;
        if (!_.isEmpty(sorter)) {
            _.forIn(sorter, (value, key) => {
                queryParam.orderFieldName = key;
                queryParam.order = value === 'ascend' ? FILTER_EMUN.ORDER.ASC : FILTER_EMUN.ORDER.DESC;
            });
        }
        const formatterFilters = _.pickBy(filters, (item) => item);
        if (JSON.stringify(formatterFilters) !== '{}') {
            queryParam = { ...queryParam, ...formatterFilters };
        }
        if (queryParam.filterProfessional === 'all') {
            delete queryParam.filterProfessional;
        }
        if (queryParam.filterProvince === 'all') {
            delete queryParam.filterProvince;
        }
        this.setState({
            savedValue: queryParam,
        });
    };
    render() {
        const { columns, columnsReady, viewModalVisible, viewModalTitle, selectedRowKeys, userInfo, needConditionList, savedValue } = this.state;
        const { onModeChange, moduleId, getFilterData, login } = this.props;
        const { systemInfo } = login;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll,
            getCheckboxProps: (record) => {
                return {
                    disabled: login?.userId !== record?.creatorId?.toString() && !userInfo.isAdmin,
                };
            },
            // renderCell: (checked, record, index, originNode) => {
            //     // {() && (
            //     //     <Tooltip title="编辑" trigger={['hover', 'click']}>
            //     //         <Icon type="EditOutlined" antdIcon onClick={this.editFilterClick.bind(this, record, 'edit')} />
            //     //     </Tooltip>
            //     // )}
            //     if () {
            //         return originNode;
            //     }
            // }
        };
        const xWidth = columns.reduce((total, item) => {
            if (item.width) {
                return total + item.width;
            }
            return total;
        }, 0);

        let initialValues = { filterProvince: '', professionDictName: [] };
        if (moduleId === '1') {
            initialValues = {
                ...initialValues,
                needConditionList: 2,
            };
        }
        if (this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo)) {
            if (moduleId === '1') {
                initialValues = {
                    ...initialValues,
                    //  filterProvince: [Number(this.getInitialProvince(systemInfo?.currentZone?.zoneId,login.userInfo))],
                    filterProvince: Number(this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo)),
                };
            } else {
                console.log(this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo));
                initialValues = {
                    ...initialValues,
                    province_id: Number(this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo)),
                };
            }
        }
        return (
            <div className="list-mode-wrapper oss-imp-alarm-protable-search unicom-spaicing-style">
                {columnsReady && (
                    <VirtualTable
                        request={
                            moduleId === '63'
                                ? (params, sorter, filters) => {
                                      this.saveFormValue(params, sorter, filters);
                                      return getFilterData(params, sorter, filters);
                                  }
                                : getFilterData
                        }
                        columns={columns}
                        params={moduleId === '1' ? { needConditionList } : {}}
                        rowKey="filterId"
                        actionRef={this.myRef}
                        global={window}
                        form={{ initialValues }}
                        x={xWidth}
                        dateFormatter="string"
                        rowSelection={moduleId === '1' ? rowSelection : false}
                        tableAlertRender={false}
                        tableAlertOptionRender={false}
                        search={{
                            className: 'virtualTable-form-setting',
                            span: { xs: 24, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 },
                        }}
                        borderd="true"
                        onReset={this.tableResetAndReloadButton}
                        options={{ reload: true, setting: true, fullScreen: false }}
                        toolBarRender={() => [
                            <AuthButton
                                key="1"
                                onClick={() => {
                                    this.props.pageInfo.setLoadType('init');
                                    this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/new/${moduleId}/new/list`);
                                }}
                                authKey={this.props.buttonKes.add[moduleId]}
                            >
                                <Icon antdIcon type="PlusOutlined" />
                                新建
                            </AuthButton>,
                            // <Button key="4" onClick={this.onTypeClck}>
                            //     类型管理
                            // </Button>,
                            <AuthButton key="2" onClick={onModeChange} authKey={this.props.buttonKes.tree[moduleId]}>
                                <Icon antdIcon type="ApartmentOutlined" />
                                树型
                            </AuthButton>,
                            moduleId === '63' && (
                                <AuthButton
                                    onClick={() => {
                                        if (this.clickExportRef.current) return message.warn('正在导出请稍等');
                                        this.clickExportRef.current = true;
                                        autoSendOrder(savedValue)
                                            .then(() => {
                                                this.clickExportRef.current = false;
                                            })
                                            .catch(() => {
                                                this.clickExportRef.current = false;
                                            });
                                    }}
                                    authKey={this.props.buttonKes.export[moduleId]}
                                >
                                    <Icon antdIcon type="ExportOutlined" />
                                    导出
                                </AuthButton>
                            ),
                            moduleId === '1' && (
                                <AuthButton
                                    addLog={true}
                                    key="3"
                                    onClick={(params) => this.onBatchDelete(params)}
                                    authKey={this.props.buttonKes.batchDelete[moduleId]}
                                >
                                    <Icon antdIcon type="DeleteOutlined" />
                                    批量删除
                                </AuthButton>
                            ),
                        ]}
                    />
                )}
                <Modal
                    destroyOnClose
                    title={viewModalTitle}
                    width={1200}
                    visible={viewModalVisible}
                    onCancel={this.onModalCancel}
                    footer={
                        <div style={{ textAlign: 'center' }}>
                            <Button
                                type="default"
                                onClick={() => {
                                    this.onModalCancel();
                                }}
                            >
                                取消
                            </Button>
                        </div>
                    }
                >
                    {this.renderModal()}
                </Modal>
                {/* <TypeManagement userId={login.userId} visible={visible} /> */}
            </div>
        );
    }
}

export default withModel([useLoginInfoModel, usePageInfo], (shareInfo) => ({
    login: shareInfo[0],
    pageInfo: shareInfo[1],
}))(Index);
