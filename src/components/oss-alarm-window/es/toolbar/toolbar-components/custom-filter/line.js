function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
import PropTypes from 'prop-types';
import React, { Component, PureComponent } from 'react';
var defaultAnchor = {
  x: 0.5,
  y: 0.5
};
var defaultLineColor = '#ddd';
var defaultLineStyle = 'solid';
var defaultLineWidth = 2;
var optionalStyleProps = {
  lineColor: PropTypes.string,
  lineStyle: PropTypes.string,
  lineWidth: PropTypes.number,
  className: PropTypes.string,
  zIndex: PropTypes.number
};
var parseAnchorPercent = function parseAnchorPercent(value) {
  var percent = parseFloat(value) / 100;
  if (isNaN(percent) || !isFinite(percent)) {
    throw new Error("LinkTo could not parse percent value \"".concat(value, "\""));
  }
  return percent;
};
var parseAnchorText = function parseAnchorText(value) {
  switch (value) {
    case 'top':
      return {
        y: 0
      };
    case 'left':
      return {
        x: 0
      };
    case 'middle':
      return {
        y: 0.5
      };
    case 'center':
      return {
        x: 0.5
      };
    case 'bottom':
      return {
        y: 1
      };
    case 'right':
      return {
        x: 1
      };
    default:
      return null;
  }
};
var parseAnchor = function parseAnchor(value) {
  if (!value) {
    return defaultAnchor;
  }
  var parts = value.split(' ');
  if (parts.length > 2) {
    throw new Error('LinkTo anchor format is "<x> <y>"');
  }
  var _parts = _slicedToArray(parts, 2),
    x = _parts[0],
    y = _parts[1];
  return Object.assign({}, defaultAnchor, x ? parseAnchorText(x) || {
    x: parseAnchorPercent(x)
  } : {}, y ? parseAnchorText(y) || {
    y: parseAnchorPercent(y)
  } : {});
};
var findElement = function findElement(selector) {
  return document.querySelector(selector);
};
var LogicLine = /*#__PURE__*/function (_Component) {
  function LogicLine() {
    _classCallCheck(this, LogicLine);
    return _callSuper(this, LogicLine, arguments);
  }
  _inherits(LogicLine, _Component);
  return _createClass(LogicLine, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        fromAnchor: parseAnchor(this.props.fromAnchor),
        toAnchor: parseAnchor(this.props.toAnchor)
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "detect",
    value: function detect() {
      var _this$props = this.props,
        from = _this$props.from,
        to = _this$props.to,
        _this$props$within = _this$props.within,
        within = _this$props$within === void 0 ? '' : _this$props$within;
      var elementFrom = findElement(from);
      var elementTo = findElement(to);
      if (!elementFrom || !elementTo || !this.state) {
        return false;
      }

      //TODO:计算锚点位置
      var anchorFrom = this.state.fromAnchor;
      var anchorTo = this.state.toAnchor;
      var boxFrom = elementFrom.getBoundingClientRect();
      var boxTo = elementTo.getBoundingClientRect();

      // 是否有滚动条导致偏移
      var offsetX = window.pageXOffset;
      var offsetY = window.pageYOffset;
      if (within) {
        var p = findElement(within);
        var boxp = p.getBoundingClientRect();
        offsetX -= boxp.left + (window.pageXOffset || document.documentElement.scrollLeft);
        offsetY -= boxp.top + (window.pageYOffset || document.documentElement.scrollTop);
      }
      var x0 = boxFrom.left + boxFrom.width * anchorFrom.x + offsetX;
      var x1 = boxTo.left + boxTo.width * anchorTo.x + offsetX;
      var y0 = boxFrom.top + boxFrom.height * anchorFrom.y + offsetY;
      var y1 = boxTo.top + boxTo.height * anchorTo.y + offsetY;
      return {
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1
      };
    }
  }, {
    key: "render",
    value: function render() {
      var points = this.detect();
      return points ? /*#__PURE__*/React.createElement(Line, _extends({}, points, this.props)) : null;
    }
  }]);
}(Component);
LogicLine.propTypes = Object.assign({}, {
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  within: PropTypes.string,
  fromAnchor: PropTypes.string,
  toAnchor: PropTypes.string
}, optionalStyleProps);
export { LogicLine as default };
export var RightAngleLogicLine = /*#__PURE__*/function (_LogicLine2) {
  function RightAngleLogicLine() {
    _classCallCheck(this, RightAngleLogicLine);
    return _callSuper(this, RightAngleLogicLine, arguments);
  }
  _inherits(RightAngleLogicLine, _LogicLine2);
  return _createClass(RightAngleLogicLine, [{
    key: "render",
    value: function render() {
      var points = this.detect();
      return points ? /*#__PURE__*/React.createElement(RightAngleLine, _extends({}, points, this.props)) : null;
    }
  }]);
}(LogicLine);
export var Line = /*#__PURE__*/function (_PureComponent) {
  function Line() {
    _classCallCheck(this, Line);
    return _callSuper(this, Line, arguments);
  }
  _inherits(Line, _PureComponent);
  return _createClass(Line, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$within;
      (_this$within = this.within) === null || _this$within === void 0 ? void 0 : _this$within.appendChild(this.el);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$within2;
      (_this$within2 = this.within) === null || _this$within2 === void 0 ? void 0 : _this$within2.removeChild(this.el);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;
      var _this$props2 = this.props,
        x0 = _this$props2.x0,
        y0 = _this$props2.y0,
        x1 = _this$props2.x1,
        y1 = _this$props2.y1,
        _this$props2$within = _this$props2.within,
        within = _this$props2$within === void 0 ? '' : _this$props2$within;
      this.within = within ? findElement(within) : document.body;
      var dy = y1 - y0;
      var dx = x1 - x0;
      var angle = Math.atan2(dy, dx) * 180 / Math.PI;
      var length = Math.sqrt(dx * dx + dy * dy);
      var positionStyle = {
        position: 'absolute',
        top: "".concat(y0, "px"),
        left: "".concat(x0, "px"),
        width: "".concat(length, "px"),
        zIndex: Number.isFinite(this.props.zIndex) ? String(this.props.zIndex) : '1',
        transform: "rotate(".concat(angle, "deg)"),
        // Rotate around (x0, y0)
        transformOrigin: '0 0'
      };
      var defaultStyle = {
        borderTopColor: this.props.lineColor || defaultLineColor,
        borderTopStyle: this.props.lineStyle || defaultLineStyle,
        borderTopWidth: this.props.lineWidth || defaultLineWidth
      };
      var props = {
        className: this.props.className,
        style: Object.assign({}, defaultStyle, positionStyle)
      };
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", _extends({
        ref: function ref(el) {
          _this.el = el;
        }
      }, props)));
    }
  }]);
}(PureComponent);
Line.propTypes = Object.assign({}, {
  x0: PropTypes.number.isRequired,
  y0: PropTypes.number.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired
}, optionalStyleProps);
export var RightAngleLine = /*#__PURE__*/function (_PureComponent2) {
  function RightAngleLine() {
    _classCallCheck(this, RightAngleLine);
    return _callSuper(this, RightAngleLine, arguments);
  }
  _inherits(RightAngleLine, _PureComponent2);
  return _createClass(RightAngleLine, [{
    key: "render",
    value: function render() {
      if (this.props.orientation === 'h') {
        return this.renderHorizontal();
      }
      return this.renderVertical();
    }
  }, {
    key: "renderVertical",
    value: function renderVertical() {
      var _this$props3 = this.props,
        x0 = _this$props3.x0,
        y0 = _this$props3.y0,
        x1 = _this$props3.x1,
        y1 = _this$props3.y1;
      var dx = x1 - x0;
      if (dx === 0) {
        return /*#__PURE__*/React.createElement(Line, this.props);
      }
      var lineWidth = this.props.lineWidth || defaultLineWidth;
      var y2 = (y0 + y1) / 2;
      var xOffset = dx > 0 ? lineWidth : 0;
      var minX = Math.min(x0, x1) - xOffset;
      var maxX = Math.max(x0, x1);
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Line, _extends({}, this.props, {
        x0: x0,
        y0: y0,
        x1: x0,
        y1: y2
      })), /*#__PURE__*/React.createElement(Line, _extends({}, this.props, {
        x0: x1,
        y0: y1,
        x1: x1,
        y1: y2
      })), /*#__PURE__*/React.createElement(Line, _extends({}, this.props, {
        x0: minX,
        y0: y2,
        x1: maxX,
        y1: y2
      })));
    }
  }, {
    key: "renderHorizontal",
    value: function renderHorizontal() {
      var _this$props4 = this.props,
        x0 = _this$props4.x0,
        y0 = _this$props4.y0,
        x1 = _this$props4.x1,
        y1 = _this$props4.y1;
      var dy = y1 - y0;
      if (dy === 0) {
        return /*#__PURE__*/React.createElement(Line, this.props);
      }
      var lineWidth = this.props.lineWidth || defaultLineWidth;
      var x2 = (x0 + x1) / 2;
      var yOffset = dy < 0 ? lineWidth : 0;
      var minY = Math.min(y0, y1) - yOffset;
      var maxY = Math.max(y0, y1);
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Line, _extends({}, this.props, {
        x0: x0,
        y0: y0,
        x1: x2,
        y1: y0
      })), /*#__PURE__*/React.createElement(Line, _extends({}, this.props, {
        x0: x1,
        y0: y1,
        x1: x2,
        y1: y1
      })), /*#__PURE__*/React.createElement(Line, _extends({}, this.props, {
        x0: x2,
        y0: minY,
        x1: x2,
        y1: maxY
      })));
    }
  }]);
}(PureComponent);
RightAngleLine.propTypes = Object.assign({}, {
  x0: PropTypes.number.isRequired,
  y0: PropTypes.number.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  orientation: PropTypes.oneOf(['h', 'v'])
}, optionalStyleProps);