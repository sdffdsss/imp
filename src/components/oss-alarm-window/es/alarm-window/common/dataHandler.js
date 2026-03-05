function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { _ } from 'oss-web-toolkits';

/**
 * 由右键菜单定义集合和菜单结构配置生成右键菜单数据
 *
 * @param {Object} menuMap 右键菜单定义集合
 * @param {Object} menuRelationship 菜单层级关系
 * @return {Array} 返回右键菜单数组
 */
export var generateMenuList = function generateMenuList(menuMap, menuRelationship) {
  return menuRelationship.filter(function (item) {
    return _.find(menuMap, ['key', item.key]);
  }).map(function (item) {
    var menuObj = _.find(menuMap, ['key', item.key]);
    item = _objectSpread(_objectSpread({}, menuObj), item);
    if (item.subMenus) {
      var subMenus = item.subMenus.filter(function (subItem) {
        return _.find(menuMap, ['key', subItem.key]);
      }).map(function (subItem) {
        var subMenuObj = _.find(menuMap, ['key', subItem.key]);
        subItem = _objectSpread(_objectSpread(_objectSpread({}, subMenuObj), subItem), {}, {
          isSubItem: true
        });
        return subItem;
      });
      item.subMenus = subMenus || null;
    }
    return item;
  });
};

/**
 * 生成右键操作数据
 *
 * @param {Array} actionRecords 操作告警数据
 * @param {Object} menu 当前右键菜单
 * @param {Array} recordsDetail 当前选中告警的详情
 * @param {Object} frameInfo 框架传递数据
 * @param {Object} formRef form表单实例
 * @return {Object} 返回右键操作data
 */
export var setRightClickData = function setRightClickData(_ref) {
  var actionRecords = _ref.actionRecords,
    menu = _ref.menu,
    recordsDetail = _ref.recordsDetail,
    frameInfo = _ref.frameInfo,
    formRef = _ref.formRef;
  // const records = getRecordsRecursion(actionRecords, menu.isRelated);
  var recordsWithDetail = actionRecords.map(function (item) {
    var detail = _.find(recordsDetail, function (s) {
      var _s$alarm_id, _item$alarm_id;
      return ((_s$alarm_id = s['alarm_id']) === null || _s$alarm_id === void 0 ? void 0 : _s$alarm_id.value) === ((_item$alarm_id = item['alarm_id']) === null || _item$alarm_id === void 0 ? void 0 : _item$alarm_id.value);
    }) || item;
    var detailValue = {};
    _.forOwn(detail, function (value, key) {
      detailValue[key] = value.value;
    });
    return detailValue;
  });
  var data = {
    operatorId: frameInfo.userId,
    //操作人ID
    operatorName: frameInfo.userName,
    //操作人名称
    loginId: frameInfo.loginId,
    requestInfo: {
      clientRequestId: 'nomean',
      clientToken: localStorage.getItem('access_token')
    },
    clientRequestInfo: encodeURI(JSON.stringify({
      clientRequestId: 'nomean',
      clientToken: localStorage.getItem('access_token')
    })),
    alarmPropertiesList: recordsWithDetail,
    operateType: menu.operateType
  };
  if (menu.feedbackField && menu.feedbackField.length) {
    data.operateProps = {};
    _.forEach(menu.feedbackField, function (field) {
      data.operateProps[field] = formRef.current.getFieldValue(field);
      if ((field === 'reason' || field === 'memo') && !formRef.current.getFieldValue(field)) {
        data.operateProps[field] = '已阅读';
      }
    });
  }
  return data;
};

/**
 * 递归获取关联告警
 * @param {*} record 告警原始数据
 * @param {*} isRelated 是否关联操作
 */
export var getRecordsRecursion = function getRecordsRecursion(record, isRelated) {
  var datas = [];
  var currentRecord = [].concat(record);
  if (isRelated) {
    var _loop = function _loop() {
      _.forEach(currentRecord, function (s) {
        datas.push(_.omit(s, 'children'));
      });
      var next = [];
      _.forEach(currentRecord, function (r) {
        if (r.children && r.children.length) {
          next = next.concat(r.children);
        }
      });
      currentRecord = next;
    };
    while (currentRecord && currentRecord.length) {
      _loop();
    }
  } else {
    _.forEach(record, function (s) {
      datas.push(_.omit(s, 'children'));
    });
  }
  return datas;
};

/**
 * 构造带children的告警数据
 * @param {*} selectHtData 告警原始数据
 */
var _setSelectRowsChildren = function setSelectRowsChildren(selected, isRoot) {
  var selectHtData = isRoot ? selected : [].concat(selected);
  var datas = [];
  _.forEach(selectHtData, function (item) {
    if (item.hasChildren()) {
      var newItem = item.getAttr('original_record_data');
      var children = [];
      item.eachChild(function (c) {
        children = children.concat(_setSelectRowsChildren(c, false));
      });
      newItem.children = children;
      datas.push(newItem);
    } else {
      datas.push(item.getAttr('original_record_data'));
    }
  });
  return datas;
};

/**
 * 告警详情数据formatter
 * @param {Array} detailRes 告警详情原始数据
 * @return {Array} 返回formatter后的告警详情list
 */
export { _setSelectRowsChildren as setSelectRowsChildren };
export var getRecordDetail = function getRecordDetail(detailRes) {
  var recordsDetail = [];
  if (detailRes && detailRes.length) {
    _.forEach(detailRes, function (item) {
      if (_.isArray(item.alarmFieldList)) {
        var detailRecord = {};
        _.forEach(item.alarmFieldList, function (attr) {
          detailRecord[attr.field] = attr;
        });
        recordsDetail.push(detailRecord);
      } else if (_.isObject(item)) {
        recordsDetail.push(item);
      }
    });
  }
  return recordsDetail;
};