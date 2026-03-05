import React, { useEffect, useState } from 'react';
import GlobalMessage from '@Src/common/global-message';
import './time.less';
import dayjs from 'dayjs';

let timer = null;

const Index = (props) => {
    const [time, handleTime] = useState(null);
    const getTimeStart = () => {
        clearTimeout(timer);
        if (props.startTime) {
            const date1 = dayjs(props.startTime, 'YYYY-MM-DD hh:mm:ss');
            const date2 = dayjs();
            // const hour1 = dayjs(date1).hour();
            // const hour2 = dayjs(date2).hour();
            if (date1 <= date2) {
                // if (date2.diff(date1, 'day')) {
                // }
                handleTime(
                    `${date2.diff(date1, 'hour') > 9 ? date2.diff(date1, 'hour') : '0' + date2.diff(date1, 'hour')}:${
                        dayjs(date2.diff(date1)).minute() > 9 ? dayjs(date2.diff(date1)).minute() : '0' + dayjs(date2.diff(date1)).minute()
                    }:${dayjs(date2.diff(date1)).second() > 9 ? dayjs(date2.diff(date1)).second() : '0' + dayjs(date2.diff(date1)).second()}`
                );
            }
        }
        // if (dayjs().isAfter(dayjs("08:30:00", "hh:mm:ss")) && dayjs().isBefore(dayjs("17:30:00", "hh:mm:ss"))) {

        // } else {
        //   const date1 = dayjs("17:30:00", "hh:mm:ss");
        //   const date2 = dayjs();
        //   handleTime(
        //     `${dayjs(date2.diff(date1)).hour() - 8}:${dayjs(
        //       date2.diff(date1)
        //     ).minute()}:${dayjs(date2.diff(date1)).second()}`
        //   );
        // }
        timer = setTimeout(() => {
            getTimeStart();
        }, 1000);
    };
    const watchTabActiveChange = () => {
        GlobalMessage.off('activeChanged', null, null);
        GlobalMessage.on('activeChanged', ({ isActive }) => {
            if (isActive) {
                setTimeout(() => {
                    getTimeStart();
                }, 500);
            } else {
                clearTimeout(timer);
            }
        });
    };
    useEffect(() => {
        watchTabActiveChange();
        getTimeStart();
        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.startTime]);
    return time ? (
        <>
            <span>当班时长</span>
            <span className="time-render">{time}</span>
        </>
    ) : (
        <span className="not-schedule">非当班人</span>
    );
};

export default Index;
