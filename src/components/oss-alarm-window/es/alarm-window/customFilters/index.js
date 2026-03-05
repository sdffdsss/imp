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
import React, { PureComponent } from 'react';
import SelectFilter from './components/muti-select';
import TimePicker from './components/time-picker';
import Status from './components/status-icon';
import Switchable from './components/input-select';
import { Button } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import "./index.css";
var Default = /*#__PURE__*/function (_PureComponent) {
  function Default(props) {
    var _this;
    _classCallCheck(this, Default);
    _this = _callSuper(this, Default, [props]);
    /**
     * @description: 过滤项选中值变化
     * @param {*} parma
     * @return {*}
     */
    _this.onChange = function (parma) {
      _this.tempData = _.cloneDeep(parma);
    };
    /**
     * @description: 确认操作
     * @param {*}
     * @return {*}
     */
    _this.onConfirmClick = function () {
      var tempData = _this.tempData;
      var colData = _this.props.colData;
      var tempObj = _.find(tempData.conditionList, {
        fieldName: colData.field
      });
      if (tempObj && Array.isArray(tempObj.value) && tempObj.value.length === 0) {
        tempData.conditionList = _.pull(tempData.conditionList, _.find(tempData.conditionList, {
          fieldName: colData.field
        }));
      }
      _this.onDataChange(tempData);
    };
    /**
     * @description: 清空操作
     * @param {*}
     * @return {*}
     */
    _this.onResetClick = function (parma) {
      var _this$props = _this.props,
        colData = _this$props.colData,
        paramData = _this$props.paramData;
      var handleData = _.cloneDeep(paramData);
      if (Array.isArray(colData.field)) {
        colData.field.forEach(function (fieldItem) {
          handleData.conditionList = _.pull(handleData.conditionList, _.find(handleData.conditionList, {
            fieldName: fieldItem.storeFieldName
          }));
        });
      } else {
        handleData.conditionList = _.pull(handleData.conditionList, _.find(handleData.conditionList, {
          fieldName: colData.field
        }));
      }
      // handleData.conditionList = _.pull(
      //     handleData.conditionList,
      //     _.find(handleData.conditionList, { fieldName: colData.field }),
      // );
      console.log(handleData);
      if (_this.props.coustomFilterType === 'status') {
        _this.setState({
          setBlank: true
        });
      }
      _this.onDataChange(handleData);
    };
    /**
     * @description: status 多tab选择框清空回调
     * @param {*} param
     * @param {*} blankState
     * @return {*}
     */
    _this.onReset = function (param, blankState) {
      _this.setState({
        setBlank: blankState
      });
      _this.onDataChange(param);
    };
    /**
     * @description: 根据数据变化发送请求
     * @param {*} data
     * @return {*}
     */
    _this.onDataChange = function (data) {
      _this.props.eventListener.setParamData(data);
      _this.props.eventListener.secondaryFilterRequest(data, _this.props.customParamData);
      _this.props.confirm();
    };
    _this.tempData = {
      conditionList: [],
      logicalAnd: true,
      not: false
    }; //接受onChange回调临时变量
    _this.state = {
      coustomFilters: {
        'muti-select': SelectFilter,
        'time-picker': TimePicker,
        'input-select': Switchable,
        status: Status
      },
      setBlank: false
    };
    return _this;
  }
  _inherits(Default, _PureComponent);
  return _createClass(Default, [{
    key: "render",
    value: function render() {
      var _this$state = this.state,
        coustomFilters = _this$state.coustomFilters,
        setBlank = _this$state.setBlank;
      var _this$props2 = this.props,
        coustomFilterType = _this$props2.coustomFilterType,
        paramData = _this$props2.paramData,
        theme = _this$props2.theme;
      var CoustomFilter = coustomFilters[coustomFilterType];
      return /*#__PURE__*/React.createElement("div", {
        className: "alarm-window-custom-filters ".concat(theme)
      }, /*#__PURE__*/React.createElement("div", {
        className: "alarm-window-custom-filters-background"
      }, /*#__PURE__*/React.createElement(CoustomFilter, _extends({
        style: {
          width: '100%'
        }
      }, this.props, {
        paramData: paramData,
        setBlank: setBlank,
        onChange: this.onChange,
        onReset: this.onReset
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: 16
        }
      }, /*#__PURE__*/React.createElement(Button, {
        size: "small",
        onClick: this.onConfirmClick
      }, "\u786E\u5B9A"), /*#__PURE__*/React.createElement(Button, {
        size: "small",
        onClick: this.onResetClick
      }, "\u6E05\u9664"))));
    }
  }]);
}(PureComponent);
export { Default as default };