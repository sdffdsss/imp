import React from 'react';
import { Input, Form, Table } from 'oss-ui';
import { getRecordsRecursion } from '../../../alarm-window/common/dataHandler';
import { rightClickShow2 } from '../../../alarm-window/alarm-show-config';
import "./index.css";
var Component = function Component(props) {
  var menuComponentFormRef = props.menuComponentFormRef,
    record = props.record,
    menuInfo = props.menuInfo;
  var columns = rightClickShow2.map(function (item) {
    return {
      title: item.label,
      dataIndex: item.fieldName,
      ellipsis: true,
      render: function render(text, record) {
        return text === null || text === void 0 ? void 0 : text.value;
      }
    };
  });
  var datas = record; // getRecordsRecursion(record, menuInfo.isRelated);
  return /*#__PURE__*/React.createElement(Form, {
    ref: menuComponentFormRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "alarm-remark-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alarm-remark-label"
  }, "\u544A\u8B66\u57FA\u672C\u4FE1\u606F\u5982\u4E0B:"), /*#__PURE__*/React.createElement(Table, {
    size: "small",
    dataSource: datas,
    columns: columns,
    pagination: false
  })), /*#__PURE__*/React.createElement("div", {
    className: "alarm-remark-textarea"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alarm-remark-label"
  }, "\u544A\u8B66\u5907\u6CE8\u4FE1\u606F\uFF1A"), /*#__PURE__*/React.createElement(Form.Item, {
    name: "memo"
  }, /*#__PURE__*/React.createElement(Input.TextArea, {
    autoSize: {
      minRows: 6,
      maxRows: 10
    },
    placeholder: "\u8BF7\u586B\u5199\u544A\u8B66\u5907\u6CE8\u4FE1\u606F\uFF0C\u9ED8\u8BA4\u4E3A\uFF1A\u5DF2\u9605\u8BFB"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "alarm-remark-tips"
  }, /*#__PURE__*/React.createElement("span", null, "\u662F\u5426\u5907\u6CE8\uFF1A\u4EE5\u4E0A\u5171", datas.length, "\u6761\u544A\u8B66")));
};
export default Component;