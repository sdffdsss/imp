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
import { Descriptions, message, Spin, Card, Divider } from 'oss-ui';
import { alarmTextShow, alarmReadyTextShow, alarmTextShowPlatForm } from '../../alarm-show-config';
import Common from '../../../common';
import serviceConfig from '../../../hox';
import ReactJson from 'react-json-view';
import { _ } from 'oss-web-toolkits';
var Default = /*#__PURE__*/function (_PureComponent) {
  function Default(props) {
    var _this;
    _classCallCheck(this, Default);
    _this = _callSuper(this, Default, [props]);
    _this.formatterText = function (text, fieldName) {
      var theme = _this.props.theme;
      var isJSON_test = function isJSON_test(str) {
        if (typeof str == 'string') {
          try {
            var obj = JSON.parse(str);
            return true;
          } catch (e) {
            return false;
          }
        } else {
          return false;
        }
      };
      if (fieldName === 'alarm_text') {
        if (isJSON_test(text) && _.isObject(JSON.parse(text))) {
          return /*#__PURE__*/React.createElement("div", {
            className: "alarm-text-unicom"
          }, /*#__PURE__*/React.createElement(ReactJson, {
            style: {
              backgroundColor: 'transparent'
            },
            theme: theme.includes('light') ? 'bright:inverted' : 'bright',
            displayObjectSize: false,
            displayDataTypes: false,
            name: false,
            src: JSON.parse(text)
          }));
        } else {
          return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("pre", {
            style: {
              whiteSpace: 'pre-wrap'
            }
          }, text));
        }
      }
      if (fieldName === 'preprocess_result') {
        var _message = "".concat(text);
        var str = _message.replace(/\\r\\n/g, '\r\n');
        var epx = /(?:https?|ftp):\/\/([^\s"'>]+)/g;
        var url = str.match(epx);
        var link = null;
        if (Array.isArray(url)) {
          link = /*#__PURE__*/React.createElement("a", {
            href: "javascript:;",
            onClick: function onClick() {
              return window.open(url[0]);
            }
          }, url[0]);
          str = str.replace(url[0], '');
        }
        return /*#__PURE__*/React.createElement("pre", {
          style: {
            whiteSpace: 'pre-wrap',
            margin: 0,
            overflow: 'inherit'
          }
        }, str, link || '');
      }
      if (fieldName === 'alarm_content') {
        var strs = "".concat(text);
        var _str = strs.replace(/\\r\\n/g, '\r\n');
        _str = _str.replace(/\?/g, '✦');
        return /*#__PURE__*/React.createElement("pre", {
          style: {
            whiteSpace: 'pre-wrap',
            margin: 0,
            overflow: 'inherit'
          }
        }, _str);
      }
      return text;
    };
    _this.state = {
      recordsDetail: [],
      alarmTextLoading: true
    };
    return _this;
  }
  _inherits(Default, _PureComponent);
  return _createClass(Default, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this,
        _this$props$textTarge,
        _this$props$textTarge2;
      var _this$props = this.props,
        extendEventMap = _this$props.extendEventMap,
        textTarget = _this$props.textTarget;
      if (extendEventMap === null || extendEventMap === void 0 ? void 0 : extendEventMap.getRecordsDetail) {
        extendEventMap.getRecordsDetail(textTarget, function (res) {
          if (res && res.length && res[0]) {
            _this2.setState({
              alarmTextLoading: false,
              recordsDetail: Object.values(res[0])
            });
          } else {
            message.error('获取数据失败');
            _this2.setState({
              alarmTextLoading: false,
              recordsDetail: {}
            });
          }
        });
        return;
      }
      Common.request(null, {
        fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.viewItemUrl, "flow/alarm-detail"),
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: true,
        defaultErrorMessage: '获取数据失败',
        data: {
          alarmIdList: [(_this$props$textTarge = this.props.textTarget) === null || _this$props$textTarge === void 0 ? void 0 : (_this$props$textTarge2 = _this$props$textTarge.alarm_id) === null || _this$props$textTarge2 === void 0 ? void 0 : _this$props$textTarge2.value],
          sessionId: serviceConfig.data.sessionId
        }
      }).then(function (result) {
        var _result$;
        _this2.setState({
          recordsDetail: (_result$ = result[0]) === null || _result$ === void 0 ? void 0 : _result$.alarmFieldList,
          alarmTextLoading: false
        });
      }).catch(function () {
        _this2.setState({
          recordsDetail: [],
          alarmTextLoading: false
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var columns = this.props.columns;
      var _this$state = this.state,
        recordsDetail = _this$state.recordsDetail,
        alarmTextLoading = _this$state.alarmTextLoading;
      var prefessionalTypeObject = recordsDetail.find(function (item) {
        return item.field === 'professional_type';
      });
      return /*#__PURE__*/React.createElement(Spin, {
        spinning: alarmTextLoading
      }, /*#__PURE__*/React.createElement(Card, {
        className: "alarm-card",
        bordered: false,
        title: /*#__PURE__*/React.createElement("div", {
          className: "alarm-card-title"
        }, /*#__PURE__*/React.createElement(Divider, {
          className: "alarm-card-title-divider",
          type: "vertical"
        }), /*#__PURE__*/React.createElement("span", null, "\u544A\u8B66\u4FE1\u606F"))
      }, (String(prefessionalTypeObject === null || prefessionalTypeObject === void 0 ? void 0 : prefessionalTypeObject.value) === '85' ? alarmTextShowPlatForm : alarmTextShow).map(function (field) {
        var _columns$find, _$find, _$find2;
        var label = (columns === null || columns === void 0 ? void 0 : (_columns$find = columns.find(function (item) {
          return item.field === field.fieldName;
        })) === null || _columns$find === void 0 ? void 0 : _columns$find.title) || field.label;
        return /*#__PURE__*/React.createElement("div", {
          className: "alarm-text-form-item",
          style: field.boxStyle
        }, /*#__PURE__*/React.createElement("span", {
          className: "alarm-text-form-item-label"
        }, label), /*#__PURE__*/React.createElement("div", {
          className: "alarm-text-form-item-value",
          style: field.valueStyle
        }, _this3.formatterText(((_$find = _.find(recordsDetail, {
          field: field.fieldName
        })) === null || _$find === void 0 ? void 0 : _$find.lable) || ((_$find2 = _.find(recordsDetail, {
          field: field.fieldName
        })) === null || _$find2 === void 0 ? void 0 : _$find2.value) || '-', field.fieldName)));
      })), /*#__PURE__*/React.createElement(Divider, {
        className: "divider-between-card",
        type: "horizontal"
      }), /*#__PURE__*/React.createElement(Card, {
        className: "alarm-card",
        bordered: false,
        title: /*#__PURE__*/React.createElement("div", {
          className: "alarm-card-title"
        }, /*#__PURE__*/React.createElement(Divider, {
          className: "alarm-card-title-divider",
          type: "vertical"
        }), /*#__PURE__*/React.createElement("span", null, "\u9884\u5904\u7406\u4FE1\u606F"))
      }, alarmReadyTextShow.map(function (field) {
        var _$find3, _$find4;
        return /*#__PURE__*/React.createElement("div", {
          className: "alarm-text-form-item",
          style: field.boxStyle
        }, /*#__PURE__*/React.createElement("span", {
          className: "alarm-text-form-item-label"
        }, field.label), /*#__PURE__*/React.createElement("div", {
          className: "alarm-text-form-item-value",
          style: field.valueStyle
        }, _this3.formatterText(((_$find3 = _.find(recordsDetail, {
          field: field.fieldName
        })) === null || _$find3 === void 0 ? void 0 : _$find3.lable) || ((_$find4 = _.find(recordsDetail, {
          field: field.fieldName
        })) === null || _$find4 === void 0 ? void 0 : _$find4.value) || '-', field.fieldName)));
      })));
    }
  }]);
}(PureComponent);
export { Default as default };