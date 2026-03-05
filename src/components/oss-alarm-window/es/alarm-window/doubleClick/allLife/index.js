function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
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
import { Timeline, Icon, Spin } from 'oss-ui';
import Common from '../../../common';
import { _ } from 'oss-web-toolkits';
import "./index.css";
import serviceConfig from '../../../hox';

/**
 * 全生命周期
 */
var Index = /*#__PURE__*/function (_React$PureComponent) {
  function Index(props) {
    var _this;
    _classCallCheck(this, Index);
    _this = _callSuper(this, Index, [props]);
    _this.formRef = /*#__PURE__*/React.createRef();
    _this.getAllLifeData = function () {
      var _textTarget$fp, _textTarget$fp2, _textTarget$fp3, _textTarget$fp4, _textTarget$event_tim;
      var lifeArr = [];
      _this.setState({
        loading: true
      });
      var textTarget = _this.props.textTarget;
      Common.request(null, {
        fullUrl: serviceConfig.data.serviceConfig.otherService.allLifeUrl + 'alarmLifecycle/v1/getLifecycle',
        type: 'get',
        showSuccessMessage: false,
        showErrorMessage: false,
        defaultErrorMessage: '获取数据失败',
        data: {
          fp0: (_textTarget$fp = textTarget.fp0) === null || _textTarget$fp === void 0 ? void 0 : _textTarget$fp.value,
          fp1: (_textTarget$fp2 = textTarget.fp1) === null || _textTarget$fp2 === void 0 ? void 0 : _textTarget$fp2.value,
          fp2: (_textTarget$fp3 = textTarget.fp2) === null || _textTarget$fp3 === void 0 ? void 0 : _textTarget$fp3.value,
          fp3: (_textTarget$fp4 = textTarget.fp3) === null || _textTarget$fp4 === void 0 ? void 0 : _textTarget$fp4.value,
          eventTime: (_textTarget$event_tim = textTarget.event_time) === null || _textTarget$event_tim === void 0 ? void 0 : _textTarget$event_tim.value
        }
      }).then(function (result) {
        if (result && result.data) {
          for (var key in result.data) {
            result.data[key] && lifeArr.push(result.data[key]);
            lifeArr.forEach(function (item) {
              item.show = false;
            });
          }
          _this.setState({
            allLifeDatas: lifeArr,
            loading: false
          });
        }
      }).catch(function (err) {
        _this.setState({
          loading: false
        });
      });
    };
    _this.showOrHidden = function (life) {
      var copyAllLifeDatas = _toConsumableArray(_this.state.allLifeDatas);
      copyAllLifeDatas.forEach(function (item) {
        if (item.label === life.label) {
          item.show = !item.show;
        }
      });
      _this.setState({
        allLifeDatas: copyAllLifeDatas
      });
    };
    _this.state = {
      allLifeDatas: null,
      loading: false
    };
    return _this;
  }
  _inherits(Index, _React$PureComponent);
  return _createClass(Index, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getAllLifeData();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$state = this.state,
        allLifeDatas = _this$state.allLifeDatas,
        loading = _this$state.loading;
      return /*#__PURE__*/React.createElement(Spin, {
        spinning: loading,
        style: {
          lineHeight: '300px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          overflow: 'hidden',
          minHeight: 300,
          maxHeight: 300,
          overflowY: 'auto'
        },
        className: "allLife ".concat(this.props.theme)
      }, /*#__PURE__*/React.createElement(Timeline, {
        mode: "left",
        style: {
          paddingTop: '10px'
        }
      }, allLifeDatas && allLifeDatas.map(function (life) {
        return /*#__PURE__*/React.createElement(Timeline.Item, {
          label: /*#__PURE__*/React.createElement("span", {
            className: "timeLabel"
          }, life.datetime && life.datetime),
          dot: life.active ? /*#__PURE__*/React.createElement(Icon, {
            antdIcon: true,
            type: "CheckCircleFilled",
            classname: "activeDot"
          }) : /*#__PURE__*/React.createElement("span", {
            className: "nonactivatedDot"
          })
        }, /*#__PURE__*/React.createElement("span", {
          className: "dotTitle"
        }, life.label), life.childNodes && /*#__PURE__*/React.createElement(Icon, {
          antdIcon: true,
          type: !life.show ? 'CaretLeftOutlined' : 'CaretDownOutlined',
          classname: "arrow",
          onClick: _this2.showOrHidden.bind(_this2, life)
        }), life.childNodes && life.show && /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: '15px'
          }
        }, life.childNodes.map(function (childNode) {
          return /*#__PURE__*/React.createElement("div", {
            className: life.childNodes.length > 1 ? ' childNode childNodeContent' : 'childNodeContent'
          }, childNode.childNode.map(function (item) {
            return /*#__PURE__*/React.createElement("p", {
              className: "childNodeContent_single"
            }, "".concat(item.label, "\uFF1A").concat(item.value));
          }));
        })));
      }))));
    }
  }]);
}(React.PureComponent);
export { Index as default };