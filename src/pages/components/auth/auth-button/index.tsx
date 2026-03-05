import React from 'react';
import { Button } from 'oss-ui';
import { ButtonProps } from 'antd/lib/button';
import AuthContainer from '../auth-container';
import { IAuthProps, ILogProps } from '../types';

export default function Index(props: IAuthProps & ILogProps & ButtonProps) {
    const { authKey, sendLog, unauthorizedDisplayMode, ignoreAuth, ...otherProps } = props;

    return (
        <AuthContainer authKey={authKey} sendLog={sendLog} unauthorizedDisplayMode={unauthorizedDisplayMode} ignoreAuth={ignoreAuth}>
            <Button {...otherProps} />
        </AuthContainer>
    );
}
