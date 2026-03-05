function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import Common from '../../common';
import { message } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import serviceConfig from '../../hox';
export var rightClickOperateApi = function rightClickOperateApi(_ref) {
  var data = _ref.data,
    menu = _ref.menu;
  var fullUrl = "".concat(serviceConfig.data.serviceConfig.otherService.filterUrl, "alarmmodel/operate/v1/operate/rightclick");
  if (menu.key === 'ManualDispatchUnicom' || menu.key === 'ManualRelatedDispatchUnicom' || menu.key === 'Supervise') {
    fullUrl = "".concat(serviceConfig.data.serviceConfig.otherService.filterUrl, "alarmmodel/operate/v1/operate/alarm/dispatch");
    if (menu.key === 'Supervise') {
      data.configType = 2;
    } else {
      data.configType = 0;
    }
  } else {
    data = _.omit(data, 'loginId');
  }
  Common.request(null, {
    fullUrl: fullUrl,
    type: 'post',
    showSuccessMessage: false,
    showErrorMessage: true,
    data: data
  }).then(function (res) {
    if (res && res.data) {
      //操作成功
      message.success("".concat(menu.name, "\u64CD\u4F5C\u6210\u529F\uFF01"));
      if (menu.key === 'ManualDispatchUnicom' || menu.key === 'Supervise') {
        window.open("".concat(res.data));
      }
    } else {
      //操作失败
      message.error("".concat(menu.name, "\u64CD\u4F5C\u5931\u8D25\uFF1A").concat(res.message));
    }
  }).catch(function (err, message) {
    console.error("".concat(menu.name, "\u64CD\u4F5C\u5931\u8D25\uFF1A").concat(err.message));
  });
};

/**
 * 视图服务接口
 */

export var getViewItemData = function getViewItemData(_ref2) {
  var viewItemId = _ref2.viewItemId,
    viewPageId = _ref2.viewPageId,
    viewPageArgs = _ref2.viewPageArgs,
    callback = _ref2.callback;
  var data = {
    requestInfo: {
      clientRequestId: 'nomean',
      clientToken: localStorage.getItem('access_token')
    },
    viewItemId: viewItemId,
    viewPageArgs: _objectSpread({}, viewPageArgs),
    viewPageId: viewPageId
  };
  Common.request(null, {
    fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.viewItemUrl, "view/getViewItemData"),
    type: 'post',
    showSuccessMessage: false,
    showErrorMessage: true,
    defaultErrorMessage: '获取数据失败',
    data: data
  }).then(function (result) {
    if (_.get(result, 'data.viewItemData.rows')) {
      callback(_.get(result, 'data.viewItemData.rows'));
    } else {
      callback([]);
    }
  }).catch(function (err) {
    callback([]);
  });
};
export var getViewItemData2Table = function getViewItemData2Table(_ref3) {
  var viewItemId = _ref3.viewItemId,
    viewPageId = _ref3.viewPageId,
    viewPageArgs = _ref3.viewPageArgs,
    callback = _ref3.callback;
  var data = {
    requestInfo: {
      clientRequestId: 'nomean',
      clientToken: localStorage.getItem('access_token')
    },
    viewItemId: viewItemId,
    viewPageArgs: _objectSpread({}, viewPageArgs),
    viewPageId: viewPageId
  };
  var callbackParams = {
    dataSource: {
      data: [],
      success: true,
      total: 0
    },
    success: false
  };
  return Common.request(null, {
    fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.viewItemUrl, "view/getViewItemData"),
    type: 'post',
    showSuccessMessage: false,
    showErrorMessage: true,
    defaultErrorMessage: '获取数据失败',
    data: data
  }).then(function (result) {
    if (result) {
      var viewItemData = result.data.viewItemData;
      //动态获取展示列信息
      var indicators = viewItemData.header.counterFieldList;

      //加载数据

      var pageIndex = viewPageArgs.pageIndex,
        pageSize = viewPageArgs.pageSize;
      var dataWithIndex = (viewItemData.rows || []).map(function (item, index) {
        return _objectSpread({
          index: index + (pageIndex - 1) * pageSize + 1
        }, item);
      });
      return callback({
        success: true,
        indicators: indicators,
        dataSource: {
          data: dataWithIndex,
          success: true,
          total: viewItemData.page.total
        }
      });
    } else {
      return callback(callbackParams);
    }
  }).catch(function (err) {
    return callback(callbackParams);
  });
};

// 影响用户/小区导出
export var exportAlarmRequest = function exportAlarmRequest(_ref4) {
  var viewPageArgs = _ref4.viewPageArgs,
    viewItemId = _ref4.viewItemId,
    viewPageId = _ref4.viewPageId,
    exportArgs = _ref4.exportArgs,
    callback = _ref4.callback;
  var data = {
    requestInfo: {
      clientRequestId: 'nomean',
      clientToken: localStorage.getItem('access_token')
    },
    viewItemId: viewItemId,
    viewPageArgs: _objectSpread({}, viewPageArgs),
    viewPageId: viewPageId,
    exportArgs: _objectSpread({
      exportWay: 'BY_FIELD_LIST'
    }, exportArgs)
  };
  return Common.request(null, {
    fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.managerUrl, "viewServerFile/exportViewResult"),
    type: 'post',
    showSuccessMessage: false,
    showErrorMessage: true,
    defaultErrorMessage: '导出失败',
    data: data,
    responseType: 'blob'
  }).then(function (result) {
    return callback({
      success: true,
      result: result
    });
  }).catch(function (err) {
    return callback({
      success: false
    });
  });
};