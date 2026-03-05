import { _ } from 'oss-web-toolkits';
import dayjs from 'dayjs';
import useLoginInfoModel from '@Src/hox';
import request from '@Src/common/api';
import { UnauthorizedDisplayMode } from './types';

export function genAuthResult(params) {
    const { loginInfo, buttonAuthorize, authKey, unauthorizedDisplayMode } = params;

    const { parsedUserInfo, currentZone } = loginInfo;
    const { operationsButton = [], zones } = parsedUserInfo;

    let hasAuth = false;
    let show = false;
    let disabled = false;

    if (currentZone?.zoneId) {
        if (!zones?.find((item) => item.zoneId === currentZone?.zoneId)) {
            show = true;
            disabled = true;
            hasAuth = false;

            return { show, disabled, hasAuth };
        }
    }

    if (!buttonAuthorize) {
        show = true;
        hasAuth = true;
    } else {
        let foundButtonItem;

        if (!_.isEmpty(operationsButton)) {
            foundButtonItem = operationsButton.find((item) => item.key === authKey);
        }
        if (foundButtonItem) {
            show = true;
            hasAuth = true;
        }
    }

    if (unauthorizedDisplayMode === UnauthorizedDisplayMode.disabled) {
        show = true;
        disabled = !hasAuth;
    }

    return { show, disabled, hasAuth };
}

export function sendLogFn(params) {
    const { authKey, logContext } = params;

    const { userName, userId, parsedUserInfo, systemInfo, authKeyMap } = useLoginInfoModel.data;
    const { appId = '110002' } = systemInfo;
    const { operName, operId } = authKeyMap?.[authKey] || {};
    if (!operId) return;
    const operationTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    localStorage.setItem('operId', operId);
    const data = {
        appId,
        operationId: operId,
        userId,
        operationContent: logContext || `${userName} ${operationTime} 点击了${operName}`,
        operationTime,
        zoneId: parsedUserInfo?.zones[0]?.zoneId,
    };

    request('api/logs/operation/new', {
        data,
        baseUrlType: 'userMangeUrl',
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
    });
}
