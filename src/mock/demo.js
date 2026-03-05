import Mock from 'mockjs';

export default Mock.mock(/demo/, 'get', {
    success: true,
    code: 200,
    // 属性 data 的值是一个数组
    'data|5': [
        {
            id: '@id',
            name: '@cname',
            'type|1-2': 2,
        },
    ],
});
