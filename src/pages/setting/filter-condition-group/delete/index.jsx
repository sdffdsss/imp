import React from 'react';
import { Icon, message, Modal, Tooltip } from 'oss-ui';
import { deleteNetWorkGroup } from '../utils/api';
import AuthButton from '@Src/components/auth-button';

const DeleteComp = (props) => {
    const submitDelete = (data,params) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: `此操作将永久删除选中项，是否继续操作？`,
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: async () => {
                try {
                    const res = await deleteNetWorkGroup(data,params);
                    if (!res || !res.data) {
                        message.error(res?.desc || '删除数据失败');
                        return;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    props.onReloadTable && props.onReloadTable('delete');
                    // eslint-disable-next-line no-empty
                } catch (e) {}
            },
            onCancel() {}
        });
    };
    /**
     * @description: 删除单条
     * @param {*}
     * @return {*}
     */
    const delSingleNetworkGroup = (params,e) => {
        const { type, data, scope, selectedRow } = props;
        let handleData = {};
        if (type === 'tree') {
            e.preventDefault();
            e.stopPropagation();
            handleData = {
                userId: props.userId,
                groupType: selectedRow.groupType,
                groupNetWorkType: selectedRow.groupNetWorkId,
                groupIdList: [data.id]
            };
        } else {
            handleData = {
                userId: scope.props.login.userId,
                groupType: data.groupType,
                groupNetWorkType: data.groupNetWorkType,
                groupIdList: [data.groupId]
            };
        }
        submitDelete(handleData,params);
    };

    /**
     * @description: 批量删除
     * @param {*}
     * @return {*}
     */
    const delMutiNetworkGroup = (params) => {
        const { data, groupNetWorkType, groupType } = props;
        if (!Array.isArray(data) || data.length === 0) {
            message.error('请选择要删除的选项');
            return;
        }
        const groupIdList = data.map((item) => {
            return item.groupId;
        });
        const handleData = {
            userId: props.userId,
            groupType,
            groupNetWorkType,
            groupIdList
        };
        submitDelete(handleData,params);
    };

    /**
     * @description: 提交删除请求
     * @param {*}
     * @return {*}
     */

    return props.buttonType === 'icon' ? (
        <Tooltip title="删除">
            <AuthButton addLog={true} onClick={(params,e) => {
                delSingleNetworkGroup(params,e)
            }} type="text" style={{ padding: 0 }} authKey="networkGroup:delete">
                <Icon antdIcon type="DeleteOutlined" />
            </AuthButton>
        </Tooltip>
    ) : (
        <AuthButton addLog={true} type="primary" onClick={delMutiNetworkGroup} authKey="networkGroup:batchDelete">
            <Icon antdIcon type="DeleteOutlined" />
            批量删除
        </AuthButton>
    );
};

export default DeleteComp;
