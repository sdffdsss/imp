import React from 'react';
import { Modal } from 'oss-ui';
import Result from './content';

export default function Index({ params, visible, onCancel }) {
    return (
        <Modal visible={visible} width={1300} maskClosable={false} destroyOnClose title="光功率查询" footer={null} onCancel={onCancel}>
            <Result params={params} />
        </Modal>
    );
}
