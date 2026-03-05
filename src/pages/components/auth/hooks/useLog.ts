import { useCallback } from 'react';
import { message } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { sendLogFn } from '../utils';
import { ILogProps } from '../types';

export default function useLog(props: ILogProps) {
    const { authKey, hasAuth = false, onClick, sendLog = true } = props;

    const loginInfo = useLoginInfoModel();

    const { authKeyMap } = loginInfo;
    const authorityItemLabel = authKeyMap?.[authKey]?.operName || '该功能';

    const clickEventHandle = useCallback(() => {
        if (!hasAuth) {
            message.warn(`您没有${authorityItemLabel}权限，请联系管理员在角色管理中授权`);

            return;
        }
        onClick();

        if (sendLog) {
            sendLogFn({ authKey });
        }
    }, [sendLog, onClick, hasAuth, authKey, authorityItemLabel]);

    return {
        clickEventHandle,
    };
}
