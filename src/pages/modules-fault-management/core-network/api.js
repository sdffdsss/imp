import request from '@Common/api';
// 查询
export const getTemporaryRoute = (data) => {
    return request(`networkFault/faultCore`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 导出
export const exportTemporaryRoute = (params) => {
    return request(`networkFault/exportCore`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data: params,
    });
};

// 新增
export const addTemporaryRoute = (data) => {
    return request(`networkFault/addCore`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 编辑
export const editTemporaryRoute = (data) => {
    return request(`networkFault/updateCore`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 删除
export const deleteTemporaryRoute = (data) => {
    return request(`networkFault/delFault?id=${data.id}&deletedBy=${data.deletedBy}`, {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
    });
};
//获取省份信息
export const getProvinceList = (data) => {
    return request('group/findProvinces', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: '获取省份数据失败',
        showSuccessMessage: false,
        data,
    });
};

//获取枚举值
export const getSelectList = (params) => {
    return request(`networkFault/dict`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: params,
    });
};
