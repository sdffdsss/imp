import React from 'react';
import { Modal } from 'oss-ui';
import CompUpload from '../upload';

const IndexModal = (props) => {
    const { isModalOpen, handleCancel, onUploadResult, type, majorType, belongProvince, createdBy, majorName } = props;
    console.log(props);
    // 导入
    const curSelParmExport = async () => {};

    return (
        <>
            <Modal title="导入" visible={isModalOpen} width={600} destroyOnClose onCancel={handleCancel} footer={null}>
                <CompUpload
                    majorName={majorName}
                    majorType={majorType}
                    belongProvince={belongProvince}
                    createdBy={createdBy}
                    curSelParmExport={curSelParmExport}
                    onUploadResult={onUploadResult}
                    type={type}
                />
            </Modal>
        </>
    );
};

export default IndexModal;
