function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Tooltip, Tabs, Icon, Menu, Dropdown } from 'oss-ui';
import ToolCompModal from './toolbar-components/toolbar-components-container';
import { _ } from 'oss-web-toolkits';
import classnames from 'classnames';
import styles from "./style/index.module.css";
var Toolbar = function Toolbar(props) {
  var className = props.className,
    _props$toolbarItems = props.toolbarItems,
    toolbarItems = _props$toolbarItems === void 0 ? [] : _props$toolbarItems,
    selectRows = props.selectRows,
    modalContainer = props.modalContainer,
    customParamData = props.customParamData,
    allCol = props.allCol,
    maxAlarmSize = props.maxAlarmSize,
    filterId = props.filterId,
    winType = props.winType,
    filterNameList = props.filterNameList,
    moduleIdList = props.moduleIdList,
    actionMap = props.actionMap,
    extendEventMap = props.extendEventMap,
    columns = props.columns,
    eventListener = props.eventListener,
    externalComp = props.externalComp;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    toolBarCompModal = _useState2[0],
    setToolBarCompModal = _useState2[1];
  var _useState3 = useState(true),
    _useState4 = _slicedToArray(_useState3, 2),
    connectionInfo = _useState4[0],
    setConnectionInfo = _useState4[1];
  var toolRef = useRef();
  var tabBarStyle = {
    marginBottom: 0,
    height: '100%',
    background: 'transparent'
  };
  var onTabChange = function onTabChange(activeKey) {
    var key = activeKey.split('*').pop();
    var toolbarItem = _.find(toolbarItems, function (item) {
      return item.key === key;
    });
    if ((toolbarItem === null || toolbarItem === void 0 ? void 0 : toolbarItem.dropdownMenus) && toolbarItem.dropdownMenus.length) {
      return;
    }
    if (toolbarItem.isExtend && _.isFunction(toolbarItem.customHandler)) {
      toolbarItem.customHandler({
        selectRows: selectRows,
        columns: columns,
        maxAlarmSize: maxAlarmSize,
        filterId: filterId,
        winType: winType,
        toolbarItem: toolbarItem,
        filterNameList: filterNameList,
        moduleIdList: moduleIdList,
        customParamData: customParamData,
        eventListener: eventListener,
        actionMap: actionMap
      });
      return;
    }
    onToolChange(toolbarItem);
  };
  var onToolChange = function onToolChange(toolbarItem) {
    if (!toolbarItem) {
      return;
    }
    var customAction = actionMap[toolbarItem.key];
    customAction && toolbarItem.action && toolbarItem.action({
      customAction: customAction,
      toolbarItem: toolbarItem,
      selectRows: selectRows
    });
    toolbarItem.component && setToolBarCompModal(/*#__PURE__*/React.createElement(ToolCompModal, {
      toolRef: toolRef,
      toolbarItem: toolbarItem,
      selectRows: selectRows,
      modalContainer: modalContainer,
      allCol: allCol,
      columns: columns,
      maxAlarmSize: maxAlarmSize,
      filterId: filterId,
      winType: winType,
      filterNameList: filterNameList,
      moduleIdList: moduleIdList,
      customParamData: customParamData,
      onToolDateChange: onToolDateChange,
      eventListener: eventListener,
      externalComp: externalComp,
      onCancel: function onCancel() {
        setToolBarCompModal(null);
      }
    }));
  };
  var onToolDateChange = function onToolDateChange(toolbarItem, value) {
    if (extendEventMap && extendEventMap[toolbarItem.key]) {
      extendEventMap[toolbarItem.key](value);
      return;
    }
    var customAction = actionMap[toolbarItem.key];
    customAction && toolbarItem.formAction && toolbarItem.formAction({
      customAction: customAction,
      toolbarItem: toolbarItem,
      value: value
    });
  };
  var menuClick = function menuClick(toolbarItem, _ref) {
    var item = _ref.item,
      key = _ref.key,
      keyPath = _ref.keyPath,
      domEvent = _ref.domEvent;
    onToolDateChange(toolbarItem, key);
  };
  var getMenus = function getMenus(toolbarItem) {
    if (toolbarItem && toolbarItem.dropdownMenus && toolbarItem.dropdownMenus.length) {
      return /*#__PURE__*/React.createElement(Menu, {
        onClick: _.partial(menuClick, toolbarItem)
      }, toolbarItem.dropdownMenus.map(function (item) {
        return /*#__PURE__*/React.createElement(Menu.Item, {
          key: item.value
        }, item.txt);
      }));
    }
    return null;
  };
  var getToolbarIcon = function getToolbarIcon(toolbarItem) {
    var type = '';
    if (toolbarItem.key === 'ServiceConnectionInfo' && (connectionInfo === 'disconnection' || connectionInfo === 'thoroughDisconnection')) {
      if (props.theme === 'dark') {
        type = toolbarItem.disconnectIcondark;
      } else if (props.theme === 'darkblue') {
        type = toolbarItem.disconnectIconDarkBlue;
      } else {
        type = toolbarItem.disconnectIconLight;
      }
    } else if (toolbarItem.active && toolbarItem.activeIcon) {
      type = toolbarItem.activeIcon;
    } else {
      type = toolbarItem.icon;
    }
    return type;
  };
  useEffect(function () {
    if (props.eventListener.getServiceInfo) {
      //todo:
      var timer = setInterval(function () {
        props.eventListener.getServiceInfo(function (res) {
          setConnectionInfo(res.connectionStatus);
        });
      }, 1000);
      return function () {
        clearInterval(timer);
      };
    }
  }, [props.eventListener.getServiceInfo]);
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement(Tabs, {
    type: "card",
    size: "small",
    tabBarGutter: 0,
    tabPosition: "top",
    style: {
      height: '100%'
    },
    tabBarStyle: tabBarStyle,
    onTabClick: onTabChange
  }, Array.isArray(toolbarItems) && toolbarItems.map(function (toolbarItem, i) {
    return /*#__PURE__*/React.createElement(Tabs.TabPane, {
      key: "".concat(filterId, "*").concat(winType, "*").concat(toolbarItem.key),
      tab: /*#__PURE__*/React.createElement(Tooltip, {
        trigger: ['hover', 'click'],
        autoAdjustOverflow: true,
        title: toolbarItem.active && toolbarItem.activeTitle ? toolbarItem.activeTitle : toolbarItem.title,
        overlayInnerStyle: {
          padding: '0px 8px',
          minHeight: '16px'
        }
      }, toolbarItem.dropdownMenus && toolbarItem.dropdownMenus.length ? /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement(Dropdown, _extends({
        overlay: getMenus(toolbarItem),
        trigger: ['click']
      }, toolbarItem.dropdownProps || {}), /*#__PURE__*/React.createElement(Icon, {
        onClick: function onClick(e) {
          return e.preventDefault();
        },
        className: classnames(_defineProperty(_defineProperty(_defineProperty({}, styles['toolbar-icon'], true), styles['toolbar-icon-active'], toolbarItem.active === true), styles['toolbar-icon-unactive'], toolbarItem.active !== true)),
        type: toolbarItem.active && toolbarItem.activeIcon ? toolbarItem.activeIcon : toolbarItem.icon
      }))) : /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        className: classnames(_defineProperty(_defineProperty(_defineProperty({}, styles['toolbar-icon'], true), styles['toolbar-icon-active'], toolbarItem.active === true), styles['toolbar-icon-unactive'], toolbarItem.active !== true)),
        type: getToolbarIcon(toolbarItem)
      })))
    });
  })), toolBarCompModal);
};
export default /*#__PURE__*/React.memo(Toolbar);