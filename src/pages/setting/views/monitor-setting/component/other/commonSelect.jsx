import React from "react";
import { getInitialProvince } from "../../utils";
import { Select } from "oss-ui";

const Index = (props) => {
  const { data = [], userInfo, login } = props;
  return (
    <Select
      {...props}
      //   onChange={handleProvinceChange}
      style={{ width: "100%" }}
      //   value={regionId}
      // mode="multiple"
      // maxTagCount={1}
      // filterOption={(item, itm) => {
      //     return itm.children?.includes(item);
      // }}
    >
      {data.map((item) => {
        if (item.regionId === getInitialProvince(login.systemInfo?.currentZone?.zoneId,userInfo)) {
          return (
            <Select.Option key={item.regionId} value={item.regionId}>
              {item.regionName}
            </Select.Option>
          );
        }
      })}
    </Select>
  );
};

export default Index;
