// import locales from "locales";
import React from 'react';
import { DatePicker } from 'oss-ui';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const style = { width: '100%' };
export default class Index extends React.PureComponent {
    getDate = ({ operatorValue }) => {
        let date = null;
        if (operatorValue && operatorValue.value) {
            const mom = moment(operatorValue.value, dateFormat);
            if (mom.isValid()) {
                date = mom;
            }
        }
        return date;
    };
    render() {
        const defaultDate = this.getDate(this.props);
        return (
            <DatePicker
                style={style}
                format={dateFormat}
                value={defaultDate}
                onChange={this.props.onChange}
            ></DatePicker>
        );
    }
}
