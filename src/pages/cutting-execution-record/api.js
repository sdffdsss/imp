import request from '@Common/api';
// 查询
export const getTemporaryRoute = (data) => {
    return request(`shiftofdutyCuttingExecutionRecord`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 导出
export const exportTemporaryRoute = (params) => {
    return request(`shiftofdutyCuttingExecutionRecord/export`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data: params,
    });
};

// 新增
export const addTemporaryRoute = (data) => {
    return request(`shiftofdutyCuttingExecutionRecord`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 编辑
export const editTemporaryRoute = (data) => {
    return request(`shiftofdutyCuttingExecutionRecord`, {
        type: 'patch',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 删除
export const deleteTemporaryRoute = (data) => {
    return request(`shiftofdutyCuttingExecutionRecord`, {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 获取省份信息
export const getProvinceList = (data) => {
    return request('group/findProvinces', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: '获取省份数据失败',
        showSuccessMessage: false,
        data,
    });
};
