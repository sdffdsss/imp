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
import { Checkbox, Input, Spin } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { produce } from 'immer';
import "./index.css";
var Search = Input.Search;
var SelectFilter = /*#__PURE__*/function (_PureComponent) {
  function SelectFilter(props) {
    var _this;
    _classCallCheck(this, SelectFilter);
    _this = _callSuper(this, SelectFilter, [props]);
    /**
     * @description: 选中过滤项事件
     * @param {*} checkedValues
     * @return {*}
     */
    _this.onChange = function (checkedValues) {
      var _this$state$optionDat = _this.state.optionData,
        optionData = _this$state$optionDat === void 0 ? [] : _this$state$optionDat;
      var allValue = Array.isArray(optionData) ? optionData.map(function (optionItem) {
        return optionItem.originalValue;
      }) : [];
      _this.setState({
        checkAll: _.isEqual(_.sortBy(checkedValues), _.sortBy(allValue)),
        checkedList: checkedValues
      });
      _this.onDataChange(checkedValues);
    };
    /**
     * @description: 全选操作
     * @param {*} e
     * @return {*}
     */
    _this.onCheckAllChange = function (e) {
      var _this$state$optionDat2 = _this.state.optionData,
        optionData = _this$state$optionDat2 === void 0 ? [] : _this$state$optionDat2;
      var allValue = Array.isArray(optionData) && optionData.map(function (optionItem) {
        return optionItem.originalValue;
      }) || [];
      var checkedValues = e.target.checked ? allValue : [];
      _this.setState({
        checkedList: checkedValues,
        checkAll: e.target.checked
      });
      _this.onDataChange(checkedValues);
    };
    /**
     * @description: 监听选中值变化
     * @param {*} checkedValues
     * @return {*}
     */
    _this.onDataChange = function (checkedValues) {
      var _this$props = _this.props,
        paramData = _this$props.paramData,
        colData = _this$props.colData;
      var nextData = produce(paramData, function (draft) {
        var thisData = null;
        if (draft) {
          thisData = _.find(draft.conditionList, {
            fieldName: colData.field
          });
        }
        thisData ? thisData.value = checkedValues : draft.conditionList.push({
          fieldName: colData.field,
          not: false,
          operator: 'in',
          value: checkedValues
        });
      });
      _this.props.onChange && _this.props.onChange(nextData, false);
    };
    /**
     * @description: 输入框筛选
     * @param {*} input
     * @return {*}
     */
    _this.onSearch = function (input) {
      // todo-固定宽度
      var allOptionData = _this.state.allOptionData;
      var optionData = [];
      Array.isArray(allOptionData) && allOptionData.forEach(function (item) {
        if (item.afterEnumValue.indexOf(input) > -1) {
          optionData.push(item);
        }
      });
      _this.setState({
        checkedList: [],
        checkAll: false,
        optionData: optionData
      });
    };
    /**
     * @description: 输入框筛选选中值
     * @param {*} e
     * @return {*}
     */
    _this.onInputChange = function (e) {
      // todo-固定宽度
      _this.loadData(e.target.value);
    };
    _this.state = {
      allOptionData: [],
      // 所有options选项
      optionData: [],
      // 输入框过滤后options选项
      checkedList: [],
      // 选中项列表
      // indeterminate: true,
      checkAll: false,
      // 全选
      loading: true
    };
    _this.onInputChange = _.debounce(_this.onInputChange, 500);
    return _this;
  }
  _inherits(SelectFilter, _PureComponent);
  return _createClass(SelectFilter, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadData();
    }

    /**
     * @description: 加载数据
     * @param {*}
     * @return {*}
     */
  }, {
    key: "loadData",
    value: function loadData(searchContent) {
      var _this2 = this;
      var _this$props2 = this.props,
        paramData = _this$props2.paramData,
        colData = _this$props2.colData,
        eventListener = _this$props2.eventListener;
      if (!this.state.loading) this.setState({
        loading: true
      });
      var param = {
        fieldName: colData.field
      };
      searchContent && Object.assign(param, {
        searchContent: searchContent
      });
      eventListener.getDistinctFieldValuesRequest(param, function (res) {
        if (res && res.responseDataJSON) {
          var _checklistObj$value;
          var allOptionData = JSON.parse(res.responseDataJSON);
          var optionData = JSON.parse(res.responseDataJSON);
          var checkAll = false;
          var checklistObj = _.find(paramData.conditionList, {
            fieldName: colData.field
          });
          if (Array.isArray(optionData) && optionData.length === (checklistObj === null || checklistObj === void 0 ? void 0 : (_checklistObj$value = checklistObj.value) === null || _checklistObj$value === void 0 ? void 0 : _checklistObj$value.length)) {
            checkAll = true;
          }
          _this2.setState({
            allOptionData: allOptionData,
            optionData: optionData,
            checkAll: checkAll,
            checkedList: checklistObj && checklistObj.value || [],
            loading: false
          });
        }
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.dropdownVisible !== this.props.dropdownVisible && this.props.dropdownVisible) {
        this.loadData();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var _this$state = this.state,
        optionData = _this$state.optionData,
        checkAll = _this$state.checkAll,
        checkedList = _this$state.checkedList,
        loading = _this$state.loading;
      return /*#__PURE__*/React.createElement("div", {
        className: "alarm-column-multi-select"
      }, /*#__PURE__*/React.createElement(Search, {
        placeholder: "\u641C\u7D22",
        onSearch: function onSearch(val) {
          return _this3.onSearch(val);
        },
        onChange: function onChange(event) {
          event.persist();
          _this3.onInputChange(event);
        },
        style: {
          width: '100%',
          display: 'flex'
        },
        size: "small"
      }), loading ? /*#__PURE__*/React.createElement(Spin, {
        style: {
          textAlign: 'center',
          width: '100%',
          minHeight: 50,
          lineHeight: '50px'
        }
      }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Checkbox, {
        className: "alarm-column-multi-select-checkbox-all",
        onChange: this.onCheckAllChange,
        checked: checkAll
      }, "\u5168\u9009"), /*#__PURE__*/React.createElement("div", {
        className: "alarm-column-multi-select-checkbox-group"
      }, /*#__PURE__*/React.createElement(Checkbox.Group, {
        style: {
          width: '100%'
        },
        onChange: function onChange(checkedValues) {
          return _this3.onChange(checkedValues);
        },
        value: checkedList
      }, Array.isArray(optionData) && optionData.map(function (item) {
        return /*#__PURE__*/React.createElement("div", {
          className: "alarm-column-multi-select-checkbox",
          key: item.originalValue
        }, /*#__PURE__*/React.createElement(Checkbox, {
          value: item.originalValue,
          key: item.originalValue
        }, item.afterEnumValue));
      })))));
    }
  }]);
}(PureComponent);
export { SelectFilter as default };