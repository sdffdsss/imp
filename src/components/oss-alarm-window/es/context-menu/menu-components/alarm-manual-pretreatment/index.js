function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
import { Table, Input, Form, Row, Col } from 'oss-ui';
import dayjs from 'dayjs';
import { _ } from 'oss-web-toolkits';
import serviceConfig from '../../../hox';
import Common from '../../../common';
var Component = function Component(props) {
  var _record$0$eqp_label;
  var menuComponentFormRef = props.menuComponentFormRef,
    record = props.record,
    userInfo = props.userInfo;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    selectedRowKeys = _useState2[0],
    setSelectedRowKeys = _useState2[1];
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    preTreatData = _useState4[0],
    setPreTreatData = _useState4[1];
  useEffect(function () {
    getPreTreatList();
    return function () {};
  }, []);
  var columns = [{
    title: '预处理信息',
    dataIndex: 'reasonText',
    ellipsis: true
  }, {
    title: '所有者',
    dataIndex: 'userName',
    ellipsis: true
  }];
  var onSelectChange = function onSelectChange(values) {
    setSelectedRowKeys(values);
    var selectOne = _.find(preTreatData, function (s) {
      return values.includes(s.tIndex);
    });
    menuComponentFormRef.current.setFieldsValue({
      resultInfo: selectOne ? selectOne.reasonText : ''
    });
  };
  var onInputChange = function onInputChange(e) {
    menuComponentFormRef.current.setFieldsValue({
      resultInfo: e.target.value
    });
  };
  var rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
    type: 'radio'
  };
  var initialValues = {
    operator: userInfo.userName,
    recordTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    neName: ((_record$0$eqp_label = record[0]['eqp_label']) === null || _record$0$eqp_label === void 0 ? void 0 : _record$0$eqp_label.value) || '',
    status: 1
  };
  var getPreTreatList = function getPreTreatList() {
    Common.request(null, {
      fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.filterUrl, "alarmmodel/operate/v1/operate/pretreatinfo"),
      type: 'get',
      showSuccessMessage: false,
      data: {
        clientRequestId: 'nomean',
        clientToken: localStorage.getItem('access_token'),
        clientRequestInfo: JSON.stringify({
          clientRequestId: 'nomean',
          clientToken: localStorage.getItem('access_token')
        })
      }
    }).then(function (res) {
      if (res && res.data) {
        if (res.data && res.data.length) {
          setPreTreatData(res.data.map(function (item, index) {
            return _objectSpread(_objectSpread({}, item), {}, {
              tIndex: ++index
            });
          }));
        }
      } else if (res && !res.data) {
        setPreTreatData([]);
      }
    });
  };
  return /*#__PURE__*/React.createElement(Form, {
    initialValues: initialValues,
    ref: menuComponentFormRef,
    labelAlign: "right"
  }, /*#__PURE__*/React.createElement(Row, {
    gutter: 24
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    labelCol: {
      span: 4
    },
    name: "operator",
    label: "\u5904\u7406\u4EBA"
  }, /*#__PURE__*/React.createElement(Input, {
    disabled: true
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    labelCol: {
      span: 4
    },
    name: "recordTime",
    label: "\u5904\u7406\u65F6\u95F4"
  }, /*#__PURE__*/React.createElement(Input, {
    disabled: true
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 24
  }, /*#__PURE__*/React.createElement(Form.Item, {
    labelCol: {
      span: 2
    },
    name: "neName",
    label: "\u7F51\u5143"
  }, /*#__PURE__*/React.createElement(Input, {
    disabled: true
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 24
  }, /*#__PURE__*/React.createElement(Form.Item, {
    labelCol: {
      span: 24
    },
    name: "resultInfo",
    label: "\u9884\u5904\u7406\u8BE6\u60C5",
    rules: [{
      required: true,
      message: '预处理详情不能为空'
    }, {
      whitespace: true,
      message: '预处理详情不能为空'
    }]
  }, /*#__PURE__*/React.createElement(Input.TextArea, {
    autoSize: {
      minRows: 6,
      maxRows: 10
    },
    onChange: onInputChange
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 24
  }, /*#__PURE__*/React.createElement(Form.Item, {
    labelCol: {
      span: 24
    },
    name: "table",
    label: "\u9884\u5904\u7406\u4FE1\u606F\u7EF4\u62A4"
  }, /*#__PURE__*/React.createElement(Table, {
    rowKey: "tIndex",
    rowSelection: rowSelection,
    size: "small",
    dataSource: preTreatData,
    columns: columns,
    pagination: false
  })))));
};
export default Component;