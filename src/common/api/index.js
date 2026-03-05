import { createWebRequest } from 'oss-web-common';
import configs from './config';
import { _, logger } from 'oss-web-toolkits';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { log } from '@Common/api/service/log';
import { decrypt } from '@Common/utils/res';
import { decrypts } from '@Common/utils/rsa';
import { message } from 'oss-ui';

const camelCase = (data) => {
    let updateData = [];
    if (Array.isArray(data)) {
        updateData = data.map((item) => {
            const updateItem = {};
            // eslint-disable-next-line no-restricted-syntax
            for (const key of Object.keys(item)) {
                updateItem[_.camelCase(key)] = item[key];
            }
            return updateItem;
        });
    }
    return updateData;
};
const responseTransforms = [
    (response) => {
        if (!response.ok) {
            if (response.status === 401) {
                const isMatchAnonyUrl = configs.anonymousUrls.reduce((result, current) => {
                    if (!result) {
                        const reg = new RegExp(current, 'g');
                        return reg.test(window.location.pathname);
                    }
                    return result;
                }, false);
                if (!isMatchAnonyUrl) {
                    // 这里要回到登录页 与 框架交互
                    // window.history.replace('/login');
                }
            } else if (response.status === 500 && response.data?.code === '-2') {
                // 对服务返回500 并code码是-2 的进行错误过滤
                // eslint-disable-next-line no-console
                console.log(response.data);
            } else if (response.problem === 'TIMEOUT_ERROR' || response.problem === 'NETWORK_ERROR') {
                message.error('网络故障，请稍后重试或联系系统管理员');
                return response;
            } else {
                logger.default.error(response);
            }
        }
        if (response.ok && response.headers?.secretkey) {
            const rsaData = decrypts(response.headers?.secretkey);
            const data = decrypt(response.data, rsaData);
            if (data) {
                response.data = JSON.parse(data);
            }

            console.log(response);
        }
        return response;
    },
    (response) => {
        if (response.ok && response.data && /.*\/sqlm.*?apply\/execute$/.test(response.config && response.config.url)) {
            // sql下沉且包含数据
            const { data } = response.data && response.data.data;
            if (Array.isArray(data)) {
                response.data.data.data = camelCase(data);
            }
        }
        if (response.problem === 'TIMEOUT_ERROR') {
            message.error('加载数据失败，请稍后重试');
        }
        if (response.ok && response.data && /.*\/sqlm.*?apply\/executeIdList$/.test(response.config && response.config.url)) {
            // sql下沉且包含数据
            const { data } = response.data;
            if (_.isString(data) && data) {
                const dataMap = JSON.parse(data);
                // console.log(dataMap);
                Object.keys(dataMap).forEach((item) => {
                    dataMap[item].data.data = camelCase(dataMap[item].data.data);
                });

                response.data.data = dataMap;
            }
        }

        return response;
    },
    (response) => {
        if (response.ok && response.config?.handlers?.params?.description) {
            let logData = response.config?.handlers?.params?.description;
            let apiLog = _.omit(logData, ['operName']);
            let paramsData = response.config.data ? JSON.parse(response.config.data) : {};
            let operationContent = {
                description: logData.operName,
                api: response.config.url,
                params: { ...paramsData },
            };
            let data = {
                ...apiLog,
                operationContent: JSON.stringify(operationContent),
            };
            log(data);
        }
    },
    // 导出文件流处理
    (response) => {
        if (response.ok && response.config?.responseType === 'blob') {
            response.data.headers = response.headers;
            return response;
        }
    },
];
const requestTransforms = [];
const { environment: env, environmentLoaded: envLoaded } = useEnvironmentModel.data;
const { timeout = 20000, defaultToken } = env;
// requestTransforms.push((res) => {
//     try {
//         const { url, baseUrlType = '' } = res;
//         if (envLoaded && env && baseUrlType) {
//             const {
//                 [baseUrlType]: { mode = '', direct: realurl = '', discover = '' },
//                 serviceDiscovery,
//             } = env;

//             let urlObj = {};
//             if (RegGroup.url.test(url)) {
//                 urlObj = new URL(url);
//             } else {
//                 urlObj = new URL(window.location.origin + url);
//             }
//             let { pathname, search = '' } = urlObj;
//             if (mode === 'direct') {
//                 if (realurl !== '') {
//                     res.url = `${realurl}${pathname}${search}`;
//                 }
//             } else {
//                 res.url = `${serviceDiscovery}/${discover}${pathname}${search}`;
//             }
//         }
//         return res;
//     } catch (e) {
//         return Promise.reject(e);
//     }
// });
requestTransforms.push((res) => {
    // console.log(res);
    // console.log(useLoginInfoModel.data);
    try {
        const { url, baseUrlType = '' } = res;
        if (envLoaded && env && baseUrlType) {
            const {
                [baseUrlType]: { mode = '', direct: realurl = '', discover = '' },
                serviceDiscovery,
            } = env;
            if (mode === 'direct') {
                res.url = `${realurl}${url}`;
            } else if (mode === 'discover') {
                res.url = `${serviceDiscovery}/${discover}${url}`;
            }
        }
        let userInfo = JSON.parse(useLoginInfoModel?.data?.userInfo) || {};
        const { systemInfo } = useLoginInfoModel.data;
        // console.log(systemInfo, localStorage.getItem('access_token'));
        res.headers = {
            ...res.headers,
            zoneId: systemInfo?.currentZone?.zoneId || userInfo?.zones?.[0]?.zoneId,
            operId: localStorage.getItem('operId'),
            Authorization: `Bearer ${localStorage.getItem('access_token') || defaultToken}`,
            publicKey:
                'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDc7i0VItfwG/8PRZ8/AEe55QFGJMs8Zt9vNZ1VRP3Wr1NbvkhrihX6MerUOR+EbKu8hb91ue0YrLR+Lb3TBy2Ihyddwx2jCoZ2Cx67nRVaBQmWdwsOMhRviRVbOyflGdZ2oolw3b9kefK/UvuAAdLpPZzrl4FZWfm7FJrBLHyQQwIDAQAB',
            appToken:
                'Ivf5n6o8CBu7CNpT45Gz+oWj9mcALzDJIWKqjkjMoMUk2RJi3KVeWITjwQ9jy55omysCxizJUnTKzwO1JheEPTA+CsyV+EcWMOmZNobMydaYTj1CUEVCSA0W0FvvnParUUTXRYbc2PzAbIiFTEhAra+hy0C4k0V7L9EV1ud9q/o=',
        };
        if (userInfo?.zones?.[0]?.zoneLevel === '3') {
            res.headers.zoneId = userInfo?.zones?.[0]?.parentZoneId;
        }
        return res;
    } catch (e) {
        return Promise.reject(e);
    }
});

requestTransforms.push((res) => {
    try {
        let { url } = res;
        // Match /znjk/ followed by any segment
        const prefixRegex = /^\/znjk\/[^/]+\//;
        const defaultPrefix = '/znjk/canary/';

        // Get prefix from current location or fallback to default
        const currentMatch = window.location.pathname.match(prefixRegex);
        const targetPrefix = currentMatch ? currentMatch[0] : defaultPrefix;

        const isFullUrl = /^https?:\/\//.test(url);

        if (isFullUrl) {
            const urlObj = new URL(url);
            const isSameHost = urlObj.hostname === window.location.hostname && urlObj.port === window.location.port;

            if (isSameHost && !prefixRegex.test(urlObj.pathname)) {
                res.url = `${urlObj.origin}${targetPrefix}${urlObj.pathname.replace(/^\//, '')}${urlObj.search}`;
            }
        } else {
            res.url = `${window.location.origin}${targetPrefix}${url.replace(/^\//, '')}`;
        }
        return res;
    } catch (e) {
        return Promise.reject(e);
    }
});

const config = {
    timeout,
    contentType: 'application/json',
    withCredentials: false,
    responseTransforms,
    requestTransforms,
    baseUrl: '',
};
export default createWebRequest(config);
