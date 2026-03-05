import moment from 'moment';

/**
 * @param defaultValue : any
 * @param valueType : 'DatePickerRange'|...
 * 老报表配置中的 defaultValue 和 新报表 defaultValue映射关系
 *  */
const mapping = (defaultValue = null, valueType = null) => {
    let _defaultValue = null;
    if (defaultValue !== null) {
        switch (valueType) {
            case 'dateTimeRange':
                _defaultValue = getDefaultDate(defaultValue);
                break;
            default:
                _defaultValue = defaultValue;
        }
    }
    return _defaultValue;
};
export default mapping;
const getDefaultDate = (defaultValue) => {
    const _defaultDate = defaultValue.map((item) => {
        let current;
        if (typeof item === 'object') {
            current = item;
        } else {
            switch (item) {
                case '当日':
                case 'today':
                    // current = moment().format('YYYY-MM-DD');
                    current = moment().startOf('day');
                    break;
                case '昨日':
                case 'yesterday':
                    current = moment().subtract(1, 'day').startOf('day');
                    break;
                case '昨晚':
                case 'lastNight':
                    current = moment().subtract(1, 'day').endOf('day');
                    break;
                case '今晚':
                case 'tonight':
                    current = moment().endOf('day');
                    break;
                case '当周':
                    current = moment().startOf('week');
                    break;
                case '当月':
                    current = moment().startOf('month');
                    break;
                case '上月':
                    current = moment().subtract(1, 'month').startOf('month');
                    break;
                default:
                    current = moment();
            }
        }

        return current;
    });
    return _defaultDate;
};
