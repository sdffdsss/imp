function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import '../lib/long/long';
import '../lib/Ice.min';
import '../lib/cloud_view_base.js';
import serviceConfig from '../../hox';
var ipRegexp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
var ServiceLocator = /*#__PURE__*/function () {
  function ServiceLocator() {
    _classCallCheck(this, ServiceLocator);
    this.initData = null;
    this.initData = new window.Ice.InitializationData();
    this.initData.properties = window.Ice.createProperties();
    this.initData.properties.setProperty('Ice.FactoryAssemblies', 'IMMP.Com.Proxy.Base.InitData,Version=1.0.0.0');
    this.initData.properties.setProperty('Ice.MessageSizeMax', '104857600');
    this.initData.properties.setProperty('Ice.ACM.Client', '0');
    // this.init();

    this.communicator = null;
    this.bProxy = null;
  }

  //流水窗-告警订阅服务(过滤器 Filtering)
  return _createClass(ServiceLocator, [{
    key: "getAlarmSubscribeService",
    value: function getAlarmSubscribeService() {
      var _serviceConfig$data$s = serviceConfig.data.serviceConfig.serviceConfig,
        isUseIceGrid = _serviceConfig$data$s.isUseIceGrid,
        icegridUrl = _serviceConfig$data$s.icegridUrl,
        icegridBackupUrl = _serviceConfig$data$s.icegridBackupUrl,
        directSvcId = _serviceConfig$data$s.directSvcId,
        directServiceUrl = _serviceConfig$data$s.directServiceUrl,
        icegridSvcId = _serviceConfig$data$s.icegridSvcId;
      var host = directServiceUrl,
        svcId = directSvcId;
      if (isUseIceGrid) {
        host = icegridUrl;
        svcId = icegridSvcId;
      }
      if (!ipRegexp.test(host)) {
        host = window.location.host;
      }
      var proxy = this.getBaseProxy(svcId, host, isUseIceGrid, icegridBackupUrl);
      var alarmSubProxy = window.com.boco.view.slice.generated.services.IViewServicePrx.uncheckedCast(proxy);
      return alarmSubProxy;
    }
  }, {
    key: "getBaseProxy",
    value: function getBaseProxy(svid, host, useIceGrid, backupHost) {
      try {
        var a = [];
        var ip = '';
        var port = '';
        a = host.split(':');
        if (a.length === 2) {
          ip = a[0];
          port = a[1];
        } else if (a.length === 1) {
          // 没有端口号，http 默认80 https 默认443
          ip = a[0];
          if (window.location.protocol.startsWith('https')) {
            port = '443';
          } else {
            port = '80';
          }
        }
        var serverId = "Alarm/View : ws -h ".concat(ip, " -p ").concat(port, " -r /").concat(svid);
        if (useIceGrid) {
          var hostUrl = "IceGridServer/Locator:ws -h ".concat(ip, " -p ").concat(port);
          if (backupHost) {
            var backup = backupHost.split(':');
            if (backup.length === 2) {
              hostUrl = "IceGridServer/Locator:ws -h ".concat(ip, " -p ").concat(port, ":ws -h ").concat(backup[0], " -p ").concat(backup[1]);
            }
          }
          this.initData.properties.setProperty('Ice.Default.Locator', hostUrl);
          serverId = svid;
        }
        this.communicator = window.Ice.initialize(this.initData);
        this.bProxy = this.communicator.stringToProxy(serverId);
        this.bProxy.ice_invocationTimeout(1000 * 10 * 1);
        this.bProxy.ice_twoway();
        this.bProxy.ice_timeout(30000);
        return this.bProxy;
      } catch (e) {
        console.log(e);
      }
    }
  }]);
}();
export { ServiceLocator as default };