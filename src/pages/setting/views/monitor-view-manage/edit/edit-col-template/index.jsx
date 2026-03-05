import React from 'react';
import { Table, Radio, Form, Input, message, Tooltip, Icon } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import request from '@Src/common/api';
import CheckSelectTemplate from '../../../col-template/alarm-col-template/check-alarm-column';
import { getInitialProvince } from '../utils';
import { logNew } from '@Common/api/service/log';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            templateTypeValue: 0,
            searchKey: '',
            selectedRowKeys: this.setRowKeys(props),
            gender: undefined,
            name: '',
            mine: [],
            mineData: [],
            all: [],
            fullData: [],
            EditingFilterInfo: null,
            loading: false,
            columnTemplateVisible: false,
            editRow: null,
            columns: [
                {
                    title: '模板名称',
                    dataIndex: 'templateName',
                    width: 160,
                },
                {
                    title: '描述',
                    dataIndex: 'description',
                    ellipsis: true,
                    width: 150,
                },
                {
                    title: '创建人',
                    dataIndex: 'userName',
                    width: 80,
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    width: 150,
                },
                {
                    title: '操作',
                    valueType: 'option',
                    dataIndex: 'id',
                    hideInSearch: true,
                    width: 50,
                    render: (text, row) => [
                        <Tooltip title="查看">
                            <Icon antdIcon type="SearchOutlined" onClick={this.columnTemplateShowModal.bind(this, row)} />
                        </Tooltip>,
                    ],
                },
            ],
        };
    }

    componentDidMount() {
        const scrollDiv = document.querySelector('#scroll-table-contianer div.oss-ui-table-body');
        scrollDiv.addEventListener('scroll', (e) => {
            this.onScroll(e);
        });
        this.getAlarmColumnData();
    }

    columnTemplateShowModal = async (row) => {
        logNew('列模板查看', '500099');
        this.setState({ columnTemplateVisible: true, editRow: row });
    };

    columnTemplateVisibleChange = (visible) => {
        this.setState({ columnTemplateVisible: visible, editRow: null });
    };

    onScroll = (event) => {
        const { loading, currentPageSize, currentPage, templateTypeValue, searchKey } = this.state;
        const { clientHeight } = event.target;
        const { scrollHeight } = event.target;
        const { scrollTop } = event.target;
        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;
        if (isBottom && !loading && currentPageSize > 9) {
            this.getAlarmColumnData({ current: currentPage + 1 });
        }
    };

    setRowKeys = (props) => {
        let selectKeys = [];
        if (_.get(props, 'cacheData') || _.get(props, 'cacheData') === 0) {
            selectKeys = [Number(_.get(props, 'cacheData'))];
        } else if (_.get(props, 'rowData.colDispTemplet') || _.get(props, 'rowData.colDispTemplet') === 0) {
            selectKeys = _.get(props, 'rowData.colDispTemplet')
                .split(',')
                .map((s) => Number(s));
        }
        return selectKeys;
    };

    // 获取列模板数据
    getAlarmColumnData(params = {}) {
        const {
            userInfo: { userName },
            login,
        } = this.props;
        const { systemInfo } = login;
        const { fullData, templateTypeValue, mineData, searchKey } = this.state;
        const queryParam = {
            current: params.current || 1,
            pageSize: 10,
            userId: this.props.userInfo.userId,
            showType: templateTypeValue === 0 ? 0 : 1,
            templateName: params.templateName || searchKey,
            columnProvince: getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
        };
        this.setState({ loading: true });
        request('v1/template/alarm-column', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            if (res && res.data && templateTypeValue === 0) {
                this.setState(
                    {
                        mineData: _.sortBy(mineData.concat(res.data), ['createTime']).reverse(),
                        currentPageSize: res.data?.length,
                        currentPage: res.current,
                    },
                    () => {
                        this.setState({ loading: false });
                    },
                );
            } else {
                this.setState(
                    {
                        fullData: _.sortBy(fullData.concat(res.data), ['createTime']).reverse(),
                        currentPageSize: res.data?.length,
                        currentPage: res.current,
                    },
                    () => {
                        this.setState({ loading: false });
                    },
                );
            }
        });
    }

    // setDataByConditions = (type) => {
    //     _.debounce(() => {
    //         const {
    //             userInfo: { userId }
    //         } = this.props;
    //         const { templateTypeValue, fullData, searchKey, selectedRowKeys } = this.state;
    //         let mine = fullData.filter((item) => String(item.ownerId) === String(userId));
    //         console.log(userId)
    //         let all = fullData;
    //         if (searchKey) {
    //             mine = mine.filter((item) => item.templateName.indexOf(searchKey) > -1);
    //             all = fullData.filter((item) => item.templateName.indexOf(searchKey) > -1);
    //         }
    //         let newValue = templateTypeValue;
    //         if (type === 'onInit') {
    //             if (
    //                 _.some(selectedRowKeys, (id) => _.find(all, (m) => String(m.templateId) === String(id))) &&
    //                 !_.some(selectedRowKeys, (id) => _.find(mine, (m) => String(m.templateId) === String(id)))
    //             ) {
    //                 newValue = 1;
    //             }
    //         }
    //         this.setState({
    //             mine,
    //             all,
    //             fullData,
    //             templateTypeValue: newValue
    //         });
    //     }, 300)();
    // };

    /**
     * radio change
     */
    onSelectChange = (id, rows) => {
        let selectedRowKeys = [];

        selectedRowKeys = rows.map((row) => {
            return row.templateId;
        });

        this.setState({
            selectedRowKeys,
        });

        this.props.onDataChange(selectedRowKeys);
    };
    /**
     * 复选框selected
     */
    onSelect = (record, selected, selectedRows) => {
        const { rowData } = this.state;
        if (selectedRows.length > 1) {
            message.warning('只能选择一条列模板');
            this.setState({
                rowData,
            });
            return;
        }
        this.setState({
            rowData: selectedRows,
        });
    };

    onSelectAll = () => {
        message.warning('只能选择一条列模板');
    };

    onTemplateTypeChange = (e) => {
        this.templateTypeChange(e.target.value);
    };

    templateTypeChange = (templateTypeValue) => {
        const { fullData, mineData } = this.state;
        this.setState(
            {
                templateTypeValue,
                searchKey: '',
                fullData: [],
                mineData: [],
            },
            () => {
                if (fullData.length === 0 || mineData.length === 0) {
                    this.getAlarmColumnData({ current: 1 });
                }
            },
        );
    };

    searchKey = (e) => {
        this.setState(
            {
                mineData: [],
                fullData: [],
            },
            () => {
                this.getAlarmColumnData({ templateName: e });
            },
        );
    };

    searchKeyChange = (e) => {
        this.setState({
            searchKey: e.target.value,
        });
    };

    render() {
        const { columns, selectedRowKeys, templateTypeValue, mine, all, loading, fullData, mineData, columnTemplateVisible, editRow } = this.state;
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
                disabled: !isEdit && selectedRowKeys.indexOf(record?.templateId) === -1,
                name: record?.templateName,
            }),
        };

        return (
            <div className="list-mode-wrapper">
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
                            onSearch={(e) => {
                                this.searchKey(e);
                            }}
                            onChange={this.searchKeyChange}
                        />
                    </Form.Item>
                </div>
                <div id="scroll-table-contianer">
                    <Table
                        loading={loading}
                        dataSource={templateTypeValue === 0 ? mineData : fullData}
                        columns={columns}
                        rowKey="templateId"
                        bordered
                        // onSubmit={this.onSubmit}
                        scroll={{ x: xWidth, y: scrollY }}
                        dateFormatter="string"
                        size="small"
                        pagination={false}
                        rowSelection={rowSelection}
                        rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                    />

                    {columnTemplateVisible && (
                        <CheckSelectTemplate visible={columnTemplateVisible} row={editRow} onVisibleChange={this.columnTemplateVisibleChange} />
                    )}
                </div>
            </div>
        );
    }
}
