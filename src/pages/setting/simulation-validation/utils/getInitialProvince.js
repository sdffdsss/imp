export const getInitialProvince = (login) => {
    const province = login.systemInfo?.currentZone?.zoneId;
    const userInfo = login.userInfo;
    const info = userInfo && JSON.parse(userInfo)
    let initialProvince = info.zones[0]?.zoneId;
    if (province) {
        return initialProvince = province
    }
    if (info.zones[0]?.zoneLevel === '3') {
      initialProvince = info.zones[0]?.parentZoneId
    }
    return initialProvince;
};