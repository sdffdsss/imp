import React from 'react';
import CustomModalFooter from '@Components/custom-modal-footer';
import { Modal, Tooltip, message, ProTable } from 'oss-ui';
import { searchGroupFields, searchSpecificNeIds } from '../utils/api';
import { _ } from 'oss-web-toolkits';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tableColumns: [],
            dataSource: []
        };
    }

    componentDidMount() {
        this.getColumns();
    }

    /**
     * @description: 获取展示列
     * @param {*}
     * @return {*}
     */

    getColumns = async () => {
        const { showNeListGroup } = this.props;
        const data = {
            groupNetWorkType: showNeListGroup.groupNetWorkType,
            groupType: showNeListGroup.groupType
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
                        hideInSearch: true,
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
                    return tempObj;
                });
            }
            this.setState({
                tableColumns: _.orderBy(columns, ['orderId'], ['asc'])
            });
        } catch (e) {
            message.error('出错了！');
        }
    };
    /**
     * @description: 请求列表数据
     * @param {*} async
     * @return {*}
     */

    getNeListHandler = async (params) => {
        const { showNeListGroup } = this.props;
        try {
            const data = {
                groupNetWorkType: showNeListGroup.groupNetWorkType,
                groupId: showNeListGroup?.groupId,
                groupType: showNeListGroup.groupType,
                orderField: '',
                orderType: 0,
                filterFieldMap: {},
                current: params.current,
                pageSize: params.pageSize
            };
            const res = await searchSpecificNeIds(data);
            if (res && Array.isArray(res.data)) {
                return {
                    success: true,
                    data: res.data,
                    total: res.total
                };
            }
        } catch (e) {}
    };

    /**
     * @description: 关闭弹窗
     * @param {*}
     * @return {*}
     */

    closeNeListModal = () => {
        this.props.onCloseModal && this.props.onCloseModal();
    };

    render() {
        const { tableColumns } = this.state;
        return (
            <Modal
                centered={true}
                destroyOnClose={true}
                width={900}
                title="查看"
                visible={true}
                footer={<CustomModalFooter onCancel={this.closeNeListModal} onOk={this.closeNeListModal} />}
                onCancel={this.closeNeListModal}
            >
                <ProTable
                    columns={tableColumns}
                    tableAlertRender={false}
                    tableAlertOptionRender={false}
                    request={this.getNeListHandler}
                    // actionRef={neRef}
                    borderd="true"
                    global={window}
                    options={false}
                    search={false}
                    rowKey="neId"
                    size="small"
                    scroll={{ y: 450 }}
                />
            </Modal>
        );
    }
}
