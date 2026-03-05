import { Upload, Button, Icon, message } from 'oss-ui';
import React, { useState, useEffect } from 'react';
import type { UploadProps } from 'antd/es/upload';
import downloadAccessory from '../file-down/download';
import style from './style.module.less';
import { fileUpload } from '../api';

const { Dragger } = Upload;

interface Props extends Partial<UploadProps> {
    value?: [];
    fileSize?: number; // 限制文件大小默认为2M
    disabled?: boolean;
    messageText?: string; // 上传提示文案
    onChange?: (data) => void;
    mode?: 'button' | 'image' | 'drag';
}
/**
 * 注意文件格式需要转换为下列格式，需要自行转换
 * [
    {
        name: '',
        url: '',
        id: ''
    },
];
*/
const FormUpload: React.FC<Props> = (props) => {
    const { onChange, value, disabled, mode = 'button', messageText, accept, fileSize = 2, ...otherProps } = props;

    const [fileList, setFileList] = useState<any>(value || []);

    // 校验文件类型
    const defineFileType = (name: any) => {
        const resourceFile = name.substring(name.lastIndexOf('.') + 1);
        const fileTypeArray = accept?.replace(/\s*/g, '').replaceAll('.', '').split(',');
        if (fileTypeArray?.some((item) => item === resourceFile || item.toUpperCase() === resourceFile)) {
            return true;
        }
        return false;
    };

    const handleChange = (info) => {
        onChange?.(info.fileList);
    };

    const onDownload = (file) => {
        downloadAccessory(file);
    };
    const onRemove = (file) => {
        console.log(file);
    };

    // eslint-disable-next-line consistent-return
    const uploadScripts = async ({ file, onError, onSuccess }: any) => {
        if (fileSize) {
            const isLt2M = file.size / 1024 / 1024 < fileSize;
            if (!isLt2M) {
                message.error('文件大小不能超过2M');
                onError(false, file);
                return;
            }
        }
        if (accept && !defineFileType(file.name)) {
            const resourceFile = file.name.substring(file.name.lastIndexOf('.') + 1);
            message.error(`不支持上传${resourceFile}类型的文件！`);
            onError(false, file);
            return;
        }
        const params = new FormData();
        params.append('file', file);
        const data = await fileUpload(params);
        if (data.code === 200) {
            onSuccess(data?.data, file);
        } else {
            onError(data?.data, file);
        }
    };

    useEffect(() => {
        setFileList(value || []);
    }, [value]);

    switch (mode) {
        case 'drag':
            return (
                <Dragger
                    customRequest={uploadScripts}
                    onChange={handleChange}
                    onDownload={onDownload}
                    onRemove={onRemove}
                    fileList={fileList}
                    showUploadList={{ showDownloadIcon: true }}
                    className={style.upload}
                    accept={accept}
                    disabled={disabled}
                    {...otherProps}
                >
                    <p className={style.icon}>
                        <Icon type="InboxOutlined" antdIcon />
                    </p>
                    <p className={style.text}>单击或拖动文件到此区域</p>
                    <p className={style.message}>{messageText}</p>
                </Dragger>
            );

        case 'image':
            return (
                <Upload
                    customRequest={uploadScripts}
                    listType="picture-card"
                    onChange={handleChange}
                    onDownload={onDownload}
                    onRemove={onRemove}
                    fileList={fileList}
                    showUploadList={{ showDownloadIcon: true }}
                    className={style.upload}
                    disabled={disabled}
                    accept={accept}
                    {...otherProps}
                >
                    {otherProps.maxCount && fileList.length >= otherProps.maxCount ? null : (
                        <div>
                            <Icon type="PlusOutlined" antdIcon />
                        </div>
                    )}
                    <p>{messageText}</p>
                </Upload>
            );

        default:
            return (
                <Upload
                    customRequest={uploadScripts}
                    onChange={handleChange}
                    onDownload={onDownload}
                    onRemove={onRemove}
                    fileList={fileList}
                    showUploadList={{ showDownloadIcon: true }}
                    className={style.upload}
                    disabled={disabled}
                    accept={accept}
                    {...otherProps}
                >
                    {!disabled && (
                        <>
                            <Button disabled={disabled} icon={<Icon type="UploadOutlined" antdIcon />} type="primary">
                                选择文件
                            </Button>
                            <p>{messageText}</p>
                        </>
                    )}
                </Upload>
            );
    }
};

export default FormUpload;
