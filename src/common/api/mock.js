import { UrlConfig } from './config.ts';

const mockList = [
    // 关联规则
    {
        id: '20',
        type: 'rule',
        baseUrl: 'relationRule',
        list: [
            /\/relationRule\/rule\/viewRules\/\d/, // 规则列表
        ],
    },
];

const mock = {
    mockList,
    // mockUrl: 'http://10.10.2.233:9091/mock',
    mockUrl: `${UrlConfig.SCHEME}://${UrlConfig.DOMAIN_NAME}:${UrlConfig.PORT}/mock`,
};

export default mock;
