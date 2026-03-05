function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
import React, { PureComponent } from 'react';
import Logger, { Level } from '../logger/index.ts';
import { Collapse, List, Button, Space, Icon, Table } from 'oss-ui';
import "./index.css";
var Panel = Collapse.Panel;
var LogExpression = /*#__PURE__*/function (_PureComponent) {
  function LogExpression(props) {
    var _this;
    _classCallCheck(this, LogExpression);
    _this = _callSuper(this, LogExpression, [props]);
    _this.flushHandler = function () {
      Logger.flushAll();
    };
    _this.changeStatus = function () {
      if (Logger.isMute()) {
        Logger.open();
      } else {
        Logger.mute();
      }
      _this.setState({
        activeStatus: Logger.isMute()
      });
    };
    _this.state = {
      traceList: Logger.traceList,
      debugList: Logger.debugList,
      infoList: Logger.infoList,
      warningList: Logger.warningList,
      errorList: Logger.errorList,
      activeStatus: false
    };
    return _this;
  }
  _inherits(LogExpression, _PureComponent);
  return _createClass(LogExpression, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      Logger.on('onLoggerChange', function (_ref) {
        var dataList = _ref.dataList,
          type = _ref.type,
          current = _ref.current;
        _this2.setState(_defineProperty({}, "".concat(type, "List"), _toConsumableArray(dataList)));
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      Logger.off('onLoggerChange', function (record) {});
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
        traceList = _this$state.traceList,
        debugList = _this$state.debugList,
        infoList = _this$state.infoList,
        warningList = _this$state.warningList,
        errorList = _this$state.errorList,
        activeStatus = _this$state.activeStatus,
        style = _this$state.style;
      return /*#__PURE__*/React.createElement("div", {
        className: "alarm-window-log-expression",
        style: style
      }, /*#__PURE__*/React.createElement(Space, {
        className: "alarm-window-log-expression-toolbar"
      }, /*#__PURE__*/React.createElement(Button, {
        key: "mute",
        onClick: this.changeStatus,
        icon: /*#__PURE__*/React.createElement(Icon, {
          antdIcon: true,
          type: activeStatus ? 'ReloadOutlined' : 'PauseOutlined'
        })
      }, activeStatus ? '重启' : '暂停'), /*#__PURE__*/React.createElement(Button, {
        key: "flush",
        onClick: this.flushHandler,
        type: "primary"
      }, "\u6E05\u7A7A")), /*#__PURE__*/React.createElement(Collapse, {
        defaultActiveKey: [Level.Info]
      }, /*#__PURE__*/React.createElement(Panel, {
        header: /*#__PURE__*/React.createElement("span", {
          className: "trace-color"
        }, "Trace"),
        key: Level.Trace
      }, /*#__PURE__*/React.createElement(ExpressionList, {
        list: traceList
      })), /*#__PURE__*/React.createElement(Panel, {
        header: /*#__PURE__*/React.createElement("span", {
          className: "debug-color"
        }, "Debug"),
        key: Level.Debug
      }, /*#__PURE__*/React.createElement(ExpressionList, {
        list: debugList
      })), /*#__PURE__*/React.createElement(Panel, {
        header: /*#__PURE__*/React.createElement("span", {
          className: "info-color"
        }, "Info"),
        key: Level.Info
      }, /*#__PURE__*/React.createElement(ExpressionList, {
        list: infoList
      })), /*#__PURE__*/React.createElement(Panel, {
        header: /*#__PURE__*/React.createElement("span", {
          className: "warning-color"
        }, "Warning"),
        key: Level.Warning
      }, /*#__PURE__*/React.createElement(ExpressionList, {
        list: warningList
      })), /*#__PURE__*/React.createElement(Panel, {
        header: /*#__PURE__*/React.createElement("span", {
          className: "error-color"
        }, "Error"),
        key: Level.Error
      }, /*#__PURE__*/React.createElement(ExpressionList, {
        list: errorList
      }))));
    }
  }]);
}(PureComponent);
export default LogExpression;
var ExpressionListColumns = [{
  title: '字段',
  dataIndex: 'identifier',
  key: 'identifier'
}, {
  title: '值',
  dataIndex: 'value',
  key: 'value'
}];
var ExpressionList = function ExpressionList(_ref2) {
  var list = _ref2.list;
  return /*#__PURE__*/React.createElement(List, {
    itemLayout: "horizontal",
    dataSource: list,
    bordered: false,
    renderItem: function renderItem(item) {
      return /*#__PURE__*/React.createElement(List.Item, null, /*#__PURE__*/React.createElement(List.Item.Meta, {
        title: item.message,
        description: item.fields.length > 0 ? /*#__PURE__*/React.createElement(Table, {
          size: "small",
          pagination: false,
          dataSource: item.fields,
          columns: ExpressionListColumns
        }) : ''
      }));
    }
  });
};