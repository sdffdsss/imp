import { MajorFaultReportEnum } from '@Src/common/enum/majorFaultReportEnum';

// 这几个key作为弹窗的标题和智能体返回按钮的文案不一样
const needReMapKeys = {
    'majorFaultReport:supplementalReportApplication': '续报申请',
    'majorFaultReport:supplementalReport': '续报',
    'majorFaultReport:progressReportSupplementalApplication': '续报申请',
    'majorFaultReport:progressReportSupplemental': '续报',
};
export default function generateQuestionTxt(key) {
    return needReMapKeys[key] || MajorFaultReportEnum[key];
}
