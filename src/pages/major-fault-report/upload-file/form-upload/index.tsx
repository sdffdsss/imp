import React, { useState, useEffect } from 'react';
import { Upload, Button, Icon, message } from 'oss-ui';
import moment from 'moment';
import downloadAccessory from '@Src/pages/fault-report/components/file-down/download';
import { updateReportFiles } from '../../api';
import './style.less';

interface Props {
    value?: [];
    onChange?: (data) => void;
    isWireless?: boolean;
    flagId: number | string | null;
}

const FormUpload: React.FC<Props> = (props) => {
    const { onChange, value, isWireless, flagId } = props;

    const [fileList, setFileList] = useState<any>(value || []);
    const [fileSessionId] = useState<string>(String(moment().valueOf()));

    const defineFileType = (name: any) => {
        const resourceFile = name.substring(name.lastIndexOf('.') + 1);
        if (
            resourceFile === 'doc' ||
            resourceFile === 'doc'.toUpperCase() ||
            resourceFile === 'docx' ||
            resourceFile === 'docx'.toUpperCase() ||
            resourceFile === 'wps' ||
            resourceFile === 'wps'.toUpperCase() ||
            resourceFile === 'xls' ||
            resourceFile === 'xls'.toUpperCase() ||
            resourceFile === 'xlsx' ||
            resourceFile === 'xlsx'.toUpperCase() ||
            resourceFile === 'pdf' ||
            resourceFile === 'pdf'.toUpperCase() ||
            resourceFile === 'gif' ||
            resourceFile === 'gif'.toUpperCase() ||
            resourceFile === 'jpg' ||
            resourceFile === 'jpg'.toUpperCase() ||
            resourceFile === 'jpeg' ||
            resourceFile === 'jpeg'.toUpperCase() ||
            resourceFile === 'bmp' ||
            resourceFile === 'bmp'.toUpperCase() ||
            resourceFile === 'png' ||
            resourceFile === 'png'.toUpperCase() ||
            resourceFile === 'ppt' ||
            resourceFile === 'ppt'.toUpperCase() ||
            resourceFile === 'pptx' ||
            resourceFile === 'pptx'.toUpperCase()
        ) {
            return true;
        }
        message.error(`不支持上传${resourceFile}类型的文件！`);
        return false;
    };

    // 数组对象去重
    function uniqueFunc(arr, uniId) {
        const res = new Map();
        return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
    }

    const handleChange = (info) => {
        let newList = [...info.fileList];
        newList = newList.map((file) => {
            if (file.response) {
                // eslint-disable-next-line no-param-reassign
                file.folderName = file.response.filePath;
                // eslint-disable-next-line no-param-reassign
                file.originalFileName = file.response.fileName;
            }
            return file;
        });
        newList = uniqueFunc(newList, 'name');
        const newLis: any = [];
        newList.forEach((item) => {
            if ((!item.size || item.size / 1024 / 1024 < 2) && defineFileType(item.name)) {
                newLis.push(item);
            }
        });

        // setFileList(newLis);
        const formData = newLis.map((item) => {
            return {
                ...item,
                folderName: item.folderName,
                originalFileName: item.originalFileName,
                fileSessionId,
                flagId,
            };
        });
        onChange?.(formData);
    };

    const onDownload = (file) => {
        downloadAccessory(file);
    };
    const onRemove = (file) => {
        console.log(file);

        // fileDelete({
        //     filePath:file.
        // })
    };

    // eslint-disable-next-line consistent-return
    const uploadScripts = async ({ file, onError, onSuccess }: any) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M && defineFileType(file.name)) {
            return message.error('文件大小不能超过2M');
        }
        const params = new FormData();
        params.append('file', file);
        params.append('fileSessionId', fileSessionId);
        params.append('flagId', `${flagId}`);

        const data = await updateReportFiles(params);
        if (data.code === 200) {
            onSuccess(data?.data, file);
        } else {
            onError(data?.data, file);
        }
    };

    useEffect(() => {
        setFileList(
            (value || []).map((item: any) => {
                return { ...item, name: item.originalFileName, status: item.status || 'done' };
            }),
        );
    }, [value]);

    return (
        <Upload
            customRequest={uploadScripts}
            onChange={handleChange}
            onDownload={onDownload}
            onRemove={onRemove}
            fileList={fileList}
            maxCount={10}
            showUploadList={{ showDownloadIcon: true }}
            className="fault-report-form-upload"
            accept=".ppt, .pptx, .doc, .docx, .pdf, .xls, .xlsx, .gif, .jpg, .jpeg, .bmp, .png"
            multiple={false}
        >
            <Button disabled={fileList.length >= 10} icon={<Icon type="UploadOutlined" antdIcon />}>
                上传文件
            </Button>
            <p>
                {isWireless && <span style={{ color: '#f00' }}>终报后，应及时在此处上传省公司审核的故障报告。</span>}
                附件支持上传图片/word/excel/ppt/pdf文件；每个附件不超过2M
            </p>
        </Upload>
    );
};

export default FormUpload;
