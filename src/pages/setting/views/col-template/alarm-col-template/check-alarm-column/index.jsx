import React, { PureComponent } from 'react';
import { ProTable } from 'oss-ui';
import { getAllAlarmColumns, setColumnsInfo } from '../../common/rest';
import { Modal, Button, Tabs } from 'oss-ui';

const { TabPane } = Tabs;

class CheckAlarmColumn extends PureComponent {
    alarmColTemplateForm = React.createRef();

    static defaultProps = {
        columns: [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: 50,
                ellipsis: true,
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                width: 150,
                ellipsis: true,
            },
            {
                title: '字段',
                dataIndex: 'field',
                key: 'field',
                width: 120,
                ellipsis: true,
            },
            {
                title: '别名',
                dataIndex: 'alias',
                key: 'alias',
                width: 150,
                ellipsis: true,
            },
            {
                title: '宽度',
                dataIndex: 'width',
                key: 'width',
                ellipsis: true,
            },
        ],
    };

    constructor(props) {
        super(props);
        this.state = {
            activeData: [],
            confirmData: [],
            clearData: [],
            cleardAckData: [],
        };
    }

    componentDidMount() {
        const { row } = this.props;

        if (row) {
            this.getAllAlarmInfo(row);
        }
    }

    getAllAlarmInfo = async (row) => {
        const leftData = await getAllAlarmColumns();
        const { activeAlarmColumn, confirmAlarmColumn, clearAlarmColumn, cleardAckAlarmColumn } = setColumnsInfo(row.columnsValue, leftData);
        this.setState({
            activeData: activeAlarmColumn.map((item, index) => ({ ...item, id: index + 1 })),
            confirmData: confirmAlarmColumn.map((item, index) => ({ ...item, id: index + 1 })),
            clearData: clearAlarmColumn.map((item, index) => ({ ...item, id: index + 1 })),
            cleardAck: cleardAckAlarmColumn.map((item, index) => ({ ...item, id: index + 1 })),
        });
    };

    handleCancel = () => {
        const { onVisibleChange } = this.props;
        onVisibleChange(false);
    };

    render() {
        const { activeData, confirmData, clearData, cleardAck } = this.state;
        const { columns, visible } = this.props;

        return (
            <Modal
                width={600}
                bodyStyle={{ height: '445px' }}
                title="已选告警列模板"
                visible={visible}
                centered
                onCancel={this.handleCancel}
                maskClosable={false}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>
                        取消
                    </Button>,
                ]}
            >
                <Tabs type="card">
                    <TabPane tab="未清除未确认" key="active-col">
                        <ProTable
                            scroll={{ y: 350 }}
                            columns={columns}
                            dataSource={activeData}
                            rowKey="id"
                            dateFormatter="string"
                            toolBarRender={false}
                            search={false}
                            size="small"
                            pagination={false}
                        />
                    </TabPane>
                    <TabPane tab="未清除已确认" key="confirm-col">
                        <ProTable
                            scroll={{ y: 350 }}
                            columns={columns}
                            dataSource={confirmData}
                            rowKey="id"
                            dateFormatter="string"
                            toolBarRender={false}
                            search={false}
                            size="small"
                            pagination={false}
                        />
                    </TabPane>
                    <TabPane tab="已清除未确认" key="clear-col">
                        <ProTable
                            scroll={{ y: 350 }}
                            columns={columns}
                            dataSource={clearData}
                            rowKey="id"
                            dateFormatter="string"
                            toolBarRender={false}
                            search={false}
                            size="small"
                            pagination={false}
                        />
                    </TabPane>
                    <TabPane tab="已清除已确认" key="cleardAck-col">
                        <ProTable
                            scroll={{ y: 350 }}
                            columns={columns}
                            dataSource={cleardAck}
                            rowKey="id"
                            dateFormatter="string"
                            toolBarRender={false}
                            search={false}
                            size="small"
                            pagination={false}
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}

export default CheckAlarmColumn;
