import Mock from 'mockjs';

export default Mock.mock(/dataSource/, 'get', {
    success: true,
    code: 200,
    // 属性 data 的值是一个数组
    'data|4': [
        {
            'key|+1': 1,
            objectName: '@ename',
            'equipType|1-2': 1,
            'org_severity|1-4': 4,
            alarmTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
            clrTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
            solveDateRange: '@datetime("yyyy-MM-dd HH:mm:ss")',
            sendDate: '@datetime("yyyy-MM-dd HH:mm:ss")',
            custName: '@cname',
            'cellNum|+1': 300,
            'type|1-2': 2,
        },
    ],
});
