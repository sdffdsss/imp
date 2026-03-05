import React from 'react';
import { Modal, Input } from 'oss-ui';
import CustomModalFooter from '../../custom-modal-footer';
import downloadAccessory from '../download';
import { DataSource } from '../type';

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    dataSource: DataSource;
}

const DispatchDetailsModal: React.FC<Props> = (props) => {
    const { visible, setVisible, dataSource } = props;
    const { operateType, operateDetail, files = [] } = dataSource;

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <Modal
            title={`${operateType}详情`}
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={600}
            footer={
                <CustomModalFooter
                    onCancel={() => {
                        setVisible(false);
                    }}
                    onOk={handleOk}
                    cancelButtonProps={{
                        style: {
                            display: 'none',
                        },
                    }}
                />
            }
        >
            <h4>{`${operateType}详情`}</h4>
            <Input.TextArea disabled rows={4} value={operateDetail} />
            {files && files.length > 0 && (
                <h4 style={{ marginTop: 20 }}>
                    附件：
                </h4>
            )}

            <div>
                {files?.map((item, index) => {
                    return (
                        <a key={index} style={{ marginRight: 10 }} onClick={() => {downloadAccessory(item)}}>
                            {item.attOrigName}
                        </a>
                    );
                })}
            </div>
        </Modal>
    );
};

export default DispatchDetailsModal;
