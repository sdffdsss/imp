import React from 'react';
import { Table, Form } from 'oss-ui';
import { getRecordsRecursion } from '../../../alarm-window/common/dataHandler';
import { rightClickShow2 } from '../../../alarm-window/alarm-show-config';
import "../alarm-acknowledgement/index.css";
var Component = function Component(props) {
  var record = props.record,
    menuInfo = props.menuInfo,
    menuComponentFormRef = props.menuComponentFormRef;
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
  var initialValues = {
    clientName: 'reactor-client',
    //客户端名称
    sheetNo: '',
    //工单号
    isDup: false,
    //是否判重，true/false,是，sheetNo不能为空
    repeatTimes: 2,
    //调用emos接口重试次数
    repeatInterval: 100 //重试间隔时间
  };
  return /*#__PURE__*/React.createElement(Form, {
    initialValues: initialValues,
    ref: menuComponentFormRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "alarm-acknowledgement-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alarm-acknowledgement-label"
  }, "\u544A\u8B66\u57FA\u672C\u4FE1\u606F\u5982\u4E0B:"), /*#__PURE__*/React.createElement(Table, {
    size: "small",
    dataSource: datas,
    columns: columns,
    pagination: false
  })), /*#__PURE__*/React.createElement("div", {
    className: "alarm-manual-clearing-tips"
  }, /*#__PURE__*/React.createElement("span", null, "\u4EE5\u4E0A\u5171", datas.length, "\u6761\u544A\u8B66,\u662F\u5426\u786E\u8BA4\u624B\u5DE5\u6D3E\u5355\uFF1F")));
};
export default Component;