import { getInitialProvince } from "./getInitialProvince";

export function getUserProvinceId(login) {
  const zoneInfo = JSON.parse(login.userInfo)?.zones || [];
  const currentProvince = getInitialProvince(login);
  if (zoneInfo.some(item => item.zoneId === currentProvince)) {
    return currentProvince;
  }
  return zoneInfo[0]?.zoneId;
}

export function getUserProvinceName(login) {
  const zoneInfo = JSON.parse(login.userInfo)?.zones || [];
  const currentProvince = getInitialProvince(login);
  const target = zoneInfo.find(item => item.zoneId === currentProvince);
  if (target) {
    return target.zoneName;
  }
  return zoneInfo[0]?.zoneName;
}

export function getUserInfoPlus(login) {
  const userInfo = JSON.parse(login.userInfo);
  const zoneInfo = userInfo?.zones;
  return {
    userProvinceId: getUserProvinceId(login),
    groupUser: zoneInfo && zoneInfo[0]?.zoneLevel ? parseInt(zoneInfo[0].zoneLevel, 10) === 1 : false,
    userId: login.userId,
    userProvinceName: getUserProvinceName(login),
    ...userInfo
  }
}
