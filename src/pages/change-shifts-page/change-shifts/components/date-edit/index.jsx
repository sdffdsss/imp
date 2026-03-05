import React, { useState, useEffect } from 'react';
import { DatePicker } from 'oss-ui';
import moment from 'moment';

export default function DateEdit(props) {
    const { value, onChange } = props;
    const [innerValue, setInnerValue] = useState();

    useEffect(() => {
        setInnerValue(value && moment(value, 'YYYY-MM-DD HH:mm:ss'));
    }, [value]);

    function onDateChange(date, dateString) {
        onChange(dateString);
        setInnerValue(date);
    }

    return <DatePicker value={innerValue} onChange={onDateChange} showTime />;
}
