import React, { PureComponent } from 'react';
import { Modal, Button, Table, message } from 'oss-ui';
import moment from 'moment';
import Enums from '@Common/enum';
import { _ } from 'oss-web-toolkits';

/**
 * 状态标识管理编辑弹窗
 */
class DelInfo extends PureComponent {
    constructor(props) {
        super(props);
        this.statusManagerEditForm = React.createRef();
        this.state = {
            visible: false,
            loading: false,
            filterInfo: { isCreate: true, templateName: '', description: '' },
            allOptionsList: [],
            columns: [
                {
                    title: '窗口名称',
                    dataIndex: 'TEMPLATE_NAME',
                    key: 'TEMPLATE_NAME'
                },
                {
                    title: '窗口分类',
                    dataIndex: 'WINDOW_TYPE',
                    key: 'WINDOW_TYPE',
                    render: (text) => {
                        return Enums.windowTypeList.getName(text);
                    }
                },
                {
                    title: '创建人',
                    dataIndex: 'USER_NAME',
                    key: 'USER_NAME'
                },
                {
                    title: '创建时间',
                    dataIndex: 'CREATE_TIME',
                    key: 'CREATE_TIME',
                    render: (text) => {
                        return moment(text).format('YYYY-MM-DD hh:mm:ss');
                    }
                },
                {
                    title: '是否共享',
                    dataIndex: 'WINDOW_ATTRIBUTE',
                    key: 'WINDOW_ATTRIBUTE',
                    render: (text) => {
                        return String(text) === '0' ? '否' : '是';
                    }
                },
                {
                    title: '是否启用',
                    dataIndex: 'IF_USED',
                    key: 'IF_USED',
                    render: (text) => {
                        return String(text) === '0' ? '否' : '是';
                    }
                }
            ],
            data: []
        };
    }

    // 获取所有字段
    componentDidMount() {
        const { delInfo } = this.props;
        if (Array.isArray(delInfo) && delInfo.length) {
            const showInfo = delInfo.map((item) => {
                const obj = {};
                _.forOwn(item, (value, key) => {
                    obj[key.toUpperCase()] = value;
                });
                return obj;
            });
            this.setState({ data: showInfo });
        }
    }

    close = () => {
        const { onChange = () => {} } = this.props;
        onChange();
    };
    onConfirm = () => {
        const { data } = this.state;
        const { delRow, confirmDelete } = this.props;
        if (data.filter((s) => s.WINDOW_TYPE === '0').length) {
            message.warning('当前列模板被当班窗口的视图模板引用，无法删除，请检查后再操作！');
            return;
        }
        confirmDelete(delRow);
    };
    render() {
        const { columns, data } = this.state;
        const { visible } = this.props;
        return (
            <>
                <Modal
                    width={800}
                    title={'关联视图'}
                    visible={visible}
                    centered
                    onCancel={this.close}
                    footer={[
                        <div style={{ textAlign: 'center' }}>
                            <Button type="primary" onClick={this.onConfirm}>
                                确认
                            </Button>
                            <Button onClick={this.close}>关闭</Button>
                        </div>
                    ]}
                >
                    <Table size="small" columns={columns} dataSource={data}></Table>
                    <div style={{ color: 'red', textAlign: 'center' }}>列模板被以上监控视图所引用，请谨慎操作!</div>
                </Modal>
            </>
        );
    }
}

export default DelInfo;
