function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _this = this;
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useEffect, useState } from 'react';
import { array } from 'prop-types';
import classnames from 'classnames';
import { Space, Tooltip, Icon } from 'oss-ui';
import { produce } from 'immer';
import { _ } from 'oss-web-toolkits';
import imagesUrl from '../assets';
import StatChart from '../alarm-stat-chart';
import styles from "./index.module.css";
var SyncResult = function SyncResult(props) {
  var showContent;
  var syncResultInfo = props.syncResultInfo;
  if (syncResultInfo === null || syncResultInfo === void 0 ? void 0 : syncResultInfo.end) {
    showContent = syncResultInfo && "\u540C\u6B65\u5B8C\u6210\uFF0C\u5171\u8BA1".concat(syncResultInfo.size, "\u6761\uFF0C\u5171\u8BA1\u7528\u65F6").concat((syncResultInfo.time / 1000).toFixed(1), "s");
  } else {
    showContent = syncResultInfo && "\u540C\u6B65\u4E2D\uFF0C\u5DF2\u540C\u6B65".concat(syncResultInfo.size, "\u6761\uFF0C\u7528\u65F6").concat((syncResultInfo.time / 1000).toFixed(1), "s");
  }
  return /*#__PURE__*/React.createElement(Tooltip, {
    placement: "top",
    title: showContent
  }, /*#__PURE__*/React.createElement("div", {
    className: "sync-result"
  }, showContent));
};
var StatisticsBar = function StatisticsBar(props) {
  var _props$statItems = props.statItems,
    statItems = _props$statItems === void 0 ? [] : _props$statItems,
    paramData = props.paramData,
    customParamData = props.customParamData,
    getContainer = props.getContainer,
    getAlarmStat = props.getAlarmStat;
  var _useState = useState({
      severity: '',
      ackFlag: false
    }),
    _useState2 = _slicedToArray(_useState, 2),
    bold = _useState2[0],
    setBold = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    chartShow = _useState4[0],
    setChartShow = _useState4[1];
  // const handleParamData = useCompare(parmaData);
  var total = statItems.reduce(function (total, item, index) {
    if (index >= 4) {
      return total;
    }
    return total + Number(item.value);
  }, 0);
  useEffect(function () {
    var orgSeverity = getParamDataValueByKey('org_severity');
    var ackFlag = getParamDataValueByKey('ack_flag');
    var checkedBold = _.cloneDeep(bold);
    if (orgSeverity && Array.isArray(orgSeverity.value)) {
      if (orgSeverity.value.length === 1) {
        checkedBold.severity = orgSeverity.value[0];
      } else if (orgSeverity.value.length === 4) {
        checkedBold.severity = '6';
      } else {
        checkedBold.severity = '';
      }
    } else {
      checkedBold.severity = '';
    }
    if (ackFlag && Array.isArray(ackFlag.value)) {
      var values = ['1', '2'];
      var checked = ackFlag.value.length === values.length && _.filter(ackFlag.value, function (value) {
        return values.includes(value);
      }).length === values.length;
      checkedBold.ackFlag = checked;
    } else {
      checkedBold.ackFlag = false;
    }
    setBold(checkedBold);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramData]);
  /**
   * @description: 选择全部
   * @param {*}
   * @return {*}
   */
  var checkedAll = function checkedAll() {
    var checkedStat = [];
    statItems.forEach(function (item, index) {
      if (index < 4) {
        checkedStat.push(item);
      }
    });
    clickStat(checkedStat);
  };

  /**
   * @description: 点击选中筛选项
   * @param {*}
   * @return {*}
   */

  //
  var clickStat = function clickStat(checkedStat) {
    var keys = Array.isArray(checkedStat) && checkedStat.map(function (item) {
      return item.key;
    });
    var param = setParamDataValueByKey('org_severity', keys);
    props.onClick && props.onClick(param);
  };
  /**
   * @description: 根据key取得paramData中的value
   * @param {*}
   * @return {*}
   */
  var getParamDataValueByKey = function getParamDataValueByKey(key) {
    return _.find(paramData && paramData.conditionList, {
      fieldName: key
    });
  };
  /**
   * @description: 根据key value 得到新的paramData对象
   * @param {*} key
   * @param {*} value
   * @return {*}
   */
  var setParamDataValueByKey = function setParamDataValueByKey(key, value) {
    var param = produce(paramData, function (draft) {
      var tempData = _.find(draft && draft.conditionList, {
        fieldName: key
      });
      tempData ? tempData.value = value : draft.conditionList.push({
        fieldName: key,
        not: false,
        operator: 'in',
        value: value
      });
    });
    return param;
  };
  /**
   * @description: 点击确认
   * @param {*}
   * @return {*}
   */
  var checkedAckFlag = function checkedAckFlag() {
    var values;
    var ackFlag = getParamDataValueByKey('ack_flag');
    if (ackFlag && ackFlag.value.length !== 4) {
      values = ['-1', '0', '1', '2'];
    } else {
      values = ['1', '2'];
    }
    var param = setParamDataValueByKey('ack_flag', values);
    props.onClick && props.onClick(param);
  };
  var onStatChartShow = function onStatChartShow(visible) {
    setChartShow(visible);
  };
  return /*#__PURE__*/React.createElement(Space, {
    className: styles.container
  }, Array.isArray(props.operationBar) && props.operationBar.map(function (item) {
    return item;
  }), Array.isArray(statItems) && statItems.map(function (statItem, index) {
    return index < 4 && /*#__PURE__*/React.createElement(Tooltip, {
      title: statItem.title,
      key: statItem.key
    }, /*#__PURE__*/React.createElement(Space, {
      size: 3,
      className: classnames(_defineProperty(_defineProperty({}, styles['stat-item'], true), styles['stat-item-checked'], bold.severity === statItem.key)),
      onClick: clickStat.bind(_this, [statItem])
    }, /*#__PURE__*/React.createElement("div", {
      className: classnames(styles.circle, styles[statItem.color])
    }), /*#__PURE__*/React.createElement("div", {
      className: classnames(styles.value, 'alamr-window-statistics-bar-value')
    }, statItem.value)));
  }), !!statItems.length && /*#__PURE__*/React.createElement(Tooltip, {
    title: '全部'
  }, /*#__PURE__*/React.createElement(Space, {
    size: 3,
    className: classnames(_defineProperty(_defineProperty({}, styles['stat-item'], true), styles['stat-item-checked'], bold.severity === '6')),
    onClick: checkedAll
  }, /*#__PURE__*/React.createElement("img", {
    alt: "total",
    src: imagesUrl.acitve,
    className: styles['stat-item']
  }), /*#__PURE__*/React.createElement("div", {
    className: classnames(styles.value, 'alamr-window-statistics-bar-value')
  }, total || 0))), !!statItems.length && /*#__PURE__*/React.createElement(Tooltip, {
    title: "\u786E\u8BA4"
  }, /*#__PURE__*/React.createElement(Space, {
    size: 3,
    className: classnames(_defineProperty(_defineProperty({}, styles['stat-item'], true), styles['stat-item-checked'], bold.ackFlag)),
    onClick: checkedAckFlag
  }, /*#__PURE__*/React.createElement("div", {
    className: classnames(styles.circle, styles['green'])
  }), /*#__PURE__*/React.createElement("div", {
    className: classnames(styles.value, 'alamr-window-statistics-bar-value')
  }, statItems && statItems[4] && statItems[4].value))), (!!paramData && !!paramData.conditionList && !!paramData.conditionList.length || !!customParamData && !!customParamData.conditionList && !!customParamData.conditionList.length) && /*#__PURE__*/React.createElement(Tooltip, {
    title: "\u5171\u7B5B\u9009\u51FA\u544A\u8B66".concat(statItems && statItems[6] && statItems[6].value || 0, "\uFF0C\u4E3B\u544A\u8B66").concat(statItems && statItems[5] && statItems[5].value || 0)
  }, /*#__PURE__*/React.createElement("section", {
    className: styles['filter-info']
  }, "\u5171\u7B5B\u9009\u51FA\u544A\u8B66", statItems && statItems[6] && statItems[6].value || 0, "\uFF0C\u4E3B\u544A\u8B66", statItems && statItems[5] && (statItems[5].value || 0))), props.winType === 'active' && props.stateSyncInfo.syncVisible && /*#__PURE__*/React.createElement(SyncResult, {
    syncResultInfo: props.stateSyncInfo.syncInfo
  }), chartShow && /*#__PURE__*/React.createElement(StatChart, {
    visible: chartShow,
    onCancel: function onCancel() {
      return onStatChartShow(false);
    },
    getContainer: getContainer,
    getAlarmStat: getAlarmStat
  }));
};
StatisticsBar.propTypes = {
  // title: element,
  statItems: array
};
StatisticsBar.defaultProps = {
  // title: 'Title',
  statItems: [{
    key: '1',
    title: '一级告警',
    value: 0,
    color: 'red',
    type: 'orgSeverity1'
  }, {
    key: '2',
    title: '二级告警',
    value: 0,
    color: 'orange',
    type: 'orgSeverity2'
  }, {
    key: '3',
    title: '三级告警',
    value: 0,
    color: 'yellow',
    type: 'orgSeverity3'
  }, {
    key: '4',
    title: '四级告警',
    value: 0,
    color: 'blue',
    type: 'orgSeverity4'
  }, {
    key: '5',
    title: '确认',
    value: 0,
    color: 'green',
    type: 'confirm'
  }, {
    key: '6',
    title: '主告警数',
    value: 0,
    color: '',
    type: 'main'
  }]
};
export default /*#__PURE__*/React.memo(StatisticsBar);