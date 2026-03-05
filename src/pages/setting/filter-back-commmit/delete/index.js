import React, { PureComponent } from 'react';
import request from '@Common/api';
import { Button, Icon, Tooltip, message, Modal, Popconfirm } from 'oss-ui';

export default class index extends PureComponent {
    deleteConfirm = () => {
        const { data } = this.props;

        if (!data) {
            message.error('请选择过滤器');

            return;
        }

        request('sysadminFilter/filter-id', {
            type: 'delete',
            baseUrlType: 'filter',
            data: {
                iceEndpoint: 'SysadminServer:default -h 10.10.1.170 -p 4508',
                id: data.id,
            },
        }).then(() => {
            this.props.onFresh();
        });
    };

    buttonDelete = () => {
        const { data } = this.props;

        if (!data) {
            message.error('请选择过滤器');

            return;
        }

        Modal.confirm({
            title: '确定删除该项',
            icon: <Icon type="ExclamationCircleOutlined" antdIcon />,
            okText: '确定',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            onOk: () => {
                this.deleteConfirm();
            },
        });
    };

    render() {
        const { iconMode } = this.props;

        return iconMode ? (
            <Tooltip title="删除">
                <Popconfirm title="确定删除该项?" onConfirm={this.deleteConfirm} okText="确定" cancelText="取消">
                    <Icon antdIcon type="DeleteOutlined" />
                </Popconfirm>
            </Tooltip>
        ) : (
            <Button onClick={this.buttonDelete}>
                <Icon antdIcon type="DeleteOutlined" />
                删除
            </Button>
        );
    }
}
