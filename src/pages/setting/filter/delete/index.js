import React, { Fragment, PureComponent } from 'react';
import { getCommonMsgWithSelectFilter } from '../utils';
import usePageInfo from '../hox';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { Icon, Tooltip, message, Modal } from 'oss-ui';
import { deleteFilter } from '../api';
import AuthButton from '@Src/components/auth-button';

class Index extends PureComponent {
    msg = getCommonMsgWithSelectFilter(this.props.data.moduleId);
    state = {
        showModal: false,
    };

    /**
     * @description: 发送删除请求
     * @param {*}
     * @return {*}
     */

    deleteConfirm = async (param) => {
        const { data, login } = this.props;

        if (!data) {
            message.error(`请选择${this.msg}`);
            return;
        }

        const { moduleId } = data;
        const params = {
            filterId: data.filterId, // 过滤器ID
            moduleId,
            modelId: 2, // 所属模型ID
            modifier: login.userId,
            requestInfo: {
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            },
        };
        const res = await deleteFilter(this.msg, params, param);
        if (!res) return;
        this.setState({ showModal: false });
        this.props.onFresh();
    };

    /**
     * @description: 点击删除按钮
     * @param {*}
     * @return {*}
     */

    buttonDelete = (params) => {
        const { data } = this.props;
        if (!data || !data.filterId) {
            message.error(`请选择${this.msg}`);
            return;
        }

        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            //content: `是否确认删除${this.msg}:【${data.filterName}】？`,
            content: '此操作将永久删除选中项，是否继续？',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            width: '350px',
            onOk: () => {
                this.deleteConfirm(params);
            },
            onCancel() {},
        });
    };

    render() {
        const { iconMode, moduleId, buttonKes } = this.props;
        return (
            <Fragment>
                {iconMode ? (
                    // 过滤器列表界面-删除
                    <Tooltip title="删除">
                        <AuthButton
                            addLog={true}
                            onClick={this.buttonDelete}
                            authKey={buttonKes?.delete[moduleId]}
                            type="text"
                            style={{ padding: 0 }}
                        >
                            <Icon antdIcon type="DeleteOutlined" />
                        </AuthButton>
                    </Tooltip>
                ) : (
                    // 过滤器树形界面-删除按钮
                    <AuthButton addLog={true} onClick={this.buttonDelete} authKey={buttonKes?.delete[moduleId]}>
                        <Icon antdIcon type="DeleteOutlined" />
                        删除
                    </AuthButton>
                )}
            </Fragment>
        );
    }
}

export default withModel([useLoginInfoModel, usePageInfo], (shareInfo) => ({
    login: shareInfo[0],
    pageInfo: shareInfo[1],
}))(Index);
