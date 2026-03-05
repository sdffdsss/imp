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
import { Descriptions, message, Spin } from 'oss-ui';
import ReactJson from 'react-json-view';
import Common from '../../../common';
import serviceConfig from '../../../hox';
import "./index.css";
var Default = /*#__PURE__*/function (_PureComponent) {
  function Default(props) {
    var _this;
    _classCallCheck(this, Default);
    _this = _callSuper(this, Default, [props]);
    _this.getDetail = function (alarm_id) {
      var _this$props = _this.props,
        extendEventMap = _this$props.extendEventMap,
        textTarget = _this$props.textTarget,
        registerInfo = _this$props.registerInfo;
      if (extendEventMap === null || extendEventMap === void 0 ? void 0 : extendEventMap.onTableDoubleClick) {
        extendEventMap.onTableDoubleClick(textTarget, function (res) {
          if (res && res.length) {
            _this.setState({
              loading: false,
              detail: res
            });
          } else {
            message.error('获取数据失败');
            _this.setState({
              loading: false,
              detail: []
            });
          }
        });
        return;
      }
      Common.request(null, {
        fullUrl: serviceConfig.data.serviceConfig.otherService.viewItemUrl + 'flow/alarm-info',
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        defaultErrorMessage: '获取数据失败',
        data: {
          alarmId: alarm_id,
          sessionId: registerInfo === null || registerInfo === void 0 ? void 0 : registerInfo.clientSessionId
        }
      }).then(function (result) {
        if (result && result.length) {
          _this.setState({
            loading: false,
            detail: result
          });
        } else {
          _this.setState({
            loading: false,
            detail: []
          });
        }
      }).catch(function (err) {
        _this.setState({
          loading: false,
          detail: []
        });
      });

      // eventListener.getAlarmInfoRequest(alarm_id, (res) => {
      //     const detail = JSON.parse(res.responseDataJSON);
      //     if (Array.isArray(detail)) {
      //         this.setState({
      //             loading: false,
      //             detail: detail,
      //         });
      //     } else {
      //         message.error('告警双击返回值格式错误！');
      //         this.setState({
      //             loading: false,
      //         });
      //     }
      // });
    };
    _this.formatterText = function (text, fieldName) {
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
          return /*#__PURE__*/React.createElement(ReactJson, {
            displayObjectSize: false,
            displayDataTypes: false,
            name: false,
            src: JSON.parse(text)
          });
        } else {
          return /*#__PURE__*/React.createElement("pre", {
            style: {
              whiteSpace: 'pre-wrap'
            }
          }, text);
        }
      }
      return text;
    };
    _this.state = {
      loading: true,
      detail: []
    };
    return _this;
  }
  _inherits(Default, _PureComponent);
  return _createClass(Default, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props$textTarge, _this$props$textTarge2;
      this.getDetail((_this$props$textTarge = this.props.textTarget) === null || _this$props$textTarge === void 0 ? void 0 : (_this$props$textTarge2 = _this$props$textTarge.alarm_id) === null || _this$props$textTarge2 === void 0 ? void 0 : _this$props$textTarge2.value);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props$textTarge3, _this$props$textTarge4, _prevProps$textTarget, _prevProps$textTarget2;
      if (((_this$props$textTarge3 = this.props.textTarget) === null || _this$props$textTarge3 === void 0 ? void 0 : (_this$props$textTarge4 = _this$props$textTarge3.alarm_id) === null || _this$props$textTarge4 === void 0 ? void 0 : _this$props$textTarge4.value) !== ((_prevProps$textTarget = prevProps.textTarget) === null || _prevProps$textTarget === void 0 ? void 0 : (_prevProps$textTarget2 = _prevProps$textTarget.alarm_id) === null || _prevProps$textTarget2 === void 0 ? void 0 : _prevProps$textTarget2.value)) {
        var _this$props$textTarge5, _this$props$textTarge6;
        this.getDetail((_this$props$textTarge5 = this.props.textTarget) === null || _this$props$textTarge5 === void 0 ? void 0 : (_this$props$textTarge6 = _this$props$textTarge5.alarm_id) === null || _this$props$textTarge6 === void 0 ? void 0 : _this$props$textTarge6.value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$state = this.state,
        loading = _this$state.loading,
        detail = _this$state.detail;
      return /*#__PURE__*/React.createElement(Spin, {
        spinning: loading,
        style: {
          lineHeight: '300px'
        }
      }, /*#__PURE__*/React.createElement(Descriptions, {
        className: "detail-desc",
        bordered: true,
        column: 4,
        style: {
          minHeight: 300,
          maxHeight: 300,
          overflow: 'auto'
        }
      }, detail.map(function (field) {
        return /*#__PURE__*/React.createElement(Descriptions.Item, {
          label: field.fieldNameZh,
          span: 4,
          labelStyle: {
            width: '30%',
            minWidth: '100px'
          },
          key: field.filedNameEn
        }, _this2.formatterText(field.fieldValue, field.filedNameEn));
      })));
    }
  }]);
}(PureComponent);
export { Default as default };