function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
import { Button, Input, Space, Form, Row, Col, Card, Divider } from 'oss-ui';
import ConditionTree from '../condition-tree';
import { _ } from 'oss-web-toolkits';
import Common from '../../../../common';
import serviceConfig from '../../../../hox';
import "./index.css";
var FILTER_EMUN = {
  ENABLE: {
    TRUE: 1,
    FALSE: 2
  },
  REVERSE: {
    TRUE: 1,
    FALSE: 2
  },
  ORDER: {
    ASC: 1,
    DESC: 2
  },
  ISPRIVATE: {
    TRUE: 1,
    FALSE: 2
  },
  COMPARETYPE: {
    EQ: 'eq',
    //等于
    LE: 'le',
    LT: 'lt',
    GE: 'ge',
    GT: 'gt',
    LIKE: 'like',
    IN: 'in',
    BETWEEN: 'between',
    ISNULL: 'is_null',
    NOTNULL: 'not_null'
  }
};
var timeData = {
  0: '秒',
  1: '分'
};
var Index = /*#__PURE__*/function (_React$PureComponent) {
  function Index(props) {
    var _this;
    _classCallCheck(this, Index);
    _this = _callSuper(this, Index, [props]);
    _this.getHistoryData = function () {
      var data = _this.props.data;
      _this.setState({
        filterInfo: _.cloneDeep(data),
        treeData: data.filterExpr.filterConditionList
      });
    };
    _this.getFilterInfo = function () {
      var _this$props = _this.props,
        data = _this$props.data,
        moduleId = _this$props.moduleId;
      // Common.request('alarmmodel/filter/v1/filter', {
      //     type: 'get',
      //     baseUrlType: 'filterUrl',
      //     showSuccessMessage: false,
      //     data: {
      //         modelId: 2,
      //         moduleId: moduleId ? moduleId : data.moduleId,
      //         filterId: data.filterId,
      //     },
      // })
      Common.request(null, {
        fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.filterUrl, "alarmmodel/filter/v1/filter"),
        type: 'get',
        showSuccessMessage: false,
        defaultSuccessMessage: false,
        defaultErrorMessage: false,
        data: {
          modelId: 2,
          moduleId: moduleId ? moduleId : data.moduleId,
          filterId: data.filterId
        }
      }).then(function (res) {
        if (res && res.data) {
          _this.setState({
            filterInfo: _.cloneDeep(res.data),
            treeData: res.data.filterExpr.filterConditionList
          });
        }
      });
      // if (res) {
      //     this.setState({
      //         filterInfo: _.cloneDeep(res.data),
      //         treeData: res.data.filterExpr.filterConditionList,
      //     });
      // }
    };
    _this.expandAllSwitchClick = function () {
      var expandAllTextStatus = _this.state.expandAllTextStatus;
      _this.setState({
        expandAllTextStatus: !expandAllTextStatus
      });
    };
    //搜索过滤条件
    _this.searchCondition = function (value) {
      var filterInfo = _this.state.filterInfo;
      var showData = [];
      var fullData = _.cloneDeep(_.get(filterInfo, 'filterExpr.filterConditionList', []));
      if (fullData.length) {
        _.forEach(fullData, function (item) {
          if (item.conditionLabel.includes(value)) {
            showData.push(item);
          } else {
            var searchConditionItem = item.conditionExpr.conditionItemList && item.conditionExpr.conditionItemList.length ? _.find(item.conditionExpr.conditionItemList, function (s) {
              return s.fieldLabel.includes(value);
            }) : null;
            if (searchConditionItem) {
              item.conditionExpr.conditionItemList = item.conditionExpr.conditionItemList.filter(function (s) {
                return s.fieldLabel.includes(value);
              });
              showData.push(item);
            } else {
              var conditionItemList = _.find(item.conditionExpr.conditionItemList, function (conditionItem) {
                return _.find(conditionItem.valueList, function (valueItem) {
                  return valueItem.value.includes(value);
                });
              });
              if (conditionItemList) {
                item.conditionExpr.conditionItemList = item.conditionExpr.conditionItemList.filter(function (conditionItem) {
                  return _.find(conditionItem.valueList, function (valueItem) {
                    return valueItem.value.includes(value);
                  });
                });
                _.forEach(item.conditionExpr.conditionItemList, function (conditionItem) {
                  conditionItem.valueList = conditionItem.valueList.filter(function (valueItem) {
                    return valueItem.value.includes(value);
                  });
                });
                showData.push(item);
              }
            }
          }
        });
        _this.setState({
          treeData: showData
        });
      }
    };
    _this.treeRef = /*#__PURE__*/React.createRef();
    _this.state = {
      expandAllTextStatus: true,
      filterInfo: {},
      treeData: {}
    };
    return _this;
  }
  _inherits(Index, _React$PureComponent);
  return _createClass(Index, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props2 = this.props,
        data = _this$props2.data,
        type = _this$props2.type;
      if (type === 'history' && data && data.filterId) {
        this.getHistoryData();
      } else {
        if (data && data.filterId) {
          this.getFilterInfo();
        }
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data) && this.props.data && this.props.data.filterId) {
        if (this.props.type !== 'history') {
          this.getFilterInfo();
        } else {
          this.getHistoryData();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _$find, _$find2;
      var _this$state = this.state,
        expandAllTextStatus = _this$state.expandAllTextStatus,
        treeData = _this$state.treeData,
        filterInfo = _this$state.filterInfo;
      var moduleId = this.props.moduleId;
      var currentModuleId = moduleId ? Number(moduleId) : Number(filterInfo.moduleId);
      console.log(filterInfo);
      return /*#__PURE__*/React.createElement(Card, {
        className: "filter-show-content"
      }, /*#__PURE__*/React.createElement(Form, {
        labelAlign: "right",
        name: "baseFilterForm"
      }, /*#__PURE__*/React.createElement(Row, {
        gutter: 24
      }, /*#__PURE__*/React.createElement(Col, {
        span: 12
      }, /*#__PURE__*/React.createElement(Form.Item, {
        labelCol: {
          span: 6
        },
        label: "\u540D\u79F0"
      }, /*#__PURE__*/React.createElement(Input, {
        disabled: true,
        value: filterInfo.filterName || ''
      }))), /*#__PURE__*/React.createElement(Col, {
        span: 12
      }, /*#__PURE__*/React.createElement(Form.Item, {
        labelCol: {
          span: 6
        },
        label: "\u521B\u5EFA\u4EBA"
      }, /*#__PURE__*/React.createElement(Input, {
        disabled: true,
        value: filterInfo.creator || ''
      })))), /*#__PURE__*/React.createElement(Row, {
        gutter: 24
      }, /*#__PURE__*/React.createElement(Col, {
        span: 12
      }, /*#__PURE__*/React.createElement(Form.Item, {
        labelCol: {
          span: 6
        },
        label: "\u521B\u5EFA\u65F6\u95F4"
      }, /*#__PURE__*/React.createElement(Input, {
        disabled: true,
        value: filterInfo.createTime || ''
      }))), /*#__PURE__*/React.createElement(Col, {
        span: 12
      }, /*#__PURE__*/React.createElement(Form.Item, {
        labelCol: {
          span: 6
        },
        label: "\u4FEE\u6539\u65F6\u95F4"
      }, /*#__PURE__*/React.createElement(Input, {
        disabled: true,
        value: filterInfo.modifyTime || ''
      })))), currentModuleId === 1 ? /*#__PURE__*/React.createElement(Row, {
        gutter: 24
      }, /*#__PURE__*/React.createElement(Col, {
        span: 12
      }, /*#__PURE__*/React.createElement(Form.Item, {
        labelCol: {
          span: 6
        },
        label: "\u662F\u5426\u79C1\u6709"
      }, /*#__PURE__*/React.createElement(Input, {
        disabled: true,
        value: filterInfo.isPrivate ? filterInfo.isPrivate === FILTER_EMUN.ISPRIVATE.TRUE ? '是' : '否' : ''
      }))), /*#__PURE__*/React.createElement(Col, {
        span: 12
      }, /*#__PURE__*/React.createElement(Form.Item, {
        labelCol: {
          span: 6
        },
        label: "\u662F\u5426\u542F\u7528"
      }, /*#__PURE__*/React.createElement(Input, {
        disabled: true,
        value: filterInfo.enable ? filterInfo.enable === FILTER_EMUN.ENABLE.TRUE ? '是' : '否' : ''
      })))) : /*#__PURE__*/React.createElement(Row, {
        gutter: 24
      }, /*#__PURE__*/React.createElement(Col, {
        span: 12
      }, /*#__PURE__*/React.createElement(Form.Item, {
        labelCol: {
          span: 6
        },
        disabled: true,
        label: "\u662F\u5426\u542F\u7528"
      }, /*#__PURE__*/React.createElement(Input, {
        disabled: true,
        value: filterInfo.enable ? filterInfo.enable === FILTER_EMUN.ENABLE.TRUE ? '是' : '否' : ''
      })))), /*#__PURE__*/React.createElement(Row, {
        gutter: 24
      }, /*#__PURE__*/React.createElement(Col, {
        span: 24
      }, /*#__PURE__*/React.createElement(Form.Item, {
        labelCol: {
          span: 3
        },
        disabled: true,
        label: "\u63CF\u8FF0",
        style: {
          marginBottom: 0
        }
      }, /*#__PURE__*/React.createElement(Input.TextArea, {
        style: {
          resize: 'none',
          height: '30px'
        },
        disabled: true,
        value: filterInfo.filterDesc || ''
      }))))), /*#__PURE__*/React.createElement(Divider, {
        className: "volume-divider",
        dashed: true
      }), /*#__PURE__*/React.createElement("div", {
        className: "filter-condition-show"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '50%'
        }
      }, /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
        onClick: this.expandAllSwitchClick
      }, !expandAllTextStatus ? '一键展开' : '一键折叠'), /*#__PURE__*/React.createElement(Input.Search, {
        enterButton: true,
        onSearch: this.searchCondition,
        placeholder: "\u8BF7\u8F93\u5165\u8FC7\u6EE4\u6761\u4EF6"
      })), /*#__PURE__*/React.createElement(ConditionTree, {
        ref: this.treeRef,
        data: treeData,
        expandAll: expandAllTextStatus
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: '1'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          paddingLeft: 12,
          display: 'flex'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          whiteSpace: 'nowrap',
          textAlign: 'right',
          verticalAlign: 'middle',
          flex: '0 0 25%',
          maxWidth: '25%',
          lineHeight: '28px'
        }
      }, "\u76D1\u63A7\u5448\u73B0\u5EF6\u65F6\uFF1A"), /*#__PURE__*/React.createElement(Input, {
        style: {
          flex: '1'
        },
        value: (_$find = _.find(filterInfo.filterProperties, {
          key: 'max_delay_time_seconds'
        })) === null || _$find === void 0 ? void 0 : _$find.value,
        disabled: true,
        addonAfter: timeData[((_$find2 = _.find(filterInfo.filterProperties, {
          key: 'unit'
        })) === null || _$find2 === void 0 ? void 0 : _$find2.value) || '0']
      })))));
    }
  }]);
}(React.PureComponent);
export { Index as default };