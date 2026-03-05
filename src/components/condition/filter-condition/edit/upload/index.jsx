/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState } from 'react';
import { Modal, Upload, Input, Button, message, Space, Spin } from 'oss-ui';
import PropTypes from 'prop-types';
import { uploadFile } from '../api';
import CustomModalFooter from '@Components/custom-modal-footer';
import styles from './index.module.less';

const UploadComp = (props) => {
    const { fieldType } = props;
    const [fileData, setFileData] = useState(null);
    const [uploadData, setUploadData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
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
        formData.append('file', fileData);
        formData.append('fieldName', fieldType);
        formData.append('isDict', fieldType === 'title_text' ? 2 : 1);
        formData.append('clientToken', localStorage.getItem('access_token'));
        formData.append('clientRequestId', 'nomean');
        try {
            setLoading(true);
            const res = await uploadFile(formData);
            if (res && res.data) {
                setUploadData(res.data);
                message.success('导入文件成功');
                setLoading(false);
            }
        } catch (e) {
            message.error('出错了');
            setLoading(false);
        }
    };

    /**
     * @description: 拦截原有上传，并取得上传文件
     * @param {*}
     * @return {*}
     */
    const beforeUpload = (file) => {
        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type !== 'application/vnd.ms-excel') {
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
    const getNotNullData = (str) => {
        return str || '';
    };
    /**
     * @description: 确认导入信息
     * @param {*}
     * @return {*}
     */

    const confirmUpload = () => {
        if (!uploadData) {
            message.error('未监测到上传文件');
            return;
        }
        const { emptyMessage } = uploadData;
        const { repeatMessage } = uploadData;
        const unMatchedMessage = Array.isArray(uploadData.unMatchedList) && uploadData.unMatchedList.reduce((total, item) => `${total}\n${item}`);
        const showUploadMessage = `${getNotNullData(emptyMessage)}\n${getNotNullData(repeatMessage)}\n不匹配数据：\n${getNotNullData(
            unMatchedMessage
        )}`;
        setUploadMessage(showUploadMessage);
        setMessageModalVisible(true);
    };

    /**
     * @description: 重写上传框footer内容
     * @param {*}
     * @return {*}
     */

    const customModalFooterRender = () => {
        return (
            <Space>
                <Button onClick={confirmUpload} type="primary">
                    确认
                </Button>
                <Button onClick={closeModal}>关闭</Button>
            </Space>
        );
    };
    /**
     * @description: 提交上传信息
     * @param {*}
     * @return {*}
     */

    const confirmSubmit = () => {
        const matchedList = uploadData?.matchedList || [];
        let handleList = [];
        if (Array.isArray(matchedList)) {
            handleList = matchedList.map((item) => {
                return item.value;
            });
        }
        props.onUploadInfoSave && props.onUploadInfoSave(handleList);
    };

    /**
     * @description:导入不匹配数据
     * @param {*}
     * @return {*}
     */

    const confirmUnMatchedSubmit = () => {
        const matchedList = uploadData?.matchedList || [];
        const unMatchedList = uploadData?.unMatchedList || [];
        let handleMatchList = [];
        let handleUnMatchList = [];
        if (Array.isArray(matchedList)) {
            handleMatchList = matchedList.map((item) => {
                return item.value;
            });
        }
        if (Array.isArray(unMatchedList)) {
            handleUnMatchList = unMatchedList.map((item) => {
                return item;
            });
        }
        const handleList = [...handleMatchList, ...handleUnMatchList];
        props.onUploadInfoSave && props.onUploadInfoSave(handleList);
    };
    /**
     * @description: 提交上传信息
     * @param {*}
     * @return {*}
     */

    const closeMessageModal = () => {
        setMessageModalVisible(false);
    };
    /**
     * @description: 重写上传信息footer内容
     * @param {*}
     * @return {*}
     */

    const customMessageModalFooterRender = () => {
        return (
            <Space>
                <Button onClick={confirmUnMatchedSubmit} type="primary">
                    导入不匹配数据
                </Button>
                <Button onClick={confirmSubmit} type="primary">
                    确认
                </Button>
                <Button onClick={closeMessageModal}>关闭</Button>
            </Space>
        );
    };

    return (
        <>
            <Modal
                title="导入数据"
                visible={true}
                {...props}
                footer={<CustomModalFooter render={customModalFooterRender} />}
                onCancel={closeModal}
                width="600px"
            >
                <Spin spinning={loading} tip="文件导入中...">
                    <div className={styles['upload-container']}>
                        <span>上传文件：</span>
                        <Input value={fileData?.name} className={styles['upload-file-name-input']} />
                        <Space>
                            <Upload beforeUpload={beforeUpload} showUploadList={false}>
                                <Button type="primary">选择文件</Button>
                            </Upload>
                            <Button type="primary" onClick={submitUpload}>
                                导入
                            </Button>
                        </Space>
                    </div>
                </Spin>
            </Modal>
            <Modal
                visible={messageModalVisible}
                title="导入确认"
                footer={<CustomModalFooter render={customMessageModalFooterRender} />}
                onCancel={closeMessageModal}
                width="600px"
            >
                <Input.TextArea
                    style={{
                        height: '350px',
                    }}
                    disabled
                    value={uploadMessage}
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
