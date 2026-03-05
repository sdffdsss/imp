// @ts-nocheck
import React, { forwardRef, useRef } from 'react';
import ATMModal from '@Pages/network-cutover/atm/Modals/action-modal';

export default forwardRef(({ onOk, ...otherProps }) => {
    const ref1 = useRef({
        reload: () => {
            onOk();
        },
    });

    return <ATMModal tableRef={ref1} {...otherProps} />;
});
