function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState, useEffect } from 'react';
function useSyncResultInfo(syncResultInfo) {
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    syncVisible = _useState2[0],
    setSyncVisible = _useState2[1];
  var _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    syncResultContent = _useState4[0],
    setSyncResultContent = _useState4[1];
  useEffect(function () {
    if (syncResultInfo) {
      var _syncResultInfo$size = syncResultInfo.size,
        size = _syncResultInfo$size === void 0 ? 0 : _syncResultInfo$size,
        _syncResultInfo$time = syncResultInfo.time,
        time = _syncResultInfo$time === void 0 ? 0 : _syncResultInfo$time;
      var content = "\u540C\u6B65\u6D3B\u52A8\u544A\u8B66\uFF08\u542B\u786E\u8BA4\uFF09\uFF0C\u5DF2\u540C\u6B65".concat(size, "\u6761\uFF0C\u7528\u65F6").concat((time / 1000).toFixed(1), "s");
      setSyncResultContent(content);
      setSyncVisible(true);
    } else {
      setTimeout(function () {
        setSyncResultContent('');
        setSyncVisible(false);
      }, 5000);
    }
  }, [syncResultInfo]);
  return {
    syncVisible: syncVisible,
    syncResultContent: syncResultContent
  };
}
export default useSyncResultInfo;