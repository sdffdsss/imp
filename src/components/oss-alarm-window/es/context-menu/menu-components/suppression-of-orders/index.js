import React from 'react';
import { Input, Form } from 'oss-ui';
import "../alarm-acknowledgement/index.css";
var Component = function Component(props) {
  var menuComponentFormRef = props.menuComponentFormRef,
    key = props.menuInfo.key;
  var titles = {
    SuppressionOfOrders: '取消告警派单原因：',
    AlarmCallUnSend: '取消IVR呼叫原因：'
  };
  return /*#__PURE__*/React.createElement(Form, {
    ref: menuComponentFormRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "alarm-acknowledgement-textarea"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alarm-acknowledgement-label"
  }, titles[key]), /*#__PURE__*/React.createElement(Form.Item, {
    name: "reason"
  }, /*#__PURE__*/React.createElement(Input.TextArea, {
    autoSize: {
      minRows: 6,
      maxRows: 10
    }
  }))));
};
export default Component;