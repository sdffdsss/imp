function isIceException(exception) {
  var result = 'Ice' in window && 'Exception' in window.Ice && exception instanceof window.Ice.Exception;
  return result;
}
function isIceUserException(exception) {
  var result = exception instanceof window.com.boco.view.slice.generated.model.ViewServiceException;
  return result;
}
var IceExceptionProcessMap = {
  'Ice::ConnectionLostException': 'C404',
  'Ice::ConnectFailedException': 'C404',
  'Ice::CommunicatorDestroyedException': 'C404',
  'Ice::ConnectionTimeoutException': 'C503',
  'Ice::ConnectionRefusedException': 'C503'
};
function getIceExceptionMessage(iceName) {
  return "\u83B7\u53D6\u5B9E\u65F6\u544A\u8B66\u51FA\u9519\uFF0CIce\u4EA7\u751F\u5F02\u5E38 ".concat(iceName, "\uFF0C\u53D1\u751F\u65F6\u95F4\uFF1A").concat(Date.now());
}
export function iceExceptionProcessor(exception) {
  var result = {
    code: null,
    message: ''
  };
  if (!isIceException(exception)) {
    // 非ice异常无法处理
    result.message = '非Ice异常，无法处理';
    return result;
  }

  // 处理后端返回的Ice异常
  if (isIceUserException(exception)) {
    var code = exception.code,
      reason = exception.reason,
      info = exception.info;
    result.code = code;
    result.message = "\u9519\u8BEF\u539F\u56E0\uFF1A".concat(reason, "\uFF0C\u540E\u7AEF\u4FE1\u606F\uFF1A").concat(info.serviceName, "-").concat(info.serviceAddress);
  } else {
    var iceName = exception.ice_name();
    result.code = IceExceptionProcessMap[iceName] || 'C404';
    result.message = getIceExceptionMessage(iceName);
  }
  return result;
}