import { useState } from 'react';
import { createModel } from 'hox';
import { useEnvironment } from 'oss-web-common';
import constants from '../common/constants';

export const useLoginInfo = () => {
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [loginId, setLoginId] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [userInfo, setUserInfo] = useState(JSON.stringify({}));
    const [parsedUserInfo, setParsedUserInfo] = useState({});
    const [container, setContainer] = useState(document.body);
    const [systemInfo, setSystemInfo] = useState({});
    const [uuIdValue, setUuIdValue] = useState(null);
    const [srcString, setSrcString] = useState('');

    const [currentZone, setCurrentZone] = useState({});
    const [zoneLevelFlags, setZoneLevelFlags] = useState({});
    const [provinceId, setProvinceId] = useState(null);

    const [authKeyMap, setAuthKeyMap] = useState(null);

    const [platFlag, setPlatFlag] = useState(false); // 用户是否平台专业

    /**
     * mgmtZones 当账号是集团或大区时，可以通过该数组获取其所包含的省(??市)
     */
    const [mgmtZones, setMgmtZones] = useState([]);
    // 是否是大区跨身份账号
    const isRegionAcrossProvince = parsedUserInfo?.zones?.length > 1;
    const userZoneInfo = () => {
        if (isRegionAcrossProvince) {
            const findInfo = parsedUserInfo?.zones?.find((item) => item.zoneId === currentZone?.zoneId);
            if (findInfo) {
                return {
                    zoneLevel: findInfo.zoneLevel,
                    zoneName: findInfo.zoneName,
                    zoneId: findInfo.zoneId,
                };
            }
            return {
                zoneLevel: parsedUserInfo?.zones?.[0]?.zoneLevel,
                zoneName: parsedUserInfo?.zones?.[0]?.zoneName,
                zoneId: parsedUserInfo?.zones?.[0]?.zoneId,
            };
        }
        return {
            zoneLevel: parsedUserInfo?.zones?.[0]?.zoneLevel,
            zoneName: parsedUserInfo?.zones?.[0]?.zoneName,
            zoneId: parsedUserInfo?.zones?.[0]?.zoneId,
        };
    };

    return {
        userName,
        setUserName,
        userId,
        setUserId,
        isAdmin,
        setIsAdmin,
        userInfo,
        setUserInfo,
        container,
        setContainer,
        systemInfo,
        setSystemInfo,
        uuIdValue,
        setUuIdValue,
        srcString,
        setSrcString,
        loginId,
        setLoginId,
        currentZone,
        setCurrentZone,
        zoneLevelFlags,
        setZoneLevelFlags,
        provinceId,
        setProvinceId,
        mgmtZones,
        setMgmtZones,
        parsedUserInfo,
        setParsedUserInfo,
        authKeyMap,
        setAuthKeyMap,
        userProvinceId: parsedUserInfo?.zones?.[0]?.zoneId,
        userZoneInfo: userZoneInfo(),
        isRegionAcrossProvince,
        platFlag,
        setPlatFlag,
    };
};

const isUseSeverConfig = constants.CONFIG_LOCAL !== 'true';

const settingPath = isUseSeverConfig
    ? `${constants.CONFIG_HOST}/configmanage/environment.json?isApply=true&projectName=oss-imp-unicom`
    : `${constants.MICRO_APP_URL}/environment.json`;

const alarmWindowPath = isUseSeverConfig
    ? `${constants.CONFIG_HOST}/configmanage/alarm-window.json?isApply=true&projectName=oss-imp-unicom`
    : `${constants.MICRO_APP_URL}/alarm-window.json`;
const statusConfigPath = isUseSeverConfig
    ? `${constants.CONFIG_HOST}/configmanage/status-config.json?isApply=true&projectName=oss-imp-unicom`
    : `${constants.MICRO_APP_URL}/status-config.json`;

const useEnvironmentModel = createModel(useEnvironment, {
    configPath: settingPath,
    headers: isUseSeverConfig
        ? {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
          }
        : undefined,
});

const useAlarmWindowConfigModel = createModel(useEnvironment, {
    configPath: alarmWindowPath,
    headers: isUseSeverConfig
        ? {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
          }
        : undefined,
});
const useStatusConfigModel = createModel(useEnvironment, {
    configPath: statusConfigPath,
    headers: isUseSeverConfig
        ? {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
          }
        : undefined,
});
export { useEnvironmentModel, useAlarmWindowConfigModel, useStatusConfigModel };
export default createModel(useLoginInfo);
