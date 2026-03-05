import React from 'react';
import { Table, Radio, Form, Input, Tooltip, Modal, Icon, Button, Space, message } from 'oss-ui';
import request from '@Common/api';
import { _ } from 'oss-web-toolkits';
import FilterInfo from '@Src/components/filter-info';
import { getInitialProvince } from '../utils';
// import FilterEdit from '@Src/pages/alarm-rule-manage/rule-manage-new/edit';
// import debounce from 'lodash/debounce';
let scrollDiv = null;
export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            filterTypeValue: 1,
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
            columns: props.useNewMonitorView
                ? [
                      {
                          title: '过滤器名称',
                          dataIndex: 'filterName',
                          width: 120,
                      },
                      {
                          title: '创建人',
                          dataIndex: 'creator',
                          width: 100,
                          render: (text) => text || '-',
                      },
                      {
                          title: '创建时间',
                          dataIndex: 'createTime',
                          width: 130,
                      },
                      {
                          title: '列模板',
                          dataIndex: 'columnTemplateId',
                          width: 150,
                          render: (text, row) => {
                              const columnTemplate = _.find(row.filterProperties, (item) => item.key === 'columnTemplateId');
                              return columnTemplate?.valueDesc || '-';
                          },
                      },
                      {
                          title: '状态模板',
                          dataIndex: 'statusTemplateId',
                          width: 150,
                          render: (text, row) => {
                              const statusTemplate = _.find(row.filterProperties, (item) => item.key === 'statusTemplateId');
                              return statusTemplate?.valueDesc || '-';
                          },
                      },
                      {
                          title: '操作',
                          valueType: 'option',
                          dataIndex: 'id',
                          hideInSearch: true,
                          width: 60,
                          render: (text, row) => [
                              <Space>
                                  <Tooltip title="查看">
                                      <Icon antdIcon={true} type="SearchOutlined" onClick={this.showFilterDetail.bind(this, row)} />
                                  </Tooltip>
                                  <Tooltip title="编辑">
                                      <Icon antdIcon={true} type="EditOutlined" onClick={this.showFilterEdit.bind(this, row)} />
                                  </Tooltip>
                              </Space>,
                          ],
                      },
                  ]
                : [
                      //   {
                      //       title: '是否共享',
                      //       dataIndex: 'isPrivate',
                      //       align: 'center',
                      //       width: 80,
                      //       hideInSearch: true,
                      //       render: (text) => {
                      //           return String(text) === '1' ? '是' : '否';
                      //       },
                      //   },
                      //   {
                      //       title: '是否启用',
                      //       dataIndex: 'enable',
                      //       align: 'center',
                      //       width: 80,
                      //       hideInSearch: true,
                      //       render: (text) => {
                      //           return String(text) === '1' ? '是' : '否';
                      //       },
                      //   },
                      {
                          title: '过滤器名称',
                          dataIndex: 'filterName',
                          width: 120,
                      },
                      {
                          title: '创建人',
                          dataIndex: 'creator',
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
        scrollDiv = document.querySelector('#scroll-table-contianer div.oss-ui-table-body');
        scrollDiv.addEventListener('scroll', (e) => {
            this.onScroll(e);
        });

        this.getFilterList({ orderBy: 1 });
        this.getFilterList({ orderBy: 2 });
    }

    onScroll = (event) => {
        const { loading, currentPageSize, currentPage, filterTypeValue, searchKey, currentTotal, searchKeyOhters } = this.state;
        const { clientHeight } = event.target;
        const { scrollHeight } = event.target;
        const { scrollTop } = event.target;
        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;
        if (isBottom && !loading && (filterTypeValue === 1 ? currentPageSize.myPage > 9 : currentPageSize.otherPage > 9)) {
            if (filterTypeValue === 1 ? currentTotal.myTotal <= currentPage.myPage * 10 : currentTotal.ohterToal <= currentPage.otherPage * 10) {
                return;
            }
            this.getFilterList({
                current: filterTypeValue === 1 ? currentPage.myPage + 1 : currentPage.otherPage + 1,
                filterName: filterTypeValue === 1 ? searchKey : searchKeyOhters,
            });
        }
    };

    setRowKeys = (props) => {
        let selectKeys = [];
        if (_.get(props, 'cacheData')) {
            selectKeys = _.get(props, 'cacheData')
                .split(',')
                .map((s) => Number(s));
        } else if (_.get(props, 'rowData.filterIdList')) {
            selectKeys = _.get(props, 'rowData.filterIdList')
                .split(',')
                .map((s) => Number(s));
        }
        return selectKeys;
    };

    refreshFilters = () => {
        const { currentPage, filterTypeValue } = this.state;
        document.querySelector('#scroll-table-contianer div.oss-ui-table-body').scrollTop = 0;
        this.setState(
            {
                [filterTypeValue === 1 ? 'searchKey' : 'searchKeyOhters']: '',
                currentPage: {
                    ...currentPage,
                    [filterTypeValue === 1 ? 'myPage' : 'otherPage']: 1,
                },
                [filterTypeValue === 1 ? 'mine' : 'others']: [],
            },
            () => {
                this.getFilterList();
            },
        );
    };

    // 获取列表
    getFilterList = (params = {}) => {
        const {
            userInfo: { userId },
            login,
        } = this.props;
        const { systemInfo } = login;
        const { selectedRowKeys, currentPage, mine, others, currentPageSize } = this.state;
        let { filterTypeValue } = this.state;
        this.setState({ loading: true });
        const str = selectedRowKeys.join(',');
        // console.log(params);
        if (params.orderBy) {
            filterTypeValue = params.orderBy;
        }
        request('/interruptalarm/filter/v1/filtersToViewSelf', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取过滤器数据失败，请检查服务',
            data: {
                modelId: 2,
                moduleId: 1,
                current: params.current || 1,
                pageSize: 10,
                creator: userId,
                filterIds: (!params.filterName && (params.current === 1 || !params.current) && str) || '',
                filterName: params.filterName,
                ownFlag: filterTypeValue,
                filterProvince: getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
            },
        }).then((res) => {
            if (res.data && _.get(res, 'data', []).length) {
                let filterType = filterTypeValue;
                let filterData = res.data;
                filterData = _.sortBy(filterData, ['createTime']).reverse();
                if (selectedRowKeys && selectedRowKeys.length) {
                    let toEmptyData = [];
                    const toTopData = filterData.filter((item) => selectedRowKeys.includes(item.filterId));

                    toTopData.forEach((item) => {
                        if (!toEmptyData.find((record) => record.filterId === item.filterId)) {
                            toEmptyData.push(item);
                        }
                    });
                    if (filterTypeValue === 1) {
                        toEmptyData = toEmptyData.filter((item) => String(item.creatorId) === userId);
                    } else {
                        toEmptyData = toEmptyData.filter((item) => String(item.creatorId) !== userId);
                    }

                    const otherData = filterData.filter((item) => !selectedRowKeys.includes(item.filterId));
                    if (params.current === 1 || !params.current) {
                        filterData = toEmptyData.concat(otherData);
                        if (params.orderBy) {
                            filterType = _.every(toTopData, (item) => String(item.creatorId) === userId) ? 1 : 2;
                        }
                    } else {
                        filterData = otherData;
                    }
                }
                this.setState(
                    {
                        // fullData: filterTypeValue === 1 ? fullData.concat(filterData) || [],
                        [filterTypeValue === 1 ? 'mine' : 'others']:
                            filterTypeValue === 1
                                ? mine.concat(filterData.filter((item) => !mine.map((items) => items.filterId).includes(item.filterId)))
                                : others.concat(filterData.filter((item) => !others.map((items) => items.filterId).includes(item.filterId))),
                        currentPageSize: {
                            ...currentPageSize,
                            [filterTypeValue === 1 ? 'myPage' : 'otherPage']: res.data.length,
                        },
                        currentPage: {
                            ...currentPage,
                            [filterTypeValue === 1 ? 'myPage' : 'otherPage']: res.current,
                        },
                        currentTotal: {
                            ...currentPage,
                            [filterTypeValue === 1 ? 'myTotal' : 'otherTotal']: res.total,
                        },
                        filterTypeValue: filterType,
                    },
                    () => {
                        // this.setDataByConditions('onInit');
                        this.setState({ loading: false });
                    },
                );
            } else {
                this.setState(
                    {
                        // fullData: filterTypeValue === 1 ? fullData.concat(filterData) || [],
                        [filterTypeValue === 1 ? 'mine' : 'others']: [],
                        currentPageSize: {
                            ...currentPageSize,
                            [filterTypeValue === 1 ? 'myPage' : 'otherPage']: 0,
                        },
                        currentPage: {
                            ...currentPage,
                            [filterTypeValue === 1 ? 'myPage' : 'otherPage']: 1,
                        },
                        currentTotal: {
                            ...currentPage,
                            [filterTypeValue === 1 ? 'myTotal' : 'otherTotal']: 0,
                        },
                    },
                    () => {
                        // this.setDataByConditions('onInit');
                        this.setState({ loading: false });
                    },
                );
            }
        });
    };

    setDataByConditions = (type) => {
        _.debounce(() => {
            const {
                userInfo: { userId },
            } = this.props;
            const { filterTypeValue, fullData, searchKey, selectedRowKeys } = this.state;
            let mine = fullData.filter((item) => String(item.creatorId) === userId);
            let others = fullData.filter((item) => String(item.creatorId) !== userId);
            if (searchKey) {
                mine = mine.filter((item) => item.filterName.indexOf(searchKey) > -1);
                others = others.filter((item) => item.filterName.indexOf(searchKey) > -1);
            }
            let newValue = filterTypeValue;
            if (type === 'onInit') {
                const isInOthers = _.some(selectedRowKeys, (id) => _.find(others, (m) => m.filterId === id));
                const isInMine = _.some(selectedRowKeys, (id) => _.find(mine, (m) => m.filterId === id));
                if (isInOthers && !isInMine) {
                    newValue = 2;
                }
            }
            this.setState({
                mine,
                others,
                fullData,
                filterTypeValue: newValue,
            });
        }, 300)();
    };

    /**
     * 复选框change
     */
    onSelectChange = (id, rows) => {
        if (this.state.selectedRowKeys.length > 20) {
            message.warn('最多选择20个过滤器！');
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
            return row.filterId;
        });
        console.log('this.state.selectedRowKeys', this.state.selectedRowKeys);
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
            selectedRowKeys.push(record.filterId);
        } else {
            selectedRowKeys = _.pull(selectedRowKeys, record.filterId);
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
        // this.setDataByConditions();
    };

    searchKeyChange = (e) => {
        const { filterTypeValue } = this.state;
        this.setState({
            [filterTypeValue === 1 ? 'searchKey' : 'searchKeyOhters']: e.target.value,
        });

        // this.setDataByConditions();
    };
    searchKeySearch = (e) => {
        const { currentPage, filterTypeValue } = this.state;
        this.setState(
            {
                currentPage: {
                    ...currentPage,
                    [filterTypeValue === 1 ? 'myPage' : 'otherPage']: 1,
                },
                [filterTypeValue === 1 ? 'mine' : 'others']: [],
            },
            () => {
                this.getFilterList({ filterName: e });
            },
        );

        // this.setDataByConditions();
    };

    showFilterDetail = (row) => {
        this.setState({ filterDetailVisible: true, selectedFilter: row });
    };

    showFilterEdit = (row) => {
        this.setState({
            filterEditVisible: true,
            editFilterId: row.filterId,
        });
    };

    handleCancel = () => {
        this.setState({ filterDetailVisible: false, selectedFilter: {} });
    };

    render() {
        const { loading, columns, selectedRowKeys, mine, others, filterTypeValue, selectedFilter, filterDetailVisible, searchKey, searchKeyOhters } =
            this.state;
        const { isEdit } = this.props;
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
                disabled: (!isEdit && selectedRowKeys.indexOf(record.filterId) === -1) || record.enable === 2,
                name: record.filterName,
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
                                <Radio value={1}>我的过滤器</Radio>
                                <Radio value={2}>其他人过滤器</Radio>
                            </Radio.Group>
                            <Input.Search
                                style={{ width: 180, margin: '0 50 0 10' }}
                                placeholder="请输入条件"
                                value={filterTypeValue === 1 ? searchKey : searchKeyOhters}
                                onChange={this.searchKeyChange}
                                onSearch={this.searchKeySearch}
                            />
                            <Tooltip title="刷新列表">
                                <Icon style={{ margin: '0 50 0 10' }} antdIcon={true} type="ReloadOutlined" onClick={this.refreshFilters} />
                            </Tooltip>
                        </Space>
                    </Form.Item>
                </div>
                <div id="scroll-table-contianer">
                    <Table
                        loading={loading}
                        dataSource={filterTypeValue === 1 ? mine : others}
                        columns={columns}
                        rowKey="filterId"
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

                <Modal
                    width={'60%'}
                    title="过滤器详情"
                    bodyStyle={{ height: '500px', overflow: 'auto' }}
                    visible={filterDetailVisible}
                    centered
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                    ]}
                >
                    <FilterInfo data={selectedFilter} moduleId={'1'} />
                </Modal>
            </>
        );
    }
}
