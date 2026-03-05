function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { Fragment, useState, useEffect } from 'react';
import { Input, Button, Form } from 'oss-ui';
import Common from '../../../common';
import serviceConfig from '../../../hox';
import { getRecordDetail } from '../../../alarm-window/common/dataHandler';
var Index = function Index(props) {
  var alarmClickTarget = props.alarmClickTarget,
    onClose = props.onClose,
    shareActions = props.shareActions,
    getRecordsDetail = props.getRecordsDetail;
  var _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    context = _useState2[0],
    setContext = _useState2[1];
  var _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    passId = _useState4[0],
    setPassId = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    alarmDetail = _useState6[0],
    setAlarmDetail = _useState6[1];
  var getAlarmAdvice = function getAlarmAdvice(targetDetail) {
    var _targetDetail$profess, _targetDetail$eqp_obj, _targetDetail$title_t, _targetDetail$vendor_, _targetDetail$provinc, _serviceConfig$data, _serviceConfig$data$s, _serviceConfig$data$s2;
    var data = {
      netWorkTop: (_targetDetail$profess = targetDetail.professional_type) === null || _targetDetail$profess === void 0 ? void 0 : _targetDetail$profess.value,
      objectClass: (_targetDetail$eqp_obj = targetDetail.eqp_object_class) === null || _targetDetail$eqp_obj === void 0 ? void 0 : _targetDetail$eqp_obj.value,
      alarmTitle: (_targetDetail$title_t = targetDetail.title_text) === null || _targetDetail$title_t === void 0 ? void 0 : _targetDetail$title_t.value,
      vendorId: (_targetDetail$vendor_ = targetDetail.vendor_id) === null || _targetDetail$vendor_ === void 0 ? void 0 : _targetDetail$vendor_.value,
      alarmProvinceId: targetDetail === null || targetDetail === void 0 ? void 0 : (_targetDetail$provinc = targetDetail.province_id) === null || _targetDetail$provinc === void 0 ? void 0 : _targetDetail$provinc.value,
      provinceId: serviceConfig === null || serviceConfig === void 0 ? void 0 : (_serviceConfig$data = serviceConfig.data) === null || _serviceConfig$data === void 0 ? void 0 : (_serviceConfig$data$s = _serviceConfig$data.serviceConfig) === null || _serviceConfig$data$s === void 0 ? void 0 : (_serviceConfig$data$s2 = _serviceConfig$data$s.userInfo) === null || _serviceConfig$data$s2 === void 0 ? void 0 : _serviceConfig$data$s2.zoneId,
      pageSize: 99999,
      pageNum: 1
    };
    Common.request(null, {
      fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.experienceUrl, "v1/alarmAdvice"),
      type: 'get',
      data: data,
      // 是否需要显示失败消息提醒
      showErrorMessage: false
    }).then(function (res) {
      if (res && res.resourceList && res.resourceList.length) {
        if (res.resourceList.length === 1) {
          setPassId(res.resourceList[0].id);
        }
        setContext(res.resourceList.map(function (item) {
          return item.alarmAdvice;
        }).join('\n'));
      } else {
        setContext('暂无相关经验，该告警的维护经验在积累中，可点击经验库管理及时补充到经验库中!');
      }
    }).catch(function () {});
  };
  useEffect(function () {
    if (getRecordsDetail) {
      getRecordsDetail([alarmClickTarget], function (res) {
        var recordsDetail = getRecordDetail(res);
        var detail = recordsDetail.find(function (item) {
          var _item$alarm_id, _alarmClickTarget$ala;
          return ((_item$alarm_id = item.alarm_id) === null || _item$alarm_id === void 0 ? void 0 : _item$alarm_id.value) === ((_alarmClickTarget$ala = alarmClickTarget.alarm_id) === null || _alarmClickTarget$ala === void 0 ? void 0 : _alarmClickTarget$ala.value);
        });
        console.log(detail, '==detail');
        if (recordsDetail && recordsDetail.length && detail) {
          setAlarmDetail(detail);
          getAlarmAdvice(detail);
        } else {
          getAlarmAdvice(alarmClickTarget);
        }
      });
    }
    return function () {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  var jumpToManagePage = function jumpToManagePage() {
    var _alarmDetail$professi, _alarmDetail$eqp_obje, _alarmDetail$title_te, _alarmDetail$province, _alarmDetail$vendor_i;
    var actions = shareActions.actions,
      messageTypes = shareActions.messageTypes;
    var netWorkTop = alarmDetail === null || alarmDetail === void 0 ? void 0 : (_alarmDetail$professi = alarmDetail.professional_type) === null || _alarmDetail$professi === void 0 ? void 0 : _alarmDetail$professi.value;
    var objectClass = alarmDetail === null || alarmDetail === void 0 ? void 0 : (_alarmDetail$eqp_obje = alarmDetail.eqp_object_class) === null || _alarmDetail$eqp_obje === void 0 ? void 0 : _alarmDetail$eqp_obje.value;
    var alarmTitle = alarmDetail === null || alarmDetail === void 0 ? void 0 : (_alarmDetail$title_te = alarmDetail.title_text) === null || _alarmDetail$title_te === void 0 ? void 0 : _alarmDetail$title_te.value;
    var provinceId = alarmDetail === null || alarmDetail === void 0 ? void 0 : (_alarmDetail$province = alarmDetail.province_id) === null || _alarmDetail$province === void 0 ? void 0 : _alarmDetail$province.value;
    var vendorId = alarmDetail === null || alarmDetail === void 0 ? void 0 : (_alarmDetail$vendor_i = alarmDetail.vendor_id) === null || _alarmDetail$vendor_i === void 0 ? void 0 : _alarmDetail$vendor_i.value;
    var alarmAdvice = context.indexOf('暂无相关经验') > -1 ? '' : context.replace(/[\r\n]+/g, "_-_");
    console.log(alarmDetail, '==detail', alarmAdvice);
    if (actions && actions.postMessage) {
      actions.postMessage(messageTypes.closeTabs, {
        entry: props.experienceUrl || '/unicom/setting/experiences'
      });
      var timer = setTimeout(function () {
        clearTimeout(timer);
        actions.postMessage(messageTypes.openRoute, {
          entry: props.experienceUrl || '/unicom/setting/experiences',
          extraContent: {
            search: {
              provinceId: provinceId,
              netWorkTop: netWorkTop,
              objectClass: objectClass,
              vendorId: vendorId,
              alarmTitle: alarmTitle,
              alarmAdvice: alarmAdvice,
              id: passId
            }
          }
        });
      }, 500);
    } else {
      window.open("/setting/experiences?provinceId=".concat(provinceId, "&netWorkTop=").concat(netWorkTop, "&objectClass=").concat(objectClass, "&alarmTitle=").concat(encodeURIComponent(encodeURIComponent(alarmTitle)), "&vendorId=").concat(vendorId));
    }
    onClose();
  };
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontWeight: 'bold'
    }
  }, "\u7ECF\u9A8C\u5E93"), /*#__PURE__*/React.createElement(Form.Item, null, /*#__PURE__*/React.createElement(Input.TextArea, {
    disabled: true,
    rows: 4,
    value: context
  })), /*#__PURE__*/React.createElement(Form.Item, null, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    onClick: jumpToManagePage
  }, "\u7ECF\u9A8C\u5E93\u7BA1\u7406")));
};
export default Index;