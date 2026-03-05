function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import React, { useRef } from 'react';
import { Modal, ConfigProvider, Spin, message, Icon } from 'oss-ui';
import CustomModalFooter from '../../../toolbar/custom-modal-footer';
import { setRightClickData, getRecordDetail } from '../../../alarm-window/common/dataHandler';
import { _ } from 'oss-web-toolkits';
import Common from '../../../common';
import serviceConfig from '../../../hox';
var MenuCompModal = function MenuCompModal(props) {
  var menu = props.menu,
    getRecordsDetail = props.getRecordsDetail,
    actionRecords = props.actionRecords,
    frameInfo = props.frameInfo,
    _onCancel = props.onCancel,
    useCol = props.useCol,
    alarmClickTarget = props.alarmClickTarget,
    customAction = props.customAction,
    extendEventMap = props.extendEventMap,
    shareActions = props.shareActions,
    exportHtmlType = props.exportHtmlType,
    loading = props.loading,
    experienceUrl = props.experienceUrl;
  var menuComponentFormRef = useRef();
  var modalContainer = (frameInfo === null || frameInfo === void 0 ? void 0 : frameInfo.container) || document.body;
  var getActionRecords = function getActionRecords(records, selectedAlarms, actionRecords) {
    var result = records || selectedAlarms || actionRecords;
    return result;
  };
  var getNewRecords = function getNewRecords(item, arr) {
    var newArr = _.cloneDeep(arr);
    var index = _.indexOf(arr, item);
    _.pullAt(newArr, index);
    newArr.unshift(item);
    return newArr;
  };
  var _onOk = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(isPass) {
      var formRef, formRes, records, recordAlarmIdList, recordAlarmDetailList, recordAlarmStandardIdList, param, fullUrl, clearStatusList, nextRecords, batchOperate, res;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            formRef = _.cloneDeep(menuComponentFormRef);
            _context.n = 1;
            return formRef.current.validateFields();
          case 1:
            formRes = _context.v;
            records = null;
            console.log(menu.key, '===', actionRecords, serviceConfig.data.serviceConfig.otherService);
            if (!(menu.key === 'ManualDispatchUnicom' || menu.key === 'Supervise')) {
              _context.n = 10;
              break;
            }
            recordAlarmIdList = [];
            recordAlarmDetailList = [];
            recordAlarmStandardIdList = [];
            actionRecords.forEach(function (i) {
              recordAlarmIdList.push(i.alarm_id.value);
              recordAlarmStandardIdList.push(i.standard_alarm_id.value);
            });
            param = recordAlarmStandardIdList;
            fullUrl = "".concat(serviceConfig.data.serviceConfig.otherService.alarmFilterUrl, "alarm/detail/v1/alarms");
            if (serviceConfig.data.sessionId) {
              param = {
                alarmIdList: recordAlarmIdList,
                sessionId: serviceConfig.data.sessionId
              };
              fullUrl = "".concat(serviceConfig.data.serviceConfig.otherService.viewItemUrl, "flow/alarm-detail");
            }
            _context.n = 2;
            return Common.request(null, {
              fullUrl: fullUrl,
              type: 'post',
              showSuccessMessage: false,
              showErrorMessage: true,
              defaultErrorMessage: '获取数据失败',
              data: param
            }).then(function (result) {
              if (serviceConfig.data.sessionId) {
                result.forEach(function (i) {
                  recordAlarmDetailList.push(i.alarmFieldList);
                });
              } else {
                result.data.forEach(function (i, ind) {
                  recordAlarmDetailList.push(i[recordAlarmStandardIdList[ind]]);
                });
              }
            });
          case 2:
            if (!(actionRecords.length > 1)) {
              _context.n = 8;
              break;
            }
            clearStatusList = [];
            console.log(recordAlarmDetailList, '=');
            recordAlarmDetailList.forEach(function (i) {
              var _$find;
              var value = (_$find = _.find(i, {
                field: 'active_status'
              })) === null || _$find === void 0 ? void 0 : _$find.value;
              if (value != 1) {
                var _$find2;
                clearStatusList.push((_$find2 = _.find(i, {
                  field: 'alarm_id'
                })) === null || _$find2 === void 0 ? void 0 : _$find2.value);
              }
            });
            if (!(clearStatusList.length > 0 && isPass !== 'pass')) {
              _context.n = 3;
              break;
            }
            Modal.confirm({
              title: '提示',
              content: "\u6709".concat(clearStatusList.length, "\u6761\u544A\u8B66\u5DF2\u6E05\u9664\uFF0C\u624B\u5DE5\u6D3E\u5355\u4F1A\u5C06").concat(clearStatusList.length, "\u6761\u544A\u8B66\u53BB\u9664\uFF0C\u662F\u5426\u7EE7\u7EED\uFF1F"),
              icon: /*#__PURE__*/React.createElement(Icon, {
                antdIcon: true,
                type: "ExclamationCircleOutlined"
              }),
              okText: '确定',
              cancelText: '取消',
              onOk: function onOk() {
                _onOk('pass');
              },
              onCancel: function onCancel() {
                _onCancel();
              }
            });
            return _context.a(2);
          case 3:
            if (formRef.current.getFieldValue('hostAlarm')) {
              _context.n = 4;
              break;
            }
            message.error('未选择主告警');
            return _context.a(2);
          case 4:
            if (!_.includes(clearStatusList, formRef.current.getFieldValue('hostAlarm')[0].alarm_id.value)) {
              _context.n = 5;
              break;
            }
            message.error('选择的主告警已清除，请重新选择');
            return _context.a(2);
          case 5:
            nextRecords = [];
            actionRecords.forEach(function (i) {
              if (!_.includes(clearStatusList, i.alarm_id.value)) {
                nextRecords.push(i);
              }
            });
            if (!(nextRecords.length != 0)) {
              _context.n = 6;
              break;
            }
            records = getNewRecords(formRef.current.getFieldValue('hostAlarm')[0], nextRecords);
            _context.n = 7;
            break;
          case 6:
            message.error('已选择告警全部变为清除告警，请重新选择');
            return _context.a(2);
          case 7:
            _context.n = 10;
            break;
          case 8:
            if (!(_.find(recordAlarmDetailList[0], {
              field: 'active_status'
            }).value != 1)) {
              _context.n = 9;
              break;
            }
            message.error('告警已清除，派单失败');
            return _context.a(2);
          case 9:
            records = getNewRecords(actionRecords[0], actionRecords);
          case 10:
            batchOperate = function batchOperate(selectedAlarms) {
              if (formRes && menu.pageType === 'form' || menu.pageType === 'export') {
                getRecordsDetail(actionRecords, function (res) {
                  var recordsDetail = getRecordDetail(res);
                  var data = setRightClickData({
                    actionRecords: getActionRecords(records, selectedAlarms, actionRecords),
                    menu: menu,
                    recordsDetail: recordsDetail,
                    frameInfo: frameInfo,
                    formRef: formRef
                  });
                  if (extendEventMap && extendEventMap[menu.key]) {
                    extendEventMap[menu.key]({
                      data: data,
                      actionRecords: actionRecords,
                      menu: menu,
                      onCancel: _onCancel,
                      recordsDetail: recordsDetail
                    });
                    if (!menu.preventModalCloseOnFailure) {
                      _onCancel();
                    }
                    return;
                  }
                  menu.action && menu.action({
                    recordsDetail: recordsDetail,
                    customAction: customAction,
                    data: data,
                    actionRecords: actionRecords,
                    menu: menu,
                    onCancel: _onCancel
                  });
                  if (!menu.preventModalCloseOnFailure) {
                    _onCancel();
                  }
                });
              }
            };
            if (!formRef.current.extendValidFunc) {
              _context.n = 12;
              break;
            }
            _context.n = 11;
            return formRef.current.extendValidFunc();
          case 11:
            res = _context.v;
            if (res) {
              _context.n = 12;
              break;
            }
            return _context.a(2);
          case 12:
            if (formRef.current.alarmFilterFunc) {
              formRef.current.alarmFilterFunc(function (res) {
                if (res && res.length) {
                  batchOperate(res);
                } else {
                  return;
                }
              });
            } else {
              batchOperate();
            }
          case 13:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function onOk(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  var footer = menu.pageType === 'view' ? /*#__PURE__*/React.createElement(CustomModalFooter, {
    okText: "",
    onCancel: _onCancel,
    cancelText: '关闭'
  }) : /*#__PURE__*/React.createElement(CustomModalFooter, {
    confirmLoading: true,
    onCancel: _onCancel,
    onOk: _onOk
  });
  return /*#__PURE__*/React.createElement(Modal, {
    centered: true,
    destroyOnClose: true,
    title: menu.title || menu.name,
    visible: true,
    maskClosable: false,
    wrapClassName: "alarm-window-context-modal",
    prefixCls: "oss-ui-modal",
    okButtonProps: {
      prefixCls: 'oss-ui-btn'
    },
    cancelButtonProps: {
      prefixCls: 'oss-ui-btn'
    },
    width: menu.width || 800,
    footer: footer,
    getContainer: modalContainer,
    onCancel: _onCancel
  }, /*#__PURE__*/React.createElement(ConfigProvider, {
    prefixCls: "oss-ui"
  }, /*#__PURE__*/React.createElement(Spin, {
    spinning: loading || false
  }, /*#__PURE__*/React.createElement(menu.component, {
    userInfo: frameInfo,
    modalContainer: modalContainer,
    menuInfo: menu,
    useCol: useCol,
    menuComponentFormRef: menuComponentFormRef,
    record: actionRecords,
    alarmClickTarget: alarmClickTarget,
    onClose: _onCancel,
    shareActions: shareActions,
    exportHtmlType: exportHtmlType,
    getRecordsDetail: getRecordsDetail,
    experienceUrl: experienceUrl
  }))));
};
export default MenuCompModal;