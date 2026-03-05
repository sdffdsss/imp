function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["pageSize", "loadingControl", "loading", "total", "columns", "pagination"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { element, string, bool, number, array, func, oneOfType, oneOf, shape } from 'prop-types';
import { Table, Spin, Pagination } from 'oss-ui';
import { withResizeDetector } from '../resize-detector';
import { logger, _ } from 'oss-web-toolkits';
import "./index.css";
var noop = function noop() {};
var fetchDebounce = function () {
  var loading = [];
  return function (_ref) {
    var page = _ref.page,
      pageSize = _ref.pageSize,
      _ref$onFetch = _ref.onFetch,
      onFetch = _ref$onFetch === void 0 ? noop : _ref$onFetch;
    var now = Date.now();
    if (!loading[page] || loading[page] && now - loading[page] > 1000) {
      onFetch && onFetch({
        page: page,
        pageSize: pageSize
      });
    }
    loading[page] = now;
  };
}();
function getCachePage(_ref2) {
  var step = _ref2.step,
    maxPage = _ref2.maxPage,
    pageSize = _ref2.pageSize,
    onFetch = _ref2.onFetch,
    loading = _ref2.loading,
    cacheData = _ref2.cacheData,
    currentPage = _ref2.currentPage;
  var pageBefore = currentPage - step;
  var pageAfter = currentPage + step;
  var cachePageDataBefore = cacheData[pageBefore];
  var cachePageData = cacheData[currentPage];
  var cachePageDataAfter = cacheData[pageAfter];
  if (!loading) {
    !cachePageData && currentPage > 0 && currentPage <= maxPage && fetchDebounce({
      page: currentPage,
      pageSize: pageSize,
      onFetch: onFetch
    });
    !cachePageDataBefore && pageBefore > 0 && pageBefore <= maxPage && fetchDebounce({
      page: pageBefore,
      pageSize: pageSize,
      onFetch: onFetch
    });
    !cachePageDataAfter && pageAfter > 0 && pageAfter <= maxPage && fetchDebounce({
      page: pageAfter,
      pageSize: pageSize,
      onFetch: onFetch
    });
  }
  var lastOwnDataPage = currentPage;
  if (cachePageDataAfter) {
    lastOwnDataPage = pageAfter;
  } else if (cachePageData) {
    lastOwnDataPage = currentPage;
  } else if (cachePageDataBefore) {
    lastOwnDataPage = pageBefore;
  }
  return [cachePageDataBefore || [], cachePageData || [], cachePageDataAfter || [], lastOwnDataPage];
}
var computeState = function computeState(_ref3, _ref4) {
  var pageSize = _ref3.pageSize,
    onFetch = _ref3.onFetch,
    loading = _ref3.loading,
    total = _ref3.total,
    current = _ref3.pagination.current,
    dataSource = _ref3.dataSource,
    maxCachePagesNumber = _ref3.maxCachePagesNumber;
  var maxPage = _ref4.maxPage,
    currentPage = _ref4.currentPage,
    cacheData = _ref4.cacheData,
    rowHeight = _ref4.rowHeight;
  var newCacheData = cacheData;
  var currentMaxCachePagesNumber = maxCachePagesNumber;
  if (maxCachePagesNumber < 1) {
    currentMaxCachePagesNumber = 1;
  }
  if (currentMaxCachePagesNumber * 2 + 1 < maxPage) {
    var startPage = currentPage - currentMaxCachePagesNumber;
    startPage = startPage < 1 ? 1 : startPage;
    var endPage = currentPage + currentMaxCachePagesNumber;
    endPage = endPage > maxPage ? maxPage : endPage;
    cacheData[current] = dataSource; // eslint-disable-line
    newCacheData = Array.from({
      length: maxPage
    });
    Array.prototype.splice.apply(newCacheData, [startPage, endPage - startPage + 1].concat(cacheData.slice(startPage, endPage + 1)));
  }
  newCacheData[current] = dataSource;
  var _getCachePage = getCachePage({
      step: 1,
      maxPage: maxPage,
      pageSize: pageSize,
      onFetch: onFetch,
      loading: loading,
      cacheData: newCacheData,
      currentPage: currentPage
    }),
    _getCachePage2 = _slicedToArray(_getCachePage, 4),
    cachePageDataBefore = _getCachePage2[0],
    cachePageData = _getCachePage2[1],
    cachePageDataAfter = _getCachePage2[2],
    lastOwnDataPage = _getCachePage2[3];
  var topHeight = Math.round((currentPage - 1 - (cachePageDataBefore.length ? 1 : 0)) * pageSize * rowHeight);
  var bottomHeight = Math.round(
  // 已经是最后一页，直接返回0，否则如果有零头total % pageSize，需要加上不满一个page的零头lastOwnDataPageLength，但需要少加一个整页pageSize
  maxPage === lastOwnDataPage ? 0 : ((maxPage - lastOwnDataPage) * pageSize + total % pageSize) * rowHeight);
  var realDataSource = cachePageDataBefore.concat(cachePageData).concat(cachePageDataAfter);
  return {
    hasCacheBefore: !!cachePageDataBefore.length,
    hasCache: !!cachePageData.length,
    hasCacheAfter: !!cachePageDataAfter.length,
    cacheData: newCacheData,
    dataSource: realDataSource,
    bottomHeight: bottomHeight,
    topHeight: topHeight
  };
};

/* eslint-disable react/no-redundant-should-component-update */
var PaginationTable = /*#__PURE__*/function (_Component) {
  function PaginationTable(props) {
    var _this;
    _classCallCheck(this, PaginationTable);
    _this = _callSuper(this, PaginationTable, [props]);
    _this.isInitial = true;
    // 初始状态，未渲染任何数据
    _this.isReady = false;
    // 已渲染首屏数据，可交互的状态
    _this.isPageBoundary = false;
    // 当前页，上下边界更新
    _this.isPaginationClick = false;
    _this.refTopPlaceholder = null;
    _this.refBottomPlaceholder = null;
    _this.refLoadingPlaceholder = null;
    _this.refScroll = null;
    _this.refTable = null;
    _this.refFooter = null;
    _this.refPageBoundaryBefore = null;
    // 当前页的第一条DOM数据
    _this.refPageBoundaryAfter = null;
    // 当前页的最后一条DOM数据
    _this.ioTargetState = {
      refBottomPlaceholder: null,
      refTopPlaceholder: null,
      refTable: null,
      refPageBoundaryBefore: null,
      refPageBoundaryAfter: null
    };
    _this.scrollToPage = function () {
      var _this$props$paginatio;
      var pageSize = _this.props.pageSize;
      var rowHeight = _this.state.rowHeight;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var page = args[0];
      _this.refScroll.scrollTop = (page - 1) * pageSize * rowHeight + 1; // Bug fix: + 1个像素,点击页码向后翻页时存在少一个像素就变成上一页的bug
      _this.isPaginationClick = true;
      _this.props.pagination && _this.props.pagination.onChange && (_this$props$paginatio = _this.props.pagination).onChange.apply(_this$props$paginatio, args);
      _this.updateTable();
    };
    _this.updateTable = function () {
      var tableHeight = _this.refTable.clientHeight;
      var scrollTop = _this.refScroll.scrollTop;
      var _this$state = _this.state,
        rowHeight = _this$state.rowHeight,
        maxPage = _this$state.maxPage;
      var _this$props = _this.props,
        pageSize = _this$props.pageSize,
        total = _this$props.total;
      if (_this.isInitial) {
        // 还在初始状态
        maxPage = Math.ceil(total / pageSize);
        var length = _this.state.dataSource.length;
        rowHeight = tableHeight / length;
        if (length > 0 && rowHeight) {
          // 当行高出现，表示初次呈现数据数时
          _this.isInitial = false;
          _this.initialReslove();
        }
      }
      var currentPage = Math.floor(scrollTop / (pageSize * rowHeight)) + 1 || 1;
      currentPage = currentPage > maxPage ? maxPage : currentPage;
      logger.default.warn('currentPage:', currentPage);
      _this.setState({
        direction: _this.refScroll.scrollTop - _this.state.scrollTop < 0 ? 'up' : 'down',
        scrollTop: _this.refScroll.scrollTop,
        maxPage: maxPage,
        currentPage: currentPage,
        rowHeight: rowHeight
      });
    };
    _this.state = {
      scrollTop: 0,
      // 滚动条位置
      dataSource: [],
      // DOM上显示的数据
      rowHeight: 0,
      // 每行的实际高度
      cacheData: [],
      // 缓存的数据集大小
      currentPage: 1,
      // 当前页位置
      bottomHeight: 0,
      // 下撑高
      topHeight: 0 // 上撑高
    };
    _this.tableRef = /*#__PURE__*/React.createRef();
    return _this;
  }
  _inherits(PaginationTable, _Component);
  return _createClass(PaginationTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      /* eslint-disable */
      this.refRoot = ReactDOM.findDOMNode(this);
      this.refScroll = this.refRoot.getElementsByClassName('oss-ui-table-body')[0];
      this.refTable = this.refScroll.getElementsByTagName('tbody')[0];
      /* eslint-enabled */
      this.createBottomPlaceholder();
      this.createTopPlaceholder();
      this.setStateWithThrottle = _.throttle(this.updateTable, 0);
      this.props.onScroll && this.refScroll.addEventListener('scroll', this.props.onScroll);
      if (this.refScroll) {
        this.io = new IntersectionObserver(function (changes) {
          var shouldUpdate = true;
          _this2.ioTargetState = changes.reduce(function (result, change) {
            var ret = _objectSpread({}, result);
            switch (change.target) {
              case _this2.refPageBoundaryBefore:
                ret.refPageBoundaryBefore = change;
                // Bug fix:
                // 向下滚动的时候，如果边界第一行数据触发，不需要更新视图，因为上一页的最后一行已经触发了视图更新,
                // 但是用户通过点击分页切换，而不是滚动的情况例外，因为此时需要更新页码
                if (!_this2.isPaginationClick && changes.length === 1 && _this2.state.direction === 'down') {
                  shouldUpdate = false;
                }
                break;
              case _this2.refPageBoundaryAfter:
                ret.refPageBoundaryAfter = change;
                // Bug fix:
                // 向上滚动的时候，如果边界最后行数据触发，不需要更新视图，因为上一页的第一行已经触发了视图更新
                // 但是用户通过点击分页切换，而不是滚动的情况例外，因为此时需要更新页码
                if (!_this2.isPaginationClick && changes.length === 1 && _this2.state.direction === 'up') {
                  shouldUpdate = false;
                }
                break;
              case _this2.refTable:
                ret.refTable = change;
                break;
              case _this2.refBottomPlaceholder:
                ret.refBottomPlaceholder = change;
                break;
              case _this2.refTopPlaceholder:
                ret.refTopPlaceholder = change;
                break;
              default:
            }
            return ret;
          }, _this2.ioTargetState);
          _this2.isPaginationClick = false;
          var _this2$ioTargetState = _this2.ioTargetState,
            refTable = _this2$ioTargetState.refTable,
            refBottomPlaceholder = _this2$ioTargetState.refBottomPlaceholder,
            refTopPlaceholder = _this2$ioTargetState.refTopPlaceholder;
          if (refTable.intersectionRatio === 0 || refBottomPlaceholder.intersectionRatio > 0 || refTopPlaceholder.intersectionRatio > 0) {
            _this2.toggleObserver(false);
            _this2.toggleObserver();
          }
          shouldUpdate && _this2.setStateWithThrottle();
        }, {
          root: this.refScroll,
          threshold: [0, 1]
        });
        this.toggleObserver();
      }
      var _this$props$onFetch = this.props.onFetch,
        onFetch = _this$props$onFetch === void 0 ? noop : _this$props$onFetch;
      onFetch && onFetch({
        page: 1,
        pageSize: this.props.pageSize
      });
      new Promise(function (reslove) {
        _this2.initialReslove = reslove;
      }).then(function () {
        var _this2$props = _this2.props,
          pageSize = _this2$props.pageSize,
          _this2$props$paginati = _this2$props.pagination.defaultCurrent,
          defaultCurrent = _this2$props$paginati === void 0 ? 1 : _this2$props$paginati;
        _this2.createLoadingPlaceholder();
        _this2.scrollToPage(defaultCurrent);
        var visibleRowCount = Math.round(_this2.refScroll.clientHeight / _this2.state.rowHeight);
        _this2.isReady = true;
        if (pageSize < visibleRowCount) {
          logger.default.warn("pagesize(".concat(pageSize, ") less than visible row count(").concat(visibleRowCount, ")!"));
        }
      });
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var pageSize = nextProps.pageSize,
        columns = nextProps.columns;
      if (columns !== this.props.columns) {
        return true;
      }
      var maxPage = nextState.maxPage,
        currentPage = nextState.currentPage,
        dataSource = nextState.dataSource,
        direction = nextState.direction,
        rowHeight = nextState.rowHeight;
      var shouldUpdate = true;

      // 有且仅有当前页上下边界同时触发时，表示更换边界，不需要更新
      if (this.isPageBoundary) {
        shouldUpdate = false;
        this.isPageBoundary = false;
      }
      logger.default.warn('shouldUpdate:updateBoundary', shouldUpdate);
      if (shouldUpdate && !this.isInitial) {
        var currentPageReal = currentPage;

        // 由于state中的currentPage延迟与真实的currentPage不一致，当出现这种情况时，强制updateTable()
        currentPageReal = Math.floor(this.refScroll.scrollTop / (pageSize * rowHeight)) + 1 || 1;
        currentPageReal = currentPageReal > maxPage ? maxPage : currentPageReal;
        if (currentPageReal !== currentPage) {
          this.updateTable();
          shouldUpdate = false;
        }
        logger.default.warn('shouldUpdate:currentPageReal', {
          currentPageReal: currentPageReal,
          currentPage: currentPage
        });
      }
      if (shouldUpdate) {
        var _this$ioTargetState = this.ioTargetState,
          refPageBoundaryBefore = _this$ioTargetState.refPageBoundaryBefore,
          refPageBoundaryAfter = _this$ioTargetState.refPageBoundaryAfter;
        switch (direction) {
          case 'up':
            if (this.state.hasCacheAfter && currentPage < maxPage - 2 &&
            // Bug fix: 如果是最后三页向后点击切换，需要刷新视图，否则页码表记停留在前一页
            refPageBoundaryBefore && refPageBoundaryBefore.intersectionRatio > 0) shouldUpdate = false;
            break;
          case 'down':
            if (this.state.currentPage === currentPage && this.state.hasCacheAfter &&
            // Bug fix: 可能存在3页数据已经加载到了, 但之前没有刷新的情况，所以需要刷新，判断特征是之前的数据小于3页
            refPageBoundaryAfter && refPageBoundaryAfter.intersectionRatio > 0) shouldUpdate = false;
        }
      }
      if (shouldUpdate) {
        shouldUpdate = [1, maxPage, maxPage - 1, maxPage - 2].includes(currentPage) ? dataSource.length > 0 : [].concat(_toConsumableArray(this.fullLoading ? [] : [0, pageSize, pageSize * 2]), [pageSize * 3]).includes(dataSource.length);
      }
      return shouldUpdate;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(preProps, preState) {
      var _this$state2 = this.state,
        hasCache = _this$state2.hasCache,
        hasCacheBefore = _this$state2.hasCacheBefore,
        currentPage = _this$state2.currentPage,
        dataSource = _this$state2.dataSource,
        maxPage = _this$state2.maxPage;
      var pageSize = this.props.pageSize;
      if (!this.isInitial) {
        var before, after;
        if (hasCache && hasCacheBefore) {
          if (currentPage === 1 || currentPage === maxPage - 1) {
            before = 0;
            after = pageSize - 1;
          } else if (currentPage === maxPage) {
            before = 0;
            after = dataSource.length - 1;
          } else {
            before = pageSize;
            after = pageSize * 2 - 1;
          }
          if (this.io && this.refTable && this.refPageBoundaryBefore !== this.refTable.children[before]) {
            this.refPageBoundaryBefore && this.io.unobserve(this.refPageBoundaryBefore);
            this.refPageBoundaryAfter && this.io.unobserve(this.refPageBoundaryAfter);
            this.refPageBoundaryBefore = this.refTable.children[before];
            this.refPageBoundaryAfter = this.refTable.children[after];
            this.refPageBoundaryAfter && this.io.observe(this.refPageBoundaryAfter);
            this.refPageBoundaryBefore && this.io.observe(this.refPageBoundaryBefore);
            this.refPageBoundaryBefore && logger.default.warn('componentDidUpdate:refPageBoundaryBefore', this.refPageBoundaryBefore.innerText);
            this.refPageBoundaryAfter && logger.default.warn('componentDidUpdate:refPageBoundaryAfter', this.refPageBoundaryAfter.innerText);
            this.isPageBoundary = true;
          }
        }
        var emptyPlaceholder = this.refRoot.querySelector('.oss-ui-table-placeholder');
        emptyPlaceholder && (emptyPlaceholder.style.display = 'none');
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.onScroll && this.refScroll && this.refScroll.removeEventListener('scroll', this.props.onScroll);
      this.io && this.io.disconnect();
    }
  }, {
    key: "createLoadingPlaceholder",
    value: function createLoadingPlaceholder() {
      var refLoadingPlaceholder = document.createElement('div');
      refLoadingPlaceholder.setAttribute('id', 'refLoadingPlaceholder');
      var clientRect = this.refScroll.getBoundingClientRect();
      refLoadingPlaceholder.setAttribute('style', "position:fixed; width:".concat(clientRect.width, "px; height:").concat(clientRect.height, "px"));
      this.refScroll.insertBefore(refLoadingPlaceholder, this.refScroll.firstChild);
      this.refLoadingPlaceholder = refLoadingPlaceholder;
    }

    // 创建底部填充块
  }, {
    key: "createBottomPlaceholder",
    value: function createBottomPlaceholder() {
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
        this.refPageBoundaryBefore && this.io.observe(this.refPageBoundaryBefore);
        this.refPageBoundaryAfter && this.io.observe(this.refPageBoundaryAfter);
      } else {
        this.io.unobserve(this.refTopPlaceholder);
        this.io.unobserve(this.refBottomPlaceholder);
        this.io.unobserve(this.refTable);
        this.refPageBoundaryBefore && this.io.unobserve(this.refPageBoundaryBefore);
        this.refPageBoundaryAfter && this.io.unobserve(this.refPageBoundaryAfter);
      }
    }
  }, {
    key: "getCacheData",
    value: function getCacheData() {
      return this.state.cacheData;
    }
  }, {
    key: "clearCacheData",
    value: function clearCacheData() {
      this.setState({
        cacheData: []
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
        pageSize = _this$props2.pageSize,
        loadingControl = _this$props2.loadingControl,
        loading = _this$props2.loading,
        total = _this$props2.total,
        columns = _this$props2.columns,
        pagination = _this$props2.pagination,
        rest = _objectWithoutProperties(_this$props2, _excluded);
      var _this$state3 = this.state,
        dataSource = _this$state3.dataSource,
        topHeight = _this$state3.topHeight,
        bottomHeight = _this$state3.bottomHeight,
        cacheData = _this$state3.cacheData,
        currentPage = _this$state3.currentPage;
      this.fullLoading = !cacheData[currentPage];
      var fullLoading = this.fullLoading;
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(PaginationTable.LoadingPlaceHolder, {
        domNode: this.refLoadingPlaceholder,
        loading: fullLoading,
        loadingControl: loadingControl
      }), /*#__PURE__*/React.createElement(PaginationTable.PlaceHolder, {
        height: topHeight,
        domNode: this.refTopPlaceholder,
        loading: loading && !fullLoading,
        loadingControl: /*#__PURE__*/React.createElement("div", {
          style: {
            textAlign: 'center',
            paddingTop: 20,
            paddingBottom: 20
          }
        }, loadingControl)
      }), /*#__PURE__*/React.createElement(PaginationTable.PlaceHolder, {
        height: bottomHeight,
        domNode: this.refBottomPlaceholder,
        loading: loading && !fullLoading,
        loadingControl: /*#__PURE__*/React.createElement("div", {
          style: {
            textAlign: 'center',
            paddingTop: 20,
            paddingBottom: 20
          }
        }, loadingControl)
      }), !!total && pagination && ['top', 'both'].includes(pagination.position) && /*#__PURE__*/React.createElement(Pagination, _extends({
        showQuickJumper: true
      }, pagination, {
        onChange: this.scrollToPage,
        current: currentPage,
        pageSize: pageSize,
        showSizeChanger: false,
        total: total,
        className: "alarm-window-pagination-table ".concat(pagination && pagination.className ? pagination.className : '')
      })), /*#__PURE__*/React.createElement(Table, _extends({
        rowKey: function rowKey(record) {
          return record.key;
        }
      }, rest, {
        ref: this.tableRef,
        columns: columns,
        dataSource: dataSource,
        pagination: false,
        className: "alarm-window-pagination-table ".concat(rest.className ? rest.className : '')
      })), !!total && pagination && [undefined, 'bottom', 'both'].includes(pagination.position) && /*#__PURE__*/React.createElement(Pagination, _extends({
        showQuickJumper: true
      }, pagination, {
        onChange: this.scrollToPage,
        current: currentPage,
        pageSize: pageSize,
        showSizeChanger: false,
        total: total,
        className: "alarm-window-pagination-table-pagination ".concat(pagination && pagination.className ? pagination.className : '')
      })));
    }
  }], [{
    key: "PlaceHolder",
    value: function PlaceHolder(_ref5) {
      var height = _ref5.height,
        domNode = _ref5.domNode,
        loading = _ref5.loading,
        loadingControl = _ref5.loadingControl;
      return domNode && /*#__PURE__*/ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
        style: {
          height: "".concat(height, "px")
        }
      }, loading && loadingControl, ' '), domNode);
    }
  }, {
    key: "LoadingPlaceHolder",
    value: function LoadingPlaceHolder(_ref6) {
      var domNode = _ref6.domNode,
        loading = _ref6.loading,
        loadingControl = _ref6.loadingControl;
      return domNode && /*#__PURE__*/ReactDOM.createPortal(loading ? loadingControl : /*#__PURE__*/React.createElement("div", null), domNode);
    }
  }, {
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, prevState) {
      return computeState(props, prevState);
    }
  }]);
}(Component);
PaginationTable.defaultProps = {
  // loading 效果， A visual react component for Loading status
  loadingControl: /*#__PURE__*/React.createElement(Spin, {
    tip: "\u6570\u636E\u52A0\u8F7D\u4E2D..."
  }),
  pagination: {
    defaultCurrent: 1
  },
  // 分页器
  maxCachePagesNumber: Infinity,
  onScroll: null,
  // 滚动事件
  onFetch: noop,
  // 滚动到低部触发Fetch方法
  total: 0,
  // 总共数据条数
  loading: false,
  // 是否loading状态
  pageSize: 50 // 每次Loading数据量，pageSize * 3 = 最大真实DOM大小，Reality DOM row count
};
PaginationTable.propTypes = {
  // loading 效果
  className: string,
  loadingControl: element,
  onScroll: func,
  // 滚动事件
  pagination: oneOfType([bool, shape({
    className: string,
    position: oneOf(['both', 'top', 'bottom']),
    defaultCurrent: number,
    hideOnSinglePage: bool,
    itemRender: func,
    showQuickJumper: bool,
    showTotal: func,
    simple: bool,
    size: string,
    onChange: func
  })]),
  onFetch: func.isRequired,
  // 滚动触发Fetch方法
  maxCachePagesNumber: number.isRequired,
  pageSize: number.isRequired,
  total: number.isRequired,
  dataSource: array.isRequired,
  columns: array.isRequired,
  loading: bool.isRequired
};
var PaginationTableWithResizeDetector = withResizeDetector(PaginationTable);
var PaginationTableForward = /*#__PURE__*/React.forwardRef(function (props, ref) {
  console.log(ref);
  return /*#__PURE__*/React.createElement(PaginationTableWithResizeDetector, _extends({}, props, {
    forwardedRef: ref
  }));
});
export { PaginationTableWithResizeDetector as PaginationTable };