import React from "react";
import Icon, { ClockCircleOutlined, TeamOutlined } from "@ant-design/icons";
import TimeRender from "./show-time";
import MessageSvg from "../svgs/icon/monitor-center.png";
import MessageSvg2 from "../svgs/icon/group.png";
import MessageSvg3 from "../svgs/icon/time.png";
import UserLogo from "../svgs/icon/user-logo.png";
import constants from "@Src/common/constants";
import "../index.less";

const Index = (props) => {
  const { userInfo, groupData, centerData, theme, currentGroup, startTime } =
    props;
  const userLogo = `${constants.STATIC_PATH}/images/u2045.png`;
  const iconStyle = {
    marginRight: "5px",
    border: "1px solid white",
    boxShadow: "1px 1px 3px 0px rgba(130,130,130,0.30)",
    padding: "5px",
    height: "26px",
    width: "26px",
    display: "flex",
    borderRadius: "5px",
  };
  const divStyle = {
    display: "flex",
    lineHeight: "26px",
  };
  return (
    <div
      className="my-center oss-imp-alart-common-bg"
      // style={{ background: theme === "light" ? "white" : "" }}
    >
      <div className="my-center-portrait">
        <div
          className="logo-container"
          style={{ height: "110px", width: "110px" }}
        >
          <img height={109} width={109} src={UserLogo} alt="userLogo" />
        </div>
        <div className="header" style={{ fontWeight: "500", fontSize: 16 }}>
          <b>{userInfo.userName}</b>
        </div>
      </div>

      <div className="user-info">
        <div style={divStyle}>
          <div style={{ ...iconStyle }}>
            <img src={MessageSvg} height={13} width={13} />
          </div>
          {(currentGroup && currentGroup[0] && currentGroup[0]?.centerName) || (
            <span className="not-schedule">无监控中心</span>
          )}
        </div>
        <div style={divStyle}>
          <div style={{ ...iconStyle }}>
            <img src={MessageSvg2} height={13} width={13} />
          </div>
          {(currentGroup && currentGroup[0] && currentGroup[0]?.groupName) || (
            <span className="not-schedule">无班组</span>
          )}
        </div>
        <div style={divStyle}>
          <div style={{ ...iconStyle }}>
            <img src={MessageSvg3} height={13} width={13} />
          </div>
          <TimeRender startTime={startTime} />{" "}
        </div>
      </div>
    </div>
  );
};

export default Index;
