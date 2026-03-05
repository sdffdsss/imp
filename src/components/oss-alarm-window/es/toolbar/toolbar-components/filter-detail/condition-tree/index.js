function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useEffect, useRef } from 'react';
import { Tree } from 'oss-ui';
import Common from '../../../../common';
import { _ } from 'oss-web-toolkits';
export default /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    expandedKeys = _useState2[0],
    setExpandedKeys = _useState2[1];
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    conditionTreeData = _useState4[0],
    setConditionTreeData = _useState4[1];
  var allKeys = useRef([]);
  //将条件格式化为tree组件数据
  var formatTreeData = function formatTreeData(data) {
    var conditionTreeData = [];
    var expandedKeys = [];
    // debugger;
    data.forEach(function (itemCond, indexCond) {
      expandedKeys.push("".concat(indexCond));
      var conditionItem = {
        key: "".concat(indexCond),
        title: "".concat(itemCond.conditionLabel).concat(itemCond.reverse === Common.Enums.FILTER_EMUN.REVERSE.TRUE ? '[取反]' : ''),
        value: itemCond,
        children: []
      };
      var conditionItemList = _toConsumableArray(itemCond.conditionExpr.conditionItemList);
      var uniqConditionItemList = _.uniqBy(conditionItemList, "fieldName");
      var repeatConditions = [];
      /***
       * 条件组中，存在重复条件,找出重复条件，另做处理
       */
      if (!(conditionItemList.length === uniqConditionItemList.length)) {
        var newConditionItemList = _toConsumableArray(conditionItemList);

        //
        conditionItemList.forEach(function (itemIn) {
          var arr = _.filter(newConditionItemList, function (o) {
            return o.fieldName === itemIn.fieldName;
          });
          if (arr.length > 1) {
            //将重复条件从原始集合中移除
            _.remove(newConditionItemList, function (o) {
              return o.fieldName === itemIn.fieldName;
            });

            //将重复的条件存储
            repeatConditions.push({
              key: itemIn.fieldName,
              value: arr
            });
          }
        });
      }
      uniqConditionItemList.forEach(function (itemIn, indexIn) {
        expandedKeys.push("".concat(indexCond, "-").concat(indexIn));
        var conditionChild = {
          key: "".concat(indexCond, "-").concat(indexIn),
          title: "".concat(itemIn.fieldLabel).concat(itemIn.reverse === Common.Enums.FILTER_EMUN.REVERSE.TRUE ? '[取反]' : ''),
          children: []
        };
        var repeatCondition = _.find(repeatConditions, function (o) {
          return o.key === itemIn.fieldName;
        });
        if (repeatCondition && Object.keys(repeatCondition).length > 0) {
          var repeatarr = _.map(repeatCondition.value, function (item) {
            if (item.compareType === 'between') {
              return "[\u4ECB\u4E8E".concat(item.valueList[0].value, "-").concat(item.valueList[1].value, "\u4E4B\u95F4]");
            } else {
              var valuestr = _.map(item.valueList, function (item) {
                return item.value;
              });
              var operatorText = Common.Enums.numberOperator.getName(item.compareType);
              return "[".concat(operatorText).concat(_.join(valuestr, ','), "]");
            }
          });
          conditionChild.children.push({
            title: repeatarr.length === 1 ? repeatarr[0] : "".concat(_.join(repeatarr, '或')),
            key: "".concat(indexCond, "-").concat(indexIn, "-0")
          });
        } else if (itemIn.valueList && itemIn.valueList.length > 0) {
          // debugger;
          if (itemIn.dataType === 'string') {
            var children = {};
            if (itemIn.compareType === Common.Enums.FILTER_EMUN.COMPARETYPE.ISNULL || itemIn.compareType === Common.Enums.FILTER_EMUN.COMPARETYPE.NOTNULL) {
              children = {
                title: Common.Enums.strOperator.getName(itemIn.compareType),
                key: "".concat(indexCond, "-").concat(indexIn, "-0")
              };
            } else {
              //字符类型，仅高级条件
              var str = itemIn.valueList.map(function (item) {
                return item.value;
              });
              children = {
                title: "".concat(_.join(str, ',')),
                key: "".concat(indexCond, "-").concat(indexIn, "-0")
              };
            }
            conditionChild.children.push(children);
          } else if (itemIn.dataType === 'date' || itemIn.dataType === 'time') {
            //时间类型, 仅高级条件
            var date = itemIn.valueList.map(function (item) {
              return item.value;
            });
            conditionChild.children.push({
              title: "".concat(_.join(date, '-')),
              key: "".concat(indexCond, "-").concat(indexIn, "-0")
            });
          } else if (itemIn.dataType === 'integer' || itemIn.dataType === 'long' || itemIn.dataType === 'double') {
            //普通条件
            itemIn.valueList.forEach(function (itemChild, indexChild) {
              conditionChild.children.push({
                title: "".concat(itemChild.value),
                key: "".concat(indexCond, "-").concat(indexIn, "-").concat(indexChild, "-").concat(itemChild.key)
              });
            });
          }
        }
        conditionItem['children'].push(conditionChild);
      });
      conditionTreeData.push(conditionItem);
    });
    allKeys.current = expandedKeys;
    return {
      conditionTreeData: conditionTreeData,
      expandedKeys: expandedKeys
    };
  };
  var onExpand = function onExpand(expandedKeys, _ref) {
    var expanded = _ref.expanded,
      node = _ref.node;
    setExpandedKeys(expandedKeys);
  };
  useEffect(function () {
    // debugger;
    if (props.data && Object.keys(props.data).length > 0) {
      //展示/编辑
      var _formatTreeData = formatTreeData(props.data),
        _conditionTreeData = _formatTreeData.conditionTreeData,
        _expandedKeys = _formatTreeData.expandedKeys;
      setExpandedKeys(_expandedKeys);
      setConditionTreeData(_conditionTreeData);
    } else {
      //删除操作
      setExpandedKeys([]);
      setConditionTreeData([]);
    }
  }, [props.data]);
  useEffect(function () {
    // debugger;
    if (props.expandAll) {
      setExpandedKeys(allKeys.current);
    } else {
      setExpandedKeys([]);
    }
  }, [props.expandAll]);
  return /*#__PURE__*/React.createElement(Tree, {
    showLine: {
      showLeafIcon: false
    },
    ref: ref,
    onExpand: onExpand,
    defaultExpandAll: true,
    expandedKeys: expandedKeys,
    treeData: conditionTreeData,
    selectedKeys: [props.selectedKey],
    onSelect: props.onSelect
  });
});