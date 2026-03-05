function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState } from 'react';
import { Form, Radio, Card } from 'oss-ui';
import { getRecordsRecursion } from '../../../alarm-window/common/dataHandler';
var Setting = function Setting(props) {
  var record = props.record,
    menuComponentFormRef = props.menuComponentFormRef,
    useCol = props.useCol,
    exportHtmlType = props.exportHtmlType;
  var _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    fileType = _useState2[0],
    setFileType = _useState2[1];
  var _onChange = function onChange(value) {
    setFileType(value);
    menuComponentFormRef.current.setFieldsValue({
      exportFileFormat: value
    });
  };
  var radioStyle = {
    paddingTop: '10px',
    height: '50px',
    lineHeight: '30px'
  };
  var datas = getRecordsRecursion(record, false);
  var initialValues = {
    alarmIdList: datas.map(function (item) {
      var _item$alarm_id;
      return (_item$alarm_id = item.alarm_id) === null || _item$alarm_id === void 0 ? void 0 : _item$alarm_id.value;
    }),
    alarmColumnFieldIds: useCol.map(function (obj) {
      return obj.sortFieldId;
    }),
    alarmFieldNameList: useCol.map(function (obj) {
      return obj.field;
    }),
    exportFileFormat: 0
  };
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      height: '100px'
    }
  }, /*#__PURE__*/React.createElement(Form, {
    initialValues: initialValues,
    ref: menuComponentFormRef
  }, /*#__PURE__*/React.createElement(Form.Item, null, /*#__PURE__*/React.createElement(Radio.Group, {
    value: fileType,
    onChange: function onChange(e) {
      _onChange(e.target.value);
    }
  }, /*#__PURE__*/React.createElement(Radio, {
    style: radioStyle,
    value: 0
  }, "csv"), /*#__PURE__*/React.createElement(Radio, {
    style: radioStyle,
    value: 1
  }, "excel"), exportHtmlType !== false && /*#__PURE__*/React.createElement(Radio, {
    style: radioStyle,
    value: 2
  }, "html")))));
};
export default Setting;