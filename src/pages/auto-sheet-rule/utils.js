export const getCommonOptionTypeWithSelectFilter = (moduleId) => {
    switch (moduleId) {
        case 7:
        case 8:
        /* falls through */
        case 10:
        /* falls through */
        case 604:
        /* falls through */
        case 607:
        /* falls through */
        case 63:
        /* falls through */
        case 64:
        /* falls through */
        case 65:
        /* falls through */
        case 69:
        /* falls through */
        case 90:
        /* falls through */
        case 98:
        /* falls through */
        case 105:
        /* falls through */
        case 106:
        /* falls through */
        case 109:
        /* falls through */
        case 601:
        /* falls through */
        case 602:
            return 'TAutoSheetFilterProperty';
        case 67:
            return 'TClearRule';
        case 4:
        /* falls through */
        case 14:
        /* falls through */
        case 18:
        /* falls through */
        case 19:
        /* falls through */
        case 101:
        /* falls through */
        case 102:
        /* falls through */
        case 103:
        /* falls through */
        case 104:
            return 'TAutoForwardOption';
        //                  case 7:
        //                      return 'TPretreatOption';
        case 2:
        /* falls through */
        case 3:
            return 'TRedefineOption';
        default:
            return '';
    }
};

/**
 *获取规则/过滤器名称
 * @param {*} moduleId
 * @returns 规则/过滤器名称
 */
export const getCommonMsgWithSelectFilter = (moduleId) => {
    switch (Number(moduleId)) {
        case 7:
            return '预处理规则';
        case 8:
            return '发声规则';
        case 9:
            return '自动确认规则';
        /* falls through */
        case 10:
            return '派单规则';
        case 604:
            return '高铁派单规则';
        case 605:
            return '督办单派单规则';
        case 607:
            return '故障派单通知规则';
        /* falls through */
        case 63:
            return '判重规则';
        /* falls through */
        case 64:
            return '自动抑制派单规则';
        /* falls through */
        case 65:
            return '告警对象规则';
        /* falls through */
        case 69:
            return '客服通知单规则';
        /* falls through */
        case 90:
            return '特殊派单规则';
        /* falls through */
        case 98:
            return '通知单';
        /* falls through */
        case 105:
            return '延时计数规则';
        /* falls through */
        case 106:
            return '告警自愈';
        /* falls through */
        case 109:
            // TODO 待定，暂时没有用到 集客融合涉及的重大故障规则
            return '重大故障规则';
        /* falls through */
        case 601:
        /* falls through */
        case 602:
            return '派单规则';
        case 67:
            return '延时清除规则';
        case 4:
            return '短信前转规则';
        /* falls through */
        case 14:
            return 'IVR呼叫规则';
        /* falls through */
        case 18:
            return '呼叫并前转';
        /* falls through */
        case 19:
            // TODO 待定，暂时没有用到
            return '短信前转规则';
        // TODO 计算中心前传规则
        case 101:
        /* falls through */
        case 102:
        /* falls through */
        case 103:
        /* falls through */
        case 104:
            return '计算中心前传规则';

        case 2:
            return '级别重定义规则';
        case 3:
            return '类别重定义规则';
        default:
            return '过滤器';
    }
};
