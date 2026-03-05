function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useEffect } from 'react';
import { Modal } from 'oss-ui';
import { Chart, Geom, Axis, Tooltip, Annotation } from 'bizcharts';
import dayjs from 'dayjs';
var StatChart = function StatChart(props) {
  var visible = props.visible,
    onCancel = props.onCancel,
    _props$getContainer = props.getContainer,
    getContainer = _props$getContainer === void 0 ? false : _props$getContainer,
    getAlarmStat = props.getAlarmStat;
  var datas = {
    eventTimeRange: [{
      begin: 1620806400591,
      count: 1,
      end: 1620810000591
    }, {
      begin: 1620802800591,
      count: 2,
      end: 1620806400591
    }, {
      begin: 1620799200591,
      count: 3,
      end: 1620802800591
    }, {
      begin: 1620795600591,
      count: 4,
      end: 1620799200591
    }, {
      begin: 1620792000591,
      count: 5,
      end: 1620795600591
    }, {
      begin: 1620788400591,
      count: 0,
      end: 1620792000591
    }, {
      begin: 1620784800591,
      count: 0,
      end: 1620788400591
    }, {
      begin: 1620781200591,
      count: 0,
      end: 1620784800591
    }, {
      begin: 1620777600591,
      count: 0,
      end: 1620781200591
    }, {
      begin: 1620774000591,
      count: 0,
      end: 1620777600591
    }, {
      begin: 1620770400591,
      count: 0,
      end: 1620774000591
    }, {
      begin: 1620766800591,
      count: 0,
      end: 1620770400591
    }, {
      begin: 1620763200591,
      count: 0,
      end: 1620766800591
    }, {
      begin: 1620759600591,
      count: 0,
      end: 1620763200591
    }, {
      begin: 1620756000591,
      count: 0,
      end: 1620759600591
    }, {
      begin: 1620752400591,
      count: 0,
      end: 1620756000591
    }, {
      begin: 1620748800591,
      count: 0,
      end: 1620752400591
    }, {
      begin: 1620745200591,
      count: 0,
      end: 1620748800591
    }, {
      begin: 1620741600591,
      count: 0,
      end: 1620745200591
    }, {
      begin: 1620738000591,
      count: 0,
      end: 1620741600591
    }, {
      begin: 1620734400591,
      count: 0,
      end: 1620738000591
    }, {
      begin: 1620730800591,
      count: 0,
      end: 1620734400591
    }, {
      begin: 1620727200591,
      count: 0,
      end: 1620730800591
    }, {
      begin: 1620723600591,
      count: 0,
      end: 1620727200591
    }, {
      begin: 1620720000591,
      count: 0,
      end: 1620723600591
    }, {
      begin: 1620716400591,
      count: 0,
      end: 1620720000591
    }, {
      begin: 1620712800591,
      count: 0,
      end: 1620716400591
    }, {
      begin: 1620709200591,
      count: 0,
      end: 1620712800591
    }, {
      begin: 1620705600591,
      count: 0,
      end: 1620709200591
    }, {
      begin: 1620702000591,
      count: 0,
      end: 1620705600591
    }, {
      begin: 1620698400591,
      count: 0,
      end: 1620702000591
    }, {
      begin: 1620694800591,
      count: 0,
      end: 1620698400591
    }, {
      begin: 1620691200591,
      count: 0,
      end: 1620694800591
    }, {
      begin: 1620687600591,
      count: 0,
      end: 1620691200591
    }, {
      begin: 1620684000591,
      count: 0,
      end: 1620687600591
    }, {
      begin: 1620680400591,
      count: 0,
      end: 1620684000591
    }, {
      begin: 1620676800591,
      count: 0,
      end: 1620680400591
    }, {
      begin: 1620673200591,
      count: 0,
      end: 1620676800591
    }, {
      begin: 1620669600591,
      count: 0,
      end: 1620673200591
    }, {
      begin: 1620666000591,
      count: 0,
      end: 1620669600591
    }, {
      begin: 1620662400591,
      count: 0,
      end: 1620666000591
    }, {
      begin: 1620658800591,
      count: 0,
      end: 1620662400591
    }, {
      begin: 1620655200591,
      count: 0,
      end: 1620658800591
    }, {
      begin: 1620651600591,
      count: 0,
      end: 1620655200591
    }, {
      begin: 1620648000591,
      count: 0,
      end: 1620651600591
    }, {
      begin: 1620644400591,
      count: 0,
      end: 1620648000591
    }, {
      begin: 1620640800591,
      count: 0,
      end: 1620644400591
    }, {
      begin: 1620637200591,
      count: 0,
      end: 1620640800591
    }, {
      begin: 1620633600591,
      count: 0,
      end: 1620637200591
    }, {
      begin: 1620630000591,
      count: 0,
      end: 1620633600591
    }, {
      begin: 1620626400591,
      count: 0,
      end: 1620630000591
    }, {
      begin: 1620622800591,
      count: 0,
      end: 1620626400591
    }, {
      begin: 1620619200591,
      count: 0,
      end: 1620622800591
    }, {
      begin: 1620615600591,
      count: 0,
      end: 1620619200591
    }, {
      begin: 1620612000591,
      count: 0,
      end: 1620615600591
    }, {
      begin: 1620608400591,
      count: 0,
      end: 1620612000591
    }, {
      begin: 1620604800591,
      count: 0,
      end: 1620608400591
    }, {
      begin: 1620601200591,
      count: 0,
      end: 1620604800591
    }, {
      begin: 1620597600591,
      count: 0,
      end: 1620601200591
    }, {
      begin: 1620594000591,
      count: 0,
      end: 1620597600591
    }, {
      begin: 1620590400591,
      count: 0,
      end: 1620594000591
    }, {
      begin: 1620586800591,
      count: 0,
      end: 1620590400591
    }, {
      begin: 1620583200591,
      count: 0,
      end: 1620586800591
    }, {
      begin: 1620579600591,
      count: 0,
      end: 1620583200591
    }, {
      begin: 1620576000591,
      count: 0,
      end: 1620579600591
    }, {
      begin: 1620572400591,
      count: 0,
      end: 1620576000591
    }, {
      begin: 1620568800591,
      count: 0,
      end: 1620572400591
    }, {
      begin: 1620565200591,
      count: 0,
      end: 1620568800591
    }, {
      begin: 1620561600591,
      count: 0,
      end: 1620565200591
    }, {
      begin: 1620558000591,
      count: 0,
      end: 1620561600591
    }, {
      begin: 1620554400591,
      count: 0,
      end: 1620558000591
    }, {
      begin: 1620550800591,
      count: 0,
      end: 1620554400591
    }],
    filterIds: [-1012396092],
    statName: '3.1.2-zml-0428-1930990771'
  };
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    statData = _useState2[0],
    setStatData = _useState2[1];
  useEffect(function () {
    getAlarmStat && getAlarmStat(function (result) {
      setStatData(result);
    });
    var formatData = datas.eventTimeRange.map(function (item) {
      return _objectSpread(_objectSpread({}, item), {}, {
        date: dayjs(item.begin).format('YYYY-MM-DD HH-mm-ss')
      });
    });
    setStatData(formatData);
    return function () {};
  }, []);
  var warningValue = 3;
  var colors = ['#FF8060', '#6BA8FF'];
  var getDataRange = function getDataRange(data, field) {
    var values = data.reduce(function (pre, item) {
      if (item[field]) {
        pre.push(item[field]);
      }
      return pre;
    }, []);
    var minValue = Math.min.apply(Math, _toConsumableArray(values));
    var maxValue = Math.max.apply(Math, _toConsumableArray(values));
    return [minValue, maxValue];
  };
  return /*#__PURE__*/React.createElement(Modal, {
    title: "\u8BE6\u60C5",
    visible: visible,
    layout: "horizontal",
    onCancel: onCancel,
    className: "alarm-window-alarm-text",
    getContainer: getContainer,
    width: 740
  }, /*#__PURE__*/React.createElement(Chart, {
    appendPadding: [20, 20, 20, 20],
    height: '50vh',
    autoFit: true,
    data: statData
    // scale={scale}
  }, /*#__PURE__*/React.createElement(Tooltip, {
    showCrosshairs: true
  }), /*#__PURE__*/React.createElement(Axis, {
    name: "count"
  }), /*#__PURE__*/React.createElement(Geom, {
    type: "line",
    position: "date*count",
    style: {
      lineJoin: 'round'
    }
  }), /*#__PURE__*/React.createElement(Annotation.RegionFilter, {
    start: ['min', warningValue],
    end: ['max', getDataRange(statData, 'count')[1]],
    color: colors[0]
  }), /*#__PURE__*/React.createElement(Annotation.Line, {
    start: ['min', warningValue],
    end: ['max', warningValue],
    text: {
      /** 文本位置，除了制定 'start', 'center' 和 'end' 外，还可以使用百分比进行定位， 比如 '30%' */
      position: 'end',
      /** 显示的文本内容 */
      content: "\u57FA\u51C6\u7EBF ".concat(warningValue),
      offsetX: -30,
      offsetY: -5,
      style: {
        fill: colors[0]
      }
    },
    style: {
      lineDash: [2, 4],
      stroke: colors[0]
    }
  })));
};
export default StatChart;