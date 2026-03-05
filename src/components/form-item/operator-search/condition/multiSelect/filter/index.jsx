import request from '@Src/common/api';
import qs from 'qs';
import { _ } from 'oss-web-toolkits';
import constants from '@Common/services/constants';
const alarmQueryFiltersDataCache = new Map();
/**
 * @description: 获取过滤器
 */
const getFilters = (userId, param) => {
    const defaultParam = {
        modelId: 2,
        moduleId: 1,
        clientRequestInfo: JSON.stringify({
            clientRequestId: 'nomean',
            clientToken: 'string',
        }),
        orderFieldName: 'filterName',
        order: 1,
        creator: userId,
        current: 1,
        pageSize: 99999,
    };
    const paramData = _.assignIn(defaultParam, param);
    if (constants.version === 'unicom') {
        return request(`interruptalarm/filter/v1/filters?${qs.stringify(paramData, { arrayFormat: 'indices', encode: true })}`, {
            type: 'get',
            baseUrlType: 'interruptalarmUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取过滤器数据失败',
        });
    } else {
        return request(`alarmmodel/filter/v1/filters?${qs.stringify(paramData, { arrayFormat: 'indices', encode: true })}`, {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取过滤器数据失败',
        });
    }
};

/**
 * @description: 更改过滤器类型
 */
const getFilterByType = async (userId, type) => {
    let filterType = {};
    switch (type) {
        case 'ALL':
            filterType = {};
            break;
        case 'MY':
            filterType = { needConditionList: 1 };
            break;
        case 'SHARE':
            filterType = { needConditionList: 2 };
            break;
        default:
            filterType = {};
            break;
    }
    let filterData = alarmQueryFiltersDataCache.get(type);
    if (!filterData) {
        filterData = await getFilters(userId, filterType);
        alarmQueryFiltersDataCache.set(type, filterData);
    }
    return filterData;
};
export default getFilterByType;
