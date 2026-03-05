function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useRef } from 'react';
import { Modal, ConfigProvider } from 'oss-ui';
import Draggable from 'react-draggable';
// import zhCN from 'antd/lib/locale/zh_CN';
import CustomModalFooter from '../../custom-modal-footer';
var noDragabled = ['ColumnSettings'];
var ToolCompModal = function ToolCompModal(props) {
  var toolbarItem = props.toolbarItem,
    selectRows = props.selectRows,
    customAction = props.customAction,
    eventListener = props.eventListener,
    onCancel = props.onCancel,
    modalContainer = props.modalContainer,
    columns = props.columns,
    allCol = props.allCol,
    toolRef = props.toolRef,
    _onToolDateChange = props.onToolDateChange,
    maxAlarmSize = props.maxAlarmSize,
    filterId = props.filterId,
    winType = props.winType,
    filterNameList = props.filterNameList,
    moduleIdList = props.moduleIdList,
    customParamData = props.customParamData,
    externalComp = props.externalComp;
  console.log(props);
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
  var draggleRef = useRef(null);
  var onOk = function onOk() {
    if (toolbarItem.isExtend) {
      if (toolbarItem.action) {
        toolbarItem.action({
          toolbarItem: toolbarItem,
          selectRows: selectRows
        });
      } else if (toolbarItem.formAction) {
        toolbarItem.formAction({
          toolbarItem: toolbarItem,
          selectRows: selectRows
        });
      }
      onCancel();
      return;
    }
    toolRef.current.validateFields().then(function () {
      toolRef.current && toolRef.current.submit();
      onCancel();
    }).catch(function (e) {});
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
  var footer = toolbarItem.pageType === 'form' ? /*#__PURE__*/React.createElement(CustomModalFooter, {
    confirmLoading: true,
    onCancel: onCancel,
    onOk: onOk
  }) : /*#__PURE__*/React.createElement(CustomModalFooter, {
    okText: "",
    onCancel: onCancel,
    cancelText: '关闭'
  });
  return /*#__PURE__*/React.createElement(Modal, {
    centered: true,
    destroyOnClose: true,
    visible: true,
    maskClosable: false,
    wrapClassName: "alarm-window-context-modal",
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
    }, toolbarItem.name || toolbarItem.title),
    prefixCls: "oss-ui-modal",
    okButtonProps: {
      prefixCls: 'oss-ui-btn'
    },
    getContainer: modalContainer,
    cancelButtonProps: {
      prefixCls: 'oss-ui-btn'
    },
    width: toolbarItem.width || 800,
    footer: footer,
    onCancel: onCancel,
    modalRender: function modalRender(modal) {
      return !noDragabled.includes(toolbarItem.key) ? /*#__PURE__*/React.createElement(Draggable, {
        disabled: dragDisabled,
        bounds: bounds,
        onStart: function onStart(event, uiData) {
          return onDragStart(event, uiData);
        }
      }, /*#__PURE__*/React.createElement("div", {
        ref: draggleRef
      }, modal)) : modal;
    }
  }, /*#__PURE__*/React.createElement(ConfigProvider, {
    prefixCls: "oss-ui"
  }, /*#__PURE__*/React.createElement(toolbarItem.component, {
    ref: toolRef,
    record: selectRows,
    allCol: allCol,
    columns: columns,
    eventListener: eventListener,
    maxAlarmSize: maxAlarmSize,
    filterId: filterId,
    winType: winType,
    filterNameList: filterNameList,
    moduleIdList: moduleIdList,
    customParamData: customParamData,
    externalComp: externalComp,
    onToolDateChange: function onToolDateChange(value) {
      return _onToolDateChange(toolbarItem, value);
    }
  })));
};
export default ToolCompModal;