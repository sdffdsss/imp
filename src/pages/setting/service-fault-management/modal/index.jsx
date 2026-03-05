import React from 'react';
import { Modal } from 'oss-ui';
import CompUpload from '../upload';

const IndexModal = (props) => {
    const { isModalOpen, handleCancel, onUploadResult, type, majorId, provinceId, userName } = props;

    // 导入
    const curSelParmExport = async () => {};

    return (
        <>
            <Modal title="导入" visible={isModalOpen} width={600} destroyOnClose onCancel={handleCancel} footer={null}>
                <CompUpload
                    majorId={majorId}
                    provinceId={provinceId}
                    userName={userName}
                    curSelParmExport={curSelParmExport}
                    onUploadResult={onUploadResult}
                    type={type}
                />
            </Modal>
        </>
    );
};

export default IndexModal;
