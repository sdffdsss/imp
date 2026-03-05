import React from 'react';
import EditDetailModel from '../edit-detail-model';
import { Button, Modal, Icon, Message } from 'oss-ui';
import request from '@Common/api';
import AuthButton from '@Src/components/auth-button';
import './index.less';
/**
 * 新建/编辑/查看页面
 */

export default class Index extends React.PureComponent {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            ruleDetailModalVisible: false,
            idCheckedText: '',
            titleCheckedText: '',
        };
    }

    /**
     * @description: 打开新建/编辑/查看弹窗
     */

    showRuleDetailModal = () => {
        const { receiveParams } = this.props;
        this.setState(
            {
                ruleDetailModalVisible: true,
            },
            () => {
                receiveParams('', 'id');
                receiveParams('', 'title');
            },
        );
    };

    /**
     * @description: 关闭新建弹窗
     * @param {*}
     * @return {*}
     */
    closeModal = () => {
        const { isEditChange } = this.props;
        isEditChange('add');
        this.setState({
            ruleDetailModalVisible: false,
        });
    };

    // 提交表单数据时的规则校验
    getValidate() {
        const { titleText, nmsAlarmId } = this.props;
        if (!titleText && !nmsAlarmId) {
            Message.error({
                className: 'edit-message-model',
                content: `告警标题、网管告警ID 必须选填其一`,
            });
            return false;
        }
        return true;
    }
    /**
     * @description: 点击确认操作
     * @param {*}
     * @return {*}
     */
    onOk = () => {
        const { isEdit, rowData } = this.props;
        if (isEdit === 'edit') {
            this.saveHandle('PUT', rowData.recId);
        } else {
            this.saveHandle('POST', '');
        }
    };
    saveHandle = (type, params) => {
        // 收集form表单的数据
        const { titleText, nmsAlarmId } = this.props;
        const formInstance = this.formRef.current.getFieldsValue();
        // 对表单数据进行加工处理
        formInstance.nmsAlarmId = nmsAlarmId; // 编辑时的告警ID
        formInstance.titleText = titleText; // 编辑时的告警标题
        this.formRef.current
            .validateFields()
            .then(() => {
                const data = { ...formInstance };
                const { isEditChange, userId, isEdit } = this.props;
                let query = {};
                if (isEdit === 'edit') {
                    query = {
                        user: userId,
                        clientRequestId: 'nomean',
                        clientToken: localStorage.getItem('access_token'),
                        recId: params,
                        ...data,
                    };
                } else {
                    query = {
                        user: userId,
                        clientRequestId: 'nomean',
                        clientToken: localStorage.getItem('access_token'),
                        ...data,
                    };
                }
                const validateRes = this.getValidate();
                if (validateRes) {
                    request(`alarmmodel/subalarm/v1/subalarm`, {
                        type,
                        baseUrlType: 'filterUrl',
                        defaultSuccessMessage: '操作成功',
                        defaultErrorMessage: '操作失败',
                        data: query,
                    }).then(() => {
                        this.setState({
                            ruleDetailModalVisible: false,
                        });
                        isEditChange('add');
                    });
                }
            })
            .catch(() => {});
    };
    /**
     * 编辑和查看状态下展示组件
     */

    changeEdit = () => {
        this.setState({
            ruleDetailModalVisible: true,
        });
    };
    changeLook = () => {
        this.setState({
            ruleDetailModalVisible: true,
        });
    };

    componentDidMount() {
        const { isEdit } = this.props;
        if (isEdit === 'edit') {
            this.changeEdit();
        } else if (isEdit === 'look') {
            this.changeLook();
        }
    }

    render() {
        const { ruleDetailModalVisible } = this.state;
        const {
            isEdit,
            rowData,
            receiveParams,
            dictDatas,
            getDictEntry,
            alarmSub, // 告警子类型
            alarmObj, // 告警对象类型
            vendorDatas, // 厂家
            networkType,
        } = this.props;
        return (
            <div>
                {!isEdit && (
                    <AuthButton onClick={this.showRuleDetailModal} authKey="AlarmSubQuery:add">
                        <Icon antdIcon type="PlusOutlined" />
                        新建
                    </AuthButton>
                )}
                {ruleDetailModalVisible && (
                    <Modal
                        // eslint-disable-next-line no-nested-ternary
                        title={rowData ? (isEdit === 'edit' ? '编辑告警类型' : '查看告警类型') : '新建告警类型'}
                        visible={ruleDetailModalVisible}
                        width="50%"
                        onOk={this.onOk}
                        onCancel={this.closeModal.bind(this)}
                        footer={[
                            isEdit === 'look' && (
                                <Button key="back" onClick={this.closeModal.bind(this)}>
                                    取消
                                </Button>
                            ),
                            isEdit !== 'look' && (
                                <div>
                                    <Button key="ok" onClick={this.onOk} type="primary">
                                        确定
                                    </Button>
                                    <Button key="back" onClick={this.closeModal.bind(this)} type="primary">
                                        取消
                                    </Button>
                                </div>
                            ),
                        ]}
                    >
                        <div
                            style={{
                                height: '60vh',
                            }}
                        >
                            <EditDetailModel
                                dictDatas={dictDatas}
                                getDictEntry={getDictEntry}
                                ref={this.formRef}
                                closeModal={this.closeModal}
                                rowData={rowData}
                                isEdit={isEdit}
                                receiveParams={receiveParams}
                                ruleDetailModalVisible={ruleDetailModalVisible}
                                alarmSub={alarmSub} // 告警子类型
                                alarmObj={alarmObj} // 告警对象类型
                                vendorDatas={vendorDatas} // 厂家
                                networkType={networkType} // 网元类型
                            />
                        </div>
                    </Modal>
                )}
            </div>
        );
    }
}
