import React, { useEffect, useState } from 'react';
import useLoginInfoModel from '@Src/hox';
import { getDefaultUser, getHomePage } from './common/api';
import _isEmpty from 'lodash/isEmpty';
import { Spin } from 'oss-ui';
import shareActions from '@Src/share/actions';
import './style.less';
function urlSplit(str) {
    const searchList = _.trimStart(str, '?').split('&');
    let urlObj = {};
    searchList.forEach((item) => {
        const list = item.split('=');
        urlObj = {
            ...urlObj,
            [list[0]]: list[1],
        };
    });
    return urlObj;
}
const HomeUnicom = (props) => {
    const [type, setType] = useState();
    const login = useLoginInfoModel();
    console.log(window.location);
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
        let res = await getDefaultUser(userId, zoneId);
        if (res?.rows && !_isEmpty(res?.rows || [])) {
            if (res.rows.find((item) => String(item.provinceId) === zoneId)) {
                setType('team');
            } else {
                setType('default');
            }
        } else {
            setType('default');
        }
    };
    useEffect(() => {
        getDefaultUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const HomePageContent = getHomePage(type);
    return (
        <div className="home-unicom-page" style={{ width: '100%', height: '100%' }}>
            {(type && <HomePageContent />) || (
                <div className="home-unciom-page-spin">
                    <Spin spinning={type} />
                </div>
            )}
        </div>
    );
};

export default HomeUnicom;
