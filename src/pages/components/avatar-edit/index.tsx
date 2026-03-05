//  @ts-nocheck
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button, Icon, message, Modal } from 'oss-ui';
// eslint-disable-next-line import/no-extraneous-dependencies
import Cropper from 'react-cropper';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css';
import shareActions from '@Src/share/actions';
import useLoginInfoModel from '@Src/hox';
import { getSelfAvatar, saveUserAvatar } from './api';
import UserLogo from './img/user-logo.png';
import UserLogoDarkBlue from './img/user-logo-darkBlue.png';
import './index.less';

const { actions, messageTypes } = shareActions;
const MyImageClipper = forwardRef(({ defaultImage }, ref) => {
    const [image, setImage] = useState(defaultImage);

    const cropperRef = useRef();

    const onChange = (e) => {
        const { files } = e.target;
        const [fileInfo] = [...files];
        const { size, type } = fileInfo;
        const correctFormat = ['image/bmp', 'image/jpeg', 'image/png'];

        if (!correctFormat.includes(type)) {
            message.error('仅支持上传BMP/JPEG/PNG的图片');
            return;
        }
        const sizeMb = size / 1024 / 1024;
        if (sizeMb > 3) {
            message.error('图片大小不能超过3M');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(fileInfo);
    };

    useImperativeHandle(ref, () => {
        return {
            getCropData: () => {
                if (!image) {
                    return '';
                }
                return cropperRef.current.getCroppedCanvas().toDataURL('image/jpeg', 1.0);
            },
        };
    });

    return (
        <div className="image-cropper-content-wrapper">
            <div className="left">
                {!!image && (
                    <Cropper
                        ref={cropperRef}
                        style={{ height: 200, width: 200 }}
                        // zoomTo={0.5}
                        initialAspectRatio={1}
                        aspectRatio={1}
                        preview=".img-preview"
                        src={image}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        autoCropArea={1}
                        checkOrientation={false}
                        guides={false}
                        dragMode="move"
                        center={false}
                    />
                )}
                {!image && (
                    <div className="input-upload-wrapper">
                        <input type="file" accept="image/bmp,image/jpeg,image/png" onChange={onChange} />
                        <div className="avatar-upload-content">
                            <Icon antdIcon style={{ fontSize: '30px', color: '#ccc' }} type="CloudUploadOutlined" />
                            <Button type="link" style={{ fontSize: '12px' }}>
                                点击上传头像
                            </Button>
                        </div>
                    </div>
                )}
                <div style={{ marginTop: '10px', paddingLeft: '5px' }}>
                    <div>1.支持BMP/JPEG/PNG格式的图片</div>
                    <div>2.大小不超过3M</div>
                </div>
            </div>
            <div className="reset-upload-wrapper">
                {!!image && <input type="file" accept="image/bmp,image/jpeg,image/png" onChange={onChange} />}
                <Button disabled={!image} type="link">
                    重新上传
                </Button>
            </div>
            <div className="right">
                <div>头像预览</div>
                <div className="img-preview" />
            </div>
        </div>
    );
});
const Index = forwardRef((props: { size: number; theme?: string }, ref) => {
    const { size = 100, theme } = props;
    const { systemInfo } = useLoginInfoModel();
    const [isUseDefault, setIsUseDefault] = useState(true);
    const [showImage, setShowImage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const avatarRef: any = useRef(null);
    const MyImageClipperRef = useRef(null);

    const ImageClipperOk = () => {
        const url = MyImageClipperRef.current.getCropData();

        if (!url) {
            message.warn('请先上传图片');
            return;
        }

        function dataURLtoFile(dataurl, filename = 'file') {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const suffix = mime.split('/')[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            // eslint-disable-next-line no-plusplus
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], `${filename}.${suffix}`, { type: mime });
        }

        const formData = new FormData();
        const file = dataURLtoFile(url);
        formData.append('file', file);

        saveUserAvatar(formData).then((res) => {
            if (res.code === 200) {
                message.success('头像修改成功！');
                // shareActions.actions.setGlobalState?.({ avatarBase64Url: url });
                actions.postMessage?.(messageTypes.switchUserAvatar, url);
                setShowImage(url);
                setIsUseDefault(false);
                setModalVisible(false);
            } else {
                message.success('头像修改失败！');
            }
        });
    };
    const ImageClipperCancel = () => {
        setModalVisible(false);
    };

    useImperativeHandle(ref, () => {
        return {
            getIsUseDefault: () => {
                return isUseDefault;
            },

            getBlobData: () => {
                function dataURLtoFile(dataurl, filename = 'file') {
                    const arr = dataurl.split(',');
                    const mime = arr[0].match(/:(.*?);/)[1];
                    const suffix = mime.split('/')[1];
                    const bstr = atob(arr[1]);
                    let n = bstr.length;
                    const u8arr = new Uint8Array(n);
                    // eslint-disable-next-line no-plusplus
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    return new File([u8arr], `${filename}.${suffix}`, { type: mime });
                }

                console.log('first', showImage);

                return dataURLtoFile(showImage);
            },
        };
    });

    useEffect(() => {
        getSelfAvatar().then((res) => {
            if (res.code === 200 && res.data?.avatar) {
                setIsUseDefault(false);
                setShowImage(res.data?.avatar);
            } else {
                setIsUseDefault(true);
                setShowImage('');
            }
            setLoading(false);
        });
    }, []);

    return (
        <div ref={avatarRef} className="common-avatar-show-wrapper" style={{ width: size, height: size }}>
            <div className="avatar-img-wrapper">
                {loading && <div className="placeholder" />}
                {!loading &&
                    (isUseDefault ? (
                        <img src={systemInfo.theme === 'light' ? UserLogo : UserLogoDarkBlue} alt="userLogo" />
                    ) : (
                        <img src={showImage} alt="" />
                    ))}
                <div
                    className="edit-mask"
                    onClick={() => {
                        setModalVisible(true);
                    }}
                >
                    <Icon style={{ fontSize: '28px' }} antdIcon type="EditOutlined" />
                </div>
            </div>
            <Modal
                bodyStyle={{ height: '100%', padding: '14px 24px' }}
                width="420px"
                title="编辑头像"
                // getContainer={avatarRef.current}
                destroyOnClose
                maskClosable={false}
                visible={modalVisible}
                onCancel={ImageClipperCancel}
                wrapClassName={`avatar-edit-modal-wrapper ${theme || systemInfo.theme}`}
                footer={
                    <>
                        <Button type="primary" onClick={ImageClipperOk}>
                            确定
                        </Button>
                        <Button type="ghost" onClick={ImageClipperCancel}>
                            取消
                        </Button>
                    </>
                }
            >
                <MyImageClipper ref={MyImageClipperRef} defaultImage={showImage} />
            </Modal>
        </div>
    );
});
export default Index;
