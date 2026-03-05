function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["targetRef"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _readOnlyError(r) { throw new TypeError('"' + r + '" is read-only'); }
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
import React, { PureComponent, isValidElement, cloneElement, createRef } from 'react';
import { findDOMNode } from 'react-dom';
import { patchResizeHandler, isFunction, isSSR, isDOMElement, createNotifier } from './utils';
var ResizeDetector = /*#__PURE__*/function (_PureComponent) {
  function ResizeDetector(props) {
    var _this;
    _classCallCheck(this, ResizeDetector);
    _this = _callSuper(this, ResizeDetector, [props]);
    _this.skipOnMount = void 0;
    _this.targetRef = void 0;
    _this.observableElement = void 0;
    _this.resizeHandler = void 0;
    _this.resizeObserver = void 0;
    _this.cancelHandler = function () {
      if (_this.resizeHandler && _this.resizeHandler.cancel) {
        // cancel debounced handler
        _this.resizeHandler.cancel();
        _this.resizeHandler = null;
      }
    };
    _this.attachObserver = function () {
      var _this$props = _this.props,
        targetRef = _this$props.targetRef,
        observerOptions = _this$props.observerOptions;
      if (isSSR()) {
        return;
      }
      if (targetRef && targetRef.current) {
        _this.targetRef.current = targetRef.current;
      }
      var element = _this.getElement();
      if (!element) {
        // can't find element to observe
        return;
      }
      if (_this.observableElement && _this.observableElement === element) {
        // element is already observed
        return;
      }
      _this.observableElement = element;
      _this.resizeObserver.observe(element, observerOptions);
    };
    _this.getElement = function () {
      var _this$props2 = _this.props,
        querySelector = _this$props2.querySelector,
        targetDomEl = _this$props2.targetDomEl;
      if (isSSR()) return null;

      // in case we pass a querySelector
      if (querySelector) return document.querySelector(querySelector);
      // in case we pass a DOM element
      if (targetDomEl && isDOMElement(targetDomEl)) return targetDomEl;
      // in case we pass a React ref using React.createRef()
      if (_this.targetRef && isDOMElement(_this.targetRef.current)) return _this.targetRef.current;

      // the worse case when we don't receive any information from the parent and the library doesn't add any wrappers
      // we have to use a deprecated `findDOMNode` method in order to find a DOM element to attach to
      var currentElement = findDOMNode(_this);
      if (!currentElement) return null;
      var renderType = _this.getRenderType();
      switch (renderType) {
        case 'renderProp':
          return currentElement;
        case 'childFunction':
          return currentElement;
        case 'child':
          return currentElement;
        case 'childArray':
          return currentElement;
        default:
          return currentElement.parentElement;
      }
    };
    _this.createResizeHandler = function (entries) {
      var _this$props3 = _this.props,
        _this$props3$handleWi = _this$props3.handleWidth,
        handleWidth = _this$props3$handleWi === void 0 ? true : _this$props3$handleWi,
        _this$props3$handleHe = _this$props3.handleHeight,
        handleHeight = _this$props3$handleHe === void 0 ? true : _this$props3$handleHe,
        onResize = _this$props3.onResize;
      if (!handleWidth && !handleHeight) return;
      var notifyResize = createNotifier(onResize, _this.setState.bind(_this), handleWidth, handleHeight);
      entries.forEach(function (entry) {
        var _ref = entry && entry.contentRect || {},
          width = _ref.width,
          height = _ref.height;
        var shouldSetSize = !_this.skipOnMount && !isSSR();
        if (shouldSetSize) {
          notifyResize({
            width: width,
            height: height
          });
        }
        _this.skipOnMount = false;
      });
    };
    _this.getRenderType = function () {
      var _this$props4 = _this.props,
        render = _this$props4.render,
        children = _this$props4.children;
      if (isFunction(render)) {
        // DEPRECATED. Use `Child Function Pattern` instead
        return 'renderProp';
      }
      if (isFunction(children)) {
        return 'childFunction';
      }
      if (/*#__PURE__*/isValidElement(children)) {
        return 'child';
      }
      if (Array.isArray(children)) {
        // DEPRECATED. Wrap children with a single parent
        return 'childArray';
      }

      // DEPRECATED. Use `Child Function Pattern` instead
      return 'parent';
    };
    var skipOnMount = props.skipOnMount,
      refreshMode = props.refreshMode,
      _props$refreshRate = props.refreshRate,
      refreshRate = _props$refreshRate === void 0 ? 1000 : _props$refreshRate,
      refreshOptions = props.refreshOptions;
    _this.state = {
      width: undefined,
      height: undefined
    };
    _this.skipOnMount = skipOnMount;
    _this.targetRef = /*#__PURE__*/createRef();
    _this.observableElement = null;
    if (isSSR()) {
      return _possibleConstructorReturn(_this);
    }
    _this.resizeHandler = patchResizeHandler(_this.createResizeHandler, refreshMode, refreshRate, refreshOptions);
    _this.resizeObserver = new window.ResizeObserver(_this.resizeHandler);
    return _this;
  }
  _inherits(ResizeDetector, _PureComponent);
  return _createClass(ResizeDetector, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.attachObserver();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.attachObserver();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (isSSR()) {
        return;
      }
      this.resizeObserver.disconnect();
      this.cancelHandler();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
        render = _this$props5.render,
        children = _this$props5.children,
        _this$props5$nodeType = _this$props5.nodeType,
        WrapperTag = _this$props5$nodeType === void 0 ? 'div' : _this$props5$nodeType;
      var _this$state = this.state,
        width = _this$state.width,
        height = _this$state.height;
      var childProps = {
        width: width,
        height: height,
        targetRef: this.targetRef
      };
      var renderType = this.getRenderType();
      var typedChildren;
      switch (renderType) {
        case 'renderProp':
          return render && render(childProps);
        case 'childFunction':
          typedChildren = children;
          return typedChildren(childProps);
        case 'child':
          // @TODO bug prone logic
          typedChildren = children;
          if (typedChildren.type && typeof typedChildren.type === 'string') {
            // child is a native DOM elements such as div, span etc
            var targetRef = childProps.targetRef,
              nativeProps = _objectWithoutProperties(childProps, _excluded);
            return /*#__PURE__*/cloneElement(typedChildren, nativeProps);
          }
          // class or functional component otherwise
          return /*#__PURE__*/cloneElement(typedChildren, childProps);
        case 'childArray':
          typedChildren = children;
          return typedChildren.map(function (el) {
            return !!el && /*#__PURE__*/cloneElement(el, childProps);
          });
        default:
          return /*#__PURE__*/React.createElement(WrapperTag, null);
      }
    }
  }]);
}(PureComponent);
export default ResizeDetector;