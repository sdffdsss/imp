import request from "@Src/common/api";

export const getRuleData = (data) => {
    return request("rule/base/v1/getRuleTypes", {
        type: "get",
        baseUrlType: "filterUrl",
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data
      })
}