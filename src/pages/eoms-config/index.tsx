import React from 'react';
import { Button, Card, Col, Form, Icon, Input, Modal, Row } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import './index.less';
import { VirtualTable } from 'oss-web-common';
import Edit from './edit';
import { Api } from './api';

interface Props {
    login: {
        userId: any;
        systemInfo: any;
        userInfo: any;
    };
}
interface States {
    columns: any[];
    selectedRowKeys: any[];
    editModalVisible: boolean;
    editRow: any;
    dataSource: any[];
    pagination: any;
}
class Index extends React.PureComponent<Props, States> {
    formRef: any = React.createRef();
    actionRef: any = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            selectedRowKeys: [],
            editModalVisible: false,
            editRow: null,
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
        // 查询列表数据
        this.searchTable();
    };
    getColumns = () => {
        const columns = [
            {
                title: '大区标识',
                dataIndex: 'sheetSource',
                key: 'sheetSource',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '大区名称',
                dataIndex: 'regionName',
                key: 'regionName',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '派单开关',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
                valueEnum: {
                    true: { text: '开启' },
                    false: { text: '关闭' },
                },
            },
            {
                title: '创建人',
                dataIndex: 'creator',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '修改人',
                dataIndex: 'modifier',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '修改时间',
                dataIndex: 'modifyTime',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '操作',
                valueType: 'option',
                dataIndex: 'id',
                align: 'center',
                fixed: 'right',
                ellipsis: true,
                render: (text, row) => [
                    <div key="opr">
                        <Button onClick={() => this.showEditModal(row)} type="text" style={{ padding: 0 }}>
                            <Icon antdIcon key="edit" type="FormOutlined" />
                        </Button>

                        <Button onClick={() => this.deleteExperiences({ sheetSource: row.sheetSource })} type="text" style={{ padding: 0 }}>
                            <Icon antdIcon key="delete" type="DeleteOutlined" />
                        </Button>
                    </div>,
                ],
            },
        ];
        this.setState({ columns });
    };

    searchTable = () => {
        this.getTableData().then();
    };

    /**
     * @description: 获取列表数据
     * @param params
     * @return n*o
     */
    getTableData = async () => {
        const formValues = this.formRef.current.getFieldsValue();
        const { regionName } = formValues;
        const { pagination } = this.state;

        const data = {
            page_size: pagination.pageSize,
            page_num: pagination.current,
            regionName,
        };
        try {
            const result = await Api.getEomsConfigList(data);
            this.setState({
                dataSource: result.data || [],
                pagination: {
                    pageSize: result.pageSize,
                    current: result.current,
                    total: result.total,
                },
            });
        } catch (e) {
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
            regionName: '',
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
                await Api.deleteEomsConfig(data);
                this.searchTable();
            },
        });
    };

    render() {
        const { pagination, dataSource, columns, selectedRowKeys, editModalVisible, editRow } = this.state;
        let headerTitle: any = null;
        headerTitle = (
            <Form name="basic" ref={this.formRef}>
                <Row gutter={24} wrap={false}>
                    <Col span={24} style={{ display: 'inline' }}>
                        <Form.Item style={{ marginBottom: 0 }} name="regionName" label="大区名称">
                            <Input placeholder="请输入大区名称" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Card bordered={false} style={{ height: 'calc(100% - 150px)' }} bodyStyle={{ padding: 0, height: '100%' }}>
                    <VirtualTable
                        rowKey="sheetSource"
                        global={window}
                        scroll={{
                            x: 300,
                        }}
                        search={false}
                        searchCollapsed={false}
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
                            <Button onClick={() => this.showEditModal(null)}>
                                <Icon antdIcon type="PlusOutlined" />
                                新建
                            </Button>,
                            // <Button onClick={()=>this.deleteExperiences(selectedRowKeys)}>
                            //     <Icon antdIcon type="DeleteOutlined" />
                            //     删除
                            // </Button>,
                        ]}
                        headerTitle={headerTitle}
                    />
                    {editModalVisible && <Edit editRow={editRow} handleCancel={this.handleCancel} okCallback={this.okCallback} />}
                </Card>
            </div>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
