/* eslint-disable consistent-return */
import React from 'react';
import { Icon, message, Spin, Tooltip } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import GroupTree from './components/comp-group-tree';
import EditComp from './edit';
import { getGroupConf } from './utils/config';
import { getTreeData, searchGroupFields, getGroupsData, getGroupNetWorkList, validatePermissionBeforeUpdate, getRegionList } from './utils/api';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import SelectComp from './components/comp-select';
import EditSelectComp from './components/edit-select';
import { _ } from 'oss-web-toolkits';
import NeListComp from './neList';
import DeleteComp from './delete';
import UploadComp from './upload';
import ExportComp from './export';
import { getInitialProvince } from './utils/tools';
import AuthButton from '@Src/components/auth-button';
import './index.less';
/**
 * 条件组管理（网元组、标题组、、）
 */
class Index extends React.PureComponent {
    constructor(props) {
        super(props);

        const { login } = this.props;
        const { systemInfo } = login;

        this.state = {
            // 网元组：1
            mode: props.match.params.mode && Number(props.match.params.mode),

            // 左侧树相关
            treeLoading: true,
            treeData: null,
            selectedTreeNode: null,
            selectedTreeKeys: [],

            // 右侧表格相关
            tableParams: {},
            tableColumns: getGroupConf(
                this,
                props.match.params.mode,
                this.onProvinceChange,
                getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
            ).groupColumns,
            selectedTableRowKeys: [],
            selectedTableRows: [],
            editRow: null,

            // 新增编辑表格
            modalVisible: false,
            // 上传文件弹窗
            showUploadModalVisible: false,
            uploadParams: {},

            neListModalVisible: false,
            showNeListGroup: null,
            cityList: [],
        };
        this.treeRef = React.createRef();
        this.groupRef = React.createRef();
        this.groupFormRef = React.createRef();
        this.conditionRef = React.createRef();
        this.treeNodeLevelEnum = {
            0: 'root',
            1: 'professionGroup',
            2: 'netWorkGroup',
        };
    }

    componentDidMount() {
        this.getTreeDataList();
        this.onProvinceChange();
    }

    onProvinceChange = (e) => {
        const { login } = this.props;
        const { systemInfo } = login;
        getRegionList({
            creator: login.userId,
            parentRegionId: e || getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
        }).then((res) => {
            if (res && Array.isArray(res)) {
                console.log(res);
                this.setState(
                    {
                        cityList: res,
                        tableColumns: getGroupConf(
                            this,
                            this.props.match.params.mode,
                            this.onProvinceChange,
                            getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
                            res,
                        ).groupColumns,
                    },
                    () => {
                        this.groupFormRef.current.setFieldsValue({
                            provinceId: e || Number(getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo)),
                            regionId: null,
                        });
                    },
                );
                // this.setState({
                //     cityList: res
                // },()=>{
                //     return getGroupConf(this, this.props.match.params.mode,{},this.state.cityList).groupColumns
                // })
            }
        });
    };

    onEditProvinceChange = (e) => {
        const { login } = this.props;
        const { systemInfo } = login;
        getRegionList({
            creator: login.userId,
            parentRegionId: e || getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
        }).then((res) => {
            if (res && Array.isArray(res)) {
                this.setState({
                    cityList: res,
                });
            }
        });
    };

    // 左侧树相关

    /**
     * @description: 获取左侧树列表数据
     * @param {*}
     * @return {*}
     */
    getTreeDataList = async (slectedTreeNodeData) => {
        const { login } = this.props;
        const { systemInfo } = login;
        const { mode } = this.state;
        try {
            const data = {
                userId: login.userId,
                groupType: mode,
                netWorkGroupProvince: getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
            };
            const res = await getTreeData(data);
            if (res && Array.isArray(res.data)) {
                let selectedTreeNode = [];

                if (slectedTreeNodeData) {
                    selectedTreeNode = [slectedTreeNodeData];
                    this.setState({
                        treeLoading: false,
                        treeData: res.data,
                        selectedTreeNode: selectedTreeNode[0],
                    });
                } else {
                    if (Array.isArray(res.data[0]?.groupRes)) {
                        selectedTreeNode = res.data[0]?.groupRes.map((item) => {
                            return {
                                id: item.groupNetworkId,
                                name: item.groupNetworkName,
                                level: '1',
                            };
                        });
                    }
                    this.setState(
                        {
                            treeLoading: false,
                            treeData: res.data,
                            selectedTreeNode: selectedTreeNode[0],
                        },
                        () => {
                            this.groupRef.current.reset();
                        },
                    );
                }
            } else {
                this.setState({
                    treeLoading: false,
                    treeData: [],
                });
            }
            return res.data || [];
        } catch (e) {
            message.error('出错了，请联系管理员');
        }
    };

    /**
     * @description: 选中树节点
     * @param {*} selectedKeys
     * @param {*} e
     * @return {*}
     */
    onTreeNodeSelect = (selectedKeys, e) => {
        console.log(selectedKeys);
        // this.onProvinceChange()
        const { login } = this.props;
        const { systemInfo } = login;
        if (Array.isArray(selectedKeys)) {
            const selectedNode = e.selectedNodes[0];
            this.setState(
                {
                    selectedTreeNode: selectedNode,
                    selectedTreeKeys: selectedKeys,
                    tableColumns: getGroupConf(
                        this,
                        this.props.match.params.mode,
                        this.onProvinceChange,
                        getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
                    ).groupColumns,
                },
                () => {
                    // 点击树节点之后查询右侧表格列表
                    this.getGroupListData(selectedNode);
                },
            );
        }
    };

    /**
     * @description: 查询表格列表头
     * @param {*}
     * @return {*}
     */
    getGroupListData = (item) => {
        const funcList = {
            root: this.getGroupList,
            professionGroup: this.getGroupList,
            netWorkGroup: this.getNetGroupList,
        };
        funcList[this.treeNodeLevelEnum[item?.level] || 'professionGroup']();
    };

    /**
     * @description: 获取表格数据
     * @param {*}
     * @return {*}
     */
    getTableData = async (params, sorter) => {
        const { login } = this.props;
        const { systemInfo } = login;
        const { mode, selectedTreeNode, tableColumns } = this.state;
        if (!selectedTreeNode) {
            return {
                data: [],
                success: true,
                total: 0,
            };
        }
        try {
            const level = selectedTreeNode?.level || '1';
            const levelName = this.treeNodeLevelEnum[level];
            let res = null;
            const data = {
                current: params.current,
                pageSize: params.pageSize,
                userId: Number(login.userId),
            };
            // 排序相关
            if (sorter && Array.isArray(Object.keys(sorter)) && Object.keys(sorter).length > 0) {
                const key = Object.keys(sorter)[0];
                data.orderFieldName = key;
                data.orderType = sorter[key] === 'ascend' ? 0 : 1;
            } else {
                data.orderFieldName = '';
                data.orderType = 0;
            }
            // 不同类型不通接口
            if (levelName === 'root' || levelName === 'professionGroup') {
                data.groupType = mode;
                data.groupNetWorkType = levelName === 'professionGroup' ? selectedTreeNode.id : -1;
                data.regionId = params.regionId || -1;
                data.netWorkGroupProvince = params.provinceId || getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo) || '';
                data.netWorkGroupProfessional = params.professionType?.toString() || '';
                data.groupName = params.groupName;
                data.groupId = -1;
                res = await getGroupsData(data);
            } else {
                data.groupId = selectedTreeNode.id;
                data.groupType = mode;
                data.groupNetWorkType = selectedTreeNode.groupNetWorkId;
                data.orderField = (sorter && Object.keys(sorter) && Object.keys(sorter)[0]) || '';
                data.filterFieldMap = {};
                data.searchLikeParamMap = {};
                const cloneParams = _.cloneDeep(params);
                delete cloneParams.current;
                delete cloneParams.pageSize;
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                cloneParams &&
                    Object.keys(cloneParams).forEach((item) => {
                        if (!cloneParams[item] && cloneParams[item] !== 0) return;
                        if (_.find(tableColumns, { dbFieldName: item }).enumFlag) {
                            data.filterFieldMap[item] = cloneParams[item];
                        } else {
                            data.searchLikeParamMap[item] = cloneParams[item];
                        }
                    });
                res = await getGroupNetWorkList(data);
            }
            if (res) {
                return {
                    data: res.data || [],
                    success: true,
                    total: res.total,
                };
            }
        } catch (e) {
            message.error('出错了');
        }
    };

    /**
     * @description: 获取专业组下面的专业列表
     * @param {*}
     * @return {*}
     */
    getGroupList = () => {
        const { login } = this.props;
        const { systemInfo } = login;
        this.onProvinceChange();
        this.setState(
            {
                tableColumns: getGroupConf(
                    this,
                    this.props.match.params.mode,
                    this.onProvinceChange,
                    getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
                ).groupColumns,
            },
            () => {
                this.groupRef.current.reset();
            },
        );
    };

    /**
     * @description: 展示网元组下的网元
     * @param {*}
     * @return {*}
     */

    showNeList = (record) => {
        this.setState({
            neListModalVisible: true,
            showNeListGroup: record,
        });
    };

    /**
     * @description: 关闭网元组下的网元
     * @param {*}
     * @return {*}
     */

    closeNeListModal = () => {
        this.setState({
            neListModalVisible: false,
        });
    };

    /**
     * @description: 获取专业下面网元组字段信息
     * @param {*}
     * @return {*}
     */
    getNetGroupList = async () => {
        const { selectedTreeNode, mode } = this.state;
        const groupNetWorkType = selectedTreeNode.groupNetWorkId;
        const data = {
            groupNetWorkType,
            groupType: mode,
        };
        // 获取该专业类型的columns
        try {
            const res = await searchGroupFields(data);
            let columns = [];
            if (res && Array.isArray(res.data)) {
                columns = res.data.map((item) => {
                    const tempObj = {
                        ...item,
                        width: item.columnSize,
                        dataIndex: item.dbFieldName,
                        hideInTable: !item.displayFlag,
                        title: item.labelName,
                        align: 'center',
                        ellipsis: true,
                        // columnSize: 120,
                        orderId: item.orderId,
                        sorter: true,
                        hideInSearch: !item.searchFlag,
                        render: (text, record) => {
                            return (
                                <section
                                    style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <Tooltip title={record[item.msgFieldName] || '-'}>{record[item.msgFieldName] || '-'}</Tooltip>
                                </section>
                            );
                        },
                    };
                    if (item.enumFlag) {
                        tempObj.renderFormItem = () => {
                            if (item.enumFieldName === 'region_id') {
                                return <EditSelectComp dictName={item.enumFieldName} label="value" id="key" mode="" />;
                            }
                            return <SelectComp dictName={item.enumFieldName} label="value" id="key" mode="" />;
                        };
                    }
                    return tempObj;
                });
            }
            this.setState(
                {
                    tableColumns: _.orderBy(columns, ['orderId'], ['asc']),
                },
                () => {
                    this.groupRef.current.reset();
                },
            );
        } catch (e) {
            message.error('出错了！');
        }
    };

    /**
     * @description: 打开编辑组弹窗
     * @param {*} key 0: 新增 1: 修改
     * @param {*} record 修改时参数
     * @return {*}
     */
    showEditGroupModal = async (key, record) => {
        const { login } = this.props;
        let flag = false;
        if (key === 1) {
            const res = await validatePermissionBeforeUpdate({
                groupId: record.groupId,
                modifyUserId: login.userId,
            });
            if (!res) {
                flag = true;
            }
        }
        if (flag) {
            return;
        }
        this.setState({
            modalVisible: true,
            editStatus: key,
            editRow: record || null,
        });
    };
    /**
     * @description: 关闭编辑界面弹窗
     * @param {*}
     * @return {*}
     */
    closeModal = () => {
        this.setState({
            modalVisible: false,
        });
    };

    /**
     * @description: 选中复选框
     * @param {*}
     * @return {*}
     */

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedTableRowKeys: selectedRowKeys,
            selectedTableRows: selectedRows,
        });
    };

    /**
     * @description: 刷新页面
     * @param {*}
     * @return {*}
     */
    onReloadTable = async (type = 'edit') => {
        const { login } = this.props;
        const { systemInfo } = login;
        if (type === 'delete') {
            this.setState({
                selectedTableRows: [],
            });
        }
        const { selectedTreeNode } = this.state;
        const slectedTreeNodeData = {
            ...selectedTreeNode,
            level: selectedTreeNode.level ? selectedTreeNode.level : '1',
        };
        try {
            const res = await this.getTreeDataList(slectedTreeNodeData, type);
            if (slectedTreeNodeData.level !== '2') {
                this.groupRef.current.reload();
            } else if (Array.isArray(res) && res[0]?.groupRes && Array.isArray(res[0]?.groupRes)) {
                const newSelectGroupNetWorkNode = _.find(res[0]?.groupRes, { groupNetworkId: slectedTreeNodeData.groupNetWorkId });
                if (type === 'delete') {
                    this.setState(
                        {
                            selectedTreeNode: {
                                id: newSelectGroupNetWorkNode.groupNetworkId,
                                name: newSelectGroupNetWorkNode.groupNetworkName,
                                level: '1',
                            },
                            tableColumns: getGroupConf(
                                this,
                                this.props.match.params.mode,
                                this.onProvinceChange,
                                getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
                            ).groupColumns,
                        },
                        () => {
                            this.groupRef.current.reload();
                        },
                    );
                }
                if (newSelectGroupNetWorkNode && Array.isArray(newSelectGroupNetWorkNode.groupNetworkRes)) {
                    const newSelectTreeNode = _.find(newSelectGroupNetWorkNode.groupNetworkRes, { id: slectedTreeNodeData.id });
                    if (newSelectTreeNode) {
                        const mergeNode = {
                            ...slectedTreeNodeData,
                            ...newSelectTreeNode,
                        };
                        this.setState(
                            {
                                selectedTreeNode: mergeNode,
                            },
                            () => {
                                this.groupRef.current.reload();
                            },
                        );
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }

        // this.getGroupListData();
    };

    /**
     * @description: 打开上传弹窗
     * @param {*}
     * @return {*}
     */
    showUploadModal = (record) => {
        const { login } = this.props;
        this.setState({
            showUploadModalVisible: true,
            uploadParams: {
                groupId: record.groupId,
                groupNetWorkType: record.groupNetWorkType,
                groupType: record.groupType,
                userId: login.userId,
            },
        });
    };

    /**
     * @description: 关闭上传弹窗
     * @param {*}
     * @return {*}
     */
    closeUploadModel = () => {
        this.setState({
            showUploadModalVisible: false,
        });
    };

    render() {
        const {
            mode,
            tableColumns,
            selectedTableRowKeys,
            selectedTreeNode,
            selectedTreeKeys,
            editStatus,
            modalVisible,
            treeLoading,
            treeData,
            tableParams,
            selectedTableRows,
            editRow,
            showUploadModalVisible,
            uploadParams,
            neListModalVisible,
            showNeListGroup,
            cityList,
        } = this.state;
        const { login } = this.props;
        const { systemInfo } = login;
        const rowSelection =
            this.treeNodeLevelEnum[selectedTreeNode?.level] === 'netWorkGroup'
                ? null
                : {
                      selectedTableRowKeys,
                      onChange: this.onSelectChange,
                  };

        const commonProps = {
            global: window,
            size: 'small',
            bordered: true,
            options: { reload: true, setting: true, fullScreen: false },
        };

        const scrollX = tableColumns.reduce((total, item) => {
            return total + (item.width || 0);
        });

        return (
            <div className="filter-condition-tree-mode-wrapper">
                <div className="tree-mode-content-wrapper">
                    <div className="filter-tree-list">
                        <Spin tip="数据加载中..." spinning={treeLoading}>
                            <GroupTree
                                treeRef={this.treeRef}
                                onTreeSelect={this.onTreeNodeSelect}
                                selectedTreeKeys={selectedTreeKeys}
                                selectedTreeNode={selectedTreeNode}
                                data={treeData}
                                userInfo={login}
                                onReloadTable={this.onReloadTable}
                                editNetWorkGroup={this.showEditGroupModal}
                            />
                        </Spin>
                    </div>
                    <div className="table-info-wrapper">
                        <VirtualTable
                            {...commonProps}
                            rowSelection={rowSelection}
                            columns={tableColumns}
                            actionRef={this.groupRef}
                            formRef={this.groupFormRef}
                            params={tableParams}
                            request={this.getTableData}
                            onReset={() => {
                                return this.treeNodeLevelEnum[selectedTreeNode?.level] === 'professionGroup' && this.onProvinceChange();
                            }}
                            headerTitle={selectedTreeNode?.name}
                            rowKey={this.treeNodeLevelEnum[selectedTreeNode?.level] === 'netWorkGroup' ? 'neId' : 'groupId'}
                            tableAlertRender={false}
                            x={scrollX}
                            toolBarRender={() => {
                                return (
                                    this.treeNodeLevelEnum[selectedTreeNode?.level] === 'professionGroup' && [
                                        <AuthButton authKey="networkGroup:add" onClick={this.showEditGroupModal.bind(this, 0)}>
                                            <Icon antdIcon type="PlusOutlined" />
                                            新建组
                                        </AuthButton>,
                                        <DeleteComp
                                            buttonType="button"
                                            data={selectedTableRows}
                                            userId={login.userId}
                                            groupType={mode}
                                            groupNetWorkType={selectedTreeNode.id}
                                            onReloadTable={this.onReloadTable}
                                        />,
                                        <ExportComp groupNetWorkType={selectedTreeNode.id} groupType={mode} data={selectedTableRowKeys} />,
                                    ]
                                );
                            }}
                        />
                    </div>
                    {modalVisible && (
                        <EditComp
                            onProvinceChange={this.onEditProvinceChange}
                            cityList={cityList}
                            editRow={editRow}
                            editStatus={editStatus}
                            closeModal={this.closeModal}
                            userInfo={login}
                            addGroupNetWorkType={selectedTreeNode.id}
                            groupType={mode}
                            addGroupName={selectedTreeNode.name}
                            onReloadTable={this.onReloadTable}
                            initialProvince={getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo)}
                        />
                    )}
                    {showUploadModalVisible && <UploadComp visible={true} onCloseModal={this.closeUploadModel} uploadParams={uploadParams} />}
                    {neListModalVisible && <NeListComp onCloseModal={this.closeNeListModal} showNeListGroup={showNeListGroup} />}
                </div>
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
