import React from 'react';
import { Button, Modal, ProTable, message, Tooltip } from 'oss-ui';
import { getGroupsData, searchGroupFields, searchSpecificNeIds } from './api';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import produce from 'immer';
import { _ } from 'oss-web-toolkits';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            groupDetailVisible: false,
            columns: [
                {
                    dataIndex: 'rank',
                    align: 'center',
                    title: '序号',
                    hideInSearch: true,
                    width: 80,
                    render: (text, record, index) => {
                        return index + 1;
                    }
                },
                {
                    dataIndex: 'groupNetWorkTypeName',
                    align: 'center',
                    title: '组类型',
                    hideInSearch: true,
                    ellipsis: true,
                    width: 130
                },
                {
                    dataIndex: 'groupName',
                    align: 'center',
                    title: '组名称'
                },
                {
                    dataIndex: 'action',
                    align: 'center',
                    hideInSearch: true,
                    title: '操作',
                    render: (text, record) => {
                        return (
                            <Button type="link" onClick={this.showGroupDetail.bind(this, record)}>
                                查看
                            </Button>
                        );
                    }
                }
            ],
            groupDetailColumns: [],
            choosedGroup: null,
            selectedRows: []
        };
        this.tableRef = React.createRef();
    }

    componentDidMount() {
        const { data } = this.props;
        let selectedRowKeys = [];
        if (data && Array.isArray(data.value)) {
            selectedRowKeys = data.value.map((item) => {
                return item.value;
            });
        }
        this.setState({
            selectedRowKeys,
            selectedRows: data?.value || []
        });
    }

    /**
     * @description: 请求数据
     * @param {*}
     * @return {*}
     */

    getGroupList = async (params) => {
        const { data, login } = this.props;
        try {
            const para = {
                current: params.current,
                groupId: -1,
                groupNetWorkType: -1,
                groupType: data.groupType,
                orderFieldName: '',
                oderType: 0,
                pageSize: params.pageSize,
                regionId: -1,
                userId: login.userId,
                groupName: params.groupName
            };
            const res = await getGroupsData(para);
            if (res && Array.isArray(res.data)) {
                return {
                    data: res.data.map((item) => {
                        return {
                            ...item,
                            groupId: item.groupId.toString() // 兼容返回结果为字符串
                        };
                    }),
                    success: true,
                    total: res.total
                };
            }
            return {
                data: [],
                success: true,
                total: 0
            };
        } catch (e) {
            return {
                data: [],
                success: true,
                total: 0
            };
        }
    };

    onSelectedChange = (record, selected) => {
        const { selectedRows } = this.state;

        const nextData = produce(selectedRows, (draft) => {
            if (selected) {
                draft.push({
                    label: record.groupName,
                    value: record.groupId
                });
            } else {
                _.pull(draft, _.find(draft, { value: record.groupId }));
            }
        });

        this.setState({
            selectedRows: nextData,
            selectedRowKeys: nextData.map((val) => val.value)
        });
    };

    onSelectedAllChange = (selected, selectedAllRows, changeRows) => {
        const { selectedRows } = this.state;
        let newSelectRows = [];
        if (selected) {
            newSelectRows = produce(selectedRows, (draft) => {
                changeRows.forEach((item) => {
                    if (!_.find(draft, { value: item.groupId })) {
                        draft.push({
                            label: item.groupName,
                            value: item.groupId
                        });
                    }
                });
            });
        } else {
            newSelectRows = selectedRows.filter((item) => {
                return !_.find(changeRows, { groupId: item.value });
            });
        }
        this.setState({
            selectedRows: newSelectRows,
            selectedRowKeys: newSelectRows.map((val) => val.value)
        });
    };

    onHandelOk = () => {
        const { selectedRows } = this.state;
        this.props.onChange(selectedRows);
        this.onCancel();
    };

    /**
     * @description: 关闭组选择弹窗
     * @param {*}
     * @return {*}
     */

    onCancel = () => {
        this.props.onGroupSelectModalClose();
    };

    /**
     * @description: 关闭组详情弹窗
     * @param {*}
     * @return {*}
     */

    onGroupDetailCancel = () => {
        this.setState({
            groupDetailVisible: false,
            choosedGroup: null
        });
    };

    /**
     * @description: 展示具体网元列表
     * @param {*} record
     * @return {*}
     */

    showGroupDetail = (record) => {
        this.setState(
            {
                choosedGroup: record,
                groupDetailVisible: true
            },
            () => {
                this.getGroupDetailFieldList();
            }
        );
    };

    /**
     * @description: 获取网元组下的网元
     * @param {*}
     * @return {*}
     */

    // eslint-disable-next-line consistent-return
    getGroupDetailList = async (params) => {
        const { choosedGroup } = this.state;
        const { login } = this.props;
        const para = {
            current: params.current,
            filterFieldMap: {},
            groupId: choosedGroup.groupId,
            groupNetWorkType: choosedGroup.groupNetWorkType,
            groupType: choosedGroup.groupType,
            orderField: '',
            orderFieldName: '',
            orderType: 0,
            searchLikeParamMap: {},
            pageSize: params.pageSize,
            userId: login.userId
        };
        try {
            const res = await searchSpecificNeIds(para);
            if (res && Array.isArray(res.data)) {
                return {
                    data: res.data,
                    success: true,
                    total: res.total
                };
            }
            return {
                data: [],
                success: true,
                total: 0
            };
            // eslint-disable-next-line no-empty
        } catch (e) {}
    };
    /**
     * @description: 获取组详情列字段
     * @param {*}
     * @return {*}
     */

    getGroupDetailFieldList = async () => {
        const { choosedGroup } = this.state;
        const data = {
            groupNetWorkType: choosedGroup.groupNetWorkType,
            groupType: choosedGroup.groupType
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
                        hideInSearch: true,
                        title: item.labelName,
                        align: 'center',
                        ellipsis: true,
                        columnSize: 120,
                        orderId: item.orderId,
                        sorter: false,
                        render: (text, record) => {
                            return (
                                <section
                                    style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <Tooltip title={record[item.msgFieldName] || '-'}>{record[item.msgFieldName] || '-'}</Tooltip>
                                </section>
                            );
                        }
                    };
                    // if (item.enumFlag) {
                    //     tempObj.renderFormItem = () => {
                    //         return <SelectComp dictName={item.enumFieldName} label="value" id="key" mode="" />;
                    //     };
                    // }
                    return tempObj;
                });
            }
            this.setState(
                {
                    groupDetailColumns: _.orderBy(columns, ['orderId'], ['asc']),
                    groupDetailScrollX:
                        columns.length > 0 &&
                        columns.reduce((total, item) => {
                            return total + item.width;
                        })
                },
                () => {
                    this?.tableRef?.current?.reset();
                }
            );
        } catch (e) {
            message.error('出错了！');
        }
    };

    render() {
        const { columns, groupDetailVisible, groupDetailColumns, selectedRowKeys, groupDetailScrollX } = this.state;
        return (
            <>
                <Modal title="组选择" visible={true} onOk={this.onHandelOk} onCancel={this.onCancel} width={800}>
                    <ProTable
                        columns={columns}
                        request={this.getGroupList}
                        rowKey="groupId"
                        options={false}
                        size="small"
                        scroll={{ y: 280 }}
                        bordered
                        search={{
                            span: 8
                        }}
                        tableAlertRender={false}
                        rowSelection={{
                            type: 'checkbox',
                            onSelect: this.onSelectedChange,
                            onSelectAll: this.onSelectedAllChange,
                            selectedRowKeys
                        }}
                    />
                </Modal>
                <Modal title="组详情" visible={groupDetailVisible} onOk={this.onGroupDetailCancel} onCancel={this.onGroupDetailCancel} width={800}>
                    <ProTable
                        columns={groupDetailColumns}
                        request={this.getGroupDetailList}
                        actionRef={this.tableRef}
                        rowKey="neId"
                        options={false}
                        size="small"
                        search={false}
                        bordered
                        scroll={{ y: 300, x: groupDetailScrollX }}
                        tableAlertRender={false}
                    />
                </Modal>
            </>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login
}))(Index);
