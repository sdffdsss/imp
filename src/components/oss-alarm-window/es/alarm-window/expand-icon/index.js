import React from "react";
import "./index.css";
var expandIcon = function expandIcon(props) {
  var expanded = props.expanded,
    onExpand = props.onExpand,
    record = props.record,
    relationListChildren = props.relationListChildren,
    needFp = props.needFp;
  var textColor = '#000';

  /**
   * @description 关联告警划线展示计算
   * @param {*} index
   * @param {*} num
   */
  var mathRightString = function mathRightString(index, num) {
    var rightString;
    if (num === 0) {
      rightString = "calc(100% + ".concat((num + 1) * 8, "px)");
    } else if (index === list.length - 1) {
      rightString = "calc(100% + ".concat((num - index) * 7.5, "px)");
    } else {
      rightString = "calc(100% + ".concat(((num - index) * 2 - 1) * 7.5, "px)");
    }
    return rightString;
  };

  /**
   * @description
   * @param {*} re
   * @param {*} s
   * @returns
   */
  function patch(re, s) {
    re = eval("/".concat(re, "/ig"));
    return s.match(re).length;
  }
  var num = 0;
  var count = 0;
  var list = [];
  if (record.key.indexOf('#') !== -1) {
    num = patch('#', record.key);
    count = patch('#', record.key);
  }
  while (count > 0) {
    list.push(1);
    count--;
  }
  if (record.children && Array.isArray(record.children) && record.children.length > 0) {
    record.children.forEach(function (item, index) {
      if (!relationListChildren.current.includes(item.key)) {
        props.changeRelationList(item.key);
      }
    });
    var isShowCount = (record.activeChildAlarmCount || record.childAlarmCount) && needFp;
    return expanded ? /*#__PURE__*/React.createElement("span", {
      className: "alarm-window-processer-expanded-span",
      style: {
        color: textColor
      }
    }, list.map(function (item, index) {
      return /*#__PURE__*/React.createElement("span", {
        className: "alarm-window-processer-expanded-span"
      }, relationListChildren.current.includes(record.key) && /*#__PURE__*/React.createElement("span", {
        className: "alarm-window-processer-expanded-span-line-span",
        style: {
          right: mathRightString(index, num)
        }
      }));
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "oss-ui-table-row-expand-icon oss-ui-table-row-expand-icon-expanded",
      "aria-label": "\u5173\u95ED\u884C",
      onClick: function onClick(e) {
        return onExpand(record, e);
      }
    }), isShowCount && /*#__PURE__*/React.createElement("span", null, "[ ", record.activeChildAlarmCount, "/", record.childAlarmCount, " ]")) : /*#__PURE__*/React.createElement("span", {
      className: "alarm-window-processer-expanded-span",
      style: {
        color: textColor
      }
    }, list.map(function (item, index) {
      return /*#__PURE__*/React.createElement("span", {
        className: "alarm-window-processer-expanded-span"
      }, relationListChildren.current.includes(record.key) && /*#__PURE__*/React.createElement("span", {
        className: "alarm-window-processer-expanded-span-line-span",
        style: {
          right: mathRightString(index, num)
        }
      }));
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "oss-ui-table-row-expand-icon oss-ui-table-row-expand-icon-collapsed",
      "aria-label": "\u5173\u95ED\u884C",
      onClick: function onClick(e) {
        return onExpand(record, e);
      }
    }), isShowCount && /*#__PURE__*/React.createElement("span", null, "[ ", record.activeChildAlarmCount, "/", record.childAlarmCount, " ]"));
  }
  return /*#__PURE__*/React.createElement("span", {
    className: "alarm-window-processer-expanded-span",
    style: {
      color: textColor
    }
  }, list.map(function (item, index) {
    return /*#__PURE__*/React.createElement("span", {
      className: "alarm-window-processer-expanded-span"
    }, relationListChildren.current.includes(record.key) && /*#__PURE__*/React.createElement("span", {
      className: "alarm-window-processer-expanded-span-line-span",
      style: {
        right: mathRightString(index, num)
      }
    }));
  }));
};
export default expandIcon;