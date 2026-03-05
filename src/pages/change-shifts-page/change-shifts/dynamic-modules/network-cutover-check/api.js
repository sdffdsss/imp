import request from '@Src/common/api';

// 获取专业枚举
export const postMajorEnum = (data) => {
    return request('dict/getDictByFieldNames', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * 网络割接（自查）-数据获取
 * @param {*} data
 * @returns
 */
export const postCutoverList = (data) => {
    return request('networkCutoverInfo/getDutyDataWithPage', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 网络割接（自查）-根据id查询记录详情
export const getCutoverDetail = (params) => {
    return request('networkCutoverInfo/queryDetail', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};

// 网络割接（自查）-新增
export const postCutoverInsert = (data) => {
    return request('networkCutoverInfo/insert', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 网络割接（自查）-修改
export const postCutoverUpdate = (data) => {
    return request('networkCutoverInfo/updateById', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 网络割接（自查）-删除
export const deleteCutover = (params) => {
    return request('networkCutoverInfo/deleteById', {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};

// 网络割接（自查）-导出
export const exportFile = (data) => {
    request('networkCutoverInfo/export', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        responseType: 'blob',
        data,
    }).then((res) => {
        const contentDisposition = res.headers['content-disposition'];
        const fileName = decodeURIComponent(contentDisposition.substring(contentDisposition.indexOf('=') + 1)).substring(7);
        // type 为需要导出的文件类型，此处为xls表格类型
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        // 兼容不同浏览器的URL对象
        const url = window.URL || window.webkitURL;
        // 创建下载链接
        const downloadHref = url.createObjectURL(blob);
        // 创建a标签并为其添加属性
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadHref;
        downloadLink.download = fileName;
        // 触发点击事件执行下载
        downloadLink.click();
    });
};

// 网络割接（自查）-模版下载
export const downFile = (params) => {
    request('networkCutoverInfo/downloadImportFile', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '下载失败，请检查服务',
        responseType: 'blob',
        params,
    }).then((res) => {
        const contentDisposition = res.headers['content-disposition'];
        const fileName = decodeURIComponent(contentDisposition.substring(contentDisposition.indexOf('=') + 1)).substring(7);
        // type 为需要导出的文件类型，此处为xls表格类型
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        // 兼容不同浏览器的URL对象
        const url = window.URL || window.webkitURL;
        // 创建下载链接
        const downloadHref = url.createObjectURL(blob);
        // 创建a标签并为其添加属性
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadHref;
        downloadLink.download = fileName;
        // 触发点击事件执行下载
        downloadLink.click();
    });
};
