import React from 'react';
import { Table, Radio, Form, Input, Tooltip, Icon, Space, message } from 'oss-ui';
import request from '@Common/api';
import { _ } from 'oss-web-toolkits';
import Edit from '../../edit';
import { getInitialProvince } from '../utils';
// import debounce from 'lodash/debounce';
let scrollDiv = null;
export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            filterTypeValue: 0,
            searchKey: '',
            searchKeyOhters: '',
            selectedRowKeys: this.setRowKeys(props) || [],
            mine: [],
            others: [],
            fullData: [],
            selectedFilter: {},
            filterDetailVisible: false,
            filterEditVisible: false,
            editFilterId: '',
            loading: false,
            currentPage: { myPage: 1, otherPage: 1 },
            currentPageSize: { myPage: 10, otherPage: 10 },
            currentTotal: { myTotal: 0, otherTotal: 0 },
            columns: [
                {
                    title: '是否共享',
                    dataIndex: 'windowAttribute',
                    align: 'center',
                    width: 80,
                    hideInSearch: true,
                    render: (text) => {
                        return text === '0' ? '是' : '否';
                    },
                },
                {
                    title: '是否启用',
                    dataIndex: 'ifUsed',
                    align: 'center',
                    width: 80,
                    hideInSearch: true,
                    render: (text) => {
                        return String(text) === '1' ? '是' : '否';
                    },
                },
                {
                    title: '视图名称',
                    dataIndex: 'windowName',
                    width: 120,
                },
                {
                    title: '创建人',
                    dataIndex: 'userName',
                    width: 100,
                    render: (text) => text || '-',
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    width: 130,
                },
                {
                    title: '操作',
                    valueType: 'option',
                    dataIndex: 'id',
                    hideInSearch: true,
                    width: 50,
                    render: (text, row) => [
                        <Tooltip title="查看">
                            <Icon antdIcon={true} type="SearchOutlined" onClick={this.showFilterDetail.bind(this, row)} />
                        </Tooltip>,
                    ],
                },
            ],
        };
        // this.getFilterList = _.debounce(this.getFilterList, 300);
    }

    componentDidMount() {
        scrollDiv = document.querySelector('#scroll-table-contianer1 div.oss-ui-table-body');
        scrollDiv.addEventListener('scroll', (e) => {
            this.onScroll(e);
        });

        this.getFilterList({ orderBy: 0 });
        this.getFilterList({ orderBy: 1 });
    }

    onScroll = (event) => {
        const { loading, currentPageSize, currentPage, filterTypeValue, searchKey, currentTotal } = this.state;
        const { clientHeight } = event.target;
        const { scrollHeight } = event.target;
        const { scrollTop } = event.target;
        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;
        if (isBottom && !loading && searchKey === '' && (filterTypeValue === 0 ? currentPageSize.myPage > 9 : currentPageSize.otherPage > 9)) {
            if (filterTypeValue === 0 ? currentTotal.myTotal <= currentPage.myPage * 10 : currentTotal.ohterToal <= currentPage.otherPage * 10) {
                return;
            }
            this.getFilterList({
                current: filterTypeValue === 0 ? currentPage.myPage + 1 : currentPage.otherPage + 1,
            });
        }
    };

    setRowKeys = (props) => {
        let selectKeys = [];
        if (_.get(props, 'rowData.customWindowIdList')) {
            selectKeys = _.get(props, 'rowData.customWindowIdList').map((s) => Number(s));
        }
        this.props.onDataChange(selectKeys);
        return selectKeys;
    };

    refreshFilters = () => {
        const { currentPage, filterTypeValue } = this.state;
        document.querySelector('#scroll-table-contianer1 div.oss-ui-table-body').scrollTop = 0;
        this.setState(
            {
                [filterTypeValue === 0 ? 'searchKey' : 'searchKeyOhters']: '',
                currentPage: {
                    ...currentPage,
                    [filterTypeValue === 0 ? 'myPage' : 'otherPage']: 1,
                },
                [filterTypeValue === 0 ? 'mine' : 'others']: [],
            },
            () => {
                this.getFilterList();
            }
        );
    };

    // 获取列表
    getFilterList = (params = {}) => {
        const {
            userInfo: { userId },
            login,
        } = this.props;
        const { systemInfo } = login;
        const { selectedRowKeys, currentPage, mine, others, currentPageSize, currentTotal } = this.state;
        let { filterTypeValue } = this.state;
        this.setState({ loading: true });
        const str = selectedRowKeys.join(',');
        // console.log(params);
        if (params.orderBy) {
            filterTypeValue = params.orderBy;
        }
        const param = {
            current: params.current || 1,
            pageSize: 10,
            windowType: 1,
            userId,
            windowName: params.filterName,
            showType: filterTypeValue,
            windowIds: (!params.filterName && (params.current === 1 || !params.current) && str) || '',
            ifUsed: 1,
            windowAttribute: filterTypeValue === 0 ? '' : '1',
            viewProvince: getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
        };
        if (filterTypeValue === 0) {
            delete param.windowAttribute;
        }
        request('v1/monitor-view', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            showSuccessMessage: false,
            defaultErrorMessage: true,
            data: param,
        }).then((res) => {
            if (res.data && _.get(res, 'data', []).length) {
                let filterType = filterTypeValue;
                let filterData = res.data;
                filterData = _.sortBy(filterData, ['createTime']).reverse();
                if (selectedRowKeys && selectedRowKeys.length) {
                    let toEmptyData = [];
                    const toTopData = filterData.filter((item) => selectedRowKeys.includes(item.windowId));

                    toTopData.forEach((item) => {
                        if (!toEmptyData.find((record) => record.windowId === item.windowId)) {
                            toEmptyData.push(item);
                        }
                    });
                    if (filterTypeValue === 0) {
                        toEmptyData = toEmptyData.filter((item) => String(item.userId) === userId);
                    } else {
                        toEmptyData = toEmptyData.filter((item) => String(item.userId) !== userId);
                    }

                    const otherData = filterData.filter((item) => !selectedRowKeys.includes(item.windowId));
                    if (params.current === 1 || !params.current) {
                        filterData = toEmptyData.concat(otherData);
                        if (params.orderBy) {
                            filterType = _.every(toTopData, (item) => String(item.userId) === userId) ? 0 : 1;
                        }
                    } else {
                        filterData = otherData;
                    }
                }
                this.setState(
                    {
                        // fullData: filterTypeValue === 1 ? fullData.concat(filterData) || [],
                        [filterTypeValue === 0 ? 'mine' : 'others']: filterTypeValue === 0 ? mine.concat(filterData) : others.concat(filterData),
                        currentPageSize: {
                            ...currentPageSize,
                            [filterTypeValue === 0 ? 'myPage' : 'otherPage']: res.data.length,
                        },
                        currentPage: {
                            ...currentPage,
                            [filterTypeValue === 0 ? 'myPage' : 'otherPage']: res.current,
                        },
                        currentTotal: {
                            ...currentPage,
                            [filterTypeValue === 0 ? 'myTotal' : 'otherTotal']: res.total,
                        },
                        filterTypeValue: filterType,
                    },
                    () => {
                        this.setState({ loading: false });
                    }
                );
            } else {
                this.setState(
                    {
                        // fullData: filterTypeValue === 1 ? fullData.concat(filterData) || [],
                        [filterTypeValue === 0 ? 'mine' : 'others']: [],
                        currentPageSize: {
                            ...currentPageSize,
                            [filterTypeValue === 0 ? 'myPage' : 'otherPage']: 0,
                        },
                        currentPage: {
                            ...currentPage,
                            [filterTypeValue === 0 ? 'myPage' : 'otherPage']: 1,
                        },
                        currentTotal: {
                            ...currentPage,
                            [filterTypeValue === 0 ? 'myTotal' : 'otherTotal']: 0,
                        },
                    },
                    () => {
                        this.setState({ loading: false });
                    }
                );
            }
        });
    };

    /**
     * 复选框change
     */
    onSelectChange = (id, rows) => {
        if (this.state.selectedRowKeys.length > 6) {
            message.warn('最多选择6个视图！');
            return;
        }
        const { useNewMonitorView } = this.props;
        let selectedRowKeys = [];
        if (useNewMonitorView) {
            if (
                _.find(rows, (item) => !_.find(item.filterProperties || [], (s) => s.key === 'columnTemplateId')) ||
                _.find(rows, (item) => !_.find(item.filterProperties || [], (s) => s.key === 'statusTemplateId'))
            ) {
                return;
            }
        }
        selectedRowKeys = rows.map((row) => {
            return row.windowId;
        });

        selectedRowKeys = [...new Set(selectedRowKeys.concat(this.state.selectedRowKeys))];

        this.setState({
            selectedRowKeys,
        });
        this.props.onDataChange(selectedRowKeys);
    };

    /**
     * 复选框selected
     */
    onSelect = (record, selected) => {
        let { selectedRowKeys } = this.state;
        const { useNewMonitorView } = this.props;
        if (selected) {
            if (useNewMonitorView) {
                if (
                    !_.find(record.filterProperties || [], (s) => s.key === 'columnTemplateId') ||
                    !_.find(record.filterProperties || [], (s) => s.key === 'statusTemplateId')
                ) {
                    message.warn('过滤器未绑定列模板或状态模板信息，请检查或手动刷新列表后重试！');
                    return;
                }
            }
            selectedRowKeys.push(record.windowId);
        } else {
            selectedRowKeys = _.pull(selectedRowKeys, record.windowId);
        }
        this.setState({
            selectedRowKeys,
        });
    };

    onFilterTypeChange = (e) => {
        this.filterTypeChange(e.target.value);
    };

    filterTypeChange = (filterTypeValue) => {
        scrollDiv.scrollTop = 0;
        this.setState({
            filterTypeValue,
            // searchKey: ''
        });
    };

    searchKeyChange = (e) => {
        const { filterTypeValue } = this.state;
        this.setState({
            [filterTypeValue === 0 ? 'searchKey' : 'searchKeyOhters']: e.target.value,
        });
    };
    searchKeySearch = (e) => {
        const { currentPage, filterTypeValue } = this.state;
        this.setState(
            {
                currentPage: {
                    ...currentPage,
                    [filterTypeValue === 0 ? 'myPage' : 'otherPage']: 1,
                },
                [filterTypeValue === 0 ? 'mine' : 'others']: [],
            },
            () => {
                this.getFilterList({ filterName: e });
            }
        );
    };

    showFilterDetail = (row) => {
        this.setState({ filterDetailVisible: true, selectedFilter: row });
    };

    showFilterEdit = (row) => {
        this.setState({
            filterEditVisible: true,
            editFilterId: row.windowId,
        });
    };

    handleCancel = () => {
        this.setState({ filterDetailVisible: false, selectedFilter: {} });
    };

    switchSearchVisble = (visible) => {
        this.setState({
            filterDetailVisible: visible,
        });
    };

    render() {
        const {
            loading,
            columns,
            selectedRowKeys,
            mine,
            others,
            filterTypeValue,
            selectedFilter,
            filterDetailVisible,
            filterEditVisible,
            editFilterId,
            searchKey,
            searchKeyOhters,
        } = this.state;
        const { isEdit, userInfo } = this.props;
        const xWidth = columns.reduce((total, item) => {
            return total + item.width;
        }, 0);
        const scrollY = 260;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelect,
            onSelectAll: this.onSelectAll,
            getCheckboxProps: (record) => ({
                disabled: (!isEdit && selectedRowKeys.indexOf(record.windowId) === -1) || record.enable === 2,
                name: record.windowName,
            }),
            columnTitle: ' ',
            hideDefaultSelections: true,
        };

        return (
            <>
                <div>
                    <Form.Item name="filterType">
                        <Space>
                            <Radio.Group onChange={this.onFilterTypeChange} value={this.state.filterTypeValue} style={{ lineHeight: '32px' }}>
                                <Radio value={0}>我的视图</Radio>
                                <Radio value={1}>其他人视图</Radio>
                            </Radio.Group>
                            <Input.Search
                                style={{ width: 180, margin: '0 50 0 10' }}
                                placeholder="请输入条件"
                                value={filterTypeValue === 0 ? searchKey : searchKeyOhters}
                                onChange={this.searchKeyChange}
                                onSearch={this.searchKeySearch}
                            />
                            <Tooltip title="刷新列表">
                                <Icon style={{ margin: '0 50 0 10' }} antdIcon={true} type="ReloadOutlined" onClick={this.refreshFilters} />
                            </Tooltip>
                        </Space>
                    </Form.Item>
                </div>
                <div id="scroll-table-contianer1">
                    <Table
                        loading={loading}
                        dataSource={filterTypeValue === 0 ? mine : others}
                        columns={columns}
                        rowKey="windowId"
                        bordered
                        // onSubmit={this.onSubmit}
                        scroll={{ x: xWidth, y: scrollY }}
                        dateFormatter="string"
                        size="small"
                        pagination={false}
                        onChange={(e) => {
                            console.log(e);
                        }}
                        rowSelection={rowSelection}
                        rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                    />
                </div>
                {filterDetailVisible && (
                    <Edit
                        visible={filterDetailVisible}
                        rowData={selectedFilter}
                        windowType={1}
                        // userName={userName}
                        // userId={userId}
                        login={this.props.login}
                        userInfo={userInfo}
                        unicomFlag={1}
                        visibleChange={this.switchSearchVisble}
                    />
                )}
            </>
        );
    }
}
