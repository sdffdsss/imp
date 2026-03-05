function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import ServiceLocator from '../proxy/proxyServiceLocator.js';
import { iceExceptionProcessor } from './iceExceptionProcessor';
var alarmAdapter = /*#__PURE__*/function () {
  function alarmAdapter(eventClass) {
    _classCallCheck(this, alarmAdapter);
    // 订阅标识
    this.sessionId = null;
    // 服务发现
    this.serviceLocator = void 0;
    // 服务代理（暂时支持订阅服务）
    this.alarmProxy = void 0;
    this.eventListener = void 0;
    this.realTimeTimeOut = 10000;
    this.registJSONMessage = null;
    this.serviceLocator = new ServiceLocator();
    this.alarmProxy = this.serviceLocator.getAlarmSubscribeService();
    this.eventListener = eventClass;
  }
  return _createClass(alarmAdapter, [{
    key: "destroy",
    value: function destroy() {
      if (this.alarmProxy) {
        this.alarmProxy.ice_getCommunicator().destroy();
        this.alarmProxy = null;
      }
    }
  }, {
    key: "getRegistJSONMessage",
    value: function getRegistJSONMessage() {
      return this.registJSONMessage;
    }
  }, {
    key: "setRegistJSONMessage",
    value: function setRegistJSONMessage(value) {
      this.registJSONMessage = value;
    }
  }, {
    key: "setSessionID",
    value: function setSessionID(value) {
      this.sessionId = value;
    }
  }, {
    key: "padding",
    value: function padding(s, len) {
      var handleLen = len - "".concat(s).length;
      for (var i = 0; i < handleLen; i += 1) {
        s = "0".concat(s);
      }
      return s;
    }
  }, {
    key: "format",
    value: function format(date) {
      var _this = this;
      var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-MM-dd';
      return pattern.replace(/([yMdhsm])(\1*)/g, function ($0) {
        switch ($0.charAt(0)) {
          case 'y':
            return _this.padding(date.getFullYear(), $0.length);
          case 'M':
            return _this.padding(date.getMonth() + 1, $0.length);
          case 'd':
            return _this.padding(date.getDate(), $0.length);
          case 'h':
            return _this.padding(date.getHours(), $0.length);
          case 'm':
            return _this.padding(date.getMinutes(), $0.length);
          case 's':
            return _this.padding(date.getSeconds(), $0.length);
          default:
        }
      });
    }

    // 注册
  }, {
    key: "createSession",
    value: function createSession(
    // subscribeBusiness: SubscribeBusinessType,
    // winList: any[] = [],
    // filterIds: number[] = [],
    // alarmFieldNameList: string[] = [],
    // alarmFieldIds: string[] = []

    registerParam) {
      var _registerParam$subscr,
        _this2 = this;
      // const { clientTimeOutSeconds, batchSize } = config;
      // 必须要这么写
      var createSessionRequest = new window.com.boco.view.slice.generated.model.CreateSessionRequest();
      // 从框架共享数据中获取
      createSessionRequest.clientUserName = 'Admin';
      createSessionRequest.clentToken = 'clientToken';
      createSessionRequest.clientDesc = (registerParam === null || registerParam === void 0 ? void 0 : (_registerParam$subscr = registerParam.subscribeInfoJSON) === null || _registerParam$subscr === void 0 ? void 0 : _registerParam$subscr.clientDesc) || '';
      createSessionRequest.subscribeBusiness = registerParam.subscribeBusiness; // AlarmStatisticsFlow/AlarmFilteringFlow/AlarmTopologyFlow
      // TODO: 这里有待商榷 和流水下拉的获取流水数量是否一致
      createSessionRequest.subscribeInfoJSON = JSON.stringify(registerParam.subscribeInfoJSON);
      this.registJSONMessage = createSessionRequest;
      return new Promise(function (resolve, reject) {
        _this2.alarmProxy.createSession(createSessionRequest).then(function (response) {
          // 返回值待定-暂定返回sessionId，标志了一个客户端窗口，用于流水窗的后续取值和操作
          // 原流水在注册时客户端生成sessionId,同时传入容量预装信息用于同步告警，现从注册接口中剥离，注册后单独同步告警（预装）
          var createSessionResponse = {
            clientSessionId: response.clientSessionId,
            clientUserName: response.clientUserName,
            dealDesc: response.dealDesc,
            centerConfig: response && response.subscribeProperties && (JSON.parse(response.subscribeProperties) || {})
          };
          _this2.sessionId = createSessionResponse.clientSessionId;
          resolve(createSessionResponse);
        }, function (error) {
          console.log('注册error：', error);
          reject(error);
          // this.createSession(subscribeBusiness, winList, filterIds, alarmFieldNameList, alarmFieldIds);
        });
      });
    }

    // 注销
  }, {
    key: "closeSession",
    value: function closeSession(closeDesc) {
      var _this3 = this;
      return new Promise(function (resolve, reject) {
        _this3.alarmProxy.closeSession(_this3.sessionId, closeDesc || '').then(function (response) {
          var closeSessionResponse = {
            clientSessionId: response.clientSessionId,
            // clientUserName: response.clientOnlineTimeSecond,
            dealDesc: response.dealDesc
          };
          // 返回值待定
          resolve(closeSessionResponse);
        }, function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "buildRequest",
    value: function buildRequest(methodName, params) {
      var requestData = null;
      if (params !== 'null') {
        try {
          requestData = JSON.stringify(params);
        } catch (error) {
          throw error;
        }
      }
      var requestJSONMessage = new window.com.boco.view.slice.generated.model.RequestJSONMessage(
      // 方法首字母大写
      methodName, Date.now(), this.sessionId, requestData);
      return requestJSONMessage;
    }
  }, {
    key: "executeMethod",
    value: function executeMethod(requestJSONMessage) {
      var _this4 = this;
      return new Promise(function (resolve, reject) {
        _this4.executeMethodMethod(requestJSONMessage, function (response) {
          // 返回格式暂未确定，需要对返回值进行处理
          // 这里要统一保存 lastEventNumber

          resolve(response);
        });
      });
    }
  }, {
    key: "executeMethodWithSession",
    value: function executeMethodWithSession(requestJSONMessage) {
      var _this5 = this;
      return new Promise(function (resolve, reject) {
        _this5.executeMethodWithSessionMethod(requestJSONMessage, function (response) {
          // 返回格式暂未确定，需要对返回值进行处理
          // 这里要统一保存 lastEventNumber

          resolve(response);
        });
      });
    }
  }, {
    key: "executeMethodWithSessionRealtime",
    value: function executeMethodWithSessionRealtime(requestJSONMessage) {
      var _this6 = this;
      return new Promise(function (resolve, reject) {
        _this6.executeMethodWithCreateSession(requestJSONMessage).then(function (response) {
          // 返回格式暂未确定，需要对返回值进行处理
          // 这里要统一保存 lastEventNumber
          var result = {
            res: response,
            sessionId: _this6.sessionId
          };
          resolve(result);
        }, function (error) {
          var exceptionResult = iceExceptionProcessor(error);
          reject(exceptionResult);
        });
      });
    }
  }, {
    key: "iceTimeOut",
    value: function iceTimeOut() {
      var _this7 = this;
      return new Promise(function (resolve, reject) {
        var timer = setTimeout(function () {
          clearTimeout(timer);
          reject({
            code: 'T503',
            reason: '流水窗ice接口超时'
          });
        }, _this7.realTimeTimeOut);
      });
    }

    // 锁定窗口
  }, {
    key: "lockWindowRequest",
    value: function lockWindowRequest(winType) {
      // alarmlistid  确认
      var requestJSONMessage = this.buildRequest('LockWindowRequest', {
        winType: winType
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 重设告警字段
  }, {
    key: "resetAlarmFieldRequest",
    value: function resetAlarmFieldRequest(alarmFieldNameList) {
      var requestJSONMessage = this.buildRequest('ResetAlarmFieldRequest', {
        alarmFieldNameList: alarmFieldNameList
      });
      console.log('重设告警字段---发送');
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 重设告警容量
  }, {
    key: "resetCapacityRequest",
    value: function resetCapacityRequest(winType, winCapacity) {
      var requestJSONMessage = this.buildRequest('ResetCapacityRequest', {
        winType: winType,
        winCapacity: winCapacity
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 设置告警置顶
  }, {
    key: "resetTopAlarmsRequest",
    value: function resetTopAlarmsRequest(winType, alarmIdList) {
      var requestJSONMessage = this.buildRequest('ResetTopAlarmsRequest', {
        winType: winType,
        alarmIdList: alarmIdList
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 解除锁定
  }, {
    key: "unLockWindowRequest",
    value: function unLockWindowRequest(winType) {
      console.log('解除锁定');
      var requestJSONMessage = this.buildRequest('UnLockWindowRequest', {
        winType: winType
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 获取告警详情
  }, {
    key: "getAlarmDetailRequest",
    value: function getAlarmDetailRequest(alarmIdList) {
      var requestJSONMessage = this.buildRequest('GetAlarmDetailRequest', {
        alarmIdList: alarmIdList
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 获取告警字段
  }, {
    key: "getAlarmFieldsRequest",
    value: function getAlarmFieldsRequest(alarmIdList) {
      var requestJSONMessage = this.buildRequest('getAlarmFieldsRequest', {
        alarmIdList: alarmIdList
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 获取关联告警
  }, {
    key: "getAlarmRelationRequest",
    value: function getAlarmRelationRequest(winType, alarmIdList) {
      var requestJSONMessage = this.buildRequest('GetAlarmRelationRequest', {
        winType: winType,
        alarmIdList: alarmIdList
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 翻页滚动
  }, {
    key: "GetBatchAlarmRequest",
    value: function GetBatchAlarmRequest(winType, index) {
      var requestJSONMessage = this.buildRequest('GetBatchAlarmRequest', {
        index: index,
        winType: winType
      });
      console.log('翻页滚动---发送');
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 二次过滤筛选唯一值
  }, {
    key: "getDistinctFieldValuesRequest",
    value: function getDistinctFieldValuesRequest(param) {
      var requestJSONMessage = this.buildRequest('GetDistinctFieldValuesRequest', param);
      console.log('二次过滤筛选唯一值---发送');
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 获取实时告警
  }, {
    key: "getRealtimeAlarmRequest",
    value: function getRealtimeAlarmRequest(lastEventNumber, columnParam) {
      var requestJSONMessage = new window.com.boco.view.slice.generated.model.RequestWithRegistJSONMessage(
      // 方法首字母大写
      'GetRealtimeAlarmRequest', Date.now(), this.sessionId, JSON.stringify({
        lastEventNumber: lastEventNumber,
        alarmFieldNameList: Array.from(columnParam)
      })) // 第一次调用传0
      ;
      console.log('获取实时流水---发送');
      return Promise.race([this.executeMethodWithSessionRealtime(requestJSONMessage), this.iceTimeOut()]);
    }

    // 关联过滤(RelationFilterRequest)
  }, {
    key: "relationFilterRequest",
    value: function relationFilterRequest(winType) {
      var requestJSONMessage = this.buildRequest('RelationFilterRequest', {
        winType: winType
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 取消关联过滤(RelationFilterRequest)
  }, {
    key: "relationFilterResetRequest",
    value: function relationFilterResetRequest(winType) {
      var requestJSONMessage = this.buildRequest('RelationFilterResetRequest', {
        winType: winType
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 告警排序(GetSortBatchRequest)
  }, {
    key: "getSortBatchRequest",
    value: function getSortBatchRequest(winType, sortFieldId, sortByAsc) {
      var requestJSONMessage = this.buildRequest('GetSortBatchRequest', {
        winType: winType,
        sortFieldId: sortFieldId,
        sortByAsc: sortByAsc
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 告警发声(SoundSwitchRequest)
  }, {
    key: "soundSwitchRequest",
    value: function soundSwitchRequest(soundSwitch, winType) {
      var param = null;
      if (soundSwitch) {
        param = winType;
      }
      var requestJSONMessage = this.buildRequest('SoundSwitchRequest', {
        param: param
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 告警同步(SyncAlarmRequest)
  }, {
    key: "syncAlarmRequest",
    value: function syncAlarmRequest(beginTimeStr, endTimeStr, clearCurrentData, aheadSecond, type) {
      var requestJSONMessage = this.buildRequest('SyncAlarmRequest', {
        beginTimeStr: beginTimeStr,
        endTimeStr: endTimeStr,
        clearCurrentData: clearCurrentData,
        aheadSecond: aheadSecond,
        type: type
      });
      console.log('告警同步---发送');
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 二次过滤(SecondaryFilterRequest)
  }, {
    key: "secondaryFilterRequest",
    value: function secondaryFilterRequest(winType, subFieldExpression, mainFieldExpression) {
      var requestJSONMessage = this.buildRequest('SecondaryFilterRequest', {
        winType: winType,
        subFieldExpression: subFieldExpression,
        mainFieldExpression: mainFieldExpression
      });
      console.log('二次过滤---发送');
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 获取告警风暴数据
  }, {
    key: "alarmStatRequest",
    value: function alarmStatRequest() {
      var _this$eventListener, _this$eventListener$r, _this$eventListener$r2;
      var requestJSONMessage = this.buildRequest('AlarmStatRequest', {
        dutyWindowId: ((_this$eventListener = this.eventListener) === null || _this$eventListener === void 0 ? void 0 : (_this$eventListener$r = _this$eventListener.registerParam) === null || _this$eventListener$r === void 0 ? void 0 : (_this$eventListener$r2 = _this$eventListener$r.subscribeInfoJSON) === null || _this$eventListener$r2 === void 0 ? void 0 : _this$eventListener$r2.windowId) || ''
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 下载文件(DownloadExportFileRequest)
  }, {
    key: "downloadExportFileRequest",
    value: function downloadExportFileRequest(callback) {
      // 接口暂时不做，fileUrl和batchIndex生成方法暂未确定
      var fileUrl = '/opt/xdpp/wl/clientworker/file1.xml';
      var batchIndex = 0;
      var requestJSONMessage = {
        sessionId: this.sessionId,
        // sessionId: '18wjnf8928jdfjksj99233',
        clientRequestTimeMS: Date.now(),
        requestMethodName: 'DownloadExportFileRequest',
        requestDataJSON: {
          fileUrl: fileUrl,
          batchIndex: batchIndex
        }
      };
      this.executeMethodWithSessionMethod(requestJSONMessage, function (response) {
        // 返回格式暂未确定，需要对返回值进行处理
        var result = response;
        callback(result);
      });
    }

    // 获取列模版
  }, {
    key: "GetAllColumnItemRequest",
    value: function GetAllColumnItemRequest() {
      var requestJSONMessage = this.buildRequest('GetAllColumnItemRequest', 'null');
      return this.executeMethod(requestJSONMessage);
    }

    // 获取列模版
  }, {
    key: "GetAlarmColumnsRequest",
    value: function GetAlarmColumnsRequest(id) {
      var requestJSONMessage = this.buildRequest('GetAlarmColumnsRequest', {
        id: id
      });
      return this.executeMethod(requestJSONMessage);
    }

    // 告警双击详情
  }, {
    key: "GetAlarmInfoRequest",
    value: function GetAlarmInfoRequest(alarmId) {
      var requestJSONMessage = this.buildRequest('GetAlarmInfoRequest', {
        alarmId: alarmId
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 告警双击预处理信息
  }, {
    key: "GetPreHandleInfoRequest",
    value: function GetPreHandleInfoRequest(alarmId) {
      var requestJSONMessage = this.buildRequest('GetPreHandleInfoRequest', {
        alarmId: alarmId
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 告警双击导出
  }, {
    key: "AlarmInfoExportRequest",
    value: function AlarmInfoExportRequest(alarmId) {
      var requestJSONMessage = this.buildRequest('AlarmInfoExportRequest', {
        alarmId: alarmId
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 告警导出
    // 接口暂时不做，fileUrl和batchIndex生成方法暂未确定
  }, {
    key: "exportAlarmRequest",
    value: function exportAlarmRequest(winType, alarmColumnFieldIds, alarmFieldNameList, exportFileFormat, alarmIdList) {
      var requestJSONMessage = this.buildRequest('ExportAlarmRequestHeader', {
        winType: winType,
        alarmColumnFieldIds: alarmColumnFieldIds,
        alarmFieldNameList: alarmFieldNameList,
        exportFileFormat: exportFileFormat,
        alarmIdList: alarmIdList
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    // 告警导出url
  }, {
    key: "downLoadAlarmRequest",
    value: function downLoadAlarmRequest(fileUrl) {
      var requestJSONMessage = this.buildRequest('DownLoadAlarmRequest', {
        fileUrl: fileUrl
      });
      return this.executeMethodWithSession(requestJSONMessage);
    }

    //重连后逻辑处理
  }, {
    key: "reRegisterCallBack",
    value: function reRegisterCallBack() {
      this.syncAlarmRequest(undefined, undefined, false, undefined, 3);
    }

    // 实时流水接口定义 统一用 promise 处理
  }, {
    key: "executeMethodWithCreateSession",
    value: function executeMethodWithCreateSession(requestJSONMessage) {
      var _this8 = this;
      try {
        Object.assign(requestJSONMessage, {
          createSessionRequest: this.registJSONMessage
        });
        return new Promise(function (resolve, reject) {
          _this8.alarmProxy.executeMethodWithCreateSession(requestJSONMessage).then(function (response) {
            resolve(response);
          }, function (error) {
            var exceptionResult = iceExceptionProcessor(error);
            console.log(exceptionResult);
            reject(error);
          });
        });
      } catch (error) {
        console.log('Ice Error: ', error);
      }
    }

    // 通用接口
  }, {
    key: "executeMethodWithSessionMethod",
    value: function executeMethodWithSessionMethod(requestJSONMessage, callback) {
      var _this9 = this;
      var date = new Date(); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var startTime = this.format(date, 'hh:mm:ss');
      this.triggerLoggerDataChange({
        key: startTime + requestJSONMessage.clientSessionId + requestJSONMessage.requestMethodName,
        startTime: startTime,
        clientSessionId: requestJSONMessage.clientSessionId,
        methodName: requestJSONMessage.requestMethodName,
        param: requestJSONMessage.requestDataJSON
      });
      try {
        this.alarmProxy.executeMethodWithSession(requestJSONMessage).then(function (response) {
          var date = new Date(); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var endTime = _this9.format(date, 'hh:mm:ss');
          _this9.triggerLoggerDataChange({
            key: startTime + requestJSONMessage.clientSessionId + requestJSONMessage.requestMethodName,
            endTime: endTime,
            res: response
          });
          callback(response);
        }, function (error) {
          var exceptionResult = iceExceptionProcessor(error);
          console.log(exceptionResult);
        });
      } catch (error) {
        console.log('Ice Error: ', error);
      }
    }
  }, {
    key: "executeMethodMethod",
    value: function executeMethodMethod(requestJSONMessage, callback) {
      var _this0 = this;
      var date = new Date(); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var startTime = this.format(date, 'hh:mm:ss');
      this.triggerLoggerDataChange({
        key: startTime + requestJSONMessage.clientSessionId + requestJSONMessage.requestMethodName,
        startTime: startTime,
        clientSessionId: requestJSONMessage.clientSessionId,
        methodName: requestJSONMessage.requestMethodName,
        param: requestJSONMessage.requestDataJSON
      });
      this.alarmProxy.executeMethod(requestJSONMessage).then(function (response) {
        var date = new Date(); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var endTime = _this0.format(date, 'hh:mm:ss');
        _this0.triggerLoggerDataChange({
          key: startTime + requestJSONMessage.clientSessionId + requestJSONMessage.requestMethodName,
          endTime: endTime,
          res: response
        });
        callback(response);
      }, function (error) {
        console.log('executeMethodMethod Error:', error);
      });
    }
  }, {
    key: "triggerLoggerDataChange",
    value: function triggerLoggerDataChange(data) {
      this.eventListener.trigger('onLoggerDataChange', null, [data]);
    }
  }, {
    key: "offLoggerDataListener",
    value: function offLoggerDataListener() {
      this.eventListener.off('onLoggerDataChange');
    }

    // 网元树过滤
  }, {
    key: "statisticsSecondaryFilterRequest",
    value: function statisticsSecondaryFilterRequest(param) {
      var requestJSONMessage = this.buildRequest('StatisticsSecondaryFilterRequest', param);
      console.log('网元树过滤---发送', requestJSONMessage);
      return this.executeMethodWithSession(requestJSONMessage);
    }
  }]);
}();
export { alarmAdapter as default };