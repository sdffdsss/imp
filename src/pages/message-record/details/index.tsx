// import React,{useEffect,useState}from 'react';
import React, { PureComponent } from 'react';
import { Input, Modal } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';

interface Props {
    ivrDetails: any[];
    visible: any;
    handleCancel: () => void;
}
interface States {
    dataSource: any[];
    // loading: boolean;
}
class details extends PureComponent<Props, States> {
    formRef: any = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
    }
    componentDidMount() {
        this.setState({ dataSource: this.props.ivrDetails });
    }
    getColumns = [
        {
            title: '发送号码',
            align: 'center',
            dataIndex: 'sendMobile',
            hideInSearch: true,
            width: 60,
            ellipsis: true,
        },
        {
            title: '发送时间',
            align: 'center',
            dataIndex: 'sendTime',
            hideInSearch: true,
            width: 60,
            ellipsis: true,
        },
        {
            title: '调用结果',
            align: 'center',
            dataIndex: 'sendResult',
            hideInSearch: true,
            width: 30,
            ellipsis: true,
        },
        {
            title: '调用失败原因',
            align: 'center',
            dataIndex: 'sendResultMessage',
            hideInSearch: true,
            width: 60,
            ellipsis: true,
        },
    ];

    // 查询事件
    onInputChange = (e) => {
        const { ivrDetails } = this.props;
        const dataSource = ivrDetails.filter((item) => `${item.sendMobile}`.indexOf(e) !== -1);
        this.setState({ dataSource });
    };
    handleCancel = () => {
        this.props.handleCancel();
    };
    render() {
        const { dataSource } = this.state;
        const { visible } = this.props;
        return (
            <Modal title={'短信发送详情'} width={600} centered visible={visible} footer={false} onCancel={this.handleCancel}>
                <div className="ivr-rule-details">
                    <span className="ivr-rule-details-lable"> 发送号码</span>
                    <Input.Search className="ivr-rule-details-value" placeholder="手机号模糊匹配" allowClear onSearch={this.onInputChange} />
                </div>
                <div style={{ height: '300px' }}>
                    <VirtualTable
                        rowKey="num"
                        global={window}
                        tableAlertRender={false}
                        manualRequest={true}
                        search={false}
                        searchCollapsed={false}
                        dataSource={dataSource}
                        bordered
                        options={false}
                        columns={this.getColumns}
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            </Modal>
        );
    }
}
export default details;
