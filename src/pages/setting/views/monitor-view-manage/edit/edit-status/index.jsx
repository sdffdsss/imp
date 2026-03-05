import React from 'react';
import { Table, Radio, Form, Input, Tooltip, Icon } from 'oss-ui';
import './index.less';
// import getData from '@Common/services/dataService';
import { _ } from 'oss-web-toolkits';
import Search from '../../../status-manager/search';
import request from '@Src/common/api';
import { getInitialProvince } from '../utils'

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            templateTypeValue: 0,
            searchKey: '',
            selectedRowKeys: this.setRowKeys(props),
            name: '',
            mine: [],
            mineData: [],
            all: [],
            fullData: [],
            loading:false,
            searchVisible: false,
            selectedRow: {},
            columns: [
                {
                    title: '模板名称',
                    dataIndex: 'templateName',
                    width: 80
                },
                {
                    title: '描述',
                    dataIndex: 'description',
                    ellipsis: true,
                    width: 150
                },
                {
                    title: '创建人',
                    dataIndex: 'userName',
                    width: 80
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    width: 150
                },
                {
                    title: '操作',
                    valueType: 'option',
                    dataIndex: 'id',
                    hideInSearch: true,
                    width: 50,
                    render: (text, row) => [
                        <Tooltip title="查看">
                            <Icon antdIcon={true} type="SearchOutlined" onClick={this.showIconDetail.bind(this, row)} />
                        </Tooltip>
                    ]
                }
            ]
        };
    }

    componentDidMount() {
        const scrollDiv = document.querySelector('#scroll-table-contianer div.oss-ui-table-body')
        scrollDiv.addEventListener('scroll',(e)=>{
            this.onScroll(e)
        })
        this.getAlarmStatusData();
    }

    onScroll = event => {
        const { loading, currentPageSize, currentPage, templateTypeValue, searchKey } = this.state;
        const { clientHeight } = event.target;
        const { scrollHeight } = event.target;
        const { scrollTop } = event.target;
        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;
        if (isBottom && !loading && currentPageSize > 9) {
          
          this.getAlarmStatusData({ current: currentPage + 1 });
        }
      }

    setRowKeys = (props) => {
        let selectKeys = [];
        if (_.get(props, 'cacheData') || _.get(props, 'cacheData') === 0) {
            selectKeys = [Number(_.get(props, 'cacheData'))];
        } else if (_.get(props, 'rowData.statusDispTemplet') || _.get(props, 'rowData.statusDispTemplet') === 0) {
            selectKeys = _.get(props, 'rowData.statusDispTemplet')
                .split(',')
                .map((s) => Number(s));
        }
        return selectKeys;
    };

    getAlarmStatusData(params={}) {
        const {
            userInfo: { userName },
            login
        } = this.props;
        const { systemInfo } = login
        const { fullData, templateTypeValue, mineData, searchKey } = this.state
        const queryParam = {
            current: params.current || 1,
            pageSize: 10,
            userId: this.props.userInfo.userId,
            showType: templateTypeValue === 0 ? 0 : 1,
            templateName: params.templateName || searchKey,
            statusProvince:getInitialProvince(
                systemInfo?.currentZone?.zoneId,
                login.userInfo
              )
        };
        this.setState({ loading: true });
        request('v1/template/status-icon', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示失败消息提醒
            showErrorMessage: true
        }).then((res) => {
            if (res && res.data && templateTypeValue === 0) {
                this.setState(
                    {
                        mineData: _.sortBy(mineData.concat(res.data), ['createTime']).reverse(),
                        currentPageSize: res.data?.length,
                        currentPage: res.current
                    },
                    () => {
                        this.setState({ loading: false });
                    }
                );
            } else {
                this.setState(
                    {
                        fullData: _.sortBy(fullData.concat(res.data), ['createTime']).reverse(),
                        currentPageSize: res.data?.length,
                        currentPage: res.current
                    },
                    () => {
                        this.setState({ loading: false });
                    }
                );
            }
        });
    }

    setDataByConditions = (type) => {
        _.debounce(() => {
            const {
                userInfo: { userId }
            } = this.props;
            const { templateTypeValue, fullData, searchKey, selectedRowKeys } = this.state;
            let mine = fullData.filter((item) => String(item.ownerId) === String(userId));
            let all = fullData;
            if (searchKey) {
                mine = mine.filter((item) => item.templateName.indexOf(searchKey) > -1);
                all = fullData.filter((item) => item.templateName.indexOf(searchKey) > -1);
            }
            let newValue = templateTypeValue;
            if (type === 'onInit') {
                if (
                    _.some(selectedRowKeys, (id) => _.find(all, (m) => String(m.templateId) === String(id))) &&
                    !_.some(selectedRowKeys, (id) => _.find(mine, (m) => String(m.templateId) === String(id)))
                ) {
                    newValue = 1;
                }
            }
            this.setState({
                mine,
                all,
                fullData,
                templateTypeValue: newValue
            });
        }, 300)();
    };

    /**
     * radio change
     */
    onSelectChange = (id, rows) => {
        let selectedRowKeys = [];

        selectedRowKeys = rows.map((row) => {
            return row.templateId;
        });

        this.setState({
            selectedRowKeys
        });

        this.props.onDataChange(selectedRowKeys);
    };

    /**
     * 复选框selected
     */
    onSelect = (record, selected, selectedRows) => {
        this.setState({
            rowData: selectedRows
        });
    };

    onSelectAll = (id, rows) => {
        let selectedRowKeys = [];

        selectedRowKeys = rows.map((row) => {
            return row.templateId;
        });

        this.setState({
            selectedRowKeys
        });
    };

    onTemplateTypeChange = (e) => {
        this.templateTypeChange(e.target.value);
    };

    templateTypeChange = (templateTypeValue) => {
        const { fullData, mineData } = this.state
        this.setState(
            {
                templateTypeValue,
                searchKey: '',
                fullData:[],
                mineData:[]
            },
            () => {
                if (fullData.length === 0 || mineData.length === 0) {
                    this.getAlarmStatusData({ current: 1 })
                }

            }
        );
    };

    searchKeyChange = (e) => {
        this.setState(
            {
                searchKey: e.target.value,
            },
        );
    };

    searchKey = (e) => {
        this.setState(
            {
                mineData: [],
                fullData: []
            },
            ()=>{
                this.getAlarmStatusData({ templateName: e})
            }
        );
    }

    showIconDetail = (row) => {
        this.setState({
            searchVisible: true,
            selectedRow: row
        });
    };

    render() {
        const { columns, selectedRowKeys, templateTypeValue, mine, all, searchVisible, selectedRow, loading, fullData, mineData } = this.state;
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
            type: 'radio',
            getCheckboxProps: (record) => ({
                disabled: !isEdit && selectedRowKeys.indexOf(record.templateId) === -1,
                name: record.templateName
            })
        };

        return (
            <>
                <div>
                    <Form.Item name="filterType" label="">
                        <Radio.Group onChange={this.onTemplateTypeChange} value={this.state.templateTypeValue} style={{ lineHeight: '32px' }}>
                            <Radio value={0}>我的模板</Radio>
                            <Radio value={1}>全部模板</Radio>
                        </Radio.Group>

                        <Input.Search
                            style={{ width: 180, margin: '0 50 0 10' }}
                            placeholder="请输入模板名称"
                            value={this.state.searchKey}
                            onSearch={(e)=>{
                                this.searchKey(e)
                            }}
                            onChange={this.searchKeyChange}
                        />
                    </Form.Item>
                </div>
                <div id='scroll-table-contianer'>
                  <Table
                    dataSource={templateTypeValue === 0 ? mineData : fullData}
                    columns={columns}
                    loading={loading}
                    rowKey="templateId"
                    scroll={{ x: xWidth, y: scrollY }}
                    dateFormatter="string"
                    size="small"
                    pagination={false}
                    rowSelection={rowSelection}
                    rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                  />
                </div>
                {searchVisible && (
                    <Search
                        visible={searchVisible}
                        statusValue={selectedRow.statusValue}
                        onChange={() => {
                            this.setState({
                                searchVisible: false,
                                selectedRow: {}
                            });
                        }}
                    />
                )}
            </>
        );
    }
}