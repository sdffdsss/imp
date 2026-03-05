import React, { useState, useEffect } from 'react';
import { Button } from 'oss-ui';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import _isEmpty from 'lodash/isEmpty';
import _omit from 'lodash/omit';
import { logAddButton } from '@Common/api/service/log';
import { isBoolean } from 'lodash';

const AuthButton = (props) => {
    const { authKey, children, mode, onClick, addLog, logFalse, hasSpecialAuth, isDebug, ...otherProps } = props;
    const [isShow, setIsShow] = useState(false);
    const { userInfo, systemInfo, userId, userName } = useLoginInfoModel();
    const { operationsButton = [], zones, operations = [] } = JSON.parse(userInfo);
    const [systemFlag, setSystemFlag] = useState(false);
    const buttonAuthorize = useEnvironmentModel?.data?.environment?.buttonAuthorize;
    useEffect(() => {
        if (operationsButton) {
            const hasAuth = !_isEmpty(operationsButton) && operationsButton.find((item) => item.key === authKey);
            const moduleObj = !_isEmpty(operations) && operations.find((item) => item.operId === hasAuth?.parentOperId);
            const operationTime = new Date().toISOString();
            setIsShow(
                hasAuth
                    ? {
                          operName: hasAuth?.operName,
                          operationId: hasAuth?.operId,
                          userId,
                          appId: moduleObj?.appId,
                          moduleId: moduleObj?.parentOperId,
                          operationTime,
                          zoneId: zones[0]?.zoneId,
                      }
                    : false,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onClick]);

    useEffect(() => {
        if (systemInfo?.currentZone?.zoneId) {
            if (!zones?.find((item) => item.zoneId === systemInfo?.currentZone?.zoneId)) {
                setSystemFlag(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const addLogClick = (field, ...args) => {
        onClick(field, ...args);
        // if (logFalse) {
        //     return;
        // }
        let apiLog = _omit(field.description, ['operName']);
        let data = {
            ...apiLog,
            operationContent: `用户${userName} ${new Date().toISOString()}点击了${field.description.operName}按钮`,
        };
        logAddButton(data);
    };
    const addLogClicks = (...args) => {
        // if (operationsButton && isShow && !logFalse) {
        if (operationsButton && isShow) {
            let apiLog = _omit(isShow, ['operName']);
            let data = {
                ...apiLog,
                operationContent: `用户${userName} ${new Date().toISOString()}点击了${isShow?.operName}按钮`,
            };
            logAddButton(data);
        }

        onClick(...args);
    };
    // eslint-disable-next-line no-nested-ternary
    return systemInfo?.currentZone?.zoneId ? (
        systemFlag ? (
            <Button
                id={authKey}
                onClick={(...args) => (addLog ? addLogClick({ description: isShow }, ...args) : addLogClicks(...args))}
                disabled={(hasSpecialAuth ? false : true) && !isDebug}
                {...otherProps}
            >
                {children}
            </Button>
        ) : !buttonAuthorize || isShow ? (
            <Button
                id={authKey}
                onClick={(...args) => (addLog ? addLogClick({ description: isShow }, ...args) : addLogClicks(...args))}
                disabled={(isBoolean(hasSpecialAuth) && !hasSpecialAuth ? true : false) && !isDebug}
                {...otherProps}
            >
                {children}
            </Button>
        ) : mode === 'disabled' ? (
            <Button
                id={authKey}
                onClick={(...args) => (addLog ? addLogClick({ description: isShow }, ...args) : addLogClicks(...args))}
                disabled
                {...otherProps}
            >
                {children}
            </Button>
        ) : null
    ) : !buttonAuthorize || isShow ? (
        <Button
            id={authKey}
            onClick={(...args) => (addLog ? addLogClick({ description: isShow }, ...args) : addLogClicks(...args))}
            disabled={(isBoolean(hasSpecialAuth) && !hasSpecialAuth ? true : false) && !isDebug}
            {...otherProps}
        >
            {children}
        </Button>
    ) : mode === 'disabled' ? (
        <Button
            id={authKey}
            onClick={(...args) => (addLog ? addLogClick({ description: isShow }, ...args) : addLogClicks(...args))}
            disabled
            {...otherProps}
        >
            {children}
        </Button>
    ) : null;
};
AuthButton.defaultProps = {
    mode: undefined,
};
export default AuthButton;
