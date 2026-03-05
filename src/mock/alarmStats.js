import Mock from 'mockjs';

export default Mock.mock(/alarmStats/, 'get', {
    success: true,
    code: 200,
    // 属性 data 的值是一个数组
    'data|80': [
        {
            'index|+1': 1,
            group: '@ename',
            'equipType|1-2': 1,
            'alarmLevel|1-4': 4,
            indID: '@natural(1000,2000)',
            name: '@cname',
            des: '@cname',
            'type|1-2': 2,
        },
    ],
});
