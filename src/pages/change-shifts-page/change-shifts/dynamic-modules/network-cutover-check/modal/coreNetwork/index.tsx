// @ts-nocheck
import React, { forwardRef, useRef } from 'react';
import CoreModal from '@Pages/network-cutover/core/Modals/action-modal';

export default forwardRef(({ onOk, ...otherProps }) => {
    const ref1 = useRef({
        reload: () => {
            onOk();
        },
    });

    return <CoreModal tableRef={ref1} {...otherProps} enums={{ groupSourceEnum: otherProps?.groupSourceEnum, ...otherProps.enums }} />;
});
