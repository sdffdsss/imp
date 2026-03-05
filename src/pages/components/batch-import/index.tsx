import moment from 'moment';
import React, { FC, useState } from 'react';
import useLoginInfoModel from '@Src/hox';
import AuthButton from '@Components/auth-button';
import { Spin, Button, Space, Upload, Input, Modal, Table, Progress, message } from 'oss-ui';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ColumnsType } from 'antd/es/table';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import FormUpload from '../form-upload';
import style from './style.module.less';
import { importData } from '../api';
import PropTypes from 'prop-types';
import './index.less';
import CustomModalFooter from '@Components/custom-modal-footer';
import { useEnvironmentModel } from '@Src/hox';
import { createFileFlow, blobDownLoad } from '@Common/utils/download';

interface Props {
    downFile: () => void; // 自定义下载方法
    onCallback: (data: Record<string, any>) => void;
    authKey?: string;
    title?: string;
}

const BatchImport: FC<Props> = (props) => {
    const { title, authKey, downFile, onCallback } = props;
    const [visible, setVisible] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const { provinceId } = useLoginInfoModel();
    const [fileData, setFileData] = useState(null);
    const [uploadData, setUploadData] = useState(null);
    const [loading, setLoading] = useState(false);

    const open = () => {
        sendLogFn({ authKey: 'network-cutover:import' });
        setVisible(true);
    };

    const onCancel = () => {
        setDataSource([]);
        setVisible(false);
    };

    const columns: ColumnsType<Record<string, any>> = [
        {
            title: '导入时间',
            dataIndex: 'time',
            key: 'time',
            align: 'center',
        },
        {
            title: '导入总条数',
            dataIndex: 'totalNum',
            key: 'totalNum',
            align: 'center',
        },
        {
            title: '成功导入条数',
            dataIndex: 'successNum',
            key: 'successNum',
            align: 'center',
        },
        {
            title: '导入进度',
            dataIndex: 'percent',
            key: 'percent',
            align: 'center',
            render: (text, record) => {
                return <Progress percent={record.percent} />;
            },
        },
    ];

    const onChange = (info) => {
        const data = info.map((item) => {
            return {
                uid: item.uid,
                time: moment().format('YYYY-MM-DD HH:mm:ss'),
                totalNum: 0,
                successNum: 0,
                percent: 0,
            };
        });
        setDataSource([...dataSource, ...data]);
    };

    // 覆写自定义上传
    const uploadScripts = async ({ file, onError, onSuccess }: any) => {
        try {
            const params = new FormData();
            params.append('file', file);
            let data;
            if (title === '网络割接记录导入') {
                data = await importData(params, provinceId);
            } else {
                data = await importData(params, null);
            }
            if (data.code === 200) {
                onSuccess(data?.data, file);
                const succDataSource = dataSource.map((item) => {
                    if (item.uid === file.uid) {
                        return {
                            uid: item.uid,
                            time: item.time,
                            totalNum: data?.data?.totalNum,
                            successNum: data?.data?.successNum,
                            percent: 100,
                        };
                    }
                    return item;
                });
                message.success(data.message);
                onCallback?.(succDataSource);
                setDataSource(succDataSource);
            } else {
                message.error(data.message);
                onError(data?.data, file);
            }
        } catch {
            message.error('导入失败');
        }
    };

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
        const { onUploadResult} = props;
        const params = new FormData();
        params.append('file', fileData);
        try {
            setLoading(true);
            let result = {};
            if (title === '网络割接记录导入') {
                result = await importData(params, provinceId);
            } else {
                result = await importData(params, null);
            }
            console.log(result);
            const { code, data, message: errorMessage } = result;

            if (code === 200 && data) {
                setUploadData(data);
                setLoading(false);
                onUploadResult('success');
            } else {
                message.error(data || errorMessage);
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

    const customModalFooterRender = () => {
        return <Button onClick={onCancel}>关闭</Button>;
    };

    /**
     * @description: 打开错误列表弹窗
     * @param {*}
     * @return {*}
     */
    const showErrorList = () => {
        if (uploadData && uploadData.failNum > 0 && uploadData.errorFileName) {
            const url = `${useEnvironmentModel.data.environment.serviceDiscovery}/cloud-duty-manager-unicom/networkCutoverInfo/downloadErrorExcel?fileName=${uploadData.errorFileName}`;
            // window.open(url);
            createFileFlow(uploadData.errorFileName, url);
        } else {
            message.warn('未发现导入失败数据');
        }
    };

    return (
        <>
            {authKey ? (
                <AuthButton onClick={open} logFalse authKey={authKey}>
                    批量导入
                </AuthButton>
            ) : (
                <Button onClick={open}>批量导入</Button>
            )}
            <Modal title={title || '批量导入'} onCancel={onCancel} visible={visible} footer={<CustomModalFooter render={customModalFooterRender} />} destroyOnClose>
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
                        <Button type="link" onClick={downFile}>
                            下载模版
                        </Button>
                    </div>
                    <div className="upload-response-container">
                            <span>
                                总数: <span className="upload-response-num">{uploadData?.totalNum || 0}</span>
                            </span>
                        <span>
                                已导入: <span className="upload-response-num">{uploadData?.successNum || 0}</span>
                            </span>
                        <span>
                                未导入: <span className="upload-response-num">{uploadData?.failNum || 0}</span>
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

export default BatchImport;
