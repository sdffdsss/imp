import request from '@Common/api';

// 获取消息回传信息
export const getSheetReturnDetail = (data) => {
    return request(`fault/work/sheet/v1/getSheetReturnDetail`, {
        type: 'get',
        baseUrlType: 'failureSheetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 获取消息回传信息
export const downloadByEmos = (data) => {
    return request(`fault/work/sheet/v1/downloadByEmos`, {
        type: 'get',
        baseUrlType: 'failureSheetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 下载附件
export const downloadByEmosAnnex = (data) => {
    return request(`fault/work/sheet/v1/downloadByEmosAnnex`, {
        type: 'get',
        baseUrlType: 'failureSheetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        responseType: 'blob',
    });
};
