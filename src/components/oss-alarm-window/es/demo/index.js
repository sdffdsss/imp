function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
import React from 'react';
import AlarmWindowWithProcessor from '../alarm-window-processors';
import { _ } from 'oss-web-toolkits';
import { Button } from 'oss-ui';
var Demo = /*#__PURE__*/function (_React$PureComponent) {
  function Demo(props) {
    var _this;
    _classCallCheck(this, Demo);
    _this = _callSuper(this, Demo, [props]);
    _this.hide = function () {
      _this.setState({
        componentShow: false
      });
    };
    _this.getMessage = function (getMessage) {
      console.log(getMessage);
    };
    _this.getSelectRows = function (selectRows) {
      // console.log(selectRows);
    };
    // registerParamFormatter = registerParam => {
    //     const newRegisterParam = { ...registerParam };
    //     Object.assign(newRegisterParam.subscribeInfoJSON, {
    //         beginTimeStr: '2021-8-27 10:00:00',
    //         endTimeStr: '2021-8-27 10:00:00',
    //         aheadSencond: 3600,
    //         type: 4,
    //         filterSplitFlag: this.props.filterSplitFlag,
    //     });
    //     return newRegisterParam;
    // };
    _this.initListener = function () {
      window.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'c' || e.metaKey && e.key === 'c') {
          console.log('摁下了 ctrl+c');
        }
      });
    };
    _this.onCellClick = function (otdata, record, dataIndex) {
      // console.log(record[dataIndex].lable);
    };
    _this.columnRender = function (winType, column) {
      console.log('columnRender', winType, column);
      if (winType === 'active') {
        var resColumn = _toConsumableArray(column);
        resColumn.push({
          title: '定制操作',
          key: 'customStting',
          width: 160,
          ellipsis: true,
          coustomFilterType: null,
          sorter: false,
          field: 'customStting',
          sortFieldId: 'customStting',
          UnColumnModelUsed: false,
          getDisplayData: function getDisplayData(text, record) {
            console.log(text, record);
            return {
              dom: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
                type: "link",
                onClick: _this.click
              }, "123"))
            };
          }
        });
        return resColumn;
      } else {
        return column;
      }
    };
    _this.click = function () {
      alert(3);
    };
    _this.state = {
      filterIdList: [1862236689],
      componentShow: true
      // defaultSecondaryFilter: {
      //     conditionList: [
      //         {
      //             fieldName: 'alarm_content',
      //             not: false,
      //             operator: 'in',
      //             value: ['6623-汕头市金平区石炮台街道长平路长平社区中山路97号2座2梯203-ONU003-CIOT-GM220-S-(H)'],
      //         },
      //     ],
      //     logicalAnd: true,
      //     not: false,
      // },
    };
    _this.ref = /*#__PURE__*/React.createRef();
    _this.initListener();
    return _this;
  }
  _inherits(Demo, _React$PureComponent);
  return _createClass(Demo, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props = this.props,
        registerWindow = _this$props.registerWindow,
        frameInfo = _this$props.frameInfo,
        colDispTemplet = _this$props.colDispTemplet,
        windowId = _this$props.windowId,
        filterIdList = _this$props.filterIdList,
        filterSplitFlag = _this$props.filterSplitFlag,
        columnBehaviorRecord = _this$props.columnBehaviorRecord,
        needFp = _this$props.needFp;
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        onClick: function onClick() {
          return _this2.ref.current.handleError();
        }
      }, "\u624B\u52A8\u91CD\u8FDE\u6D4B\u8BD5"), this.state.componentShow && /*#__PURE__*/React.createElement(AlarmWindowWithProcessor, {
        ref: this.ref,
        title: "\u6D41\u6C34\u7A97\u7EC4\u4EF6\u5E93\u4E13\u7528",
        registerWindow: registerWindow,
        filterIdList: filterIdList,
        colDispTemplet: colDispTemplet,
        windowId: windowId,
        filterNameList: ['流水窗组件库专用'],
        statusDispTemplet: 0,
        frameInfo: frameInfo,
        defaultSize: "small",
        height: 465,
        needFp: needFp,
        columnBehaviorRecord: columnBehaviorRecord,
        doubleClickType: 1,
        onDeleteItem: this.hide,
        registerCallBack: this.getMessage,
        onTableSelect: this.getSelectRows,
        clickLock: false,
        autoUnLock: false,
        unLockTime: 4,
        filterSplitFlag: filterSplitFlag
        // registerParamFormatter={this.registerParamFormatter}
        ,
        theme: "light",
        removeClearAlarm: true,
        onCellClick: this.onCellClick,
        autoCheck: true,
        autoCheckTimer: 5,
        autoCheckSize: {
          active: 500,
          confirm: 1000,
          clear: 1500,
          cleardAck: 800
        },
        logType: 0,
        iconType: "hunan",
        needTaskQueue: false,
        extraFilterMap: [[{
          fieldName: 'active_status',
          not: false,
          operator: 'ex',
          value: ['1']
        }], [{
          fieldName: 'ack_flag',
          not: false,
          operator: 'in',
          value: ['0']
        }, {
          fieldName: 'active_status',
          not: false,
          operator: 'in',
          value: ['1']
        }], [{
          fieldName: 'ack_flag',
          not: false,
          operator: 'in',
          value: ['1']
        }, {
          fieldName: 'active_status',
          not: false,
          operator: 'in',
          value: ['1']
        }]]
        // defaultSecondaryFilter={this.state.defaultSecondaryFilter}
        ,
        columnRender: this.columnRender
      }));
    }
  }]);
}(React.PureComponent);
export { Demo as default };