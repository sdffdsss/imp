function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState } from 'react';
import { Tabs } from 'oss-ui';
import FilterInfo from './filter-info';
import "./index.css";
var Index = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var filterId = props.filterId,
    filterNameList = props.filterNameList,
    moduleIdList = props.moduleIdList,
    externalComp = props.externalComp;
  var FilterInfoNew = externalComp === null || externalComp === void 0 ? void 0 : externalComp.FilterInfo;
  var _useState = useState(props.filterId && props.filterId.toString().split(',')[0]),
    _useState2 = _slicedToArray(_useState, 2),
    activeKey = _useState2[0],
    seActiveKey = _useState2[1];
  var onTabChange = function onTabChange(activeKey) {
    seActiveKey(activeKey);
  };
  var TabPane = Tabs.TabPane;
  return /*#__PURE__*/React.createElement("div", {
    className: "toolbar-filter-info-new"
  }, /*#__PURE__*/React.createElement(Tabs, {
    type: "card",
    onChange: onTabChange,
    activeKey: activeKey,
    tabBarStyle: {
      margin: '0 0 -1px'
    }
  }, filterId && filterId.toString().split(',').map(function (filterItem, index) {
    return /*#__PURE__*/React.createElement(TabPane, {
      tab: filterNameList && filterNameList.toString().split(',')[index],
      key: filterItem
    }, FilterInfoNew ? /*#__PURE__*/React.createElement(FilterInfoNew, {
      filter: {
        filterId: filterItem
      },
      moduleId: moduleIdList ? moduleIdList.toString().split(',')[index] : '1'
    }) : /*#__PURE__*/React.createElement(FilterInfo, {
      data: {
        filterId: filterItem
      }
    }));
  })));
});
export default Index;