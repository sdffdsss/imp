export const getInitialProvince = (login) => {
    const province = login.systemInfo?.currentZone?.zoneId;
    const userInfo = login.userInfo;
    const info = userInfo && JSON.parse(userInfo);
    let initialProvince = info.zones[0]?.zoneId;
    if (province) {
        return (initialProvince = province);
    }
    if (info.zones[0]?.zoneLevel === '3') {
        initialProvince = info.zones[0]?.parentZoneId;
    }
    return initialProvince;
};
export const getInitialRegion = (login) => {
    const { systemInfo, userInfo } = login;
    const userInfoParse = (userInfo && JSON.parse(userInfo)) || {};
    const userInfos = systemInfo?.currentZone?.zoneId ? systemInfo.currentZone : userInfoParse.zones[0];
    if (userInfoParse.zones[0]?.zoneLevel === '3') {
        userInfos.zoneId = userInfoParse.zones[0]?.parentZoneId;
    }

    return userInfos;
};

export const getInitialProvinceOptions = (login) => {
    const userInfo = login.userInfo;
    const info = userInfo && JSON.parse(userInfo);
    if (login.systemInfo?.currentZone?.zoneId) {
        return [
            {
                label: login.systemInfo?.currentZone?.zoneName,
                level: login.systemInfo?.currentZone?.zoneLevel,
                value: login.systemInfo?.currentZone?.zoneId,
            },
        ];
    }
    if (info.zones[0]?.zoneLevel === '3') {
        return [
            {
                label: info.zones[0]?.parentZoneName,
                level: info.zones[0]?.parentZoneLevel,
                value: info.zones[0]?.parentZoneId,
            },
        ];
    }
    return [
        {
            value: info.zones[0]?.zoneId,
            level: info.zones[0]?.zoneLevel,
            label: info.zones[0]?.zoneName,
        },
    ];
};
