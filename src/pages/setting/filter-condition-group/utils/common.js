/**
 * @description: 服务端用来定位错误用的sessionId 不具有业务意义
 * @param {*} str
 * @return {*}
 */
export const getRequestSessionId = (str = '') => {
    return new Date().getTime().toString() + str;
};
