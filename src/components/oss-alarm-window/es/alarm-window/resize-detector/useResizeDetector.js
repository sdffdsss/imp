function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
import { useLayoutEffect, useEffect, useState, useRef } from 'react';
import { patchResizeHandler, createNotifier, isSSR } from './utils';
var useEnhancedEffect = isSSR() ? useEffect : useLayoutEffect;
function useResizeDetector() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _props$skipOnMount = props.skipOnMount,
    skipOnMount = _props$skipOnMount === void 0 ? false : _props$skipOnMount,
    refreshMode = props.refreshMode,
    _props$refreshRate = props.refreshRate,
    refreshRate = _props$refreshRate === void 0 ? 1000 : _props$refreshRate,
    refreshOptions = props.refreshOptions,
    _props$handleWidth = props.handleWidth,
    handleWidth = _props$handleWidth === void 0 ? true : _props$handleWidth,
    _props$handleHeight = props.handleHeight,
    handleHeight = _props$handleHeight === void 0 ? true : _props$handleHeight,
    targetRef = props.targetRef,
    observerOptions = props.observerOptions,
    onResize = props.onResize;
  var skipResize = useRef(skipOnMount);
  var localRef = useRef(null);
  var ref = targetRef !== null && targetRef !== void 0 ? targetRef : localRef;
  var resizeHandler = useRef();
  var _useState = useState({
      width: undefined,
      height: undefined
    }),
    _useState2 = _slicedToArray(_useState, 2),
    size = _useState2[0],
    setSize = _useState2[1];
  useEnhancedEffect(function () {
    if (isSSR()) {
      return;
    }
    var notifyResize = createNotifier(onResize, setSize, handleWidth, handleHeight);
    var resizeCallback = function resizeCallback(entries) {
      if (!handleWidth && !handleHeight) return;
      entries.forEach(function (entry) {
        var _ref = entry && entry.contentRect || {},
          width = _ref.width,
          height = _ref.height;
        var shouldSetSize = !skipResize.current && !isSSR();
        if (shouldSetSize) {
          notifyResize({
            width: width,
            height: height
          });
        }
        skipResize.current = false;
      });
    };
    resizeHandler.current = patchResizeHandler(resizeCallback, refreshMode, refreshRate, refreshOptions);
    var resizeObserver = new window.ResizeObserver(resizeHandler.current);
    if (ref.current) {
      // Something wrong with typings here...
      resizeObserver.observe(ref.current, observerOptions);
    }
    return function () {
      resizeObserver.disconnect();
      var patchedResizeHandler = resizeHandler.current;
      if (patchedResizeHandler && patchedResizeHandler.cancel) {
        patchedResizeHandler.cancel();
      }
    };
  }, [refreshMode, refreshRate, refreshOptions, handleWidth, handleHeight, onResize, observerOptions, ref.current]);
  return _objectSpread({
    ref: ref
  }, size);
}
export default useResizeDetector;