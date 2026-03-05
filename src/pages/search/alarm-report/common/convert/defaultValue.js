import moment from 'moment';

export default class {
    /**
     * @param DefaultValue : any
     * @param ControlType : 'DatePickerRange'|...
     * 老报表配置中的 DefaultValue 和 新报表 defaultValue映射关系
     *  */
    mapping = ({ DefaultValue = null, ControlType = null }) => {
        let _defaultValue = null;
        if (DefaultValue !== null) {
            switch (ControlType) {
                case 'DatePickerRange':
                case 'DateTimePickerRange':
                    _defaultValue = this.getDefaultDate(DefaultValue);
                    break;
                case 'ComboBox':
                    _defaultValue = DefaultValue;
                    break;
                case 'MutiDropDown':
                    _defaultValue = DefaultValue.length !== 0 ? DefaultValue.split(',') : null;
                    break;
                default:
                    _defaultValue = DefaultValue;
            }
        }
        return _defaultValue;
    };
    getDefaultDate = (defaultValue) => {
        const defaultArr = defaultValue.split(',');
        const _defaultDate = defaultArr.map((_item) => {
            let current;
            const item = _item.replace('#', ',');
            switch (item) {
                case '当日':
                    current = moment().format('YYYY-MM-DD');
                    break;
                case '昨日':
                case 'yesterday':
                    current = moment().subtract(1, 'day').format('YYYY-MM-DD');
                    break;
                case '当周':
                    current = moment().startOf('week').format('YYYY-MM-DD');
                    break;
                case '当月':
                    current = moment().startOf('month').format('YYYY-MM-DD');
                    break;
                case '上月':
                    current = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
                    break;
                default:
                    current = moment().format('YYYY-MM-DD');
            }
            if (item.indexOf('years-') >= 0) {
                const subyears = Number(item.split('-')[1]);
                current = moment().subtract(subyears, 'years').format('YYYY-MM-DD');
            }
            return current;
        });
        return _defaultDate;
    };
}
