import React, { createRef } from 'react';
import { Icon, Space, Modal, message } from 'oss-ui';
import NewAuthButton from '@Pages/components/auth/auth-button';
import TimelineEdit from '@Pages/components/timeline-edit';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import moment from 'moment';
import CommonWrapper from '../../../components/common-wrapper';
import ContentTemplate from '../../../components/content-template';
import api from '../../../../api';
import { getGroupWorkRecorderTemplateApi } from '../../../components/content-template/api';
import { ReactComponent as RefreshSvg } from '../../../img/u25.svg';

export default class Index extends React.Component {
    ref = createRef();
    ContentTemplateRef = createRef();
    constructor(props) {
        super(props);
        this.state = {
            contentTemplateModalVisible: false,
            templateList: [],
            loading: props.type === 'record',
        };
    }

    componentDidMount() {
        const { type, schedulingObj } = this.props;

        if (type === 'record') {
            getGroupWorkRecorderTemplateApi({
                groupId: schedulingObj.groupId,
            }).then((res) => {
                if (res.resultCode === '200') {
                    this.setState({
                        templateList: res.resultObj,
                        loading: false,
                    });
                }
            });
        }
    }

    exportDutyContentInfo = async () => {
        const { schedulingObj, type } = this.props;

        const params = {
            groupId: schedulingObj.groupId,
            workShiftId: schedulingObj.workShiftId,
            dateTime: schedulingObj.dateTime,
            contentType: type === 'record' ? 2 : 1,
        };

        const res = await api.exportDutyRecord(params);
        const blob = new Blob([res]);
        // 兼容不同浏览器的URL对象
        const url = window.URL || window.webkitURL || window.moxURL;
        // 创建下载链接
        const downloadHref = url.createObjectURL(blob);
        // 创建a标签并为其添加属性
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadHref;
        downloadLink.download = `${type === 'record' ? '工作记录' : '重要通知'}导出${moment().format('YYYYMMDDHHmmss')}.xlsx`;
        // 触发点击事件执行下载
        downloadLink.click();
    };

    onUpload = async (file) => {
        const {
            schedulingObj,
            loginInfo: { userId },
        } = this.props;

        const formData = new FormData();
        formData.append('files', file);
        formData.append('userId', userId);
        formData.append('workShiftId', schedulingObj?.workShiftId);
        formData.append('dateTime ', schedulingObj?.dateTime);

        const res = await api.uploudFile(formData);

        if (res.resultCode === '200') {
            message.success('上传附件成功');
            const lastIndex = res.resultObj.filePath.lastIndexOf('/');
            return {
                url: res.resultObj.filePath.substring(0, lastIndex),
                fileName: res.resultObj.fileName,
                operationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            };
        }

        message.error('上传失败');

        return Promise.reject(new Error('上传失败'));
    };

    onDeleteFile = async (data) => {
        const filePath = `${data.url}/${data.fileName}`;

        const res = await api.deleteFile({ filePath });

        if (res.resultCode === '200') {
            return undefined;
        }
        message.warning('删除附件失败！');

        return Promise.reject(new Error('删除失败'));
    };

    onDownload = async (data) => {
        const filePath = `${data.url}/${data.fileName}`;

        const res = await api.downloadFile({ filePath });

        const blob = new Blob([res]);
        // 兼容不同浏览器的URL对象
        const url = window.URL || window.webkitURL || window.moxURL;
        // 创建下载链接
        const downloadHref = url.createObjectURL(blob);
        // 创建a标签并为其添加属性
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadHref;
        downloadLink.download = data.fileName;
        // 触发点击事件执行下载
        downloadLink.click();

        return undefined;
    };

    onClose = () => {
        this.setState({ contentTemplateModalVisible: false, templateList: this.ContentTemplateRef.current.getNewList() });
    };

    render() {
        const {
            schedulingObj,
            loginInfo,
            pattern,
            type,
            refreshDutyInfo,
            saveItemInfoCb,
            delRecordOrInformData,
            onEditRecordOrInform,
            pageType,
            allRemainSwitchClick,
            moduleId,
        } = this.props;
        const { contentTemplateModalVisible, templateList, loading } = this.state;

        if (loading) {
            return null;
        }
        return (
            <CommonWrapper
                moduleId={moduleId}
                title={type === 'record' ? '工作记录' : '重要通知'}
                extra={
                    <Space>
                        {type === 'record' && pageType === ShiftChangeTypeEnum.Handover && (
                            <>
                                <NewAuthButton
                                    ignoreAuth
                                    onClick={() => {
                                        allRemainSwitchClick(false);
                                    }}
                                >
                                    取消遗留
                                </NewAuthButton>
                                <NewAuthButton
                                    ignoreAuth
                                    onClick={() => {
                                        allRemainSwitchClick(true);
                                    }}
                                >
                                    一键遗留
                                </NewAuthButton>
                            </>
                        )}
                        {type === 'record' && (
                            <NewAuthButton
                                ignoreAuth
                                // disabled={operation === 'readonly'}
                                authKey="workbench-Workbench-components-Handover-Shift-Add"
                                onClick={() => {
                                    this.setState({ contentTemplateModalVisible: true });
                                }}
                            >
                                模板管理
                            </NewAuthButton>
                        )}
                        <NewAuthButton
                            ignoreAuth
                            // disabled={operation === 'readonly'}
                            authKey="workbench-Workbench-components-Handover-Shift-Add"
                            onClick={() => {
                                this.exportDutyContentInfo();
                            }}
                        >
                            导出
                        </NewAuthButton>

                        <NewAuthButton
                            ignoreAuth
                            disabled={pattern === 'readonly'}
                            authKey="workbench-Workbench-components-Handover-Shift-Add"
                            onClick={() => {
                                this.ref.current.addNew();
                            }}
                        >
                            <Icon antdIcon type="PlusOutlined" />
                            新增
                        </NewAuthButton>
                        <NewAuthButton
                            ignoreAuth
                            onClick={() => {
                                const isEditing = this.ref.current.judgeIsEditing();

                                if (isEditing) {
                                    Modal.confirm({
                                        title: '提示',
                                        content: '页面存在未保存的数据，刷新后会丢失，是否继续刷新？',
                                        okText: '确认',
                                        cancelText: '取消',
                                        okType: 'danger',
                                        onOk: () => {
                                            this.ref.current.clearEmptyData();

                                            refreshDutyInfo();
                                        },
                                    });
                                } else {
                                    refreshDutyInfo();
                                }
                            }}
                        >
                            <span className="refresh-icon">
                                <RefreshSvg />
                            </span>
                            刷新
                        </NewAuthButton>
                    </Space>
                }
            >
                <div
                    className="timeline-edit-wrapper"
                    style={{ overflow: schedulingObj?.[type === 'record' ? 'dutyRecords' : 'importanceInforms']?.length >= 4 ? 'auto' : 'unset' }}
                >
                    <TimelineEdit
                        ref={this.ref}
                        modifyScope={type}
                        loginInfo={loginInfo}
                        list={schedulingObj?.[type === 'record' ? 'dutyRecords' : 'importanceInforms']}
                        pattern={pattern}
                        onSave={(value) => {
                            saveItemInfoCb(type, type === 'record' ? 'dutyRecords' : 'importanceInforms', value);
                        }}
                        showUserName={type === 'record'}
                        onDelete={(id) => delRecordOrInformData(id, type)}
                        onUpload={this.onUpload}
                        onDeleteFile={this.onDeleteFile}
                        onDownload={this.onDownload}
                        templateList={templateList}
                        onEdit={onEditRecordOrInform}
                    />
                </div>
                <Modal
                    title="工作记录模板管理"
                    visible={contentTemplateModalVisible}
                    onCancel={this.onClose}
                    footer={null}
                    width={832}
                    destroyOnClose
                >
                    <ContentTemplate ref={this.ContentTemplateRef} onClose={this.onClose} groupId={schedulingObj?.groupId} />
                </Modal>
            </CommonWrapper>
        );
    }
}
