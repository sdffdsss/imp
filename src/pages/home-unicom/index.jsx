import React, { useEffect } from 'react';
import useLoginInfoModel from '@Src/hox';
import { getShiftOfDuty } from './common/api';
import _isEmpty from 'lodash/isEmpty';
import shareActions from '@Src/share/actions';
const typeList = ['/unicom/home/home-work', '/unicom/home/troubleshooting-workbench'];
const HomeUnicom = () => {
    const { actions, messageTypes } = shareActions;
    const login = useLoginInfoModel();
    const getDefaultUsers = async () => {
        const { systemInfo, userId, userInfo } = login;
        let userInfos = userInfo ? JSON.parse(userInfo) : null;
        let zoneId = userInfos?.zones[0]?.zoneId;
        if (userInfos?.zones[0]?.zoneLevel === '3') {
            zoneId = userInfos?.zones[0]?.parentZoneId;
        }
        if (systemInfo.currentZone?.zoneId) {
            zoneId = systemInfo.currentZone?.zoneId;
        }
        let res = await getShiftOfDuty(userId);
        let operationsList = typeList.filter((item) =>
            userInfos.operations?.find((record) => record.path === `/znjk/${constants.CUR_ENVIRONMENT}/main${item}`),
        );
        if (res) {
            if (res.resultCode === '1' || res.resultCode === '2') {
                if (actions?.postMessage) {
                    actions.postMessage(messageTypes.openRoute, {
                        entry: `/unicom/management-home-page/change-shifts-page`,
                    });
                }
            } else if (res.resultCode === '0') {
                if (actions?.postMessage) {
                    actions.postMessage(messageTypes.openRoute, {
                        entry: `/unicom/management-home-page`,
                        // search:{
                        //     code:res.resultCode
                        // }
                    });
                }
            } else {
                if (actions?.postMessage && operationsList && operationsList.length > 0) {
                    actions.postMessage(messageTypes.openRoute, {
                        entry: operationsList[0] || `/unicom/home/home-work`,
                        // search:{
                        //     code:res.resultCode
                        // }
                    });
                }
            }
        }
        // let res = await getDefaultUser(userId, zoneId);

        // if (res?.rows && !_isEmpty(res?.rows || [])) {
        //     if (res.rows.find((item) => String(item.provinceId) === zoneId)) {
        //         setType('team');
        //     } else {
        //         setType('default');
        //     }
        // } else {
        //     setType('default');
        // }
    };
    useEffect(() => {
        getDefaultUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <></>;
};

export default HomeUnicom;
