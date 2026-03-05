function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["dataSource", "pageSize", "loadingControl", "loading", "modalContainer", "size"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { element, bool, number, array, func } from 'prop-types';
import { Table, Spin } from 'oss-ui';
import { logger, _ } from 'oss-web-toolkits';
import { withResizeDetector } from '../resize-detector';
var noop = function noop() {};
var computeState = function computeState(_ref, _ref2) {
  var pageSize = _ref.pageSize;
  var direction = _ref2.direction,
    scrollTop = _ref2.scrollTop,
    scrollHeight = _ref2.scrollHeight,
    tableHeight = _ref2.tableHeight,
    visibleHeight = _ref2.visibleHeight,
    cacheSize = _ref2.cacheSize;
  if (scrollHeight === 0) {
    return {
      startIndex: 0,
      bottomPlaceholderHeight: 0,
      topPlaceholderHeight: 0
    };
  }
  // 行高
  var rowHeight = tableHeight / pageSize;
  // 可视 高度
  var visibleRowCount = Math.round(visibleHeight / rowHeight);
  // 可视化起始位置计算
  var startIndex = Math.round(scrollTop / scrollHeight * cacheSize);
  if (direction === 'up') {
    // 向上滚动 一屏数据
    startIndex -= pageSize - visibleRowCount;
    startIndex = startIndex < 0 ? 0 : startIndex;
  } else {
    startIndex = startIndex + pageSize > cacheSize ? cacheSize - pageSize : startIndex;
  }

  // 底部占位符高度计算
  var bottomPlaceholderHeight = Math.round((cacheSize - (startIndex + pageSize)) * rowHeight);
  startIndex = startIndex > 0 ? startIndex : 0;
  // 顶部占位符高度
  var topPlaceholderHeight = Math.round(startIndex * rowHeight);
  return {
    visibleRowCount: visibleRowCount,
    startIndex: startIndex,
    bottomPlaceholderHeight: bottomPlaceholderHeight,
    topPlaceholderHeight: topPlaceholderHeight
  };
};
var VirtualTable = /*#__PURE__*/function (_PureComponent) {
  function VirtualTable(props) {
    var _this;
    _classCallCheck(this, VirtualTable);
    _this = _callSuper(this, VirtualTable, [props]);
    // 顶部占位
    _this.refTopPlaceholder = null;
    // 底部占位
    _this.refBottomPlaceholder = null;
    // 滚动条
    _this.refScroll = null;
    _this.refTable = null;
    _this.ioTargetState = {
      refBottomPlaceholder: null,
      refTopPlaceholder: null,
      refTable: null
    };
    _this.updateTable = function () {
      var tableHeight = _this.refTable.clientHeight;
      var _this$refScroll = _this.refScroll,
        scrollHeight = _this$refScroll.scrollHeight,
        visibleHeight = _this$refScroll.clientHeight;
      var isPropsChange = _this.state.isPropsChange;
      if (!isPropsChange) {
        // fix bug: 当直接传入的dataSource数据量很大，无法滚动的问题。常见于不是按每页大小递增的情况，如1000条已有数据不需loading直接虚拟滚动显示的时候
        // 如果 isPropsChange === true 则下面的情况是合理的，不能退出state计算，要求重新计算
        if (
        // fix bug: 可能存在DOM更新时空白的情况，此种无效状态，需要过虑掉， （tableHeight 是很大的值，而this.state.tableHeight只是一个初始小值）
        _this.state.tableHeight && Math.abs(tableHeight - _this.state.tableHeight) > 200 ||
        // 容许正常误差
        _this.state.scrollHeight && Math.abs(scrollHeight - _this.state.scrollHeight) > 200 || _this.state.visibleHeight && visibleHeight !== _this.state.visibleHeight) {
          logger.default.debug({
            visibleHeight: visibleHeight,
            'this.state.visibleHeight': _this.state.visibleHeight
          });
          logger.default.debug({
            tableHeight: tableHeight,
            'this.state.tableHeight': _this.state.tableHeight
          });
          logger.default.debug({
            scrollHeight: scrollHeight,
            'this.state.scrollHeight': _this.state.scrollHeight
          });
          return;
        }
      }
      _this.setState(_objectSpread(_objectSpread({}, computeState(_this.props, Object.assign(_this.state, {
        direction: _this.refScroll.scrollTop - _this.state.scrollTop < 0 ? 'up' : 'down',
        scrollTop: _this.refScroll.scrollTop,
        visibleHeight: visibleHeight,
        scrollHeight: scrollHeight,
        tableHeight: tableHeight
      }))), {}, {
        isPropsChange: false
      }));
    };
    _this.state = {
      cacheSize: 0,
      // 缓存的数据集大小
      scrollTop: 0,
      // 滚动条位置
      scrollHeight: 0,
      // 滚动总高度
      tableHeight: 0,
      // oss-ui 表格高度（DOM上的数据集高度）
      visibleHeight: 0,
      // 可视区域高度
      visibleRowCount: 0,
      // 可视区域行数
      startIndex: 0,
      // DOM上的数据集起始索引
      bottomPlaceholderHeight: 0,
      // 下撑高
      topPlaceholderHeight: 0,
      // 上撑高
      isPropsChange: false // 是否是props改变
    };
    return _this;
  }
  _inherits(VirtualTable, _PureComponent);
  return _createClass(VirtualTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      this.refScroll = ReactDOM.findDOMNode(this).getElementsByClassName('oss-ui-table-body')[0] || ReactDOM.findDOMNode(this);
      var _this$refScroll$getEl = this.refScroll.getElementsByTagName('tbody'),
        _this$refScroll$getEl2 = _slicedToArray(_this$refScroll$getEl, 1),
        bodyFirstChild = _this$refScroll$getEl2[0];
      this.refTable = bodyFirstChild;
      this.createBottomPlaceholder();
      this.createTopPlaceholder();
      this.setStateWithThrottle = _.throttle(this.updateTable, 200, {
        leading: false
      });
      this.onFetchWithDebounce = _.debounce(function (cacheSize) {
        var _this2$props$onFetch = _this2.props.onFetch,
          onFetch = _this2$props$onFetch === void 0 ? noop : _this2$props$onFetch;
        onFetch(cacheSize);
      }, 200);
      if (this.props.onScroll) {
        this.refScroll.addEventListener('scroll', this.props.onScroll);
      }
      if (this.refScroll) {
        this.io = new IntersectionObserver(function (changes) {
          _this2.refScroll.removeEventListener('scroll', _this2.setStateWithThrottle);
          if (_this2.state.scrollTop && Math.abs(_this2.refScroll.scrollTop - _this2.state.scrollTop) < 20) {
            // fix bug: 如果滚动步长小于20象素不做处理
            return;
          }
          _this2.ioTargetState = changes.reduce(function (result, change) {
            var ret = _objectSpread({}, result);
            switch (change.target) {
              case _this2.refBottomPlaceholder:
                ret.refBottomPlaceholder = change;
                break;
              case _this2.refTopPlaceholder:
                ret.refTopPlaceholder = change;
                break;
              case _this2.refTable:
                ret.refTable = change;
                break;
              default:
                logger.default.warn('Miss match dom', change);
            }
            return ret;
          }, _this2.ioTargetState);
          var mutation = 'cache scrolling';
          var _this2$ioTargetState = _this2.ioTargetState,
            refBottomPlaceholder = _this2$ioTargetState.refBottomPlaceholder,
            refTopPlaceholder = _this2$ioTargetState.refTopPlaceholder,
            refTable = _this2$ioTargetState.refTable;
          var _this2$state = _this2.state,
            startIndex = _this2$state.startIndex,
            visibleRowCount = _this2$state.visibleRowCount,
            cacheSize = _this2$state.cacheSize;
          var _this2$props = _this2.props,
            loading = _this2$props.loading,
            pageSize = _this2$props.pageSize;
          if (refBottomPlaceholder.intersectionRatio > 0) {
            if (refTable.intersectionRatio > 0 && startIndex + pageSize + visibleRowCount >= cacheSize && !loading) {
              // 已滚动到最后，加载数据
              mutation = 'end';
              logger.default.debug(mutation);
              _this2.setState({
                scrollTop: _this2.refScroll.scrollTop,
                scrollHeight: _this2.refScroll.scrollHeight,
                tableHeight: _this2.refTable.clientHeight
              }, function () {
                _this2.onFetchWithDebounce(cacheSize);
              });
            }
            if (refTable.intersectionRatio > 0) {
              mutation = 'down';
            } else if (refTable.intersectionRatio === 0) {
              mutation = 'down nothing'; // 滚动到没有任何数据显示的区域
            }
          } else if (refTopPlaceholder.intersectionRatio > 0) {
            if (refTopPlaceholder.intersectionRatio === 1) {
              mutation = 'top'; // 滚动到顶了
            } else if (refTable.intersectionRatio > 0) {
              mutation = 'up'; // 滚动到显示的数据头部
            } else if (refTable.intersectionRatio === 0) {
              mutation = 'up nothing'; // 滚动到没有任何数据显示的区域
            }
          }
          // 既 看不到 refTopPlaceholder，refBottomPlaceholder 也看不到 refTable 表示 表格已被隐藏
          else if (refTable.intersectionRatio === 0) {
            logger.default.debug('Bug: IntersectionObserver miss, because which waiting for Idle trigger');
            var height = _this2.props.height;

            // fix bug: 关闭监听
            _this2.toggleObserver(false);
            if (height > 0) {
              _this2.toggleObserver();
            }
            return;
          }
          logger.default.debug(mutation);
          // 补充逻辑 防止出现 大片placeHolder
          if (mutation.includes('nothing')) {
            _this2.refScroll.addEventListener('scroll', _this2.setStateWithThrottle);
          }
          _this2.setStateWithThrottle();
        }, {
          root: this.refScroll,
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        });
        this.toggleObserver();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.refScroll) {
        if (this.props.onScroll) {
          this.refScroll.removeEventListener('scroll', this.props.onScroll);
        }
        this.refScroll.removeEventListener('scroll', this.setStateWithThrottle);
      }
      this.io.disconnect();
    }
  }, {
    key: "createBottomPlaceholder",
    value:
    // 创建底部填充块
    function createBottomPlaceholder() {
      var refBottomPlaceholder = document.createElement('div');
      refBottomPlaceholder.setAttribute('id', 'refBottomPlaceholder');
      this.refScroll.appendChild(refBottomPlaceholder);
      this.refBottomPlaceholder = refBottomPlaceholder;
    }

    // 创建顶部填充块
  }, {
    key: "createTopPlaceholder",
    value: function createTopPlaceholder() {
      var refTopPlaceholder = document.createElement('div');
      refTopPlaceholder.setAttribute('id', 'refTopPlaceholder');
      this.refScroll.insertBefore(refTopPlaceholder, this.refScroll.firstChild);
      this.refTopPlaceholder = refTopPlaceholder;
    }
  }, {
    key: "toggleObserver",
    value: function toggleObserver() {
      var condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (condition) {
        this.io.observe(this.refTopPlaceholder);
        this.io.observe(this.refBottomPlaceholder);
        this.io.observe(this.refTable);
      } else {
        this.io.unobserve(this.refTopPlaceholder);
        this.io.unobserve(this.refBottomPlaceholder);
        this.io.unobserve(this.refTable);
      }
    }
  }, {
    key: "getSnapshotBeforeUpdate",
    value: function getSnapshotBeforeUpdate(prevProps) {
      // 是否在 list 中添加新的 items
      // 捕获滚动​​位置以便我们稍后调整滚动位置。
      var list = this.refScroll;
      if (prevProps.dataSource.length < this.props.dataSource.length && this.refScroll) {
        return list.scrollTop;
      }
      return null;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      // 如果我们 snapshot 有值，说明我们刚刚添加了新的 items，
      // 调整滚动位置使得这些新 items 不会将旧的 items 推出视图。
      // （这里的 snapshot 是 getSnapshotBeforeUpdate 的返回值）
      if (snapshot !== null) {
        var list = this.refScroll;
        // list.scrollTop = list.scrollHeight - snapshot;
        list.scrollTop = snapshot;
        if (prevState.scrollTop !== list.scrollTop) {
          this.updateTable();
        }
      }
      if (prevProps.height === 0 && this.props.height > 0) {
        this.toggleObserver(false);
        this.toggleObserver();
      }
    }
  }, {
    key: "scrollToTop",
    value: function scrollToTop() {
      this.refScroll.scrollTop = 0;
      this.updateTable();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        _this$props$dataSourc = _this$props.dataSource,
        dataSource = _this$props$dataSourc === void 0 ? [] : _this$props$dataSourc,
        pageSize = _this$props.pageSize,
        loadingControl = _this$props.loadingControl,
        loading = _this$props.loading,
        modalContainer = _this$props.modalContainer,
        size = _this$props.size,
        rest = _objectWithoutProperties(_this$props, _excluded);
      var _this$state = this.state,
        startIndex = _this$state.startIndex,
        topPlaceholderHeight = _this$state.topPlaceholderHeight,
        bottomPlaceholderHeight = _this$state.bottomPlaceholderHeight;
      return /*#__PURE__*/React.createElement("div", {
        className: "alarm-window-virtual-table"
      }, /*#__PURE__*/React.createElement(VirtualTable.PlaceHolder, {
        height: topPlaceholderHeight,
        domNode: this.refTopPlaceholder
      }), /*#__PURE__*/React.createElement(VirtualTable.PlaceHolder, {
        height: bottomPlaceholderHeight || 10,
        domNode: this.refBottomPlaceholder,
        loading: loading,
        loadingControl: loadingControl
      }), /*#__PURE__*/React.createElement(Table, _extends({
        size: size
      }, rest, {
        dataSource: dataSource.slice(startIndex, startIndex + pageSize),
        pagination: false,
        getPopupContainer: function getPopupContainer() {
          return modalContainer;
        }
      })));
    }
  }], [{
    key: "PlaceHolder",
    value: function PlaceHolder(_ref3) {
      var height = _ref3.height,
        domNode = _ref3.domNode,
        loading = _ref3.loading,
        loadingControl = _ref3.loadingControl;
      return domNode && /*#__PURE__*/ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
        style: {
          height: "".concat(height, "px")
        }
      }, loading && loadingControl, ' '), domNode);
    }
  }, {
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(_ref4, prevState) {
      var pageSize = _ref4.pageSize,
        length = _ref4.dataSource.length,
        loading = _ref4.loading;
      var tableHeight = prevState.tableHeight,
        prevStateScrollHeight = prevState.scrollHeight,
        visibleRowCount = prevState.visibleRowCount,
        cacheSize = prevState.cacheSize;
      if (pageSize < visibleRowCount) {
        logger.default.warn("pagesize(".concat(pageSize, ") less than visible row count(").concat(visibleRowCount, ")!"));
      }
      var rowHeight = tableHeight / pageSize;
      var increase = length - cacheSize;
      var scrollHeight = Math.round(prevStateScrollHeight + increase * rowHeight);
      if (!loading) {
        scrollHeight = length * rowHeight;
      }
      if (pageSize < increase) {
        logger.default.warn("increase(".concat(increase, ") greater than pageSize(").concat(pageSize, ") "));
      }
      return _objectSpread(_objectSpread({}, computeState({
        pageSize: pageSize
      }, Object.assign(prevState, {
        cacheSize: length,
        scrollHeight: scrollHeight
      }))), {}, {
        isPropsChange: true
      });
    }
  }]);
}(PureComponent);
VirtualTable.defaultProps = {
  // loading 效果， A visual react component for Loading status
  loadingControl: /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      paddingTop: 20,
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Spin, {
    tip: "\u6570\u636E\u52A0\u8F7D\u4E2D..."
  })),
  onScroll: null,
  // 滚动事件
  onFetch: noop,
  // 滚动到低部触发Fetch方法
  sumData: null,
  // 合计行
  loading: false,
  pageSize: 50,
  dataSource: []
};
VirtualTable.propTypes = {
  // loading 效果
  loadingControl: element,
  onScroll: func,
  // 滚动事件
  onFetch: func,
  // 滚动到低部触发Fetch方法
  sumData: array,
  // 合计行
  dataSource: array.isRequired,
  columns: array.isRequired,
  pageSize: number,
  // 每页显示数据数量
  loading: bool // 是否loading状态
};
var VirtualTableWithResizeDetector = withResizeDetector(VirtualTable);
var VirtualTableForward = /*#__PURE__*/React.forwardRef(function (props, ref) {
  return /*#__PURE__*/React.createElement(VirtualTableWithResizeDetector, _extends({}, props, {
    forwardedRef: ref
  }));
});
export { VirtualTableForward as VirtualTable };