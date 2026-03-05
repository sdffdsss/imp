function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { Fragment, useState } from 'react';
import classnames from 'classnames';
import { _ } from 'oss-web-toolkits';
import "./style/index.css";
import { log } from './log';
var Menu = function Menu(props) {
  var menu = props.menu,
    record = props.record,
    alarmClickTarget = props.alarmClickTarget,
    htSelection = props.htSelection,
    openMenuComponent = props.openMenuComponent,
    onSubMenuShow = props.onSubMenuShow,
    onSubMenuClose = props.onSubMenuClose;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    activeLine = _useState2[0],
    setActiveLine = _useState2[1];
  return /*#__PURE__*/React.createElement("div", {
    className: "oss-alarm-window-contextMenu-dom ".concat(props.theme)
  }, /*#__PURE__*/React.createElement("div", {
    className: "contextMenu-dom"
  }, menu && menu.length > 0 &&
  // eslint-disable-next-line array-callback-return
  menu.map(function (menuItem) {
    if (_.find(record, _.partial(menuItem.shouldAction, _, alarmClickTarget))) {
      //可使用按钮
      return /*#__PURE__*/React.createElement("div", {
        key: menuItem.key
      }, menuItem.type === 'separator' && /*#__PURE__*/React.createElement("div", {
        className: "contextMenu-separator"
      }), /*#__PURE__*/React.createElement("div", {
        className: "oss-alarm-window-content-menu-item ".concat(activeLine === menuItem.key ? 'contextMenu-option-active' : 'contextMenu-option'),
        onClick: function onClick(event) {
          setActiveLine(menuItem.key);
          if (menuItem.subMenus && menuItem.subMenus.length) {
            return;
          }
          log(menuItem.key);
          openMenuComponent(menuItem);
        },
        onMouseEnter: function onMouseEnter(event) {
          setActiveLine(menuItem.key);
          if ((!menuItem.subMenus || !menuItem.subMenus.length) && !menuItem.isSubItem) {
            onSubMenuClose(event);
            return;
          }
          if (menuItem.subMenus && menuItem.subMenus.length) {
            onSubMenuShow(event, menuItem, record);
          }
        }
      }, menuItem.name, !!menuItem.subMenus && !!menuItem.subMenus.length && /*#__PURE__*/React.createElement("div", {
        className: "contextMenu-showsub"
      })));
    } else if (!_.find(record, _.partial(menuItem.shouldAction, _, alarmClickTarget))) {
      //禁止使用按钮
      return /*#__PURE__*/React.createElement("div", {
        key: menuItem.key
      }, menuItem.type === 'separator' && /*#__PURE__*/React.createElement("div", {
        className: "contextMenu-separator"
      }), /*#__PURE__*/React.createElement("div", {
        className: "oss-alarm-window-content-menu-item contextMenu-option-disabled",
        onMouseEnter: function onMouseEnter(event) {
          if (!menuItem.isSubItem) {
            onSubMenuClose(event);
            return;
          }
        }
      }, menuItem.name));
    }
  })));
};
export default Menu;