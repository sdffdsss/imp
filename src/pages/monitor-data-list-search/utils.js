// 框架省份切换
export const getInitialProvince = (province, userInfo) => {
  const info = userInfo && JSON.parse(userInfo);
  let initialProvince = info.zones[0]?.zoneId;
  if (province) {
    return (initialProvince = province);
  }
  if (info.zones[0]?.zoneLevel === "3") {
    initialProvince = info.zones[0]?.parentZoneId;
  }
  return initialProvince;
};

export const sectionToChinese = (section) => {
  var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var chnUnitChar = ["", "十", "百", "千", "万", "亿", "万亿", "亿亿"];
  var strIns = "",
    chnStr = "";
  var unitPos = 0;
  var zero = true;
  while (section > 0) {
    var v = section % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    section = Math.floor(section / 10);
  }
  return chnStr;
};

const itmeSource = {
  name: "名称",
  startTime: "开始时间",
  type: "类型",
  endTime: "结束时间",
};

export const defineScheduleData = (data) => {
  const { date, advanceTime, delayTime } = data;
  if (!date || !Array.isArray(date)) {
    return "请完善班次";
  }
  let flag = false;
  date.map((item) => {
    Object.keys(item).forEach((itm) => {
      if (!item[itm] && item[itm] !== 0) {
        flag = itm;
      }
    });
  });
  if (flag) {
    return `请完善班次${itmeSource[flag]}`;
  }
  console.log(advanceTime);
  if (!advanceTime || !delayTime) {
    return "请完善提前/延后时间";
  }
  return "success";
};
