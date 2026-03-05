import request from '@Common/api';
class ServiceApi {
    /**
     * @description: 获取省列表
     * @param {*}
     * @return {*}
     */
    getProvinceData = (userId) => {
        return request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: userId,
            },
        });
    };
    /**
     * @description: 获取地市列表
     * @param {*}
     * @return {*}
     */
    getProvinceRegions = (provinceId, userId) => {
        return request('group/findProvinceRegions', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                parentRegionId: provinceId,
                creator: userId,
            },
        });
    };
    getDictEntry(dictName, userId) {
        return request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                pageSize: 2500,
                dictName,
                en: false,
                modelId: 2,
                creator: userId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        });
    }
    /**
     * @description: 获取呼叫记录接口
     * @param {*}
     * @return {*}
     */
    getIvrRecord = (data) => {
        return request('alarmmodel/filter/v1/getIvrRecord', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取呼叫记录',
            data,
        });
    };
    /**
     * @description: 导出呼叫记录接口
     * @param {*}
     * @return {*}
     */
    exportIvrRecord = (data) => {
        return request('alarmmodel/filter/v1/exportIvrRecord', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '导出呼叫记录',
            data,
            responseType: 'blob',
        });
    };
}
export const Api = new ServiceApi();
