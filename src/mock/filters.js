import Mock from 'mockjs';

const process = {
    MOCK_PASSWORD: '@string',
};

export const filters = Mock.mock(/sysadminFilter\/basic-filters/, 'post', {
    success: true,
    code: 200,
    // 属性 data 的值是一个数组
    // "data|5": [
    //     {
    //         id: "@id",
    //         name: "@cname",
    //         "type|1-2": 2,
    //     },
    // ],
    'data|1-10': [
        {
            createTime: '@datetime()',
            description: `@csentence(10,30)`,
            'filterModule|+1': 1,
            'id|+1': 10000,
            'isPrivate|1': true,
            'isValid|1': true,
            latestTime: '@datetime()',
            name: '@csentence(5, 10)',
            owner: {
                'groupId|+1': 0,
                'id|+1': 1,
                'isSupper|1': false,
                'locked|1': false,
                'mobilePhone|+1': 13412345349,
                password: process.MOCK_PASSWORD,
                userName: '@string',
            },
            'professionalType|1': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            updateTime: '@datetime()',
            updateUser: {
                'groupId|+1': 0,
                'id|+1': 1,
                'isSupper|1': false,
                'locked|1': false,
                'mobilePhone|+1': 13412345349,
                password: process.MOCK_PASSWORD,
                userName: '@string',
                __address: '@natural',
            },
            usedTime: '@datetime()',
            'conditions|1-5': [
                {
                    'filterId|+1': 110000,
                    'id|+1': 11000,
                    'isNegative|1': false,
                    name: '@csentence(5, 10)',
                    '__address|+1': 63000,
                    'items|1-5': [
                        {
                            'conditionId|+1': 112943,
                            intValue: 0,
                            'isNegative|1': false,
                            type: {
                                displayName: '@csentence(3, 7)',
                                'id|+1': 12,
                                name: 'org_type',
                                supportModules: ',0,1,2,3,4,5,6,7,8,9,10,11,22,55,56,',
                                supportVendors: '',
                                targetField: 'org_type',
                                'valueRegion|1-19': [
                                    {
                                        'id|+1': 3,
                                        txt: '@csentence(5,10)',
                                    },
                                ],
                            },
                            valueString: '5',
                            '__address|+1': 63000,
                        },
                    ],
                },
            ],
        },
    ],
});

export const conditions = Mock.mock(/sysadminFilter\/item-types/, 'get', {
    success: true,
    code: 200,
    'data|5-100': [
        {
            'isNegative|1': false,
            type: {
                displayName: '@csentence(2,10)',
                'id|+1': 1,
                name: 'alarm_title',
                supportModules: '@range(10)',
                targetField: '@string',
                'valueRegion|1-19': [
                    {
                        'id|+1': 3,
                        txt: '@csentence(5,10)',
                    },
                ],
                'valueType|1': [
                    'CommaIntegerWithRange',
                    'CommaText',
                    'CommaInteger',
                    'RegExp',
                    'IntegerText',
                    'TimeH2M',
                    'TimeY2S',
                    'Integer',
                    'ExtendStorage',
                ],
            },
            'valueTypeId|1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
    ],
});

export const filterInfo = Mock.mock(/sysadminFilter\/filter-detail-name/, 'post', {
    success: true,
    code: 200,
    data: [
        {
            createTime: '@datetime()',
            description: `@csentence(10,30)`,
            'id|': 10001,
            'isPrivate|1': true,
            'isValid|1': true,
            latestTime: '@datetime()',
            name: '@csentence(5, 10)',
            owner: {
                'groupId|+1': 0,
                'id|+1': 1,
                'isSupper|1': false,
                'locked|1': false,
                'mobilePhone|+1': 13412345349,
                password: process.MOCK_PASSWORD,
                userName: '@string',
            },
            'professionalType|1': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            updateTime: '@datetime()',
            updateUser: {
                'groupId|+1': 0,
                'id|+1': 1,
                'isSupper|1': false,
                'locked|1': false,
                'mobilePhone|+1': 13412345349,
                password: process.MOCK_PASSWORD,
                userName: '@string',
                __address: '@natural',
            },
            usedTime: '@datetime()',
            'conditions|1-5': [
                {
                    'filterId|+1': 110000,
                    'id|+1': 11000,
                    'isNegative|1': false,
                    name: '@csentence(5, 10)',
                    'items|1-5': [
                        {
                            'conditionId|+1': 112943,
                            'isNegative|1': false,
                            type: {
                                name: 'alarm_title',
                                displayName: '@csentence(5, 10)',
                                'id|+1': 12,
                                targetField() {
                                    return this.name;
                                },
                                'textValueType|1': ['NULL', 'NOTNULL', 'REGEXP'],
                                'valueType|1': [
                                    'CommaIntegerWithRange',
                                    'CommaText',
                                    'CommaInteger',
                                    'RegExp',
                                    'IntegerText',
                                    'TimeH2M',
                                    'TimeY2S',
                                    'Integer',
                                    'ExtendStorage',
                                ],
                            },
                            valueString() {
                                // 函数的上下文为属性 'name' 所在的对象。
                                if (this.type.valueType === 'CommaIntegerWithRange') {
                                    return ['between', 12, 23];
                                }
                                if (this.type.valueType === 'CommaText') {
                                    return [];
                                }
                                if (this.type.valueType === 'CommaInteger') {
                                    return ['12', '13'];
                                }
                                if (this.type.valueType === 'RegExp') {
                                    return [];
                                }
                                if (this.type.valueType === 'TimeH2M') {
                                    return ['13:00', '14:00'];
                                }
                            },
                            valueStringList() {
                                // 函数的上下文为属性 'name' 所在的对象。
                                if (this.type.valueType === 'CommaIntegerWithRange') {
                                    return ['between', 12, 23];
                                }
                                if (this.type.valueType === 'CommaText') {
                                    return [];
                                }
                                if (this.type.valueType === 'CommaInteger') {
                                    return ['随机条件名1', '随机条件名2'];
                                }
                                if (this.type.valueType === 'RegExp') {
                                    return [];
                                }
                                if (this.type.valueType === 'TimeH2M') {
                                    return ['13:00', '14:00'];
                                }
                            },
                        },
                    ],
                },
            ],
        },
    ],
});

export const vendorList = Mock.mock(/vendor\/list/, 'get', {
    success: true,
    code: 200,
    'data|5-500': [
        {
            'id|+1': 1,
            txt: '@cword(3,10)',
        },
    ],
});

export const alarmTitleList = Mock.mock(/alarmTitle\/list/, 'get', {
    success: true,
    code: 200,
    'data|5-300': [
        {
            'id|+1': 1,
            name: '告警标题',
        },
    ],
});
