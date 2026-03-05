import request from '@Common/api';
// 查询
export const getTemporaryRoute = (data) => {
    return request(`shiftofdutyRouteAdjustRecord`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 新增
export const addTemporaryRoute = (data) => {
    return request(`shiftofdutyRouteAdjustRecord`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 编辑
export const editTemporaryRoute = (data) => {
    return request(`shiftofdutyRouteAdjustRecord`, {
        type: 'patch',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 删除
export const deleteTemporaryRoute = (data) => {
    return request(`shiftofdutyRouteAdjustRecord`, {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 导出
export const exportTemporaryRoute = (data) => {
    return request(`shiftofdutyRouteAdjustRecord/export`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取省份信息
 * @param {*}
 * @return {*}
 */
export const getProvinceList = (data) => {
    return request('group/findProvinces', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: '获取省份数据失败',
        showSuccessMessage: false,
        data,
    });
};
