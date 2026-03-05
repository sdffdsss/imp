function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Menu from './menu';
import MenuCompModal from './menu-components/menu-components-container';
import { _ } from 'oss-web-toolkits';
import { getRecordsRecursion } from '../alarm-window/common/dataHandler';
import serviceConfig from '../hox';
import { message } from 'oss-ui';
var ContextMenu = function ContextMenu(props) {
  var showContextMenu = props.showContextMenu,
    originEvent = props.originEvent,
    onContextMenuClose = props.onContextMenuClose,
    menuList = props.menuList,
    selectRows = props.selectRows,
    alarmClickTarget = props.alarmClickTarget,
    getRecordsDetail = props.getRecordsDetail,
    actionMap = props.actionMap,
    extendEventMap = props.extendEventMap,
    useCol = props.useCol,
    shareActions = props.shareActions,
    exportHtmlType = props.exportHtmlType,
    getContainer = props.getContainer,
    getSubAlarmBatch = props.getSubAlarmBatch,
    tableLoading = props.tableLoading,
    experienceUrl = props.experienceUrl;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    subMenuList = _useState2[0],
    setSubMenuList = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    menuCompModal = _useState4[0],
    setMenuCompModal = _useState4[1];
  var menuRef = useRef();
  var subMenuRef = useRef();
  var modalContainer = getContainer || document.body;
  useEffect(function () {
    setSubMenuList([]);
    _handleContextMenu(originEvent, menuRef.current, false);
    return function () {};
  }, [originEvent]);
  var openMenuComponent = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(menu) {
      var actionRecords, records, nextReaords, res, alarmsWithChildren;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            onContextMenuClose();
            if (menu.isSubItem) {
              setSubMenuList([]);
            }
            actionRecords = selectRows.filter(_.partial(menu.shouldAction, _, alarmClickTarget));
            records = getRecordsRecursion(actionRecords, menu.isRelated);
            nextReaords = _toConsumableArray(records);
            if (!(menu.key === 'ManualDispatchUnicom' || menu.key === 'Supervise')) {
              _context.n = 1;
              break;
            }
            res = [];
            nextReaords.forEach(function (item) {
              var curStatus = menu.key === 'ManualDispatchUnicom' ? item.send_status : item.supv_send_status;
              if ((!curStatus || curStatus.value === '0' || curStatus.value === '1' || curStatus.value === '20' || curStatus.value === '2' || curStatus.value === '3' || curStatus.value === '4' || curStatus.value === '8' || curStatus.value === '14' || curStatus.value === '15' || curStatus.value === '17' || curStatus.value === '401' || curStatus.value === '21') && item.active_status.value === '1') {
                res.push(item);
              }
            });
            nextReaords = res;
            if (!(res.length === 0)) {
              _context.n = 1;
              break;
            }
            _toConsumableArray(actionRecords).forEach(function (item) {
              var _item$active_status;
              var curStatus = menu.key === 'ManualDispatchUnicom' ? item.send_status : item.supv_send_status;
              if ((curStatus === null || curStatus === void 0 ? void 0 : curStatus.value) === '1') {
                message.error('该告警已进入派单队列，在等待派单中，请稍等。');
                return;
              }
              if ((curStatus === null || curStatus === void 0 ? void 0 : curStatus.value) && ((curStatus === null || curStatus === void 0 ? void 0 : curStatus.value) === '5' || (curStatus === null || curStatus === void 0 ? void 0 : curStatus.value) === '6' || (curStatus === null || curStatus === void 0 ? void 0 : curStatus.value) === '7' || (curStatus === null || curStatus === void 0 ? void 0 : curStatus.value) === '9' || (curStatus === null || curStatus === void 0 ? void 0 : curStatus.value) === '10' || (curStatus === null || curStatus === void 0 ? void 0 : curStatus.value) === '11' || (curStatus === null || curStatus === void 0 ? void 0 : curStatus.value) === '12' || (curStatus === null || curStatus === void 0 ? void 0 : curStatus.value) === '13' || (curStatus === null || curStatus === void 0 ? void 0 : curStatus.value) === '16')) {
                message.error('该告警已派单成功，同一条告警不支持重复派单。');
                return;
              }
              if (((_item$active_status = item.active_status) === null || _item$active_status === void 0 ? void 0 : _item$active_status.value) !== '1') {
                message.error('该告警已清除，清除告警不支持派发工单。');
                return;
              }
            });
            return _context.a(2);
          case 1:
            if (!(getSubAlarmBatch && menu.isRelated)) {
              _context.n = 3;
              break;
            }
            tableLoading(true);
            _context.n = 2;
            return getSubAlarmBatch(actionRecords);
          case 2:
            alarmsWithChildren = _context.v;
            actionRecords = alarmsWithChildren;
            tableLoading(false);
          case 3:
            if (!(menu.pageType === 'jump')) {
              _context.n = 5;
              break;
            }
            if (!(extendEventMap && extendEventMap[menu.key])) {
              _context.n = 4;
              break;
            }
            extendEventMap[menu.key]({
              shareActions: shareActions
            });
            return _context.a(2);
          case 4:
            menu.action({
              actionRecords: nextReaords,
              getRecordsDetail: getRecordsDetail,
              frameInfo: serviceConfig.data.serviceConfig.userInfo,
              shareActions: shareActions
            });
            _context.n = 6;
            break;
          case 5:
            menu && setMenuCompModal(/*#__PURE__*/React.createElement(MenuCompModal, {
              menu: menu,
              getRecordsDetail: getRecordsDetail
              // records={records}
              ,
              actionRecords: nextReaords,
              frameInfo: serviceConfig.data.serviceConfig.userInfo,
              useCol: useCol,
              alarmClickTarget: alarmClickTarget,
              onCancel: function onCancel() {
                setMenuCompModal(null);
              },
              extendEventMap: extendEventMap,
              customAction: actionMap[menu.key],
              shareActions: shareActions,
              exportHtmlType: exportHtmlType,
              experienceUrl: experienceUrl
            }));
          case 6:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function openMenuComponent(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  var _handleContextMenu = function _handleContextMenu(event, parentRef) {
    if (event && parentRef) {
      var clickX = event.pageX;
      var clickY = event.pageY;
      var screenW = window.innerWidth;
      var screenH = window.innerHeight;
      var rootW = (parentRef === null || parentRef === void 0 ? void 0 : parentRef.offsetWidth) || 130;
      var rootH = (parentRef === null || parentRef === void 0 ? void 0 : parentRef.offsetHeight) || ((menuList === null || menuList === void 0 ? void 0 : menuList.length) || 0) * 22.4;
      var right = screenW - clickX > rootW;
      var left = !right;
      var top = screenH - clickY > rootH;
      var bottom = !top;
      if (right) {
        parentRef.style.left = "".concat(clickX + 5, "px");
      }
      if (left) {
        parentRef.style.left = "".concat(clickX - rootW - 5, "px");
      }
      if (top) {
        parentRef.style.top = "".concat(clickY + 5, "px");
      }
      if (bottom) {
        parentRef.style.top = "".concat(clickY - rootH - 5, "px");
      }
    }
  };
  var _handleContextSubMenu = function _handleContextSubMenu(event, subRef) {
    var parentRef = menuRef.current;
    if (event && subRef) {
      var clickX = event.pageX;
      var clickY = event.pageY;
      var screenW = window.innerWidth;
      var screenH = window.innerHeight;
      var rootW = (subRef === null || subRef === void 0 ? void 0 : subRef.offsetWidth) || 130;
      var rootH = (subRef === null || subRef === void 0 ? void 0 : subRef.offsetHeight) || subMenuList.length * 22.4;
      var right = screenW - clickX > rootW + parentRef.offsetWidth;
      var left = !right;
      var top = screenH - clickY > rootH;
      var bottom = !top;
      if (right) {
        subRef.style.left = "".concat(parentRef.offsetLeft + rootW + 2, "px");
      }
      if (left) {
        subRef.style.left = "".concat(parentRef.offsetLeft - rootW - 2, "px");
      }
      if (top) {
        subRef.style.top = "".concat(clickY - 5, "px");
      }
      if (bottom) {
        subRef.style.top = "".concat(clickY - rootH + 5, "px");
      }
    }
  };
  var onSubMenuClose = function onSubMenuClose(event) {
    setSubMenuList([]);
    event.persist();
  };
  var onSubMenuShow = function onSubMenuShow(event, menuItem) {
    setSubMenuList(menuItem.subMenus);
    event.persist();
    var timer = setTimeout(function () {
      _handleContextSubMenu(event, subMenuRef.current);
      clearTimeout(timer);
    }, 100);
  };
  return /*#__PURE__*/React.createElement("div", null, showContextMenu && !!menuList && !!menuList.length && /*#__PURE__*/createPortal(/*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    className: "contextMenu"
  }, /*#__PURE__*/React.createElement(Menu, {
    menu: menuList,
    record: selectRows,
    alarmClickTarget: alarmClickTarget,
    openMenuComponent: openMenuComponent,
    onSubMenuShow: onSubMenuShow,
    onSubMenuClose: onSubMenuClose,
    theme: props.theme
  })), /*#__PURE__*/React.createElement("div", {
    ref: subMenuRef,
    className: "contextMenu"
  }, /*#__PURE__*/React.createElement(Menu, {
    menu: subMenuList,
    record: selectRows,
    alarmClickTarget: alarmClickTarget,
    openMenuComponent: openMenuComponent,
    theme: props.theme
  }))), modalContainer), menuCompModal);
};
export default ContextMenu;