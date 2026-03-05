function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState } from 'react';
import { Card, Form, Radio, Space } from 'oss-ui';
import { produce } from 'immer';
import "./index.css";
var Setting = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var onToolDateChange = props.onToolDateChange,
    useCol = props.useCol;
  var _Form$useForm = Form.useForm(),
    _Form$useForm2 = _slicedToArray(_Form$useForm, 1),
    form = _Form$useForm2[0];
  var _useState = useState({
      alarmColumnFieldIds: useCol.map(function (obj) {
        return obj.id;
      }),
      alarmFieldNameList: useCol.map(function (obj) {
        return obj.field;
      }),
      // 导出文件格式： 0 csv 1 excel 2 html
      exportFileFormat: 0
    }),
    _useState2 = _slicedToArray(_useState, 2),
    data = _useState2[0],
    setData = _useState2[1];
  var onFinish = function onFinish() {
    onToolDateChange(data);
  };
  var _onChange = function onChange(exportType) {
    var nextData = {};
    nextData = produce(data, function (draft) {
      draft.exportFileFormat = exportType;
    });
    setData(nextData);
  };
  return /*#__PURE__*/React.createElement(Card, {
    bodyStyle: {
      paddingBottom: 0
    }
    //  style={{ height: '100px', marginLeft: '-38px', marginTop: '35px', marginBottom: '10px' }}
  }, /*#__PURE__*/React.createElement(Form, {
    ref: ref,
    form: form,
    name: "form_in_modal",
    onFinish: onFinish
  }, /*#__PURE__*/React.createElement(Form.Item, null, /*#__PURE__*/React.createElement(Radio.Group, {
    value: data.exportFileFormat,
    onChange: function onChange(e) {
      _onChange(e.target.value);
    }
  }, /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Radio, {
    value: 0
  }, "csv"), /*#__PURE__*/React.createElement(Radio, {
    value: 1
  }, "excel"), /*#__PURE__*/React.createElement(Radio, {
    value: 2
  }, "html"))))));
});
export default Setting;