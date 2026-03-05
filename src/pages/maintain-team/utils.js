// 框架省份切换
export const getInitialProvince = (province,userInfo) => {
    const info = userInfo && JSON.parse(userInfo)
    let initialProvince = info.zones[0]?.zoneId;
    if(province){
        return initialProvince = province
    }
    if(info.zones[0]?.zoneLevel === '3'){
      initialProvince = info.zones[0]?.parentZoneId
    }
    return initialProvince;
};

// 判断用户权限
export const defineUserRole = (id,userInfo) => {
  const { zones } = JSON.parse(userInfo);
  let role = "";
  if (zones[0]?.zoneLevel === "1") {
    if (id !== "0") {
      role = "集团账号非集团省份";
    } else {
      role = "集团";
    }
  }
  return role;
};
