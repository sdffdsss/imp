function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useEffect } from 'react';
import { Collapse, Descriptions } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import "./index.css";
var Component = function Component(props) {
  var groupMap = ['位置信息', '设备属性', '定位对象', '告警分类', '告警属性', '告警处理', '告警派单', '告警操作', '基础字段', '网管信息', '集客信息', '其他信息'];
  var _props$record = props.record,
    record = _props$record === void 0 ? {} : _props$record,
    recordsDetail = props.recordsDetail,
    fullColumnsDict = props.fullColumnsDict;
  var _useState = useState(record),
    _useState2 = _slicedToArray(_useState, 2),
    showRecord = _useState2[0],
    setShowRecord = _useState2[1];
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    groupedFieldList = _useState4[0],
    setGroupedFieldList = _useState4[1];
  useEffect(function () {
    var groupedField = [];
    if (props.fullColumnsDict && props.fullColumnsDict.length) {
      // pick展示字段
      var showField = props.fullColumnsDict.filter(function (s) {
        return s.displayFlag;
      });
      // 分组
      _.forEach(showField, function (item) {
        var groupId = item.fieldGroup;
        // 寻找相同组
        if (!groupedField[groupId]) {
          // 未找到相同组，创建新组
          groupedField[groupId] = [item];
        } else {
          // 找到相同组,push进去，并排序
          groupedField[groupId].push(item);
          groupedField[groupId] = _.sortBy(groupedField[groupId], ['displayOrder']);
        }
      });
      setGroupedFieldList(groupedField);
    }
    return function () {};
  }, [fullColumnsDict]);
  useEffect(function () {
    if (recordsDetail && recordsDetail.length && record) {
      var targetAlarm = recordsDetail.find(function (item) {
        var _item$alarm_id, _record$alarm_id;
        return ((_item$alarm_id = item.alarm_id) === null || _item$alarm_id === void 0 ? void 0 : _item$alarm_id.value) === ((_record$alarm_id = record.alarm_id) === null || _record$alarm_id === void 0 ? void 0 : _record$alarm_id.value);
      });
      setShowRecord(targetAlarm);
    }
    return function () {};
  }, [recordsDetail, record]);
  var Panel = Collapse.Panel;
  return /*#__PURE__*/React.createElement(Collapse, {
    defaultActiveKey: ['1'],
    accordion: true,
    className: "site-collapse-custom-collapse"
  }, groupedFieldList.map(function (groupItem, index) {
    return /*#__PURE__*/React.createElement(Panel, {
      showArrow: false,
      header: groupMap[index],
      key: "".concat(index)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 0,
        // maxHeight: `${window.innerHeight - 135 - groupedFieldList.filter((s) => !!s).length * 34}px`,
        overflowY: 'auto'
      }
    }, /*#__PURE__*/React.createElement(Descriptions, {
      bordered: true,
      size: "small"
    }, groupItem.map(function (field) {
      var _showRecord$field$sto, _showRecord$field$sto2;
      return /*#__PURE__*/React.createElement(Descriptions.Item, {
        label: field.displayName,
        span: 4,
        key: field.fieldId,
        labelStyle: {
          width: '50%'
        }
      }, showRecord && (((_showRecord$field$sto = showRecord[field.storeFieldName]) === null || _showRecord$field$sto === void 0 ? void 0 : _showRecord$field$sto.lable) || ((_showRecord$field$sto2 = showRecord[field.storeFieldName]) === null || _showRecord$field$sto2 === void 0 ? void 0 : _showRecord$field$sto2.value)));
    }))));
  }));
};
export default Component;