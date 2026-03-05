function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Divider } from 'oss-ui';
import { getViewItemData } from '../../../alarm-window/common/proxy';
import { rightClickViewPageArgs } from '../../../alarm-window/alarm-show-config';
import { _ } from 'oss-web-toolkits';
import dayjs from 'dayjs';
var Component = function Component(props) {
  var record = props.record;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    context = _useState2[0],
    setContext = _useState2[1];
  useEffect(function () {
    var viewPageArgs = {};
    _.forEach(rightClickViewPageArgs, function (item) {
      var _record$0$item$fieldN;
      viewPageArgs[item.label] = (_record$0$item$fieldN = record[0][item.fieldName]) === null || _record$0$item$fieldN === void 0 ? void 0 : _record$0$item$fieldN.value;
    });
    var viewItemId = 'pretreatmentInfo';
    var viewPageId = 'alarm-detail';
    var callback = function callback(result) {
      result.forEach(function (item, index) {
        item.index = index + 1;
      });
      setContext(result);
    };
    getViewItemData({
      viewPageArgs: viewPageArgs,
      viewItemId: viewItemId,
      viewPageId: viewPageId,
      callback: callback
    });
    return function () {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", null, !_.isEmpty(context) && context.map(function (item, index) {
    return /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", null, item.index, ".\u9884\u5904\u7406\u4EBA\uFF1A", item.userName_format, "\uFF1B\xA0\xA0"), /*#__PURE__*/React.createElement("span", null, "\u9884\u5904\u7406\u65F6\u95F4\uFF1A", dayjs(Number(item.recordTime_format)).format('YYYY-MM-DD HH:mm:ss'), "\uFF1B\xA0\xA0"), /*#__PURE__*/React.createElement("span", null, "\u9884\u5904\u7406\u7ED3\u679C\u6B63\u6587\uFF1A"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("pre", null, "{".concat(item.content_format, "}"))), index !== context.length - 1 && /*#__PURE__*/React.createElement(Divider, {
      dashed: true,
      style: {
        borderWidth: '1.5px 0 0'
      }
    }));
  })));
};
export default Component;