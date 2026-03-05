import React, { Fragment, PureComponent } from 'react';
import request from '@Src/common/api';
import { getCommonMsgWithSelectFilter } from '../utils';

import { Icon, Tooltip, message, Modal } from 'oss-ui';
import AuthButton from '@Src/components/auth-button';

export default class index extends PureComponent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props) {
        super(props);
    }
    msg = getCommonMsgWithSelectFilter(this.props.data.moduleId);
    state = {
        showModal: false,
    };

    deleteConfirm = (params) => {
        const {
            data = {},
            login: { userId },
        } = this.props;
        const { moduleId } = data;
        // const msg = getCommonMsgWithSelectFilter(moduleId);
        if (!data) {
            message.error(`请选择${this.msg}`);
            return;
        }
        request('alarmmodel/filter/v1/filter', {
            type: 'delete',
            baseUrlType: 'filterUrl',
            defaultSuccessMessage: `${this.msg}删除成功`,
            data: {
                modifier: userId,
                filterId: data.filterId, // 过滤器ID
                moduleId,
                modelId: 2, // 所属模型ID
                requestInfo: {
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                },
            },
        }).then(() => {
            this.setState({ showModal: false });
            this.props.onFresh();
        });
        request('maintainTeam/saveFilterMteam', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '保存自动派单关联表失败，请检查服务',
            data: {
                filterId: data.filterId,
            },
            handlers: {
                params,
            },
        });
    };

    buttonDelete = (params) => {
        const { data } = this.props;
        if (!data || !data.filterId) {
            message.error(`请选择${this.msg}`);

            return;
        }

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
            onOk: () => this.deleteConfirm(params),
            onCancel() {},
        });
    };
    getAuthKey = () => {
        // const { data } = this.props;
        // switch (+data.moduleId) {
        //     case 604:
        //         return 'crhSheetRuleManage:delete';
        //     case 605:
        //         return 'superviseSheetRuleManage:delete';
        //     default:
        //     }

        return 'sheetRuleManage:delete';
    };
    render() {
        const { iconMode, data = {} } = this.props;
        const { moduleId } = data;
        const authKey = this.getAuthKey();
        return (
            <Fragment>
                {iconMode ? (
                    // 过滤器列表界面-删除
                    <Tooltip title="删除">
                        <AuthButton onClick={this.buttonDelete} addLog={true} authKey={authKey} type="text" style={{ padding: 0 }}>
                            <Icon antdIcon type="DeleteOutlined" />
                        </AuthButton>

                        {/* onClick={() => this.setState({ showModal: true })} /> */}
                    </Tooltip>
                ) : (
                    // 过滤器树形界面-删除按钮
                    <AuthButton onClick={this.buttonDelete} addLog={true} authKey={authKey}>
                        <Icon antdIcon type="DeleteOutlined" />
                        删除
                    </AuthButton>
                )}
            </Fragment>
        );
    }
}
