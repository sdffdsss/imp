import request from '@Src/common/api';

const baseUrlType = 'filter';

// 列设置保存
export const saveColumnConfig = (data) => {
    return request(`common/saveColumnConfig`, {
        type: 'post',
        baseUrlType,
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 列设置查询
export const queryColumnConfig = (data) => {
    return request(`common/queryColumnConfig`, {
        type: 'get',
        baseUrlType,
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    }).then((res) => {
        if (res?.code === '200' && Array.isArray(res?.dataObject)) {
            return res.dataObject;
        }
        return [];
    });
};
