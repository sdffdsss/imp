import Mock from 'mockjs';

// 修复mockjs 拦截sessions发送的bug
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send;
Mock.XHR.prototype.send = function () {
    if (this.custom.xhr) {
        this.custom.xhr.withCredentials = this.withCredentials || false;
    }
    this.proxy_send(...arguments);
};

export * from './filters';
export * from './alarmModel';
export { default as columns } from './columns';
export { default as dataSource } from './dataSource';
export { default as alarmStats } from './alarmStats';
