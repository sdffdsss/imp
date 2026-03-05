// import locales from '@Common/locales';

const numberOperator = [
    { id: 'le', key: 'le', name: () => '<=' },
    { id: 'ge', key: 'ge', name: () => '>=' },
    { id: 'eq', key: 'eq', name: () => '=' },
    { id: 'between', key: 'between', name: () => '<>' }
];

const strOperator = [
    { id: 'is_null', key: 'is_null', name: () => '空' },
    { id: 'not_null', key: 'not_null', name: () => '非空' },
    { id: 'like', key: 'like', name: () => '模糊匹配' },
    { id: 'in', key: 'in', name: () => '包含' }
];
const windowTypeList = [
    {
        id: '0',
        key: 'sys',
        name: () => '当班窗口'
    },
    {
        id: '1',
        key: 'custom',
        name: () => '自定义窗口'
    }
];
const windowAttrBute = [
    {
        id: '0',
        key: 'false',
        name: () => '不共享'
    },
    {
        id: '1',
        key: 'true',
        name: () => '共享'
    }
];
const windowIfUse = [
    {
        id: '0',
        key: 'false',
        name: () => '不启用'
    },
    {
        id: '1',
        key: 'true',
        name: () => '启用'
    }
];
const filterModuleMap = [
    {
        id: '1',
        key: '1',
        name: () => '过滤器'
    },
    {
        id: '2',
        key: '2',
        name: () => '级别重定义规则'
    },
    {
        id: '3',
        key: '3',
        name: () => '类别重定义规则'
    },
    {
        id: '4',
        key: '4',
        name: () => '短信前转规则'
    },
    {
        id: '7',
        key: '7',
        name: () => '预处理规则'
    },
    {
        id: '8',
        key: '8',
        name: () => '告警发声规则'
    },
    {
        id: '9',
        key: '9',
        name: () => '自动确认规则'
    },
    {
        id: '10',
        key: '10',
        name: () => '派单规则'
    },
    {
        id: '14',
        key: '14',
        name: () => 'IVR呼叫规则'
    },
    {
        id: '63',
        key: '63',
        name: () => '告警追单规则'
    },
    {
        id: '64',
        key: '64',
        name: () => '派单抑制规则'
    },
    {
        id: '65',
        key: '65',
        name: () => '告警对象规则'
    },
    {
        id: '67',
        key: '67',
        name: () => '告警延时清除规则'
    },
    {
        id: '69',
        key: '69',
        name: () => '客服通知单规则'
    },
    {
        id: '98',
        key: '98',
        name: () => '通知单'
    },
    {
        id: '104',
        key: '104',
        name: () => '计算中心前传规则'
    },
    {
        id: '105',
        key: '105',
        name: () => '告警延时计数规则'
    },
    {
        id: '106',
        key: '106',
        name: () => '告警自愈'
    },
    {
        id: '109',
        key: '109',
        name: () => '集客融合涉及的重大故障规则'
    }
];

const taskMap = [
    {
        id: 0,
        name: '活动告警触发'
    },
    {
        id: 1,
        name: '清除告警触发'
    },
    {
        id: 2,
        name: '手工确认触发'
    },
    {
        id: 3,
        name: '手工清除触发'
    }
];
const filterType = [
    { value: '1', label: '我的规则' },
    { value: '2', label: '其他人规则' }
];

const rulesMap = [
    { moduleId: 1, id: 1, name: '过滤器' },
    { moduleId: 2, id: 1, name: '级别重定义规则' },
    { moduleId: 3, id: 1, name: '类别重定义规则' },
    { moduleId: 4, id: 1, name: '短信前转规则' },
    { moduleId: 8, id: 1, name: '告警发声规则' },
    { moduleId: 10, id: 1, name: '自动派单规则' },
    { moduleId: 100, id: 1, name: '工单风暴规则' },
    { moduleId: 198, id: 1, name: '长时间无告警规则' },
    { moduleId: 21000, id: 1, name: 'IVR语音外呼规则' }
];

export default {
    numberOperator,
    windowTypeList,
    windowAttrBute,
    windowIfUse,
    filterModuleMap,
    taskMap,
    strOperator,
    filterType,
    rulesMap
};
