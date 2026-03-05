import React, { PureComponent } from 'react';
import { Modal, message, Button, Icon } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import api from '../api';
import CompShowDetial from '../show';
import CompUpload from '../upload';
import ModalExport from '../export';
import BatchEdit from '../batch-edit';
import DeleteEdit from '../delete-edit';
import BatchSchedul from '../batch-schedul';
import { defineParams } from '../util';
import AuthButton from '@Src/components/auth-button';
import moment from 'moment';

/** *
 * 脚本详情
 */
class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { loading: false, batchData: {}, roleSource: [] };
        this.formRef = React.createRef();
        this.cRef = React.createRef();
        this.clickExportRef = React.createRef(false);
    }

    componentDidMount() {
        this.getRoles();
    }

    getRoles = () => {
        api.getRolesDictionary().then((res) => {
            if (res?.data?.length) {
                const newArr = [
                    {
                        id: 'day',
                        name: 'A角（白班）',
                    },
                    {
                        id: 'night',
                        name: 'A角（夜班）',
                    },
                    ...res.data
                        .filter((item) => item.dCode !== 'day')
                        .map((item) => {
                            return {
                                id: item.dCode,
                                name: item.dName,
                            };
                        }),
                ];
                this.setState({ roleSource: newArr });
            }
        });
    };

    /**
     * 获取表单元素
     * @param {标记} flag  1: 新建 2:编辑 3: 上传  4: 查看脚本详情 // ! 2明明是值班表导出啊？？？
     */
    getItem = (flag) => {
        const { curSelParmExport, login, mteamInfo, mteamModel, regionList } = this.props;
        switch (flag) {
            case 2: // 上传
                return (
                    <ModalExport
                        mteamInfo={mteamInfo}
                        mteamModel={parseInt(mteamModel, 10)}
                        ref={this.formRef}
                        curSelParmExport={curSelParmExport}
                    ></ModalExport>
                );
            case 'export': // 上传
                return (
                    <ModalExport
                        mteamInfo={mteamInfo}
                        mteamModel={parseInt(mteamModel, 10)}
                        ref={this.formRef}
                        curSelParmExport={curSelParmExport}
                        flag={flag}
                    ></ModalExport>
                );
            case 3: // 上传
                return (
                    <CompUpload
                        mteamInfo={mteamInfo}
                        mteamModel={parseInt(mteamModel, 10)}
                        userId={login.userId}
                        curSelParmExport={curSelParmExport}
                        onLoadResult={this.onLoadResult}
                    ></CompUpload>
                );
            case 'upload': // 上传
                return (
                    <CompUpload
                        mteamInfo={mteamInfo}
                        mteamModel={parseInt(mteamModel, 10)}
                        userId={login.userId}
                        curSelParmExport={curSelParmExport}
                        onLoadResult={this.onLoadResult}
                        onUploadResult={this.onUploadResult}
                        flag={flag}
                    ></CompUpload>
                );
            case 4: // 查看脚本详情
                return <CompShowDetial ref={this.formRef} result={curSelParmExport} />;
            case 5: // 批量修改
                return (
                    <BatchEdit
                        regionList={regionList}
                        onSaveData={(e) => {
                            this.handleBatchData(e);
                        }}
                        curSelParmExport={curSelParmExport}
                        mteamInfo={mteamInfo}
                        mteamModel={parseInt(mteamModel, 10)}
                    />
                );
            case 6: // 修改被删除的值班人员
                return <DeleteEdit curSelParmExport={curSelParmExport} mteamInfo={mteamInfo} mteamModel={parseInt(mteamModel, 10)} />;
            case 7: // 批量排班
                return (
                    <BatchSchedul
                        regionList={regionList}
                        curSelParmExport={curSelParmExport}
                        ref={this.cRef}
                        handleOk={(res) => {
                            if (res.code === 200 || res.code === 201) {
                                message.success(res.message);
                                this.props.closeModal();
                                this.props.refreshTable();
                            } else {
                                message.error(res.message);
                                this.props.closeModal();
                                this.props.refreshTable();
                            }
                        }}
                        mteamInfo={mteamInfo}
                        mteamModel={parseInt(mteamModel, 10)}
                        userId={login.userId}
                    />
                );
            default:
        }
        return '';
    };

    onLoadResult = (val) => {
        this.props.onLoadResult(val);
    };

    onUploadResult = (val) => {
        this.props.onUploadResult(val);
    };

    getModalProps = (flag) => {
        const { visible, closeModal } = this.props;

        const titleName = {
            1: '[新建]预处理任务',
            2: '值班表导出',
            3: '值班表上传',
            4: '值班表上传详情',
            5: '批量修改',
            6: '不存在列表',
            7: '批量排班',
            export: '默认接单人导出',
            upload: '默认接单人导入',
        };

        const batchEdit = {
            centered: true,
            destroyOnClose: true,
            width: 600,
            title: titleName[flag],
            visible,
            onCancel: closeModal.bind(this, true),
            // onOk: this.handleOk,
            footer: [
                <AuthButton
                    addLog={true}
                    type="primary"
                    authKey={'maintenanceConf:batchEdit'}
                    hasSpecialAuth={this.props.hasSpecialAuth}
                    onClick={this.handleOk}
                >
                    确定
                </AuthButton>,
                <Button
                    onClick={() => {
                        return closeModal && closeModal(true);
                    }}
                >
                    取消
                </Button>,
            ],
        };

        const edit = {
            centered: true,
            destroyOnClose: true,
            width: 600,
            title: titleName[flag],
            visible,
            onCancel: closeModal,
            footer: [
                <div style={{ textAlign: 'center' }}>
                    <Button
                        type="primary"
                        onClick={() => {
                            this.handleEditOk();
                        }}
                    >
                        确定
                    </Button>
                </div>,
            ],
        };

        const propsUnFooter = {
            centered: true,
            destroyOnClose: true,
            width: 600,
            title: titleName[flag],
            visible,
            onCancel: closeModal,
            footer: [],
        };
        const modalProps = {
            centered: true,
            destroyOnClose: true,
            width: 600,
            title: titleName[flag],
            visible,
            onCancel: closeModal,
            onOk: this.handleSave,
        };

        const batchSchedul = {
            centered: true,
            destroyOnClose: true,
            width: 600,
            title: titleName[flag],
            visible,
            onCancel: closeModal.bind(this, true),
            // onOk: this.handleSchedul,
            footer: [
                <AuthButton
                    addLog={true}
                    type="primary"
                    hasSpecialAuth={this.props.hasSpecialAuth}
                    authKey={'maintenanceConf:batchPush'}
                    onClick={this.handleSchedul}
                >
                    确定
                </AuthButton>,
                <Button
                    onClick={() => {
                        return closeModal && closeModal(true);
                    }}
                >
                    取消
                </Button>,
            ],
        };

        if (flag === 5) {
            return batchEdit;
        }
        if (flag === 6) {
            return edit;
        }

        if (flag === 7) {
            return batchSchedul;
        }

        return flag === 2 || flag === 'export' ? modalProps : propsUnFooter;
    };

    /**
     * 保存按钮点击事件
     */
    handleSave = () => {
        const { login, mteamModel, flag, mteamInfo, curSelParmExport } = this.props;
        if (this.clickExportRef.current) return;
        this.clickExportRef.current = true;
        this.formRef.current.validateFields().then((values) => {
            // const { flag, login } = this.props;

            if (mteamModel === '2') {
                const data = {
                    ...values,
                    operator: login.userId,
                    columnList: curSelParmExport.columnList,
                };
                delete data.dateTime;
                api.downLoadbj(data)
                    .then(() => {
                        this.clickExportRef.current = false;
                    })
                    .catch(() => {
                        this.clickExportRef.current = false;
                    });
            } else if (flag === 'export') {
                const data = {
                    provinceId: mteamInfo.provinceId,
                    operator: login.userId,
                };
                api.senderDownLoad(data);
            } else {
                const data = {
                    ...values,
                    startTime: values.dateTime[0].format('YYYY-MM-DD'),
                    endTime: values.dateTime[1].format('YYYY-MM-DD'),
                    operator: login.userId,
                    columnList: curSelParmExport.columnList,
                    // mteamModel: parseInt(mteamModel,10)
                };
                api.downLoad(data)
                    .then(() => {
                        this.clickExportRef.current = false;
                    })
                    .catch(() => {
                        this.clickExportRef.current = false;
                    });
            }
            this.props.closeModal();
        });
    };

    /** *
     * 新增
     */
    addSubscription = (params) => {
        this.setState({ loading: true });
        api.add(
            params,
            (data) => {
                message.success('修改成功');
                // 更新完之后刷新列表
                this.props.refreshTable();

                this.setState({ loading: false });
                this.props.closeModal();
            },
            (error) => {
                message.error('修改失败');
                this.setState({ loading: false });
                // this.props.closeModal();
            },
        );
    };

    /** *
     * 修改
     */
    editSubscription = (params) => {
        this.setState({ loading: true });
        api.edit(
            params,
            (data) => {
                message.success(data.desc);
                // 更新完之后刷新列表
                this.props.refreshTable();
                this.props.closeModal();
                this.setState({ loading: false });
            },
            (error) => {
                message.error(error.desc);
                this.setState({ loading: false });
                this.props.closeModal();
            },
        );
    };

    handleBatchData = (e) => {
        this.setState({ batchData: e });
    };

    handleData = (e) => {
        e.current?.validateFields((res) => {
            this.setState({
                schedulData: res,
            });
        });
    };

    // 批量修改值班人员
    handleOk = (param) => {
        const { login, mteamModel, mteamInfo } = this.props;
        const params = defineParams(this.state.batchData);
        if (params) {
            const data = {
                provinceId: mteamInfo.provinceId,
                operator: login.userId,
                regionId: mteamInfo.regionId,
                professionalType: mteamInfo.professionalId,
                ruleType: params.ruleType,
                userType: params.updateUsers[0].userType,
                mteamModel,
                userName: params.updateUsers[0].oldUserName, //姓名
                mobilePhone: params.updateUsers[0].oldMobilePhone, //手机号
            };
            api.getUsersToday(data).then((res) => {
                if (res.code === 200) {
                    if (res.message === '1') {
                        // Modal.confirm({
                        //     title: '提示',
                        //     icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                        //     content: this.getwarningMessage(),
                        //     okText: '确认',
                        //     okButtonProps: { prefixCls: 'oss-ui-btn' },
                        //     cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                        //     okType: 'danger',
                        //     cancelText: '取消',
                        //     prefixCls: 'oss-ui-modal',
                        //     width: '350px',
                        //     onOk: () => {
                        this.saveData(params, param);
                        //     },
                        //     onCancel() {},
                        // });
                    } else {
                        this.saveData(params, param);
                    }
                }
            });
        }
    };

    getwarningMessage = () => {
        if (moment().isSameOrBefore(moment().format('YYYY-MM-DD 07:00:00'))) {
            return '此刻修改今日排班，不会立即生效，将于今日9点开始生效';
        } else if (moment().isAfter(moment().format('YYYY-MM-DD 07:00:00')) && moment().isSameOrBefore(moment().format('YYYY-MM-DD 12:00:00'))) {
            return '此刻修改今日排班，不会立即生效，将于今日14点开始生效';
        } else if (moment().isAfter(moment().format('YYYY-MM-DD 12:00:00')) && moment().isSameOrBefore(moment().format('YYYY-MM-DD 17:00:00'))) {
            return '此刻修改今日排班，不会立即生效，将于今日18点开始生效';
        } else {
            return '此刻修改今日排班，不会立即生效，将于明日9点开始生效';
        }
    };

    getLogContext = (params) => {
        let logStr = '';
        if (params?.updateUsers?.length > 0) {
            const { regionList } = this.props;
            const { roleSource } = this.state;
            logStr = `班组名称：${params?.ruleType}\n`;
            let regionNameStr = '';
            params?.regionIds?.forEach((item) => {
                if (String(item) === '-1') {
                    regionNameStr += '全部、';
                } else {
                    const region = regionList?.find((r) => String(r.regionId) === String(item));
                    if (region) {
                        regionNameStr += `${region.regionName}、`;
                    }
                }
            });
            regionNameStr = regionNameStr.slice(0, -1);

            params?.updateUsers?.forEach((item) => {
                const userTypeName = roleSource?.find((r) => String(r.id) === String(item.userType))?.name;
                const scopesStr = item.scopes?.replaceAll(',', '、');
                logStr += `${userTypeName}：\n&nbsp;归属地市：${regionNameStr}\n&nbsp;待修改人员：${
                    item.oldUserName || '空'
                }\n&nbsp;交接的维护范围：${scopesStr || '空'}\n&nbsp;修改后人员：${item.newUserName || '空'}\n`;
            });
        }

        return logStr;
    };

    saveData = (params, param) => {
        delete params.regionId;
        api.updateDutyUserBatch(params, param).then((res) => {
            if (res.code === 200 || res.code === 201) {
                message.success(res?.message || '批量修改成功');
                const logStr = this.getLogContext(params);
                sendLogFn({ authKey: 'maintenanceConf:batchEditTrue', logContext: logStr });
                this.props.closeModal();
                this.props.refreshTable();
            } else {
                message.error(res?.message);
                this.props.closeModal();
                this.props.refreshTable();
            }
        });
    };

    handleSchedul = (params) => {
        if (this.cRef?.current) {
            this.cRef?.current.getData(params);
        }
    };

    // 修改被删除的人员
    handleEditOk = () => {
        this.props.closeModal();
    };

    render() {
        const { flag } = this.props;

        const modalProps = this.getModalProps(flag);
        return <Modal {...modalProps}>{this.getItem(flag)}</Modal>;
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
