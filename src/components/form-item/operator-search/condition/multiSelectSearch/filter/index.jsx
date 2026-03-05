import request from '@Src/common/api';
import qs from 'qs';
import { _ } from 'oss-web-toolkits';
/**
 * @description: 获取过滤器
 */
const getFilters = (userId, input, pageSize, pageNum, param) => {
    const defaultParam = {
        modelId: 2,
        moduleId: 1,
        clientRequestInfo: JSON.stringify({
            clientRequestId: 'nomean',
            clientToken: 'string'
        }),
        orderFieldName: 'filterName',
        order: 1,
        creator: userId,
        current: pageNum,
        pageSize,
        filterName: input
    };

    const paramData = _.assignIn(defaultParam, param);
    return request(`alarmmodel/filter/v1/filters?${qs.stringify(paramData, { arrayFormat: 'indices', encode: true })}`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取过滤器数据失败'
    });
};

/**
 * @description: 更改过滤器类型
 */
const getFilterByType = (userId, input, pageSize, pageNum, type) => {
    let filterType = {};
    //'myFilters','allFilters'
    switch (type) {
        case 'allFilters':
            filterType = {};
            break;
        case 'myFilters':
            filterType = { needConditionList: 1 };
            break;
        case 'SHARE':
            filterType = { needConditionList: 2 };
            break;
        default:
            filterType = {};
            break;
    }
    return getFilters(userId, input, pageSize, pageNum, filterType);
};
export default getFilterByType;
