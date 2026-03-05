import React from 'react';
import { Modal, Button, Upload, Input, Spin, message } from 'oss-ui';
import { downloadAlarmAdvice, importAlarmAdvice } from '../api';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            importFile: null,
            failUrl: '',
            spinning: false,
        };
    }

    /**
     * @description: 获取上传的file
     * @param file
     * @return
     */

    beforeFileUpload = (file) => {
        const fileName = file.name;
        const reg = RegExp(/.xlsx/, 'gi');
        if (!fileName.match(reg)) {
            message.error(`文件名：${file.name} ,不为【.xlsx】类型文件，请重新选择！`);
            return false;
        }
        this.setState({ importFile: file });
        return false;
        // return false;
    };

    /**
     * @description: 提交操作
     * @param
     * @return
     */

    onImportSubmit = async () => {
        const { importFile } = this.state;
        const { provincesList } = this.props;
        this.setSpinning(true);
        const formData = new FormData();
        const provinceNames = provincesList.map((p) => p.label).join(',');
        formData.append('file', importFile);
        formData.append('provinceNames', provinceNames);

        const result = await importAlarmAdvice(formData);
        if (result?.data?.flag) {
            message.success('导入成功');
            this.props.onImportSuccess();
        } else {
            message.error(result?.message);
            this.setState({ failUrl: result?.data.fileUrl });
        }
        this.setState({ importFile: null });
        this.setSpinning(false);
    };

    /**
     * @description: 下载模版
     * @param
     * @return
     */
    exportTemplate = async () => {
        this.setSpinning(true);
        try {
            const result = await downloadAlarmAdvice();
            this.props.onDownload(result?.data?.fileUrl);
            if (result.code === 200) {
                message.success('下载模板成功');
            } else {
                message.error('下载模板失败');
            }
            this.setSpinning(false);
            // eslint-disable-next-line no-empty
        } catch (e) {}
    };

    /**
     * @description: 关闭弹窗
     * @param
     * @return
     */
    closeImportModal = () => {
        this.props.onColseUploadModal();
    };

    /**
     * @description: 设置loading状态
     * @param n*o
     * @return n*o
     */

    setSpinning = (spinning) => {
        this.setState({
            spinning,
        });
    };

    /**
     * @description: 下载链接
     * @param n*o
     * @return n*o
     */

    download = (url) => {
        this.props.onDownload(url);
    };

    render() {
        const { spinning, importFile, failUrl } = this.state;
        return (
            <Modal title="导入经验库" visible={true} onCancel={this.closeImportModal} footer={<Button onClick={this.closeImportModal}>关闭</Button>}>
                <Spin spinning={spinning}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <span>上传文件:</span>
                        <Input value={importFile?.name} style={{ width: '150px' }} disabled />
                        <Upload showUploadList={false} beforeUpload={this.beforeFileUpload} accept=".xlsx" custom>
                            <Button type="primary">选择文件</Button>
                        </Upload>
                        <Button type="primary" disabled={!importFile?.name} onClick={this.onImportSubmit}>
                            导入
                        </Button>
                        <Button type="link" onClick={this.exportTemplate}>
                            下载模板
                        </Button>
                        <Button type="link" disabled={!failUrl} onClick={this.download.bind(this, failUrl)}>
                            详情查看
                        </Button>
                    </div>
                </Spin>
            </Modal>
        );
    }
}
