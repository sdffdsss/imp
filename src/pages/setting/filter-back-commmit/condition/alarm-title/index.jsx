import React, { PureComponent } from 'react';
import { Button, Checkbox, Space, Typography, message, Table, Modal, Select, Input, Icon } from 'oss-ui';
import CustomModalFooter from '@Components/custom-modal-footer';

export default class index extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            // 厂商列表
            vendorList: [
                {
                    id: 1,
                    txt: '厂商名称1',
                },
                {
                    id: 2,
                    txt: '厂商名称2',
                },
            ],
            // 告警标题列表
            allTitleList: [
                {
                    id: 1,
                    name: '告警标题1',
                },
                {
                    id: 2,
                    name: '告警标题2',
                },
            ],
            selectedList: [],
            pageSize: 20,
            pageNum: 1,
            modalSelectedRows: [],
            selectedRowKeys: [],
        };
    }

    // componentDidMount() {
    //     //获取厂商列表
    //     let vendorListPromise = request('vendor/list',{
    //         type: 'get',
    //     });
    //     let listPromise = request('alarmTitle/list',{
    //         type: 'get',
    //     });

    //     Promise.all([vendorListPromise, listPromise]).then((res) => {
    //         this.setState({
    //             vendorList: res[0]['data'],
    //             allTitleList: res['1']['data'],
    //             pageSize: res[1]['pageSize'],
    //         });
    //     });
    // }

    columns = [
        {
            title: '标题',
            dataIndex: 'name',
        },
    ];

    alarmTitleColumns = [
        {
            title: '标题',
            key: 'id',
            dataIndex: 'name',
        },
    ];

    onDelete = () => {
        const { selectedRowKeys, selectedList } = this.state;
        const { onChange } = this.props;

        if (selectedRowKeys.length === 0) {
            message.warning('请选择删除项');
            return;
        }

        this.setState(
            {
                selectedList: selectedList.filter((item) => !selectedRowKeys.includes(item.id)),
            },
            () => {
                message.success('删除成功');
                onChange(this.state.selectedList);
            }
        );
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    // 弹窗中选择告警标题
    onModalSelectedChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            modalSelectedRows: selectedRows,
        });
    };

    // 选择告警标题
    onSelectedChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
        });
    };

    handleCancel = () => {
        this.setState({ visible: false, modalSelectedRows: [] });
    };

    handleOk = () => {
        const { modalSelectedRows } = this.state;
        const { onChange } = this.props;

        this.setState({ selectedList: modalSelectedRows, modalSelectedRows: [], visible: false });
        onChange(modalSelectedRows);
    };

    render() {
        const { visible, modalSelectedRows, vendorList, allTitleList, selectedList, selectedRowKeys } = this.state;
        const { onTxtNegativeChange, disabled, rightValues, currentSelectedCondition } = this.props;
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        <Button disabled={disabled} type="primary" onClick={this.showModal}>
                            添加
                        </Button>
                        <Button disabled={disabled} onClick={this.onDelete}>
                            删除
                        </Button>
                    </Space>
                    <Checkbox
                        checked={
                            rightValues[currentSelectedCondition.id] &&
                            rightValues[currentSelectedCondition.id].isNegative
                        }
                        disabled={disabled}
                        onChange={onTxtNegativeChange}
                    >
                        取反
                    </Checkbox>
                </div>
                <Typography.Title style={{ margin: '16px 0 8px', fontSize: 14 }} level={4}>
                    已选告警标题
                </Typography.Title>
                <Table
                    scroll={{ x: 350, y: 220 }}
                    size="small"
                    sticky
                    rowKey="id"
                    pagination={false}
                    rowSelection={{
                        fixed: true,
                        selectedRowKeys,
                        onChange: this.onSelectedChange,
                    }}
                    columns={this.columns}
                    dataSource={selectedList}
                ></Table>
                <Modal
                    width={600}
                    title="选择告警标题"
                    zIndex={1002}
                    visible={visible}
                    onOk={this.handleOk}
                    footer={<CustomModalFooter onCancel={this.handleCancel} onOk={this.handleOk} />}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Select
                            placeholder="选择厂商"
                            style={{ width: 150 }}
                            options={vendorList.map((item) => ({ label: item.txt, value: item.id }))}
                        ></Select>
                        <Input
                            placeholder="请输入告警标题关键词"
                            style={{ width: 220 }}
                            prefix={<Icon antdIcon type="SearchOutlined" />}
                        />
                    </div>
                    <Table
                        scroll={{ x: 350, y: 220 }}
                        size="small"
                        sticky
                        rowKey="id"
                        // pagination={false}
                        rowSelection={{
                            fixed: true,
                            selectedRowKeys: modalSelectedRows.map((item) => item.id),
                            onChange: this.onModalSelectedChange,
                        }}
                        columns={this.alarmTitleColumns}
                        dataSource={allTitleList}
                    ></Table>
                </Modal>
            </>
        );
    }
}
