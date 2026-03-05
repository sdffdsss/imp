import React from 'react';
import { withModel } from 'hox';
import { Button, Icon, Tooltip, Space, Modal, message } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { VirtualTable } from 'oss-web-common';
import { FILTER_EMUN } from '@Src/pages/setting/filter/index';
import AuthButton from '@Src/components/auth-button';
import useLoginInfoModel from '@Src/hox';
import Delete from '../delete';
import Export from '../export';
import History from '../history';
import { commonRuleColumns, anotherFilterCondition, searchFormConfig } from './columns';
import Detail from '../edit';
import usePageInfo from '../hox';
import { autoSendOrder, getExportProgressApi, fileDownLoadApi } from './api';
import ArrowDown from './img/arrow_down.png';
import ShowModeContent from './show-mode';
import AsyncExportModal from '../async-export-modal';
import './index.less';
import constants from '@Src/common/constants';

class Index extends React.PureComponent {
    asyncExportTimer = null;
    constructor(props) {
        const { moduleId } = props;

        super(props);
        this.myRef = React.createRef();
        this.clickExportRef = React.createRef(false);
        this.formRef = React.createRef();
        // const commonActions = {
        //     title: '操作',
        //     valueType: 'option',
        //     width: 160,
        //     dataIndex: 'actions',
        //     fixed: 'right',
        //     render: (text, record) => [
        //         <Tooltip title="编辑" trigger={['hover', 'click']}>
        //             <Icon type="EditOutlined" antdIcon moduleId={props.moduleId} onClick={this.editFilterClick.bind(this, record, 'edit')} />
        //         </Tooltip>,
        //         <Tooltip title="复制" trigger={['hover', 'click']}>
        //             <Icon
        //                 antdIcon
        //                 type="CopyOutlined"
        //                 key={1}
        //                 moduleId={props.moduleId}
        //                 iconMode
        //                 onFresh={this.tableResetAndReload}
        //                 data={record}
        //                 onClick={this.editFilterClick.bind(this, record, 'copy')}
        //             />
        //         </Tooltip>,
        //         <Delete key={2} iconMode onFresh={this.tableResetAndReload} data={record} login={this.props.login} />,
        //         <Export key={3} iconMode data={record} moduleId={props.moduleId} />,
        //         <History key={4} iconMode data={record} onFresh={this.tableResetAndReload} />
        //     ]
        // };
        const { login } = this.props;
        const columns = [
            ...commonRuleColumns({
                viewSheetClick: this.viewSheetClick,
                isAddBloc: login.userZoneInfo.zoneLevel === '2' || login.userZoneInfo.zoneLevel === '5',
            }),
        ];

        this.state = {
            columns,
            columnsReady: true, // 否则表单默认值无法生效
            viewModalTitle: '详情',
            stateSearchValue: {},
            savedValue: {},
            showMode: moduleId !== '605',
            asyncExportModalVisible: false,
            asyncExportList: [],
            totalNum: 0,
            // currentModuleId: '10',
        };
    }

    componentDidMount() {
        // this.initColomns();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.pageInfo.loadType !== this.props.pageInfo.loadType) {
            if (this.props.pageInfo.loadType === 'refresh') {
                this.tableResetAndReload();
            }
            if (this.props.pageInfo.loadType === 'reload') {
                this.tableReload();
            }
        }
    }
    getNewModuleId = () => {
        const { moduleId } = this.props;
        const localId = localStorage.getItem('moduleId');
        if (moduleId !== localId) {
            return localId;
        }
        return moduleId;
    };
    static getDerivedStateFromProps(nextProps) {
        if (!_.isEmpty(nextProps.searchValue)) {
            return {
                stateSearchValue: nextProps.searchValue,
            };
        }
        return null;
    }
    initColomns = () => {
        // const userInFo = JSON.parse(this.props.login.userInfo);
        const { login } = this.props;

        const columns = [
            ...commonRuleColumns({
                viewSheetClick: this.viewSheetClick,
                isAddBloc: login.userZoneInfo.zoneLevel === '2' || login.userZoneInfo.zoneLevel === '5',
            }),
        ];
        const moduleId = +this.getNewModuleId();
        // const userInfo = {
        //     // userProvinceId:
        //     //     zoneInfo &&
        //     //     zoneInfo[0]?.zoneLevel &&
        //     //     (parseInt(zoneInfo[0].zoneLevel, 10) === 1 ? zoneInfo[0]?.zoneId : zoneInfo[0].zoneLevel_2Id),
        //     // groupUser: zoneInfo && zoneInfo[0]?.zoneLevel ? parseInt(zoneInfo[0].zoneLevel, 10) === 1 : false,
        //     // userId: this.props.login.userId,
        //     // userName: this.props.login.userName,
        //     // userProvinceName: zoneInfo && zoneInfo[0]?.zoneName,
        //     // userMobile: userInFo.userMobile,
        //     isAdmin: userInFo.isAdmin,
        // };
        // 跳转过来直接打开详情窗
        const { search } = window.location;
        const searchParamsIns = new URLSearchParams(search);
        const ruleId = searchParamsIns.get('ruleId');
        if (ruleId) {
            this.setState(
                {
                    viewSheetId: ruleId,
                    viewModalTitle: '自动派单规则',
                },
                () => {
                    this.setState({
                        viewModalVisible: true,
                    });
                },
            );
        }
        const commonActions = {
            title: '操作',
            valueType: 'option',
            dataIndex: 'actions',
            fixed: 'right',
            width: '120px',
            render: (text, record) => {
                const btns = this.actionButtons(record);
                return [btns];
            },
        };
        const formList = searchFormConfig(moduleId);

        this.setState({
            columns: [...columns, commonActions, ...formList],
            columnsReady: true,
        });
    };

    actionButtons = (record) => {
        const authKey = this.getAuthKey();
        const { login } = this.props;
        // const moduleIdEnum = [605, 604];
        // const moduleId = +this.getNewModuleId();
        const { filterProvince } = this.formRef.current?.getFieldsValue() ?? {};
        const userInFo = JSON.parse(login.userInfo);
        const userInfo = {
            isAdmin: userInFo.isAdmin,
        };
        const actionIsView = (login.userZoneInfo.zoneLevel === '2' || login.userZoneInfo.zoneLevel === '5') && filterProvince === '0';

        return (
            <Space>
                {!actionIsView ? (
                    <>
                        {(this.props.login?.userId === String(record.creatorId) || userInfo.isAdmin) && (
                            <Tooltip title="编辑" trigger={['hover', 'click']}>
                                <AuthButton
                                    type="text"
                                    style={{ padding: 0 }}
                                    moduleId={this.props.moduleId}
                                    onClick={this.editFilterClick.bind(this, record, 'edit')}
                                    authKey={`${authKey}:edit`}
                                >
                                    <Icon antdIcon type="EditOutlined" />
                                </AuthButton>
                            </Tooltip>
                        )}

                        <Tooltip title="复制" trigger={['hover', 'click']}>
                            <AuthButton
                                key={1}
                                moduleId={this.props.moduleId}
                                iconMode
                                onFresh={this.tableResetAndReload}
                                data={record}
                                onClick={this.editFilterClick.bind(this, record, 'copy')}
                                authKey={`${authKey}:copy`}
                                type="text"
                                style={{ padding: 0 }}
                            >
                                <Icon antdIcon type="CopyOutlined" />
                            </AuthButton>
                        </Tooltip>
                        {(this.props.login?.userId === String(record.creatorId) || userInfo.isAdmin) && (
                            <Delete key={2} iconMode onFresh={this.tableResetAndReload} data={record} login={this.props.login} />
                        )}

                        <Export key={3} iconMode data={record} moduleId={this.props.moduleId} />
                        <History key={4} iconMode data={record} onFresh={this.tableResetAndReload} />
                    </>
                ) : null}

                <Tooltip title="查看" trigger={['hover', 'click']}>
                    <Icon type="SearchOutlined" antdIcon onClick={this.viewSheetClick.bind(this, record, 'view')} />
                </Tooltip>
            </Space>
        );
    };
    onModuleIdChange = (value) => {
        this.props.onModuleIdChange(value);
    };
    // 新建/编辑/拷贝跳转
    editFilterClick = (record, type) => {
        // Tooltip不销毁增加延时
        setTimeout(() => {
            this.props.pageInfo.setLoadType('init');
            this.props.history.push(
                `/znjk/${constants.CUR_ENVIRONMENT}/unicom/auto-sheet-rule/${type}/${this.props.moduleId}/${record.filterId}/list`,
            );
        }, 100);
    };

    onSearchCollapse = (collapsed) => {
        this.setState({
            scrollY: collapsed ? window.innerHeight - 360 : window.innerHeight - 420,
        });
    };

    tableResetAndReload = () => {
        if (_.get(this, 'myRef.current')) {
            this.myRef.current.reloadAndRest();
            // this.myRef.current.reload();
        }
    };

    tableReload = () => {
        if (this.myRef.current) {
            this.myRef.current.reload();
        }
    };

    /**
     * @description: 查看
     * @param n*o
     * @return n*o
     */

    viewSheetClick = (record) => {
        // console.log(record, type);
        this.setState(
            {
                viewSheetId: record.filterId,
                viewModalTitle: record.filterName,
            },
            () => {
                this.setState({
                    viewModalVisible: true,
                });
            },
        );
    };

    onModalCancel = () => {
        this.setState({
            viewModalVisible: false,
        });
    };

    renderModal = () => {
        const moduleId = +this.getNewModuleId();
        const { viewSheetId } = this.state;

        return (
            <Detail
                match={{
                    params: {
                        type: 'edit',
                        moduleId,
                        id: viewSheetId,
                        isCheck: true,
                    },
                }}
            />
        );
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
        const { moduleId } = this.props;

        const {
            login: { userId, systemInfo, userInfo },
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

        queryParam.filterProvince = params.filterProvince || this.getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo);

        this.setState({
            savedValue: queryParam,
        });
    };

    switchShowModeClick = () => {
        this.setState({ showMode: !this.state.showMode });
    };
    onExport = async () => {
        const { savedValue, totalNum } = this.state;
        const moduleId = this.getNewModuleId();
        // const { moduleId } = this.props;
        const {
            login: { userId },
        } = this.props;

        const params = {
            ...savedValue,
            userId,
            exportType: 'excel',
            exportSize: totalNum,
            moduleId,
        };
        await autoSendOrder(params);
        if (this.asyncExportTimer) return;
        this.asyncExportTimer = setInterval(() => {
            this.getExportProgress();
        }, 2000);
    };
    /**
     * 异步导出参考
     */
    getExportProgress = async () => {
        const {
            login: { userId },
        } = this.props;
        const result = await getExportProgressApi({ userId });
        if (result.code === 0 && result.data) {
            const { exportSize, exportTimeStr, exportType, progress, exportStatus } = result.data;
            const defaultStatus = {
                str: '',
                status: '',
            };
            if (exportStatus && progress === 100) {
                defaultStatus.str = '导出完成';
                defaultStatus.status = 'success';
            }
            if (exportStatus && progress !== 100) {
                defaultStatus.str = '正在导出';
                defaultStatus.status = 'active';
            }
            if (!exportStatus) {
                defaultStatus.str = '导出失败';
                defaultStatus.status = 'exception';
            }

            const list = {
                exportFormat: exportType,
                exportTime: exportTimeStr,
                exportTotal: exportSize,
                exportState: defaultStatus.str,
                exportSchedule: { status: defaultStatus.status, percent: progress },
            };
            this.setState({
                asyncExportList: [list],
            });
            if (progress < 100 && !this.asyncExportTimer && progress > 0) {
                this.asyncExportTimer = setInterval(() => {
                    this.getExportProgress();
                }, 2000);
            }
            if (progress === 100 || !exportStatus) {
                this.clearTimer();
            }
        }
    };
    onDownLoad = async () => {
        const {
            login: { userId },
            moduleId,
        } = this.props;
        await fileDownLoadApi({ userId, moduleId });
    };
    onClose = () => {
        this.clearTimer();
    };
    clearTimer = () => {
        clearInterval(this.asyncExportTimer);
        this.asyncExportTimer = null;
    };
    getFilterDataRequest = async (params, sorter, filters) => {
        const { getFilterData } = this.props;
        const { showMode } = this.state;
        const copyParams = { ...params };
        if (showMode) {
            copyParams.moduleName = '10';
        }

        this.onModuleIdChange(copyParams.moduleName);
        this.saveFormValue(copyParams, sorter, filters);
        this.initColomns();
        // console.log(params, sorter, filters);
        const res = await getFilterData(copyParams, sorter, filters);
        this.setState({
            totalNum: res.total,
        });
        return res;
    };
    getAuthKey = () => {
        // const { moduleId } = this.props;
        // switch (moduleId) {
        //     case '604':
        //         return 'crhSheetRuleManage';
        //     case '605':
        //         return 'superviseSheetRuleManage';
        //     default:
        //     }
        return 'sheetRuleManage';
    };
    render() {
        const { columns, columnsReady, viewModalTitle, viewModalVisible, showMode, asyncExportModalVisible, asyncExportList, totalNum } = this.state;
        const { onModeChange, moduleId, login } = this.props;
        const { systemInfo } = login;
        const xWidth = columns.reduce((total, item) => {
            if (item.width) {
                return total + item.width;
            }
            return total;
        }, 0);
        let initialValues = {};
        if (this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo)) {
            initialValues = {
                ...initialValues,
                filterProvince: this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
                moduleName: '10',
            };
        }

        const authKey = this.getAuthKey();

        // console.log(form.getFieldsValue());
        return (
            <div className="list-mode-wrapper oss-imp-alarm-protable-search unicom-spaicing-style">
                {showMode && <ShowModeContent systemInfo={systemInfo} />}
                <div style={{ height: showMode ? 'calc(100% - 496px)' : '100%' }}>
                    {columnsReady && (
                        <VirtualTable
                            request={(params, sorter, filters) => this.getFilterDataRequest(params, sorter, filters)}
                            // params={params}
                            columns={columns}
                            rowKey="filterId"
                            actionRef={this.myRef}
                            // beforeSearchSubmit={this.beforeSearchSubmit}
                            // onReset={this.onReset}
                            global={window}
                            x={xWidth}
                            form={{ initialValues }}
                            formRef={this.formRef}
                            dateFormatter="string"
                            rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                            search={
                                showMode
                                    ? false
                                    : {
                                          onCollapse: this.onSearchCollapse,
                                          className: 'virtualTable-form-setting',
                                          span: { xs: 24, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 },
                                      }
                            }
                            borderd="true"
                            options={{ reload: true, setting: true, fullScreen: false }}
                            toolBarRender={() => {
                                return [
                                    <AuthButton
                                        key="1"
                                        onClick={() => {
                                            this.props.pageInfo.setLoadType('init');
                                            const newModuleId = this.getNewModuleId();
                                            this.props.history.push(
                                                `/znjk/${constants.CUR_ENVIRONMENT}/unicom/auto-sheet-rule/new/${newModuleId}/new/list`,
                                            );
                                        }}
                                        authKey={`${authKey}:add`}
                                    >
                                        <Icon antdIcon type="PlusOutlined" />
                                        新建
                                    </AuthButton>,
                                    // <Button key="4" onClick={this.onTypeClck}>
                                    //     类型管理
                                    // </Button>,
                                    <AuthButton key="2" onClick={() => onModeChange && onModeChange()} authKey={`${authKey}:tree`}>
                                        <Icon antdIcon type="ApartmentOutlined" />
                                        树型
                                    </AuthButton>,
                                    <AuthButton
                                        onClick={() => {
                                            this.setState({ asyncExportModalVisible: true });
                                            this.getExportProgress();
                                        }}
                                        authKey={`${authKey}:export`}
                                    >
                                        <Icon antdIcon type="ExportOutlined" />
                                        导出
                                    </AuthButton>,

                                    moduleId !== '605' ? (
                                        <img
                                            src={ArrowDown}
                                            onClick={this.switchShowModeClick}
                                            style={{
                                                width: 14,
                                                height: 8,
                                                cursor: 'pointer',
                                                transition: 'transform 0.4s',
                                                transform: !showMode ? 'translateY(-2px)' : 'translateY(-2px) rotate(180deg)',
                                            }}
                                            alt=""
                                        />
                                    ) : null,
                                ];
                            }}
                            // tableRender={(props, dom, domList) => {
                            //     console.log(props);
                            //     console.log(dom);
                            //     console.log(domList);
                            //     return domList.table;
                            //     // body: {
                            //     //     cell: (
                            //     //         <tr>
                            //     //             <td>123</td>
                            //     //         </tr>
                            //     //     )
                            //     // }
                            // }}
                        />
                    )}
                </div>
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
                <AsyncExportModal
                    visible={asyncExportModalVisible}
                    setVisible={(v) => this.setState({ asyncExportModalVisible: v })}
                    onExport={() => this.onExport()}
                    exportList={asyncExportList}
                    onDownLoad={() => this.onDownLoad()}
                    onClose={() => this.onClose()}
                    total={totalNum}
                />
            </div>
        );
    }
}

export default withModel([useLoginInfoModel, usePageInfo], (shareInfo) => ({
    login: shareInfo[0],
    pageInfo: shareInfo[1],
}))(Index);
