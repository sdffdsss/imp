function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
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
import { Tabs, Row, Col, Checkbox } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import serviceConfig from '../../../../hox';
import { produce } from 'immer';
import imageUrl from '../../../assets/Alarm/state';
var Index = /*#__PURE__*/function (_PureComponent) {
  function Index(props) {
    var _this;
    _classCallCheck(this, Index);
    _this = _callSuper(this, Index, [props]);
    _this.getFilterConfig = function (data1, data2) {
      var newDefaultConfig = data1.map(function (el) {
        var findIdxFlag = data2.findIndex(function (field) {
          return field.storeFieldName === el.fieldName;
        }) !== -1;
        if (el.fieldName === "subway_supervisor_type") {
          var newAlarmStatus = el.AlarmStatus.filter(function (element) {
            return data2.some(function (itm) {
              return itm.storeFieldName === element.fieldName;
            });
          });
          if (newAlarmStatus.length === 0) {
            return null;
          }
          return _objectSpread(_objectSpread({}, el), {}, {
            AlarmStatus: newAlarmStatus
          });
        }
        if (findIdxFlag) {
          return el;
        }
        return null;
      });
      var defaultConfig = newDefaultConfig.filter(function (el) {
        return el;
      });
      return defaultConfig;
    };
    /**
     * @description: 处理数据
     * @param {*}
     * @return {*}
     */
    _this.handleData = function () {
      var paramData = _this.props.paramData;
      var defaultConfig = _this.getFilterConfig(serviceConfig.data.statusConfig, _this.props.colData.field);
      var tempParamData = produce(paramData, function (draft) {
        return draft;
      });
      _this.setState({
        tempParamData: tempParamData,
        activeStatusIcon: defaultConfig,
        activeKey: defaultConfig[0].fieldName
      }, function () {
        _this.getValue();
      });
    };
    /**
     * @description: 监听当前tab选中值
     * @param {*} statusItem
     * @param {*} checkArr
     * @return {*}
     */
    _this.onChange = function (statusItem, checkArr) {
      var _this$state = _this.state,
        tempParamData = _this$state.tempParamData,
        activeStatusIcon = _this$state.activeStatusIcon,
        activeKey = _this$state.activeKey;
      var checkAll = false;
      var nextData = produce(tempParamData, function (draft) {
        var thisData = _.find(draft.conditionList, {
          fieldName: statusItem.fieldName
        });
        if (checkArr && checkArr.length > 0) {
          var activeStausIconTabs = _.find(activeStatusIcon, {
            fieldName: activeKey
          });
          if (checkArr.length === activeStausIconTabs.AlarmStatus.length) {
            checkAll = true;
          }
          thisData ? thisData.value = _toConsumableArray(checkArr) : draft.conditionList.push({
            fieldName: statusItem.fieldName,
            not: false,
            operator: 'in',
            value: _toConsumableArray(checkArr)
          });
        } else {
          if (thisData) {
            _.pull(draft.conditionList, _.find(draft.conditionList, {
              fieldName: statusItem.fieldName
            }));
          }
        }
      });
      if (statusItem.fieldName === 'subway_supervisor_type') {
        var conditionList = statusItem.AlarmStatus.filter(function (item) {
          return checkArr.includes(item.id);
        }).map(function (el) {
          return {
            fieldName: el.fieldName,
            not: false,
            operator: 'in',
            value: [el.value]
          };
        });
        nextData = {
          conditionList: conditionList,
          logicalAnd: true,
          not: false
        };
      }
      _this.setState({
        checkAll: checkAll,
        tempParamData: nextData,
        checkedValues: _toConsumableArray(checkArr)
      });
      _this.props.onChange && _this.props.onChange(nextData);
    };
    /**
     * @description: 从数组中获取当前tab选中值
     * @param {*}
     * @return {*}
     */
    _this.getValue = function () {
      var _this$state2 = _this.state,
        activeKey = _this$state2.activeKey,
        tempParamData = _this$state2.tempParamData,
        activeStatusIcon = _this$state2.activeStatusIcon;
      var value = _.find(tempParamData.conditionList, {
        fieldName: activeKey
      }) ? _.find(tempParamData.conditionList, {
        fieldName: activeKey
      }).value : [];
      var checkAll = false;
      var activeStausIconTabs = _.find(activeStatusIcon, {
        fieldName: activeKey
      });
      if (value.length === activeStausIconTabs.AlarmStatus.length) {
        checkAll = true;
      }
      if (activeKey === 'subway_supervisor_type') {
        var findactiveStatusItem = activeStatusIcon.find(function (item) {
          return item.fieldName === 'subway_supervisor_type';
        });
        value = findactiveStatusItem.AlarmStatus.filter(function (item) {
          return tempParamData.conditionList.map(function (el) {
            return el.fieldName;
          }).includes(item.fieldName);
        }).map(function (itm) {
          return itm.id;
        });
        if (findactiveStatusItem.AlarmStatus.length === value.length) {
          checkAll = true;
        }
      }
      _this.setState({
        checkedValues: value,
        checkAll: checkAll
      });
    };
    /**
     * @description: tab栏切换
     * @param {*} activeKey
     * @return {*}
     */
    _this.onTabChange = function (activeKey) {
      _this.setState({
        activeKey: activeKey
      }, function () {
        _this.getValue();
      });
    };
    /**
     * @description: 清空所有tab下值
     * @param {*}
     * @return {*}
     */
    _this.setBlankData = function () {
      var _this$state3 = _this.state,
        activeStatusIcon = _this$state3.activeStatusIcon,
        tempParamData = _this$state3.tempParamData;
      var nextData = produce(tempParamData, function (draft) {
        activeStatusIcon.forEach(function (item) {
          var thisData = _.find(draft.conditionList, {
            fieldName: item.fieldName
          });
          if (thisData) {
            _.pull(draft.conditionList, _.find(draft.conditionList, {
              fieldName: item.fieldName
            }));
          }
        });
      });
      _this.props.onReset && _this.props.onReset(nextData, false);
    };
    _this.onCheckAllChange = function (e, statusItem) {
      var tempParamData = _this.state.tempParamData;
      var checkArr = e.target.checked ? statusItem.AlarmStatus.map(function (item) {
        return item.id;
      }) : [];
      var nextData = produce(tempParamData, function (draft) {
        var thisData = _.find(draft.conditionList, {
          fieldName: statusItem.fieldName
        });
        if (e.target.checked) {
          thisData ? thisData.value = _toConsumableArray(checkArr) : draft.conditionList.push({
            fieldName: statusItem.fieldName,
            not: false,
            operator: 'in',
            value: _toConsumableArray(checkArr)
          });
        } else {
          if (thisData) {
            _.pull(draft.conditionList, _.find(draft.conditionList, {
              fieldName: statusItem.fieldName
            }));
          }
        }
      });
      if (statusItem.fieldName === 'subway_supervisor_type') {
        var conditionList = statusItem.AlarmStatus.filter(function (item) {
          return checkArr.includes(item.id);
        }).map(function (el) {
          return {
            fieldName: el.fieldName,
            not: false,
            operator: 'in',
            value: [el.value]
          };
        });
        nextData = {
          conditionList: conditionList,
          logicalAnd: true,
          not: false
        };
      }
      _this.setState({
        checkAll: e.target.checked,
        tempParamData: nextData,
        checkedValues: _toConsumableArray(checkArr)
      });
      _this.props.onChange && _this.props.onChange(nextData);
    };
    _this.state = {
      activeStatusIcon: [],
      activeKey: '',
      tempParamData: {},
      checkedValues: [],
      checkAll: false
    };
    return _this;
  }
  _inherits(Index, _PureComponent);
  return _createClass(Index, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleData();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.dropdownVisible !== this.props.dropdownVisible && this.props.dropdownVisible) {
        this.handleData();
      }
      if (prevProps.setBlank !== this.props.setBlank && this.props.setBlank) {
        this.setBlankData();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$state4 = this.state,
        activeStatusIcon = _this$state4.activeStatusIcon,
        activeKey = _this$state4.activeKey,
        checkedValues = _this$state4.checkedValues,
        checkAll = _this$state4.checkAll;
      var TabPane = Tabs.TabPane;
      return /*#__PURE__*/React.createElement(Tabs, {
        type: "card",
        onChange: this.onTabChange,
        activeKey: activeKey,
        size: "small"
      }, activeStatusIcon.map(function (statusItem) {
        return /*#__PURE__*/React.createElement(TabPane, {
          tab: statusItem.displayName,
          key: statusItem.fieldName
        }, /*#__PURE__*/React.createElement(Checkbox, {
          style: {
            width: '100%',
            display: 'flex',
            margin: '0'
          },
          onChange: function onChange(e) {
            return _this2.onCheckAllChange(e, statusItem);
          },
          checked: checkAll
        }, "\u5168\u9009"), /*#__PURE__*/React.createElement(Checkbox.Group, {
          style: {
            width: '100%'
          },
          onChange: function onChange(values) {
            return _this2.onChange(statusItem, values);
          },
          value: checkedValues
        }, /*#__PURE__*/React.createElement(Row, null, statusItem.AlarmStatus.map(function (iconItem) {
          return /*#__PURE__*/React.createElement(Col, {
            span: 12,
            key: statusItem.fieldName + iconItem.id
          }, /*#__PURE__*/React.createElement(Checkbox, {
            value: iconItem.id
          }, /*#__PURE__*/React.createElement("img", {
            alt: "icon",
            src: imageUrl[iconItem.image]
          }), iconItem.name));
        }))));
      }));
    }
  }]);
}(PureComponent);
export { Index as default };