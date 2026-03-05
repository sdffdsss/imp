import Mock from 'mockjs';

export const modelList = Mock.mock(/alarmmodel\/model\/v1\/alarmModels/, 'get', {
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
    'data|5-30': [
        {
            className: '@string',
            createTime: '@datetime()',
            createUser: '@string',
            messageType: '@string',
            modeFieldList: '@string',
            modelDesc: '@csentence(5, 10)',
            'modelId|+1': 1, // 自增
            modelLabel: '@string',
            modelName: '@string',
            modelParseClass: '@string',
            modifier: '@string',
            modifyTime: '@datetime()',
            packageName: '@string',
            protocol: 'proto',
            'status|1': [1, 2], // 枚举值选一个
            releaseUser: '@string',
            releaseInfo: {
                'modelStatus|1': [1, 2], // 枚举值选一个
                releaseTime: '@datetime()',
                releaseUser: '@string',
            },
        },
    ],
});

export const delModel = Mock.mock(/alarmmodel\/model\/v1\/alarmModel/, 'delete', {
    success: true,
    code: 200,
    data: true,
});
