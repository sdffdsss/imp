import React from 'react';
import { Modal, ProTable, Tooltip, message } from 'oss-ui';
import { searchGroupFields, searchSpecificNeIds, getGroupsData } from './api';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import { _ } from 'oss-web-toolkits';
import CustomModalFooter from '@Components/custom-modal-footer';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            groupDetailColumns: [],
            groupDetailScrollX: 0,
            groupNetWorkType: -1,
        };
        this.tableRef = React.createRef();
    }

    componentDidMount() {
        this.getGroupsData();
    }

    /**
     * @description:
     * @param {*}
     * @return {*}
     */

    getGroupsData = async () => {
        const { login, systemInfo, choosedGroup } = this.props;

        const data = {
            groupId: choosedGroup.groupId,
            groupType: choosedGroup.groupType,
            groupNetWorkType: -1,
            userId: login.userId,
            regionId: systemInfo.currentZone?.zoneId,
            current: 1,
            oderType: 0,
            orderFieldName: '',
            pageSize: 1,
        };
        const res = await getGroupsData(data);
        if (Array.isArray(res?.data)) {
            this.setState(
                {
                    groupNetWorkType: res.data[0]?.groupNetWorkType,
                },
                () => {
                    this.getGroupDetailFieldList();
                    // this?.tableRef?.current?.reload();
                },
            );
        }
    };

    onCloseModal = () => {
        this.props.onCloseModal();
    };

    /**
     * @description: 获取组详情
     * @param {*}
     * @return {*}
     */

    getGroupDetailList = async (params) => {
        const { groupNetWorkType } = this.state;
        const { login, choosedGroup } = this.props;

        if (groupNetWorkType === -1) {
            return {
                data: [],
                success: true,
                total: 0,
            };
        }
        const para = {
            current: params.current,
            filterFieldMap: {},
            groupId: choosedGroup.groupId,
            groupNetWorkType,
            groupType: choosedGroup.groupType,
            orderField: '',
            orderFieldName: '',
            orderType: 0,
            searchLikeParamMap: {},
            pageSize: params.pageSize,
            userId: login.userId,
        };
        try {
            const res = await searchSpecificNeIds(para);
            if (res && Array.isArray(res.data)) {
                return {
                    data: res.data,
                    success: true,
                    total: res.total,
                };
            }
            return {
                data: [],
                success: true,
                total: 0,
            };
        } catch (e) {
            return {
                data: [],
                success: true,
                total: 0,
            };
        }
    };
    /**
     * @description: 获取组详情列字段
     * @param {*}
     * @return {*}
     */

    getGroupDetailFieldList = async () => {
        const { groupNetWorkType } = this.state;
        const { choosedGroup } = this.props;
        const data = {
            groupNetWorkType,
            groupType: choosedGroup.groupType,
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
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <Tooltip title={record[item.msgFieldName] || '-'}>{record[item.msgFieldName] || '-'}</Tooltip>
                                </section>
                            );
                        },
                    };
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
                        }),
                },
                () => {
                    this?.tableRef?.current?.reset();
                },
            );
        } catch (e) {
            message.error('出错了！');
        }
    };

    render() {
        const { groupDetailColumns, groupDetailScrollX } = this.state;
        return (
            <Modal
                visible={true}
                onCancel={this.onCloseModal}
                width={800}
                title="网元"
                footer={<CustomModalFooter onCancel={this.onCloseModal} onOk={this.onCloseModal} />}
            >
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
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
