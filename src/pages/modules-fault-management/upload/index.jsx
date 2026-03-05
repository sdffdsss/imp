import React, { useState } from 'react';
import { Modal, Upload, Input, Button, message, Space, List, Spin, Table } from 'oss-ui';
import PropTypes from 'prop-types';
import CustomModalFooter from '@Components/custom-modal-footer';
import { useEnvironmentModel } from '@Src/hox';
import { createFileFlow, blobDownLoad } from '@Common/utils/download';
import './index.less';
import { exportType } from '../enum';
import api from './api';

const UploadComp = (props) => {
    const [fileData, setFileData] = useState(null);
    const [uploadData, setUploadData] = useState(null);
    const [loading, setLoading] = useState(false);
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
        const { handleCancel, onUploadResult, type, majorType, belongProvince, createdBy } = props;
        const params = new FormData();
        params.append('file', fileData);
        const sendData = {
            createdBy,
            belongProvince,
            majorType,
            file: params,
        };
        try {
            setLoading(true);
            let result = {};
            if (type === exportType.bigCustomer) {
                result = await api.importBigCustom(sendData);
            } else if (type === exportType.coreNetwork) {
                result = await api.importCoreNetwork(sendData);
            }
            console.log(result);
            const { code, data, message: errorMessage } = result;

            if (code === 200 && data) {
                //onSuccess('导入成功', fileData);
                setUploadData(data);
                setLoading(false);
                //handleCancel(false);
                onUploadResult('success');
            } else {
                message.error(data || errorMessage);
                //onError('导入失败');
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
            message.error('导入失败，导入文件仅支持.xls或.xlsx，请重新选择文件');
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
        props.handleCancel && props.handleCancel();
    };

    /**
     * @description: 打开错误列表弹窗
     * @param {*}
     * @return {*}
     */
    const showErrorList = () => {
        if (uploadData && uploadData.errorCount > 0 && uploadData.failureReasonFilePath) {
            const url = `${useEnvironmentModel.data.environment.serviceDiscovery}/cloud-duty-manager-unicom${uploadData.failureReasonFilePath}`;
            // window.open(url);
            createFileFlow(uploadData.failureReasonFileName, url);
        } else {
            message.warn('未发现导入失败数据');
        }
    };

    /**
     * @description: 下载模版
     * @param {*}
     * @return {*}
     */
    const downloadTemplate = async () => {
        const { type, majorName, majorType } = props;
        let result;
        if (props.type === exportType.bigCustomer) {
            result = await api.downloadBigCustomTemplate({ majorType: majorType === 9999 ? majorType : undefined });
            blobDownLoad(result, `${props.majorName}网络故障导入模板.xlsx`);
        } else if (props.type === exportType.coreNetwork) {
            result = await api.downloadCoreNetworkTemplate();
            blobDownLoad(result, `核心网网络故障导入模板.xlsx`);
        }
    };

    const customModalFooterRender = () => {
        return <Button onClick={closeModal}>关闭</Button>;
    };

    return (
        <>
            <Modal
                title="导入"
                visible={props.isModalOpen}
                {...props}
                footer={<CustomModalFooter render={customModalFooterRender} />}
                onCancel={closeModal}
                width="600px"
            >
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
                        <Button type="link" onClick={downloadTemplate}>
                            下载模版
                        </Button>
                    </div>
                    <div className="upload-response-container">
                        <span>
                            总数: <span className="upload-response-num">{uploadData?.insertCount + uploadData?.errorCount || 0}</span>
                        </span>
                        <span>
                            已导入: <span className="upload-response-num">{uploadData?.insertCount || 0}</span>
                        </span>
                        <span>
                            未导入: <span className="upload-response-num">{uploadData?.errorCount || 0}</span>
                        </span>
                        <Button type="link" onClick={showErrorList}>
                            失败原因下载
                        </Button>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};

UploadComp.propTypes = {
    visible: PropTypes.bool,
    onCloseModal: PropTypes.func,
};

export default UploadComp;
