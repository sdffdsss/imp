import React, { useEffect, useState, useRef } from 'react';
import GlobalMessage from '@Src/common/global-message';
import './time.less';
import dayjs from 'dayjs';

const Index = (props) => {
    const [time, handleTime] = useState(null);
    const timerRef = useRef(null);
    const getTimeStart = () => {
        clearTimeout(timerRef.current);
        if (props.startTime) {
            const date1 = dayjs(props.startTime, 'YYYY-MM-DD hh:mm:ss');
            const date2 = dayjs();
            if (date1 <= date2) {
                handleTime(
                    `${date2.diff(date1, 'hour') > 9 ? date2.diff(date1, 'hour') : '0' + date2.diff(date1, 'hour')}:${
                        dayjs(date2.diff(date1)).minute() > 9 ? dayjs(date2.diff(date1)).minute() : '0' + dayjs(date2.diff(date1)).minute()
                    }:${dayjs(date2.diff(date1)).second() > 9 ? dayjs(date2.diff(date1)).second() : '0' + dayjs(date2.diff(date1)).second()}`,
                );
            }
        }
        timerRef.current = setTimeout(() => {
            getTimeStart();
        }, 1000);
    };
    const watchTabActiveChange = () => {
        function fn({ isActive }) {
            if (isActive) {
                setTimeout(() => {
                    getTimeStart();
                }, 500);
            } else {
                clearTimeout(timerRef.current);
            }
        }
        GlobalMessage.off('activeChanged', fn, null);
        GlobalMessage.on('activeChanged', fn);
    };
    useEffect(() => {
        watchTabActiveChange();
        getTimeStart();
        return () => {
            clearTimeout(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.startTime]);
    return time ? <span className="on-duty-content">{time}</span> : <span className="on-duty-content">0</span>;
};

export default Index;
