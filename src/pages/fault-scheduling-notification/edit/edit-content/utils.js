import moment from 'moment';

export function formatNotificationTimeRange(data, type = 'show') {
    const { timeEnable, beginTime, endTime, timeRange, outTimeOperation } = data || { timeEnable: 0 };
    const timeFormat = 'HH:mm:ss';

    if (type === 'show') {
        return {
            timeEnable: Boolean(timeEnable),
            timeRange: [moment(beginTime || '08:00:00', timeFormat), moment(endTime || '18:00:00', timeFormat)],
            outTimeOperation: outTimeOperation || '0',
        };
    }

    return {
        timeEnable: Number(timeEnable),
        outTimeOperation,
        beginTime: timeRange?.[0]?.format(timeFormat) || '08:00:00',
        endTime: timeRange?.[1]?.format(timeFormat) || '18:00:00',
    };
}
