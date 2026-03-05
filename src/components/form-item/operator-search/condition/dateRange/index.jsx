// import locales from "locales";
import React from 'react';
import { DatePicker } from 'oss-ui';
import moment from 'moment';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const style = { width: '100%' };
export default class Index extends React.PureComponent {
    getDateRange = ({ operatorValue }) => {
        const defaultRange = [];
        if (operatorValue && operatorValue.value && operatorValue.value.length > 0) {
            for (const iterator of operatorValue.value) {
                const mom = moment(iterator, dateFormat);
                if (mom.isValid()) {
                    defaultRange.push(mom);
                }
            }
            if (defaultRange.length === 1) {
                defaultRange.unshift(null);
            }
        }
        return defaultRange;
    };
    render() {
        const value = this.getDateRange(this.props);
        // console.log('DateRange' + JSON.stringify(value));
        return (
            <RangePicker
                style={style}
                format={dateFormat}
                value={value}
                onChange={this.props.onChange}
                inputReadOnly={true}
            ></RangePicker>
        );
    }
}
