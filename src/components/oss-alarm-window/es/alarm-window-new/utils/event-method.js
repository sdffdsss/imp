function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
import { EventClass } from 'oss-web-toolkits';
import serviceConfig from '../../hox';
var AlarmWindowMethod = /*#__PURE__*/function (_EventClass) {
  function AlarmWindowMethod() {
    var _this;
    _classCallCheck(this, AlarmWindowMethod);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, AlarmWindowMethod, [].concat(args));
    //table单击
    _this.onTableClick = function (event, record) {
      this.trigger('onTableClick', null, [event, record]);
    }.bind(_this);
    //table双击
    _this.onTableDoubleClick = function (record, callback) {
      this.trigger('onTableDoubleClick', null, [record, callback]);
    }.bind(_this);
    //table右键
    _this.onContextMenuClick = function (records, callback) {
      this.trigger('onContextMenuClick', null, [records, callback]);
    }.bind(_this);
    //数据翻页
    _this.onTableEnd = function (index) {
      this.trigger('onTableEnd', null, [index]);
    }.bind(_this);
    //告警发声
    _this.soundSwitchChanged = function (value) {
      this.trigger('soundSwitchChanged', null, [value]);
    }.bind(_this);
    //告警置顶
    _this.setTopAlarmsRequest = function (record, callback) {
      this.trigger('setTopAlarmsRequest', null, [record, callback]);
    }.bind(_this);
    //锁定
    _this.setTableLock = function (lockType) {
      var _this2 = this;
      this.trigger('setTableLock', null, [lockType]);
      if (lockType && serviceConfig.data.autoUnLock) {
        var timer = setTimeout(function () {
          _this2.trigger('setTableLock', null, [!lockType]);
          clearTimeout(timer);
        }, Number(serviceConfig.data.lockPeriod));
      }
    }.bind(_this);
    //容量修改
    _this.setCapacityRequest = function (value) {
      this.trigger('setCapacityRequest', null, [value]);
    }.bind(_this);
    //告警同步
    _this.setAlarmSynchronizationRequest = function (value) {
      this.trigger('setAlarmSynchronizationRequest', null, [value]);
    }.bind(_this);
    //告警导出
    _this.setAlarmExport = function (value, callback) {
      this.trigger('setAlarmExport', null, [value, callback]);
    }.bind(_this);
    //取消筛选
    _this.reset = function () {
      this.trigger('secondaryFilterRequest', null, ['reset']);
    }.bind(_this);
    //关联过滤
    _this.relationFilterRequest = function () {
      this.trigger('relationFilterRequest', null, []);
    }.bind(_this);
    //取消关联过滤
    _this.relationFilterResetRequest = function () {
      this.trigger('relationFilterResetRequest', null, []);
    }.bind(_this);
    //二次过滤
    _this.secondaryFilterRequest = function (subFieldExpression, mainFieldExpression) {
      this.trigger('secondaryFilterRequest', null, [subFieldExpression, mainFieldExpression]);
    }.bind(_this);
    //列设置
    _this.resetAlarmFieldRequest = function (parma, statusModelArray, allcol) {
      this.trigger('resetAlarmFieldRequest', null, [parma, statusModelArray, allcol]);
    }.bind(_this);
    //排序
    _this.getSortBatchRequest = function (parma) {
      this.trigger('getSortBatchRequest', null, [parma]);
    }.bind(_this);
    //获取过滤条件
    _this.getDistinctFieldValuesRequest = function (parma, callback) {
      this.trigger('getDistinctFieldValuesRequest', null, [parma, callback]);
    }.bind(_this);
    //toolbar 一键展开折叠 图标变化
    _this.setFoldingState = function (type) {
      this.trigger('foldingState', null, [type]);
    }.bind(_this);
    //toolbar 告警置顶 图标变化
    _this.setAlarmTop = function (selectRows) {
      this.trigger('setAlarmTop', null, [selectRows]);
    }.bind(_this);
    // 设置二次过滤值
    _this.setParamData = function (param) {
      this.trigger('setParamData', null, [param]);
    }.bind(_this);
    // 设置自定义过滤值
    _this.setCustomParamData = function (param) {
      this.trigger('setCustomParamData', null, [param]);
    }.bind(_this);
    // 设置最大容量
    _this.setMaxAlarmSize = function (param) {
      this.trigger('setMaxAlarmSize', null, [param]);
    }.bind(_this);
    //告警双击详情
    _this.getAlarmInfoRequest = function (alarm_id, callback) {
      this.trigger('getAlarmInfoRequest', null, [alarm_id, callback]);
    }.bind(_this);
    //服务连接信息
    _this.getServiceInfo = function (callback) {
      this.trigger('getServiceInfo', null, [callback]);
    }.bind(_this);
    //告警双击预处理信息
    _this.getPreHandleInfoRequest = function (alarm_id, callback) {
      this.trigger('getPreHandleInfoRequest', null, [alarm_id, callback]);
    }.bind(_this);
    //告警双击导出
    _this.alarmInfoExportRequest = function (alarm_id, callback) {
      this.trigger('alarmInfoExportRequest', null, [alarm_id, callback]);
    }.bind(_this);
    //用户行为记录
    _this.userBehaviorRecord = function (column, callback) {
      this.trigger('userBehaviorRecord', null, [column, callback]);
    }.bind(_this);
    // 超容量预警
    _this.alarmStatRequest = function (callback) {
      this.trigger('alarmStatRequest', null, [callback]);
    }.bind(_this);
    _this.setAlarmRead = function (selectRows) {
      this.trigger('setAlarmRead', null, [selectRows]);
    }.bind(_this);
    return _this;
  }
  _inherits(AlarmWindowMethod, _EventClass);
  return _createClass(AlarmWindowMethod);
}(EventClass);
export default AlarmWindowMethod;