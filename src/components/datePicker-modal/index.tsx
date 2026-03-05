import React, { useRef } from 'react';
import { DatePicker } from 'oss-ui';
import moment, { Moment } from 'moment';

interface Iprops {
    value?: any;
    onChange?: (params: any) => void;
}
type TimeType = 'start' | 'end';

const DatePickerModal: React.FC<Iprops> = (props) => {
    const { onChange } = props;
    const format = 'YYYY-MM-DD hh:mm:ss';
    const startDate = useRef<Moment>();
    const endDate = useRef<Moment>();
    const timeDiffComputed = (type: TimeType, currentDate: Moment) => {
        let result: boolean = false;
        if (type === 'start') {
            result = moment(currentDate, format).isAfter(moment(endDate.current, format));
        }
        if (type === 'end') {
            result = moment(currentDate, format).isBefore(moment(startDate.current, format));
        }
        return result;
    };

    const changeDate = (type: TimeType, data: Moment) => {
        if (type === 'start') {
            startDate.current = data;
        }
        if (type === 'end') {
            endDate.current = data;
        }
        const resultStartDate =
            moment(startDate.current ?? null).format(format) === 'Invalid date' ? undefined : moment(startDate.current).format(format);
        const resultEndDate = moment(endDate.current).format(format) === 'Invalid date' ? undefined : moment(endDate.current).format(format);
        onChange?.({ resultStartDate, resultEndDate });
    };

    return (
        <div>
            <DatePicker
                onChange={(momentDate) => changeDate('start', momentDate as Moment)}
                disabledDate={(currentDate) => timeDiffComputed('start', currentDate)}
            />
            <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <DatePicker
                onChange={(momentDate) => changeDate('end', momentDate as Moment)}
                disabledDate={(currentDate) => timeDiffComputed('end', currentDate)}
            />
        </div>
    );
};
export default DatePickerModal;
