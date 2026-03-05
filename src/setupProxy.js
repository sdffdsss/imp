const { createProxyMiddleware } = require('http-proxy-middleware');

const targetConfig = {
    serviceDiscovery: {
        SCHEME: 'http',
        DOMAIN_NAME: '10.10.2.61', //NOSONAR
        PORT: '8888',
    },
    alarmStat: {
        SCHEME: 'http',
        DOMAIN_NAME: '10.10.1.70', //NOSONAR
        PORT: '8083',
    },
};

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/serviceDiscovery', {
            target: `${targetConfig.serviceDiscovery.SCHEME}://${targetConfig.serviceDiscovery.DOMAIN_NAME}:${targetConfig.serviceDiscovery.PORT}`,
            secure: false,
            changeOrigin: true,
            pathRewrite: {
                '^/serviceDiscovery': '/',
            },
        }),
        createProxyMiddleware('/alarmstat-query', {
            target: `${targetConfig.alarmStat.SCHEME}://${targetConfig.alarmStat.DOMAIN_NAME}:${targetConfig.alarmStat.PORT}`,
            secure: false,
            changeOrigin: true,
            pathRewrite: {
                '/alarmstat-query': '/alarmstat-query',
            },
        }),
    );
};
