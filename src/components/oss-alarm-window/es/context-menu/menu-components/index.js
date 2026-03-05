import AlarmDetails from './alarm-details'; //告警详情
// import ResourceView from './resource-view'; //资源查看
import SingleAlarmSynchronization from './single-alarm-synchronization'; //单条告警同步
import AlarmAcknowledgement from './alarm-acknowledgement'; //告警确认
import AlarmAcknowledgementCheck from './alarm-acknowlegment-check'; //告警确认查看
// import AlarmManualMarking from './alarm-manual-marking'; //告警人工标注  Alarm manual marking
import AlarmManualClearing from './alarm-manual-clearing'; //告警人工清除  Alarm manual clearing
import ManualDispatch from './manual-dispatch'; //手动派单  Manual dispatch
import ManualDispatchUnicom from './manual-dispatch-unicom'; //手动派单  Manual dispatch unicom
import SuppressionOfOrders from './suppression-of-orders'; //抑制派单  Suppression of orders
import AlarmSMSDistribution from './alarm-sms-distribution'; //告警短信派发 Alarm SMS distribution
import AlarmCall from './alarm-call'; //告警呼叫  Alarm call
import WarningRemarks from './warning-remarks'; //告警备注  Warning remarks
import WarningRemarksCheck from './warning-remark-check'; //查看备注
// import AlarmProcessingFlow from './alarm-processing-flow'; //告警处理全流程 Alarm processing flow
// 资源查看
import CompDevRes from './alarm-devResInfo';
//机房资源
import CompMachineryRoom from './alarm-machineryRoom';
//影响小区
import CompEffectedCell from './alarm-effectedCell';
//影响用户
import CompEffectedUser from './alarm-effectedUser';
//工程信息
import CompArPro from './alarm-arPro';
import AlarmManualPretreatment from './alarm-manual-pretreatment'; //手工预处理
import AlarmPretreatmentCheck from './alarm-pretreatment-check'; //预处理详情查看
import AlarmExport from './alarm-export'; //告警导出
import AlarmExperienceCheck from './alarm-experience-check';
import AlarmCallGD from './alarm-call_gd'; // 告警呼叫-广东  Alarm call gd
import AlarmManualPretreatmentGD from './alarm-manual-pretreatment-gd'; //手工预处理-广东
import AlarmPretreatmentCheckGD from './alarm-pretreatment-check-gd'; //预处理详情查看-广东
import IvrDetailCheckGD from './ivr-detail-check-gd'; // 查看呼叫详情
// import PreprocessingDetails from '@Src/pages/preprocessed-query/resultDesc';
// import TerminalHandle from '@Src/pages/terminal/terminal-handle';

var contextMenuComponent = {
  AlarmDetails: AlarmDetails,
  SingleAlarmSynchronization: SingleAlarmSynchronization,
  AlarmAcknowledgement: AlarmAcknowledgement,
  AlarmAcknowledgementCheck: AlarmAcknowledgementCheck,
  AlarmManualClearing: AlarmManualClearing,
  ManualDispatch: ManualDispatch,
  ManualDispatchUnicom: ManualDispatchUnicom,
  SuppressionOfOrders: SuppressionOfOrders,
  AlarmSMSDistribution: AlarmSMSDistribution,
  AlarmCall: AlarmCall,
  WarningRemarks: WarningRemarks,
  WarningRemarksCheck: WarningRemarksCheck,
  // AlarmProcessingFlow,
  CompDevRes: CompDevRes,
  CompMachineryRoom: CompMachineryRoom,
  CompEffectedCell: CompEffectedCell,
  CompEffectedUser: CompEffectedUser,
  CompArPro: CompArPro,
  AlarmManualPretreatment: AlarmManualPretreatment,
  AlarmPretreatmentCheck: AlarmPretreatmentCheck,
  AlarmExport: AlarmExport,
  AlarmExperienceCheck: AlarmExperienceCheck,
  AlarmCallGD: AlarmCallGD,
  AlarmManualPretreatmentGD: AlarmManualPretreatmentGD,
  AlarmPretreatmentCheckGD: AlarmPretreatmentCheckGD,
  IvrDetailCheckGD: IvrDetailCheckGD
};
export default contextMenuComponent;