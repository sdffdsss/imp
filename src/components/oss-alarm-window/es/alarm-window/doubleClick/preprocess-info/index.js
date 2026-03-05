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
import { Spin, Card, message, Divider } from 'oss-ui';
import Common from '../../../common';
import serviceConfig from '../../../hox';
import "./index.css";
import { _ } from 'oss-web-toolkits';
import { getViewItemData } from '../../common/proxy';
import { rightClickViewPageArgs } from '../../alarm-show-config';
import dayjs from 'dayjs';
var Default = /*#__PURE__*/function (_PureComponent) {
  function Default(props) {
    var _this;
    _classCallCheck(this, Default);
    _this = _callSuper(this, Default, [props]);
    _this.getDetail = function (alarm_id, type) {
      var _this$props = _this.props,
        eventListener = _this$props.eventListener,
        extendEventMap = _this$props.extendEventMap,
        textTarget = _this$props.textTarget,
        registerInfo = _this$props.registerInfo;
      // if (extendEventMap?.getPretreatment) {
      //     extendEventMap.getPretreatment(textTarget, (res) => {
      //         this.setState({
      //             loading: false,
      //             detail: res,
      //         });
      //     });
      //     return;
      // }
      var viewPageArgs = {};
      _.forEach(rightClickViewPageArgs, function (item) {
        var _this$props$textTarge, _this$props$textTarge2;
        viewPageArgs[item.label] = (_this$props$textTarge = _this.props.textTarget) === null || _this$props$textTarge === void 0 ? void 0 : (_this$props$textTarge2 = _this$props$textTarge[item.fieldName]) === null || _this$props$textTarge2 === void 0 ? void 0 : _this$props$textTarge2.value;
      });
      var viewItemId = 'pretreatmentInfo';
      var viewPageId = 'alarm-detail';
      var callback = function callback(result) {
        result.forEach(function (item, index) {
          item.index = index + 1;
        });
        _this.setState({
          loading: false,
          detail: result
        });
      };
      getViewItemData({
        viewPageArgs: viewPageArgs,
        viewItemId: viewItemId,
        viewPageId: viewPageId,
        callback: callback
      });

      // Common.request(null, {
      //     fullUrl: `${serviceConfig.data.serviceConfig.otherService.viewItemUrl}view/getViewItemData`,
      //     type: 'post',
      //     showSuccessMessage: false,
      //     showErrorMessage: false,
      //     defaultErrorMessage: '获取数据失败',
      //     data: {
      //         alarmId: alarm_id,
      //         sessionId: registerInfo?.clientSessionId,
      //     },
      // })
      //     .then((result) => {
      //         if (result && result.preHandleInfo) {
      //             this.setState({
      //                 loading: false,
      //                 detail: result.preHandleInfo,
      //             });
      //         } else {
      //             this.setState({
      //                 loading: false,
      //                 detail: '',
      //             });
      //         }
      //     })
      //     .catch((err) => {
      //         this.setState({
      //             loading: false,
      //             detail: '',
      //         });
      //     });

      // eventListener.getPreHandleInfoRequest(alarm_id, (res) => {
      //     let detail;
      //     if (res.responseDataJSON === '') {
      //         detail = '';
      //     } else {
      //         detail = JSON.parse(res.responseDataJSON);
      //     }
      //     this.setState({
      //         loading: false,
      //         detail: detail,
      //     });
      // });
    };
    _this.contentFormatter = function (detail) {
      // if (Array.isArray(detail)) {
      //     return <pre>{detail.join('\n')}</pre>;
      // } else {
      //     return <pre>{detail}</pre>;
      // }
      return /*#__PURE__*/React.createElement("div", null, !_.isEmpty(detail) && detail.map(function (item, index) {
        return /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", null, item.index, ".\u9884\u5904\u7406\u4EBA\uFF1A", item.userName_format, "\uFF1B\xA0\xA0"), /*#__PURE__*/React.createElement("span", null, "\u9884\u5904\u7406\u65F6\u95F4\uFF1A", dayjs(Number(item.recordTime_format)).format('YYYY-MM-DD HH:mm:ss'), "\uFF1B\xA0\xA0"), /*#__PURE__*/React.createElement("span", null, "\u9884\u5904\u7406\u7ED3\u679C\u6B63\u6587\uFF1A"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("pre", null, "{".concat(item.content_format, "}"))), index !== detail.length - 1 && /*#__PURE__*/React.createElement(Divider, {
          dashed: true,
          style: {
            borderWidth: '1.5px 0 0'
          }
        }));
      }));
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
      var _this$props$textTarge3, _this$props$textTarge4;
      this.getDetail((_this$props$textTarge3 = this.props.textTarget) === null || _this$props$textTarge3 === void 0 ? void 0 : (_this$props$textTarge4 = _this$props$textTarge3.alarm_id) === null || _this$props$textTarge4 === void 0 ? void 0 : _this$props$textTarge4.value);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props$textTarge5, _this$props$textTarge6, _prevProps$textTarget, _prevProps$textTarget2;
      if (((_this$props$textTarge5 = this.props.textTarget) === null || _this$props$textTarge5 === void 0 ? void 0 : (_this$props$textTarge6 = _this$props$textTarge5.alarm_id) === null || _this$props$textTarge6 === void 0 ? void 0 : _this$props$textTarge6.value) !== ((_prevProps$textTarget = prevProps.textTarget) === null || _prevProps$textTarget === void 0 ? void 0 : (_prevProps$textTarget2 = _prevProps$textTarget.alarm_id) === null || _prevProps$textTarget2 === void 0 ? void 0 : _prevProps$textTarget2.value)) {
        var _this$props$textTarge7, _this$props$textTarge8;
        this.getDetail((_this$props$textTarge7 = this.props.textTarget) === null || _this$props$textTarge7 === void 0 ? void 0 : (_this$props$textTarge8 = _this$props$textTarge7.alarm_id) === null || _this$props$textTarge8 === void 0 ? void 0 : _this$props$textTarge8.value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
        loading = _this$state.loading,
        detail = _this$state.detail;
      return /*#__PURE__*/React.createElement(Spin, {
        spinning: loading
      }, /*#__PURE__*/React.createElement(Card, {
        bodyStyle: {
          height: '300px',
          overflow: 'auto'
        }
      }, this.contentFormatter(detail)));
    }
  }]);
}(PureComponent);
export { Default as default };