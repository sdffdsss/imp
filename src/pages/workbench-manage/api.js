import request from "@Common/api";

export const getWorkStationConfigurationDict = (data) => {
  return request("v1/workStation/getWorkStationConfigurationDict", {
    type: "get",
    baseUrlType: "indexUrl",
    showErrorMessage: false,
    showSuccessMessage: false,
    data,
  });
};

