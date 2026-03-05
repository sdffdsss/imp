import { _ } from 'oss-web-toolkits';
var transMsgColor = function transMsgColor(value) {
  var color, textColor;
  switch (value) {
    case '1':
      color = '#EB3223';
      textColor = '#fff';
      break;
    case '2':
      color = '#F1A83C';
      textColor = '#fff';
      break;
    case '3':
      color = '#FFFD56';
      textColor = '#000';
      break;
    case '4':
      color = '#54B3FF';
      textColor = '#fff';
      break;
    default:
      color = '#54B3FF';
      textColor = '#fff';
      break;
  }
  return {
    color: color,
    textColor: textColor
  };
};
var transVenderSeverityMsgColor = function transVenderSeverityMsgColor(value) {
  var color, textColor;
  switch (value) {
    case '严重告警':
      color = '#EB3223';
      textColor = '#fff';
      break;
    case '重要告警':
      color = '#F1A83C';
      textColor = '#fff';
      break;
    case '次要告警':
      color = '#FFFD56';
      textColor = '#000';
      break;
    case '警告告警':
      color = '#54B3FF';
      textColor = '#fff';
      break;
    default:
      color = '#54B3FF';
      textColor = '#fff';
      break;
  }
  return {
    color: color,
    textColor: textColor
  };
};
var getLabel = function getLabel(data, key) {
  var label;
  if (data[key]) {
    data[key].lable ? label = data[key].lable : label = data[key].value;
  } else {
    label = '';
  }
  return label;
};
var fieldTransform = function fieldTransform(data, enums) {
  //如果没有新增告警或者更新告警 不处理field转换
  if (JSON.stringify(data.addAlarms) === '{}' && JSON.stringify(data.updateAlarms) === '{}') {
    return data;
  }
  var resData = JSON.parse(JSON.stringify(data));
  //转换addAlarms的field
  if (JSON.stringify(resData.addAlarms) !== '{}') {
    Object.keys(resData.addAlarms).forEach(function (key) {
      resData.addAlarms[key]['alarmFieldList'].forEach(function (detailNode) {
        var num = Number(detailNode.num);
        if (num === -1) {
          detailNode.field = 'alarm_id';
        } else {
          var _$find;
          var field = (_$find = _.find(enums, {
            id: num
          })) === null || _$find === void 0 ? void 0 : _$find.field;
          detailNode.field = field || 'error';
        }
      });
    });
  }

  //转换updateAlarms的field
  if (JSON.stringify(resData.updateAlarms) !== '{}') {
    Object.keys(resData.updateAlarms).forEach(function (key) {
      resData.updateAlarms[key]['modifyFieldList'].forEach(function (detailNode) {
        var num = Number(detailNode.num);
        if (num === -1) {
          detailNode.field = 'alarm_id';
        } else {
          var _$find2;
          var field = (_$find2 = _.find(enums, {
            id: num
          })) === null || _$find2 === void 0 ? void 0 : _$find2.field;
          detailNode.field = field || 'error';
        }
      });
    });
  }
  return resData;
};
export { transMsgColor, transVenderSeverityMsgColor, getLabel, fieldTransform };