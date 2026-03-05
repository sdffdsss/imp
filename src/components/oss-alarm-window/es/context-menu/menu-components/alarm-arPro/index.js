function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import React, { useState } from 'react';
import { PageContainer } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import dmDef from './dataModelDefinition.json';
import { arproViewPageArgs } from '../../../alarm-window/alarm-show-config';
import { getViewItemData2Table } from '../../../alarm-window/common/proxy';
import { _ } from 'oss-web-toolkits';

/**
 *获取列信息
 */
var getColumns = function getColumns(indicators) {
  var colInindi = indicators.map(function (item) {
    if (item.key) {
      return {
        title: item.fieldLabel,
        dataIndex: item.fieldName,
        key: item.fieldName,
        width: 120,
        hideInTable: true,
        ellipsis: true
      };
    } else {
      return {
        title: item.fieldLabel,
        dataIndex: item.fieldName,
        key: item.fieldName,
        width: 120,
        ellipsis: true
      };
    }
  });
  return [{
    title: '序号',
    width: 50,
    dataIndex: 'index'
  }].concat(_toConsumableArray(colInindi));
};

/***
 * 告警流水右键-工程信息查看
 */
var CompArPro = function CompArPro(props) {
  var _useState = useState(getColumns(dmDef.dataModelDefinition.header.indicators)),
    _useState2 = _slicedToArray(_useState, 2),
    columns = _useState2[0],
    setColumns = _useState2[1];
  var callback = function callback(result) {
    if (result.success) {
      setColumns(getColumns(result.indicators));
    }
    return result.dataSource;
  };
  var loadData = function loadData(params) {
    var viewPageArgs = {
      pageIndex: params.current,
      pageSize: params.pageSize
    };
    var alarmClickTarget = props.alarmClickTarget;
    _.forEach(arproViewPageArgs, function (item) {
      var _alarmClickTarget$ite;
      viewPageArgs[item.label] = (_alarmClickTarget$ite = alarmClickTarget[item.fieldName]) === null || _alarmClickTarget$ite === void 0 ? void 0 : _alarmClickTarget$ite.value;
    });
    var viewItemId = 'projectInfo';
    var viewPageId = 'alarm-detail';
    return getViewItemData2Table({
      viewPageArgs: viewPageArgs,
      viewItemId: viewItemId,
      callback: callback,
      viewPageId: viewPageId
    });
  };
  return /*#__PURE__*/React.createElement(PageContainer, {
    divider: true,
    showHeader: false,
    gridContentStyle: {
      height: "".concat((window.innerHeight - 185) * 0.75, "px")
    }
  }, /*#__PURE__*/React.createElement(VirtualTable, {
    global: window,
    bordered: true,
    defaultCollapsed: true,
    rowKey: "id",
    size: "small",
    columns: columns,
    request: loadData,
    search: false,
    options: false,
    toolBarRender: false
  }));
};
export default CompArPro;