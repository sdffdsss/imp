import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import GlobalMessage from '@Src/common/global-message';
import './time.less';

const Index = (props) => {
    const [time, handleTime] = useState(null);
    const { color = '99c9ff' } = props;
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
        const timer = setTimeout(() => {
            getTimeStart();
        }, 1000);
        timerRef.current = timer;
    };
    const watchTabActiveChange = () => {
        GlobalMessage.off('activeChanged', null, null);
        GlobalMessage.on('activeChanged', ({ isActive }) => {
            if (isActive) {
                setTimeout(() => {
                    getTimeStart();
                }, 500);
            } else {
                clearTimeout(timerRef.current);
            }
        });
    };
    useEffect(() => {
        watchTabActiveChange();
        getTimeStart();
        return () => {
            clearTimeout(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.startTime]);
    return time ? (
        <span className="on-duty-content" style={{ color }}>
            {time}
        </span>
    ) : (
        <span className="on-duty-content" style={{ color }}>
            0
        </span>
    );
};

export default Index;
