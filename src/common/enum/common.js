import locales from '@Common/locales';

const enableStatus = [
    { id: 2, key: 'disable', name: () => locales.get('enums.enableStatus.disable') },
    { id: 1, key: 'enable', name: () => locales.get('enums.enableStatus.enable') },
];
const logicRelation = [
    { id: 0, key: 'and', name: () => '与' },
    { id: 1, key: 'or', name: () => '或' },
    { id: 1, key: 'not', name: () => '非' },
];

const operatorMapNumber = [
    { id: 0, key: 'GT', name: () => '大于' },
    { id: 1, key: 'GTEQ', name: () => '大于等于' },
    { id: 2, key: 'LT', name: () => '小于' },
    { id: 3, key: 'LTEQ', name: () => '小于等于' },
    { id: 4, key: 'EQ', name: () => '等于' },
    { id: 5, key: 'NOTEQ', name: () => '不等于' },
    { id: 6, key: 'BETWEEN', name: () => '介于' },
];

const operatorMapBoolean = [
    { id: 0, key: 'YES', name: () => '是' },
    { id: 1, key: 'NOT', name: () => '不是' },
];

const operatorMapText = [
    { id: 0, key: 'INCLUDE', name: () => '包含' },
    { id: 1, key: 'EXCLUDE', name: () => '不包含' },
];

const operatorMapTime = [
    // { id: 0, key: 'RECENT', name: () => '包含' },
    { id: 1, key: 'RANGE', name: () => '固定时段' },
];

export default {
    enableStatus,
    logicRelation,
    operatorMapNumber,
    operatorMapBoolean,
    operatorMapText,
    operatorMapTime,
};
