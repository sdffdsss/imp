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
import ReactDOM from 'react-dom';
import './ossTopo/ot.js';
import './index.css';
import themes from './ossTopo/themes';
import { _ } from 'oss-web-toolkits';
import { ConfigProvider, DataStatus, Tooltip } from 'oss-ui';
import Image_Filter from './images/filter.png';
import Image_FilterWhite from './images/filter-white.png';
import Image_FilterBlue from './images/filter-blue.png';
import Image_Add from './images/add.png';
import Image_AddWhite from './images/add-white.png';
import Image_Reduce from './images/reduce.png';
import Image_ReduceWhite from './images/reduce-white.png';
import Common from '../common';
var clickTouchEvent = null;
var PopoverCard = document.createElement('div');
PopoverCard.addEventListener('mouseup', function (event) {
  event.stopPropagation();
});
PopoverCard.className = 'treegrid-popover';
var treeGridColumnDrawCell = null;
var TreeGrid = /*#__PURE__*/function (_React$Component) {
  function TreeGrid(props) {
    var _this2;
    _classCallCheck(this, TreeGrid);
    _this2 = _callSuper(this, TreeGrid, [props]);
    _this2.moveTimer = null;
    _this2.mouseMoveInfoCache = {
      isMoving: false,
      left: 0,
      top: 0,
      tooltipTitle: ''
    };
    _this2.mouseInViewFlag = false;
    _this2.calcClientWidth = function () {
      var self = _this2;
      function handleResize() {
        var clientWidth = document.documentElement.clientWidth;
        self.setState({
          clientWidth: clientWidth
        });
      }
      handleResize();
      window.addEventListener('resize', _.throttle(handleResize, 500));
    };
    _this2.docuMousemoveEvent = function (event) {
      if (_this2.containerRef) {
        var _this2$containerRef;
        var _this2$containerRef$g = (_this2$containerRef = _this2.containerRef) === null || _this2$containerRef === void 0 ? void 0 : _this2$containerRef.getBoundingClientRect(),
          left = _this2$containerRef$g.left,
          top = _this2$containerRef$g.top;
        var height = _this2.containerRef.clientHeight;
        var width = _this2.containerRef.clientWidth;
        if (event.clientX < left || event.clientX > left + width || event.clientY < top || event.clientY > top + height) {
          _this2.setState({
            mouseMoveInfoState: null
          });
        }
      }
    };
    _this2.bindMouseEvent = function () {
      setTimeout(function () {
        if (_this2.containerRef) {
          document.addEventListener('mousemove', _this2.docuMousemoveEvent);
        }
      }, 1000);
    };
    _this2.handlerRiseze = function () {
      var resizeObserver = new window.ResizeObserver(function (entries) {
        var entry = entries[0];
        var cr = entry.contentRect;
        var crw = cr.width;
        var crh = cr.height;
        if (crw === 0 || crh === 0) {
          return;
        }
        _this2.refreshControl();
      });
      resizeObserver.observe(_this2.containerRef);
    };
    _this2.refreshControl = function () {
      if (_this2.borderPane) {
        _this2.borderPane.invalidate();
      }
    };
    _this2.initTreeGird = function () {
      _this2.treeTablePane = new window.ot.widget.TreeTablePane();
      _this2.borderPane = new window.ot.widget.BorderPane();
      _this2.borderPane.setCenterView(_this2.treeTablePane);
      _this2.view = _this2.borderPane.getView();
      _this2.view.className = 'treegrid-view';
      if (_this2.containerRef) {
        _this2.containerRef.appendChild(_this2.view);
      }
    };
    _this2.initHeader = function () {
      var _this2$props = _this2.props,
        _this2$props$onTableH = _this2$props.onTableHeaderChangeHandler,
        onTableHeaderChangeHandler = _this2$props$onTableH === void 0 ? function () {} : _this2$props$onTableH,
        customFilterHandle = _this2$props.customFilterHandle;
      var tableHeaderHeight = 26;
      _this2.tableHeader = _this2.treeTablePane.getTableHeader();
      // if (!window.ot.Default.isTouchable) {
      //     this.tableHeader.getView().style.background = '';
      // }
      _this2.tableHeader.setHeight(tableHeaderHeight);
      _this2.tableHeader.isShowFilters = _this2.isShowFilters;
      var _this = _this2;
      _this2.tableHeader.drawColumn = function (g, column, x, y, width, height) {
        var self = this;
        var tv = self.tv;
        var icon = window.ot.Default.getImage(column.getIcon());
        var labelAlign = self.getLabelAlign(column);
        //内容
        var label = self.getLabel(column);
        var labelFont = self.getLabelFont(column);
        // var labelFont = _self.styleCfg.font; // "normal normal bold 12px Arial";
        var labelColor = self.getLabelColor(column);
        // if (_self.styleCfg.header.fontcolor) {
        //     labelColor = _self.styleCfg.header.fontcolor;
        // }
        var labelWidth = window.ot.Default.getTextSize(labelFont, label).width;
        var indent = icon ? self._indent : 0;
        if (labelAlign === 'left') {
          if (icon) {
            window.ot.Default.drawStretchImage(g, icon, 'centerUniform', x, y, indent, height);
          }
          window.ot.Default.drawText(g, label, labelFont, labelColor, x + indent, y, width, height, 'left');
        } else if (labelAlign === 'right') {
          if (icon) {
            window.ot.Default.drawStretchImage(g, icon, 'centerUniform', x + width - labelWidth - indent, y, indent, height);
          }
          window.ot.Default.drawText(g, label, labelFont, labelColor, x, y, width, height, 'right');
        } else {
          if (icon) {
            window.ot.Default.drawStretchImage(g, icon, 'centerUniform', x + (width - labelWidth - indent) / 2, y, indent, height);
          }
          window.ot.Default.drawText(g, label, labelFont, labelColor, x + (width - labelWidth + indent) / 2, y, 0, height, 'left');
        }
        //排序图标
        if (column.isSortable() && tv.getSortColumn() === column) {
          var sortIcon = window.ot.Default.getImage(column.getSortOrder() === 'asc' ? self.getSortAscIcon() : self.getSortDescIcon());
          if (sortIcon && !(column.key === 'status_icon_column' || column.key === 'first_column')) {
            var sortIconWidth = sortIcon.width;
            window.ot.Default.drawCenterImage(g, sortIcon, x + width - sortIconWidth, y + height / 2, column, tv);
          }
        }
        //二次过滤图标
        if (column && column.getDisplayName() !== ' ' && customFilterHandle) {
          var filterIcon = null;
          filterIcon = window.ot.Default.getImage(column.a('hasFilter') ? Image_FilterBlue : _this.props.theme === 'light' ? Image_Filter : Image_FilterWhite);
          if (filterIcon) {
            filterIcon.accessKey = 'filter';
            var filterIconWidth = filterIcon.width;
            window.ot.Default.drawCenterImage(g, filterIcon, x + labelWidth + 8, y + height / 2, column, tv);
            column._icon_x = x + labelWidth;
            column._icon_x_end = x + labelWidth + filterIconWidth;
          }
        }
      };
      _this2.tableHeader.onColumnClicked = function (column, event) {
        // this.ownerControl.set('isLock', false);
        //使用逻辑坐标点判断选中
        var lp = _this2.tableHeader.lp(event);
        var px1 = column._icon_x;
        var px2 = column._icon_x_end;
        if (lp.x >= px1 && lp.x <= px2) {
          //执行过滤：调用过滤方法
          if (column.filterDropdown) {
            ReactDOM.render(/*#__PURE__*/React.createElement(ConfigProvider, {
              prefixCls: "oss-ui"
            }, column.filterDropdown(column, {
              confirm: _this2.closeFilterPopoverCar
            })), PopoverCard);
            if (document.body.clientWidth - event.clientX < 460) {
              PopoverCard.style.left = null;
              PopoverCard.style.right = "".concat(document.body.clientWidth - event.clientX, "px");
            } else {
              PopoverCard.style.left = "".concat(event.clientX, "px");
              PopoverCard.style.right = null;
            }
            if (document.body.clientHeight - event.clientY < 304) {
              PopoverCard.style.bottom = "".concat(document.body.clientHeight - event.clientY + event.offsetY, "px");
              PopoverCard.style.top = null;
            } else {
              PopoverCard.style.top = "".concat(event.clientY + 26 - event.offsetY, "px");
              PopoverCard.style.bottom = null;
            }
            PopoverCard.style.display = 'block';
            window.addEventListener('mouseup', _this2.closeFilterPopoverCar);
          }
          return false;
        } else {
          //执行排序，可使用默认的
          if (column.key === 'status_icon_column' || column.key === 'first_column') {
            return true;
          }
          if (_this2.props.handleSort) {
            var order = _this2.treeTableView.getSortColumn() !== column ? 'asc' : column.getSortOrder() === 'asc' ? 'desc' : column.getSortOrder() === 'desc' ? undefined : 'asc';
            _this2.treeTableView.setSortColumn(order && column);
            column.setSortOrder(order);
            _this2.props.handleSort(column, event, order);
            return false;
          } else {
            return true;
          }
        }
      };
      _this2.tableHeader.addViewListener(function (e) {
        if (e.kind === 'validate') {
          onTableHeaderChangeHandler(_this2.columns, _this2.datasource);
        }
      });
    };
    _this2.closeFilterPopoverCar = function () {
      PopoverCard.style.display = 'none';
      ReactDOM.render(/*#__PURE__*/React.createElement(ConfigProvider, {
        prefixCls: "oss-ui"
      }), PopoverCard);
      window.removeEventListener('mouseup', _this2.closeFilterPopoverCar);
    };
    _this2.expandAll = function () {
      _this2.treeTableView.expandAll();
    };
    _this2.collapseAll = function () {
      _this2.treeTableView.collapseAll();
    };
    _this2.getSelectionModel = function () {
      return _this2.datasource.getSelectionModel();
    };
    _this2.initTableView = function () {
      var _Common$Enums$tableRo;
      var _this2$props2 = _this2.props,
        rowDataKey = _this2$props2.rowDataKey,
        _this2$props2$onCellC = _this2$props2.onCellClicked,
        onCellClicked = _this2$props2$onCellC === void 0 ? function () {} : _this2$props2$onCellC,
        _this2$props2$onRowCl = _this2$props2.onRowClicked,
        onRowClicked = _this2$props2$onRowCl === void 0 ? function () {} : _this2$props2$onRowCl,
        _this2$props2$onRowDo = _this2$props2.onRowDoubleClicked,
        onRowDoubleClicked = _this2$props2$onRowDo === void 0 ? function () {} : _this2$props2$onRowDo,
        _this2$props2$onScrol = _this2$props2.onScrollY,
        onScrollY = _this2$props2$onScrol === void 0 ? function () {} : _this2$props2$onScrol,
        _this2$props2$scrollB = _this2$props2.scrollBottom,
        scrollBottom = _this2$props2$scrollB === void 0 ? function () {} : _this2$props2$scrollB;
      _this2.treeTableView = _this2.treeTablePane.getTableView();
      _this2.datasource = new window.ot.DataModel();
      var treeColumn = _this2.treeTableView.getTreeColumn();
      if (!treeGridColumnDrawCell) {
        treeGridColumnDrawCell = treeColumn.drawCell;
      }
      treeColumn.setDisplayName(' ');

      // this.treeTableView.enableToolTip();
      _this2.treeTableView.setRowHeight((((_Common$Enums$tableRo = Common.Enums.tableRowHeight.get(_this2.props.tableSize || 'small')) === null || _Common$Enums$tableRo === void 0 ? void 0 : _Common$Enums$tableRo.key) || 18) + 1);
      _this2.treeTableView.onDataClicked = function (data, event) {
        var _this2$treeTableView$;
        var flag;
        var x = (_this2$treeTableView$ = _this2.treeTableView.lp(event)) === null || _this2$treeTableView$ === void 0 ? void 0 : _this2$treeTableView$.x;
        if (x) {
          var _this2$treeTableView$2;
          var columnWidthArray = ((_this2$treeTableView$2 = _this2.treeTableView.getColumnModel()._roots._as) === null || _this2$treeTableView$2 === void 0 ? void 0 : _this2$treeTableView$2.map(function (item) {
            return item.getWidth();
          })) || [];
          columnWidthArray.reduce(function (pre, cur, index) {
            if (x > pre && x < pre + cur) {
              flag = index;
            }
            return pre + cur;
          }, 0);
          if (flag) {
            var _this2$treeTableView$3;
            onCellClicked(data, data.getAttr(rowDataKey), (_this2$treeTableView$3 = _this2.treeTableView.getColumnModel()._roots._as[flag]) === null || _this2$treeTableView$3 === void 0 ? void 0 : _this2$treeTableView$3.dataIndex);
          }
        }
        clearTimeout(clickTouchEvent);
        clickTouchEvent = setTimeout(function () {
          onRowClicked(data, data.getAttr(rowDataKey), _this2.datasource.getSelectionModel());
        }, 100);
        _this2.setState({
          mouseMoveInfoState: null
        });
      };
      _this2.treeTableView.onDataDoubleClicked = function (data) {
        clearTimeout(clickTouchEvent);
        onRowDoubleClicked(data, data.getAttr(rowDataKey));
        _this2.setState({
          mouseMoveInfoState: null
        });
      };
      _this2.treeTableView.addPropertyChangeListener(function (e) {
        if (e.property === 'translateX') {
          _this2.closeFilterPopoverCar();
        }
        if (e.property === 'translateY') {
          var viewRect = {
            x: -e.data.tx(),
            y: -e.data.ty(),
            width: e.data.getWidth(),
            height: e.data.getHeight()
          };
          var rowHeight = e.data.getRowHeight();
          var startRowIndex = Math.floor(viewRect.y / rowHeight);
          var endRowIndex = Math.ceil((viewRect.y + viewRect.height) / rowHeight);
          onScrollY(startRowIndex, endRowIndex, e);
          var rowSize = _this2.treeTableView.getRowSize();
          var isBottom = rowSize === endRowIndex;
          if (isBottom) {
            scrollBottom(startRowIndex, endRowIndex, e);
          }
        }
      });
      _this2.treeTableView.getView().addEventListener('contextmenu', _this2.onContextMenuHandler);
      var mouseMoveEvent = function mouseMoveEvent(event) {
        clearTimeout(_this2.moveTimer);
        _this2.mouseInViewFlag = true;
        _this2.setState({
          mouseMoveInfoState: null
        });
        _this2.moveTimer = setTimeout(function () {
          if (!_this2.mouseInViewFlag) {
            return;
          }
          _this2.setState({
            mouseMoveInfoState: {
              isMoving: false,
              left: event.offsetX,
              top: event.offsetY,
              tooltipTitle: _this2.treeTableView.getToolTip(event)
            }
          });
        }, 300);
      };
      _this2.treeTableView.getView().addEventListener('mousemove', mouseMoveEvent);
      _this2.treeTableView.getView().addEventListener('mouseleave', function () {
        _this2.mouseInViewFlag = false;
      });
    };
    _this2.onContextMenuHandler = function (e) {
      var _this2$props3 = _this2.props,
        rowDataKey = _this2$props3.rowDataKey,
        _this2$props3$onConte = _this2$props3.onContextMenu,
        onContextMenu = _this2$props3$onConte === void 0 ? function () {} : _this2$props3$onConte;
      e.preventDefault();
      var clickData = _this2.treeTableView.getDataAt(e);
      clickData && onContextMenu(e, clickData, clickData.getAttr(rowDataKey), _this2.datasource.getSelectionModel());
    };
    _this2.scrollTo = function () {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      _this2.treeTableView.makeVisible(_this2.treeTableView.getRowDatas().get(index));
    };
    _this2.treeTablePane = null;
    _this2.borderPane = null;
    _this2.view = null;
    _this2.treeTableView = null;
    _this2.containerRef = /*#__PURE__*/React.createRef();
    _this2.state = {
      clientWidth: 0,
      mouseMoveInfoState: null
    };
    _this2.handlerRiseze = _.debounce(_this2.handlerRiseze, 500);
    return _this2;
  }
  _inherits(TreeGrid, _React$Component);
  return _createClass(TreeGrid, [{
    key: "datasource",
    get: function get() {
      if (this.treeTableView) {
        return this.treeTableView.dm();
      }
      return null;
    },
    set: function set(value) {
      if (this.treeTableView && value instanceof window.ot.DataModel) {
        this.treeTableView.setDataModel(value);
        var onDataPropertyChanged = this.props.onDataPropertyChanged;
        if (onDataPropertyChanged) {
          // e.data代表属性变化的对象
          // e.property代表变化属性的名字
          // e.newValue代表属性的新值
          // e.oldValue代表属性的老值
          // Data对象在设置属性值函数内调用firePropertyChange(property, oldValue, newValue)触发属性变化事件：
          //     get/set类型属性，如setAge(98)触发事件的e.property为age
          //     style类型属性名前加s:前缀以区分，如setStyle('age', 98)触发事件的e.property为s:age
          //     attr类型属性名前加a:前缀以区分，如setAttr('age', 98)触发事件的e.property为a:age
          value.md(onDataPropertyChanged);
        }
      }
    }
  }, {
    key: "columns",
    get: function get() {
      if (this.treeTableView) {
        return this.treeTableView.getColumnModel()._datas._as;
      }
      return null;
    },
    set: function set(values) {
      var _this3 = this;
      if (this.treeTableView) {
        var treeColumn = this.treeTableView.getTreeColumn();
        var width = 60;
        if (values[0].key === 'first_column') {
          width = values[0].width || 60;
          for (var key in values[0]) {
            if (Object.hasOwnProperty.call(values[0], key)) {
              var element = values[0][key];
              treeColumn[key] = element;
            }
          }
        }
        treeColumn.setDisplayName(' ');
        treeColumn.setWidth(width);
        if (values[0].key === 'first_column') {
          values[0] = treeColumn;
        } else {
          values.unshift(treeColumn);
        }
        if (!this.customTreeGridColumnDrawCell) {
          this.customTreeGridColumnDrawCell = treeColumn.drawCell;
        }
        treeColumn.drawCell = function (g, data, selected, column, x, y, width, height) {
          var record = Object.assign(data._attrObject, data._attrObject[_this3.props.rowDataKey]);
          var _ref = column.getDisplayData ? column.getDisplayData(data.getAttr(column.key), record) : {},
            _ref$label = _ref.label,
            label = _ref$label === void 0 ? '' : _ref$label,
            background = _ref.background,
            color = _ref.color,
            selectColor = _ref.selectColor,
            _ref$align = _ref.align,
            align = _ref$align === void 0 ? 'left' : _ref$align;
          if (background) {
            g.fillStyle = selected ? window.ot.Default.darker(background) : background;
            g.beginPath();
            g.rect(x, y, width, height);
            g.fill();
            // 置顶 下划线
            if (record.topAlarm === true) {
              g.beginPath();
              g.fillStyle = '#ccc';
              g.rect(x, y + height - 3, width, 3);
              g.fill();
            }
          }
          var fontColor = selected ? selectColor || _this3.treeTableView._labelSelectColor : color || _this3.treeTableView._labelColor;

          // 清除 字体颜色变化
          if (record.active_status && String(record.active_status.value) !== '1' && _this3.props.winType !== 'clear') {
            var _themes;
            !color && (fontColor = (_themes = themes[_this3.props.theme || 'light']) === null || _themes === void 0 ? void 0 : _themes.clearAlarmTextColor);
          }
          // 二次过滤 文字颜色变化
          if (record.secondary_filter && String(record.secondary_filter.value) === 'false') {
            var _themes2;
            !color && (fontColor = (_themes2 = themes[_this3.props.theme || 'light']) === null || _themes2 === void 0 ? void 0 : _themes2.secondaryFilterWrongSlarmTextColor);
          }
          var level = _this3.treeTableView.getLevel(data);
          var indent = _this3.treeTableView.getIndent();
          var iconWidth = 20;
          if (level > 0) {
            for (var index = level; index > 0; index--) {
              var drawLineX = (indent * index + iconWidth * (index - 1)) / 2;
              g.fillStyle = _this3.props.theme === 'light' ? 'black' : 'white';
              g.beginPath();
              g.rect(drawLineX, y, 1, height);
              g.fill();
            }
          }
          var labelFont = _this3.treeTableView.getLabelFont(column);
          var drawTextX = x + indent * level + (data.hasChildren() ? iconWidth : 0);
          window.ot.Default.drawText(g, label, labelFont, fontColor, drawTextX, y, width, height, align);
          for (var _len = arguments.length, rest = new Array(_len > 8 ? _len - 8 : 0), _key = 8; _key < _len; _key++) {
            rest[_key - 8] = arguments[_key];
          }
          return treeGridColumnDrawCell.apply(void 0, [g, data, selected, column, x, y, width, height].concat(rest));
        };
        this.treeTableView.setColumns(values);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.initTreeGird();
      this.initHeader();
      this.initTableView();
      this.setTheme();
      this.handlerRiseze();
      this.calcClientWidth();
      this.bindMouseEvent();
      document.body.appendChild(PopoverCard);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.theme !== prevProps.theme) {
        this.setTheme();
      }
      if (this.props.tableSize !== prevProps.tableSize) {
        var _Common$Enums$tableRo2;
        this.treeTableView && this.treeTableView.setRowHeight(((_Common$Enums$tableRo2 = Common.Enums.tableRowHeight.get(this.props.tableSize || 'small')) === null || _Common$Enums$tableRo2 === void 0 ? void 0 : _Common$Enums$tableRo2.key) || 18);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.treeTableView.getView().removeEventListener('contextmenu', this.onContextMenuHandler);
    }
  }, {
    key: "invalidateModel",
    value: function invalidateModel() {
      if (this.treeTableView && this.treeTableView.invalidateModel) {
        this.treeTableView.invalidateModel();
      }
    }
  }, {
    key: "invalidateData",
    value: function invalidateData(data) {
      if (this.treeTableView && this.treeTableView.invalidateData) {
        this.treeTableView.invalidateData(data);
      }
    }
  }, {
    key: "setVisibleFunc",
    value: function setVisibleFunc(value) {
      if (this.treeTableView && this.treeTableView.setVisibleFunc && typeof value === 'function') {
        this.treeTableView.setVisibleFunc(value);
      }
    }
  }, {
    key: "setTheme",
    value: function setTheme() {
      var _themes3 = themes[this.props.theme || 'light'],
        collapseIcon = _themes3.collapseIcon,
        expandIcon = _themes3.expandIcon,
        selectedLineBackgroundColor = _themes3.selectedLineBackgroundColor,
        evenLineBackgroundColor = _themes3.evenLineBackgroundColor,
        oddLineBackgroundColor = _themes3.oddLineBackgroundColor,
        insertColor = _themes3.insertColor,
        rowLineColor = _themes3.rowLineColor,
        columnLineColor = _themes3.columnLineColor,
        scrollBarColor = _themes3.scrollBarColor,
        selectBackground = _themes3.selectBackground,
        labelSelectColor = _themes3.labelSelectColor,
        labelColor = _themes3.labelColor,
        headerMoveBackground = _themes3.headerMoveBackground,
        headerColumnLineColor = _themes3.headerColumnLineColor,
        headerLabelColor = _themes3.headerLabelColor,
        headerBackground = _themes3.headerBackground,
        clearAlarmRowColor = _themes3.clearAlarmRowColor,
        relationRowColor = _themes3.relationRowColor;
      var winType = this.props.winType;
      rowLineColor && this.treeTableView.setRowLineColor(rowLineColor); //设置行线颜色
      columnLineColor && this.treeTableView.setColumnLineColor(columnLineColor); //设置列线颜色
      scrollBarColor && this.treeTableView.setScrollBarColor(scrollBarColor); //设置滚动条颜色
      selectBackground && this.treeTableView.setSelectBackground(selectBackground); //设置选中行的背景颜色
      labelSelectColor && this.treeTableView.setLabelSelectColor(labelSelectColor); // 设置选中文字颜色
      labelColor && this.treeTableView.setLabelColor(labelColor); // 设置文字颜色

      this.treeTableView.setExpandIcon(this.props.theme === 'light' ? Image_Reduce : Image_ReduceWhite); //设置toggle的展开图标
      this.treeTableView.setCollapseIcon(this.props.theme === 'light' ? Image_Add : Image_AddWhite); //设置toggle的关闭图标

      // this.treeTableView.getToggleIcon = function (data) {};
      // const { rowDataKey } = this.props;
      this.treeTableView.drawRowBackground = function (g, data, selected, x, y, width, height) {
        //绘制行背景色，默认仅在选中该行时填充选中背景色，可重载自定义
        var record = data._attrObject;
        if (!this.getCheckMode() && selected || this.getCheckMode() && data === this.getFocusData()) {
          selectedLineBackgroundColor && (g.fillStyle = selectedLineBackgroundColor);
        } else {
          if (this.getRowIndex(data) % 2 === 0) {
            evenLineBackgroundColor && (g.fillStyle = evenLineBackgroundColor);
          } else {
            oddLineBackgroundColor && (g.fillStyle = oddLineBackgroundColor);
          }
          // 清除 背景颜色变化
          if (record.active_status && String(record.active_status.value) !== '1' && winType !== 'clear') {
            clearAlarmRowColor && (g.fillStyle = clearAlarmRowColor);
          }
          // 主子关系 背景颜色变化
          if (record.key && record.key.indexOf('#') !== -1) {
            relationRowColor && (g.fillStyle = relationRowColor);
          }
        }
        g.beginPath();
        g.rect(x, y, width, height);
        g.fill();
        g.beginPath();
        // 置顶 下划线
        if (record.topAlarm === true) {
          g.beginPath();
          g.fillStyle = '#ccc';
          g.rect(x, y + height - 3, width, 3);
          g.fill();
        }
      };
      // this.treeTableView.getLabelColor = function (data, column, value) {};

      insertColor && this.tableHeader.setInsertColor(insertColor); //设置移动列时可插入位置的提示颜色
      headerMoveBackground && this.tableHeader.setMoveBackground(headerMoveBackground); //设置移动列时的列头背景色
      headerColumnLineColor && this.tableHeader.setColumnLineColor(headerColumnLineColor); //设置列线颜色
      headerLabelColor && this.tableHeader.setLabelColor(headerLabelColor); //设置表头文字的颜色
      headerBackground && (this.tableHeader.getView().style.background = headerBackground);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var _this$state = this.state,
        mouseMoveInfoState = _this$state.mouseMoveInfoState,
        clientWidth = _this$state.clientWidth;
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "treegrid ".concat(this.props.className),
        ref: function ref(_ref2) {
          return _this4.containerRef = _ref2;
        }
        // style={{ height: this.props.loading ? 'calc(100% - 50px)' : '100%' }}
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          display: this.props.loading ? 'block' : 'none',
          width: '100%',
          height: 30,
          bottom: 0,
          left: 0,
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement(DataStatus, {
        status: "loading",
        loadingImgSize: "small"
      })), !(mouseMoveInfoState === null || mouseMoveInfoState === void 0 ? void 0 : mouseMoveInfoState.isMoving) && (mouseMoveInfoState === null || mouseMoveInfoState === void 0 ? void 0 : mouseMoveInfoState.tooltipTitle) && /*#__PURE__*/React.createElement(Tooltip, {
        visible: true,
        overlayClassName: "treegrid-cell-tooltip-overlay",
        title: mouseMoveInfoState.tooltipTitle,
        placement: "top",
        overlayStyle: {
          maxWidth: clientWidth
        },
        overlayInnerStyle: {
          maxWidth: clientWidth,
          maxHeight: 500,
          overflow: 'auto',
          backgroundColor: 'rgba(255,255,224)',
          color: '#000'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          visibility: 'hidden',
          position: 'absolute',
          left: mouseMoveInfoState.left + 4,
          top: mouseMoveInfoState.top + 25 + 24
        }
      }, "\u5360")));
    }
  }]);
}(React.Component);
export default TreeGrid;