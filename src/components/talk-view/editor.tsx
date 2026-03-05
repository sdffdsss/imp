import React, { useState, useEffect, useRef } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { Upload, Button, Icon, message } from 'oss-ui';
import { useEnvironmentModel } from '@Src/hox';
import _slice from 'lodash/slice';
import { uploadFiled } from './api';

function utf16toEntities(str) {
    const patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    const strs = str.replace(patt, function (char) {
        let H, L, code;
        if (char.length === 2) {
            H = char.charCodeAt(0); // 取出高位
            L = char.charCodeAt(1); // 取出低位
            code = (H - 0xd800) * 0x400 + 0x10000 + L - 0xdc00; // 转换算法
            return '&#' + code + ';';
        } else {
            return char;
        }
    });
    return strs;
}
// interface imageDataType {
//     imageUrl: string;
//     imageBase64: string;
// }
const EditorIndex = ({ onSaveChange, saveActiveImageChange, uploadFileChange, sheetSend }) => {
    const uploadAnyList: any = useRef([]);
    const editRef: any = useRef();
    const [editorState, setEditorState] = useState(null);
    //   state = {
    //       editorState: null
    //   }

    useEffect(() => {
        setEditorState(BraftEditor.createEditorState(null));
    }, []);

    const handleEditorChange = (value) => {
        setEditorState(value);
    };
    const submitContent = (value) => {
        const list = value.toRAW(true)?.blocks.map((item) => {
            return utf16toEntities(item.text);
        });
        if (list.length === 0) {
            message.warning('发送内容不能为空');
        }
        const data = list.join('\r\n');
        // const list = value.toRAW(true)?.entityMap.map(item=>{
        //     return item.
        // })

        onSaveChange(data);
        editRef?.current?.clearEditorContent();
    };
    const mockUpload = async ({ file }) => {
        // setVisible(false);
        // await setTimeout(() => {}, 1000);
        console.log(file);
        const oFileReader = new FileReader();
        oFileReader.readAsDataURL(file);
        if (uploadAnyList.current.find((item) => item === file)) {
            throw new Error('超过最大数量');
        }
        await new Promise((resolve) =>
            setTimeout(() => {
                let sendData = '';
                const image = new window.Image();
                image.src = typeof oFileReader?.result === 'string' ? oFileReader?.result : '';
                image.onload = () => {
                    //创建一个image对象，给canvas绘制使用
                    const cvs = document.createElement('canvas');
                    let scale = 1;
                    if (image.width > 1000 || image.height > 1000) {
                        //1000只是示例，可以根据具体的要求去设定
                        if (image.width > image.height) {
                            scale = 1000 / image.width;
                        } else {
                            scale = 1000 / image.height;
                        }
                    }
                    cvs.width = image.width * scale;
                    cvs.height = image.height * scale; //计算等比缩小后图片宽高
                    const ctx = cvs.getContext('2d');
                    ctx?.drawImage(image, 0, 0, cvs.width, cvs.height);
                    sendData = cvs.toDataURL(file.type, 0.8); //重新生成图片，<span style="font-family: Arial, Helvetica, sans-serif;">fileType为用户选择的图片类型</span>
                    // sendData = newImageData.replace('data:' + file.type + ';base64,', '');
                    console.log(sendData);
                    sendData && saveActiveImageChange(sendData);
                };
                // console.log('方式一》》》》》》》》》', base64);

                resolve({
                    url: URL.createObjectURL(file),
                });
            }, 500),
        );
        // console.log(URL.createObjectURL(file))
        // return {
        //     url: URL.createObjectURL(file),
        // };
    };
    const mockUploadBefore = (file, files) => {
        uploadAnyList.current = [];
        console.log(files);
        if (files && files.length > 7) {
            message.warning(`最多选择 ${7} 张图片`);
            const list = _slice(files, 7, files.length);
            uploadAnyList.current = list;

            return file;
        }
        return file;
    };
    const fileUploadChange = async (info) => {
        if (info.file.status === 'uploading') {
            uploadFileChange(info.file.name, info.file.lastModified, 'loading');
        }
        if (info.file.status === 'done') {
            console.log(info);
            // uploadFileChange(info.file.name, info.file.lastModified, 'done');
        } else if (info.file.status === 'error') {
            uploadFileChange(info.file.name, info.file.lastModified, 'error');
        }
    };
    const fileUpload = async ({ file, onError, onSuccess }) => {
        const formData = new FormData();
        formData.append('file', file);
        const result = await uploadFiled(formData);
        if (result.code === 200) {
            onSuccess('上传成功', file);
            uploadFileChange(result.data.fileName, file.lastModified, 'done');
        } else {
            onError('上传失败', file);
        }
    };
    const onkeydown = (e, value) => {
        if (e === 'split-block') {
            const list = value.toRAW(true)?.blocks.map((item) => {
                return utf16toEntities(item.text);
            });
            if (list.length === 0) {
                message.warning('发送内容不能为空');
            }
            const data = list.join('\r\n');
            // const list = value.toRAW(true)?.entityMap.map(item=>{
            //     return item.
            // })
            onSaveChange(data);
            //
            editRef?.current?.clearEditorContent();
        }
    };
    const beforeUploadFile = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 50;
        if (!isLt2M) {
            message.error('文件大小不能超过50MB');
        }
        return isLt2M;
    };
    // const uploadHandler = () => {};
    const extendControls: any = [
        'separator',
        {
            key: 'uploader-tp',
            type: 'component',
            component: (
                <Upload accept="image/*" showUploadList={false} customRequest={mockUpload} beforeUpload={mockUploadBefore}>
                    {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                    <Button className="control-item button upload-button" data-title="插入图片">
                        <Icon type="PictureOutlined" antdIcon />
                    </Button>
                </Upload>
            ),
        },
        'separator',
        {
            key: 'uploader-file',
            type: 'component',
            component: (
                <Upload
                    accept="file/*"
                    showUploadList={false}
                    onChange={fileUploadChange}
                    // @ts-ignore
                    customRequest={(e) => fileUpload(e)}
                    // action={`${useEnvironmentModel?.data?.environment?.chatUrl.direct}/v1/groups/import`}
                    beforeUpload={beforeUploadFile}
                >
                    {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                    <Button className="control-item button upload-button" data-title="上传文件">
                        <Icon type="FolderOutlined" antdIcon />
                    </Button>
                </Upload>
            ),
        },
        'separator',
        {
            key: 'my-button', // 控件唯一标识，必传
            type: 'component',
            component: (
                <Button className="control-item button upload-button" data-title="发送工单" onClick={sheetSend}>
                    <Icon type="FileDoneOutlined" antdIcon />
                </Button>
            ),
        },
    ];
    return (
        <div className="my-component">
            <BraftEditor
                ref={editRef}
                value={editorState}
                onChange={handleEditorChange}
                controls={['emoji']}
                extendControls={extendControls}
                contentClassName={'my-component-editor'}
                // onSave={submitContent}
                handleKeyCommand={onkeydown}
                // hooks={
                //     {
                //         'exec-editor-command':()=>{

                //         }
                //     }
                // }
            />
            <div style={{ padding: 5, textAlign: 'right' }}>
                <Button onClick={() => submitContent(editorState)}>发送</Button>
            </div>
        </div>
    );
};
export default EditorIndex;
