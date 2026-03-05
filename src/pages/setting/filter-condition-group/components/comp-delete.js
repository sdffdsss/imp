import React, { Fragment, PureComponent } from 'react';
import request from '@Src/common/api';

import { Button, Icon, Tooltip, message, Modal } from 'oss-ui';

export default class index extends PureComponent {
    state = {
        showModal: false
    };

    deleteConfirm = () => {
        const { data = {} } = this.props;
        const { moduleId } = data;
        if (!data) {
            message.error(`请选择`);
            return;
        }
        request('alarmmodel/filter/v1/filter', {
            type: 'delete',
            baseUrlType: 'filterUrl',
            defaultSuccessMessage: `删除成功`,
            data: {
                filterId: data.filterId, // 过滤器ID
                moduleId,
                modelId: 2, // 所属模型ID
                requestInfo: {
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token')
                }
            }
        }).then(() => {
            this.setState({ showModal: false });
            this.props.onFresh();
        });
    };

    buttonDelete = () => {
        const { data } = this.props;
        if (!data || !data.filterId) {
            message.error(`请选择`);

            return;
        }

        Modal.confirm({
            title: '',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: `是否确认删除:【${data.filterName}】？`,
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: this.deleteConfirm,
            onCancel() {}
        });
    };

    render() {
        const { iconMode } = this.props;
        return (
            <Fragment>
                {iconMode ? (
                    // 过滤器列表界面-删除
                    <Tooltip title="删除">
                        <Icon antdIcon type="DeleteOutlined" onClick={this.buttonDelete}></Icon>
                        {/* onClick={() => this.setState({ showModal: true })} /> */}
                    </Tooltip>
                ) : (
                    // 过滤器树形界面-删除按钮
                    <Button onClick={this.buttonDelete}>
                        <Icon antdIcon type="DeleteOutlined" />
                        删除
                    </Button>
                )}
            </Fragment>
        );
    }
}
