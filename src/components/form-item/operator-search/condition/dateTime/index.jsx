// import locales from "locales";
import React from 'react';
import { DatePicker } from 'oss-ui';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD HH:mm';
const style = { width: '100%' };
export default class Index extends React.PureComponent {
    getDateRange = ({ operatorValue }) => {
        let defaultDate = null;
        if (operatorValue && operatorValue.value) {
            const mom = moment(operatorValue.value, dateFormat);
            if (mom.isValid()) {
                defaultDate = mom;
            } else {
                defaultDate = null;
            }
        }
        return defaultDate;
    };
    render() {
        const defaultValue = this.getDateRange(this.props);
        return (
            <DatePicker
                style={style}
                showTime={{ format: 'HH:mm' }}
                format={dateFormat}
                value={defaultValue}
                onChange={this.props.onChange}
            ></DatePicker>
        );
    }
}
