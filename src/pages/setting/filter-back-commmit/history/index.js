import React, { PureComponent } from 'react';
import { Button, Icon, message, Modal, Tooltip, Table } from 'oss-ui';
import FilterInfo from '@Components/filter-info';
import request from '@Common/api';

export default class index extends PureComponent {
    state = {
        visible: false,
        selectedFilter: null,
        data: [],
    };

    columns = [
        {
            title: '过滤器名称',
            dataIndex: 'filter',
            render: (text, record, index) => {
                return text.name;
            },
        },
        {
            title: '修改人',
            dataIndex: 'updateOwner',
            render: (text, record, index) => {
                return text.userName;
            },
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
        },
    ];

    checkHistory = () => {
        const { data } = this.props;

        if (!data) {
            message.error('请选择过滤器');
            return;
        }

        request('sysadminFilter/hisfilter', {
            type: 'post',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            data: {
                context: {
                    ORG_FILTER_ID: data.id,
                    commonOptionType: '',
                },
                iceEndpoint: 'SysadminServer:default -h 10.10.1.170 -p 4508',
            },
        }).then((res) => {
            if (res && Array.isArray(res.data) && res.data.length > 0) {
                this.setState({ visible: true, data: res.data });
            } else {
                this.setState({ visible: true, data: [] });
            }
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    onRowClick = (record) => {
        this.setState({ data: record.filter });
    };

    render() {
        const { iconMode } = this.props;
        const { visible, selectedFilter, data } = this.state;

        return (
            <>
                {iconMode ? (
                    <Tooltip title="查看历史">
                        <Icon antdIcon type="HistoryOutlined" onClick={this.checkHistory} />
                    </Tooltip>
                ) : (
                    <Button onClick={this.checkHistory}>
                        <Icon antdIcon type="HistoryOutlined" />
                        历史
                    </Button>
                )}
                <Modal
                    centered
                    footer={null}
                    title="历史管理"
                    width={1000}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    visible={visible}
                    bodyStyle={{ height: '500px' }}
                >
                    <div style={{ height: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <Table
                            onRow={(record) => {
                                return {
                                    onClick: this.onRowClick.bind(this, record), // 点击行
                                };
                            }}
                            style={{ width: '300px' }}
                            columns={this.columns}
                            dataSource={data}
                        />
                        <div style={{ flex: 'auto' }}>
                            <FilterInfo data={selectedFilter} />
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}
