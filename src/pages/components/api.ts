import request from '@Common/api';
// import qs from 'qs';

// 上传文件
export const fileUpload = (data) => {
    return request('networkCutoverInfo/uploadFile', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 下载文件
export const fileDown = (params) => {
    return request('networkCutoverInfo/downloadFile', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        params,
    });
};

// 导入数据
export const importData = (data, dataProvince) => {
    // 网络割接管理增加数据省份
    const url = dataProvince ? `networkCutoverInfo/importData?dataProvince=${dataProvince}` : 'networkCutoverInfo/importData';
    return request(url, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
