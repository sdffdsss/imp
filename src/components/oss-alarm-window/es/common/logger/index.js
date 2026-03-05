function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { EventClass } from 'oss-web-toolkits';
import Proxy from '../api';
export var submitLog = function submitLog(config) {
  var _config$logUrl = config.logUrl,
    logUrl = _config$logUrl === void 0 ? 'view/clientStoreInfoToLog' : _config$logUrl,
    data = config.data;
  return Proxy.request(null, {
    fullUrl: logUrl,
    type: 'post',
    showSuccessMessage: false,
    showErrorMessage: false,
    data: data
  });
};
export var Level = /*#__PURE__*/function (Level) {
  Level[Level["Trace"] = 0] = "Trace";
  Level[Level["Debug"] = 1] = "Debug";
  Level[Level["Info"] = 2] = "Info";
  Level[Level["Warning"] = 3] = "Warning";
  Level[Level["Error"] = 4] = "Error";
  return Level;
}({});
export var Field = /*#__PURE__*/function () {
  function Field(public readonly identifier, public readonly value) {
    _classCallCheck(this, Field);
  }
  return _createClass(Field, [{
    key: "toJSON",
    value: function toJSON() {
      return {
        identifier: this.identifier,
        value: this.value
      };
    }
  }]);
}();
export var Time = /*#__PURE__*/_createClass(function Time(public readonly expected, public readonly ms) {
  _classCallCheck(this, Time);
});

/**
 * field 列表
 */

export var typeList = ['trace', 'info', 'warning', 'debug', 'error'];

/**
 * 记录日志回调
 */

export var time = function time(expected) {
  return new Time(expected, Date.now());
};
export var field = function field(name, value) {
  return new Field(name, value);
};
var Logger = /*#__PURE__*/function (_EventClass) {
  function Logger(_ref) {
    var _this;
    var _ref$extenders = _ref.extenders,
      extenders = _ref$extenders === void 0 ? [] : _ref$extenders;
    _classCallCheck(this, Logger);
    _this = _callSuper(this, Logger);
    _this.level = Level.Info;
    _this.extenders = [];
    _this.defaultFields = [];
    _this.muted = false;
    _this.traceList = [];
    _this.debugList = [];
    _this.infoList = [];
    _this.warningList = [];
    _this.errorList = [];
    _this.extenders = extenders;
    return _this;
  }
  _inherits(Logger, _EventClass);
  return _createClass(Logger, [{
    key: "mute",
    value: function mute() {
      this.muted = true;
    }
  }, {
    key: "open",
    value: function open() {
      this.muted = false;
    }
  }, {
    key: "isMute",
    value: function isMute() {
      return this.muted;
    }
  }, {
    key: "extend",
    value: function extend(extender) {
      this.extenders.push(extender);
    }
  }, {
    key: "flush",
    value: function flush(type) {
      this["".concat(type, "List")] = [];
    }
  }, {
    key: "flushAll",
    value: function flushAll() {
      var _this2 = this;
      this.traceList = [];
      this.debugList = [];
      this.infoList = [];
      this.warningList = [];
      this.errorList = [];
      typeList.forEach(function (type) {
        _this2.trigger('onLoggerChange', null, {
          dataList: _this2["".concat(type, "List")],
          currentData: null,
          type: type
        });
      });
    }
  }, {
    key: "info",
    value: function info(message) {
      for (var _len = arguments.length, fields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        fields[_key - 1] = arguments[_key];
      }
      this.handle({
        type: 'info',
        message: message,
        fields: fields,
        level: Level.Info
      });
    }
  }, {
    key: "warning",
    value: function warning(message) {
      for (var _len2 = arguments.length, fields = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        fields[_key2 - 1] = arguments[_key2];
      }
      this.handle({
        type: 'warning',
        message: message,
        fields: fields,
        level: Level.Warning
      });
    }
  }, {
    key: "trace",
    value: function trace(message) {
      for (var _len3 = arguments.length, fields = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        fields[_key3 - 1] = arguments[_key3];
      }
      this.handle({
        type: 'trace',
        message: message,
        fields: fields,
        level: Level.Trace
      });
    }
  }, {
    key: "debug",
    value: function debug(message) {
      for (var _len4 = arguments.length, fields = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        fields[_key4 - 1] = arguments[_key4];
      }
      this.handle({
        type: 'debug',
        message: message,
        fields: fields,
        level: Level.Debug
      });
    }
  }, {
    key: "error",
    value: function error(message) {
      for (var _len5 = arguments.length, fields = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        fields[_key5 - 1] = arguments[_key5];
      }
      this.handle({
        type: 'error',
        message: message,
        fields: fields,
        level: Level.Error
      });
    }
  }, {
    key: "handle",
    value: function handle(options) {
      if (this.muted) {
        return;
      }
      var passedFields = options.fields || [];
      if (typeof options.message === 'function') {
        var values = options.message();
        options.message = values.shift();
        passedFields = values;
      }
      var fields = this.defaultFields ? passedFields.filter(function (f) {
        return !!f;
      }).concat(this.defaultFields) : passedFields.filter(function (f) {
        return !!f;
      });
      var loggerDetail = {
        fields: fields,
        level: options.level,
        message: options.message,
        type: options.type
      };
      this.extenders.forEach(function (extender) {
        extender(loggerDetail);
      });
      this["".concat(options.type, "List")].push(loggerDetail);
      this.trigger('onLoggerChange', null, {
        dataList: this["".concat(options.type, "List")],
        currentData: loggerDetail,
        type: options.type
      });
      if (options.level >= this.level) {
        submitLog({
          data: {
            type: options.type,
            message: JSON.stringify(options)
          }
        });
      }
    }
  }]);
}(EventClass);
export default new Logger({
  extenders: []
});