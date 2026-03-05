import React from 'react';
import "./index.css";

// todo 联通暂时空状态不显示值
var customizeRenderEmpty = function customizeRenderEmpty() {
  return /*#__PURE__*/React.createElement("div", {
    className: "oss-imp-alarm-empty"
  }, /*#__PURE__*/React.createElement("p", {
    className: "oss-imp-alarm-empty-show",
    style: {
      display: 'none'
    }
  }, "\u6CA1\u6709\u6EE1\u8DB3\u6761\u4EF6\u7684\u6570\u636E"));
};
export default customizeRenderEmpty;