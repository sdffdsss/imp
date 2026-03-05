var _excluded = ["onResize", "width"];
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { useState } from 'react';
import { Resizable } from 'react-resizable';
import classnames from 'classnames';
import "./index.module.css";
var ResizeableTitle = function ResizeableTitle(props) {
  var onResize = props.onResize,
    width = props.width,
    restProps = _objectWithoutProperties(props, _excluded);

  // 添加偏移量
  var _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    offset = _useState2[0],
    setOffset = _useState2[1];
  if (!width) {
    return /*#__PURE__*/React.createElement("th", restProps);
  }
  return /*#__PURE__*/React.createElement(Resizable
  // 宽度重新计算结果，表头应当加上偏移量，这样拖拽结束的时候能够计算结果；
  // 当然在停止事件再计算应当一样
  , {
    width: width + offset,
    height: 0,
    handle: /*#__PURE__*/React.createElement("span", {
      // 有偏移量显示竖线
      className: classnames(['react-resizable-handle', offset && 'active'])
      // 拖拽层偏移
      ,
      style: {
        transform: "translateX(".concat(offset, "px)")
      },
      onClick: function onClick(e) {
        // 取消冒泡，不取消貌似容易触发排序事件
        e.stopPropagation();
        e.preventDefault();
      }
    })
    // 拖拽事件实时更新
    ,
    onResize: function onResize(e, _ref) {
      var size = _ref.size;
      // 这里只更新偏移量，数据列表其实并没有伸缩
      setOffset(size.width - width);
    }
    // 拖拽结束更新
    ,
    onResizeStop: function onResizeStop() {
      // 拖拽结束以后偏移量归零
      setOffset(0);
      // 这里是props传进来的事件，在外部是列数据中的onHeaderCell方法提供的事件，请自行研究官方提供的案例
      onResize && onResize.apply(void 0, arguments);
    },
    draggableOpts: {
      enableUserSelectHack: false
    }
  }, /*#__PURE__*/React.createElement("th", restProps, /*#__PURE__*/React.createElement("div", {
    id: "drop-it"
  }, restProps.children)));
};
export var tableComponent = {
  header: {
    cell: ResizeableTitle
  }
};