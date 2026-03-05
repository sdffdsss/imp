import React, { useState } from 'react';
import { Modal, Upload, Input, Button, message, Space, List, Spin, Table } from 'oss-ui';
import PropTypes from 'prop-types';
import { upLoadTemplate, downLoadTemplate, updateGroupByElements } from '../utils/api';
import CustomModalFooter from '@Components/custom-modal-footer';
import { useEnvironmentModel } from '@Src/hox';
import { createFileFlow } from '@Common/utils/download';
import './index.less';
import moment from 'moment';

const UploadComp = (props) => {
    const [fileData, setFileData] = useState(null);
    const [uploadData, setUploadData] = useState(null);
    const [errorDialogVisible, setErrorDialogVisible] = useState(false);
    const [repeatConfirmVisible, setRepeatConfirmVisible] = useState(false);
    const [repeatItems, setRepeatItems] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [repeatLoading, setRepeatLoading] = useState(false);
    /**
     * @description: 提交导入文件请求
     * @param {*}
     * @return {*}
     */
    const submitUpload = async () => {
        if (!fileData) {
            message.error('未检测到上传文件');
            return;
        }
        const formData = new FormData();
        formData.append('groupNetWorkType', props.uploadParams.groupNetWorkType);
        formData.append('groupId', props.uploadParams.groupId);
        formData.append('groupType', props.uploadParams.groupType);
        formData.append('userId', props.uploadParams.userId);
        formData.append('file', fileData);
        formData.append('sessionId', `${new Date().getTime()}upload`);
        try {
            setLoading(true);
            const res = await upLoadTemplate(formData);
            if (res && res.data) {
                setUploadData(res.data);
                if (res.data.pickList && res.data.pickList.length > 0) {
                    setRepeatItems(res.data.pickList);
                    showRepeatModal();
                    message.success('文件导入完成，存在以下待确认重复项');
                } else {
                    message.success('导入执行成功');
                }
                setLoading(false);
            } else {
                message.error(res.message);
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
        }
    };

    /**
     * @description: 拦截原有上传，并取得上传文件
     * @param {*}
     * @return {*}
     */
    const beforeUpload = (file) => {
        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            message.error('请上传xlsx格式文件');
            return false;
        }
        setFileData(file);

        return false;
    };

    /**
     * @description: 关闭弹窗
     * @param {*}
     * @return {*}
     */
    const closeModal = () => {
        props.onCloseModal && props.onCloseModal();
    };

    /**
     * @description: 打开错误列表弹窗
     * @param {*}
     * @return {*}
     */
    const showErrorList = () => {
        if (uploadData && uploadData.failCount > 0 && uploadData.failFilePath) {
            const url = `${useEnvironmentModel.data.environment.serviceDiscovery}/cloud.alarm.model.define${uploadData.failFilePath}`;
            // window.open(url);
            createFileFlow(uploadData.failFilePath, url);
        } else {
            message.warn('未发现导入失败网元');
        }
    };
    /**
     * @description: 更新重复网元API
     * @param {*}
     * @return {*}
     */
    const updateGroup = async (data) => {
        setRepeatLoading(true);
        updateGroupByElements({
            ...data,
            groupNetWorkType: props.uploadParams.groupNetWorkType,
            groupId: props.uploadParams.groupId,
            groupType: props.uploadParams.groupType,
        }).then(
            (res) => {
                if (res && res.code === 0) {
                    message.success('重复项导入成功');
                } else {
                    message.error('重复项导入失败');
                }
                setRepeatLoading(false);
                handleCancle();
            },
            () => {
                message.error('重复项导入失败');
                setRepeatLoading(false);
                handleCancle();
            },
        );
    };
    /**
     * @description: 关闭错误列表弹窗
     * @param {*}
     * @return {*}
     */
    const closeErrorModal = () => {
        setErrorDialogVisible(false);
    };
    /**
     * @description: 导入重复项确认弹窗
     */
    const showRepeatModal = () => {
        setRepeatConfirmVisible(true);
    };
    const handleOK = () => {
        if (selectedRows.groupNetworkDataList && selectedRows.groupNetworkDataList.length > 0) {
            updateGroup(selectedRows);
        } else {
            message.warn('请勾选需要导入的网元');
        }
    };
    const handleCancle = () => {
        setRepeatConfirmVisible(false);
        setSelectedRows([]);
    };
    /**
     * @description: 重复项表格选项
     */
    const repeatColumns = [
        {
            title: '网元id',
            dataIndex: 'neId',
        },
        {
            title: '网元名称',
            dataIndex: 'neName',
        },
        {
            title: '网元类型',
            dataIndex: 'neType',
            width: 100,
        },
        {
            title: '网元地市',
            dataIndex: 'regionId',
            width: 100,
        },
    ];
    const onSelectChange = (selectedRowKeys, selectedRows) => {
        const res = { groupNetworkDataList: selectedRows };
        setSelectedRows(res);
    };
    /**
     * @description: 下载模版
     * @param {*}
     * @return {*}
     */
    const handleDownLoadTemplate = async () => {
        try {
            const data = {
                excelType: 0,
                groupNetWorkType: props.uploadParams.groupNetWorkType,
                groupType: props.uploadParams.groupType,
                userId: props.uploadParams.userId,
            };
            const res = await downLoadTemplate(data);
            if (res && res.data) {
                const url = `${useEnvironmentModel.data.environment.serviceDiscovery}/cloud.alarm.model.define${res.data}`;
                // window.open(url);
                createFileFlow(res.data, url);
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
    };

    const customModalFooterRender = () => {
        return <Button onClick={closeModal}>关闭</Button>;
    };

    const repeatModalFooterRender = () => {
        return (
            <>
                <Button loading={repeatLoading} type="primary" onClick={handleOK}>
                    确认
                </Button>
            </>
        );
    };
    const getwarningMessage = () => {
        return 此刻修改今日排班, 不会立即生效, 将于明日9点开始生效;
        // if (moment().isSameOrBefore(moment().format('YYYY-MM-DD 07:00:00'))) {
        //     return <div>此刻修改今日排班,不会立即生效,将于今日9点开始生效</div>;
        // } else if (moment().isAfter(moment().format('YYYY-MM-DD 07:00:00')) && moment().isSameOrBefore(moment().format('YYYY-MM-DD 12:00:00'))) {
        //     return <div>此刻修改今日排班,不会立即生效,将于今日14点开始生效</div>;
        // } else if (moment().isAfter(moment().format('YYYY-MM-DD 12:00:00')) && moment().isSameOrBefore(moment().format('YYYY-MM-DD 17:00:00'))) {
        //     return <div>此刻修改今日排班,不会立即生效,将于今日18点开始生效</div>;
        // } else {
        //     return <div>此刻修改今日排班,不会立即生效,将于明日9点开始生效</div>;
        // }
    };

    return (
        <>
            <Modal title="导入" {...props} footer={<CustomModalFooter render={customModalFooterRender} />} onCancel={closeModal} width="600px">
                <Spin spinning={loading} tip="文件导入中...">
                    <div className="upload-container">
                        <span className="upload-label">上传文件：</span>
                        <Input value={fileData?.name} className="upload-file-name-input" />
                        <Space>
                            <Upload beforeUpload={beforeUpload} showUploadList={false} key={1}>
                                <Button type="primary">选择文件</Button>
                            </Upload>
                            <Button type="primary" onClick={submitUpload} key={2}>
                                导入
                            </Button>
                        </Space>
                        <Button type="link" onClick={handleDownLoadTemplate}>
                            下载模版
                        </Button>
                    </div>
                    <div className="upload-response-container">
                        <span>
                            总数: <span className="upload-response-num">{uploadData?.successCount + uploadData?.failCount || 0}</span>
                        </span>
                        <span>
                            已导入: <span className="upload-response-num">{uploadData?.successCount || 0}</span>
                        </span>
                        <span>
                            未导入: <span className="upload-response-num">{uploadData?.failCount || 0}</span>
                        </span>
                        <Button type="link" onClick={showErrorList}>
                            失败原因下载
                        </Button>
                    </div>
                    <div className="warning-Info-container">
                        {moment().isSameOrBefore(moment().format('YYYY-MM-DD 07:00:00')) &&
                            '本次导入成功后, 若用其过滤告警, 新导入的网元不会立刻生效, 会在今日9点生效'}
                        {moment().isAfter(moment().format('YYYY-MM-DD 07:00:00')) &&
                            moment().isSameOrBefore(moment().format('YYYY-MM-DD 12:00:00')) &&
                            '本次导入成功后, 若用其过滤告警, 新导入的网元不会立刻生效, 会在今日14点生效'}
                        {moment().isAfter(moment().format('YYYY-MM-DD 12:00:00')) &&
                            moment().isSameOrBefore(moment().format('YYYY-MM-DD 17:00:00')) &&
                            '本次导入成功后, 若用其过滤告警, 新导入的网元不会立刻生效, 会在今日18生效'}
                        {moment().isSameOrAfter(moment().format('YYYY-MM-DD 17:00:00')) &&
                            '本次导入成功后, 若用其过滤告警, 新导入的网元不会立刻生效, 会在明日9点生效'}
                    </div>
                </Spin>
            </Modal>
            <Modal title="错误信息详情" visible={errorDialogVisible} onOk={closeErrorModal} onCancel={closeErrorModal}>
                <List bordered dataSource={uploadData?.failKeyList || []} renderItem={(item) => <List.Item>{item}</List.Item>} />
            </Modal>
            <Modal
                title="导入重复项确认"
                visible={repeatConfirmVisible}
                footer={<CustomModalFooter render={repeatModalFooterRender} />}
                destroyOnClose
                closable={false}
            >
                <div style={{ marginBottom: '16px' }}>以下网元存在重复项,请选择需要导入的网元</div>
                <Table
                    rowSelection={{
                        onChange: onSelectChange,
                    }}
                    rowKey="neId"
                    bordered={true}
                    columns={repeatColumns}
                    dataSource={repeatItems}
                    pagination={false}
                    scroll={{ y: 180, x: 'max-content' }}
                />
            </Modal>
        </>
    );
};

UploadComp.propTypes = {
    visible: PropTypes.bool,
    onCloseModal: PropTypes.func,
};

export default UploadComp;
