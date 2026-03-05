import React from 'react';
import './style.less';
import { Modal, Carousel, Image } from 'oss-ui';
// import img3 from '../img/3.png';

interface SelectOptionJson {
    src: string;
    key: number;
}

interface ImgDetailModalProps {
    visible: boolean;
    closeModal: () => void;
    imgList: SelectOptionJson[];
}

const ImgDetail = (props: ImgDetailModalProps) => {
    const { visible, closeModal, imgList } = props;

    return (
        <Modal
            title="照片查看"
            visible={visible}
            width={540}
            className="img-detail-content"
            destroyOnClose={true}
            maskClosable={false}
            onOk={() => {
                closeModal();
            }}
            footer={null}
            onCancel={() => {
                closeModal();
            }}
        >
            <div className="img-detail">
                <Carousel>
                    {imgList &&
                        imgList.map((items) => {
                            return (
                                <div key={items.key}>
                                    <Image width={500} height={500} preview={false} src={items.src} />
                                </div>
                            );
                        })}
                </Carousel>
            </div>
        </Modal>
    );
};
export default ImgDetail;
