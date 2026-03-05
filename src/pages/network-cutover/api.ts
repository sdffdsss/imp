import request from '@Common/api';

// import qs from 'qs';

// 获取地市列表
export const getRegionList = (data) => {
    return request('group/findProvinceRegions', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

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

// 列表查询
export const postCutoverList = (data) => {
    return request('networkCutoverInfo/pageList', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 根据id查询记录详情
export const getCutoverDetail = (params) => {
    return request('networkCutoverInfo/queryDetail', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};

// 新增故障记录
export const postCutoverInsert = (data) => {
    return request('networkCutoverInfo/insert', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 更新割接记录通过ID
export const postCutoverUpdate = (data) => {
    return request('networkCutoverInfo/updateById', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 删除故障记录通过id
export const deleteCutover = (params) => {
    return request('networkCutoverInfo/deleteById', {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};

// 导出
export const exportFile = (data, dataProvince = '') => {
    request(`networkCutoverInfo/export${dataProvince ? `?dataProvince=${dataProvince}` : ''}`, {
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

// 模版下载
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

// 根据'割接光缆名称'查询所填光缆下所包含的传输段名称列表
export const findTransSegmentApi = (data) => {
    return request('networkCutoverInfo/findTransSegment', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getOpticalCableList = (params) => {
    return request('networkCutoverInfo/getOpticalCableList', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};

export const insert = (data) => {
    return request('networkCutoverInfo/insert', {
        type: 'POST',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        header: {
            'Content-Type': 'application/json',
        },
    });
};

export const updateById = (data) => {
    return request('networkCutoverInfo/updateById', {
        type: 'POST',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const exportTransSegment = (data) => {
    return request('networkCutoverInfo/exportTransSegment', {
        type: 'POST',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        responseType: 'blob',
    });
};
export const deleteById = (params) => {
    return request('networkCutoverInfo/deleteById', {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};
export const exportCutoverReport = (data) => {
    return request('networkCutoverInfo/exportCutoverReport', {
        type: 'POST',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        responseType: 'blob',
    });
};

export const selectAlarmView = (params) => {
    return request('networkCutoverInfo/selectAlarmView', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};
export const getViewColumns = () => {
    return request('networkCutoverInfo/getViewColumns', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
    });
};
export const newAlarmView = (data) => {
    return request('networkCutoverInfo/newAlarmView', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const updateAlarmView = (data) => {
    return request('networkCutoverInfo/updateAlarmView', {
        type: 'put',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const deleteAlarmView = (params) => {
    return request('networkCutoverInfo/deleteAlarmView', {
        type: 'delete',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};
export const recordNewPage = (data) => {
    return request('sysadminAlarm/record-new-page', {
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        data,
        baseUrlType: 'filter',
    });
};

export const findGroupByCenter = (params) => {
    return request('networkCutoverInfo/findGroupByCenter', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};
