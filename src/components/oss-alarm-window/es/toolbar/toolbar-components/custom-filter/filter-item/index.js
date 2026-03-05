function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["data", "columns", "showDelete"];
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
import FiterField from './filter-field';
import FilterOperator from './filter-operator';
import FiterValue from './filter-value';
import { Icon } from 'oss-ui';
import produce from 'immer';
import "./index.css";
var Index = /*#__PURE__*/function (_React$PureComponent) {
  function Index(props) {
    var _this;
    _classCallCheck(this, Index);
    _this = _callSuper(this, Index, [props]);
    /**
     * @description: 过滤条件变化
     * @param {*}
     * @return {*}
     */
    _this.onColChange = function (value) {
      var _this$props = _this.props,
        data = _this$props.data,
        index = _this$props.index;
      var nextData = produce(data, function (draft) {
        var _this$getItemByFieldN;
        var coustomFilterType = (_this$getItemByFieldN = _this.getItemByFieldName(value)) === null || _this$getItemByFieldN === void 0 ? void 0 : _this$getItemByFieldN.coustomFilterType;
        draft.fieldName = value;
        draft.operator = coustomFilterType === 'muti-select' || coustomFilterType === 'input-select' ? 'in' : 'gt';
        draft.coustomFilterType = coustomFilterType;
        draft.value = coustomFilterType === 'time-picker' ? null : [];
      });
      _this.props.onFilterChange && _this.props.onFilterChange(nextData, index);
    };
    /**
     * @description: 监听逻辑选择框变化
     * @param {*} val
     * @return {*}
     */
    _this.onOperatorChange = function (val) {
      var _this$props2 = _this.props,
        data = _this$props2.data,
        index = _this$props2.index;
      var nextData = produce(data, function (draft) {
        draft.operator = val;
        draft.value = [];
      });
      _this.props.onFilterChange && _this.props.onFilterChange(nextData, index);
    };
    /**
     * @description: 监听值选择
     * @param {*} val
     * @return {*}
     */
    _this.onValueChange = function (val) {
      var _this$props3 = _this.props,
        data = _this$props3.data,
        index = _this$props3.index;
      var nextData = produce(data, function (draft) {
        draft.value = val;
      });
      _this.props.onFilterChange && _this.props.onFilterChange(nextData, index);
    };
    /**
     * @description: 添加新过滤条件
     * @param {*}
     * @return {*}
     */
    _this.onAddFilterItem = function () {
      _this.props.onAddNewFilter();
    };
    /**
     * @description: 删除某一项
     * @param {*}
     * @return {*}
     */
    _this.onDeleteFilterItem = function () {
      var index = _this.props.index;
      _this.props.onDeleteFilterItem && _this.props.onDeleteFilterItem(index);
    };
    /**
     * @description: 通过fieldName找到对应对象
     * @param {*} fieldName
     * @return {*}
     */
    _this.getItemByFieldName = function (fieldName) {
      var columns = _this.props.columns;
      return _.find(columns, {
        field: fieldName
      });
    };
    _this.state = {};
    return _this;
  }
  _inherits(Index, _React$PureComponent);
  return _createClass(Index, [{
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
        data = _this$props4.data,
        columns = _this$props4.columns,
        showDelete = _this$props4.showDelete,
        restProps = _objectWithoutProperties(_this$props4, _excluded);
      return /*#__PURE__*/React.createElement("section", {
        className: "filter-item-container"
      }, /*#__PURE__*/React.createElement(FiterField, {
        data: data,
        columns: columns,
        onChange: this.onColChange
      }), /*#__PURE__*/React.createElement(FilterOperator, {
        data: data,
        columns: columns,
        onOperatorChange: this.onOperatorChange
      }), /*#__PURE__*/React.createElement(FiterValue, _extends({
        data: data,
        onValueChange: this.onValueChange
      }, restProps)), showDelete && /*#__PURE__*/React.createElement(Icon, {
        antdIcon: true,
        type: "MinusOutlined",
        onClick: this.onDeleteFilterItem
      }), /*#__PURE__*/React.createElement(Icon, {
        antdIcon: true,
        type: "PlusOutlined",
        onClick: this.onAddFilterItem
      }));
    }
  }]);
}(React.PureComponent);
export { Index as default };