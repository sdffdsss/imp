function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
import React, { useState } from 'react';
import { bool } from 'prop-types';
import { Form, Button, ColumnsSortDrag, Tooltip, Icon } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import pinyin from 'js-pinyin';
var Setting = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var onToolDateChange = props.onToolDateChange,
    allCol = props.allCol,
    columns = props.columns;
  var initColumn = function () {
    var useCol = [];
    columns && Array.isArray(columns) && columns.forEach(function (item, index) {
      !item.UnColumnModelUsed && useCol.push({
        field: item.dataIndex,
        id: item.sortFieldId,
        name: item.title,
        fieldWidth: item.width,
        customIndex: index + 1
      });
    });
    return useCol;
  }();
  var _useState = useState(initColumn),
    _useState2 = _slicedToArray(_useState, 2),
    data = _useState2[0],
    setData = _useState2[1];
  var _useState3 = useState(true),
    _useState4 = _slicedToArray(_useState3, 2),
    buttonDisabled = _useState4[0],
    setButtonDsiabled = _useState4[1];
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    selectRows = _useState6[0],
    setSelectRows = _useState6[1];
  var _useState7 = useState(1),
    _useState8 = _slicedToArray(_useState7, 2),
    columnsSortDragKey = _useState8[0],
    setColumnsSortDragKey = _useState8[1];
  var _Form$useForm = Form.useForm(),
    _Form$useForm2 = _slicedToArray(_Form$useForm, 1),
    form = _Form$useForm2[0];
  var onFinish = function onFinish(value) {
    onToolDateChange(data);
  };
  var onChange = function onChange(condtion) {
    setData(_toConsumableArray(condtion));
    setButtonDsiabled(false);
  };
  var selectAction = function selectAction(field, type) {
    if (type === 'right') {
      setSelectRows(field);
    }
  };
  var styleMap = {
    width: '100%',
    height: 'calc(100vh - 234px)'
  };
  var moveMethods = function moveMethods(rightData, selectRows, moveMode) {
    var copyRightData = _.cloneDeep(rightData);
    var newRightData = _.cloneDeep(rightData);
    var newSelectRows = _.cloneDeep(selectRows);
    // 先对已选数据进行升序排序
    newSelectRows = _.sortBy(newSelectRows.map(function (item) {
      var _$find;
      return _objectSpread(_objectSpread({}, item), {}, {
        customIndex: (_$find = _.find(rightData, function (c) {
          return c.field === item.field;
        })) === null || _$find === void 0 ? void 0 : _$find.customIndex
      });
    }), ['customIndex']);
    if (moveMode === 'up') {
      if (newSelectRows.length < copyRightData.length) {
        copyRightData.forEach(function (item, i) {
          newSelectRows.forEach(function (s) {
            var _newSelectRows$i, _copyRightData$i;
            if (s.field === item.field && ((_newSelectRows$i = newSelectRows[i]) === null || _newSelectRows$i === void 0 ? void 0 : _newSelectRows$i.field) !== ((_copyRightData$i = copyRightData[i]) === null || _copyRightData$i === void 0 ? void 0 : _copyRightData$i.field)) {
              newRightData.splice(i, 1);
              newRightData.splice(i - 1, 0, s);
            }
          });
        });
      }
    } else if (moveMode === 'toTop') {
      var reversData = _.reverse(_.cloneDeep(rightData));
      if (newSelectRows.length < copyRightData.length) {
        _.reverse(copyRightData).forEach(function (item) {
          newSelectRows.forEach(function (s) {
            if (s.field === item.field) {
              reversData = _.filter(reversData, function (r) {
                return r.field !== s.field;
              });
              reversData.push(s);
            }
          });
        });
        newRightData = _.reverse(reversData);
      }
    } else if (moveMode === 'down') {
      // 反转右侧所有数据 以及反转已选数据  按照上移的方式处理上移操作。最后将最新的数据反转
      var _reversData = _.reverse(_.cloneDeep(rightData));
      var reverseRightData = _.reverse(_.cloneDeep(rightData));
      var reversSelectData = _.reverse(_.cloneDeep(newSelectRows));
      if (reversSelectData.length < reverseRightData.length) {
        reverseRightData.forEach(function (item, i) {
          reversSelectData.forEach(function (s) {
            var _reversSelectData$i, _reverseRightData$i;
            if (s.field === item.field && ((_reversSelectData$i = reversSelectData[i]) === null || _reversSelectData$i === void 0 ? void 0 : _reversSelectData$i.field) !== ((_reverseRightData$i = reverseRightData[i]) === null || _reverseRightData$i === void 0 ? void 0 : _reverseRightData$i.field)) {
              _reversData.splice(i, 1);
              _reversData.splice(i - 1, 0, s);
            }
          });
        });
        newRightData = _.reverse(_reversData);
      }
    } else {
      if (newSelectRows.length < copyRightData.length) {
        copyRightData.forEach(function (item) {
          newSelectRows.forEach(function (s) {
            if (s.field === item.field) {
              newRightData = _.filter(newRightData, function (n) {
                return n.field !== s.field;
              });
              newRightData.push(s);
            }
          });
        });
      }
    }
    return newRightData;
  };
  var moveMode = function moveMode(_moveMode) {
    if (!_.isEmpty(selectRows)) {
      var newData = moveMethods(data.map(function (item, i) {
        return _objectSpread(_objectSpread({}, item), {}, {
          customIndex: i + 1
        });
      }), selectRows, _moveMode);
      setData(newData);
    }
  };
  var getAllData = function getAllData(params) {
    return new Promise(function (resolve) {
      if (params.word) {
        resolve({
          data: allCol.filter(function (item) {
            return item.name.toLowerCase().indexOf(params.word.toLowerCase()) >= 0 || item.field.toLowerCase().indexOf(params.word.toLowerCase()) >= 0 || pinyin.getFullChars(item.name).toLowerCase().indexOf(params.word.toLowerCase()) >= 0 || pinyin.getCamelChars(item.name).toLowerCase().indexOf(params.word.toLowerCase()) >= 0;
          }),
          total: null
        });
      } else {
        resolve({
          data: allCol,
          total: null
        });
      }
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(Form, {
    ref: ref,
    form: form,
    name: "form_in_modal",
    onFinish: onFinish,
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "capacity",
    key: columnsSortDragKey
  }, /*#__PURE__*/React.createElement(ColumnsSortDrag, {
    style: styleMap
    // allOptionsList={allCol}
    ,
    request: getAllData,
    searchParams: {
      searchField: 'word',
      paging: false
    },
    selectOptionsList: data,
    onChange: onChange,
    maxField: 40,
    leftPagetions: false,
    selectAction: selectAction,
    columns: [{
      key: 'name',
      title: '名称',
      width: 150
    }, {
      key: 'field',
      title: '字段',
      width: 150
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'red'
    }
  }, "\u63D0\u793A\uFF1A\u5DF2\u9009\u62E9\u7684\u544A\u8B66\u5B57\u6BB5\u4E0D\u80FD\u8D85\u8FC740\u4E2A\uFF01"), /*#__PURE__*/React.createElement(Button, {
    disabled: buttonDisabled,
    style: {
      position: 'absolute',
      bottom: '8px',
      left: '32%'
    },
    type: "primary",
    onClick: function onClick() {
      setData(initColumn);
      setButtonDsiabled(true);
      setColumnsSortDragKey(columnsSortDragKey + 1);
      setSelectRows([]);
    }
  }, "\u8FD8\u539F\u9ED8\u8BA4\u503C")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: 200,
      marginLeft: 5
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    title: "\u7F6E\u9876"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      antdIcon: true,
      style: {
        fontSize: '14px'
      },
      type: "VerticalAlignTopOutlined"
    }),
    onClick: function onClick() {
      moveMode('toTop');
    }
  })), /*#__PURE__*/React.createElement(Tooltip, {
    title: "\u4E0A\u79FB"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      antdIcon: true,
      style: {
        fontSize: '14px'
      },
      type: "ArrowUpOutlined"
    }),
    onClick: function onClick() {
      moveMode('up');
    }
  })), /*#__PURE__*/React.createElement(Tooltip, {
    title: "\u4E0B\u79FB"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      antdIcon: true,
      style: {
        fontSize: '14px'
      },
      type: "ArrowDownOutlined"
    }),
    onClick: function onClick() {
      moveMode('down');
    }
  })), /*#__PURE__*/React.createElement(Tooltip, {
    title: "\u7F6E\u5E95"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      antdIcon: true,
      style: {
        fontSize: '14px'
      },
      type: "VerticalAlignBottomOutlined"
    }),
    onClick: function onClick() {
      moveMode('toEnd');
    }
  }))));
});
Setting.propTypes = {
  visible: bool
};
export default Setting;