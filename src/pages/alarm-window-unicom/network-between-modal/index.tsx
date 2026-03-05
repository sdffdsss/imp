import React from 'react';
import { Modal } from 'oss-ui';
import ModalContent from './modal-content';
import './index.less';

interface Iprops {
    visible: boolean;
    setVisible: (flag: boolean) => void;
    viewData: any;
}
const NetworkBetweenModal = (props: Iprops) => {
    const { visible, setVisible, viewData } = props;
    return (
        <Modal
            title="网内网间备注上报"
            maskClosable={false}
            bodyStyle={{ padding: '16px 16px 0 16px', height: '600px' }}
            width={1500}
            visible={visible}
            footer={null}
            onCancel={() => setVisible(false)}
            destroyOnClose
        >
            <ModalContent viewData={viewData} />
        </Modal>
    );
};
export default NetworkBetweenModal;
