// @ts-nocheck
import React, { forwardRef, useRef } from 'react';
import InternetModal from '@Pages/network-cutover/internet/Modals/action-modal';

export default forwardRef(({ onOk, ...otherProps }) => {
    const ref1 = useRef({
        reload: () => {
            onOk();
        },
    });

    return <InternetModal tableRef={ref1} {...otherProps} enums={{ groupSourceEnum: otherProps?.groupSourceEnum, ...otherProps.enums }} />;
});
