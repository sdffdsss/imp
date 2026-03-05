import proxy from '@Src/common/api';
import qs from 'qs';
import { _ } from 'oss-web-toolkits';

/**
 * @description: 获取除过滤器外所有规则
 */
const getRuleData = (userId) => {
    return new Promise((resolve, reject) => {
        proxy(
            `alarmmodel/filter/v1/rules?${qs.stringify(
                {
                    modelId: 2,
                    clientRequestInfo: JSON.stringify({
                        clientRequestId: 'nomean',
                        clientToken: 'string'
                    }),
                    creator: userId,
                    current: 1,
                    pageSize: 99999
                },
                { arrayFormat: 'indices', encode: true }
            )}`,
            {
                type: 'get',
                baseUrlType: 'filterUrl',
                showSuccessMessage: false,
                defaultErrorMessage: '获取数据失败'
            }
        ).then((res) => {
            const groupData = groupBy(res.data, function (item) {
                return item.moduleId;
            });
            resolve(groupData);
        });
    });
};

const groupBy = (array, f) => {
    const groups = {};
    array.forEach(function (o) {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push({
            value: o.filterId,
            label: o.filterName
        });
    });
    return groups;
    // return Object.keys(groups).map(function (group) {
    //     return groups[group];
    // });
};
export default getRuleData;
