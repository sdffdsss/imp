// import locales from "locales";
import React from 'react';
import moment from 'moment';
import DateRangeTime from '@Components/date-range-time';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const style = { width: '100%' };
export default class Index extends React.PureComponent {
    currentRange = [moment().subtract(1, 'days'), moment()];
    getDateRange = ({ operatorValue }) => {
        let defaultRange = [];
        if (operatorValue && operatorValue.value && operatorValue.value.length > 0) {
            for (const iterator of operatorValue.value) {
                const mom = moment(iterator, dateFormat);
                if (mom.isValid()) {
                    defaultRange.push(mom);
                }
            }
            // if (defaultRange.length === 1) {
            //     defaultRange.unshift(null);
            // }
        } else {
            const noDefaultList = ['cancel_time', 'last_event_time_str', 'intending_send_time'];
            defaultRange = this.currentRange;
            if (noDefaultList.includes(this.props.dataIndex)) {
                defaultRange = [null, null];
            }
            if (this.props.onChange) {
                this.props.onChange(defaultRange);
            }
        }

        return defaultRange;
    };

    render() {
        const value = this.getDateRange(this.props);
        return (
            <div>
                <DateRangeTime
                    disabledDate={this.props.disabledDate ? this.props.disabledDate : null}
                    showTime
                    format={dateFormat}
                    value={value}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}
