function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState } from 'react';
import { createModel } from 'hox';
function serviceConfig() {
  var _useState = useState({
      serviceConfig: {
        isUseIceGrid: false,
        icegridUrl: '10.10.2.22:4501',
        icegridBackupUrl: '10.10.2.23:4501',
        icegridSvcId: 'IceGridServer/Locator',
        directSvcId: 'Alarm/View',
        directServiceUrl: '192.168.2.12:4519',
        batchSize: 50,
        clientTimeOutSeconds: 3000,
        refreshInterval: 1000
      },
      userInfo: {
        userId: 0,
        userName: 'admin'
      },
      otherService: {
        alarmSoundUrl: 'http://10.12.1.107:7788',
        filterUrl: 'http://10.10.2.64:8077/',
        outboundMail: 'http://10.10.2.64:8888/cloud.alarm.call',
        viewItemUrl: 'http://10.12.2.166:8085/',
        allLifeUrl: 'http://10.10.2.63:8282'
      }
    }),
    _useState2 = _slicedToArray(_useState, 2),
    serviceConfig = _useState2[0],
    setServiceConfig = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    clickLock = _useState4[0],
    setClickLock = _useState4[1];
  var _useState5 = useState(60),
    _useState6 = _slicedToArray(_useState5, 2),
    lockPeriod = _useState6[0],
    setLockPeriod = _useState6[1];
  var _useState7 = useState(2000),
    _useState8 = _slicedToArray(_useState7, 2),
    delayTime = _useState8[0],
    setDelayTime = _useState8[1];
  var _useState9 = useState(false),
    _useState0 = _slicedToArray(_useState9, 2),
    autoUnLock = _useState0[0],
    setAutoUnLock = _useState0[1];
  var _useState1 = useState(null),
    _useState10 = _slicedToArray(_useState1, 2),
    sessionId = _useState10[0],
    setSessionId = _useState10[1];
  var _useState11 = useState(false),
    _useState12 = _slicedToArray(_useState11, 2),
    removeClearAlarm = _useState12[0],
    setRemoveClearAlarm = _useState12[1];
  var _useState13 = useState(null),
    _useState14 = _slicedToArray(_useState13, 2),
    statusConfig = _useState14[0],
    setStatusConfig = _useState14[1];
  var _useState15 = useState(0),
    _useState16 = _slicedToArray(_useState15, 2),
    logType = _useState16[0],
    setLogType = _useState16[1];
  var _useState17 = useState(null),
    _useState18 = _slicedToArray(_useState17, 2),
    fieldEnums = _useState18[0],
    setFieldEnums = _useState18[1];
  return {
    serviceConfig: serviceConfig,
    setServiceConfig: setServiceConfig,
    clickLock: clickLock,
    setClickLock: setClickLock,
    lockPeriod: lockPeriod,
    setLockPeriod: setLockPeriod,
    delayTime: delayTime,
    setDelayTime: setDelayTime,
    autoUnLock: autoUnLock,
    setAutoUnLock: setAutoUnLock,
    sessionId: sessionId,
    setSessionId: setSessionId,
    removeClearAlarm: removeClearAlarm,
    setRemoveClearAlarm: setRemoveClearAlarm,
    statusConfig: statusConfig,
    setStatusConfig: setStatusConfig,
    logType: logType,
    setLogType: setLogType,
    fieldEnums: fieldEnums,
    setFieldEnums: setFieldEnums
  };
}
export default createModel(serviceConfig);