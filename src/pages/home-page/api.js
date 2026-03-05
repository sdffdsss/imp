import request from "@Common/api";

/**
 * @description: 获取监控中心列表
 * @param {*}
 * @return {*}
 */
export const getCenterList = (data) => {
  return request("v1/monitor-center", {
    type: "get",
    baseUrlType: "monitorSetUrl",
    showErrorMessage: false,
    showSuccessMessage: false,
    data,
  });
};

/**
 * @description: 获取地市列表
 * @param {*}
 * @return {*}
 */
export const getProvinceRegions = (provinceId, userId) => {
  return new Promise((reslove) => {
    request("group/findProvinceRegions", {
      type: "post",
      baseUrlType: "groupUrl",
      showSuccessMessage: false,
      defaultErrorMessage: "获取数据失败",
      data: {
        parentRegionId: provinceId,
        creator: userId,
      },
    }).then((res) => {
      if (res && Array.isArray(res)) {
        const handleList = res;
        reslove(handleList);
      }
    });
  });
};

/**
 * @description: 获取省列表
 * @param {*}
 * @return {*}
 */
export const getProvinceData = (userId) => {
  return new Promise((reslove) => {
    request("group/findProvinces", {
      type: "post",
      baseUrlType: "groupUrl",
      showSuccessMessage: false,
      defaultErrorMessage: "获取省份数据失败",
      data: {
        creator: userId,
      },
    }).then((res) => {
      reslove(res);
    });
  });
};

/**
 * @description: 查询过滤器省份专业地市集合
 * @param {*}
 * @return {*}
 */
export const getFilterDetailByFilterIds = (data) => {
  return request("alarmmodel/filter/v1/getFilterDetailByFilterIds", {
    type: "post",
    baseUrlType: "filterUrl",
    showErrorMessage: false,
    showSuccessMessage: false,
    data,
  });
};

/**
 * @description: 查询资源统计数据
 * @param {*}
 * @return {*}
 */
export const findGroupByUser = (data) => {
  return request("schedule/findGroupByUser", {
    type: "post",
    baseUrlType: "groupUrl",
    showErrorMessage: false,
    showSuccessMessage: false,
    data,
  });
};

/**
 * @description: 查询资源统计数据
 * @param {*}
 * @return {*}
 */
export const findResourceStatistics = (data) => {
  return request("schedule/findResourceStatistics", {
    type: "post",
    baseUrlType: "groupUrl",
    showErrorMessage: false,
    showSuccessMessage: false,
    data,
  });
};

/**
 * @description: 获取监控视图模版
 * @param {*}
 * @return {*}
 */
export const getMonitorView = (data) => {
  return request(`v1/monitor-views/new/${data}`, {
    type: "get",
    baseUrlType: "monitorSetUrl",
    showErrorMessage: true,
  });
};

/**
 * @description: 获取默认监控视图
 * @param {*}
 * @return {*}
 */

export const getDefaultViews = (groupId) => {
  const requestUrl = `v1/monitor-view/getMonitorViewByGroupId/${groupId}`;
  return request(requestUrl, {
    type: "get",
    baseUrlType: "monitorSetUrl",
    showErrorMessage: true,
  });
};
