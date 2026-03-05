import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, message, Upload, Radio, InputNumber, Typography, Button, Row, Col } from 'oss-ui';
import type { IModalContentProps } from './types';
import { getImportTemplate, importFileApi, downloadReasonApi } from '../api';
import { blobDownLoad } from '@Common/utils/download';
import moment from 'moment';
import useLoginInfoModel from '@Src/hox';

export default forwardRef((props: IModalContentProps, ref) => {
    const [importFile, setImportFile] = useState(null);
    const [importRes, setImportRes] = useState(null);
    const { currentZone, userId } = useLoginInfoModel();

    const downloadTemplate = () => {
        getImportTemplate().then((res) => {
            if (res) {
                blobDownLoad(res, `网络故障集中存档-模板.xlsx`);
            }
        });
    };

    const downloadReason = () => {
        downloadReasonApi(importRes?.errorFileName).then((res) => {
            if (res) {
                blobDownLoad(res, importRes?.errorFileName);
            }
        });
    };

    const changeFile = (file) => {
        setImportFile(file);
        return false;
    };

    const ImportFile = () => {
        if (!importFile?.name.endsWith('.xls') && !importFile?.name.endsWith('.xlsx')) {
            message.error('导入失败，导入文件仅支持.xls或.xlsx，请重新选择文件');
            return;
        }

        const formData = new FormData();

        formData.append('file', importFile);
        importFileApi(currentZone?.zoneId, userId, formData).then((res) => {
            if (res?.data) {
                setImportRes(res?.data);
                // message.success('导入成功');
            } else {
                message.error(res?.message);
            }
        });
    };

    return (
        <>
            <Row>
                <Col span={4} offset={1} style={{ lineHeight: '28px', textAlign: 'right' }}>
                    上传文件：
                </Col>
                <Col span={6}>
                    <Input style={{ width: '100%' }} value={importFile?.name} disabled />
                </Col>
                <Col span={12} offset={1}>
                    <Upload showUploadList={false} beforeUpload={(file) => changeFile(file)} accept=".xls, .xlsx">
                        <Button type="primary" style={{ marginRight: 10 }}>
                            选择文件
                        </Button>
                    </Upload>
                    <Button type="primary" style={{ marginRight: 10 }} disabled={!importFile} onClick={() => ImportFile()}>
                        导入
                    </Button>
                    <Button type="link" style={{ marginLeft: '20px' }} onClick={downloadTemplate}>
                        下载模板
                    </Button>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col span={4} offset={5}>
                    总数：<span style={{ color: 'red' }}>{importRes?.total}</span>
                </Col>
                <Col span={4}>
                    已导入：<span style={{ color: 'red' }}>{importRes?.success}</span>
                </Col>
                <Col span={4}>
                    未导入：<span style={{ color: 'red' }}>{importRes?.fail}</span>
                </Col>
                <Col span={4}>
                    <Button type="link" style={{ marginLeft: '20px' }} disabled={!importRes || importRes.fail === 0} onClick={downloadReason}>
                        失败原因下载
                    </Button>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px', color: 'red', paddingLeft: 100 }}>每次导入最多支持10000条</Row>
        </>
    );
});
