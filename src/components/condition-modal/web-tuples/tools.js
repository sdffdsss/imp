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