import React, { cloneElement } from 'react';
import useAuthLog from '../hooks/useAuthLog';
import { TAuthContainer } from '../types';

export default function Index(props: TAuthContainer & { children: React.ReactElement }) {
    const { authKey, sendLog, unauthorizedDisplayMode, ignoreAuth, children } = props;
    const { onClick, disabled: disabledProps } = children.props;

    const { clickEventHandle, show, disabled } = useAuthLog({ authKey, onClick, sendLog, unauthorizedDisplayMode, ignoreAuth });

    if (show) {
        return cloneElement(children, { onClick: clickEventHandle, disabled: disabled || disabledProps });
    }

    return null;
}
