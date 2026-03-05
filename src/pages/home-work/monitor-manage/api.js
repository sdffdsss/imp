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
                    clientToken: localStorage.getItem('access_token')
                })
            }
        })
            .then((res) => {
                if (res && res.data && res.data.length) {
                    const handleList = res.data || [];
                    // handleList.unshift({
                    //     key: 'all',
                    //     value: '全部',
                    // });
                    return handleList;
                }
                return [];
            })
            .catch((err) => {
                console.error(err);
                // return [{ key: '-1489894494',value: '广东'}];
                return [];
            })
    );
};
/**
 * @description: 获取省列表
 * @param {*}
 * @return {*}
 */
const getProvinceData = (userId) => {
    return new Promise((reslove) => {
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: userId
            }
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
    if (!provinceId) {
        return;
    }
    // eslint-disable-next-line consistent-return
    return new Promise((reslove) => {
        request('group/findProvinceRegions', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                parentRegionId: provinceId,
                creator: userId
            }
        }).then((res) => {
            if (res && Array.isArray(res)) {
                const handleList = res;
                // handleList.unshift({
                //     regionId: 'all',
                //     regionName: '全部',
                // });
                reslove(handleList);
            }
        });
    });
};
const getProvinceField = (provinceId, regionId, operateUser, groupId) => {
    return request('schedule/exchangeNowDutyPerson', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data: {
            provinceId,
            regionId,
            operateUser,
            groupId
        }
    });
};
export { getProvinceField };
export default {
    getDictEntry,
    getProvinceData,
    getProvinceRegions
};
