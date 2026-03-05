const text = [
    { value: '包含', key: 'like' },
    { value: '不包含', key: 'notLike' },
    { value: '等于', key: 'eq', default: 'default' },
    { value: '不等于', key: 'ne' },
];
const date = [
    { value: '等于', key: 'eq', default: 'default' },
    { value: '不等于', key: 'ne' },
    { value: '大于', key: 'gt' },
    { value: '大于等于', key: 'ge' },
    { value: '小于', key: 'lt' },
    { value: '小于等于', key: 'le' },
];
const dateTime = [
    { value: '等于', key: 'eq', default: 'default' },
    { value: '不等于', key: 'ne' },
    { value: '大于', key: 'gt' },
    { value: '大于等于', key: 'ge' },
    { value: '小于', key: 'lt' },
    { value: '小于等于', key: 'le' },
];
const dateRange = [{ value: '等于', key: 'between', default: 'default' }];
const dateTimeRange = [{ value: '等于', key: 'between', default: 'default' }];
const time = [
    { value: '等于', key: 'eq', default: 'default' },
    { value: '不等于', key: 'ne' },
    { value: '大于', key: 'gt' },
    { value: '大于等于', key: 'ge' },
    { value: '小于', key: 'lt' },
    { value: '小于等于', key: 'le' },
];
const number = [
    { value: '等于', key: 'eq', default: 'default' },
    { value: '不等于', key: 'ne' },
    { value: '大于', key: 'gt' },
    { value: '大于等于', key: 'ge' },
    { value: '小于', key: 'lt' },
    { value: '小于等于', key: 'le' },
];
const money = [
    { value: '等于', key: 'eq', default: 'default' },
    { value: '不等于', key: 'ne' },
    { value: '大于', key: 'gt' },
    { value: '大于等于', key: 'ge' },
    { value: '小于', key: 'lt' },
    { value: '小于等于', key: 'le' },
];
// // 新增
const enumeration = [
    { value: '等于', key: 'in', default: 'default' },
    { value: '不等于', key: 'notIn' },
];
const newEnumeration = [
    { value: '等于', key: 'in', default: 'default' },
    { value: '不等于', key: 'notIn' },
];
const cascader = [{ value: '等于', key: 'eq', default: 'default' }];

const newText = text;

export default {
    text,
    newText,
    date,
    dateTime,
    dateRange,
    dateTimeRange,
    time,
    number,
    money,
    enumeration,
    newEnumeration,
    cascader,
};
