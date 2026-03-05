// 规则关联方式
const ruleTemplateEnum = {
    primarySub: 1, // 主次关联
    conclude: 2, // 衍生关联
};
const proviceVersion = [
    {
        id: '0',
        name: '省内总结',
    },
    {
        id: '1',
        name: '统一版本',
    },
];
const ruleTemplate = [
    {
        id: 1,
        name: '主次关联',
    },
    {
        id: 2,
        name: '衍生关联',
    },
];

export const ruleTypeEnum = [
    {
        value: 1,
        label: '主次关联',
    },
    {
        value: 2,
        label: '衍生关联',
    }
]

// 起停状态
const ruleStatusEnum = {
    start: 1,
    stop: 2,
};

const complexityEnum = {
    complex: 1,
    simple: 2,
};
const searchTypeEnum = [
    {
        key: 'eqp_object_class',
        name: 'objectClassDic',
    },
    {
        key: 'vendor_id',
        name: 'vendeDic',
    },
    {
        key: 'professional_type',
        name: 'firstprofessionsDataDic',
    },
    // {
    //     key: 'active_status',
    //     name: 'clearType',
    // },
    // {
    //     key: 'RELATION',
    //     name: 'relation',
    // },
];
const fieldEnum = [
    {
        value: 1,
        label: '固定值',
    },
    // {
    //     value: 2,
    //     title: 'SQL',
    // },
    // {
    //     value: 3,
    //     title: '正则',
    // },
    {
        value: 4,
        label: '告警变量',
    },
    {
        value: 5,
        label: '固定值+告警变量',
    },
    // {
    //     value: 6,
    //     title: 'rest',
    // },
    // {
    //     value: 7,
    //     title: '数值转换',
    // },
    // {
    //     value: 8,
    //     title: '字符串转列表',
    // },
    // {
    //     value: 9,
    //     title: '列表转字符串',
    // },
];
const timelist = [
    {
        value: '0',
        label: '00:00-01:00',
    },
    {
        value: '1',
        label: '01:00-02:00',
    },
    {
        value: '2',
        label: '02:00-03:00',
    },
    {
        value: '3',
        label: '03:00-04:00',
    },
    {
        value: '4',
        label: '04:00-05:00',
    },
    {
        value: '5',
        label: '05:00-06:00',
    },
    {
        value: '6',
        label: '06:00-07:00',
    },
    {
        value: '7',
        label: '07:00-08:00',
    },
    {
        value: '8',
        label: '08:00-09:00',
    },
    {
        value: '9',
        label: '09:00-10:00',
    },
    {
        value: '10',
        label: '10:00-11:00',
    },
    {
        value: '11',
        label: '11:00-12:00',
    },
    {
        value: '12',
        label: '12:00-13:00',
    },
    {
        value: '13',
        label: '13:00-14:00',
    },
    {
        value: '14',
        label: '14:00-15:00',
    },
    {
        value: '15',
        label: '15:00-16:00',
    },
    {
        value: '16',
        label: '16:00-17:00',
    },
    {
        value: '17',
        label: '17:00-18:00',
    },
    {
        value: '18',
        label: '18:00-19:00',
    },
    {
        value: '19',
        label: '19:00-20:00',
    },
    {
        value: '20',
        label: '20:00-21:00',
    },
    {
        value: '21',
        label: '21:00-22:00',
    },
    {
        value: '22',
        label: '22:00-23:00',
    },
    {
        value: '23',
        label: '23:00-24:00',
    },
];
const relatedScopeData = [
    {
        value: 1,
        label: '网元内',
    },
    {
        value: 2,
        label: '网元间',
    },
    {
        value: 3,
        label: '跨专业',
    },
];
const timeTypeList = [
    {
        value: 1,
        label: '秒',
    },
    {
        value: 2,
        label: '分钟',
    },
    {
        value: 3,
        label: '小时',
    },
    {
        value: 4,
        label: '天',
    },
];
const viewTypeEnum = {
    provinceRuleManage: 0,
    provinceRuleUpdate: 1,
    provinceRulePublish: 2,
    provinceRuleReview: 3,
    groupManage: 4,
    uniformManage: 5,
    chooseUniform: 7,
    provinceRuleShared: 8,
};

const clearanceStrategyOneList = [
    { value: '1', label: '低于阈值清除' },
    { value: '2', label: '一定时间后清除' },
    { value: '3', label: '所有子告警清除后清除' },
    { value: '4', label: '任意子告警清除后清除' },
];

// 仿真验证状态
export const simulationStatusEnum = [
    { value: '', label: '全部' },
    { value: 0, label: '验证中' },
    { value: 1, label: '验证完成' },
    { value: 2, label: '验证失败' },
]

export const simulationTypeEnum = [
    { value: '', label: '全部' },
    { value: 1, label: '模拟验证' },
    { value: 2, label: '回归验证' },
]

export const logicalTypeEnum = [
    { label: '与', value: 'and' },
    { label: '或', value: 'or' },
    { label: '非', value: 'not' },
];

export const alarmEventTimeTypeEnum = [
    { value: 1, label: "当前系统时间" },
    { value: 2, label: "继承最早子告警" },
    { value: 3, label: "继承最晚子告警" },
]

export const orgSeverityEnum = [
    { value: 1, label: "一级告警" },
    { value: 2, label: "二级告警" },
    { value: 3, label: "三级告警" },
    { value: 4, label: "四级告警" },
    { value: 5, label: "继承子告警最高级别" },
]

export const inheritAlarmStrategyEnum = [
    { value: 1, label: "继承最早子告警" },
    { value: 2, label: "继承最晚子告警" },
];

export const clearanceStrategyEnum = [
    { value: 1, label: "低于阈值清除" },
    { value: 2, label: "一定时间后清除" },
    { value: 3, label: "所有子告警清除后清除" },
    { value: 4, label: "任意子告警清除后清除" },
];

export const conditionTypeEnum = [
    { value: 'exists', label: '存在' },
    { value: 'notexists', label: '不存在' },
]

export const operatorEnum = [
    { value: '<', label: '<' },
    { value: '<=', label: '<=' },
    { value: '=', label: '=' },
    { value: '>', label: '>' },
    { value: '>=', label: '>=' },
];

export const ruleSourceEnum = [
    { label: '全部', value: '' },
    { label: '省份推荐', value: 2 },
    { label: 'AI推荐', value: 1 },
]

export const ruleSourceListEnum = [
    { label: '省份新建', value: 0 },
    { label: 'AI推荐', value: 1 },
    { label: '规则市场', value: 2 },
]

export const usageScenarioEnum = [
    { label: '省份自用', value: 0 },
    { label: '规则市场', value: 1 },
]

export default {
    ruleTemplateEnum,
    ruleStatusEnum,
    complexityEnum,
    viewTypeEnum,
    proviceVersion,
    ruleTemplate,
    searchTypeEnum,
    fieldEnum,
    timelist,
    relatedScopeData,
    clearanceStrategyOneList,
    timeTypeList,
};
