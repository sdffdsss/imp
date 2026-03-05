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
import React, { useState } from 'react'; // { useState, useEffect }
import { Icon, Button, ProTable, PageContainer } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import { effectedViewPageArgs, effectedViewPageArgs2 } from '../../../alarm-window/alarm-show-config';
import { getViewItemData2Table, exportAlarmRequest } from '../../../alarm-window/common/proxy';
import dmDef from './dataModelDefinition.json';
import { _ } from 'oss-web-toolkits';
import dayjs from 'dayjs';
import { createFileFlow } from '../../../common/utils/download';

/**
 *获取列信息
 */
var getColumns = function getColumns(indicators) {
  var colInindi = indicators.map(function (item) {
    if (item.fieldLabel.indexOf('主键') > 0) {
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
var devTypeMap = {
  板卡: 10011,
  PORT: 706,
  OLT: 2011,
  ONU: 2012
};
var CompEffectedUser = function CompEffectedUser(props) {
  var _useState = useState(getColumns(dmDef.dataModelDefinition.header.indicators)),
    _useState2 = _slicedToArray(_useState, 2),
    columns = _useState2[0],
    setColumns = _useState2[1];
  var _useState3 = useState({}),
    _useState4 = _slicedToArray(_useState3, 2),
    viewPageArgsParams = _useState4[0],
    setViewPageArgsParams = _useState4[1];
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    filedsList = _useState6[0],
    setFiledsList = _useState6[1];
  var callback = function callback(result) {
    var list = [];
    if (result.success) {
      setColumns(getColumns(result.indicators));
      result.indicators.forEach(function (item) {
        if (item.fieldName !== 'intId') {
          list.push(item.fieldName);
        }
      });
      setFiledsList(list);
    }
    return result.dataSource;
  };
  var loadData = function loadData(params) {
    var _alarmClickTarget$obj;
    var viewPageArgs = {
      pageIndex: params.current,
      pageSize: params.pageSize
    };
    var alarmClickTarget = props.alarmClickTarget;
    var devTypeCode = (_alarmClickTarget$obj = alarmClickTarget.object_class) === null || _alarmClickTarget$obj === void 0 ? void 0 : _alarmClickTarget$obj.value;
    var args = [];
    if (!isNaN(devTypeCode)) {
      switch (Number(devTypeCode)) {
        case 10011:
        case 706:
          args = effectedViewPageArgs2;
          break;
        default:
          args = effectedViewPageArgs;
      }
      _.forEach(args, function (item) {
        var _alarmClickTarget$ite;
        viewPageArgs[item.label] = (_alarmClickTarget$ite = alarmClickTarget[item.fieldName]) === null || _alarmClickTarget$ite === void 0 ? void 0 : _alarmClickTarget$ite.value;
      });
      var viewItemId = dmDef.dataModelDefinition.name;
      var viewPageId = 'alarm-resources';
      setViewPageArgsParams(viewPageArgs);
      return getViewItemData2Table({
        viewPageArgs: viewPageArgs,
        viewItemId: viewItemId,
        viewPageId: viewPageId,
        callback: callback
      });
    }
  };
  var handleDownloadClick = function handleDownloadClick() {
    var viewPageArgs = viewPageArgsParams;
    var viewItemId = dmDef.dataModelDefinition.name;
    var viewPageId = 'alarm-resources';
    var exportArgs = {
      fieldList: filedsList
    };
    var callback = function callback(result) {
      if (result.success) {
        // // type 为需要导出的文件类型，此处为xls表格类型
        // const blob = new Blob([result.result], { type: 'application/vnd.ms-excel' });
        // // 兼容不同浏览器的URL对象
        var myurl = window.URL || window.webkitURL || window.moxURL;
        // // 创建下载链接
        // const downloadHref = myurl.createObjectURL(blob);
        // // 创建a标签并为其添加属性
        // const downloadLink = document.createElement('a');
        // downloadLink.href = downloadHref;
        // downloadLink.download = `导出影响用户数据${dayjs().format('YYYYMMDDHHmmss')}.xls`;
        // // 触发点击事件执行下载
        // downloadLink.click();
        createFileFlow("\u5BFC\u51FA\u5F71\u54CD\u5C0F\u533A\u6570\u636E".concat(dayjs().format('YYYYMMDDHHmmss'), ".xls"), myurl);
      }
    };
    exportAlarmRequest({
      viewPageArgs: viewPageArgs,
      viewItemId: viewItemId,
      viewPageId: viewPageId,
      exportArgs: exportArgs,
      callback: callback
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
    rowKey: "intId",
    size: "small",
    columns: columns,
    request: loadData,
    search: false,
    options: false,
    toolBarRender: function toolBarRender() {
      return [/*#__PURE__*/React.createElement(Button, {
        key: 1,
        onClick: handleDownloadClick
      }, /*#__PURE__*/React.createElement(Icon, {
        antdIcon: true,
        type: "DownloadOutlined"
      }), "\u5BFC\u51FA")];
    }
  }));
};
export default CompEffectedUser;