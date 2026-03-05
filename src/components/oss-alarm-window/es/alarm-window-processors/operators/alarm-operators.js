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
import { EventClass, _ } from 'oss-web-toolkits';
import Adapter from '../adapter/alarmAdapter';
import serviceConfig from '../../hox';
import { fieldTransform } from '../processors/method';
var ALarmOperator = /*#__PURE__*/function (_EventClass) {
  /**
   * 构造函数
   */
  function ALarmOperator(
  // private subscribeBusiness: SubscribeBusinessType,
  registerWindow) {
    var _serviceConfig$data;
    var _this;
    _classCallCheck(this, ALarmOperator);
    _this = _callSuper(this, ALarmOperator);
    _this.alarmAdapter = void 0;
    _this.refreshInterval = void 0;
    _this.lastEventNumber = 0;
    _this.needGetRealTimeData = true;
    _this.registerWindow = [];
    _this.session = void 0;
    _this.errorList = [];
    _this.registerParam = void 0;
    _this.timer = void 0;
    _this.registJSONMessage = null;
    _this.reRegisterError = void 0;
    _this.registerTime = '';
    _this.disconnectionTimes = [];
    _this.lastDisconnectionTime = void 0;
    _this.connectionStatus = 'connection';
    _this.howManyTimesConnection = [];
    _this.getRealTimeColumnParam = null;
    _this.disconnectionTimesSwitch = false;
    _this.errorStartTime = void 0;
    _this.initAdapter();
    _this.refreshInterval = serviceConfig === null || serviceConfig === void 0 ? void 0 : (_serviceConfig$data = serviceConfig.data) === null || _serviceConfig$data === void 0 ? void 0 : _serviceConfig$data.delayTime;
    _this.registerWindow = registerWindow;
    return _this;
  }
  _inherits(ALarmOperator, _EventClass);
  return _createClass(ALarmOperator, [{
    key: "initAdapter",
    value: function initAdapter() {
      this.alarmAdapter = new Adapter(this);
      // todo 这里的逻辑不太好 需要重新梳理 将session完全交给operator去管理
      // adapter只是处理接口调用的逻辑 不管理状态
      if (this.registJSONMessage) {
        this.alarmAdapter.setRegistJSONMessage(this.registJSONMessage);
      }
      if (this.session) {
        this.alarmAdapter.setSessionID(this.session);
      }
    }
  }, {
    key: "destroyAdapter",
    value: function destroyAdapter() {
      this.alarmAdapter.destroy();
    }

    // 获取服务连接信息
  }, {
    key: "getServiceInfo",
    value: function getServiceInfo(callback) {
      callback({
        registerTime: this.registerTime,
        disconnectionTimes: this.disconnectionTimes,
        lastDisconnectionTime: this.lastDisconnectionTime,
        connectionStatus: this.connectionStatus,
        session: this.session
      });
    }

    /**
     * Registers alarm operator
     * @description 注册
     * @param
     */
  }, {
    key: "register",
    value: function register(param) {
      var _this2 = this;
      this.registerParam = param;
      if (!this.registerTime) {
        this.registerTime = new Date();
      }
      return new Promise(function (resolve, reject) {
        console.log('注册信息:', param);
        _this2.alarmAdapter.createSession(param).then(function (response) {
          var _response$centerConfi;
          // 保存一下 以便销毁之后保留注册信息
          _this2.registJSONMessage = _.cloneDeep(_this2.alarmAdapter.getRegistJSONMessage());
          resolve(response);
          _this2.trigger('centerConfigInit', null, response && response.centerConfig);
          console.log('注册结果:', response);
          _this2.refreshInterval = Number((response === null || response === void 0 ? void 0 : (_response$centerConfi = response.centerConfig) === null || _response$centerConfi === void 0 ? void 0 : _response$centerConfi.delayTime) || 2) * 1000;
          _this2.lastEventNumber = 0;
          _this2.needGetRealTimeData = true;
          _this2.getRealTimeColumnParamInit(response);
          _this2.getRealtimeAlarm();
        }).catch(function (error) {
          reject(error);
          _this2.connectionStatus = 'thoroughDisconnection';
          console.log("\u6D41\u6C34\u7A97\u6CE8\u518C\u5931\u8D25! code:".concat(error.code, " reason:").concat(error.reason));
        });
      });
    }

    /**
     * @description 注册后获取所有模板字段（列模板+状态标识模板）
     * @param closeDesc
     * @returns
     */
  }, {
    key: "getRealTimeColumnParamInit",
    value: function getRealTimeColumnParamInit(response) {
      var _response$centerConfi2, _response$centerConfi3;
      var columnParseBean = response === null || response === void 0 ? void 0 : (_response$centerConfi2 = response.centerConfig) === null || _response$centerConfi2 === void 0 ? void 0 : _response$centerConfi2.columnParseBean;
      var columnSetting = response === null || response === void 0 ? void 0 : (_response$centerConfi3 = response.centerConfig) === null || _response$centerConfi3 === void 0 ? void 0 : _response$centerConfi3.columnSetting;
      var nextGetRealTimeColumnParam = new Set();
      if (columnParseBean && columnSetting) {
        Object.keys(columnParseBean).forEach(function (key) {
          var _columnParseBean$key;
          (_columnParseBean$key = columnParseBean[key]) === null || _columnParseBean$key === void 0 ? void 0 : _columnParseBean$key.columnBaseInfo.forEach(function (column) {
            nextGetRealTimeColumnParam.add(column.storeFieldName);
          });
        });
        columnSetting.columnBaseInfo.forEach(function (column) {
          nextGetRealTimeColumnParam.add(column.storeFieldName);
        });
      }
      this.getRealTimeColumnParam = nextGetRealTimeColumnParam;
    }

    /**
     * @description 列字段设置
     * @param closeDesc
     * @returns
     */
  }, {
    key: "resetAlarmFieldRequest",
    value: function resetAlarmFieldRequest(fieldList) {
      this.alarmAdapter.resetAlarmFieldRequest(fieldList);
      var nextGetRealTimeColumnParam = Array.from(this.getRealTimeColumnParam);
      nextGetRealTimeColumnParam = nextGetRealTimeColumnParam.concat(fieldList);
      this.getRealTimeColumnParam = new Set(nextGetRealTimeColumnParam);
    }

    /**
     * @description 注销
     * @param closeDesc
     * @returns
     */
  }, {
    key: "unregister",
    value: function unregister(callback, closeDesc) {
      var _this3 = this;
      console.log('注销开始');
      this.trigger('operatorErrorModal', null, ['error', this.howManyTimesConnection, this.disconnectionTimes]);
      this.endGetRealTime();
      return new Promise(function (resolve, reject) {
        _this3.alarmAdapter.closeSession(closeDesc).then(function (res) {
          console.log('注销suc', res);
          callback && callback(res);
          resolve(res);
        }).catch(function (err) {
          console.log('注销err', err);
          reject(err);
        });
      });
    }
  }, {
    key: "startGetRealTime",
    value: function startGetRealTime() {
      this.needGetRealTimeData = true;
    }
  }, {
    key: "endGetRealTime",
    value: function endGetRealTime() {
      this.needGetRealTimeData = false;
    }
  }, {
    key: "refreshAlarmDatasource",
    value: function refreshAlarmDatasource() {
      var _this4 = this;
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var refreshTime = timeout || this.refreshInterval;
      if (!this.needGetRealTimeData) {
        clearTimeout(this.timer);
        this.timer = null;
        return;
      }
      clearTimeout(this.timer);
      this.timer = null;
      this.timer = setTimeout(function () {
        _this4.getRealtimeAlarm();
      }, refreshTime);
      return this.timer;
    }
  }, {
    key: "handleError",
    value: function handleError(errlength) {
      console.log('销毁ws通道，重新初始化');
      //errlength === 18  每10s重试1次 18次重试失败为失败3分钟
      //判断 this.disconnectionTimesSwitch 是否可以计算失败次数

      //计算断连次数
      if (this.disconnectionTimesSwitch) {
        this.disconnectionTimes.push('error');
        this.lastDisconnectionTime = new Date();
        this.errorStartTime = new Date().getTime();
      }

      // 第一次重连
      if (_.isEmpty(this.howManyTimesConnection)) {
        var _this$registerParam, _this$registerParam$s, _this$registerParam$s2;
        this.howManyTimesConnection.push({
          times: 1,
          status: 'pending',
          time: new Date(),
          filterId: (_this$registerParam = this.registerParam) === null || _this$registerParam === void 0 ? void 0 : (_this$registerParam$s = _this$registerParam.subscribeInfoJSON) === null || _this$registerParam$s === void 0 ? void 0 : (_this$registerParam$s2 = _this$registerParam$s.subscribeProperties) === null || _this$registerParam$s2 === void 0 ? void 0 : _this$registerParam$s2.filterIds
        });
        this.reRegisterError = 'pending';
        this.connectionStatus = 'disconnection';
        this.trigger('operatorErrorModal', null, ['pending', this.howManyTimesConnection, this.disconnectionTimes]);
      }

      //TODO: 失败后直到重连成功 算作1次失败 而不是进一次handleError就算一次失败
      // 第n次重连
      console.log('重连时间', new Date().getTime() - this.errorStartTime);
      if (new Date().getTime() - this.errorStartTime >= 180000) {
        var _this$registerParam2, _this$registerParam2$, _this$registerParam2$2;
        this.errorStartTime = new Date().getTime();
        this.howManyTimesConnection.forEach(function (item) {
          item.status = 'reject';
          item.time = new Date();
        });
        this.howManyTimesConnection.push({
          times: this.howManyTimesConnection.length + 1,
          status: 'pending',
          time: new Date(),
          filterId: (_this$registerParam2 = this.registerParam) === null || _this$registerParam2 === void 0 ? void 0 : (_this$registerParam2$ = _this$registerParam2.subscribeInfoJSON) === null || _this$registerParam2$ === void 0 ? void 0 : (_this$registerParam2$2 = _this$registerParam2$.subscribeProperties) === null || _this$registerParam2$2 === void 0 ? void 0 : _this$registerParam2$2.filterIds
        });
        this.trigger('operatorErrorModal', null, ['pending', this.howManyTimesConnection, this.disconnectionTimes]);
      }
      this.disconnectionTimesSwitch = false;
      this.destroyAdapter();
      this.initAdapter();
    }
  }, {
    key: "getRealtimeAlarm",
    value: function getRealtimeAlarm() {
      var _this5 = this;
      if (!this.needGetRealTimeData) {
        return;
      }
      this.alarmAdapter.getRealtimeAlarmRequest(this.lastEventNumber, this.getRealTimeColumnParam).then(function (response) {
        var _responseData, _serviceConfig$data2, _responseData2;
        var responseDataJSON = response.res.responseDataJSON;
        var responseData;
        try {
          responseData = responseDataJSON && JSON.parse(responseDataJSON);
        } catch (error) {
          console.log('responseDataJSON 格式错误:/n', responseDataJSON);
        }
        _this5.lastEventNumber = (_responseData = responseData) === null || _responseData === void 0 ? void 0 : _responseData.eventNumber;
        _this5.session = response.sessionId;
        //返回格式暂未确定，需要对返回值进行处理
        // 处理完成之后继续调用
        // 第二个参数 使用 winType
        console.log(responseData);
        //可以计算重连失败次数
        _this5.disconnectionTimesSwitch = true;
        if (!_.isEmpty(_this5.howManyTimesConnection)) {
          _this5.connectionStatus = 'connection';
          _this5.howManyTimesConnection[_this5.howManyTimesConnection.length - 1].status = 'success';
          _this5.howManyTimesConnection[_this5.howManyTimesConnection.length - 1].time = new Date();
          _this5.trigger('operatorErrorModal', null, ['success', _this5.howManyTimesConnection, _this5.disconnectionTimes]);
          _this5.howManyTimesConnection = [];
        }
        var finalRes = fieldTransform(responseData, (_serviceConfig$data2 = serviceConfig.data) === null || _serviceConfig$data2 === void 0 ? void 0 : _serviceConfig$data2.fieldEnums);
        _this5.registerWindow.forEach(function (item) {
          new Promise(function (resolve) {
            _this5.trigger('onDatasourceChange', item.winName, [finalRes, resolve]);
          }).catch(function (e) {
            console.error(e);
          });
        });
        _this5.trigger('operatorEventListenerRealAlarm', null, [response.sessionId, (_responseData2 = responseData) === null || _responseData2 === void 0 ? void 0 : _responseData2.eventNumber]);
        _this5.trigger('operatorRealAlarmRequest', null, [response]);
        _this5.errorList = [];
        _this5.refreshAlarmDatasource();
      }).catch(function (error) {
        _this5.trigger('operatorEventListenerRealAlarm', null, [_this5.session, _this5.lastEventNumber]);
        _this5.trigger('operatorRealAlarmRequest', null, [null]);
        // 如果有异常 放缓调用
        _this5.refreshAlarmDatasource(10000);
        _this5.errorList.push(error.reason);
        if (error && ((error.code === 'C503' || error.code === 'T503') && _this5.errorList.length % 10 === 0 || error.code === 'C404')) {
          _this5.handleError(_this5.errorList.length);
        }
      });
    }

    /**
     *  网元树过滤
     */
  }, {
    key: "statisticsSecondaryFilterRequest",
    value: function statisticsSecondaryFilterRequest(data) {
      this.alarmAdapter.statisticsSecondaryFilterRequest(data).then();
      this.trigger('resetFilterParam', null, null);
    }
  }]);
}(EventClass);
export { ALarmOperator as default };