import request from '@Src/common/api';

const getDictEntry = (dictName, userId) => {
    return Promise.resolve(
        request('alarmmodel/field/v1/dict/entry', {
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
        })
            .then((res) => {
                if (res && res.data && res.data.length) {
                    const handleList = res.data;
                    return handleList;
                }
                return [];
            })
            .catch(() => {
                return [];
            }),
    );
};
/**
 * @description: 获取省列表
 * @param {*}
 * @return {*}
 */
const getProvinceData = (userId, provinceId) => {
    return new Promise((reslove) => {
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: userId,
                provinceId,
            },
        }).then((res) => {
            reslove(res);
        });
    });
};

/**
 * @description: 获取地市列表
 * @param {*}
 * @return {*}
 */
const getProvinceRegions = (provinceId, userId) => {
    return new Promise((reslove) => {
        request('group/findProvinceRegions', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                parentRegionId: provinceId,
                creator: userId,
            },
        }).then((res) => {
            if (res && Array.isArray(res)) {
                const handleList = res;
                reslove(handleList);
            }
        });
    });
};

// 获取工单状态数据
const getSheetStatusInfo = (data) => {
    return new Promise((reslove) => {
        request('group/findSheetStatus', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取工单状态数据失败，请检查服务filterUrl',
            data: { creator: data },
        }).then((res) => {
            reslove(res);
        });
    });
};
const getExportProgressApi = (data) => {
    return request('work/sheet/v1/exportProgress', {
        type: 'get',
        baseUrlType: 'failureSheetExportUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取工单状态数据失败，请检查服务filterUrl',
        data,
    });
};
export default {
    getDictEntry,
    getProvinceData,
    getProvinceRegions,
    getSheetStatusInfo,
    getExportProgressApi,
};
