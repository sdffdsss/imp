function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Select, Tag, Form, Card, message } from 'oss-ui';
import SmsTemplate from './sms-edit';
// import request from '@Common/api';
import { _ } from 'oss-web-toolkits';
import { smsTemplateShow } from '../../../alarm-window/alarm-show-config';
import serviceConfig from '../../../hox';
import Common from '../../../common';
import "./index.css";
var Component = function Component(props) {
  var menuComponentFormRef = props.menuComponentFormRef,
    record = props.record,
    modalContainer = props.modalContainer,
    type = props.type,
    userInfo = props.userInfo;
  var smsMsg = {
    sms: '短信',
    ivr: '语音'
  };
  var initialSms = "\u3010\u7EFC\u5408\u76D1\u63A7".concat(smsMsg[type], "\u901A\u77E5\u3011\uFF0C").concat(smsTemplateShow.map(function (item) {
    var _record$0$item$fieldN;
    return "".concat(item.label, "\uFF1A").concat((_record$0$item$fieldN = record[0][item.fieldName]) === null || _record$0$item$fieldN === void 0 ? void 0 : _record$0$item$fieldN.value);
  }).join('，'), "\n");
  var smsTitles = {
    sms: '短信正文：',
    ivr: 'IVR正文：'
  };
  var userTitles = {
    sms: '短信接收人员：',
    ivr: 'IVR呼叫人员：'
  };
  var phoneTitles = {
    sms: '接收人员',
    ivr: '呼叫人员'
  };
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    showEdit = _useState2[0],
    setEditVisible = _useState2[1];
  var smsContext = useRef('');
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    userGroupList = _useState4[0],
    setUserGroupList = _useState4[1];
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    selectUserList = _useState6[0],
    setSelectUserList = _useState6[1];
  var _useState7 = useState(smsTemplateShow.map(function (item) {
      return item.fieldName;
    })),
    _useState8 = _slicedToArray(_useState7, 2),
    selectedFields = _useState8[0],
    setSelectedFields = _useState8[1];
  useEffect(function () {
    smsContext.current = initialSms;
    menuComponentFormRef.current.setFieldsValue({
      sms: initialSms,
      type: 'IVR',
      reason: '',
      userList: '',
      phoneList: ''
    });
    getUserGroupList();
    return function () {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  var handleSaveSms = function handleSaveSms(values) {
    var str = "\u3010\u7EFC\u5408\u76D1\u63A7".concat(smsMsg[type], "\u901A\u77E5\u3011\uFF0C");
    if (values.content) {
      var fileds = values.content.split('>').slice(0, -1).map(function (fieldItem) {
        return {
          displayName: fieldItem.split(':')[0],
          storeFieldName: fieldItem.split(':')[1].slice(1)
        };
      });
      _.forEach(fileds, function (element, index) {
        var _record$0$element$sto, _record$0$element$sto2;
        str += "".concat(element.displayName, "\uFF1A").concat(((_record$0$element$sto = record[0][element.storeFieldName]) === null || _record$0$element$sto === void 0 ? void 0 : _record$0$element$sto.lable) || ((_record$0$element$sto2 = record[0][element.storeFieldName]) === null || _record$0$element$sto2 === void 0 ? void 0 : _record$0$element$sto2.value) || '').concat(index !== 2 && ',');
      });
    }
    smsContext.current = str;
    menuComponentFormRef.current.setFieldsValue({
      sms: str
    });
    setEditVisible(false);
  };
  var handleCancel = function handleCancel() {
    setEditVisible(false);
  };
  var onVisibleChange = function onVisibleChange(visible, values, rowClickId) {
    if (values) {
      handleSaveSms(values);
      setSelectedFields(rowClickId);
    } else {
      handleCancel();
    }
  };
  var smsChange = function smsChange(e) {
    smsContext.current = e.target.value;
    menuComponentFormRef.current.setFieldsValue({
      sms: e.target.value
    });
  };
  var onSelectGroupChange = function onSelectGroupChange(value) {
    getUsersByGroupId(value);
  };
  var onUserRemove = function onUserRemove(userId, e) {
    e.preventDefault();
    var selectUsers = selectUserList.filter(function (user) {
      return user.userId !== userId;
    });
    setSelectUserList(selectUsers);
    menuComponentFormRef.current.setFieldsValue({
      userList: selectUsers.map(function (s) {
        return s.userId;
      }).join(',')
    });
  };
  var phoneListChange = function phoneListChange(e) {
    menuComponentFormRef.current.setFieldsValue({
      phoneList: e.target.value
    });
  };

  //获取用户组
  var getUserGroupList = function getUserGroupList() {
    Common.request(null, {
      fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.filterUrl, "alarmmodel/filter/v1/filter/usergroup"),
      type: 'get',
      showSuccessMessage: false,
      data: {
        userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId,
        clientRequestInfo: JSON.stringify({
          clientRequestId: 'nomean',
          clientToken: localStorage.getItem('access_token')
        })
      }
    }).then(function (res) {
      if (res && res.data) {
        var list = res.data.map(function (item) {
          return {
            label: item.groupName,
            value: item.groupId
          };
        });
        setUserGroupList(list);
      }
    });
  };
  //获取用户组用户
  var getUsersByGroupId = function getUsersByGroupId(groupId) {
    Common.request(null, {
      fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.filterUrl, "alarmmodel/filter/v1/filter/userinfo"),
      type: 'get',
      showSuccessMessage: false,
      data: {
        groupId: groupId,
        clientRequestInfo: JSON.stringify({
          clientRequestId: 'nomean',
          clientToken: localStorage.getItem('access_token')
        })
      }
    }).then(function (res) {
      if (res && res.data && res.data.length) {
        var selectUsers = _.uniqBy([].concat(_toConsumableArray(selectUserList), _toConsumableArray(res.data)), 'userId');
        setSelectUserList(selectUsers);
        menuComponentFormRef.current.setFieldsValue({
          userList: selectUsers.map(function (s) {
            return s.userId;
          }).join(',')
        });
      }
    });
  };
  return /*#__PURE__*/React.createElement(Form, {
    ref: menuComponentFormRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "alarm-sms-distribution-message"
  }, /*#__PURE__*/React.createElement("span", null, smsTitles[type]), /*#__PURE__*/React.createElement(Button, {
    className: "alarm-sms-distribution-edit",
    size: "small",
    onClick: function onClick() {
      setEditVisible(true);
    }
  }, "\u7F16\u8F91")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Item, {
    name: "sms",
    onChange: smsChange,
    rules: [{
      required: true,
      message: '请输入短信内容！'
    }, {
      whitespace: true,
      message: '请输入短信内容！'
    }]
  }, /*#__PURE__*/React.createElement(Input.TextArea, {
    autoSize: {
      minRows: 4,
      maxRows: 6
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "alarm-sms-distribution-user-select"
  }, /*#__PURE__*/React.createElement("span", null, "\u7528\u6237\u7EC4\u9009\u62E9\uFF1A"), /*#__PURE__*/React.createElement(Form.Item, {
    style: {
      width: '30%'
    }
  }, /*#__PURE__*/React.createElement(Select, {
    size: "small",
    defaultValue: -999999,
    onChange: onSelectGroupChange,
    showSearch: true,
    optionFilterProp: "children"
  }, /*#__PURE__*/React.createElement(Select.Option, {
    key: -999999,
    value: -999999
  }, "\u8BF7\u9009\u62E9\u7528\u6237\u7EC4"), userGroupList.map(function (item) {
    return /*#__PURE__*/React.createElement(Select.Option, {
      key: item.value,
      value: item.value
    }, item.label);
  })))), /*#__PURE__*/React.createElement("div", {
    className: "alarm-sms-distribution-user-tag"
  }, /*#__PURE__*/React.createElement("span", null, userTitles[type]), /*#__PURE__*/React.createElement("div", {
    className: "alarm-sms-distribution-user-tag-dom"
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "userList"
  }, /*#__PURE__*/React.createElement(Card, {
    bordered: true,
    bodyStyle: {
      padding: '16px',
      minHeight: '30px',
      overflowY: 'auto'
    }
  }, selectUserList.map(function (user) {
    return /*#__PURE__*/React.createElement(Tag, {
      closable: true,
      color: "#2db7f5",
      onClose: _.partial(onUserRemove, user.userId)
    }, user.userName);
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "alarm-sms-distribution-user-input"
  }, /*#__PURE__*/React.createElement("span", null, "\u624B\u52A8\u8F93\u5165".concat(phoneTitles[type], "\uFF1A\uFF08\u8F93\u5165\u624B\u673A\u53F7\uFF0C\u7528\u9017\u53F7\u5206\u5272\uFF09")), /*#__PURE__*/React.createElement("div", {
    className: "alarm-sms-distribution-user-input-dom"
  }, /*#__PURE__*/React.createElement(Form.Item, {
    onChange: phoneListChange,
    name: "phoneList",
    rules: [{
      validator: function () {
        var _validator = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(rule, val, callback) {
          var reg, reg2;
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                reg = new RegExp('^0?1[3456789][0-9]{9}(,0?1[3456789][0-9]{9})*$');
                reg2 = new RegExp('0?1[3456789][0-9]{9}，');
                if (!(val && reg2.test(val))) {
                  _context.n = 1;
                  break;
                }
                throw new Error('请输入英文逗号分隔！');
              case 1:
                if (!(val && !reg.test(val))) {
                  _context.n = 2;
                  break;
                }
                throw new Error('请输入正确的手机号码！');
              case 2:
                callback();
              case 3:
                return _context.a(2);
            }
          }, _callee);
        }));
        function validator(_x, _x2, _x3) {
          return _validator.apply(this, arguments);
        }
        return validator;
      }()
    }]
  }, /*#__PURE__*/React.createElement(Input.TextArea, null)), /*#__PURE__*/React.createElement(Form.Item, {
    name: "validator",
    rules: [{
      validator: function validator(rule, val, callback) {
        if (!menuComponentFormRef.current.getFieldValue('phoneList') && !menuComponentFormRef.current.getFieldValue('userList')) {
          message.warning('用户组选择和手工短信接收人必选其一！');
          callback('');
        } else {
          callback();
        }
      }
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    type: "hidden"
  })))), showEdit && /*#__PURE__*/React.createElement(SmsTemplate, {
    modalContainer: modalContainer
    // smsTemplateList={smsTemplateList}
    ,
    selectedFields: selectedFields,
    type: "alarmRightClick",
    visible: showEdit,
    onVisibleChange: onVisibleChange
  }));
};
export default Component;