import React, { PureComponent } from 'react';
import { Modal, Button, Table } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
/**
 * 状态标识管理查看弹窗
 */
export default class StatusManagerSearch extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [
                {
                    title: '名称',
                    dataIndex: 'DispName',
                    key: 'DispName'
                },
                {
                    title: '字段',
                    dataIndex: 'FieldName',
                    key: 'FieldName'
                }
            ]
        };
    }
    getStatusValue(string) {
        let option = null;
        if (!string || string === '') {
            return [];
        }
        let newString = string;
        // 防止xml字符被转义导致解析失败
        if (string.indexOf('&lt;') !== -1) {
            newString = string.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#xD;/g, '');
        }
        const stringList = [];
        option = newString.split('BOCO.SceneMonitor.Domain.Model.IconField');
        option.forEach((item) => {
            const list = item.split(' ');
            const childrenList = [];
            list.forEach((items) => {
                if (items.indexOf('Index') !== -1 || items.indexOf('DispName') !== -1 || items.indexOf('FieldName') !== -1) {
                    const itemsList = items.replace(/"/g, '').split('=');
                    if (_.compact(itemsList).length > 0) {
                        childrenList.push(itemsList);
                    }
                }
            });
            if (childrenList.length > 0) {
                const entries = new Map(childrenList);
                const obj = Object.fromEntries(entries);
                stringList.push(obj);
            }
        });
        return stringList;
    }

    componentDidMount() {
        this.setState({ data: this.getStatusValue(this.props.statusValue) });
    }

    handleCancel = () => {
        const { onChange } = this.props;
        onChange(false);
    };

    render() {
        const { data, columns } = this.state;
        const { visible } = this.props;
        return (
            <>
                <Modal
                    width={600}
                    title={'已选择状态标识'}
                    visible={visible}
                    centered
                    maskClosable={false}
                    onOk={this.handleSave}
                    onCancel={this.handleCancel}
                    okButtonProps={{ disabled: true }}
                    cancelButtonProps={{ disabled: true }}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>
                    ]}
                >
                    <Table scroll={{ y: 400 }} size="small" columns={columns} dataSource={data} pagination={false}></Table>
                </Modal>
            </>
        );
    }
}
