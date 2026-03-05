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
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Form, Table, Row, Col, message } from 'oss-ui';
import SmsTemplate from './sms-edit';
import { _ } from 'oss-web-toolkits';
import { smsTemplateShow, ivrTemplateShow } from '../../../alarm-window/alarm-show-config';
import serviceConfig from '../../../hox';
import Common from '../../../common';
import { getRecordDetail } from '../../../alarm-window/common/dataHandler';
import "./index.css";
var Component = function Component(props) {
  var menuComponentFormRef = props.menuComponentFormRef,
    record = props.record,
    modalContainer = props.modalContainer,
    menuInfo = props.menuInfo,
    getRecordsDetail = props.getRecordsDetail;
  var type = props.type;
  var template = ivrTemplateShow;
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
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    loading = _useState4[0],
    setLoading = _useState4[1];
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    tableLists = _useState6[0],
    setTableLists = _useState6[1];
  var _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    searchValue = _useState8[0],
    setSearchValue = _useState8[1];
  var _useState9 = useState(template.map(function (item) {
      return item.fieldName;
    })),
    _useState0 = _slicedToArray(_useState9, 2),
    selectedFields = _useState0[0],
    setSelectedFields = _useState0[1];
  var _useState1 = useState({
      pageSize: 20,
      current: 1,
      total: 0
    }),
    _useState10 = _slicedToArray(_useState1, 2),
    pagination = _useState10[0],
    setPagination = _useState10[1];
  var _useState11 = useState([]),
    _useState12 = _slicedToArray(_useState11, 2),
    selectedRowKeys = _useState12[0],
    setSelectedRowKeys = _useState12[1];
  useEffect(function () {
    var _menuComponentFormRef2;
    getRecordsDetail(record, function (res) {
      var _menuComponentFormRef;
      var recordsDetail = getRecordDetail(res) && !_.isEmpty(getRecordDetail(res)) ? getRecordDetail(res)[0] : record[0];
      var initInfo = '您好！\n'.concat(template.map(function (item) {
        var _recordsDetail$item$f, _recordsDetail$item$f2;
        return "".concat(item.label, "\uFF1A").concat(((_recordsDetail$item$f = recordsDetail[item.fieldName]) === null || _recordsDetail$item$f === void 0 ? void 0 : _recordsDetail$item$f.value) ? (_recordsDetail$item$f2 = recordsDetail[item.fieldName]) === null || _recordsDetail$item$f2 === void 0 ? void 0 : _recordsDetail$item$f2.value : '');
      }).join('\n'), "\n\u8BF7\u5C3D\u5FEB\u5904\u7406\u3002");
      smsContext.current = initInfo;
      (_menuComponentFormRef = menuComponentFormRef.current) === null || _menuComponentFormRef === void 0 ? void 0 : _menuComponentFormRef.setFieldsValue({
        sms: initInfo
      });
    });
    (_menuComponentFormRef2 = menuComponentFormRef.current) === null || _menuComponentFormRef2 === void 0 ? void 0 : _menuComponentFormRef2.setFieldsValue({
      type: 'IVR',
      reason: '',
      userList: '',
      phoneList: '',
      IvrPhoneLists: [],
      customPhoneLists: ''
    });
    getIVRUserLists({
      paging: pagination
    });
    return function () {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(function () {
    if (menuComponentFormRef && menuComponentFormRef.current) {
      menuComponentFormRef.current.extendValidFunc = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (!(_.isEmpty(menuComponentFormRef.current.getFieldValue('IvrPhoneLists')) && !menuComponentFormRef.current.getFieldValue('customPhoneLists'))) {
                _context.n = 1;
                break;
              }
              message.warning('请选择外呼人员');
              return _context.a(2, false);
            case 1:
              return _context.a(2, true);
            case 2:
              return _context.a(2);
          }
        }, _callee);
      }));
    }
    return function () {};
  }, [menuComponentFormRef]);
  var handleSaveSms = function handleSaveSms(values) {
    var str = '您好！\n';
    var endStr = '请尽快处理。';
    if (values.content) {
      var fileds = values.content.split('>').slice(0, -1).map(function (fieldItem) {
        return {
          displayName: fieldItem.split(':')[0],
          storeFieldName: fieldItem.split(':')[1].slice(1)
        };
      });
      _.forEach(fileds, function (element) {
        var _record$0$element$sto, _record$0$element$sto2;
        str += "".concat(element.displayName, "\uFF1A").concat(((_record$0$element$sto = record[0][element.storeFieldName]) === null || _record$0$element$sto === void 0 ? void 0 : _record$0$element$sto.lable) || ((_record$0$element$sto2 = record[0][element.storeFieldName]) === null || _record$0$element$sto2 === void 0 ? void 0 : _record$0$element$sto2.value) || '', "\n");
      });
    }
    smsContext.current = str + endStr;
    menuComponentFormRef.current.setFieldsValue({
      sms: str + endStr
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
  var setPhoneLists = function setPhoneLists() {
    var IvrPhone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var customPhone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    menuComponentFormRef.current.setFieldsValue({
      phoneList: customPhone ? IvrPhone.concat(customPhone.split(',')).join(',') : IvrPhone.join(',')
    });
  };
  var phoneListChange = function phoneListChange(e) {
    menuComponentFormRef.current.setFieldsValue({
      customPhoneLists: e.target.value
    });
    setPhoneLists(menuComponentFormRef.current.getFieldsValue().IvrPhoneLists, e.target.value);
  };

  //获取Ivr通讯里
  var getIVRUserLists = function getIVRUserLists(_ref2) {
    var paging = _ref2.paging,
      phone = _ref2.phone;
    setLoading(true);
    Common.request(null, {
      fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.outboundMail, "alarmCall/v1/addressList/operation"),
      type: 'get',
      showSuccessMessage: false,
      data: {
        current: paging.current,
        pageSize: paging.pageSize,
        needAll: false,
        phone: phone
      }
    }).then(function (res) {
      if (res && !_.isEmpty(res.data) && res.code === 0) {
        setTableLists(res.data.rows.map(function (item, index) {
          return _objectSpread(_objectSpread({}, item), {}, {
            index: index + 1
          });
        }));
        setLoading(false);
        setPagination(_objectSpread(_objectSpread({}, paging), {}, {
          total: res.data.total
        }));
      }
    }).catch(function () {});
  };

  // 根据手机号搜索
  var onSearchPhone = function onSearchPhone(value) {
    setSearchValue(value);
    var paging = {
      pageSize: 20,
      current: 1,
      total: 0
    };
    getIVRUserLists({
      phone: value,
      paging: paging
    });
  };

  // 监听分页变化
  var onPageChange = function onPageChange(paging) {
    getIVRUserLists({
      paging: paging,
      phone: searchValue
    });
  };
  var onSelectChange = function onSelectChange(record, selected) {
    var _menuComponentFormRef3;
    var newSelected = selectedRowKeys;
    if (selected) {
      newSelected = _toConsumableArray(new Set(selectedRowKeys.concat(record.phone)));
    } else {
      newSelected = _toConsumableArray(new Set(_.without(selectedRowKeys, record.phone)));
    }
    menuComponentFormRef === null || menuComponentFormRef === void 0 ? void 0 : (_menuComponentFormRef3 = menuComponentFormRef.current) === null || _menuComponentFormRef3 === void 0 ? void 0 : _menuComponentFormRef3.setFieldsValue({
      IvrPhoneLists: newSelected
    });
    setPhoneLists(newSelected, menuComponentFormRef.current.getFieldsValue().customPhoneLists);
    setSelectedRowKeys(newSelected);
  };
  var onSelectAll = function onSelectAll(selected, selectedRows, changeRows) {
    var _menuComponentFormRef4;
    var newSelected = selectedRowKeys;
    if (selected) {
      newSelected = _toConsumableArray(new Set(selectedRowKeys.concat(changeRows.map(function (item) {
        return item.phone;
      }))));
    } else {
      newSelected = _toConsumableArray(new Set(_.without.apply(_, [selectedRowKeys].concat(_toConsumableArray(changeRows.map(function (item) {
        return item.phone;
      }))))));
    }
    menuComponentFormRef === null || menuComponentFormRef === void 0 ? void 0 : (_menuComponentFormRef4 = menuComponentFormRef.current) === null || _menuComponentFormRef4 === void 0 ? void 0 : _menuComponentFormRef4.setFieldsValue({
      IvrPhoneLists: newSelected
    });
    setPhoneLists(newSelected, menuComponentFormRef.current.getFieldsValue().customPhoneLists);
    setSelectedRowKeys(newSelected);
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
  }, /*#__PURE__*/React.createElement(Row, {
    style: {
      height: '39px'
    }
  }, /*#__PURE__*/React.createElement(Col, {
    span: 6
  }, /*#__PURE__*/React.createElement("span", null, "IVR\u901A\u8BAF\u5F55\u9009\u62E9")), /*#__PURE__*/React.createElement(Col, {
    span: 18
  }, /*#__PURE__*/React.createElement(Form.Item, {
    style: {
      float: 'right'
    }
  }, /*#__PURE__*/React.createElement(Input.Search, {
    allowClear: true,
    placeholder: "\u6309\u624B\u673A\u53F7\u641C\u7D22",
    onSearch: onSearchPhone,
    style: {
      width: 200
    }
  })))), /*#__PURE__*/React.createElement(Form.Item, {
    name: "IvrPhoneLists"
  }, /*#__PURE__*/React.createElement(Table, {
    rowKey: "phone",
    size: "small",
    loading: loading,
    dataSource: tableLists,
    rowClassName: function rowClassName(record, index) {
      return index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double';
    },
    bordered: "true",
    scroll: {
      y: 150
    },
    pagination: pagination,
    onChange: onPageChange,
    rowSelection: {
      selectedRowKeys: selectedRowKeys,
      onSelect: onSelectChange,
      onSelectAll: onSelectAll
    },
    columns: [{
      title: '序号',
      dataIndex: 'index',
      width: 50,
      align: 'center',
      ellipsis: true
    }, {
      title: '省市公司',
      dataIndex: 'regionName',
      width: 100,
      align: 'center',
      ellipsis: true
    }, {
      title: '岗位名称',
      dataIndex: 'callRole',
      width: 100,
      align: 'center',
      ellipsis: true
    }, {
      title: '电话号码',
      dataIndex: 'phone',
      align: 'center',
      ellipsis: true,
      width: 100
    }, {
      title: '职责描述',
      dataIndex: 'roleDesc',
      width: 150,
      align: 'center',
      ellipsis: true,
      sorter: true
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    className: "alarm-sms-distribution-user-input"
  }, /*#__PURE__*/React.createElement("span", null, "\u624B\u52A8\u8F93\u5165".concat(phoneTitles[type], "\uFF1A\uFF08\u8F93\u5165\u624B\u673A\u53F7\uFF0C\u7528\u9017\u53F7\u5206\u5272\uFF09")), /*#__PURE__*/React.createElement("div", {
    className: "alarm-sms-distribution-user-input-dom"
  }, /*#__PURE__*/React.createElement(Form.Item, {
    onChange: phoneListChange,
    name: "customPhoneLists",
    rules: [{
      validator: function () {
        var _validator = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(rule, val, callback) {
          var reg, reg2;
          return _regenerator().w(function (_context2) {
            while (1) switch (_context2.n) {
              case 0:
                reg = new RegExp('^0?1[3456789][0-9]{9}(,0?1[3456789][0-9]{9})*$');
                reg2 = new RegExp('0?1[3456789][0-9]{9}，');
                if (!(val && reg2.test(val))) {
                  _context2.n = 1;
                  break;
                }
                throw new Error('请输入英文逗号分隔！');
              case 1:
                if (!(val && !reg.test(val))) {
                  _context2.n = 2;
                  break;
                }
                throw new Error('请输入正确的手机号码！');
              case 2:
                callback();
              case 3:
                return _context2.a(2);
            }
          }, _callee2);
        }));
        function validator(_x, _x2, _x3) {
          return _validator.apply(this, arguments);
        }
        return validator;
      }()
    }]
  }, /*#__PURE__*/React.createElement(Input.TextArea, null)))), showEdit && /*#__PURE__*/React.createElement(SmsTemplate, {
    modalContainer: modalContainer,
    selectedFields: selectedFields,
    type: "alarmRightClick",
    visible: showEdit,
    onVisibleChange: onVisibleChange
  }));
};
export default Component;