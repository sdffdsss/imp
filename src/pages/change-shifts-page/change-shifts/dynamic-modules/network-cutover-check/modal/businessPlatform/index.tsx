// @ts-nocheck
import React, { forwardRef, useRef } from 'react';
import BusinessModal from '@Pages/network-cutover/business/Modals/action-modal';

export default forwardRef(({ onOk, ...otherProps }) => {
    const ref1 = useRef({
        reload: () => {
            onOk();
        },
    });

    return <BusinessModal tableRef={ref1} {...otherProps} />;
});
