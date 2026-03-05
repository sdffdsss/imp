function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useEffect } from 'react';
import { Descriptions, Empty, Spin } from 'oss-ui';
import { devInfoViewPageArgs } from '../../../alarm-window/alarm-show-config';
import { getViewItemData } from '../../../alarm-window/common/proxy';
import dmDef from './dataModelDefinition.json';
import { _ } from 'oss-web-toolkits';
var CompDevRes = function CompDevRes(props) {
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    dataSource = _useState2[0],
    setDataSource = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    loading = _useState4[0],
    setLoading = _useState4[1];
  useEffect(function () {
    loadData(props.alarmClickTarget);
    return function () {};
  }, [props.alarmClickTarget]);
  var loadData = function loadData(alarmClickTarget) {
    setLoading(true);
    var viewPageArgs = {}; //{ object_class: '3201', int_id: '-5592774345999643324' };
    _.forEach(devInfoViewPageArgs, function (item) {
      var _alarmClickTarget$ite;
      viewPageArgs[item.label] = (_alarmClickTarget$ite = alarmClickTarget[item.fieldName]) === null || _alarmClickTarget$ite === void 0 ? void 0 : _alarmClickTarget$ite.value;
    });
    var viewPageId = 'alarm-resources';
    var viewItemId = dmDef.dataModelDefinition.name;
    var callback = function callback(result) {
      setLoading(false);
      if (result && result) {
        setDataSource(result);
      }
    };
    getViewItemData({
      viewPageArgs: viewPageArgs,
      viewItemId: viewItemId,
      viewPageId: viewPageId,
      callback: callback
    });
  };
  var getContent = function getContent(loading, dataSource) {
    if (loading) {
      return null;
    }
    if (dataSource && dataSource.length > 0) {
      return /*#__PURE__*/React.createElement(Descriptions, {
        column: props.num ? props.num : 2,
        title: props.title ? props.title : '',
        bordered: true
      }, dataSource.map(function (item) {
        return /*#__PURE__*/React.createElement(Descriptions.Item, {
          label: "".concat(item.objectLabel, ":")
        }, item.objectVal);
      }));
    }
    return /*#__PURE__*/React.createElement(Empty, null);
  };
  return /*#__PURE__*/React.createElement(Spin, {
    spinning: loading
  }, getContent(loading, dataSource));
};
export default CompDevRes;