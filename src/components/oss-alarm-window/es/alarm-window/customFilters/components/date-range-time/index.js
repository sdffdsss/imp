function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useEffect } from 'react';
import { DatePicker, message } from 'oss-ui';
// import dayjs from 'dayjs';
import dayjs from 'dayjs';
import _cloneDeep from 'lodash/cloneDeep';
var DateRangeTime = function DateRangeTime(props) {
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    value = _useState2[0],
    setValue = _useState2[1];
  // useEffect(()=>{
  //     if(props.defaultValue){

  //     }
  useEffect(function () {
    if (props.value) {
      var momentList = [];
      if (props.value[0]) {
        if (props.value[0] >= props.value[1] || !props.value[1]) {
          // console.log(dayjs(props.value[0]).subtract(1, 'days').endOf('day'));
          // if (props.value[1]) {
          if (props.showTime) {
            if (props.value[1]) {
              momentList = [null, dayjs(props.value[1])];
              setValue(momentList);
            }
          } else {
            if (props.value[1]) {
              var valueStart = dayjs(props.value[0]).format('YYYY-MM-DD');
              var valueEnd = dayjs(props.value[1]).format('YYYY-MM-DD');
              if (dayjs(valueStart).diff(dayjs(valueEnd), 'day') === 0) {
                momentList = [dayjs(props.value[0]), dayjs(props.value[1])];
                setValue(momentList);
              } else {
                momentList = [];
                setValue(momentList);
              }
            } else {
              momentList = [dayjs(props.value[0]), null];
              setValue(momentList);
            }
          }

          // } else {
          //     setValue([dayjs(props.value[0]), null]);
          // }
        } else if (props.value[0] && props.value[1] && props.value[0] < props.value[1]) {
          momentList = [dayjs(props.value[0]), dayjs(props.value[1])];
          setValue(momentList);
        }
      } else {
        if (props.value[1]) {
          momentList = [null, dayjs(props.value[1])];
          setValue(momentList);
        } else {
          setValue([]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);
  var dateChange = function dateChange(index, date) {
    var valueList = value;
    valueList[index] = date;
    if (props.showTime) {
      if (index === 1 && valueList[0] >= valueList[1]) {
        message.error('结束时间不能小于开始时间');
        valueList[1] = null;
      }
      if (index === 0 && valueList[1] && valueList[0] >= valueList[1]) {
        message.error('结束时间不能小于开始时间');
        valueList[0] = null;
      }
    } else {
      if (index === 1 && valueList[0] > valueList[1]) {
        message.error('结束日期不能小于开始日期');
        valueList[1] = null;
      }
      var valueStart = dayjs(valueList[0]).format('YYYY-MM-DD');
      var valueEnd = dayjs(valueList[1]).format('YYYY-MM-DD');
      if (index === 0 && valueList[1] && dayjs(valueStart).diff(dayjs(valueEnd), 'day') > 0) {
        message.error('结束日期不能小于开始日期');
        valueList[0] = null;
      }
    }
    var list = _cloneDeep(valueList);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.onChange && props.onChange(list);
  };
  var disabledDate = function disabledDate(current) {
    // Can not select days before today and today
    return current && current < dayjs(value[0]).subtract(1, 'days').endOf('day');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexFlow: 'nowrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(DatePicker, {
    value: value[0],
    onChange: function onChange() {
      for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
        rest[_key] = arguments[_key];
      }
      return dateChange.apply(void 0, [0].concat(rest));
    },
    format: props.format ? props.format : 'YYYY-MM-DD',
    showTime: props.showTime ? props.showTime : false,
    disabledDate: props.disabledDate ? props.disabledDate : function () {
      return false;
    },
    locale: props.locale,
    getPopupContainer: function getPopupContainer(trigger) {
      return trigger.parentElement;
    }
  }), ' ', "-", ' ', /*#__PURE__*/React.createElement(DatePicker, {
    value: value[1],
    onChange: function onChange() {
      for (var _len2 = arguments.length, rest = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        rest[_key2] = arguments[_key2];
      }
      return dateChange.apply(void 0, [1].concat(rest));
    },
    disabledDate: props.disabledDate ? function (current) {
      return props.disabledDate(current, disabledDate);
    } : disabledDate,
    locale: props.locale,
    showNow: false,
    allowClear: false,
    format: props.format ? props.format : 'YYYY-MM-DD',
    showTime: props.showTime ? props.showTime : false,
    getPopupContainer: function getPopupContainer(trigger) {
      return trigger.parentElement;
    }
  }));
};
export default DateRangeTime;