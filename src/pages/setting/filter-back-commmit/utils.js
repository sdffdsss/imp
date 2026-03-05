export const getCommonOptionTypeWithSelectFilter = (moduleId) => {
    switch (moduleId) {
        case 7:
        case 8:
        /* falls through */
        case 10:
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
