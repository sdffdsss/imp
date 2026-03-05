import request from '@Src/common/api';
import qs from 'qs';
import constants from '@Common/services/constants';
import { _ } from 'oss-web-toolkits';

const alarmQueryFiltersSearchDataCache = new Map();
/**
 * @description: 获取过滤器
 */
const getFilters = (userId, input, pageSize, pageNum, param) => {
    const defaultParam = {
        modelId: 2,
        moduleId: 1,
        clientRequestInfo: JSON.stringify({
            clientRequestId: 'nomean',
            clientToken: 'string',
        }),
        orderFieldName: 'filterName',
        order: 1,
        // creator: userId,
        creator: 867435,
        current: pageNum,
        pageSize,
        filterName: input,
    };
    const paramData = _.assignIn(defaultParam, param);
    if (constants.version === 'unicom') {
        return request(`interruptalarm/filter/v1/filters?${qs.stringify(paramData, { arrayFormat: 'indices', encode: true })}`, {
            type: 'get',
            baseUrlType: 'interruptalarmUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取过滤器数据失败',
        });
    }
    return request(`alarmmodel/filter/v1/filters?${qs.stringify(paramData, { arrayFormat: 'indices', encode: true })}`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取过滤器数据失败',
    });
};

/**
 * @description: 更改过滤器类型
 */
const getFilterByType = async (userId, input, pageSize, pageNum, type) => {
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
    const cacheKey = `${userId}_${input}_${pageSize}_${pageNum}_${filterType}`;
    let filterData = alarmQueryFiltersSearchDataCache.get(cacheKey);
    if (!filterData) {
        filterData = await getFilters(userId, input, pageSize, pageNum, filterType);
        alarmQueryFiltersSearchDataCache.set(cacheKey, filterData);
    }
    return filterData;
};
export default getFilterByType;
