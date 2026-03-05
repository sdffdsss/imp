function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
  var rowSelection = {
    onChange: function onChange(selectedRowKeys, selectedRows) {
      menuComponentFormRef.current.setFieldsValue({
        hostAlarm: selectedRows
      });
    }
  };
  if ((datas === null || datas === void 0 ? void 0 : datas.length) === 1) {
    var _datas$0$alarm_id;
    rowSelection.selectedRowKeys = [(_datas$0$alarm_id = datas[0].alarm_id) === null || _datas$0$alarm_id === void 0 ? void 0 : _datas$0$alarm_id.value];
  }
  var rowKey = function rowKey(record) {
    var _record$alarm_id;
    return (_record$alarm_id = record.alarm_id) === null || _record$alarm_id === void 0 ? void 0 : _record$alarm_id.value;
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
    pagination: false,
    rowKey: rowKey,
    rowSelection: _objectSpread({
      type: 'radio'
    }, rowSelection)
  })), /*#__PURE__*/React.createElement("div", {
    className: "alarm-manual-clearing-tips"
  }, /*#__PURE__*/React.createElement("span", null, "\u4EE5\u4E0A\u5171", datas.length, "\u6761\u544A\u8B66,\u662F\u5426\u786E\u8BA4\u624B\u5DE5\u6D3E\u5355\uFF1F")));
};
export default Component;