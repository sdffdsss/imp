import React, { PureComponent } from 'react';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import api from '../api';
import { Upload, Icon, message, Modal } from 'oss-ui';
import UploadStatus from './uploadStatus';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';

const { Dragger } = Upload;
/** *
 * 脚本上传
 */
class index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            processData: {
                progressShow: null,
            },
            callbackStatus: true,
            progressStatus: false,
        };
    }

    /**
     * 文件上传校验
     * @param {文件对象} file
     */
    beforeUpload = (file) => {
        const fileName = file.name;
        const reg = RegExp(/.xls/, 'gi');
        if (!fileName.match(reg)) {
            message.error(`文件名：${file.name} ,不为【.xls】类型文件，请重新选择！`);
            return false;
        }
        return true;
        // return true;
    };

    initUploadLog = (file) => {
        const params = new FormData();
        const { mteamInfo, flag } = this.props;
        params.append('file', file);
        api.uploadFileLog(
            params,
            (data) => {
                if (data) {
                    const fileUrl = data.data;
                    let str = '';
                    if (mteamInfo.mteamName) {
                        str = `班组名称：${mteamInfo.mteamName}\n`;
                    }
                    let keyStr = 'maintenanceConf:import';
                    if (flag === 'upload') {
                        keyStr = 'maintenance:upload';
                    }
                    sendLogFn({ authKey: keyStr, logContext: `${str}@文件url:${fileUrl}` });
                } else {
                    console.log('日志附件cos上传失败');
                }
                return data.success;
            },
            (error) => {
                console.log('日志附件cos上传失败');
                return false;
            },
        );
    };

    /**
     * 文件上传
     * @param {*} param
     */
    uploadScripts = ({ file, onError, onSuccess }) => {
        const { curSelParmExport, onLoadResult, onUploadResult, userId, mteamInfo, mteamModel, flag } = this.props;
        this.setState({
            progressStatus: true,
            callbackStatus: true,
        });
        const params = new FormData();
        if (flag === 'upload') {
            params.append('operator', userId);
            params.append('provinceId', mteamInfo.provinceId);
            params.append(
                'columnList',
                curSelParmExport.columnList.filter((item) => !['machineRoom', 'cityName', 'transSystem', 'networkType'].includes(item)).join(';'),
            );

            params.append('file', file);
            api.uploadSender(
                params,
                (data) => {
                    if (data) {
                        // 取得文件中的
                        file.status = 'done';
                        const mess = `${data.message}\n${data.failDesc}`;
                        if (data.failNum !== 0 || data.failDesc !== '') {
                            onError('上传失败', file);
                            Modal.confirm({
                                width: '500px',
                                title: '以下数据校验失败，请修正后导入',
                                content: data.failDesc.split('.').map((item) => <p>{item}</p>),
                            });
                        } else {
                            if (data.failDesc !== '') {
                                message.warn(data.failDesc);
                            }
                            // 记录上传文件
                            this.initUploadLog(file);
                            onSuccess('上传成功', file);
                            onUploadResult && onUploadResult('success');
                        }
                    } else {
                        onError('上传失败', file);
                        file.status = 'error';
                        // onLoadResult('上传失败详情');
                    }
                    return data.success;
                },
                (error) => {
                    file.status = 'error';
                    onError('error', file);
                    return false;
                },
            );
        } else {
            params.append('operator', userId);
            params.append('provinceName', curSelParmExport?.province?.regionName || mteamInfo.provinceName);
            params.append('file', file);
            params.append(
                'columnList',
                curSelParmExport.columnList.filter((item) => !['machineRoom', 'cityName', 'transSystem', 'networkType'].includes(item)).join(';'),
            );
            params.append('mteamModel', mteamModel);
            api.uploadScripts(
                params,
                (data) => {
                    if (data) {
                        // 记录上传文件
                        this.initUploadLog(file);
                        // 取得文件中的
                        file.status = 'done';
                        onSuccess('上传成功', file);
                        const mess = `${data.message}\n${data.failDesc}`;
                        // onLoadResult(mess);
                    } else {
                        onError('上传失败', file);
                        file.status = 'error';
                        // onLoadResult('上传失败详情');
                    }
                    return data.success;
                },
                (error) => {
                    file.status = 'error';
                    onError('error', file);
                    return false;
                },
            );
        }
    };

    componentDidMount() {
        const { userId } = this.props;
        api.importProcess({
            operator: userId,
        }).then((res) => {
            if (res) {
                this.setState({
                    processData: res || {},
                });
                if (res.progressShow && res.progressShow === '100%') {
                    this.setState({
                        callbackStatus: false,
                    });
                }
                if (res.progressShow === null) {
                    this.setState({
                        callbackStatus: false,
                    });
                }
            } else {
                this.setState({
                    processData: {},
                    callbackStatus: false,
                });
            }
        });
    }

    getCallBackStatus = (e) => {
        this.setState({
            callbackStatus: e,
        });
    };

    getwarningMessage = () => {
        if (moment().isSameOrBefore(moment().format('YYYY-MM-DD 07:00:00'))) {
            return '此刻修改今日排班，不会立即生效，将于今日9点开始生效';
        } else if (moment().isAfter(moment().format('YYYY-MM-DD 07:00:00')) && moment().isSameOrBefore(moment().format('YYYY-MM-DD 12:00:00'))) {
            return '此刻修改今日排班，不会立即生效，将于今日14点开始生效';
        } else if (moment().isAfter(moment().format('YYYY-MM-DD 12:00:00')) && moment().isSameOrBefore(moment().format('YYYY-MM-DD 17:00:00'))) {
            return '此刻修改今日排班，不会立即生效，将于今日18点开始生效';
        } else {
            return '此刻修改今日排班，不会立即生效，将于明日9点开始生效';
        }
    };

    render() {
        const uploadProps = {
            customRequest: this.uploadScripts,

            // accept: '.xlsx', //允许的文件格式
            beforeUpload: this.beforeUpload,
        };
        const { progressStatus } = this.state;
        const { userId, flag, curSelParmExport, mteamInfo } = this.props;
        return (
            <div>
                <Dragger {...uploadProps}>
                    <p className="oss-ui-upload-drag-icon">
                        <Icon antdIcon type="InboxOutlined" />
                    </p>
                    <p className="oss-ui-upload-text">单击或拖动文件到此区域</p>
                    <p className="oss-ui-upload-hint">仅支持单文件上传【.xlsx】、【.xls】类型文件 ,不支持多文件上传</p>
                </Dragger>
                {flag !== 'upload' && (
                    <UploadStatus
                        userId={userId}
                        curSelParmExport={this.props.curSelParmExport}
                        mteamInfo={this.props.mteamInfo}
                        callbackStatus={this.getCallBackStatus}
                        status={progressStatus}
                    />
                )}
                {/* <div style={{ color: 'red' }}>{this.getwarningMessage()}</div> */}
            </div>
        );
    }
}

export default index;
