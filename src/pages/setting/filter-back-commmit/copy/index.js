import React, { PureComponent } from 'react';
import { Button, Icon, message, Popconfirm, Modal, Tooltip } from 'oss-ui';
import request from '@Common/api';
import { makeCRC32 } from '@Common/utils';

export default class index extends PureComponent {
    onCopy = () => {
        const { data, onFresh, moduleId } = this.props;

        request('sysadminFilter/filter-detail-name', {
            type: 'post',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            data: {
                context: {
                    FILTER_ID: data.id,
                },
                iceEndpoint: 'SysadminServer:default -h 10.10.1.170 -p 4508',
            },
        }).then((res) => {
            if (res && Array.isArray(res.data)) {
                if (res.data.length === 0) {
                    message.error('获取过滤器信息为空');
                    return;
                }
                const filterId = makeCRC32(`${data.name}~${moduleId}~${data.owner.id}`);

                const filterInfoNew = res.data[0];
                filterInfoNew.name = `${filterInfoNew.name}[拷贝]`;
                filterInfoNew.id = filterId;
                // 重新为每一个condition添加conditionId
                filterInfoNew.conditions = filterInfoNew.conditions.map((item) => {
                    const conditionId = makeCRC32(`${filterId}~${filterInfoNew.name}~${item.name}`);

                    const newItem = {
                        ...item,
                        filterId,
                        id: conditionId,
                    };

                    newItem.items = newItem.items.map((itemIn) => {
                        return {
                            ...itemIn,
                            conditionId,
                        };
                    });

                    return newItem;
                });

                request('sysadminFilter/insert-filter', {
                    type: 'put',
                    baseUrlType: 'filter',
                    showSuccessMessage: false,
                    data: {
                        filter: filterInfoNew,
                        iceEndpoint: 'SysadminServer:default -h 10.10.1.170 -p 4508',
                    },
                }).then(() => {
                    message.success('复制成功');
                    onFresh();
                });
            }
        });
    };

    onButtonCopy = () => {
        const { data } = this.props;

        if (!data) {
            message.error('请选择过滤器');

            return;
        }

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
