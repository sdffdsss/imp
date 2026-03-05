function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
import React, { useState, useRef, useMemo, useImperativeHandle, useEffect, useLayoutEffect } from 'react';
import ReactDragListView from 'react-drag-listview';
import { produce } from 'immer';
import { _ } from 'oss-web-toolkits';
import { Icon, Table, ConfigProvider, Tooltip } from 'oss-ui';
import classnames from 'classnames';
import AlarmWindowMethod from './utils/event-method';
import DoubleClick from './doubleClick'; // 告警正文
import { VirtualTable } from './virtual-table';
import StatisticsBar from './statistics-bar';
import AlarmSound from './alarm-sound';
import MenuConfig from './common/config/menu-config';
import ToolConfig from './common/config/toolbar-config';
import CustomFilter from './customFilters/index';
import { tableComponent } from './table-header';
// import AlarmDetails from '../context-menu/menu-components/alarm-details';
import ContextMenu from '../context-menu';
import Toolbar from '../toolbar';
import alarmConfig from './common/config/alarm-window-config.json';
import { generateMenuList, getRecordsRecursion, getRecordDetail } from './common/dataHandler';
import serviceConfig from '../hox';
import ExpandIcon from './expand-icon';
import customizeRenderEmpty from './customize-render-empty';
import zhCN from 'oss-ui/lib/locale/zh_CN';
import { createFileFlow } from '../common/utils/download';
import "./style/index.css";
var FilteredIcon = /*#__PURE__*/React.memo(function (props) {
  var paramData = props.paramData,
    col = props.col;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    filterStatus = _useState2[0],
    setFilterStatus = _useState2[1];
  useEffect(function () {
    var filteredStatus = false;
    if (paramData && paramData.conditionList && paramData.conditionList.length && typeof col.field === 'string') {
      filteredStatus = !!_.find(paramData.conditionList, {
        fieldName: col.field
      });
    }
    if (Array.isArray(col.field)) {
      col.field.forEach(function (item) {
        if (paramData && paramData.conditionList && paramData.conditionList.length && !!_.find(paramData.conditionList, {
          fieldName: item.key
        })) {
          filteredStatus = true;
        }
      });
    }
    setFilterStatus(filteredStatus);
  }, [col.field, paramData]);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    type: "iconguolv1",
    style: {
      color: filterStatus ? '#5f9fe3' : '#5b5b5b'
    }
  }));
});
var AlarmWindow = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _props$toolBarStatus;
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    loading = _useState4[0],
    setLoading = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    showContextMenu = _useState6[0],
    setShowContextMenu = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    menuList = _useState8[0],
    setMenuList = _useState8[1];
  // const [recordsDetail, setRecordsDetail] = useState([]);
  var _useState9 = useState(false),
    _useState0 = _slicedToArray(_useState9, 2),
    alarmTextVisible = _useState0[0],
    setAlarmTextVisible = _useState0[1];
  var hasReadKey = useRef(new Set());
  var _useState1 = useState([]),
    _useState10 = _slicedToArray(_useState1, 2),
    toolbarItems = _useState10[0],
    setToolbarItems = _useState10[1];
  var _useState11 = useState(null),
    _useState12 = _slicedToArray(_useState11, 2),
    originEvent = _useState12[0],
    setOriginEvent = _useState12[1];
  var _useState13 = useState([]),
    _useState14 = _slicedToArray(_useState13, 2),
    columns = _useState14[0],
    setColumns = _useState14[1];
  var _useState15 = useState([]),
    _useState16 = _slicedToArray(_useState15, 2),
    selectedRowKeys = _useState16[0],
    setSelectedRowKeys = _useState16[1];
  var _useState17 = useState([]),
    _useState18 = _slicedToArray(_useState17, 2),
    expandedRowKeys = _useState18[0],
    setExpandedRowKeys = _useState18[1];
  var _useState19 = useState(null),
    _useState20 = _slicedToArray(_useState19, 2),
    alarmClickTarget = _useState20[0],
    setAlarmClickTarget = _useState20[1];
  var relationListChildren = useRef([]);
  var vTable = useRef(null);
  var pTable = useRef(null);
  var virtualTablePageRef = useRef(null);
  var searchTableRef = useRef(null);
  var eventListener = useMemo(function () {
    return new AlarmWindowMethod();
  }, []);
  var frameInfo = serviceConfig.data.serviceConfig.userInfo;
  var modalContainer = props.getContainer;
  var _useState21 = useState(props.defaultSize),
    _useState22 = _slicedToArray(_useState21, 2),
    tableSize = _useState22[0],
    setTableSize = _useState22[1];
  var _useState23 = useState({
      syncVisible: false,
      syncInfo: null
    }),
    _useState24 = _slicedToArray(_useState23, 2),
    stateSyncInfo = _useState24[0],
    setStateSyncInfo = _useState24[1];
  var _useState25 = useState(false),
    _useState26 = _slicedToArray(_useState25, 2),
    alarmTextLoading = _useState26[0],
    setAlarmTextLoading = _useState26[1];
  var handleFetchTimer = useRef(null);
  var isShift = useRef(false);
  var originShiftKey = useRef(-1);

  // didMount
  useEffect(function () {
    var keyUpDownHandler = function keyUpDownHandler(code) {
      var shiftKey = code.shiftKey;
      // 这个是获取键盘按住事件
      isShift.current = shiftKey;
    };
    // 直接调用流水窗时，如告警查询也要读配置中心的配置
    if (props.frameInfo && props.pagination) {
      serviceConfig.data.setServiceConfig(props.frameInfo);
    }
    window.addEventListener('keydown', keyUpDownHandler);
    window.addEventListener('keyup', keyUpDownHandler);
    return function () {
      window.removeEventListener('keydown', keyUpDownHandler);
      window.removeEventListener('keyup', keyUpDownHandler);
    };
  }, []);
  var getRecordsDetail = props.extendEventMap && props.extendEventMap.getRecordsDetail ? props.extendEventMap.getRecordsDetail : eventListener.onContextMenuClick;
  useEffect(function () {
    if (props.expandedRowKeys) {
      setExpandedRowKeys(props.expandedRowKeys);
    }
  }, [props.expandedRowKeys]);
  useEffect(function () {
    if (props.dataSource.length === 0) {
      setExpandedRowKeys([]);
    }
  }, [props.dataSource]);
  useEffect(function () {
    var _props$contextAndTool;
    var toolBarConfig = [];
    var toolbarArr = (props === null || props === void 0 ? void 0 : (_props$contextAndTool = props.contextAndToolbar) === null || _props$contextAndTool === void 0 ? void 0 : _props$contextAndTool.alarmToolBar[props.winType]) || alarmConfig.alarmToolBar[props.winType] || [];
    toolbarArr.forEach(function (item) {
      if (props.exportHtmlType === false && item === 'AlarmExport') {
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
    if (props.extendToolbar && props.extendToolbar.length) {
      toolBarConfig = toolBarConfig.concat(props.extendToolbar.map(function (item) {
        return _objectSpread(_objectSpread({}, item), {}, {
          isExtend: true
        });
      }));
    }
    toolBarConfig.forEach(function (itemConfig) {
      itemConfig.active = props.toolBarStatus[itemConfig.key] || false;
    });
    setToolbarItems(toolBarConfig);

    // TODO:引入深比较后需更改
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.toolBarStatus
  // props.toolBarStatus.AlarmLock,
  // props.toolBarStatus.FoldingState,
  // props.toolBarStatus.AlarmTop,
  // props.toolBarStatus.AlarmSound,
  // props.toolBarStatus.CustomFilter,
  // props.toolBarStatus.AssociatedAlarmFiltering,
  ]);
  useEffect(function () {
    if (props.syncResultInfo && !props.syncResultInfo.end) {
      setStateSyncInfo({
        syncVisible: true,
        syncInfo: null
      });
    } else if (props.syncResultInfo && props.syncResultInfo.end) {
      setStateSyncInfo({
        syncVisible: true,
        syncInfo: _objectSpread({}, props.syncResultInfo)
      });
      var timer = setTimeout(function () {
        setStateSyncInfo({
          syncVisible: false,
          syncInfo: _objectSpread({}, props.syncResultInfo)
        });
        clearTimeout(timer);
      }, 10000);
    }
  }, [props.syncResultInfo]);
  var allCol = props.allCol,
    dataSource = props.dataSource,
    paramData = props.paramData;
  useEffect(function () {
    var beforeColumns = props.columns || [];
    var nextColumns = columnsFormatter(beforeColumns);
    setColumns(nextColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.columns]);
  useEffect(function () {
    var beforeColumns = columns || [];
    var nextColumns = columnsFormatter(beforeColumns);
    if (nextColumns && nextColumns.length) {
      setColumns(nextColumns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.paramData, props.customParamData]);
  var columnRef = useRef(null);
  useEffect(function () {
    columnRef.current = columns;
  }, [columns]);
  useEffect(function () {
    if (virtualTablePageRef && virtualTablePageRef.current) {
      var tBody = virtualTablePageRef.current.getElementsByClassName('oss-ui-table-body')[0];
      if (tBody) {
        tBody.style.height = "".concat(props.scrollY, "px");
      }
    }
  }, [props.scrollY, virtualTablePageRef.current]);
  useLayoutEffect(function () {
    if (virtualTablePageRef && virtualTablePageRef.current) {
      var tBody = virtualTablePageRef.current.getElementsByClassName('oss-ui-table-body')[0];
      if (tBody) {
        tBody.style.height = "".concat(props.scrollY, "px");
      }
    }
  }, [props.scrollY]);
  useEffect(function () {
    calcPageAlarmSize();
  }, [props.scrollY, searchTableRef.current]);
  useLayoutEffect(function () {
    calcPageAlarmSize();
  }, [props.scrollY]);
  var calcPageAlarmSize = function calcPageAlarmSize() {
    if (searchTableRef && searchTableRef.current) {
      var tBody = searchTableRef.current.getElementsByClassName('oss-ui-table-body')[0];
      if (tBody) {
        tBody.style.height = "".concat(props.scrollY, "px");
      }
      if (!props.dataSource || !props.dataSource.length) {
        var emptyBody = searchTableRef.current.getElementsByClassName('oss-imp-alarm-empty')[0];
        if (emptyBody) {
          emptyBody.style.height = "".concat(props.scrollY - 50, "px");
        }
      }
    }
  };
  var columnsFormatter = function columnsFormatter(beforeColumns) {
    var next = beforeColumns.map(function (col, index) {
      return _objectSpread(_objectSpread({}, col), {}, {
        width: Number(col.width || 120),
        filterIcon: /*#__PURE__*/React.createElement(FilteredIcon, {
          paramData: paramData,
          col: col
        }),
        onHeaderCell: function onHeaderCell(column) {
          return {
            width: Number(column.width || 120),
            // 100 没有设置宽度可以在此写死 例如100试下
            onResize: handleResize(index)
          };
        },
        filterDropdown: paramData && index > 0 ? function (_ref) {
          var param = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
          // setSelectedKeys, selectedKeys, confirm, clearFilters
          return /*#__PURE__*/React.createElement(CustomFilter, _extends({}, param, {
            eventListener: eventListener,
            coustomFilterType: col.coustomFilterType,
            colData: col,
            paramData: paramData,
            customParamData: props.customParamData,
            dropdownVisible: col.dropdownVisible
          }));
        } : false,
        onFilterDropdownVisibleChange: function onFilterDropdownVisibleChange(visible) {
          col.dropdownVisible = visible;
        }
      });
    });
    return next;
  };

  // table单击
  var onTableClick = function onTableClick(event, record) {
    var _record$alarm_id;
    eventListener.onTableClick(event, record);
    hasReadKey.current.add(record === null || record === void 0 ? void 0 : (_record$alarm_id = record.alarm_id) === null || _record$alarm_id === void 0 ? void 0 : _record$alarm_id.value);
  };

  // table双击
  var onTableDoubleClick = function onTableDoubleClick(event, record) {
    if (props.doubleClickType === 0) {
      setAlarmTextVisible(true);
      setAlarmClickTarget(record);
    } else {
      setAlarmTextLoading(true);
      setAlarmTextVisible(true);
      setAlarmClickTarget(record);
    }
  };
  var selectRows = useMemo(function () {
    var selectRecords = [];
    var _getMatchAlarms = function getMatchAlarms(arr) {
      arr && arr.forEach(function (item) {
        var _item$alarm_id2;
        var isExist = selectRecords.some(function (record) {
          var _record$alarm_id2, _item$alarm_id;
          return ((_record$alarm_id2 = record.alarm_id) === null || _record$alarm_id2 === void 0 ? void 0 : _record$alarm_id2.value) === ((_item$alarm_id = item.alarm_id) === null || _item$alarm_id === void 0 ? void 0 : _item$alarm_id.value);
        });
        if (!isExist && Array.isArray(selectedRowKeys) && selectedRowKeys.includes((_item$alarm_id2 = item.alarm_id) === null || _item$alarm_id2 === void 0 ? void 0 : _item$alarm_id2.value)) {
          selectRecords.push(item);
        } else if (Array.isArray(item.children)) {
          _getMatchAlarms(item.children);
        }
      });
    };
    var currentDatasource = dataSource;
    _getMatchAlarms(currentDatasource);
    return selectRecords;
  }, [selectedRowKeys, dataSource]);
  var handleFetch = function handleFetch(index) {
    if (!loading) {
      setLoading(true);
      index !== 0 && eventListener.onTableEnd(index);
      return new Promise(function (resolve) {
        var timer = setTimeout(function () {
          setLoading(false);
          resolve(timer);
        }, 2000);
      }).then(function (timer) {
        clearTimeout(timer);
      });
    }
  };
  var onTableContextMenu = function onTableContextMenu(event, record) {
    var _record$alarm_id3, _props$contextAndTool2, _props$frameInfo, _props$frameInfo$user;
    setOriginEvent(event);
    setSelectRow(event, record);
    setAlarmClickTarget(record);
    hasReadKey.current.add((_record$alarm_id3 = record.alarm_id) === null || _record$alarm_id3 === void 0 ? void 0 : _record$alarm_id3.value);
    //由配置文件构造右键弹窗内容;
    var menuRelationship = (props === null || props === void 0 ? void 0 : (_props$contextAndTool2 = props.contextAndToolbar) === null || _props$contextAndTool2 === void 0 ? void 0 : _props$contextAndTool2.alarmContextMenu[props.winType]) || alarmConfig.alarmContextMenu[props.winType];
    var menuMap = MenuConfig;
    // 外部传入的扩展右键菜单配置（支持右键菜单二次开发）
    if (props.extendContextMenu && props.extendContextMenu.length) {
      menuMap = menuMap.concat(props.extendContextMenu);
    }
    if (props === null || props === void 0 ? void 0 : (_props$frameInfo = props.frameInfo) === null || _props$frameInfo === void 0 ? void 0 : (_props$frameInfo$user = _props$frameInfo.userInfo) === null || _props$frameInfo$user === void 0 ? void 0 : _props$frameInfo$user.buttonAuthorize) {
      menuMap = menuMap.filter(function (menu) {
        return _.find(props.frameInfo.userInfo.operationsButton, function (item) {
          var _item$key;
          return ((_item$key = item.key) === null || _item$key === void 0 ? void 0 : _item$key.split(':')[0]) === menu.key;
        });
      });
    }
    var menuList = generateMenuList(menuMap, menuRelationship);
    setMenuList(menuList);
    setShowContextMenu(true);
    event.persist();
    listenClick();
  };
  function onScroll() {
    props.onScroll && props.onScroll();
  }
  var listenClickCallback = function listenClickCallback(e) {
    var _$get, _$get2;
    if (!(((_$get = _.get(e, 'target.className', '')) === null || _$get === void 0 ? void 0 : _$get.split) && ((_$get2 = _.get(e, 'target.className', '')) === null || _$get2 === void 0 ? void 0 : _$get2.split(' ').includes('oss-alarm-window-content-menu-item')))) {
      setShowContextMenu(false);
      removeListenClick();
    }
  };

  // 监听鼠标左键
  var listenClick = function listenClick() {
    window.addEventListener('click', listenClickCallback, true);
    window.addEventListener('contextmenu', listenClickCallback, true);
  };

  // 移除鼠标左键监听
  var removeListenClick = function removeListenClick() {
    window.removeEventListener('click', listenClickCallback, false);
    window.removeEventListener('contextmenu', listenClickCallback, false);
  };
  var scrollToTop = function scrollToTop() {
    console.log('scrollToTop');
    vTable.current && vTable.current.scrollToTop();
  };
  var clearAlarms = function clearAlarms() {
    var pagination = props.pagination;
    if (pagination && pTable.current) {
      pTable.current.clearCacheData();
    }
  };

  // 绑定监听
  useImperativeHandle(ref, function () {
    return {
      eventListener: eventListener,
      scrollToTop: scrollToTop,
      clearAlarms: clearAlarms
    };
  });
  var dragProps = {
    onDragEnd: function onDragEnd(fromIndex, toIndex) {
      var beforeColumns;
      var nextColumns;
      beforeColumns = produce(columns, function (draft) {
        var item = draft.splice(fromIndex - 1, 1)[0];
        draft.splice(toIndex - 1, 0, item);
      });
      nextColumns = columnsFormatter(beforeColumns);
      setColumns(nextColumns);
    },
    handleSelector: 'th #drop-it',
    nodeSelector: 'th'
  };
  var handleResize = function handleResize(index) {
    return function (e, _ref2) {
      var size = _ref2.size;
      var nextColumns = produce(columnRef.current, function (draft) {
        draft[index].width = size.width;
      });
      eventListener.userBehaviorRecord(nextColumns);
      setColumns(nextColumns);
    };
  };
  var onStatistBarClick = function onStatistBarClick(param) {
    eventListener.setParamData(param);
    eventListener.secondaryFilterRequest(param, props.customParamData);
  };
  var getAlarmStat = function getAlarmStat() {
    eventListener.alarmStatRequest();
  };
  var onTableChange = function onTableChange(pagination, filters, sorter) {
    var sortData = {};
    // 只能单条排序
    if (sorter.column) {
      var asc;
      if (sorter.order === 'ascend') {
        asc = true;
      } else {
        asc = false;
      }
      sortData.sortFieldId = sorter.column.sortFieldId;
      sortData.sortByAsc = asc;
    } else {
      sortData.sortFieldId = '';
      sortData.sortByAsc = '';
    }
    eventListener.getSortBatchRequest(sortData);
  };
  var onPageTableChange = function onPageTableChange(pagination) {
    setExpandedRowKeys([]);
    var _props$onFetch = props.onFetch,
      onFetch = _props$onFetch === void 0 ? function () {} : _props$onFetch;
    onFetch(pagination);
  };
  var clearParam = function clearParam() {
    eventListener.setParamData({
      conditionList: [],
      logicalAnd: true,
      not: false
    });
  };
  var setSelectRow = function setSelectRow(event, record) {
    var ctrlKey = event.ctrlKey,
      metaKey = event.metaKey;
    var currentSelectedRowKeys = [];
    var dataSource = props.dataSource,
      registerInfo = props.registerInfo;
    if (ctrlKey || metaKey) {
      currentSelectedRowKeys = _toConsumableArray(selectedRowKeys);
      originShiftKey.current = record.alarm_id;
      if (currentSelectedRowKeys.indexOf(record.alarm_id) >= 0) {
        // 右键的时候 保留选择
        if (event.type !== 'contextmenu') {
          currentSelectedRowKeys.splice(currentSelectedRowKeys.indexOf(record.alarm_id), 1);
          originShiftKey.current = -1;
        }
      } else {
        var _record$alarm_id4;
        currentSelectedRowKeys.push((_record$alarm_id4 = record.alarm_id) === null || _record$alarm_id4 === void 0 ? void 0 : _record$alarm_id4.value);
      }
    } else if (isShift.current) {
      var _record$alarm_id6;
      // currentSelectedRowKeys = [...selectedRowKeys];
      var origin = dataSource.findIndex(function (item) {
        var _item$alarm_id3;
        return ((_item$alarm_id3 = item.alarm_id) === null || _item$alarm_id3 === void 0 ? void 0 : _item$alarm_id3.value) === originShiftKey.current;
      }) || 0;
      var currentIndex = dataSource.findIndex(function (item) {
        var _item$alarm_id4, _record$alarm_id5;
        return ((_item$alarm_id4 = item.alarm_id) === null || _item$alarm_id4 === void 0 ? void 0 : _item$alarm_id4.value) === ((_record$alarm_id5 = record.alarm_id) === null || _record$alarm_id5 === void 0 ? void 0 : _record$alarm_id5.value);
      }) || 0;
      currentSelectedRowKeys.push((_record$alarm_id6 = record.alarm_id) === null || _record$alarm_id6 === void 0 ? void 0 : _record$alarm_id6.value);
      var newSelectKeys = [];
      if (origin < currentIndex) {
        newSelectKeys = dataSource.slice(origin, currentIndex).map(function (item) {
          var _item$alarm_id5;
          return (_item$alarm_id5 = item.alarm_id) === null || _item$alarm_id5 === void 0 ? void 0 : _item$alarm_id5.value;
        });
      } else {
        newSelectKeys = dataSource.slice(currentIndex, origin).map(function (item) {
          var _item$alarm_id6;
          return (_item$alarm_id6 = item.alarm_id) === null || _item$alarm_id6 === void 0 ? void 0 : _item$alarm_id6.value;
        });
      }
      currentSelectedRowKeys = _toConsumableArray(new Set(currentSelectedRowKeys.concat(newSelectKeys)));
      if (originShiftKey.current === -1) {
        var _record$alarm_id7;
        originShiftKey.current = (_record$alarm_id7 = record.alarm_id) === null || _record$alarm_id7 === void 0 ? void 0 : _record$alarm_id7.value;
      }
    } else {
      var _record$alarm_id8, _record$alarm_id0;
      // 右键时 如果当时已经选中这条告警 则即使不按下多选健仍然保留选择
      if (event.type === 'contextmenu' && selectedRowKeys.indexOf((_record$alarm_id8 = record.alarm_id) === null || _record$alarm_id8 === void 0 ? void 0 : _record$alarm_id8.value) > 0) {
        currentSelectedRowKeys = _toConsumableArray(selectedRowKeys);
      } else {
        var _record$alarm_id9;
        currentSelectedRowKeys.push((_record$alarm_id9 = record.alarm_id) === null || _record$alarm_id9 === void 0 ? void 0 : _record$alarm_id9.value);
      }
      originShiftKey.current = (_record$alarm_id0 = record.alarm_id) === null || _record$alarm_id0 === void 0 ? void 0 : _record$alarm_id0.value;
    }
    eventListener.setAlarmTop(currentSelectedRowKeys);
    props.onTableSelect && props.onTableSelect(currentSelectedRowKeys, registerInfo, event.type);
    setSelectedRowKeys(currentSelectedRowKeys);
  };
  var rowSelection = useMemo(function () {
    return {
      hideSelectAll: true,
      columnTitle: function columnTitle() {
        return null;
      },
      renderCell: function renderCell() {
        return null;
      },
      preserveSelectedRowKeys: true,
      // 设置为 1 保证不会被 table 组件重算 column 宽度
      columnWidth: 1,
      selectedRowKeys: selectedRowKeys
    };
  }, [selectedRowKeys]);

  /**
   * @description
   */
  var changeRelationList = function changeRelationList(relationListChild) {
    relationListChildren.current.push(relationListChild);
  };

  /**
   * @description
   */
  var expandable = useMemo(function () {
    return {
      onExpand: function () {
        var _onExpand = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(expanded, record) {
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                if (!expanded) {
                  _context.n = 2;
                  break;
                }
                if (!props.onExpandLoading) {
                  _context.n = 1;
                  break;
                }
                _context.n = 1;
                return props.onExpandLoading(record);
              case 1:
                setExpandedRowKeys(expandedRowKeys.concat([record.rowKey || record.key]));
                _context.n = 3;
                break;
              case 2:
                setExpandedRowKeys(expandedRowKeys.filter(function (key) {
                  return record.rowKey ? key !== record.rowKey : record.key;
                }));
              case 3:
                return _context.a(2);
            }
          }, _callee);
        }));
        function onExpand(_x, _x2) {
          return _onExpand.apply(this, arguments);
        }
        return onExpand;
      }(),
      expandedRowKeys: expandedRowKeys,
      expandIcon: function expandIcon(_ref3) {
        var expanded = _ref3.expanded,
          onExpand = _ref3.onExpand,
          record = _ref3.record;
        return /*#__PURE__*/React.createElement(ExpandIcon, {
          expanded: expanded,
          onExpand: onExpand,
          record: record,
          relationListChildren: relationListChildren,
          changeRelationList: changeRelationList,
          needFp: props.needFp
        });
      }
    };
  }, [expandedRowKeys]);
  var getRowClassName = function getRowClassName(record) {
    return classnames(
    // 未读
    !hasReadKey.current.has(record.alarm_id && record.alarm_id.value) && 'noReadRowStyle',
    // 清除
    // TODO 暂时如此 之后会处理
    record.active_status && String(record.active_status.value) !== '1' && props.winType !== 'clear' && 'clearRowStyle', record.topAlarm === true && 'topAlarmStyle', record.key.indexOf('#') !== -1 && 'relationAlarm', Array.isArray(selectedRowKeys) && selectedRowKeys.includes(record.alarm_id && record.alarm_id.value) && 'clickRowStyle', record.secondary_filter && String(record.secondary_filter.value) === 'false' && 'secondaryFilterWrong');
  };

  /**
   * @description 改变表格密度
   * @param {*} size
   */
  var onSizeChange = function onSizeChange(size) {
    setTableSize(size);
  };
  var toolBarActionMap = {
    AlarmSynchronization: eventListener.setAlarmSynchronizationRequest,
    AlarmSound: eventListener.soundSwitchChanged,
    AlarmLock: eventListener.setTableLock,
    AlarmTop: eventListener.setTopAlarmsRequest,
    AlarmExport: function AlarmExport(value) {
      var exportColumn = _.filter(columns, {
        UnColumnModelUsed: false
      }) || [];
      var params = {
        alarmColumnFieldIds: exportColumn.map(function (obj) {
          return obj.id;
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
        console.log(res.responseDataJSON, '===', name, url, '====11');
        createFileFlow(name || res.responseDataJSON, url + res.responseDataJSON);
      });
    },
    ColumnSettings: function ColumnSettings(value) {
      eventListener.resetAlarmFieldRequest(value, props.statusModelArray, allCol);
    },
    ShowAll: function ShowAll() {
      console.log(1111, '清空过滤条件');
      var para = {
        conditionList: [],
        logicalAnd: true,
        not: false
      };
      // TODO:method改为promise后 可以决定顺序
      eventListener.showAll();
      eventListener.setParamData(para);
      eventListener.setCustomParamData(para);
    },
    FoldingState: eventListener.setFoldingState,
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
  var tableOnRow = function tableOnRow(record) {
    var _onClick = props.onClick,
      _onDoubleClick = props.onDoubleClick,
      _onContextMenu = props.onContextMenu,
      _onMouseEnter = props.onMouseEnter,
      _onMouseLeave = props.onMouseLeave;
    return {
      // 点击行
      onClick: function onClick(event) {
        event.preventDefault();
        _onClick ? _onClick(event, record) : onTableClick(event, record);
        setSelectRow(event, record);
      },
      onDoubleClick: function onDoubleClick(event) {
        event.preventDefault();
        _onDoubleClick ? _onDoubleClick(event, record) : onTableDoubleClick(event, record);
      },
      onContextMenu: function onContextMenu(event) {
        event.preventDefault();
        _onContextMenu ? _onContextMenu(event, record) : onTableContextMenu(event, record);
      },
      // 鼠标移入行
      onMouseEnter: function onMouseEnter(event) {
        _onMouseEnter && _onMouseEnter(event, record);
      },
      onMouseLeave: function onMouseLeave(event) {
        _onMouseLeave && _onMouseLeave(event, record);
      }
    };
  };
  var doubleOnCancel = function doubleOnCancel() {
    setAlarmClickTarget(null);
    setAlarmTextVisible(false);
  };
  useEffect(function () {
    setLoading(props.loading);
  }, [props.loading]);
  return /*#__PURE__*/React.createElement("div", {
    className: "alarm-window ".concat(props.theme || 'light')
  }, /*#__PURE__*/React.createElement(ConfigProvider, {
    prefixCls: "oss-ui",
    locale: zhCN,
    renderEmpty: customizeRenderEmpty
  }, /*#__PURE__*/React.createElement("div", {
    className: "alarm-window-operation-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alarm-window-operation-bar-left"
  }, /*#__PURE__*/React.createElement(StatisticsBar, {
    className: "statistics-bar",
    statItems: props.statisticsItems,
    operationBar: props.operationBar,
    getContainer: modalContainer,
    onClick: onStatistBarClick,
    getAlarmStat: getAlarmStat,
    winType: props.winType,
    clearParam: clearParam,
    paramData: props.paramData,
    customParamData: props.customParamData,
    eventListener: eventListener,
    stateSyncInfo: stateSyncInfo,
    syncResultInfo: props.syncResultInfo || stateSyncInfo.syncInfo
  })), /*#__PURE__*/React.createElement("div", {
    className: "alarm-window-operation-bar-right"
  }, props.toolBarRender && /*#__PURE__*/React.createElement("div", {
    className: "alarm-window-operation-bar-inline"
  }, props.toolBarRender()), /*#__PURE__*/React.createElement(Toolbar, {
    className: "alarm-window-toolbar",
    selectRows: selectRows,
    columns: props.columns,
    allCol: props.allCol,
    toolbarItems: toolbarItems,
    customParamData: props.customParamData,
    maxAlarmSize: props.maxAlarmSize,
    modalContainer: modalContainer,
    filterId: props.filterId,
    winType: props.winType,
    filterNameList: props.filterNameList,
    moduleIdList: props.moduleIdList,
    actionMap: toolBarActionMap,
    extendEventMap: props.extendEventMap,
    eventListener: eventListener,
    externalComp: props.externalComp
  }))), props.columns && !!props.columns.length && /*#__PURE__*/React.createElement(ReactDragListView.DragColumn, dragProps, /*#__PURE__*/React.createElement("div", {
    className: "virtual-table-page",
    ref: props.pagination ? searchTableRef : virtualTablePageRef
  }, props.pagination ? /*#__PURE__*/React.createElement(Table, {
    bordered: true,
    loading: loading,
    rowKey: "rowKey",
    rowSelection: rowSelection,
    expandable: expandable,
    columns: columns,
    scroll: {
      y: props.scrollY + 49 || 300
    },
    dataSource: props.dataSource,
    rowClassName: getRowClassName,
    onChange: onPageTableChange,
    components: tableComponent,
    modalContainer: modalContainer,
    size: tableSize,
    pagination: props.pagination,
    onRow: tableOnRow
  }) : /*#__PURE__*/React.createElement(VirtualTable, {
    className: (!props.dataSource || props.dataSource.length === 0) && 'virtual-table-page-table-empty',
    bordered: true,
    ref: vTable,
    loading: loading,
    onFetch: handleFetch,
    rowKey: "key",
    rowSelection: rowSelection,
    expandable: expandable,
    pageSize: 100,
    columns: columns,
    scroll: {
      y: props.scrollY || 300
    },
    dataSource: props.dataSource,
    onScroll: onScroll,
    rowClassName: getRowClassName,
    onChange: onTableChange,
    components: tableComponent,
    modalContainer: modalContainer,
    size: tableSize,
    onRow: tableOnRow
  }))), /*#__PURE__*/React.createElement(ContextMenu, {
    originEvent: originEvent,
    showContextMenu: showContextMenu,
    onContextMenuClose: function onContextMenuClose() {
      return setShowContextMenu(false);
    },
    frameInfo: frameInfo,
    menuList: menuList,
    selectRows: selectRows,
    alarmClickTarget: alarmClickTarget,
    getRecordsDetail: getRecordsDetail,
    actionMap: {
      AlarmExport: eventListener.setAlarmExport
    },
    extendEventMap: props.extendEventMap,
    useCol: _.filter(columns, {
      UnColumnModelUsed: false
    }) || [],
    shareActions: props.shareActions,
    theme: props.theme,
    exportHtmlType: props.exportHtmlType,
    getSubAlarmBatch: props.getSubAlarmBatch,
    tableLoading: setLoading,
    experienceUrl: props.experienceUrl
  }), /*#__PURE__*/React.createElement(DoubleClick, {
    visible: alarmTextVisible,
    textTarget: alarmClickTarget,
    registerInfo: props.registerInfo,
    onCancel: doubleOnCancel,
    getContainer: modalContainer,
    eventListener: eventListener,
    doubleClickType: props.doubleClickType,
    extendEventMap: props.extendEventMap,
    alarmTextLoading: alarmTextLoading,
    theme: props.theme
  }), !!((_props$toolBarStatus = props.toolBarStatus) === null || _props$toolBarStatus === void 0 ? void 0 : _props$toolBarStatus.AlarmSound) && /*#__PURE__*/React.createElement(AlarmSound, {
    alarmSoundList: props.soundAlarmList,
    alarmSoundStatus: props.toolBarStatus.AlarmSound
  })));
});
AlarmWindow.defaultProps = {
  getContainer: document.body,
  defaultSize: 'deafult',
  onTableSelect: function onTableSelect(selectRows) {}
};
export default /*#__PURE__*/React.memo(AlarmWindow);