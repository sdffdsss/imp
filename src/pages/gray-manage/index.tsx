import React from 'react';
import { Button, Card, Checkbox, Col, Form, Icon, Input, Modal, Row, Tabs } from 'oss-ui';
import PageContainer from '@Components/page-container';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import './index.less';
import { VirtualTable } from 'oss-web-common';
import Edit from './edit';
import EditUrl from './edit-url';
import { Api } from './api';

const { TabPane } = Tabs;
interface Props {
    login: {
        userId: any;
        systemInfo: any;
        userInfo: any;
    };
}
interface States {
    // areaList: any[];
    regionList: any[];
    provinceList: any[];
    columns: any[];
    selectedRowKeys: any[];
    editModalVisible: boolean;
    editUrlModalVisible: boolean;
    editRow: any;
    editRows: any[];
    isBatchUpdate: boolean;
    tabValue: any;
    // 大区全选状态
    regionIndeterminate: boolean;
    regionCheckAll: boolean;
    regionCheckList: any[];
    // 省份全选状态
    provinceIndeterminate: boolean;
    provinceCheckAll: boolean;
    provinceCheckList: any[];
    dataSource: any[];
    pagination: any;
}
class Index extends React.PureComponent<Props, States> {
    formRef: any = React.createRef();
    actionRef: any = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            // areaList: [],
            // 大区列表
            regionList: [],
            // 省份列表
            provinceList: [],
            columns: [],
            selectedRowKeys: [],
            editModalVisible: false,
            editUrlModalVisible: false,
            editRow: null,
            editRows: null,
            isBatchUpdate: false,
            // data: [],
            tabValue: '0',
            // 大区全选状态
            regionIndeterminate: true,
            regionCheckAll: false,
            regionCheckList: [],
            // 省份全选状态
            provinceIndeterminate: true,
            provinceCheckAll: false,
            provinceCheckList: [],
            dataSource: [],
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
            },
        };
    }

    componentDidMount() {
        this.initData();
    }

    // 初始化数据
    initData = () => {
        this.getColumns();
        // 初始化省份数据
        this.getProvinceData();
        // 查询列表数据
        this.searchTable();
    };
    getColumns = () => {
        const columns = [
            {
                title: '类型',
                dataIndex: 'canaryType',
                key: 'canaryType',
                hideInSearch: true,
                ellipsis: true,
                render: (text, row) => {
                    if (row.canaryType === 0) {
                        return <div>省份</div>;
                    }
                    return <div>用户</div>;
                },
            },
            {
                title: 'ID',
                dataIndex: 'canaryRelationId',
                key: 'canaryRelationId',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '名称',
                dataIndex: 'canaryRelationName',
                key: 'canaryRelationName',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '跳转URL',
                dataIndex: 'redirectUrl',
                key: 'redirectUrl',
                hideInSearch: true,
                width: '25%',
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
                    <div key="opr">
                        {/* eslint-disable-next-line react/jsx-no-bind */}
                        <Button onClick={this.showEditUrlModal.bind(this, row)} type="text" style={{ padding: 0 }}>
                            <Icon antdIcon key="edit" type="FormOutlined" />
                        </Button>

                        {/* eslint-disable-next-line react/jsx-no-bind */}
                        <Button onClick={this.deleteExperiences.bind(this, [row.canaryId])} type="text" style={{ padding: 0 }}>
                            <Icon antdIcon key="delete" type="DeleteOutlined" />
                        </Button>
                    </div>,
                ],
            },
        ];
        this.setState({ columns });
    };
    /**
     * 获取省份数据
     */
    getProvinceData = () => {
        Api.getProvinces().then((res: any) => {
            const regionList: any[] = [];
            const regionCheckList: any[] = [];
            const provinceList: any[] = [];
            const provinceCheckList: any[] = [];
            // eslint-disable-next-line no-underscore-dangle
            if (res && res._embedded && res._embedded.zoneResourceList) {
                // eslint-disable-next-line no-underscore-dangle
                res._embedded.zoneResourceList.forEach((item: any) => {
                    const tmpObj = { label: item.zoneName, value: item.zoneId, parentId: item.parentZoneId, zoneLevel: item.zoneLevel };
                    if (item.zoneLevel === 5) {
                        regionList.push(tmpObj);
                        regionCheckList.push(item.zoneId);
                    } else if (item.zoneLevel === 2) {
                        provinceList.push(tmpObj);
                        provinceCheckList.push(item.zoneId);
                    }
                    // areaList.push(tmpObj);
                });
            }
            if (regionList.length > 0) {
                regionList.sort((a: any, b: any) => {
                    return a.value - b.value;
                });
            }
            if (provinceList.length > 0) {
                provinceList.sort((a: any, b: any) => {
                    return a.parentId - b.parentId;
                });
            }

            this.setState({
                regionCheckAll: true,
                regionIndeterminate: false,
                regionList,
                regionCheckList,
                provinceCheckAll: true,
                provinceIndeterminate: false,
                provinceList,
                provinceCheckList,
            });
        });
    };

    searchTable = () => {
        // this.actionRef.current.reload();
        // const {pagination} = this.state ;
        // this.setState({
        //     dataSource:[]
        // });
        this.getTableData().then();
    };

    /**
     * @description: 获取列表数据
     * @param params
     * @return n*o
     */
    getTableData = async () => {
        const formValues = this.formRef.current.getFieldsValue();
        const { searchValue } = formValues;
        // const { pageSize, current } = params;
        // canaryType  灰度类型 0-按省  1-按用户
        // canaryRelationId  省ID或用户ID，多个逗号分隔
        const { pagination, tabValue, regionCheckList, provinceCheckList } = this.state;

        const canaryRelationId = [...regionCheckList, ...provinceCheckList];

        const data = {
            page_size: pagination.pageSize,
            page_num: pagination.current,
            canaryType: tabValue,
            canaryRelationId: tabValue === '0' ? canaryRelationId.join(',') : null,
            canaryRelationName: tabValue === '0' ? null : searchValue,
        };
        try {
            const result = await Api.getCanaryList(data);
            // const obj = {
            //     success: true,
            //     total: result?.pagination?.total || 0,
            //     data: result.canaryInfoList || [],
            // }
            this.setState({
                dataSource: result.canaryInfoList || [],
                pagination: result.pagination,
            });
        } catch (e) {
            // const obj = {
            //     success: true,
            //     total: 0,
            //     data: [],
            // };
            this.setState({
                dataSource: [],
            });
        }
    };

    onPageChange = (pagination) => {
        this.setState({ pagination }, () => {
            this.searchTable();
        });
    };

    /**
     * @description: 重置表单查询项
     * @param n*o
     * @return n*o
     */

    resetTable = () => {
        this.formRef.current.setFieldsValue({
            hdsfyh: '',
        });
        this.actionRef.current.reload();
    };

    /**
     * @description: 打开编辑弹窗
     * @param
     * @return
     */

    showEditModal = (editRow) => {
        this.setState({
            editModalVisible: true,
            editRow,
        });
    };
    /**
     * @description: 打开编辑弹窗
     * @param
     * @return
     */

    showEditUrlModal = (editRow) => {
        this.setState({
            editUrlModalVisible: true,
            editRow,
            editRows: null,
            isBatchUpdate: false,
        });
    };

    /**
     * @description: 关闭编辑弹窗
     * @param
     * @return
     */

    handleCancel = () => {
        this.setState({
            editModalVisible: false,
            editRow: null,
        });
    };

    /**
     * @description: 添加、编辑成功回调
     * @param n*o
     * @return n*o
     */

    okCallback = () => {
        // this.actionRef.current.reload();
        this.setState({
            editModalVisible: false,
            editRow: null,
        });
        this.searchTable();
    };

    /**
     * @description: 关闭编辑弹窗
     * @param
     * @return
     */

    urlHandleCancel = () => {
        this.setState({
            editUrlModalVisible: false,
            editRow: null,
        });
    };

    /**
     * @description: 添加、编辑成功回调
     * @param n*o
     * @return n*o
     */

    urlOkCallback = (rowData) => {
        // this.actionRef.current.reload();
        const { dataSource } = this.state;
        this.setState({
            editUrlModalVisible: false,
            editRow: null,
            editRows: null,
            isBatchUpdate: false,
        });

        // 解析 params.canaryId 为数组，并处理空格和空值
        const canaryIds = rowData.canaryIds ? rowData.canaryIds : [rowData.canaryId];

        // 遍历 dataSource 更新匹配的项
        const updatedDataSource = dataSource.map((item) => {
            // 检查当前项的 canaryId 是否在 canaryIds 数组中
            if (canaryIds.includes(item.canaryId?.toString())) {
                // 匹配成功，更新 redirectUrl
                return {
                    ...item,
                    redirectUrl: rowData.redirectUrl,
                };
            }
            // 不匹配，返回原项
            return item;
        });

        this.setState(
            {
                selectedRowKeys: [],
                dataSource: updatedDataSource,
            },
            () => {
                this.searchTable();
            },
        );
    };

    /**
     * @description: 批量修改
     * @param
     * @return
     */

    batchUpdate = (data) => {
        this.setState({
            editUrlModalVisible: true,
            editRow: null,
            editRows: data,
            isBatchUpdate: true,
        });
    };

    /**
     * @description: 删除
     * @param
     * @return
     */

    deleteExperiences = (data) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content: '此操作将永久删除选中项，是否继续？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                await Api.deleteCanaryData(data);
                this.setState(
                    {
                        selectedRowKeys: [],
                    },
                    () => {
                        this.searchTable();
                        // this.actionRef.current.reload();
                    },
                );
            },
        });
    };
    onTabChange = (v) => {
        this.setState({ tabValue: v }, () => {
            this.searchTable();
        });
        // this.actionRef.current.reload();
    };

    /**
     * 选择大区
     */
    selectAllRegion = (e: any) => {
        const regionCheckList: any[] = [];
        if (e.target.checked) {
            // eslint-disable-next-line array-callback-return
            this.state.regionList.map((item) => {
                regionCheckList.push(item.value);
            });
        }
        this.setState({
            regionCheckAll: e.target.checked,
            regionIndeterminate: false,
            regionCheckList: e.target.checked ? regionCheckList : [],
        });
        this.selectRegionProvinces(regionCheckList);
    };

    onChangeRegion = (list: any[]) => {
        const self = this;
        this.setState({
            regionCheckAll: list.length === self.state.regionList.length,
            regionIndeterminate: !!list.length && list.length < self.state.regionList.length,
            regionCheckList: list,
        });
        this.selectRegionProvinces(list);
    };

    /**
     * 根据选择阿大区 ，默认勾选对应的省份信息
     * @param list
     */
    selectRegionProvinces = (list) => {
        // 根据选择的大区选中对应的省份
        const provinceCheckList: any[] = [];
        list.forEach((regionId: any) => {
            this.state.provinceList.forEach((provinceItem) => {
                if (regionId === provinceItem.parentId) {
                    provinceCheckList.push(provinceItem.value);
                }
            });
        });
        this.onChangeProvince(provinceCheckList);
    };

    /**
     * 选择省份
     */
    selectAllProvince = (e) => {
        const provinceCheckList: any[] = [];
        if (e.target.checked) {
            // eslint-disable-next-line array-callback-return
            this.state.provinceList.map((item) => {
                provinceCheckList.push(item.value);
            });
        }
        this.setState({
            provinceCheckAll: e.target.checked,
            provinceIndeterminate: false,
            provinceCheckList: e.target.checked ? provinceCheckList : [],
        });
    };

    onChangeProvince = (list) => {
        const self = this;
        this.setState({
            provinceCheckAll: list.length === self.state.provinceList.length,
            provinceIndeterminate: !!list.length && list.length < self.state.provinceList.length,
            provinceCheckList: list,
        });
    };

    render() {
        const {
            pagination,
            dataSource,
            columns,
            selectedRowKeys,
            editModalVisible,
            editUrlModalVisible,
            editRow,
            editRows,
            isBatchUpdate,
            tabValue,
            regionCheckAll,
            regionIndeterminate,
            regionCheckList,
            provinceCheckAll,
            provinceCheckList,
            provinceIndeterminate,
            regionList,
            provinceList,
        } = this.state;
        let headerTitle: any = null;
        if (tabValue === '1') {
            headerTitle = (
                <Form name="basic" ref={this.formRef}>
                    <Row gutter={24} wrap={false}>
                        <Col span={24} style={{ display: 'inline' }}>
                            <Form.Item style={{ marginBottom: 0 }} name="searchValue" label="用户姓名">
                                <Input placeholder="请输入用户姓名" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            );
        }

        return (
            <PageContainer showHeader={false}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Tabs onChange={this.onTabChange} type="card">
                        <TabPane tab="按省份跳转配置" key={0} />
                        <TabPane tab="按用户跳转配置" key={1} />
                    </Tabs>
                    <Card bordered={false} style={{ height: 'calc(100% - 150px)' }} bodyStyle={{ padding: 0, height: '100%' }}>
                        {tabValue === '0' && (
                            <Form name="validate_other" ref={this.formRef} className="gray-top-select">
                                <Row>
                                    <Col span={23}>
                                        <Form.Item name="regionItem" label="大区">
                                            <Checkbox
                                                value="allRegion"
                                                key="allRegion"
                                                indeterminate={regionIndeterminate}
                                                checked={regionCheckAll}
                                                onChange={this.selectAllRegion}
                                            >
                                                全部
                                            </Checkbox>
                                            <Checkbox.Group options={regionList} value={regionCheckList} onChange={this.onChangeRegion} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={23}>
                                        <Form.Item name="provinceItem" label="省份">
                                            <Checkbox
                                                value="allProvince"
                                                key="allProvince"
                                                indeterminate={provinceIndeterminate}
                                                checked={provinceCheckAll}
                                                onChange={this.selectAllProvince}
                                            >
                                                全部
                                            </Checkbox>
                                            <Checkbox.Group options={provinceList} value={provinceCheckList} onChange={this.onChangeProvince} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                        <VirtualTable
                            rowKey="canaryId"
                            global={window}
                            scroll={{
                                x: 300,
                            }}
                            search={false}
                            searchCollapsed={false}
                            rowSelection={{
                                fixed: true,
                                type: 'checkbox',
                                selectedRowKeys,
                                onChange: (rowKeys) => this.setState({ selectedRowKeys: rowKeys }),
                            }}
                            dataSource={dataSource}
                            pagination={pagination}
                            onChange={this.onPageChange}
                            // request={this.getTableData}
                            // options={false}
                            bordered
                            dateFormatter="string"
                            columns={columns}
                            actionRef={this.actionRef}
                            formRef={this.formRef}
                            toolBarRender={() => [
                                <Button key="submitBtn" type="primary" htmlType="submit" onClick={this.searchTable}>
                                    查询
                                </Button>,
                                // eslint-disable-next-line react/jsx-no-bind
                                <Button onClick={this.showEditModal.bind(this, null)}>
                                    <Icon antdIcon type="PlusOutlined" />
                                    新建
                                </Button>,
                                // eslint-disable-next-line react/jsx-no-bind
                                <Button onClick={this.batchUpdate.bind(this, selectedRowKeys)}>
                                    <Icon antdIcon type="FormOutlined" />
                                    批量修改
                                </Button>,
                                // eslint-disable-next-line react/jsx-no-bind
                                <Button onClick={this.deleteExperiences.bind(this, selectedRowKeys)}>
                                    <Icon antdIcon type="DeleteOutlined" />
                                    删除
                                </Button>,
                            ]}
                            headerTitle={headerTitle}
                        />
                        {editModalVisible && (
                            <Edit
                                garyType={tabValue}
                                userInfo={this.props.login?.userInfo}
                                regionList={regionList}
                                provinceList={provinceList}
                                handleCancel={this.handleCancel}
                                okCallback={this.okCallback}
                            />
                        )}
                        {editUrlModalVisible && (
                            <EditUrl
                                userInfo={this.props.login?.userInfo}
                                editRow={editRow}
                                editRows={editRows}
                                isBatchUpdate={isBatchUpdate}
                                handleCancel={this.urlHandleCancel}
                                okCallback={this.urlOkCallback}
                            />
                        )}
                    </Card>
                </div>
            </PageContainer>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
