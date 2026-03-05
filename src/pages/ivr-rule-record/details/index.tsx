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
            title: '呼叫号码',
            align: 'center',
            dataIndex: 'phone',
            hideInSearch: true,
            width: 60,
            ellipsis: true,
        },
        {
            title: '呼叫时间',
            align: 'center',
            dataIndex: 'callTime',
            hideInSearch: true,
            width: 60,
            ellipsis: true,
        },
        {
            title: '调用结果',
            align: 'center',
            dataIndex: 'callResult',
            hideInSearch: true,
            width: 30,
            ellipsis: true,
        },
        {
            title: '调用失败原因',
            align: 'center',
            dataIndex: 'failReason',
            hideInSearch: true,
            width: 60,
            ellipsis: true,
        },
    ];

    // 查询事件
    onInputChange = (e) => {
        const { ivrDetails } = this.props;
        const dataSource = ivrDetails.filter((item) => item.phone.includes(e.target.value));
        this.setState({ dataSource });
    };
    handleCancel = () => {
        this.props.handleCancel();
    };
    render() {
        const { dataSource } = this.state;
        const { visible } = this.props;
        return (
            <Modal title={'外呼详情'} width={600} centered visible={visible} footer={false} onCancel={this.handleCancel}>
                <div className="ivr-rule-details">
                    <span className="ivr-rule-details-lable"> 呼叫号码</span>
                    <Input className="ivr-rule-details-value" placeholder="手机号模糊匹配" allowClear onChange={this.onInputChange} />
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
