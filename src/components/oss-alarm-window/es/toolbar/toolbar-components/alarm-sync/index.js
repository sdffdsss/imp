function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState } from 'react';
import { Card, Form, InputNumber, Radio, Checkbox, DatePicker, Divider, Row, Col } from 'oss-ui';
import { produce } from 'immer';
import dateHelper from './date';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import DateRangeTime from '../../date-range-time';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
var radioStyle = {
  display: 'block',
  height: '70px',
  lineHeight: '30px',
  marginBottom: '30px'
};
var radioStyleShort = {
  display: 'block',
  height: '20px',
  lineHeight: '20px'
};
var Setting = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var onToolDateChange = props.onToolDateChange;
  var _Form$useForm = Form.useForm(),
    _Form$useForm2 = _slicedToArray(_Form$useForm, 1),
    form = _Form$useForm2[0];
  var _useState = useState({
      beginTimeStr: null,
      endTimeStr: null,
      clearCurrentData: false,
      aheadSecond: 86400,
      type: 3
    }),
    _useState2 = _slicedToArray(_useState, 2),
    syncData = _useState2[0],
    setSyncData = _useState2[1];
  var dtfmt = 'YYYY-MM-DD HH:mm:ss';
  var onFinish = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(value) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            onToolDateChange(syncData);
          case 1:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function onFinish(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  var onChange = function onChange(e) {
    setSyncData(produce(syncData, function (draft) {
      draft.clearCurrentData = e.target.checked;
    }));
  };
  var onDateRangeChange = function onDateRangeChange(time) {
    var nextSyncData = produce(syncData, function (draft) {
      draft.beginTimeStr = dateHelper.format(new Date(time[0]), 'yyyy-MM-dd hh:mm:ss');
      draft.endTimeStr = dateHelper.format(new Date(time[1]), 'yyyy-MM-dd hh:mm:ss');
    });
    setSyncData(nextSyncData);
  };
  var onTypeChange = function onTypeChange(e) {
    var nextSyncData;
    if (e.target.value === 1) {
      nextSyncData = produce(syncData, function (draft) {
        draft.beginTimeStr = dayjs(new Date() - 86400000).format(dtfmt);
        draft.endTimeStr = dayjs(new Date()).format(dtfmt);
        draft.type = e.target.value;
      });
    } else {
      nextSyncData = produce(syncData, function (draft) {
        draft.type = e.target.value;
      });
    }
    setSyncData(nextSyncData);
  };
  var onSecondChange = function onSecondChange(num) {
    var nextSyncData = produce(syncData, function (draft) {
      draft.aheadSecond = Number(num) * 3600;
    });
    setSyncData(nextSyncData);
  };
  function disabledDate(current, disabledDates) {
    // Can not select days before today and today
    return current && current < dayjs().subtract(3, 'day').endOf('day') || disabledDates && disabledDates(current);
  }
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Form, {
    ref: ref,
    form: form,
    name: "form_in_modal",
    onFinish: onFinish
  }, /*#__PURE__*/React.createElement(Form.Item, {
    labelCol: {
      span: 8
    }
  }, /*#__PURE__*/React.createElement(Radio.Group, {
    onChange: function onChange(e) {
      return onTypeChange(e);
    },
    value: syncData.type
  }, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Col, {
    span: 24
  }, /*#__PURE__*/React.createElement(Radio, {
    style: radioStyle,
    value: 1
  }, "\u8BF7\u9009\u62E9\u540C\u6B65\u65F6\u95F4\u6BB5", /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '5px'
    }
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "date-picker",
    rules: [{
      required: syncData.type === 1 && (syncData.beginTimeStr === null || syncData.endTimeStr === null),
      message: '请选择同步时间段'
    }]
  }, /*#__PURE__*/React.createElement(DateRangeTime, {
    locale: locale,
    format: syncData.type === 1 && dtfmt,
    disabledDate: syncData.type === 1 && disabledDate,
    onChange: onDateRangeChange,
    showTime: syncData.type === 1 ? {
      format: 'HH:mm:ss'
    } : false,
    disabled: syncData.type === 1 ? false : true
  }))))), /*#__PURE__*/React.createElement(Col, {
    span: 24
  }, /*#__PURE__*/React.createElement(Radio, {
    style: radioStyle,
    value: 2
  }, "\u9ED8\u8BA4\u65F6\u95F4\u6BB5", /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '5px'
    }
  }, "\u540C\u6B65\u524D", /*#__PURE__*/React.createElement(InputNumber, {
    style: {
      marginLeft: '10px',
      marginRight: '10px',
      width: '80px'
    },
    onChange: onSecondChange,
    value: Number(syncData.aheadSecond) / 3600,
    min: 1
  }), "\u5C0F\u65F6"))), /*#__PURE__*/React.createElement(Col, {
    span: 24
  }, /*#__PURE__*/React.createElement(Radio, {
    style: radioStyleShort,
    value: 3
  }, "\u540C\u6B65\u5F53\u524D\u6240\u6709\u6D3B\u52A8\u544A\u8B66")), /*#__PURE__*/React.createElement(Col, {
    span: 24
  }, /*#__PURE__*/React.createElement(Divider, {
    dashed: true,
    style: {
      width: ' 100%',
      borderColor: '#264f79'
    }
  })), /*#__PURE__*/React.createElement(Col, {
    span: 24
  }, /*#__PURE__*/React.createElement(Checkbox, {
    onChange: onChange,
    checked: syncData.clearCurrentData
  }, "\u6E05\u7A7A\u5F53\u524D\u7A97\u53E3\u544A\u8B66")))))));
});
export default Setting;