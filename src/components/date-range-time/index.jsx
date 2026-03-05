import React, { useState, useEffect } from 'react';
import { DatePicker, message } from 'oss-ui';
import moment from 'moment';
import _cloneDeep from 'lodash/cloneDeep';
const DateRangeTime = (props) => {
    const [value, setValue] = useState([]);
    useEffect(() => {
        if (props.value) {
            let momentList = [];
            if (props.value[0]) {
                if (props.value[0] >= props.value[1] || !props.value[1]) {
                    // console.log(moment(props.value[0]).subtract(1, 'days').endOf('day'));
                    // if (props.value[1]) {
                    if (props.showTime) {
                        if (props.value[1]) {
                            momentList = [null, moment(props.value[1])];
                            setValue(momentList);
                        }
                    } else {
                        if (props.value[1]) {
                            let valueStart = moment(props.value[0]).format('YYYY-MM-DD');
                            let valueEnd = moment(props.value[1]).format('YYYY-MM-DD');
                            if (moment(valueStart).diff(moment(valueEnd), 'day') === 0) {
                                momentList = [moment(props.value[0]), moment(props.value[1])];
                                setValue(momentList);
                            } else {
                                momentList = [];
                                setValue(momentList);
                            }
                        } else {
                            momentList = [moment(props.value[0]), null];
                            setValue(momentList);
                        }
                    }

                    // } else {
                    //     setValue([moment(props.value[0]), null]);
                    // }
                } else if (props.value[0] && props.value[1] && props.value[0] < props.value[1]) {
                    momentList = [moment(props.value[0]), moment(props.value[1])];
                    setValue(momentList);
                }
            } else {
                if (props.value[1]) {
                    momentList = [null, moment(props.value[1])];
                    setValue(momentList);
                } else {
                    setValue([]);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.value]);
    const dateChange = (index, date) => {
        let valueList = value;
        valueList[index] = date;

        if (props.showTime) {
            if (index === 1 && valueList[0] >= valueList[1]) {
                message.error('结束时间不能小于开始时间');
                valueList[1] = null;
            }
            if (index === 0 && valueList[1] && valueList[0] >= valueList[1]) {
                message.error('结束时间不能小于开始时间');
                valueList[0] = null;
            }
        } else {
            if (index === 1 && valueList[0] > valueList[1]) {
                message.error('结束日期不能小于开始日期');
                valueList[1] = null;
            }
            let valueStart = moment(valueList[0]).format('YYYY-MM-DD');
            let valueEnd = moment(valueList[1]).format('YYYY-MM-DD');
            if (index === 0 && valueList[1] && moment(valueStart).diff(moment(valueEnd), 'day') > 0) {
                message.error('结束日期不能小于开始日期');
                valueList[0] = null;
            }
        }

        // if (index === 0 && !valueList[1]) {
        //     if (props.showTime) {
        //         valueList[1] = moment(date).add(1, 'hours');
        //     } else {
        //         valueList[1] = moment(date);
        //     }
        // }
        // if (index === 0 && !date) {
        //     valueList = [];
        // }
        let list = _cloneDeep(valueList);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        props.onChange && props.onChange(list);
        // setValue(valueList);
    };
    const disabledDate = (current) => {
        // Can not select days before today and today
        // if (props.showTime) {
        //     return current;
        // }
        return current && current < moment(value[0]).subtract(1, 'days').endOf('day');
    };
    // const disabledDateTime = () => {
    //     let hour = 0;
    //     if (value[0]) {
    //         if (!value[1] || moment(value[0]).format('YYYY-MM-DD') === moment(value[1]).format('YYYY-MM-DD')) hour = moment(value[0]).hour();
    //     }
    //     return {
    //         disabledHours: () => range(0, hour)
    //     };
    // };

    return (
        <div style={{ display: 'flex', flexFlow: 'nowrap', alignItems: 'center' }}>
            <DatePicker
                value={value[0]}
                onChange={(...rest) => dateChange(0, ...rest)}
                format={props.format ? props.format : 'YYYY-MM-DD'}
                showTime={props.showTime ? props.showTime : false}
                disabledDate={props.disabledDate ? props.disabledDate : () => false}
                disabledTime={props.disabledTime ? props.disabledTime : () => false}
                disabled={props.disabled ? props.disabled : false}
                allowClear={props.allowClear || props.allowClear === false ? props.allowClear : true}
            />{' '}
            -{' '}
            <DatePicker
                value={value[1]}
                onChange={(...rest) => dateChange(1, ...rest)}
                disabled={props.disabled ? props.disabled : false}
                disabledDate={props.disabledDate ? (current) => props.disabledDate(current, disabledDate) : disabledDate}
                disabledTime={props.disabledTime ? props.disabledTime : () => false}
                showNow={false}
                format={props.format ? props.format : 'YYYY-MM-DD'}
                showTime={props.showTime ? props.showTime : false}
                allowClear={props.allowClear || props.allowClear === false ? props.allowClear : true}
            />
        </div>
    );
};
export default DateRangeTime;
