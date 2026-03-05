function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
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
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import React from 'react';
import ReactDOM from 'react-dom';
import { _ } from 'oss-web-toolkits';
import TreeGrid from '../tree-grid';
import AlarmWindowMethod from './utils/event-method';
import { ConfigProvider } from 'oss-ui';
import StatisticsBar from '../alarm-window/statistics-bar';
import themes from '../tree-grid/ossTopo/themes';
import Toolbar from '../toolbar';
import alarmConfig from '../alarm-window/common/config/alarm-window-config.json';
import ToolConfig from '../alarm-window/common/config/toolbar-config';
import DoubleClick from '../alarm-window/doubleClick';
import ContextMenu from '../context-menu';
import AlarmSound from '../alarm-window/alarm-sound';
import CustomFilter from '../alarm-window/customFilters/index';
import MenuConfig from '../alarm-window/common/config/menu-config';
import { generateMenuList, setSelectRowsChildren } from '../alarm-window/common/dataHandler';
import serviceConfig from '../hox';
import Common from '../common';
import "../alarm-window/style/index.css";
import { createFileFlow } from '../common/utils/download';
var rowDataKey = 'original_record_data';
var toolBarActionMap = function toolBarActionMap(eventListener, props, tableRef, onSizeChange) {
  return {
    AlarmSynchronization: eventListener.setAlarmSynchronizationRequest,
    AlarmSound: eventListener.soundSwitchChanged,
    AlarmLock: eventListener.setTableLock,
    AlarmTop: function AlarmTop(record) {
      eventListener.setTopAlarmsRequest(record, function () {
        eventListener.setAlarmTop(null);
        tableRef.current.getSelectionModel().clearSelection();
      });
    },
    AlarmExport: function AlarmExport(value) {
      var exportColumn = _.filter(props.columns, {
        UnColumnModelUsed: false
      }) || [];
      var params = {
        alarmColumnFieldIds: exportColumn.map(function (obj) {
          return obj.sortFieldId;
        }),
        alarmFieldNameList: exportColumn.map(function (obj) {
          return obj.field;
        }),
        // 导出文件格式： 0 csv 1 excel 2 html
        exportFileFormat: value
      };
      eventListener.setAlarmExport(params, function (res) {
        var _serviceConfig$data, _serviceConfig$data$s, _serviceConfig$data$s2, _res$responseDataJSON;
        var url = serviceConfig === null || serviceConfig === void 0 ? void 0 : (_serviceConfig$data = serviceConfig.data) === null || _serviceConfig$data === void 0 ? void 0 : (_serviceConfig$data$s = _serviceConfig$data.serviceConfig) === null || _serviceConfig$data$s === void 0 ? void 0 : (_serviceConfig$data$s2 = _serviceConfig$data$s.otherService) === null || _serviceConfig$data$s2 === void 0 ? void 0 : _serviceConfig$data$s2.viewItemExportUrl;
        // if (res.responseDataJSON.indexOf('http') === -1) {
        //     window.open(url + res.responseDataJSON);
        // } else {
        //     window.open(res.responseDataJSON);
        // }
        // window.open(url + res.responseDataJSON);
        var name = (_res$responseDataJSON = res.responseDataJSON.split('?')[0]) === null || _res$responseDataJSON === void 0 ? void 0 : _res$responseDataJSON.replace('/view/export/', '');
        console.log(res.responseDataJSON, '===', name, url, '====22');
        createFileFlow(name || res.responseDataJSON, url + res.responseDataJSON);
      });
    },
    ColumnSettings: function ColumnSettings(value) {
      eventListener.resetAlarmFieldRequest(value, props.statusModelArray, props.allCol);
    },
    ShowAll: function () {
      var _ShowAll = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var para;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              para = {
                conditionList: [],
                logicalAnd: true,
                not: false
              }; // TODO:method改为promise后 可以决定顺序
              _context.n = 1;
              return eventListener.reset();
            case 1:
              _context.n = 2;
              return eventListener.setParamData(para);
            case 2:
              _context.n = 3;
              return eventListener.setCustomParamData(para);
            case 3:
              return _context.a(2);
          }
        }, _callee);
      }));
      function ShowAll() {
        return _ShowAll.apply(this, arguments);
      }
      return ShowAll;
    }(),
    FoldingState: function FoldingState(type) {
      type ? tableRef.current.expandAll() : tableRef.current.collapseAll();
      eventListener.setFoldingState(type);
    },
    AssociatedAlarmFiltering: function AssociatedAlarmFiltering(toolbarItem) {
      !toolbarItem.active ? eventListener.relationFilterRequest() : eventListener.relationFilterResetRequest();
    },
    CustomFilter: function CustomFilter(value) {
      var para = {
        conditionList: [],
        logicalAnd: true,
        not: false
      };
      eventListener.setParamData(para);
      eventListener.setCustomParamData(value);
      eventListener.secondaryFilterRequest(para, value);
    },
    CapacitySettings: eventListener.setCapacityRequest,
    tableSize: onSizeChange
  };
};
var AlarmWindowNew = /*#__PURE__*/function (_React$PureComponent) {
  function AlarmWindowNew(props) {
    var _this;
    _classCallCheck(this, AlarmWindowNew);
    _this = _callSuper(this, AlarmWindowNew, [props]);
    _this.changeColumnsFilterIcon = function (conditionList) {
      _this.treeGridRef.current.columns.forEach(function (column) {
        column.a('hasFilter', _this.contrastField(conditionList, column.field));
      });
    };
    _this.contrastField = function (conditionList, field) {
      var filteredStatus = false;
      if (typeof field === 'string') {
        filteredStatus = !!_.find(conditionList, {
          fieldName: field
        });
      }
      if (Array.isArray(field)) {
        field.forEach(function (item) {
          if (conditionList && conditionList.length && !!_.find(conditionList, {
            fieldName: item.storeFieldName
          })) {
            filteredStatus = true;
          }
        });
      }
      return filteredStatus;
    };
    /**
     * @description: 更新工具栏状态
     * @returns
     */
    _this.getToolbarItems = function () {
      var _this$props = _this.props,
        contextAndToolbar = _this$props.contextAndToolbar,
        exportHtmlType = _this$props.exportHtmlType,
        extendToolbar = _this$props.extendToolbar,
        toolBarStatus = _this$props.toolBarStatus,
        winType = _this$props.winType;
      var toolBarConfig = [];
      var toolbarArr = (contextAndToolbar === null || contextAndToolbar === void 0 ? void 0 : contextAndToolbar.alarmToolBar[winType]) || alarmConfig.alarmToolBar[winType] || [];
      toolbarArr.forEach(function (item) {
        if (exportHtmlType === false && item === 'AlarmExport') {
          var itemObj = _objectSpread({}, _.find(ToolConfig, {
            key: item
          }));
          if (itemObj) {
            itemObj.dropdownMenus = itemObj.dropdownMenus.filter(function (item) {
              return item.value !== 2;
            });
            toolBarConfig.push(itemObj);
          }
        } else {
          toolBarConfig.push(_objectSpread({}, _.find(ToolConfig, {
            key: item
          })));
        }
      });
      if (extendToolbar && extendToolbar.length) {
        toolBarConfig.push.apply(toolBarConfig, _toConsumableArray(extendToolbar.map(function (item) {
          return _objectSpread(_objectSpread({}, item), {}, {
            isExtend: true
          });
        })));
      }
      return toolBarConfig.map(function (s) {
        return _objectSpread(_objectSpread({}, s), {}, {
          active: toolBarStatus[s.key] || false
        });
      });
    };
    _this.onSizeChange = function (value) {
      _this.setState({
        tableSize: value
      });
    };
    /**
     * @description: 数据格式化
     * @data {*}
     * @element {*}
     */
    _this.dataFormatter = function (data, element) {
      Object.keys(element).forEach(function (key) {
        if (key) {
          data.a(key, element[key]);
        }
      });
      data.a(rowDataKey, element);
    };
    _this.returnOTData = function (element) {
      var data = new window.ot.Data();
      _this.dataFormatter(data, element);
      return data;
    };
    _this.newColumn = function (columns) {
      return columns.map(function (item, index) {
        return _objectSpread(_objectSpread({}, item), {}, {
          name: item.key,
          displayName: item.title || ' ',
          accessType: 'attr',
          getToolTip: function getToolTip(data, tableView) {
            var record = data._attrObject;
            var _ref = item.getDisplayData ? item.getDisplayData(data.getAttr(item.key), record) : {},
              label = _ref.label;
            return label || null;
          },
          drawCell: function drawCell(g, data, selected, column, x, y, w, h, tableView) {
            var record = data._attrObject;
            var _ref2 = item.getDisplayData ? item.getDisplayData(data.getAttr(item.key), record) : {},
              _ref2$label = _ref2.label,
              label = _ref2$label === void 0 ? '' : _ref2$label,
              background = _ref2.background,
              color = _ref2.color,
              selectColor = _ref2.selectColor,
              images = _ref2.images,
              _ref2$align = _ref2.align,
              align = _ref2$align === void 0 ? 'left' : _ref2$align,
              dom = _ref2.dom;
            if (dom) {
              var _Common$Enums$tableRo;
              var cellDiv = document.createElement('div');
              var contentDiv = document.createElement('div');
              cellDiv.style['line-height'] = "".concat(((_Common$Enums$tableRo = Common.Enums.tableRowHeight.get(_this.state.tableSize)) === null || _Common$Enums$tableRo === void 0 ? void 0 : _Common$Enums$tableRo.key) || 18, "px");
              cellDiv.style.height = '100%';
              cellDiv.style.textAlign = align;
              // 清除 底色变化 图片需要
              record.active_status && String(record.active_status.value) !== '1' && _this.props.winType !== 'clear' && !selected && (cellDiv.className += ' clearRowStyle');
              //置顶
              // record.topAlarm === true && (cellDiv.className += ' topAlarmStyle');
              //主子关系
              record.key && record.key.indexOf('#') !== -1 && !selected && (cellDiv.className += ' relationAlarm');
              // 选中
              // Array.isArray(this.props.selectedRowKeys) &&
              //     this.props.selectedRowKeys.includes(record.alarm_id && record.alarm_id.value) &&
              //     (cellDiv.className += ' clickRowStyle');
              contentDiv.style.padding = '0 4px';
              contentDiv.style.width = '100%';
              contentDiv.style.overflow = 'hidden';
              background && (contentDiv.style.background = selected ? window.ot.Default.darker(background) : background);
              // images.forEach((item, i) => {
              //     // if (item.image) {
              //     var imgDiv = document.createElement('div');
              //     imgDiv.style.display = 'inline-block';
              //     imgDiv.style.minWidth = '24px';
              //     var imgSrc = document.createElement('img');
              //     item.image && (imgSrc.src = item.image);
              //     item.image && (imgDiv.title = item.name);
              //     imgDiv.appendChild(imgSrc);
              //     contentDiv.appendChild(imgDiv);
              //     // }
              // });
              // contentDiv.appendChild(React.render(dom));
              ReactDOM.render(dom, contentDiv);
              cellDiv.appendChild(contentDiv);
              // g.beginPath();
              // g.rect(x, y, w, h);
              // g.fill();
              if (!cellDiv.innerHTML) {
                cellDiv.innerHTML = '&nbsp;';
              }
              return cellDiv;
            } else if (images) {
              var _Common$Enums$tableRo2;
              var cellDiv = document.createElement('div');
              var contentDiv = document.createElement('div');
              cellDiv.style['line-height'] = "".concat(((_Common$Enums$tableRo2 = Common.Enums.tableRowHeight.get(_this.state.tableSize)) === null || _Common$Enums$tableRo2 === void 0 ? void 0 : _Common$Enums$tableRo2.key) || 18, "px");
              cellDiv.style.height = '100%';
              cellDiv.style.textAlign = align;
              // 清除 底色变化 图片需要
              record.active_status && String(record.active_status.value) !== '1' && _this.props.winType !== 'clear' && !selected && (cellDiv.className += ' clearRowStyle');
              //置顶
              // record.topAlarm === true && (cellDiv.className += ' topAlarmStyle');
              //主子关系
              record.key && record.key.indexOf('#') !== -1 && !selected && (cellDiv.className += ' relationAlarm');
              // 选中
              // Array.isArray(this.props.selectedRowKeys) &&
              //     this.props.selectedRowKeys.includes(record.alarm_id && record.alarm_id.value) &&
              //     (cellDiv.className += ' clickRowStyle');
              contentDiv.style.padding = '0 4px';
              contentDiv.style.width = '100%';
              contentDiv.style.overflow = 'hidden';
              background && (contentDiv.style.background = selected ? window.ot.Default.darker(background) : background);
              images.forEach(function (item, i) {
                // if (item.image) {
                var imgDiv = document.createElement('div');
                imgDiv.style.display = 'inline-block';
                imgDiv.style.minWidth = '24px';
                var imgSrc = document.createElement('img');
                item.image && (imgSrc.src = item.image);
                item.image && (imgDiv.title = item.name);
                imgDiv.appendChild(imgSrc);
                contentDiv.appendChild(imgDiv);
                // }
              });
              cellDiv.appendChild(contentDiv);
              // g.beginPath();
              // g.rect(x, y, w, h);
              // g.fill();
              if (!cellDiv.innerHTML) {
                cellDiv.innerHTML = '&nbsp;';
              }
              return cellDiv;
            } else {
              if (background) {
                g.fillStyle = selected ? window.ot.Default.darker(background) : background;
                g.beginPath();
                g.rect(x, y, w, h);
                g.fill();
                // 置顶 下划线
                if (record.topAlarm === true) {
                  g.beginPath();
                  g.fillStyle = '#ccc';
                  g.rect(x, y + h - 3, w, 3);
                  g.fill();
                }
              }
              var fontColor = selected ? selectColor || tableView._labelSelectColor : color || tableView._labelColor;
              // let fontColor = color || null;

              var labelFont = tableView.getLabelFont();
              // 未读 字体变粗
              if (_this.props.hasReadKey && !_this.props.hasReadKey.has(record.alarm_id && record.alarm_id.value)) {
                labelFont = '600 ' + labelFont;
              }
              // 清除 字体颜色变化
              if (record.active_status && String(record.active_status.value) !== '1' && _this.props.winType !== 'clear') {
                var _themes;
                !color && (fontColor = (_themes = themes[_this.props.theme || 'light']) === null || _themes === void 0 ? void 0 : _themes.clearAlarmTextColor);
              }
              // 二次过滤 文字颜色变化
              if (record.secondary_filter && String(record.secondary_filter.value) === 'false') {
                var _themes2;
                !color && (fontColor = (_themes2 = themes[_this.props.theme || 'light']) === null || _themes2 === void 0 ? void 0 : _themes2.secondaryFilterWrongSlarmTextColor);
              }
              window.ot.Default.drawText(g, label, labelFont, fontColor, x, y, w, h, align);
            }
          },
          filterDropdown: function filterDropdown(column, _ref3) {
            var confirm = _ref3.confirm;
            return /*#__PURE__*/React.createElement(CustomFilter, {
              confirm: confirm,
              eventListener: _this.eventListener,
              coustomFilterType: column.coustomFilterType,
              colData: item,
              paramData: _this.props.paramData,
              customParamData: _this.props.customParamData,
              dropdownVisible: columns.dropdownVisible,
              theme: _this.props.theme || 'light'
            });
          }
        });
      });
    };
    _this.add = function (data) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var insertIndex = index;
      if (index === null) {
        insertIndex = _this.treeGridRef.current.datasource.size();
      }
      _this.treeGridRef.current.datasource.add(data, insertIndex);
    };
    _this.remove = function (data) {
      _this.treeGridRef.current.datasource.remove(data);
    };
    _this.clear = function () {
      _this.treeGridRef.current.datasource.clear();
    };
    _this.moveToTop = function (data) {
      _this.treeGridRef.current.datasource.moveToTop(data);
    };
    _this.cloneData = function (data) {
      return window.ot.Default.clone(data);
    };
    _this.getTreeGridRef = function () {
      return _this.treeGridRef;
    };
    _this.invalidateModel = function () {
      _this.treeGridRef.current.invalidateModel();
    };
    _this.removeClearAlarm = function () {
      if (_this.props.winType === 'active') {
        _this.treeGridRef.current.setVisibleFunc(function (data) {
          var _data$_attrObject$ori, _data$_attrObject$ori2, _data$_attrObject$ori3, _data$_attrObject$ori4;
          // 非子告警 or 活动告警 or （清除告警 and 子告警并非全部清除） 才可以显示
          return (data === null || data === void 0 ? void 0 : data.getParent()) === null || (data === null || data === void 0 ? void 0 : (_data$_attrObject$ori = data._attrObject.original_record_data) === null || _data$_attrObject$ori === void 0 ? void 0 : (_data$_attrObject$ori2 = _data$_attrObject$ori.active_status) === null || _data$_attrObject$ori2 === void 0 ? void 0 : _data$_attrObject$ori2.value) === '1' || (data === null || data === void 0 ? void 0 : (_data$_attrObject$ori3 = data._attrObject.original_record_data) === null || _data$_attrObject$ori3 === void 0 ? void 0 : (_data$_attrObject$ori4 = _data$_attrObject$ori3.active_status) === null || _data$_attrObject$ori4 === void 0 ? void 0 : _data$_attrObject$ori4.value) !== '1' && _this.hasActiveChildren(data);
        });
      }
    };
    _this.hasActiveChildren = function (data) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (result) {
        return result;
      }
      if (data.hasChildren()) {
        data.eachChild(function (child) {
          result = _this.isChildrenClearAlarm(child, result);
        });
        return result;
      } else {
        var _data$_attrObject$ori5, _data$_attrObject$ori6;
        return (data === null || data === void 0 ? void 0 : (_data$_attrObject$ori5 = data._attrObject.original_record_data) === null || _data$_attrObject$ori5 === void 0 ? void 0 : (_data$_attrObject$ori6 = _data$_attrObject$ori5.active_status) === null || _data$_attrObject$ori6 === void 0 ? void 0 : _data$_attrObject$ori6.value) === '1';
      }
    };
    _this.onTableDoubleClick = function (otdata, record) {
      _this.props.onTableSelect && _this.props.onTableSelect([record.alarm_id.value], _this.props.registerInfo, 'click');
      _this.eventListener.setAlarmRead([otdata._attrObject.noRepeatKey]);
      _this.setState({
        alarmTextVisible: true,
        alarmClickTarget: record
      });
    };
    _this.doubleOnCancel = function () {
      _this.setState({
        alarmTextVisible: false,
        alarmClickTarget: null
      });
    };
    _this.onTableContextMenu = function (event, otdata, record, selected) {
      var _serviceConfig$data2, _serviceConfig$data2$, _serviceConfig$data2$2;
      var _this$props2 = _this.props,
        winType = _this$props2.winType,
        contextAndToolbar = _this$props2.contextAndToolbar,
        extendContextMenu = _this$props2.extendContextMenu,
        registerInfo = _this$props2.registerInfo,
        _this$props2$onTableS = _this$props2.onTableSelect,
        onTableSelect = _this$props2$onTableS === void 0 ? null : _this$props2$onTableS;
      var selectRows = _this.state.selectRows;
      //由配置文件构造右键弹窗内容;
      var menuRelationship = (contextAndToolbar === null || contextAndToolbar === void 0 ? void 0 : contextAndToolbar.alarmContextMenu[winType]) || alarmConfig.alarmContextMenu[winType];
      var menuMap = MenuConfig;
      // 外部传入的扩展右键菜单配置（支持右键菜单二次开发）
      if (extendContextMenu && extendContextMenu.length) {
        menuMap = menuMap.concat(extendContextMenu);
      }
      if (serviceConfig === null || serviceConfig === void 0 ? void 0 : (_serviceConfig$data2 = serviceConfig.data) === null || _serviceConfig$data2 === void 0 ? void 0 : (_serviceConfig$data2$ = _serviceConfig$data2.serviceConfig) === null || _serviceConfig$data2$ === void 0 ? void 0 : (_serviceConfig$data2$2 = _serviceConfig$data2$.userInfo) === null || _serviceConfig$data2$2 === void 0 ? void 0 : _serviceConfig$data2$2.buttonAuthorize) {
        menuMap = menuMap.filter(function (menu) {
          var _serviceConfig$data3, _serviceConfig$data3$, _serviceConfig$data3$2;
          return _.find(serviceConfig === null || serviceConfig === void 0 ? void 0 : (_serviceConfig$data3 = serviceConfig.data) === null || _serviceConfig$data3 === void 0 ? void 0 : (_serviceConfig$data3$ = _serviceConfig$data3.serviceConfig) === null || _serviceConfig$data3$ === void 0 ? void 0 : (_serviceConfig$data3$2 = _serviceConfig$data3$.userInfo) === null || _serviceConfig$data3$2 === void 0 ? void 0 : _serviceConfig$data3$2.operationsButton, function (item) {
            var _item$key;
            return ((_item$key = item.key) === null || _item$key === void 0 ? void 0 : _item$key.split(':')[0]) === menu.key;
          });
        });
      }
      var contextMenuList = generateMenuList(menuMap, menuRelationship);
      var selectOtdata = selected.getSelection()._as;
      var newSelectRows = setSelectRowsChildren(selectOtdata, true);
      // 如果右键点击的是不是已经多选的告警，只会选中右键的这条
      if (!_.find(newSelectRows, function (item) {
        var _item$alarm_id, _record$alarm_id;
        return ((_item$alarm_id = item.alarm_id) === null || _item$alarm_id === void 0 ? void 0 : _item$alarm_id.value) === ((_record$alarm_id = record.alarm_id) === null || _record$alarm_id === void 0 ? void 0 : _record$alarm_id.value);
      })) {
        newSelectRows = [record];
      }
      _this.listenClick();
      _this.eventListener.setAlarmRead([otdata._attrObject.noRepeatKey]);
      onTableSelect && onTableSelect([record.alarm_id.value], registerInfo, 'contextmenu');
      _this.setState({
        originEvent: event,
        contextMenuList: contextMenuList,
        showContextMenu: true,
        selectRows: newSelectRows,
        alarmClickTarget: record
      });
    };
    _this.contextMenuClose = function () {
      _this.setState({
        showContextMenu: false
      });
    };
    _this.listenClickCallback = function (e) {
      var _$get, _$get2;
      if (!(((_$get = _.get(e, 'target.className', '')) === null || _$get === void 0 ? void 0 : _$get.split) && ((_$get2 = _.get(e, 'target.className', '')) === null || _$get2 === void 0 ? void 0 : _$get2.split(' ').includes('oss-alarm-window-content-menu-item')))) {
        _this.contextMenuClose();
        _this.removeListenClick();
      }
    };
    // 监听鼠标左键
    _this.listenClick = function () {
      window.addEventListener('click', _this.listenClickCallback, true);
      window.addEventListener('contextmenu', _this.listenClickCallback, true);
    };
    // 移除鼠标左键监听
    _this.removeListenClick = function () {
      window.removeEventListener('click', _this.listenClickCallback, false);
      window.removeEventListener('contextmenu', _this.listenClickCallback, false);
    };
    _this.onClick = function (otdata, record, selectRows) {
      var selectOtdata = selectRows.getSelection()._as;
      var newSelectRows = setSelectRowsChildren(selectOtdata, true); // selectRows.getSelection()._as.map((item) => item.getAttr('original_record_data'));
      _this.props.onTableSelect && _this.props.onTableSelect([record.alarm_id.value], _this.props.registerInfo, 'click');
      _this.eventListener.setAlarmRead(selectOtdata.map(function (item) {
        return item._attrObject.noRepeatKey;
      }));
      _this.eventListener.setAlarmTop(newSelectRows.map(function (item) {
        return item.alarm_id.value;
      }));
      _this.setState({
        selectRows: newSelectRows
      });
    };
    _this.onTableEnd = function (_ref4) {
      var startRowIndex = _ref4.startRowIndex,
        endRowIndex = _ref4.endRowIndex,
        e = _ref4.e;
      if (!_this.state.loading) {
        _this.eventListener.onTableEnd(endRowIndex);
        _this.setState({
          loading: true
        });
        setTimeout(function () {
          _this.setState({
            loading: false
          });
        }, 2000);
      }
    };
    _this.showAll = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var para;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            para = {
              conditionList: [],
              logicalAnd: true,
              not: false
            };
            _context2.n = 1;
            return _this.eventListener.secondaryFilterRequest('reset');
          case 1:
            _context2.n = 2;
            return _this.eventListener.setParamData(para);
          case 2:
            _context2.n = 3;
            return _this.eventListener.setCustomParamData(para);
          case 3:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    _this.tableSort = function (column, event, order) {
      var sortData = {};
      // 只能单条排序
      if (order) {
        var asc;
        if (order === 'asc') {
          asc = true;
        } else {
          asc = false;
        }
        sortData.sortFieldId = column.sortFieldId;
        sortData.sortByAsc = asc;
      } else {
        sortData.sortFieldId = '';
        sortData.sortByAsc = '';
      }
      _this.eventListener.getSortBatchRequest(sortData);
    };
    _this.onStatistBarClick = function (param) {
      _this.eventListener.setParamData(param);
      _this.eventListener.secondaryFilterRequest(param, _this.props.customParamData);
    };
    _this.getAlarmStat = function () {
      _this.eventListener.alarmStatRequest();
    };
    _this.clearParam = function () {
      var parma = {
        conditionList: [],
        logicalAnd: true,
        not: false
      };
      _this.eventListener.setParamData(parma);
    };
    _this.userRecordSave = function (column, dataSource) {
      if (_this.treeGridRef.current && _this.treeGridRef.current.datasource.size() !== 0) {
        var newColumn = column.map(function (item) {
          return _objectSpread(_objectSpread({}, item), {}, {
            width: item._width
          });
        });
        _this.eventListener.userBehaviorRecord(newColumn);
      }
    };
    _this.treeGridRef = /*#__PURE__*/React.createRef();
    _this.eventListener = new AlarmWindowMethod();
    _this.state = {
      stateSyncInfo: {
        syncVisible: false,
        syncInfo: null
      },
      selectRows: [],
      toolbarItems: _this.getToolbarItems(),
      alarmTextVisible: false,
      alarmClickTarget: null,
      originEvent: null,
      showContextMenu: false,
      contextMenuList: null,
      tableSize: props.defaultSize,
      loading: false
    };

    //TODO: 翻页功能需要防抖么？
    // this.onTableEnd = _.debounce(this.onTableEnd, 1000);
    // this.onDataPropertyChanged = _.debounce(this.onDataPropertyChanged, 500);

    _this.userRecordSave = _.debounce(_this.userRecordSave, 2000);
    return _this;
  }
  _inherits(AlarmWindowNew, _React$PureComponent);
  return _createClass(AlarmWindowNew, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _serviceConfig$data4;
      var _this$props3 = this.props,
        winType = _this$props3.winType,
        filterId = _this$props3.filterId,
        onWindowShowChangeHandler = _this$props3.onWindowShowChangeHandler;
      document.getElementById("alarm-window-operation-bar-".concat(winType, "-").concat(filterId)).addEventListener('dblclick', function () {
        onWindowShowChangeHandler(winType);
      });
      (serviceConfig === null || serviceConfig === void 0 ? void 0 : (_serviceConfig$data4 = serviceConfig.data) === null || _serviceConfig$data4 === void 0 ? void 0 : _serviceConfig$data4.removeClearAlarm) && this.removeClearAlarm();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$props4 = this.props,
        winType = _this$props4.winType,
        filterId = _this$props4.filterId;
      document.getElementById("alarm-window-operation-bar-".concat(winType, "-").concat(filterId)).removeEventListener('dblclick', function () {});
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this2 = this,
        _this$props5,
        _this$props5$paramDat,
        _prevProps$paramData;
      if (JSON.stringify(this.props.columns) !== JSON.stringify(prevProps.columns)) {
        this.treeGridRef.current.columns = this.newColumn(this.props.columns);
      }
      if (JSON.stringify(this.props.toolBarStatus) !== JSON.stringify(prevProps.toolBarStatus)) {
        this.setState({
          toolbarItems: this.getToolbarItems()
        });
      }
      if (JSON.stringify(this.props.syncResultInfo) !== JSON.stringify(prevProps.syncResultInfo)) {
        if (this.props.syncResultInfo) {
          this.setState({
            stateSyncInfo: {
              syncVisible: true,
              syncInfo: _objectSpread({}, this.props.syncResultInfo)
            }
          });
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
          _this2.setState({
            stateSyncInfo: {
              syncVisible: false,
              syncInfo: null
            }
          });
        }, 10000);
      }
      if (JSON.stringify((_this$props5 = this.props) === null || _this$props5 === void 0 ? void 0 : (_this$props5$paramDat = _this$props5.paramData) === null || _this$props5$paramDat === void 0 ? void 0 : _this$props5$paramDat.conditionList) !== JSON.stringify((_prevProps$paramData = prevProps.paramData) === null || _prevProps$paramData === void 0 ? void 0 : _prevProps$paramData.conditionList)) {
        var _this$props6, _this$props6$paramDat;
        this.changeColumnsFilterIcon((_this$props6 = this.props) === null || _this$props6 === void 0 ? void 0 : (_this$props6$paramDat = _this$props6.paramData) === null || _this$props6$paramDat === void 0 ? void 0 : _this$props6$paramDat.conditionList);
      }
    }
  }, {
    key: "render",
    value:
    //TODO:需要优化e
    // onDataPropertyChanged = (e) => {
    //     this.treeGridRef.current && this.treeGridRef.current.invalidateModel();
    // };

    function render() {
      var _this3 = this,
        _props$toolBarStatus;
      var _this$state = this.state,
        stateSyncInfo = _this$state.stateSyncInfo,
        selectRows = _this$state.selectRows,
        toolbarItems = _this$state.toolbarItems,
        alarmTextVisible = _this$state.alarmTextVisible,
        alarmClickTarget = _this$state.alarmClickTarget,
        originEvent = _this$state.originEvent,
        showContextMenu = _this$state.showContextMenu,
        contextMenuList = _this$state.contextMenuList;
      var _this$props7 = this.props,
        _this$props7$onDouble = _this$props7.onDoubleClick,
        onDoubleClick = _this$props7$onDouble === void 0 ? null : _this$props7$onDouble,
        _this$props7$onContex = _this$props7.onContextMenu,
        _onContextMenu = _this$props7$onContex === void 0 ? null : _this$props7$onContex,
        _this$props7$onClick = _this$props7.onClick,
        onClick = _this$props7$onClick === void 0 ? null : _this$props7$onClick;
      var props = this.props;
      return /*#__PURE__*/React.createElement("div", {
        className: "alarm-window ".concat(props.theme || 'light')
      }, /*#__PURE__*/React.createElement(ConfigProvider, {
        prefixCls: "oss-ui"
      }, /*#__PURE__*/React.createElement("div", {
        className: "alarm-window-operation-bar",
        id: "alarm-window-operation-bar-".concat(props.winType, "-").concat(props.filterId)
      }, /*#__PURE__*/React.createElement("div", {
        className: "alarm-window-operation-bar-left"
      }, /*#__PURE__*/React.createElement(StatisticsBar, {
        className: "statistics-bar",
        statItems: props.statisticsItems,
        operationBar: props.operationBar,
        onClick: this.onStatistBarClick,
        getAlarmStat: this.getAlarmStat,
        winType: props.winType,
        clearParam: this.clearParam,
        paramData: props.paramData,
        customParamData: props.customParamData,
        eventListener: this.eventListener,
        stateSyncInfo: stateSyncInfo,
        syncResultInfo: props.syncResultInfo,
        getContainer: props.getContainer
      })), /*#__PURE__*/React.createElement("div", {
        className: "alarm-window-operation-bar-right"
      }, props.toolBarRender && /*#__PURE__*/React.createElement("div", {
        className: "alarm-window-operation-bar-inline"
      }, props.toolBarRender()), /*#__PURE__*/React.createElement(Toolbar, {
        className: "alarm-window-toolbar",
        selectRows: selectRows,
        columns: props.columns,
        allCol: props.allCol,
        theme: props.theme,
        toolbarItems: toolbarItems,
        customParamData: props.customParamData,
        maxAlarmSize: props.maxAlarmSize,
        modalContainer: props.getContainer,
        filterId: props.filterId,
        winType: props.winType,
        filterNameList: props.filterNameList,
        moduleIdList: props.moduleIdList,
        actionMap: toolBarActionMap(this.eventListener, this.props, this.treeGridRef, this.onSizeChange),
        extendEventMap: props.extendEventMap,
        eventListener: this.eventListener,
        externalComp: props.externalComp
      }))), /*#__PURE__*/React.createElement(TreeGrid, {
        className: "alarm-window ".concat(props.theme || 'light'),
        theme: props.theme,
        rowDataKey: rowDataKey,
        ref: this.treeGridRef,
        winType: props.winType,
        handleSort: function handleSort(column, event, order) {
          _this3.tableSort(column, event, order);
        },
        onCellClicked: function onCellClicked(otdata, record, dataIndex) {
          _this3.props.onCellClick && _this3.props.onCellClick(otdata, record, dataIndex);
        },
        onRowClicked: function onRowClicked(otdata, record, selectRows) {
          onClick ? onClick() : _this3.onClick(otdata, record, selectRows);
        },
        onRowDoubleClicked: function onRowDoubleClicked(otdata, record) {
          onDoubleClick ? onDoubleClick(record) : _this3.onTableDoubleClick(otdata, record);
        },
        onContextMenu: function onContextMenu(event, otdata, record, selectRows) {
          _onContextMenu ? _onContextMenu(event, otdata, record, selectRows) : _this3.onTableContextMenu(event, otdata, record, selectRows);
        },
        onScrollY: function onScrollY(startRowIndex, endRowIndex, e) {},
        scrollBottom: function scrollBottom(startRowIndex, endRowIndex, e) {
          e.newValue < e.oldValue && _this3.onTableEnd({
            startRowIndex: startRowIndex,
            endRowIndex: endRowIndex,
            e: e
          });
        },
        onTableHeaderChangeHandler: this.userRecordSave,
        tableSize: this.state.tableSize,
        loading: this.state.loading,
        customFilterHandle: props.customFilterHandle
      }), /*#__PURE__*/React.createElement(ContextMenu, {
        originEvent: originEvent,
        showContextMenu: showContextMenu,
        onContextMenuClose: this.contextMenuClose,
        menuList: contextMenuList,
        selectRows: selectRows,
        alarmClickTarget: alarmClickTarget
        // otSelection={this.treeGridRef?.current?.getSelectionModel()?.getSelection()?._as || []}
        ,
        getRecordsDetail: this.eventListener.onContextMenuClick,
        actionMap: {
          AlarmExport: this.eventListener.setAlarmExport
        },
        extendEventMap: props.extendEventMap,
        useCol: _.filter(props.columns, {
          UnColumnModelUsed: false
        }) || [],
        shareActions: props.shareActions,
        theme: props.theme,
        exportHtmlType: props.exportHtmlType,
        getContainer: props.getContainer,
        experienceUrl: props.experienceUrl
      }), /*#__PURE__*/React.createElement(DoubleClick, {
        visible: alarmTextVisible,
        textTarget: alarmClickTarget,
        registerInfo: props.registerInfo,
        onCancel: this.doubleOnCancel,
        getContainer: props.getContainer,
        eventListener: this.eventListener,
        doubleClickType: props.doubleClickType,
        theme: props.theme,
        columns: props.columns
      }), !!((_props$toolBarStatus = props.toolBarStatus) === null || _props$toolBarStatus === void 0 ? void 0 : _props$toolBarStatus.AlarmSound) && /*#__PURE__*/React.createElement(AlarmSound, {
        alarmSoundList: props.soundAlarmList,
        alarmSoundStatus: props.toolBarStatus.AlarmSound
      })));
    }
  }]);
}(React.PureComponent);
AlarmWindowNew.defaultProps = {};
export default AlarmWindowNew;