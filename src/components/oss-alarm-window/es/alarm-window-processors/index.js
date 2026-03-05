function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
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
import { ConfigProvider, Card, Icon } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import dayjs from 'dayjs';
import { produce } from 'immer';
import WindowComponent from './window-component';
import AlarmOperator from './operators/alarm-operators';
import serviceConfig from '../hox';
import statusConfig from '../common/status-config';
import statusConfigHunan from '../common/status-config-hunan';
import Common from '../common';
import Enums from '../enums';
import "./style/index.css";
var AlarmWindowProcessor = /*#__PURE__*/function (_React$PureComponent) {
  function AlarmWindowProcessor(props) {
    var _this;
    _classCallCheck(this, AlarmWindowProcessor);
    _this = _callSuper(this, AlarmWindowProcessor, [props]);
    /**
     * @description:初始化全局共享参数
     */
    _this.initCenterHox = function () {
      var _this$props$statusCon, _this$props$statusCon2;
      //用户信息
      serviceConfig.data.setServiceConfig(_this.props.frameInfo);
      //单击锁定
      serviceConfig.data.setClickLock(_this.props.clickLock);
      //自动解锁
      serviceConfig.data.setAutoUnLock(_this.props.autoUnLock);
      //自动解锁时间
      serviceConfig.data.setLockPeriod(Number(_this.props.unLockTime) * 1000);
      //是否隐藏清除的子告警
      serviceConfig.data.setRemoveClearAlarm(_this.props.removeClearAlarm);
      //状态标识类型（defalut、hunan）
      var nextStatusConfig;
      switch (_this.props.iconType) {
        case 'default':
          nextStatusConfig = (_this$props$statusCon = _this.props.statusConfig) !== null && _this$props$statusCon !== void 0 ? _this$props$statusCon : statusConfig;
          break;
        case 'hunan':
          nextStatusConfig = statusConfigHunan;
          break;
        default:
          nextStatusConfig = (_this$props$statusCon2 = _this.props.statusConfig) !== null && _this$props$statusCon2 !== void 0 ? _this$props$statusCon2 : statusConfig;
          break;
      }
      serviceConfig.data.setStatusConfig(nextStatusConfig);
    };
    /**
     * @description:初始化Card 右侧功能按钮
     */
    _this.initCardProps = function () {
      var _this$props = _this.props,
        cardHeaderShow = _this$props.cardHeaderShow,
        title = _this$props.title,
        cardHeaderExtra = _this$props.cardHeaderExtra,
        onMaXshow = _this$props.onMaXshow,
        onMaxShowItem = _this$props.onMaxShowItem,
        onDeleteItem = _this$props.onDeleteItem;
      if (cardHeaderShow) {
        return {
          title: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, title), /*#__PURE__*/React.createElement(Icon, {
            antdIcon: true,
            type: "PicCenterOutlined",
            onClick: _this.onFoldAllClick,
            className: "alarm-flow-window-card-header-fold-icon"
          })),
          extra: [].concat(_toConsumableArray(cardHeaderExtra), [onMaxShowItem && /*#__PURE__*/React.createElement(Icon, {
            antdIcon: true,
            className: "alarm-flow-window-card-extra-icon",
            type: onMaXshow ? 'ShrinkOutlined' : 'ArrowsAltOutlined',
            onClick: onMaxShowItem,
            key: "e"
          }), onDeleteItem && /*#__PURE__*/React.createElement(Icon, {
            antdIcon: true,
            className: "alarm-flow-window-card-extra-icon",
            type: "CloseOutlined",
            onClick: onDeleteItem,
            key: "f"
          })])
        };
      } else {
        return {
          title: ''
        };
      }
    };
    _this.handleError = function () {
      _this.state.operator.handleError();
    };
    /**
     * @description: 注册
     * @param {*}
     * @return {*}
     */
    _this.register = function () {
      var _operator$register;
      var operator = _this.state.operator;
      var _this$props2 = _this.props,
        frameInfo = _this$props2.frameInfo,
        filterIdList = _this$props2.filterIdList,
        colDispTemplet = _this$props2.colDispTemplet,
        statusDispTemplet = _this$props2.statusDispTemplet,
        registerWindow = _this$props2.registerWindow,
        windowId = _this$props2.windowId,
        subscribeBusiness = _this$props2.subscribeBusiness,
        batchSize = _this$props2.batchSize,
        title = _this$props2.title;
      var filterIdStr = filterIdList;
      if (filterIdStr[0] === '') {
        filterIdStr = [];
      }
      var filterIdListNum = filterIdStr.map(Number);
      var defaultRegisterParam = {
        subscribeInfoJSON: {
          clientDesc: title || 'client Desc',
          subscribeProperties: {
            filterIds: filterIdListNum
          },
          clientTimeOutSeconds: 3000,
          clientId: 'clientId-1',
          clientToken: 'client Token',
          dataPermissionList: {},
          templateId: colDispTemplet,
          windowId: windowId,
          stateIconId: statusDispTemplet,
          batchSize: batchSize,
          userName: frameInfo.userInfo.userName,
          clientRegisterTime: dayjs().format('YYYY-MM-DD hh:mm:ss'),
          winList: registerWindow,
          userId: frameInfo.userInfo.userId
        },
        subscribeBusiness: subscribeBusiness
      };
      var registerParam = _this.registerParamFormatter(defaultRegisterParam);
      (_operator$register = operator.register(registerParam)) === null || _operator$register === void 0 ? void 0 : _operator$register.then(function (res) {
        var newColumn = {};
        registerWindow.forEach(function (item) {
          var _res$centerConfig;
          newColumn[item.winName] = _toConsumableArray(res === null || res === void 0 ? void 0 : (_res$centerConfig = res.centerConfig) === null || _res$centerConfig === void 0 ? void 0 : _res$centerConfig.columnParseBean[Enums.ColumnAttrEnum[item.winName]].columnBaseInfo).concat({
            field: 'first_column',
            fieldWidth: '60'
          }, {
            field: 'status_icon_column',
            fieldWidth: '120'
          });
        });
        _this.columnBehaviorRecordData = newColumn;
        _this.props.registerCallBack && _this.props.registerCallBack(res);
        serviceConfig.data.setSessionId(res.clientSessionId);
        _this.getAlarmSoundStatus();
        _this.setState({
          registerInfo: res
        });
      });
    };
    _this.getAlarmSoundStatus = function () {
      var _this$props3 = _this.props,
        frameInfo = _this$props3.frameInfo,
        windowId = _this$props3.windowId;
      Common.request(null, {
        fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.filterUrl, "/v1/alarmViewRecord/getViewConfig"),
        type: 'get',
        showSuccessMessage: false,
        showErrorMessage: true,
        defaultErrorMessage: '获取数据失败',
        data: {
          userId: frameInfo.userInfo.userId,
          viewId: windowId,
          type: 0
        }
      }).then(function (result) {
        if (result.code === 0 && !_.isEmpty(result.data)) {
          _.forOwn(result.data, function (value, key) {
            if (value.AlarmSound) {
              _this.state.operator.alarmAdapter.soundSwitchRequest(true, Number(key));
            }
          });
          _this.setState(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              toolBarStatus: result.data
            });
          });
        }
      });
    };
    /**
     * @description: 注册接口参数格式化
     * @param {*}
     * @return {*}
     */
    _this.registerParamFormatter = function (registerParam) {
      var registerParamFormatter = _this.props.registerParamFormatter;
      var newRegisterParam;
      if (registerParamFormatter && typeof registerParamFormatter === 'function') {
        newRegisterParam = registerParamFormatter(registerParam);
      } else {
        newRegisterParam = registerParam;
      }
      return newRegisterParam;
    };
    /**
     * @description: 用户行为记录（可配置）
     * @param {*}
     * @return {*}
     */
    _this.userBehaviorRecord = function (winType, column) {
      var _this$props4 = _this.props,
        filterIdList = _this$props4.filterIdList,
        colDispTemplet = _this$props4.colDispTemplet,
        frameInfo = _this$props4.frameInfo,
        windowId = _this$props4.windowId,
        columnBehaviorRecord = _this$props4.columnBehaviorRecord;
      if (!columnBehaviorRecord || !Array.isArray(_this.columnBehaviorRecordData[winType])) {
        return;
      }
      Array.isArray(_this.columnBehaviorRecordData[winType]) && _this.columnBehaviorRecordData[winType].forEach(function (item) {
        var _$find;
        item.fieldWidth = ((_$find = _.find(column, {
          key: item.field
        })) === null || _$find === void 0 ? void 0 : _$find.width) || 120;
      });
      var fullUrl = "".concat(serviceConfig.data.serviceConfig.otherService.filterUrl, "/v1/alarmViewRecord/add-alarmViewRecord");
      var data = {
        alarmViewRecordVo: {
          filterId: filterIdList[0],
          templateContent: JSON.stringify(_this.columnBehaviorRecordData),
          templateId: colDispTemplet,
          userId: frameInfo.userInfo.userId,
          windowId: windowId
        },
        clientRequestInfo: 'string',
        requestInfo: {
          clientRequestId: 'string',
          clientToken: 'string'
        }
      };
      Common.request(null, {
        fullUrl: fullUrl,
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        data: data
      });
    };
    /**
     * @description: 监听实时流水变化
     * @param {*}
     * @return {*}
     */
    _this.operatorEventListenerInit = function () {
      var operator = _this.state.operator;
      operator.on('operatorEventListenerRealAlarm', null, function (session, num) {
        _this.props.processorAction.operatorEventListenerRealAlarm(session, num);
      });
      operator.on('operatorRealAlarmRequest', null, function (res) {
        _this.props.operatorRealAlarmRequest(res);
      });
    };
    _this.operatorErrorListenerInit = function () {
      var operator = _this.state.operator;
      var handleErrorInfoCallBack = _this.props.handleErrorInfoCallBack;
      operator.on('operatorErrorModal', null, function (showModalInfo, everyTimesStatus, disconnectionTimes) {
        handleErrorInfoCallBack && handleErrorInfoCallBack(showModalInfo, everyTimesStatus, disconnectionTimes);
      });
    };
    /**
     * @description: collapse展开全部
     * @param {*}
     * @return {*}
     */
    _this.onFoldAllClick = function () {
      var registerWindow = _this.props.registerWindow;
      var activeKey = _this.state.activeKey;
      var allWindowNumber = registerWindow.length;
      if (activeKey.length === allWindowNumber) {
        _this.setState({
          activeKey: []
        });
      } else {
        var keyList = registerWindow.map(function (item) {
          return item.winName;
        });
        _this.setState({
          activeKey: keyList
        });
      }
    };
    /**
     * @description: 抽屉改变
     * @type {*}
     */
    _this.activeChange = function (activeKey) {
      _this.setState({
        activeKey: activeKey
      });
    };
    //网元树条件过滤
    _this.statisticsSecondaryFilterRequest = function (data) {
      _this.state.operator.statisticsSecondaryFilterRequest(data);
    };
    _this.toolBarStatusChange = function (nextStatus, winType, actioType) {
      var toolBarStatus = _this.state.toolBarStatus;
      var nextToolBarStatus = produce(toolBarStatus, function (draft) {
        // if (actioType === 'soundSwitchChanged') {
        //     draft[0].AlarmSound = false;
        //     draft[1].AlarmSound = false;
        //     draft[2].AlarmSound = false;
        //     draft[3].AlarmSound = false;
        // }
        draft[winType] = nextStatus;
      });
      _this.setState({
        toolBarStatus: nextToolBarStatus
      });
      if (actioType === 'soundSwitchChanged') {
        _this.saveAlarmSoundStatus(nextToolBarStatus);
      }
    };
    _this.saveAlarmSoundStatus = function (nextToolBarStatus) {
      var _this$props5 = _this.props,
        frameInfo = _this$props5.frameInfo,
        windowId = _this$props5.windowId;
      Common.request(null, {
        fullUrl: "".concat(serviceConfig.data.serviceConfig.otherService.filterUrl, "/v1/alarmViewRecord/saveOrUpdateViewConfig"),
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: true,
        defaultErrorMessage: '保存数据失败',
        data: {
          userId: frameInfo.userInfo.userId,
          viewId: windowId,
          type: 0,
          config: nextToolBarStatus
        }
      });
    };
    _this.initCenterHox();
    _this.columnBehaviorRecordData = {};
    _this.state = {
      operator: new AlarmOperator(props.registerWindow),
      activeKey: [props.registerWindow[0].winName],
      registerInfo: null,
      toolBarStatus: {
        0: {},
        1: {},
        2: {},
        3: {}
      }
    };
    _this.userBehaviorRecord = _.debounce(_this.userBehaviorRecord, 1000);
    return _this;
  }
  _inherits(AlarmWindowProcessor, _React$PureComponent);
  return _createClass(AlarmWindowProcessor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.register();
      this.operatorEventListenerInit();
      this.operatorErrorListenerInit();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;
      if (JSON.stringify(prevProps.filterIdList) !== JSON.stringify(this.props.filterIdList)) {
        this.state.operator.unregister(function () {
          _this2.register();
        });
      }
      if (JSON.stringify(prevProps.frameInfo) !== JSON.stringify(this.props.frameInfo)) {
        serviceConfig.data.setServiceConfig(this.props.frameInfo);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this3 = this;
      this.state.operator.unregister(function () {
        _this3.state.operator = null;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var _this$props6 = this.props,
        height = _this$props6.height,
        getContainer = _this$props6.getContainer,
        filterIdList = _this$props6.filterIdList,
        filterNameList = _this$props6.filterNameList,
        moduleIdList = _this$props6.moduleIdList,
        registerWindow = _this$props6.registerWindow,
        contextAndToolbar = _this$props6.contextAndToolbar,
        defaultSize = _this$props6.defaultSize,
        needFp = _this$props6.needFp,
        alarmTitlelist = _this$props6.alarmTitlelist,
        extendContextMenu = _this$props6.extendContextMenu,
        onDoubleClick = _this$props6.onDoubleClick,
        clickLock = _this$props6.clickLock,
        autoUnLock = _this$props6.autoUnLock,
        unLockTime = _this$props6.unLockTime,
        theme = _this$props6.theme,
        shareActions = _this$props6.shareActions,
        _this$props6$cardHead = _this$props6.cardHeaderShow,
        cardHeaderShow = _this$props6$cardHead === void 0 ? true : _this$props6$cardHead,
        doubleClickType = _this$props6.doubleClickType,
        exportHtmlType = _this$props6.exportHtmlType,
        onTableSelect = _this$props6.onTableSelect,
        externalComp = _this$props6.externalComp,
        removeClearAlarm = _this$props6.removeClearAlarm,
        onCellClick = _this$props6.onCellClick,
        experienceUrl = _this$props6.experienceUrl,
        defaultSecondaryFilter = _this$props6.defaultSecondaryFilter,
        autoCheck = _this$props6.autoCheck,
        autoCheckSize = _this$props6.autoCheckSize,
        autoCheckTimer = _this$props6.autoCheckTimer,
        customFilterHandle = _this$props6.customFilterHandle,
        columnRender = _this$props6.columnRender,
        extendToolbar = _this$props6.extendToolbar;
      var _this$state = this.state,
        activeKey = _this$state.activeKey,
        operator = _this$state.operator,
        registerInfo = _this$state.registerInfo,
        toolBarStatus = _this$state.toolBarStatus;
      var customCardProps = this.initCardProps();
      return /*#__PURE__*/React.createElement(ConfigProvider, {
        prefixCls: "oss-ui"
      }, /*#__PURE__*/React.createElement("div", {
        className: "oss-alarm-window-processors-container"
      }, /*#__PURE__*/React.createElement(Card, _extends({}, customCardProps, {
        style: {
          height: 'inherit',
          width: '100%',
          border: 'none'
        },
        bodyStyle: {
          height: !cardHeaderShow ? '100%' : 'calc(100% - 27px)',
          width: '100%',
          overflow: 'auto',
          padding: 0
        },
        headStyle: {
          height: 25,
          minHeight: 25,
          lineHeight: '25px'
        },
        className: "alarm-window-processors ".concat(theme)
      }), /*#__PURE__*/React.createElement("div", {
        className: "alarm-window-container"
      }, registerWindow.map(function (item) {
        return /*#__PURE__*/React.createElement(WindowComponent, {
          key: item.winType,
          winKey: item.winType,
          winType: item.winName,
          activeChange: _this4.activeChange,
          userBehaviorRecord: _this4.userBehaviorRecord,
          registerWindow: registerWindow,
          height: height,
          activeKey: activeKey,
          alarmOperator: operator,
          filterId: filterIdList,
          filterNameList: filterNameList,
          moduleIdList: moduleIdList,
          getContainer: getContainer,
          contextAndToolbar: contextAndToolbar,
          defaultSize: defaultSize,
          needFp: needFp,
          alarmTitlelist: alarmTitlelist,
          extendContextMenu: extendContextMenu,
          onDoubleClick: onDoubleClick,
          clickLock: clickLock,
          autoUnLock: autoUnLock,
          unLockTime: unLockTime,
          theme: theme,
          shareActions: shareActions,
          onTableSelect: onTableSelect,
          externalComp: externalComp,
          registerInfo: registerInfo,
          doubleClickType: doubleClickType,
          exportHtmlType: exportHtmlType,
          removeClearAlarm: removeClearAlarm,
          onCellClick: onCellClick,
          experienceUrl: experienceUrl,
          defaultSecondaryFilter: defaultSecondaryFilter,
          autoCheck: autoCheck,
          autoCheckSize: autoCheckSize,
          autoCheckTimer: autoCheckTimer,
          customFilterHandle: customFilterHandle,
          columnRender: columnRender,
          toolBarStatus: toolBarStatus[item.winType],
          toolBarStatusChange: _this4.toolBarStatusChange,
          extendToolbar: extendToolbar
        });
      })))));
    }
  }]);
}(React.PureComponent);
AlarmWindowProcessor.defaultProps = {
  getContainer: document.body,
  filterIdList: [-1040349155],
  filterNameList: ['tzj-usrid-0'],
  colDispTemplet: 686290260,
  statusDispTemplet: 0,
  frameInfo: {
    serviceConfig: {
      isUseIceGrid: false,
      icegridUrl: '10.10.2.22:4501',
      icegridBackupUrl: '10.10.2.23:4501',
      icegridSvcId: 'IceGridServer/Locator',
      directSvcId: 'Alarm/View',
      directServiceUrl: '10.10.2.21:4519',
      batchSize: 50,
      clientTimeOutSeconds: 3000,
      refreshInterval: 1000
    },
    userInfo: {
      userId: 0,
      userName: 'admin'
    },
    otherService: {
      alarmSoundUrl: 'http://10.12.1.107:7788/',
      filterUrl: 'http://10.10.2.61:8077/',
      viewItemUrl: 'http://10.12.2.166:8085/',
      noticeUrl: 'http://10.12.1.231:8899/'
    }
  },
  registerWindow: [{
    winType: 1,
    // 活动
    winName: 'active'
  }, {
    winType: 2,
    // 确认
    winName: 'confirm'
  }, {
    winType: 0,
    // 清除
    winName: 'clear'
  }, {
    winType: 3,
    // 清除确认
    winName: 'cleardAckWindow'
  }],
  processorAction: {
    operatorEventListenerRealAlarm: function operatorEventListenerRealAlarm() {}
  },
  contextAndToolbar: null,
  subscribeBusiness: 'ClientRegisterRequest',
  defaultSize: 'small',
  title: '',
  needFp: true,
  alarmTitlelist: {
    active: '未清除未确认',
    confirm: '未清除已确认',
    clear: '已清除未确认',
    cleardAck: '已清除已确认'
  },
  extendContextMenu: null,
  onDoubleClick: null,
  clickLock: true,
  autoUnLock: true,
  unLockTime: 60,
  theme: 'light',
  windowCardExtra: null,
  columnBehaviorRecord: false,
  windowId: undefined,
  registerCallBack: function registerCallBack(registerMessage) {},
  onTableSelect: function onTableSelect(selectRows) {},
  // TODO:-----急需优化的功能
  doubleClickType: 0,
  //0是新版，1是老版
  cardHeaderExtra: [],
  cardHeaderShow: true,
  batchSize: 100,
  // TODO:--------分割线之下还没补全文档
  registerParamFormatter: null,
  removeClearAlarm: false,
  onCellClick: function onCellClick(otdata, record, dataIndex) {},
  experienceUrl: '/alarm/setting/experiences',
  defaultSecondaryFilter: null,
  autoCheck: false,
  autoCheckSize: 500,
  autoCheckTimer: 60,
  iconType: 'default',
  operatorRealAlarmRequest: function operatorRealAlarmRequest() {},
  customFilterHandle: true,
  //列过滤功能
  columnRender: null,
  extendToolbar: []
};
AlarmWindowProcessor.propTypes = {};
export default AlarmWindowProcessor;