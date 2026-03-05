function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["customParamData", "columns"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Card, Form, message } from 'oss-ui';
import FilterItem from './filter-item';
import produce from 'immer';
import dayjs from 'dayjs';
import { RightAngleLogicLine } from './line';
import Logic from './logic';
import { makeCRC32 } from '../../../common/genId';
import "./index.css";
var CustomFilter = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _useState = useState(true),
    _useState2 = _slicedToArray(_useState, 2),
    logicalAnd = _useState2[0],
    setLogicalAnd = _useState2[1];
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    conditionList = _useState4[0],
    setConditionList = _useState4[1];
  var customParamData = props.customParamData,
    columns = props.columns,
    restProps = _objectWithoutProperties(props, _excluded);
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    lines = _useState6[0],
    setLines = _useState6[1];
  useImperativeHandle(ref, function () {
    return {
      customValid: true,
      submit: customFilterSubmit,
      validateFields: validateFields
    };
  });
  useEffect(function () {
    var _customParamData$cond;
    var conditionListTemp = null;
    if (Array.isArray(customParamData === null || customParamData === void 0 ? void 0 : customParamData.conditionList) && (customParamData === null || customParamData === void 0 ? void 0 : (_customParamData$cond = customParamData.conditionList) === null || _customParamData$cond === void 0 ? void 0 : _customParamData$cond.length) > 0) {
      conditionListTemp = customParamData === null || customParamData === void 0 ? void 0 : customParamData.conditionList.map(function (item, index) {
        var tempObj = _objectSpread(_objectSpread({}, item), {}, {
          value: item.coustomFilterType === 'time-picker' ? item.value.map(function (val) {
            return dayjs(new Date(val));
          }) : item.value,
          key: makeCRC32(index.toString())
        });
        if (item.operator === 'in') {
          tempObj.operator = item.not ? 'ex' : 'in';
        }
        return tempObj;
      });
    } else {
      // 无数据时默认显示一行
      conditionListTemp = [{
        operator: null,
        fieldName: null,
        value: [],
        coustomFilterType: 'muti-select',
        key: makeCRC32('0')
      }];
    }
    setLogicalAnd(customParamData.logicalAnd);
    setConditionList(conditionListTemp);
  }, [customParamData]);
  useEffect(function () {
    setLines(strokeLine());
  }, [conditionList]);

  /**
   * @description: 监听逻辑选择变化
   * @param {*}
   * @return {*}
   */

  var onLogicalChange = function onLogicalChange(value) {
    setLogicalAnd(value);
  };

  /**
   * @description: 增加新条件
   * @param {*}
   * @return {*}
   */

  var onAddNewFilter = function onAddNewFilter() {
    var nextData = produce(conditionList, function (draft) {
      draft.push({
        operator: null,
        fieldName: null,
        value: [],
        coustomFilterType: 'muti-select',
        key: makeCRC32(draft.length.toString())
      });
    });
    setConditionList(nextData);
  };

  /**
   * @description: 监听单项过滤条件变化
   * @param {*} item
   * @param {*} index
   * @return {*}
   */

  var onFilterChange = function onFilterChange(item, index) {
    var nextData = produce(conditionList, function (draft) {
      draft[index] = item;
    });
    setConditionList(nextData);
  };

  /**
   * @description: 监听删除数据变化
   * @param {*} index
   * @return {*}
   */

  var onDeleteFilterItem = function onDeleteFilterItem(index) {
    var nextData = produce(conditionList, function (draft) {
      draft.splice(index, 1);
    });
    setConditionList(nextData);
  };

  /**
   * @description: 数据校验
   * @param {*}
   * @return {*}
   */

  var validateFields = function validateFields() {
    return new Promise(function (resolve, reject) {
      if (!Array.isArray(conditionList)) {
        reject(new Error('报错'));
        return;
      }
      var errorList = [];
      conditionList.forEach(function (condition, index) {
        var _condition$value;
        if (!(condition === null || condition === void 0 ? void 0 : condition.fieldName) || !(condition === null || condition === void 0 ? void 0 : condition.value) || Array.isArray(condition === null || condition === void 0 ? void 0 : condition.value) && (condition === null || condition === void 0 ? void 0 : (_condition$value = condition.value) === null || _condition$value === void 0 ? void 0 : _condition$value.length) === 0) {
          errorList.push(index + 1);
        }
      });
      if (errorList.length > 0) {
        message.error("\u7B2C".concat(errorList.join('、'), "\u884C\u672A\u586B\u5199\u5B8C\u6574\uFF0C\u8BF7\u4ED4\u7EC6\u68C0\u67E5\u540E\u586B\u5199\u63D0\u4EA4"));
        reject(new Error('报错'));
        return;
      }
      resolve();
    });
  };

  /**
   * @description: 提交方法
   * @param {*}
   * @return {*}
   */

  var customFilterSubmit = function customFilterSubmit() {
    var para = {
      logicalAnd: logicalAnd,
      conditionList: [],
      not: false
    };
    para.conditionList = conditionList.map(function (item) {
      var tempObj = _objectSpread(_objectSpread({}, item), {}, {
        value: item.coustomFilterType === 'time-picker' ? item.value.map(function (val) {
          return new Date(val).getTime();
        }) : item.value
      });
      if (item.operator === 'ex') {
        tempObj.not = true;
        tempObj.operator = 'in';
      } else {
        tempObj.not = false;
      }
      return tempObj;
    });
    props.onToolDateChange && props.onToolDateChange(para);
  };

  /**
   * @description: 画线
   * @param {*}
   * @return {*}
   */

  var strokeLine = function strokeLine() {
    var linesArr = [];
    for (var i = 0; i < (Array.isArray(conditionList) && conditionList.length); i++) {
      linesArr.push(/*#__PURE__*/React.createElement(RightAngleLogicLine, {
        key: i,
        lineColor: "#d9d9d9",
        from: "#filter-logic",
        to: "#filter-item-".concat(i),
        fromAnchor: "right",
        toAnchor: "left",
        orientation: "h",
        lineWidth: 1,
        within: ".filter-wrapper"
      }));
    }
    return linesArr;
  };
  return /*#__PURE__*/React.createElement(Form, {
    name: "customFilter",
    autoComplete: "off"
  }, /*#__PURE__*/React.createElement("div", {
    className: "custom-filter-container"
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: '4px'
    }
  }, /*#__PURE__*/React.createElement("section", {
    className: "filter-wrapper-inner"
  }, /*#__PURE__*/React.createElement("section", {
    className: "condition-header-style",
    style: {
      paddingLeft: conditionList.length > 1 ? '80px' : ''
    }
  }, /*#__PURE__*/React.createElement("section", {
    className: "form-title-text"
  }, "\u6240\u5728\u5217"), /*#__PURE__*/React.createElement("section", {
    className: "form-title-text"
  }, "\u64CD\u4F5C"), /*#__PURE__*/React.createElement("section", {
    className: "form-title-text"
  }, "\u5B57\u6BB5\u503C"), /*#__PURE__*/React.createElement("section", {
    className: "form-title-text"
  })), /*#__PURE__*/React.createElement("section", {
    className: "condition-list-wrapper"
  }, /*#__PURE__*/React.createElement("section", {
    className: "condition-list-style filter-wrapper",
    style: {
      paddingLeft: conditionList.length > 1 ? '80px' : ''
    }
  }, Array.isArray(conditionList) && conditionList.length > 1 && /*#__PURE__*/React.createElement(Logic, {
    onChange: onLogicalChange,
    logicalType: logicalAnd,
    id: "filter-logic"
  }), conditionList.map(function (item, index) {
    return /*#__PURE__*/React.createElement("section", {
      id: "filter-item-".concat(index),
      key: item.key
    }, /*#__PURE__*/React.createElement(FilterItem, _extends({
      data: item,
      showDelete: conditionList.length > 1,
      columns: columns,
      className: "condition-item",
      index: index,
      onFilterChange: onFilterChange,
      onAddNewFilter: onAddNewFilter,
      onDeleteFilterItem: onDeleteFilterItem
    }, restProps)));
  })))), Array.isArray(conditionList) && conditionList.length > 1 && lines)));
});
export default CustomFilter;