/* eslint-disable no-duplicate-case */
export const valueTypeMap = (isEnum, dataType, dataIndex) => {
    // text,
    // date,
    // dateTime,
    // dateRange,
    // dateTimeRange,
    // time,
    // number,
    // money,
    // cascader,
    // enumeration,
    if (isEnum === 1) {
        return 'enumeration';
    }
    if (dataIndex === 'event_time') {
        return 'dateTimeRange';
    }
    let dateType = null;
    // byte short integer long char float double boolean date string
    switch (dataType) {
        case 'string':
        case 'char':
        case 'long':
        case 'short':
        default:
            dateType = 'text';
            break;
        case 'dateTimeRange':
            dateType = 'dateTimeRange';
            break;
        case 'date':
        case 'dateTime':
            dateType = 'dateTime';
            break;

        case 'integer':
        case 'float':
        case 'double':
            dateType = 'number';
            break;
    }
    return dateType;
};
