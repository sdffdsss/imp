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
import { Table, Input, Form, Row, Col, Modal } from 'oss-ui';
import dayjs from 'dayjs';
import { _ } from 'oss-web-toolkits';
import serviceConfig from '../../../hox';
import Common from '../../../common';
import { rightClickShow3 } from '../../../alarm-window/alarm-show-config';
import { getRecordDetail } from '../../../alarm-window/common/dataHandler';
var Component = function Component(props) {
  var menuComponentFormRef = props.menuComponentFormRef,
    record = props.record,
    userInfo = props.userInfo,
    getRecordsDetail = props.getRecordsDetail;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    selectedRowKeys = _useState2[0],
    setSelectedRowKeys = _useState2[1];
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    datas = _useState4[0],
    setDatas = _useState4[1];
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    alarmInfoSelectedRowKeys = _useState6[0],
    setAlarmInfoSelectedRowKeys = _useState6[1];
  var _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    preTreatData = _useState8[0],
    setPreTreatData = _useState8[1];
  useEffect(function () {
    getPreTreatList();
    getRecordsDetail(record, function (res) {
      var _menuComponentFormRef;
      var recordsDetail = getRecordDetail(res);
      var alarmIds = [];
      record.forEach(function (item, index) {
        alarmIds.push(item.alarm_id);
        if (!item.send_status) {
          var _recordsDetail$index;
          item.send_status = (_recordsDetail$index = recordsDetail[index]) === null || _recordsDetail$index === void 0 ? void 0 : _recordsDetail$index.send_status;
        }
      });
      menuComponentFormRef === null || menuComponentFormRef === void 0 ? void 0 : (_menuComponentFormRef = menuComponentFormRef.current) === null || _menuComponentFormRef === void 0 ? void 0 : _menuComponentFormRef.setFieldsValue({
        alarmInfo: record || []
      });
      setDatas(record);
      setAlarmInfoSelectedRowKeys(alarmIds);
    });
    return function () {};
  }, []);
  useEffect(function () {
    if (menuComponentFormRef && menuComponentFormRef.current) {
      menuComponentFormRef.current.alarmFilterFunc = function (callback) {
        Modal.confirm({
          title: '提示',
          content: "\u8BF7\u786E\u8BA4\u662F\u5426\u8FDB\u884C\u9884\u5904\u7406?",
          okText: '确认',
          okButtonProps: {
            prefixCls: 'oss-ui-btn'
          },
          cancelButtonProps: {
            prefixCls: 'oss-ui-btn'
          },
          okType: 'danger',
          cancelText: '取消',
          prefixCls: 'oss-ui-modal',
          onOk: function onOk(close) {
            callback(menuComponentFormRef.current.getFieldsValue().alarmInfo);
            close();
          },
          onCancel: function onCancel(close) {
            callback([]);
            close();
          }
        });
      };
    }
    return function () {};
  }, [menuComponentFormRef]);
  var columns = [{
    title: '预处理信息',
    dataIndex: 'reasonText',
    ellipsis: true
  }, {
    title: '所有者',
    dataIndex: 'userName',
    ellipsis: true
  }];
  var alarmInfoColumns = rightClickShow3.map(function (item) {
    return {
      title: item.label,
      dataIndex: item.fieldName,
      ellipsis: true,
      render: function render(text, record) {
        return (text === null || text === void 0 ? void 0 : text.lable) || (text === null || text === void 0 ? void 0 : text.value) || '-';
      }
    };
  });
  var onAlarmInfoSelectChange = function onAlarmInfoSelectChange(id, rows) {
    menuComponentFormRef.current.setFieldsValue({
      alarmInfo: rows || []
    });
    var selectedRowKeys = [];
    selectedRowKeys = rows.map(function (row) {
      return row.alarm_id;
    });
    setAlarmInfoSelectedRowKeys(selectedRowKeys);
  };
  var onSelectAll = function onSelectAll(id, rows) {
    menuComponentFormRef.current.setFieldsValue({
      alarmInfo: rows || []
    });
    var selectedRowKeys = [];
    selectedRowKeys = rows.map(function (row) {
      return row.alarm_id;
    });
    setAlarmInfoSelectedRowKeys(selectedRowKeys);
  };
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
    status: 1,
    alarmInfo: []
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
      span: 24
    },
    name: "alarmInfo",
    label: "\u544A\u8B66\u4FE1\u606F",
    rules: [{
      required: true,
      message: ''
    }, {
      validator: function validator(rule, value, callback) {
        if (alarmInfoSelectedRowKeys.length === 0) {
          callback('请选择告警');
        } else {
          callback();
        }
      }
    }]
  }, /*#__PURE__*/React.createElement(Table, {
    rowKey: "alarm_id",
    size: "small",
    dataSource: datas,
    columns: alarmInfoColumns,
    pagination: false,
    scroll: {
      y: 150
    },
    bordered: true,
    rowSelection: {
      selectedRowKeys: alarmInfoSelectedRowKeys,
      onChange: onAlarmInfoSelectChange,
      onSelectAll: onSelectAll
    }
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
    }, {
      validator: function validator(rule, value, callback) {
        // eslint-disable-next-line no-control-regex
        var valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
        if (valueLength > 600) {
          callback('总长度不能超过600位（1汉字=2位）');
        } else {
          callback();
        }
      }
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