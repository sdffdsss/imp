/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-for-in-array */
import React, { Fragment } from 'react';
import { Modal, Form, Radio, Tabs, Table, Select, message, Input, Col, Row } from 'oss-ui';
import CustomModalFooter from '@Src/components/custom-modal-footer';
import request from '@Src/common/api';
import Enums from '@Src/common/enum';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '../../../hox';
import { withModel } from 'hox';
import qs from 'qs';
import './index.less';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.filterType = {};
        this.filterName = {};
        this.state = {
            viewType: 1,
            filterType: 1,
            filterColumns: null,
            loading: true,
            filterData: [],
            ruleData: [],
            viewData: [],
            selectedRows: [],
            selectedRowKeys: [],
            defaultColumn: 0,
            filterPagination: {
                pageSize: 20,
                current: 1,
                total: 0,
            },
            viewPagination: {
                pageSize: 20,
                current: 1,
                total: 0,
            },
            rulePagination: {
                pageSize: 20,
                current: 1,
                total: 0,
            },
            viewFilterLoading: true,
            ruleColumns: [
                {
                    title: '名称',
                    dataIndex: 'filterName',
                    width: 180,
                    ellipsis: true,
                },
                {
                    title: '规则模块',
                    dataIndex: 'moduleId',
                    width: 150,
                    render: (text) => Enums.filterModuleMap.getName(text) || '未知',
                },
                {
                    title: '创建者',
                    dataIndex: 'creator',
                    width: 130,
                    render: (text) => text || '-',
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    width: 180,
                    valueType: 'dateTimeRange',
                    formItemProps: {
                        format: 'YYYY-MM-DD HH:mm:ss',
                        showTime: true,
                    },
                    render: (text) => text || '-',
                },
            ],
            viewColumns: [
                {
                    title: '名称',
                    dataIndex: 'windowName',
                    width: 180,
                    ellipsis: true,
                },
                {
                    title: '创建者',
                    dataIndex: 'userName',
                    width: 180,
                    ellipsis: true,
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    width: 180,
                    ellipsis: true,
                },
            ],
        };

        this.onSearch = _.debounce(this.onSearch.bind(this), 500);
    }

    componentDidMount() {
        // this.getFilters();
        // this.setColumnsModel();
        this.getCustomMonitorViews();
    }

    /**
     * @description: 监听过滤器分页变化
     * @param n*o
     * @return n*o
     */

    onFilterPageChange = (pagination) => {
        const { filterPagination } = this.state;
        this.setState(
            {
                filterPagination: {
                    ...filterPagination,
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                },
                loading: true,
            },
            () => {
                // this.getFilters();
            },
        );
    };

    /**
     * @description: 获取过滤器
     */
    getFilters = () => {
        const { filterPagination } = this.state;
        const {
            login: { userId },
        } = this.props;
        const defaultParam = {
            modelId: 2,
            moduleId: 1,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: 'string',
            }),
            creator: userId,
            current: filterPagination.current,
            pageSize: filterPagination.pageSize,
        };
        const paramData = _.assignIn(defaultParam, this.filterType, this.filterName);
        request(`alarmmodel/filter/v1/filters?${qs.stringify(paramData, { arrayFormat: 'indices', encode: true })}`, {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取过滤器数据失败',
        }).then((res) => {
            this.setState({
                loading: false,
                filterData: res.data || [],
                filterPagination: {
                    ...filterPagination,
                    current: res.current,
                    total: res.total,
                },
            });
        });
    };

    /**
     * @description: 更改过滤器类型
     */
    onFilterTypeChange = (type) => {
        let filterType = {};
        switch (type) {
            case 'ALL':
                filterType = { showType: 2 };
                break;
            case 'MY':
                filterType = { showType: 0 };
                break;
            case 'SHARE':
                filterType = { showType: 1 };
                break;
            default:
                filterType = {};
                break;
        }
        this.setState({ loading: true }, () => {
            this.filterType = filterType;
            // this.getFilters();
            this.getCustomMonitorViews();
        });
    };

    /**
     * @description: 过滤器搜索
     */
    onSearch = (value) => {
        this.setState({ loading: true }, () => {
            this.filterName = { windowName: value };
            this.getCustomMonitorViews();
        });
    };

    /**
     * @description: 设置列
     */
    setColumnsModel = () => {
        Promise.all([this.getAllColumns(), this.getDefaultColumns()]).then((res) => {
            const [allColumns, defaultColumns] = res;
            let defaultColumnModel = 0;
            if (defaultColumns && defaultColumns.data) {
                defaultColumnModel = Number(defaultColumns.data.optionValue);
            }
            this.setState({
                filterColumns: [
                    {
                        title: '名称',
                        dataIndex: 'filterName',
                        width: 180,
                        ellipsis: true,
                    },
                    {
                        title: '创建者',
                        dataIndex: 'creator',
                        width: 130,
                        render: (text, row) => {
                            if (text) {
                                return text;
                            }
                            return row.creator ? row.creator : '-';
                        },
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'modifyTime',
                        width: 180,
                        valueType: 'dateTimeRange',
                        formItemProps: {
                            format: 'YYYY-MM-DD HH:mm:ss',
                            showTime: true,
                        },
                        render: (text, row) => {
                            if (!text) {
                                return text;
                            }
                            return row.createTime ? row.createTime : '-';
                        },
                    },
                    {
                        title: '选择模板',
                        dataIndex: 'createTime',
                        width: 180,
                        render: (text, record) => {
                            return (
                                <Fragment>
                                    <Select
                                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        showSearch
                                        style={{ width: 150 }}
                                        onChange={(value, option) => this.onColumnModelChange(value, option, record)}
                                        defaultValue={defaultColumnModel}
                                    >
                                        {allColumns.data &&
                                            allColumns.data.map((item) => {
                                                return (
                                                    <Select.Option value={item.templateId} key={item.templateId}>
                                                        {item.templateName}
                                                    </Select.Option>
                                                );
                                            })}
                                    </Select>
                                </Fragment>
                            );
                        },
                    },
                ],
                defaultColumn: defaultColumnModel,
            });
        });
    };

    /**
     * @description: 列模版变更
     */
    onColumnModelChange(model, option, record) {
        const { filterData, selectedRows } = this.state;
        const newFilterData = _.cloneDeep(filterData);
        const newSelectedRows = _.cloneDeep(selectedRows);
        _.find(newFilterData, { filterId: record.filterId }).colDispTemplet = model;
        _.find(newSelectedRows, { filterId: record.filterId }).colDispTemplet = model;

        this.setState({
            filterData: newFilterData,
            selectedRows: newSelectedRows,
        });
    }

    /**
     * @description: 获取全量列模版
     */
    getAllColumns = () => {
        const {
            login: { userId },
        } = this.props;
        return request('v1/template/alarm-column', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: { current: 1, pageSize: 999999, userId },
            // 是否需要显示失败消息提醒
            showErrorMessage: '获取默认列模板失败',
            showSuccessMessage: false,
        });
    };

    /**
     * @description: 获取默认列模版
     */
    getDefaultColumns = () => {
        const {
            login: { userName, userId },
        } = this.props;
        const queryParam = {
            optionKey: `${encodeURI(userName)}.AlarmBandColumntemplate`,
            userId,
        };
        return request('v1/template/search-alarm-column', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示失败消息提醒
            showErrorMessage: '获取默认列模板失败',
            showSuccessMessage: false,
        });
    };

    /**
     * @description: 监听监控视图分页
     * @param n*o
     * @return n*o
     */

    onViewPageChange = (pagination) => {
        const { viewPagination } = this.state;
        this.setState(
            {
                viewPagination: {
                    ...viewPagination,
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                },
                viewFilterLoading: true,
            },
            () => {
                this.getCustomMonitorViews();
            },
        );
    };

    /**
     * @description: 获取自定义视图
     */
    getCustomMonitorViews = () => {
        const { viewPagination } = this.state;
        const {
            login: { userId, systemInfo, userInfo },
        } = this.props;
        const info = JSON.parse(userInfo);
        let zoneId = systemInfo.currentZone?.zoneId || info?.zones[0]?.zoneId;
        if (!systemInfo?.currentZone?.zoneId && info?.zones[0]?.zoneLevel === '3') {
            zoneId = info?.zones[0]?.parentZoneId;
        }
        const param = zoneId ? { viewProvince: zoneId } : {};
        request('v1/monitor-view', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: {
                current: viewPagination.current,
                pageSize: viewPagination.pageSize,
                userId,
                // 0:当班窗口
                // 1:自定义窗口
                // 2:全部窗口
                windowType: '1',
                showType: '2',
                ...this.filterType,
                ...this.filterName,
                ...param,
                ifUsed: 1,
                needWebSocketUrl: true,
            },
            // 是否需要显示失败消息提醒
            showErrorMessage: '获取自定义视图失败',
            showSuccessMessage: false,
        })
            .then((res) => {
                this.setState({
                    viewData: res.data || [],
                    viewPagination: {
                        ...viewPagination,
                        total: res.total,
                    },
                    loading: false,
                });
            })
            .catch(() => {
                this.setState({
                    viewData: [],

                    loading: false,
                });
            });
    };

    /**
     * @description: 监听分页变化
     * @param n*o
     * @return n*o
     */

    onRulePageChange = (pagination) => {
        const { rulePagination } = this.state;
        this.setState(
            {
                rulePagination: {
                    ...rulePagination,
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                },
                loading: true,
            },
            () => {
                this.getRuleData();
            },
        );
    };

    /**
     * @description: 获取除过滤器外所有规则
     */
    getRuleData = () => {
        const { rulePagination } = this.state;
        const {
            login: { userId },
        } = this.props;
        request(
            `alarmmodel/filter/v1/rules?${qs.stringify(
                {
                    modelId: 2,
                    clientRequestInfo: JSON.stringify({
                        clientRequestId: 'nomean',
                        clientToken: 'string',
                    }),
                    creator: userId,
                    current: rulePagination.current,
                    pageSize: rulePagination.pageSize,
                },
                { arrayFormat: 'indices', encode: true },
            )}`,
            {
                type: 'get',
                baseUrlType: 'filterUrl',
                showSuccessMessage: false,
                defaultErrorMessage: '获取数据失败',
            },
        ).then((res) => {
            this.setState({
                loading: false,
                ruleData: res.data,
                rulePagination: {
                    ...rulePagination,
                    total: res.total,
                },
            });
        });
    };

    /**
     * @description: 过滤器和规则选择弹窗的模式切换
     */
    onViewTypeChange = (e) => {
        this.setState({
            viewType: e.target.value,
            filterType: 1,
        });
    };

    /**
     * @description: 窗口打开方式
     */
    onFilterIdChange = (e) => {
        this.setState({
            filterType: e.target.value,
        });
    };

    /**
     * @description:过滤器选择
     */
    onSelectChanges = (record) => {
        const { selectedRowKeys, selectedRows } = this.state;
        const newSelectedRowKeys = [...selectedRowKeys];
        const newSelectedRows = [...selectedRows];
        if (newSelectedRowKeys.includes(record.windowId)) {
            _.pull(newSelectedRowKeys, record.windowId);
            _.pull(newSelectedRows, record);
        } else {
            newSelectedRowKeys.push(record.windowId);
            newSelectedRows.push(record);
        }

        this.setState({
            selectedRowKeys: newSelectedRowKeys,
            selectedRows: newSelectedRows,
        });
    };

    /**
     * @description: 选择监控视图
     * @param {*} type 视图展示方式  vertical: 垂直 horizontal: 水平 flowlayout：平铺 fullscreen：全屏
     * @return {*}
     */
    onMonitorViewsChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows,
        });
    };

    /**
     * @description:过滤器和规则选择弹窗过滤器类型切换
     */
    // onTabChange = (activeKey) => {
    //     this.setState({ loading: true });
    //     if (activeKey === 'filter') {
    //         this.getFilters();
    //     } else {
    //         this.getRuleData();
    //     }
    // };

    /**
     * @description:取消
     */
    onCancel = () => {
        this.setState(
            {
                selectedRowKeys: [],
            },
            () => {
                this.props.onCancel();
            },
        );
    };

    /**
     * @description:确定
     */
    onOk = () => {
        const { selectedRows, selectedRowKeys, defaultColumn } = this.state;

        if (selectedRowKeys.length === 0) {
            message.error('请选择视图');
            return;
        }

        if (selectedRowKeys.length > 6) {
            message.warning('最多选择6个视图');
            return;
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const i in selectedRows) {
            if (selectedRows[i].colDispTemplet === '' || !selectedRows[i].colDispTemplet) {
                selectedRows[i].colDispTemplet = defaultColumn;
            }
        }

        let newSelectedRows = [];

        // if (viewType === 1) {
        //     if (filterType === 1) {
        //         const filterId = [];
        //         const filterName = '自定义监控视图';
        //         const colunmsModelIds = [];
        //         const filterNameList = [];
        //         selectedRows.forEach((item) => {
        //             filterId.push(item.filterId);
        //             filterNameList.push(item.filterName);
        //             if (!colunmsModelIds.includes(item.colDispTemplet)) {
        //                 colunmsModelIds.push(item.colDispTemplet);
        //             }
        //         });
        //         if (colunmsModelIds.length === 1) {
        //             newSelectedRows.push({
        //                 filterName,
        //                 filterId,
        //                 filterNameList,
        //                 colDispTemplet: colunmsModelIds[0]
        //             });
        //             this.props.onOk(newSelectedRows);
        //         } else {
        //             Modal.confirm({
        //                 title: '提示',
        //                 content: '选择的列模版不同，将使用第一条列模版配置，是否确认？',
        //                 onOk: () => {
        //                     newSelectedRows.push({
        //                         filterName,
        //                         filterId,
        //                         filterNameList,
        //                         colDispTemplet: colunmsModelIds[0]
        //                     });
        //                     this.props.onOk(newSelectedRows);
        //                 }
        //             });
        //         }
        //     } else {
        //         newSelectedRows = [...selectedRows];
        //         this.props.onOk(newSelectedRows);
        //     }
        // } else {
        selectedRows.forEach((item) => {
            item.filterName = item.windowName;
            item.filterId = item.filterIdList;
        });
        newSelectedRows = [...selectedRows];
        this.props.onOk(newSelectedRows);
        // }
    };

    render() {
        const {
            // viewType,
            // filterType,
            loading,
            // filterData,
            // ruleData,
            viewData,
            // filterColumns,
            selectedRowKeys,
            // ruleColumns,
            viewColumns,
            // filterPagination,
            viewPagination,
            // viewFilterLoading
            // rulePagination
        } = this.state;
        const { container } = this.props;
        return (
            <Modal
                destroyOnClose
                maskClosable={false}
                width={900}
                visible={true}
                title="视图选择"
                getContainer={container}
                onCancel={this.onCancel}
                footer={<CustomModalFooter onCancel={this.onCancel} onOk={this.onOk} />}
                className="unicom-spaicing-style"
            >
                {/* <Form size="small" labelAlign="left">
                    <Row>
                        <Col span={12}>
                            <Form.Item label="视图类型">
                                <Radio.Group onChange={this.onViewTypeChange} value={viewType}>
                                    <Radio value={1}>新建临时视图</Radio>
                                    <Radio value={2}>选择已有视图</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {viewType === 1 && (
                                <Form.Item label="窗口打开方式">
                                    <Radio.Group onChange={this.onFilterIdChange} value={filterType}>
                                        <Radio value={1}>单窗口打开多过滤器</Radio>
                                        <Radio value={2}>单视图打开多流水窗</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            )}
                        </Col>
                    </Row>
                </Form> */}
                <div className="custom-window-modal-tool-dom">
                    <div>
                        <Select defaultValue="ALL" onChange={this.onFilterTypeChange}>
                            <Select.Option key="ALL">所有视图</Select.Option>
                            <Select.Option key="MY">我的视图</Select.Option>
                            <Select.Option key="SHARE">共享视图</Select.Option>
                        </Select>
                    </div>
                    <div className="custom-window-modal-tool-dom-right">
                        <label className="custom-window-modal-tool-dom-right-label">查找：</label>
                        <Input.Search placeholder="请输入条件" allowClear onSearch={this.onSearch} />
                    </div>
                </div>
                <Table
                    rowSelection={{
                        selectedRowKeys,
                        onSelect: this.onSelectChanges,
                    }}
                    scroll={{ y: 350 }}
                    rowKey="windowId"
                    bordered
                    rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                    columns={viewColumns}
                    size="small"
                    dataSource={viewData.filter((item) => item.ifUsed)}
                    pagination={viewPagination}
                    onChange={this.onViewPageChange}
                    loading={loading}
                />
                {/* {viewType === 1 && (
                    <Tabs defaultActiveKey="filter" onChange={this.onTabChange}>
                        <Tabs.TabPane tab="监控过滤器" key="filter">
                            <div className="custom-window-modal-tool-dom">
                                <div>
                                    <Select defaultValue="ALL" onChange={this.onFilterTypeChange}>
                                        <Select.Option key="ALL">所有过滤器</Select.Option>
                                        <Select.Option key="MY">我的过滤器</Select.Option>
                                        <Select.Option key="SHARE">共享过滤器</Select.Option>
                                    </Select>
                                </div>
                                <div className="custom-window-modal-tool-dom-right">
                                    <label className="custom-window-modal-tool-dom-right-label">查找：</label>
                                    <Input.Search placeholder="请输入条件" onSearch={this.onSearch} />
                                </div>
                            </div>
                            <Table
                                rowSelection={{ selectedRowKeys, onSelect: this.onSelectChanges }}
                                scroll={{ y: 350 }}
                                rowKey="filterId"
                                bordered
                                rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                                columns={filterColumns}
                                size="small"
                                loading={loading}
                                dataSource={filterData}
                                pagination={filterPagination}
                                onChange={this.onFilterPageChange}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="规则过滤器" key="rule">
                            <Table
                                rowSelection={{ selectedRowKeys, onSelect: this.onSelectChanges }}
                                scroll={{ y: 350 }}
                                rowKey="filterId"
                                bordered
                                rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                                columns={ruleColumns}
                                size="small"
                                loading={loading}
                                dataSource={ruleData}
                                pagination={rulePagination}
                                onChange={this.onRulePageChange}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                )}
                {viewType === 2 && (
                    <Table
                        rowSelection={{
                            selectedRowKeys,
                            onChange: this.onMonitorViewsChange
                        }}
                        scroll={{ y: 350 }}
                        rowKey="windowId"
                        bordered
                        rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                        columns={viewColumns}
                        size="small"
                        dataSource={viewData.filter((item) => item.ifUsed)}
                        pagination={viewPagination}
                        onChange={this.onViewPageChange}
                        loading={viewFilterLoading}
                    />
                )} */}
            </Modal>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
