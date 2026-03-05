import React from 'react';
import { Upload, Modal, Icon, message, Form } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import './index.less';
import request from '@Common/api';
import { _ } from 'oss-web-toolkits';

let fileDatas = [];
class UploadFile extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [
                // {
                //     uid: '-1',
                //     name: 'image.png',
                //     status: 'done',
                //     url: '',
                // },
            ],
        };
    }

    componentDidMount() {
        this.setState({
            fileList: this.props.fileInfos,
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.fileInfos !== prevProps.fileInfos) {
            this.setState({
                fileList: this.props.fileInfos,
            });
        }
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = (file) => {
        if (!file.url && !file.preview) {
            file.preview = this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    handleChange = ({ fileList }) => {
        this.setState({ fileList: fileList?.filter((item) => Boolean(item.status)) || [] });
    };

    beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === 'image/bmp' ||
            file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.type === 'application/vnd.ms-excel' ||
            file.type === 'application/msword' ||
            file.type === 'application/pdf' ||
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
            file.type === 'application/vnd.ms-powerpoint';
        if (!isJpgOrPng) {
            message.error('请上传正确格式文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('文件大小不能超过10M!');
        }
        return isJpgOrPng && isLt2M;
    };

    /**
     * @description: 导入文件
     * @param {*}
     * @return {*}
     */
    handleImportFile = (data) => {
        const {
            login: { userId },
            schedulingObj,
        } = this.props;
        const { file } = data;
        const params = new FormData();
        params.append('files', file);
        params.append('userId', userId);
        params.append('workShiftId', schedulingObj?.workShiftId);
        params.append('dateTime ', schedulingObj?.dateTime);
        request('shiftingOfDuty/uploudFile', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data: params,
        }).then((res) => {
            if (res.resultCode === '200') {
                let { fileList } = this.state;
                let newFileList = fileList.map((item) => {
                    if (item.uid === file.uid) {
                        return {
                            ...item,
                            status: 'done',
                        };
                    } else {
                        return {
                            ...item,
                        };
                    }
                });
                let newFileListVal = fileList.filter((item) => item.uid === file.uid);
                this.props.changefile(newFileList, newFileListVal);
            } else {
                message.warning('导入失败！');
            }
        });
    };

    onDownload = (data) => {
        request('shiftingOfDuty/dowloadFile', {
            type: 'GET',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data: {
                filePath: data.url + '/' + data.name,
            },
            responseType: 'blob',
        }).then((res) => {
            // type 为需要导出的文件类型，此处为xls表格类型
            const blob = new Blob([res]);
            // 兼容不同浏览器的URL对象
            const url = window.URL || window.webkitURL || window.moxURL;
            // 创建下载链接
            const downloadHref = url.createObjectURL(blob);
            // 创建a标签并为其添加属性
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadHref;
            downloadLink.download = data.name;
            // 触发点击事件执行下载
            downloadLink.click();
        });
    };

    deleteFile = (data) => {
        request('shiftingOfDuty/deleteFile', {
            type: 'DELETE',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            params: { filePath: `${data.url}/${data.name}` },
            data: {
                filePath: `${data.url}/${data.name}`,
            },
        }).then((res) => {
            if (res.resultCode === '200') {
                //   let { fileList } = this.state;
                //  let newFileListVal = fileList.filter((item) => item.uid === data.uid);
                // _.remove(fileList, (o) => o.uid === data.uid);
                //  this.props.changefile(fileList, newFileListVal);
                this.props.delData(data.uid);
            } else {
                message.warning('删除附件失败！');
            }
        });
    };

    render() {
        const { fileList } = this.state;
        const { operation } = this.props;

        const uploadButton = (
            <div>
                <Icon antdIcon type="PlusOutlined" />
                {/* <div className="oss-ui-upload-text">上传</div> */}
            </div>
        );
        return (
            <div className="clearfix">
                <Form>
                    <Form.Item label="附件" name="photos">
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={false}
                            onChange={this.handleChange}
                            customRequest={this.handleImportFile}
                            multiple={false}
                            onRemove={this.deleteFile}
                            onDownload={this.onDownload}
                            beforeUpload={this.beforeUpload}
                            accept=".ppt, .doc, .docx, .pdf, .xls, .xlsx, .pptx, .jpg, .png, .bmp"
                            showUploadList={false}
                        >
                            {fileList.length >= 6 || operation === 'readonly' ? null : uploadButton}
                        </Upload>
                        {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal> */}
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(UploadFile);
