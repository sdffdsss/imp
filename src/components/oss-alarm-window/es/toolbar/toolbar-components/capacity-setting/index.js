function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React from 'react';
import { Form, InputNumber } from 'oss-ui';
var Setting = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var onToolDateChange = props.onToolDateChange,
    maxAlarmSize = props.maxAlarmSize,
    winType = props.winType,
    eventListener = props.eventListener;
  var _Form$useForm = Form.useForm(),
    _Form$useForm2 = _slicedToArray(_Form$useForm, 1),
    form = _Form$useForm2[0];
  var winTypeList = {
    active: 'activeMaxAlarmSize',
    confirm: 'ackMaxAlarmSize',
    clear: 'clearMaxAlarmSize',
    cleardAck: 'clearAckMaxAlarmSize'
  };
  var onFinish = function onFinish(value) {
    eventListener.setCapacityRequest(value.capacity);
    onToolDateChange(value);
  };
  return /*#__PURE__*/React.createElement(Form, {
    style: {
      paddingBottom: '10px',
      paddingTop: '25px'
    },
    ref: ref,
    form: form,
    name: "form_in_modal",
    initialValues: {
      capacity: maxAlarmSize[winTypeList[winType]]
    },
    onFinish: onFinish
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "capacity",
    label: "\u544A\u8B66\u5BB9\u91CF",
    rules: [{
      type: 'number',
      min: 0,
      max: 100000,
      required: true,
      message: '告警容量必填，且要在0-100000范围内'
    }]
  }, /*#__PURE__*/React.createElement(InputNumber, {
    style: {
      width: '180px'
    },
    precision: 0
  })));
});
export default Setting;