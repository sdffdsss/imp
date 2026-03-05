function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
import SearchSelect from './select';
import { DatePicker, InputNumber, Space, Input } from 'oss-ui';
var Index = /*#__PURE__*/function (_React$PureComponent) {
  function Index(props) {
    var _this;
    _classCallCheck(this, Index);
    _this = _callSuper(this, Index, [props]);
    /**
     * @description: 监听值变化
     * @param {*}
     * @return {*}
     */
    _this.onValueChange = function (val) {
      _this.props.onValueChange && _this.props.onValueChange(val);
    };
    /**
     * @description: 监听时间值变化
     * @param {*}
     * @return {*}
     */
    _this.onDateValueChange = function (val) {
      var data = _this.props.data;
      var value = [];
      if (data.operator === 'between') {
        value = val;
      } else {
        value = [val];
      }
      _this.props.onValueChange && _this.props.onValueChange(value);
    };
    /**
     * @description: 监听数值类型值变化
     * @param {*}
     * @return {*}
     */
    _this.onNumberValueChange = function (index, val) {
      var valueArr = [];
      valueArr[index] = val;
      _this.props.onValueChange && _this.props.onValueChange(valueArr);
    };
    /**
     * @description: 监听字符类型值变化
     * @param {*}
     * @return {*}
     */
    _this.onLikeValueChange = function (e) {
      _this.props.onValueChange && _this.props.onValueChange(e.target.value);
    };
    _this.state = {};
    return _this;
  }
  _inherits(Index, _React$PureComponent);
  return _createClass(Index, [{
    key: "render",
    value: function render() {
      var data = this.props.data;
      if (data.coustomFilterType === 'time-picker') {
        if (data.operator === 'between') {
          return /*#__PURE__*/React.createElement(DatePicker.RangePicker, {
            style: {
              width: '240px'
            },
            showTime: true,
            format: "YYYY-MM-DD HH:mm:ss",
            onChange: this.onDateValueChange,
            value: data.value,
            disabled: !(data === null || data === void 0 ? void 0 : data.fieldName)
          });
        } else {
          return /*#__PURE__*/React.createElement(DatePicker, {
            style: {
              width: '240px'
            },
            showTime: true,
            format: "YYYY-MM-DD HH:mm:ss",
            onChange: this.onDateValueChange,
            value: data.value && data.value[0],
            disabled: !(data === null || data === void 0 ? void 0 : data.fieldName)
          });
        }
      }
      if (data.coustomFilterType === 'input-number') {
        if (data.operator === 'between') {
          return /*#__PURE__*/React.createElement(Space, {
            style: {
              width: '240px'
            }
          }, /*#__PURE__*/React.createElement(InputNumber, {
            max: Math.pow(2 * 31) - 1,
            style: {
              width: '110px'
            },
            value: data.value && data.value[0],
            onChange: this.onNumberValueChange.bind(this, 0)
          }), /*#__PURE__*/React.createElement(InputNumber, {
            disabled: !data.value[0] && data.value[0] !== 0,
            min: data.value && data.value[0],
            max: Math.pow(2 * 31) - 1,
            style: {
              width: '110px'
            },
            value: data.value && data.value[1],
            onChange: this.onNumberValueChange.bind(this, 1)
          }));
        } else {
          return /*#__PURE__*/React.createElement(InputNumber, {
            max: Math.pow(2 * 31) - 1,
            style: {
              width: '110px'
            },
            value: data.value && data.value[0],
            onChange: this.onNumberValueChange.bind(this, 0)
          });
        }
      }
      if (data.coustomFilterType === 'input-select' && data.operator === 'like') {
        return /*#__PURE__*/React.createElement(Input, {
          style: {
            width: '240px'
          },
          value: data.value,
          onChange: this.onLikeValueChange.bind(this)
        });
      }
      return /*#__PURE__*/React.createElement(SearchSelect, _extends({
        style: {
          width: '240px'
        }
      }, this.props, {
        onChange: this.onValueChange,
        value: data.value,
        disabled: !(data === null || data === void 0 ? void 0 : data.fieldName)
      }));
    }
  }]);
}(React.PureComponent);
export { Index as default };