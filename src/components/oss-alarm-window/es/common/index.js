function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import enumsContainer from './enums';
import { createWebRequest } from 'oss-web-common';
import serviceConfig from '../hox';
var requestTransforms = [];
requestTransforms.push(function (res) {
  try {
    var _serviceConfig$data, _serviceConfig$data$s, _serviceConfig$data$s2;
    // const { url, baseUrlType = '' } = res;
    // if (envLoaded && env && baseUrlType) {
    //     const {
    //         [baseUrlType]: { mode = '', direct: realurl = '', discover = '' },
    //         serviceDiscovery,
    //     } = env;
    //     if (mode === 'direct') {
    //         res.url = `${realurl}${url}`;
    //     } else if (mode === 'discover') {
    //         res.url = `${serviceDiscovery}/${discover}${url}`;
    //     }
    // }
    // let userInfo = JSON.parse(useLoginInfoModel?.data?.userInfo) || {};
    if (serviceConfig === null || serviceConfig === void 0 ? void 0 : (_serviceConfig$data = serviceConfig.data) === null || _serviceConfig$data === void 0 ? void 0 : (_serviceConfig$data$s = _serviceConfig$data.serviceConfig) === null || _serviceConfig$data$s === void 0 ? void 0 : (_serviceConfig$data$s2 = _serviceConfig$data$s.userInfo) === null || _serviceConfig$data$s2 === void 0 ? void 0 : _serviceConfig$data$s2.zoneId) {
      var _serviceConfig$data2, _serviceConfig$data2$, _serviceConfig$data2$2, _serviceConfig$data3, _serviceConfig$data3$, _serviceConfig$data3$2;
      res.headers = _objectSpread(_objectSpread({}, res.headers), {}, {
        region: serviceConfig === null || serviceConfig === void 0 ? void 0 : (_serviceConfig$data2 = serviceConfig.data) === null || _serviceConfig$data2 === void 0 ? void 0 : (_serviceConfig$data2$ = _serviceConfig$data2.serviceConfig) === null || _serviceConfig$data2$ === void 0 ? void 0 : (_serviceConfig$data2$2 = _serviceConfig$data2$.userInfo) === null || _serviceConfig$data2$2 === void 0 ? void 0 : _serviceConfig$data2$2.region,
        zoneId: serviceConfig === null || serviceConfig === void 0 ? void 0 : (_serviceConfig$data3 = serviceConfig.data) === null || _serviceConfig$data3 === void 0 ? void 0 : (_serviceConfig$data3$ = _serviceConfig$data3.serviceConfig) === null || _serviceConfig$data3$ === void 0 ? void 0 : (_serviceConfig$data3$2 = _serviceConfig$data3$.userInfo) === null || _serviceConfig$data3$2 === void 0 ? void 0 : _serviceConfig$data3$2.zoneId
      });
    }
    if (res.headers) {
      res.headers.Authorization = "Bearer ".concat(localStorage.getItem('access_token'));
    }
    return res;
  } catch (e) {
    return Promise.reject(e);
  }
}, function (res) {
  try {
    var url = res.url;
    // Match /znjk/ followed by any segment
    var prefixRegex = /^\/znjk\/[^/]+\//;
    var defaultPrefix = '/znjk/canary/';

    // Get prefix from current location or fallback to default
    var currentMatch = window.location.pathname.match(prefixRegex);
    var targetPrefix = currentMatch ? currentMatch[0] : defaultPrefix;
    var isFullUrl = /^https?:\/\//.test(url);
    if (isFullUrl) {
      var urlObj = new URL(url);
      var isSameHost = urlObj.hostname === window.location.hostname && urlObj.port === window.location.port;
      if (isSameHost && !prefixRegex.test(urlObj.pathname)) {
        res.url = "".concat(urlObj.origin).concat(targetPrefix).concat(urlObj.pathname.replace(/^\//, '')).concat(urlObj.search);
      }
    } else {
      res.url = "".concat(window.location.origin).concat(targetPrefix).concat(url.replace(/^\//, ''));
    }
    return res;
  } catch (e) {
    return Promise.reject(e);
  }
});
var config = {
  timeout: 60000,
  contentType: 'application/json',
  requestTransforms: requestTransforms,
  withCredentials: false
};
var Common = {
  Enums: enumsContainer,
  request: createWebRequest(config)
};
export default Common;