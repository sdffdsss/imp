function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
// import { DatePicker } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { produce } from 'immer';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import locale from 'antd/es/date-picker/locale/zh_CN';
import DateRangeTime from '../date-range-time';
dayjs.extend(weekday);
dayjs.extend(localeData);
var dateFormat = 'YYYY-MM-DD HH:mm:ss';
var Index = /*#__PURE__*/function (_PureComponent) {
  function Index(props) {
    var _this;
    _classCallCheck(this, Index);
    _this = _callSuper(this, Index, [props]);
    /**
     * @description: 显示回调值
     * @param {*}
     * @return {*}
     */
    _this.loadValue = function () {
      var _this$props = _this.props,
        paramData = _this$props.paramData,
        colData = _this$props.colData;
      var value = _.find(paramData.conditionList, {
        fieldName: colData.field
      }) ? _.find(paramData.conditionList, {
        fieldName: colData.field
      }).value : [];
      _this.setState({
        value: value
      });
    };
    /**
     * @description: 监听时间选择框变化
     * @param {*} value
     * @param {*} time
     * @return {*}
     */
    _this.onChange = function (time) {
      _this.setState({
        value: [time[0], time[1]] || []
      });
      var _this$props2 = _this.props,
        paramData = _this$props2.paramData,
        colData = _this$props2.colData;
      var nextData = produce(paramData, function (draft) {
        var thisData = _.find(draft.conditionList, {
          fieldName: colData.field
        });
        thisData ? thisData.value = [new Date(time[0]).getTime(), new Date(time[1]).getTime()] : draft.conditionList.push({
          fieldName: colData.field,
          not: false,
          operator: 'between',
          value: [new Date(time[0]).getTime(), new Date(time[1]).getTime()]
        });
      });
      _this.props.onChange && _this.props.onChange(nextData);
    };
    /**
     * @description: 时间选择值格式化
     * @param {*} value
     * @return {*}
     */
    _this.valueFunc = function (value) {
      if (Array.isArray(value) && value.length !== 2) {
        return [];
      }
      // console.log(dayjs(dayjs(value[1]).format(dateFormat), dateFormat));
      return [value[0] ? dayjs(dayjs(value[0]).format(dateFormat), dateFormat) : null, value[1] ? dayjs(dayjs(value[1]).format(dateFormat), dateFormat) : null];
    };
    _this.state = {
      value: [] // 所有options选项
    };
    return _this;
  }
  _inherits(Index, _PureComponent);
  return _createClass(Index, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadValue();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.dropdownVisible !== this.props.dropdownVisible && this.props.dropdownVisible) {
        this.loadValue();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var value = this.state.value;
      return /*#__PURE__*/React.createElement(DateRangeTime, {
        showTime: true,
        locale: locale,
        onChange: this.onChange,
        value: this.valueFunc(value),
        format: dateFormat
      });
    }
  }]);
}(PureComponent);
export { Index as default };