/* eslint-disable consistent-return */
import request from "@Src/common/api";

const queryAlarmResource = (data) => {
  return request("paasquery/queryAlarmResource", {
    type: "post",
    baseUrlType: "filter",
    showSuccessMessage: false,
    defaultErrorMessage: false,
    data,
  });
};

export { queryAlarmResource };
