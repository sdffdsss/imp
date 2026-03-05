import request from '@Common/api';
// 查询
export const getTemporaryRoute = (data) => {
    return request(`networkOperationRecord/queryRecordByPage`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 新增
export const addTemporaryRoute = (data) => {
    return request(`networkOperationRecord/addOperationRecord`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 编辑
export const editTemporaryRoute = (data) => {
    return request(`networkOperationRecord/updateOperationRecordById`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 删除
export const deleteTemporaryRoute = (data) => {
    return request(`networkOperationRecord/deleteOperationRecordById`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 导出
export const exportTemporaryRoute = (data) => {
    return request(`networkOperationRecord/export`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        params: data,
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

//获取专业列表数据
export const getDictEntry = () => {
    return Promise.resolve(
        request('networkHazardRecord/getProfessionalType', {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
        })
            .then((res) => {
                if (res && res.data && res.data.professionalType.length) {
                    return res.data.professionalType;
                }
                return [];
            })
            .catch(() => {
                return [];
            }),
    );
};
