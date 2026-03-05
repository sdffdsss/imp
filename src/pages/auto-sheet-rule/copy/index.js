import React, { PureComponent } from 'react';
import { Button, Icon, message, Popconfirm, Modal, Tooltip } from 'oss-ui';
import request from '@Common/api';

export default class index extends PureComponent {
    componentDidMount() {
        // this.getFilterDetaiil();
    }

    onCopy = () => {
        const { data = {}, onFresh } = this.props;

        request('alarmmodel/filter/v1/filter/copy', {
            type: 'post',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        }).then((res) => {
            message.success('复制成功');
            onFresh();
        });
    };

    onButtonCopy = () => {
        Modal.confirm({
            title: '如果进行复制将会导致新增，是否确认复制？',
            onOk: this.onCopy,
            okText: '确定',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
        });
    };

    render() {
        const { iconMode } = this.props;

        return iconMode ? (
            <Tooltip title="复制" trigger={['hover', 'click']}>
                <Popconfirm title="如果进行复制将会导致新增，是否确认复制？" onConfirm={this.onCopy}>
                    <Icon title="复制" antdIcon type="CopyOutlined" />
                </Popconfirm>
            </Tooltip>
        ) : (
            <Button onClick={this.onButtonCopy}>
                <Icon antdIcon type="CopyOutlined" />
                复制
            </Button>
        );
    }
}
