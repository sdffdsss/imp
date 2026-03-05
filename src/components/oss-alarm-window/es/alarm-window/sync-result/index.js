import React from "react";
import { Tooltip } from 'oss-ui';
var SyncResult = function SyncResult(props) {
  var showContent;
  var syncResultInfo = props.syncResultInfo;
  if (syncResultInfo === null || syncResultInfo === void 0 ? void 0 : syncResultInfo.end) {
    showContent = syncResultInfo && "\u540C\u6B65\u5B8C\u6210\uFF0C\u5171\u8BA1".concat(syncResultInfo.size, "\u6761\uFF0C\u5171\u8BA1\u7528\u65F6").concat((syncResultInfo.time / 1000).toFixed(1), "s");
  } else {
    showContent = syncResultInfo && "\u540C\u6B65\u4E2D\uFF0C\u5DF2\u540C\u6B65".concat(syncResultInfo.size, "\u6761\uFF0C\u7528\u65F6").concat((syncResultInfo.time / 1000).toFixed(1), "s");
  }
  return /*#__PURE__*/React.createElement(Tooltip, {
    placement: "top",
    title: showContent
  }, /*#__PURE__*/React.createElement("div", {
    className: "sync-result"
  }, showContent));
};
export default SyncResult;