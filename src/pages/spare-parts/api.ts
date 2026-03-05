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
    /**
     * @description: 获取物资型号接口
     * @param {*}
     * @return {*}
     */
    getSparePartsModel = (userId) => {
        return request('spareParts/getModel', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取物资型号失败',
            data: {
                operateUser: userId,
            },
        });
    };
    /**
     * @description: 获取物资列表接口
     * @param {*}
     * @return {*}
     */
    getSparePartsList = (data) => {
        return request('spareParts/getList', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取物资列表失败',
            data,
        });
    };
}
export const Api = new ServiceApi();
