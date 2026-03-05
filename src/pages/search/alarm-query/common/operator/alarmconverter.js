export default {
    /**
     * 根据字段查找列
     *
     * @method findColunmsByFieldName
     * @param alarmColumns 告警列
     * @param fieldName 字段名称
     * @public
     */
    findColunmsByFieldName(alarmColumns, fieldName) {
        let fieldId = 0;
        if (alarmColumns !== undefined && alarmColumns.length > 0 && fieldName !== '' && fieldName !== null && fieldName !== undefined) {
            switch (fieldName) {
                case 'filter_id':
                    fieldId = 999;
                    break;
                default:
                    alarmColumns.forEach(function (one, idx) {
                        if (one.toLowerCase() === fieldName.toLowerCase()) {
                            fieldId = idx;
                            // break;
                        }
                        if (one.toLowerCase() === 'unsend_reason' && fieldName.toLowerCase() === 'sheet_unsend_reason') {
                            fieldId = idx;
                            // break;
                        }
                        if (one.toLowerCase() === 'failed_reason' && fieldName.toLowerCase() === 'sheet_send_fail_reason') {
                            fieldId = idx;
                            // break;
                        }
                        // 特殊处理，原因在服务端是send_status 在客户端是sheet_send_status
                        if (one.toLowerCase() === 'send_status' && fieldName.toLowerCase() === 'sheet_send_status') {
                            fieldId = idx;
                            // break;
                        }
                        if (one.toLowerCase() === 'sheet_send_status' && fieldName.toLowerCase() === 'send_status') {
                            fieldId = idx;
                            // break;
                        }
                        if (one.toLowerCase() === 'title_text' && fieldName.toLowerCase() === 'alarm_title_text') {
                            fieldId = idx;
                            // break;
                        }
                        if (one.toLowerCase() === 'alarm_title_text' && fieldName.toLowerCase() === 'title_text') {
                            fieldId = idx;
                            // break;
                        }
                        // 特殊处理preprocess_flag1、preprocess_flag2 条件都是对应 preprocess_flag
                        if (
                            one.toLowerCase() === 'preprocess_flag' &&
                            (fieldName.toLowerCase() === 'preprocess_flag1' || fieldName.toLowerCase() === 'preprocess_flag2')
                        ) {
                            fieldId = idx;
                            // break;
                        }
                        // 需要传那个mConditionMaps加个条件   ac_rule_name这个在字段模板里面没有  id传-1
                        if (one.toLowerCase() === 'ac_rule_name' || fieldName.toLowerCase() === 'ac_rule_name') {
                            fieldId = -1;
                            // break;
                        }
                    });
            }
        }
        return fieldId;
    },
    /**
     * 操作符转换
     *
     * @method filterOperatorsConvert
     * @param opt 操作符
     * @public
     */
    filterOperatorsConvertNew(opt, valueLength) {
        let op = opt;
        if (valueLength > 1 && op !== 'between') {
            op = 'in';
        }
        return op;
    },
    /**
     * 操作符转换
     *
     * @method filterOperatorsConvert
     * @param opt 操作符
     * @public
     */
    filterOperatorsConvert(opt, valueLength) {
        let op = opt;
        if (valueLength > 1 && op !== 'between') {
            op = { name: '_in', value: 2 };
        } else {
            switch (op) {
                case 'eq':
                    op = { name: 'eq', value: 0 };
                    break;
                case 'ge':
                    op = { name: 'ge', value: 7 };
                    break;
                case 'gt':
                    op = { name: 'gt', value: 6 };
                    break;
                case 'le':
                    op = { name: 'le', value: 5 };
                    break;
                case 'lt':
                    op = { name: 'lt', value: 4 };
                    break;
                case 'in':
                    op = { name: '_in', value: 2 };
                    break;
                case 'like':
                    op = { name: 'like', value: 1 };
                    break;
                case 'between':
                    op = { name: 'between', value: 3 };
                    break;
                default:
                    op = { name: 'eq', value: 0 };
            }

            //             between: type {_name: "between", _value: 3}
            // eq: type {_name: "eq", _value: 0}
            // ge: type {_name: "ge", _value: 7}
            // gt: type {_name: "gt", _value: 6}
            // le: type {_name: "le", _value: 5}
            // like: type {_name: "like", _value: 1}
            // lt: type {_name: "lt", _value: 4}
        }
        return op;
    }
};
