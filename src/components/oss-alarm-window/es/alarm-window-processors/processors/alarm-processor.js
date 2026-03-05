function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["AlarmWindow", "pageSize", "winType", "theme", "onWindowShowChangeHandler", "toolBarStatus"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
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
import React from 'react';
import { _ } from 'oss-web-toolkits';
import { message } from 'oss-ui';
import { produce } from 'immer';
import serviceConfig from '../../hox';
import imageUrl from '../../alarm-window/assets/Alarm/state';
import { transMsgColor, transVenderSeverityMsgColor, getLabel } from './method';
import Enums from '../../enums';
var Processor = /*#__PURE__*/function (_React$PureComponent) {
  function Processor(props) {
    var _this;
    _classCallCheck(this, Processor);
    _this = _callSuper(this, Processor, [props]);
    _this.autoCheck = function () {
      var treeGridRef = _this.alarmWindowRef.current.getTreeGridRef();
      var rootsList = treeGridRef.current.datasource.getRoots()._as;
      if (Array.isArray(rootsList) && rootsList.length > _this.autoCheckSize) {
        var oversteList = rootsList.filter(function (item, index) {
          return index >= _this.autoCheckSize;
        });
        oversteList && Array.isArray(oversteList) && oversteList.forEach(function (alarm) {
          var deleteAlarmIdList = [];
          treeGridRef.current.datasource.eachByDepthFirst(function (a) {
            var _a$_attrObject, _a$_attrObject$alarm_;
            var alarmId = a === null || a === void 0 ? void 0 : (_a$_attrObject = a._attrObject) === null || _a$_attrObject === void 0 ? void 0 : (_a$_attrObject$alarm_ = _a$_attrObject.alarm_id) === null || _a$_attrObject$alarm_ === void 0 ? void 0 : _a$_attrObject$alarm_.value;
            deleteAlarmIdList.push(alarmId);
          }, alarm);
          deleteAlarmIdList.forEach(function (id) {
            var deleteDataList = _this.keyMap.get(id);
            if (deleteDataList) {
              deleteDataList.forEach(function (deleteItem) {
                var _this$alarmWindowRef$;
                (_this$alarmWindowRef$ = _this.alarmWindowRef.current) === null || _this$alarmWindowRef$ === void 0 ? void 0 : _this$alarmWindowRef$.remove(_this.dataMap.get(deleteItem));
                _this.dataMap.delete(deleteItem);
              });
              console.log('因超过预定限制删除的告警id：', id);
              _this.keyMap.delete(id);
            }
          });
        });
      }
    };
    _this.initEventListener = function () {
      var _$find;
      var _this$props = _this.props,
        winType = _this$props.winType,
        alarmOperator = _this$props.alarmOperator,
        registerWindow = _this$props.registerWindow,
        defaultSecondaryFilter = _this$props.defaultSecondaryFilter;
      var _this2 = _this,
        alarmWindowRef = _this2.alarmWindowRef;
      var winTypeEmnuValue = (_$find = _.find(registerWindow, {
        winName: winType
      })) === null || _$find === void 0 ? void 0 : _$find.winType;
      var columnType = Enums.ColumnAttrEnum[winType];
      if (alarmWindowRef && alarmWindowRef.current) {
        var eventListener = alarmWindowRef.current.eventListener;
        eventListener.on('onTableClick', function (event, record) {
          _this.props.clickLock && eventListener.setTableLock(true);
        });
        eventListener.on('setTableLock', function (lockType) {
          var toolBarStatus = _this.props.toolBarStatus;
          if (lockType) {
            alarmOperator.alarmAdapter.lockWindowRequest(winTypeEmnuValue);
          } else {
            alarmOperator.alarmAdapter.unLockWindowRequest(winTypeEmnuValue);
          }
          var nextToolBarStatus = produce(toolBarStatus, function (draft) {
            draft.AlarmLock = lockType;
          });
          _this.props.toolBarStatusChange(nextToolBarStatus, _this.props.winKey);
        });

        // 告警发声开关
        eventListener.on('soundSwitchChanged', function (soundType) {
          var toolBarStatus = _this.props.toolBarStatus;
          alarmOperator.alarmAdapter.soundSwitchRequest(soundType, _this.props.winKey);
          var nextToolBarStatus = produce(toolBarStatus, function (draft) {
            draft.AlarmSound = soundType;
          });
          _this.props.toolBarStatusChange(nextToolBarStatus, _this.props.winKey, 'soundSwitchChanged');
        });

        // 容量设置
        eventListener.on('setCapacityRequest', function (value) {
          var centerConfig = _this.state.centerConfig;
          alarmOperator.alarmAdapter.resetCapacityRequest(winTypeEmnuValue, value);
          var nextCentConfig = produce(centerConfig, function (draft) {
            draft[Enums.SizeSettingAttrEnum[winType]] = value;
          });
          _this.setState({
            centerConfig: nextCentConfig
          });
        });

        // 告警同步
        eventListener.on('setAlarmSynchronizationRequest', function (value) {
          var toolBarStatus = _this.props.toolBarStatus;
          alarmOperator.alarmAdapter.syncAlarmRequest(value.beginTimeStr, value.endTimeStr, value.clearCurrentData, value.aheadSecond, value.type);
          alarmOperator.alarmAdapter.unLockWindowRequest(winTypeEmnuValue);
          var nextToolBarStatus = produce(toolBarStatus, function (draft) {
            draft.AlarmLock = false;
          });
          _this.props.toolBarStatusChange(nextToolBarStatus, _this.props.winKey);
        });

        // 告警置顶
        eventListener.on('setTopAlarmsRequest', function (selectRows, callback) {
          var toolBarStatus = _this.props.toolBarStatus;
          var topAlarmSet = _this.state.topAlarmSet;
          var isSetTop = false;
          var nextSelectRows = [];
          var nextTopAlarmSet = _.cloneDeep(topAlarmSet);
          selectRows.forEach(function (item) {
            nextSelectRows.push(item.split('#')[0]);
          });
          nextSelectRows.forEach(function (item) {
            if (!topAlarmSet.has(item)) isSetTop = true;
          });
          if (isSetTop) {
            nextSelectRows.forEach(function (item) {
              nextTopAlarmSet.add(item);
            });
          } else {
            nextSelectRows.forEach(function (item) {
              nextTopAlarmSet.delete(item);
            });
          }
          alarmOperator.alarmAdapter.resetTopAlarmsRequest(winTypeEmnuValue, Array.from(nextTopAlarmSet));
          alarmOperator.alarmAdapter.unLockWindowRequest(winTypeEmnuValue);
          var nextToolBarStatus = produce(toolBarStatus, function (draft) {
            draft.AlarmLock = false;
          });
          _this.props.toolBarStatusChange(nextToolBarStatus, _this.props.winKey);
          _this.setState({
            topAlarmSet: nextTopAlarmSet
          }, function () {
            callback();
          });
        });

        // 告警置顶 记录图标变换
        eventListener.on('setAlarmTop', function (selectRows) {
          var toolBarStatus = _this.props.toolBarStatus;
          var topAlarmSet = _this.state.topAlarmSet;
          var alarmTopStatus = true;
          if (!selectRows || selectRows.length === 0) {
            alarmTopStatus = false;
          } else {
            selectRows.forEach(function (item) {
              if (!topAlarmSet.has(item)) alarmTopStatus = false;
            });
          }
          var nextToolBarStatus = produce(toolBarStatus, function (draft) {
            draft.AlarmTop = alarmTopStatus;
          });
          _this.props.toolBarStatusChange(nextToolBarStatus, _this.props.winKey);
        });

        // 双击-告警详情
        eventListener.on('onTableDoubleClick', function (record, callback) {
          var _record$alarm_id;
          var id = (_record$alarm_id = record.alarm_id) === null || _record$alarm_id === void 0 ? void 0 : _record$alarm_id.value;
          if (id) {
            alarmOperator.alarmAdapter.getAlarmDetailRequest([id]).then(function (res) {
              callback(JSON.parse(res.responseDataJSON));
            });
          }
        });

        // 右键获取告警详情
        eventListener.on('onContextMenuClick', function (records, callback) {
          var idArr = Array.isArray(records) && records.map(function (alarm) {
            var _alarm$alarm_id;
            return (_alarm$alarm_id = alarm.alarm_id) === null || _alarm$alarm_id === void 0 ? void 0 : _alarm$alarm_id.value;
          });
          if (idArr && idArr.length) {
            alarmOperator.alarmAdapter.getAlarmDetailRequest(idArr).then(function (res) {
              callback(JSON.parse(res.responseDataJSON));
            });
          }
        });

        // 翻页
        eventListener.on('onTableEnd', function (index) {
          if (index) {
            _this.autoCheckSize += 100;
            alarmOperator.alarmAdapter.GetBatchAlarmRequest(winTypeEmnuValue, index).then(function (res) {
              console.log('翻页返回');
            });
          }
        });

        // 关联告警过滤
        eventListener.on('relationFilterRequest', function () {
          var toolBarStatus = _this.props.toolBarStatus;
          var nextToolBarStatus = produce(toolBarStatus, function (draft) {
            draft.AssociatedAlarmFiltering = true;
          });
          _this.props.toolBarStatusChange(nextToolBarStatus, _this.props.winKey);
          alarmOperator.alarmAdapter.relationFilterRequest(winTypeEmnuValue).then(function (res) {
            console.log('关联告警过滤返回');
          });
        });

        // 关联告警过滤操作取消
        eventListener.on('relationFilterResetRequest', function () {
          var toolBarStatus = _this.props.toolBarStatus;
          var nextToolBarStatus = produce(toolBarStatus, function (draft) {
            draft.AssociatedAlarmFiltering = false;
          });
          _this.props.toolBarStatusChange(nextToolBarStatus, _this.props.winKey);
          alarmOperator.alarmAdapter.relationFilterResetRequest(winTypeEmnuValue).then(function (res) {
            console.log('取消关联告警过滤返回');
          });
        });

        // 排序
        eventListener.on('getSortBatchRequest', function (sorter) {
          alarmOperator.alarmAdapter.getSortBatchRequest(winTypeEmnuValue, sorter.sortFieldId, sorter.sortByAsc).then(function (res) {
            console.log('排序返回');
          });
        });

        // 一键展开 记录图标状态用
        eventListener.on('foldingState', function (type) {
          var toolBarStatus = _this.props.toolBarStatus;
          var nextToolBarStatus = produce(toolBarStatus, function (draft) {
            draft.FoldingState = type;
          });
          _this.props.toolBarStatusChange(nextToolBarStatus, _this.props.winKey);
        });

        // 列设置
        eventListener.on('resetAlarmFieldRequest', function (value) {
          var _this$state = _this.state,
            statusModelArray = _this$state.statusModelArray,
            stateAllColumn = _this$state.stateAllColumn,
            userRecord = _this$state.userRecord;
          var filterParma = [];
          value.forEach(function (item) {
            filterParma.push(item.field);
          });
          var colunmModel = _this.columnsFormatter(value, statusModelArray, stateAllColumn, userRecord);
          _this.setState({
            column: colunmModel
          });
          alarmOperator.resetAlarmFieldRequest(filterParma);
        });

        // 获取列过滤唯一值
        eventListener.on('getDistinctFieldValuesRequest', function (param, callback) {
          var paramData = {};
          Object.assign(paramData, {
            winType: winTypeEmnuValue
          }, param);
          alarmOperator.alarmAdapter.getDistinctFieldValuesRequest(paramData).then(function (res) {
            callback(res);
          });
        });

        // 二次过滤
        eventListener.on('secondaryFilterRequest', function (subFieldExpression, mainFieldExpression) {
          console.log('二次过滤', winTypeEmnuValue, subFieldExpression, mainFieldExpression);
          if (subFieldExpression === 'reset') {
            var toolBarStatus = _this.props.toolBarStatus;
            var nextToolBarStatus = produce(toolBarStatus, function (draft) {
              draft.AssociatedAlarmFiltering = false;
            });
            _this.props.toolBarStatusChange(nextToolBarStatus, _this.props.winKey);
            alarmOperator.alarmAdapter.secondaryFilterRequest(winTypeEmnuValue, {}, {});
          } else {
            alarmOperator.alarmAdapter.secondaryFilterRequest(winTypeEmnuValue, subFieldExpression, mainFieldExpression);
          }
        });

        // 获取告警风暴数据
        eventListener.on('alarmStatRequest', function (callback) {
          alarmOperator.alarmAdapter.alarmStatRequest().then(function (res) {
            callback(res);
          });
        });

        // 获取服务连接信息
        eventListener.on('getServiceInfo', function (callback) {
          alarmOperator.getServiceInfo(callback);
        });

        // 告警导出
        eventListener.on('setAlarmExport', function (parma, callback) {
          alarmOperator.alarmAdapter.exportAlarmRequest(winTypeEmnuValue, parma.alarmColumnFieldIds, parma.alarmFieldNameList, parma.exportFileFormat, parma.alarmIdList || null).then(function (res) {
            callback(res);
          });
        });

        // 记录过滤参数
        eventListener.on('setParamData', function (nextParam) {
          _this.setState({
            paramData: nextParam
          });
        });

        // 记录自定义过滤参数
        eventListener.on('setCustomParamData', function (nextParam) {
          var toolBarStatus = _this.props.toolBarStatus;
          var conditionList = nextParam && nextParam.conditionList;
          var nextToolBarStatus;
          if (Array.isArray(conditionList) && conditionList.length > 0) {
            nextToolBarStatus = produce(toolBarStatus, function (draft) {
              draft.CustomFilter = true;
            });
          } else {
            nextToolBarStatus = produce(toolBarStatus, function (draft) {
              draft.CustomFilter = false;
            });
          }
          _this.props.toolBarStatusChange(nextToolBarStatus, _this.props.winKey);
          _this.setState({
            customParamData: nextParam
          });
        });

        // 告警双击详情
        eventListener.on('getAlarmInfoRequest', function (alarm_id, callback) {
          alarmOperator.alarmAdapter.GetAlarmInfoRequest(alarm_id).then(function (res) {
            return callback(res);
          });
        });

        // 告警双击预处理信息
        eventListener.on('getPreHandleInfoRequest', function (alarm_id, callback) {
          alarmOperator.alarmAdapter.GetPreHandleInfoRequest(alarm_id).then(function (res) {
            return callback(res);
          });
        });

        // 告警双击导出
        eventListener.on('alarmInfoExportRequest', function (alarm_id, callback) {
          alarmOperator.alarmAdapter.AlarmInfoExportRequest(alarm_id).then(function (res) {
            return callback(res);
          });
        });

        // 用户行为记录
        eventListener.on('userBehaviorRecord', function (column, callback) {
          _this.props.userBehaviorRecord(winType, column);
        });

        // 告警已读状态
        eventListener.on('setAlarmRead', function (selectRows) {
          Array.isArray(selectRows) && selectRows.forEach(function (noRepeatKey) {
            var updateData = _this.dataMap.get(noRepeatKey);
            var newOriginalRecordData = _objectSpread({}, updateData['_attrObject']['original_record_data']);
            Object.assign(newOriginalRecordData, {
              alarm_read: {
                field: 'alarm_read',
                label: '已读',
                value: '1'
              }
            });
            updateData && updateData.a('original_record_data', newOriginalRecordData);
          });
        });
      }
      if (alarmOperator) {
        alarmOperator.on('onDatasourceChange', winType, function (response, resolve) {
          var statisticsItems = _this.state.statisticsItems;
          var winTypeData = _.find(response === null || response === void 0 ? void 0 : response.changeEventWinInfoList, {
            winType: winType === 'confirm' ? 'ack' : winType
          }) || null;
          if (!Array.isArray(response.changeEventWinInfoList) || Array.isArray(response.changeEventWinInfoList) && response.changeEventWinInfoList.length === 0 || !winTypeData) {
            return;
          }
          var dataStatistics = winTypeData.alarmCountResult;
          _this.transData(response, winTypeData, new Set(winTypeData.topAlarmIds));
          var nextAlarmSeverity = produce(statisticsItems, function (draft) {
            var _dataStatistics$custo, _dataStatistics$custo2, _dataStatistics$custo3, _dataStatistics$custo4;
            draft[0].value = dataStatistics === null || dataStatistics === void 0 ? void 0 : (_dataStatistics$custo = dataStatistics.customCountIndex) === null || _dataStatistics$custo === void 0 ? void 0 : _dataStatistics$custo.orgSeverity1;
            draft[1].value = dataStatistics === null || dataStatistics === void 0 ? void 0 : (_dataStatistics$custo2 = dataStatistics.customCountIndex) === null || _dataStatistics$custo2 === void 0 ? void 0 : _dataStatistics$custo2.orgSeverity2;
            draft[2].value = dataStatistics === null || dataStatistics === void 0 ? void 0 : (_dataStatistics$custo3 = dataStatistics.customCountIndex) === null || _dataStatistics$custo3 === void 0 ? void 0 : _dataStatistics$custo3.orgSeverity3;
            draft[3].value = dataStatistics === null || dataStatistics === void 0 ? void 0 : (_dataStatistics$custo4 = dataStatistics.customCountIndex) === null || _dataStatistics$custo4 === void 0 ? void 0 : _dataStatistics$custo4.orgSeverity4;
            draft[4].value = dataStatistics === null || dataStatistics === void 0 ? void 0 : dataStatistics.ackedAlarmSize;
            draft[5].value = dataStatistics === null || dataStatistics === void 0 ? void 0 : dataStatistics.rootWithChildAlarmSizeByFilter;
            draft[6].value = dataStatistics === null || dataStatistics === void 0 ? void 0 : dataStatistics.rootAlarmSizeByFilter;
          });
          var syncInfo = null;
          if (response && response.syncResultInfo && response.syncResultInfo.enable && winType === 'active') {
            syncInfo = {
              time: response.syncResultInfo.usingTimeMS,
              size: response.syncResultInfo.syncResultSize,
              showFlag: response.syncResultInfo.enable,
              end: response.syncResultInfo.end
            };
          }
          if (!winTypeData.serverSecondaryFilter && _this.state.lastServerSecondaryFilter !== winTypeData.serverSecondaryFilter) {
            _this.setState({
              paramData: {
                conditionList: [],
                logicalAnd: true,
                not: false
              },
              customParamData: {
                conditionList: [],
                logicalAnd: true,
                not: false
              }
            });
          }
          _this.setState({
            statisticsItems: nextAlarmSeverity,
            syncResultInfo: syncInfo,
            sessionId: response.clientId,
            soundAlarmList: response.soundAlarmIdList,
            topAlarmSet: new Set(winTypeData.topAlarmIds),
            lastServerSecondaryFilter: winTypeData.serverSecondaryFilter
          });
        });
        alarmOperator.on('centerConfigInit', winType, function (centerConfig, callBack) {
          if (centerConfig && centerConfig.columnParseBean && centerConfig.columnParseBean[columnType] && _.isArray(centerConfig.columnParseBean[columnType].columnBaseInfo) && centerConfig.columnSetting) {
            var _centerConfig$columnE, _centerConfig$columnE2, _centerConfig$columnE3, _centerConfig$columnE4;
            var columnParam = _toConsumableArray(centerConfig.columnParseBean[columnType].columnBaseInfo);
            columnParam.map(function (item) {
              return item.field = item.storeFieldName;
            });
            var colunmModel = _this.columnsFormatter(columnParam, _toConsumableArray(centerConfig.columnSetting.columnBaseInfo), _toConsumableArray(centerConfig.allField), ((_centerConfig$columnE = centerConfig.columnEdit) === null || _centerConfig$columnE === void 0 ? void 0 : (_centerConfig$columnE2 = _centerConfig$columnE.data) === null || _centerConfig$columnE2 === void 0 ? void 0 : _centerConfig$columnE2.templateContent) || null);
            var allOptionsList = [];
            centerConfig.allField.forEach(function (item) {
              allOptionsList.push({
                field: item.storeFieldName,
                id: item.fieldId,
                name: item.displayName
              });
            });
            if (defaultSecondaryFilter) {
              alarmOperator.alarmAdapter.secondaryFilterRequest(winTypeEmnuValue, defaultSecondaryFilter, null);
            }
            serviceConfig.data.setFieldEnums(allOptionsList);
            _this.props.columnRender && (colunmModel = _this.props.columnRender(winType, colunmModel));
            _this.setState({
              statusModelArray: _toConsumableArray(centerConfig.columnSetting.columnBaseInfo),
              stateAllColumn: _toConsumableArray(centerConfig.allField),
              allCol: allOptionsList,
              column: colunmModel,
              userRecord: ((_centerConfig$columnE3 = centerConfig.columnEdit) === null || _centerConfig$columnE3 === void 0 ? void 0 : (_centerConfig$columnE4 = _centerConfig$columnE3.data) === null || _centerConfig$columnE4 === void 0 ? void 0 : _centerConfig$columnE4.templateContent) || null,
              centerConfig: centerConfig
            });
          } else {
            message.error('列模版数据错误');
          }
        });
        alarmOperator.on('reRegisterCallBack', winType, function () {
          _this.alarmWindowRef.current.showAll();
        });
        alarmOperator.on('resetFilterParam', winType, function () {
          _this.setState({
            paramData: {
              conditionList: [],
              logicalAnd: true,
              not: false
            },
            customParamData: {
              conditionList: [],
              logicalAnd: true,
              not: false
            }
          });
        });
      }
    };
    _this.columnsFormatter = function (column, statusModelArray, stateAllColumn, userRecord) {
      var _this$props2 = _this.props,
        needFp = _this$props2.needFp,
        winType = _this$props2.winType,
        removeClearAlarm = _this$props2.removeClearAlarm;
      var nextColumns = [];
      var userRecordObj;
      userRecord ? userRecordObj = JSON.parse(userRecord) : userRecordObj = null;
      var firstColumnWidth;
      if (userRecordObj && needFp) {
        firstColumnWidth = userRecordObj[winType] ? _.find(userRecordObj[winType], {
          field: 'first_column'
        }).fieldWidth : 20;
      } else if (needFp) {
        firstColumnWidth = 60;
      } else {
        firstColumnWidth = 20;
      }
      // fp0
      if (needFp) {
        nextColumns.push({
          title: ' ',
          key: 'first_column',
          width: Number(firstColumnWidth),
          ellipsis: true,
          fixed: true,
          UnColumnModelUsed: true,
          getDisplayData: function getDisplayData(text, record) {
            if (record.org_severity) {
              var _record$org_severity;
              var showLabel;
              var msgStyle = transMsgColor((_record$org_severity = record.org_severity) === null || _record$org_severity === void 0 ? void 0 : _record$org_severity.value);
              var fp0Label = getLabel(record, 'fp0');
              if (!isNaN(record['activeChildAlarmCount']) && !isNaN(record['childAlarmCount']) && (Number(record['activeChildAlarmCount']) !== 0 || Number(record['childAlarmCount']) !== 0)) {
                //广州移动特殊处理
                if (removeClearAlarm) {
                  switch (winType) {
                    case 'active':
                      showLabel = "[ ".concat(record.activeChildAlarmCount, " ]").concat(fp0Label);
                      break;
                    case 'confirm':
                      showLabel = "[ ".concat(record.activeChildAlarmCount, " ]").concat(fp0Label);
                      break;
                    case 'clear':
                      showLabel = "[ ".concat(record.childAlarmCount, " ]").concat(fp0Label);
                      break;
                    default:
                      showLabel = "[ ".concat(record.activeChildAlarmCount, "/").concat(record.childAlarmCount, " ]").concat(fp0Label);
                      break;
                  }
                } else {
                  showLabel = "[ ".concat(record.activeChildAlarmCount, "/").concat(record.childAlarmCount, " ] ").concat(fp0Label);
                }
              } else {
                showLabel = fp0Label;
              }
              return {
                label: showLabel,
                background: msgStyle.color,
                color: msgStyle.textColor
              };
            } else {
              return {};
            }
          }
        });
      }
      // 状态标识
      nextColumns.push({
        title: '状态标识',
        key: 'status_icon_column',
        width: userRecordObj && userRecordObj[winType] ? Number(_.find(userRecordObj[winType], {
          field: 'status_icon_column'
        }).fieldWidth) : 120,
        ellipsis: true,
        field: statusModelArray,
        coustomFilterType: Enums.CoustomFilterType.statusIcon,
        UnColumnModelUsed: true,
        getDisplayData: function getDisplayData(text, record) {
          var imageUrlList = [];
          var statusModelList = [{
            displayName: '告警已读状态',
            storeFieldName: 'alarm_read'
          }];
          if (Array.isArray(statusModelArray)) {
            statusModelList = statusModelList.concat(statusModelArray);
          }
          statusModelList.map(function (item) {
            var _$find2, _record$original_reco, _record$is_supv, _record$is_subway, _record$original_reco2;
            var icon = _.find(_this.statusConfig, {
              fieldName: item.storeFieldName
            }) && _.find((_$find2 = _.find(_this.statusConfig, {
              fieldName: item.storeFieldName
            })) === null || _$find2 === void 0 ? void 0 : _$find2.AlarmStatus, {
              id: record['original_record_data'] && ((_record$original_reco = record['original_record_data'][item.storeFieldName]) === null || _record$original_reco === void 0 ? void 0 : _record$original_reco.value)
            });
            if (item.storeFieldName === 'is_supv' && record['is_supv'] && ((_record$is_supv = record['is_supv']) === null || _record$is_supv === void 0 ? void 0 : _record$is_supv.value) === '1') {
              imageUrlList.push({
                name: '督办单',
                image: imageUrl['sheet_status_7']
              });
            }
            if (item.storeFieldName === 'is_subway' && record['is_subway'] && ((_record$is_subway = record['is_subway']) === null || _record$is_subway === void 0 ? void 0 : _record$is_subway.value) === '1') {
              imageUrlList.push({
                name: '高铁单',
                image: imageUrl['is_subway_0']
              });
            }
            imageUrlList.push(icon ? {
              name: icon.name,
              image: imageUrl[icon.image]
            } : {
              name: "".concat(record['original_record_data'] && ((_record$original_reco2 = record['original_record_data'][item.storeFieldName]) === null || _record$original_reco2 === void 0 ? void 0 : _record$original_reco2.value), "...").concat(item.storeFieldName)
            });
          });
          var iconList = imageUrlList.filter(function (item) {
            return item.image;
          });
          return {
            images: iconList
          };
        }
      });
      column.forEach(function (columnItem) {
        var item = _.find(stateAllColumn, {
          storeFieldName: columnItem.field
        });
        if (item) {
          var filterType = '';
          if (item.type === 'Date' || item.storeFieldName === 'time_stamp') {
            filterType = Enums.CoustomFilterType.time;
          } else {
            if (item.enumFlag === false && item.type === 'int') {
              filterType = Enums.CoustomFilterType.number;
            } else {
              if (item.type === 'String') {
                filterType = Enums.CoustomFilterType.switchable;
              } else {
                filterType = Enums.CoustomFilterType.other;
              }
            }
          }
          var width;
          if (userRecordObj && _.find(userRecordObj[winType], {
            field: item.storeFieldName
          })) {
            width = _.find(userRecordObj[winType], {
              field: item.storeFieldName
            }).fieldWidth;
          } else {
            width = columnItem.fieldWidth || 120;
          }
          nextColumns.push({
            title: columnItem.name || columnItem.fieldAlias || item.displayName,
            key: item.storeFieldName,
            dataIndex: item.storeFieldName,
            fieldAlias: columnItem.name || columnItem.fieldAlias || null,
            width: Number(width),
            ellipsis: true,
            coustomFilterType: filterType,
            sorter: true,
            field: item.storeFieldName,
            sortFieldId: item.fieldId,
            UnColumnModelUsed: false,
            getDisplayData: function getDisplayData(text, record) {
              var _record$professional_;
              if (item.storeFieldName === 'org_severity') {
                if (record.org_severity) {
                  var _record$org_severity2;
                  var msgStyle = transMsgColor((_record$org_severity2 = record.org_severity) === null || _record$org_severity2 === void 0 ? void 0 : _record$org_severity2.value);
                  return {
                    label: getLabel(record, 'org_severity'),
                    background: msgStyle.color,
                    color: msgStyle.textColor,
                    selectColor: msgStyle.textColor,
                    align: 'center'
                  };
                } else {
                  return {};
                }
              } else if (item.storeFieldName === 'vendor_severity' && String((_record$professional_ = record.professional_type) === null || _record$professional_ === void 0 ? void 0 : _record$professional_.value) === '85') {
                var _record$vendor_severi;
                var _msgStyle = transVenderSeverityMsgColor((_record$vendor_severi = record.vendor_severity) === null || _record$vendor_severi === void 0 ? void 0 : _record$vendor_severi.value);
                return {
                  label: getLabel(record, 'vendor_severity'),
                  background: _msgStyle.color,
                  color: _msgStyle.textColor,
                  selectColor: _msgStyle.textColor,
                  align: 'center'
                };
              } else {
                return {
                  label: getLabel(record, item.storeFieldName)
                };
              }
            }
          });
        }
      });
      return nextColumns;
    };
    _this.transData = function (responseData, dataList, topAlarmSetCurrent) {
      var _this$alarmWindowRef$9;
      // clear
      if (dataList.clearClientWin) {
        var _this$alarmWindowRef$2;
        _this.keyMap.clear();
        _this.dataMap.clear();
        (_this$alarmWindowRef$2 = _this.alarmWindowRef.current) === null || _this$alarmWindowRef$2 === void 0 ? void 0 : _this$alarmWindowRef$2.clear();
      }
      // remove
      if (dataList.removeAlarmIdList && _.isArray(dataList.removeAlarmIdList) && dataList.removeAlarmIdList.length > 0) {
        dataList.removeAlarmIdList.forEach(function (item) {
          var deleteDataList = _this.keyMap.get(item);
          if (deleteDataList) {
            deleteDataList.forEach(function (deleteItem) {
              var _this$alarmWindowRef$3;
              (_this$alarmWindowRef$3 = _this.alarmWindowRef.current) === null || _this$alarmWindowRef$3 === void 0 ? void 0 : _this$alarmWindowRef$3.remove(_this.dataMap.get(deleteItem));
              _this.dataMap.delete(deleteItem);
            });
            _this.keyMap.delete(item);
          }
        });
      }
      // add bottom
      if (dataList.addBottomAlarmIdList && _.isArray(dataList.addBottomAlarmIdList) && dataList.addBottomAlarmIdList.length > 0) {
        dataList.addBottomAlarmIdList.forEach(function (item) {
          var dataItem = {};
          responseData && responseData.addAlarms && responseData.addAlarms[item] && responseData.addAlarms[item].alarmFieldList && _.isArray(responseData.addAlarms[item].alarmFieldList) && responseData.addAlarms[item].alarmFieldList.forEach(function (element) {
            element && (dataItem[element.field] = element);
          });
          //重复告警去重的情况 如果能找到就忽略掉，已经存在的告警 无论主子都不能新增主告警
          _this.alarmRemoveDuplication(item, dataItem, null);
        });
      }
      //add top
      if (dataList.addTopAlarmIdList && _.isArray(dataList.addTopAlarmIdList) && dataList.addTopAlarmIdList.length > 0) {
        dataList.addTopAlarmIdList.forEach(function (item) {
          var dataItem = {};
          responseData && responseData.addAlarms && responseData.addAlarms[item] && responseData.addAlarms[item].alarmFieldList && _.isArray(responseData.addAlarms[item].alarmFieldList) && responseData.addAlarms[item].alarmFieldList.forEach(function (element) {
            element && (dataItem[element.field] = element);
          });
          //重复告警去重的情况 如果能找到就忽略掉，已经存在的告警 无论主子都不能新增主告警
          _this.alarmRemoveDuplication(item, dataItem, 0);
        });
      }
      // 关联告警
      if (dataList.relationList && _.isArray(dataList.relationList) && dataList.relationList.length > 0) {
        dataList.relationList.forEach(function (parentItem) {
          var parentAlarmId = parentItem.parentAlarmId;
          var parrentKeyList = _this.keyMap.get(parentAlarmId);
          if (!parrentKeyList) {
            var _responseData$addAlar, _this$alarmWindowRef$4, _this$alarmWindowRef$5;
            var dataItem = {};
            (responseData === null || responseData === void 0 ? void 0 : (_responseData$addAlar = responseData.addAlarms[parentAlarmId]) === null || _responseData$addAlar === void 0 ? void 0 : _responseData$addAlar.alarmFieldList) && _.isArray(responseData.addAlarms[parentAlarmId].alarmFieldList) && responseData.addAlarms[parentAlarmId].alarmFieldList.forEach(function (element) {
              element && (dataItem[element.field] = element);
            });
            var otData = (_this$alarmWindowRef$4 = _this.alarmWindowRef.current) === null || _this$alarmWindowRef$4 === void 0 ? void 0 : _this$alarmWindowRef$4.returnOTData(dataItem);
            _this.keyMap.set(parentAlarmId, ["".concat(parentAlarmId, "#", 0)]);
            _this.dataMap.set("".concat(parentAlarmId, "#", 0), otData);
            otData.a('noRepeatKey', "".concat(parentAlarmId, "#", 0));
            (_this$alarmWindowRef$5 = _this.alarmWindowRef.current) === null || _this$alarmWindowRef$5 === void 0 ? void 0 : _this$alarmWindowRef$5.add(otData, 0);
          }
          _this.keyMap.get(parentItem.parentAlarmId).forEach(function (parentKey) {
            var parentObj = _this.dataMap.get(parentKey);
            if (parentObj) {
              parentItem.relationItemList.forEach(function (childKey) {
                var childAlarmId = childKey.childAlarmId;
                var childKeyList = _this.keyMap.get(childAlarmId);
                if (childKeyList) {
                  var _parentObj$getChildre, _parentObj$getChildre2;
                  //如果子告警出现在过流水中
                  //TODO:判断主告警下是否已经存在重复子告警，临时改动只添加不重复的子告警！！！
                  var isExists = false;
                  if ((parentObj === null || parentObj === void 0 ? void 0 : (_parentObj$getChildre = parentObj.getChildren()) === null || _parentObj$getChildre === void 0 ? void 0 : (_parentObj$getChildre2 = _parentObj$getChildre._as) === null || _parentObj$getChildre2 === void 0 ? void 0 : _parentObj$getChildre2.length) !== 0) {
                    // 且不能和自己父级相等
                    if (childAlarmId === parentAlarmId) isExists = true;
                    parentObj.getChildren()._as.forEach(function (child) {
                      var _child$_attrObject$or, _child$_attrObject$or2;
                      if (childAlarmId === (child === null || child === void 0 ? void 0 : (_child$_attrObject$or = child._attrObject.original_record_data) === null || _child$_attrObject$or === void 0 ? void 0 : (_child$_attrObject$or2 = _child$_attrObject$or.alarm_id) === null || _child$_attrObject$or2 === void 0 ? void 0 : _child$_attrObject$or2.value)) {
                        isExists = true;
                      }
                    });
                  }
                  if (!isExists) {
                    var alarm = _this.dataMap.get("".concat(childAlarmId, "#0"));
                    if (alarm.getParent()) {
                      var newAlarm = _this.cloneAlarm(alarm);
                      newAlarm && parentObj.addChild(newAlarm);
                    } else {
                      parentObj.addChild(alarm);
                    }
                  }
                } else {
                  var _responseData$addAlar2, _this$alarmWindowRef$6, _this$alarmWindowRef$7;
                  //如果子告警从没出现在流水中
                  var _dataItem = {};
                  (responseData === null || responseData === void 0 ? void 0 : (_responseData$addAlar2 = responseData.addAlarms[childAlarmId]) === null || _responseData$addAlar2 === void 0 ? void 0 : _responseData$addAlar2.alarmFieldList) && _.isArray(responseData.addAlarms[childAlarmId].alarmFieldList) && responseData.addAlarms[childAlarmId].alarmFieldList.forEach(function (element) {
                    element && (_dataItem[element.field] = element);
                  });
                  var _otData = (_this$alarmWindowRef$6 = _this.alarmWindowRef.current) === null || _this$alarmWindowRef$6 === void 0 ? void 0 : _this$alarmWindowRef$6.returnOTData(_dataItem);
                  _this.keyMap.set(childAlarmId, ["".concat(childAlarmId, "#", 0)]);
                  _this.dataMap.set("".concat(childAlarmId, "#", 0), _otData);
                  _otData.a('noRepeatKey', "".concat(childAlarmId, "#", 0));
                  (_this$alarmWindowRef$7 = _this.alarmWindowRef.current) === null || _this$alarmWindowRef$7 === void 0 ? void 0 : _this$alarmWindowRef$7.add(_otData, 0);
                  parentObj.addChild(_otData);
                }
              });
            }
          });
        });
      }
      // 更新
      if (dataList.updateAlarmIdList && _.isArray(dataList.updateAlarmIdList) && dataList.updateAlarmIdList.length > 0) {
        dataList.updateAlarmIdList.forEach(function (alarmId) {
          var _responseData$updateA;
          if (Array.isArray(responseData === null || responseData === void 0 ? void 0 : (_responseData$updateA = responseData.updateAlarms[alarmId]) === null || _responseData$updateA === void 0 ? void 0 : _responseData$updateA.modifyFieldList) && _this.keyMap.has(alarmId)) {
            responseData.updateAlarms[alarmId].modifyFieldList.forEach(function (element) {
              var updataKeyList = _this.keyMap.get(alarmId);
              if (updataKeyList) {
                updataKeyList.forEach(function (updateKey) {
                  var _updateData$_attrObje;
                  var updateData = _this.dataMap.get(updateKey);
                  updateData.a(element.field, element);
                  var updateDataRecord = updateData === null || updateData === void 0 ? void 0 : (_updateData$_attrObje = updateData._attrObject) === null || _updateData$_attrObje === void 0 ? void 0 : _updateData$_attrObje.original_record_data;
                  updateDataRecord && Object.assign(updateDataRecord, _defineProperty({}, element.field, element));
                  updateData.a('original_record_data', updateDataRecord);
                });
              }
            });
          }
        });
      }

      // 关联告警-主子告警个数
      if (dataList.relationAlarmCounts) {
        var relationAlarmCountsList = Object.keys(dataList.relationAlarmCounts);
        relationAlarmCountsList.forEach(function (alarmId) {
          var updataKeyList = _this.keyMap.get(alarmId);
          if (updataKeyList) {
            updataKeyList.forEach(function (alarmKey) {
              var updateData = _this.dataMap.get(alarmKey);
              if (updateData) {
                updateData.a('activeChildAlarmCount', dataList.relationAlarmCounts[alarmId].activeChildAlarmCount);
                updateData.a('childAlarmCount', dataList.relationAlarmCounts[alarmId].childAlarmCount);
              }
            });
          }
        });
      }
      var _iterator = _createForOfIteratorHelper(_this.dataMap.values()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var values = _step.value;
          values.a('topAlarm', false);
        }

        //置顶
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (topAlarmSetCurrent.size > 0) {
        var num = 0;
        var _iterator2 = _createForOfIteratorHelper(topAlarmSetCurrent.keys()),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var item = _step2.value;
            var topKeyList = _this.keyMap.get(item);
            if (topKeyList) {
              topKeyList.forEach(function (topKey) {
                var _this$alarmWindowRef$8;
                var topData = _this.dataMap.get(topKey);
                if (num === 0) {
                  topData.a('topAlarm', true);
                }
                num++;
                (_this$alarmWindowRef$8 = _this.alarmWindowRef.current) === null || _this$alarmWindowRef$8 === void 0 ? void 0 : _this$alarmWindowRef$8.moveToTop(topData);
              });
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      (_this$alarmWindowRef$9 = _this.alarmWindowRef.current) === null || _this$alarmWindowRef$9 === void 0 ? void 0 : _this$alarmWindowRef$9.invalidateModel();
    };
    _this.cloneAlarm = function (alarm) {
      var _alarm$_attrObject, _alarm$_attrObject$al;
      var nextAlarm = _this.newAlarm(alarm);
      var alarmId = alarm === null || alarm === void 0 ? void 0 : (_alarm$_attrObject = alarm._attrObject) === null || _alarm$_attrObject === void 0 ? void 0 : (_alarm$_attrObject$al = _alarm$_attrObject.alarm_id) === null || _alarm$_attrObject$al === void 0 ? void 0 : _alarm$_attrObject$al.value;
      var keyList = _this.keyMap.get(alarmId);
      if (keyList && Array.isArray(keyList)) {
        var _this$alarmWindowRef$0;
        var index = keyList.length;
        var noRepeatKey = "".concat(alarmId, "#").concat(index);
        keyList.push(noRepeatKey);
        nextAlarm.a('noRepeatKey', noRepeatKey);
        _this.dataMap.set(noRepeatKey, nextAlarm);
        (_this$alarmWindowRef$0 = _this.alarmWindowRef.current) === null || _this$alarmWindowRef$0 === void 0 ? void 0 : _this$alarmWindowRef$0.add(nextAlarm, 0);
        if (alarm.hasChildren()) {
          alarm.getChildren()._as.forEach(function (child) {
            var childAlarm = _this.cloneAlarm(child);
            nextAlarm.addChild(childAlarm);
          });
        }
        return nextAlarm;
      } else {
        return null;
      }
    };
    _this.newAlarm = function (alarm) {
      var data = new window.ot.Data();
      _this.dataTrans(data, alarm._attrObject);
      return data;
    };
    _this.dataTrans = function (data, element) {
      Object.keys(element).forEach(function (key) {
        if (key) {
          data.a(key, element[key]);
        }
      });
    };
    /**
     * @description 判断告警是否已存在
     * @param {*} alarmId
     * @returns
     */
    _this.alarmRemoveDuplication = function (alarmId, alarmData, index) {
      if (_this.keyMap.get(alarmId)) {
        console.log(alarmId, '告警已存在，再次推送忽略');
      } else {
        var _this$alarmWindowRef$1, _this$alarmWindowRef$10;
        var otData = (_this$alarmWindowRef$1 = _this.alarmWindowRef.current) === null || _this$alarmWindowRef$1 === void 0 ? void 0 : _this$alarmWindowRef$1.returnOTData(alarmData);
        if (!otData) return;
        _this.keyMap.set(alarmId, ["".concat(alarmId, "#0")]);
        _this.dataMap.set("".concat(alarmId, "#0"), otData);
        otData.setTag("".concat(alarmId, "#0"));
        otData.a('noRepeatKey', "".concat(alarmId, "#0"));
        (_this$alarmWindowRef$10 = _this.alarmWindowRef.current) === null || _this$alarmWindowRef$10 === void 0 ? void 0 : _this$alarmWindowRef$10.add(otData, index);
      }
    };
    _this.alarmWindowRef = /*#__PURE__*/React.createRef();
    _this.statusConfig = serviceConfig.data.statusConfig;
    _this.dataMap = new Map();
    _this.keyMap = new Map();
    _this.autoCheckSize = props.autoCheckSize;
    _this.state = {
      allCol: [],
      stateAllColumn: [],
      // 列设置，后期需优化
      statusModelArray: [],
      column: [],
      centerConfig: {},
      statisticsItems: [{
        key: '1',
        title: '一级告警',
        value: 0,
        color: 'red',
        type: 'orgSeverity1'
      }, {
        key: '2',
        title: '二级告警',
        value: 0,
        color: 'orange',
        type: 'orgSeverity2'
      }, {
        key: '3',
        title: '三级告警',
        value: 0,
        color: 'yellow',
        type: 'orgSeverity3'
      }, {
        key: '4',
        title: '四级告警',
        value: 0,
        color: 'blue',
        type: 'orgSeverity4'
      }, {
        key: '5',
        title: '确认',
        value: 0,
        color: 'green',
        type: 'confirm'
      }, {
        key: '6',
        title: '主告警数',
        value: 0,
        color: '',
        type: 'main'
      }, {
        key: '7',
        title: '过滤告警数',
        value: 0,
        color: '',
        type: 'total'
      }],
      syncResultInfo: null,
      soundAlarmList: [],
      topAlarmSet: new Set(),
      paramData: {
        conditionList: [],
        logicalAnd: true,
        not: false
      },
      customParamData: {
        conditionList: [],
        logicalAnd: true,
        not: false
      },
      useCol: [],
      userRecord: null,
      sessionId: null,
      lastServerSecondaryFilter: null
    };
    return _this;
  }
  _inherits(Processor, _React$PureComponent);
  return _createClass(Processor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;
      this.initEventListener();
      if (this.autoCheck) {
        this.checkTimer = setInterval(function () {
          return _this3.autoCheck();
        }, this.props.autoCheckTimer * 1000);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.checkTimer && clearInterval(this.checkTimer);
      if (this.alarmWindowRef && this.alarmWindowRef.current) {
        var eventListener = this.alarmWindowRef.current.eventListener;
        eventListener.off('onTableClick', function (record) {});
        eventListener.off('setTableLock', function (lockType) {});
        eventListener.off('soundSwitchChanged', function (soundType) {});
        eventListener.off('setCapacityRequest', function (value) {});
        eventListener.off('setAlarmSynchronizationRequest', function (value) {});
        eventListener.off('setTopAlarmsRequest', function (value) {});
        eventListener.off('setAlarmTop', function (selectRows) {});
        eventListener.off('onTableDoubleClick', function (value) {});
        eventListener.off('onContextMenuClick', function (value) {});
        eventListener.off('onTableEnd', function (value) {});
        eventListener.off('relationFilterRequest', function (value) {});
        eventListener.off('getSortBatchRequest', function (value) {});
        eventListener.off('foldingState', function (type) {});
        eventListener.off('resetAlarmFieldRequest', function (value) {});
        eventListener.off('getDistinctFieldValuesRequest', function (value) {});
        eventListener.off('secondaryFilterRequest', function () {});
        eventListener.off('setAlarmExport', function (value) {});
        eventListener.off('setParamData', function (value) {});
        eventListener.off('setCustomParamData', function (value) {});
        eventListener.off('getAlarmInfoRequest', function (value) {});
        eventListener.off('getPreHandleInfoRequest', function (value) {});
        eventListener.off('alarmInfoExportRequest', function (value) {});
        eventListener.off('userBehaviorRecord', function (value) {});
        eventListener.off('alarmStatRequest', function (value) {});
        eventListener.off('getServiceInfo', function (value) {});
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
        AlarmWindow = _this$props3.AlarmWindow,
        pageSize = _this$props3.pageSize,
        winType = _this$props3.winType,
        theme = _this$props3.theme,
        onWindowShowChangeHandler = _this$props3.onWindowShowChangeHandler,
        toolBarStatus = _this$props3.toolBarStatus,
        alarmWindowProps = _objectWithoutProperties(_this$props3, _excluded);
      var _this$state2 = this.state,
        column = _this$state2.column,
        centerConfig = _this$state2.centerConfig,
        statusModelArray = _this$state2.statusModelArray,
        statisticsItems = _this$state2.statisticsItems,
        syncResultInfo = _this$state2.syncResultInfo,
        soundAlarmList = _this$state2.soundAlarmList,
        paramData = _this$state2.paramData,
        customParamData = _this$state2.customParamData,
        allCol = _this$state2.allCol,
        useCol = _this$state2.useCol;
      return /*#__PURE__*/React.createElement(AlarmWindow, _extends({
        ref: this.alarmWindowRef,
        columns: column,
        maxAlarmSize: centerConfig,
        statisticsItems: statisticsItems,
        syncResultInfo: syncResultInfo,
        soundAlarmList: soundAlarmList,
        winType: winType,
        pageSize: pageSize,
        statusModelArray: statusModelArray
        // 列设置用
        ,
        allCol: allCol
        // TODO:
        ,
        useCol: useCol,
        toolBarStatus: toolBarStatus,
        paramData: paramData,
        customParamData: customParamData,
        theme: theme,
        onWindowShowChangeHandler: onWindowShowChangeHandler
      }, alarmWindowProps));
    }
  }]);
}(React.PureComponent);
export default Processor;