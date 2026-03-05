function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useRef } from 'react';
// import classnames from 'classnames';
import { Modal, Tabs, message, Icon, Space } from 'oss-ui';
import Draggable from 'react-draggable';
import Detail from './detail';
import ProcessorInfo from './preprocess-info';
import CustomModalFooter from '../../toolbar/custom-modal-footer';
// import Topology from './topology';
import NanjingDetail from './nanjing-detail';
import serviceConfig from '../../hox';
import "../style/index.css";
import AllLife from './allLife';
import AlarmCount from './alarmCount';
import Common from '../../common';
var DetailContainorClose = function DetailContainorClose(props) {
  return /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Icon, {
    antdIcon: true,
    onClick: function onClick() {
      return props.onCancel();
    },
    type: "CloseOutlined",
    style: {
      fontSize: 18
    }
  }));
};
var Menu = function Menu(props) {
  var _useState = useState({
      left: 0,
      top: 0,
      bottom: 0,
      right: 0
    }),
    _useState2 = _slicedToArray(_useState, 2),
    bounds = _useState2[0],
    setBounds = _useState2[1];
  var _useState3 = useState(true),
    _useState4 = _slicedToArray(_useState3, 2),
    dragDisabled = _useState4[0],
    setDragDisabled = _useState4[1];
  var _useState5 = useState(true),
    _useState6 = _slicedToArray(_useState5, 2),
    isShowExport = _useState6[0],
    setIsShowExport = _useState6[1];
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    maxFlag = _useState8[0],
    setMaxFlag = _useState8[1];
  var draggleRef = useRef(null);
  var theme = props.theme,
    visible = props.visible,
    onCancel = props.onCancel,
    textTarget = props.textTarget,
    registerInfo = props.registerInfo,
    _props$getContainer = props.getContainer,
    getContainer = _props$getContainer === void 0 ? false : _props$getContainer,
    eventListener = props.eventListener,
    doubleClickType = props.doubleClickType,
    extendEventMap = props.extendEventMap,
    columns = props.columns;
  var TabPane = Tabs.TabPane;
  var exportInfo = function exportInfo() {
    var _serviceConfig$data, _serviceConfig$data$s, _serviceConfig$data$s2, _textTarget$alarm_id;
    var url = serviceConfig === null || serviceConfig === void 0 ? void 0 : (_serviceConfig$data = serviceConfig.data) === null || _serviceConfig$data === void 0 ? void 0 : (_serviceConfig$data$s = _serviceConfig$data.serviceConfig) === null || _serviceConfig$data$s === void 0 ? void 0 : (_serviceConfig$data$s2 = _serviceConfig$data$s.otherService) === null || _serviceConfig$data$s2 === void 0 ? void 0 : _serviceConfig$data$s2.viewItemExportUrl;
    Common.request(null, {
      fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.viewItemUrl, "flow/alarm-info/export"),
      type: 'post',
      showSuccessMessage: false,
      showErrorMessage: false,
      defaultErrorMessage: '获取数据失败',
      data: {
        alarmId: textTarget === null || textTarget === void 0 ? void 0 : (_textTarget$alarm_id = textTarget.alarm_id) === null || _textTarget$alarm_id === void 0 ? void 0 : _textTarget$alarm_id.value,
        sessionId: registerInfo === null || registerInfo === void 0 ? void 0 : registerInfo.clientSessionId
      }
    }).then(function (result) {
      if (result && result.url) {
        window.open(url + result.url);
      } else {
        message.error('未获取到导出文件，请稍后重试！');
      }
    }).catch(function () {
      message.error('未获取到导出文件，请稍后重试！');
    });

    // eventListener.alarmInfoExportRequest(props.textTarget?.alarm_id?.value, (res) => {
    //     const url = serviceConfig?.data?.serviceConfig?.otherService?.viewItemExportUrl;
    //     if (res.responseDataJSON.indexOf('http') === -1) {
    //         window.open(url + res.responseDataJSON);
    //     } else {
    //         window.open(res.responseDataJSON);
    //     }
    //     window.open(url);
    // });
  };
  var onChange = function onChange(activeKey) {
    if (activeKey === '4') {
      setIsShowExport(false);
    } else {
      setIsShowExport(true);
    }
  };
  var onDragStart = function onDragStart(event, uiData) {
    var _window, _window$document, _draggleRef$current;
    var _window$document$docu = (_window = window) === null || _window === void 0 ? void 0 : (_window$document = _window.document) === null || _window$document === void 0 ? void 0 : _window$document.documentElement,
      clientWidth = _window$document$docu.clientWidth,
      clientHeight = _window$document$docu.clientHeight;
    var targetRect = draggleRef === null || draggleRef === void 0 ? void 0 : (_draggleRef$current = draggleRef.current) === null || _draggleRef$current === void 0 ? void 0 : _draggleRef$current.getBoundingClientRect();
    setBounds({
      bounds: {
        left: -(targetRect === null || targetRect === void 0 ? void 0 : targetRect.left) + (uiData === null || uiData === void 0 ? void 0 : uiData.x),
        right: clientWidth - ((targetRect === null || targetRect === void 0 ? void 0 : targetRect.right) - (uiData === null || uiData === void 0 ? void 0 : uiData.x)),
        top: -(targetRect === null || targetRect === void 0 ? void 0 : targetRect.top) + (uiData === null || uiData === void 0 ? void 0 : uiData.y),
        bottom: clientHeight - ((targetRect === null || targetRect === void 0 ? void 0 : targetRect.bottom) - (uiData === null || uiData === void 0 ? void 0 : uiData.y))
      }
    });
  };
  var getFooter = function getFooter() {
    var footer;
    if (doubleClickType === 0) {
      if (isShowExport) {
        footer = /*#__PURE__*/React.createElement(CustomModalFooter, {
          okText: "\u5BFC\u51FA",
          onOk: exportInfo,
          onCancel: onCancel,
          cancelText: "\u5173\u95ED"
        });
      } else {
        footer = /*#__PURE__*/React.createElement(CustomModalFooter, {
          okText: "",
          onCancel: onCancel,
          cancelText: "\u5173\u95ED"
        });
      }
    } else {
      footer = null;
    }
    return footer;
  };
  var onFangDa = function onFangDa(flag) {
    setMaxFlag(flag);
  };
  return visible && /*#__PURE__*/React.createElement(Modal
  // centered
  , {
    layout: "horizontal",
    visible: true
    // onCancel={onCancel}
    ,
    footer: getFooter(),
    maskClosable: doubleClickType !== 1,
    className: maxFlag ? 'alarm-window-alarm-text alarm-window-alarm-text-unicom' : 'alarm-window-alarm-text',
    getContainer: getContainer,
    width: 1061,
    wrapClassName: "alarm-window-double-modal-wrap",
    closeIcon: /*#__PURE__*/React.createElement(DetailContainorClose, {
      maxFlag: maxFlag,
      exportData: doubleClickType === 1,
      onCancel: onCancel,
      onFangDa: onFangDa
    }),
    modalRender: function modalRender(modal) {
      return /*#__PURE__*/React.createElement(Draggable, {
        disabled: dragDisabled,
        bounds: bounds,
        onStart: function onStart(event, uiData) {
          return onDragStart(event, uiData);
        }
      }, /*#__PURE__*/React.createElement("div", {
        ref: draggleRef
      }, modal));
    },
    title: /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        cursor: 'move'
      },
      onMouseOver: function onMouseOver() {
        if (dragDisabled) {
          setDragDisabled(false);
        }
      },
      onMouseOut: function onMouseOut() {
        setDragDisabled(true);
      }
    }, "\u544A\u8B66\u6982\u8981")
  }, doubleClickType === 0 && /*#__PURE__*/React.createElement(Tabs, {
    type: "card",
    onChange: onChange
  }, /*#__PURE__*/React.createElement(TabPane, {
    tab: "\u544A\u8B66\u4FE1\u606F",
    key: "2"
  }, /*#__PURE__*/React.createElement(Detail, {
    theme: theme,
    textTarget: textTarget,
    registerInfo: registerInfo,
    eventListener: eventListener,
    extendEventMap: extendEventMap
  })), /*#__PURE__*/React.createElement(TabPane, {
    tab: "\u5168\u751F\u547D\u5468\u671F",
    key: "1"
  }, /*#__PURE__*/React.createElement(AllLife, {
    textTarget: textTarget,
    theme: theme
  })), /*#__PURE__*/React.createElement(TabPane, {
    tab: "\u9884\u5904\u7406\u4FE1\u606F",
    key: "3"
  }, /*#__PURE__*/React.createElement(ProcessorInfo, {
    extendEventMap: extendEventMap,
    textTarget: textTarget,
    registerInfo: registerInfo,
    eventListener: eventListener
  })), /*#__PURE__*/React.createElement(TabPane, {
    tab: "\u9891\u6B21\u8BE6\u60C5",
    key: "4"
  }, /*#__PURE__*/React.createElement(AlarmCount, {
    textTarget: textTarget,
    theme: theme,
    extendEventMap: extendEventMap,
    eventListener: eventListener
  }))), doubleClickType === 1 && /*#__PURE__*/React.createElement(NanjingDetail, {
    theme: theme,
    textTarget: textTarget,
    eventListener: eventListener,
    extendEventMap: extendEventMap,
    columns: columns
  }));
};
export default Menu;