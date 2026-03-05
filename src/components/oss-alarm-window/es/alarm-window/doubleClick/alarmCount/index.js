function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
import React from 'react';
import { Table, message } from 'oss-ui';
import Common from '../../../common';
import { _ } from 'oss-web-toolkits';
import serviceConfig from '../../../hox';
import { doubleClickAlarmCount } from '../../alarm-show-config';

/**
 * 频次告警
 */
var Index = /*#__PURE__*/function (_React$PureComponent) {
  function Index(props) {
    var _this;
    _classCallCheck(this, Index);
    _this = _callSuper(this, Index, [props]);
    _this.formRef = /*#__PURE__*/React.createRef();
    _this.getColumns = function () {
      var columns = [];
      doubleClickAlarmCount.forEach(function (item) {
        columns.push({
          title: item.label,
          dataIndex: item.fieldName,
          ellipsis: true,
          align: 'center'
        });
      });
      _this.setState({
        columns: columns
      });
    };
    _this.getDetail = function () {
      var _textTarget$fp, _textTarget$fp2, _textTarget$fp3, _textTarget$fp4;
      _this.setState({
        loading: true
      });
      var paging = _this.state.paging;
      var textTarget = _this.props.textTarget;
      Common.request(null, {
        fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.viewItemUrl, "view/getViewItemData"),
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: true,
        defaultErrorMessage: '获取数据失败',
        data: {
          viewPageArgs: {
            fp0: (_textTarget$fp = textTarget.fp0) === null || _textTarget$fp === void 0 ? void 0 : _textTarget$fp.value,
            fp1: (_textTarget$fp2 = textTarget.fp1) === null || _textTarget$fp2 === void 0 ? void 0 : _textTarget$fp2.value,
            fp2: (_textTarget$fp3 = textTarget.fp2) === null || _textTarget$fp3 === void 0 ? void 0 : _textTarget$fp3.value,
            fp3: (_textTarget$fp4 = textTarget.fp3) === null || _textTarget$fp4 === void 0 ? void 0 : _textTarget$fp4.value,
            pageIndex: paging.current,
            pageSize: paging.pageSize
          },
          viewItemId: 'alarmRepeated',
          viewPageId: 'alarm-detail',
          requestInfo: {
            clientRequestId: 'nomean',
            clientToken: localStorage.getItem('access_token')
          }
        }
      }).then(function (result) {
        if (result && result.data && result.data.viewItemData) {
          _this.setState({
            datas: result.data.viewItemData.rows,
            loading: false,
            total: result.data.viewItemData.page.total,
            searchStatus: 'success',
            paging: _objectSpread(_objectSpread({}, paging), {}, {
              current: result.data.viewItemData.page.total.current,
              total: result.data.viewItemData.page.total
            })
          });
        }
      });
    };
    _this.pageChange = function (pagination) {
      var paging = _this.state.paging;
      _this.setState({
        paging: _objectSpread(_objectSpread({}, paging), {}, {
          current: pagination.current,
          pageSize: pagination.pageSize
        }),
        loading: true
      }, function () {
        _this.getDetail();
      });
    };
    _this.getRowDetail = function () {
      var _this$props = _this.props,
        extendEventMap = _this$props.extendEventMap,
        eventListener = _this$props.eventListener,
        textTarget = _this$props.textTarget;
      var getRecordsDetail = extendEventMap && extendEventMap.getRecordsDetail ? extendEventMap.getRecordsDetail : eventListener.onTableDoubleClick;
      var alarmActCount = 0;
      var alarmFieldList = [];
      getRecordsDetail(textTarget, function (res) {
        if (res && res.length && res[0]) {
          if (res[0].alarmFieldList) {
            var _res$;
            alarmFieldList = (_res$ = res[0]) === null || _res$ === void 0 ? void 0 : _res$.alarmFieldList;
          } else alarmFieldList = Object.values(res[0]);
          alarmFieldList.forEach(function (item) {
            if ((item === null || item === void 0 ? void 0 : item.field) === 'alarm_act_count') {
              alarmActCount = item === null || item === void 0 ? void 0 : item.value;
            }
          });
          _this.setState({
            alarmActCount: alarmActCount
          });
        } else {
          _this.setState({
            alarmActCount: 0
          });
        }
      });
    };
    _this.state = {
      columns: [],
      datas: [],
      searchStatus: '',
      total: 0,
      loading: false,
      recordsDetail: {},
      alarmActCount: 0,
      paging: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
    return _this;
  }
  _inherits(Index, _React$PureComponent);
  return _createClass(Index, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getColumns();
      this.getDetail();
      this.getRowDetail();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props$textTarge, _this$props$textTarge2, _prevProps$textTarget, _prevProps$textTarget2;
      if (((_this$props$textTarge = this.props.textTarget) === null || _this$props$textTarge === void 0 ? void 0 : (_this$props$textTarge2 = _this$props$textTarge.alarm_id) === null || _this$props$textTarge2 === void 0 ? void 0 : _this$props$textTarge2.value) !== ((_prevProps$textTarget = prevProps.textTarget) === null || _prevProps$textTarget === void 0 ? void 0 : (_prevProps$textTarget2 = _prevProps$textTarget.alarm_id) === null || _prevProps$textTarget2 === void 0 ? void 0 : _prevProps$textTarget2.value)) {
        this.getDetail();
        this.getRowDetail();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _textTarget$alarm_act;
      var _this$state = this.state,
        columns = _this$state.columns,
        datas = _this$state.datas,
        loading = _this$state.loading,
        searchStatus = _this$state.searchStatus,
        total = _this$state.total,
        paging = _this$state.paging,
        alarmActCount = _this$state.alarmActCount;
      var textTarget = this.props.textTarget;
      return /*#__PURE__*/React.createElement(React.Fragment, null, (textTarget === null || textTarget === void 0 ? void 0 : (_textTarget$alarm_act = textTarget.alarm_act_count) === null || _textTarget$alarm_act === void 0 ? void 0 : _textTarget$alarm_act.value) > 1 || alarmActCount > 1 ? /*#__PURE__*/React.createElement("div", {
        style: {
          height: '300px'
        }
      }, /*#__PURE__*/React.createElement("span", null, searchStatus && "\u67E5\u8BE2\u5B8C\u6210\uFF0C\u5171\u6709".concat(total, "\u6761\u544A\u8B66")), /*#__PURE__*/React.createElement(Table, {
        size: "small",
        dataSource: datas,
        columns: columns,
        scroll: {
          y: 195
        },
        bordered: true,
        pagination: paging,
        loading: loading,
        onChange: this.pageChange
      })) : /*#__PURE__*/React.createElement("div", {
        style: {
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement("p", null, "\u60A8\u9009\u62E9\u7684\u544A\u8B66\u4E0D\u662F\u9891\u6B21\u544A\u8B66\uFF0C\u672A\u8BB0\u5F55\u9891\u6B21\u8BE6\u60C5\uFF01")));
    }
  }]);
}(React.PureComponent);
export { Index as default };