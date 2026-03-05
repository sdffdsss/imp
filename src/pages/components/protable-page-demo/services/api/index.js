import request from '@Common/api';
import { blobDownLoad } from '@Common/utils/download';

import { getConverter } from '../converters';

// 获取
export const getDataSourceApi = (data) => {
    return request('', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    }).then((response) => {
        if (response.code === 200) {
            return getConverter('a')(response.data);
        }
        return Promise.reject(response);
    });
};

// 新增
export const addItemApi = (data) => {
    return request('', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    }).then((response) => {
        if (response.code === 200) {
            return response.data;
        }
        return Promise.reject(response);
    });
};

// 更新
export const updateItemApi = (data) => {
    return request('', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    }).then((response) => {
        if (response.code === 200) {
            return response.data;
        }
        return Promise.reject(response);
    });
};

// 删除
export const deleteItemApi = (data) => {
    return request('', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 导出
export const exportFileApi = (data) => {
    request('', {
        type: 'post',
        baseUrlType: '',
        showSuccessMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        responseType: 'blob',
        data,
    }).then((res) => {
        const contentDisposition = res.headers['content-disposition'];
        const fileName = decodeURIComponent(contentDisposition.substring(contentDisposition.indexOf('=') + 1)).substring(7);

        blobDownLoad(res, fileName, 'application/vnd.ms-excel');
    });
};
