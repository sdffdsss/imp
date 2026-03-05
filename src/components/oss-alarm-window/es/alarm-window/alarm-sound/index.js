function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import React, { useEffect, useRef } from 'react';
import Common from '../../common';
import qs from 'qs';
import serviceConfig from '../../hox';
var AlarmSound = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var alarmSoundList = props.alarmSoundList,
    alarmSoundStatus = props.alarmSoundStatus;
  var audioRef = useRef();
  var isPlay = useRef(false);
  var soundQueue = useRef([]);
  useEffect(function () {
    audioRef.current.addEventListener('canplaythrough', playThrough);
    audioRef.current.addEventListener('ended', playEnd);
    return function () {
      audioRef.current.removeEventListener('canplaythrough', playThrough);
      audioRef.current.removeEventListener('ended', playEnd);
    };
  }, []);
  useEffect(function () {
    if (alarmSoundStatus) {
      if (alarmSoundList && alarmSoundList.length) {
        var _soundQueue$current;
        (_soundQueue$current = soundQueue.current).push.apply(_soundQueue$current, _toConsumableArray(alarmSoundList));
        console.log("\u961F\u5217\u589E\u52A0\uFF1A".concat(soundQueue.current.map(function (s) {
          return s.alarmId;
        }).join(',')));
        next();
      }
    } else {
      soundQueue.current.length = 0;
    }
    return function () {};
  }, [alarmSoundStatus, alarmSoundList]);
  var next = function next() {
    if (isPlay.current || !soundQueue.current.length) {
      return;
    }
    getNextSoundContent(soundQueue.current[0]);
  };
  var getNextSoundContent = function getNextSoundContent(_ref) {
    var alarmId = _ref.alarmId,
      soundContent = _ref.soundContent,
      soundType = _ref.soundType;
    isPlay.current = true;
    // 流水窗告警发声，发声规则文本发声方式，会调用接口/alarmSoundUrl/TTS/TTSVoice（接口已下线），只保留文件发声方式
    //根据内容发声
    // if (soundType === 1) {
    //     getSoundUrlByText(soundContent, src => {
    //         startPlay({ alarmId, soundContent, soundType, src });
    //     });
    // }
    //根据发声文件地址发声
    if (soundType === 0) {
      startPlay({
        alarmId: alarmId,
        soundContent: soundContent,
        soundType: soundType,
        src: window.BASE_PATH + soundContent
      });
    }
  };
  var startPlay = function startPlay(item) {
    if (audioRef.current) {
      audioRef.current.src = item.src;
      audioRef.current.muted = false;
    }
  };
  var playThrough = function playThrough() {
    try {
      audioRef.current.play();
    } catch (_unused) {
      next();
    }
  };
  var playEnd = function playEnd() {
    isPlay.current = false;
    audioRef.current.muted = 'muted';
    soundQueue.current = soundQueue.current.slice(1);
    console.log("\u4E0B\u4E2A\u961F\u5217\uFF1A".concat(soundQueue.current.map(function (s) {
      return s.alarmId;
    }).join(',')));
    next();
  };
  var _getSoundUrlByText = function getSoundUrlByText(soundContent, callback) {
    //发声服务是单独部署和运行的，需要调用该程序接口获得发声内容
    Common.request(null, {
      fullUrl: serviceConfig.data.serviceConfig.otherService.alarmSoundUrl + 'TTS/TTSVoice',
      type: 'post',
      showSuccessMessage: false,
      showErrorMessage: false,
      defaultErrorMessage: '获取发声数据失败',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        msgVoice: encodeURI(soundContent),
        msgid: "".concat(new Date().getTime()).concat(Math.round(Math.random() * 10000))
      }
    }).then(function (result) {
      var src = 'data:audio/wav;base64,' + result.TTSVoiceResult;
      callback(src);
    }).catch(function (err) {
      isPlay.current = false;
      var timer1 = setTimeout(function () {
        _getSoundUrlByText(soundContent, callback);
        clearTimeout(timer1);
      }, 5000);
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("audio", {
    preload: true,
    ref: audioRef,
    muted: "muted"
  }));
});
export default AlarmSound;