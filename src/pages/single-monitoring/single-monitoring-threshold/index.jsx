import React, { Fragment } from 'react';
import { Modal, Tooltip, Icon, Space, ProTable, Button } from 'oss-ui';
import InsertMode from './single-monitoring-threshold-add';
import getData from '@Common/services/dataService';
import { getThresholdList } from '../api';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.actionRef = React.createRef();
        this.state = {
            visible: false,
            editRow: {},
            addVisible: false,
            addRow: {},
            publishColumns: [
                {
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center',
                    width: 80,
                    render: (text, record, index) => index + 1
                },
                {
                    title: '厂家',
                    dataIndex: 'vendorName',
                    align: 'center'
                },
                {
                    title: '设备类型',
                    dataIndex: 'neType',
                    align: 'center'
                },
                {
                    title: '网元名称',
                    dataIndex: 'neLabel',
                    align: 'center'
                },
                {
                    title: '预警时间',
                    dataIndex: 'alarmtimeDuration',
                    align: 'center'
                },
                {
                    title: '失败类型',
                    dataIndex: 'dataFailTypeName',
                    align: 'center'
                },
                {
                    title: '操作',
                    key: 'action',
                    valueType: 'option',
                    dataIndex: 'id',
                    width: 60,
                    render: (text, row) => (
                        <Space>
                            <Tooltip title="删除">
                                <Icon key="3" antdIcon={true} type="DeleteOutlined" onClick={this.showDelModal.bind(this, row)} />
                            </Tooltip>
                        </Space>
                    )
                }
            ],
            dataSource: [],
            loading: false,
            scrollY: window.innerHeight - 300,
            pagination: {
                current: 1,
                pageSize: 20,
                total: 20,
                showQuickJumper: true,
                showSizeChanger: true
            }
        };
    }

    componentDidUpdate() {}

    componentDidMount() {
        // this.loadData();
    }

    loadData = () => {
        this.setState({
            dataSource: [
                {
                    fp0: 1
                }
            ]
        });
    };
    refresh = () => {
        this.actionRef.current.reload();
    };
    handleOk = (e) => {
        const { onChange } = this.props;
        onChange();
    };

    handleCancel = (e) => {
        const { onChange } = this.props;
        onChange();
    };

    /**
     * 删除操作
     */
    showDelModal = (row) => {
        Modal.confirm({
            title: `是否删除此条数据？`,
            prefixCls: 'oss-ui-modal',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            onOk: () => {
                this.deleteThresholdData(row);
            }
        });
    };
    deleteThresholdData = (row) => {
        getData(
            'DeleteThresholdData',
            {
                // 是否需要显示成功消息提醒
                showSuccessMessage: true,
                // 成功提醒内容
                defaultSuccessMessage: '删除成功',
                // 是否需要显示失败消息提醒
                showErrorMessage: true,
                // 失败提醒内容
                defaultErrorMessage: '删除失败'
            },
            { intId: row.intId }
        ).then((res) => {
            if (res && res.data) {
                this.refresh();
            }
        });
    };
    addChange = () => {
        this.setState({
            addVisible: false,
            addRow: {}
        });
    };

    render() {
        const { visible } = this.props;
        const { publishColumns, dataSource, loading, scrollY, pagination, addVisible, addRow } = this.state;
        return (
            <Fragment>
                <Modal width={1200} title="监控阀值设置" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <ProTable
                        columns={publishColumns}
                        rowKey="rosterIntId"
                        scroll={{ y: scrollY }}
                        onChange={this.onPageChange}
                        loading={loading}
                        search={false}
                        bordered
                        dateFormatter="string"
                        toolBarRender={() => [
                            <Button
                                onClick={() => {
                                    this.setState({ addVisible: true, addRow: null });
                                }}
                            >
                                <Icon antdIcon type="PlusOutlined" />
                                新建
                            </Button>
                        ]}
                        request={(params, sorter, filter) => {
                            return getThresholdList(params);
                        }}
                        actionRef={this.actionRef}
                    />
                </Modal>
                <InsertMode
                    editRow={addRow}
                    visible={addVisible}
                    onCancel={() => {
                        this.setState({ addVisible: false });
                    }}
                    onChange={this.addChange}
                    refresh={this.refresh}
                ></InsertMode>
            </Fragment>
        );
    }
}
