function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useEffect } from 'react';
import { Descriptions } from 'oss-ui';
import dayjs from 'dayjs';
import { _ } from 'oss-web-toolkits';
var ConnectionInfo = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _getServiceInfo, _getServiceInfo2;
  var _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    runningTime = _useState2[0],
    setRunningTime = _useState2[1];
  var _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    lastDisconnectionTime = _useState4[0],
    setLastDisconnectionTime = _useState4[1];
  var _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    disconnectionTimes = _useState6[0],
    setdDsconnectionTimes = _useState6[1];
  var _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    connectionInfo = _useState8[0],
    setConnectionInfo = _useState8[1];
  var _useState9 = useState(''),
    _useState0 = _slicedToArray(_useState9, 2),
    session = _useState0[0],
    setSession = _useState0[1];
  var style = {
    span: 4,
    labelStyle: {
      width: '30%',
      minWidth: '100px'
    }
  };
  var getRunningTime = function getRunningTime(time) {
    var day = parseInt(time / (24 * 3600 * 1000));
    var hours = parseInt(time % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    var minutes = parseInt(time % (1000 * 60 * 60) / (1000 * 60));
    var seconds = (time % (1000 * 60) / 1000).toFixed(0);
    setRunningTime(day + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒');
  };
  var getConnectionInfo = function getConnectionInfo() {
    props.eventListener.getServiceInfo(function (res) {
      if (res.registerTime) {
        var time = Date.parse(new Date()) - Date.parse(res.registerTime);
        getRunningTime(time);
      }
      res.lastDisconnectionTime && setLastDisconnectionTime(dayjs(Date.parse(res.lastDisconnectionTime)).format('YYYY-MM-DD HH:mm:ss'));
      res.disconnectionTimes && !_.isEmpty(res.disconnectionTimes) && setdDsconnectionTimes(res.disconnectionTimes.length);
      setConnectionInfo(res.connectionStatus);
      setSession(res.session);
    });
  };
  var getConnectionStatus = function getConnectionStatus() {
    var status = '';
    if (connectionInfo === 'connection') {
      status = '接收消息正常';
    } else if (connectionInfo === 'disconnection') {
      status = '服务断连，接收消息失败';
    } else {
      status = '服务初始化连接失败';
    }
    return status;
  };
  var getServiceInfo = function getServiceInfo() {
    var sessionName = '';
    var server = '';
    if (connectionInfo !== 'thoroughDisconnection') {
      if (session) {
        sessionName = session.split('#')[2];
        server = session.split('#')[1];
      }
    } else {
      sessionName = /*#__PURE__*/React.createElement("span", null, "\u6D41\u6C34\u7A97\u6CE8\u518C\u5931\u8D25\uFF0Csession\u8FDE\u63A5\u672A\u5EFA\u7ACB");
      server = /*#__PURE__*/React.createElement("span", null, "\u6D41\u6C34\u7A97\u6CE8\u518C\u5931\u8D25\uFF0C\u670D\u52A1\u672A\u8FDE\u63A5");
    }
    return {
      sessionName: sessionName,
      server: server
    };
  };
  useEffect(function () {
    getConnectionInfo();
    var timer = setInterval(function () {
      getConnectionInfo();
    }, 1000);
    return function () {
      clearInterval(timer);
    };
  }, []);
  return /*#__PURE__*/React.createElement(Descriptions, {
    bordered: true
  }, /*#__PURE__*/React.createElement(Descriptions.Item, _extends({
    label: "\u5BA2\u6237\u7AEF\u8FD0\u884C\u65F6\u957F"
  }, style), runningTime), /*#__PURE__*/React.createElement(Descriptions.Item, _extends({
    label: "session\u540D\u79F0"
  }, style), (_getServiceInfo = getServiceInfo()) === null || _getServiceInfo === void 0 ? void 0 : _getServiceInfo.sessionName), /*#__PURE__*/React.createElement(Descriptions.Item, _extends({
    label: "\u8FDE\u63A5\u670D\u52A1"
  }, style), (_getServiceInfo2 = getServiceInfo()) === null || _getServiceInfo2 === void 0 ? void 0 : _getServiceInfo2.server), /*#__PURE__*/React.createElement(Descriptions.Item, _extends({
    label: "\u8FDE\u63A5\u72B6\u6001"
  }, style), getConnectionStatus()), /*#__PURE__*/React.createElement(Descriptions.Item, _extends({
    label: "\u65AD\u8FDE\u6B21\u6570"
  }, style), disconnectionTimes), /*#__PURE__*/React.createElement(Descriptions.Item, _extends({
    label: "\u6700\u8FD1\u65AD\u8FDE\u65F6\u95F4"
  }, style), lastDisconnectionTime));
});
export default ConnectionInfo;