import { logger } from 'oss-web-toolkits';
import contextMenuComponent from '../../../context-menu/menu-components';
import { rightClickOperateApi } from '../proxy';
import serviceConfig from '../../../hox';
import { _ } from 'oss-web-toolkits';
import { getRecordDetail } from '../dataHandler';
import { createFileFlow } from '../../../common/utils/download';
var config = [
// {
//     name: '告警详情', // 菜单名称
//     key: 'AlarmDetails',
//     component: contextMenuComponent.AlarmDetails,
//     type: 'normal', // normal 默认 separator带分隔线
//     pageType: 'drawer',
//     action: (record) => {
//         // 菜单点击事件
//         logger.default.debug('action', record);
//     },
//     shouldAction: () => {
//         // 菜单是否可用事件
//         return true;
//     },
// },

{
  name: '单条告警同步',
  key: 'SingleAlarmSynchronization',
  component: contextMenuComponent.SingleAlarmSynchronization,
  type: 'normal',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction() {
    return true;
  }
}, {
  name: '告警确认',
  key: 'AlarmAcknowledgement',
  component: contextMenuComponent.AlarmAcknowledgement,
  type: 'normal',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction() {
    return true;
  }
}, {
  name: '独立确认',
  key: 'AlarmSingleAcknowledgement',
  component: contextMenuComponent.AlarmAcknowledgement,
  type: 'normal',
  operateType: 'alarm_ack',
  feedbackField: ['reason'],
  pageType: 'form',
  action: function action(_ref) {
    var data = _ref.data,
      actionRecords = _ref.actionRecords,
      menu = _ref.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record) {
    var _record$ack_flag;
    // ack_flag：0-未确认，active_status：1-未清除
    // 为适应大部分现场需求，条件改为ack_flag：0-未确认的告警可以确认，去掉未清除状态的限制，已和需求沟通过
    return ((_record$ack_flag = record.ack_flag) === null || _record$ack_flag === void 0 ? void 0 : _record$ack_flag.value) === '0';
  }
}, {
  name: '告警关联确认',
  key: 'AlarmRelatedAcknowledgement',
  component: contextMenuComponent.AlarmAcknowledgement,
  type: 'normal',
  operateType: 'alarm_ack',
  feedbackField: ['reason'],
  pageType: 'form',
  isRelated: true,
  action: function action(_ref2) {
    var data = _ref2.data,
      actionRecords = _ref2.actionRecords,
      menu = _ref2.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record, target, htSelection) {
    var _record$ack_flag2;
    // ack_flag：0-未确认，active_status：1-未清除
    // 为适应大部分现场需求，条件改为ack_flag：0-未确认的告警可以确认，去掉未清除状态的限制，已和需求沟通过
    return ((_record$ack_flag2 = record.ack_flag) === null || _record$ack_flag2 === void 0 ? void 0 : _record$ack_flag2.value) === '0' && record.children && record.children.length;
  }
}, {
  name: '查看确认',
  key: 'AlarmAcknowledgementCheck',
  component: contextMenuComponent.AlarmAcknowledgementCheck,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id, _target$alarm_id, _record$ack_flag3;
    // ack_flag：0-未确认
    return ((_record$alarm_id = record.alarm_id) === null || _record$alarm_id === void 0 ? void 0 : _record$alarm_id.value) === ((_target$alarm_id = target.alarm_id) === null || _target$alarm_id === void 0 ? void 0 : _target$alarm_id.value) && ((_record$ack_flag3 = record.ack_flag) === null || _record$ack_flag3 === void 0 ? void 0 : _record$ack_flag3.value) !== '0';
  }
},
// {
//     name: '告警人工标工',
//     key: 'AlarmManualMarking',
//     component: AlarmManualMarking,
//     type: 'normal',
//     action: (record) => {
//         logger.default.debug('action', record);
//     },
//     shouldAction: (record, target) => {
//         return false;
//     },
// },
{
  name: '告警清除',
  key: 'AlarmManualClearing',
  component: contextMenuComponent.AlarmManualClearing,
  type: 'normal',
  action: function action(_ref3) {
    var data = _ref3.data,
      actionRecords = _ref3.actionRecords,
      menu = _ref3.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record) {
    var _record$active_status;
    // active_status：1-未清除
    return ((_record$active_status = record.active_status) === null || _record$active_status === void 0 ? void 0 : _record$active_status.value) === '1';
  }
}, {
  name: '独立清除',
  key: 'AlarmManualSingleClearing',
  component: contextMenuComponent.AlarmManualClearing,
  type: 'normal',
  operateType: 'alarm_cancel',
  feedbackField: ['reason'],
  pageType: 'form',
  action: function action(_ref4) {
    var data = _ref4.data,
      actionRecords = _ref4.actionRecords,
      menu = _ref4.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record) {
    var _record$active_status2;
    // active_status：1-未清除
    return ((_record$active_status2 = record.active_status) === null || _record$active_status2 === void 0 ? void 0 : _record$active_status2.value) === '1';
  }
}, {
  name: '关联清除',
  key: 'AlarmRelatedManualClearing',
  component: contextMenuComponent.AlarmManualClearing,
  type: 'normal',
  operateType: 'alarm_cancel',
  feedbackField: ['reason'],
  pageType: 'form',
  isRelated: true,
  action: function action(_ref5) {
    var data = _ref5.data,
      actionRecords = _ref5.actionRecords,
      menu = _ref5.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record, target, htSelection) {
    var _record$active_status3;
    // const htRecord = _.find(
    //     htSelection,
    //     (item) => item.getAttr('original_record_data')?.alarm_id?.value === record.alarm_id?.value,
    // );
    // active_status：1-未清除
    return ((_record$active_status3 = record.active_status) === null || _record$active_status3 === void 0 ? void 0 : _record$active_status3.value) === '1' && record.children && record.children.length;
  }
}, {
  name: '告警备注',
  key: 'WarningRemarks',
  component: contextMenuComponent.WarningRemarks,
  type: 'normal',
  action: function action(_ref6) {
    var data = _ref6.data,
      actionRecords = _ref6.actionRecords,
      menu = _ref6.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction() {
    return true;
  }
}, {
  name: '独立备注',
  key: 'WarningSingleRemarks',
  component: contextMenuComponent.WarningRemarks,
  type: 'normal',
  operateType: 'alarm_remark',
  feedbackField: ['memo'],
  pageType: 'form',
  action: function action(_ref7) {
    var data = _ref7.data,
      actionRecords = _ref7.actionRecords,
      menu = _ref7.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction() {
    return true;
  }
}, {
  name: '关联备注',
  key: 'WarningRelatedRemarks',
  component: contextMenuComponent.WarningRemarks,
  type: 'normal',
  operateType: 'alarm_remark',
  feedbackField: ['memo'],
  pageType: 'form',
  isRelated: true,
  action: function action(_ref8) {
    var data = _ref8.data,
      actionRecords = _ref8.actionRecords,
      menu = _ref8.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record, target, htSelection) {
    // const htRecord = _.find(
    //     htSelection,
    //     (item) => item.getAttr('original_record_data')?.alarm_id?.value === record.alarm_id?.value,
    // );
    return record.children && record.children.length;
  }
}, {
  name: '查看备注',
  key: 'WarningRemarksCheck',
  component: contextMenuComponent.WarningRemarksCheck,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id2, _target$alarm_id2;
    return ((_record$alarm_id2 = record.alarm_id) === null || _record$alarm_id2 === void 0 ? void 0 : _record$alarm_id2.value) === ((_target$alarm_id2 = target.alarm_id) === null || _target$alarm_id2 === void 0 ? void 0 : _target$alarm_id2.value);
  }
}, {
  name: '工单操作',
  key: 'SheetOperation',
  component: contextMenuComponent.ManualDispatch,
  type: 'normal',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction() {
    return true;
  }
}, {
  name: '手工派单',
  key: 'ManualDispatch',
  component: contextMenuComponent.ManualDispatch,
  type: 'normal',
  operateType: 'alarm_manual_send',
  feedbackField: ['clientName', 'sheetNo', 'isDup', 'repeatTimes', 'repeatInterval'],
  pageType: 'form',
  action: function action(_ref9) {
    var data = _ref9.data,
      actionRecords = _ref9.actionRecords,
      menu = _ref9.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id3, _target$alarm_id3, _record$send_status, _record$send_status2;
    return ((_record$alarm_id3 = record.alarm_id) === null || _record$alarm_id3 === void 0 ? void 0 : _record$alarm_id3.value) === ((_target$alarm_id3 = target.alarm_id) === null || _target$alarm_id3 === void 0 ? void 0 : _target$alarm_id3.value) && ((_record$send_status = record.send_status) === null || _record$send_status === void 0 ? void 0 : _record$send_status.value) !== '5' && ((_record$send_status2 = record.send_status) === null || _record$send_status2 === void 0 ? void 0 : _record$send_status2.value) !== '6';
  }
}, {
  name: '故障工单派发',
  key: 'ManualDispatchUnicom',
  component: contextMenuComponent.ManualDispatchUnicom,
  type: 'normal',
  operateType: '',
  feedbackField: ['clientName', 'sheetNo', 'isDup', 'repeatTimes', 'repeatInterval'],
  title: '选择主告警',
  pageType: 'form',
  action: function action(_ref0) {
    var data = _ref0.data,
      actionRecords = _ref0.actionRecords,
      menu = _ref0.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record, target) {
    return true;
  }
}, {
  name: '手工派单-督办单',
  key: 'Supervise',
  component: contextMenuComponent.ManualDispatchUnicom,
  type: 'normal',
  operateType: '',
  feedbackField: ['clientName', 'sheetNo', 'isDup', 'repeatTimes', 'repeatInterval'],
  title: '选择主告警',
  pageType: 'form',
  action: function action(_ref1) {
    var data = _ref1.data,
      actionRecords = _ref1.actionRecords,
      menu = _ref1.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record, target) {
    console.log(record, target, '===target');
    return true;
  }
}, {
  name: '手工关联派单',
  key: 'ManualRelatedDispatchUnicom',
  component: contextMenuComponent.ManualDispatch,
  type: 'normal',
  operateType: '',
  feedbackField: ['clientName', 'sheetNo', 'isDup', 'repeatTimes', 'repeatInterval'],
  pageType: 'form',
  isRelated: true,
  action: function action(_ref10) {
    var data = _ref10.data,
      actionRecords = _ref10.actionRecords,
      menu = _ref10.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record) {
    var _record$send_status3, _record$send_status4;
    return record.children && record.children.length && ((_record$send_status3 = record.send_status) === null || _record$send_status3 === void 0 ? void 0 : _record$send_status3.value) !== '5' && ((_record$send_status4 = record.send_status) === null || _record$send_status4 === void 0 ? void 0 : _record$send_status4.value) !== '6';
  }
}, {
  name: '抑制派单',
  key: 'SuppressionOfOrders',
  component: contextMenuComponent.SuppressionOfOrders,
  type: 'normal',
  operateType: 'alarm_manual_unsend',
  feedbackField: ['reason'],
  pageType: 'form',
  action: function action(_ref11) {
    var data = _ref11.data,
      actionRecords = _ref11.actionRecords,
      menu = _ref11.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record) {
    var _record$send_status5, _record$send_status6;
    // send_status：1-等待派单
    return ((_record$send_status5 = record.send_status) === null || _record$send_status5 === void 0 ? void 0 : _record$send_status5.value) && ((_record$send_status6 = record.send_status) === null || _record$send_status6 === void 0 ? void 0 : _record$send_status6.value) === '1';
  }
}, {
  name: '关联抑制派单',
  key: 'SuppressionRelatedOfOrders',
  component: contextMenuComponent.SuppressionOfOrders,
  type: 'normal',
  operateType: 'alarm_manual_unsend',
  feedbackField: ['reason'],
  pageType: 'form',
  isRelated: true,
  action: function action(_ref12) {
    var data = _ref12.data,
      actionRecords = _ref12.actionRecords,
      menu = _ref12.menu;
    var nextData = _.cloneDeep(data);
    nextData.alarmPropertiesList = _.filter(nextData.alarmPropertiesList, function (item) {
      return Number(item.send_status) === 1;
    });
    rightClickOperateApi({
      data: nextData,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record) {
    var _record$send_status7, _record$send_status8;
    return ((_record$send_status7 = record.send_status) === null || _record$send_status7 === void 0 ? void 0 : _record$send_status7.value) && ((_record$send_status8 = record.send_status) === null || _record$send_status8 === void 0 ? void 0 : _record$send_status8.value) === '1' && record.children && record.children.length;
  }
}, {
  name: '查看工单详情',
  key: 'SheetCheck',
  component: null,
  type: 'normal',
  operateType: '',
  pageType: 'jump',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record) {
    var _record$send_status9, _record$send_status0;
    return ((_record$send_status9 = record.send_status) === null || _record$send_status9 === void 0 ? void 0 : _record$send_status9.value) && ((_record$send_status0 = record.send_status) === null || _record$send_status0 === void 0 ? void 0 : _record$send_status0.value) !== '0';
  }
}, {
  name: '告警短信派发',
  key: 'AlarmSMSDistribution',
  component: contextMenuComponent.AlarmSMSDistribution,
  type: 'normal',
  operateType: 'alarm_sms_notify',
  feedbackField: ['sms', 'userList', 'phoneList'],
  pageType: 'form',
  action: function action(_ref13) {
    var data = _ref13.data,
      actionRecords = _ref13.actionRecords,
      menu = _ref13.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id4, _target$alarm_id4;
    return ((_record$alarm_id4 = record.alarm_id) === null || _record$alarm_id4 === void 0 ? void 0 : _record$alarm_id4.value) === ((_target$alarm_id4 = target.alarm_id) === null || _target$alarm_id4 === void 0 ? void 0 : _target$alarm_id4.value);
  }
}, {
  name: 'IVR呼叫',
  key: 'AlarmCall',
  component: contextMenuComponent.AlarmCall,
  type: 'normal',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id5, _target$alarm_id5;
    return ((_record$alarm_id5 = record.alarm_id) === null || _record$alarm_id5 === void 0 ? void 0 : _record$alarm_id5.value) === ((_target$alarm_id5 = target.alarm_id) === null || _target$alarm_id5 === void 0 ? void 0 : _target$alarm_id5.value);
  }
}, {
  name: '手工呼叫',
  key: 'AlarmManualCall',
  component: contextMenuComponent.AlarmCall,
  type: 'normal',
  operateType: 'alarm_ivr_notify',
  feedbackField: ['type', 'reason', 'sms', 'userList', 'phoneList'],
  pageType: 'form',
  action: function action(_ref14) {
    var data = _ref14.data,
      actionRecords = _ref14.actionRecords,
      menu = _ref14.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id6, _target$alarm_id6;
    return ((_record$alarm_id6 = record.alarm_id) === null || _record$alarm_id6 === void 0 ? void 0 : _record$alarm_id6.value) === ((_target$alarm_id6 = target.alarm_id) === null || _target$alarm_id6 === void 0 ? void 0 : _target$alarm_id6.value);
  }
}, {
  name: '手工呼叫',
  key: 'AlarmManualCall_gd',
  component: contextMenuComponent.AlarmCallGD,
  type: 'normal',
  operateType: 'alarm_ivr_notify',
  feedbackField: ['type', 'reason', 'sms', 'userList', 'phoneList'],
  pageType: 'form',
  action: function action(_ref15) {
    var data = _ref15.data,
      actionRecords = _ref15.actionRecords,
      menu = _ref15.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id7, _target$alarm_id7;
    return ((_record$alarm_id7 = record.alarm_id) === null || _record$alarm_id7 === void 0 ? void 0 : _record$alarm_id7.value) === ((_target$alarm_id7 = target.alarm_id) === null || _target$alarm_id7 === void 0 ? void 0 : _target$alarm_id7.value);
  }
}, {
  name: '抑制呼叫',
  key: 'AlarmCallUnSend',
  component: contextMenuComponent.SuppressionOfOrders,
  type: 'normal',
  operateType: 'alarm_univr_notify',
  feedbackField: ['reason'],
  pageType: 'form',
  action: function action(_ref16) {
    var data = _ref16.data,
      actionRecords = _ref16.actionRecords,
      menu = _ref16.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record) {
    var _record$ivr_status;
    // ivr_status：1-等待外呼
    return ((_record$ivr_status = record.ivr_status) === null || _record$ivr_status === void 0 ? void 0 : _record$ivr_status.value) === '1';
  }
}, {
  name: '查看呼叫详情',
  key: 'AlarmCallCheck',
  component: contextMenuComponent.AlarmAcknowledgementCheck,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id8, _target$alarm_id8;
    return ((_record$alarm_id8 = record.alarm_id) === null || _record$alarm_id8 === void 0 ? void 0 : _record$alarm_id8.value) === ((_target$alarm_id8 = target.alarm_id) === null || _target$alarm_id8 === void 0 ? void 0 : _target$alarm_id8.value);
  }
}, {
  name: '查看呼叫详情',
  key: 'AlarmCallCheck_gd',
  component: contextMenuComponent.IvrDetailCheckGD,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id9, _target$alarm_id9;
    return ((_record$alarm_id9 = record.alarm_id) === null || _record$alarm_id9 === void 0 ? void 0 : _record$alarm_id9.value) === ((_target$alarm_id9 = target.alarm_id) === null || _target$alarm_id9 === void 0 ? void 0 : _target$alarm_id9.value);
  }
}, {
  name: '一键登录',
  key: 'OneClickLogin',
  component: null,
  type: 'normal',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction() {
    return true;
  }
}, {
  name: '告警处理全流程',
  key: 'AlarmProcessingFlow',
  component: contextMenuComponent.AlarmProcessingFlow,
  type: 'normal',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction() {
    return false;
  }
}, {
  name: '告警预处理',
  key: 'AlarmPretreatment',
  component: contextMenuComponent.AlarmManualPretreatment,
  type: 'normal',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id0, _target$alarm_id0;
    return ((_record$alarm_id0 = record.alarm_id) === null || _record$alarm_id0 === void 0 ? void 0 : _record$alarm_id0.value) === ((_target$alarm_id0 = target.alarm_id) === null || _target$alarm_id0 === void 0 ? void 0 : _target$alarm_id0.value);
  }
}, {
  name: '手工预处理',
  key: 'AlarmManualPretreatment',
  component: contextMenuComponent.AlarmManualPretreatment,
  type: 'normal',
  operateType: 'alarm_manual_pretreat',
  feedbackField: ['status', 'resultInfo'],
  pageType: 'form',
  action: function action(_ref17) {
    var data = _ref17.data,
      actionRecords = _ref17.actionRecords,
      menu = _ref17.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id1, _target$alarm_id1;
    return ((_record$alarm_id1 = record.alarm_id) === null || _record$alarm_id1 === void 0 ? void 0 : _record$alarm_id1.value) === ((_target$alarm_id1 = target.alarm_id) === null || _target$alarm_id1 === void 0 ? void 0 : _target$alarm_id1.value);
  }
}, {
  name: '手工预处理',
  key: 'AlarmManualPretreatment_gd',
  component: contextMenuComponent.AlarmManualPretreatmentGD,
  type: 'normal',
  operateType: 'alarm_manual_pretreat',
  feedbackField: ['status', 'resultInfo'],
  pageType: 'form',
  action: function action(_ref18) {
    var data = _ref18.data,
      actionRecords = _ref18.actionRecords,
      menu = _ref18.menu;
    rightClickOperateApi({
      data: data,
      menu: menu
    });
    logger.default.debug('action', actionRecords);
  },
  shouldAction: function shouldAction() {
    return true;
  }
}, {
  name: '查看预处理详情',
  key: 'AlarmPretreatmentCheck',
  component: contextMenuComponent.AlarmPretreatmentCheck,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id10, _target$alarm_id10;
    return ((_record$alarm_id10 = record.alarm_id) === null || _record$alarm_id10 === void 0 ? void 0 : _record$alarm_id10.value) === ((_target$alarm_id10 = target.alarm_id) === null || _target$alarm_id10 === void 0 ? void 0 : _target$alarm_id10.value);
  }
}, {
  name: '查看预处理详情',
  key: 'AlarmPretreatmentCheck_gd',
  component: contextMenuComponent.AlarmPretreatmentCheckGD,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id11, _target$alarm_id11;
    return ((_record$alarm_id11 = record.alarm_id) === null || _record$alarm_id11 === void 0 ? void 0 : _record$alarm_id11.value) === ((_target$alarm_id11 = target.alarm_id) === null || _target$alarm_id11 === void 0 ? void 0 : _target$alarm_id11.value);
  }
}, {
  name: '资源属性',
  key: 'CompDevResAttr',
  component: contextMenuComponent.CompDevRes,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction() {
    return true;
  }
}, {
  name: '资源信息',
  key: 'CompDevRes',
  component: contextMenuComponent.CompDevRes,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id12, _target$alarm_id12;
    return ((_record$alarm_id12 = record.alarm_id) === null || _record$alarm_id12 === void 0 ? void 0 : _record$alarm_id12.value) === ((_target$alarm_id12 = target.alarm_id) === null || _target$alarm_id12 === void 0 ? void 0 : _target$alarm_id12.value);
  }
}, {
  name: '机房信息-联通',
  key: 'CompMachineryRoomUnicom',
  component: contextMenuComponent.CompMachineryRoom,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id13, _target$alarm_id13;
    return ((_record$alarm_id13 = record.alarm_id) === null || _record$alarm_id13 === void 0 ? void 0 : _record$alarm_id13.value) === ((_target$alarm_id13 = target.alarm_id) === null || _target$alarm_id13 === void 0 ? void 0 : _target$alarm_id13.value);
  }
}, {
  name: '机房信息',
  key: 'CompMachineryRoom',
  component: contextMenuComponent.CompMachineryRoom,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id14, _target$alarm_id14;
    return ((_record$alarm_id14 = record.alarm_id) === null || _record$alarm_id14 === void 0 ? void 0 : _record$alarm_id14.value) === ((_target$alarm_id14 = target.alarm_id) === null || _target$alarm_id14 === void 0 ? void 0 : _target$alarm_id14.value);
  }
}, {
  name: '影响用户',
  key: 'CompEffectedUser',
  component: contextMenuComponent.CompEffectedUser,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id15, _target$alarm_id15, _record$eqp_object_cl, _record$object_class, _record$eqp_object_cl2, _record$object_class2;
    // return (
    //     ['ONU', 'OLT', 'PORT', '板卡'].includes(target.object_class?.lable) &&
    //     record.alarm_id?.value === target.alarm_id?.value
    // );

    //按照广东移动需求修改为以下逻辑
    // 1）告警的eqp_object_class=2011，且object_class in (2011,706,10011)；
    // 2）告警的eqp_object_class=2012，且object_class =2012；
    return ((_record$alarm_id15 = record.alarm_id) === null || _record$alarm_id15 === void 0 ? void 0 : _record$alarm_id15.value) === ((_target$alarm_id15 = target.alarm_id) === null || _target$alarm_id15 === void 0 ? void 0 : _target$alarm_id15.value) && (((_record$eqp_object_cl = record.eqp_object_class) === null || _record$eqp_object_cl === void 0 ? void 0 : _record$eqp_object_cl.value) === '2011' && ['2011', '706', '10011'].includes((_record$object_class = record.object_class) === null || _record$object_class === void 0 ? void 0 : _record$object_class.value) || ((_record$eqp_object_cl2 = record.eqp_object_class) === null || _record$eqp_object_cl2 === void 0 ? void 0 : _record$eqp_object_cl2.value) === '2012' && ((_record$object_class2 = record.object_class) === null || _record$object_class2 === void 0 ? void 0 : _record$object_class2.value) === '2012');
  }
}, {
  name: '影响小区',
  key: 'CompEffectedCell',
  component: contextMenuComponent.CompEffectedCell,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id16, _target$alarm_id16, _record$eqp_object_cl3, _record$object_class3;
    // return (
    //     ['ONU', 'OLT', 'PORT', '板卡'].includes(target.object_class?.lable) &&
    //     record.alarm_id?.value === target.alarm_id?.value
    // );

    //按照广东移动需求修改为以下逻辑
    //1）告警的eqp_object_class=2011，且object_class in (2011,706,10011)；
    return ((_record$alarm_id16 = record.alarm_id) === null || _record$alarm_id16 === void 0 ? void 0 : _record$alarm_id16.value) === ((_target$alarm_id16 = target.alarm_id) === null || _target$alarm_id16 === void 0 ? void 0 : _target$alarm_id16.value) && ((_record$eqp_object_cl3 = record.eqp_object_class) === null || _record$eqp_object_cl3 === void 0 ? void 0 : _record$eqp_object_cl3.value) === '2011' && ['2011', '706', '10011'].includes((_record$object_class3 = record.object_class) === null || _record$object_class3 === void 0 ? void 0 : _record$object_class3.value);
  }
}, {
  name: '工程信息',
  key: 'CompArPro',
  component: contextMenuComponent.CompArPro,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id17, _target$alarm_id17;
    return ((_record$alarm_id17 = record.alarm_id) === null || _record$alarm_id17 === void 0 ? void 0 : _record$alarm_id17.value) === ((_target$alarm_id17 = target.alarm_id) === null || _target$alarm_id17 === void 0 ? void 0 : _target$alarm_id17.value);
  }
}, {
  name: '告警导出',
  key: 'AlarmExport',
  component: contextMenuComponent.AlarmExport,
  type: 'normal',
  pageType: 'export',
  feedbackField: ['alarmIdList', 'alarmColumnFieldIds', 'alarmFieldNameList', 'exportFileFormat'],
  width: 295,
  action: function action(_ref19) {
    var customAction = _ref19.customAction,
      data = _ref19.data,
      actionRecords = _ref19.actionRecords;
    logger.default.debug('action', actionRecords);
    customAction(data.operateProps, function (res) {
      var _serviceConfig$data, _serviceConfig$data$s, _serviceConfig$data$s2, _res$responseDataJSON;
      var url = serviceConfig === null || serviceConfig === void 0 ? void 0 : (_serviceConfig$data = serviceConfig.data) === null || _serviceConfig$data === void 0 ? void 0 : (_serviceConfig$data$s = _serviceConfig$data.serviceConfig) === null || _serviceConfig$data$s === void 0 ? void 0 : (_serviceConfig$data$s2 = _serviceConfig$data$s.otherService) === null || _serviceConfig$data$s2 === void 0 ? void 0 : _serviceConfig$data$s2.viewItemExportUrl;
      var name = (_res$responseDataJSON = res.responseDataJSON.split('?')[0]) === null || _res$responseDataJSON === void 0 ? void 0 : _res$responseDataJSON.replace('/view/export/', '');
      createFileFlow(name || res.responseDataJSON, url + res.responseDataJSON);
      // window.open(url + res.responseDataJSON);
    });
  },
  shouldAction: function shouldAction() {
    return true;
  }
}, {
  name: '告警经验管理',
  key: 'AlarmExperience',
  component: null,
  type: 'normal',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction() {
    return true;
  }
}, {
  name: '告警经验查询',
  key: 'AlarmExperienceCheck',
  component: contextMenuComponent.AlarmExperienceCheck,
  type: 'normal',
  pageType: 'view',
  action: function action(record) {
    logger.default.debug('action', record);
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id18, _target$alarm_id18;
    return ((_record$alarm_id18 = record.alarm_id) === null || _record$alarm_id18 === void 0 ? void 0 : _record$alarm_id18.value) === ((_target$alarm_id18 = target.alarm_id) === null || _target$alarm_id18 === void 0 ? void 0 : _target$alarm_id18.value);
  }
}, {
  name: '告警经验库管理',
  key: 'AlarmExperienceManage',
  component: null,
  type: 'normal',
  pageType: 'jump',
  action: function action(_ref20) {
    var actionRecords = _ref20.actionRecords,
      shareActions = _ref20.shareActions,
      getRecordsDetail = _ref20.getRecordsDetail;
    var alarmClickTarget = actionRecords[0];
    var alarmDetail = _.cloneDeep(alarmClickTarget);
    getRecordsDetail(actionRecords, function (res) {
      var _alarmDetail$professi, _alarmDetail$eqp_obje, _alarmDetail$title_te, _alarmDetail$province, _alarmDetail$vendor_i;
      var recordsDetail = getRecordDetail(res);
      var detail = recordsDetail.find(function (item) {
        var _item$alarm_id, _alarmClickTarget$ala;
        return ((_item$alarm_id = item.alarm_id) === null || _item$alarm_id === void 0 ? void 0 : _item$alarm_id.value) === ((_alarmClickTarget$ala = alarmClickTarget.alarm_id) === null || _alarmClickTarget$ala === void 0 ? void 0 : _alarmClickTarget$ala.value);
      });
      if (recordsDetail && recordsDetail.length && detail) {
        alarmDetail = detail;
      }
      var actions = shareActions.actions,
        messageTypes = shareActions.messageTypes;
      var netWorkTop = (_alarmDetail$professi = alarmDetail.professional_type) === null || _alarmDetail$professi === void 0 ? void 0 : _alarmDetail$professi.value;
      var objectClass = (_alarmDetail$eqp_obje = alarmDetail.eqp_object_class) === null || _alarmDetail$eqp_obje === void 0 ? void 0 : _alarmDetail$eqp_obje.value;
      var alarmTitle = (_alarmDetail$title_te = alarmDetail.title_text) === null || _alarmDetail$title_te === void 0 ? void 0 : _alarmDetail$title_te.value;
      var provinceId = (_alarmDetail$province = alarmDetail.province_id) === null || _alarmDetail$province === void 0 ? void 0 : _alarmDetail$province.value;
      var vendorId = (_alarmDetail$vendor_i = alarmDetail.vendor_id) === null || _alarmDetail$vendor_i === void 0 ? void 0 : _alarmDetail$vendor_i.value;
      if (actions && actions.postMessage) {
        actions.postMessage(messageTypes.closeTabs, {
          entry: '/alarm/setting/experiences'
        });
        var timer = setTimeout(function () {
          actions.postMessage(messageTypes.openRoute, {
            entry: '/alarm/setting/experiences',
            extraContent: {
              search: {
                provinceId: provinceId,
                netWorkTop: netWorkTop,
                objectClass: objectClass,
                vendorId: vendorId,
                alarmTitle: alarmTitle
              }
            }
          });
          clearTimeout(timer);
        }, 500);
      } else {
        window.open("/setting/experiences?provinceId=".concat(provinceId, "&netWorkTop=").concat(netWorkTop, "&objectClass=").concat(objectClass, "&alarmTitle=").concat(encodeURIComponent(encodeURIComponent(alarmTitle)), "&vendorId=").concat(vendorId));
      }
    });
  },
  shouldAction: function shouldAction(record, target) {
    var _record$alarm_id19, _target$alarm_id19;
    return ((_record$alarm_id19 = record.alarm_id) === null || _record$alarm_id19 === void 0 ? void 0 : _record$alarm_id19.value) === ((_target$alarm_id19 = target.alarm_id) === null || _target$alarm_id19 === void 0 ? void 0 : _target$alarm_id19.value);
  }
}];
export default config;