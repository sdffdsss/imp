import request from "@Common/api";

export const getTypes = () => {
    return request(
        `/alarmmodel/filter/v1/recovery/field`,
        {
          type: "get",
          baseUrlType: "filterUrl",
          showErrorMessage: false,
          showSuccessMessage: false,
        }
      );
}
export const getStatus = () => {
    return request(
        `/alarmmodel/filter/v1/filter/getDictByFieldName?fieldName=Ticket Status`,
        {
          type: "get",
          baseUrlType: "filterUrl",
          showErrorMessage: false,
          showSuccessMessage: false,
        }
      );
}
