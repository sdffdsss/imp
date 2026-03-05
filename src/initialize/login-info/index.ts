import useLoginInfoModel from '@Src/hox';
import constants from '@Common/constants';
import { initCurrentZoneInfo, initCurrentZoneLevelFlags } from './utils';

const {
    //
    setUserName,
    setUserId,
    setIsAdmin,
    setUserInfo,
    setSystemInfo,
    setLoginId,
    setCurrentZone,
    setZoneLevelFlags,
    setProvinceId,
    setMgmtZones,
    setParsedUserInfo,
    setAuthKeyMap,
} = useLoginInfoModel.data;

export function setLoginInfo(data) {
    const { userInfo, systemInfo, authKeyMap = {} } = data;

    const currentZone = initCurrentZoneInfo(systemInfo, userInfo);
    const { userName, userId, loginId, isAdmin, mgmtZones } = userInfo || {};

    setUserName(userName);
    setUserId(userId);
    setLoginId(loginId);
    setIsAdmin(isAdmin);
    setUserInfo(userInfo && JSON.stringify(userInfo));
    setParsedUserInfo(userInfo);
    setSystemInfo(systemInfo);
    setCurrentZone(currentZone);
    setZoneLevelFlags(initCurrentZoneLevelFlags(currentZone, userInfo));
    setProvinceId(currentZone.zoneId);
    setMgmtZones(mgmtZones ?? []);
    setAuthKeyMap(authKeyMap);
}

const fetchJson = (url: string) => fetch(url).then((res) => res.json());

export function initTestLoginInfo() {
    // 本次测试不同用户时切换此处类型
    // 集团: country 1 大区: region eastRegion 5 省: province 2 市: city 2 区县: county 会报错（目前无区县用户）
    const testUserType = 'jsznjk';

    return Promise.all([
        fetchJson(`${constants.STATIC_PATH}/mock/login-info/${testUserType}.json`),
        fetchJson(`${constants.STATIC_PATH}/mock/login-info/authKeyMap.json`),
    ]).then((res) => {
        const [mockUserInfo, mockAuthKeyMap] = res;

        setLoginInfo({ ...mockUserInfo, authKeyMap: mockAuthKeyMap });
    });
}
