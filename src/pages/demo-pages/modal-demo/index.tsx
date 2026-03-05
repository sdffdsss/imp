import React, { useState } from 'react';
import ModalDemo from '../../components/modal-demo';

/**
 * modal业务的主页面
 */

export default function Index() {
    const [visible, setVisible] = useState(true);

    return (
        <ModalDemo
            visible={visible}
            onOk={(e) => {
                console.log(e);

                setVisible(false);
            }}
            onCancel={(e) => {
                console.log(e);

                setVisible(false);
            }}
        />
    );
}
