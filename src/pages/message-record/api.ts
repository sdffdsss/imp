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
        return request('filterRuleShortNote/pageQuery', {
            type: 'post',
            baseUrlType: 'noticeUrl',
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
        return request('filterRuleShortNote/exportFile', {
            type: 'post',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '导出呼叫记录',
            data,
            responseType: 'blob',
        });
    };

    getExportAllFileApi = (data) => {
        return request('filterRuleShortNote/exportAllFile', {
            type: 'post',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            data,
        });
    };

    getExportProgressApi = (data) => {
        return request('filterRuleShortNote/exportProgress', {
            type: 'get',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            params: data,
        });
    };
    onExport = (data) => {
        return request('filterRuleShortNote/export', {
            type: 'get',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            responseType: 'blob',
            data,
        });
    };
    getAllZones = () => {
        return request('api/zones', {
            type: 'get',
            baseUrlType: 'userInfolUrl',
            showErrorMessage: true,
            showSuccessMessage: false,
        });
    };
    getZones = (data) => {
        if (!data) {
            return null;
        }
        return request('/api/zones', {
            type: 'get',
            baseUrlType: 'userInfolUrl',
            showSuccessMessage: false,
            showErrorMessage: true,
            data,
        });
    };
}
export const Api = new ServiceApi();
