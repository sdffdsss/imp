function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
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
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Row, Col, Table, Icon, Typography, message } from 'oss-ui';
import serviceConfig from '../../../hox';
import Common from '../../../common';
import formatReg from './formatReg';
import { _ } from 'oss-web-toolkits';
export default (function (props) {
  var visible = props.visible,
    onVisibleChange = props.onVisibleChange,
    type = props.type,
    templateInfo = props.templateInfo,
    reloadList = props.reloadList,
    optionKey = props.optionKey,
    selectedFields = props.selectedFields;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    smsFieldsList = _useState2[0],
    setSmsFieldsList = _useState2[1];
  var _useState3 = useState({
      size: 'small',
      showLessItems: true,
      showSizeChanger: false
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    paging = _useState4[0],
    setPaging = _useState4[1];
  var _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    searchValue = _useState6[0],
    setSearchValue = _useState6[1];
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    loading = _useState8[0],
    setLoading = _useState8[1];
  var _useState9 = useState(''),
    _useState0 = _slicedToArray(_useState9, 2),
    rowId = _useState0[0],
    setRowId = _useState0[1];
  var _useState1 = useState([]),
    _useState10 = _slicedToArray(_useState1, 2),
    rowClickId = _useState10[0],
    setRowClickId = _useState10[1];
  var _Form$useForm = Form.useForm(),
    _Form$useForm2 = _slicedToArray(_Form$useForm, 1),
    formRef = _Form$useForm2[0];
  var onOk = function onOk() {
    formRef.validateFields().then(function (values) {
      if (type === 'alarmRightClick') {
        onVisibleChange(false, values, rowClickId);
        return;
      }
    });
  };
  var onCancel = function onCancel() {
    onVisibleChange(false);
  };
  var getSmsFieldsList = function getSmsFieldsList(page, searchValue) {
    setLoading(true);
    Common.request(null, {
      fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.filterUrl, "alarmmodel/filter/v1/filter/smsfields"),
      type: 'get',
      showSuccessMessage: false,
      data: {
        clientRequestInfo: JSON.stringify({
          clientRequestId: 'nomean',
          clientToken: localStorage.getItem('access_token')
        }),
        fieldName: searchValue,
        current: 1,
        pageSize: 500
      }
    }).then(function (res) {
      setLoading(false);
      if (res && res.data) {
        setSmsFieldsList(res.data.map(function (item) {
          return _objectSpread(_objectSpread({}, item), {}, {
            showAdd: false
          });
        }));
      }
    }).catch(function () {
      return setLoading(false);
    });
  };
  var onAdd = function onAdd(record) {
    var currentContent = formRef.getFieldValue('content') ? formRef.getFieldValue('content') : '';
    if (rowClickId.find(function (item) {
      return record.dbField === item;
    })) {
      message.error('该字段已存在');
      return;
    }
    var newContent = "".concat(currentContent).concat(record.colNameZh, ":<").concat(record.dbField, ">");
    if (newContent.length > 600) {
      message.error('模版长度不超过600字');
      return;
    }
    setRowClickId(rowClickId.concat(record.dbField));
    formRef.setFieldsValue({
      content: newContent
    });
    formRef.validateFields(['content']);
  };
  var clearText = function clearText() {
    setRowClickId([]);
    formRef.setFieldsValue({
      content: ""
    });
    formRef.validateFields(['content']);
  };
  useEffect(function () {
    getSmsFieldsList(paging);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(function () {
    if (formRef && selectedFields && smsFieldsList.length && formRef.getFieldValue('content') === '') {
      setRowClickId(selectedFields);
      var currentContent = formRef.getFieldValue('content') ? formRef.getFieldValue('content') : '';
      var newContent = "".concat(currentContent).concat(selectedFields.map(function (item) {
        var fieldRecord = smsFieldsList.find(function (record) {
          return record.dbField === item;
        });
        if (fieldRecord) {
          return "".concat(fieldRecord.colNameZh, ":<").concat(fieldRecord.dbField, ">");
        } else {
          return '';
        }
      }).join(''));
      formRef.setFieldsValue({
        content: newContent
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef, selectedFields, smsFieldsList]);
  var onClickRow = function onClickRow(record) {
    var copyRecord = record;
    return {
      onMouseEnter: function onMouseEnter() {
        setRowId(record.dbField);
        copyRecord.showAdd = true;
      },
      onMouseLeave: function onMouseLeave() {
        setRowId('');
        copyRecord.showAdd = false;
      }
    };
  };
  var setRowClassName = function setRowClassName(record) {
    return record.dbField === rowId ? 'clickRowStyls' : '';
  };
  var searhChange = function searhChange(e) {
    setSearchValue(e.target.value);
    getSmsFieldsList(paging, e.target.value);
  };
  var debounceSearch = useCallback(_.debounce(searhChange, 400), [paging]);
  var validatorContent = function validatorContent(val, callback) {
    var reg = formatReg.noEmpety;
    var matchReg = formatReg.matchFiled;
    var list = [];
    var result = '';
    do {
      result = matchReg.exec(val);
      if (result) {
        list.push(result[1]);
      }
    } while (result);
    setRowClickId(list);
    if (val === '') {
      throw new Error('模板内容不能为空');
    } else if (!reg.test(val)) {
      throw new Error('模板内容不能有空格');
    } else if (_.uniq(list).length !== list.length) {
      throw new Error('存在相同字段');
    } else {
      return callback();
    }
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: '60%',
    bodyStyle: {
      height: '450px'
    },
    zIndex: 1001,
    visible: visible,
    onOk: onOk,
    onCancel: onCancel,
    title: type === 'create' ? '短信模板' : '短信内容编辑'
  }, /*#__PURE__*/React.createElement(Form, {
    form: formRef,
    initialValues: {
      templateName: templateInfo ? templateInfo.templateName : '',
      content: templateInfo ? templateInfo.templateContent : ''
    }
  }, /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 8
  }, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Col, {
    span: 24
  }, /*#__PURE__*/React.createElement(Typography.Title, {
    style: {
      fontSize: '12px',
      lineHeight: '24px'
    },
    level: 5
  }, "\u53EF\u5BFC\u5165\u5B57\u6BB5"))), /*#__PURE__*/React.createElement("div", {
    className: "left-list-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "left-list-container-search"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u8BF7\u8F93\u5165\u5B57\u6BB5\u540D\u79F0\u67E5\u8BE2",
    onChange: function onChange(e) {
      e.persist();
      debounceSearch(e);
    },
    suffix: /*#__PURE__*/React.createElement(Icon, {
      type: "SearchOutlined",
      antdIcon: true,
      style: {
        fontSize: 15
      }
    }),
    style: {
      width: 272,
      height: 28
    }
  })), smsFieldsList.length ? /*#__PURE__*/React.createElement(Table, {
    size: "small",
    onRow: onClickRow,
    rowClassName: setRowClassName,
    showHeader: false,
    scroll: {
      y: 250
    },
    dataSource: smsFieldsList,
    pagination: paging,
    loading: loading,
    columns: [{
      dataIndex: 'colNameZh',
      title: '名称',
      width: 110,
      ellipsis: true
    }, {
      dataIndex: 'action',
      title: '操作',
      width: 30,
      render: function render(text, record) {
        return record.showAdd && /*#__PURE__*/React.createElement(Icon, {
          type: "icondaoru-2",
          onClick: function onClick() {
            return onAdd(record);
          }
        });
      }
    }]
  }) : null)), /*#__PURE__*/React.createElement(Col, {
    span: 16
  }, /*#__PURE__*/React.createElement(Row, {
    justify: "space-between"
  }, /*#__PURE__*/React.createElement(Col, {
    span: 22
  }, /*#__PURE__*/React.createElement(Typography.Title, {
    style: {
      fontSize: '12px',
      lineHeight: '24px'
    },
    level: 5
  }, /*#__PURE__*/React.createElement("span", null, " \u6A21\u677F\u8BE6\u60C5"), " ", /*#__PURE__*/React.createElement("span", {
    className: "color-item"
  }, "\uFF08\u957F\u5EA6\u4E0D\u8D85\u8FC7600\u5B57\uFF09"))), /*#__PURE__*/React.createElement(Col, {
    span: 2
  }, /*#__PURE__*/React.createElement(Row, {
    align: "middle",
    justify: "end"
  }, /*#__PURE__*/React.createElement(Icon, {
    type: "iconqingchu",
    style: {
      fontSize: '19px'
    },
    onClick: clearText
  })))), /*#__PURE__*/React.createElement(Form.Item, {
    name: "content",
    rules: [{
      validator: function () {
        var _validator = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(rule, val, callback) {
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                validatorContent(val, callback);
              case 1:
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
  }, /*#__PURE__*/React.createElement(Input.TextArea, {
    showCount: true,
    maxLength: 600,
    autoSize: {
      minRows: 2,
      maxRows: 10
    },
    className: "left-list-container-textarea"
  }))))));
});