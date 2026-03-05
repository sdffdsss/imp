function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["activeKey", "winType", "alarmTitlelist"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
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
import React from 'react';
import { Icon } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import AlarmWindow from '../../alarm-window-new';
import AlarmProcessor from '../processors/alarm-processor';
var AlarmTitle = function AlarmTitle(_ref) {
  var alarmTitlelist = _ref.alarmTitlelist,
    alarmVisible = _ref.alarmVisible,
    onToggleHandler = _ref.onToggleHandler,
    winType = _ref.winType;
  var clickHandler = function clickHandler() {
    onToggleHandler(winType);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "alarm-window-title-".concat(alarmVisible ? 'active' : 'hide', " alarm-window-title"),
    onClick: clickHandler
  }, /*#__PURE__*/React.createElement(Icon, {
    antdIcon: true,
    type: alarmVisible ? 'DownOutlined' : 'RightOutlined',
    className: "alarm-window-title-icon"
  }), alarmTitlelist[winType]);
};
var Index = /*#__PURE__*/function (_React$PureComponent) {
  function Index(_props) {
    var _this;
    _classCallCheck(this, Index);
    _this = _callSuper(this, Index, [_props]);
    /**
     * @description: 计算ScrollY
     * @param {*}
     * @return {*}
     */
    _this.mathScrollY = function (props) {
      var num = props.activeKey.length;
      var scrolly = (props.height - 25 - 25 * props.registerWindow.length - 24 * num) / num - 2;
      return scrolly;
    };
    /**
     * @description: 抽屉事件
     * @param {*}
     * @return {*}
     */
    _this.onToggleHandler = function (key) {
      var _this$props = _this.props,
        activeKey = _this$props.activeKey,
        activeChange = _this$props.activeChange;
      var tempArr = _.cloneDeep(activeKey);
      if (tempArr.includes(key)) {
        _.pull(tempArr, key);
      } else {
        tempArr.push(key);
      }
      _this.setState({
        activeKey: tempArr
      });
      activeChange(tempArr);
    };
    /**
     * @description: 双击抽屉事件
     * @param {*} key
     */
    _this.onWindowShowChangeHandler = function (key) {
      var _this$props2 = _this.props,
        activeKey = _this$props2.activeKey,
        activeChange = _this$props2.activeChange;
      var tempArr = _.cloneDeep(activeKey);
      if (tempArr.includes(key) && tempArr.length === 1) {
        tempArr = [];
      } else {
        tempArr = [key];
      }
      _this.setState({
        activeKey: tempArr
      });
      activeChange(tempArr);
    };
    _this.state = {
      scrollY: _this.mathScrollY(_props)
    };
    return _this;
  }
  _inherits(Index, _React$PureComponent);
  return _createClass(Index, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.height !== prevProps.height || JSON.stringify(this.props.activeKey) !== JSON.stringify(prevProps.activeKey) && this.props.activeKey.includes(this.props.winType)) {
        this.setState({
          scrollY: this.mathScrollY(this.props)
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
        activeKey = _this$props3.activeKey,
        winType = _this$props3.winType,
        alarmTitlelist = _this$props3.alarmTitlelist,
        otherParma = _objectWithoutProperties(_this$props3, _excluded);
      var scrollY = this.state.scrollY;
      return /*#__PURE__*/React.createElement("div", {
        className: "alarm-window-item-".concat(activeKey.includes(winType) ? 'show' : 'hide')
      }, /*#__PURE__*/React.createElement(AlarmProcessor, _extends({
        AlarmWindow: AlarmWindow,
        winType: winType,
        operationBar: [/*#__PURE__*/React.createElement(AlarmTitle, {
          onToggleHandler: this.onToggleHandler,
          alarmVisible: activeKey.includes(winType),
          alarmTitlelist: alarmTitlelist,
          winType: winType,
          key: "a"
        })],
        pageSize: 50,
        onWindowShowChangeHandler: this.onWindowShowChangeHandler,
        scrollY: scrollY
      }, otherParma)));
    }
  }]);
}(React.PureComponent);
export { Index as default };