import { CacheLoader } from 'oss-web-toolkits';
import proxy from '../api/api-map';
import constants from '../constants';

const dataServiceCacheLoader = new CacheLoader();

/**
 * @description: 配置文件读取
 * @param {*} name 配置文件名称关键字，获取对应配置文件路径
 * @param {*} expire 是否缓存，默认否false，数字毫秒 缓存的时间，-1 永久缓存
 * @param {*} defaultConfigs 默认配置
 * @return {*} 配置文件内容
 */
const configService = (name, isPath = false, expire = false, defaultConfigs = {}) => {
    if (!name) {
        throw new Error('parameters must have name!');
    }
    const { executeParam } =
        {
            executeParam: {
                fullUrl: isPath ? name : `${constants.STATIC_PATH}/map/province/${name}.json`,
                description: '中国地图组件相关配置',
            },
        } || defaultConfigs;
    const getData = proxy.loadJSON({
        fullUrl: executeParam.fullUrl,
        type: 'get',
    });

    if (expire) {
        return dataServiceCacheLoader.get(name, () => getData, expire);
    }
    return getData;
};

export default configService;

const RESULT_CACHE = {};
export const getMapConfigApi = () => {
    const getData = RESULT_CACHE['map-config']
        ? Promise.resolve(RESULT_CACHE['map-config'])
        : proxy
              .loadJSON({
                  fullUrl: `${constants.STATIC_PATH}/map/map-config.json`,
                  type: 'get',
              })
              .then((res) => {
                  if (!RESULT_CACHE['map-config']) {
                      RESULT_CACHE['map-config'] = res;
                  }
                  return RESULT_CACHE['map-config'];
              });
    return dataServiceCacheLoader.get('MAP_CONFIG', () => getData, -1);
};

export const loadMapJSON = (jsonUrl) => {
    return proxy.loadJSON({
        fullUrl: `${constants.STATIC_PATH}/${jsonUrl}`,
        type: 'get',
    });
};
