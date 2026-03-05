function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { Fragment, useState, useEffect } from 'react';
import { Input } from 'oss-ui';
import { rightClickViewPageArgs } from '../../../alarm-window/alarm-show-config';
import { getViewItemData } from '../../../alarm-window/common/proxy';
import { _ } from 'oss-web-toolkits';
import dayjs from 'dayjs';
var Component = function Component(props) {
  var _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    context = _useState2[0],
    setContext = _useState2[1];
  var record = props.record,
    key = props.menuInfo.key;
  var titles = {
    AlarmCallCheck: 'IVR呼叫详情：',
    AlarmAcknowledgementCheck: '告警确认信息：'
  };
  var viewItemIds = {
    AlarmCallCheck: 'callInfo',
    AlarmAcknowledgementCheck: 'ackInfo'
  };
  var getContext = {
    AlarmCallCheck: function AlarmCallCheck(data) {
      return "\u6B63\u6587\uFF1A".concat(data.content);
    },
    AlarmAcknowledgementCheck: function AlarmAcknowledgementCheck(data) {
      return "\u786E\u8BA4\u4EBA\uFF1A".concat(data.ackUser, "\n\u65F6\u95F4\uFF1A").concat(data.ackTime ? dayjs(Number(data.ackTime)).format('YYYY-MM-DD HH:mm:ss') : '', "\n\u6B63\u6587\uFF1A").concat(data.content);
    }
  };
  useEffect(function () {
    var viewPageArgs = {};
    _.forEach(rightClickViewPageArgs, function (item) {
      var _record$0$item$fieldN;
      viewPageArgs[item.label] = (_record$0$item$fieldN = record[0][item.fieldName]) === null || _record$0$item$fieldN === void 0 ? void 0 : _record$0$item$fieldN.value;
    });
    var viewItemId = viewItemIds[key];
    var viewPageId = 'alarm-detail';
    var callback = function callback(result) {
      if (result && result[0]) {
        var showContext = getContext[key](result[0]);
        setContext(showContext);
      }
    };
    getViewItemData({
      viewPageArgs: viewPageArgs,
      viewItemId: viewItemId,
      viewPageId: viewPageId,
      callback: callback
    });
    return function () {};
  }, []);
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '16px'
    }
  }, titles[key]), /*#__PURE__*/React.createElement(Input.TextArea, {
    disabled: true,
    rows: 4,
    value: context
  }));
};
export default Component;